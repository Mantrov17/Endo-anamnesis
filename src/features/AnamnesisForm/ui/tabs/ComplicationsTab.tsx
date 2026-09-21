import React from "react";
import { useFormContext } from "react-hook-form";
import type { Path } from "react-hook-form";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import type { AnamnesisFormData } from "@/shared";
import styles from "../styles.module.scss";
import { DateField } from "@/shared/ui/DateInput";

export const ComplicationsTab: React.FC = () => {
  const { register, watch, setValue } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Осложнения</h3>

      <Field noteKey="complications.eyes">
        <fieldset className={styles.fieldset}>
          <legend>👁 Глаза</legend>
          <YesNo
            label="Снижение зрения?"
            name="complications.eyes.visionLoss"
            register={register}
          />
          {watch("complications.eyes.visionLoss") === true && (
            <>
              <Input
                label="Когда началось снижение зрения?"
                {...register("complications.eyes.visionLossStart")}
              />
              <Input
                label="За какой промежуток времени (авторасчёт)"
                {...register("complications.eyes.visionLossDuration")}
                readOnly
              />
              <YesNo
                label="Хорошо ли видите ночью?"
                name="complications.eyes.nightVisionGood"
                register={register}
              />
            </>
          )}
          <DateField
            label="Дата последнего осмотра глазного дна"
            name="complications.eyes.lastFundusExamDate"
            watch={watch}
            setValue={setValue}
          />
          <label>
            <input
              type="checkbox"
              {...register("complications.eyes.lastFundusExamUnknown")}
            />{" "}
            Затрудняюсь ответить
          </label>

          <YesNo
            label="Никталопия («куриная слепота») — плохо видите ночью?"
            name="complications.eyes.nyctalopia"
            register={register}
          />
          <YesNo
            label="Замедленная адаптация к темноте?"
            name="complications.eyes.delayedDarkAdaptation"
            register={register}
          />
          <YesNo
            label="Появляются ли мушки/сетка перед глазами?"
            name="complications.eyes.floaters"
            register={register}
          />
          {watch("complications.eyes.floaters") === true && (
            <div className={styles.radioGroup}>
              <label>При каких условиях?</label>
              <label>
                <input
                  type="radio"
                  value="bp"
                  {...register("complications.eyes.floatersWhen")}
                />{" "}
                Повышение АД
              </label>
              <label>
                <input
                  type="radio"
                  value="glucose"
                  {...register("complications.eyes.floatersWhen")}
                />{" "}
                Повышение глюкозы
              </label>
            </div>
          )}
          <YesNo
            label="Выпадение боковых полей зрения (например, за рулём)?"
            name="complications.eyes.visualFieldLoss"
            register={register}
          />
          <Input
            label="Как часто наблюдаетесь у офтальмолога?"
            {...register("complications.eyes.ophthalmologistFrequency")}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.nose">
        <fieldset className={styles.fieldset}>
          <legend>👃 Нос (в разработке)</legend>
          <YesNo
            label="Храп"
            name="complications.nose.snoring"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.ears">
        <fieldset className={styles.fieldset}>
          <legend>👂 Уши</legend>
          <YesNo
            label="Снижение слуха?"
            name="complications.ears.hearingLoss"
            register={register}
          />
          {watch("complications.ears.hearingLoss") === true && (
            <>
              <Input
                label="Когда началось снижение слуха?"
                {...register("complications.ears.hearingLossStart")}
              />
              <Input
                label="За какой промежуток времени"
                {...register("complications.ears.hearingLossDuration")}
              />
            </>
          )}
          <DateField
            label="Дата последнего осмотра ЛОРа"
            name="complications.ears.lastEntExamDate"
            watch={watch}
            setValue={setValue}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.gastrointestinal">
        <fieldset className={styles.fieldset}>
          <legend>🫃 ЖКТ</legend>
          <YesNo
            label="Гастрит"
            name="complications.gastrointestinal.gastritis"
            register={register}
          />
          <YesNo
            label="Язвы"
            name="complications.gastrointestinal.ulcers"
            register={register}
          />
          <YesNo
            label="Боли в животе после еды?"
            name="complications.gastrointestinal.abdominalPainAfterEating"
            register={register}
          />
          <label>Провоцирующие факторы болей в животе:</label>
          <label>
            <input
              type="checkbox"
              {...register("complications.gastrointestinal.painTriggerFatty")}
            />{" "}
            Жирная пища
          </label>
          <label>
            <input
              type="checkbox"
              {...register("complications.gastrointestinal.painTriggerAlcohol")}
            />{" "}
            Алкоголь
          </label>

          <Textarea
            label="Частота стула"
            {...register("complications.gastrointestinal.stoolFrequency")}
            rows={2}
          />
          <label>Оформленность кала (0 = диарея, 5 = норма, 10 = запор)</label>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            {...register("complications.gastrointestinal.stoolConsistency")}
            className={styles.slider}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.urinary">
        <fieldset className={styles.fieldset}>
          <legend>🚽 Мочевыделительная система</legend>
          <YesNo
            label="Камни в почках?"
            name="complications.urinary.kidneyStones"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="complications.nephropathy">
        <fieldset className={styles.fieldset}>
          <legend>🫘 Нефропатия</legend>
          <Input
            label="Альбумин/креатинин мочи"
            {...register("complications.nephropathy.albuminCreatinine")}
          />
          <Input label="СКФ" {...register("complications.nephropathy.gfr")} />
        </fieldset>
      </Field>

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
            {...register(
              "complications.neuropathy.paresthesiaType.hyperalgesia",
            )}
          />{" "}
          Гипералгезия
        </label>
        <label>
          <input
            type="checkbox"
            {...register(
              "complications.neuropathy.paresthesiaType.nightCramps",
            )}
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

      <Field noteKey="complications.neuropathy.sensitivity">
        <fieldset className={styles.fieldset}>
          <legend>
            Чувствительность (0 = норма, 1 = снижение, 2 = отсутствует)
          </legend>
          <div className={styles.table}>
            <div className={styles.tableRow}>
              <span>Вид</span>
              <span>Правая</span>
              <span>Левая</span>
            </div>
            {(
              [
                "vibration",
                "temperature",
                "pain",
                "tactile",
                "jointMuscle",
                "achillesReflex",
                "kneeReflex",
              ] as const
            ).map((key) => {
              const rightName: Path<AnamnesisFormData> = `complications.neuropathy.sensitivity.${key}.right`;
              const leftName: Path<AnamnesisFormData> = `complications.neuropathy.sensitivity.${key}.left`;

              return (
                <div key={key} className={styles.tableRow}>
                  <span>{key}</span>
                  <input
                    type="number"
                    min={0}
                    max={2}
                    {...register(rightName)}
                  />
                  <input
                    type="number"
                    min={0}
                    max={2}
                    {...register(leftName)}
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      </Field>

      <Field
        noteKey="complications.neuropathy.veins"
        noteLabel="Примечание по венам / стопам"
      >
        <fieldset className={styles.fieldset}>
          <legend>Вены нижних конечностей</legend>
          <YesNo
            label="Лимфедема"
            name="complications.neuropathy.lymphedema"
            register={register}
          />
          <Textarea
            label="Симптом Ласега (детали)"
            {...register("complications.neuropathy.lasegueDetails")}
            rows={2}
          />
          <Textarea
            label="Осмотр стоп, наличие язв в анамнезе"
            {...register("complications.neuropathy.footExamNotes")}
            rows={3}
          />
          <Textarea
            label="Когда появилась рана?"
            {...register("complications.neuropathy.woundAppearance")}
            rows={2}
          />
        </fieldset>
      </Field>
    </div>
  );
};
