import React from "react";

import { ArmBloodPressureSection } from "./measurements/ArmBloodPressureSection";
import { LegBloodPressureSection } from "./measurements/LegBloodPressureSection";
import { PulseSection } from "./measurements/PulseSection";
import { RepeatBloodPressureSection } from "./measurements/RepeatBloodPressureSection";

import styles from "../styles.module.scss";

export const MeasurementsTab: React.FC = () => {
  return (
    <div className={styles.section}>
      <h3>Измерения</h3>

      <PulseSection />
      <ArmBloodPressureSection />
      <LegBloodPressureSection />
      <RepeatBloodPressureSection />
    </div>
  );
};
