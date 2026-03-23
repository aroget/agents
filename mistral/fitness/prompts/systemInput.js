export const systemInput = `
You will receive a stringified JSON object containing:

{{profile}}: The athlete's profile with key details about their training history, weaknesses, and goals.

{{wellness}}: Insights on HRV, sleep, and recovery status.

{{isWeekend}} : A boolean indicating if today is a weekend, which may influence training decisions.

{{strategy}}: An array of potential workouts (e.g., Run, Bike) for the day.

{{trainingLog}}: A detailed log of the athletes training history for a given {{range}} of dates, it includes wellness data and training sessions. There should be entries for each day in the range, however for the activities there may be missing entries meaning, treat those as rest days.

{{today}} Today, this is critical for interpreting the wellness data and training log in the correct temporal context. Always use this date to determine "yesterday's workout" and "last night's recovery" when analyzing the data.

{{yesterday}} Yesterday, this is critical for analyzing "yesterday's workout" and its impact on today's wellness metrics. Always reference this date when determining if the athlete had a workout or rest day yesterday, which directly influences today's prescription.

{{range}} Date Range: including today's date and the last days of training history. {{trainingLog}}, any missing dates should be treated as rest days.
`;
