import React from "react";

import type { GlycemicProfileDay } from "@/entities/glycemicProfile";

import { Button } from "@/shared/ui/Button";

import { useGlycemicProfileForm } from "../model/useGlycemicProfileForm";

import styles from "./styles.module.scss";

interface GlycemicProfileFormProps {
  patientId: string;

  initialDays?: GlycemicProfileDay[];

  onSuccess?: () => void;
}

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

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.toolbar}>
        <Button type="button" variant="secondary" onClick={addDay}>
          + Добавить дату
        </Button>
      </div>

      {days.length === 0 ? (
        <div className={styles.emptyState}>
          Нет добавленных дат. Нажмите «Добавить дату».
        </div>
      ) : (
        <>
          <div className={styles.desktopView}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Дата</th>

                    <th>Время</th>

                    <th>Гликемия</th>

                    <th>Единицы инсулина</th>

                    <th>Примечание</th>

                    <th className={styles.actionsColumn} />
                  </tr>
                </thead>

                <tbody>
                  {days.map((day) =>
                    day.measurements.map((measurement, measurementIndex) => (
                      <tr key={`${day.id}-${measurement.time}`}>
                        {measurementIndex === 0 && (
                          <td
                            rowSpan={day.measurements.length}
                            className={styles.dateCell}
                          >
                            <input
                              type="date"
                              value={day.date}
                              onChange={(event) =>
                                updateDayDate(day.id, event.target.value)
                              }
                              className={styles.dateInput}
                            />
                          </td>
                        )}

                        <td className={styles.timeCell}>{measurement.time}</td>

                        <td>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={measurement.glycemia ?? ""}
                            onChange={(event) =>
                              updateMeasurement(
                                day.id,
                                measurementIndex,
                                "glycemia",
                                event.target.value === ""
                                  ? null
                                  : Number(event.target.value),
                              )
                            }
                            className={styles.numberInput}
                            aria-label={`Гликемия ${measurement.time}`}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={measurement.insulinUnits ?? ""}
                            onChange={(event) =>
                              updateMeasurement(
                                day.id,
                                measurementIndex,
                                "insulinUnits",
                                event.target.value === ""
                                  ? null
                                  : Number(event.target.value),
                              )
                            }
                            className={styles.numberInput}
                            aria-label={`Единицы инсулина ${measurement.time}`}
                          />
                        </td>

                        <td>
                          <input
                            type="text"
                            value={measurement.note}
                            onChange={(event) =>
                              updateMeasurement(
                                day.id,
                                measurementIndex,
                                "note",
                                event.target.value,
                              )
                            }
                            className={styles.noteInput}
                            aria-label={`Примечание ${measurement.time}`}
                          />
                        </td>

                        {measurementIndex === 0 && (
                          <td
                            rowSpan={day.measurements.length}
                            className={styles.actionsCell}
                          >
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => removeDay(day.id)}
                            >
                              Удалить дату
                            </Button>
                          </td>
                        )}
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.mobileView}>
            {days.map((day) => (
              <section key={day.id} className={styles.mobileDay}>
                <div className={styles.mobileDayHeader}>
                  <input
                    type="date"
                    value={day.date}
                    onChange={(event) =>
                      updateDayDate(day.id, event.target.value)
                    }
                    className={styles.mobileDateInput}
                    aria-label="Дата гликемического профиля"
                  />

                  <Button
                    type="button"
                    variant="danger"
                    className={styles.mobileDeleteButton}
                    onClick={() => removeDay(day.id)}
                  >
                    Удалить
                  </Button>
                </div>

                <div className={styles.mobileTableWrapper}>
                  <table className={styles.mobileTable}>
                    <thead>
                      <tr>
                        <th className={styles.mobileTimeHeader}>Время</th>

                        <th
                          className={styles.mobileNumberHeader}
                          title="Гликемия"
                        >
                          Глик.
                        </th>

                        <th
                          className={styles.mobileNumberHeader}
                          title="Единицы инсулина"
                        >
                          Инс.
                        </th>

                        <th className={styles.mobileNoteHeader}>Примечание</th>
                      </tr>
                    </thead>

                    <tbody>
                      {day.measurements.map((measurement, measurementIndex) => (
                        <tr key={`${day.id}-mobile-${measurement.time}`}>
                          <td className={styles.mobileTimeCell}>
                            {measurement.time}
                          </td>

                          <td>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              inputMode="decimal"
                              value={measurement.glycemia ?? ""}
                              onChange={(event) =>
                                updateMeasurement(
                                  day.id,
                                  measurementIndex,
                                  "glycemia",
                                  event.target.value === ""
                                    ? null
                                    : Number(event.target.value),
                                )
                              }
                              className={styles.mobileNumberInput}
                              aria-label={`Гликемия ${measurement.time}`}
                            />
                          </td>

                          <td>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              inputMode="decimal"
                              value={measurement.insulinUnits ?? ""}
                              onChange={(event) =>
                                updateMeasurement(
                                  day.id,
                                  measurementIndex,
                                  "insulinUnits",
                                  event.target.value === ""
                                    ? null
                                    : Number(event.target.value),
                                )
                              }
                              className={styles.mobileNumberInput}
                              aria-label={`Единицы инсулина ${measurement.time}`}
                            />
                          </td>

                          <td>
                            <input
                              type="text"
                              value={measurement.note}
                              onChange={(event) =>
                                updateMeasurement(
                                  day.id,
                                  measurementIndex,
                                  "note",
                                  event.target.value,
                                )
                              }
                              className={styles.mobileNoteInput}
                              aria-label={`Примечание ${measurement.time}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить профиль"}
        </Button>
      </div>
    </form>
  );
};
