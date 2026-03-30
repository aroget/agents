// Statistical calculation utilities

export const calculateRollingAverage = (data, field, days) => {
  if (data.length < days) return null;
  const recent = data.slice(-days);
  const validValues = recent
    .filter((d) => d[field] != null)
    .map((d) => d[field]);
  if (validValues.length === 0) return null;
  return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
};

export const calculateStdDev = (values, mean) => {
  if (values.length < 2) return 0;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
};

export const calculateTrend = (data, field, days) => {
  if (data.length < days) return 0;
  const recent = data.slice(-days).filter((d) => d[field] != null);
  if (recent.length < 2) return 0;

  const values = recent.map((d) => d[field]);
  const n = values.length;
  const sumX = (n * (n - 1)) / 2; // 0 + 1 + 2 + ... + (n-1)
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = values.reduce((sum, val, idx) => sum + idx * val, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope || 0;
};
