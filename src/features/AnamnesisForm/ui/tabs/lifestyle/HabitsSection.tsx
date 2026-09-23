import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const HabitsSection: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const smoking = watch("lifestyle.smoking");

  return (
    <>
      <Field noteKey="lifestyle.alcohol">
        <fieldset className={styles.fieldset}>
          <legend>Алкоголь</legend>

          <Textarea
            label="Как часто употребляете алкоголь?"
            {...register("lifestyle.alcoholFrequency")}
            rows={2}
          />

          <Input
            label="Тип (крепкий / вино / пиво и т.п.)"
            {...register("lifestyle.alcoholType")}
          />
        </fieldset>
      </Field>

      <Field noteKey="lifestyle.smoking">
        <fieldset className={styles.fieldset}>
          <legend>Курение</legend>

          <YesNo label="Курите?" name="lifestyle.smoking" register={register} />

          {smoking === true && (
            <>
              <Input
                label="С какого возраста?"
                type="number"
                suffix="лет"
                {...register("lifestyle.smokingStartAge")}
              />

              <Input
                label="Сколько сигарет в день?"
                type="number"
                suffix="шт."
                {...register("lifestyle.cigarettesPerDay")}
              />
            </>
          )}
        </fieldset>
      </Field>

      <Field noteKey="lifestyle.nutrition">
        <fieldset className={styles.fieldset}>
          <legend>Питание</legend>

          <YesNo
            label="Пищу подсаливаете?"
            name="lifestyle.saltFood"
            register={register}
          />

          <YesNo
            label="Много полуфабрикатов (колбаса, сосиски, копчёности, орешки, маринованные овощи, рыбные консервы, соевый соус, кетчуп)"
            name="lifestyle.processedFood"
            register={register}
          />

          <Input
            label="Сколько чашек кофе в день?"
            type="number"
            suffix="чаш."
            {...register("lifestyle.coffeeCupsPerDay")}
          />

          <YesNo
            label="Кофе крепкий?"
            name="lifestyle.strongCoffee"
            register={register}
          />

          <YesNo
            label="Энергетики"
            name="lifestyle.energyDrinks"
            register={register}
          />
        </fieldset>
      </Field>
    </>
  );
};
