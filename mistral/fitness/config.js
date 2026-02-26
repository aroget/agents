export const config = {
  model: "mistral-large-latest",
  profile: {
    bio: {
      age: 41,
      weight: 78,
      primary_sport: "cycling | running | triathlon",
      experience_level: "intermediate",
      training_phase: "build",
      rest_days_per_week: 1,
      longest_run_session: "80 minutes",
      longest_bike_session: "180 minutes",
      training_structure_preference:
        "polarized (80/20) with 3 weeks build, 1 week recovery microcycle",
      main_goal:
        "FTP improvement, overcome a 250w plateau, reach 270w in 6 months. PB half marathon in  under 1 hour 43 minutes",
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
