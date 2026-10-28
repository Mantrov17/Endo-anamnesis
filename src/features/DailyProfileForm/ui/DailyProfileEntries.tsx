import React, { useMemo, useState } from "react";

import {
  DAILY_PROFILE_INSULINS,
  DAILY_PROFILE_MEAL_TYPE_LABELS,
  type DailyProfileDay,
  type DailyProfileGlucoseEntry,
  type DailyProfileInsulinEntry,
  type DailyProfileInsulinName,
  type DailyProfileMealEntry,
  type DailyProfileMealType,
} from "@/entities/dailyProfile";

import styles from "./DailyProfileEntries.module.scss";

type Entry =
  | {
      kind: "glucose";
      entry: DailyProfileGlucoseEntry;
    }
  | {
      kind: "insulin";
      entry: DailyProfileInsulinEntry;
    }
  | {
      kind: "meal";
      entry: DailyProfileMealEntry;
    };

type Editor = {
  key: string;
  kind: Entry["kind"];
  id: string;
  time: string;
  number: string;
  note: string;
  insulinName: DailyProfileInsulinName;
  mealType: DailyProfileMealType;
};

interface DailyProfileEntriesProps {
  day: DailyProfileDay;

  updateGlucoseEntry: (
    id: string,
    patch: Partial<Pick<DailyProfileGlucoseEntry, "time" | "value" | "note">>,
  ) => void;

  updateInsulinEntry: (
    id: string,
    patch: Partial<
      Pick<DailyProfileInsulinEntry, "time" | "insulinName" | "units">
    >,
  ) => void;

  updateMealEntry: (
    id: string,
    patch: Partial<
      Pick<DailyProfileMealEntry, "time" | "mealType" | "breadUnits">
    >,
  ) => void;

  deleteGlucoseEntry: (id: string) => void;
  deleteInsulinEntry: (id: string) => void;
  deleteMealEntry: (id: string) => void;
}

const numberText = (number: number | null): string =>
  number === null
    ? "—"
    : number.toLocaleString("ru-RU", {
        maximumFractionDigits: 2,
      });

const getInsulinName = (id: DailyProfileInsulinName): string =>
  DAILY_PROFILE_INSULINS.find((item) => item.id === id)?.shortLabel ?? id;

const getEntryKey = ({ kind, entry }: Entry): string => `${kind}:${entry.id}`;

const describe = (item: Entry): string => {
  switch (item.kind) {
    case "glucose":
      return `${numberText(item.entry.value)} ммоль/л`;

    case "insulin":
      return (
        `${getInsulinName(item.entry.insulinName)} · ` +
        `${numberText(item.entry.units)} ЕД`
      );

    case "meal":
      return (
        `${DAILY_PROFILE_MEAL_TYPE_LABELS[item.entry.mealType]} · ` +
        `${numberText(item.entry.breadUnits)} ХЕ`
      );
  }
};

const ICONS: Record<Entry["kind"], string> = {
  glucose: "●",
  insulin: "●",
  meal: "●",
};

