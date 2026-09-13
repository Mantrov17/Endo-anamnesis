import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPatientById,
  createPatient,
  updatePatient,
  type PatientFormData,
} from "@/shared";
import { Input } from "@/shared/ui/Input";
import { RadioGroup } from "@/shared/ui/RadioGroup";
import { Button } from "@/shared/ui/Button";
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
    if (id) {
      const patient = getPatientById(id);
      if (patient) {
        setFormData({
          fullName: patient.fullName,
          birthDate: patient.birthDate,
          gender: patient.gender,
        });
      } else {
        alert("Пациент не найден");
        navigate("/");
      }
    }
  }, [id, navigate]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className={styles.container}>
      <h1>{id ? "Редактирование пациента" : "Новый пациент"}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="ФИО"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          required
        />
        <Input
          label="Дата рождения"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          required
        />
        <RadioGroup
          label="Пол"
          name="gender"
          value={formData.gender || "male"}
          onChange={handleChange}
          options={[
            { value: "male", label: "Мужской" },
            { value: "female", label: "Женский" },
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
    </div>
  );
};
