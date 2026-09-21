import React from "react";
import { useFormContext } from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import styles from "../styles.module.scss";

export const LifestyleTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Образ жизни</h3>

      <Field noteKey="lifestyle.alcohol">
        <fieldset className={styles.fieldset}>
          <legend>Алкоголь</legend>
          <Textarea
            label="Как часто употребляете алкоголь?"
            {...register("lifestyle.alcoholFrequency")}
            rows={2}
          />
          <Input
            label="Тип (крепкий / вино / пиво и т.п.)"
            {...register("lifestyle.alcoholType")}
          />
        </fieldset>
      </Field>

      <Field noteKey="lifestyle.smoking">
        <fieldset className={styles.fieldset}>
          <legend>Курение</legend>
          <YesNo label="Курите?" name="lifestyle.smoking" register={register} />
          {watch("lifestyle.smoking") === true && (
            <>
              <Input
                label="С какого возраста?"
                type="number"
                suffix="лет"
                {...register("lifestyle.smokingStartAge")}
              />
              <Input
                label="Сколько сигарет в день?"
                type="number"
                suffix="шт."
                {...register("lifestyle.cigarettesPerDay")}
              />
            </>
          )}
        </fieldset>
      </Field>

      <Field noteKey="lifestyle.nutrition">
        <fieldset className={styles.fieldset}>
          <legend>Питание</legend>
          <YesNo
            label="Пищу подсаливаете?"
            name="lifestyle.saltFood"
            register={register}
          />
          <YesNo
            label="Много полуфабрикатов (колбаса, сосиски, копчёности, орешки, маринованные овощи, рыбные консервы, соевый соус, кетчуп)"
            name="lifestyle.processedFood"
            register={register}
          />
          <Input
            label="Сколько чашек кофе в день?"
            type="number"
            suffix="чаш."
            {...register("lifestyle.coffeeCupsPerDay")}
          />
          <YesNo
            label="Кофе крепкий?"
            name="lifestyle.strongCoffee"
            register={register}
          />
          <YesNo
            label="Энергетики"
            name="lifestyle.energyDrinks"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="lifestyle.work">
        <fieldset className={styles.fieldset}>
          <legend>Работа и стресс</legend>
          <Input label="Кем работаете?" {...register("lifestyle.occupation")} />
          <YesNo
            label="Сидячая работа?"
            name="lifestyle.sedentaryWork"
            register={register}
          />
          <YesNo
            label="Много стресса?"
            name="lifestyle.stress"
            register={register}
          />
        </fieldset>
      </Field>

      <fieldset className={styles.fieldset}>
        <legend>Хронические заболевания</legend>
        <Textarea
          label="Заболевания глаз (кроме диабетических)"
          {...register("lifestyle.chronicEyeDiseases")}
          rows={2}
        />
        <YesNo
          label="Бронхиальная астма"
          name="lifestyle.asthma"
          register={register}
        />
        {watch("lifestyle.asthma") === true && (
          <>
            <Input
              label="Когда выявили?"
              {...register("lifestyle.asthmaDiagnosedWhen")}
            />
            <Input label="Аллерген" {...register("lifestyle.asthmaAllergen")} />
          </>
        )}
        <YesNo label="ХОБЛ" name="lifestyle.copd" register={register} />
        {watch("lifestyle.copd") === true && (
          <Input
            label="Что принимаете при ХОБЛ"
            {...register("lifestyle.copdMeds")}
          />
        )}
      </fieldset>

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

        {watch("lifestyle.knownHypertension") === "yes" && (
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
            {watch("lifestyle.doctorChangedTherapy") === true && (
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
            {watch("lifestyle.measureAtHome") === true && (
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
            {watch("lifestyle.hypertensiveCrisesAmbulance") === true && (
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
    </div>
  );
};
