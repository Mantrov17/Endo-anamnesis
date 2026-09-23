import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../Field";

import { YesNo } from "../YesNo";

import styles from "../styles.module.scss";

export const ExaminationTab: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Осмотр / общий анамнез</h3>

      <Field noteKey="examination.cardiovascularEvents">
        <Textarea
          label="Сердечно-сосудистые события (ИБС, инсульт), АД"
          {...register("examination.cardiovascularEvents")}
          rows={2}
        />
      </Field>

      <Field noteKey="examination.otherChronicDiseases">
        <Textarea
          label="Другие хронические заболевания"
          {...register("examination.otherChronicDiseases")}
          rows={2}
        />
      </Field>

      <Field noteKey="examination.currentMedications">
        <Textarea
          label="Все текущие лекарства и добавки"
          {...register("examination.currentMedications")}
          rows={2}
        />
      </Field>

      <Field noteKey="examination.allergies">
        <Textarea
          label="Аллергия"
          {...register("examination.allergies")}
          rows={2}
        />
      </Field>

      <Field noteKey="examination.hospitalizations">
        <Textarea
          label="Госпитализации и операции"
          {...register("examination.hospitalizations")}
          rows={2}
        />
      </Field>

      <Field noteKey="examination.vaccinations">
        <Textarea
          label="Вакцинация"
          {...register("examination.vaccinations")}
          rows={2}
        />
      </Field>

      <YesNo
        label="Заболевания щитовидной железы (аутииммунный тиреоидит)"
        name="examination.thyroidDisease"
        register={register}
      />

      <YesNo
        label="Целиакия"
        name="examination.celiacDisease"
        register={register}
      />

      <Field noteKey="examination.otherAutoimmune">
        <Textarea
          label="Другие аутоиммунные состояния (витилиго, надпочечниковая недостаточность и др.)"
          {...register("examination.otherAutoimmune")}
          rows={2}
        />
      </Field>

      <Field noteKey="examination.familyHistory">
        <Textarea
          label="Семейный анамнез СД 1 типа или других аутоиммунных заболеваний (родственники 1-й линии)"
          {...register("examination.familyHistory")}
          rows={2}
        />
      </Field>

      <Field noteKey="examination.reproductive">
        <fieldset className={styles.fieldset}>
          <legend>Репродуктивный анамнез (при необходимости)</legend>

          <Input
            label="Беременность"
            type="number"
            {...register("examination.pregnancies")}
          />

          <Input
            label="Роды"
            type="number"
            {...register("examination.births")}
          />

          <Textarea
            label="Менструальный цикл"
            {...register("examination.menstrualCycle")}
            rows={2}
          />
        </fieldset>
      </Field>
    </div>
  );
};
