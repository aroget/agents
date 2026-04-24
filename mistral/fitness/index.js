import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";

import { config } from "./config.js";

import polarizedPro from "./agents/polarized/agent.js";
import pyramidalPro from "./agents/pyramidal/agent.js";
import vitalsSentinel from "./agents/wellness/agent.js";
import directorSportif from "./agents/headcoach/agent.js";

import { extractAgentOutput } from "./utils/extractAgentOutput.js";
import { notify } from "./utils/notifications.js";
import { isWeekend } from "./utils/isWeekend.js";
import { isRecoveryWeek } from "./utils/isRecoveryWeek.js";
import { getHistoryRange } from "./utils/getDateRange.js";
import { fetchFullData } from "./intervals/wellness.js";
import { sanitizeData } from "./utils/sanitizeData.js";
import { removeNulls } from "./utils/removeNulls.js";
import { getAthleteSummary } from "./utils/getAthleteSummary.js";

dotenv.config({ quiet: true });

// Constants
const TRAINING_PHILOSOPHIES = {
  POLARIZED: "polarized",
  PYRAMIDAL: "pyramidal",
};

const AGENT_CONFIGS = {
  [TRAINING_PHILOSOPHIES.POLARIZED]: {
    agent: polarizedPro,
    name: "Polarized Pro",
  },
  [TRAINING_PHILOSOPHIES.PYRAMIDAL]: {
    agent: pyramidalPro,
    name: "Pyramidal Pro",
  },
};

// Helper functions
const createAgentInputs = (inputs) => JSON.stringify(inputs);

const getStrategyAgentConfig = () => {
  const philosophy =
    process.env.TRAINING_PHILOSOPHY?.toLowerCase() ||
    TRAINING_PHILOSOPHIES.POLARIZED;
  return (
    AGENT_CONFIGS[philosophy] || AGENT_CONFIGS[TRAINING_PHILOSOPHIES.POLARIZED]
  );
};

/**
 * Initialize all agents required for the training pipeline
 */
const initializeAgents = async (client) => {
  const [vitalsSentinelAgent, directorSportifAgent] = await Promise.all([
    vitalsSentinel(client),
    directorSportif(client),
  ]);

  const strategyConfig = getStrategyAgentConfig();
  const strategyAgent = await strategyConfig.agent(client);

  return {
    vitalsSentinelAgent,
    strategyAgent,
    strategyAgentName: strategyConfig.name,
    directorSportifAgent,
  };
};

/**
 * Prepare training data from intervals
 */
const prepareTrainingData = async (fromDate, today) => {
  console.log(`📊 Fetching training data from ${fromDate} to ${today}`);
  const rawData = await fetchFullData(fromDate, today);
  return removeNulls(sanitizeData(rawData));
};

/**
 * Run wellness analysis
 */
const runWellnessAnalysis = async (client, agentId, inputs) => {
  console.log("🏥 Starting Wellness Analysis with Vitals Sentinel Agent");
  return await client.beta.conversations.start({
    today: inputs.today,
    agentId,
    inputs: createAgentInputs(inputs),
  });
};

/**
 * Run training strategy analysis
 */
const runStrategyAnalysis = async (client, agentId, agentName, inputs) => {
  console.log(`🎯 Starting Training Analysis with ${agentName} Agent`);
  return await client.beta.conversations.start({
    agentId,
    inputs: createAgentInputs(inputs),
  });
};

/**
 * Run final prescription analysis
 */
const runFinalPrescription = async (client, agentId, inputs) => {
  console.log("🎖️ Starting Final Prescription with Director Sportif Agent");
  return await client.beta.conversations.start({
    today: inputs.today,
    agentId,
    inputs: createAgentInputs(inputs),
  });
};

/**
 * Main training pipeline execution
 */
const runTrainingPipeline = async () => {
  console.log("🚀 Starting Fitness Training Pipeline");

  // Initialize
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
  const { fromDate, today, yesterday } = getHistoryRange();
  const recoveryWeekFlag = isRecoveryWeek(today);

  // Prepare data
  const trainingLog = await prepareTrainingData(fromDate, today);
  const agents = await initializeAgents(client);

  // Pre-compute shared context values
  const athleteSummary = getAthleteSummary(trainingLog.wellness);
  const { currentWeekSummary, weeklyPhases } = trainingLog;

  // Base inputs shared by strategy + headcoach (full trainingLog)
  const baseInputs = {
    trainingLog,
    today,
    yesterday,
    profile: config.profile,
    sports: config.sports,
    athleteSummary,
    currentWeekSummary,
  };

  // Scoped inputs for wellness agent — only what it needs, no heavy activities array
  const wellnessInputs = {
    sanitizedWellness: trainingLog.wellness,
    wellnessAnalytics: trainingLog.wellnessAnalytics,
    weeklyPhases,
    today,
    yesterday,
    athleteSummary,
    isRecoveryWeek: recoveryWeekFlag,
  };

  // Run analyses in sequence
  const wellness = await runWellnessAnalysis(
    client,
    agents.vitalsSentinelAgent.id,
    wellnessInputs,
  );

  const strategy = await runStrategyAnalysis(
    client,
    agents.strategyAgent.id,
    agents.strategyAgentName,
    {
      ...baseInputs,
      isWeekend: isWeekend(today),
      isRecoveryWeek: recoveryWeekFlag,
    },
  );

  const finalPrescription = await runFinalPrescription(
    client,
    agents.directorSportifAgent.id,
    {
      ...baseInputs,
      isWeekend: isWeekend(today),
      isRecoveryWeek: recoveryWeekFlag,
      wellness: extractAgentOutput(wellness),
      strategy: extractAgentOutput(strategy),
    },
  );

  // Send notifications
  console.log("📧 Analysis complete, preparing notifications...");
  await notify({
    wellness: extractAgentOutput(wellness),
    strategy: extractAgentOutput(strategy),
    finalPrescription: extractAgentOutput(finalPrescription),
  });

  console.log("✅ Pipeline completed successfully");
};

// Main execution with better error handling
(async () => {
  try {
    await runTrainingPipeline();
    process.exit(0);
  } catch (error) {
    console.error("❌ Pipeline failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
})();
