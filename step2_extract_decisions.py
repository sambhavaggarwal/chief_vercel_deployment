"""
Step 2: LLM Decision Extraction Pipeline

Reads sorted Enron emails, sends them to OpenAI in batches,
and extracts decision nodes + linked emails into decisions.json.
"""

import json
import os
import glob
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
FOLDER_START = os.getenv("FOLDER_START", "00000")
FOLDER_END = os.getenv("FOLDER_END", "00001")
MAX_EMAILS = int(os.getenv("MAX_EMAILS", "100"))
BATCH_SIZE = 20
MODEL = "openai/gpt-4o-mini"
OUTPUT_PATH = os.path.join("decision-ui", "src", "data", "decisions.json")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)


# ── Phase 1: Load emails ────────────────────────────────────────────

def load_emails():
    """Load email JSON files from FOLDER_START to FOLDER_END (exclusive), sort by datetime, truncate to MAX_EMAILS."""
    emails = []
    start = int(FOLDER_START)
    end = int(FOLDER_END)

    for folder_num in range(start, end):
        folder_name = f"{folder_num:05d}"
        folder_path = os.path.join("sorted_emails", folder_name)
        if not os.path.isdir(folder_path):
            print(f"  Skipping missing folder: {folder_path}")
            continue

        for filepath in sorted(glob.glob(os.path.join(folder_path, "*.json"))):
            with open(filepath, "r") as f:
                email = json.load(f)
                emails.append(email)

    emails.sort(key=lambda e: e.get("datetime", ""))
    emails = emails[:MAX_EMAILS]
    print(f"  Loaded {len(emails)} emails from folders {FOLDER_START}–{FOLDER_END}")
    return emails


# ── Phase 2: Batch → LLM (identify decisions) ───────────────────────

IDENTIFY_SYSTEM_PROMPT = """You are an analyst extracting business decisions from corporate emails.

For each batch of emails, identify distinct business decisions discussed in them.
For each decision found, return:
- summary: a short one-sentence description of the decision
- status: one of "made", "pending", or "rejected"
- date: the date the decision was made or proposed (YYYY-MM-DD format)
- actors: array of email addresses of people involved in the decision
- evidence_message_ids: array of message_id values from the emails that are evidence for this decision

Return a JSON array of decision objects. If no decisions are found, return an empty array [].
Return ONLY valid JSON — no markdown fences, no commentary."""

def make_email_summary(email):
    """Create a compact representation of an email for the LLM prompt."""
    body = email.get("body", "")
    if len(body) > 500:
        body = body[:500] + "..."
    return {
        "message_id": email["message_id"],
        "date": email["date"],
        "from": email["from"],
        "to": email["to"],
        "subject": email["subject"],
        "body": body,
    }


def identify_decisions(emails):
    """Send emails in batches to LLM, collect candidate decisions."""
    all_candidates = []
    batches = [emails[i:i + BATCH_SIZE] for i in range(0, len(emails), BATCH_SIZE)]

    for batch_idx, batch in enumerate(batches):
        print(f"  Batch {batch_idx + 1}/{len(batches)} ({len(batch)} emails)...")
        summaries = [make_email_summary(e) for e in batch]

        response = client.chat.completions.create(
            model=MODEL,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": IDENTIFY_SYSTEM_PROMPT},
                {"role": "user", "content": f"Analyze these emails and extract business decisions:\n\n{json.dumps(summaries, indent=2)}"},
            ],
        )

        raw = response.choices[0].message.content
        try:
            parsed = json.loads(raw)
            # Handle both {"decisions": [...]} and bare [...]
            if isinstance(parsed, dict):
                candidates = parsed.get("decisions", parsed.get("results", []))
            elif isinstance(parsed, list):
                candidates = parsed
            else:
                candidates = []
            all_candidates.extend(candidates)
            print(f"    Found {len(candidates)} decisions")
        except json.JSONDecodeError:
            print(f"    WARNING: Could not parse LLM response for batch {batch_idx + 1}")

    print(f"  Total candidate decisions: {len(all_candidates)}")
    return all_candidates


