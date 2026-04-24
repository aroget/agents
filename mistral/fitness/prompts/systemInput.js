export const systemInput = `
Below a list of inputs you may receive a stringified JSON object containing:

{{sports}}: Array of sports the athlete trains (e.g., ["running", "cycling"]). Each strategy agent must produce one suggestion per sport in this list. Use this instead of profile.bio.primary_sport.

{{profile}}: The athlete's profile with key details about their training history, weaknesses, and goals. Key nested paths:
  - {{profile}}.physiological_zones — HR, FTP, threshold pace and HRV baseline
  - {{profile}}.training.max_weekly_hours — weekly volume ceiling
  - {{profile}}.training.training_phase — current season phase (BASE, BUILD, PEAK)

{{trainingLog}}.wellness: Daily wellness entries (HRV, RHR, sleep score, CTL, ATL, TSB) for each day in the analysis range.

{{trainingLog}}.wellnessAnalytics: Pre-computed analytics over the wellness data including rolling averages, standard deviations, trend slopes, pattern detection (drops/spikes), data quality metrics, current deviations, and phase-segmented biomarker averages in {{trainingLog}}.wellnessAnalytics.phaseAverages (load vs recovery). Use these pre-computed values rather than re-deriving them from raw wellness entries.

{{trainingLog}}.weeklySummaries: Weekly training summaries grouped by Monday-start week, containing session counts, total training load, moving time, high-intensity time percentages, hard session counts, sport breakdowns (Bike/Run/Other), and chronologically sorted activities for each week.

{{trainingLog}}.activities: A sanitized log of all individual training sessions in the analysis window. Each entry includes date, sport type, training load, zone times, HR, power/pace, efficiency factor, decoupling, and coachNotes. Missing dates between {{today}} and the earliest wellness entry should be treated as rest days.

{{currentWeekSummary}}: Pre-computed summary of the current Monday-to-today training week. Contains totalMovingTimeSeconds, highIntensityPercentage, hardSessions, and sport breakdowns. Use this for fast weekly distribution compliance checks rather than re-scanning weeklySummaries.

{{athleteSummary}}: A snapshot of the athlete's most recent vitals and 14-day baselines (HRV, RHR, CTL, ATL, ramp rate). Use for quick readiness context.

{{weeklyPhases}}: An object keyed by week-start date (Monday, YYYY-MM-DD) mapping each week in the analysis window to either \`"load"\` or \`"recovery"\`. Provided to the wellness agent to enable accurate phase-split biomarker comparisons without requiring the model to infer cycle position.

{{isWeekend}}: A boolean indicating if today is a weekend, which may influence training volume decisions.

{{isRecoveryWeek}}: A boolean (pre-computed) indicating whether the current week is a recovery week in the periodization cycle. Do not attempt to infer this yourself.

{{strategy}}: The analysis done by the strategy agent (polarized or pyramidal), providing specific workout suggestions for each sport in the athlete's profile, including duration, intensity targets, and structured workout code.

{{wellness}}: The analysis done by the wellness agent (wellnessResponseSchema), including the status indicator (GREEN/YELLOW/RED stoplight), load analysis, readiness metrics, biomarker trends, and recovery week response.

{{today}}: Current date (YYYY-MM-DD). Use this to anchor all temporal analysis — determining yesterday's workout, last night's recovery data, and the current week position.

{{yesterday}}: Yesterday's date (YYYY-MM-DD). Use this to look up the most recent workout and its impact on today's wellness metrics.

`;
