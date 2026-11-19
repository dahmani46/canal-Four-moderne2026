"""Phase 3 : transition page-flip 3D (charniere a droite, courbure cylindrique,
projection perspective, ombre de contact, liseret de lumiere).

Rendu en sequence PNG plutot qu'en video directe (cv2.VideoWriter a un support
de codec H.264 peu fiable sous Windows) ; l'encodage en video se fait ensuite
en une seule passe ffmpeg depuis 04_build_ad.py.
"""
from __future__ import annotations

import argparse
import math
from pathlib import Path

import cv2
import numpy as np

from utils import WIDTH, HEIGHT, FPS, WORK, ensure_dirs

N_FRAMES = 32           # 1.333s a 24fps
BEND_MAX = 60.0         # profondeur max de la courbure cylindrique, en pixels
FOCAL = 1.4 * WIDTH     # "distance focale" de la projection sténopé simplifiée
FLATTEN_AT = 0.85       # au-dela de 85% de la progression, la page est forcee invisible
MAX_THETA_DEG = 170.0


def smoothstep(t: float) -> float:
    return t * t * (3 - 2 * t)


import gc


def compute_column_maps(theta: float):
    """Pour un angle theta donne, calcule par colonne :
    - x_src_for_output[ox]  : colonne source a echantillonner pour la colonne de sortie ox
    - scale_for_output[ox]  : facteur d'echelle verticale a cette colonne
    - valid_ox_mask[ox]     : colonnes de sortie reellement couvertes par la page
    La charniere est sur le bord droit (x = W) : toutes les lignes (y) partagent
    la meme transformation horizontale, donc l'inversion se fait en 1D (rapide,
    vectorise), pas besoin d'une carte 2D complete pour la partie x.
    """
    x_src = np.arange(WIDTH, dtype=np.float32)
    d = WIDTH - x_src  # distance a la charniere : 0 au bord droit, W au bord libre

    bend = (BEND_MAX * math.sin(theta) * np.sin(np.pi * d / WIDTH)).astype(np.float32)
    x3 = (WIDTH - d * math.cos(theta)).astype(np.float32)
    z3 = (-d * math.sin(theta) - bend).astype(np.float32)
    scale = (FOCAL / (FOCAL - z3)).astype(np.float32)  # z3 <= 0 => scale in (0, 1]

    # x3 est croissante en x_src tant que theta < 90deg (cos>0) : inversion par interpolation.
    order = np.argsort(x3)
    x3_sorted = x3[order]
    x_src_sorted = x_src[order]
    scale_sorted = scale[order]

    ox = np.arange(WIDTH, dtype=np.float32)
    x_src_for_output = np.interp(ox, x3_sorted, x_src_sorted, left=np.nan, right=np.nan).astype(np.float32)
    scale_for_output = np.interp(ox, x3_sorted, scale_sorted, left=np.nan, right=np.nan).astype(np.float32)

    valid_ox_mask = ~np.isnan(x_src_for_output) & (ox >= x3_sorted[0]) & (ox <= x3_sorted[-1])
    x_src_for_output = np.nan_to_num(x_src_for_output)
    scale_for_output = np.nan_to_num(scale_for_output, nan=1.0)

    return x_src_for_output, scale_for_output, valid_ox_mask


def warp_page_frame(page_bgr: np.ndarray, theta: float) -> tuple[np.ndarray, np.ndarray]:
    """Renvoie (image_deformee_bgr, masque_alpha_float32[0..1])."""
    x_src_for_output, scale_for_output, valid_ox_mask = compute_column_maps(theta)

    oy = np.arange(HEIGHT, dtype=np.float32)
    cy = np.float32(HEIGHT / 2.0)

    # map_y[oy, ox] = cy + (oy - cy) / scale(ox)
    inv_scale = np.where(scale_for_output > 1e-6, 1.0 / scale_for_output, 0.0).astype(np.float32)
    map_y32 = (cy + np.outer((oy - cy), inv_scale)).astype(np.float32)  # (H, W)
    map_x32 = np.tile(x_src_for_output, (HEIGHT, 1)).astype(np.float32)  # (H, W)

    valid = (map_y32 >= 0) & (map_y32 <= HEIGHT - 1) & valid_ox_mask[np.newaxis, :]

    warped = cv2.remap(
        page_bgr, map_x32, map_y32,
        interpolation=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_CONSTANT,
        borderValue=(0, 0, 0),
    )
    del map_x32, map_y32

    mask = valid.astype(np.float32)
    del valid
    # Adoucit le contour pour l'anti-aliasing (surtout visible sur le bord libre qui se courbe).
    mask = cv2.GaussianBlur(mask, (5, 5), 0)

    return warped, mask


