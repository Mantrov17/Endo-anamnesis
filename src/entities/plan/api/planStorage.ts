import {
  readPatientsStorage,
  writePatientsStorage,
} from "@/entities/patient/@x/plan";

import type { PlanFormData, PlanRecord } from "../model/types";

const createPlanId = (): string => {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
};

const sortPlans = (plans: PlanRecord[]): PlanRecord[] => {
  return [...plans].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return Date.parse(a.createdAt) - Date.parse(b.createdAt);
  });
};

export const getPlans = (patientId: string): PlanRecord[] => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return [];
  }

  return sortPlans(patient.plans);
};

export const getPlansByDate = (
  patientId: string,
  date: string,
): PlanRecord[] => {
  if (!date) {
    return [];
  }

  return getPlans(patientId).filter((plan) => plan.date === date);
};

export const getPlanById = (
  patientId: string,
  planId: string,
): PlanRecord | undefined => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return undefined;
  }

  return patient.plans.find((plan) => plan.id === planId);
};

export const addPlan = (
  patientId: string,
  data: PlanFormData,
): PlanRecord | null => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return null;
  }

  const now = new Date().toISOString();

  const plan: PlanRecord = {
    ...data,

    id: createPlanId(),

    createdAt: now,

    updatedAt: now,
  };

  patient.plans.push(plan);

  writePatientsStorage(patients);

  return plan;
};

export const updatePlan = (
  patientId: string,
  planId: string,
  data: PlanFormData,
): boolean => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const index = patient.plans.findIndex((plan) => plan.id === planId);

  if (index === -1) {
    return false;
  }

  const currentPlan = patient.plans[index];

  patient.plans[index] = {
    ...currentPlan,

    ...data,

    id: currentPlan.id,

    createdAt: currentPlan.createdAt,

    updatedAt: new Date().toISOString(),
  };

  writePatientsStorage(patients);

  return true;
};

export const deletePlan = (patientId: string, planId: string): boolean => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const initialLength = patient.plans.length;

  patient.plans = patient.plans.filter((plan) => plan.id !== planId);

  if (initialLength === patient.plans.length) {
    return false;
  }

  writePatientsStorage(patients);

  return true;
};
