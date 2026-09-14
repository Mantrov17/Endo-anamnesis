import React from "react";
import {
  useFieldArray,
  type Control,
  type FieldArrayPath,
  type Path,
  type UseFormRegister,
} from "react-hook-form";
import { Input } from "@/shared/ui/Input";
import type { AnamnesisFormData } from "@/shared";
import styles from "./styles.module.scss";

export type DrugArrayPath =
  | "type1Diabetes.initialTherapy"
  | "type2Diabetes.initialTherapy"
  | "therapy.currentDrugs"
  | "therapy.basalInsulin"
  | "therapy.prandialInsulin"
  | "actualTherapy.basalInsulin"
  | "actualTherapy.bolusInsulin";

interface DrugListProps {
  control: Control<AnamnesisFormData>;
  register: UseFormRegister<AnamnesisFormData>;
  name: DrugArrayPath;
  firstField: "drugName" | "name";
  nameLabel?: string;
}

export const DrugList: React.FC<DrugListProps> = ({
  control,
  register,
  name,
  firstField,
  nameLabel = "Название",
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as FieldArrayPath<AnamnesisFormData>,
  });

  const addRow = () => {
    if (firstField === "drugName") {
      append({ drugName: "", dose: "" } as never);
    } else {
      append({ name: "", dose: "" } as never);
    }
  };

  return (
    <div className={styles.drugList}>
      {fields.map((field, index) => {
        const firstPath =
          `${name}.${index}.${firstField}` as Path<AnamnesisFormData>;
        const dosePath = `${name}.${index}.dose` as Path<AnamnesisFormData>;
        return (
          <div key={field.id} className={styles.drugRow}>
            <Input label={nameLabel} {...register(firstPath)} />
            <Input label="Доза" {...register(dosePath)} />
            {fields.length > 1 && (
              <button
                type="button"
                className={styles.removeDrugButton}
                onClick={() => remove(index)}
                title="Удалить препарат"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
      <button type="button" className={styles.addDrugButton} onClick={addRow}>
        + Добавить препарат
      </button>
    </div>
  );
};
