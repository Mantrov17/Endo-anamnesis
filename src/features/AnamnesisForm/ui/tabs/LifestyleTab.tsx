import React from "react";
import { Textarea } from "@/shared/ui/Textarea";
import { RadioGroup } from "@/shared/ui/RadioGroup";
import styles from "./styles.module.scss";

export const LifestyleTab: React.FC<{
  register: any;
  errors: any;
  watch: any;
}> = ({ register, watch }) => {
  const sameTime = watch("lifestyle.sameTime");

  return (
    <div className={styles.section}>
      <h3>Образ жизни</h3>
      <Textarea
        label="Как часто происходит самоконтроль глюкозы?"
        {...register("lifestyle.selfMonitoringFrequency")}
        rows={2}
      />
      <RadioGroup
        name="lifestyle.sameTime"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет" },
        ]}
        label="В одно и то же время?"
      />
      {sameTime === "false" && (
        <Textarea
          label="Поясните"
          {...register("lifestyle.ifNotSameTimeReason")}
          rows={2}
        />
      )}
      <RadioGroup
        name="lifestyle.diary"
        register={register}
        options={[
          { value: "true", label: "Да" },
          { value: "false", label: "Нет" },
        ]}
        label="Ведение дневника"
      />
    </div>
  );
};
