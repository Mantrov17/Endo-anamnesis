import React from "react";

import { useFormContext } from "react-hook-form";

import type { AnamnesisFormData } from "@/entities/anamnesis";

import { DateField } from "@/shared/ui/DateInput";

import { Input } from "@/shared/ui/Input";

import { Textarea } from "@/shared/ui/Textarea";

import { Field } from "../../Field";

import { YesNo } from "../../YesNo";

import styles from "../../styles.module.scss";

export const NeuropathyMainSection: React.FC = () => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  return (
    <fieldset className={styles.fieldset}>
      <legend>🦶 Нейропатия (стопы)</legend>

      <label>Симптомы (множественный выбор):</label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.symptoms.numbness")}
        />{" "}
        Онемение
      </label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.symptoms.pain")}
        />{" "}
        Боль
      </label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.symptoms.paresthesia")}
        />{" "}
        Парестезии
      </label>

      {watch("complications.neuropathy.symptoms.numbness") && (
        <div className={styles.radioGroup}>
          <label>Когда онемение?</label>

          <label>
            <input
              type="radio"
              value="day"
              {...register("complications.neuropathy.numbnessTime")}
            />{" "}
            Днём
          </label>

          <label>
            <input
              type="radio"
              value="night"
              {...register("complications.neuropathy.numbnessTime")}
            />{" "}
            Ночью
          </label>

          <label>
            <input
              type="radio"
              value="any"
              {...register("complications.neuropathy.numbnessTime")}
            />{" "}
            Вне зависимости
          </label>
        </div>
      )}

      <label>Тип парестезий:</label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.paresthesiaType.crawling")}
        />{" "}
        Ползание мурашек
      </label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.paresthesiaType.shots")}
        />{" "}
        Прострелы
      </label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.paresthesiaType.allodynia")}
        />{" "}
        Аллодиния
      </label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.paresthesiaType.hyperalgesia")}
        />{" "}
        Гипералгезия
      </label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.paresthesiaType.nightCramps")}
        />{" "}
        Ночные судороги
      </label>

      <label>
        <input
          type="checkbox"
          {...register("complications.neuropathy.paresthesiaType.burning")}
        />{" "}
        Жжение
      </label>

      <YesNo
        label="Часто ли мёрзнут ноги?"
        name="complications.neuropathy.coldFeet"
        register={register}
      />

      {watch("complications.neuropathy.coldFeet") === true && (
        <>
          <Textarea
            label="Чем согреваете ноги?"
            {...register("complications.neuropathy.howWarmFeet")}
            rows={2}
          />

          <YesNo
            label="Прислоняете ноги к батарее?"
            name="complications.neuropathy.feetToRadiator"
            register={register}
          />
        </>
      )}

      <YesNo
        label="Были ли ампутации?"
        name="complications.neuropathy.amputations"
        register={register}
      />

      {watch("complications.neuropathy.amputations") === true && (
        <Field noteKey="complications.neuropathy.amputations">
          <>
            <Input
              label="Уровень ампутации"
              {...register("complications.neuropathy.amputationLevel")}
            />

            <DateField
              label="Дата"
              name="complications.neuropathy.amputationDate"
              watch={watch}
              setValue={setValue}
            />
          </>
        </Field>
      )}

      <div className={styles.row}>
        <div>
          <label>Кожа стоп</label>

          <select {...register("complications.neuropathy.footSkin")}>
            <option value="">—</option>

            <option value="hyperkeratosis">Гиперкератоз</option>

            <option value="dry">Сухая</option>

            <option value="normal">Нормальная</option>

            <option value="moist">Влажная</option>
          </select>
        </div>

        <div>
          <label>Степень гиперкератоза</label>

          <select
            {...register("complications.neuropathy.hyperkeratosisDegree")}
          >
            <option value="">—</option>

            <option value="moderate">Умеренный</option>

            <option value="severe">Сильно выраженный</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <label>Температура</label>

          <select {...register("complications.neuropathy.footTemperature")}>
            <option value="">—</option>

            <option value="cold">Холодная</option>

            <option value="warm">Тёплая</option>

            <option value="hot">Горячая</option>
          </select>
        </div>

        <div>
          <label>Цвет стоп</label>

          <select {...register("complications.neuropathy.footColor")}>
            <option value="">—</option>

            <option value="cyanotic">Цианотичная</option>

            <option value="pale">Бледная</option>

            <option value="normal">Нормальная</option>

            <option value="hyperemic">Гиперемированная</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <label>Ногтевые пластины</label>

          <select {...register("complications.neuropathy.nails")}>
            <option value="">—</option>

            <option value="normal">Норма</option>

            <option value="onychohypertrophy">Онихогипертрофия</option>

            <option value="onychodystrophy">Ониходистрофия</option>

            <option value="onychomycosis">Онихомикоз</option>

            <option value="subungualHematoma">Подногтевая гематома</option>

            <option value="ingrownNail">Вросший ноготь</option>
          </select>
        </div>

        <div>
          <label>Деформация стоп</label>

          <select {...register("complications.neuropathy.footDeformity")}>
            <option value="">—</option>

            <option value="none">Отсутствует</option>

            <option value="flatfoot">Плоскостопие</option>

            <option value="longitudinal">Продольное</option>

            <option value="transverse">Поперечное</option>
          </select>
        </div>
      </div>

      <label>Голени</label>

      <select {...register("complications.neuropathy.lowerLegs")}>
        <option value="">—</option>

        <option value="normal">Норма</option>

        <option value="hairLoss">Выпадение волос</option>

        <option value="hyperpigmentation">Гиперпигментация</option>

        <option value="spottedLegs">«Пятнистые голени»</option>

        <option value="muscleAtrophy">Атрофия мышц</option>
      </select>

      <YesNo
        label="Hallux valgus"
        name="complications.neuropathy.halluxValgus"
        register={register}
      />

      <YesNo
        label="Молоткообразная деформация"
        name="complications.neuropathy.hammerToe"
        register={register}
      />

      <YesNo
        label="Клювовидная деформация"
        name="complications.neuropathy.clawToe"
        register={register}
      />

      <YesNo
        label="Перекрещивание пальцев"
        name="complications.neuropathy.digitusSuperductus"
        register={register}
      />

      <Field
        noteKey="complications.neuropathy"
        noteLabel="Примечание по нейропатии"
      >
        <div />
      </Field>
    </fieldset>
  );
};
