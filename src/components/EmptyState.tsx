//src/components/Common/EmptyState.tsx
import { Box, Typography, Icon } from "@mui/material";

export default function EmptyState({
  text = "Sin resultados",
}: {
  text?: string;
}) {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        color: "text.secondary",
        display: "grid",
        placeItems: "center",
      }}
      role="status"
      aria-live="polite"
    >
      <Icon sx={{ fontSize: 40, mb: 1 }}>inbox</Icon>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
}
