import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { PrimaryOverviewSection } from "./primary/PrimaryOverviewSection";

import { Type1DiabetesSection } from "./primary/Type1DiabetesSection";

import { Type2DiabetesSection } from "./primary/Type2DiabetesSection";

export const PrimaryTab: React.FC = () => {
  const { watch } = useFormContext<AnamnesisFormData>();

  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");

  const isType1 = suspectedDiagnosis === "type1";

  const isType2 = suspectedDiagnosis === "type2";

  const type1Data = watch("type1Diabetes");

  const type2Data = watch("type2Diabetes");

  return (
    <>
      <PrimaryOverviewSection />

      {isType1 && type1Data && <Type1DiabetesSection />}

      {isType2 && type2Data && <Type2DiabetesSection />}
    </>
  );
};
