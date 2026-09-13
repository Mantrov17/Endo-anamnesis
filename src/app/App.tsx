// src/app/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.module.scss";
import { PatientsListPage } from "@/pages/PatientsListPage";
import { AnamnesisPage } from "@/pages/AnamnesisPage";
import { PatientFormPage } from "@/pages/PatientFormPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter basename="/endo-anamnesis">
      <Routes>
        <Route path="/" element={<PatientsListPage />} />
        <Route path="/patient/new" element={<PatientFormPage />} />{" "}
        {/* если есть */}
        <Route
          path="/patient/:patientId/edit"
          element={<PatientFormPage />}
        />{" "}
        {/* если есть */}
        <Route
          path="/patient/:patientId/anamnesis"
          element={<AnamnesisPage />}
        />
        <Route
          path="/patient/:patientId/anamnesis/:anamnesisId"
          element={<AnamnesisPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};
