

async function main() {
  const url = 'http://localhost:5000/api/jobs/match';
  const payload = {
    cvText: 'Seeking Frontend Developer position with Next.js, React, and TypeScript expertise.',
    prompt: 'Find matches.'
  };

  console.log("Sending match request to local server...");
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    console.log("Raw Response received:");
    console.log(text.substring(0, 1000));
  } catch (err) {
    console.error("Request failed:", err);
  }
}

main();
