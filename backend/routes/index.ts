import { Router } from 'express';
import healthRoutes from './health.routes';
import notesRoutes from './notes.routes';
import searchRoutes from './search.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/notes', notesRoutes);
router.use('/search', searchRoutes);

export default router;
