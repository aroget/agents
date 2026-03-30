// Time formatting utilities

export const formatTime = (totalSeconds) => {
  if (!totalSeconds) return "00:00";
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  return `${hrs.toString()}h ${mins.toString().padStart(2, "0")}m`;
};

export const getMondayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split("T")[0];
};
