"""Phase 1-2 : copie des sources, verification de compatibilite, vendoring des polices."""
from __future__ import annotations

import shutil
from pathlib import Path

from utils import ROOT, VIDEOS, ASSETS, LOGS, ffprobe_json, ensure_dirs, run

SOURCES = {
    "video1.mp4": ROOT / "public" / "video" / "gemini_generated_video_1952e0e6.mp4",
    "video2.mp4": ROOT / "public" / "video" / "gemini_generated_video_d6b23fa0.mp4",
}

FONTS = [
    Path("C:/Windows/Fonts/GeorgiaPro-SemiBold.ttf"),
    Path("C:/Windows/Fonts/GeorgiaPro-Italic.ttf"),
    Path("C:/Windows/Fonts/GeorgiaPro-Light.ttf"),
]


def main() -> None:
    ensure_dirs()

    for dest_name, src in SOURCES.items():
        if not src.exists():
            raise FileNotFoundError(f"Source introuvable, je ne fabrique pas de remplacement : {src}")
        dest = VIDEOS / dest_name
        shutil.copy2(src, dest)
        print(f"Copie {src.name} -> {dest}")

    font_dir = ASSETS / "fonts"
    font_dir.mkdir(parents=True, exist_ok=True)
    for font in FONTS:
        if font.exists():
            shutil.copy2(font, font_dir / font.name)
        else:
            print(f"[attention] police absente, ignoree : {font}")

    compat = {}
    for name in ("video1.mp4", "video2.mp4"):
        probe = ffprobe_json(VIDEOS / name)
        v = next(s for s in probe["streams"] if s["codec_type"] == "video")
        a = next((s for s in probe["streams"] if s["codec_type"] == "audio"), None)
        compat[name] = {
            "duration": float(probe["format"]["duration"]),
            "width": v["width"],
            "height": v["height"],
            "fps": v["r_frame_rate"],
            "codec": v["codec_name"],
            "audio_codec": a["codec_name"] if a else None,
        }
        print(name, compat[name])

    v1, v2 = compat["video1.mp4"], compat["video2.mp4"]
    assert v1["width"] == v2["width"] and v1["height"] == v2["height"], "resolutions incompatibles"
    assert v1["fps"] == v2["fps"], "frequences incompatibles"
    print("Compatibilite video1/video2 : OK")

    # Grille de previsualisation (1 image / 0.5s) pour affiner les points de coupe si besoin.
    preview_dir = LOGS / "preview"
    for name in ("video1.mp4", "video2.mp4"):
        stem = name.replace(".mp4", "")
        run(
            [
                "ffmpeg", "-y", "-i", str(VIDEOS / name),
                "-vf", "fps=2",
                str(preview_dir / f"grid_{stem}_%03d.jpg"),
            ],
            log_name=f"grid_{stem}",
        )


if __name__ == "__main__":
    main()
