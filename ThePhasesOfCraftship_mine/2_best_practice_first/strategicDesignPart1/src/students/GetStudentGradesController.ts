import { Request, Response } from 'express';

import { ValidationException } from '../shared/errors';
import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { isUuid } from '../utils/validation';
import { StudentRepository } from './StudentRepository';

export class GetStudentGradesController {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(req: Request, res: Response) {
    const { id: studentId } = req.params;

    if (!isUuid(studentId)) {
      throw new ValidationException({ message: 'Invalid student id' });
    }

    const studentGradesDtos = await this.studentRepository.getGrades(studentId);

    res.status(200).json(newServerSuccessResponseDto({ data: studentGradesDtos }));
  }
}
