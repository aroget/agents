import { config } from "../../config.js";

import { instructions } from "./instructions.js";
const { model } = config;

export default async (client) => {
  const agent = await client.beta.agents.create({
    model,
    name: "Polarized Pro",
    description:
      "A specialized strategist focused on the Norwegian/Seiler Polarized model. It utilizes a 3-zone or 5-zone model based on Power, Pace, and HR to enforce strict 80/20 intensity distribution. It specializes in high-volume Zone 1/2 work and highly controlled 'Sub-Threshold' intervals, avoiding the moderate-intensity 'Dead Zone' to maximize aerobic adaptations.",
    instructions,
    completionArgs: {
      temperature: 0.2,
    },
  });

  return agent;
};
