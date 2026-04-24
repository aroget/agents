import { z } from "zod";

import { config } from "../../config.js";

const { sports } = config;

// Define the Zod schema for pyramidal response
export const pyramidalResponseSchema = z.object({
  model: z.enum(["TRADITIONAL_PYRAMIDAL", "THRESHOLD_FOCUSED", "TEMPO_BASED"]),
  suggestedSession: z.enum([
    "EASY_AEROBIC",
    "TEMPO_THRESHOLD",
    "SWEET_SPOT",
    "VO2_INTERVALS",
    "RECOVERY",
    "PROGRESSION_RUN",
    "FARTLEK",
    "LONG_INTERVALS",
  ]),
  targetMetrics: z.object({
    powerRange: z
      .string()
      .describe(
        'Power target as percentage of FTP (e.g., "75-85% FTP" or "Zone 3: 180-210W")',
      ),
    paceRange: z
      .string()
      .describe(
        'Pace target as percentage of Threshold Pace (e.g., "90-95% threshold pace" or "Zone 3: 4:30-4:45/km")',
      ),
    hrRange: z
      .string()
      .describe(
        'Heart rate target as percentage of LTHR/Max HR (e.g., "75-85% LTHR" or "Zone 3: 155-170 bpm")',
      ),
  }),
  rationale: z
    .string()
    .describe(
      "Why this session supports the pyramidal distribution and progressive training adaptation",
    ),
  distributionCompliance: z.object({
    currentWeekDistribution: z.object({
      zone1Percentage: z
        .number()
        .min(0)
        .max(100)
        .describe("Percentage of training time in Zone 1 (Easy)"),
      zone2Percentage: z
        .number()
        .min(0)
        .max(100)
        .describe("Percentage of training time in Zone 2 (Tempo/Threshold)"),
      zone3PlusPercentage: z
        .number()
        .min(0)
        .max(100)
        .describe("Percentage of training time in Zone 3+ (VO2/Anaerobic)"),
      status: z
        .enum(["COMPLIANT", "MODERATE_RISK", "HIGH_RISK"])
        .describe("Pyramidal distribution compliance status"),
    }),
    recommendation: z
      .string()
      .describe("How to maintain or correct the pyramidal distribution"),
  }),
  suggestions: z.array(
    z.object({
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
      sportPriority: z
        .enum(sports)
        .describe("Recommended sport for this session"),
    }),
  ).min(1),
});

// Convert Zod schema to JSON Schema for responseFormat using built-in method
export const pyramidalSchemaDefinition = z.toJSONSchema(
  pyramidalResponseSchema,
);
