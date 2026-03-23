export const isWeekend = (dateInput) => {
  // If no date is passed, use the current date
  const date = dateInput ? new Date(dateInput) : new Date();

  const day = date.getDay();

  // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
};
