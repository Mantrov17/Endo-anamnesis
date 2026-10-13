import React from "react";

import { HyperaldosteronismSection } from "./secondaryAH/HyperaldosteronismSection";
import { HypercortisolismSection } from "./secondaryAH/HypercortisolismSection";
import { NeurovascularSection } from "./secondaryAH/NeurovascularSection";
import { OsasFamilyHistorySection } from "./secondaryAH/OsasFamilyHistorySection";
import { PheochromocytomaSection } from "./secondaryAH/PheochromocytomaSection";

import styles from "../styles.module.scss";

export const SecondaryAHTab: React.FC = () => {
  return (
    <div className={styles.section}>
      <h3>Вторичные АГ (исключение)</h3>

      <HyperaldosteronismSection />
      <NeurovascularSection />
      <PheochromocytomaSection />
      <HypercortisolismSection />
      <OsasFamilyHistorySection />
    </div>
  );
};
