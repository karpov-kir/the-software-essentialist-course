import { Request, Response } from 'express';

import { ValidationException } from '../shared/errors';
import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { isUuid } from '../utils/validation';
import { StudentRepository } from './StudentRepository';

export class GetStudentByIdController {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(req: Request, res: Response) {
    const { id: studentId } = req.params;

    if (!isUuid(studentId)) {
      throw new ValidationException({ message: 'Invalid student ID' });
    }

    const studentDto = await this.studentRepository.findById(studentId);

    res.status(200).json(newServerSuccessResponseDto({ data: studentDto }));
  }
}
