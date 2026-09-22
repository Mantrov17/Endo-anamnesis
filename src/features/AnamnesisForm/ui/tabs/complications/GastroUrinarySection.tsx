import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/shared";
import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";
import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const GastroUrinarySection: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <>
      <Field noteKey="complications.gastrointestinal">
        <fieldset className={styles.fieldset}>
          <legend>🫃 ЖКТ</legend>

          <YesNo
            label="Гастрит"
            name="complications.gastrointestinal.gastritis"
            register={register}
          />

          <YesNo
            label="Язвы"
            name="complications.gastrointestinal.ulcers"
            register={register}
          />

          <YesNo
            label="Боли в животе после еды?"
            name="complications.gastrointestinal.abdominalPainAfterEating"
            register={register}
          />

          <label>Провоцирующие факторы болей в животе:</label>

          <label>
            <input
              type="checkbox"
              {...register("complications.gastrointestinal.painTriggerFatty")}
            />{" "}
            Жирная пища
          </label>

          <label>
            <input
              type="checkbox"
              {...register("complications.gastrointestinal.painTriggerAlcohol")}
            />{" "}
            Алкоголь
          </label>

          <Textarea
            label="Частота стула"
            {...register("complications.gastrointestinal.stoolFrequency")}
            rows={2}
          />

          <label>Оформленность кала (0 = диарея, 5 = норма, 10 = запор)</label>

          <input
            type="range"
            min={0}
            max={10}
            step={1}
            {...register("complications.gastrointestinal.stoolConsistency")}
            className={styles.slider}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.urinary">
        <fieldset className={styles.fieldset}>
          <legend>🚽 Мочевыделительная система</legend>

          <YesNo
            label="Камни в почках?"
            name="complications.urinary.kidneyStones"
            register={register}
          />
        </fieldset>
      </Field>
    </>
  );
};
