import axios from "axios";
import fs from "fs";
import FormData from "form-data";

import type {
  NextApiRequest,
  NextApiResponse,
} from "next";
import Mux from "@mux/mux-node";
import upload from "../upload";
const { Video } = new Mux();
const API_URL = "https://api.twelvelabs.io/v1.1";
const API_KEY =
  "tlk_1PHHQRG3HT2GWS2X0RXT81WYAZKM";
export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const videoUrl = req.query
          .videoUrl as string;
        console.log(videoUrl);
        (async () => {
          if (typeof API_URL === "undefined") {
            console.log(
              "API_URL is not defined."
            );
            process.exit(1);
          }

          if (typeof API_KEY === "undefined") {
            console.log(
              "API_KEY is not defined."
            );
            process.exit(1);
          }

          // This code assumes that you've already created an index and the unique identifier of your index is stored in a variable named `INDEX_ID`
          const INDEX_ID =
            "652b69813c4a426cf3f4fa50";

          const TASKS_URL = `${API_URL}/tasks`;

          const filePath =
            "/Users/shai/Projects/thirteenandup/trimmed.mp4";
          const fileStream =
            fs.createReadStream(filePath);

          const formData = new FormData();
          formData.append("index_id", INDEX_ID);
          formData.append("language", "en");
          formData.append(
            "video_file",
            fileStream
          );

          const createResp = await axios.post(
            TASKS_URL,
            formData,
            {
              headers: {
                ...formData.getHeaders(),
                "x-api-key": API_KEY,
              },
            }
          );
          const { data: createResponse } =
            createResp;
          const TASK_ID = createResponse._id;
          console.log(
            `Status code: ${createResp.status}`
          );
          console.log(createResponse);

          const TASK_STATUS_URL = `${API_URL}/tasks/${TASK_ID}`;
          const uploadResp = await new Promise(
            (res) => {
              const interval = setInterval(
                async () => {
                  const { data: response } =
                    await axios.get(
                      TASK_STATUS_URL,
                      {
                        headers: {
                          "x-api-key": API_KEY,
                        },
                      }
                    );
                  if (
                    response.status == "ready"
                  ) {
                    clearInterval(interval);
                    res(response);
                  }
                },
                1000
              );
            }
          );
          const VIDEO_ID = uploadResp.video_id;
          console.log(`VIDEO_ID: ${VIDEO_ID}`);
          console.log(
            `Status code: ${uploadResp.status}`
          );
          console.log(uploadResp);
        })();

        //   res.json({
        //     upload: {
        //       status: upload.status,
        //       url: upload.url,
        //       asset_id: upload.asset_id,
        //     },
        //   });
      } catch (e) {
        console.error("Request error", e);
        res.status(500).json({
          error: "Error getting upload/asset",
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

// VIDEO_ID: 652b6c5f43e8c47e4eb482ce
// Status code: ready
// {
//   _id: '652b6c5f3c4a426cf3f4fab7',
//   index_id: '652b69813c4a426cf3f4fa50',
//   video_id: '652b6c5f43e8c47e4eb482ce',
//   status: 'ready',
//   metadata: { filename: 'yc.mp4', duration: 61.166667, width: 1280, height: 720 },
