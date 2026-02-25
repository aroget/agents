import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { createGuitarAgent, sendMessageToAgent } from "./guitar-agent.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store active agents (in production, use Redis or database)
const activeAgents = new Map();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Guitar Teacher API is running" });
});

// Initialize guitar teacher agent
app.post("/api/agent/init", async (req, res) => {
  try {
    const sessionId = req.body.sessionId || `session_${Date.now()}`;

    // Check if agent already exists for this session
    if (activeAgents.has(sessionId)) {
      return res.json({
        sessionId,
        agentId: activeAgents.get(sessionId),
        message: "Agent already initialized",
      });
    }

    // Create new agent
    const agentId = await createGuitarAgent();
    activeAgents.set(sessionId, agentId);

    res.json({
      sessionId,
      agentId,
      message: "Guitar teacher agent initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing agent:", error);
    res.status(500).json({
      error: "Failed to initialize guitar teacher",
      message: error.message,
    });
  }
});

// Send message to guitar teacher
app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        error: "Missing required fields: sessionId, message",
      });
    }

    // Get agent ID for this session
    const agentId = activeAgents.get(sessionId);
    if (!agentId) {
      return res.status(404).json({
        error: "Agent not found for session. Please initialize first.",
      });
    }

    // Send message to agent
    const response = await sendMessageToAgent(agentId, message);

    res.json({
      sessionId,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({
      error: "Failed to process message",
      message: error.message,
    });
  }
});

// Get initial greeting (for faster first load)
app.get("/api/greeting", async (req, res) => {
  try {
    const greeting = `# Welcome to Your Guitar Journey! 🎸

Hey there! I'm **The Virtuoso**, your dedicated Blues and Rock guitar instructor. I'm here to help you break through that "Forever Intermediate" plateau and develop real technical mastery.

## Here's what I can help you with:

### 🎯 **Technical Skills**
- **String muting** and clean execution
- **Bending techniques** with proper pitch control  
- **Timing and rhythm** precision
- **Fretboard visualization** (CAGED system & pentatonics)

### 📚 **Structured Learning**
- Custom practice routines with target BPMs
- Scale diagrams and chord progressions
- Blues/Rock licks and their applications
- Progress tracking and feedback

---

## Let's Start! 

What would you like to work on today? Here are some great starting points:

- *"Show me a blues scale exercise for today"*
- *"Help me with string muting technique"*  
- *"I want to work on bending - where do I start?"*
- *"Create a 15-minute practice routine"*

Remember: We focus on **why** and **how**, not just memorizing songs. Every exercise has a purpose! 🎸`;

    res.json({ greeting });
  } catch (error) {
    console.error("Error getting greeting:", error);
    res.status(500).json({
      error: "Failed to get greeting",
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎸 Guitar Teacher API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