export const DailyProfileEntries: React.FC<DailyProfileEntriesProps> = ({
  day,

  updateGlucoseEntry,
  updateInsulinEntry,
  updateMealEntry,

  deleteGlucoseEntry,
  deleteInsulinEntry,
  deleteMealEntry,
}) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  /*
   * Все события объединяются по времени.
   *
   * Например:
   * 10:00 — Аспарт 6 ЕД + Завтрак 4 ХЕ
   *
   * Данные при этом остаются в своих
   * существующих массивах.
   */
  const rows = useMemo(() => {
    const entries: Entry[] = [
      ...day.glucoseEntries.map(
        (entry): Entry => ({
          kind: "glucose",
          entry,
        }),
      ),

      ...day.insulinEntries.map(
        (entry): Entry => ({
          kind: "insulin",
          entry,
        }),
      ),

      ...day.mealEntries.map(
        (entry): Entry => ({
          kind: "meal",
          entry,
        }),
      ),
    ];

    const groups = new Map<string, Entry[]>();

    for (const item of entries) {
      const time = item.entry.time;

      const group = groups.get(time) ?? [];

      group.push(item);

      groups.set(time, group);
    }

    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, items]) => ({
        time,
        items,
      }));
  }, [day]);

  /*
   * Открытие редактирования по нажатию
   * на конкретную запись.
   */
  const startEdit = (item: Entry) => {
    const base = {
      id: item.entry.id,
      kind: item.kind,
      key: getEntryKey(item),
      time: item.entry.time,
      note: "",
      insulinName: "aspart" as DailyProfileInsulinName,
      mealType: "breakfast" as DailyProfileMealType,
    };

    if (item.kind === "glucose") {
      setEditor({
        ...base,
        kind: "glucose",
        number: item.entry.value?.toString() ?? "",
        note: item.entry.note,
      });
    } else if (item.kind === "insulin") {
      setEditor({
        ...base,
        kind: "insulin",
        number: item.entry.units?.toString() ?? "",
        insulinName: item.entry.insulinName,
      });
    } else {
      setEditor({
        ...base,
        kind: "meal",
        number: item.entry.breadUnits?.toString() ?? "",
        mealType: item.entry.mealType,
      });
    }
  };

  /*
   * Применение изменений.
   *
   * Существующий ID записи остаётся прежним.
   * useDailyProfileForm автоматически сохраняет
   * обновлённый день.
   */
  const saveEdit = () => {
    if (!editor) {
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(editor.time)) {
      window.alert("Укажите корректное время от 00:00 до 23:59.");
      return;
    }

    const number = Number(editor.number.replace(",", "."));

    if (
      !editor.number.trim() ||
      !Number.isFinite(number) ||
      number < 0 ||
      (editor.kind === "insulin" && number <= 0)
    ) {
      window.alert("Введите корректное числовое значение.");
      return;
    }

    if (editor.kind === "glucose") {
      updateGlucoseEntry(editor.id, {
        time: editor.time,
        value: number,
        note: editor.note,
      });
    } else if (editor.kind === "insulin") {
      updateInsulinEntry(editor.id, {
        time: editor.time,
        units: number,
        insulinName: editor.insulinName,
      });
    } else {
      updateMealEntry(editor.id, {
        time: editor.time,
        breadUnits: number,
        mealType: editor.mealType,
      });
    }

    setEditor(null);
  };

  /*
   * Удаление с подтверждением.
   */
  const deleteEdit = () => {
    if (!editor || !window.confirm("Удалить эту запись?")) {
      return;
    }

    if (editor.kind === "glucose") {
      deleteGlucoseEntry(editor.id);
    } else if (editor.kind === "insulin") {
      deleteInsulinEntry(editor.id);
    } else {
      deleteMealEntry(editor.id);
    }

    setEditor(null);
  };

  const total =
    day.glucoseEntries.length +
    day.insulinEntries.length +
    day.mealEntries.length;

  return (
    <div className={styles.journal}>
      {/* Свёрнутый журнал занимает всего одну строку */}

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>
          {total}{" "}
          {total === 1
            ? "запись"
            : total > 1 && total < 5
              ? "записи"
              : "записей"}{" "}
          за день
        </span>

        <span>{isOpen ? "Свернуть ▲" : "Показать журнал ▼"}</span>
      </button>

      {isOpen &&
        (rows.length === 0 ? (
          <p className={styles.empty}>
            Записей пока нет. Добавьте их кнопкой «+».
          </p>
        ) : (
          <div className={styles.rows}>
            {rows.map((row) => (
              <div className={styles.timeRow} key={row.time}>
                <time className={styles.time} dateTime={row.time}>
                  {row.time}
                </time>

                <div className={styles.events}>
                  {/* События в указанное время */}

                  {row.items.map((item) => (
                    <button
                      type="button"
                      key={getEntryKey(item)}
                      className={`${styles.event} ${styles[item.kind]} ${
                        editor?.key === getEntryKey(item) ? styles.active : ""
                      }`}
                      onClick={() =>
                        editor?.key === getEntryKey(item)
                          ? setEditor(null)
                          : startEdit(item)
                      }
                      aria-label={`Изменить: ${describe(item)}, время ${row.time}`}
                      aria-expanded={editor?.key === getEntryKey(item)}
                    >
                      <span aria-hidden="true" className={styles.eventDot}>
                        {ICONS[item.kind]}
                      </span>

                      <span>{describe(item)}</span>

                      <span className={styles.editGlyph} aria-hidden="true">
                        ✎
                      </span>
                    </button>
                  ))}

                  {/* Редактирование выбранной записи */}

                  {editor &&
                    row.items.some(
                      (item) => getEntryKey(item) === editor.key,
                    ) && (
                      <div
                        className={styles.editor}
                        role="group"
                        aria-label="Редактировать запись"
                      >
                        <div className={styles.editorTitle}>
                          {editor.kind === "glucose"
                            ? "Глюкоза"
                            : editor.kind === "insulin"
                              ? "Инсулин"
                              : "Питание"}
                        </div>

                        <div className={styles.editorFields}>
                          <label>
                            <span>Время</span>

                            <input
                              type="time"
                              value={editor.time}
                              onChange={(event) =>
                                setEditor({
                                  ...editor,
                                  time: event.target.value,
                                })
                              }
                            />
                          </label>

                          {editor.kind === "insulin" && (
                            <label className={styles.wideField}>
                              <span>Препарат</span>

                              <select
                                value={editor.insulinName}
                                onChange={(event) =>
                                  setEditor({
                                    ...editor,
                                    insulinName: event.target
                                      .value as DailyProfileInsulinName,
                                  })
                                }
                              >
                                {DAILY_PROFILE_INSULINS.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}

                          {editor.kind === "meal" && (
                            <label className={styles.wideField}>
                              <span>Приём пищи</span>

                              <select
                                value={editor.mealType}
                                onChange={(event) =>
                                  setEditor({
                                    ...editor,
                                    mealType: event.target
                                      .value as DailyProfileMealType,
                                  })
                                }
                              >
                                {Object.entries(
                                  DAILY_PROFILE_MEAL_TYPE_LABELS,
                                ).map(([value, label]) => (
                                  <option value={value} key={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}

                          <label>
                            <span>
                              {editor.kind === "glucose"
                                ? "ммоль/л"
                                : editor.kind === "insulin"
                                  ? "ЕД"
                                  : "ХЕ"}
                            </span>

                            <input
                              type="number"
                              min={editor.kind === "insulin" ? "0.01" : "0"}
                              step="any"
                              inputMode="decimal"
                              value={editor.number}
                              onChange={(event) =>
                                setEditor({
                                  ...editor,
                                  number: event.target.value,
                                })
                              }
                            />
                          </label>

                          {editor.kind === "glucose" && (
                            <label className={styles.wideField}>
                              <span>Комментарий</span>

                              <input
                                type="text"
                                value={editor.note}
                                placeholder="Необязательно"
                                onChange={(event) =>
                                  setEditor({
                                    ...editor,
                                    note: event.target.value,
                                  })
                                }
                              />
                            </label>
                          )}
                        </div>

                        <div className={styles.editorActions}>
                          <button
                            className={styles.delete}
                            type="button"
                            onClick={deleteEdit}
                          >
                            Удалить
                          </button>

                          <div className={styles.editorActionsRight}>
                            <button
                              type="button"
                              onClick={() => setEditor(null)}
                            >
                              Отмена
                            </button>

                            <button
                              className={styles.save}
                              type="button"
                              onClick={saveEdit}
                            >
                              Готово
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
