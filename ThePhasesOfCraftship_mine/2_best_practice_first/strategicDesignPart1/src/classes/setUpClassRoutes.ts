import { Request, Response, Router } from 'express';

import { ClassRepository } from './ClassRepository';
import { CreateClassController } from './CreateClassController';
import { GetClassAssignmentsController } from './GetClassAssignmentsController';

export function setUpClassRoutes({ router, classRepository }: { router: Router; classRepository: ClassRepository }) {
  router.post('/classes', async (req: Request, res: Response) =>
    new CreateClassController(classRepository).handle(req, res),
  );
  router.get('/classes/:id/assignments', async (req: Request, res: Response) =>
    new GetClassAssignmentsController(classRepository).handle(req, res),
  );
}
