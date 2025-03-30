import { Request, Response, Router } from 'express';

import { AssignStudentToAssignmentController } from './AssignStudentToAssignmentController';
import { CreateStudentController } from './CreateStudentController';
import { EnrollStudentInClassController } from './EnrollStudentInClassController';
import { GetStudentAssignmentsController } from './GetStudentAssignmentsController';
import { GetStudentByIdController } from './GetStudentByIdController';
import { GetStudentGradesController } from './GetStudentGradesController';
import { GetStudentsController } from './GetStudentsController';
import { GradeStudentAssignmentController } from './GradeStudentAssignmentController';
import { StudentRepository } from './StudentRepository';
import { SubmitStudentAssignmentController } from './SubmitStudentAssignmentController';

export function setUpStudentRoutes({
  router,
  studentRepository,
}: {
  router: Router;
  studentRepository: StudentRepository;
}) {
  router.post('/students', (req: Request, res: Response) =>
    new CreateStudentController(studentRepository).handle(req, res),
  );
  router.get('/students', async (req: Request, res: Response) =>
    new GetStudentsController(studentRepository).handle(req, res),
  );
  router.get('/students/:id', async (req: Request, res: Response) =>
    new GetStudentByIdController(studentRepository).handle(req, res),
  );
  router.post('/student-assignments', async (req: Request, res: Response) =>
    new AssignStudentToAssignmentController(studentRepository).handle(req, res),
  );
  router.get('/student/:id/assignments', async (req: Request, res: Response) =>
    new GetStudentAssignmentsController(studentRepository).handle(req, res),
  );
  router.post('/student-assignments/submit', async (req: Request, res: Response) =>
    new SubmitStudentAssignmentController(studentRepository).handle(req, res),
  );
  router.post('/student-assignments/grade', async (req: Request, res: Response) =>
    new GradeStudentAssignmentController(studentRepository).handle(req, res),
  );
  router.get('/student/:id/grades', async (req: Request, res: Response) =>
    new GetStudentGradesController(studentRepository).handle(req, res),
  );
  router.post('/class-enrollments', (req: Request, res: Response) =>
    new EnrollStudentInClassController(studentRepository).handle(req, res),
  );
}
