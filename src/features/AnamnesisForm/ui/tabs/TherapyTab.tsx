import React from "react";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { RadioGroup } from "@/shared/ui/RadioGroup";
import { Fieldset } from "@/shared/ui/Fieldset";
import styles from "./styles.module.scss";

interface TherapyTabProps {
  register: any;
  errors: any;
  watch: any;
}

export const TherapyTab: React.FC<TherapyTabProps> = ({ register, watch }) => {
  const carbCounting = watch("therapy.carbCounting");

  return (
    <div className={styles.section}>
      <h3>Терапия</h3>
      <Fieldset legend="Сахаропонижающие препараты (кроме инсулина)">
        <div className={styles.drugGroup}>
          <Input
            label="Название"
            {...register("therapy.currentDrugs.0.name")}
          />
          <Input label="Доза" {...register("therapy.currentDrugs.0.dose")} />
        </div>
      </Fieldset>
      <Fieldset legend="Базальный инсулин">
        <div className={styles.drugGroup}>
          <Input
            label="Название"
            {...register("therapy.basalInsulin.0.name")}
          />
          <Input label="Доза" {...register("therapy.basalInsulin.0.dose")} />
        </div>
      </Fieldset>
      <Fieldset legend="Прандиальный (болюсный) инсулин">
        <div className={styles.drugGroup}>
          <Input
            label="Название"
            {...register("therapy.prandialInsulin.0.name")}
          />
          <Input label="Доза" {...register("therapy.prandialInsulin.0.dose")} />
        </div>
      </Fieldset>
      <RadioGroup
        name="therapy.carbCounting"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет" },
        ]}
        label="Используется ли подсчёт углеводов?"
      />
      {carbCounting === "true" && (
        <Input
          label="Углеводный коэффициент"
          {...register("therapy.carbRatio")}
        />
      )}
      <Textarea
        label="Места инъекций"
        {...register("therapy.injectionSites")}
        rows={2}
      />
      <Textarea
        label="Как часто меняете иглу шприца для инсулина?"
        {...register("therapy.needleChangeFrequency")}
        rows={2}
      />
      <Textarea
        label="Соблюдение методики введения"
        {...register("therapy.injectionTechnique")}
        rows={2}
      />
      <Textarea
        label="Как часто меняете место для инъекций?"
        {...register("therapy.siteChangeFrequency")}
        rows={2}
      />
      <RadioGroup
        name="therapy.lipohypertrophy"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет" },
        ]}
        label="Наличие липогипертрофии"
      />
    </div>
  );
};
