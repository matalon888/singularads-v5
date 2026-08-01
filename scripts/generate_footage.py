#!/usr/bin/env python3
"""
Generate the overture's two film clips on Seedance 2.0.

    python3 scripts/generate_footage.py [--force]

Writes MP4s to public/footage/. Clips are vendored into the repo rather than
hotlinked so the hero cannot 404 on someone else's CDN.

PROVIDER NOTE — read before changing this file:
  The Higgsfield account carries no Seedance model at all. Its catalog is 14
  models: the DoP family (image2video) and Soul/Popcorn (text2image). Every
  Seedance slug returns {"detail":"model_not_found"}, including the
  `bytedance/seedance/v1/pro/image-to-video` constant the vet pipeline still
  names. Higgsfield also has no text-to-video model of any kind.

  Seedance 2 is the hard requirement, so this routes to fal.ai, which does
  carry it. On fal, `bytedance/seedance/v1/...` is now 404 ("Application
  seedance not found") — only 2.0 remains, so there is no v1 to fall back to
  even by accident.

  fal is banned for the Recepte ad pipeline because it blocks realistic human
  faces at ByteDance's partner_validation layer. These clips are abstract
  renders with no people in them, so that constraint does not apply here.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "footage"

FAL_KEY = os.environ.get(
    "FAL_KEY", "bbfa2b8a-c29a-42f6-b469-10939dfc16f1:b8ae271cead77158874be3327b2b683c"
)
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}

# Seedance 2.0 only. If this 404s, stop and report — never fall back to v1.
SEEDANCE_T2V = "https://queue.fal.run/bytedance/seedance-2.0/text-to-video"

SHOTS = [
    {
        "name": "arrival",
        "duration": "5",
        "prompt": (
            "Cinematic slow forward drift through thousands of small glossy rounded "
            "cubes suspended in a vast pitch-black void. The cubes are soft signal "
            "blue, lavender violet, warm pink, coral orange and pearl white, with "
            "smooth rounded edges and a soft matte-glossy finish. A single soft key "
            "light rakes across them from the upper left, catching their edges. "
            "Extremely shallow depth of field, macro bokeh, gentle parallax, "
            "particles drifting slowly. Abstract minimal product-design render. "
            "No people, no text, no logos, no words, no watermarks. "
            "Dark, expensive, restrained."
        ),
    },
    {
        "name": "convergence",
        "duration": "5",
        "prompt": (
            "Camera flies smoothly forward through an infinite bright white studio "
            "filled with floating glossy rounded cubes in soft signal blue, lavender "
            "violet, warm pink and coral orange. The cubes stream inward and converge "
            "toward a single luminous core at the centre of the frame. Soft "
            "volumetric light, white haze, seamless pure white background, clean "
            "minimal high-end product render, shallow depth of field. "
            "No people, no text, no logos, no words, no watermarks. "
            "Bright, weightless, precise."
        ),
    },
]


def post(url: str, body: dict) -> dict:
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detail = e.read().decode()[:400]
        if e.code == 404:
            sys.exit(
                f"\nFATAL: Seedance 2.0 endpoint is gone ({url}).\n{detail}\n"
                "Stopping rather than falling back to another model.\n"
            )
        sys.exit(f"\nFATAL: {e.code} from fal — {detail}\n")


def poll(status_url: str, label: str, timeout: int = 1200) -> dict:
    t0 = time.monotonic()
    last = ""
    while time.monotonic() - t0 < timeout:
        req = urllib.request.Request(status_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=60) as r:
            s = json.loads(r.read())
        status = s.get("status", "")
        if status != last:
            print(f"  [{label}] {time.monotonic() - t0:>5.0f}s  {status}", flush=True)
            last = status
        if status == "COMPLETED":
            req = urllib.request.Request(
                s.get("response_url") or status_url.replace("/status", ""), headers=HEADERS
            )
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        if status in ("FAILED", "ERROR", "CANCELLED"):
            sys.exit(f"\nFATAL: {label} finished as {status}: {json.dumps(s)[:400]}\n")
        time.sleep(5)
    sys.exit(f"\nFATAL: {label} timed out after {timeout}s\n")


def download(url: str, dest: Path) -> None:
    with urllib.request.urlopen(url, timeout=600) as r:
        dest.write_bytes(r.read())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="regenerate even if the file exists")
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)

    for shot in SHOTS:
        dest = OUT / f"{shot['name']}.mp4"
        if dest.exists() and not args.force:
            print(f"[skip] {dest.relative_to(ROOT)} already exists")
            continue

        print(f"\n[submit] {shot['name']} ({shot['duration']}s) → Seedance 2.0")
        resp = post(
            SEEDANCE_T2V,
            {
                "prompt": shot["prompt"],
                "duration": shot["duration"],
                "aspect_ratio": "16:9",
            },
        )
        status_url = resp.get("status_url")
        if not status_url:
            sys.exit(f"FATAL: no status_url in submit response: {json.dumps(resp)[:400]}")

        result = poll(status_url, shot["name"])
        url = (
            (result.get("video") or {}).get("url")
            or result.get("video_url")
            or result.get("url")
        )
        if not url:
            sys.exit(f"FATAL: no video URL for {shot['name']}: {json.dumps(result)[:400]}")

        download(url, dest)
        mb = dest.stat().st_size / 1e6
        print(f"[done] {dest.relative_to(ROOT)}  {mb:.1f} MB")


if __name__ == "__main__":
    main()
