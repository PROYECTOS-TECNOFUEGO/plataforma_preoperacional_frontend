import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode; // botones, búsqueda, etc.
}

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
      }}
      aria-label={`Sección ${title}`}
    >
      <Box>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{actions}</Box>
      )}
    </Box>
  );
}
