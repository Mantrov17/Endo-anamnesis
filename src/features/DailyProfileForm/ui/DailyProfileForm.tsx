import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  DAILY_PROFILE_HOURS,
  DAILY_PROFILE_INSULINS,
  DAILY_PROFILE_MEAL_TYPE_LABELS,
  type DailyProfileDay,
  type DailyProfileInsulinEntry,
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
  addMeal: boolean;
  breadUnits: string;
  mealType: DailyProfileMealType;
}

const initialDraft: AddEntryDraft = {
  time: "08:00",
  addGlucose: true,
  glucoseValue: "",
  glucoseNote: "",
  addInsulin: false,
  insulinName: "aspart",
  insulinUnits: "",
  addMeal: false,
  breadUnits: "",
  mealType: "breakfast",
};

const INSULINS_BY_ID = new Map(
  DAILY_PROFILE_INSULINS.map((item) => [item.id, item]),
);

const MINUTES_PER_DAY = 1440;

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 294;

const PLOT_LEFT = 46;
const PLOT_RIGHT = 44;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 34;

const PLOT_HEIGHT = SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
const PLOT_WIDTH = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;

const MAX_GLUCOSE = 20;

const getInsulin = (name: DailyProfileInsulinName): InsulinProfileMeta =>
  INSULINS_BY_ID.get(name) ?? DAILY_PROFILE_INSULINS[0]!;

const minutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);

  return Number.isFinite(hour) && Number.isFinite(minute)
    ? hour * 60 + minute
    : 0;
};

