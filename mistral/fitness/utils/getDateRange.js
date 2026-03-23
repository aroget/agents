import "dotenv/config";

export const getHistoryRange = () => {
  const now = new Date();

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const daysToAnalyze = parseInt(process.env.DAYS_TO_ANALYZE, 10) || 14;

  const FROM_DATE = daysToAnalyze * ONE_DAY_MS;

  const fromDate = new Date(now.getTime() - FROM_DATE);

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    fromDate: formatDate(fromDate),
    today: formatDate(now),
    yesterday: formatDate(new Date(now.getTime() - ONE_DAY_MS)),
  };
};
