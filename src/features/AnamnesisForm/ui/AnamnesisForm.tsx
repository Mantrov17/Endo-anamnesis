import React, { useEffect, useState } from "react";
import { useAnamnesisForm } from "@/features/AnamnesisForm";
import { Button } from "@/shared/ui/Button";
import { FormFieldContext } from "./FormFieldContext";
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
import type { AnamnesisFormData } from "@/shared";
import styles from "./styles.module.scss";

interface AnamnesisFormProps {
  patientId: string;
  initialData?: AnamnesisFormData;
  anamnesisId?: string;
  onSuccess?: () => void;
}

type TabId =
  | "primary"
  | "therapy"
  | "hypoglycemia"
  | "selfMonitoring"
  | "complications"
  | "examination"
  | "lifestyle"
  | "measurements"
  | "secondaryAH"
  | "heartFailure"
  | "h2fpef"
  | "additional";

const tabs: { id: TabId; label: string }[] = [
  { id: "primary", label: "Первичный осмотр" },
  { id: "therapy", label: "Терапия" },
  { id: "hypoglycemia", label: "Гипогликемии" },
  { id: "selfMonitoring", label: "Самоконтроль" },
  { id: "complications", label: "Осложнения" },
  { id: "examination", label: "Осмотр / анамнез" },
  { id: "lifestyle", label: "Образ жизни" },
  { id: "measurements", label: "Измерения" },
  { id: "secondaryAH", label: "Вторичные АГ" },
  { id: "heartFailure", label: "ХСН" },
  { id: "h2fpef", label: "H2FPEF" },
  { id: "additional", label: "Доп. анамнез" },
];

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({
  patientId,
  initialData,
  anamnesisId,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("primary");
  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false);
  const { register, handleSubmit, errors, watch, setValue, control } =
    useAnamnesisForm({ patientId, initialData, anamnesisId, onSuccess });

  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");
  const isType1 = suspectedDiagnosis === "type1";
  const isType2 = suspectedDiagnosis === "type2";
  const type1Data = watch("type1Diabetes");
  const type2Data = watch("type2Diabetes");

  // Инициализация объектов СД при выборе типа
  useEffect(() => {
    if (isType1 && !type1Data) {
      setValue("type1Diabetes", {
        ageAtDiagnosis: null,
        yearOfDiagnosis: "",
        diseaseDuration: null,
        howDiagnosed: "",
        circumstances: "",
        glycemiaAtOnset: null,
        classicSymptoms: {
          polyuria: false,
          polydipsia: false,
          weakness: false,
          weightLoss: false,
          weightLossUnknown: false,
          nausea: false,
          vomiting: false,
          abdominalPain: false,
          visionBlur: false,
          lossOfConsciousness: false,
        },
        autoantibodies: {
          tested: null,
          GAD: false,
          GADValue: null,
          IA2: false,
          IA2Value: null,
          ZnT8: false,
          ZnT8Value: null,
          IAA: false,
          IAAValue: null,
        },
        cPeptide: { tested: null, value: "", date: "", unknown: false },
        hba1c: { tested: null, value: null, date: "", unknown: false },
        initialTherapy: {
          injectionMethod: "",
          injectionsDevice: "",
          pumpModel: "",
          basalInsulin: [{ drugName: "", dose: "" }],
          bolusInsulin: [{ drugName: "", dose: "" }],
          otherDrugsTaken: null,
          otherDrugs: "",
          usualGlucoseOnTherapy: null,
        },
        injectionSitesInfo: {
          sites: {
            abdomen: false,
            thighs: false,
            buttocks: false,
            shoulders: false,
          },
          siteChangeFrequency: "",
          needleChangeFrequency: "",
          lipodystrophy: {
            none: false,
            lipohypertrophy: false,
            lipoatrophy: false,
          },
          tenderness: null,
          skinTemperature: "",
          infiltrates: "",
        },
        investigatedAfterDetection: null,
        initiallyType2: null,
      });
    }
    if (isType2 && !type2Data) {
      setValue("type2Diabetes", {
        firstGlucoseElevationYear: "",
        maxGlucoseValues: "",
        ageAtDiagnosis: null,
        yearOfDiagnosis: "",
        diseaseDuration: null,
        howDiagnosed: "",
        classicSymptoms: {
          polyuria: false,
          polydipsia: false,
          weakness: false,
          weightLoss: false,
          visionBlur: false,
        },
        investigatedAfterDetection: null,
        initialTherapy: [{ drugName: "", dose: "", frequency: "" }],
        // NEW
        therapyRegularity: null,
        missedDosesPerWeek: "",
        missedReasons: {
          sideEffects: false,
          sideEffectsDetails: "",
          cost: false,
          complexity: false,
          forgetfulness: false,
          other: false,
          otherDetails: "",
        },

        usualGlucoseOnTherapy: null,
        hba1c: { tested: null, value: null, date: "", unknown: false },
        gestationalDiabetes: null,
      });
    }
  }, [isType1, isType2, type1Data, type2Data, setValue]);

  const tabProps = { register, watch, setValue, control, errors };
  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label ?? "Разделы";

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsMobileTabsOpen(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "primary":
        return <PrimaryTab {...tabProps} />;
      case "therapy":
        return <TherapyTab {...tabProps} />;
      case "hypoglycemia":
        return <HypoglycemiaTab {...tabProps} />;
      case "selfMonitoring":
        return <SelfMonitoringTab {...tabProps} />;
      case "complications":
        return <ComplicationsTab {...tabProps} />;
      case "examination":
        return <ExaminationTab {...tabProps} />;
      case "lifestyle":
        return <LifestyleTab {...tabProps} />;
      case "measurements":
        return <MeasurementsTab {...tabProps} />;
      case "secondaryAH":
        return <SecondaryAHTab {...tabProps} />;
      case "heartFailure":
        return <HeartFailureTab {...tabProps} />;
      case "h2fpef":
        return <H2FPEFTab {...tabProps} />;
      case "additional":
        return <AdditionalTab {...tabProps} />;
      default:
        return null;
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
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        <div className={styles.tabContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <FormFieldContext.Provider value={{ register, watch }}>
              {renderTab()}
            </FormFieldContext.Provider>
            <div className={styles.actions}>
              <Button type="submit" variant="primary">
                {anamnesisId ? "Редактировать" : "Сохранить"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
