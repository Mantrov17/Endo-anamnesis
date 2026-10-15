import { useCallback, useEffect, useRef, useState } from "react";

import { type SubmitHandler, useForm } from "react-hook-form";

import {
  addAnamnesis,
  type AnamnesisFormData,
  updateAnamnesis,
} from "@/entities/anamnesis";

import { getPatientById } from "@/entities/patient";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

import {
  calculateAbi,
  calculateAge,
  calculateAgeAtDiagnosis,
  calculateBmi,
  calculateDailyInsulinDose,
  calculateDiagnosisYearFromAge,
  calculateDiseaseDuration,
  calculateH2FPEFScore,
  calculateInsulinDoseCoefficient,
  calculatePulsePressure,
  calculateTargetHba1c,
  parseDiagnosisYear,
} from "../lib/calculations";

import {
  clearAnamnesisDraft,
  getInitialAnamnesisData,
  saveAnamnesisDraft,
} from "../lib/anamnesisDraft";

import { mergeAnamnesisWithDefaults } from "../lib/normalizeAnamnesis";

interface UseAnamnesisFormProps {
  patientId: string;

  initialData?: AnamnesisFormData;

  anamnesisId?: string;

  onSuccess?: (anamnesisId: string) => void;
}

export const useAnamnesisForm = ({
  patientId,
  initialData,
  anamnesisId,
  onSuccess,
}: UseAnamnesisFormProps) => {
  const [currentAnamnesisId, setCurrentAnamnesisId] = useState<
    string | undefined
  >(anamnesisId);

  /*
   * Сначала восстанавливаем сохранённый черновик.
   *
   * Это происходит ДО создания react-hook-form,
   * поэтому поля с самого начала получают
   * восстановленные значения.
   */
  const [startingValues] = useState(() =>
    getInitialAnamnesisData(patientId, initialData),
  );

  const formMethods = useForm<AnamnesisFormData>({
    defaultValues: startingValues,
    shouldUnregister: false,
  });

  const { handleSubmit, watch, setValue, getValues, reset } = formMethods;

  // ====================
  // Автосохранение
  // ====================

  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const draftPendingRef = useRef(false);

  const draftErrorShownRef = useRef(false);

  const cancelDraftTimer = useCallback(() => {
    if (draftTimerRef.current !== null) {
      clearTimeout(draftTimerRef.current);
      draftTimerRef.current = null;
    }
  }, []);

  /*
   * Немедленное сохранение полного состояния формы.
   *
   * Вызывается по истечении задержки, при сворачивании
   * страницы и при её закрытии.
   */
  const persistDraft = useCallback(() => {
    if (!draftPendingRef.current) {
      return;
    }

    cancelDraftTimer();

    try {
      saveAnamnesisDraft(patientId, getValues());

      draftPendingRef.current = false;
      draftErrorShownRef.current = false;
    } catch (error) {
      console.error("Ошибка автосохранения черновика:", error);

      if (!draftErrorShownRef.current) {
        draftErrorShownRef.current = true;

        window.alert(
          "Не удалось автоматически сохранить черновик. " +
            getStorageWriteErrorMessage(error),
        );
      }
    }
  }, [patientId, getValues, cancelDraftTimer]);

  useEffect(() => {
    if (anamnesisId) {
      setCurrentAnamnesisId(anamnesisId);
    }
  }, [anamnesisId]);

  // ====================
  // Данные пациента
  // ====================

  useEffect(() => {
    const patient = getPatientById(patientId);

    if (!patient) {
      return;
    }

    /*
     * Пустая дата рождения в карточке пациента
     * не должна очищать ранее сохранённую дату.
     */
    if (patient.birthDate) {
      setValue("birthDate", patient.birthDate, {
        shouldDirty: false,
      });
    }

    setValue("fullName", patient.fullName, {
      shouldDirty: false,
    });

    setValue("gender", patient.gender, {
      shouldDirty: false,
    });
  }, [patientId, setValue]);

  // ====================
  // Дата рождения / возраст
  // ====================

  const birthDate = watch("birthDate");

  const currentAge = calculateAge(birthDate);

  // ====================
  // ИМТ
  // ====================

  // eslint-disable-next-line react-hooks/incompatible-library
  const pHeight = watch("primaryExam.height");

  const pWeight = watch("primaryExam.weight");

  useEffect(() => {
    const bmi = calculateBmi(pHeight, pWeight);

    setValue("primaryExam.bmi", bmi);
  }, [pHeight, pWeight, setValue]);

  // ====================
  // Целевой HbA1c
  // ====================

  useEffect(() => {
    if (currentAge === null) {
      setValue("therapy.targetHba1c", "", {
        shouldDirty: false,
      });

      return;
    }

    setValue("therapy.targetHba1c", calculateTargetHba1c(currentAge), {
      shouldDirty: false,
    });
  }, [currentAge, setValue]);

  // ====================
  // СД 1
  // ====================

  const t1Year = watch("type1Diabetes.yearOfDiagnosis");

  const t1Age = watch("type1Diabetes.ageAtDiagnosis");

  useEffect(() => {
    const diagnosisYear = parseDiagnosisYear(t1Year);

    if (diagnosisYear === null) {
      setValue("type1Diabetes.diseaseDuration", null);

      return;
    }

    const ageAtDiagnosis = calculateAgeAtDiagnosis(diagnosisYear, birthDate);

    if (ageAtDiagnosis !== null) {
      setValue("type1Diabetes.ageAtDiagnosis", ageAtDiagnosis);
    }

    setValue(
      "type1Diabetes.diseaseDuration",
      calculateDiseaseDuration(diagnosisYear),
    );
  }, [t1Year, birthDate, setValue]);

  useEffect(() => {
    if (!birthDate) {
      return;
    }

    const currentYear = String(t1Year ?? "").trim();

    if (currentYear) {
      return;
    }

    const diagnosisYear = calculateDiagnosisYearFromAge(birthDate, t1Age);

    if (diagnosisYear === null) {
      return;
    }

    setValue("type1Diabetes.yearOfDiagnosis", diagnosisYear);
  }, [t1Age, birthDate, t1Year, setValue]);

  // ====================
  // СД 2
  // ====================

  const t2Year = watch("type2Diabetes.yearOfDiagnosis");

  const t2Age = watch("type2Diabetes.ageAtDiagnosis");

  useEffect(() => {
    const diagnosisYear = parseDiagnosisYear(t2Year);

    if (diagnosisYear === null) {
      setValue("type2Diabetes.diseaseDuration", null);

      return;
    }

    const ageAtDiagnosis = calculateAgeAtDiagnosis(diagnosisYear, birthDate);

    if (ageAtDiagnosis !== null) {
      setValue("type2Diabetes.ageAtDiagnosis", ageAtDiagnosis);
    }

    setValue(
      "type2Diabetes.diseaseDuration",
      calculateDiseaseDuration(diagnosisYear),
    );
  }, [t2Year, birthDate, setValue]);

  useEffect(() => {
    if (!birthDate) {
      return;
    }

    const currentYear = String(t2Year ?? "").trim();

    if (currentYear) {
      return;
    }

    const diagnosisYear = calculateDiagnosisYearFromAge(birthDate, t2Age);

    if (diagnosisYear === null) {
      return;
    }

    setValue("type2Diabetes.yearOfDiagnosis", diagnosisYear);
  }, [t2Age, birthDate, t2Year, setValue]);

  // ====================
  // Суточная доза инсулина
  // ====================

  const actualBase = watch("actualTherapy.basalInsulin");

  const actualBolus = watch("actualTherapy.bolusInsulin");

  const actualCoefficient = watch("actualTherapy.insulinDoseCoefficient");

  useEffect(() => {
    setValue(
      "actualTherapy.calculatedDailyInsulinDose",
      calculateDailyInsulinDose(
        actualBase,
        actualBolus,
        pHeight,
        actualCoefficient,
      ),
    );
  }, [actualBase, actualBolus, actualCoefficient, pHeight, setValue]);

  // ====================
  // Коэффициент СДИ
  // ====================

  const diseaseDurationForCoefficient = watch("type1Diabetes.diseaseDuration");

  useEffect(() => {
    setValue(
      "actualTherapy.insulinDoseCoefficient",
      calculateInsulinDoseCoefficient(diseaseDurationForCoefficient),
    );
  }, [diseaseDurationForCoefficient, setValue]);

  // ====================
  // Пульсовое давление
  // ====================

  const leftSystolic = watch("measurements.bpArms.leftSystolic");

  const leftDiastolic = watch("measurements.bpArms.leftDiastolic");

  useEffect(() => {
    setValue(
      "measurements.pulsePressure",
      calculatePulsePressure(leftSystolic, leftDiastolic),
    );
  }, [leftSystolic, leftDiastolic, setValue]);

  // ====================
  // ЛПИ
  // ====================

  const legLeft = watch("measurements.bpLegs.leftSystolic");

  const legRight = watch("measurements.bpLegs.rightSystolic");

  const armLeft = watch("measurements.bpArms.leftSystolic");

  const armRight = watch("measurements.bpArms.rightSystolic");

  useEffect(() => {
    setValue("measurements.abiIndex.left", calculateAbi(legLeft, armLeft));

    setValue("measurements.abiIndex.right", calculateAbi(legRight, armRight));
  }, [legLeft, legRight, armLeft, armRight, setValue]);

  // ====================
  // H2FPEF — возраст
  // ====================

  useEffect(() => {
    setValue(
      "h2fpef.elderly60",
      currentAge !== null ? currentAge > 60 : false,
      {
        shouldDirty: false,
      },
    );
  }, [currentAge, setValue]);

  // ====================
  // H2FPEF — сумма
  // ====================

  const h2fpef = watch("h2fpef");

  useEffect(() => {
    if (!h2fpef) {
      return;
    }

    setValue("h2fpef.totalScore", calculateH2FPEFScore(h2fpef));
  }, [h2fpef, setValue]);

  // ====================
  // Подписка на все поля
  // ====================

  useEffect(() => {
    /*
     * Если пользователь изменил поле, ожидаем
     * 700 мс с момента последнего изменения.
     *
     * watch отслеживает изменения всей формы,
     * включая скрытые вкладки и поля с setValue().
     */
    const subscription = watch(() => {
      draftPendingRef.current = true;

      cancelDraftTimer();

      draftTimerRef.current = setTimeout(persistDraft, 700);
    });

    /*
     * Событие visibilitychange срабатывает,
     * когда пользователь переходит в другое
     * приложение или вкладка становится скрытой.
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persistDraft();
      }
    };

    /*
     * Дополнительная страховка на случай
     * закрытия/выгрузки страницы.
     */
    const handlePageHide = () => {
      persistDraft();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      subscription.unsubscribe();

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("pagehide", handlePageHide);

      persistDraft();
      cancelDraftTimer();
    };
  }, [watch, persistDraft, cancelDraftTimer]);

  // ====================
  // Основное сохранение
  // ====================

  const onSubmit: SubmitHandler<AnamnesisFormData> = (data) => {
    try {
      const patient = getPatientById(patientId);

      if (!patient) {
        window.alert("Пациент не найден");

        return;
      }

      /*
       * Дата рождения из анамнеза имеет
       * приоритет над датой карточки пациента.
       */
      const effectiveBirthDate = data.birthDate || patient.birthDate;

      const payload = mergeAnamnesisWithDefaults({
        ...data,
        fullName: patient.fullName,
        birthDate: effectiveBirthDate,
        gender: patient.gender,
      });

      if (currentAnamnesisId) {
        const success = updateAnamnesis(patientId, currentAnamnesisId, payload);

        if (!success) {
          window.alert("Анамнез не найден. Возможно, он был удалён.");

          return;
        }

        /*
         * Официальное сохранение прошло успешно.
         * Обновляем базовое состояние react-hook-form
         * и удаляем временный черновик.
         */
        reset(payload);

        cancelDraftTimer();

        draftPendingRef.current = false;

        try {
          clearAnamnesisDraft(patientId);
        } catch (error) {
          console.warn("Не удалось удалить сохранённый черновик:", error);
        }

        onSuccess?.(currentAnamnesisId);

        return;
      }

      /*
       * Пациент ещё не имеет первичного анамнеза.
       * Создаём его только при основном сохранении,
       * а не при сохранении черновика.
       */
      const newRecord = addAnamnesis(patientId, payload);

      if (!newRecord) {
        window.alert("Пациент не найден");

        return;
      }

      setCurrentAnamnesisId(newRecord.id);

      reset(payload);

      cancelDraftTimer();

      draftPendingRef.current = false;

      try {
        clearAnamnesisDraft(patientId);
      } catch (error) {
        console.warn("Не удалось удалить сохранённый черновик:", error);
      }

      onSuccess?.(newRecord.id);
    } catch (error) {
      console.error("Ошибка сохранения анамнеза:", error);

      /*
       * Если основное сохранение завершилось
       * ошибкой, пробуем сохранить хотя бы
       * актуальный черновик.
       */
      let draftFailureMessage = "";

      try {
        saveAnamnesisDraft(patientId, getValues());

        cancelDraftTimer();

        draftPendingRef.current = false;
      } catch (draftError) {
        console.error("Не удалось сохранить даже черновик:", draftError);

        draftFailureMessage = " Черновик также не удалось сохранить.";
      }

      window.alert(getStorageWriteErrorMessage(error) + draftFailureMessage);
    }
  };

  return {
    formMethods,
    submitForm: handleSubmit(onSubmit),
    currentAnamnesisId,
  };
};
