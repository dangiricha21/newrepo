import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  deleteProject,
  getProjectById,
  getProjectPreview,
  getPublishedProjects,
  makeRevision,
  rollbackToVersion,
  saveProjectCode
} from '../controllers/projectController.js';
import prisma from '../lib/prisma.js';

const projectRouter = express.Router();

projectRouter.post('/revision/:projectId',(req, res, next) => {
    console.log("ROUTE HIT");
    next();
  },
  protect,
  makeRevision
);


projectRouter.put('/save/:projectId', protect, saveProjectCode);
projectRouter.get('/rollback/:projectId/:versionId', protect, rollbackToVersion);
projectRouter.delete('/:projectId', protect, deleteProject);
projectRouter.get('/preview/:projectId', protect, getProjectPreview);
projectRouter.get('/published',protect, getPublishedProjects);
projectRouter.get('/:projectId', protect, getProjectById);

export default projectRouter;