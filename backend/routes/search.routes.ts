import { Router } from 'express';
import { searchNotes } from '../controllers/search.controller';

const router = Router();

/**
 * POST /api/search
 * Semantic search endpoint for finding notes by natural language query
 */
router.post('/', searchNotes);

export default router;
