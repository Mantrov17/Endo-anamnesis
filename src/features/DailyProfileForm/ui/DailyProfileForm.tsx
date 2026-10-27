import React, { useMemo, useState } from "react";

import {
  DAILY_PROFILE_HOURS,
  DAILY_PROFILE_INSULINS,
  DAILY_PROFILE_MEAL_TYPE_LABELS,
  type DailyProfileDay,
  type DailyProfileInsulinName,
  type DailyProfileMealType,
  type InsulinProfileMeta,
} from "@/entities/dailyProfile";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";

import { useDailyProfileForm } from "../model/useDailyProfileForm";

import styles from "./styles.module.scss";

interface DailyProfileFormProps {
  patientId: string;
  initialDays?: DailyProfileDay[];
  onSuccess?: () => void;
}

interface AddEntryDraft {
  time: string;
  addGlucose: boolean;
  glucoseValue: string;
  glucoseNote: string;
  addInsulin: boolean;
  insulinName: DailyProfileInsulinName;
  insulinUnits: string;
  insulinNote: string;
  addMeal: boolean;
  breadUnits: string;
  mealType: DailyProfileMealType;
  mealNote: string;
}

const insulinMetaMap = new Map(
  DAILY_PROFILE_INSULINS.map((item) => [item.id, item]),
);

const defaultDraft: AddEntryDraft = {
  time: "08:00",
  addGlucose: true,
  glucoseValue: "",
  glucoseNote: "",
  addInsulin: false,
  insulinName: "aspart",
  insulinUnits: "",
  insulinNote: "",
  addMeal: false,
  breadUnits: "",
  mealType: "breakfast",
  mealNote: "",
};

const CHART_MIN = 0;
const CHART_MAX_FALLBACK = 20;
const CHART_PADDING_LEFT = 46;
const CHART_PADDING_RIGHT = 44;
const CHART_PADDING_TOP = 18;
const CHART_PADDING_BOTTOM = 32;
const SVG_WIDTH = 1000;
const SVG_HEIGHT = 330;
const CHART_HEIGHT = SVG_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;
const MINUTES_IN_DAY = 24 * 60;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const formatDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  });
};

const formatCompactDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
};

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
};

const combineDateTime = (date: string, time: string): Date =>
  new Date(`${date}T${time}:00`);

const getDayBounds = (date: string) => {
  const start = combineDateTime(date, "00:00");
  const end = combineDateTime(date, "23:59");

  return { start, end };
};

const getChartX = (minutes: number): number => {
  const innerWidth = SVG_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;

  return CHART_PADDING_LEFT + (minutes / MINUTES_IN_DAY) * innerWidth;
};

const getChartY = (value: number, maxValue: number): number => {
  const safeValue = clamp(value, CHART_MIN, maxValue);
  const ratio = (safeValue - CHART_MIN) / (maxValue - CHART_MIN || 1);

  return CHART_PADDING_TOP + CHART_HEIGHT - ratio * CHART_HEIGHT;
};

const getPathFromPoints = (points: { x: number; y: number }[]): string =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

const getCategoryInsulins = (category: "basal" | "bolus") =>
  DAILY_PROFILE_INSULINS.filter((item) => item.category === category);

