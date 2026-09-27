export const getTodayLocalDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDiaryTitle = (date: string): string => {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return "Дневник";
  }

  return `Дневник от ${day}.${month}.${year} г`;
};
