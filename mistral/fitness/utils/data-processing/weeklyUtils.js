// Weekly analysis utilities
import { formatTime } from "./timeUtils.js";
import { getHighIntensityTime, isHardSession } from "./trainingUtils.js";

export const groupActivitiesByWeek = (activities) => {
  return activities.reduce((weeks, activity) => {
    const weekStart = activity.weekStart;
    if (!weeks[weekStart]) {
      weeks[weekStart] = [];
    }
    weeks[weekStart].push(activity);
    return weeks;
  }, {});
};

export const createWeeklySummaries = (activitiesByWeek) => {
  return Object.entries(activitiesByWeek)
    .map(([weekStart, activities]) => {
      const totalTrainingLoad = activities.reduce(
        (sum, a) => sum + (a.training_load || 0),
        0,
      );
      const totalMovingTime = activities.reduce(
        (sum, a) => sum + (a.moving_time_seconds || 0),
        0,
      );
      const totalHighIntensityTime = activities.reduce(
        (sum, a) => sum + getHighIntensityTime(a),
        0,
      );
      const hardSessions = activities.filter(isHardSession);

      // Calculate sport breakdown
      const sportBreakdown = activities.reduce((breakdown, activity) => {
        const sport =
          activity.type === "Ride" || activity.type === "VirtualRide"
            ? "Bike"
            : activity.type === "Run"
              ? "Run"
              : "Other";

        if (!breakdown[sport]) {
          breakdown[sport] = {
            sessions: 0,
            totalTime: 0,
            totalLoad: 0,
            hardSessions: 0,
          };
        }

        breakdown[sport].sessions += 1;
        breakdown[sport].totalTime += activity.moving_time_seconds || 0;
        breakdown[sport].totalLoad += activity.training_load || 0;
        if (isHardSession(activity)) {
          breakdown[sport].hardSessions += 1;
        }

        return breakdown;
      }, {});

      return {
        weekStart,
        weekEnd: new Date(
          new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        totalSessions: activities.length,
        totalTrainingLoad: Math.round(totalTrainingLoad),
        totalMovingTime: formatTime(totalMovingTime),
        totalMovingTimeSeconds: totalMovingTime,
        totalHighIntensityTime: formatTime(totalHighIntensityTime),
        totalHighIntensityTimeSeconds: totalHighIntensityTime,
        highIntensityPercentage:
          totalMovingTime > 0
            ? Math.round((totalHighIntensityTime / totalMovingTime) * 100)
            : 0,
        hardSessions: hardSessions.length,
        hardSessionDates: hardSessions.map((s) => s.date),
        sportBreakdown,
        activities: activities.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        ),
      };
    })
    .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart));
};
