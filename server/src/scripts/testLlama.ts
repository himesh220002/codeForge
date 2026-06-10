import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function main() {
  const modelName = "meta/llama-3.3-70b-instruct";
  console.log(`Testing ${modelName}...`);
  try {
    const start = Date.now();
    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [{"role": "user", "content": "Hello! Write a short sentence."}],
      temperature: 0.7,
      max_tokens: 50,
    });
    console.log("Success! Response time:", (Date.now() - start) / 1000, "seconds");
    console.log("Response:", completion.choices[0]?.message?.content);
  } catch (err: any) {
    console.error("Failed:", err.message || err);
  }
}

main();
