import React from "react";

import { HashRouter, Route, Routes } from "react-router-dom";

import "./styles.scss";

import { AnamnesisPage } from "@/pages/AnamnesisPage";

import { PatientFormPage } from "@/pages/PatientFormPage";

import { PatientsListPage } from "@/pages/PatientsListPage";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PatientsListPage />} />

        <Route path="/patient/new" element={<PatientFormPage />} />

        <Route path="/patient/:patientId/edit" element={<PatientFormPage />} />

        <Route
          path="/patient/:patientId/anamnesis"
          element={<AnamnesisPage />}
        />

        <Route
          path="/patient/:patientId/anamnesis/:anamnesisId"
          element={<AnamnesisPage />}
        />
      </Routes>
    </HashRouter>
  );
};
