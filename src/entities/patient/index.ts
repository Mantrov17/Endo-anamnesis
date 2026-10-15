export type {
  Patient,
  PatientBase,
  PatientDepartureChecklist,
  PatientDepartureProcedureKey,
  PatientFormData,
} from "./model/types";

export {
  createPatient,
  deletePatient,
  getAllPatients,
  getPatientById,
  togglePatientDepartureProcedure,
  updatePatient,
} from "./api/patientStorage";
