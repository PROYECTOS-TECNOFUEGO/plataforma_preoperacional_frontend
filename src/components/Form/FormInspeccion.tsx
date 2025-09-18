// src/components/Form/FormInspeccion.tsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  titulo: string;
  nombreEstado: string;
  items: string[];
  valores: Record<string, string>;
  onChange: (item: string, value: string) => void;
  errores?: Record<string, string>;
  disabled?: boolean;
}

const FormInspeccion: React.FC<Props> = React.memo(
  ({
    titulo,
    nombreEstado,
    items,
    valores,
    onChange,
    errores = {},
    disabled,
  }) => {
    const options = [
      { value: "C", label: "Cumple" },
      { value: "NC", label: "No cumple" },
      { value: "NA", label: "No aplica" },
    ];

    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>{titulo} *</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ítem</TableCell>
                  {options.map((opt) => (
                    <TableCell key={opt.value} align="center">
                      {opt.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const error = errores[`${nombreEstado}.${item}`];
                  return (
                    <TableRow key={item}>
                      <TableCell>
                        <Typography>{item}</Typography>
                        {error && (
                          <Typography
                            variant="caption"
                            color="error"
                            display="block"
                          >
                            {error}
                          </Typography>
                        )}
                      </TableCell>
                      {options.map((opt) => (
                        <TableCell key={opt.value} align="center">
                          <Radio
                            checked={valores[item] === opt.value}
                            onChange={() => onChange(item, opt.value)}
                            value={opt.value}
                            disabled={disabled}
                            inputProps={{ "aria-label": opt.label }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );
  }
);

FormInspeccion.displayName = "FormInspeccion";

export default FormInspeccion;
