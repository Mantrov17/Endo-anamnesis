import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../Field";

import { YesNo } from "../YesNo";

import styles from "../styles.module.scss";

export const AdditionalTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Дополнительный анамнез</h3>

      <Field noteKey="additionalHistory.myocardialInfarction">
        <Input
          label="ИМ от (год)"
          {...register("additionalHistory.myocardialInfarction")}
        />
      </Field>

      <Field noteKey="additionalHistory.coronaryAngiography">
        <Input
          label="Коронароангиография"
          {...register("additionalHistory.coronaryAngiography")}
        />
      </Field>

      <Field noteKey="additionalHistory.stenting">
        <Input
          label="Стентирование"
          {...register("additionalHistory.stenting")}
        />
      </Field>

      <Field noteKey="additionalHistory.surgeries">
        <Textarea
          label="Операции"
          {...register("additionalHistory.surgeries")}
          rows={2}
        />
      </Field>

      <Input
        label="Аппендицит"
        {...register("additionalHistory.appendicitis")}
      />

      <Input
        label="Холецистит"
        {...register("additionalHistory.cholecystitis")}
      />

      <Input
        label="Туберкулёз"
        {...register("additionalHistory.tuberculosis")}
      />

      <Input label="ВИЧ" {...register("additionalHistory.hiv")} />

      <Input label="Гепатит" {...register("additionalHistory.hepatitis")} />

      <Input label="Сифилис" {...register("additionalHistory.syphilis")} />

      <Input label="Ковид (год)" {...register("additionalHistory.covidYear")} />

      <Field
        noteKey="additionalHistory.infections"
        noteLabel="Примечание по инфекциям / операциям"
      >
        <div />
      </Field>

      <Field noteKey="additionalHistory.allergies">
        <fieldset className={styles.fieldset}>
          <legend>Аллергии</legend>

          <Input
            label="На что?"
            {...register("additionalHistory.allergies.what")}
          />

          <Input
            label="Как проявляется?"
            {...register("additionalHistory.allergies.how")}
          />

          <YesNo
            label="Ангионевротический отёк был?"
            name="additionalHistory.allergies.angioedema"
            register={register}
          />

          {watch("additionalHistory.allergies.angioedema") === true && (
            <div className={styles.warning}>🚩 Запрет на приём иАПФ</div>
          )}
        </fieldset>
      </Field>

      <YesNo
        label="За пределы РФ не выезжали?"
        name="additionalHistory.travelOutsideRF"
        register={register}
      />

      <YesNo
        label="Контакт с больными?"
        name="additionalHistory.contactWithPatients"
        register={register}
      />

      <YesNo
        label="Укусы насекомых, животных"
        name="additionalHistory.insectAnimalBites"
        register={register}
      />

      <Field noteKey="additionalHistory.measurements">
        <fieldset className={styles.fieldset}>
          <legend>Измерения</legend>

          <div className={styles.row}>
            <Input
              label="Вес"
              type="number"
              step="0.1"
              suffix="кг"
              {...register("additionalHistory.weight")}
            />

            <Input
              label="Рост"
              type="number"
              suffix="см"
              {...register("additionalHistory.height")}
            />

            <Input
              label="Окружность живота"
              type="number"
              suffix="см"
              {...register("additionalHistory.abdominalCircumference")}
            />
          </div>
        </fieldset>
      </Field>
    </div>
  );
};
