import type { Patient } from "@/entities/patient";

export type GenderFilter = "" | "male" | "female";

export type PatientsSortBy = "createdAt" | "alphabet";

interface FilterAndSortPatientsParams {
  patients: Patient[];

  searchTerm: string;

  genderFilter: GenderFilter;

  dateFrom: string;

  dateTo: string;

  sortBy: PatientsSortBy;
}

export const getPatientAgeLabel = (birthDate: string): string => {
  if (!birthDate) {
    return "Возраст не указан";
  }

  const today = new Date();

  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return "Возраст не указан";
  }

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 0) {
    return "Возраст не указан";
  }

  const lastDigit = age % 10;

  const lastTwo = age % 100;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return `${age} лет`;
  }

  if (lastDigit === 1) {
    return `${age} год`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`;
  }

  return `${age} лет`;
};

export const filterAndSortPatients = ({
  patients,
  searchTerm,
  genderFilter,
  dateFrom,
  dateTo,
  sortBy,
}: FilterAndSortPatientsParams): Patient[] => {
  let result = patients;

  if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();

    result = result.filter((patient) =>
      patient.fullName.toLowerCase().includes(lower),
    );
  }

  if (genderFilter) {
    result = result.filter((patient) => patient.gender === genderFilter);
  }

  if (dateFrom) {
    result = result.filter(
      (patient) => Boolean(patient.birthDate) && patient.birthDate >= dateFrom,
    );
  }

  if (dateTo) {
    result = result.filter(
      (patient) => Boolean(patient.birthDate) && patient.birthDate <= dateTo,
    );
  }

  if (sortBy === "createdAt") {
    return [...result].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return [...result].sort((a, b) => a.fullName.localeCompare(b.fullName));
};
