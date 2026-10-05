import React from "react";

import {
  GLYCEMIC_PROFILE_TIMES,
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

type MeasurementField = "glycemia" | "insulinUnits" | "breadUnits" | "note";

interface ProfileRow {
  field: MeasurementField;

  label: string;

  type: "number" | "text";

  step?: string;
}

const PROFILE_ROWS: ProfileRow[] = [
  {
    field: "glycemia",

    label: "ГК, ммоль/л",

    type: "number",

    step: "0.1",
  },

  {
    field: "insulinUnits",

    label: "Инсулин, ЕД",

    type: "number",

    step: "0.5",
  },

  {
    field: "breadUnits",

    label: "ХЕ",

    type: "number",

    step: "0.5",
  },

  {
    field: "note",

    label: "Примечание",

    type: "text",
  },
];

const formatShortDate = (date: string): string => {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return "Дата";
  }

  return `${day}.${month}`;
};

const getMeasurement = (
  day: GlycemicProfileDay,
  time: GlycemicProfileTime,
): GlycemicProfileMeasurement => {
  return (
    day.measurements.find((measurement) => measurement.time === time) ?? {
      time,

      glycemia: null,

      insulinUnits: null,

      breadUnits: null,

      note: "",
    }
  );
};

export const GlycemicProfileForm: React.FC<GlycemicProfileFormProps> = ({
  patientId,
  initialDays,
  onSuccess,
}) => {
  const {
    days,
    loading,

    addDay,
    removeDay,
    updateDayDate,
    updateMeasurement,
    handleSubmit,
  } = useGlycemicProfileForm({
    patientId,
    initialDays,
    onSuccess,
  });

  const handleCellChange = (
    dayId: string,
    time: GlycemicProfileTime,
    field: MeasurementField,
    value: string,
  ) => {
    if (field === "note") {
      updateMeasurement(dayId, time, field, value);

      return;
    }

    updateMeasurement(dayId, time, field, value === "" ? null : Number(value));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.toolbar}>
        <div className={styles.tableHint}>
          Дата и показатель закреплены. Таблицу можно прокручивать по часам.
        </div>

        <Button type="button" variant="secondary" onClick={addDay}>
          + Добавить день
        </Button>
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
                <th className={styles.dateHeader}>Дата</th>

                <th className={styles.metricHeader}>Показатель</th>

                {GLYCEMIC_PROFILE_TIMES.map((time) => (
                  <th key={time} className={styles.hourHeader}>
                    {time}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map((day) =>
                PROFILE_ROWS.map((row, rowIndex) => (
                  <tr
                    key={`${day.id}-${row.field}`}
                    className={rowIndex === 0 ? styles.dayStart : undefined}
                  >
                    {rowIndex === 0 && (
                      <td
                        rowSpan={PROFILE_ROWS.length}
                        className={styles.dateCell}
                      >
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
                            aria-label={`Удалить день ${formatShortDate(
                              day.date,
                            )}`}
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

                    {GLYCEMIC_PROFILE_TIMES.map((time) => {
                      const measurement = getMeasurement(day, time);

                      const value =
                        row.field === "note"
                          ? measurement.note
                          : (measurement[row.field] ?? "");

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
                            className={[
                              styles.cellInput,

                              row.field === "note"
                                ? styles.noteInput
                                : undefined,
                            ]
                              .filter(Boolean)
                              .join(" ")}
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

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить профиль"}
        </Button>
      </div>
    </form>
  );
};
