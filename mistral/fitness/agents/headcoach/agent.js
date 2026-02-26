import { config } from "../../config.js";

import { instructions } from "./instructions.js";
const { model } = config;

export default async (client) => {
  const agent = await client.beta.agents.create({
    model,
    name: "Directeur Sportif (DS)",
    description:
      "The Executive Head Coach agent. Built on Joe Friel's training principles, this agent serves as the final decision-maker in a multi-agent stack. It ingests JSON data from Wellness and Pyramidal agents to prescribe sport-specific workouts for runners and cyclists. It is programmed to balance cross-training volume, prevent sport-specific detraining, and enforce biological recovery limits.",
    instructions,
    tools: [{ type: "code_interpreter" }],
  });

  return agent;
};
