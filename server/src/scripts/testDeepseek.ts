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
  console.log("Testing DeepSeek-v4-pro...");
  try {
    const start = Date.now();
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-pro",
      messages: [{"role": "user", "content": "Hello, write a short sentence."}],
      temperature: 0.7,
      max_tokens: 50,
    });
    console.log("Success Pro! Response time:", (Date.now() - start) / 1000, "seconds");
    console.log("Response:", completion.choices[0]?.message?.content);
  } catch (err: any) {
    console.error("Pro failed:", err.message || err);
  }

  console.log("\nTesting DeepSeek-v4-flash...");
  try {
    const start = Date.now();
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-flash",
      messages: [{"role": "user", "content": "Hello, write a short sentence."}],
      temperature: 0.7,
      max_tokens: 50,
    });
    console.log("Success Flash! Response time:", (Date.now() - start) / 1000, "seconds");
    console.log("Response:", completion.choices[0]?.message?.content);
  } catch (err: any) {
    console.error("Flash failed:", err.message || err);
  }
}

main();
