import React, { useEffect, useRef, useState } from "react";

import { FormProvider } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { useAnamnesisForm } from "@/features/AnamnesisForm";

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

  onSuccess?: (anamnesisId: string) => void;
}

export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({
  patientId,
  initialData,
  anamnesisId,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("primary");

  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false);

  const [isSaveConfirmed, setIsSaveConfirmed] = useState(false);

  const tabsListRef = useRef<HTMLDivElement | null>(null);

  const saveConfirmationTimeoutRef = useRef<number | null>(null);

  const { formMethods, submitForm, currentAnamnesisId } = useAnamnesisForm({
    patientId,
    initialData,
    anamnesisId,

    onSuccess: (savedAnamnesisId) => {
      setIsSaveConfirmed(true);

      if (saveConfirmationTimeoutRef.current !== null) {
        window.clearTimeout(saveConfirmationTimeoutRef.current);
      }

      saveConfirmationTimeoutRef.current = window.setTimeout(() => {
        setIsSaveConfirmed(false);

        saveConfirmationTimeoutRef.current = null;
      }, 2000);

      onSuccess?.(savedAnamnesisId);
    },
  });

  const { watch, setValue } = formMethods;

  const suspectedDiagnosis = watch("primaryExam.suspectedDiagnosis");

  const isType1 = suspectedDiagnosis === "type1";

  const isType2 = suspectedDiagnosis === "type2";

  const type1Data = watch("type1Diabetes");

  const type2Data = watch("type2Diabetes");

  useEffect(() => {
    if (isType1 && !type1Data) {
      setValue(
        "type1Diabetes",

        createType1DiabetesDefaults(),
      );
    }

    if (isType2 && !type2Data) {
      setValue(
        "type2Diabetes",

        createType2DiabetesDefaults(),
      );
    }
  }, [isType1, isType2, type1Data, type2Data, setValue]);

  useEffect(() => {
    const tabsList = tabsListRef.current;

    if (!tabsList) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const viewportWidth = window.innerWidth;

      /*
       * На desktop слева вертикальные табы.
       * На телефоне используется dropdown.
       *
       * Колесо переводим в горизонтальный
       * скролл только для промежуточного
       * layout 641–1100 px.
       */
      if (viewportWidth <= 640 || viewportWidth > 1100) {
        return;
      }

      const maxScrollLeft = tabsList.scrollWidth - tabsList.clientWidth;

      if (maxScrollLeft <= 0) {
        return;
      }

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (!delta) {
        return;
      }

      const nextScrollLeft = Math.max(
        0,

        Math.min(
          maxScrollLeft,

          tabsList.scrollLeft + delta,
        ),
      );

      if (nextScrollLeft === tabsList.scrollLeft) {
        return;
      }

      event.preventDefault();

      tabsList.scrollLeft = nextScrollLeft;
    };

    tabsList.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      tabsList.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (saveConfirmationTimeoutRef.current !== null) {
        window.clearTimeout(saveConfirmationTimeoutRef.current);
      }
    };
  }, []);

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

  const submitButtonText = isSaveConfirmed
    ? "✓ Сохранено"
    : currentAnamnesisId
      ? "Редактировать"
      : "Сохранить";

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
              className={[
                styles.mobileTabsChevron,

                isMobileTabsOpen ? styles.open : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          <div
            ref={tabsListRef}
            id="anamnesis-tabs-list"
            className={[
              styles.tabsList,

              isMobileTabsOpen ? styles.mobileOpen : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={[
                  styles.tabButton,

                  activeTab === tab.id ? styles.active : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")}
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
                  {submitButtonText}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
