import { Request, Response } from 'express';

import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { newGradeStudentAssignmentDtoFromRequest } from './studentDtos';
import { StudentRepository } from './StudentRepository';

export class GradeStudentAssignmentController {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(req: Request, res: Response) {
    const gradeStudentAssignmentDto = newGradeStudentAssignmentDtoFromRequest(req.body);
    const { studentAssignmentId } = await this.studentRepository.gradeAssignment(gradeStudentAssignmentDto);

    res.status(200).json(newServerSuccessResponseDto({ data: { studentAssignmentId } }));
  }
}
