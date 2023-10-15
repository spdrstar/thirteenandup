import { execSync } from "child_process";
import fs from "fs";
import axios from "axios";
import { Writable } from "stream";
import {
  NextApiRequest,
  NextApiResponse,
} from "next";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import ffmpeg from "fluent-ffmpeg";

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Starting uploadHandler...");

  const { method } = req;
  const API_URL = process.env.API_URL;
  const API_KEY = process.env.API_KEY;
  const INDEX_ID = "652b69813c4a426cf3f4fa50";

  switch (method) {
    case "GET":
      try {
        console.log("GET request initiated");

        // Search for the profanity words
        const resp = await axios.post(
          `${API_URL}/search`,
          {
            query: "fuck",
            index_id: INDEX_ID,
            search_options: ["conversation"],
            conversation_option: "exact_match",
            filter: {
              id: ["652b7d5b43e8c47e4eb48350"],
            },
          },
          { headers: { "x-api-key": API_KEY } }
        );

        console.log("API call completed");

        const { data: response } = resp;
        const results = response.data;

        console.log(
          "Results from API received:",
          JSON.stringify(results)
        );

        // Step 1: Extract original audio to WAV format
        execSync(
          "ffmpeg -y -i /Users/shai/Projects/thirteenandup/pages/api/find-fucks/trimmed.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 1 original.wav"
        );

        console.log("Audio extracted to WAV");

        // Step 2: Process the original audio in Node.js
        let originalBuffer = readFileSync(
          "original.wav"
        );
        let functionBuffer = readFileSync(
          "/Users/shai/Projects/thirteenandup/pages/api/find-fucks/function.mp3"
        );

        console.log(
          "Read original and function audio files"
        );

        // Convert function.mp3 to wav using fluent-ffmpeg
        await new Promise((resolve, reject) => {
          ffmpeg(
            "/Users/shai/Projects/thirteenandup/pages/api/find-fucks/function.mp3"
          )
            .output("function.wav")
            .on("end", resolve)
            .on("error", reject)
            .run();
        });

        console.log(
          "Converted function.mp3 to function.wav"
        );

        let functionWavBuffer = readFileSync(
          "function.wav"
        );

        console.log(
          "Reading function.wav into buffer"
        );

        // Replace the segments
        results.forEach((result) => {
          let startByte = Math.floor(
            result.start * 44100 * 2 + 44
          );
          let endByte = Math.floor(
            result.end * 44100 * 2 + 44
          );

          console.log(
            `Replacing from byte ${startByte} to byte ${endByte}`
          );

          for (
            let i = startByte;
            i < endByte;
            i += functionWavBuffer.length
          ) {
            let segmentLength = Math.min(
              functionWavBuffer.length,
              endByte - i
            );
            functionWavBuffer.copy(
              originalBuffer,
              i,
              0,
              segmentLength
            );
          }
        });

        console.log("Segments replaced");

        // Step 3: Save the new processed audio
        writeFileSync("new.wav", originalBuffer);

        console.log("Saved the new audio");

        // Step 4: Merge the new audio with the original video
        // execSync(
        //   "ffmpeg -y -i /Users/shai/Projects/thirteenandup/pages/api/find-fucks/trimmed.mp4 -i new.wav -c:v copy -c:a aac -strict experimental output.mp4"
        // );
        // Strip original audio from video
        execSync(
          "ffmpeg -y -an -i /Users/shai/Projects/thirteenandup/pages/api/find-fucks/trimmed.mp4 video_only.mp4"
        );

        // Add new audio to the video
        execSync(
          "ffmpeg -y -i video_only.mp4 -i new.wav -c:v copy -c:a aac -strict -2 output.mp4"
        );

        console.log(
          "New audio merged with original video"
        );

        res.status(200).json({
          message: "Audio replaced successfully.",
        });
      } catch (e) {
        console.error("Request error", e);
        res.status(500).json({
          error: "Error processing video",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