const dateOffsetDays = (date: string, target: string): number =>
  Math.round(
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${target}T00:00:00Z`)) /
      86_400_000,
  );

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const percentAt = (minute: number): string =>
  `${(minute / MINUTES_PER_DAY) * 100}%`;

const xAt = (minute: number): number =>
  PLOT_LEFT + (minute / MINUTES_PER_DAY) * PLOT_WIDTH;

const yAt = (value: number, max: number): number =>
  PLOT_TOP + PLOT_HEIGHT - (clamp(value, 0, max) / max) * PLOT_HEIGHT;

const asNumberOrNull = (raw: string): number | null => {
  if (!raw.trim()) return null;

  const value = Number(raw.replace(",", "."));

  return Number.isFinite(value) ? value : null;
};

const decimal = (value: number): string =>
  value.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
  });

const formatDate = (date: string): string =>
  new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface DoseEvent {
  key: string;
  date: string;
  entry: DailyProfileInsulinEntry;
  meta: InsulinProfileMeta;

  // Минуты относительно начала выбранных суток.
  start: number;
  end: number;

  // Уровень размещения при перекрытии доз.
  lane: number;
}

const getDoseEvents = (
  days: DailyProfileDay[],
  targetDate: string,
  category: "basal" | "bolus",
): DoseEvent[] => {
  const candidates = days.flatMap((day) =>
    (day.insulinEntries ?? []).flatMap((entry) => {
      const meta = getInsulin(entry.insulinName);

      if (meta.category !== category) return [];

      const start =
        dateOffsetDays(day.date, targetDate) * MINUTES_PER_DAY +
        minutes(entry.time);

      const end = start + meta.durationHoursMax * 60;

      if (!(end > 0 && start < MINUTES_PER_DAY)) {
        return [];
      }

      return [
        {
          key: `${day.date}:${entry.id}`,
          date: day.date,
          entry,
          meta,
          start,
          end,
          lane: 0,
        },
      ];
    }),
  );

  candidates.sort((a, b) => a.start - b.start);

  const laneEnd: number[] = [];

  return candidates.map((item) => {
    const visibleStart = Math.max(0, item.start);

    let lane = laneEnd.findIndex((end) => end + 25 <= visibleStart);

    if (lane < 0) lane = laneEnd.length;

    laneEnd[lane] = Math.min(MINUTES_PER_DAY, item.end);

    return { ...item, lane };
  });
};

const phasePosition = (
  from: number,
  to: number,
): React.CSSProperties | null => {
  const start = clamp(from, 0, MINUTES_PER_DAY);
  const end = clamp(to, 0, MINUTES_PER_DAY);

  if (end <= start) return null;

  return {
    left: percentAt(start),
    width: percentAt(end - start),
  };
};

const phaseDescription = (
  elapsed: number,
  meta: InsulinProfileMeta,
): string => {
  if (elapsed < 0) {
    return "Инсулин ещё не введён";
  }

  if (elapsed < meta.onsetHoursMax) {
    return "До начала действия / начало действия";
  }

  if (elapsed >= meta.durationHoursMax) {
    return "Окно действия завершилось";
  }

  if (meta.durationHoursMin !== undefined && elapsed >= meta.durationHoursMin) {
    return "Возможное остаточное действие";
  }

  if (
    meta.peakHoursMin !== undefined &&
    meta.peakHoursMax !== undefined &&
    elapsed >= meta.peakHoursMin &&
    elapsed <= meta.peakHoursMax
  ) {
    return "Период пика действия";
  }

  return "Период действия";
};

const insulinDescription = (dose: DoseEvent): string => {
  const meta = dose.meta;

  const duration =
    meta.durationHoursMin === undefined
      ? `до ${decimal(meta.durationHoursMax)} ч`
      : `${decimal(meta.durationHoursMin)}–${decimal(meta.durationHoursMax)} ч`;

  const peak =
    meta.peakHoursMin === undefined || meta.peakHoursMax === undefined
      ? "пик не обозначен"
      : `пик ${decimal(meta.peakHoursMin)}–${decimal(meta.peakHoursMax)} ч`;

  return (
    `${meta.label}: ${dose.entry.units ?? "—"} ЕД, ` +
    `введено ${dose.date} в ${dose.entry.time}; ` +
    `начало ${decimal(meta.onsetHoursMin)}–` +
    `${decimal(meta.onsetHoursMax)} ч, ${peak}, ` +
    `действие ${duration}.`
  );
};

interface InsulinTimelineProps {
  label: string;
  category: "basal" | "bolus";
  doses: DoseEvent[];
  selectedDoseKey: string | null;
  onSelectDose: (key: string | null) => void;
}

const InsulinTimeline: React.FC<InsulinTimelineProps> = ({
  label,
  category,
  doses,
  selectedDoseKey,
  onSelectDose,
}) => {
  const trackHeight = Math.max(
    61,
    (Math.max(0, ...doses.map((dose) => dose.lane)) + 1) * 58 + 4,
  );

  return (
    <div
      className={`${styles.timelineRow} ${
        category === "basal" ? styles.basalRow : styles.bolusRow
      }`}
    >
      <div className={styles.timelineLabel}>{label}</div>

      <div className={styles.timelineTrack} style={{ height: trackHeight }}>
        {doses.map((dose) => {
          const { meta, start, end, lane } = dose;
          const y = lane * 58;

          const onsetEnd = start + meta.onsetHoursMax * 60;

          const regularEnd =
            start + (meta.durationHoursMin ?? meta.durationHoursMax) * 60;

          const peakStart =
            meta.peakHoursMin === undefined
              ? undefined
              : start + meta.peakHoursMin * 60;

          const peakEnd =
            meta.peakHoursMax === undefined
              ? undefined
              : start + meta.peakHoursMax * 60;

          const onsetStyle = phasePosition(start, onsetEnd);
          const mainStyle = phasePosition(onsetEnd, regularEnd);

          const peakStyle =
            peakStart === undefined || peakEnd === undefined
              ? null
              : phasePosition(peakStart, peakEnd);

          const tailStyle =
            meta.durationHoursMin !== undefined
              ? phasePosition(regularEnd, end)
              : null;

          const injectionVisible = start >= 0 && start < MINUTES_PER_DAY;

          const at = percentAt(start);
          const title = insulinDescription(dose);

          const isSelected = dose.key === selectedDoseKey;

          return (
            <React.Fragment key={dose.key}>
              {/* Светлое основное действие */}
              {mainStyle && (
                <span
                  title={title}
                  aria-hidden="true"
                  className={styles.insulinMain}
                  style={{
                    ...mainStyle,
                    top: y + 34,
                  }}
                />
              )}

              {/* Остаточное действие — штриховка */}
              {tailStyle && (
                <span
                  title={title}
                  aria-hidden="true"
                  className={styles.insulinResidual}
                  style={{
                    ...tailStyle,
                    top: y + 34,
                  }}
                />
              )}

              {/* Пик действия */}
              {peakStyle && (
                <span
                  title={title}
                  aria-hidden="true"
                  className={styles.insulinPeak}
                  style={{
                    ...peakStyle,
                    top: y + 34,
                  }}
                />
              )}

              {/* Пунктир до начала действия */}
              {onsetStyle && (
                <span
                  title={title}
                  aria-hidden="true"
                  className={styles.insulinOnset}
                  style={{
                    ...onsetStyle,
                    top: y + 41,
                  }}
                />
              )}

              {injectionVisible ? (
                <>
                  <span
                    className={styles.doseBadge}
                    style={{
                      left: `clamp(33px, ${at}, calc(100% - 33px))`,
                      top: y + 2,
                    }}
                  >
                    {dose.entry.units === null
                      ? "— ЕД"
                      : `${decimal(dose.entry.units)} ЕД`}
                  </span>

                  <button
                    type="button"
                    title={title}
                    aria-label={title}
                    aria-pressed={isSelected}
                    className={`${styles.injectionDot} ${
                      isSelected ? styles.injectionDotSelected : ""
                    }`}
                    style={{
                      left: at,
                      top: y + 32,
                    }}
                    onClick={() => onSelectDose(isSelected ? null : dose.key)}
                  />
                </>
              ) : (
                <button
                  type="button"
                  title={title}
                  aria-label={`Продолжение действия с предыдущего дня. ${title}`}
                  aria-pressed={isSelected}
                  className={styles.carryOverMarker}
                  style={{
                    left: 0,
                    top: y + 23,
                  }}
                  onClick={() => onSelectDose(isSelected ? null : dose.key)}
                >
                  ↤
                </button>
              )}
            </React.Fragment>
          );
        })}

        {doses.length === 0 && (
          <span className={styles.emptyTrack}>Нет введений</span>
        )}
      </div>
    </div>
  );
};

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
    deleteInsulinEntry,
    deleteMealEntry,
    handleSubmit,
  } = useDailyProfileForm({
    patientId,
    initialDays,
    onSuccess,
  });

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [draft, setDraft] = useState<AddEntryDraft>(initialDraft);

  const [selectedGlucoseId, setSelectedGlucoseId] = useState<string | null>(
    null,
  );

  const [selectedDoseKey, setSelectedDoseKey] = useState<string | null>(null);

  /*
   * ЕДИНЫЙ КУРСОР ДЛЯ ВСЕХ ЧЕТЫРЁХ ПОЛОС
   *
   * Здесь не создаются отдельные линии в разных
   * блоках. Мы измеряем положение точки глюкозы
   * и нижнюю границу полосы питания.
   *
   * Это позволяет провести одну линию через
   * весь график, включая промежутки.
   */

  const graphLayersRef = useRef<HTMLDivElement>(null);
  const glucoseSvgRef = useRef<SVGSVGElement>(null);
  const mealTrackRef = useRef<HTMLDivElement>(null);

  const [cursorGeometry, setCursorGeometry] = useState<{
    left: number;
    top: number;
    height: number;
  } | null>(null);

  const points = useMemo(() => {
    const entries = (selectedDay?.glucoseEntries ?? [])
      .filter((entry) => entry.value !== null && Number.isFinite(entry.value))
      .slice()
      .sort((a, b) => a.time.localeCompare(b.time));

    const max = Math.max(
      MAX_GLUCOSE,
      selectedDay?.targetRanges.postMealMax ?? 10,
      ...entries.map((entry) => entry.value ?? 0),
    );

    const maxY = Math.ceil(max / 2) * 2;

    return {
      maxY,
      data: entries.map((entry) => ({
        entry,
        x: xAt(minutes(entry.time)),
        y: yAt(entry.value ?? 0, maxY),
      })),
    };
  }, [selectedDay]);

  const basalDoses = useMemo(
    () => (selectedDay ? getDoseEvents(days, selectedDay.date, "basal") : []),
    [days, selectedDay],
  );

  const bolusDoses = useMemo(
    () => (selectedDay ? getDoseEvents(days, selectedDay.date, "bolus") : []),
    [days, selectedDay],
  );

  const selectedPoint = points.data.find(
    (point) => point.entry.id === selectedGlucoseId,
  );

  const activeAtPoint = useMemo(() => {
    if (!selectedPoint) return [];

    const at = minutes(selectedPoint.entry.time);

    return [...basalDoses, ...bolusDoses]
      .filter((dose) => dose.start <= at && dose.end > at)
      .sort((a, b) => b.start - a.start);
  }, [selectedPoint, basalDoses, bolusDoses]);

  const selectedDose = [...basalDoses, ...bolusDoses].find(
    (item) => item.key === selectedDoseKey,
  );

  /*
   * Измеряем положение единого курсора.
   *
   * Точка задаётся в координатах SVG.
   * Затем переводим её в пиксели.
   *
   * Нижняя граница берётся именно у полосы пищи.
   *
   * ResizeObserver обновляет положение при
   * изменении ширины экрана или высоты полос.
   */
  useLayoutEffect(() => {
    if (!selectedPoint) {
      setCursorGeometry(null);
      return;
    }

    const layers = graphLayersRef.current;
    const svg = glucoseSvgRef.current;
    const meal = mealTrackRef.current;

    if (!layers || !svg || !meal) return;

    const measureCursor = () => {
      const layersRect = layers.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const mealRect = meal.getBoundingClientRect();

      const left =
        svgRect.left -
        layersRect.left +
        (selectedPoint.x / SVG_WIDTH) * svgRect.width;

      const top =
        svgRect.top -
        layersRect.top +
        (selectedPoint.y / SVG_HEIGHT) * svgRect.height;

      const bottom = mealRect.bottom - layersRect.top;
      const height = Math.max(0, bottom - top);

      setCursorGeometry((previous) => {
        if (
          previous &&
          Math.abs(previous.left - left) < 0.5 &&
          Math.abs(previous.top - top) < 0.5 &&
          Math.abs(previous.height - height) < 0.5
        ) {
          return previous;
        }

        return { left, top, height };
      });
    };

    measureCursor();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measureCursor)
        : null;

    if (observer) {
      observer.observe(layers);
      observer.observe(svg);
      observer.observe(meal);
    }

    window.addEventListener("resize", measureCursor);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureCursor);
    };
  }, [
    selectedPoint?.x,
    selectedPoint?.y,
    selectedDay?.date,
    basalDoses,
    bolusDoses,
  ]);

  if (!selectedDay) {
    return <p>Не удалось открыть суточный профиль.</p>;
  }

  const { targetRanges } = selectedDay;

  const yHypo = yAt(targetRanges.hypoThreshold, points.maxY);

  const yMin = yAt(targetRanges.fastingMin, points.maxY);

  const yMax = yAt(targetRanges.fastingMax, points.maxY);

  const yMeal = yAt(targetRanges.postMealMax, points.maxY);

  const submitDraft = () => {
    if (!draft.addGlucose && !draft.addInsulin && !draft.addMeal) {
      window.alert("Выберите хотя бы один тип записи.");
      return;
    }

    if (!draft.time) {
      window.alert("Укажите время записи.");
      return;
    }

    const glucoseValue = asNumberOrNull(draft.glucoseValue);
    const insulinUnits = asNumberOrNull(draft.insulinUnits);
    const breadUnits = asNumberOrNull(draft.breadUnits);

    if (
      (draft.addGlucose && (glucoseValue === null || glucoseValue < 0)) ||
      (draft.addInsulin && (insulinUnits === null || insulinUnits <= 0)) ||
      (draft.addMeal && (breadUnits === null || breadUnits < 0))
    ) {
      window.alert("Заполните выбранные числовые поля корректными значениями.");
      return;
    }

    addLinkedEntries({
      time: draft.time,

      addGlucose: draft.addGlucose,
      glucoseValue,
      glucoseNote: draft.glucoseNote,

      addInsulin: draft.addInsulin,
      insulinName: draft.insulinName,
      insulinUnits,
      insulinNote: "",

      addMeal: draft.addMeal,
      breadUnits,
      mealType: draft.mealType,
      mealNote: "",
    });

    setIsAddOpen(false);

    setDraft({
      ...initialDraft,
      time: draft.time,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Дата и автосохранение */}

      <div className={styles.topToolbar}>
        <div className={styles.dateNavigator}>
          <Button
            type="button"
            variant="secondary"
            onClick={goToPreviousDate}
            aria-label="Предыдущий день"
          >
            ‹
          </Button>

          <div className={styles.currentDateCard}>
            <strong>{formatDate(selectedDay.date)}</strong>

            <input
              type="date"
              aria-label="Выбрать дату"
              value={selectedDay.date}
              onChange={(event) => updateSelectedDate(event.target.value)}
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={goToNextDate}
            aria-label="Следующий день"
          >
            ›
          </Button>
        </div>

        <span
          className={`${styles.saveStatus} ${
            autoSaveStatus === "error" ? styles.saveError : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {autoSaveStatus === "saving"
            ? "Сохраняется…"
            : autoSaveStatus === "saved"
              ? "✓ Сохранено"
              : autoSaveStatus === "error"
                ? "Не удалось сохранить"
                : "Автосохранение включено"}
        </span>
      </div>

      {/* Целевые диапазоны */}

      <section className={styles.targetsCard}>
        <h3>Целевые диапазоны</h3>

        <div className={styles.targetsGrid}>
          <Input
            label="Гипогликемия"
            type="number"
            inputMode="decimal"
            step="0.1"
            suffix="ммоль/л"
            value={targetRanges.hypoThreshold}
            onChange={(event) =>
              updateTargets({
                hypoThreshold: Number(event.target.value) || 0,
              })
            }
          />

          <Input
            label="Нижняя цель"
            type="number"
            inputMode="decimal"
            step="0.1"
            suffix="ммоль/л"
            value={targetRanges.fastingMin}
            onChange={(event) =>
              updateTargets({
                fastingMin: Number(event.target.value) || 0,
              })
            }
          />

          <Input
            label="Верхняя цель"
            type="number"
            inputMode="decimal"
            step="0.1"
            suffix="ммоль/л"
            value={targetRanges.fastingMax}
            onChange={(event) =>
              updateTargets({
                fastingMax: Number(event.target.value) || 0,
              })
            }
          />

          <Input
            label="После еды — верхний предел"
            type="number"
            inputMode="decimal"
            step="0.1"
            suffix="ммоль/л"
            value={targetRanges.postMealMax}
            onChange={(event) =>
              updateTargets({
                postMealMax: Number(event.target.value) || 0,
              })
            }
          />
        </div>
      </section>

      {/* Единый суточный график */}

      <section className={styles.profileCard}>
        <h3>Суточный профиль: глюкоза, инсулин и питание</h3>

        <div className={styles.legend}>
          <span className={styles.legendGlucose}>● Глюкоза</span>
          <span className={styles.legendBasal}>● Базальный</span>
          <span className={styles.legendBolus}>● Болюсный</span>
          <span className={styles.legendMeal}>● ХЕ</span>
        </div>

        <div
          className={styles.phasesLegend}
          aria-label="Обозначения фаз действия инсулина"
        >
          <span>
            <i className={styles.legendInjection} />
            Введение
          </span>
          <span>
            <i className={styles.legendOnset} />
            До начала действия
          </span>
          <span>
            <i className={styles.legendDuration} />
            Действие
          </span>
          <span>
            <i className={styles.legendPeak} />
            Пик
          </span>
          <span>
            <i className={styles.legendResidual} />
            Остаточное действие
          </span>
        </div>

        <div className={styles.chartShell}>
          {/*
            Все четыре полосы внутри graphLayers.

            Именно это объединяет их в одну
            систему координат и позволяет
            нарисовать курсор одним элементом.
          */}

          <div className={styles.graphLayers} ref={graphLayersRef}>
            <div className={styles.chartPanel}>
              <svg
                ref={glucoseSvgRef}
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className={styles.chartSvg}
                aria-label="График глюкозы по времени суток"
              >
                {/* Цветовые зоны */}

                <rect
                  x={PLOT_LEFT}
                  y={yMeal}
                  width={PLOT_WIDTH}
                  height={Math.max(0, yMax - yMeal)}
                  className={styles.zonePostMeal}
                />

                <rect
                  x={PLOT_LEFT}
                  y={yMax}
                  width={PLOT_WIDTH}
                  height={Math.max(0, yMin - yMax)}
                  className={styles.zoneTarget}
                />

                <rect
                  x={PLOT_LEFT}
                  y={yHypo}
                  width={PLOT_WIDTH}
                  height={Math.max(0, SVG_HEIGHT - PLOT_BOTTOM - yHypo)}
                  className={styles.zoneHypo}
                />

                {/* Горизонтальная сетка */}

                {Array.from(
                  { length: 6 },
                  (_, index) => (index * points.maxY) / 5,
                ).map((value) => (
                  <g key={value}>
                    <line
                      x1={PLOT_LEFT}
                      x2={SVG_WIDTH - PLOT_RIGHT}
                      y1={yAt(value, points.maxY)}
                      y2={yAt(value, points.maxY)}
                      className={styles.gridLine}
                    />

                    <text
                      x={PLOT_LEFT - 10}
                      y={yAt(value, points.maxY) + 4}
                      textAnchor="end"
                      className={styles.axisLabel}
                    >
                      {decimal(value)}
                    </text>
                  </g>
                ))}

                {/* Вертикальная сетка времени */}

                {DAILY_PROFILE_HOURS.map((label) => (
                  <line
                    key={label}
                    x1={xAt(minutes(label))}
                    x2={xAt(minutes(label))}
                    y1={PLOT_TOP}
                    y2={SVG_HEIGHT - PLOT_BOTTOM}
                    className={styles.gridLineVertical}
                  />
                ))}

                {/* Целевые значения */}

                {[
                  targetRanges.postMealMax,
                  targetRanges.fastingMax,
                  targetRanges.fastingMin,
                  targetRanges.hypoThreshold,
                ].map((value, index) => (
                  <text
                    key={index}
                    x={SVG_WIDTH - 5}
                    y={yAt(value, points.maxY) + 4}
                    textAnchor="end"
                    className={styles.rangeLabel}
                  >
                    {decimal(value)}
                  </text>
                ))}

                {/* Линия измерений глюкозы */}

                {points.data.length > 1 && (
                  <path
                    d={points.data
                      .map(
                        (point, index) =>
                          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
                      )
                      .join(" ")}
                    className={styles.glucosePath}
                  />
                )}

                {points.data.map((point) => (
                  <g key={point.entry.id}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={selectedGlucoseId === point.entry.id ? 8 : 6}
                      className={styles.glucosePoint}
                      tabIndex={0}
                      role="button"
                      aria-label={`${point.entry.time}: ${point.entry.value} ммоль/л`}
                      onClick={() =>
                        setSelectedGlucoseId(
                          selectedGlucoseId === point.entry.id
                            ? null
                            : point.entry.id,
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();

                          setSelectedGlucoseId(
                            selectedGlucoseId === point.entry.id
                              ? null
                              : point.entry.id,
                          );
                        }
                      }}
                    />

                    <text
                      x={point.x}
                      y={point.y - 13}
                      textAnchor="middle"
                      className={styles.pointValue}
                    >
                      {decimal(point.entry.value ?? 0)}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Информация о выбранной точке */}

              {selectedPoint && (
                <div
                  className={styles.pointTooltip}
                  style={{
                    left: `${clamp(
                      (selectedPoint.x / SVG_WIDTH) * 100,
                      14,
                      86,
                    )}%`,
                  }}
                >
                  <div className={styles.tooltipHeader}>
                    <strong>{selectedPoint.entry.time}</strong>
                    <strong>
                      {decimal(selectedPoint.entry.value ?? 0)} ммоль/л
                    </strong>
                  </div>

                  {selectedPoint.entry.note && (
                    <p>{selectedPoint.entry.note}</p>
                  )}

                  <small>Введения инсулина к этому времени:</small>

                  {activeAtPoint.length ? (
                    activeAtPoint.map((dose) => (
                      <div key={dose.key} className={styles.tooltipInsulinItem}>
                        <strong>
                          {dose.meta.shortLabel}, {dose.entry.units ?? "—"} ЕД
                        </strong>

                        <span>
                          {phaseDescription(
                            (minutes(selectedPoint.entry.time) - dose.start) /
                              60,
                            dose.meta,
                          )}
                        </span>

                        <small>
                          Введён {dose.date} в {dose.entry.time}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p>Нет известных введений в этом окне действия.</p>
                  )}

                  <button
                    type="button"
                    className={styles.closeTooltip}
                    onClick={() => setSelectedGlucoseId(null)}
                  >
                    Закрыть
                  </button>
                </div>
              )}
            </div>

            {/* Базальный, болюсный и питание */}

            <div className={styles.timelineSection}>
              <InsulinTimeline
                label="Базальный инсулин"
                category="basal"
                doses={basalDoses}
                selectedDoseKey={selectedDoseKey}
                onSelectDose={setSelectedDoseKey}
              />

              <InsulinTimeline
                label="Болюсный инсулин"
                category="bolus"
                doses={bolusDoses}
                selectedDoseKey={selectedDoseKey}
                onSelectDose={setSelectedDoseKey}
              />

              <div className={styles.timelineRow}>
                <div className={styles.timelineLabel}>Питание / ХЕ</div>

                <div
                  ref={mealTrackRef}
                  className={styles.timelineTrack}
                  style={{ height: 59 }}
                >
                  {selectedDay.mealEntries.map((meal) => (
                    <div
                      key={meal.id}
                      className={styles.mealMarker}
                      style={{
                        left: percentAt(minutes(meal.time)),
                      }}
                      title={`${meal.time}: ${
                        DAILY_PROFILE_MEAL_TYPE_LABELS[meal.mealType]
                      }, ${meal.breadUnits ?? "—"} ХЕ`}
                    >
                      <span className={styles.mealMarkerDot} />

                      <strong>{meal.breadUnits ?? "—"} ХЕ</strong>

                      <small>
                        {DAILY_PROFILE_MEAL_TYPE_LABELS[meal.mealType]}
                      </small>
                    </div>
                  ))}

                  {!selectedDay.mealEntries.length && (
                    <span className={styles.emptyTrack}>Нет приёмов пищи</span>
                  )}
                </div>
              </div>

              {/* Единственная шкала времени */}

              <div className={styles.timelineAxis}>
                <div className={styles.timelineAxisLabels}>
                  {DAILY_PROFILE_HOURS.map((hour) => (
                    <span key={hour}>{hour}</span>
                  ))}
                </div>
              </div>

              {selectedDose && (
                <div className={styles.selectedDoseInfo} role="status">
                  <span>{insulinDescription(selectedDose)}</span>

                  <button
                    type="button"
                    onClick={() => setSelectedDoseKey(null)}
                    aria-label="Закрыть информацию"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/*
              ЕДИНАЯ ВЕРТИКАЛЬНАЯ ЛИНИЯ

              Важно: эта линия размещена не внутри
              SVG глюкозы, а поверх общего graphLayers.

              Она проходит:
              точка глюкозы
                 ↓
              базальный инсулин
                 ↓
              болюсный инсулин
                 ↓
              питание / ХЕ
            */}

            {selectedPoint && cursorGeometry && (
              <div
                className={styles.unifiedCursor}
                aria-hidden="true"
                style={{
                  left: cursorGeometry.left,
                  top: cursorGeometry.top,
                  height: cursorGeometry.height,
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Добавление записей */}

      <section className={styles.entriesCard}>
        <div className={styles.entriesHeader}>
          <h3>Записи за {formatDate(selectedDay.date)}</h3>

          <button
            type="button"
            className={styles.addButton}
            aria-label={isAddOpen ? "Закрыть добавление" : "Добавить запись"}
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
                {(
                  [
                    ["addGlucose", "Глюкоза"],
                    ["addInsulin", "Инсулин"],
                    ["addMeal", "Питание"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={draft[key]}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          [key]: event.target.checked,
                        }))
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.addBlocks}>
              {draft.addGlucose && (
                <div className={styles.addBlock}>
                  <h4>Глюкоза</h4>

                  <Input
                    label="Значение"
                    type="number"
                    min={0}
                    step="0.1"
                    inputMode="decimal"
                    suffix="ммоль/л"
                    value={draft.glucoseValue}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        glucoseValue: event.target.value,
                      }))
                    }
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
                    placeholder="Самочувствие, физнагрузка и т. д."
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
                        {DAILY_PROFILE_INSULINS.filter(
                          (item) => item.category === "basal",
                        ).map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </optgroup>

                      <optgroup label="Болюсные">
                        {DAILY_PROFILE_INSULINS.filter(
                          (item) => item.category === "bolus",
                        ).map((item) => (
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
                    min={0}
                    step="0.5"
                    inputMode="decimal"
                    suffix="ЕД"
                    value={draft.insulinUnits}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        insulinUnits: event.target.value,
                      }))
                    }
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
                        ([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <Input
                    label="Хлебные единицы"
                    type="number"
                    min={0}
                    step="0.5"
                    inputMode="decimal"
                    suffix="ХЕ"
                    value={draft.breadUnits}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        breadUnits: event.target.value,
                      }))
                    }
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

        {/* Списки записей */}

        <div className={styles.entriesLists}>
          <div className={styles.entriesColumn}>
            <h4>Глюкоза</h4>

            {selectedDay.glucoseEntries.map((entry) => (
              <div key={entry.id} className={styles.entryCard}>
                <div>
                  <strong>{entry.time}</strong>

                  <span>
                    {entry.value === null
                      ? "—"
                      : `${decimal(entry.value)} ммоль/л`}
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
            ))}

            {!selectedDay.glucoseEntries.length && (
              <p className={styles.emptyState}>Пока нет измерений.</p>
            )}
          </div>

          <div className={styles.entriesColumn}>
            <h4>Инсулин</h4>

            {selectedDay.insulinEntries.map((entry) => (
              <div key={entry.id} className={styles.entryCard}>
                <div>
                  <strong>{entry.time}</strong>

                  <span>
                    {getInsulin(entry.insulinName).shortLabel} ·{" "}
                    {entry.units ?? "—"} ЕД
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
            ))}

            {!selectedDay.insulinEntries.length && (
              <p className={styles.emptyState}>Пока нет введений.</p>
            )}
          </div>

          <div className={styles.entriesColumn}>
            <h4>Питание</h4>

            {selectedDay.mealEntries.map((entry) => (
              <div key={entry.id} className={styles.entryCard}>
                <div>
                  <strong>{entry.time}</strong>

                  <span>
                    {DAILY_PROFILE_MEAL_TYPE_LABELS[entry.mealType]} ·{" "}
                    {entry.breadUnits ?? "—"} ХЕ
                  </span>

                  {entry.note && <small>{entry.note}</small>}
                </div>

                <button type="button" onClick={() => deleteMealEntry(entry.id)}>
                  Удалить
                </button>
              </div>
            ))}

            {!selectedDay.mealEntries.length && (
              <p className={styles.emptyState}>Пока нет питания.</p>
            )}
          </div>
        </div>
      </section>
    </form>
  );
};
