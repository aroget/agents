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

export const detectSignificantIncreases = (
  data,
  key,
  threshold = 0.1,
  window = 7,
) => {
  const spikes = [];

  for (let i = window; i < data.length; i++) {
    const currentVal = data[i][key];

    // Get the previous 'window' days for the baseline
    const baselinePeriod = data
      .slice(i - window, i)
      .filter((d) => d[key] != null);

    if (baselinePeriod.length < window / 2 || currentVal == null) continue;

    const avg =
      baselinePeriod.reduce((sum, d) => sum + d[key], 0) /
      baselinePeriod.length;
    const percentIncrease = (currentVal - avg) / avg;

    if (percentIncrease >= threshold) {
      spikes.push({
        date: data[i].date,
        value: currentVal,
        baseline: avg.toFixed(1),
        increase: (percentIncrease * 100).toFixed(1) + "%",
      });
    }
  }

  return spikes;
};
