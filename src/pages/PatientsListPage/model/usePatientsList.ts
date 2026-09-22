import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  deleteAnamnesis,
  deletePatient,
  getAllPatients,
  type Patient,
} from "@/shared";

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

  // ==================== Фильтрация / сортировка ====================

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

  // ==================== Пагинация ====================

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  // ==================== Состояние фильтров ====================

  const hasActiveFilters =
    genderFilter !== "" || dateFrom !== "" || dateTo !== "";

  // ==================== Обновление данных ====================

  const refreshPatients = () => {
    setPatients(getAllPatients());
  };

  // ==================== Раскрытие карточек ====================

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

  // ==================== Пациенты ====================

  const handleAddPatient = () => {
    navigate("/patient/new");
  };

  const handleDeletePatient = (patientId: string) => {
    const confirmed = window.confirm("Удалить пациента и все его анамнезы?");

    if (!confirmed) {
      return;
    }

    const success = deletePatient(patientId);

    if (success) {
      refreshPatients();
    }
  };

  // ==================== Анамнезы ====================

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

    const success = deleteAnamnesis(patientId, anamnesisId);

    if (success) {
      refreshPatients();
    }
  };

  // ==================== Поиск ====================

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // ==================== Фильтры ====================

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

  // ==================== Сортировка ====================

  const handleSortChange = (value: PatientsSortBy) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // ==================== Количество элементов ====================

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // ==================== Навигация по страницам ====================

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  // ==================== Backup ====================

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
    // Данные
    patients,
    filteredPatients,
    paginatedPatients,

    // Поиск / фильтры
    searchTerm,
    genderFilter,
    dateFrom,
    dateTo,
    showFilters,
    hasActiveFilters,

    // Сортировка / пагинация
    sortBy,
    itemsPerPage,
    currentPage,
    totalPages,

    // Раскрытые карточки
    expandedPatients,

    // Пациенты
    handleAddPatient,
    handleDeletePatient,

    // Анамнезы
    handleAddAnamnesis,
    handleEditAnamnesis,
    handleDeleteAnamnesis,

    // Поиск
    handleSearchChange,
    clearSearch,

    // Фильтры
    handleGenderFilterChange,
    handleDateFromChange,
    handleDateToChange,
    resetFilters,
    toggleFilters,

    // Сортировка / пагинация
    handleSortChange,
    handleItemsPerPageChange,
    goToPage,

    // UI
    togglePatientExpand,

    // Backup
    handleDownloadBackup,
  };
};
