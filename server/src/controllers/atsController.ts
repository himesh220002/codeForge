import { Request, Response } from 'express';
import { PDFParse } from 'pdf-parse';
import natural from 'natural';
import nlp from 'compromise';
import { getEmbedding, cosineSimilarity, generateAtsFeedback } from '../services/aiService.js';

export const checkAtsScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file || !jobDescription) {
      res.status(400).json({ success: false, message: 'File and Job Description are required.' });
      return;
    }

    const userApiKey = req.headers.authorization?.replace("Bearer ", "") || undefined;
    const isProduction = process.env.NODE_ENV === "production";
    const apiKeyToUse = userApiKey || (!isProduction ? process.env.NVIDIA_API_KEY : undefined);

    if (!apiKeyToUse) {
      res.status(401).json({ success: false, message: 'NVIDIA API Key is required.' });
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    const sendProgress = (stepIndex: number, label: string) => {
      console.log(`[ATS Engine] Step ${stepIndex}: ${label}`);
      res.write(JSON.stringify({ type: 'progress', step: stepIndex, label }) + '\n');
    };

    // 1. Parse PDF string
    sendProgress(0, "Parsing PDF Structure...");
    const parser = new PDFParse({ data: file.buffer });
    const pdfData = await parser.getText();
    const cvText = pdfData.text;

    // 2. Structure Checking Heuristics
    const headersToCheck = ['experience', 'education', 'skills', 'projects', 'summary'];
    const lowerCv = cvText.toLowerCase();
    let structureMatches = 0;
    headersToCheck.forEach(header => {
      if (lowerCv.includes(header)) structureMatches++;
    });
    
    // Base 50 + scaling based on headers found
    const structureScore = 50 + (structureMatches / headersToCheck.length) * 50;

    // 3. Dense Vector Embeddings (NVIDIA NIM nv-embedqa or equivalent default in aiService)
    sendProgress(1, "Generating Dense Vector Embeddings...");
    const cvEmb = await getEmbedding(cvText, 'passage', apiKeyToUse);
    const jdEmb = await getEmbedding(jobDescription, 'query', apiKeyToUse);

    const vectorSimilarity = cosineSimilarity(cvEmb, jdEmb); 
    // Normalized to percentage
    const normalizedVectorScore = Math.max(0, Math.min(100, vectorSimilarity * 100));

    // 4. TF-IDF Keyword Match Overlay
    sendProgress(2, "Running TF-IDF Matrix Overlay...");
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();
    tfidf.addDocument(lowerCv);

    // Tokenize JD to get keywords
    const jdTokens = new natural.WordTokenizer().tokenize(jobDescription.toLowerCase()) || [];
    
    let tfidfScore = 0;
    let validTokens = 0;
    const stopWords = ['and', 'or', 'the', 'is', 'in', 'to', 'with', 'for', 'a', 'of', 'on', 'as', 'are', 'be', 'this', 'we', 'you', 'your', 'will', 'an'];
    
    jdTokens.forEach(token => {
      if (token.length > 2 && !stopWords.includes(token)) {
        validTokens++;
        tfidf.tfidfs(token, (i, measure) => {
          if (measure > 0) tfidfScore += 1;
        });
      }
    });

    const keywordMatchPercentage = validTokens > 0 ? (tfidfScore / validTokens) * 100 : 0;
    const finalKeywordScore = Math.min(100, keywordMatchPercentage * 2.5); // Boost factor

    // 5. Rule-Based Entity Validation (Dates and Orgs)
    sendProgress(3, "Evaluating Heuristic Rules & Syntax...");
    const doc = nlp(cvText) as any;
    const hasDates = doc.match('#Date').out('array').length > 0;
    const hasOrgs = doc.match('#Organization').out('array').length > 0;
    const ruleScore = (hasDates ? 50 : 0) + (hasOrgs ? 50 : 0);

    // 6. Final Composite Scoring (50% Vector, 30% Keyword, 20% Rule)
    sendProgress(4, "Synthesizing Match Data & Generating Feedback...");
    const finalMatchScore = (normalizedVectorScore * 0.5) + (finalKeywordScore * 0.3) + (ruleScore * 0.2);

    // 7. Dynamic AI Feedback Generation
    const dynamicFeedback = await generateAtsFeedback(cvText, jobDescription, Math.round(finalMatchScore), apiKeyToUse);

    res.write(JSON.stringify({
      type: 'result',
      data: {
        structureScore: Math.round(structureScore),
        matchScore: Math.round(finalMatchScore),
        feedback: dynamicFeedback
      }
    }) + '\n');
    res.end();

  } catch (err: any) {
    console.error('ATS check failed:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.write(JSON.stringify({ type: 'error', message: err.message }) + '\n');
      res.end();
    }
  }
};