# ── Phase 3: LLM (link parents) ─────────────────────────────────────

LINK_SYSTEM_PROMPT = """You are given a list of business decisions extracted from corporate emails.
Your job is to assign parent-child relationships between them.

A decision is a "child" of another if it was caused by, follows up on, or is a sub-decision of the parent.
Each decision has at most one parent. Root decisions have parent_id = null.

For each decision, assign a parent_id (the id of its parent decision) or null if it is a root decision.

Return a JSON object: {"decisions": [{"id": "...", "parent_id": "..." or null}, ...]}
Return ONLY valid JSON — no markdown fences, no commentary."""


def link_parents(candidates):
    """Single LLM call to assign parent_id for each decision."""
    if not candidates:
        return candidates

    # Assign temporary IDs
    for i, d in enumerate(candidates):
        d["id"] = f"d{i + 1}"

    decision_summaries = []
    for d in candidates:
        decision_summaries.append({
            "id": d["id"],
            "summary": d.get("summary", ""),
            "status": d.get("status", "pending"),
            "date": d.get("date", ""),
            "actors": d.get("actors", []),
        })

    response = client.chat.completions.create(
        model=MODEL,
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": LINK_SYSTEM_PROMPT},
            {"role": "user", "content": f"Assign parent_id for each decision:\n\n{json.dumps(decision_summaries, indent=2)}"},
        ],
    )

    raw = response.choices[0].message.content
    try:
        parsed = json.loads(raw)
        links = parsed.get("decisions", [])
        link_map = {link["id"]: link.get("parent_id") for link in links}
        for d in candidates:
            d["parent_id"] = link_map.get(d["id"])
    except (json.JSONDecodeError, KeyError) as e:
        print(f"  WARNING: Could not parse parent links: {e}")
        for d in candidates:
            d["parent_id"] = None

    return candidates


# ── Phase 4: Assemble & write output ────────────────────────────────

def assemble_output(candidates, emails):
    """Build the final decisions.json matching the UI schema."""
    email_lookup = {e["message_id"]: e for e in emails}

    decisions = []
    for d in candidates:
        evidence_ids = d.get("evidence_message_ids", [])
        linked_emails = []
        for mid in evidence_ids:
            if mid in email_lookup:
                e = email_lookup[mid]
                linked_emails.append({
                    "message_id": e["message_id"],
                    "date": e.get("date", ""),
                    "from": e.get("from", ""),
                    "to": e.get("to", ""),
                    "subject": e.get("subject", ""),
                    "body": e.get("body", ""),
                })

        decisions.append({
            "id": d["id"],
            "summary": d.get("summary", ""),
            "status": d.get("status", "pending"),
            "date": d.get("date", ""),
            "actors": d.get("actors", []),
            "parent_id": d.get("parent_id"),
            "emails": linked_emails,
        })

    return {"decisions": decisions}


def write_output(data):
    """Write decisions.json to the UI data directory."""
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  Written {len(data['decisions'])} decisions to {OUTPUT_PATH}")


# ── Main ─────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("Step 2: LLM Decision Extraction Pipeline")
    print("=" * 60)

    print(f"\nConfig: folders {FOLDER_START}–{FOLDER_END}, max {MAX_EMAILS} emails")
    print(f"Model: {MODEL}, batch size: {BATCH_SIZE}\n")

    print("[Phase 1] Loading emails...")
    emails = load_emails()
    if not emails:
        print("No emails found. Check FOLDER_START/FOLDER_END in .env")
        return

    print("\n[Phase 2] Identifying decisions via LLM...")
    candidates = identify_decisions(emails)
    if not candidates:
        print("No decisions found. Try expanding the folder range.")
        write_output({"decisions": []})
        return

    print("\n[Phase 3] Linking parent decisions via LLM...")
    candidates = link_parents(candidates)

    print("\n[Phase 4] Assembling output...")
    output = assemble_output(candidates, emails)
    write_output(output)

    print("\nDone!")


if __name__ == "__main__":
    main()
