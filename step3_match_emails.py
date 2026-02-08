"""
Step 3: Match Emails to Organizational Goals (one-by-one, streaming)

Streams emails from sorted folders one at a time, classifies each against
the goal hierarchy via LLM, and collects results into goals.json.
"""

import json
import os
import glob
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
FOLDER_START = int(os.getenv("FOLDER_START", "100"))
FOLDER_END = int(os.getenv("FOLDER_END", "1283"))
MAX_EMAILS = int(os.getenv("MAX_EMAILS", "10000"))
MODEL = "openai/gpt-4o-mini"
GOALS_INPUT_PATH = "goals_input.json"
OUTPUT_PATH = os.path.join("decision-ui", "src", "data", "goals.json")
CHECKPOINT_PATH = "match_checkpoint.json"
MAX_RETRIES = 3
RETRY_DELAYS = [5, 10, 20]
WORKERS = 10
CHECKPOINT_EVERY = 50

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# ── Load goals ───────────────────────────────────────────────────────

def load_goals():
    with open(GOALS_INPUT_PATH, "r") as f:
        goals = json.load(f)["goals"]
    print(f"  Loaded {len(goals)} goals")
    return goals


def build_goal_tree_prompt(goals):
    children_map = {}
    roots = []
    for g in goals:
        if g["parent_id"]:
            children_map.setdefault(g["parent_id"], []).append(g)
        else:
            roots.append(g)

    lines = []
    def render(goal, depth=0):
        indent = "  " * depth
        kpi_str = ""
        if goal.get("kpis"):
            kpi_str = f" | KPIs: {', '.join(goal['kpis'])}"
        leaf_tag = "" if goal["id"] in children_map else " [LEAF]"
        lines.append(f"{indent}- {goal['id']}: {goal['summary']} [{goal['category']}]{kpi_str}{leaf_tag}")
        for child in children_map.get(goal["id"], []):
            render(child, depth + 1)

    for root in roots:
        render(root)
    return "\n".join(lines)


# ── Stream emails from folders ───────────────────────────────────────

def email_iterator():
    """Yield emails one at a time from sorted folders. No bulk load."""
    count = 0
    for folder_num in range(FOLDER_START, FOLDER_END):
        folder_path = os.path.join("sorted_emails", f"{folder_num:05d}")
        if not os.path.isdir(folder_path):
            continue
        for filepath in sorted(glob.glob(os.path.join(folder_path, "*.json"))):
            if count >= MAX_EMAILS:
                return
            with open(filepath, "r") as f:
                yield json.load(f)
            count += 1


# ── Classify one email ───────────────────────────────────────────────

SYSTEM_PROMPT_TEMPLATE = """You classify corporate emails against an organizational goal hierarchy.

GOAL HIERARCHY:
{goal_tree}

RULES:
- If the email is DIRECTLY relevant to one or more goals, return their IDs.
- Always prefer the LOWEST (most specific) goal. Only use a parent goal if the email is broadly about that topic and fits none of its children.
- Most emails will be irrelevant. Return an empty list for those.
- Do NOT force matches. Only match when the email clearly discusses the goal's topic.

Return ONLY a JSON object: {{"goal_ids": ["g2", "g8"]}} or {{"goal_ids": []}}
No markdown fences, no commentary."""


def make_email_text(email):
    body = email.get("body", "")
    if len(body) > 800:
        body = body[:800] + "..."
    return (
        f"Date: {email.get('date', '')}\n"
        f"From: {email.get('from', '')}\n"
        f"To: {email.get('to', '')}\n"
        f"Subject: {email.get('subject', '')}\n"
        f"Body:\n{body}"
    )


def classify_one(system_prompt, email):
    mid = email["message_id"]
    user_msg = make_email_text(email)

    for attempt in range(MAX_RETRIES):
        try:
            resp = client.chat.completions.create(
                model=MODEL,
                temperature=0.0,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_msg},
                ],
            )
            parsed = json.loads(resp.choices[0].message.content)
            return (mid, parsed.get("goal_ids", []), email)
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAYS[attempt])
            else:
                print(f"    FAIL: {mid[:40]}... — {e}")
                return (mid, [], email)


# ── Checkpoint ───────────────────────────────────────────────────────

def save_checkpoint(matches, matched_emails, processed):
    with open(CHECKPOINT_PATH, "w") as f:
        json.dump({
            "matches": matches,
            "matched_emails": matched_emails,
            "processed": processed,
        }, f)


def load_checkpoint():
    if os.path.exists(CHECKPOINT_PATH):
        with open(CHECKPOINT_PATH, "r") as f:
            data = json.load(f)
        print(f"  Resuming from checkpoint: {data['processed']} processed")
        return data
    return None


