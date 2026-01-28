\
#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
TEMPL = ROOT / "PATCH" / "templates"

def write_file(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

def patch_or_write_stripe_py():
    tpl = (TEMPL / "backend_stripe.py").read_text(encoding="utf-8")
    target = ROOT / "backend" / "stripe.py"
    write_file(target, tpl)
    return True, "wrote backend/stripe.py (Render checkout defaults)"

def ensure_email_validator():
    req = ROOT / "requirements.txt"
    if not req.exists():
        return False, "requirements.txt missing (skipped)"
    lines = req.read_text(encoding="utf-8").splitlines()
    norm = [l.strip().lower().replace("_","-") for l in lines if l.strip() and not l.strip().startswith("#")]
    if any(n.startswith("email-validator") for n in norm):
        return False, "email-validator already present"
    lines.append("email-validator")
    req.write_text("\\n".join(lines).rstrip() + "\\n", encoding="utf-8")
    return True, "added email-validator to requirements.txt"

def write_frontend_index():
    content = (TEMPL / "frontend_public_index.html").read_text(encoding="utf-8")
    target = ROOT / "frontend" / "public" / "index.html"
    write_file(target, content)
    return True, "wrote frontend/public/index.html (fixed priceIds + sends success/cancel URLs)"

def write_redirect_pages():
    redirect_tsx = 'import { redirect } from "next/navigation";\\n\\nexport default function Home(){\\n  redirect("/index.html");\\n}\\n'
    targets = [
        ROOT / "frontend" / "src" / "app" / "page.tsx",
        ROOT / "frontend" / "app" / "page.tsx",
    ]
    for t in targets:
        write_file(t, redirect_tsx)
    return True, "created redirect pages for / -> /index.html"

def main():
    if not (ROOT/"frontend").exists() or not (ROOT/"backend").exists():
        print("[ERROR] Run this from repo root (must contain frontend/ and backend/ folders).")
        raise SystemExit(1)

    changes = []
    for fn in (write_frontend_index, write_redirect_pages, patch_or_write_stripe_py, ensure_email_validator):
        ok, msg = fn()
        if ok:
            changes.append(msg)

    print("Applied fixes:")
    for c in changes:
        print(" -", c)

    print("\\nNext:")
    print("  git add -A")
    print('  git commit -m "One-touch: fix homepage redirect + stripe checkout wiring + render defaults"')
    print("  git push")
    print("\\nRender env (recommended):")
    print("  FRONTEND_BASE_URL=https://www.shortypro.com")

if __name__ == "__main__":
    main()
