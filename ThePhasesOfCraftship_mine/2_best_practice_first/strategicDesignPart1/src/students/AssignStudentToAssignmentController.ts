import { Request, Response } from 'express';

import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { newAssignStudentToAssignmentDtoFromRequest } from './studentDtos';
import { StudentRepository } from './StudentRepository';

export class AssignStudentToAssignmentController {
  constructor(private readonly studentRepository: StudentRepository) {}

  async handle(req: Request, res: Response) {
    const assignStudentToAssignmentDto = newAssignStudentToAssignmentDtoFromRequest(req.body);
    const { studentAssignmentId } = await this.studentRepository.assignToAssignment(assignStudentToAssignmentDto);

    res.status(201).json(
      newServerSuccessResponseDto({
        data: {
          studentAssignmentId,
        },
      }),
    );
  }
}
