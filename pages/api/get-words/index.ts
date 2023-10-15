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
          .then(async (re) => {
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
            try {
              const response = await axios.get(
                "http://api1.webpurify.com/services/rest/",
                {
                  params: {
                    api_key:
                      "3ad8d4adb11dfc8ce14e307cb01cd7a8",
                    method:
                      "webpurify.live.return",
                    text: wholeTranscript.join(
                      " "
                    ),
                    replacesymbol: "*",
                    format: "json",
                  },
                }
              );

              // Send the response from WebPurify back to the client
              // res.status(200).json(response.data);
              const allBadWords =
                response.data["rsp"]["expletive"];
              const badWords = allBadWords.filter(
                (
                  value: any,
                  index: any,
                  self: string | any[]
                ) => {
                  return (
                    self.indexOf(value) === index
                  );
                }
              );
              console.log(badWords);
              return res
                .status(200)
                .json(badWords);
            } catch (error: any) {
              res
                .status(
                  error.response?.status || 500
                )
                .json(error.response?.data || {});
            }
          });

        // console.log(JSON.stringify(resp));
        //return res.status(200).json(resp);
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
