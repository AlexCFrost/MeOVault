import { Router } from 'express';
import { createNote } from '../controllers/notes.controller';

const router = Router();

router.post('/', createNote);

export default router;
