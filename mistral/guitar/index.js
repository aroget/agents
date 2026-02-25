import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";
import * as readline from "readline";

import trueFireTeacher from "./agents/guitar.teacher.agent.js";

dotenv.config({ quiet: true });

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

// Set up readline for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getOrCreateAgent() {
  try {
    const agent = await trueFireTeacher(client);
    console.log(`🎸 ${agent.name} is ready to teach!`);
    console.log(
      "Ask questions about guitar techniques, request practice exercises, or share your playing for feedback.",
    );
    console.log("Type 'quit' or 'exit' to end the lesson.\n");
    return agent.id;
  } catch (error) {
    console.error("Error creating guitar teacher:");
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}

async function sendMessage(agentId, message) {
  try {
    // Start new conversation each time (like the fitness example)
    const response = await client.beta.conversations.start({
      agentId: agentId,
      inputs: message,
    });

    // Extract teacher's response
    const teacherMessage = response.outputs.find(
      (output) => output.role === "assistant",
    );

    if (teacherMessage && teacherMessage.content) {
      return teacherMessage.content;
    } else {
      console.log("❌ No response found");
      console.log("Raw response:", JSON.stringify(response.outputs, null, 2));
      return null;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

function startLesson(agentId) {
  console.log("🎵 Getting your personalized lesson ready...\n");

  // Send initial message to get lesson suggestion
  const getInitialLesson = async () => {
    console.log("🤔 Let me think about what we should work on today...\n");

    const initialResponse = await sendMessage(
      agentId,
      "Based on my student profile, please suggest what we should work on in today's guitar lesson. Provide a specific exercise or technique to practice, and explain why it's important for my development as a blues/rock guitarist.",
    );

    if (initialResponse) {
      console.log(`Teacher: ${initialResponse}\n`);
      console.log(
        "💬 Ready for questions! Ask me anything or request more exercises.\n",
      );
    } else {
      console.log(
        "❌ Sorry, I couldn't prepare your lesson. Let's try asking a question instead.\n",
      );
    }

    startInteractiveSession();
  };

  const startInteractiveSession = () => {
    const askQuestion = () => {
      rl.question("You: ", async (userInput) => {
        if (
          userInput.toLowerCase() === "quit" ||
          userInput.toLowerCase() === "exit"
        ) {
          console.log("\n🎸 Keep practicing! See you next lesson!");
          rl.close();
          return;
        }

        if (userInput.trim() === "") {
          console.log("Please ask a question or type 'quit' to exit.\n");
          askQuestion();
          return;
        }

        console.log("\n🤔 Let me think about that...\n");

        const response = await sendMessage(agentId, userInput);

        if (response) {
          console.log(`Teacher: ${response}\n`);
        } else {
          console.log(
            "❌ Sorry, I couldn't process your question. Please try again.\n",
          );
        }

        askQuestion();
      });
    };

    askQuestion();
  };

  getInitialLesson();
}

// Handle graceful exit
process.on("SIGINT", () => {
  console.log("\n🎸 Keep practicing! See you next lesson!");
  rl.close();
  process.exit(0);
});

(async () => {
  try {
    console.log("🚀 Setting up your guitar teacher...\n");
    const agentId = await getOrCreateAgent();
    startLesson(agentId);
  } catch (error) {
    console.error("Application error:", error);
    rl.close();
    process.exit(1);
  }
})();
