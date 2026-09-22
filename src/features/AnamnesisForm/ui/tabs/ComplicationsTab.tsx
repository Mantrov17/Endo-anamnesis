import React from "react";

import { EyesEntSection } from "./complications/EyesEntSection";
import { GastroUrinarySection } from "./complications/GastroUrinarySection";
import { NephropathySection } from "./complications/NephropathySection";
import { NeuropathyMainSection } from "./complications/NeuropathyMainSection";
import { NeuropathySensitivitySection } from "./complications/NeuropathySensitivitySection";
import { NeuropathyVeinsSection } from "./complications/NeuropathyVeinsSection";

import styles from "../styles.module.scss";

export const ComplicationsTab: React.FC = () => {
  return (
    <div className={styles.section}>
      <h3>Осложнения</h3>

      <EyesEntSection />
      <GastroUrinarySection />
      <NephropathySection />
      <NeuropathyMainSection />
      <NeuropathySensitivitySection />
      <NeuropathyVeinsSection />
    </div>
  );
};
