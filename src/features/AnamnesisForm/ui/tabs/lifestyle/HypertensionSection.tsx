import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const HypertensionSection: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  const knownHypertension = watch("lifestyle.knownHypertension");

  const doctorChangedTherapy = watch("lifestyle.doctorChangedTherapy");

  const measureAtHome = watch("lifestyle.measureAtHome");

  const hypertensiveCrisesAmbulance = watch(
    "lifestyle.hypertensiveCrisesAmbulance",
  );

  return (
    <fieldset className={styles.fieldset}>
      <legend>Сердечно-сосудистая система / АД</legend>

      <div className={styles.radioGroup}>
        <label>Известно ли о повышенном АД?</label>

        <label>
          <input
            type="radio"
            value="yes"
            {...register("lifestyle.knownHypertension")}
          />{" "}
          Да
        </label>

        <label>
          <input
            type="radio"
            value="no"
            {...register("lifestyle.knownHypertension")}
          />{" "}
          Нет
        </label>

        <label>
          <input
            type="radio"
            value="notMeasured"
            {...register("lifestyle.knownHypertension")}
          />{" "}
          Не измерял
        </label>
      </div>

      {knownHypertension === "yes" && (
        <>
          <Input
            label="Когда впервые зафиксировано повышение АД (год или возраст)"
            {...register("lifestyle.hypertensionFirstDetected")}
          />

          <label>
            <input
              type="checkbox"
              {...register("lifestyle.hypertensionUnderAge35")}
            />{" "}
            Возраст &lt;35 лет (пометить)
          </label>

          <div className={styles.radioGroup}>
            <label>Как было выявлено?</label>

            <label>
              <input
                type="radio"
                value="accidental"
                {...register("lifestyle.hypertensionDetectionMethod")}
              />{" "}
              Случайно дома
            </label>

            <label>
              <input
                type="radio"
                value="dispanserization"
                {...register("lifestyle.hypertensionDetectionMethod")}
              />{" "}
              Диспансеризация
            </label>

            <label>
              <input
                type="radio"
                value="withComplaints"
                {...register("lifestyle.hypertensionDetectionMethod")}
              />{" "}
              При наличии жалоб
            </label>

            <label>
              <input
                type="radio"
                value="hospitalization"
                {...register("lifestyle.hypertensionDetectionMethod")}
              />{" "}
              Во время госпитализации
            </label>

            <label>
              <input
                type="radio"
                value="ems"
                {...register("lifestyle.hypertensionDetectionMethod")}
              />{" "}
              СМП
            </label>
          </div>

          <YesNo
            label="Обращались ли к врачу после обнаружения?"
            name="lifestyle.visitedDoctorAfterDetection"
            register={register}
          />

          <Textarea
            label="Какую терапию назначил тогда врач (препарат, доза, кратность, время)"
            {...register("lifestyle.prescribedTherapyThen")}
            rows={3}
          />

          <YesNo
            label="Терапию принимаете регулярно?"
            name="lifestyle.therapyRegularity"
            register={register}
          />

          <Input
            label="Сколько раз в неделю можете пропустить приём таблеток?"
            {...register("lifestyle.missedDosesPerWeek")}
          />

          <Textarea
            label="Что мешает принимать регулярно (побочные, стоимость, сложность, забывчивость)"
            {...register("lifestyle.missedReasons")}
            rows={2}
          />

          <Input
            label="Какое давление на принимаемой терапии?"
            {...register("lifestyle.bpOnTherapy")}
          />

          <YesNo
            label="Сохраняется ли повышенное давление при приёме ≥3 препаратов (включая мочегонное)?"
            name="lifestyle.bpResistant3Drugs"
            register={register}
          />

          <YesNo
            label="Отменял ли самостоятельно?"
            name="lifestyle.selfDiscontinued"
            register={register}
          />

          <YesNo
            label="Изменял ли врач терапию?"
            name="lifestyle.doctorChangedTherapy"
            register={register}
          />

          {doctorChangedTherapy === true && (
            <Textarea
              label="Как изменена терапия (препарат, доза, кратность, время)"
              {...register("lifestyle.changedTherapyDetails")}
              rows={3}
            />
          )}

          <YesNo
            label="Измеряете ли давление дома?"
            name="lifestyle.measureAtHome"
            register={register}
          />

          {measureAtHome === true && (
            <>
              <Input
                label="Как часто измеряете?"
                {...register("lifestyle.measureFrequency")}
              />

              <YesNo
                label="Ведёте ли дневник?"
                name="lifestyle.keepDiary"
                register={register}
              />
            </>
          )}

          <Input
            label="Максимальные зафиксированные цифры АД"
            {...register("lifestyle.maxBPValues")}
          />

          <Textarea
            label="Субъективные жалобы при повышении АД (боли в сердце, нарушения ритма, жар, головные боли, головокружение, тошнота, шум в ушах, мушки)"
            {...register("lifestyle.subjectiveComplaints")}
            rows={3}
          />

          <Textarea
            label="При каком давлении и чем снижаете высокие подъёмы АД?"
            {...register("lifestyle.atWhatBPReduced")}
            rows={2}
          />

          <YesNo
            label="Были ли кризы, требующие вызова скорой?"
            name="lifestyle.hypertensiveCrisesAmbulance"
            register={register}
          />

          {hypertensiveCrisesAmbulance === true && (
            <>
              <Input
                label="Сколько раз?"
                {...register("lifestyle.crisesCount")}
              />

              <Textarea
                label="Сопровождались ли кризы симптомами? (головная боль, нарушение речи/зрения, слабость в конечностях, судороги, потеря сознания)"
                {...register("lifestyle.crisesSymptoms")}
                rows={3}
              />
            </>
          )}

          <YesNo
            label="Ритм сердца правильный?"
            name="lifestyle.heartRhythmRegular"
            register={register}
          />

          <YesNo
            label="Кардиостимуляторы?"
            name="lifestyle.pacemakers"
            register={register}
          />

          <YesNo
            label="Мерцательная аритмия?"
            name="lifestyle.atrialFibrillation"
            register={register}
          />
        </>
      )}
    </fieldset>
  );
};
