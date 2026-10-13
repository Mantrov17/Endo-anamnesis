import React, { useState } from "react";

import {
  GLYCEMIC_PROFILE_TIMES,
  type GlycemicProfileDay,
  type GlycemicProfileMeasurement,
  type GlycemicProfileTime,
} from "@/entities/glycemicProfile";

import { Button } from "@/shared/ui/Button";

import { Textarea } from "@/shared/ui/Textarea";

import { useGlycemicProfileForm } from "../model/useGlycemicProfileForm";

import styles from "./styles.module.scss";

interface GlycemicProfileFormProps {
  patientId: string;
  initialDays?: GlycemicProfileDay[];
  onSuccess?: () => void;
}

type NumericMeasurementField =
  | "glycemia"
  | "breadUnits"
  | "bolusInsulinUnits"
  | "basalInsulinUnits";

const MEASUREMENT_ROWS: {
  field: NumericMeasurementField;
  shortLabel: string;
  fullLabel: string;
  step: string;
}[] = [
  {
    field: "glycemia",
    shortLabel: "Сахар",
    fullLabel: "Сахар крови, ммоль/л",
    step: "0.1",
  },
  {
    field: "breadUnits",
    shortLabel: "ХЕ/г",
    fullLabel: "Хлебные единицы / граммы",
    step: "0.5",
  },
  {
    field: "bolusInsulinUnits",
    shortLabel: "Болюс",
    fullLabel: "Болюсный инсулин, ЕД",
    step: "0.5",
  },
  {
    field: "basalInsulinUnits",
    shortLabel: "Базал",
    fullLabel: "Базальный инсулин, ЕД",
    step: "0.5",
  },
];

const formatShortDate = (date: string): string => {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}.${month}.${year.slice(-2)}`;
};

const formatFullDate = (date: string): string => {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}.${month}.${year}`;
};

const getMeasurement = (
  day: GlycemicProfileDay,
  time: GlycemicProfileTime,
): GlycemicProfileMeasurement | undefined =>
  day.measurements.find((measurement) => measurement.time === time);

