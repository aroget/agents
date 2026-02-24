# AI Fitness Coach - Mistral Agent

An automated fitness coaching system that analyzes your training data from intervals.icu using Mistral AI and provides personalized coaching feedback based on Stephen Seiler's polarized training methodology.

## Features

- 🤖 **AI-Powered Analysis**: Uses Mistral's large language model to analyze training data
- 📊 **Intervals.icu Integration**: Fetches workout and wellness data automatically  
- 🏃‍♂️ **Polarized Training Focus**: Implements Stephen Seiler's 80/20 training philosophy
- 📝 **Automated Feedback**: Posts coaching analysis directly to your intervals.icu calendar
- ⚡ **Recovery Monitoring**: Analyzes HRV, RHR, sleep quality, and training load
- 🎯 **Plateau Detection**: Identifies efficiency factor trends and training stagnation

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

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see below)

### Environment Variables

Create a `.env` file with the following variables:

```env
# Mistral AI
MISTRAL_API_KEY=your_mistral_api_key_here

# Intervals.icu API
ATHLETE_ID=your_athlete_id
API_KEY=your_intervals_api_key

# Data Storage
DOWNLOAD_DIR=./training
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

The system will:
1. ✅ Create a Mistral AI agent with coaching instructions
2. 📥 Fetch your last 2 weeks of training data from intervals.icu
3. 🧠 Analyze your training load, recovery metrics, and efficiency trends
4. 📝 Generate personalized coaching feedback
5. 📅 Post the analysis to today's calendar entry in intervals.icu

### Automation

You can automate daily coaching by setting up a cron job:

```bash
# Run every day at 8 AM
0 8 * * * cd /path/to/project && node index.js
```

## Project Structure

```
fitness/
├── index.js                 # Main application entry point
├── intervals/
│   ├── wellness.js         # Fetch training & wellness data
│   └── add-note.js         # Post analysis to intervals.icu
├── training/               # Local data storage (auto-created)
├── package.json
├── .env                    # Environment variables
└── README.md
```

## Athlete Profile

The coach is configured for an athlete profile in `index.js`:

```javascript
const athleteProfile = {
  age: 41,
  weight: 78,
  cycling_ftp: 250,
  running_threshold: "4:52", // min/km
  max_hr: 190,
  rhr: 49,      // resting heart rate
  hrv: 80,      // heart rate variability baseline
};
```

Modify these values to match your personal metrics.

## Coaching Philosophy

The AI coach implements **Stephen Seiler's Polarized Training Model**:

- **80/20 Rule**: 80% low intensity (Zone 1), 20% high intensity (Zone 3+)
- **Black Hole Training**: Warns against excessive Zone 2 (moderate intensity)
- **Efficiency Factor**: Monitors power-to-heart-rate ratio trends
- **Recovery Priority**: Overrides training when HRV/RHR indicate poor recovery
- **Plateau Detection**: Identifies when fitness gains have stagnated

## Sample Output

The AI coach posts structured analysis to your calendar:

```
📅 2026-02-24 | Training Status: Recovered | Readiness: 8/10

## The Problem
- Zone 2 "Black Hole" detected: 25% of weekly volume in threshold zone
- Efficiency Factor declining despite stable CTL
- HRV 15% below 7-day average

## The Prescription  
- Next 3 days: Zone 1 only (HR <138 bpm)
- Saturday: 4x8min intervals @ 285W
- Skip tempo work until EF improves

🚴‍♂️ Today's Workout: 90min Zone 1 ride (60% Z1, HR cap 140bpm)
```

## API Integration

### Intervals.icu Endpoints Used

- `GET /athlete/{id}/activities` - Fetch workout history
- `GET /athlete/{id}/wellness/{date}` - Get daily wellness metrics
- `POST /athlete/{id}/events` - Create calendar events with coaching notes

### Mistral AI Integration

- **Agent Creation**: Custom coaching agent with specialized instructions
- **Conversation API**: Processes training data and generates analysis
- **Model**: Uses `mistral-large-latest` for comprehensive analysis

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

### Adding New Metrics

To track additional wellness metrics, modify the `fetchFullData()` function in `intervals/wellness.js`:

```javascript
const additionalMetrics = {
  bodyFat: wellness.bodyFat,
  vo2max: wellness.vo2max,
  // Add other metrics from intervals.icu API
};
```

### Customizing Coaching Style

Edit the agent instructions in `getOrCreateAgent()` to modify:
- Feedback tone (currently blunt/scientific)
- Training philosophy  
- Analysis focus areas
- Output formatting

## License

MIT License - feel free to modify and adapt for your training needs.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Test with your intervals.icu data
4. Submit a pull request

---

*Built for endurance athletes who want data-driven, no-nonsense coaching feedback.*