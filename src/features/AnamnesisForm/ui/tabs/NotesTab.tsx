import React from "react";
import { Textarea } from "@/shared/ui/Textarea";
import styles from "./styles.module.scss";

export const NotesTab: React.FC<{ register: any }> = ({ register }) => {
  return (
    <div className={styles.section}>
      <h3>Дополнительные заметки</h3>
      <Textarea
        label="Здесь можно добавить любую информацию, не попавшую в структурированные поля"
        {...register("notes")}
        rows={10}
        placeholder="Например: особенности течения, сопутствующие заболевания, аллергии, примечания к терапии и т.д."
      />
    </div>
  );
};
