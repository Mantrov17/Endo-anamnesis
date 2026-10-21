import type { GravesDisease } from "@/entities/anamnesis";

export const createGravesDiseaseDefaults = (): GravesDisease => ({
  firstSymptomsDate: "",
  clinicalManifestations: [],
  visitedEndocrinologist: null,
  endocrinologistVisitDate: "",
  diagnosisDate: "",

  therapy: {
    medications: [
      {
        drugName: "",
        tradeName: "",
        dose: "",
        frequency: "",
        frequencyPeriod: "day",
        timesOfDay: {
          morning: false,
          day: false,
          evening: false,
          night: false,
        },
      },
    ],
    correction: null,
    correctionReason: "",
    correctedTherapy: "",
    selfDoseChange: null,
    selfDiscontinuation: null,
  },

  laboratory: {
    tsh: { value: "", date: "" },
    freeT4: { value: "", date: "" },
    freeT3: { value: "", date: "" },
    antibodiesEnabled: null,
    antiTPO: "",
    antiTG: "",
  },
});
