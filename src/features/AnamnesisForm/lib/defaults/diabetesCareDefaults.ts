import type { AnamnesisFormData } from "@/entities/anamnesis";

type HypoglycemiaDefaults = NonNullable<AnamnesisFormData["hypoglycemia"]>;

type SelfMonitoringDefaults = NonNullable<AnamnesisFormData["selfMonitoring"]>;

export const createHypoglycemiaDefaults = (): HypoglycemiaDefaults => ({
  hasGlucoseBelow39: null,

  frequencyPerWeek: null,

  reliefMethod: "",

  severeEpisodes: null,

  severeEpisodesDetails: "",

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
  // Место инъекций

  injectionSites: {
    abdomen: false,

    thighs: false,

    buttocks: false,

    lumbar: false,

    shoulders: false,
  },

  // Дополнительные сведения о местах инъекций

  injectionSitesDetails: "",

  // Устройства для самоконтроля

  hasGlucometer: null,

  glucoseSensor: false,

  noMonitoringDevices: false,

  // Регулярность и частота

  frequencyRegularity: "",

  frequency: "",

  // Дневник самоконтроля

  diary: null,

  // Диапазон средней гликемии

  averageGlucoseMin: null,

  averageGlucoseMax: null,

  // Техника инъекций

  injectionTechnique: "",

  injectionSiteChangeFrequency: "",

  // Длина игл

  needleLengths: {
    mm4: false,

    mm5: false,

    mm6: false,

    mm12: false,
  },

  needleChangeFrequency: "",

  // Состояние мест инъекций

  injectionSiteCondition: {
    lipodystrophy: {
      lipohypertrophy: false,
      lipoatrophy: false,
      none: false,
    },

    tenderness: null,

    hyperemia: null,

    skinTemperature: "",
  },

  // Для новых анкет перенос старых полей не требуется

  injectionSiteDetailsMigrated: true,

  // Хранение инсулина

  insulinStorage: "",

  // Питание и диета

  mealRegularity: "",

  dietAdherence: null,

  // Старые поля оставляем для совместимости

  calibrationDone: null,

  lastDoctorVisit: "",

  lastDoctorVisitUnknown: false,
});
