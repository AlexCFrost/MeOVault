import { Request, Response, NextFunction } from 'express';
import { Note } from '../models/note.model';
import { generateEmbedding } from '../services/embedding.service';

/**
 * Semantic Search Controller
 * 
 * Handles search requests using vector similarity search
 */

interface SearchRequest {
  query: string;
  limit?: number;
}

interface SearchResult {
  _id: string;
  content: string;
  createdAt: Date;
  score: number;
}

export const searchNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query, limit = 10 } = req.body as SearchRequest;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      res.status(400).json({ 
        success: false,
        error: 'Search query is required and must be a non-empty string' 
      });
      return;
    }

    // Validate limit
    const searchLimit = Math.min(Math.max(1, limit), 50); // Between 1 and 50

    // Generate embedding for the search query
    const { embedding } = await generateEmbedding(query.trim());

    // Perform vector similarity search using MongoDB Atlas Vector Search
    const results = await Note.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index', // Atlas Vector Search index name
          path: 'embedding',
          queryVector: embedding,
          numCandidates: searchLimit * 10, // Overrequest for better quality
          limit: searchLimit
        }
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);

    // Return search results
    res.status(200).json({
      success: true,
      data: {
        query: query.trim(),
        results: results as SearchResult[],
        count: results.length
      }
    });
  } catch (error) {
    next(error);
  }
};
