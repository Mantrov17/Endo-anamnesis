export interface DiaryFormData {
  complaints: string;

  bloodPressure: string;

  saturation: number | null;

  edema: string;

  plannedActivities: string;

  otherData: string;
}

export interface DiaryRecord extends DiaryFormData {
  id: string;

  /*
   * Дата самого дневника.
   * Формат YYYY-MM-DD.
   */
  date: string;

  createdAt: string;

  updatedAt: string;
}
