import React from "react";

import { Button } from "@/shared/ui/Button";
import { DateInput } from "@/shared/ui/DateInput/DateInput.tsx";

import type { GenderFilter } from "../lib/patientsList";

import styles from "../styles.module.scss";

interface PatientsSearchFiltersProps {
  searchTerm: string;
  genderFilter: GenderFilter;
  dateFrom: string;
  dateTo: string;
  showFilters: boolean;
  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onToggleFilters: () => void;
  onGenderFilterChange: (value: GenderFilter) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onResetFilters: () => void;
}

export const PatientsSearchFilters: React.FC<PatientsSearchFiltersProps> = ({
  searchTerm,
  genderFilter,
  dateFrom,
  dateTo,
  showFilters,
  hasActiveFilters,
  onSearchChange,
  onClearSearch,
  onToggleFilters,
  onGenderFilterChange,
  onDateFromChange,
  onDateToChange,
  onResetFilters,
}) => {
  return (
    <>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Поиск по ФИО..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className={styles.searchInput}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={onClearSearch}
              className={styles.clearButton}
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>

        <Button
          onClick={onToggleFilters}
          variant={hasActiveFilters ? "primary" : "secondary"}
          className={styles.filterToggleButton}
        >
          {showFilters ? "Скрыть фильтры" : "Фильтры"}

          {hasActiveFilters && <span className={styles.filterBadge}>●</span>}
        </Button>
      </div>

      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Пол:</label>

            <select
              value={genderFilter}
              onChange={(event) =>
                onGenderFilterChange(event.target.value as GenderFilter)
              }
              className={styles.filterSelect}
            >
              <option value="">Все</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <DateInput
              label="Дата рождения от:"
              value={dateFrom}
              onChange={onDateFromChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <DateInput label="до:" value={dateTo} onChange={onDateToChange} />
          </div>

          <Button onClick={onResetFilters} variant="secondary">
            Сбросить
          </Button>
        </div>
      )}
    </>
  );
};
