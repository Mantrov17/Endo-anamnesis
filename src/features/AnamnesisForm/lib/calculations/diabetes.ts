export const calculateAge = (birthDate: string | undefined): number | null => {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

export const calculateTargetHba1c = (age: number): string => {
  if (age >= 18 && age <= 40) {
    return "<6,5% или <7%";
  }

  if (age >= 41 && age <= 59) {
    return "<7% или <7,5%";
  }

  if (age >= 60 && age <= 74) {
    return "<7,5% или <8%";
  }

  return "";
};

export const parseDiagnosisYear = (value: unknown): number | null => {
  const yearString = String(value ?? "").trim();

  if (!/^\d{4}$/.test(yearString)) {
    return null;
  }

  const diagnosisYear = Number(yearString);
  const currentYear = new Date().getFullYear();

  if (diagnosisYear < 1900 || diagnosisYear > currentYear) {
    return null;
  }

  return diagnosisYear;
};

export const calculateAgeAtDiagnosis = (
  diagnosisYear: number,
  birthDate: string | undefined,
): number | null => {
  if (!birthDate) {
    return null;
  }

  const birthYear = new Date(birthDate).getFullYear();

  if (isNaN(birthYear) || diagnosisYear < birthYear) {
    return null;
  }

  return diagnosisYear - birthYear;
};

export const calculateDiseaseDuration = (diagnosisYear: number): number => {
  return new Date().getFullYear() - diagnosisYear;
};

export const calculateDiagnosisYearFromAge = (
  birthDate: string | undefined,
  ageValue: unknown,
): string | null => {
  if (!birthDate) {
    return null;
  }

  if (ageValue === null || ageValue === undefined) {
    return null;
  }

  const age = Number(ageValue);

  if (isNaN(age) || age < 0 || age > 120) {
    return null;
  }

  const birthYear = new Date(birthDate).getFullYear();

  if (isNaN(birthYear)) {
    return null;
  }

  return String(birthYear + age);
};
