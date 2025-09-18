// src/components/FormStepper.tsx
import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

type Props = {
  activeStep: number;
  labels?: string[];
};

const FormStepper: React.FC<Props> = ({
  activeStep,
  labels = ["Datos", "Relevo", "Confirmación", "Resumen"],
}) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
      {labels.map((l) => (
        <Step key={l}>
          <StepLabel>{l}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default FormStepper;
