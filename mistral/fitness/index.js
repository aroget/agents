import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";

import { fetchFullData } from "./intervals/wellness.js";
import { postNoteToIntervals } from "./intervals/add-note.js";

import polarizedPro from "./agents/polarized/agent.js";
import vitalsSentinel from "./agents/wellness/agent.js";
import directorSportif from "./agents/headcoach/agent.js";
import { removeNulls } from "./utils/removeNulls.js";
import { sendEmail } from "./utils/sendEmail.js";
import { getHistoryRange } from "./utils/getDateRange.js";

import { config } from "./config.js";

const { profile } = config;

dotenv.config({ quiet: true });

const isDev = process.env.NODE_ENV === "development";

const extractAgentOutput = (response) => {
  const assistantOutput = response.outputs.find(
    (output) => output.role === "assistant",
  );
  return assistantOutput ? assistantOutput.content : null;
};

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
    const { twoWeeksAgo, today } = getHistoryRange();
    const trainingLog = removeNulls(await fetchFullData(twoWeeksAgo, today));

    const agents = await initAgents(client);
    const { vitalsSentinelAgent, polarizedProAgent, directorSportifAgent } =
      agents;

    console.log("Starting Wellness Analysis with Vitals Sentinel Agent");
    const wellness = await client.beta.conversations.start({
      today,
      agentId: vitalsSentinelAgent.id,
      range: JSON.stringify({ today, twoWeeksAgo }),
      inputs: JSON.stringify(trainingLog),
    });

    console.log("Starting Training Analysis with Polarized Pro Agent");
    const strategy = await client.beta.conversations.start({
      agentId: polarizedProAgent.id,
      today,
      range: JSON.stringify({ today, twoWeeksAgo }),
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
        trainingLog: trainingLog,
        range: JSON.stringify({ today, twoWeeksAgo }),
        wellness: extractAgentOutput(wellness),
        strategy: extractAgentOutput(strategy),
      }),
    });

    if (!isDev) {
      console.log("Posting Note");
      await postNoteToIntervals(extractAgentOutput(finalPrescription));
      console.log("Note Posted");
    }

    const shouldEmailResult =
      !isDev && process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_USER;

    if (shouldEmailResult) {
      console.log("Sending Email");
      await sendEmail(extractAgentOutput(finalPrescription));
      console.log("Email Sent");
    }

    if (isDev) {
      console.log(extractAgentOutput(finalPrescription));
    }
    console.log("Pipeline completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Pipeline error:", error);
    process.exit(1);
  }
})();
