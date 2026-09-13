import type {
  AnamnesisFormData,
  AnamnesisRecord,
  Patient,
  PatientFormData,
} from "../model/types";

const STORAGE_KEY = "patientsData";

// ==================== Вспомогательные ====================
const getPatients = (): Patient[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const patients = JSON.parse(stored) as Patient[];
  // Добавляем createdAt для старых записей
  return patients.map((p) => ({
    ...p,
    createdAt: p.createdAt || new Date().toISOString(),
  }));
};

const savePatients = (patients: Patient[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

// ==================== Пациенты ====================
export const getAllPatients = (): Patient[] => {
  return getPatients();
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = getPatients();
  return patients.find((p) => p.id === id);
};

export const createPatient = (data: PatientFormData): Patient => {
  const patients = getPatients();
  const newPatient: Patient = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    anamneses: [],
  };
  patients.push(newPatient);
  savePatients(patients);
  return newPatient;
};

export const updatePatient = (
  id: string,
  data: Partial<PatientFormData>,
): boolean => {
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) return false;
  patients[index] = { ...patients[index], ...data };
  savePatients(patients);
  return true;
};

export const deletePatient = (id: string): boolean => {
  const patients = getPatients();
  const filtered = patients.filter((p) => p.id !== id);
  if (filtered.length === patients.length) return false;
  savePatients(filtered);
  return true;
};

// ==================== Анамнезы ====================
export const addAnamnesis = (
  patientId: string,
  data: AnamnesisFormData,
): AnamnesisRecord | null => {
  const patients = getPatients();
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return null;
  const newAnamnesis: AnamnesisRecord = {
    ...data,
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    savedAt: new Date().toISOString(),
  };
  patient.anamneses.push(newAnamnesis);
  savePatients(patients);
  return newAnamnesis;
};

export const getAnamnesisById = (
  patientId: string,
  anamnesisId: string,
): AnamnesisRecord | undefined => {
  const patient = getPatientById(patientId);
  if (!patient) return undefined;
  return patient.anamneses.find((a) => a.id === anamnesisId);
};

export const updateAnamnesis = (
  patientId: string,
  anamnesisId: string,
  data: Partial<AnamnesisFormData>,
): boolean => {
  const patients = getPatients();
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return false;
  const index = patient.anamneses.findIndex((a) => a.id === anamnesisId);
  if (index === -1) return false;
  patient.anamneses[index] = { ...patient.anamneses[index], ...data };
  savePatients(patients);
  return true;
};

export const deleteAnamnesis = (
  patientId: string,
  anamnesisId: string,
): boolean => {
  const patients = getPatients();
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return false;
  const initialLength = patient.anamneses.length;
  patient.anamneses = patient.anamneses.filter((a) => a.id !== anamnesisId);
  if (patient.anamneses.length === initialLength) return false;
  savePatients(patients);
  return true;
};
