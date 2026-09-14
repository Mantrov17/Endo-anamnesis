import React, { useEffect, useState } from "react";
import { useAnamnesisForm } from "../model/useAnamnesisForm";
import { Button } from "@/shared/ui/Button";
import { FormFieldContext } from "./FormFieldContext";
import {
  PrimaryTab,
  TherapyTab,
  HypoglycemiaTab,
  SelfMonitoringTab,
  ComplicationsTab,
  ExaminationTab,
  LifestyleTab,
  MeasurementsTab,
  SecondaryAHTab,
  HeartFailureTab,
  H2FPEFTab,
  AdditionalTab,
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
        howDiagnosedDetails: "",
        circumstances: "",
        glycemiaAtOnset: null,
        classicSymptoms: {
          polyuria: false,
          polydipsia: false,
          weakness: false,
          weightLoss: false,
          weightLossAmount: null,
          weightLossUnknown: false,
          nausea: false,
          vomiting: false,
          abdominalPain: false,
          visionBlur: false,
          lossOfConsciousness: false,
        },
        furtherPlan: "",
        investigatedAfterDetection: null,
        initiallyType2: null,
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
        cPeptide: { value: "", date: "" },
        hba1c: { value: null, date: "" },
        usualGlucose: null,
        initialTherapy: [{ drugName: "", dose: "" }],
        stillTakingInitialTherapy: null,
        ifNotTakingReason: "",
      });
    }
    if (isType2 && !type2Data) {
      setValue("type2Diabetes", {
        height: null,
        weight: null,
        bmi: null,
        waistCircumference: null,
        weightChange6Months: null,
        weightIncreasedBy: null,
        weightDecreasedBy: null,
        firstGlucoseElevationYear: "",
        maxGlucoseValues: "",
        ageAtDiagnosis: null,
        yearOfDiagnosis: "",
        howDiagnosed: "",
        classicSymptoms: {
          polyuria: false,
          polydipsia: false,
          weakness: false,
          weightLoss: false,
          weightLossAmount: null,
          weightLossUnknown: false,
          visionBlur: false,
        },
        investigatedAfterDetection: null,
        initialTherapy: [{ drugName: "", dose: "" }],
        stillTakingInitialTherapy: null,
        ifNotTakingReason: "",
        currentTherapy: [{ drugName: "", dose: "" }],
        therapyRegularity: null,
        missedDosesPerWeek: "",
        missedReasons: "",
        usualGlucoseOnTherapy: null,
        hba1c: { value: null, date: "", unknown: false },
        gestationalDiabetes: null,
      });
    }
  }, [isType1, isType2, type1Data, type2Data, setValue]);

  const tabProps = { register, watch, setValue, control, errors };

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
        <div className={styles.tabsList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
