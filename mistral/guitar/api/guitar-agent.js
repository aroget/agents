import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";
import trueFireTeacher from "../agents/guitar.teacher.agent.js";

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

export async function createGuitarAgent() {
  try {
    // Use the original agent definition from the CLI version
    const agent = await trueFireTeacher(client);

    console.log(
      `🎸 Guitar teacher agent created: ${agent.name} (ID: ${agent.id})`,
    );
    return agent.id;
  } catch (error) {
    console.error("Error creating guitar teacher agent:");
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function sendMessageToAgent(agentId, message) {
  try {
    // Start new conversation with the agent
    const response = await client.beta.conversations.start({
      agentId: agentId,
      inputs: message,
    });

    // Extract teacher's response
    const teacherMessage = response.outputs.find(
      (output) => output.role === "assistant",
    );

    if (teacherMessage && teacherMessage.content) {
      console.log(
        `🎸 Guitar teacher responded to: "${message.substring(0, 50)}..."`,
      );
      return teacherMessage.content;
    } else {
      console.log("❌ No response found from guitar teacher");
      console.log("Raw response:", JSON.stringify(response.outputs, null, 2));
      throw new Error("No response content found from guitar teacher");
    }
  } catch (error) {
    console.error("Error sending message to guitar teacher:");
    console.error(error);
    throw new Error(
      `Failed to get response from guitar teacher: ${error.message}`,
    );
  }
}
