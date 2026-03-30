import "dotenv/config";

import { sendEmail } from "./sendEmail.js";
import { postNoteToIntervals } from "../intervals/add-note.js";

const isDev = process.env.NODE_ENV === "development";

export const notify = async ({ wellness, strategy, finalPrescription }) => {
  const agentOutput = JSON.parse(finalPrescription);

  // Development mode - just log and exit
  if (isDev) {
    console.log("=== Wellness Analysis Output ===");
    console.log(wellness);
    console.log("=== Training Strategy Output ===");
    console.log(JSON.parse(strategy));
    console.log("=== Final Prescription Output ===");
    console.log(agentOutput.fullIntervalsNote);
    return;
  }

  // Production mode - post note to intervals
  console.log("Posting Note");
  await postNoteToIntervals(agentOutput.fullIntervalsNote);
  console.log("Note Posted");

  // Send email if credentials are available
  const canSendEmail =
    process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_USER;

  if (canSendEmail) {
    console.log("Sending Email");
    await sendEmail(agentOutput.fullIntervalsNote);
    console.log("Email Sent");
  }
};
