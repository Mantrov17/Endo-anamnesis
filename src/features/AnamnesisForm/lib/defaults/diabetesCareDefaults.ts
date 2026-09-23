import type { AnamnesisFormData } from "@/entities/anamnesis";

type HypoglycemiaDefaults = NonNullable<AnamnesisFormData["hypoglycemia"]>;

type SelfMonitoringDefaults = NonNullable<AnamnesisFormData["selfMonitoring"]>;

export const createHypoglycemiaDefaults = (): HypoglycemiaDefaults => ({
  frequencyPerWeek: null,

  severeEpisodes: null,
  severeEpisodesCount: null,
  severeEpisodesWhen: "",
  severeEpisodesClinic: "",

  awarenessPreserved: null,

  provokingFactors: {
    physicalActivity: false,
    missedMeal: false,
    alcohol: false,
  },

  hasGlucagon: null,
  familyTrained: null,
  nocturnalHypoglycemia: null,

  severity: "",

  symptoms: {
    hunger: false,
    tremor: false,
    sweating: false,
    tachycardia: false,
    anxiety: false,
    weakness: false,
    diplopia: false,
    headache: false,
  },
});

export const createSelfMonitoringDefaults = (): SelfMonitoringDefaults => ({
  frequency: "",
  sameTime: null,
  ifNotSameTimeReason: "",
  diary: null,

  needleChangeFrequency: "",
  siteChangeFrequency: "",
  injectionSiteDistance: "",

  hasGlucometer: null,
  calibrationDone: null,

  lastDoctorVisit: "",
  lastDoctorVisitUnknown: false,
});
