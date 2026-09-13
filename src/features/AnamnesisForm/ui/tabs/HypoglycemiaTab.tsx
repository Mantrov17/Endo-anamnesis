import React from "react";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { RadioGroup } from "@/shared/ui/RadioGroup";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Fieldset } from "@/shared/ui/Fieldset";
import styles from "./styles.module.scss";

export const HypoglycemiaTab: React.FC<{ register: any; errors: any }> = ({
  register,
}) => {
  return (
    <div className={styles.section}>
      <h3>Гипогликемии</h3>
      <Input
        label="Частота гипогликемий (эпизодов в неделю)"
        type="number"
        {...register("hypoglycemia.frequencyPerWeek")}
      />
      <Fieldset legend="Тяжёлые эпизоды">
        <Input
          label="Количество"
          type="number"
          {...register("hypoglycemia.severeEpisodes.count")}
        />
        <Input
          label="Когда (дата/период)"
          {...register("hypoglycemia.severeEpisodes.when")}
        />
        <Textarea
          label="Клиника"
          {...register("hypoglycemia.severeEpisodes.clinic")}
          rows={2}
        />
      </Fieldset>
      <RadioGroup
        name="hypoglycemia.awarenessPreserved"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет (нарушено восприятие)" },
        ]}
        label="Сохранено ли распознавание гипогликемии?"
      />
      <Fieldset legend="Типичные провоцирующие факторы">
        <Checkbox
          name="hypoglycemia.provokingFactors.physicalActivity"
          register={register}
          label="Физическая нагрузка"
        />
        <Checkbox
          name="hypoglycemia.provokingFactors.missedMeal"
          register={register}
          label="Пропуск еды"
        />
        <Checkbox
          name="hypoglycemia.provokingFactors.alcohol"
          register={register}
          label="Алкоголь"
        />
      </Fieldset>
      <RadioGroup
        name="hypoglycemia.hasGlucagon"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет" },
        ]}
        label="Есть ли дома глюкагон, обучены ли близкие его введению?"
      />
      <RadioGroup
        name="hypoglycemia.nocturnalHypoglycemia"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет" },
        ]}
        label="Ночные гипогликемии"
      />
    </div>
  );
};
