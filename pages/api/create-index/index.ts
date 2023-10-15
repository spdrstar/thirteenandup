import type {
  NextApiRequest,
  NextApiResponse,
} from "next";
import Mux from "@mux/mux-node";
const { Video } = new Mux();
import axios from "axios";

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        (async () => {
          // const API_URL = process.env.API_URL;
          const API_URL =
            "https://api.twelvelabs.io/v1.1";
          if (API_URL === undefined) {
            console.log(
              "API_URL is not defined."
            );
            process.exit(1);
          }

          // const API_KEY = process.env.API_KEY;
          const API_KEY =
            "tlk_1PHHQRG3HT2GWS2X0RXT81WYAZKM";
          if (API_KEY === undefined) {
            console.log(
              "API_KEY is not defined."
            );
            process.exit(1);
          }

          const INDEXES_URL = `${API_URL}/indexes`;

          const INDEX_NAME = "fuck"; // Use a descriptive name for your index

          const headers = {
            "x-api-key": API_KEY,
          };

          const data = {
            engine_id: "marengo2.5",
            index_options: [
              "visual",
              "conversation",
              "text_in_video",
              "logo",
            ],
            index_name: INDEX_NAME,
          };

          const resp = await axios.post(
            INDEXES_URL,
            data,
            { headers }
          );

          const { data: response } = resp;
          const INDEX_ID = response._id;
          console.log(
            `Status code: ${resp.status}`
          );
          console.log(response);
        })();
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
