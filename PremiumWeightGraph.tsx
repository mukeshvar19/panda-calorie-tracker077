import React, { useMemo, useState } from "react";

export type PremiumWeightPoint = { date: string; weight: number };

export function PremiumWeightGraph({ data }: { data: PremiumWeightPoint[] }) {
  const [active, setActive] = useState<number | null>(null);

  const points = useMemo(() => {
    if (!data.length) return [];
    const values = data.map((d) => d.weight);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = Math.max((max - min) * 0.25, 0.8);
    const lo = min - pad;
    const hi = max + pad;

    return data.map((d, i) => ({
      ...d,
      x: data.length === 1 ? 50 : (i / (data.length - 1)) * 94 + 3,
      y: 88 - ((d.weight - lo) / (hi - lo)) * 68,
    }));
  }, [data]);

  if (!data.length) {
    return <div className="premiumWeightEmpty">Add a weight entry to see your progress.</div>;
  }

  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `3,92 ${line} 97,92`;

  return (
    <div className="premiumWeightGraph">
      <div className="premiumWeightChart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Weight progress graph">
          <defs>
            <linearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopOpacity=".24" />
              <stop offset="100%" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="weightArea" d={`M ${area.replace(/ /g, " L ")}`} />
          <polyline className="weightGridLine" points="3,20 97,20" />
          <polyline className="weightGridLine" points="3,45 97,45" />
          <polyline className="weightGridLine" points="3,70 97,70" />
          <polyline className="weightLineGlow" points={line} />
          <polyline className="weightLine" points={line} pathLength="1" />
          {points.map((p, i) => (
            <g key={p.date} onClick={() => setActive(i)} className="weightPointGroup">
              <circle className="weightPointHalo" cx={p.x} cy={p.y} r="3.2" />
              <circle className="weightPoint" cx={p.x} cy={p.y} r="1.45" />
            </g>
          ))}
        </svg>

        {active !== null && (
          <div
            className="weightTooltip"
            style={{ left: `${points[active].x}%`, top: `${points[active].y}%` }}
          >
            <strong>{points[active].weight.toFixed(1)} kg</strong>
            <span>{points[active].date}</span>
          </div>
        )}
      </div>

      <div className="premiumWeightLabels">
        <span>{data[0].date.slice(5)}</span>
        <span>{data[data.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}
