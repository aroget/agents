// Training analysis utilities

export const getHighIntensityTime = (activity) => {
  if (!activity.hr_zone_times_seconds) return 0;
  const zones = Array.isArray(activity.hr_zone_times_seconds)
    ? activity.hr_zone_times_seconds
    : Object.values(activity.hr_zone_times_seconds);

  // Zones 4, 5 (indices 3, 4) are considered high intensity
  return (zones[3] || 0) + (zones[4] || 0);
};

export const isHardSession = (activity) => {
  const highIntensityTime = getHighIntensityTime(activity);
  const highIntensityThreshold = 10 * 60; // 10 minutes in seconds
  const highTrainingLoadThreshold = 60; // TSS threshold

  return (
    highIntensityTime > highIntensityThreshold ||
    (activity.training_load &&
      activity.training_load > highTrainingLoadThreshold)
  );
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
