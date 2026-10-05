import React, { useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  deletePlan,
  getPlans,
  type PlanFormData,
  type PlanRecord,
} from "@/entities/plan";

import { getPatientById } from "@/entities/patient";

import { PlanForm } from "@/features/PlanForm";

import { Button } from "@/shared/ui/Button";

import { Heading } from "@/shared/ui/Heading";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

import styles from "./styles.module.scss";

const formatDate = (date: string): string => {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}.${month}.${year}`;
};

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();

  const { patientId } = useParams<{
    patientId: string;
  }>();

  const patient = useMemo(() => {
    if (!patientId) {
      return undefined;
    }

    return getPatientById(patientId);
  }, [patientId]);

  const [plans, setPlans] = useState<PlanRecord[]>(() =>
    patientId ? getPlans(patientId) : [],
  );

  const [editingPlanId, setEditingPlanId] = useState<string | undefined>(
    undefined,
  );

  if (!patientId) {
    return (
      <main className={styles.container}>
        <p>ID пациента не указан</p>

        <Button onClick={() => navigate("/")}>К списку пациентов</Button>
      </main>
    );
  }

  if (!patient) {
    return (
      <main className={styles.container}>
        <p>Пациент не найден</p>

        <Button onClick={() => navigate("/")}>К списку пациентов</Button>
      </main>
    );
  }

  const editingPlan = editingPlanId
    ? plans.find((plan) => plan.id === editingPlanId)
    : undefined;

  const editingInitialData: PlanFormData | undefined = editingPlan
    ? {
        date: editingPlan.date,

        text: editingPlan.text,
      }
    : undefined;

  const refreshPlans = () => {
    setPlans(getPlans(patientId));
  };

  const handleSaved = () => {
    refreshPlans();

    setEditingPlanId(undefined);
  };

  const handleDelete = (planId: string) => {
    const confirmed = window.confirm("Удалить этот план?");

    if (!confirmed) {
      return;
    }

    try {
      const success = deletePlan(patientId, planId);

      if (!success) {
        window.alert("План не найден.");

        return;
      }

      if (editingPlanId === planId) {
        setEditingPlanId(undefined);
      }

      refreshPlans();
    } catch (error) {
      console.error("Ошибка удаления плана:", error);

      window.alert(getStorageWriteErrorMessage(error));
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.pageHeader}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/")}
        >
          <span aria-hidden="true">←</span>

          <span>К пациентам</span>
        </button>

        <div className={styles.headerInfo}>
          <Heading level={1} variant="page" className={styles.title}>
            Планы
          </Heading>

          <div className={styles.patientName}>{patient.fullName}</div>
        </div>
      </div>

      <section className={styles.formSection}>
        <Heading level={2} variant="subsection" className={styles.sectionTitle}>
          {editingPlan ? "Редактирование плана" : "Новый план"}
        </Heading>

        <PlanForm
          key={editingPlanId ?? "new-plan"}
          patientId={patientId}
          planId={editingPlanId}
          initialData={editingInitialData}
          onSuccess={handleSaved}
          onCancelEdit={() => setEditingPlanId(undefined)}
        />
      </section>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <Heading
            level={2}
            variant="subsection"
            className={styles.sectionTitle}
          >
            Все планы
          </Heading>

          <span className={styles.count}>{plans.length}</span>
        </div>

        {plans.length === 0 ? (
          <div className={styles.empty}>Планов пока нет</div>
        ) : (
          <div className={styles.list}>
            {plans.map((plan) => (
              <article key={plan.id} className={styles.plan}>
                <div className={styles.planDate}>{formatDate(plan.date)}</div>

                <div className={styles.planText}>{plan.text}</div>

                <div className={styles.planActions}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingPlanId(plan.id)}
                  >
                    Изменить
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleDelete(plan.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
