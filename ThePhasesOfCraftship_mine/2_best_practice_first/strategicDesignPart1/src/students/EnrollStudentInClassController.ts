import { Request, Response } from 'express';

import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { newEnrollStudentInClassDtoFromRequest } from './studentDtos';
import { StudentRepository } from './StudentRepository';

export class EnrollStudentInClassController {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(req: Request, res: Response) {
    const enrollStudentInClassDto = newEnrollStudentInClassDtoFromRequest(req.body);
    const { classId, studentId } = await this.studentRepository.enrollInClass(enrollStudentInClassDto);

    res.status(201).json(
      newServerSuccessResponseDto({
        data: {
          classId,
          studentId,
        },
      }),
    );
  }
}
