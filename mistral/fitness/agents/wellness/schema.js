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
    recoveryDebt: z.number(), // calculated from training load
    expectedRecoveryDays: z.number(), // based on patterns
    trainingLoadAlignment: z.enum(["ALIGNED", "MISALIGNED"]), // metrics vs load
    previous48h: z.object({
      cumulativeStress: z.number(),
      response: z.enum(["NORMAL", "DELAYED", "BLUNTED", "EXCESSIVE"]),
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
  adaptiveBaselines: z.object({
    hrv: z.object({
      current7day: z.number(),
      current14day: z.number(),
      currentValue: z.number(),
      deviationFromBaseline: z.number(), // in standard deviations
    }),
    rhr: z.object({
      current7day: z.number(),
      current14day: z.number(),
      currentValue: z.number(),
      deviationFromBaseline: z.number(),
    }),
    sleepScore: z.object({
      current7day: z.number(),
      current14day: z.number(),
      currentValue: z.number(),
      deviationFromBaseline: z.number(),
    }),
  }),

  biomarkerTrends: z.object({
    hrv: z.object({
      threeDayTrend: z.enum(["IMPROVING", "DECLINING", "STABLE"]),
      sevenDayTrend: z.enum(["IMPROVING", "DECLINING", "STABLE"]),
      recoveryMomentum: z.enum(["STRONG", "MODERATE", "WEAK", "NONE"]),
      velocityScore: z.number(), // rate of change
    }),
    rhr: z.object({
      threeDayTrend: z.enum(["IMPROVING", "DECLINING", "STABLE"]),
      sevenDayTrend: z.enum(["IMPROVING", "DECLINING", "STABLE"]),
      recoveryMomentum: z.enum(["STRONG", "MODERATE", "WEAK", "NONE"]),
      velocityScore: z.number(),
    }),
    sleepScore: z.object({
      threeDayTrend: z.enum(["IMPROVING", "DECLINING", "STABLE"]),
      sevenDayTrend: z.enum(["IMPROVING", "DECLINING", "STABLE"]),
      recoveryMomentum: z.enum(["STRONG", "MODERATE", "WEAK", "NONE"]),
      velocityScore: z.number(),
    }),
    overall: z.enum(["IMPROVING", "DECLINING", "STABLE"]),
  }),
  recentPatterns: z.object({
    significantDropDetected: z.boolean(),
    daysWhereDropDetected: z.number().nullable(), // days ago, null if no drop
    daysSinceLastDrop: z.number().nullable(),
    currentlyRecovering: z.boolean(),
    baselineShiftSuspected: z.boolean(),
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

  recoveryWeekResponse: z.object({
    isRecoveryWeek: z.boolean(),
    comparisonWindow: z.object({
      currentWeekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      previousWeekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      loadWeeksConsidered: z.number().int().min(0),
    }),
    comparisonAgainstLoadWeeks: z.object({
      hrv: z.object({
        recoveryWeekAvg: z.number().nullable(),
        loadWeeksAvg: z.number().nullable(),
        deltaPercentage: z.number().nullable(),
        response: z.enum([
          "IMPROVING",
          "STABLE",
          "WORSENING",
          "INSUFFICIENT_DATA",
        ]),
      }),
      rhr: z.object({
        recoveryWeekAvg: z.number().nullable(),
        loadWeeksAvg: z.number().nullable(),
        deltaPercentage: z.number().nullable(),
        response: z.enum([
          "IMPROVING",
          "STABLE",
          "WORSENING",
          "INSUFFICIENT_DATA",
        ]),
      }),
      sleepScore: z.object({
        recoveryWeekAvg: z.number().nullable(),
        loadWeeksAvg: z.number().nullable(),
        deltaPercentage: z.number().nullable(),
        response: z.enum([
          "IMPROVING",
          "STABLE",
          "WORSENING",
          "INSUFFICIENT_DATA",
        ]),
      }),
    }),
    overallResponse: z.enum([
      "POSITIVE_ADAPTATION",
      "MIXED_ADAPTATION",
      "POOR_ADAPTATION",
      "INSUFFICIENT_DATA",
    ]),
    coachingInterpretation: z.string(),
  }),
});

// Convert Zod schema to JSON Schema for responseFormat using built-in method
export const wellnessSchemaDefinition = z.toJSONSchema(wellnessResponseSchema);
