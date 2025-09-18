// src/components/Form/CamposGrid.tsx
import React from "react";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";

export interface Campo {
  label: string;
  value: string | number;
  set: (val: string) => void;
  type?: "text" | "number" | "date" | "time";
  err?: string;
  disabled?: boolean;
}

interface Props {
  items: Campo[];
}

const CamposGrid: React.FC<Props> = React.memo(({ items }) => {
  const commonProps = {
    fullWidth: true,
    margin: "normal" as const,
  };

  return (
    <Grid container spacing={2}>
      {items.map((campo, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
          <TextField
            {...commonProps}
            label={campo.label}
            type={campo.type || "text"}
            value={campo.value}
            onChange={(e) => campo.set(e.target.value)}
            error={!!campo.err}
            helperText={campo.err}
            disabled={campo.disabled}
            InputLabelProps={
              campo.type === "date" || campo.type === "time"
                ? { shrink: true }
                : undefined
            }
          />
        </Grid>
      ))}
    </Grid>
  );
});

CamposGrid.displayName = "CamposGrid";

export default CamposGrid;
