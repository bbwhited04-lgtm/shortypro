\
#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQ_CANDIDATES = [
    ROOT / "requirements.txt",
    ROOT / "requirements-prod.txt",
    ROOT / "requirements.in",
    ROOT / "backend" / "requirements.txt",
]

def ensure_line_in_requirements(path: Path, pkg: str) -> tuple[bool,str]:
    if not path.exists():
        return False, "missing"
    lines = path.read_text(encoding="utf-8").splitlines()
    norm = [l.strip().lower().replace("_","-") for l in lines if l.strip() and not l.strip().startswith("#")]
    if any(n.startswith(pkg) for n in norm):
        return False, "already present"
    # keep a trailing blank line policy simple
    if lines and lines[-1].strip() != "":
        lines.append(pkg)
    else:
        # if file ends with blank line(s), insert before the final blanks
        # find last nonblank
        i = len(lines)-1
        while i >= 0 and lines[i].strip()=="":
            i -= 1
        lines.insert(i+1, pkg)
    path.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    return True, "added"

def patch_pyproject(pyproject: Path, pkg: str) -> tuple[bool,str]:
    if not pyproject.exists():
        return False, "missing"
    text = pyproject.read_text(encoding="utf-8")
    # Only supports PEP 621 [project] dependencies = [ ... ]
    m = re.search(r"(?ms)^\[project\]\s.*?(?=^\[|\Z)", text)
    if not m:
        return False, "no [project] section found"
    block = m.group(0)

    dep_m = re.search(r"(?ms)^\s*dependencies\s*=\s*\[(.*?)\]\s*$", block)
    if not dep_m:
        return False, "no [project].dependencies array found"
    deps_body = dep_m.group(1)
    if re.search(rf'(?i)["\']{re.escape(pkg)}(["\']|[<=>!~])', deps_body) or re.search(rf"(?i)\b{re.escape(pkg)}\b", deps_body):
        return False, "already present in pyproject dependencies"

    # Insert as a new line before closing bracket, keeping indentation similar
    # Determine indentation from first deps item line
    lines = deps_body.splitlines()
    indent = "  "
    for ln in lines:
        s = ln.lstrip()
        if s.startswith(("'", '"')):
            indent = ln[:len(ln)-len(s)]
            break
    addition = f'{indent}"{pkg}",'
    # If deps_body is empty/whitespace, just add the line
    if deps_body.strip() == "":
        new_deps_body = "\n" + addition + "\n"
    else:
        new_deps_body = deps_body.rstrip() + "\n" + addition + "\n"
    new_block = block[:dep_m.start(1)] + new_deps_body + block[dep_m.end(1):]
    new_text = text[:m.start(0)] + new_block + text[m.end(0):]
    pyproject.write_text(new_text, encoding="utf-8")
    return True, "added to [project].dependencies"

def main():
    pkg = "email-validator"
    changed_any = False

    print(f"Repo root: {ROOT}")
    print("Patching requirements files...")
    for p in REQ_CANDIDATES:
        changed, msg = ensure_line_in_requirements(p, pkg)
        if msg == "missing":
            continue
        if changed:
            changed_any = True
            print(f"[CHANGED] {p.relative_to(ROOT)} — {msg}")
        else:
            print(f"[OK]      {p.relative_to(ROOT)} — {msg}")

    pyproject = ROOT / "pyproject.toml"
    changed, msg = patch_pyproject(pyproject, pkg)
    if msg != "missing":
        if changed:
            changed_any = True
            print(f"[CHANGED] pyproject.toml — {msg}")
        else:
            print(f"[OK]      pyproject.toml — {msg}")

    if not changed_any:
        print("\nNo dependency files were changed. If Render still fails, check what install command Render uses (pip/poetry/uv) and which file it reads.")
        print("Common fix: make sure the file used in the Render Build Command includes email-validator.")
    else:
        print("\nDone. Next:")
        print("  git add -A")
        print('  git commit -m "Add email-validator for Pydantic EmailStr"')
        print("  git push")
        print("  Redeploy Render")

if __name__ == "__main__":
    main()
