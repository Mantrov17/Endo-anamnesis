export type {
  Patient,
  AnamnesisRecord,
  AnamnesisFormData,
  PatientFormData,
} from "./model/types";
export {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  addAnamnesis,
  getAnamnesisById,
  updateAnamnesis,
  deleteAnamnesis,
} from "./api/localStorageApi";
