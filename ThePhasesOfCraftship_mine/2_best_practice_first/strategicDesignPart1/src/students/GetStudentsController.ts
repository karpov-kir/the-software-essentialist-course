import { Request, Response } from 'express';

import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { StudentRepository } from './StudentRepository';

export class GetStudentsController {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(req: Request, res: Response) {
    const studentDtos = await this.studentRepository.find();

    res.status(200).json(newServerSuccessResponseDto({ data: studentDtos }));
  }
}
