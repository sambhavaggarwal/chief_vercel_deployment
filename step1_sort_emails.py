import pandas as pd
from email import parser
from email.utils import parsedate_to_datetime
import os
import json

CSV_PATH = "/Users/chenaclee/Downloads/enron_emails.csv"
OUTPUT_DIR = "/Users/chenaclee/Documents/HackNationW26CoS/sorted_emails"
BATCH_SIZE = 100

# Load raw emails
print("Loading CSV...")
df = pd.read_csv(CSV_PATH)
print(f"Loaded {len(df)} emails")

# Parse each email into structured fields
print("Parsing emails...")
ep = parser.Parser()

records = []
for i, raw in enumerate(df["message"]):
    if i % 50000 == 0:
        print(f"  parsed {i}/{len(df)}")
    try:
        msg = ep.parsestr(raw)
        date_str = msg.get("Date", "")
        try:
            dt = parsedate_to_datetime(date_str)
        except Exception:
            dt = None

        records.append({
            "message_id": msg.get("Message-ID", ""),
            "date": date_str,
            "datetime": dt,
            "from": msg.get("From", ""),
            "to": msg.get("To", ""),
            "subject": msg.get("Subject", ""),
            "body": msg.get_payload() or "",
            "x_from": msg.get("X-From", ""),
            "x_to": msg.get("X-To", ""),
            "x_cc": msg.get("X-cc", ""),
            "x_folder": msg.get("X-Folder", ""),
        })
    except Exception as e:
        print(f"  skipped email {i}: {e}")

print(f"Parsed {len(records)} emails")

# Dedup: keep only emails from "All documents" folders to avoid cross-folder duplicates
before = len(records)
records = [r for r in records if "All documents" in r.get("x_folder", "")]
print(f"Dedup: {before} -> {len(records)} emails (kept 'All documents' folders only)")

# Sort chronologically (emails without parseable dates go to the end)
records.sort(key=lambda r: (r["datetime"] is None, r["datetime"] or ""))

# Write batches to numbered folders
os.makedirs(OUTPUT_DIR, exist_ok=True)

for batch_idx in range(0, len(records), BATCH_SIZE):
    batch = records[batch_idx : batch_idx + BATCH_SIZE]
    folder_num = batch_idx // BATCH_SIZE
    folder_path = os.path.join(OUTPUT_DIR, f"{folder_num:05d}")
    os.makedirs(folder_path, exist_ok=True)

    for j, rec in enumerate(batch):
        # Convert datetime to string for JSON serialization
        rec_out = dict(rec)
        rec_out["datetime"] = rec_out["datetime"].isoformat() if rec_out["datetime"] else None
        email_path = os.path.join(folder_path, f"{j:03d}.json")
        with open(email_path, "w") as f:
            json.dump(rec_out, f, indent=2)

total_folders = (len(records) + BATCH_SIZE - 1) // BATCH_SIZE
print(f"Done. {len(records)} emails -> {total_folders} folders in {OUTPUT_DIR}")
