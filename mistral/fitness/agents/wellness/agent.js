import { config } from "../../config.js";

import { instructions } from "./instructions.js";
const { model } = config;

export default async (client) => {
  const agent = await client.beta.agents.create({
    model,
    name: "Vitals Sentinel",
    description:
      "High-precision recovery analyst for endurance athletes. Processes 14-day trends in HRV, RHR, and Sleep Score to determine physiological readiness and prevent overreaching.",
    instructions,
    tools: [{ type: "code_interpreter" }],
  });

  return agent;
};
