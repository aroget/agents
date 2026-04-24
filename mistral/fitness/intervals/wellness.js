import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ quiet: true });

// --- CONFIGURATION ---
const ATHLETE_ID = process.env.ATHLETE_ID;
const API_KEY = process.env.API_KEY;
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR;

if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

export async function fetchFullData(from, to) {
  const auth = Buffer.from(`API_KEY:${API_KEY}`).toString("base64");

  // Define Endpoints
  const activitiesUrl = `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/activities?newest=${to}&oldest=${from}`;
  const wellnessUrl = `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/wellness.json?newest=${to}&oldest=${from}`;
  const notesUrl = `https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/events?oldest=${from}&newest=${to}`;

  try {
    console.log("Fetching data from Intervals.icu...");

    const headers = { Authorization: `Basic ${auth}` };

    // Fetch both simultaneously
    const [actRes, wellRes, notesRes] = await Promise.all([
      fetch(activitiesUrl, { headers }),
      fetch(wellnessUrl, { headers }),
      fetch(notesUrl, { headers }),
    ]);

    const activities = await actRes.json();
    const notes = actRes.ok && activities.length > 0 ? await notesRes.json() : [];
    const activitiesWithNotes = activities.map((activity) => {
      const activityDate = activity.start_date_local.split("T")[0]; // Extract date part

      // Find notes for this activity date
      const matchingNotes = notes.filter((note) => {
        const noteDate = note.date || note.start_date_local?.split("T")[0];
        return noteDate === activityDate;
      });

      // Combine notes into single coach note or keep as array
      const coachNotes =
        matchingNotes.length > 0
          ? matchingNotes
              .map((note) => note.description || note.name || note.text)
              .join("\n")
          : null;

      return {
        ...activity,
        coachNotes,
      };
    });

    let wellness = [];
    if (wellRes.ok) {
      wellness = await wellRes.json();
      console.log(`Fetched ${wellness.length} days of wellness data`);
    } else {
      console.log(`Failed to fetch wellness data (${wellRes.status})`);
    }

    const twoWeekSnapshot = {
      period: `${from} to ${to}`,
      activities: activitiesWithNotes,
      wellness: wellness,
    };

    const filePath = path.join(DOWNLOAD_DIR, `training_${to}.json`);
    fs.writeFileSync(filePath, JSON.stringify(twoWeekSnapshot, null, 2));

    console.log(
      `${wellness.length} days of training and wellness data fetched successfully.`,
    );
    return twoWeekSnapshot;
  } catch (error) {
    console.error("Data Pull Failed:", error.message);
  }
}
