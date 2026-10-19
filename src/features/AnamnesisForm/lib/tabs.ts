export const tabs = [
  {
    id: "primary",
    label: "Основное заболевание",
  },
  {
    id: "hypoglycemia",
    label: "Гипогликемии",
  },
  {
    id: "selfMonitoring",
    label: "Самоконтроль",
  },
  {
    id: "cardiovascular",
    label: "Сердечно-сосудистая система",
  },
  {
    id: "eyes",
    label: "Глаза",
  },
  {
    id: "anthropometry",
    label: "Антропометрия",
  },
  {
    id: "complications",
    label: "Осложнения",
  },
  {
    id: "examination",
    label: "Осмотр / анамнез",
  },
  {
    id: "lifestyle",
    label: "Образ жизни",
  },
  {
    id: "measurements",
    label: "Измерения",
  },
  {
    id: "secondaryAH",
    label: "Вторичные АГ",
  },
  {
    id: "heartFailure",
    label: "ХСН",
  },
  {
    id: "h2fpef",
    label: "H2FPEF",
  },
  {
    id: "additional",
    label: "Доп. анамнез",
  },
] as const;

export type TabId = (typeof tabs)[number]["id"];
