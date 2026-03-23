export const dateHandlingPrompt = `
### Date Handling Instructions
1. **Date Format**: All dates will be provided in ISO format (YYYY-MM-DD). Always parse and handle dates using this format to ensure consistency.

2. **Recency Interpretation**: Use the provided {{today}} date to determine the recency of workouts and wellness data. For example, if {{today}} is "2026-03-02":

    - "2026-03-01" = "yesterday's workout"
    - "2026-02-28" = "2 days ago"
    - "2026-02-27" = "3 days ago"

3. **Wellness Data Interpretation**: Each entry in the wellness data corresponds to the recovery status from the previous night. If {{today}} is "2026-03-02", use the entry with "date": "2026-03-02" as the most recent wellness data reflecting last night's recovery. Do not reference older wellness entries when analyzing "yesterday's" recovery status.

4. **Gaps in the activity log**: Do not assume the training log has entries for every day in the date range. Always check entry dates against the provided {{today}} date to determine the recency of workouts and wellness data. If no activity occurred on a given day, treat it as a "rest day" for the purposes of analysis and prescription.

5. **Critical for Context**: Properly interpreting the dates is critical for understanding the wellness data and training log in the correct temporal context, which directly impacts the decision-making process for session selection and intensity adjustments.

6. **Rest Day** if {{today}} is "2026-03-20" and the most recent training log entry in activities is from "2026-02-18", treat "2026-02-19" as a rest day with 0 volume and 0 intensity when analyzing the training load and recovery status otherwise do not treat it as a rest day
`;
