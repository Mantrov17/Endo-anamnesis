export type {
  ActualTherapy,
  AdditionalHistory,
  AnamnesisFormData,
  AnamnesisRecord,
  Complications,
  Examination,
  H2FPEF,
  HeartFailure,
  Hypoglycemia,
  Lifestyle,
  Measurements,
  PrimaryExam,
  SecondaryHypertension,
  SelfMonitoring,
  Therapy,
  Type1Diabetes,
  Type2Diabetes,
} from "./model";

export {
  addAnamnesis,
  deleteAnamnesis,
  getAnamnesisById,
  updateAnamnesis,
} from "./api/anamnesisStorage";
