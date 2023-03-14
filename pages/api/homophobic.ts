import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type responseData = {
  text: string;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

const Conf = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(Conf);

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<responseData>
) {
  const prompt = req.body.prompt;

  if (!prompt || prompt === "") {
    return new Response("Please send your prompt ", { status: 400 });
  }

  const aiResult = await openai.createCompletion({
    model: "text-davinci-301",
    prompt: `${prompt}`,
    temperature: 0.9, // higher value means that model will take more risks
    max_tokens: 2048, // the maximum number of tokens to generate in completion
    frequency_penalty: 0.5, // number between -2.0 and 2.0
    presence_penalty: 0, // number between -2.0 and 2.0
  });
  console.log(
    "🚀 ~ file: api.service.ts:26 ~ ApiService ~ getCompletion ~ aiResult",
    aiResult
  );

  const response =
    aiResult.data.choices[0].text?.trim() || "Sorry there was a problem";
  res.status(200).json({ text: response });
}
