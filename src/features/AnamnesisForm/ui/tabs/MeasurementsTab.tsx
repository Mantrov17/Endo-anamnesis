import React from "react";
import { useFormContext } from "react-hook-form";
import type { AnamnesisFormData } from "@/shared";
import { Input } from "@/shared/ui/Input";
import { Field } from "../Field";
import { YesNo } from "../YesNo";
import styles from "../styles.module.scss";

export const MeasurementsTab: React.FC = () => {
  const { register } = useFormContext<AnamnesisFormData>();

  return (
    <div className={styles.section}>
      <h3>Измерения</h3>

      <Field noteKey="measurements.pulseOximetry">
        <fieldset className={styles.fieldset}>
          <legend>Пульсоксиметр</legend>
          <div className={styles.row}>
            <Input
              label="Левая рука"
              type="number"
              suffix="%"
              {...register("measurements.pulseOximetry.leftHand")}
            />
            <Input
              label="Правая рука"
              type="number"
              suffix="%"
              {...register("measurements.pulseOximetry.rightHand")}
            />
          </div>
        </fieldset>
      </Field>

      <Field noteKey="measurements.pulsePalpation">
        <fieldset className={styles.fieldset}>
          <legend>Пальпация пульса</legend>
          <div className={styles.radioGroup}>
            <label>На лучевой артерии — ритм:</label>
            <label>
              <input
                type="radio"
                value="regular"
                {...register("measurements.pulsePalpation.radialArtery.rhythm")}
              />{" "}
              Регулярный
            </label>
            <label>
              <input
                type="radio"
                value="irregular"
                {...register("measurements.pulsePalpation.radialArtery.rhythm")}
              />{" "}
              Нерегулярный
            </label>
          </div>
          <div className={styles.radioGroup}>
            <label>Симметричность:</label>
            <label>
              <input
                type="radio"
                value="symmetric"
                {...register(
                  "measurements.pulsePalpation.radialArtery.symmetry",
                )}
              />{" "}
              Симметричный
            </label>
            <label>
              <input
                type="radio"
                value="asymmetric"
                {...register(
                  "measurements.pulsePalpation.radialArtery.symmetry",
                )}
              />{" "}
              Несимметричный
            </label>
          </div>
          <YesNo
            label="Задняя большеберцовая артерия слева пальпируется?"
            name="measurements.pulsePalpation.posteriorTibialArtery.left"
            register={register}
          />
          <YesNo
            label="Задняя большеберцовая артерия справа пальпируется?"
            name="measurements.pulsePalpation.posteriorTibialArtery.right"
            register={register}
          />
          <YesNo
            label="Тыльная артерия стопы слева пальпируется?"
            name="measurements.pulsePalpation.dorsalisPedisArtery.left"
            register={register}
          />
          <YesNo
            label="Тыльная артерия стопы справа пальпируется?"
            name="measurements.pulsePalpation.dorsalisPedisArtery.right"
            register={register}
          />
        </fieldset>
      </Field>

      <YesNo
        label="Условия выполнены (не принимали антигипертензивные за 2 ч, не курили за 1 ч, не пили чай/кофе/алкоголь за 1 ч)"
        name="measurements.conditionsMet"
        register={register}
      />

      <Field noteKey="measurements.bpArms">
        <fieldset className={styles.fieldset}>
          <legend>АД на двух руках (мм рт. ст.)</legend>
          <div className={styles.row}>
            <Input
              label="Левая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.leftSystolic")}
            />
            <Input
              label="Левая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.leftDiastolic")}
            />
          </div>
          <div className={styles.row}>
            <Input
              label="Правая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.rightSystolic")}
            />
            <Input
              label="Правая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpArms.rightDiastolic")}
            />
          </div>
          <Input
            label="Пульсовое давление (авторасчёт)"
            suffix="мм рт. ст."
            {...register("measurements.pulsePressure")}
            readOnly
          />
        </fieldset>
      </Field>

      <Field noteKey="measurements.bpLegs">
        <fieldset className={styles.fieldset}>
          <legend>АД на двух ногах (мм рт. ст.)</legend>
          <div className={styles.row}>
            <Input
              label="Левая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.leftSystolic")}
            />
            <Input
              label="Левая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.leftDiastolic")}
            />
          </div>
          <div className={styles.row}>
            <Input
              label="Правая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.rightSystolic")}
            />
            <Input
              label="Правая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpLegs.rightDiastolic")}
            />
          </div>
          <div className={styles.row}>
            <Input
              label="ЛПИ слева (авторасчёт)"
              {...register("measurements.abiIndex.left")}
              readOnly
            />
            <Input
              label="ЛПИ справа (авторасчёт)"
              {...register("measurements.abiIndex.right")}
              readOnly
            />
          </div>
        </fieldset>
      </Field>

      <Field noteKey="measurements.limbs">
        <fieldset className={styles.fieldset}>
          <legend>Боли при ходьбе / конечности</legend>
          <YesNo
            label="Боли при ходьбе в ногах/икрах"
            name="measurements.legPainWalking"
            register={register}
          />
          <YesNo
            label="Проходят ли боли после остановки?"
            name="measurements.painStopsAfterRest"
            register={register}
          />
          <Input
            label="Сколько можете пройти без остановки"
            {...register("measurements.walkingDistance")}
          />
          <Input
            label="Цвет конечностей"
            {...register("measurements.limbColor")}
          />
          <Input
            label="Температура"
            {...register("measurements.limbTemperature")}
          />
          <Input label="Кожа" {...register("measurements.limbSkin")} />
        </fieldset>
      </Field>

      <Field noteKey="measurements.bpRepeat">
        <fieldset className={styles.fieldset}>
          <legend>Повторное измерение АД</legend>
          <div className={styles.row}>
            <Input
              label="Левая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpRepeat.leftSystolic")}
            />
            <Input
              label="Левая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpRepeat.leftDiastolic")}
            />
          </div>
          <div className={styles.row}>
            <Input
              label="Правая — систолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpRepeat.rightSystolic")}
            />
            <Input
              label="Правая — диастолическое"
              type="number"
              suffix="мм рт. ст."
              {...register("measurements.bpRepeat.rightDiastolic")}
            />
          </div>
        </fieldset>
      </Field>
    </div>
  );
};
