import type {
  NextApiRequest,
  NextApiResponse,
} from "next";
import axios from "axios";

export default async function uploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // const API_URL = process.env.API_URL;
        const url =
          "https://api.twelvelabs.io/v1.1/indexes/652b69813c4a426cf3f4fa50/videos/652b7d5b43e8c47e4eb48350/transcription";

        const API_KEY =
          process.env.API_KEY ||
          "tlk_1PHHQRG3HT2GWS2X0RXT81WYAZKM"; // Replace with your API key

        if (!url) {
          console.log("API_URL is not defined.");
          return res.status(500).json({
            error: "API_URL is not defined.",
          });
        }

        const resp = await axios
          .get(url, {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              "x-api-key":
                "tlk_1PHHQRG3HT2GWS2X0RXT81WYAZKM",
            },
          })
          .then((re) => {
            const transcriptWithTimeStamps =
              re.data.data;
            let wholeTranscript = [];
            for (
              let i = 0;
              i < transcriptWithTimeStamps.length;
              i++
            ) {
              wholeTranscript.push(
                transcriptWithTimeStamps[i].value
              );
            }
            // TODO send to api to get list of swear words
            console.log(
              wholeTranscript.join(" ")
            );
          });

        // console.log(JSON.stringify(resp));
        return res.status(200).json(resp);
      } catch (e) {
        console.error("Request error", e);
        return res.status(500).json({
          error: "Error getting upload/asset",
        });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      return res
        .status(405)
        .end(`Method ${method} Not Allowed`);
  }
}
