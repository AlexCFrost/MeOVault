import { Request, Response, NextFunction } from 'express';
import { Note } from '../models/note.model';
import { generateEmbedding } from '../services/embedding.service';

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content } = req.body;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ 
        success: false,
        error: 'Note content is required and must be a non-empty string' 
      });
      return;
    }

    // Generate embedding for the note content
    const { embedding, model } = await generateEmbedding(content.trim());

    // Save note to MongoDB with embedding
    const note = await Note.create({ 
      content: content.trim(),
      embedding,
      embeddingModel: model
    });

    // Return the saved note
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};
