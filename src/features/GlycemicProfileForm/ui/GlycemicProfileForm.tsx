import React, { useState } from "react";

import {
  type GlycemicProfileDay,
  type GlycemicProfileMeasurement,
  type GlycemicProfileTime,
} from "@/entities/glycemicProfile";

import { Button } from "@/shared/ui/Button";

import { useGlycemicProfileForm } from "../model/useGlycemicProfileForm";

import styles from "./styles.module.scss";

interface GlycemicProfileFormProps {
  patientId: string;
  initialDays?: GlycemicProfileDay[];
  onSuccess?: () => void;
}

type MeasurementField =
  | "glycemia"
  | "breadUnits"
  | "bolusInsulinUnits"
  | "basalInsulinUnits"
  | "insulinUnits"
  | "note";

interface ProfileRow {
  field: MeasurementField;
  label: string;
  type: "number" | "text";
  step?: string;
}

const PROFILE_ROWS: ProfileRow[] = [
  { field: "glycemia", label: "Сахар крови", type: "number", step: "0.1" },
  { field: "breadUnits", label: "ХЕ/г", type: "number", step: "0.5" },
  {
    field: "bolusInsulinUnits",
    label: "Болюсный, ЕД",
    type: "number",
    step: "0.5",
  },
  {
    field: "basalInsulinUnits",
    label: "Базальный, ЕД",
    type: "number",
    step: "0.5",
  },
  { field: "note", label: "Примечание", type: "text" },
];

const LEGACY_ROW: ProfileRow = {
  field: "insulinUnits",
  label: "Инсулин, ЕД (старые данные)",
  type: "number",
  step: "0.5",
};

const formatShortDate = (date: string): string => {
  const [year, month, day] = date.split("-");
  return year && month && day ? `${day}.${month}` : "Дата";
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
  } = useGlycemicProfileForm({ patientId, initialDays, onSuccess });

  const [newTime, setNewTime] = useState("");
  const [timeError, setTimeError] = useState("");

  const rows = hasLegacyInsulin ? [...PROFILE_ROWS, LEGACY_ROW] : PROFILE_ROWS;

  const handleAddTime = () => {
    if (!addTime(newTime)) {
      setTimeError(
        "Выберите новое время между 00:00 и 23:59, которого ещё нет в таблице.",
      );
      return;
    }

    setNewTime("");
    setTimeError("");
  };

  const handleCellChange = (
    dayId: string,
    time: GlycemicProfileTime,
    field: MeasurementField,
    value: string,
  ) => {
    updateMeasurement(
      dayId,
      time,
      field,
      field === "note" ? value : value === "" ? null : Number(value),
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.toolbar}>
        <p className={styles.tableHint}>
          Таблица по дням. Время идёт по порядку, включая 24:00 — конец суток.
          Для просмотра на телефоне прокручивайте таблицу вбок.
        </p>

        <Button type="button" variant="secondary" onClick={addDay}>
          + Добавить день
        </Button>
      </div>

      <div className={styles.timeToolbar}>
        <label className={styles.timeLabel} htmlFor="profile-new-time">
          Дополнительное измерение
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
          Нет добавленных дней. Нажмите «Добавить день».
        </div>
      ) : (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.dateHeader} scope="col">
                  Дата
                </th>
                <th className={styles.metricHeader} scope="col">
                  Показатели
                </th>

                {times.map((time) => (
                  <th key={time} className={styles.hourHeader} scope="col">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map((day) =>
                rows.map((row, rowIndex) => (
                  <tr
                    key={`${day.id}-${row.field}`}
                    className={rowIndex === 0 ? styles.dayStart : undefined}
                  >
                    {rowIndex === 0 && (
                      <td rowSpan={rows.length} className={styles.dateCell}>
                        <div className={styles.dateCellContent}>
                          <label className={styles.datePicker}>
                            <span>{formatShortDate(day.date)}</span>
                            <input
                              type="date"
                              value={day.date}
                              onChange={(event) =>
                                updateDayDate(day.id, event.target.value)
                              }
                              aria-label={`Дата ${formatShortDate(day.date)}`}
                            />
                          </label>

                          <button
                            type="button"
                            className={styles.removeDayButton}
                            onClick={() => removeDay(day.id)}
                            aria-label={`Удалить день ${formatShortDate(day.date)}`}
                            title="Удалить день"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    )}

                    <th scope="row" className={styles.metricCell}>
                      {row.label}
                    </th>

                    {times.map((time) => {
                      const measurement = getMeasurement(day, time);
                      const value =
                        row.field === "note"
                          ? (measurement?.note ?? "")
                          : (measurement?.[row.field] ?? "");

                      return (
                        <td
                          key={`${day.id}-${row.field}-${time}`}
                          className={styles.valueCell}
                        >
                          <input
                            type={row.type}
                            step={row.step}
                            min={row.type === "number" ? "0" : undefined}
                            inputMode={
                              row.type === "number" ? "decimal" : undefined
                            }
                            value={value}
                            onChange={(event) =>
                              handleCellChange(
                                day.id,
                                time,
                                row.field,
                                event.target.value,
                              )
                            }
                            className={`${styles.cellInput} ${
                              row.field === "note" ? styles.noteInput : ""
                            }`}
                            aria-label={`${row.label}, ${formatShortDate(
                              day.date,
                            )}, ${time}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      )}

      {hasLegacyInsulin && (
        <p className={styles.legacyHint}>
          Строка «Инсулин, ЕД (старые данные)» сохранена из предыдущей версии.
          Эти значения не распределены автоматически между базальным и болюсным
          инсулином.
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
