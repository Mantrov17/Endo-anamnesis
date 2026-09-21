import React from "react";
import { useFormContext } from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";
import { Textarea } from "@/shared/ui/Textarea";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import styles from "../styles.module.scss";

export const SecondaryAHTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Вторичные АГ (исключение)</h3>
      <Field noteKey="secondaryHypertension.nsaids">
        <Textarea
          label="Как часто принимаете НПВС и парацетамол?"
          {...register("secondaryHypertension.nsaidsFrequency")}
          rows={2}
        />
      </Field>
      <Field noteKey="secondaryHypertension.decongestants">
        <Textarea
          label="Как часто принимаете деконгестанты?"
          {...register("secondaryHypertension.decongestantsFrequency")}
          rows={2}
        />
      </Field>
      <Field noteKey="secondaryHypertension.otherDrugs">
        <Textarea
          label="Другие препараты (антидепрессанты, ГКС, КОКи, бронхолитики и т.д.)"
          {...register("secondaryHypertension.otherDrugs")}
          rows={3}
        />
      </Field>

      <Field noteKey="secondaryHypertension.hyperaldosteronism">
        <fieldset className={styles.fieldset}>
          <legend>Гиперальдостеронизм</legend>
          <YesNo
            label="Полидипсия / полиурия"
            name="secondaryHypertension.hyperaldosteronism.polydipsiaPolyuria"
            register={register}
          />
          <YesNo
            label="Преходящая мышечная слабость"
            name="secondaryHypertension.hyperaldosteronism.muscleWeakness"
            register={register}
          />
          <YesNo
            label="Судороги конечностей"
            name="secondaryHypertension.hyperaldosteronism.limbCramps"
            register={register}
          />
          <YesNo
            label="Запоры"
            name="secondaryHypertension.hyperaldosteronism.constipation"
            register={register}
          />
        </fieldset>
      </Field>

      <YesNo
        label="Частые головные боли"
        name="secondaryHypertension.frequentHeadaches"
        register={register}
      />
      <YesNo
        label="Инсульт"
        name="secondaryHypertension.stroke"
        register={register}
      />
      <YesNo
        label="Транзиторная ишемическая атака"
        name="secondaryHypertension.tia"
        register={register}
      />
      {watch("secondaryHypertension.tia") === true && (
        <Textarea
          label="Детали ТИА"
          {...register("secondaryHypertension.tiaDetails")}
          rows={2}
        />
      )}

      <Field noteKey="secondaryHypertension.pheochromocytoma">
        <fieldset className={styles.fieldset}>
          <legend>🚩 Феохромоцитома</legend>
          <div className={styles.radioGroup}>
            <label>Динамика:</label>
            <label>
              <input
                type="radio"
                value="stable"
                {...register(
                  "secondaryHypertension.pheochromocytoma.stableOrCrisis",
                )}
              />{" "}
              Стабильно повышено
            </label>
            <label>
              <input
                type="radio"
                value="crisis"
                {...register(
                  "secondaryHypertension.pheochromocytoma.stableOrCrisis",
                )}
              />{" "}
              Кризовые подъёмы
            </label>
          </div>
          <YesNo
            label="Профузная потливость в моменты повышения"
            name="secondaryHypertension.pheochromocytoma.profuseSweating"
            register={register}
          />
          <YesNo
            label="Зябкость рук и ног"
            name="secondaryHypertension.pheochromocytoma.coldExtremities"
            register={register}
          />
          <YesNo
            label="Нарушения ритма"
            name="secondaryHypertension.pheochromocytoma.arrhythmias"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="secondaryHypertension.hypercortisolism">
        <fieldset className={styles.fieldset}>
          <legend>Гиперкортицизм (синдром Кушинга)</legend>
          <YesNo
            label="Центральное ожирение"
            name="secondaryHypertension.hypercortisolism.centralObesity"
            register={register}
          />
          <YesNo
            label="Лунообразное лицо"
            name="secondaryHypertension.hypercortisolism.moonFace"
            register={register}
          />
          <YesNo
            label="Румянец на щеках"
            name="secondaryHypertension.hypercortisolism.cheekFlush"
            register={register}
          />
          <YesNo
            label="Горб буйвола"
            name="secondaryHypertension.hypercortisolism.buffaloHump"
            register={register}
          />
          <YesNo
            label="Синяки"
            name="secondaryHypertension.hypercortisolism.bruises"
            register={register}
          />
          <YesNo
            label="Проксимальная мышечная слабость"
            name="secondaryHypertension.hypercortisolism.proximalWeakness"
            register={register}
          />
          <YesNo
            label="Широкие и глубокие стрии"
            name="secondaryHypertension.hypercortisolism.striae"
            register={register}
          />
          <YesNo
            label="Вновь начавшийся СД (приём ГКС)"
            name="secondaryHypertension.hypercortisolism.newDiabetes"
            register={register}
          />
          <YesNo
            label="Аменорея"
            name="secondaryHypertension.hypercortisolism.amenorrhea"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="secondaryHypertension.osas">
        <fieldset className={styles.fieldset}>
          <legend>Синдром обструктивного апноэ сна</legend>
          <YesNo
            label="Ночной храп"
            name="secondaryHypertension.osas.nightSnoring"
            register={register}
          />
          <YesNo
            label="Просыпаетесь ли ночью?"
            name="secondaryHypertension.osas.nightAwakenings"
            register={register}
          />
          <YesNo
            label="Ночное мочеиспускание"
            name="secondaryHypertension.osas.nocturia"
            register={register}
          />
          <YesNo
            label="Дневная сонливость"
            name="secondaryHypertension.osas.daytimeSleepiness"
            register={register}
          />
          <YesNo
            label="Ожирение"
            name="secondaryHypertension.osas.obesity"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="secondaryHypertension.familyHistory">
        <fieldset className={styles.fieldset}>
          <legend>Семейный анамнез</legend>
          <YesNo
            label="Повышенное давление у родственников"
            name="secondaryHypertension.familyHistory.hypertension"
            register={register}
          />
          <YesNo
            label="Инфаркт или инсульт в молодом возрасте (муж <55, жен <65)"
            name="secondaryHypertension.familyHistory.earlyHeartAttackStroke"
            register={register}
          />
          <YesNo
            label="Феохромоцитома у родственников"
            name="secondaryHypertension.familyHistory.pheochromocytoma"
            register={register}
          />
        </fieldset>
      </Field>

      <YesNo
        label="Женщина: было ли во время беременности повышение давления, преэклампсия или эклампсия?"
        name="secondaryHypertension.pregnancyHypertension"
        register={register}
      />
    </div>
  );
};
