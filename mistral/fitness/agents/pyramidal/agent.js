import { config } from "../../config.js";
import { instructions } from "./instructions.js";
import { pyramidalSchemaDefinition } from "./schema.js";

const { model } = config;

export default async (client) => {
  const agent = await client.beta.agents.create({
    model,
    name: "Pyramidal Pro",
    description:
      "A specialized strategist focused on the Traditional European Pyramidal training model. It utilizes a balanced intensity distribution typically following 50/35/15 (Zone 1/Zone 2/Zone 3+) to build a strong aerobic base while emphasizing threshold/tempo work. It specializes in progressive volume building with substantial Zone 2 (tempo/threshold) training to maximize both aerobic capacity and lactate clearance capabilities.",
    instructions,
    completionArgs: {
      temperature: 0.2,
      responseFormat: {
        type: "json_schema",
        jsonSchema: {
          name: "PyramidalResponse",
          description:
            "Structured pyramidal training analysis and session recommendation",
          schemaDefinition: pyramidalSchemaDefinition,
          strict: true,
        },
      },
    },
  });

  return agent;
};
