export type { Patient, PatientBase, PatientFormData } from "./model/types";

export {
  createPatient,
  deletePatient,
  getAllPatients,
  getPatientById,
  updatePatient,
} from "./api/patientStorage";
