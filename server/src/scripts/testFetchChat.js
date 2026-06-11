import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

async function main() {
  const url = "https://integrate.api.nvidia.com/v1/chat/completions";
  const start = Date.now();
  console.log("Fetching...", url);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 10
      })
    });
    console.log(res.status, await res.text());
    console.log("Time:", (Date.now() - start)/1000);
  } catch (e) {
    console.error("Error:", e);
  }
}
main();
