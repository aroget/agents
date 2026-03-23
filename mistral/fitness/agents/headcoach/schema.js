import { z } from "zod";

export const dsIntervalsSchema = z.object({
  finalPrescriptionTitle: z
    .string()
    .describe("e.g., Final Prescription – 2026-03-23"),
  decisionSummary: z.string().describe("Status and Selected Workout"),
  workoutStructure: z
    .string()
    .describe("The strictly formatted Markdown workout template"),

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
