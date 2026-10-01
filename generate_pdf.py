import os
import subprocess
import re
import html
import pypdf

PROJECT_ROOT = r"c:\Users\Hxtreme\Hospital Management System"

def read_file_content(relative_path):
    full_path = os.path.join(PROJECT_ROOT, relative_path)
    if not os.path.exists(full_path):
        print(f"Warning: File not found {full_path}")
        return ""
    with open(full_path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()

def escape_code(text):
    return html.escape(text)

print("Reading project files...")
