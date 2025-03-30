import { Request, Response, Router } from 'express';

import { AssignmentRepository } from './AssignmentRepository';
import { CreateAssignmentController } from './CreateAssignmentController';
import { GetAssignmentByIdController } from './GetAssignmentByIdController';

export function setUpAssignmentRoutes({
  router,
  assignmentRepository,
}: {
  router: Router;
  assignmentRepository: AssignmentRepository;
}) {
  router.post('/assignments', async (req: Request, res: Response) =>
    new CreateAssignmentController(assignmentRepository).handle(req, res),
  );
  router.get('/assignments/:id', async (req: Request, res: Response) =>
    new GetAssignmentByIdController(assignmentRepository).handle(req, res),
  );
}
