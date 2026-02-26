# AI Fitness Coach - 3-Agent Coaching System

An automated fitness coaching system that analyzes your training data from intervals.icu using a sophisticated 3-agent architecture powered by Mistral AI. The system provides personalized coaching feedback based on Stephen Seiler's polarized training methodology through specialized AI agents working in coordination.

## 🏗️ Multi-Agent Architecture

The coaching system uses three specialized AI agents that work together to provide comprehensive analysis:

### 🔬 **Vitals Sentinel** (Wellness Agent)

- **Role**: Recovery & Readiness Analysis
- **Focus**: HRV, RHR, sleep quality, and physiological markers
- **Output**: Recovery status, readiness score, and wellness constraints

### 🎯 **Polarized Pro** (Training Methodology Agent)

- **Role**: Training Strategy & Methodology
- **Focus**: Stephen Seiler's 80/20 polarized training principles
- **Output**: Training recommendations and methodology-specific guidance

### 👨‍💼 **Director Sportif** (Head Coach Agent)

- **Role**: Final Decision Making & Synthesis
- **Focus**: Combines wellness constraints with training methodology
- **Output**: Final coaching decision and actionable daily training plan

## Features

- 🤖 **3-Agent AI System**: Specialized agents for wellness, strategy, and final decisions
- 📊 **Intervals.icu Integration**: Fetches workout and wellness data automatically
- 🏃‍♂️ **Polarized Training Focus**: Implements Stephen Seiler's 80/20 training philosophy
- 📝 **Automated Feedback**: Posts coaching analysis directly to your intervals.icu calendar
- ⚡ **Recovery-First Approach**: Wellness analysis overrides training plans when needed
- 🎯 **Intelligent Synthesis**: Head coach combines multiple expert analyses

## Setup

### Prerequisites

- Node.js (v18+)
- pnpm package manager
- intervals.icu account with API access
- Mistral AI API key

### Installation

1. **Clone and navigate to the project**:

   ```bash
   cd /path/to/your/project
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables** (see below)

### Environment Variables

Create a `.env` file with the following variables:

```env
# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key_here

# Intervals.icu API
ATHLETE_ID=your_athlete_id
API_KEY=your_intervals_api_key

# Data Storage
DOWNLOAD_DIR=./training # location to dump the training data
```

#### Getting Your API Keys

**Mistral AI API Key**:

1. Sign up at [mistral.ai](https://mistral.ai)
2. Navigate to API section in your dashboard
3. Generate a new API key

**Intervals.icu API**:

1. Log into your intervals.icu account
2. Go to Settings → Developer → API Key
3. Your athlete ID is in the URL: `intervals.icu/athlete/i123456` (use `i123456`)

## Usage

### Run the AI Coach

```bash
node index.js
```

The 3-agent system will execute in sequence:

1. 🔧 **Initialize Agents**: Create specialized Vitals Sentinel, Polarized Pro, and Director Sportif agents
2. 📥 **Fetch Data**: Download last 2 weeks of training/wellness data from intervals.icu
3. 🔬 **Wellness Analysis**: Vitals Sentinel analyzes recovery status and readiness
4. 🎯 **Training Strategy**: Polarized Pro provides methodology-specific recommendations
5. 👨‍💼 **Final Decision**: Director Sportif synthesizes both analyses into actionable guidance
6. 📅 **Post Results**: Upload final coaching decision to intervals.icu calendar

### Sample Console Output

```
🏃‍♂️ Starting 3-Agent Fitness Analysis Pipeline
==================================================
🔧 Initializing agents...
📝 Setting up coaching staff instructions...
🔬 STEP 1: Vitals Sentinel - Wellness Analysis
📊 Vitals Sentinel Output:
Status: READY (Green) - HRV stable, RHR normal
------------------------------
🎯 STEP 2: Polarized Pro - Training Analysis
🏋️ Polarized Pro Output:
Zone distribution: 82% Z1, 16% Z2, 2% Z3 - Good adherence
------------------------------
👨‍💼 STEP 3: Director Sportif - Final Decision
🎖️ FINAL COACH DECISION:
Today: 60min Zone 1 base ride. Recovery metrics green-light intensity.
==================================================
✅ 3-Agent AI Coach Pipeline completed successfully
```

### Automation

You can automate daily coaching using either GitHub Actions (recommended) or local cron jobs:

#### Option 1: GitHub Actions (Recommended)

**Advantages**: Free hosting, reliable execution, no local machine dependency, version control integration.

1. **Create GitHub workflow file** `.github/workflows/daily-coaching.yml`:

```yaml
name: Daily AI Fitness Coaching

