import type { CSSProperties } from "react";

/**
 * Neige qui tombe en arrière-plan. Positions calculées de façon déterministe
 * (pas de Math.random) pour que le rendu serveur et le rendu client concordent.
 * Purement décoratif : masqué aux lecteurs d'écran et désactivé si le mouvement est réduit.
 */
const FLAKE_COUNT = 110;

const FLAKES = Array.from({ length: FLAKE_COUNT }, (_, i) => ({
  x: (i * 37 + i * i * 3) % 100,
  size: 3 + ((i * 13) % 5),
  duration: 8 + ((i * 7) % 8),
  delay: -((i * 11) % 12),
  drift: ((i * 17) % 40) - 20,
  opacity: 0.5 + ((i * 3) % 5) / 10,
}));

export function Snowfall() {
  return (
    <div aria-hidden="true" className="snowfall pointer-events-none absolute inset-0 overflow-hidden">
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={
            {
              "--x": `${f.x}%`,
              "--s": `${f.size}px`,
              "--d": `${f.duration}s`,
              "--delay": `${f.delay}s`,
              "--drift": `${f.drift}px`,
              "--o": f.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
