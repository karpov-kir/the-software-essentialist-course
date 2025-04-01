import { Request, Response } from 'express';

import { ValidationException } from '../shared/errors';
import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { isUuid } from '../utils/validation';
import { StudentRepository } from './StudentRepository';

export class SubmitStudentAssignmentController {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(req: Request, res: Response) {
    const studentAssignmentId = req.body?.id;

    if (!isUuid(studentAssignmentId)) {
      throw new ValidationException({ message: 'Invalid assignment ID' });
    }

    await this.studentRepository.submitAssignment(studentAssignmentId);

    res.status(200).json(newServerSuccessResponseDto({ data: { studentAssignmentId } }));
  }
}