on:
  schedule:
    # Run every day at 8:00 AM UTC (adjust timezone as needed)
    - cron: "0 8 * * *"
  workflow_dispatch: # Allow manual trigger

jobs:
  coaching:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest

      - name: Install dependencies
        run: pnpm install

      - name: Run AI Coaching
        env:
          MISTRAL_API_KEY: ${{ secrets.MISTRAL_API_KEY }}
          ATHLETE_ID: ${{ secrets.ATHLETE_ID }}
          API_KEY: ${{ secrets.INTERVALS_API_KEY }}
          DOWNLOAD_DIR: ./training
        run: node index.js
```

2. **Configure Repository Secrets**:

   Go to your GitHub repository → Settings → Secrets and variables → Actions, then add:
   - `MISTRAL_API_KEY`: Your Mistral AI API key
   - `ATHLETE_ID`: Your intervals.icu athlete ID (e.g., `i123456`)
   - `INTERVALS_API_KEY`: Your intervals.icu API key

3. **Test the workflow**:
   - Go to Actions tab in your GitHub repository
   - Select "Daily AI Fitness Coaching"
   - Click "Run workflow" to test manually
   - Check the logs to ensure it runs successfully

4. **Customize schedule**:
   - Modify the cron expression in the workflow file
   - Use [crontab.guru](https://crontab.guru) to generate custom schedules
   - Remember GitHub Actions uses UTC time

#### Option 2: Local Cron Job

**Advantages**: Full control, no external dependencies, immediate execution.

```bash
# Edit your crontab
crontab -e

# Add this line to run every day at 8 AM local time
0 8 * * * cd /path/to/your/fitness/project && node index.js >> ~/coaching.log 2>&1
```

#### Timezone Considerations

- **GitHub Actions**: Runs in UTC timezone
- **Local Cron**: Uses your system's timezone
- Adjust the cron schedule accordingly for your preferred coaching time

## Project Structure

```
fitness/
├── index.js                     # Main 3-agent pipeline orchestrator
├── agents/
│   ├── wellness/               # Vitals Sentinel Agent
│   │   └── agent.js           # Recovery & wellness analysis
│   ├── polarized/             # Polarized Pro Agent
│   │   └── agent.js           # Training methodology specialist
│   └── headcoach/             # Director Sportif Agent
│       └── agent.js           # Final decision synthesis
├── intervals/
│   ├── wellness.js            # Fetch training & wellness data
│   └── add-note.js            # Post analysis to intervals.icu
├── training/                  # Local data storage (auto-created)
├── config.js                  # Athlete profile configuration
├── package.json
├── .env                       # Environment variables
└── README.md
```

## 🔄 Agent Workflow

The system follows a structured 3-step analysis pipeline:

```
1. 🔬 VITALS SENTINEL
   ↓ (Wellness Analysis)
   Input: Raw wellness & training data
   Output: Recovery status, readiness constraints

2. 🎯 POLARIZED PRO
   ↓ (Training Strategy)
   Input: Raw training data (independent analysis)
   Output: Methodology-specific recommendations

3. 👨‍💼 DIRECTOR SPORTIF
   ↓ (Final Decision)
   Input: Wellness constraints + Training recommendations
   Output: Final coaching decision & daily plan
