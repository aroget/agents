export const systemInput = `
Below a list of inputs you may receive a stringified JSON object containing:

{{profile}}: The athlete's profile with key details about their training history, weaknesses, and goals.

{{trainingLog}}.wellness: The analysis done by the wellness agent, including the status indicator (Stoplight), load analysis, and readiness metrics.

{{trainingLog}}.weeklySummaries: Weekly training summaries grouped by week, containing session counts, total training load, moving time, high-intensity time percentages, hard session counts, sport breakdowns (Bike/Run/Other), and chronologically sorted activities for each week

{{isWeekend}} : A boolean indicating if today is a weekend, which may influence training decisions.

{{strategy}}: The analysis done by the polarized training agent, providing specific workout suggestions for both Run and Bike disciplines, including duration, intensity, and structure.

{{trainingLog}}.activities: A detailed log of the athlete's training history for a given {{range}} of dates, including wellness data and training sessions. There should be entries for each day in the range; however, for the activities, there may be missing entries, which should be treated as rest days.

{{today}} Current date for temporal context, this is critical for interpreting the wellness data and training log in the correct temporal context. Always use this date to determine "yesterday's workout" and "last night's recovery" when analyzing the data.

{{yesterday}} Yesterday, this is critical for analyzing "yesterday's workout" and its impact on today's wellness metrics. Always reference this date when determining if the athlete had a workout or rest day yesterday, which directly influences today's prescription.

{{range}} Date Range: including today's date and the last days of training history. {{trainingLog}}, any missing dates should be treated as rest days.
`;
