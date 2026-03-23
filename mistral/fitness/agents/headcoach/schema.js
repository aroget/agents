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
    - Run: "80-85% LTHR" or "4:30-4:45 min/km"
    - Bike: "90-95% FTP" or "Z3"
    
    Example Output:
    -15m 70-75% LTHR

    4x
    -8m 80-85% LTHR
    -2m 70-75% LTHR

    -10m 70-75% LTHR`,
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
  fullIntervalsNote: z
    .string()
    .describe("The entire output as a single string formatted for a note"),
});

// Convert Zod schema to JSON Schema for responseFormat using built-in method
export const dsIntervalsSchemaDefinition = z.toJSONSchema(dsIntervalsSchema);
