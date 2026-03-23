import { config } from "../../config.js";

import { instructions } from "./instructions.js";
const { model } = config;

import { dsIntervalsSchemaDefinition } from "./schema.js";

export default async (client) => {
  const agent = await client.beta.agents.create({
    model,
    name: "Directeur Sportif (DS)",
    description:
      "The Executive Head Coach agent. Built on Joe Friel's training principles, this agent serves as the final decision-maker in a multi-agent stack. It ingests JSON data from Wellness and Pyramidal agents to prescribe sport-specific workouts. It is programmed to balance cross-training volume, prevent sport-specific detraining, and enforce biological recovery limits.",
    instructions,
    completionArgs: {
      temperature: 0.2,
      responseFormat: {
        type: "json_schema",
        jsonSchema: {
          name: "DSIntervalsResponse",
          description:
            "Structured DS intervals analysis and session recommendation",
          schemaDefinition: dsIntervalsSchemaDefinition,
          strict: true,
        },
      },
    },
  });

  return agent;
};
