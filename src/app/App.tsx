import React from "react";

import { HashRouter, Route, Routes } from "react-router-dom";

import "./styles.scss";

import { AnamnesisPage } from "@/pages/AnamnesisPage";

import { DiaryPage } from "@/pages/DiaryPage";

import { GlycemicProfilePage } from "@/pages/GlycemicProfilePage";

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
          path="/patient/:patientId/glycemic-profile"
          element={<GlycemicProfilePage />}
        />

        <Route path="/patient/:patientId/diary/new" element={<DiaryPage />} />

        <Route
          path="/patient/:patientId/diary/:diaryId"
          element={<DiaryPage />}
        />
      </Routes>
    </HashRouter>
  );
};
