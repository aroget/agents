import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";

import { fetchFullData } from "./intervals/wellness.js";

import polarizedPro from "./agents/polarized/agent.js";
import vitalsSentinel from "./agents/wellness/agent.js";
import directorSportif from "./agents/headcoach/agent.js";
import { sanitizeData } from "./utils/sanitizeData.js";
import { extractAgentOutput } from "./utils/extractAgentOutput.js";
import { notify } from "./utils/notifications.js";
import { isWeekend } from "./utils/isWeekend.js";

import { getHistoryRange } from "./utils/getDateRange.js";

import { config } from "./config.js";

const { profile } = config;

dotenv.config({ quiet: true });

const initAgents = async (client) => {
  const vitalsSentinelAgent = await vitalsSentinel(client);
  const polarizedProAgent = await polarizedPro(client);
  const directorSportifAgent = await directorSportif(client);

  return {
    vitalsSentinelAgent,
    polarizedProAgent,
    directorSportifAgent,
  };
};

(async () => {
  try {
    console.log("Starting Pipeline");
    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    const { fromDate, today, yesterday } = getHistoryRange();
    const trainingLog = sanitizeData(await fetchFullData(fromDate, today));

    const agents = await initAgents(client);
    const { vitalsSentinelAgent, polarizedProAgent, directorSportifAgent } =
      agents;

    console.log("Starting Wellness Analysis with Vitals Sentinel Agent");
    const wellness = await client.beta.conversations.start({
      today,
      agentId: vitalsSentinelAgent.id,
      range: JSON.stringify({ today, fromDate }),
      inputs: JSON.stringify(trainingLog),
    });

    console.log("Starting Training Analysis with Polarized Pro Agent");
    const strategy = await client.beta.conversations.start({
      agentId: polarizedProAgent.id,
      today,
      isWeekend,
      range: JSON.stringify({ today, fromDate }),
      inputs: JSON.stringify({
        profile,
        trainingLog: trainingLog,
      }),
    });

    console.log("Starting Final Prescription with Director Sportif Agent");
    const finalPrescription = await client.beta.conversations.start({
      today,
      agentId: directorSportifAgent.id,
      inputs: JSON.stringify({
        profile,
        isWeekend,
        yesterday,
        trainingLog: trainingLog,
        range: JSON.stringify({ today, fromDate }),
        wellness: extractAgentOutput(wellness),
        strategy: extractAgentOutput(strategy),
      }),
    });

    console.log("Analysis complete, preparing notifications...");
    await notify(finalPrescription);
    console.log("Pipeline completed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Pipeline error:", error);
    process.exit(1);
  }
})();
