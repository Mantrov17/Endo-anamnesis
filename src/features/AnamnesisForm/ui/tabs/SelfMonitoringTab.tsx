import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../Field";

import { YesNo } from "../YesNo";

import styles from "../styles.module.scss";

export const SelfMonitoringTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Самоконтроль</h3>

      <div className={styles.radioGroup}>
        <label>Частота самоконтроля гликемии</label>

        <label>
          <input
            type="radio"
            value="regular"
            {...register("selfMonitoring.frequencyRegularity")}
          />{" "}
          Регулярно
        </label>

        <label>
          <input
            type="radio"
            value="irregular"
            {...register("selfMonitoring.frequencyRegularity")}
          />{" "}
          Нерегулярно
        </label>
      </div>

      <Textarea
        label="Уточните частоту самоконтроля"
        placeholder="Например: 8–12 раз в сутки"
        {...register("selfMonitoring.frequency")}
        rows={2}
      />

      <YesNo
        label="Ведение дневника"
        name="selfMonitoring.diary"
        register={register}
      />

      <YesNo
        label="Имеется ли глюкометр?"
        name="selfMonitoring.hasGlucometer"
        register={register}
      />

      {watch("selfMonitoring.hasGlucometer") === true && (
        <YesNo
          label="Производилась ли калибровка?"
          name="selfMonitoring.calibrationDone"
          register={register}
        />
      )}

      <Input
        label="Когда последний раз были у врача на диспансеризации?"
        {...register("selfMonitoring.lastDoctorVisit")}
      />

      <label className={styles.smallCheckbox}>
        <input
          type="checkbox"
          {...register("selfMonitoring.lastDoctorVisitUnknown")}
        />{" "}
        Затрудняюсь ответить
      </label>

      <Field
        noteKey="selfMonitoring.general"
        noteLabel="Примечание по самоконтролю"
      >
        <div />
      </Field>
    </div>
  );
};
