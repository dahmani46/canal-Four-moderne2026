"""Orchestrateur : grading, trims, transition page-flip, carton de signature,
assemblage video, mix audio, export final -> output/CANAL-FOUR-PUBLICITE.mp4
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from utils import ROOT, VIDEOS, ASSETS, OUTPUT, WORK, run, ensure_dirs, FPS, WIDTH, HEIGHT

SCRIPTS = ROOT / "scripts"

V1 = VIDEOS / "video1.mp4"
V2 = VIDEOS / "video2.mp4"

# --- Plan de montage (timestamps, en secondes) ---
SEQ1_IN, SEQ1_OUT = 0.0, 7.5
TRANS_PAGE_IN, TRANS_PAGE_OUT = 7.5, 8.833333
TRANS_REVEAL_IN, TRANS_REVEAL_OUT = 0.0, 1.333333
SEQ3_IN, SEQ3_OUT = 1.333333, 9.333333
TRANS_DUR = TRANS_PAGE_OUT - TRANS_PAGE_IN  # 1.333333s

SIG_BG_DUR, SIG_TITLE_DUR, SIG_FULL_DUR, SIG_XFADE = 1.5, 1.5, 3.5, 0.5

GRADE = (
    "eq=contrast=1.08:brightness=0.01:saturation=1.12,"
    "colorbalance=rs=0.08:gs=0.02:bs=-0.06:rm=0.06:bm=-0.05:rh=0.04:bh=-0.04,"
    "curves=r='0/0 0.5/0.56 1/1':g='0/0 0.5/0.49 1/0.97':b='0/0 0.5/0.44 1/0.92',"
    "unsharp=5:5:0.4:5:5:0.0,"
    "vignette=PI/5"
)


def grade_trim(src: Path, t_in: float, t_out: float, out_path: Path, log: str) -> Path:
    vf = f"scale={WIDTH}:{HEIGHT}:flags=lanczos,setsar=1,{GRADE},fps={FPS},format=yuv420p"
    run(
        [
            "ffmpeg", "-y", "-v", "error",
            "-ss", str(t_in), "-i", str(src), "-t", str(t_out - t_in),
            "-vf", vf, "-an",
            "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p",
            str(out_path),
        ],
        log_name=log,
    )
    return out_path


def build_signature_clip() -> Path:
    bg = ASSETS / "signature_bg.png"
    title = ASSETS / "signature_title.png"
    full = ASSETS / "signature_full.png"

    bg_hold = WORK / "sig_bg_hold.mp4"
    title_hold = WORK / "sig_title_hold.mp4"
    full_hold = WORK / "sig_full_hold.mp4"

    run(
        ["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", str(bg), "-t", str(SIG_BG_DUR),
         "-vf", f"scale={WIDTH}:{HEIGHT},fps={FPS},format=yuv420p",
         "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(bg_hold)],
        log_name="sig_bg_hold",
    )

    title_frames = int(SIG_TITLE_DUR * FPS)
    title_inc = 0.02 / max(title_frames - 1, 1)
    run(
        ["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", str(title), "-t", str(SIG_TITLE_DUR),
         "-vf", (f"scale={WIDTH*2}:{HEIGHT*2},"
                 f"zoompan=z='min(zoom+{title_inc},1.02)':d={title_frames}:s={WIDTH}x{HEIGHT}:fps={FPS},"
                 f"format=yuv420p"),
         "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(title_hold)],
        log_name="sig_title_hold",
    )

    full_frames = int(SIG_FULL_DUR * FPS)
    full_inc = 0.04 / max(full_frames - 1, 1)
    run(
        ["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", str(full), "-t", str(SIG_FULL_DUR),
         "-vf", (f"scale={WIDTH*2}:{HEIGHT*2},"
                 f"zoompan=z='min(zoom+{full_inc},1.04)':d={full_frames}:s={WIDTH}x{HEIGHT}:fps={FPS},"
                 f"format=yuv420p"),
         "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(full_hold)],
        log_name="sig_full_hold",
    )

    bgtitle = WORK / "sig_bgtitle.mp4"
    offset1 = SIG_BG_DUR - SIG_XFADE
    run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(bg_hold), "-i", str(title_hold),
         "-filter_complex", f"[0:v][1:v]xfade=transition=fade:duration={SIG_XFADE}:offset={offset1}[outv]",
         "-map", "[outv]", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(bgtitle)],
        log_name="sig_xfade1",
    )

    signature = WORK / "signature.mp4"
    bgtitle_dur = SIG_BG_DUR + SIG_TITLE_DUR - SIG_XFADE
    offset2 = bgtitle_dur - SIG_XFADE
    run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(bgtitle), "-i", str(full_hold),
         "-filter_complex", f"[0:v][1:v]xfade=transition=fade:duration={SIG_XFADE}:offset={offset2}[outv]",
         "-map", "[outv]", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(signature)],
        log_name="sig_xfade2",
    )

    return signature


def build_audio() -> Path:
    seq1_audio_raw = WORK / "seq1_audio_raw.m4a"
    seq3_audio_raw = WORK / "seq3_audio_raw.m4a"

    run(
        ["ffmpeg", "-y", "-v", "error", "-ss", str(SEQ1_IN), "-i", str(V1), "-t", str(TRANS_PAGE_OUT - SEQ1_IN),
         "-vn", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
         str(seq1_audio_raw)],
        log_name="seq1_audio",
    )
    run(
        ["ffmpeg", "-y", "-v", "error", "-ss", "0", "-i", str(V2), "-t", str(SEQ3_OUT),
         "-vn", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
         str(seq3_audio_raw)],
        log_name="seq3_audio",
    )

    av12 = WORK / "av_seq1_seq3.m4a"
    run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(seq1_audio_raw), "-i", str(seq3_audio_raw),
         "-filter_complex", f"[0:a][1:a]acrossfade=d={TRANS_DUR}:c1=tri:c2=tri[outa]",
         "-map", "[outa]", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", str(av12)],
        log_name="audio_crossfade",
    )

    sig_audio = WORK / "signature_audio.m4a"
    tail_start = SEQ3_OUT - 2.333333
    run(
        ["ffmpeg", "-y", "-v", "error", "-ss", str(tail_start), "-i", str(V2), "-t", "2.333333",
         "-vn", "-af", (f"loudnorm=I=-16:TP=-1.5:LRA=11,"
                        f"apad=whole_dur={SIG_BG_DUR + SIG_TITLE_DUR + SIG_FULL_DUR - 2*SIG_XFADE},"
                        f"afade=t=out:st={SIG_BG_DUR + SIG_TITLE_DUR + SIG_FULL_DUR - 2*SIG_XFADE - 2}:d=2"),
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000", str(sig_audio)],
        log_name="signature_audio",
    )

    final_audio = WORK / "final_audio.m4a"
    total_dur = SEQ1_OUT + TRANS_DUR + (SEQ3_OUT - SEQ3_IN) + (SIG_BG_DUR + SIG_TITLE_DUR + SIG_FULL_DUR - 2 * SIG_XFADE)
    run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(av12), "-i", str(sig_audio),
         "-filter_complex",
         (f"[0:a][1:a]concat=n=2:v=0:a=1[cat];"
          f"[cat]afade=t=in:st=0:d=1.0,afade=t=out:st={total_dur - 1.5}:d=1.5[outa]"),
         "-map", "[outa]", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", str(final_audio)],
        log_name="audio_final",
    )
    return final_audio


def main() -> None:
    ensure_dirs()

    print("== Grading + trims ==")
    seq1_main = grade_trim(V1, SEQ1_IN, SEQ1_OUT, WORK / "seq1_main.mp4", "seq1_main")
    seq1_tail = grade_trim(V1, TRANS_PAGE_IN, TRANS_PAGE_OUT, WORK / "seq1_tail.mp4", "seq1_tail")
    seq3_head = grade_trim(V2, TRANS_REVEAL_IN, TRANS_REVEAL_OUT, WORK / "seq3_head.mp4", "seq3_head")
    seq3_main = grade_trim(V2, SEQ3_IN, SEQ3_OUT, WORK / "seq3_main.mp4", "seq3_main")

    print("== Transition page-flip (OpenCV) ==")
    transition_frames_dir = WORK / "transition_frames"
    result = subprocess.run(
        [sys.executable, str(SCRIPTS / "03_page_flip.py"),
         "--page", str(seq1_tail), "--reveal", str(seq3_head), "--out", str(transition_frames_dir)],
        capture_output=True, text=True,
    )
    print(result.stdout[-2000:])
    if result.returncode != 0:
        print(result.stderr[-3000:], file=sys.stderr)
        raise RuntimeError("Echec du rendu de la transition page-flip")

    transition_mp4 = WORK / "transition.mp4"
    run(
        ["ffmpeg", "-y", "-v", "error", "-framerate", str(FPS),
         "-i", str(transition_frames_dir / "frame_%04d.png"),
         "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(transition_mp4)],
        log_name="transition_encode",
    )

    print("== Carton de signature ==")
    signature_mp4 = build_signature_clip()

    print("== Assemblage video ==")
    video_track = WORK / "video_track.mp4"
    run(
        ["ffmpeg", "-y", "-v", "error",
         "-i", str(seq1_main), "-i", str(transition_mp4), "-i", str(seq3_main), "-i", str(signature_mp4),
         "-filter_complex", "[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0[outv]",
         "-map", "[outv]", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-r", str(FPS),
         str(video_track)],
        log_name="video_concat",
    )

    print("== Audio ==")
    final_audio = build_audio()

    print("== Export final ==")
    final_out = OUTPUT / "CANAL-FOUR-PUBLICITE.mp4"
    run(
        ["ffmpeg", "-y", "-v", "error",
         "-i", str(video_track), "-i", str(final_audio),
         "-map", "0:v", "-map", "1:a",
         "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-r", str(FPS),
         "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
         "-movflags", "+faststart", "-shortest",
         str(final_out)],
        log_name="final_export",
    )

    print(f"\nTermine : {final_out}")


if __name__ == "__main__":
    main()
