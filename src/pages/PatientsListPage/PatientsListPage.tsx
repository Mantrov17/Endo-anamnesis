import React from "react";

import { usePatientsList } from "./model/usePatientsList";

import { PatientCard } from "./ui/PatientCard";
import { PatientsHeader } from "./ui/PatientsHeader";
import { PatientsPagination } from "./ui/PatientsPagination";
import { PatientsSearchFilters } from "./ui/PatientsSearchFilters";
import { PatientsStatsControls } from "./ui/PatientsStatsControls";

import styles from "./styles.module.scss";

export const PatientsListPage: React.FC = () => {
  const {
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
  } = usePatientsList();

  return (
    <main className={styles.container}>
      <PatientsHeader
        onAddPatient={handleAddPatient}
        onDownloadBackup={handleDownloadBackup}
      />

      <PatientsSearchFilters
        searchTerm={searchTerm}
        genderFilter={genderFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        showFilters={showFilters}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        onToggleFilters={toggleFilters}
        onGenderFilterChange={handleGenderFilterChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onResetFilters={resetFilters}
      />

      <PatientsStatsControls
        filteredCount={filteredPatients.length}
        totalCount={patients.length}
        hasActiveFilters={hasActiveFilters}
        sortBy={sortBy}
        itemsPerPage={itemsPerPage}
        onSortChange={handleSortChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {filteredPatients.length === 0 ? (
        <div className={styles.empty}>
          {searchTerm || hasActiveFilters
            ? "Ничего не найдено по заданным критериям"
            : "Нет пациентов. Создайте первого!"}
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {paginatedPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isExpanded={expandedPatients.has(patient.id)}
                onToggle={togglePatientExpand}
                onDeletePatient={handleDeletePatient}
                onAddAnamnesis={handleAddAnamnesis}
                onEditAnamnesis={handleEditAnamnesis}
                onDeleteAnamnesis={handleDeleteAnamnesis}
              />
            ))}
          </div>

          <PatientsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </main>
  );
};
