export const config = {
  model: "mistral-large-latest",
  cycleStartDate: "2026-04-06", // Monday that begins the current 4-week cycle (3 load + 1 recovery)
  profile: {
    bio: {
      age: 41,
      weight: 78,
      primary_sport: "running",
      experience_level: "intermediate",
      description:
        "Interested in improving FTP and running threshold pace. Has a history of overtraining and is cautious about fatigue management. Main events, half marathons and 100km Gran Fondo occasionally a 70.3 triathlon.",
      main_goal:
        "FTP improvement, overcome a 250w plateau, reach 270w by September 2026. PB half marathon in  under 1 hour 43 minutes",
    },
    training: {
      max_weekly_hours: 10,
      rest_days_per_week: 1,
      training_phase: "build",
      longest_run_session: "80 minutes",
      longest_bike_session: "180 minutes",
    },
    maintenance_logic: {
      max_days_between_runs: 2,
      max_days_between_rides: 2,
      injury_history: "None",
    },
    physiological_zones: {
      max_hr: 188,
      hrv_baseline: 80,
      rhr_baseline: 49,
      cycling_ftp_watts: 250,
      running_threshold_pace: "04:55 min/km",
    },
  },
};