const toNullableNumber = (value: string): number | null => {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

const getInsulinMeta = (
  insulinName: DailyProfileInsulinName,
): InsulinProfileMeta =>
  insulinMetaMap.get(insulinName) ?? DAILY_PROFILE_INSULINS[0];

const getDurationHours = (meta: InsulinProfileMeta): number =>
  (meta.durationHoursMin + meta.durationHoursMax) / 2;

const getActivePhaseLabel = (
  elapsedHours: number,
  meta: InsulinProfileMeta,
): string => {
  if (elapsedHours < meta.onsetHoursMin) {
    return "Ещё не начал действовать";
  }

  if (elapsedHours <= meta.onsetHoursMax) {
    return "Начало действия";
  }

  if (
    meta.peakHoursMin !== undefined &&
    meta.peakHoursMax !== undefined &&
    elapsedHours >= meta.peakHoursMin &&
    elapsedHours <= meta.peakHoursMax
  ) {
    return "Пик действия";
  }

  if (elapsedHours < meta.durationHoursMax - 0.75) {
    return "Основное действие";
  }

  return "Завершение действия";
};

const buildActiveInsulins = (
  days: DailyProfileDay[],
  selectedDate: string,
  time: string,
) => {
  const selectedDateTime = combineDateTime(selectedDate, time);

  return days
    .flatMap((day) =>
      day.insulinEntries.map((entry) => {
        const meta = getInsulinMeta(entry.insulinName);
        const start = combineDateTime(day.date, entry.time);
        const durationHours = meta.durationHoursMax;
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
        const elapsedHours =
          (selectedDateTime.getTime() - start.getTime()) / (60 * 60 * 1000);

        return {
          day,
          entry,
          meta,
          start,
          end,
          elapsedHours,
          isActive:
            selectedDateTime.getTime() >= start.getTime() &&
            selectedDateTime.getTime() <= end.getTime(),
        };
      }),
    )
    .filter((item) => item.isActive)
    .sort((left, right) => left.start.getTime() - right.start.getTime())
    .map((item) => ({
      entry: item.entry,
      meta: item.meta,
      phaseLabel: getActivePhaseLabel(item.elapsedHours, item.meta),
      startedAt: item.entry.time,
      dayLabel: formatCompactDate(item.day.date),
    }));
};

interface TimelineBlock {
  id: string;
  leftPercent: number;
  widthPercent: number;
  label: string;
  secondary: string;
  title: string;
  lane: number;
  isCarryOver: boolean;
}

const buildTimelineBlocks = (
  days: DailyProfileDay[],
  selectedDay: DailyProfileDay,
  category: "basal" | "bolus",
): TimelineBlock[] => {
  const { start, end } = getDayBounds(selectedDay.date);
  const totalMs = end.getTime() - start.getTime();
  let laneIndex = 0;

  return days
    .flatMap((day) =>
      day.insulinEntries
        .filter(
          (entry) => getInsulinMeta(entry.insulinName).category === category,
        )
        .map((entry) => {
          const meta = getInsulinMeta(entry.insulinName);
          const entryStart = combineDateTime(day.date, entry.time);
          const entryEnd = new Date(
            entryStart.getTime() + getDurationHours(meta) * 60 * 60 * 1000,
          );

          if (
            entryEnd.getTime() < start.getTime() ||
            entryStart.getTime() > end.getTime()
          ) {
            return null;
          }

          const visibleStart = Math.max(entryStart.getTime(), start.getTime());
          const visibleEnd = Math.min(entryEnd.getTime(), end.getTime());
          const leftPercent =
            ((visibleStart - start.getTime()) / totalMs) * 100;
          const widthPercent = Math.max(
            2,
            ((visibleEnd - visibleStart) / totalMs) * 100,
          );
          const isCarryOver = entryStart.getTime() < start.getTime();

          const block: TimelineBlock = {
            id: entry.id,
            leftPercent,
            widthPercent,
            label: meta.shortLabel,
            secondary: entry.units != null ? `${entry.units} ЕД` : "без дозы",
            title: `${meta.label} • ${
              entry.units != null ? `${entry.units} ЕД` : "без дозы"
            }`,
            lane: laneIndex % 2,
            isCarryOver,
          };

          laneIndex += 1;
          return block;
        }),
    )
    .filter((item): item is TimelineBlock => item !== null);
};

interface MealMarker {
  id: string;
  leftPercent: number;
  label: string;
  secondary: string;
  title: string;
}

const buildMealMarkers = (selectedDay: DailyProfileDay): MealMarker[] =>
  selectedDay.mealEntries.map((entry) => ({
    id: entry.id,
    leftPercent: (parseTimeToMinutes(entry.time) / MINUTES_IN_DAY) * 100,
    label: `${entry.breadUnits ?? "—"} ХЕ`,
    secondary: DAILY_PROFILE_MEAL_TYPE_LABELS[entry.mealType],
    title: `${DAILY_PROFILE_MEAL_TYPE_LABELS[entry.mealType]} • ${
      entry.breadUnits ?? "—"
    } ХЕ`,
  }));

export const DailyProfileForm: React.FC<DailyProfileFormProps> = ({
  patientId,
  initialDays,
  onSuccess,
}) => {
  const {
    days,
    selectedDay,
    autoSaveStatus,
    updateSelectedDate,
    goToPreviousDate,
    goToNextDate,
    updateTargets,
    addLinkedEntries,
    deleteGlucoseEntry,
    deleteMealEntry,
    deleteInsulinEntry,
    handleSubmit,
  } = useDailyProfileForm({ patientId, initialDays, onSuccess });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [draft, setDraft] = useState<AddEntryDraft>(defaultDraft);
  const [selectedGlucoseId, setSelectedGlucoseId] = useState<string | null>(
    null,
  );

  const glucoseEntries = useMemo(
    () =>
      selectedDay?.glucoseEntries.filter((entry) => entry.value != null) ?? [],
    [selectedDay],
  );

  const chartMaxValue = useMemo(() => {
    const highestGlucose = Math.max(
      ...glucoseEntries.map((entry) => entry.value ?? 0),
      selectedDay?.targetRanges.postMealMax ?? CHART_MAX_FALLBACK,
      CHART_MAX_FALLBACK,
    );

    return Math.max(CHART_MAX_FALLBACK, Math.ceil(highestGlucose / 2) * 2 + 2);
  }, [glucoseEntries, selectedDay]);

  const glucosePoints = useMemo(() => {
    return glucoseEntries
      .slice()
      .sort((left, right) => left.time.localeCompare(right.time))
      .map((entry) => ({
        entry,
        x: getChartX(parseTimeToMinutes(entry.time)),
        y: getChartY(entry.value ?? 0, chartMaxValue),
      }));
  }, [chartMaxValue, glucoseEntries]);

  const selectedPoint =
    glucosePoints.find((point) => point.entry.id === selectedGlucoseId) ?? null;

  const activeInsulinsAtPoint = useMemo(() => {
    if (!selectedPoint || !selectedDay) {
      return [];
    }

    return buildActiveInsulins(
      days,
      selectedDay.date,
      selectedPoint.entry.time,
    );
  }, [days, selectedDay, selectedPoint]);

  const basalBlocks = useMemo(
    () => (selectedDay ? buildTimelineBlocks(days, selectedDay, "basal") : []),
    [days, selectedDay],
  );
  const bolusBlocks = useMemo(
    () => (selectedDay ? buildTimelineBlocks(days, selectedDay, "bolus") : []),
    [days, selectedDay],
  );
  const mealMarkers = useMemo(
    () => (selectedDay ? buildMealMarkers(selectedDay) : []),
    [selectedDay],
  );

  if (!selectedDay) {
    return <p>Не удалось открыть суточный профиль.</p>;
  }

  const fastingMinY = getChartY(
    selectedDay.targetRanges.fastingMin,
    chartMaxValue,
  );
  const fastingMaxY = getChartY(
    selectedDay.targetRanges.fastingMax,
    chartMaxValue,
  );
  const postMealMaxY = getChartY(
    selectedDay.targetRanges.postMealMax,
    chartMaxValue,
  );
  const hypoY = getChartY(
    selectedDay.targetRanges.hypoThreshold,
    chartMaxValue,
  );

  const submitDraft = () => {
    if (!draft.addGlucose && !draft.addInsulin && !draft.addMeal) {
      window.alert("Выберите хотя бы один тип записи.");
      return;
    }

    addLinkedEntries({
      time: draft.time,
      addGlucose: draft.addGlucose,
      glucoseValue: toNullableNumber(draft.glucoseValue),
      glucoseNote: draft.glucoseNote,
      addInsulin: draft.addInsulin,
      insulinName: draft.insulinName,
      insulinUnits: toNullableNumber(draft.insulinUnits),
      insulinNote: draft.insulinNote,
      addMeal: draft.addMeal,
      breadUnits: toNullableNumber(draft.breadUnits),
      mealType: draft.mealType,
      mealNote: draft.mealNote,
    });

    setDraft({ ...defaultDraft, time: draft.time });
    setIsAddOpen(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.topToolbar}>
        <div className={styles.dateNavigator}>
          <Button type="button" variant="secondary" onClick={goToPreviousDate}>
            ← День назад
          </Button>

          <div className={styles.currentDateCard}>
            <span className={styles.currentDateLabel}>Дата профиля</span>
            <strong>{formatDate(selectedDay.date)}</strong>
            <input
              type="date"
              value={selectedDay.date}
              onChange={(event) => updateSelectedDate(event.target.value)}
            />
          </div>

          <Button type="button" variant="secondary" onClick={goToNextDate}>
            День вперёд →
          </Button>
        </div>

        <div
          role="status"
          aria-live="polite"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 8px",
            fontSize: 12,
            fontWeight: 500,
            color: autoSaveStatus === "error" ? "#b42318" : "#52766d",
          }}
        >
          {autoSaveStatus === "idle" && "Автосохранение включено"}

          {autoSaveStatus === "saving" && "◌ Сохраняется…"}

          {autoSaveStatus === "saved" && "✓ Сохранено автоматически"}

          {autoSaveStatus === "error" && "⚠ Не удалось сохранить"}
        </div>
      </section>

      <section className={styles.targetsCard}>
        <div className={styles.targetsHeader}>
          <div>
            <h3>Целевые диапазоны</h3>
            <p>Используются на графике как цветовые зоны.</p>
          </div>
        </div>

        <div className={styles.targetsGrid}>
          <Input
            label="Гипогликемия"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={selectedDay.targetRanges.hypoThreshold}
            onChange={(event) =>
              updateTargets({ hypoThreshold: Number(event.target.value) || 0 })
            }
            suffix="ммоль/л"
          />

          <Input
            label="Нижняя цель"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={selectedDay.targetRanges.fastingMin}
            onChange={(event) =>
              updateTargets({ fastingMin: Number(event.target.value) || 0 })
            }
            suffix="ммоль/л"
          />

          <Input
            label="Верхняя цель"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={selectedDay.targetRanges.fastingMax}
            onChange={(event) =>
              updateTargets({ fastingMax: Number(event.target.value) || 0 })
            }
            suffix="ммоль/л"
          />

          <Input
            label="После еды — верхний предел"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={selectedDay.targetRanges.postMealMax}
            onChange={(event) =>
              updateTargets({ postMealMax: Number(event.target.value) || 0 })
            }
            suffix="ммоль/л"
          />
        </div>
      </section>

      <section className={styles.profileCard}>
        <div className={styles.graphHeader}>
          <div>
            <h3>Суточный профиль: глюкоза, инсулин и питание</h3>
            <p>
              Синяя линия — глюкоза, ниже отображаются базальный и болюсный
              инсулин, а также хлебные единицы.
            </p>
          </div>

          <div className={styles.legend}>
            <span className={styles.legendGlucose}>● Глюкоза</span>
            <span className={styles.legendBasal}>▬ Базальный</span>
            <span className={styles.legendBolus}>▬ Болюсный</span>
            <span className={styles.legendMeal}>◆ ХЕ</span>
          </div>
        </div>

        <div className={styles.chartShell}>
          <div className={styles.chartPanel}>
            <svg
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className={styles.chartSvg}
            >
              <rect
                x={CHART_PADDING_LEFT}
                y={postMealMaxY}
                width={SVG_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT}
                height={fastingMaxY - postMealMaxY}
                className={styles.zonePostMeal}
              />
              <rect
                x={CHART_PADDING_LEFT}
                y={fastingMaxY}
                width={SVG_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT}
                height={fastingMinY - fastingMaxY}
                className={styles.zoneTarget}
              />
              <rect
                x={CHART_PADDING_LEFT}
                y={hypoY}
                width={SVG_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT}
                height={SVG_HEIGHT - CHART_PADDING_BOTTOM - hypoY}
                className={styles.zoneHypo}
              />

              {Array.from({ length: 11 }, (_, index) => {
                const value = (chartMaxValue / 10) * index;
                const y = getChartY(value, chartMaxValue);
                return (
                  <g key={value}>
                    <line
                      x1={CHART_PADDING_LEFT}
                      x2={SVG_WIDTH - CHART_PADDING_RIGHT}
                      y1={y}
                      y2={y}
                      className={styles.gridLine}
                    />
                  </g>
                );
              })}

              {DAILY_PROFILE_HOURS.map((label) => {
                const x = getChartX(parseTimeToMinutes(label));
                return (
                  <g key={label}>
                    <line
                      x1={x}
                      x2={x}
                      y1={CHART_PADDING_TOP}
                      y2={SVG_HEIGHT - CHART_PADDING_BOTTOM}
                      className={styles.gridLineVertical}
                    />
                    <text
                      x={x}
                      y={SVG_HEIGHT - 8}
                      className={styles.axisLabel}
                      textAnchor="middle"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              <line
                x1={CHART_PADDING_LEFT}
                x2={SVG_WIDTH - CHART_PADDING_RIGHT}
                y1={SVG_HEIGHT - CHART_PADDING_BOTTOM}
                y2={SVG_HEIGHT - CHART_PADDING_BOTTOM}
                className={styles.axisLine}
              />
              <line
                x1={CHART_PADDING_LEFT}
                x2={CHART_PADDING_LEFT}
                y1={CHART_PADDING_TOP}
                y2={SVG_HEIGHT - CHART_PADDING_BOTTOM}
                className={styles.axisLine}
              />

              <text
                x={SVG_WIDTH - 8}
                y={postMealMaxY + 4}
                className={styles.rangeLabel}
              >
                {selectedDay.targetRanges.postMealMax.toFixed(1)}
              </text>
              <text
                x={SVG_WIDTH - 8}
                y={fastingMaxY + 4}
                className={styles.rangeLabel}
              >
                {selectedDay.targetRanges.fastingMax.toFixed(1)}
              </text>
              <text
                x={SVG_WIDTH - 8}
                y={fastingMinY + 4}
                className={styles.rangeLabel}
              >
                {selectedDay.targetRanges.fastingMin.toFixed(1)}
              </text>
              <text
                x={SVG_WIDTH - 8}
                y={hypoY + 4}
                className={styles.rangeLabel}
              >
                {selectedDay.targetRanges.hypoThreshold.toFixed(1)}
              </text>

              {glucosePoints.length > 1 && (
                <path
                  d={getPathFromPoints(glucosePoints)}
                  className={styles.glucosePath}
                />
              )}

              {selectedPoint && (
                <line
                  x1={selectedPoint.x}
                  x2={selectedPoint.x}
                  y1={CHART_PADDING_TOP}
                  y2={SVG_HEIGHT - CHART_PADDING_BOTTOM}
                  className={styles.cursorLine}
                />
              )}

              {glucosePoints.map((point) => (
                <g key={point.entry.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={point.entry.id === selectedGlucoseId ? 8 : 6}
                    className={styles.glucosePoint}
                    onClick={() => setSelectedGlucoseId(point.entry.id)}
                  />
                  <text
                    x={point.x}
                    y={point.y - 12}
                    textAnchor="middle"
                    className={styles.pointValue}
                  >
                    {(point.entry.value ?? 0).toFixed(1)}
                  </text>
                </g>
              ))}
            </svg>

            {selectedPoint && (
              <div
                className={styles.pointTooltip}
                style={{
                  left: `${
                    ((selectedPoint.x - CHART_PADDING_LEFT) /
                      (SVG_WIDTH - CHART_PADDING_LEFT - CHART_PADDING_RIGHT)) *
                    100
                  }%`,
                  top: `${
                    ((selectedPoint.y - CHART_PADDING_TOP) / CHART_HEIGHT) * 100
                  }%`,
                }}
              >
                <div className={styles.tooltipHeader}>
                  <strong>{selectedPoint.entry.time}</strong>
                  <span>
                    {(selectedPoint.entry.value ?? 0).toFixed(1)} ммоль/л
                  </span>
                </div>
                {selectedPoint.entry.note && <p>{selectedPoint.entry.note}</p>}
                <div className={styles.tooltipInsulins}>
                  <span className={styles.tooltipLabel}>Активный инсулин</span>
                  {activeInsulinsAtPoint.length > 0 ? (
                    activeInsulinsAtPoint.map((item) => (
                      <div
                        key={`${item.entry.id}-${item.startedAt}`}
                        className={styles.tooltipInsulinItem}
                      >
                        <strong>{item.meta.shortLabel}</strong>
                        <span>
                          {item.entry.units != null
                            ? `${item.entry.units} ЕД`
                            : "без дозы"}{" "}
                          · {item.phaseLabel}
                        </span>
                        <small>
                          старт {item.startedAt}, {item.dayLabel}
                        </small>
                      </div>
                    ))
                  ) : (
                    <small>На этот момент активных инсулинов не найдено.</small>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.timelineSection}>
            <div className={styles.timelineRow}>
              <div className={styles.timelineLabel}>Базальный инсулин</div>
              <div className={styles.timelineTrack}>
                {basalBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`${styles.timelineBlock} ${styles.basalBlock} ${
                      block.isCarryOver ? styles.carryOverBlock : ""
                    }`}
                    style={{
                      left: `${block.leftPercent}%`,
                      width: `${block.widthPercent}%`,
                      top: `${8 + block.lane * 26}px`,
                    }}
                    title={block.title}
                  >
                    <span>{block.label}</span>
                    <small>{block.secondary}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.timelineRow}>
              <div className={styles.timelineLabel}>Болюсный инсулин</div>
              <div className={styles.timelineTrack}>
                {bolusBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`${styles.timelineBlock} ${styles.bolusBlock} ${
                      block.isCarryOver ? styles.carryOverBlock : ""
                    }`}
                    style={{
                      left: `${block.leftPercent}%`,
                      width: `${block.widthPercent}%`,
                      top: `${8 + block.lane * 26}px`,
                    }}
                    title={block.title}
                  >
                    <span>{block.label}</span>
                    <small>{block.secondary}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.timelineRow}>
              <div className={styles.timelineLabel}>Питание</div>
              <div className={styles.timelineTrack}>
                {mealMarkers.map((marker) => (
                  <button
                    key={marker.id}
                    type="button"
                    className={styles.mealMarker}
                    style={{ left: `${marker.leftPercent}%` }}
                    title={marker.title}
                  >
                    <span className={styles.mealMarkerDot} />
                    <span className={styles.mealMarkerBadge}>
                      {marker.label}
                    </span>
                    <small>{marker.secondary}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.timelineAxis}>
              <div />
              <div className={styles.timelineAxisLabels}>
                {DAILY_PROFILE_HOURS.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.entriesCard}>
        <div className={styles.entriesHeader}>
          <h3>Записи за {formatCompactDate(selectedDay.date)}</h3>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setIsAddOpen((current) => !current)}
          >
            {isAddOpen ? "×" : "+"}
          </button>
        </div>

        {isAddOpen && (
          <div className={styles.addPanel}>
            <div className={styles.addPanelTopRow}>
              <Input
                label="Время"
                type="time"
                value={draft.time}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    time: event.target.value,
                  }))
                }
              />

              <div className={styles.entryTypeSelector}>
                <label>
                  <input
                    type="checkbox"
                    checked={draft.addGlucose}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        addGlucose: event.target.checked,
                      }))
                    }
                  />
                  <span>Глюкоза</span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={draft.addInsulin}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        addInsulin: event.target.checked,
                      }))
                    }
                  />
                  <span>Инсулин</span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={draft.addMeal}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        addMeal: event.target.checked,
                      }))
                    }
                  />
                  <span>Питание</span>
                </label>
              </div>
            </div>

            <div className={styles.addBlocks}>
              {draft.addGlucose && (
                <div className={styles.addBlock}>
                  <h4>Глюкоза</h4>
                  <Input
                    label="Значение"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={draft.glucoseValue}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        glucoseValue: event.target.value,
                      }))
                    }
                    suffix="ммоль/л"
                  />
                  <Textarea
                    label="Комментарий"
                    rows={2}
                    value={draft.glucoseNote}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        glucoseNote: event.target.value,
                      }))
                    }
                    placeholder="Самочувствие, физнагрузка и т.д."
                  />
                </div>
              )}

              {draft.addInsulin && (
                <div className={styles.addBlock}>
                  <h4>Инсулин</h4>
                  <label className={styles.selectField}>
                    <span>Препарат</span>
                    <select
                      value={draft.insulinName}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          insulinName: event.target
                            .value as DailyProfileInsulinName,
                        }))
                      }
                    >
                      <optgroup label="Базальные">
                        {getCategoryInsulins("basal").map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Болюсные">
                        {getCategoryInsulins("bolus").map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </label>
                  <Input
                    label="Доза"
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={draft.insulinUnits}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        insulinUnits: event.target.value,
                      }))
                    }
                    suffix="ЕД"
                  />
                  <Textarea
                    label="Комментарий"
                    rows={2}
                    value={draft.insulinNote}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        insulinNote: event.target.value,
                      }))
                    }
                    placeholder="Например, коррекция или обычная доза"
                  />
                </div>
              )}

              {draft.addMeal && (
                <div className={styles.addBlock}>
                  <h4>Питание</h4>
                  <label className={styles.selectField}>
                    <span>Приём пищи</span>
                    <select
                      value={draft.mealType}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          mealType: event.target.value as DailyProfileMealType,
                        }))
                      }
                    >
                      {Object.entries(DAILY_PROFILE_MEAL_TYPE_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <Input
                    label="Хлебные единицы"
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    value={draft.breadUnits}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        breadUnits: event.target.value,
                      }))
                    }
                    suffix="ХЕ"
                  />
                  <Textarea
                    label="Комментарий"
                    rows={2}
                    value={draft.mealNote}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        mealNote: event.target.value,
                      }))
                    }
                    placeholder="Что было в приёме пищи"
                  />
                </div>
              )}
            </div>

            <div className={styles.addPanelActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAddOpen(false)}
              >
                Отмена
              </Button>
              <Button type="button" onClick={submitDraft}>
                Добавить запись
              </Button>
            </div>
          </div>
        )}

        <div className={styles.entriesLists}>
          <div className={styles.entriesColumn}>
            <h4>Глюкоза</h4>
            {selectedDay.glucoseEntries.length > 0 ? (
              selectedDay.glucoseEntries.map((entry) => (
                <div key={entry.id} className={styles.entryCard}>
                  <div>
                    <strong>{entry.time}</strong>
                    <span>
                      {entry.value != null
                        ? `${entry.value.toFixed(1)} ммоль/л`
                        : "без значения"}
                    </span>
                    {entry.note && <small>{entry.note}</small>}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteGlucoseEntry(entry.id)}
                  >
                    Удалить
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>Пока нет значений глюкозы.</p>
            )}
          </div>

          <div className={styles.entriesColumn}>
            <h4>Инсулин</h4>
            {selectedDay.insulinEntries.length > 0 ? (
              selectedDay.insulinEntries.map((entry) => {
                const meta = getInsulinMeta(entry.insulinName);
                return (
                  <div key={entry.id} className={styles.entryCard}>
                    <div>
                      <strong>{entry.time}</strong>
                      <span>
                        {meta.label} ·{" "}
                        {entry.units != null ? `${entry.units} ЕД` : "без дозы"}
                      </span>
                      {entry.note && <small>{entry.note}</small>}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteInsulinEntry(entry.id)}
                    >
                      Удалить
                    </button>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyState}>Пока нет введений инсулина.</p>
            )}
          </div>

          <div className={styles.entriesColumn}>
            <h4>Питание</h4>
            {selectedDay.mealEntries.length > 0 ? (
              selectedDay.mealEntries.map((entry) => (
                <div key={entry.id} className={styles.entryCard}>
                  <div>
                    <strong>{entry.time}</strong>
                    <span>
                      {DAILY_PROFILE_MEAL_TYPE_LABELS[entry.mealType]} ·{" "}
                      {entry.breadUnits ?? "—"} ХЕ
                    </span>
                    {entry.note && <small>{entry.note}</small>}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMealEntry(entry.id)}
                  >
                    Удалить
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>Пока нет приёмов пищи.</p>
            )}
          </div>
        </div>
      </section>
    </form>
  );
};
