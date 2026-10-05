import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { YesNo } from "../YesNo";

import { PrimaryOverviewSection } from "./primary/PrimaryOverviewSection";

import { Type1DiabetesSection } from "./primary/Type1DiabetesSection";

import { Type2DiabetesSection } from "./primary/Type2DiabetesSection";

import { ActualTherapySection } from "./therapy/ActualTherapySection";

import { Type1InitialTherapySection } from "./therapy/Type1InitialTherapySection";

import { Type1InjectionSitesSection } from "./therapy/Type1InjectionSitesSection";

import { Type2AdherenceSection } from "./therapy/Type2AdherenceSection";

import { Type2InitialTherapySection } from "./therapy/Type2InitialTherapySection";

import styles from "../styles.module.scss";

export const PrimaryTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const birthDate = watch("birthDate");

  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");

  const isType1 = suspectedDiagnosis === "type1";

  const isType2 = suspectedDiagnosis === "type2";

  const type1Data = watch("type1Diabetes");

  const type2Data = watch("type2Diabetes");

  const hasSelectedDiagnosis =
    (isType1 && Boolean(type1Data)) || (isType2 && Boolean(type2Data));

  return (
    <>
      <PrimaryOverviewSection />

      {isType1 && type1Data && <Type1DiabetesSection />}

      {isType2 && type2Data && <Type2DiabetesSection />}

      {hasSelectedDiagnosis && (
        <div className={styles.section}>
          <h3>Терапия</h3>

          <Input
            label="Целевой уровень гликированного гемоглобина"
            suffix="%"
            placeholder={
              birthDate ? undefined : "Укажите дату рождения пациента"
            }
            {...register("therapy.targetHba1c")}
            readOnly
            disabled={!birthDate}
          />

          {!birthDate && (
            <div className={styles.warning}>
              Целевой HbA1c не рассчитан, потому что дата рождения пациента не
              указана. Укажите дату рождения в карточке пациента.
            </div>
          )}

          {isType1 && type1Data && (
            <>
              <YesNo
                label="Вы обратились к эндокринологу после обнаружения повышенного результата?"
                name="type1Diabetes.investigatedAfterDetection"
                register={register}
              />

              <Type1InitialTherapySection />
            </>
          )}

          {isType2 && type2Data && (
            <>
              <YesNo
                label="Вы обратились к эндокринологу после обнаружения повышенного результата?"
                name="type2Diabetes.investigatedAfterDetection"
                register={register}
              />

              <Type2InitialTherapySection />
            </>
          )}

          <ActualTherapySection />

          {isType1 && type1Data && <Type1InjectionSitesSection />}

          {isType2 && type2Data && <Type2AdherenceSection />}
        </div>
      )}
    </>
  );
};
