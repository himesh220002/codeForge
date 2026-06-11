import { CloudClient } from 'chromadb';

// Provided Chroma Cloud credentials
const CHROMA_TENANT = process.env.CHROMA_TENANT || "01b902d3-5dfb-432d-8962-2d6050728b01";
const CHROMA_API_KEY = process.env.CHROMA_API_KEY || "ck-26QqwDtkbh6gaTugwktD7ofJZxNPdVX11RC3HN34FEDc";
const CHROMA_HOST = "https://api.trychroma.com";

// Initialize client
export const chromaClient = new CloudClient({
  apiKey: CHROMA_API_KEY,
  tenant: CHROMA_TENANT,
  database: "RAG"
});

// A mock embedding function to satisfy Chroma's client requirement
// We actually pass pre-computed embeddings, so this won't be called for our use case.
const mockEmbedder = {
  generate: async (texts: string[]) => {
    return texts.map(() => [0]);
  }
};

/**
 * Initializes or retrieves the ChromaDB collection for jobs
 */
export async function initChromaCollection() {
  try {
    const collection = await chromaClient.getOrCreateCollection({
      name: "job_matches",
      embeddingFunction: mockEmbedder as any,
      metadata: { "hnsw:space": "cosine" }
    });
    return collection;
  } catch (error) {
    console.error("Failed to initialize Chroma collection:", error);
    throw error;
  }
}

/**
 * Adds seeded jobs to ChromaDB
 */
export async function addJobsToChroma(jobs: any[]) {
  const collection = await initChromaCollection();

  const ids = jobs.map(job => job.id.toString());
  const embeddings = jobs.map(job => job.embedding);
  const metadatas = jobs.map(job => ({
    title: job.title,
    company: job.company,
    link: job.link
  }));
  const documents = jobs.map(job => job.description);

  try {
    await collection.upsert({
      ids,
      embeddings,
      metadatas,
      documents
    });
    console.log(`Successfully upserted ${jobs.length} jobs into ChromaDB.`);
  } catch (error) {
    console.error("Failed to add jobs to ChromaDB:", error);
    throw error;
  }
}

/**
 * Queries ChromaDB for the closest matches using a pre-computed query vector
 */
export async function queryChroma(queryVector: number[], nResults: number = 30) {
  const collection = await initChromaCollection();

  try {
    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults,
    });

    if (!results.ids || results.ids.length === 0 || !results.ids[0]) return [];

    // Map Chroma format back to the standard job object format
    const matchedJobs = results.ids[0].map((id, index) => {
      const metadata = results.metadatas && results.metadatas[0] ? results.metadatas[0][index] || {} : {};
      const document = results.documents && results.documents[0] ? results.documents[0][index] || "" : "";
      const distance = results.distances && results.distances[0] ? results.distances[0][index] : 0;

      // Cosine distance ranges from 0 (perfect) to 2 (opposite).
      // Similarity = 1 - distance. We cap the lowest score at 0.
      const similarity = typeof distance === 'number' ? 1 - distance : 0;
      const score = Math.max(0, similarity);

      return {
        _id: id,
        title: metadata.title || "Unknown Title",
        company: metadata.company || "Unknown Company",
        description: document,
        link: metadata.link || "",
        score: score
      };
    });

    return matchedJobs;
  } catch (error) {
    console.error("Failed to query ChromaDB:", error);
    throw error;
  }
}
