import { z } from "zod";

export const dsIntervalsSchema = z.object({
  finalPrescriptionTitle: z
    .string()
    .describe("e.g., Final Prescription – 2026-04-19"),

  decisionSummary: z
    .string()
    .describe(
      "High-level status (GREEN/YELLOW/RED) and the selected workout name.",
    ),

  // THE RAW DATA FOR INTERVALS.ICU - STRICT UNIFORMITY REQUIRED
  structuredWorkoutCode: z.string().describe(
    `Strict Intervals.icu syntax. 
    CRITICAL RULE: Use EXACTLY ONE metric for the entire block (HR, Pace, or Power). 
    - If RUN + High Intensity: Use Pace for ALL steps (including warm-up/cool-down).
    - If BIKE + High Intensity: Use Power (Watts or %FTP) for ALL steps.
    - If Low Intensity/Recovery: Heart Rate is acceptable for ALL steps.
    
    NEVER mix units. Example of CORRECT Pace-only workout:
    - 15m 6:30-7:00 Pace
    5x
    - 1km 4:15-4:25 Pace
    - 500m 7:00-8:00 Pace
    - 10m 7:00-7:30 Pace`,
  ),

  workoutStructure: z
    .string()
    .describe(
      "Human-readable breakdown for the UI. Can mention multiple metrics for context (e.g., 'Target 250W, keep HR under 155bpm').",
    ),

  coachsWhy: z.object({
    readinessGate: z
      .string()
      .describe("Analysis of HRV, Sleep, and RHR trends vs 14-day baseline."),
    disciplineRotation: z
      .string()
      .describe(
        "Logic for sport selection (e.g., balancing bike/run frequency).",
      ),
    consistencyOverIntensity: z
      .string()
      .describe(
        "Strategic justification: how this session fits the current Phase (Base/Build/Peak).",
      ),
  }),

  progressionContext: z.object({
    energySystem: z
      .enum([
        "Alactic",
        "Anaerobic",
        "Aerobic_Threshold",
        "VO2_Max",
        "Recovery",
      ])
      .describe("The primary physiological system targeted."),

    historicalComparison: z
      .string()
      .describe(
        "Comparison of HR/Work efficiency against the last 30 days of similar sessions.",
      ),

    adaptationSignalDetected: z
      .boolean()
      .describe(
        "True if the user is showing improved efficiency (lower HR for same output) over time.",
      ),

    targetTrend: z
      .enum(["improving", "stable", "regressing", "new_stimulus"])
      .describe("The trajectory of fitness in this specific energy system."),

    loadProgressionTarget: z
      .string()
      .describe(
        "The specific 'micro-overload' applied today (e.g., +5m duration, +2% intensity) to ensure we aren't just maintaining.",
      ),

    limiterIdentified: z
      .string()
      .describe(
        "The primary physiological bottleneck detected (e.g., 'Cardiac Drift >5%').",
      ),

    suggestedBenchmark: z
      .string()
      .describe(
        "A specific metric from a past session for the athlete to aim for.",
      ),
  }),

  postWorkoutSelfAnalysisChecklist: z.object({
    successCriteria: z
      .string()
      .describe("Quantitative markers of a successful session."),
    redFlags: z
      .array(z.string())
      .describe("Signs of overreaching or technical breakdown."),
  }),

  nutrition: z
    .object({
      pre: z.string(),
      during: z.string(),
      post: z.string(),
    })
    .optional()
    .describe("Fueling plan based on workout duration and intensity. Omit for REST or active recovery prescriptions."),

  keyAdjustments: z
    .array(z.string())
    .describe(
      "Changes made to the standard plan based on today's readiness data.",
    ),

  tomorrowPreview: z
    .string()
    .describe("Conditional 'If/Then' scenarios for tomorrow's training."),

  nextSteps: z.object({
    sleepTarget: z.string(),
    hydration: z.string().describe("Total fluid intake goal."),
    recoveryCheck: z.string(),
  }),

  closingTone: z.string().describe("A 'Protective but Purposeful' sign-off."),

  fullIntervalsNote: z
    .string()
    .describe(
      "The entire output formatted as a single Markdown string for the Intervals.icu 'Notes' field.",
    ),
});

// Convert Zod schema to JSON Schema for responseFormat using built-in method
export const dsIntervalsSchemaDefinition = z.toJSONSchema(dsIntervalsSchema);
