import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ silent: true });

// --- CONFIGURATION ---
const ATHLETE_ID = process.env.ATHLETE_ID;
const API_KEY = process.env.API_KEY;
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR;

if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

export async function fetchFullData() {
  const auth = Buffer.from(`API_KEY:${API_KEY}`).toString("base64");
  const today = new Date().toISOString().split("T")[0];
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Define Endpoints
  const activitiesUrl = `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/activities?newest=${today}&oldest=${twoWeeksAgo}`;
  const wellnessUrl = `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/wellness/${today}`;

  try {
    console.log("Fetching data from Intervals.icu...");

    const headers = { Authorization: `Basic ${auth}` };

    // Fetch both simultaneously
    const [actRes, wellRes] = await Promise.all([
      fetch(activitiesUrl, { headers }),
      fetch(wellnessUrl, { headers }),
    ]);

    const activities = await actRes.json();

    let wellness = "No wellness data logged today";
    if (wellRes.ok) {
      wellness = await wellRes.json();
    } else {
      console.log(`No wellness data for ${today} (${wellRes.status})`);
    }

    const dailySnapshot = {
      date: today,
      workouts: activities,
      recovery: wellness,
    };

    const filePath = path.join(DOWNLOAD_DIR, `daily_${today}.json`);
    fs.writeFileSync(filePath, JSON.stringify(dailySnapshot, null, 2));

    console.log("Data fetched and saved successfully.");
    return dailySnapshot;
  } catch (error) {
    console.error("Data Pull Failed:", error.message);
  }
}
