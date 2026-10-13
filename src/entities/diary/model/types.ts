export interface DiaryFormData {
  /*
   * Дата дневника.
   * Формат YYYY-MM-DD.
   */
  date: string;

  complaints: string;

  bloodPressure: string;

  pulse: number | null;

  saturation: number | null;

  edema: string;

  otherData: string;

  /*
   * Проведённые мероприятия за дату дневника.
   * Поле необязательное для совместимости со старыми записями.
   */
  performedActivities?: string;
}

export interface DiaryRecord extends DiaryFormData {
  id: string;

  /*
   * Старое поле.
   *
   * Не используем его в новой форме,
   * но оставляем в типе записи,
   * чтобы не уничтожать уже сохранённые
   * пользовательские данные.
   */
  plannedActivities?: string;

  createdAt: string;

  updatedAt: string;
}
