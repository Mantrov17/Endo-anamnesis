import React from "react";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { RadioGroup } from "@/shared/ui/RadioGroup";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Fieldset } from "@/shared/ui/Fieldset";
import styles from "./styles.module.scss";

interface Type1TabProps {
  register: any;
  errors: any;
  watch: any;
}

export const Type1Tab: React.FC<Type1TabProps> = ({
  register,
  errors,
  watch,
}) => {
  const weightLoss = watch("type1Diabetes.classicSymptoms.weightLoss");
  const stillTaking = watch("type1Diabetes.stillTakingInitialTherapy");
  const autoantibodies = watch("type1Diabetes.autoantibodies");
  const anyAutoantibody = Object.values(autoantibodies || {}).some(Boolean);

  return (
    <div className={styles.section}>
      <h3>Дебют СД 1 типа</h3>
      <Input
        label="Возраст постановки диагноза (лет)"
        type="number"
        {...register("type1Diabetes.ageAtDiagnosis")}
        error={errors.type1Diabetes?.ageAtDiagnosis?.message}
        placeholder="Сколько вам было лет?"
      />
      <Input
        label="Год постановки диагноза"
        type="text"
        {...register("type1Diabetes.yearOfDiagnosis")}
        error={errors.type1Diabetes?.yearOfDiagnosis?.message}
        placeholder="Например: 2010"
      />
      <RadioGroup
        name="type1Diabetes.howDiagnosed"
        register={register}
        options={[
          { value: "accidental", label: "Случайная находка" },
          { value: "planned", label: "Плановый осмотр" },
          { value: "hospitalization", label: "Госпитализация" },
        ]}
        error={errors.type1Diabetes?.howDiagnosed?.message}
        label="Как был поставлен диагноз?"
      />
      <Textarea
        label="При каких обстоятельствах?"
        {...register("type1Diabetes.circumstances")}
        placeholder="Что послужило триггерным фактором?"
        rows={2}
      />
      <Input
        label="Уровень гликемии в дебюте (ммоль/л)"
        type="number"
        step="0.1"
        {...register("type1Diabetes.glycemiaAtOnset")}
        error={errors.type1Diabetes?.glycemiaAtOnset?.message}
      />
      <Fieldset legend="Классические симптомы при дебюте">
        <Checkbox
          name="type1Diabetes.classicSymptoms.polyuria"
          register={register}
          label="Полиурия"
        />
        <Checkbox
          name="type1Diabetes.classicSymptoms.polydipsia"
          register={register}
          label="Полидипсия"
        />
        <Checkbox
          name="type1Diabetes.classicSymptoms.weakness"
          register={register}
          label="Слабость"
        />
        <Checkbox
          name="type1Diabetes.classicSymptoms.weightLoss"
          register={register}
          label="Снижение веса"
        />
        {weightLoss && (
          <Input
            label="Примерная потеря веса (кг)"
            type="number"
            {...register("type1Diabetes.classicSymptoms.weightLossAmount")}
            error={
              errors.type1Diabetes?.classicSymptoms?.weightLossAmount?.message
            }
          />
        )}
      </Fieldset>
      <Textarea
        label="План дальнейшего обследования"
        {...register("type1Diabetes.furtherPlan")}
        placeholder="Вы обратились к эндокринологу после обнаружения повышенного результата?"
        rows={2}
      />
      <Fieldset legend="Терапия в дебюте">
        <div className={styles.drugGroup}>
          <Input
            label="Название препарата"
            {...register("type1Diabetes.initialTherapy.0.drugName")}
          />
          <Input
            label="Доза"
            {...register("type1Diabetes.initialTherapy.0.dose")}
          />
        </div>
      </Fieldset>
      <RadioGroup
        name="type1Diabetes.stillTakingInitialTherapy"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет" },
        ]}
        label="Данную терапию принимаете до сих пор?"
      />
      {stillTaking === "false" && (
        <Textarea
          label="Если нет, что изменилось?"
          {...register("type1Diabetes.ifNotTakingReason")}
          rows={2}
        />
      )}
      <Fieldset legend="Исследовались ли островковые аутоантитела?">
        <Checkbox
          name="type1Diabetes.autoantibodies.GAD"
          register={register}
          label="GAD"
        />
        <Checkbox
          name="type1Diabetes.autoantibodies.IA2"
          register={register}
          label="IA-2"
        />
        <Checkbox
          name="type1Diabetes.autoantibodies.ZnT8"
          register={register}
          label="ZnT8"
        />
        <Checkbox
          name="type1Diabetes.autoantibodies.IAA"
          register={register}
          label="IAA"
        />
        {anyAutoantibody && (
          <Textarea
            label="Результаты (текст)"
            {...register("type1Diabetes.autoantibodies.results")}
            rows={2}
          />
        )}
      </Fieldset>
      <Fieldset legend="C-пептид">
        <Input label="Значение" {...register("type1Diabetes.cPeptide.value")} />
        <Input
          label="Дата"
          type="date"
          {...register("type1Diabetes.cPeptide.date")}
        />
      </Fieldset>
      <Fieldset legend="Гликированный гемоглобин">
        <Input
          label="Значение (%)"
          type="number"
          step="0.1"
          {...register("type1Diabetes.hba1c.value")}
        />
        <Input
          label="Дата"
          type="date"
          {...register("type1Diabetes.hba1c.date")}
        />
      </Fieldset>
      <Input
        label="Привычные цифры глюкозы сейчас (ммоль/л)"
        type="number"
        step="0.1"
        {...register("type1Diabetes.usualGlucose")}
      />
    </div>
  );
};
