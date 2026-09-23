import type { AnamnesisFormData } from "@/entities/anamnesis";

type AdditionalHistoryDefaults = NonNullable<
  AnamnesisFormData["additionalHistory"]
>;

export const createAdditionalHistoryDefaults =
  (): AdditionalHistoryDefaults => ({
    myocardialInfarction: "",
    coronaryAngiography: "",
    stenting: "",
    surgeries: "",

    appendicitis: "",
    cholecystitis: "",

    tuberculosis: "",
    hiv: "",
    hepatitis: "",
    syphilis: "",

    covidYear: "",

    allergies: {
      what: "",
      how: "",
      angioedema: null,
    },

    travelOutsideRF: null,
    contactWithPatients: null,
    insectAnimalBites: null,

    weight: null,
    height: null,
    abdominalCircumference: null,
  });
