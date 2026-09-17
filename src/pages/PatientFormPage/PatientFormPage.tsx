import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  createPatient,
  getPatientById,
  type PatientFormData,
  updatePatient,
} from "@/shared";

import { Button } from "@/shared/ui/Button";
import { DateInput } from "@/shared/ui/DateInput/DateInput.tsx";
import { Heading } from "@/shared/ui/Heading";
import { Input } from "@/shared/ui/Input";
import { RadioGroup } from "@/shared/ui/RadioGroup";

import styles from "./styles.module.scss";

export const PatientFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<PatientFormData>({
    fullName: "",
    birthDate: "",
    gender: "male",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const patient = getPatientById(id);

    if (patient) {
      setFormData({
        fullName: patient.fullName,
        birthDate: patient.birthDate,
        gender: patient.gender,
      });

      return;
    }

    alert("Пациент не найден");
    navigate("/");
  }, [id, navigate]);

  const handleChange = (name: string, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      if (id) {
        updatePatient(id, formData);
      } else {
        createPatient(formData);
      }

      navigate("/");
    } catch (_error) {
      alert("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <Heading level={1} variant="page" className={styles.title}>
        {id ? "Редактирование пациента" : "Новый пациент"}
      </Heading>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="ФИО"
          name="fullName"
          value={formData.fullName}
          onChange={(event) =>
            handleChange(event.target.name, event.target.value)
          }
          required
        />

        <DateInput
          label="Дата рождения"
          value={formData.birthDate}
          onChange={(iso) => handleChange("birthDate", iso)}
        />

        <RadioGroup
          label="Пол"
          name="gender"
          value={formData.gender || "male"}
          onChange={handleChange}
          options={[
            {
              value: "male",
              label: "Мужской",
            },
            {
              value: "female",
              label: "Женский",
            },
          ]}
        />

        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            Отмена
          </Button>
        </div>
      </form>
    </main>
  );
};
