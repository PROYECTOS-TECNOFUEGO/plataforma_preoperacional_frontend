import type { FC } from "react";
import { Card, Box, Typography, Icon, Skeleton } from "@mui/material";

type Props = {
  icon: string;
  label: string;
  value: number | string;
  loading?: boolean;
  delta?: number | null; // % vs periodo anterior
};

const KpiCard: FC<Props> = ({ icon, label, value, loading, delta }) => {
  const deltaColor =
    delta == null
      ? "text.secondary"
      : delta > 0
      ? "success.main"
      : delta < 0
      ? "error.main"
      : "text.secondary";

  const deltaPrefix =
    delta == null ? "" : delta > 0 ? "▲ " : delta < 0 ? "▼ " : "• ";

  return (
    <Card sx={{ p: 2.5, borderRadius: 2 }}>
      {loading ? (
        <>
          <Skeleton width={120} height={24} />
          <Skeleton width={80} height={40} sx={{ mt: 1 }} />
          <Skeleton width={100} height={20} sx={{ mt: 1 }} />
        </>
      ) : (
        <>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Icon sx={{ fontSize: 20, color: "text.secondary" }}>{icon}</Icon>
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>

          {delta !== undefined && (
            <Typography variant="body2" sx={{ mt: 0.5, color: deltaColor }}>
              {delta == null
                ? "—"
                : `${deltaPrefix}${Math.abs(delta)}% vs. periodo anterior`}
            </Typography>
          )}
        </>
      )}
    </Card>
  );
};

export default KpiCard;
