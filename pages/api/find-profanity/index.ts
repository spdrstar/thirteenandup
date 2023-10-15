import { execSync } from "child_process";
import fs from "fs";
import axios from "axios";
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

  const profanityWithAudio = [
    {
      word: "fuck",
      audio:
        "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    },
    {
      word: "shit",
      audio:
        "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3",
    },
    {
      word: "bitch",
      audio:
        "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3",
    },
    {
      word: "ass",
      audio:
        "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3",
    },
    {
      word: "fucking",
      audio:
        "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3",
    },
    {
      word: "bars",
      audio:
        "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3",
    },
    {
      word: "retard",
      audio:
        "https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3",
    },
  ];

  switch (method) {
    case "GET":
      try {
        console.log("GET request initiated");
        let allResults = [];

        // Use async/await with for...of to make sure all requests are finished before moving on
        for (const profanityItem of profanityWithAudio) {
          const resp = await axios.post(
            `${API_URL}/search`,
            {
              query: profanityItem.word,
              index_id: INDEX_ID,
              search_options: ["conversation"],
              conversation_option: "exact_match",
              filter: {
                id: ["652b7d5b43e8c47e4eb48350"],
              },
            },
            {
              headers: { "x-api-key": API_KEY },
            }
          );

          console.log("API call completed");
          const { data: response } = resp;
          const results = response?.data ?? [];
          allResults = allResults.concat(results);
          // sleep for 2 seconds
          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );
          console.log(
            "got " +
              profanityItem.word +
              " results there were :" +
              results.length +
              " results"
          );
        }

        console.log(
          "Results from API received:",
          JSON.stringify(allResults)
        );

        // ... (existing audio processing logic)
        execSync(
          "ffmpeg -y -i /Users/shai/Projects/thirteenandup/pages/api/find-fucks/trimmed.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 1 original.wav"
        );

        console.log("Audio extracted to WAV");

        let originalBuffer = readFileSync(
          "original.wav"
        );
        let functionBuffer = readFileSync(
          "/Users/shai/Projects/thirteenandup/pages/api/find-fucks/beep.mp3"
        );

        console.log(
          "Read original and function audio files"
        );

        await new Promise((resolve, reject) => {
          ffmpeg(
            "/Users/shai/Projects/thirteenandup/pages/api/find-fucks/beep.mp3"
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

        allResults.forEach((result) => {
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

        writeFileSync("new.wav", originalBuffer);

        console.log("Saved the new audio");

        execSync(
          "ffmpeg -y -an -i /Users/shai/Projects/thirteenandup/pages/api/find-fucks/trimmed.mp4 video_only.mp4"
        );

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
