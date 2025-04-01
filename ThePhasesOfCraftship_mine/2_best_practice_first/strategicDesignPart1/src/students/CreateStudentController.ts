import { Request, Response } from 'express';

import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { newCreateStudentDtoFromRequest } from './studentDtos';
import { StudentRepository } from './StudentRepository';

export class CreateStudentController {
  constructor(private readonly studentRepository: StudentRepository) {}
  async handle(req: Request, res: Response) {
    const createStudentDto = newCreateStudentDtoFromRequest(req.body);
    const { studentId } = await this.studentRepository.create(createStudentDto);

    res.status(201).json(newServerSuccessResponseDto({ data: { studentId } }));
  }
}
