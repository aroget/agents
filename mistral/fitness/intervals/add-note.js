import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

export async function postNoteToIntervals(noteContent) {
  console.log("Adding note to Intervals.icu calendar...");
  const auth = Buffer.from(`API_KEY:${process.env.API_KEY}`).toString("base64");

  // Format as local datetime (YYYY-MM-DDTHH:mm:ss)
  const now = new Date();
  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    "T" +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  // Create a calendar event for today with AI coach analysis
  const eventsUrl = `https://intervals.icu/api/v1/athlete/${process.env.ATHLETE_ID}/events`;

  const body = {
    category: "NOTE",
    start_date_local: today,
    name: "🤖 AI Coach Analysis",
    description: noteContent,
    show_on_calendar: true,
  };

  try {
    console.log(`Creating event at: ${eventsUrl}`);

    const response = await fetch(eventsUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Note added successfully");
      return result;
    } else {
      const errorText = await response.text();
      console.error("Failed to add note:");
      console.error("Response:", errorText);
      return null;
    }
  } catch (error) {
    console.error("❌ Error posting note:", error);
    return null;
  }
}
