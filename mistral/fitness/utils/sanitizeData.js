// Import utility functions
import { formatTime, getMondayOfWeek } from "./data-processing/timeUtils.js";
import {
  calculateRollingAverage,
  calculateStdDev,
  calculateTrend,
} from "./data-processing/statisticsUtils.js";
import {
  detectSignificantDrops,
  detectSignificantIncreases,
} from "./data-processing/patternUtils.js";
import {
  groupActivitiesByWeek,
  createWeeklySummaries,
} from "./data-processing/weeklyUtils.js";
import { isRecoveryWeek } from "./isRecoveryWeek.js";

export const sanitizeData = (data) => {
  const sanitizedWellness = data.wellness.map((w) => ({
    date: w.id,
    ctl: w.ctl,
    atl: w.atl,
    ctlLoad: w.ctlLoad,
    atlLoad: w.atlLoad,
    trainingStressBalance: w.tsb,
    restingHR: w.restingHR,
    hrv: w.hrv,
    sleepTime: formatTime(w.sleepSecs),
    sleepScore: w.sleepScore,
  }));

  const hrv7Avg = calculateRollingAverage(sanitizedWellness, "hrv", 7);
  const hrv7Recent = sanitizedWellness
    .slice(-7)
    .filter((w) => w.hrv != null)
    .map((w) => w.hrv);
  const hrv7Sd = hrv7Avg ? calculateStdDev(hrv7Recent, hrv7Avg) : null;

  // Calculate wellness analytics
  const wellnessAnalytics = {
    standardDeviations: {
      hrv: {
        day7: hrv7Sd,
        day14: (() => {
          const recent = sanitizedWellness
            .slice(-14)
            .filter((w) => w.hrv != null)
            .map((w) => w.hrv);
          const avg = calculateRollingAverage(sanitizedWellness, "hrv", 14);
          return avg ? calculateStdDev(recent, avg) : null;
        })(),
      },
      restingHR: {
        day7: (() => {
          const recent = sanitizedWellness
            .slice(-7)
            .filter((w) => w.restingHR != null)
            .map((w) => w.restingHR);
          const avg = calculateRollingAverage(
            sanitizedWellness,
            "restingHR",
            7,
          );
          return avg ? calculateStdDev(recent, avg) : null;
        })(),
        day14: (() => {
          const recent = sanitizedWellness
            .slice(-14)
            .filter((w) => w.restingHR != null)
            .map((w) => w.restingHR);
          const avg = calculateRollingAverage(
            sanitizedWellness,
            "restingHR",
            14,
          );
          return avg ? calculateStdDev(recent, avg) : null;
        })(),
      },
      sleepScore: {
        day7: (() => {
          const recent = sanitizedWellness
            .slice(-7)
            .filter((w) => w.sleepScore != null)
            .map((w) => w.sleepScore);
          const avg = calculateRollingAverage(
            sanitizedWellness,
            "sleepScore",
            7,
          );
          return avg ? calculateStdDev(recent, avg) : null;
        })(),
        day14: (() => {
          const recent = sanitizedWellness
            .slice(-14)
            .filter((w) => w.sleepScore != null)
            .map((w) => w.sleepScore);
          const avg = calculateRollingAverage(
            sanitizedWellness,
            "sleepScore",
            14,
          );
          return avg ? calculateStdDev(recent, avg) : null;
        })(),
      },
    },

    rollingAverages: {
      hrv: {
        day7: hrv7Avg,
        day14: calculateRollingAverage(sanitizedWellness, "hrv", 14),
        cv7: hrv7Avg && hrv7Sd ? (hrv7Sd / hrv7Avg).toFixed(3) : null,
      },
      restingHR: {
        day7: calculateRollingAverage(sanitizedWellness, "restingHR", 7),
        day14: calculateRollingAverage(sanitizedWellness, "restingHR", 14),
      },
      sleepScore: {
        day7: calculateRollingAverage(sanitizedWellness, "sleepScore", 7),
        day14: calculateRollingAverage(sanitizedWellness, "sleepScore", 14),
      },
    },

    trends: {
      hrv: {
        threeDaySlope: calculateTrend(sanitizedWellness, "hrv", 3),
        sevenDaySlope: calculateTrend(sanitizedWellness, "hrv", 7),
        fourteenDaySlope: calculateTrend(sanitizedWellness, "hrv", 14),
      },
      restingHR: {
        threeDaySlope: calculateTrend(sanitizedWellness, "restingHR", 3),
        sevenDaySlope: calculateTrend(sanitizedWellness, "restingHR", 7),
        fourteenDaySlope: calculateTrend(sanitizedWellness, "restingHR", 14),
      },
      sleepScore: {
        threeDaySlope: calculateTrend(sanitizedWellness, "sleepScore", 3),
        sevenDaySlope: calculateTrend(sanitizedWellness, "sleepScore", 7),
        fourteenDaySlope: calculateTrend(sanitizedWellness, "sleepScore", 14),
      },
    },

    patterns: {
      hrvDrops: detectSignificantDrops(sanitizedWellness, "hrv"),
      rhrSpikes: detectSignificantIncreases(sanitizedWellness, "restingHR"),
      sleepDeclines: detectSignificantDrops(sanitizedWellness, "sleepScore"),
    },

    dataQuality: {
      totalDays: sanitizedWellness.length,
      hrvCompleteness:
        sanitizedWellness.filter((w) => w.hrv != null).length /
        sanitizedWellness.length,
      rhrCompleteness:
        sanitizedWellness.filter((w) => w.restingHR != null).length /
        sanitizedWellness.length,
      sleepCompleteness:
        sanitizedWellness.filter((w) => w.sleepScore != null).length /
        sanitizedWellness.length,
    },
  };

  // Add current deviations if we have current data
  if (sanitizedWellness.length > 0) {
    const latest = sanitizedWellness[sanitizedWellness.length - 1];

    wellnessAnalytics.currentDeviations = {
      hrv: {
        percentFromWeekly: hrv7Avg
          ? (((latest.hrv - hrv7Avg) / hrv7Avg) * 100).toFixed(1)
          : null,
        zScore:
          hrv7Avg && hrv7Sd
            ? ((latest.hrv - hrv7Avg) / hrv7Sd).toFixed(2)
            : null,
        fromBiweekly: wellnessAnalytics.rollingAverages.hrv.day14
          ? (
              ((latest.hrv - wellnessAnalytics.rollingAverages.hrv.day14) /
                wellnessAnalytics.rollingAverages.hrv.day14) *
              100
            ).toFixed(1)
          : null,
      },
      restingHR: {
        percentFromWeekly: wellnessAnalytics.rollingAverages.restingHR.day7
          ? (
              ((latest.restingHR -
                wellnessAnalytics.rollingAverages.restingHR.day7) /
                wellnessAnalytics.rollingAverages.restingHR.day7) *
              100
            ).toFixed(1)
          : null,
        zScore:
          wellnessAnalytics.rollingAverages.restingHR.day7 &&
          wellnessAnalytics.standardDeviations.restingHR.day7
            ? (
                (latest.restingHR -
                  wellnessAnalytics.rollingAverages.restingHR.day7) /
                wellnessAnalytics.standardDeviations.restingHR.day7
              ).toFixed(2)
            : null,
        fromBiweekly: wellnessAnalytics.rollingAverages.restingHR.day14
          ? (
              ((latest.restingHR -
                wellnessAnalytics.rollingAverages.restingHR.day14) /
                wellnessAnalytics.rollingAverages.restingHR.day14) *
              100
            ).toFixed(1)
          : null,
      },
    };
  }

  const sanitizedActivities = data.activities.map((a) => ({
    id: a.id,
    date: a.start_date_local.split("T")[0],
    type: a.type,
    atl: a.icu_atl,
    ctl: a.icu_ctl,
    distance: a.distance,
    gap: a.gap,
    hrr: a.icu_hrr,
    gap_zone_times: a.gap_zone_times,
    moving_time: formatTime(a.moving_time),
    max_heartrate: a.max_heartrate,
    average_heartrate: a.average_heartrate,
    average_cadence: a.average_cadence,
    average_temp: a.average_temp,
    hr_zone_times_seconds: a.icu_hr_zone_times,
    pace_zone_times: a.pace_zone_times,
    joules: a.icu_joules,
    threshold_pace_meters_per_second: a.threshold_pace,
    zone_times: a.icu_zone_times,
    decoupling: a.decoupling,
    interval_summary: a.interval_summary,
    efficiency_factor: a.icu_efficiency_factor,
    training_load: a.icu_training_load,
    intensity: a.icu_intensity,
    average_watts: a.icu_average_watts,
    weighted_avg_watts: a.icu_weighted_avg_watts,
    coachNotes: a.coachNotes,
    moving_time_seconds: a.moving_time, // Keep raw seconds for calculations
    weekStart: getMondayOfWeek(a.start_date_local.split("T")[0]), // Add week grouping
  }));

  // Group activities by week and create summaries
  const activitiesByWeek = groupActivitiesByWeek(sanitizedActivities);
  const weeklySummaries = createWeeklySummaries(activitiesByWeek);
  const currentWeekSummary =
    weeklySummaries.length > 0
      ? weeklySummaries[weeklySummaries.length - 1]
      : null;

  const weeklyPhases = Object.fromEntries(
    weeklySummaries.map((week) => [
      week.weekStart,
      isRecoveryWeek(week.weekStart) ? "recovery" : "load",
    ]),
  );

  const averageMetric = (entries, metric) => {
    const values = entries
      .map((entry) => entry[metric])
      .filter((v) => v != null);
    if (values.length === 0) return null;
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    return Number(avg.toFixed(2));
  };

  const buildPhaseAverages = (entries) => ({
    entries: entries.length,
    hrvAvg: averageMetric(entries, "hrv"),
    rhrAvg: averageMetric(entries, "restingHR"),
    sleepScoreAvg: averageMetric(entries, "sleepScore"),
  });

  const loadWeekWellness = sanitizedWellness.filter((entry) => {
    const weekStart = getMondayOfWeek(entry.date);
    return weeklyPhases[weekStart] === "load";
  });

  const recoveryWeekWellness = sanitizedWellness.filter((entry) => {
    const weekStart = getMondayOfWeek(entry.date);
    return weeklyPhases[weekStart] === "recovery";
  });

  wellnessAnalytics.phaseAverages = {
    load: buildPhaseAverages(loadWeekWellness),
    recovery: buildPhaseAverages(recoveryWeekWellness),
  };

  return {
    wellness: sanitizedWellness,
    wellnessAnalytics,
    weeklySummaries,
    currentWeekSummary,
    weeklyPhases,
    activities: sanitizedActivities,
  };
};
