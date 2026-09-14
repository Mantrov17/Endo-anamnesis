import React from "react";
import { Input } from "@/shared/ui/Input";
import { Field } from "../Field";
import type { TabProps } from "./types";
import styles from "../styles.module.scss";

export const H2FPEFTab: React.FC<TabProps> = ({ register, watch }) => {
  const totalScore = watch("h2fpef.totalScore") ?? 0;

  return (
    <div className={styles.section}>
      <h3>Шкала H2FPEF</h3>
      <label>
        <input type="checkbox" {...register("h2fpef.obesityBMI30")} /> Ожирение
        ИМТ &gt;30 кг/см² (2 балла)
      </label>
      <label>
        <input type="checkbox" {...register("h2fpef.hypertension2Drugs")} /> АГ,
        приём &gt;2 АП (1 балл)
      </label>
      <label>
        <input type="checkbox" {...register("h2fpef.atrialFibrillation")} />{" "}
        Фибрилляция предсердий (3 балла)
      </label>
      <label>
        <input type="checkbox" {...register("h2fpef.pulmonaryHypertension")} />{" "}
        Лёгочная гипертензия СДЛА &gt;35 мм рт.ст. (1 балл)
      </label>
      <Input
        label="СДЛА"
        type="number"
        suffix="мм рт. ст."
        {...register("h2fpef.pulmonaryHypertensionValue")}
      />
      <label>
        <input type="checkbox" {...register("h2fpef.elderly60")} /> Возраст
        &gt;60 лет (1 балл)
      </label>
      <label>
        <input type="checkbox" {...register("h2fpef.fillingPressure")} />{" "}
        Давление наполнения E/e' &gt;9 (1 балл)
      </label>
      <Input
        label="E/e'"
        type="number"
        step="0.1"
        {...register("h2fpef.fillingPressureValue")}
      />

      <div className={styles.totalScore}>
        Сумма баллов: <strong>{totalScore}</strong>
        <div>
          {totalScore >= 5 && "ХСНсФВ высоковероятна"}
          {totalScore >= 2 &&
            totalScore <= 4 &&
            "Промежуточный результат — требуется ДСТ или инвазивная оценка"}
          {totalScore <= 1 && "ХСНсФВ маловероятна"}
        </div>
      </div>

      <Field noteKey="h2fpef" noteLabel="Примечание по H2FPEF">
        <div />
      </Field>
    </div>
  );
};