def composite_frame(page_bgr: np.ndarray, reveal_bgr: np.ndarray, theta: float, t2: float) -> np.ndarray:
    warped, mask = warp_page_frame(page_bgr, theta)

    if t2 >= FLATTEN_AT:
        # Fin de transition : on force la revelation complete, propre.
        mask[:] = 0.0

    # Assombrissement de la page de profil (moins de lumiere renvoyee).
    brightness_mult = 1.0 - 0.45 * math.sin(theta)
    warped = np.clip(warped.astype(np.float32) * brightness_mult, 0, 255)

    background = reveal_bgr.astype(np.float32)

    # Ombre de contact : masque de la page, erode + flou, decale vers la charniere (droite),
    # assombrit le fond juste avant que la page ne le recouvre.
    mask_u8 = (mask * 255).astype(np.uint8)
    shadow_src = cv2.erode(mask_u8, np.ones((9, 9), np.uint8))
    shift = int(25 * math.sin(theta))
    shadow_shifted = np.zeros_like(shadow_src)
    if shift > 0 and shift < WIDTH:
        shadow_shifted[:, shift:] = shadow_src[:, :-shift]
    else:
        shadow_shifted = shadow_src
    shadow_blur = cv2.GaussianBlur(shadow_shifted, (41, 41), 0).astype(np.float32) / 255.0
    shadow_strength = 0.35 * math.sin(theta)
    background = background * (1 - shadow_strength * shadow_blur[..., np.newaxis])

    mask_3c = mask[..., np.newaxis]
    out = background * (1 - mask_3c) + warped * mask_3c

    # Liseret de lumiere sur le bord libre qui se courbe (gradient le long du contour gauche du masque).
    edge = cv2.Canny(mask_u8, 50, 150).astype(np.float32) / 255.0
    edge = cv2.GaussianBlur(edge, (5, 5), 0)
    highlight_strength = 60.0 * math.sin(theta)
    out = out + (edge[..., np.newaxis] * highlight_strength)

    return np.clip(out, 0, 255).astype(np.uint8)


def _read_one(cap: cv2.VideoCapture, path: Path) -> np.ndarray:
    ok, frame = cap.read()
    if not ok:
        raise RuntimeError(f"Fin de flux inattendue en lisant {path}")
    if frame.shape[1] != WIDTH or frame.shape[0] != HEIGHT:
        frame = cv2.resize(frame, (WIDTH, HEIGHT), interpolation=cv2.INTER_LANCZOS4)
    return frame


def render(page_clip: Path, reveal_clip: Path, out_dir: Path, n_frames: int = N_FRAMES) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob("frame_*.png"):
        old.unlink()

    page_cap = cv2.VideoCapture(str(page_clip), cv2.CAP_FFMPEG)
    reveal_cap = cv2.VideoCapture(str(reveal_clip), cv2.CAP_FFMPEG)

    paths = []
    try:
        for i in range(n_frames):
            page_frame = _read_one(page_cap, page_clip)
            reveal_frame = _read_one(reveal_cap, reveal_clip)

            t = i / (n_frames - 1)
            t2 = smoothstep(t)
            theta = math.radians(t2 * MAX_THETA_DEG)
            frame = composite_frame(page_frame, reveal_frame, theta, t2)

            out_path = out_dir / f"frame_{i + 1:04d}.png"
            cv2.imwrite(str(out_path), frame)
            paths.append(out_path)
            print(f"  frame {i + 1}/{n_frames} theta={math.degrees(theta):.1f}deg")

            del page_frame, reveal_frame, frame
            gc.collect()
    finally:
        page_cap.release()
        reveal_cap.release()

    return paths


if __name__ == "__main__":
    ensure_dirs()
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", type=Path, required=True, help="clip source de la page qui se tourne")
    parser.add_argument("--reveal", type=Path, required=True, help="clip revele sous la page")
    parser.add_argument("--out", type=Path, default=WORK / "transition_frames")
    args = parser.parse_args()

    render(args.page, args.reveal, args.out)
    print(f"Images de transition ecrites dans {args.out}")
