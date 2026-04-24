import { config } from "../config.js";

/**
 * Determines whether the current (or given) date falls in a recovery week.
 *
 * The cycle is anchored to `config.cycleStartDate` (must be a Monday).
 * Every 4-week block is structured as: Load | Load | Load | Recovery.
 * Week index 0, 1, 2 → loading weeks. Week index 3 → recovery week.
 * This repeats indefinitely for all future cycles.
 *
 * @param {string|Date} [date] - ISO date string or Date object. Defaults to today.
 * @returns {boolean}
 */
export function isRecoveryWeek(date) {
  const anchorDate = new Date(config.cycleStartDate + "T00:00:00Z");

  // Resolve the target date and normalise to UTC midnight
  const target = date ? new Date(date + "T00:00:00Z") : new Date();
  const targetUTC = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  );

  // Walk back to the Monday of the target's current week
  const dayOfWeek = new Date(targetUTC).getUTCDay(); // 0=Sun … 6=Sat
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const currentMonday = targetUTC - daysToMonday * 86_400_000;

  // How many whole weeks separate the cycle anchor from this Monday?
  const anchorUTC = anchorDate.getTime();
  const diffMs = currentMonday - anchorUTC;
  const weekIndex = Math.floor(diffMs / (7 * 86_400_000));

  // Position within the 4-week cycle (handles negative values for past dates too)
  const cyclePosition = ((weekIndex % 4) + 4) % 4;

  return cyclePosition === 3; // 0,1,2 = load  |  3 = recovery
}
