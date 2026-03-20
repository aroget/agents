export const getHistoryRange = () => {
  const now = new Date();

  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

  const twoWeeksAgo = new Date(now.getTime() - TWO_WEEKS_MS);

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    twoWeeksAgo: formatDate(twoWeeksAgo),
    today: formatDate(now),
  };
};