export const GlycemicProfileForm: React.FC<GlycemicProfileFormProps> = ({
  patientId,
  initialDays,
  onSuccess,
}) => {
  const {
    days,
    times,
    loading,
    hasLegacyInsulin,
    addDay,
    removeDay,
    updateDayDate,
    addTime,
    updateMeasurement,
    handleSubmit,
  } = useGlycemicProfileForm({
    patientId,
    initialDays,
    onSuccess,
  });

  const [newTime, setNewTime] = useState("");
  const [timeError, setTimeError] = useState("");

  const [expandedNoteKey, setExpandedNoteKey] = useState<string | null>(null);

  /*
   * Основные шесть времён всегда располагаются
   * в единой таблице.
   *
   * Дополнительные времена оставляем отдельно
   * внутри группы соответствующего дня.
   */
  const additionalTimes = times.filter(
    (time) => !GLYCEMIC_PROFILE_TIMES.includes(time),
  );

  const handleAddTime = () => {
    if (!addTime(newTime)) {
      setTimeError(
        "Выберите новое время с 00:00 до 23:59, которого ещё нет в профиле.",
      );

      return;
    }

    setNewTime("");
    setTimeError("");
  };

  const updateNumericValue = (
    dayId: string,
    time: GlycemicProfileTime,
    field: NumericMeasurementField | "insulinUnits",
    value: string,
  ) => {
    updateMeasurement(dayId, time, field, value === "" ? null : Number(value));
  };

  const toggleNote = (dayId: string, time: GlycemicProfileTime) => {
    const key = `${dayId}:${time}`;

    setExpandedNoteKey((current) => (current === key ? null : key));
  };

  /*
   * Общий компактный элемент даты.
   *
   * Первый день находится в шапке таблицы.
   * Остальные дни — в первом столбце тонкой
   * разделительной строки.
   *
   * Дата отображается коротко, но остаётся
   * доступной для редактирования.
   */
  const renderDateControls = (
    day: GlycemicProfileDay,
    dayIndex: number,
    inHeader = false,
  ) => (
    <div
      className={`${styles.compactDateControls} ${
        inHeader ? styles.compactDateControlsHeader : ""
      }`}
    >
      <label
        className={styles.compactDatePicker}
        title={`Изменить дату: ${formatFullDate(day.date)}`}
      >
        <span>{formatShortDate(day.date)}</span>

        <input
          type="date"
          value={day.date}
          onChange={(event) => updateDayDate(day.id, event.target.value)}
          aria-label={`Дата дня ${dayIndex + 1}`}
        />
      </label>

      <button
        type="button"
        className={styles.removeDayButton}
        onClick={() => removeDay(day.id)}
        aria-label={`Удалить день ${formatFullDate(day.date)}`}
        title="Удалить день"
      >
        ×
      </button>
    </div>
  );

  const renderNoteEditor = (
    day: GlycemicProfileDay,
    time: GlycemicProfileTime,
    measurement: GlycemicProfileMeasurement | undefined,
  ) => (
    <div
      className={styles.noteEditor}
      role="region"
      aria-label={`Примечание к ${time} за ${formatFullDate(day.date)}`}
    >
      <Textarea
        label={`Примечание · ${time}`}
        className={styles.noteTextarea}
        rows={2}
        placeholder="Питание, физическая нагрузка, самочувствие…"
        value={measurement?.note ?? ""}
        onChange={(event) =>
          updateMeasurement(day.id, time, "note", event.target.value)
        }
      />

      {hasLegacyInsulin && measurement?.insulinUnits != null && (
        <label className={styles.legacyEditorField}>
          <span>Инсулин, ЕД (из старого профиля)</span>

          <input
            className={styles.legacyInput}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={measurement.insulinUnits}
            onChange={(event) =>
              updateNumericValue(
                day.id,
                time,
                "insulinUnits",
                event.target.value,
              )
            }
          />
        </label>
      )}
    </div>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.toolbar}>
        <Button type="button" variant="secondary" onClick={addDay}>
          + Добавить день
        </Button>
      </div>

      <div className={styles.timeToolbar}>
        <label className={styles.timeLabel} htmlFor="profile-new-time">
          Дополнительное время измерения
        </label>

        <div className={styles.timeControls}>
          <input
            id="profile-new-time"
            className={styles.timeInput}
            type="time"
            step={60}
            value={newTime}
            onChange={(event) => {
              setNewTime(event.target.value);
              setTimeError("");
            }}
          />

          <Button
            type="button"
            variant="secondary"
            onClick={handleAddTime}
            disabled={days.length === 0 || !newTime}
          >
            + Добавить время
          </Button>
        </div>

        {timeError && (
          <p className={styles.timeError} role="alert">
            {timeError}
          </p>
        )}
      </div>

      {days.length === 0 ? (
        <div className={styles.emptyState}>
          Пока нет дней. Нажмите «Добавить день».
        </div>
      ) : (
        <div className={styles.profileTableWrapper}>
          <table className={styles.table}>
            <colgroup>
              <col className={styles.metricColumn} />

              {GLYCEMIC_PROFILE_TIMES.map((time) => (
                <col key={time} className={styles.hourColumn} />
              ))}
            </colgroup>

            {/* Одна общая шапка для всех дней */}
            <thead>
              <tr>
                <th scope="col" className={styles.firstHeaderDate}>
                  {renderDateControls(days[0], 0, true)}
                </th>

                {GLYCEMIC_PROFILE_TIMES.map((time) => (
                  <th key={time} scope="col">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map((day, dayIndex) => {
                const dayColorClass =
                  dayIndex % 2 === 0 ? styles.dayOdd : styles.dayEven;

                const expandedMainTime = GLYCEMIC_PROFILE_TIMES.find(
                  (time) => expandedNoteKey === `${day.id}:${time}`,
                );

                return (
                  <React.Fragment key={day.id}>
                    {/*
                      Для первого дня дата уже находится
                      в верхней левой ячейке таблицы.

                      Для остальных создаём компактную
                      разделительную строку — без повторения
                      заголовков времён.
                    */}
                    {dayIndex > 0 && (
                      <tr className={`${styles.dayDivider} ${dayColorClass}`}>
                        <th scope="rowgroup" className={styles.dayDateCell}>
                          {renderDateControls(day, dayIndex)}
                        </th>

                        <td colSpan={6} className={styles.dayDividerFill} />
                      </tr>
                    )}

                    {/* Числовые показатели дня */}
                    {MEASUREMENT_ROWS.map((row) => (
                      <tr
                        key={`${day.id}-${row.field}`}
                        className={dayColorClass}
                      >
                        <th
                          scope="row"
                          className={styles.metricCell}
                          title={row.fullLabel}
                        >
                          {row.shortLabel}
                        </th>

                        {GLYCEMIC_PROFILE_TIMES.map((time) => {
                          const measurement = getMeasurement(day, time);

                          return (
                            <td key={time} className={styles.valueCell}>
                              <input
                                className={styles.cellInput}
                                type="number"
                                inputMode="decimal"
                                min="0"
                                step={row.step}
                                value={measurement?.[row.field] ?? ""}
                                onChange={(event) =>
                                  updateNumericValue(
                                    day.id,
                                    time,
                                    row.field,
                                    event.target.value,
                                  )
                                }
                                aria-label={`${row.fullLabel}, ${formatFullDate(
                                  day.date,
                                )}, ${time}`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Примечания для каждого времени */}
                    <tr className={dayColorClass}>
                      <th scope="row" className={styles.metricCell}>
                        Прим.
                      </th>

                      {GLYCEMIC_PROFILE_TIMES.map((time) => {
                        const measurement = getMeasurement(day, time);

                        const hasStoredDetails = Boolean(
                          measurement?.note?.trim() ||
                            measurement?.insulinUnits != null,
                        );

                        const isOpen = expandedNoteKey === `${day.id}:${time}`;

                        return (
                          <td key={time} className={styles.noteCell}>
                            <button
                              type="button"
                              className={`${styles.noteButton} ${
                                hasStoredDetails
                                  ? styles.noteButtonHasValue
                                  : ""
                              } ${isOpen ? styles.noteButtonOpen : ""}`}
                              onClick={() => toggleNote(day.id, time)}
                              aria-expanded={isOpen}
                              aria-label={`Примечание, ${formatFullDate(
                                day.date,
                              )}, ${time}`}
                              title={
                                hasStoredDetails
                                  ? "Посмотреть или изменить запись"
                                  : "Добавить примечание"
                              }
                            >
                              ✎
                            </button>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Раскрытое примечание */}
                    {expandedMainTime && (
                      <tr className={`${styles.detailRow} ${dayColorClass}`}>
                        <td colSpan={7}>
                          {renderNoteEditor(
                            day,
                            expandedMainTime,
                            getMeasurement(day, expandedMainTime),
                          )}
                        </td>
                      </tr>
                    )}

                    {/*
                      Дополнительные измерения сохраняем
                      внутри общей таблицы после текущего дня.
                    */}
                    {additionalTimes.length > 0 && (
                      <tr className={`${styles.extraRow} ${dayColorClass}`}>
                        <td colSpan={7}>
                          <div className={styles.extraSection}>
                            <div className={styles.extraTitle}>
                              Дополнительные измерения
                            </div>

                            {additionalTimes.map((time) => {
                              const measurement = getMeasurement(day, time);

                              const isOpen =
                                expandedNoteKey === `${day.id}:${time}`;

                              const hasStoredDetails = Boolean(
                                measurement?.note?.trim() ||
                                  measurement?.insulinUnits != null,
                              );

                              return (
                                <div
                                  key={time}
                                  className={styles.extraMeasurement}
                                >
                                  <div className={styles.extraHeader}>
                                    <span className={styles.extraTime}>
                                      {time}
                                    </span>

                                    <button
                                      type="button"
                                      className={`${styles.extraNoteButton} ${
                                        hasStoredDetails
                                          ? styles.extraNoteButtonHasValue
                                          : ""
                                      }`}
                                      onClick={() => toggleNote(day.id, time)}
                                      aria-expanded={isOpen}
                                      aria-label={`Примечание для ${time}`}
                                    >
                                      ✎ Примечание
                                    </button>
                                  </div>

                                  <div className={styles.extraFields}>
                                    {MEASUREMENT_ROWS.map((row) => (
                                      <label
                                        key={row.field}
                                        className={styles.extraField}
                                      >
                                        <span title={row.fullLabel}>
                                          {row.shortLabel}
                                        </span>

                                        <input
                                          type="number"
                                          min="0"
                                          step={row.step}
                                          inputMode="decimal"
                                          value={measurement?.[row.field] ?? ""}
                                          onChange={(event) =>
                                            updateNumericValue(
                                              day.id,
                                              time,
                                              row.field,
                                              event.target.value,
                                            )
                                          }
                                          aria-label={`${row.fullLabel}, ${formatFullDate(
                                            day.date,
                                          )}, ${time}`}
                                        />
                                      </label>
                                    ))}
                                  </div>

                                  {isOpen &&
                                    renderNoteEditor(day, time, measurement)}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {hasLegacyInsulin && (
        <p className={styles.legacyHint}>
          Значения старого общего поля «Инсулин, ЕД» сохранены без распределения
          на базальный и болюсный. Откройте ✎ у нужного времени, чтобы увидеть
          их.
        </p>
      )}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить профиль"}
        </Button>
      </div>
    </form>
  );
};
