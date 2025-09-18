import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import type { FC } from "react";

export type TopItem = {
  label: string;
  value: number;
};

type Props = {
  title: string;
  items: TopItem[];
  limit?: number; // cuántos mostrar
};

const TopBars: FC<Props> = ({ title, items, limit = 8 }) => {
  const theme = useTheme();
  const data = (items ?? []).slice(0, limit);
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {data.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Sin datos para mostrar
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {data.map((it, idx) => {
              const pct = Math.round((it.value / max) * 100);
              return (
                <Box key={`${it.label}-${idx}`}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" noWrap sx={{ maxWidth: "70%" }}>
                      {it.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {it.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: 8,
                      width: "100%",
                      borderRadius: 999,
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? "rgba(0,0,0,0.08)"
                          : "rgba(255,255,255,0.12)",
                      overflow: "hidden",
                    }}
                    aria-label={`${it.label}: ${it.value}`}
                    role="img"
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 999,
                        backgroundColor: theme.palette.primary.main,
                        transition: "width .3s ease",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TopBars;
