import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import styles from "./FamilyHistoryTree.module.scss";

type FamilyTree = NonNullable<AnamnesisFormData["familyHistoryTree"]>;
type RelativeId = keyof FamilyTree;
type Diagnosis = NonNullable<FamilyTree[RelativeId]>;

interface Relative {
  id: RelativeId;
  label: string;
  sex: "male" | "female";
  x: number;
  y: number;
  labelY: number;
  dashed?: boolean;
}

const relatives: Relative[] = [
  {
    id: "paternalGrandfather",
    label: "Дедушка",
    sex: "male",
    x: 95,
    y: 78,
    labelY: -46,
  },
  {
    id: "paternalGrandmother",
    label: "Бабушка",
    sex: "female",
    x: 220,
    y: 78,
    labelY: -46,
  },
  {
    id: "maternalGrandfather",
    label: "Дедушка",
    sex: "male",
    x: 445,
    y: 78,
    labelY: -46,
  },
  {
    id: "maternalGrandmother",
    label: "Бабушка",
    sex: "female",
    x: 570,
    y: 78,
    labelY: -46,
  },
  {
    id: "paternalUncle",
    label: "Дядя",
    sex: "male",
    x: 60,
    y: 228,
    labelY: 54,
    dashed: true,
  },
  {
    id: "paternalAunt",
    label: "Тётя",
    sex: "female",
    x: 155,
    y: 228,
    labelY: 54,
    dashed: true,
  },
  {
    id: "father",
    label: "Отец",
    sex: "male",
    x: 255,
    y: 228,
    labelY: 54,
  },
  {
    id: "mother",
    label: "Мать",
    sex: "female",
    x: 445,
    y: 228,
    labelY: 54,
  },
  {
    id: "maternalUncle",
    label: "Дядя",
    sex: "male",
    x: 540,
    y: 228,
    labelY: 54,
    dashed: true,
  },
  {
    id: "maternalAunt",
    label: "Тётя",
    sex: "female",
    x: 635,
    y: 228,
    labelY: 54,
    dashed: true,
  },
  {
    id: "sister",
    label: "Сестра",
    sex: "female",
    x: 175,
    y: 392,
    labelY: 58,
    dashed: true,
  },
  {
    id: "brother",
    label: "Брат",
    sex: "male",
    x: 525,
    y: 392,
    labelY: 58,
    dashed: true,
  },
];

const nextDiagnosis = (current?: Diagnosis): Diagnosis | undefined => {
  if (!current) {
    return "type1";
  }

  if (current === "type1") {
    return "type2";
  }

  return undefined;
};

export const FamilyHistoryTree: React.FC = () => {
  const { watch, getValues, setValue } = useFormContext<AnamnesisFormData>();

  const tree = watch("familyHistoryTree") ?? {};

  const handleCycle = (relativeId: RelativeId) => {
    const currentTree = getValues("familyHistoryTree") ?? {};

    const updatedTree: FamilyTree = {
      ...currentTree,
    };

    const next = nextDiagnosis(updatedTree[relativeId]);

    if (next) {
      updatedTree[relativeId] = next;
    } else {
      delete updatedTree[relativeId];
    }

    setValue("familyHistoryTree", updatedTree, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <section
      className={styles.container}
      aria-label="Семейная родословная по сахарному диабету"
    >
      <h4 className={styles.heading}>Семейная родословная</h4>

      <p className={styles.instruction}>
        Нажмите на фигуру родственника:
        <span className={styles.inlineLegend}>
          пусто → <strong>СД1</strong> → <strong>СД2</strong>
        </span>
      </p>

      <div className={styles.diagramWrap}>
        <svg
          className={styles.diagram}
          viewBox="0 0 695 470"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Интерактивная схема родословной"
        >
          <g
            className={styles.lines}
            fill="none"
            stroke="#445d61"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            {/* Отцовская линия */}
            <path d="M 125 78 H 190" />
            <path d="M 157 78 V 148" />
            <path d="M 60 148 H 255" />
            <path d="M 60 148 V 198" />
            <path d="M 155 148 V 198" />
            <path d="M 255 148 V 198" />

            {/* Материнская линия */}
            <path d="M 475 78 H 540" />
            <path d="M 507 78 V 148" />
            <path d="M 445 148 H 635" />
            <path d="M 445 148 V 198" />
            <path d="M 540 148 V 198" />
            <path d="M 635 148 V 198" />

            {/* Родители */}
            <path d="M 285 228 H 415" />

            {/* Дети */}
            <path d="M 350 228 V 312" />
            <path d="M 175 312 H 525" />
            <path d="M 175 312 V 362" />
            <path d="M 350 312 V 348" />
            <path d="M 525 312 V 362" />

            {/* Стрелка к пробанду */}
            <path d="M 278 432 L 320 407" />
            <path
              d="M 320 407 L 309 408 L 316 418 Z"
              fill="#445d61"
              stroke="none"
            />
          </g>

          {relatives.map((relative) => {
            const status = tree[relative.id];

            const statusLabel =
              status === "type1" ? "СД1" : status === "type2" ? "СД2" : "";

            const statusDescription =
              status === "type1"
                ? "сахарный диабет 1 типа"
                : status === "type2"
                  ? "сахарный диабет 2 типа"
                  : "сахарный диабет не отмечен";

            const fillColor =
              status === "type1"
                ? "#dff3ea"
                : status === "type2"
                  ? "#fff0dc"
                  : "#ffffff";

            const strokeColor =
              status === "type1"
                ? "#228269"
                : status === "type2"
                  ? "#ad6f33"
                  : "#445d61";

            return (
              <g
                key={relative.id}
                className={styles.relative}
                role="button"
                tabIndex={0}
                aria-label={`${relative.label}: ${statusDescription}. Нажмите для изменения.`}
                onClick={() => handleCycle(relative.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleCycle(relative.id);
                  }
                }}
                transform={`translate(${relative.x} ${relative.y})`}
              >
                <title>{`${relative.label}: ${statusDescription}`}</title>

                {relative.sex === "female" ? (
                  <circle
                    className={styles.shape}
                    cx={0}
                    cy={0}
                    r={30}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={2.6}
                    strokeDasharray={relative.dashed ? "6 5" : undefined}
                  />
                ) : (
                  <rect
                    className={styles.shape}
                    x={-30}
                    y={-30}
                    width={60}
                    height={60}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={2.6}
                    strokeDasharray={relative.dashed ? "6 5" : undefined}
                  />
                )}

                {statusLabel && (
                  <text
                    className={styles.statusText}
                    textAnchor="middle"
                    dominantBaseline="central"
                    y={1}
                  >
                    {statusLabel}
                  </text>
                )}

                {/* Единая подпись для всех экранов */}
                <text
                  className={styles.relativeLabel}
                  textAnchor="middle"
                  y={relative.labelY}
                >
                  {relative.label}
                </text>
              </g>
            );
          })}

          {/* Пробанд */}
          <g>
            <path
              d="
                M 350 348
                L 388 386
                L 350 424
                L 312 386
                Z
              "
              fill="#f0f7f5"
              stroke="#445d61"
              strokeWidth="2.8"
            />

            <text
              className={styles.relativeLabel}
              x={350}
              y={454}
              textAnchor="middle"
            >
              Пробанд
            </text>
          </g>
        </svg>
      </div>

      <div className={styles.legend} aria-label="Обозначения родословной">
        <span>
          <i className={styles.legendNone} />
          Без отметки
        </span>

        <span>
          <i className={styles.legendType1} />
          СД1
        </span>

        <span>
          <i className={styles.legendType2} />
          СД2
        </span>
      </div>
    </section>
  );
};
