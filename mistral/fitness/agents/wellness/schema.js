import { z } from "zod";

// Define the Zod schema for wellness response
export const wellnessResponseSchema = z.object({
  keyMetrics: z.object({
    analysisDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dataPointsAnalyzed: z.object({
      wellnessEntries: z.number().int().min(0),
      trainingDays: z.number().int().min(0),
      dateRange: z.string(),
    }),
    restingHeartRate: z.object({
      lastNight: z.object({
        value: z.number().nullable(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
      fourteenDayAvg: z.number().nullable(),
      deviation: z.object({
        percentage: z.number(),
        status: z.enum(["stable", "elevated", "decreased"]),
      }),
    }),
    heartRateVariability: z.object({
      lastNight: z.object({
        value: z.number().nullable(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
      fourteenDayAvg: z.number().nullable(),
      deviation: z.object({
        percentage: z.number(),
        status: z.enum(["stable", "elevated", "decreased"]),
      }),
    }),
    sleepScore: z.object({
      lastNight: z.object({
        value: z.number().min(0).max(100).nullable(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
      fourteenDayAvg: z.number().min(0).max(100).nullable(),
      deviation: z.object({
        percentage: z.number(),
        status: z.enum(["stable", "elevated", "decreased"]),
      }),
    }),
  }),
  loadAnalysis: z.object({
    yesterdayWorkout: z.preprocess(
      (val) => (val === null ? undefined : val), // If null, treat as missing
      z
        .union([
          z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            activityName: z.string(),
            tss: z.number().nullable(),
            intensityCategory: z
              .enum(["low", "moderate", "high", "very_high"])
              .nullable(),
            averageHeartRate: z.number().nullable(),
            impact: z.string(),
          }),
          z.literal("Rest Day"),
        ])
        .default("Rest Day"),
    ),
    previous48h: z.object({
      totalTSS: z.number(),
      cumulativeLoad: z.object({
        ctl: z.number().nullable(),
        atl: z.number().nullable(),
      }),
      response: z.string(),
    }),
  }),
  statusIndicator: z.object({
    status: z.enum(["READY", "CAUTION", "REST"]),
    color: z.enum(["GREEN", "YELLOW", "RED"]),
    dataJustification: z.object({
      primaryTrigger: z.enum(["HRV", "RHR", "SLEEP", "LOAD", "DATA_MISSING"]),
      explanation: z.string(),
    }),
    prescription: z.string(),
    nextStep: z.string(),
  }),
  trendAnalysis: z.object({
    overview: z.string(),
    fitnessDirection: z.enum([
      "improving",
      "maintaining",
      "declining",
      "unknown",
    ]),
    fatigueState: z.enum([
      "recovered",
      "accumulating",
      "overreached",
      "unknown",
    ]),
    keyInsight: z.string(),
  }),
});

// Convert Zod schema to JSON Schema for responseFormat using built-in method
export const wellnessSchemaDefinition = z.toJSONSchema(wellnessResponseSchema);
