import { z } from "zod";

import { config } from "../../config.js";

// Define the Zod schema for polarized response
export const polarizedResponseSchema = z.object({
  model: z.enum(["NORWEGIAN_POLARIZED", "SEILER_POLARIZED", "ZONE_BASED"]),
  suggestedSession: z.enum([
    "LOW_INTENSITY_BASE",
    "CONTROLLED_THRESHOLD",
    "VO2_MAX_POLARIZED",
    "RECOVERY",
    "TEMPO_CONTROLLED",
    "ANAEROBIC_CAPACITY",
  ]),
  targetMetrics: z.object({
    powerRange: z
      .string()
      .describe(
        'Power target as percentage of FTP (e.g., "65-75% FTP" or "Zone 2: 125-167W")',
      ),
    paceRange: z
      .string()
      .describe(
        'Pace target as percentage of Threshold Pace (e.g., "81-89% threshold pace" or "Zone 2: 4:15-3:45/km")',
      ),
    hrRange: z
      .string()
      .describe(
        'Heart rate target as percentage of LTHR/Max HR (e.g., "65-75% LTHR" or "Zone 2: 130-150 bpm")',
      ),
  }),
  rationale: z
    .string()
    .describe(
      "Why this session supports the 80/20 distribution and training adaptation",
    ),
  distributionCompliance: z.object({
    currentWeekDistribution: z.object({
      zone12Percentage: z
        .number()
        .min(0)
        .max(100)
        .describe("Percentage of training time in Zone 1-2"),
      zone3PlusPercentage: z
        .number()
        .min(0)
        .max(100)
        .describe("Percentage of training time in Zone 3+"),
      status: z
        .enum(["COMPLIANT", "MODERATE_RISK", "HIGH_RISK"])
        .describe("80/20 compliance status"),
    }),
    recommendation: z
      .string()
      .describe("How to maintain or correct the 80/20 distribution"),
  }),
  suggestions: z.array(
    z.object({
      duration: z
        .string()
        .describe('Recommended session duration (e.g., "60-90 minutes")'),
      structure: z
        .string()
        .describe(
          "A strictly formatted workout template. Use EXACTLY this visual style: \n\n- [Duration] warm up [Zone]\n\n[Reps]x\n- [Duration] [Zone] [Metric]\n- [Duration] [Zone]\n\n- [Duration] [Zone] cool down",
        ),
      sportPriority: z
        .enum(config.profile.bio.primary_sport.split("|"))
        .describe("Recommended sport for this session"),
    }),
  ),
});

// Convert Zod schema to JSON Schema for responseFormat using built-in method
export const polarizedSchemaDefinition = z.toJSONSchema(
  polarizedResponseSchema,
);
