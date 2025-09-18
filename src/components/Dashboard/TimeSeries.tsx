import { Card, CardContent, CardHeader, useTheme, Box } from "@mui/material";
import type { FC } from "react";

export type TimePoint = { date: string; value: number };

type Props = {
  title: string;
  data: TimePoint[]; // fechas en formato YYYY-MM-DD
  height?: number;
};

const TimeSeries: FC<Props> = ({ title, data, height = 220 }) => {
  const theme = useTheme();

  // Dimensiones internas del gráfico (sistema de coordenadas virtual)
  const W = 1000;
  const H = height;
  const P = 40; // padding

  const n = data.length || 1;
  const maxY = Math.max(1, ...data.map((d) => d.value));

  const x = (i: number) => {
    if (n === 1) return P; // evitar NaN si hay un solo punto
    return P + (i * (W - 2 * P)) / (n - 1);
  };
  const y = (v: number) => H - P - (v / maxY) * (H - 2 * P);

  const lineD = data
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)},${y(p.value)}`)
    .join(" ");

  const areaD =
    data.length >= 2
      ? `M ${x(0)},${y(data[0].value)} ` +
        data.map((p, i) => `L ${x(i)},${y(p.value)}`).join(" ") +
        ` L ${x(n - 1)},${H - P} L ${x(0)},${H - P} Z`
      : "";

  // ticks del eje X (máximo 7)
  const tickCount = Math.min(7, n);
  const tickIdxs =
    tickCount > 1
      ? [...Array(tickCount)].map((_, i) =>
          Math.round((i * (n - 1)) / (tickCount - 1))
        )
      : [0];

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent sx={{ pt: 0 }}>
        <Box
          component="svg"
          viewBox={`0 0 ${W} ${H}`}
          sx={{ width: "100%", height }}
        >
          {/* Ejes */}
          <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#ccc" />
          <line x1={P} y1={P} x2={P} y2={H - P} stroke="#ccc" />

          {/* Rejilla horizontal (4 líneas) */}
          {[0, 1, 2, 3].map((k) => {
            const yy = P + ((k + 1) * (H - 2 * P)) / 5;
            return (
              <line key={k} x1={P} y1={yy} x2={W - P} y2={yy} stroke="#eee" />
            );
          })}

          {/* Área */}
          {data.length >= 2 && (
            <path d={areaD} fill={theme.palette.primary.light} opacity={0.15} />
          )}

          {/* Línea */}
          {data.length >= 1 && (
            <path
              d={lineD}
              fill="none"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
            />
          )}

          {/* Puntos */}
          {data.map((p, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(p.value)}
              r={3}
              fill={theme.palette.primary.main}
            />
          ))}

          {/* Ticks X */}
          {tickIdxs.map((idx) => (
            <text
              key={idx}
              x={x(idx)}
              y={H - P + 16}
              fontSize={12}
              textAnchor="middle"
              fill={theme.palette.text.secondary}
            >
              {data[idx]?.date?.slice(5)}
              {/* muestra MM-DD */}
            </text>
          ))}

          {/* Max label Y */}
          <text
            x={P - 8}
            y={y(maxY)}
            fontSize={11}
            textAnchor="end"
            fill={theme.palette.text.secondary}
          >
            {maxY}
          </text>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeSeries;
