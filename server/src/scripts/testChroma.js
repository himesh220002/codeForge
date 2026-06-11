import { CloudClient } from 'chromadb';

async function main() {
  try {
    const client = new CloudClient({
      cloudHost: "https://api.trychroma.com",
      cloud_host: "https://api.trychroma.com",
      apiKey: "ck-26QqwDtkbh6gaTugwktD7ofJZxNPdVX11RC3HN34FEDc",
      api_key: "ck-26QqwDtkbh6gaTugwktD7ofJZxNPdVX11RC3HN34FEDc",
      tenant: "01b902d3-5dfb-432d-8962-2d6050728b01",
      database: "RAG"
    });

    console.log("Pinging Chroma Cloud...");
    console.log(await client.heartbeat());
    
    const mockEmbedder = { generate: async (texts) => texts.map(() => [0.1]) };
    const collection = await client.getOrCreateCollection({ name: "job_matches", embeddingFunction: mockEmbedder });
    console.log("Success! Collection:", collection.name);
  } catch (err) {
    console.error("CloudClient Error:", err);
  }
}
main();