```

This architecture ensures:

- **Separation of Concerns**: Each agent focuses on their expertise
- **Independent Analysis**: Wellness and training agents avoid bias
- **Executive Oversight**: Head coach synthesizes and makes final calls
- **Constraint Handling**: Recovery status can override training plans

## Athlete Profile

The coach is configured for an athlete profile defined in `config.js`:

```javascript
const athleteProfile = {
  age: 41,
  weight: 78,
  cycling_ftp: 250,
  running_threshold: "4:52", // min/km
  max_hr: 190,
  rhr: 49, // resting heart rate
  hrv: 80, // heart rate variability baseline
};
```

Modify these values to match your personal metrics.

## Coaching Philosophy & Agent Specialization

### 🔬 **Vitals Sentinel Philosophy**

- **Recovery-First Approach**: Physiological readiness overrides all training plans
- **Trend Analysis**: 14-day rolling averages of HRV, RHR, sleep quality
- **Warning Triggers**: HRV >10% below average, RHR >5 bpm above baseline
- **Decision Matrix**: Green/Yellow/Red recovery status with specific constraints

### 🎯 **Polarized Pro Methodology**

Implements **Stephen Seiler's Polarized Training Model**:

- **80/20 Rule**: 80% low intensity (Zone 1), 20% high intensity (Zone 3+)
- **Black Hole Training**: Warns against excessive Zone 2 (moderate intensity)
- **Efficiency Factor**: Monitors power-to-heart-rate ratio trends
- **Plateau Detection**: Identifies when fitness gains have stagnated

### 👨‍💼 **Director Sportif Decision Framework**

- **Constraint Integration**: Wellness status overrides methodology recommendations
- **Sport Prioritization**: Balances cycling/running based on recent activity gaps
- **Intensity Modulation**: Downgrades intensity while maintaining sport specificity
- **Executive Decisions**: Final authority on daily training prescriptions

## 🚀 Deployment & Scaling

The multi-agent architecture is designed for:

### **GitHub Actions (Recommended)**

- **Parallel Agent Execution**: Each agent can run independently
- **Fault Tolerance**: Pipeline continues if individual agents fail
- **Cost Efficiency**: Only activates when scheduled
- **Multi-Athlete Support**: Easy to scale for coaching multiple athletes

### **Containerization Ready**

```dockerfile
# Each agent can be containerized separately
FROM node:18-alpine
COPY agents/wellness/ /app/
RUN pnpm install
CMD ["node", "agent.js"]
```

### **API Deployment Options**

- Convert to REST API for real-time coaching requests
- WebSocket integration for live training guidance
- Mobile app integration via API endpoints

## Sample Output

The AI coach posts structured analysis to your calendar:

```
---

**Wednesday, February 25, 2026**

**Readiness Score:** 7/10

**Readiness Description:**
You are in a recovery phase following a high-load week. HRV is stable, and RHR is within baseline, but yesterday's low training load and recent fatigue accumulation suggest a need for continued recovery focus. Today is about maintaining movement without adding stress.

---

## Yesterday Session Analysis

**Session:** Easy Ride (2026-02-24)
- **Duration:** 1h00m
- **TSS:** 30, **IF:** 0.54
- **Time in Zones:** Z1: 53.6%, Z2: 45.3%, Z3: 1.1%
- **Efficiency Factor (EF):** 1.12, **Power/HR:** 1.09
- **Decoupling:** 6.3%

**Compliance:**
- The session was appropriately easy, with 98.9% of the ride in Z1-Z2, aligning well with polarized training principles. No "black hole" training detected.

---

## The Problem

- **Fatigue Accumulation:** ATL (Acute Training Load) remains elevated at 44, despite a planned recovery day. This suggests residual fatigue from the previous week's high volume.
- **HRV Stability:** HRV is within normal range (84 ms), but the trend shows fluctuation over the past week, indicating some autonomic stress.
- **Reduced Training Load:** Yesterday's TSS of 30 is low, but the lack of complete rest days in the last two weeks may be contributing to lingering fatigue.
- **Sleep Quality:** Sleep score has been variable, with a dip to 70 on 2026-02-21, which may have impacted recovery.

---

## The Prescription

- **Today's Workout:**
  - **Session:** Z1 Recovery Run
  - **Duration:** 45-60 minutes
  - **Intensity:** Strictly Z1 (<138 bpm, <75% Max HR)
  - **Focus:** Maintain easy pace, prioritize form, and avoid any surges into Z2. This is about active recovery, not fitness gains.

- **Recovery Actions:**
  - **Sleep:** Aim for >8 hours. Monitor sleep quality and consistency.
  - **Nutrition:** Ensure adequate carbohydrate intake to replenish glycogen stores, and prioritize protein for muscle repair.
  - **Hydration:** Maintain hydration levels, especially given the indoor training sessions.

- **Next 48hrs:**
  - **Monitor HRV/RHR:** If HRV drops >10% below your 7-day average or RHR rises >5 bpm, take an unplanned rest day.
  - **Avoid Intensity:** No Z3+ efforts until ATL drops below 40 and HRV stabilizes above 85 ms.
  - **Mobility Work:** Incorporate 10-15 minutes of daily mobility/stretching to aid recovery.

---

## Key Metrics Summary

