// Pattern detection utilities
import { calculateRollingAverage } from "./statisticsUtils.js";

export const detectSignificantDrops = (data, field, threshold = 0.15) => {
  const drops = [];
  for (let i = 7; i < data.length; i++) {
    if (data[i][field] == null || data[i - 7][field] == null) continue;

    const weeklyAvg = calculateRollingAverage(data.slice(i - 7, i), field, 7);
    const currentValue = data[i][field];

    if (weeklyAvg && (weeklyAvg - currentValue) / weeklyAvg > threshold) {
      drops.push({
        date: data[i].date,
        magnitude: (((weeklyAvg - currentValue) / weeklyAvg) * 100).toFixed(1),
        daysAgo: data.length - 1 - i,
      });
    }
  }
  return drops;
};
