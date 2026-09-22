import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { DateField } from "@/shared/ui/DateInput";
import { Input } from "@/shared/ui/Input";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const EyesEntSection: React.FC = () => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field noteKey="complications.eyes">
        <fieldset className={styles.fieldset}>
          <legend>👁 Глаза</legend>

          <YesNo
            label="Снижение зрения?"
            name="complications.eyes.visionLoss"
            register={register}
          />

          {watch("complications.eyes.visionLoss") === true && (
            <>
              <Input
                label="Когда началось снижение зрения?"
                {...register("complications.eyes.visionLossStart")}
              />

              <Input
                label="За какой промежуток времени (авторасчёт)"
                {...register("complications.eyes.visionLossDuration")}
                readOnly
              />

              <YesNo
                label="Хорошо ли видите ночью?"
                name="complications.eyes.nightVisionGood"
                register={register}
              />
            </>
          )}

          <DateField
            label="Дата последнего осмотра глазного дна"
            name="complications.eyes.lastFundusExamDate"
            watch={watch}
            setValue={setValue}
          />

          <label>
            <input
              type="checkbox"
              {...register("complications.eyes.lastFundusExamUnknown")}
            />{" "}
            Затрудняюсь ответить
          </label>

          <YesNo
            label="Никталопия («куриная слепота») — плохо видите ночью?"
            name="complications.eyes.nyctalopia"
            register={register}
          />

          <YesNo
            label="Замедленная адаптация к темноте?"
            name="complications.eyes.delayedDarkAdaptation"
            register={register}
          />

          <YesNo
            label="Появляются ли мушки/сетка перед глазами?"
            name="complications.eyes.floaters"
            register={register}
          />

          {watch("complications.eyes.floaters") === true && (
            <div className={styles.radioGroup}>
              <label>При каких условиях?</label>

              <label>
                <input
                  type="radio"
                  value="bp"
                  {...register("complications.eyes.floatersWhen")}
                />{" "}
                Повышение АД
              </label>

              <label>
                <input
                  type="radio"
                  value="glucose"
                  {...register("complications.eyes.floatersWhen")}
                />{" "}
                Повышение глюкозы
              </label>
            </div>
          )}

          <YesNo
            label="Выпадение боковых полей зрения (например, за рулём)?"
            name="complications.eyes.visualFieldLoss"
            register={register}
          />

          <Input
            label="Как часто наблюдаетесь у офтальмолога?"
            {...register("complications.eyes.ophthalmologistFrequency")}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.nose">
        <fieldset className={styles.fieldset}>
          <legend>👃 Нос (в разработке)</legend>

          <YesNo
            label="Храп"
            name="complications.nose.snoring"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.ears">
        <fieldset className={styles.fieldset}>
          <legend>👂 Уши</legend>

          <YesNo
            label="Снижение слуха?"
            name="complications.ears.hearingLoss"
            register={register}
          />

          {watch("complications.ears.hearingLoss") === true && (
            <>
              <Input
                label="Когда началось снижение слуха?"
                {...register("complications.ears.hearingLossStart")}
              />

              <Input
                label="За какой промежуток времени"
                {...register("complications.ears.hearingLossDuration")}
              />
            </>
          )}

          <DateField
            label="Дата последнего осмотра ЛОРа"
            name="complications.ears.lastEntExamDate"
            watch={watch}
            setValue={setValue}
          />
        </fieldset>
      </Field>
    </>
  );
};
