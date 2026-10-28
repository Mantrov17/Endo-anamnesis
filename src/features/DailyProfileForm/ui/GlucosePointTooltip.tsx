import React from "react";

import type { InsulinProfileMeta } from "@/entities/dailyProfile";

import styles from "./GlucosePointTooltip.module.scss";

export interface TooltipInsulin {
  key: string;
  meta: InsulinProfileMeta;
  units: number | null;
  date: string;
  time: string;

  /** Часы с момента введения на момент выбранной глюкозы. */
  elapsedHours: number;
}

interface GlucosePointTooltipProps {
  time: string;
  glucose: number;
  note?: string;
  selectedDate: string;
  insulins: TooltipInsulin[];
  leftPercent: number;
  onClose: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const formatNumber = (value: number) =>
  value.toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
  });

const percent = (hours: number, maxHours: number): number =>
  clamp((hours / maxHours) * 100, 0, 100);

const getPhase = (insulin: TooltipInsulin): string => {
  const { meta, elapsedHours } = insulin;

  if (elapsedHours >= meta.durationHoursMax) {
    return "Завершено";
  }

  if (elapsedHours < 1 / 60) {
    return "Введение";
  }

  if (elapsedHours < meta.onsetHoursMin) {
    return "До начала";
  }

  if (elapsedHours <= meta.onsetHoursMax) {
    return "Начало действия";
  }

  if (
    meta.durationHoursMin !== undefined &&
    elapsedHours >= meta.durationHoursMin
  ) {
    return "Остаточное действие";
  }

  if (
    meta.peakHoursMin !== undefined &&
    meta.peakHoursMax !== undefined &&
    elapsedHours >= meta.peakHoursMin &&
    elapsedHours <= meta.peakHoursMax
  ) {
    return "Пик действия";
  }

  return "Основное действие";
};

const PhaseBar: React.FC<{
  insulin: TooltipInsulin;
}> = ({ insulin }) => {
  const { meta, elapsedHours } = insulin;
  const max = meta.durationHoursMax;

  const onsetEnd = percent(meta.onsetHoursMax, max);

  const regularEnd = percent(meta.durationHoursMin ?? max, max);

  const now = percent(elapsedHours, max);

  const peakStart =
    meta.peakHoursMin === undefined ? null : percent(meta.peakHoursMin, max);

  const peakEnd =
    meta.peakHoursMax === undefined ? null : percent(meta.peakHoursMax, max);

  return (
    <div
      className={styles.progressTrack}
      role="img"
      aria-label={`Прошло ${Math.round(now)}% максимального временного окна действия; ${getPhase(insulin)}. Не является процентом действующего инсулина.`}
    >
      <span
        className={styles.beforeOnset}
        style={{
          left: 0,
          width: `${onsetEnd}%`,
        }}
      />

      <span
        className={styles.mainPhase}
        style={{
          left: `${onsetEnd}%`,
          width: `${Math.max(0, regularEnd - onsetEnd)}%`,
        }}
      />

      {meta.durationHoursMin !== undefined && (
        <span
          className={styles.residual}
          style={{
            left: `${regularEnd}%`,
            width: `${100 - regularEnd}%`,
          }}
        />
      )}

      {peakStart !== null && peakEnd !== null && (
        <span
          className={styles.peak}
          style={{
            left: `${peakStart}%`,
            width: `${Math.max(0, peakEnd - peakStart)}%`,
          }}
        />
      )}

      <span
        className={styles.elapsedOverlay}
        style={{
          width: `${now}%`,
        }}
      />

      <span
        className={styles.progressMarker}
        style={{
          left: `${clamp(now, 2, 98)}%`,
        }}
      />
    </div>
  );
};

export const GlucosePointTooltip: React.FC<GlucosePointTooltipProps> = ({
  time,
  glucose,
  note,
  selectedDate,
  insulins,
  leftPercent,
  onClose,
}) => {
  return (
    <aside
      className={styles.tooltip}
      style={{
        left: `clamp(105px, ${leftPercent}%, calc(100% - 105px))`,
      }}
      aria-label={`Глюкоза ${formatNumber(glucose)} ммоль/л в ${time}`}
    >
      <div className={styles.header}>
        <strong>{time}</strong>

        <strong>{formatNumber(glucose)} ммоль/л</strong>

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть карточку"
        >
          ×
        </button>
      </div>

      {note && <p className={styles.note}>{note}</p>}

      <div className={styles.insulinList}>
        {insulins.length ? (
          insulins.map((insulin) => {
            const progress = Math.round(
              percent(insulin.elapsedHours, insulin.meta.durationHoursMax),
            );

            const basal = insulin.meta.category === "basal";

            return (
              <div
                key={insulin.key}
                className={`${styles.insulin} ${
                  basal ? styles.basal : styles.bolus
                }`}
              >
                <div className={styles.drugLine}>
                  <span className={styles.drugDot} aria-hidden="true" />

                  <strong>
                    {insulin.meta.shortLabel} ·{" "}
                    {insulin.units === null ? "—" : formatNumber(insulin.units)}{" "}
                    ЕД
                  </strong>
                </div>

                <div className={styles.detailsLine}>
                  <span>
                    Введён {insulin.time}
                    {insulin.date !== selectedDate ? " (пред. день)" : ""}
                  </span>

                  <span className={styles.phaseName}>{getPhase(insulin)}</span>
                </div>

                <div className={styles.progressLine}>
                  <PhaseBar insulin={insulin} />

                  <span className={styles.progressValue}>{progress}%</span>
                </div>
              </div>
            );
          })
        ) : (
          <p className={styles.noInsulin}>
            Нет зарегистрированных инъекций в этом временном окне.
          </p>
        )}
      </div>

      <span className={styles.disclaimer}>
        Шкала 0–100% — прошедшее время, не сила действия инсулина.
      </span>
    </aside>
  );
};
