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

      <Textarea
        label="Как часто происходит самоконтроль глюкозы?"
        {...register("selfMonitoring.frequency")}
        rows={2}
      />

      <YesNo
        label="В одно и то же время?"
        name="selfMonitoring.sameTime"
        register={register}
      />

      {watch("selfMonitoring.sameTime") === false && (
        <Textarea
          label="Поясните"
          {...register("selfMonitoring.ifNotSameTimeReason")}
          rows={2}
        />
      )}

      <YesNo
        label="Ведение дневника"
        name="selfMonitoring.diary"
        register={register}
      />

      <fieldset className={styles.fieldset}>
        <legend>Для СД 1 типа</legend>

        <Input
          label="Как часто меняете иглу (например, после каждой инъекции)"
          {...register("selfMonitoring.needleChangeFrequency")}
        />

        <Input
          label="Как часто меняете место инъекции"
          {...register("selfMonitoring.siteChangeFrequency")}
        />

        <Input
          label="Сколько см отступаете (не менее 1–2 см)"
          {...register("selfMonitoring.injectionSiteDistance")}
        />
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Для СД 1 и 2 типа</legend>

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

        <label>
          <input
            type="checkbox"
            {...register("selfMonitoring.lastDoctorVisitUnknown")}
          />{" "}
          Затрудняюсь ответить
        </label>
      </fieldset>

      <Field
        noteKey="selfMonitoring.general"
        noteLabel="Примечание по самоконтролю"
      >
        <div />
      </Field>
    </div>
  );
};
