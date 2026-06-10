import { Request, Response } from 'express';
import { JobModel } from '../models/job.js';
import { getEmbedding, cosineSimilarity, generateJobMatchStrategy, scrapeLatestJobsIndia, rerankJobs } from '../services/aiService.js';

// Seed job postings into the database
export const seedJobsController = async (req: Request, res: Response) => {
  try {
    const devApiKey = req.headers.authorization?.replace("Bearer ", "") || process.env.NVIDIA_API_KEY || "";
    // Delete existing jobs to avoid duplicates
    await JobModel.deleteMany({});

    const mockJobs = [
      {
        title: "Frontend Developer (Next.js & TypeScript)",
        company: "CodeCraft Studios",
        description: "We are looking for a Frontend Engineer skilled in React, Next.js (App Router), Tailwind CSS, and TypeScript. Experience with responsive layout design and optimizing UI/UX performance is highly valued.",
        link: "https://example.com/jobs/codecraft-frontend"
      },
      {
        title: "Backend Engineer (Node.js, Express & Kafka)",
        company: "DataStream Logistics",
        description: "Seeking a Backend developer expert in Node.js, Express, MongoDB, and Mongoose. Must have practical experience building REST APIs, managing database schemas, and handling real-time messaging using Apache Kafka.",
        link: "https://example.com/jobs/datastream-backend"
      },
      {
        title: "Full Stack Engineer (MERN Stack)",
        company: "LaunchPad Tech",
        description: "Join our team to build SaaS products! Requirements: Strong knowledge of React, Next.js, Node.js, and MongoDB. Experience implementing secure authentication (JWT) and cookie-based sessions is a big plus.",
        link: "https://example.com/jobs/launchpad-fullstack"
      },
      {
        title: "DevOps & Cloud Infrastructure Specialist",
        company: "CloudCore Systems",
        description: "Looking for an engineer to manage CI/CD pipelines, Docker, Kubernetes, and AWS services. Experience with Linux systems administration, security baselines, and scripting in Bash or Python is required.",
        link: "https://example.com/jobs/cloudcore-devops"
      },
      {
        title: "AI & Data Engineer (Python & RAG)",
        company: "NeuralLabs AI",
        description: "We are building the future of LLM agents. Requirements: Strong Python skills, SQL, vector databases (Pinecone, Chroma, etc.), LangChain, and implementing Retrieval-Augmented Generation (RAG) pipelines.",
        link: "https://example.com/jobs/neurallabs-ai-data"
      }
    ];

    console.log("Seeding jobs and generating embeddings...");
    const seededJobs = [];

    for (const job of mockJobs) {
      // Create a combined text profile for embedding
      const profileText = `Title: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description}`;
      const embedding = await getEmbedding(profileText, 'passage', devApiKey);

      const newJob = new JobModel({
        ...job,
        embedding
      });

      await newJob.save();
      seededJobs.push({
        title: job.title,
        company: job.company,
        id: newJob._id
      });
    }

    return res.status(201).json({
      success: true,
      message: "Database successfully seeded with developer job postings and embeddings.",
      data: seededJobs
    });

  } catch (error) {
    console.error("Seeding jobs failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to seed job postings. Check server logs.",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Match a CV + prompt to the best jobs (including live scraped jobs in India)
export const matchJobsController = async (req: Request, res: Response) => {
  // Set headers for JSON line chunked stream response
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');

  const sendProgress = (stepIndex: number) => {
    res.write(JSON.stringify({ type: 'progress', step: stepIndex }) + '\n');
  };

  try {
    const { cvText, prompt } = req.body;

    if (!cvText) {
      res.status(400);
      res.write(JSON.stringify({
        success: false,
        message: "CV/Profile text is required."
      }) + '\n');
      return res.end();
    }

    const searchPrompt = prompt || "Find jobs matching my profile.";
    console.log("Matching jobs for CV... Preferences:", searchPrompt);

    // Extract user API key for BYOK support
    const userApiKey = req.headers.authorization?.replace("Bearer ", "") || undefined;
    
    // In production (Render), we strictly require userApiKey.
    // In local development, we can fall back to process.env.NVIDIA_API_KEY.
    const isProduction = process.env.NODE_ENV === "production";
    const apiKeyToUse = userApiKey || (!isProduction ? process.env.NVIDIA_API_KEY : undefined);

    if (!apiKeyToUse || apiKeyToUse.trim() === "") {
      res.status(401);
      res.write(JSON.stringify({
        type: 'error',
        message: "NVIDIA API Key is required. Please add your key in the profile settings page."
      }) + '\n');
      return res.end();
    }

    // Step 0: Fetching the latest live postings
    sendProgress(0);

    // 1. Fetch the latest live developer job postings in India from Hasjob
    const liveJobs = await scrapeLatestJobsIndia();
    
    // Step 1: Caching and generating passage embeddings for new items
    sendProgress(1);

    if (liveJobs.length > 0) {
      console.log(`Processing ${liveJobs.length} live scraped jobs for database caching...`);
      // Find out which links already exist in our DB
      const existingJobs = await JobModel.find({ link: { $in: liveJobs.map(j => j.link) } }).select('link');
      const existingLinkSet = new Set(existingJobs.map(e => e.link));

      // Filter out only the new ones
      const newJobsToEmbed = liveJobs.filter(j => j.link && !existingLinkSet.has(j.link));

      if (newJobsToEmbed.length > 0) {
        console.log(`Generating embeddings sequentially for ${newJobsToEmbed.length} new live jobs...`);
        const embeddedJobs = [];

        for (const job of newJobsToEmbed) {
          try {
            const profileText = `Title: ${job.title}\nCompany: ${job.company}\nDescription: ${job.description}`;
            const embedding = await getEmbedding(profileText, 'passage', apiKeyToUse);
            embeddedJobs.push({
              title: job.title,
              company: job.company,
              description: job.description,
              link: job.link,
              embedding
            });
            // Brief pause to prevent hitting NVIDIA free tier rate limits
            await new Promise(r => setTimeout(r, 200));
          } catch (e) {
            console.error(`Failed to embed live job [${job.title}] from Hasjob:`, e);
          }
        }

        if (embeddedJobs.length > 0) {
          console.log(`Inserting ${embeddedJobs.length} new jobs with vector embeddings into MongoDB...`);
          await JobModel.insertMany(embeddedJobs);
        }
      }
    }

    // Step 2: Vectorizing user profile text & criteria
    sendProgress(2);

    // 2. Generate query embedding combining prompt and CV highlights
    const queryCombined = `Preferences: ${searchPrompt}\nCV Profile: ${cvText}`;
    const queryVector = await getEmbedding(queryCombined, 'query', apiKeyToUse);

    // Step 3: Local semantic retrieval cosine similarity matching
    sendProgress(3);

    // 3. Retrieve all cached/seeded jobs from MongoDB
    const jobs = await JobModel.find({});
    if (jobs.length === 0) {
      res.status(404);
      res.write(JSON.stringify({
        success: false,
        message: "No job postings found in the database. Please run the seed endpoint or ensure Hasjob scraping is working."
      }) + '\n');
      return res.end();
    }

    // 4. Compute cosine similarity scores
    const scoredJobs = jobs.map((job) => {
      const score = cosineSimilarity(queryVector, job.embedding);
      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        description: job.description,
        link: job.link,
        score
      };
    });

    // 5. Sort and filter matching jobs based on score thresholds
    scoredJobs.sort((a, b) => b.score - a.score);
    
    // Filter for jobs with at least 20% match (0.20)
    let qualifiedMatches = scoredJobs.filter(job => job.score >= 0.20);
    
    let topMatches;
    if (qualifiedMatches.length >= 20) {
      topMatches = qualifiedMatches.slice(0, 20); // Cap at 20 if we have plenty of good matches
    } else if (qualifiedMatches.length >= 10) {
      topMatches = qualifiedMatches; // Return all 10-19 good matches
    } else {
      // If we don't have 10 good matches, still return the top 10 overall (or up to how many we have)
      // to ensure the user gets a decent amount of listings to look at.
      topMatches = scoredJobs.slice(0, 10);
    }

    // Step 4: Reranking matches using Nemotron Rerank model
    sendProgress(4);

    // 6. Apply Llama-Nemotron-Rerank to optimize the top matches
    console.log("Applying Llama-Nemotron-Rerank to select top 5 matches for strategy generation...");
    const rerankedMatches = await rerankJobs(queryCombined, topMatches, apiKeyToUse);
    const top5Reranked = rerankedMatches.slice(0, 5);

    // Step 5: Generating career strategy & outreach pitches via DeepSeek Pro
    sendProgress(5);

    // 7. Generate career matches strategy and cover letters using DeepSeek
    console.log("Generating matching strategy with DeepSeek V4...");
    const aiStrategy = await generateJobMatchStrategy(cvText, searchPrompt, top5Reranked, apiKeyToUse);

    // Send final result object
    res.write(JSON.stringify({
      type: 'result',
      data: {
        matches: rerankedMatches,
        strategy: aiStrategy
      }
    }) + '\n');
    res.end();

  } catch (error) {
    console.error("Job matching failed:", error);
    res.write(JSON.stringify({
      type: 'error',
      message: error instanceof Error ? error.message : String(error)
    }) + '\n');
    res.end();
  }
};
