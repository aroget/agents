# 🎸 Guitar Teacher Pro

A complete AI guitar instructor with terminal CLI and web interface.

## What's Inside

- **`public/`** - Web interface for browser-based guitar lessons
- **`api/`** - Backend API that powers the web interface
- **`agents/`** - AI agent definitions for guitar instruction
- **`index.js`** - Terminal CLI version for command-line practice
- **`config.js`** - Your guitar profile and learning preferences

## Quick Start Options

### 🌐 **Web Interface (Recommended)**

Modern browser-based guitar teacher with chat interface:

```bash
# See public/README.md for full web setup instructions
cd public && npx http-server -p 3001
# Visit http://localhost:3001
```

### 💻 **Terminal CLI**

Original command-line guitar teacher:

```bash
pnpm install
pnpm start
```

### 🚀 **Full Deployment**

Automated deployment with GitHub Actions:

- See [Web Interface README](public/README.md) for GitHub Actions setup
- Both API and frontend deploy automatically on push to main

## Key Files

| File                                   | Purpose                             |
| -------------------------------------- | ----------------------------------- |
| [`public/README.md`](public/README.md) | **Web interface setup guide**       |
| [`config.js`](config.js)               | Your guitar profile and preferences |
| [`api/index.js`](api/index.js)         | Backend server for web interface    |
| [`index.js`](index.js)                 | Terminal CLI guitar teacher         |

## Your Guitar Profile

Customize your learning in [`config.js`](config.js):

```javascript
export const config = {
  profile: {
    experience_level: "intermediate",
    instruments: ["electric guitar"],
    genres: ["blues", "rock", "country"],
    artists: ["John Mayer", "Stevie Ray Vaughan"],
    goals: ["improve timing", "better muting", "bending skills"],
  },
};
```

## Development Commands

```bash
# Terminal CLI
pnpm start              # Interactive guitar teacher
pnpm dev               # Same as start

# Web Interface
npm run web:serve      # Serve frontend locally
npm run api:dev        # Run backend API
npm run api:install    # Install API dependencies

# Deployment
npm run deploy:vercel  # Deploy to Vercel (manual)
```

---

**Ready to learn guitar?** 🎸

- **Quick demo**: Try the web interface in `public/`
- **Full setup**: Follow the [Web Interface README](public/README.md)
- **Terminal use**: Run `pnpm start` for CLI version
