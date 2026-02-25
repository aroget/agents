# 🎸 Guitar Teacher Pro

An AI-powered guitar instructor specialized in blues and rock techniques, with a web interface for interactive lessons.

## Quick Start

### 🚀 **Automatic Deployment (Recommended)**

The easiest way to get started is with GitHub Actions automatic deployment:

1. **Fork this repository**
2. **Set up Vercel secrets** in your GitHub repository:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add these secrets:
     - `VERCEL_TOKEN` - Your Vercel API token
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID
     - `MISTRAL_API_KEY` - Your Mistral AI API key

3. **Push to main branch** or manually trigger the workflow
   - The GitHub Action will automatically deploy your API and frontend
   - Your guitar teacher will be live at `https://yourusername.github.io/your-repo-name`

## API Backend Setup

The frontend needs an API backend to communicate with Mistral AI. Choose one option:

### Option 1: Vercel (Recommended)

Deploy the API to Vercel for free:

```bash
# In your project root
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:

- `MISTRAL_API_KEY` - Your Mistral AI API key

### Option 2: Netlify Functions

Deploy to Netlify with serverless functions:

```bash
# Install Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: Your Own Server

Host the API anywhere that supports Node.js:

```bash
cd api
npm install
MISTRAL_API_KEY=your_key_here npm start
```

## GitHub Pages Deployment

1. **Enable GitHub Pages** in your repository settings
2. **Set source** to the `docs/` folder or main branch
3. **Update API endpoint** in `script.js` (line 87)
4. **Push changes** and your site will be live!

## File Structure

```
docs/                 # GitHub Pages directory
├── index.html       # Main chat interface
├── style.css        # Guitar-themed styling
├── script.js        # Chat functionality
└── README.md        # This file

api/                 # Backend API (deploy separately)
├── index.js         # Express server
├── guitar-agent.js  # Mistral AI integration
└── package.json     # Dependencies
```

## Customization

### Guitar Profile

Edit the profile in `mistral/guitar/config.js`:

```javascript
export const config = {
  profile: {
    experience_level: "intermediate", // beginner, intermediate, advanced
    instruments: ["electric guitar"],
    genres: ["blues", "rock", "country"],
    artists: ["John Mayer", "SRV"], // Your influences
    goals: ["improve timing", "better muting technique", "bending skills"],
    available_time: "30min", // Daily practice time
  },
};
```

### Styling

The interface uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #1a1a1a; /* Dark background */
  --accent-color: #ff6b35; /* Orange highlights */
  --text-light: #ffffff; /* Text color */
}
```

## Smart Mock Responses

The interface includes intelligent mock responses for testing without the API:

- **Blues scale exercises** with fretboard diagrams
- **String muting** techniques and drills
- **Bending** precision exercises
- **Practice routines** tailored to your level
- **Chord progressions** with fingering tips

## Advanced Features

### Real-time Agent Integration

When connected to the API, you get:

- ✅ **Persistent conversations** with memory
- ✅ **Image generation** for chord diagrams
- ✅ **Web search** for technique references
- ✅ **Progress tracking** across sessions
- ✅ **Personalized feedback** based on your profile

### Practice Session Logging

The agent tracks your progress and provides:

- 📊 **Practice statistics**
- 📈 **Skill progression tracking**
- 🎯 **Personalized goals and challenges**
- 📝 **Session notes and feedback**

## Troubleshooting

### Common Issues

**🔧 API Connection Failed**

- Check your API endpoint URL in `script.js`
- Verify your Mistral API key is set correctly
- Ensure your API backend is deployed and running

**🔧 Styling Issues**

- Clear browser cache and refresh
- Check CSS file is loading correctly
- Verify all paths are relative to docs/ folder

**🔧 Markdown Not Rendering**

- Ensure marked.js library is loading from CDN
- Check browser console for JavaScript errors

### Mock Mode

If you can't set up the API right away, the interface works in "mock mode" with pre-programmed responses for common guitar questions.

## Contributing

Want to improve the guitar teacher? Here's how:

1. **Fork the repository**
2. **Create a feature branch**
3. **Add guitar-specific responses** in `script.js`
4. **Test with different practice scenarios**
5. **Submit a pull request**

### Adding New Response Patterns

In `script.js`, add new patterns to `getMockResponse()`:

```javascript
if (message.includes("sweep") && message.includes("picking")) {
  return `# Sweep Picking Fundamentals 🎸
    // Your sweep picking lesson here...`;
}
```

## License

MIT License - Feel free to use this for your own guitar learning projects!

---

**Ready to rock?** 🎸 Set up your API backend and start learning with your personal AI guitar instructor!
