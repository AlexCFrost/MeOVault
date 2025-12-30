import { Request, Response, NextFunction } from 'express';
import { Note } from '../models/note.model';

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

    // Save note to MongoDB
    const note = await Note.create({ content: content.trim() });

    // Return the saved note
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};
