import React from "react";

import { Button } from "@/shared/ui/Button";
import { Heading } from "@/shared/ui/Heading";

import styles from "../styles.module.scss";

interface PatientsHeaderProps {
  onAddPatient: () => void;
  onDownloadBackup: () => void;
}

export const PatientsHeader: React.FC<PatientsHeaderProps> = ({
  onAddPatient,
  onDownloadBackup,
}) => {
  return (
    <div className={styles.header}>
      <Heading level={1} variant="page" className={styles.pageTitle}>
        Пациенты
      </Heading>

      <div className={styles.headerButtons}>
        <Button onClick={onAddPatient} variant="primary">
          + Добавить пациента
        </Button>

        <Button onClick={onDownloadBackup} variant="secondary">
          💾 Скачать бэкап
        </Button>
      </div>
    </div>
  );
};
