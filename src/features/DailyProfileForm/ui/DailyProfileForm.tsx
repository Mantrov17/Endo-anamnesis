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

import {
  GlucosePointTooltip,
  type TooltipInsulin,
} from "./GlucosePointTooltip";

import { DailyProfileEntries } from "./DailyProfileEntries";

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

/*
 * Исправленный ввод целевых диапазонов.
 *
 * Во время редактирования храним строку,
 * а не число. Поэтому можно:
 *
 * - удалить старое значение полностью;
 * - ввести 5,5 или 5.5;
 * - временно оставить "5,";
 * - исправлять любую цифру.
 *
 * В данные пациента передаём только
 * корректное числовое значение.
 */
interface TargetRangeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const formatTarget = (value: number): string => String(value).replace(".", ",");

const parseTarget = (raw: string): number | null => {
  const text = raw.trim();

  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) {
    return null;
  }

  const result = Number(text.replace(",", "."));

  return Number.isFinite(result) && result >= 0 ? result : null;
};

const TargetRangeInput: React.FC<TargetRangeInputProps> = ({
  label,
  value,
  onChange,
}) => {
  const [text, setText] = useState(() => formatTarget(value));

  return (
    <Input
      label={label}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      suffix="ммоль/л"
      value={text}
      onChange={(event) => {
        const nextText = event.target.value;

        setText(nextText);

        const parsed = parseTarget(nextText);

        if (parsed !== null && parsed !== value) {
          onChange(parsed);
        }
      }}
      onBlur={() => {
        const parsed = parseTarget(text);

        // Пустой или некорректный ввод
        // не затирает сохранённое значение.
        setText(formatTarget(parsed ?? value));
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    />
  );
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

  const number = Number(raw.replace(",", "."));

  return Number.isFinite(number) ? number : null;
};

const decimal = (number: number): string =>
  number.toLocaleString("ru-RU", {
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
  start: number;
  end: number;
  lane: number;
}

const getDoseEvents = (
  days: DailyProfileDay[],
  targetDate: string,
  category: "basal" | "bolus",
): DoseEvent[] => {
  const items = days
    .flatMap((day) =>
      (day.insulinEntries ?? []).flatMap((entry) => {
        const meta = getInsulin(entry.insulinName);

        if (meta.category !== category) return [];

        const start =
          dateOffsetDays(day.date, targetDate) * MINUTES_PER_DAY +
          minutes(entry.time);

        const end = start + meta.durationHoursMax * 60;

        if (end <= 0 || start >= MINUTES_PER_DAY) {
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
    )
    .sort((a, b) => a.start - b.start);

  const laneEnd: number[] = [];

  return items.map((item) => {
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

  return end <= start
    ? null
    : {
        left: percentAt(start),
        width: percentAt(end - start),
      };
};

const insulinDescription = (dose: DoseEvent): string => {
  const { meta, entry } = dose;

  const duration =
    meta.durationHoursMin === undefined
      ? `до ${decimal(meta.durationHoursMax)} ч`
      : `${decimal(meta.durationHoursMin)}–${decimal(meta.durationHoursMax)} ч`;

  const peak =
    meta.peakHoursMin === undefined || meta.peakHoursMax === undefined
      ? "без выделенного пика"
      : `пик ${decimal(meta.peakHoursMin)}–${decimal(meta.peakHoursMax)} ч`;

  return (
    `${meta.label}: ${entry.units ?? "—"} ЕД; ` +
    `введён ${dose.date} в ${entry.time}; ` +
    `${peak}; длительность ${duration}`
  );
};

const entryDose = (units: number | null): string =>
  units === null ? "— ЕД" : `${decimal(units)} ЕД`;

interface InsulinTimelineProps {
  label: string;
  category: "basal" | "bolus";
  doses: DoseEvent[];
  selectedDoseKey: string | null;
  onSelectDose: (value: string | null) => void;
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
            meta.durationHoursMin === undefined
              ? null
              : phasePosition(regularEnd, end);

          const injectionVisible = start >= 0 && start < MINUTES_PER_DAY;

          const at = percentAt(start);
          const title = insulinDescription(dose);

          const active = dose.key === selectedDoseKey;

          return (
            <React.Fragment key={dose.key}>
              {mainStyle && (
                <span
                  className={styles.insulinMain}
                  aria-hidden="true"
                  title={title}
                  style={{
                    ...mainStyle,
                    top: y + 34,
                  }}
                />
              )}

              {tailStyle && (
                <span
                  className={styles.insulinResidual}
                  aria-hidden="true"
                  title={title}
                  style={{
                    ...tailStyle,
                    top: y + 34,
                  }}
                />
              )}

              {peakStyle && (
                <span
                  className={styles.insulinPeak}
                  aria-hidden="true"
                  title={title}
                  style={{
                    ...peakStyle,
                    top: y + 34,
                  }}
                />
              )}

              {onsetStyle && (
                <span
                  className={styles.insulinOnset}
                  aria-hidden="true"
                  title={title}
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
                    {entryDose(dose.entry.units)}
                  </span>

                  <button
                    type="button"
                    title={title}
                    aria-label={title}
                    aria-pressed={active}
                    className={`${styles.injectionDot} ${
                      active ? styles.injectionDotSelected : ""
                    }`}
                    style={{
                      left: at,
                      top: y + 32,
                    }}
                    onClick={() => onSelectDose(active ? null : dose.key)}
                  />
                </>
              ) : (
                <button
                  type="button"
                  className={styles.carryOverMarker}
                  title={title}
                  aria-label={`Продолжение с предыдущего дня. ${title}`}
                  aria-pressed={active}
                  style={{
                    left: 0,
                    top: y + 23,
                  }}
                  onClick={() => onSelectDose(active ? null : dose.key)}
                >
                  ↤
                </button>
              )}
            </React.Fragment>
          );
        })}

        {!doses.length && (
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
    patientTargets,
    autoSaveStatus,
    updateSelectedDate,
    goToPreviousDate,
    goToNextDate,
    updateTargets,
    addLinkedEntries,
    updateGlucoseEntry,
    updateInsulinEntry,
    updateMealEntry,
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

  const graphLayersRef = useRef<HTMLDivElement>(null);

  const glucoseSvgRef = useRef<SVGSVGElement>(null);

  const mealTrackRef = useRef<HTMLDivElement>(null);

  const unifiedCursorRef = useRef<HTMLDivElement>(null);

  const points = useMemo(() => {
    const entries = (selectedDay?.glucoseEntries ?? [])
      .filter((entry) => entry.value !== null && Number.isFinite(entry.value))
      .slice()
      .sort((a, b) => a.time.localeCompare(b.time));

    const max = Math.max(
      MAX_GLUCOSE,
      patientTargets.postMealMax,
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
  }, [selectedDay, patientTargets.postMealMax]);

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

  const selectedDose = [...basalDoses, ...bolusDoses].find(
    (item) => item.key === selectedDoseKey,
  );

  const tooltipInsulins = useMemo<TooltipInsulin[]>(() => {
    if (!selectedPoint) {
      return [];
    }

    const at = minutes(selectedPoint.entry.time);

    return [...basalDoses, ...bolusDoses]
      .filter((dose) => dose.start <= at && dose.end >= at)
      .sort((a, b) => b.start - a.start)
      .map((dose) => ({
        key: dose.key,
        meta: dose.meta,
        units: dose.entry.units,
        date: dose.date,
        time: dose.entry.time,
        elapsedHours: (at - dose.start) / 60,
      }));
  }, [selectedPoint, basalDoses, bolusDoses]);

  /*
   * Общая вертикальная пунктирная линия.
   *
   * Координаты обновляются через ref,
   * без setState внутри useLayoutEffect.
   */
  useLayoutEffect(() => {
    if (!selectedPoint) {
      return;
    }

    const layers = graphLayersRef.current;
    const svg = glucoseSvgRef.current;
    const meal = mealTrackRef.current;
    const cursor = unifiedCursorRef.current;

    if (!layers || !svg || !meal || !cursor) {
      return;
    }

    const measure = () => {
      const containerRect = layers.getBoundingClientRect();

      const svgRect = svg.getBoundingClientRect();

      const mealRect = meal.getBoundingClientRect();

      const left =
        svgRect.left -
        containerRect.left +
        (selectedPoint.x / SVG_WIDTH) * svgRect.width;

      const top =
        svgRect.top -
        containerRect.top +
        (selectedPoint.y / SVG_HEIGHT) * svgRect.height;

      const height = Math.max(0, mealRect.bottom - containerRect.top - top);

      cursor.style.left = `${left}px`;
      cursor.style.top = `${top}px`;
      cursor.style.height = `${height}px`;
    };

    measure();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;

    observer?.observe(layers);
    observer?.observe(svg);
    observer?.observe(meal);

    window.addEventListener("resize", measure);

    return () => {
      observer?.disconnect();

      window.removeEventListener("resize", measure);
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

  const yHypo = yAt(patientTargets.hypoThreshold, points.maxY);

  const yMin = yAt(patientTargets.fastingMin, points.maxY);

  const yMax = yAt(patientTargets.fastingMax, points.maxY);

  const yMeal = yAt(patientTargets.postMealMax, points.maxY);

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
            aria-label="Предыдущий день"
            onClick={() => {
              goToPreviousDate();
              setSelectedGlucoseId(null);
              setSelectedDoseKey(null);
            }}
          >
            ‹
          </Button>

          <div className={styles.currentDateCard}>
            <strong>{formatDate(selectedDay.date)}</strong>

            <input
              type="date"
              aria-label="Выбрать дату"
              value={selectedDay.date}
              onChange={(event) => {
                updateSelectedDate(event.target.value);

                setSelectedGlucoseId(null);
                setSelectedDoseKey(null);
              }}
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            aria-label="Следующий день"
            onClick={() => {
              goToNextDate();
              setSelectedGlucoseId(null);
              setSelectedDoseKey(null);
            }}
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

      {/*
       * Целевые диапазоны пациента.
       *
       * Поля используют локальный строковый ввод.
       * При смене даты значения не сбрасываются.
       * Ключ patientId обеспечивает отдельное
       * состояние ввода для каждого пациента.
       */}

      <details className={styles.targetsCard}>
        <summary
          style={{
            cursor: "pointer",
            color: "#243b42",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.5,
            padding: "2px 0",
          }}
        >
          Целевые диапазоны
          <span
            style={{
              marginLeft: 7,
              color: "#758b8b",
              fontSize: 11,
              fontWeight: 400,
            }}
          >
            для пациента
          </span>
        </summary>

        <div className={styles.targetsGrid}>
          <TargetRangeInput
            key={`${patientId}-hypo`}
            label="Гипогликемия"
            value={patientTargets.hypoThreshold}
            onChange={(value) =>
              updateTargets({
                hypoThreshold: value,
              })
            }
          />

          <TargetRangeInput
            key={`${patientId}-min`}
            label="Нижняя цель"
            value={patientTargets.fastingMin}
            onChange={(value) =>
              updateTargets({
                fastingMin: value,
              })
            }
          />

          <TargetRangeInput
            key={`${patientId}-max`}
            label="Верхняя цель"
            value={patientTargets.fastingMax}
            onChange={(value) =>
              updateTargets({
                fastingMax: value,
              })
            }
          />

          <TargetRangeInput
            key={`${patientId}-meal`}
            label="После еды — верхний предел"
            value={patientTargets.postMealMax}
            onChange={(value) =>
              updateTargets({
                postMealMax: value,
              })
            }
          />
        </div>
      </details>

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

                {DAILY_PROFILE_HOURS.map((hour) => (
                  <line
                    key={hour}
                    x1={xAt(minutes(hour))}
                    x2={xAt(minutes(hour))}
                    y1={PLOT_TOP}
                    y2={SVG_HEIGHT - PLOT_BOTTOM}
                    className={styles.gridLineVertical}
                  />
                ))}

                {/* Значения целевых диапазонов */}

                {[
                  patientTargets.postMealMax,
                  patientTargets.fastingMax,
                  patientTargets.fastingMin,
                  patientTargets.hypoThreshold,
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

                {/* Линия измерений */}

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

                {/* Точки глюкозы */}

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
                        setSelectedGlucoseId((current) =>
                          current === point.entry.id ? null : point.entry.id,
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") {
                          return;
                        }

                        event.preventDefault();

                        setSelectedGlucoseId((current) =>
                          current === point.entry.id ? null : point.entry.id,
                        );
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

              {/* Компактная карточка глюкозы */}

              {selectedPoint && (
                <GlucosePointTooltip
                  time={selectedPoint.entry.time}
                  glucose={selectedPoint.entry.value ?? 0}
                  note={selectedPoint.entry.note}
                  selectedDate={selectedDay.date}
                  insulins={tooltipInsulins}
                  leftPercent={(selectedPoint.x / SVG_WIDTH) * 100}
                  onClose={() => setSelectedGlucoseId(null)}
                />
              )}
            </div>

            {/* Инсулиновые полосы */}

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

              {/* Питание */}

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

              {/* Общая шкала времени */}

              <div className={styles.timelineAxis}>
                <div className={styles.timelineAxisLabels}>
                  {DAILY_PROFILE_HOURS.map((hour) => (
                    <span key={hour}>{hour}</span>
                  ))}
                </div>
              </div>

              {/* Выбранное введение */}

              {selectedDose && (
                <div className={styles.selectedDoseInfo} role="status">
                  <span>{insulinDescription(selectedDose)}</span>

                  <button
                    type="button"
                    aria-label="Закрыть информацию"
                    onClick={() => setSelectedDoseKey(null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Единая пунктирная линия */}

            {selectedPoint && (
              <div
                ref={unifiedCursorRef}
                className={styles.unifiedCursor}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </section>

      {/* Добавление и журнал записей */}

      <section className={styles.entriesCard}>
        <div className={styles.entriesHeader}>
          <h3>Записи за {formatDate(selectedDay.date)}</h3>

          <button
            type="button"
            className={styles.addButton}
            aria-label={isAddOpen ? "Закрыть добавление" : "Добавить запись"}
            onClick={() => setIsAddOpen((value) => !value)}
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
              {/* Глюкоза */}

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

              {/* Инсулин */}

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

              {/* Питание */}

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

        {/* Компактный журнал с редактированием */}

        <DailyProfileEntries
          key={selectedDay.id}
          day={selectedDay}
          updateGlucoseEntry={updateGlucoseEntry}
          updateInsulinEntry={updateInsulinEntry}
          updateMealEntry={updateMealEntry}
          deleteGlucoseEntry={deleteGlucoseEntry}
          deleteInsulinEntry={deleteInsulinEntry}
          deleteMealEntry={deleteMealEntry}
        />
      </section>
    </form>
  );
};
