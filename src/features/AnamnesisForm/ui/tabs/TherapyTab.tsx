import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { ActualTherapySection } from "./therapy/ActualTherapySection";

import { Type1InitialTherapySection } from "./therapy/Type1InitialTherapySection";

import { Type1InjectionSitesSection } from "./therapy/Type1InjectionSitesSection";

import { Type2AdherenceSection } from "./therapy/Type2AdherenceSection";

import { Type2InitialTherapySection } from "./therapy/Type2InitialTherapySection";

import styles from "../styles.module.scss";

export const TherapyTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");

  const isType1 = suspectedDiagnosis === "type1";

  const isType2 = suspectedDiagnosis === "type2";

  const type1Data = watch("type1Diabetes");

  const type2Data = watch("type2Diabetes");

  return (
    <div className={styles.section}>
      <h3>Терапия</h3>

      <Input
        label="Целевой уровень гликированного гемоглобина"
        suffix="%"
        {...register("therapy.targetHba1c")}
        readOnly
      />

      {isType1 && type1Data && <Type1InitialTherapySection />}

      {isType2 && type2Data && <Type2InitialTherapySection />}

      <ActualTherapySection />

      {isType1 && type1Data && <Type1InjectionSitesSection />}

      {isType2 && <Type2AdherenceSection />}
    </div>
  );
};
