// Training analysis utilities

export const getHighIntensityTime = (activity) => {
  if (!activity.hr_zone_times_seconds) return 0;
  const zones = Array.isArray(activity.hr_zone_times_seconds)
    ? activity.hr_zone_times_seconds
    : Object.values(activity.hr_zone_times_seconds);

  // Zones 3, 4, 5 (indices 2, 3, 4) are considered high intensity
  return (zones[2] || 0) + (zones[3] || 0) + (zones[4] || 0);
};

export const isHardSession = (activity) => {
  const highIntensityTime = getHighIntensityTime(activity);
  const totalMovingTime = activity.moving_time_seconds || 0;
  const highIntensityThreshold = 10 * 60; // 10 minutes in seconds
  const highIntensityRatioThreshold = 0.15; // 15% of session in high HR zones

  // A session is hard if it has meaningful time in high HR zones (absolute OR relative).
  // Avoids misclassifying long base sessions (high TSS, no intensity) as hard,
  // while correctly catching short hard sessions (low TSS, high HR zone time).
  const absoluteCheck = highIntensityTime > highIntensityThreshold;
  const ratioCheck =
    totalMovingTime > 0 &&
    highIntensityTime / totalMovingTime > highIntensityRatioThreshold;

  return absoluteCheck || ratioCheck;
};

export const sumZoneTimes = (activities, zoneField) => {
  return activities.reduce((total, activity) => {
    if (!activity[zoneField]) return total;
    const zones = Array.isArray(activity[zoneField])
      ? activity[zoneField]
      : Object.values(activity[zoneField]);
    return total + zones.reduce((sum, time) => sum + (time || 0), 0);
  }, 0);
};
