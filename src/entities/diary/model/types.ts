export type DiaryKetoneStripResult =
  | "negative"
  | "trace"
  | "plus1"
  | "plus2"
  | "plus3"
  | "plus4";

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

  /*
   * Тест-полоска на кетоны.
   *
   * true — проводился.
   * false — не проводился.
   * null — ответ ещё не выбран.
   *
   * Поля необязательные для совместимости
   * с уже сохранёнными дневниками.
   *
   * Результат хранится как один вариант,
   * поэтому выбрать сразу несколько нельзя.
   */
  ketoneStripPerformed?: boolean | null;

  ketoneStripResult?: DiaryKetoneStripResult | null;

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
