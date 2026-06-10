import OpenAI from 'openai';

const getOpenAIClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("NVIDIA API Key is required.");
  }
  return new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });
};

/**
 * Generate embeddings using the asymmetric nvidia/llama-nemotron-embed-1b-v2 model.
 */
export async function getEmbedding(text: string, inputType: 'query' | 'passage' = 'passage', apiKey: string): Promise<number[]> {
  const openai = getOpenAIClient(apiKey);
  try {
    const response = await openai.embeddings.create({
      model: "nvidia/llama-nemotron-embed-1b-v2",
      input: text.substring(0, 8000), // Protect against token limits
      encoding_format: "float",
      ...({ input_type: inputType } as any)
    }, { timeout: 60000 }); // 60-second embedding timeout
    return response.data[0].embedding;
  } catch (err) {
    console.error("Error generating embedding from NVIDIA NIM:", err);
    throw err;
  }
}

/**
 * Local cosine similarity calculation between two vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    console.warn(`Vector lengths do not match: ${vecA.length} vs ${vecB.length}`);
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Scrape the latest developer job postings in India from Hasjob's Atom feed.
 */
export async function scrapeLatestJobsIndia(): Promise<Array<{ title: string; company: string; description: string; link: string }>> {
  try {
    console.log("Fetching latest jobs in India from Hasjob...");
    const res = await fetch("https://hasjob.co/feed", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      signal: AbortSignal.timeout(8000) // 8-second fetch timeout
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch Hasjob feed. Status: ${res.status}`);
    }
    const xmlText = await res.text();
    const entries: any[] = [];
    const entryParts = xmlText.split("<entry>");

    // We parse the top 10 latest entries to keep performance fast and responsive
    const maxEntries = Math.min(entryParts.length, 12);

    for (let i = 1; i < maxEntries; i++) {
      const entryXml = entryParts[i];

      const titleMatch = entryXml.match(/<title[^>]*>([\s\S]*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim() : "Software Engineer";

      const linkMatch = entryXml.match(/<link href="([^"]*)"/);
      const link = linkMatch ? linkMatch[1].trim() : "";

      const locationMatch = entryXml.match(/<location[^>]*>([\s\S]*?)<\/location>/);
      const location = locationMatch ? locationMatch[1].trim() : "India / Remote";

      const contentMatch = entryXml.match(/<content[^>]*>([\s\S]*?)<\/content>/);
      let content = contentMatch ? contentMatch[1].trim() : "";

      // Decode HTML entities
      content = content
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");

      // Extract Company name
      const companyMatch = content.match(/<strong><a[^>]*>([\s\S]*?)<\/a><\/strong>/);
      const company = companyMatch ? companyMatch[1].replace(/<[^>]*>/g, "").trim() : "Tech Startup";

      // Strip HTML tags for clean description
      const description = content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      entries.push({
        title,
        company,
        description: `Location: ${location}. Description: ${description.substring(0, 1000)}`,
        link
      });
    }

    console.log(`Successfully scraped and parsed ${entries.length} latest jobs from Hasjob.`);
    return entries;
  } catch (error) {
    console.error("Failed to scrape live jobs, falling back to database-only:", error);
    return [];
  }
}

/**
 * Rerank the matched jobs using NVIDIA Llama-Nemotron-Rerank-1b-v2 model.
 * Extremely fast relevance optimization.
 */
export async function rerankJobs(
  queryText: string,
  jobs: any[],
  apiKey: string
): Promise<any[]> {
  if (!jobs || jobs.length === 0) return [];
  if (!apiKey) {
    throw new Error("NVIDIA API Key is required.");
  }

  const invokeUrl = "https://ai.api.nvidia.com/v1/retrieval/nvidia/llama-nemotron-rerank-1b-v2/reranking";
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  // Format passages for the reranker payload
  const passages = jobs.map((job) => {
    return {
      text: `Title: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description}\nLocation: ${job.location || 'India'}`
    };
  });

  const payload = {
    model: "nvidia/llama-nemotron-rerank-1b-v2",
    query: { text: queryText.substring(0, 2000) }, // Keep within logical length limits
    passages: passages
  };

  try {
    console.log(`Calling NVIDIA Reranker for ${jobs.length} jobs...`);
    const response = await fetch(invokeUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: headers,
      signal: AbortSignal.timeout(10000) // 10-second timeout for reranking
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Reranking API error: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json() as any;
    const rankings = responseData.rankings || [];
    console.log("Reranker API returned rankings:", rankings);

    // Map rankings back to the original jobs and assign new relevance scores
    const rerankedJobs = rankings.map((rank: { index: number; logit: number }) => {
      const job = jobs[rank.index];
      return {
        ...job,
        rerankLogit: rank.logit // Use logit for sorting priority, preserve cosine similarity score for display
      };
    });

    // Sort by rerank logit descending
    rerankedJobs.sort((a: any, b: any) => b.rerankLogit - a.rerankLogit);
    console.log("Reranking completed successfully.");
    return rerankedJobs;
  } catch (error) {
    console.error("Reranking failed, falling back to original semantic matches:", error);
    return jobs; // Fallback to original order on failure
  }
}

/**
 * Generate matching explanation, apply links, and cover letters using DeepSeek V4.
 * Uses deepseek-ai/deepseek-v4-pro, with deepseek-ai/deepseek-v4-flash as a fallback.
 */
export async function generateJobMatchStrategy(
  cvText: string,
  userPrompt: string,
  matchedJobs: any[],
  apiKey: string
): Promise<string> {
  const openai = getOpenAIClient(apiKey);
  const jobsContext = matchedJobs
    .map((job, idx) => {
      return `Job #${idx + 1}
Title: ${job.title}
Company: ${job.company}
Link: ${job.link}
Description: ${job.description}
Semantic Score: ${(job.score * 100).toFixed(1)}%`;
    })
    .join('\n\n');

  const systemPrompt = `You are a premium career strategy consultant and technical recruiter.
Your goal is to apply a "Reconsideration & Optimization" algorithm on the raw semantic matches below.

Please analyze the user's CV/Profile, search criteria, and the raw semantic matches. Perform the following steps:
1. **Reconsideration & Re-ranking**: From the semantic matches, filter and select the top 5 absolute best-fit positions where the candidate has the highest chance of success. Re-rank them based on actual skill compatibility, experience levels, and role suitability.
2. **Optimized Target Listings**: For each of the top 5 selected jobs, provide:
   - A clear section title containing: Job Title - Company (Match Rating: X/100)
   - Clickable application link: [Apply Here](link_url) (you MUST use the exact link provided in the job object).
   - A highly optimized outreach pitch / email snippet (2-3 sentences) tailored to grab the hiring manager's attention.
3. **Skill Gaps & Improvements Suggestions**: Review the full list of matches. Identify critical skill gaps or certification requirements that appear frequently in these jobs but are missing or weak on the user's CV. Suggest 3 concrete skills to learn/highlight.
4. **Channel Application Strategy**: Give the user a short, direct plan to optimize their application channel (e.g. portfolio updates, finding recruiters on LinkedIn) to help them land the job as fast as possible.`;

  const userMessage = `User CV/Profile:
${cvText}

Search Criteria/Preferences:
${userPrompt}

Raw Semantic Matches (10-20 results):
${jobsContext}

Please execute the reconsideration algorithm and return the final strategy:`;

  try {
    console.log("Calling NVIDIA NIM Chat Completion (Meta Llama 3.3 70B Instruct with 120s timeout)...");
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }, { timeout: 120000 });
    return completion.choices[0]?.message?.content || "No report generated.";
  } catch (llamaError) {
    console.warn("Meta Llama 3.3 failed, falling back to DeepSeek-v4-pro. Error:", llamaError);
    try {
      console.log("Calling NVIDIA NIM Chat Completion (DeepSeek Pro Model with 45s timeout)...");
      const completion = await openai.chat.completions.create({
        model: "deepseek-ai/deepseek-v4-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }, { timeout: 45000 });
      return completion.choices[0]?.message?.content || "No report generated.";
    } catch (proError) {
      console.warn("DeepSeek-v4-pro failed, falling back to DeepSeek-v4-flash. Error:", proError);
      try {
        console.log("Calling NVIDIA NIM Chat Completion (DeepSeek Flash Model with 45s timeout)...");
        const completion = await openai.chat.completions.create({
          model: "deepseek-ai/deepseek-v4-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 3000,
        }, { timeout: 45000 });
        return completion.choices[0]?.message?.content || "No report generated.";
      } catch (flashError) {
        console.error("All RAG generation models failed. Error:", flashError);
        return `Failed to generate advice from NIM models. Error: ${flashError instanceof Error ? flashError.message : String(flashError)}`;
      }
    }
  }
}
