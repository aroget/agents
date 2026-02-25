import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";

import { fetchFullData } from "./intervals/wellness.js";
import { postNoteToIntervals } from "./intervals/add-note.js";

import polarizedCoachAgent from "./agents/polarized.coach.agent.js";

dotenv.config({ quiet: true });

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

async function getOrCreateAgent() {
  try {
    const agent = await polarizedCoachAgent(client);

    console.log("Agent created successfully:");

    return agent.id;
  } catch (error) {
    console.error("Error creating agent:");
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}

async function runCoachCycle(agentId) {
  const lastTwoWeeks = await fetchFullData();
  if (!lastTwoWeeks) return;

  console.log("Starting Analysis");

  const response = await client.beta.conversations.start({
    agentId: agentId,
    inputs: `Analyze today's data: ${JSON.stringify(lastTwoWeeks)}. Compare it against my athlete profile and previous trends.`,
  });

  // Extract and display only the actual response content
  const assistantMessage = response.outputs.find(
    (output) => output.role === "assistant",
  );

  if (assistantMessage && assistantMessage.content) {
    console.log("Analysis completed.");
    return assistantMessage.content;
  }
  console.log("\n❌ No coach response found");
  console.log("Raw response:", JSON.stringify(response.outputs, null, 2));
}

(async () => {
  try {
    const agentId = await getOrCreateAgent();
    const summary = await runCoachCycle(agentId);
    await postNoteToIntervals(summary);

    console.log("✅ AI Coach cycle completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Application error:", error);
    process.exit(1);
  }
})();