| Metric               | Current Value | Trend/Notes                                  |
|----------------------|---------------|----------------------------------------------|
| **CTL (Fitness)**    | 45.9          | Slight decline; expected during recovery.    |
| **ATL (Fatigue)**    | 44.4          | Elevated; needs monitoring.                  |
| **TSB (Form)**       | +1.5          | Positive; indicates recovery is underway.    |
| **HRV**              | 84 ms         | Stable but variable; watch for downward trend.|
| **RHR**              | 49 bpm        | Within baseline; no red flags.               |
| **Sleep Score**      | 87            | Improved; maintain consistency.              |
| **Weekly Z1/Z2/Z3**  | 80/19/1       | Polarized distribution is on point.          |

---
```

## API Integration

### Intervals.icu Endpoints Used

- `GET /athlete/{id}/activities` - Fetch workout history
- `GET /athlete/{id}/wellness/{date}` - Get daily wellness metrics
- `POST /athlete/{id}/events` - Create calendar events with coaching notes

### Mistral AI Multi-Agent Integration

- **3-Agent Creation**: Specialized agents for wellness, training, and decision-making
- **Sequential Conversations**: Structured pipeline with agent handoffs
- **Context Preservation**: Outputs from earlier agents inform later decisions
- **Model**: Uses `mistral-large-latest` for all agent reasoning
- **Conversation API**: Each agent processes specific data and generates targeted analysis

### Agent Communication Flow

```javascript
// 1. Vitals Sentinel analyzes wellness data
const wellnessAnalysis = await client.beta.conversations.start({
  agentId: vitalsSentinelAgent.id,
  inputs: JSON.stringify(trainingData),
});

// 2. Polarized Pro analyzes training methodology
const strategyAnalysis = await client.beta.conversations.start({
  agentId: polarizedProAgent.id,
  inputs: JSON.stringify(trainingData),
});

// 3. Director Sportif makes executive decision
const finalDecision = await client.beta.conversations.start({
  agentId: directorSportifAgent.id,
  inputs: `Wellness: ${wellnessAnalysis} Strategy: ${strategyAnalysis}`,
});
```

## Troubleshooting

### Common Issues

**"No wellness data found"**

- Check that you're logging HRV, sleep, or other wellness metrics in intervals.icu
- Ensure the date format matches your timezone

**"API authentication failed"**

- Verify your intervals.icu API key in Settings → Developer
- Check that ATHLETE_ID matches your intervals.icu URL

**"Mistral API error"**

- Confirm your Mistral API key is valid and has credits
- Check the Mistral API status page for outages

### Debug Mode

Add debugging to see detailed API responses:

```javascript
console.log("Debug data:", JSON.stringify(response, null, 2));
```

## Development

### Adding New Agents

To add a new specialized agent (e.g., Nutrition Agent):

1. **Create agent directory**:

   ```
   agents/nutrition/
   └── agent.js
   ```

2. **Implement agent creator**:

   ```javascript
   export default async (client) => {
     return await client.beta.agents.create({
       model: "mistral-large-latest",
       name: "Nutrition Specialist",
       instructions:
         "Analyze dietary patterns and provide nutrition guidance...",
       tools: [{ type: "code_interpreter" }],
     });
   };
   ```

3. **Update orchestrator** in `index.js`:
   ```javascript
   const nutritionAgent = await nutritionSpecialist(client);
   const nutritionAnalysis = await client.beta.conversations.start({
     agentId: nutritionAgent.id,
     inputs: nutritionData,
   });
   ```

### Customizing Agent Instructions

Each agent's behavior is defined in their respective `agent.js` files:

- **Vitals Sentinel** (`agents/wellness/agent.js`): Modify recovery thresholds and wellness parameters
- **Polarized Pro** (`agents/polarized/agent.js`): Adjust training methodology and zone distributions
- **Director Sportif** (`agents/headcoach/agent.js`): Change decision-making logic and output formatting

### Adding New Metrics

To track additional wellness metrics, modify the `fetchFullData()` function in `intervals/wellness.js`:

```javascript
const additionalMetrics = {
  bodyFat: wellness.bodyFat,
  vo2max: wellness.vo2max,
  // Add other metrics from intervals.icu API
};
```

### Agent Testing & Debugging

Test individual agents in isolation:

```javascript
// Test wellness agent only
const wellnessAgent = await vitalsSentinel(client);
const result = await client.beta.conversations.start({
  agentId: wellnessAgent.id,
  inputs: testData,
});
console.log("Wellness Agent Output:", result.outputs[0].content);
```

## License

MIT License - feel free to modify and adapt for your training needs.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Test with your intervals.icu data
4. Submit a pull request

---

_Built for endurance athletes who want expert-level, multi-perspective coaching through specialized AI agents._
