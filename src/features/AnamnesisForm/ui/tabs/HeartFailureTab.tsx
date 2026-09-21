import React from "react";
import { useFormContext } from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import styles from "../styles.module.scss";

export const HeartFailureTab: React.FC = () => {
  const { register, watch } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>ХСН</h3>
      <YesNo
        label="Изменение цвета мочи?"
        name="heartFailure.urineColorChange"
        register={register}
      />
      {watch("heartFailure.urineColorChange") === true && (
        <Input label="Какой цвет?" {...register("heartFailure.urineColor")} />
      )}

      <YesNo
        label="Боли в груди / сердце"
        name="heartFailure.chestPain"
        register={register}
      />
      {watch("heartFailure.chestPain") === true && (
        <Field noteKey="heartFailure.chestPain">
          <>
            <div className={styles.radioGroup}>
              <label>Провоцирующий фактор:</label>
              <label>
                <input
                  type="radio"
                  value="none"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Отсутствует
              </label>
              <label>
                <input
                  type="radio"
                  value="physical"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Физ. нагрузка
              </label>
              <label>
                <input
                  type="radio"
                  value="emotional"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Эмоц. стресс
              </label>
              <label>
                <input
                  type="radio"
                  value="positional"
                  {...register("heartFailure.chestPainTrigger")}
                />{" "}
                Изменение положения тела
              </label>
            </div>
            <YesNo
              label="Иррадиация в левую руку"
              name="heartFailure.radiatesToLeftArm"
              register={register}
            />
            <YesNo
              label="Проходят от нитроглицерина / фосфалюгеля"
              name="heartFailure.relievesWithNitroglycerin"
              register={register}
            />
            <YesNo
              label="За последние 3 месяца — учащение приступов?"
              name="heartFailure.frequentAttacks3Months"
              register={register}
            />
          </>
        </Field>
      )}

      <YesNo
        label="Одышка при нагрузке"
        name="heartFailure.dyspneaOnExertion"
        register={register}
      />
      {watch("heartFailure.dyspneaOnExertion") === true && (
        <div className={styles.radioGroup}>
          <label>Функциональный класс:</label>
          <label>
            <input
              type="radio"
              value="I"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            I (чрезмерная нагрузка)
          </label>
          <label>
            <input
              type="radio"
              value="II"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            II (умеренное ограничение, &gt;2 этажей)
          </label>
          <label>
            <input
              type="radio"
              value="III"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            III (&lt;2 этажей)
          </label>
          <label>
            <input
              type="radio"
              value="IV"
              {...register("heartFailure.dyspneaFunctionalClass")}
            />{" "}
            IV (в покое)
          </label>
        </div>
      )}

      <YesNo
        label="Принимает тикагрелор"
        name="heartFailure.takesTicagrelor"
        register={register}
      />

      <Field noteKey="heartFailure.smallCircle">
        <fieldset className={styles.fieldset}>
          <legend>Малый круг кровообращения</legend>
          <YesNo
            label="Во время сна подкладываете подушки под спину?"
            name="heartFailure.smallCircle.pillowsForSleep"
            register={register}
          />
          <YesNo
            label="Усиливается ли одышка ночью? Просыпаетесь ли из-за одышки?"
            name="heartFailure.smallCircle.nightDyspnea"
            register={register}
          />
          <label>Акроцианоз:</label>
          <label>
            <input
              type="checkbox"
              {...register(
                "heartFailure.smallCircle.acrocyanosis.nasolabialTriangle",
              )}
            />{" "}
            Носогубный треугольник
          </label>
          <label>
            <input
              type="checkbox"
              {...register("heartFailure.smallCircle.acrocyanosis.hands")}
            />{" "}
            Кисти
          </label>
          <label>
            <input
              type="checkbox"
              {...register("heartFailure.smallCircle.acrocyanosis.feet")}
            />{" "}
            Стопы
          </label>
          <Input
            label="Сатурация"
            type="number"
            suffix="%"
            {...register("heartFailure.smallCircle.saturation")}
          />
        </fieldset>
      </Field>

      <Field noteKey="heartFailure.bigCircle">
        <fieldset className={styles.fieldset}>
          <legend>Большой круг — отёки ног</legend>
          <YesNo
            label="Отёки ног"
            name="heartFailure.bigCircle.legEdema"
            register={register}
          />
          <YesNo
            label="Теснота обуви к концу дня, след от резинки носков"
            name="heartFailure.bigCircle.tightShoes"
            register={register}
          />
          <div className={styles.radioGroup}>
            <label>Давно появились отёки?</label>
            <label>
              <input
                type="radio"
                value="long"
                {...register("heartFailure.bigCircle.edemaOnset")}
              />{" "}
              Давно
            </label>
            <label>
              <input
                type="radio"
                value="acute"
                {...register("heartFailure.bigCircle.edemaOnset")}
              />{" "}
              Остро (исключить ТГВ)
            </label>
          </div>
          <YesNo
            label="Симметричные?"
            name="heartFailure.bigCircle.symmetric"
            register={register}
          />
          <Input
            label="Локализация (стопы, голени, крестец, мошонка)"
            {...register("heartFailure.bigCircle.localization")}
          />
          <div className={styles.radioGroup}>
            <label>Время появления:</label>
            <label>
              <input
                type="radio"
                value="morning"
                {...register("heartFailure.bigCircle.timeOfDay")}
              />{" "}
              Утро
            </label>
            <label>
              <input
                type="radio"
                value="evening"
                {...register("heartFailure.bigCircle.timeOfDay")}
              />{" "}
              Вечер
            </label>
          </div>
          <YesNo
            label="Проходят ли отёки за ночь?"
            name="heartFailure.bigCircle.edemaImprovesNight"
            register={register}
          />
          <YesNo
            label="Становится ли лучше при возвышенном положении?"
            name="heartFailure.bigCircle.edemaImprovesElevation"
            register={register}
          />

          <div className={styles.row}>
            <div>
              <label>Температура</label>
              <select {...register("heartFailure.bigCircle.edemaTemperature")}>
                <option value="">—</option>
                <option value="cold">Холодная</option>
                <option value="hot">Горячая</option>
              </select>
            </div>
            <div>
              <label>Цвет</label>
              <select {...register("heartFailure.bigCircle.edemaColor")}>
                <option value="">—</option>
                <option value="pale">Бледный</option>
                <option value="cyanotic">Цианотичный</option>
                <option value="hyperemic">Гиперемия</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div>
              <label>Плотность</label>
              <select {...register("heartFailure.bigCircle.edemaDensity")}>
                <option value="">—</option>
                <option value="soft">Мягкие</option>
                <option value="dense">Плотные</option>
              </select>
            </div>
            <div>
              <label>Исчезает</label>
              <select {...register("heartFailure.bigCircle.edemaResolves")}>
                <option value="">—</option>
                <option value="immediate">Сразу</option>
                <option value="delayed">Спустя время</option>
              </select>
            </div>
          </div>

          <YesNo
            label="Ямка при нажатии"
            name="heartFailure.bigCircle.pittingEdema"
            register={register}
          />
          <YesNo
            label="Болезненность"
            name="heartFailure.bigCircle.painful"
            register={register}
          />
          <YesNo
            label="Принимает нифедипин, амлодипин, НПВС"
            name="heartFailure.bigCircle.takesNifedipineAmlodipineNsaids"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="heartFailure.hepatomegaly">
        <fieldset className={styles.fieldset}>
          <legend>Гепатомегалия</legend>
          <YesNo
            label="Чувствуете боли/дискомфорт в правом подреберье?"
            name="heartFailure.hepatomegaly.rightHypochondriumPain"
            register={register}
          />
          <div className={styles.radioGroup}>
            <label>Размер печени:</label>
            <label>
              <input
                type="radio"
                value="enlarged"
                {...register("heartFailure.hepatomegaly.liverSize")}
              />{" "}
              Увеличена
            </label>
            <label>
              <input
                type="radio"
                value="notPalpable"
                {...register("heartFailure.hepatomegaly.liverSize")}
              />{" "}
              Не пальпируется
            </label>
          </div>
          <div className={styles.radioGroup}>
            <label>Край:</label>
            <label>
              <input
                type="radio"
                value="smooth"
                {...register("heartFailure.hepatomegaly.liverEdge")}
              />{" "}
              Гладкий
            </label>
            <label>
              <input
                type="radio"
                value="bumpy"
                {...register("heartFailure.hepatomegaly.liverEdge")}
              />{" "}
              Бугристый
            </label>
            <label>
              <input
                type="radio"
                value="notDefined"
                {...register("heartFailure.hepatomegaly.liverEdge")}
              />{" "}
              Не определяется
            </label>
          </div>
          <YesNo
            label="Болезненность"
            name="heartFailure.hepatomegaly.liverPainful"
            register={register}
          />
          <YesNo
            label="Придаточная пульсация"
            name="heartFailure.hepatomegaly.hepaticPulsation"
            register={register}
          />
          <YesNo
            label="Гепатоеюнальный рефлюкс"
            name="heartFailure.hepatomegaly.hepatojugularReflux"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="heartFailure.jugularVeins">
        <fieldset className={styles.fieldset}>
          <legend>Набухание яремных вен (голова 45°)</legend>
          <YesNo
            label="На вдохе и выдохе"
            name="heartFailure.jugularVeins.onInspirationAndExpiration"
            register={register}
          />
          <YesNo
            label="Только на вдохе"
            name="heartFailure.jugularVeins.onlyOnInspiration"
            register={register}
          />
        </fieldset>
      </Field>

      <Field noteKey="heartFailure.nyhaClass">
        <fieldset className={styles.fieldset}>
          <legend>Стадия по NYHA</legend>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="I"
                {...register("heartFailure.nyhaClass")}
              />{" "}
              I — скрытая НК
            </label>
            <label>
              <input
                type="radio"
                value="IIA"
                {...register("heartFailure.nyhaClass")}
              />{" "}
              IIA — прогрессирующее снижение толерантности
            </label>
            <label>
              <input
                type="radio"
                value="IIB"
                {...register("heartFailure.nyhaClass")}
              />{" "}
              IIB — выраженные признаки в покое
            </label>
            <label>
              <input
                type="radio"
                value="III"
                {...register("heartFailure.nyhaClass")}
              />{" "}
              III — конечная
            </label>
          </div>
        </fieldset>
      </Field>
    </div>
  );
};
