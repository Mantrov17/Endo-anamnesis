import React from "react";

import { BigCircleSection } from "./heartFailure/BigCircleSection";
import { HeartFailureGeneralSection } from "./heartFailure/HeartFailureGeneralSection";
import { HepaticJugularSection } from "./heartFailure/HepaticJugularSection";
import { NyhaSection } from "./heartFailure/NyhaSection";
import { SmallCircleSection } from "./heartFailure/SmallCircleSection";

import styles from "../styles.module.scss";

export const HeartFailureTab: React.FC = () => {
  return (
    <div className={styles.section}>
      <h3>ХСН</h3>

      <HeartFailureGeneralSection />
      <SmallCircleSection />
      <BigCircleSection />
      <HepaticJugularSection />
      <NyhaSection />
    </div>
  );
};
