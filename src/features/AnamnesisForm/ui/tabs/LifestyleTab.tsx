import React from "react";

import { ChronicDiseasesSection } from "./lifestyle/ChronicDiseasesSection";
import { HabitsSection } from "./lifestyle/HabitsSection";
import { WorkStressSection } from "./lifestyle/WorkStressSection";

import styles from "../styles.module.scss";

export const LifestyleTab: React.FC = () => {
  return (
    <div className={styles.section}>
      <h3>Образ жизни</h3>

      <HabitsSection />
      <WorkStressSection />
      <ChronicDiseasesSection />
    </div>
  );
};
