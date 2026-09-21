import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";

import { useAnamnesisForm } from "@/features/AnamnesisForm";
import type { AnamnesisFormData } from "@/shared";
import { Button } from "@/shared/ui/Button";

import {
  createType1DiabetesDefaults,
  createType2DiabetesDefaults,
} from "../lib/diabetesDefaults";
import { tabs, type TabId } from "../lib/tabs";
import {
  AdditionalTab,
  ComplicationsTab,
  ExaminationTab,
  H2FPEFTab,
  HeartFailureTab,
  HypoglycemiaTab,
  LifestyleTab,
  MeasurementsTab,
  PrimaryTab,
  SecondaryAHTab,
  SelfMonitoringTab,
  TherapyTab,
} from "./tabs";
import styles from "./styles.module.scss";

interface AnamnesisFormProps {
  patientId: string;
  initialData?: AnamnesisFormData;
  anamnesisId?: string;
  onSuccess?: () => void;
}

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({
  patientId,
  initialData,
  anamnesisId,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("primary");
  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false);

  const { formMethods, submitForm } = useAnamnesisForm({
    patientId,
    initialData,
    anamnesisId,
    onSuccess,
  });

  const { watch, setValue } = formMethods;

  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");
  const isType1 = suspectedDiagnosis === "type1";
  const isType2 = suspectedDiagnosis === "type2";
  const type1Data = watch("type1Diabetes");
  const type2Data = watch("type2Diabetes");

  useEffect(() => {
    if (isType1 && !type1Data) {
      setValue("type1Diabetes", createType1DiabetesDefaults());
    }

    if (isType2 && !type2Data) {
      setValue("type2Diabetes", createType2DiabetesDefaults());
    }
  }, [isType1, isType2, type1Data, type2Data, setValue]);

  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label ?? "Разделы";

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsMobileTabsOpen(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "primary":
        return <PrimaryTab />;
      case "therapy":
        return <TherapyTab />;
      case "hypoglycemia":
        return <HypoglycemiaTab />;
      case "selfMonitoring":
        return <SelfMonitoringTab />;
      case "complications":
        return <ComplicationsTab />;
      case "examination":
        return <ExaminationTab />;
      case "lifestyle":
        return <LifestyleTab />;
      case "measurements":
        return <MeasurementsTab />;
      case "secondaryAH":
        return <SecondaryAHTab />;
      case "heartFailure":
        return <HeartFailureTab />;
      case "h2fpef":
        return <H2FPEFTab />;
      case "additional":
        return <AdditionalTab />;
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.tabsWrapper}>
        <nav className={styles.tabsNav} aria-label="Разделы анамнеза">
          <button
            type="button"
            className={styles.mobileTabsToggle}
            onClick={() => setIsMobileTabsOpen((isOpen) => !isOpen)}
            aria-expanded={isMobileTabsOpen}
            aria-controls="anamnesis-tabs-list"
          >
            <span className={styles.burgerIcon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className={styles.mobileTabsLabel}>{activeTabLabel}</span>
            <span
              className={`${styles.mobileTabsChevron} ${
                isMobileTabsOpen ? styles.open : ""
              }`}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          <div
            id="anamnesis-tabs-list"
            className={`${styles.tabsList} ${
              isMobileTabsOpen ? styles.mobileOpen : ""
            }`}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabButton} ${
                  activeTab === tab.id ? styles.active : ""
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <div className={styles.tabContent}>
          <FormProvider {...formMethods}>
            <form onSubmit={submitForm} className={styles.form}>
              {renderTab()}

              <div className={styles.actions}>
                <Button type="submit" variant="primary">
                  {anamnesisId ? "Редактировать" : "Сохранить"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
