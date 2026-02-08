import numpy as np
import pandas as pd
from email import parser

df = pd.read_csv("enron_emails.csv")


def parse_email(raw_email):
    """Parse a raw email message and extract structured features"""
    email_parser = parser.Parser()
    email_msg = email_parser.parsestr(raw_email)

    # Extract all relevant fields
    parsed_data = {
        "message_id": email_msg.get("Message-ID", ""),
        "in_reply_to": email_msg.get("In-Reply-To", ""),
        "references": email_msg.get("References", ""),
        "date": email_msg.get("Date", ""),
        "from": email_msg.get("From", ""),
        "to": email_msg.get("To", ""),
        "subject": email_msg.get("Subject", ""),
        "mime_version": email_msg.get("Mime-Version", ""),
        "content_type": email_msg.get("Content-Type", ""),
        "content_transfer_encoding": email_msg.get("Content-Transfer-Encoding", ""),
        "x_from": email_msg.get("X-From", ""),
        "x_to": email_msg.get("X-To", ""),
        "x_cc": email_msg.get("X-cc", ""),
        "x_bcc": email_msg.get("X-bcc", ""),
        "x_folder": email_msg.get("X-Folder", ""),
        "x_origin": email_msg.get("X-Origin", ""),
        "x_filename": email_msg.get("X-FileName", ""),
        "body": email_msg.get_payload(),
    }

    return parsed_data


print("Parsing all emails...")
parsed_emails = df["message"][0:1000].apply(parse_email)
df_structured = pd.DataFrame(parsed_emails.tolist())


def _normalize_msg_id(msgid):
    """Normalize Message-ID-like strings by stripping <, > and whitespace."""
    if not isinstance(msgid, str):
        return ""
    # split and take first token if there are multiple
    msgid = msgid.strip()
    # remove angle brackets and surrounding whitespace
    msgid = msgid.strip(" <>\n\r\t")
    return msgid


def build_threads(df_struct):
    """Build threads by following In-Reply-To/References headers.

    Returns a list of threads; each thread is a list of dataframe indices (ints),
    sorted by date (oldest -> newest).
    """
    # map normalized message_id -> index
    id_to_idx = {}
    for idx, mid in df_struct["message_id"].fillna("").items():
        nm = _normalize_msg_id(mid)
        if nm:
            id_to_idx[nm] = idx

    parent_of = {}
    for idx, row in df_struct.iterrows():
        mid = _normalize_msg_id(row.get("message_id", ""))
        in_reply = _normalize_msg_id(row.get("in_reply_to", ""))
        refs_raw = row.get("references", "") or ""
        refs = [_normalize_msg_id(r) for r in refs_raw.split() if r.strip()]

        parent_idx = None
        if in_reply and in_reply in id_to_idx:
            parent_idx = id_to_idx[in_reply]
        else:
            # try last reference that exists in the dataset
            for ref in reversed(refs):
                if ref in id_to_idx:
                    parent_idx = id_to_idx[ref]
                    break

        parent_of[idx] = parent_idx

    # build children mapping
    from collections import defaultdict, deque

    children = defaultdict(list)
    for child, parent in parent_of.items():
        children[parent].append(child)

    # roots are those with parent None
    roots = [idx for idx, parent in parent_of.items() if parent is None]

    # ensure date is parsed (handle None and non-string values). Use an
    # index-aligned Series so we can lookup by dataframe index labels.
    dates_series = df_struct.get(
        "date", pd.Series(index=df_struct.index, dtype="object")
    )
    dates = pd.to_datetime(
        dates_series.where(dates_series.notnull(), ""), errors="coerce"
    )

    threads = []
    for root in roots:
        q = deque([root])
        collected = []
        while q:
            node = q.popleft()
            collected.append(node)
            for c in children.get(node, []):
                q.append(c)

        # sort collected by date using index lookup (fall back to NaT)
        collected_sorted = sorted(
            collected, key=lambda i: (dates.loc[i] if i in dates.index else pd.NaT)
        )
        threads.append(collected_sorted)

    return threads


def print_thread(df_struct, thread_indices):
    """Print the full conversation for a thread (list of dataframe indices)."""
    for idx in thread_indices:
        row = df_struct.loc[idx]
        print("\n" + "=" * 80)
        print(
            f"Index: {idx} | From: {row.get('from', '')} | Subject: {row.get('subject', '')}"
        )
        print("-" * 80)
        print(row.get("body", ""))


# Build threads and demonstrate printing the first few
threads = build_threads(df_structured)
print(f"Found {len(threads)} threads")
if threads:
    # print first thread's conversation
    print("\n--- First thread conversation ---")
    print_thread(df_structured, threads[0])
