"""Helpers partages par les scripts du montage CANAL-FOUR."""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "videos"
ASSETS = ROOT / "assets"
OUTPUT = ROOT / "output"
WORK = OUTPUT / "_work"
LOGS = ROOT / "logs"
FFMPEG_LOGS = LOGS / "ffmpeg"

FPS = 24
WIDTH = 1920
HEIGHT = 1080


def run(cmd: list[str], log_name: str) -> subprocess.CompletedProcess:
    """Execute une commande, logge stdout/stderr, leve une exception si echec."""
    FFMPEG_LOGS.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%H%M%S")
    log_path = FFMPEG_LOGS / f"{stamp}_{log_name}.log"

    printable = " ".join(str(c) for c in cmd)
    result = subprocess.run(cmd, capture_output=True, text=True)

    with open(log_path, "w", encoding="utf-8") as f:
        f.write(f"CMD: {printable}\n\n--- STDOUT ---\n{result.stdout}\n\n--- STDERR ---\n{result.stderr}\n")

    if result.returncode != 0:
        print(f"[ECHEC] {log_name} -> voir {log_path}", file=sys.stderr)
        print(result.stderr[-3000:], file=sys.stderr)
        raise RuntimeError(f"Commande echouee ({log_name}), code {result.returncode}")

    print(f"[ok] {log_name}")
    return result


def ffprobe_json(path: Path) -> dict:
    result = run(
        [
            "ffprobe", "-v", "error",
            "-print_format", "json",
            "-show_format", "-show_streams",
            str(path),
        ],
        log_name=f"ffprobe_{path.stem}",
    )
    return json.loads(result.stdout)


def ensure_dirs() -> None:
    for d in (VIDEOS, ASSETS, OUTPUT, WORK, WORK / "transition_frames", LOGS, FFMPEG_LOGS, LOGS / "verify", LOGS / "preview"):
        d.mkdir(parents=True, exist_ok=True)
