export const sanitizeData = (data) => {
  // Helper to convert seconds to HH:MM format
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "00:00";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs.toString()}h ${mins.toString().padStart(2, "0")}m`;
  };

  const sanitizedWellness = data.wellness.map((w) => ({
    date: w.id,
    ctl: w.ctl,
    atl: w.atl,
    ctlLoad: w.ctlLoad,
    atlLoad: w.atlLoad,
    restingHR: w.restingHR,
    hrv: w.hrv,
    // Rename sleepScore to sleepTime and convert seconds to HH:MM
    sleepTime: formatTime(w.sleepSecs),
    sleepScore: w.sleepScore,
  }));

  const sanitizedActivities = data.activities.map((a) => ({
    id: a.id,
    // Extract only the YYYY-MM-DD part of the ISO string
    date: a.start_date_local.split("T")[0],
    type: a.type,
    atl: a.icu_atl,
    ctl: a.icu_ctl,
    moving_time: formatTime(a.moving_time),
    max_heartrate: a.max_heartrate,
    average_heartrate: a.average_heartrate,
    average_cadence: a.average_cadence,
    average_temp: a.average_temp,
    hr_zone_times: a.icu_hr_zone_times,
    pace_zone_times: a.pace_zone_times,
    joules: a.icu_joules,
    zone_times: a.icu_zone_times,
    decoupling: a.decoupling,
    efficiency_factor: a.icu_efficiency_factor,
    training_load: a.icu_training_load,
  }));

  return {
    wellness: sanitizedWellness,
    activities: sanitizedActivities,
  };
};
