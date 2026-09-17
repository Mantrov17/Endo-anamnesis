import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteAnamnesis,
  deletePatient,
  getAllPatients,
  type AnamnesisRecord,
  type Patient,
} from "@/shared";

import { Button } from "@/shared/ui/Button";
import { DateInput } from "@/shared/ui/DateInput/DateInput.tsx";
import { Heading } from "@/shared/ui/Heading";

import styles from "./styles.module.scss";

const getAge = (birthDate: string): string => {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 0) {
    return "0 лет";
  }

  const lastDigit = age % 10;
  const lastTwo = age % 100;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return `${age} лет`;
  }

  if (lastDigit === 1) {
    return `${age} год`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`;
  }

  return `${age} лет`;
};

export const PatientsListPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(getAllPatients);

  const [searchTerm, setSearchTerm] = useState("");

  const [genderFilter, setGenderFilter] = useState<"" | "male" | "female">("");

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(
    new Set(),
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState<"createdAt" | "alphabet">("createdAt");

  const navigate = useNavigate();

  const filteredPatients = useMemo(() => {
    let result = patients;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();

      result = result.filter((patient) =>
        patient.fullName.toLowerCase().includes(lower),
      );
    }

    if (genderFilter) {
      result = result.filter((patient) => patient.gender === genderFilter);
    }

    if (dateFrom) {
      result = result.filter((patient) => patient.birthDate >= dateFrom);
    }

    if (dateTo) {
      result = result.filter((patient) => patient.birthDate <= dateTo);
    }

    if (sortBy === "createdAt") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      result = [...result].sort((a, b) => a.fullName.localeCompare(b.fullName));
    }

    return result;
  }, [patients, searchTerm, genderFilter, dateFrom, dateTo, sortBy]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredPatients.slice(start, start + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  const hasActiveFilters =
    genderFilter !== "" || dateFrom !== "" || dateTo !== "";

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

  const handleDeletePatient = (id: string) => {
    if (window.confirm("Удалить пациента и все его анамнезы?")) {
      const success = deletePatient(id);

      if (success) {
        setPatients(getAllPatients());
      }
    }
  };

  const handleDeleteAnamnesis = (patientId: string, anamnesisId: string) => {
    if (window.confirm("Удалить этот анамнез?")) {
      const success = deleteAnamnesis(patientId, anamnesisId);

      if (success) {
        setPatients(getAllPatients());
      }
    }
  };

  const handleAddAnamnesis = (patientId: string) => {
    navigate(`/patient/${patientId}/anamnesis`);
  };

  const handleEditAnamnesis = (patientId: string, anamnesisId: string) => {
    navigate(`/patient/${patientId}/anamnesis/${anamnesisId}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
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

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(event.target.value));

    setCurrentPage(1);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as "createdAt" | "alphabet");

    setCurrentPage(1);
  };

  const handleDownloadBackup = () => {
    const data = getAllPatients();

    if (data.length === 0) {
      alert("Нет данных для бэкапа");
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

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Heading level={1} variant="page" className={styles.pageTitle}>
          Пациенты
        </Heading>

        <div className={styles.headerButtons}>
          <Button onClick={() => navigate("/patient/new")} variant="primary">
            + Добавить пациента
          </Button>

          <Button onClick={handleDownloadBackup} variant="secondary">
            💾 Скачать бэкап
          </Button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Поиск по ФИО..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className={styles.clearButton}
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>

        <Button
          onClick={toggleFilters}
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
              onChange={(event) => {
                setGenderFilter(event.target.value as "" | "male" | "female");

                setCurrentPage(1);
              }}
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
              onChange={(iso) => {
                setDateFrom(iso);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className={styles.filterGroup}>
            <DateInput
              label="до:"
              value={dateTo}
              onChange={(iso) => {
                setDateTo(iso);
                setCurrentPage(1);
              }}
            />
          </div>

          <Button onClick={resetFilters} variant="secondary">
            Сбросить
          </Button>
        </div>
      )}

      <div className={styles.stats}>
        <span className={styles.statsText}>
          Найдено: {filteredPatients.length} пациентов
          {patients.length > 0 && ` (всего ${patients.length})`}
          {hasActiveFilters && " • фильтры активны"}
        </span>

        <div className={styles.controls}>
          <div className={styles.sortSelector}>
            <label>Сортировка:</label>

            <select value={sortBy} onChange={handleSortChange}>
              <option value="createdAt">По дате добавления</option>

              <option value="alphabet">По алфавиту</option>
            </select>
          </div>

          <div className={styles.perPageSelector}>
            <label>Элементов:</label>

            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className={styles.empty}>
          {searchTerm || hasActiveFilters
            ? "Ничего не найдено по заданным критериям"
            : "Нет пациентов. Создайте первого!"}
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {paginatedPatients.map((patient) => {
              const isExpanded = expandedPatients.has(patient.id);

              const age = getAge(patient.birthDate);

              const createdDateTime = new Date(
                patient.createdAt,
              ).toLocaleString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <article key={patient.id} className={styles.card}>
                  <div
                    className={styles.cardHeader}
                    onClick={() => togglePatientExpand(patient.id)}
                  >
                    <div className={styles.patientSummary}>
                      <span className={styles.expandIcon} aria-hidden="true">
                        {isExpanded ? "▼" : "▶"}
                      </span>

                      <Heading
                        level={2}
                        variant="card"
                        className={styles.patientName}
                      >
                        {patient.fullName}
                      </Heading>

                      <span className={styles.patientMeta}>
                        {patient.birthDate} ({age}) •{" "}
                        {patient.gender === "male" ? "М" : "Ж"}
                      </span>

                      <span className={styles.anamnesisCount}>
                        Записей: {patient.anamneses.length}
                      </span>

                      <span className={styles.createdAtMeta}>
                        Добавлен: {createdDateTime}
                      </span>
                    </div>

                    <div
                      className={styles.patientActions}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.anamnesesSection}>
                      <div className={styles.anamnesesHeader}>
                        <Heading
                          level={3}
                          variant="subsection"
                          className={styles.anamnesesTitle}
                        >
                          Анамнезы
                        </Heading>

                        <Button
                          variant="primary"
                          onClick={(event) => {
                            event.stopPropagation();

                            handleAddAnamnesis(patient.id);
                          }}
                        >
                          + Добавить анамнез
                        </Button>
                      </div>

                      {patient.anamneses.length === 0 ? (
                        <p className={styles.noAnamnesis}>Нет анамнезов</p>
                      ) : (
                        <div className={styles.anamnesisList}>
                          {patient.anamneses.map((anam: AnamnesisRecord) => (
                            <div key={anam.id} className={styles.anamnesisItem}>
                              <div className={styles.anamnesisInfo}>
                                <strong>
                                  Анамнез от{" "}
                                  {new Date(anam.savedAt).toLocaleDateString()}
                                </strong>

                                <span>
                                  Создан:{" "}
                                  {new Date(anam.savedAt).toLocaleString()}
                                </span>
                              </div>

                              <div className={styles.anamnesisActions}>
                                <Button
                                  variant="secondary"
                                  onClick={(event) => {
                                    event.stopPropagation();

                                    handleEditAnamnesis(patient.id, anam.id);
                                  }}
                                >
                                  Редактировать
                                </Button>

                                <Button
                                  variant="danger"
                                  onClick={(event) => {
                                    event.stopPropagation();

                                    handleDeleteAnamnesis(patient.id, anam.id);
                                  }}
                                >
                                  Удалить
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.active : ""
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};