# ── Main ─────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("Step 3: Match Emails to Goals (streaming, one-by-one)")
    print("=" * 60)

    print(f"\nFolders {FOLDER_START:05d}-{FOLDER_END:05d}, max {MAX_EMAILS} emails")
    print(f"Model: {MODEL}, Workers: {WORKERS}\n")

    goals = load_goals()
    valid_ids = {g["id"] for g in goals}
    goal_tree = build_goal_tree_prompt(goals)
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(goal_tree=goal_tree)

    print(f"\n  Goal tree:")
    print("  " + goal_tree.replace("\n", "\n  "))

    # matches: { message_id: [goal_ids] }
    # matched_emails: { message_id: { date, from, to, subject, body } }
    matches = {}
    matched_emails = {}
    processed = 0
    skip_to = 0

    ckpt = load_checkpoint()
    if ckpt:
        matches = ckpt["matches"]
        matched_emails = ckpt["matched_emails"]
        processed = ckpt["processed"]
        skip_to = processed

    t0 = time.time()
    matched_count = len(matches)

    print(f"\n[Classifying] streaming from folder {FOLDER_START:05d}...")
    if skip_to > 0:
        print(f"  Skipping first {skip_to} (already processed)\n")

    # Collect a chunk, send concurrently, checkpoint, repeat
    chunk = []
    skipped = 0

    for email in email_iterator():
        # Skip already-processed emails on resume
        if skipped < skip_to:
            skipped += 1
            continue

        chunk.append(email)

        if len(chunk) >= CHECKPOINT_EVERY:
            # Process chunk concurrently
            with ThreadPoolExecutor(max_workers=WORKERS) as pool:
                futures = [pool.submit(classify_one, system_prompt, e) for e in chunk]
                for future in as_completed(futures):
                    mid, goal_ids, email_obj = future.result()
                    goal_ids = [gid for gid in goal_ids if gid in valid_ids]
                    if goal_ids:
                        matches[mid] = goal_ids
                        matched_emails[mid] = {
                            "message_id": email_obj["message_id"],
                            "date": email_obj.get("date", ""),
                            "from": email_obj.get("from", ""),
                            "to": email_obj.get("to", ""),
                            "subject": email_obj.get("subject", ""),
                            "body": email_obj.get("body", ""),
                        }
                        matched_count += 1

            processed += len(chunk)
            chunk = []

            elapsed = time.time() - t0
            rate = (processed - skip_to) / elapsed if elapsed > 0 else 0
            remaining = MAX_EMAILS - processed
            eta = remaining / rate if rate > 0 else 0

            print(
                f"  [{processed:>5}/{MAX_EMAILS}] "
                f"{matched_count} matched | "
                f"{rate:.1f} emails/s | "
                f"ETA {eta/60:.1f}m"
            )
            save_checkpoint(matches, matched_emails, processed)

    # Process any remaining emails in the last partial chunk
    if chunk:
        with ThreadPoolExecutor(max_workers=WORKERS) as pool:
            futures = [pool.submit(classify_one, system_prompt, e) for e in chunk]
            for future in as_completed(futures):
                mid, goal_ids, email_obj = future.result()
                goal_ids = [gid for gid in goal_ids if gid in valid_ids]
                if goal_ids:
                    matches[mid] = goal_ids
                    matched_emails[mid] = {
                        "message_id": email_obj["message_id"],
                        "date": email_obj.get("date", ""),
                        "from": email_obj.get("from", ""),
                        "to": email_obj.get("to", ""),
                        "subject": email_obj.get("subject", ""),
                        "body": email_obj.get("body", ""),
                    }
                    matched_count += 1

        processed += len(chunk)
        save_checkpoint(matches, matched_emails, processed)
        print(f"  [{processed:>5}/{MAX_EMAILS}] {matched_count} matched (final)")

    # ── Assemble output ──────────────────────────────────────────────
    print(f"\n[Assembling output]")

    goal_email_map = {g["id"]: [] for g in goals}
    for mid, goal_ids in matches.items():
        for gid in goal_ids:
            if gid in goal_email_map and mid in matched_emails:
                goal_email_map[gid].append(matched_emails[mid])

    output_goals = []
    for g in goals:
        emails = sorted(goal_email_map[g["id"]], key=lambda e: e.get("date", ""))
        output_goals.append({
            "id": g["id"],
            "summary": g["summary"],
            "category": g["category"],
            "parent_id": g["parent_id"],
            "kpis": g.get("kpis", []),
            "email_count": len(emails),
            "emails": emails,
        })

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump({"goals": output_goals}, f, indent=2)

    print(f"  Written to {OUTPUT_PATH}")
    print(f"\n  Summary:")
    for g in output_goals:
        bar = "#" * min(g["email_count"], 50)
        print(f"    {g['id']:>3}: {g['email_count']:>4} emails  {g['summary'][:55]}  {bar}")
    print(f"  Total: {matched_count} matched / {processed} processed")

    if os.path.exists(CHECKPOINT_PATH):
        os.remove(CHECKPOINT_PATH)

    print("\nDone!")


if __name__ == "__main__":
    main()
