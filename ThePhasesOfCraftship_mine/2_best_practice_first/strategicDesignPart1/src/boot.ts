import cors from 'cors';
import express, { Router } from 'express';

import { AssignmentRepository } from './assignments/AssignmentRepository';
import { setUpAssignmentRoutes } from './assignments/setUpAssignmentRoutes';
import { ClassRepository } from './classes/ClassRepository';
import { setUpClassRoutes } from './classes/setUpClassRoutes';
import { errorHandlerMiddleware } from './errorHandlerMiddleware';
import { setUpStudentRoutes } from './students/setUpStudentRoutes';
import { StudentRepository } from './students/StudentRepository';

export function boot() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const router = Router();

  app.use(router);

  const studentRepository = new StudentRepository();
  const assignmentRepository = new AssignmentRepository();
  const classRepository = new ClassRepository();

  setUpAssignmentRoutes({ router, assignmentRepository });
  setUpClassRoutes({ router, classRepository });
  setUpStudentRoutes({ router, studentRepository });

  app.use(errorHandlerMiddleware);

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
