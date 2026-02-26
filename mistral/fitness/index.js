import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";

import { fetchFullData } from "./intervals/wellness.js";
import { postNoteToIntervals } from "./intervals/add-note.js";

import polarizedPro from "./agents/polarized/agent.js";
import vitalsSentinel from "./agents/wellness/agent.js";
import directorSportif from "./agents/headcoach/agent.js";
import { removeNulls } from "./utils/removeNulls.js";

dotenv.config({ quiet: true });

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

    const lastTwoWeeks = removeNulls(await fetchFullData());

    const agents = await initAgents(client);
    const { vitalsSentinelAgent, polarizedProAgent, directorSportifAgent } =
      agents;

    console.log("Starting Wellness Analysis with Vitals Sentinel Agent");
    const wellness = await client.beta.conversations.start({
      agentId: vitalsSentinelAgent.id,
      inputs: JSON.stringify(lastTwoWeeks),
    });

    console.log("Starting Training Analysis with Polarized Pro Agent");
    const strategy = await client.beta.conversations.start({
      agentId: polarizedProAgent.id,
      inputs: JSON.stringify(lastTwoWeeks),
    });

    console.log("Starting Final Prescription with Director Sportif Agent");
    const finalPrescription = await client.beta.conversations.start({
      agentId: directorSportifAgent.id,
      inputs: `Wellness Report: ${extractAgentOutput(wellness)} Polarized Report: ${extractAgentOutput(strategy)}`,
    });

    await postNoteToIntervals(extractAgentOutput(finalPrescription));
    console.log("Pipeline completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Pipeline error:", error);
    process.exit(1);
  }
})();
