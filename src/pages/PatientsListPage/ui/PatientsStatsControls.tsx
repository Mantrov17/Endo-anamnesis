import React from "react";

import type { PatientsSortBy } from "../lib/patientsList";

import styles from "../styles.module.scss";

interface PatientsStatsControlsProps {
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  sortBy: PatientsSortBy;
  itemsPerPage: number;

  onSortChange: (value: PatientsSortBy) => void;
  onItemsPerPageChange: (value: number) => void;
}

export const PatientsStatsControls: React.FC<PatientsStatsControlsProps> = ({
  filteredCount,
  totalCount,
  hasActiveFilters,
  sortBy,
  itemsPerPage,
  onSortChange,
  onItemsPerPageChange,
}) => {
  return (
    <div className={styles.stats}>
      <span className={styles.statsText}>
        Найдено: {filteredCount} пациентов
        {totalCount > 0 && ` (всего ${totalCount})`}
        {hasActiveFilters && " • фильтры активны"}
      </span>

      <div className={styles.controls}>
        <div className={styles.sortSelector}>
          <label>Сортировка:</label>

          <select
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as PatientsSortBy)
            }
          >
            <option value="createdAt">По дате добавления</option>

            <option value="alphabet">По алфавиту</option>
          </select>
        </div>

        <div className={styles.perPageSelector}>
          <label>Элементов:</label>

          <select
            value={itemsPerPage}
            onChange={(event) =>
              onItemsPerPageChange(Number(event.target.value))
            }
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};
