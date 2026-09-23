import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { deleteAnamnesis } from "@/entities/anamnesis";

import {
  deletePatient,
  getAllPatients,
  type Patient,
} from "@/entities/patient";

import { getStorageWriteErrorMessage } from "@/shared/lib/storage/jsonStorage";

import {
  filterAndSortPatients,
  type GenderFilter,
  type PatientsSortBy,
} from "../lib/patientsList";

export const usePatientsList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>(getAllPatients);

  const [searchTerm, setSearchTerm] = useState("");

  const [genderFilter, setGenderFilter] = useState<GenderFilter>("");

  const [dateFrom, setDateFrom] = useState("");

  const [dateTo, setDateTo] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(
    new Set(),
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState<PatientsSortBy>("createdAt");

  const filteredPatients = useMemo(
    () =>
      filterAndSortPatients({
        patients,
        searchTerm,
        genderFilter,
        dateFrom,
        dateTo,
        sortBy,
      }),

    [patients, searchTerm, genderFilter, dateFrom, dateTo, sortBy],
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredPatients.slice(
      start,

      start + itemsPerPage,
    );
  }, [filteredPatients, currentPage, itemsPerPage]);

  const hasActiveFilters =
    genderFilter !== "" || dateFrom !== "" || dateTo !== "";

  const refreshPatients = () => {
    setPatients(getAllPatients());
  };

  const togglePatientExpand = (patientId: string) => {
    setExpandedPatients((previous) => {
      const next = new Set(previous);

      if (next.has(patientId)) {
        next.delete(patientId);
      } else {
        next.add(patientId);
      }

      return next;
    });
  };

  const handleAddPatient = () => {
    navigate("/patient/new");
  };

  const handleDeletePatient = (patientId: string) => {
    const confirmed = window.confirm("Удалить пациента и все его анамнезы?");

    if (!confirmed) {
      return;
    }

    try {
      const success = deletePatient(patientId);

      if (!success) {
        window.alert("Пациент не найден. Возможно, он уже был удалён.");

        return;
      }

      refreshPatients();
    } catch (error) {
      console.error("Ошибка удаления пациента:", error);

      window.alert(getStorageWriteErrorMessage(error));
    }
  };

  const handleAddAnamnesis = (patientId: string) => {
    navigate(`/patient/${patientId}/anamnesis`);
  };

  const handleEditAnamnesis = (patientId: string, anamnesisId: string) => {
    navigate(`/patient/${patientId}/anamnesis/${anamnesisId}`);
  };

  const handleDeleteAnamnesis = (patientId: string, anamnesisId: string) => {
    const confirmed = window.confirm("Удалить этот анамнез?");

    if (!confirmed) {
      return;
    }

    try {
      const success = deleteAnamnesis(patientId, anamnesisId);

      if (!success) {
        window.alert("Анамнез не найден. Возможно, он уже был удалён.");

        return;
      }

      refreshPatients();
    } catch (error) {
      console.error("Ошибка удаления анамнеза:", error);

      window.alert(getStorageWriteErrorMessage(error));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");

    setCurrentPage(1);
  };

  const handleGenderFilterChange = (value: GenderFilter) => {
    setGenderFilter(value);

    setCurrentPage(1);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);

    setCurrentPage(1);
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);

    setCurrentPage(1);
  };

  const resetFilters = () => {
    setGenderFilter("");

    setDateFrom("");

    setDateTo("");

    setSearchTerm("");

    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setShowFilters((previous) => !previous);
  };

  const handleSortChange = (value: PatientsSortBy) => {
    setSortBy(value);

    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);

    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const handleDownloadBackup = () => {
    const data = getAllPatients();

    if (data.length === 0) {
      window.alert("Нет данных для бэкапа");

      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;

    anchor.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  return {
    patients,
    filteredPatients,
    paginatedPatients,

    searchTerm,
    genderFilter,
    dateFrom,
    dateTo,
    showFilters,
    hasActiveFilters,

    sortBy,
    itemsPerPage,
    currentPage,
    totalPages,

    expandedPatients,

    handleAddPatient,
    handleDeletePatient,

    handleAddAnamnesis,
    handleEditAnamnesis,
    handleDeleteAnamnesis,

    handleSearchChange,
    clearSearch,

    handleGenderFilterChange,
    handleDateFromChange,
    handleDateToChange,
    resetFilters,
    toggleFilters,

    handleSortChange,
    handleItemsPerPageChange,
    goToPage,

    togglePatientExpand,

    handleDownloadBackup,
  };
};
