import { z } from "zod";

export const dsIntervalsSchema = z.object({
  finalPrescriptionTitle: z
    .string()
    .describe("e.g., Final Prescription – 2026-03-23"),
  decisionSummary: z.string().describe("Status and Selected Workout"),
  workoutStructure: z.string().describe(
    `Strict Intervals.icu workout code. 
    Rules: 
    1. Warm-up/Cool-down: "- [Time] [Intensity Type]"
    2. Intervals: "[N]x" followed by indented "- [Time] [Intensity Type] Ignore [N]x if there is only one main interval. In that case, just use the single line format for that interval."
    3. Type: Sport Discipline.
    4. Single Main Set: "- [Time] [Intensity Type]"
    
    Intensity Type Examples:
    - Run: A range of LTHR for low intensity, and  pace for high intensity intervals using the athlete's threshold pace from the profile (e.g., "4:50-5:10 Pace or 60-70% LTHR").
    - Bike: A range of HR zones for low intensity, and percentage of the athlete's threshold power for high intensity intervals (e.g., "200-220W or or 60-70% LTHR").
    - Do not mix intensity types within the same workout. If the intervals is using power, all intensity types should be in power. If using pace, all should be in pace or heart rate.
    
    Example Output:
    -15m 6:00-6:30 Pace

    4x
    -8m 4:50-5:10 Pace
    -2m 6:30-7:30 Pace

    -10m 6:00-6:30 Pace`,
  ),

  coachsWhy: z.object({
    readinessGate: z
      .string()
      .describe(
        "Analysis of HRV, Sleep, and specific % drops from the 14-day avg",
      ),
    disciplineRotation: z
      .string()
      .describe("Analysis of sport frequency (e.g., 'haven't run in 6 days')"),
    consistencyOverIntensity: z
      .string()
      .describe(
        "How this choice protects long-term goals like FTP or race targets",
      ),
  }),

  nutrition: z
    .string()
    .describe(
      "Pre/During/Post workout nutrition recommendations based on today's session",
    ),

  keyAdjustments: z
    .array(z.string())
    .describe(
      "List of what was scrapped or modified from the Polarized Strategy",
    ),
  tomorrowPreview: z
    .string()
    .describe("Conditional plan based on expected recovery"),

  nextSteps: z.object({
    sleepTarget: z.string(),
    hydration: z.string(),
    recoveryCheck: z.string(),
  }),

  closingTone: z
    .string()
    .describe("The 'Protective but Purposeful' coaching sign-off"),

  // The final concatenated string for Intervals.icu
  fullIntervalsNote: z.string().describe(`
      The entire output as a single string formatted for a note
      Requirements:
      1. All section headers must be bolded (e.g., **Coach’s Why**).
      `),
});

// Convert Zod schema to JSON Schema for responseFormat using built-in method
export const dsIntervalsSchemaDefinition = z.toJSONSchema(dsIntervalsSchema);
