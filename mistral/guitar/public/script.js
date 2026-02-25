class GuitarTeacher {
  constructor() {
    this.messagesContainer = document.getElementById("messages");
    this.userInput = document.getElementById("user-input");
    this.sendBtn = document.getElementById("send-btn");
    this.initialLoading = document.getElementById("initial-loading");

    this.agentId = null;
    this.sessionId = null;
    this.isLoading = false;

    this.init();
  }

  async init() {
    // Initialize the chat interface
    this.setupEventListeners();
    await this.loadInitialGreeting();
  }

  setupEventListeners() {
    // Send button click
    this.sendBtn.addEventListener("click", () => this.sendMessage());

    // Enter key to send (Shift+Enter for new line)
    this.userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    this.userInput.addEventListener(
      "input",
      this.autoResizeTextarea.bind(this),
    );
  }

  autoResizeTextarea() {
    this.userInput.style.height = "auto";
    this.userInput.style.height =
      Math.min(this.userInput.scrollHeight, 120) + "px";
  }

  async loadInitialGreeting() {
    try {
      // Try to get a real lesson from the agent (like the CLI version)
      let lesson;
      if (window.GuitarTeacherConfig.USE_API) {
        try {
          if (window.GuitarTeacherConfig.DEBUG) {
            console.log("Getting initial lesson from agent...");
          }

          // Use the same prompt as the CLI version for consistency
          const lessonPrompt =
            "Based on my student profile, please suggest what we should work on in today's guitar lesson. Provide a specific exercise or technique to practice, and explain why it's important for my development as a blues/rock guitarist.";

          lesson = await this.getAgentResponse(lessonPrompt);

          if (window.GuitarTeacherConfig.DEBUG) {
            console.log("Got lesson from agent");
          }
        } catch (error) {
          console.log("Agent not available for initial lesson:", error.message);
          lesson = null; // Will use fallback below
        }
      }

      // Fallback to a focused lesson-style greeting if API not available
      if (!lesson) {
        lesson = `# Today's Guitar Focus: Blues Scale Foundation 🎸
## Your Lesson Plan

Based on your **intermediate level** and goals (timing, muting, bending, fretboard mastery), here's what we're working on:

### 🎯 **Today's Exercise: E Minor Pentatonic with Muting**

This combines **two** of your key goals - scale mastery and muting technique.

\`\`\`
E|---12----15---
B|-12--15-------
G|12--14--------  ← Start here (12th fret)
D|12--14--------
A|12--15--------
E|12----15------
\`\`\`

### 🔧 **Why This Matters**

1. **Foundation Scale**: 80% of blues/rock solos use this pattern
2. **Muting Practice**: Perfect for clean string control
3. **SRV Connection**: This exact pattern is in "Pride and Joy"

### 📚 **5-Minute Mission**

1. **Play the scale slowly** (60 BPM) - focus on **clean notes only**
2. **Add palm muting** on the lower strings (E, A, D)
3. **Listen for string noise** - eliminate every buzz and ring

### 🎵 **Quick Lick to Try**

\`\`\`
G|12--14b(15)--14-12----  ← Bend the 14th fret to sound like 15th
D|-------------------14-
\`\`\`

---

**Your Mission**: Practice this pattern for 5 minutes with **zero string noise**

**Progress Check**: Can you play it without looking at your fretting hand?

**Next Level**: This scale foundation leads to every John Mayer and SRV solo you love! 

${
  !window.GuitarTeacherConfig.USE_API
    ? "\n> **Note:** This is a sample lesson. [Set up the full AI agent](README.md#github-actions-secrets) for personalized, dynamic lessons!\n"
    : ""
}

Ready to dive deeper? Ask me about **bending technique** or **practice routines**! 🎸`;
      }

      // Simulate loading time (shorter since we're getting real content)
      await this.delay(1500);

      this.displayMessage(lesson, "teacher");
      this.enableInput();
    } catch (error) {
      console.error("Error loading initial greeting:", error);
      this.displayMessage(
        "Sorry, there was an error loading your guitar teacher. Please refresh the page.",
        "teacher",
      );
      this.enableInput();
    }
  }

  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message || this.isLoading) return;

    // Display user message
    this.displayMessage(message, "user");
    this.userInput.value = "";
    this.autoResizeTextarea();

    // Show loading
    this.setLoading(true);

    try {
      // Get response from agent
      const response = await this.getAgentResponse(message);
      this.displayMessage(response, "teacher");
    } catch (error) {
      console.error("Error getting response:", error);
      this.displayMessage(
        "Sorry, I had trouble processing your request. Please try again.",
        "teacher",
      );
    } finally {
      this.setLoading(false);
    }
  }

  async getAgentResponse(message) {
    // Check if API is enabled and available
    if (!window.GuitarTeacherConfig.USE_API) {
      if (window.GuitarTeacherConfig.DEBUG) {
        console.log("API disabled, using mock responses");
      }
      await this.delay(1500 + Math.random() * 1000);
      return this.getMockResponse(message.toLowerCase());
    }

    // Try to use the real API first, fall back to mock responses
    try {
      const response = await this.callGuitarTeacherAPI(message);
      return response;
    } catch (error) {
      console.log("API not available, using mock responses:", error.message);
      // Fallback to smart mock responses
      await this.delay(1500 + Math.random() * 1000);
      return this.getMockResponse(message.toLowerCase());
    }
  }

  async callGuitarTeacherAPI(message) {
    const API_BASE_URL = window.GuitarTeacherConfig.API_BASE_URL;

    // Always log the API URL being used to debug issues
    console.log("Using API_BASE_URL:", API_BASE_URL);

    if (window.GuitarTeacherConfig.DEBUG) {
      console.log("Calling API:", API_BASE_URL);
    }

    // Initialize session if needed
    if (!this.sessionId) {
      const initResponse = await fetch(`${API_BASE_URL}/agent/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: `web_${Date.now()}` }),
      });

      if (!initResponse.ok) {
        throw new Error(`Failed to initialize agent: ${initResponse.status}`);
      }

      const initData = await initResponse.json();
      this.sessionId = initData.sessionId;
      this.agentId = initData.agentId;

      if (window.GuitarTeacherConfig.DEBUG) {
        console.log("Agent initialized:", this.sessionId, this.agentId);
      }
    }

    // Send message to agent
    const chatResponse = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: this.sessionId,
        message: message,
      }),
    });

    if (!chatResponse.ok) {
      throw new Error(`Chat API failed: ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    return chatData.response;
  }

  getMockResponse(message) {
    // Smart mock responses for common guitar questions
    if (message.includes("blues") && message.includes("scale")) {
      return `# Blues Scale Exercise 🎸

Here's a focused **5-minute drill** for today:

## E Minor Pentatonic Blues Scale
\`\`\`
E|---12----15---
B|-12--15-------
G|12--14--------  ← Start here (12th fret)
D|12--14--------
A|12--15--------
E|12----15------
\`\`\`

## Today's Practice Routine:
1. **Warm-up** (60 seconds): Play the scale ascending/descending at 60 BPM
2. **Target Drill** (3 minutes): Focus on frets 12-15, aim for 80 BPM clean
3. **Creative Application** (90 seconds): Try this simple blues lick:

**Classic Lick:**
\`\`\`
G|12--14-12----12--14b(15)--14-12---
D|----------14--------------------14-
\`\`\`

## Pro Tip 💡
Keep your **thumb behind the neck** - not wrapped around. This gives you better control for bends.

---

**Next Step Drill:** Practice the basic scale pattern for 5 minutes today at 60 BPM. Focus on **even timing** - every note should sound deliberate.

**Progress Check:** How did the thumb position feel? Any tension?

**North Star:** This scale is the foundation of every John Mayer solo! 🎯`;
    }

    if (message.includes("muting") || message.includes("mute")) {
      return `# String Muting Mastery 🔇

**The #1 mistake I hear:** Strings ringing out when they shouldn't!

## Palm Muting Technique:
1. **Hand Position:** Rest the edge of your picking hand lightly on the strings near the bridge
2. **Pressure:** Just enough to dampen - not kill the sound completely
3. **Practice Pattern:**

\`\`\`
E|--0--X--0--X--0--X--0--X--  (X = muted hit)
Low E string - alternate picked and muted
\`\`\`

## Left Hand Muting:
- **Unused fingers** lightly touch adjacent strings
- Practice this chord and focus on clean, no buzz:

\`\`\`
E|---
B|--5--  ← Ring finger
G|--4--  ← Middle finger  
D|--2--  ← Index finger
A|---  ← Index finger mutes this too
E|---  ← Thumb or index mutes
\`\`\`

## 5-Minute Drill:
Play any **open chord** you know, but focus entirely on stopping unwanted string noise. Go slow!

---

**Next Step:** Practice 5 minutes of simple chord changes with **zero string noise**

**Progress Check:** Can you hear the difference between clean and muddy?

**North Star:** Clean muting = SRV-level tone control! 🎸`;
    }

    if (message.includes("bend") || message.includes("bending")) {
      return `# String Bending Precision 🎯

**The Secret:** Bending is about **pitch control**, not just pushing strings!

## Proper Bending Technique:

### 1. Finger Position
- Use your **ring finger** for most full-step bends
- **Support fingers:** Index and middle behind the ring finger
- **Thumb grip:** Wrap around the neck for leverage

### 2. Bending Motion
- Push the string **UP** (towards ceiling) on high strings
- Push **DOWN** (towards floor) on low strings  
- Use your **wrist and forearm** - not just finger strength

### 3. Target Practice:
\`\`\`
B|--15b(17)--  ← Bend 15th fret up to 17th fret pitch
G|--14b(16)--  ← Bend 14th fret up to 16th fret pitch
\`\`\`

## Core Exercise:
1. **Play the target note first** (17th fret) - memorize the pitch
2. **Now bend** the 15th fret to match that exact pitch
3. **Check yourself** - play the target note again

## 5-Minute Drill:
- Bend 15th fret B string to match 17th fret
- Hold for 2 seconds, release slowly
- Repeat 10 times, focusing on **exact pitch**

---

**Next Step:** Practice the "target and bend" method for 5 minutes daily

**Progress Check:** Can you hit the target pitch 8/10 times?

**North Star:** Hendrix-level bending precision! 🎸🔥`;
    }

    if (
      message.includes("practice") &&
      (message.includes("routine") || message.includes("plan"))
    ) {
      return `# Your Daily 15-Minute Practice Routine 📅

Here's a **structured plan** based on your goals:

## Warm-Up (3 minutes)
\`\`\`
1. Chromatic runs: 1-2-3-4 pattern, all frets 5-8
   Target: 60 BPM - focus on finger independence
   
2. Basic chord transitions: G-C-D-Em  
   2 beats per chord, smooth changes
\`\`\`

## Technical Focus (7 minutes)
**Today's Theme: String Muting + Scale Work**

\`\`\`
Minutes 4-6: Palm muting drill
- Low E string: down-up-muted-muted pattern
- Focus: clean attack, no ring-out

Minutes 7-10: E Minor Pentatonic (12th position)
- BPM Target: 70 BPM ascending/descending
- Focus: even timing, no rushed notes
\`\`\`

## Creative Application (5 minutes)
**Apply what you learned:**
1. Create a simple 12-bar blues progression
2. Use **only** the pentatonic notes you practiced
3. Add **palm muting** on rhythm parts

\`\`\`
| G | G | G | G |
| C | C | G | G |  
| D | C | G | G |
\`\`\`

---

**Today's Mission:** Master the muting + pentatonic combo

**Tomorrow's Check:** "Did I get cleaner sound with less string noise?"

**Weekly Goal:** Build this into muscle memory - John Mayer didn't get there overnight! 🎯`;
    }

    if (message.includes("chord") || message.includes("progression")) {
      return `# Chord Mastery Workshop 🎵

Let's work on **clean chord transitions** - the foundation of great rhythm playing!

## Essential Progression: **I-V-vi-IV**
*The most important progression in popular music!*

### In Key of G:
\`\`\`
G Major    D Major    E minor    C Major
x-x-0-0-3-3  x-x-0-2-3-2  0-2-2-0-0-0  x-3-2-0-1-0
\`\`\`

## Practice Method: **"Anchor Fingers"**
- **G to D:** Keep 3rd finger planted (3rd fret)
- **D to Em:** 2nd finger stays (2nd fret)  
- **Em to C:** 2nd finger pivot point

## 5-Minute Drill:
1. **Static hold:** 30 seconds per chord, perfect finger placement
2. **Slow transitions:** 4 beats per chord, 60 BPM
3. **Strumming pattern:** Down-Down-Up-Up-Down-Up

## Muting Challenge:
Every chord change should be **silent between chords** - lift fingers completely, then place all at once.

---

**Next Step:** Practice this progression for 5 minutes with metronome

**Progress Check:** Can you change chords without looking at your fret hand?

**North Star:** This progression is in thousands of hit songs - master it! 🎸`;
    }

    // Default response for other questions
    return `# Great Question! 🎸

I'm here to help with your guitar journey. Based on what you're asking about, here are some areas I can dive deep into:

## 🎯 **Core Techniques**
- **String muting** and clean execution
- **Bending** with pitch precision  
- **Timing and rhythm** development
- **Scale patterns** and fretboard visualization

## 📚 **Structured Practice**
- **15-30 minute routines** tailored to your goals
- **Progressive exercises** with target BPMs
- **Blues and rock applications**

## 🚀 **Your Current Focus Areas**
Remember, your goals are: *timing, muting, bending, fretboard understanding, scales mastery, and soloing*

---

**Try asking:**
- *"Show me a bending exercise"*
- *"Help with chord transitions"*  
- *"Create a practice routine"*
- *"Explain the CAGED system"*

What specific technique would you like to work on right now? Let's get your fingers moving! 🎸`;
  }

  displayMessage(content, type) {
    // Remove initial loading if it's still there
    if (this.initialLoading && this.initialLoading.parentElement) {
      this.initialLoading.parentElement.parentElement.remove();
    }

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    if (type === "teacher") {
      // Render markdown for teacher messages
      contentDiv.innerHTML = marked.parse(content);
    } else {
      // Plain text for user messages
      contentDiv.textContent = content;
    }

    messageDiv.appendChild(contentDiv);
    this.messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.userInput.disabled = loading;
    this.sendBtn.disabled = loading;

    if (loading) {
      // Show loading message
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "message teacher-message";
      loadingDiv.innerHTML = `
                <div class="message-content">
                    <div class="loading">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
      this.messagesContainer.appendChild(loadingDiv);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      this.currentLoadingMessage = loadingDiv;
    } else {
      // Remove loading message
      if (this.currentLoadingMessage) {
        this.currentLoadingMessage.remove();
        this.currentLoadingMessage = null;
      }
    }
  }

  enableInput() {
    this.userInput.disabled = false;
    this.sendBtn.disabled = false;
    this.userInput.focus();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GuitarTeacher();
});
