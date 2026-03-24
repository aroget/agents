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
      workoutStructure: z.string().describe(
        `Strict Intervals.icu workout code. 
          Rules: 
          1. Warm-up/Cool-down: "- [Time] [Intensity Type]"
          2. Intervals: "[N]x" followed by indented "- [Time] [Intensity Type] Ignore [N]x if there is only one main interval. In that case, just use the single line format for that interval."
          3. Type: Sport Discipline.
          4. Single Main Set: "- [Time] [Intensity Type]"
          
          Intensity Type Examples:
          - Run: A range of LTHR for low intensity, and threshold pace for high intensity intervals using the athlete's threshold pace from the profile (e.g., "4:50-5:10 m/km").
          - Bike: A range of HR zones for low intensity, and percentage of the athlete's threshold power for high intensity intervals (e.g., "200-220W").
          - Do not mix intensity types within the same workout. If the intervals is using power, all intensity types should be in power. If using pace, all should be in pace or heart rate.
          
          Example Output:
          -15m 70-75% 6:00-6:30 m/km

          4x
          -8m 80-85% 4:50-5:10 m/km
          -2m 70-75% 6:30-7:30 m/km

          -10m 70-75% 6:00-6:30 m/km`,
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
