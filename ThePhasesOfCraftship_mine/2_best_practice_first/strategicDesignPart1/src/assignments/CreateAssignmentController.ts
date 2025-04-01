import { Request, Response } from 'express';

import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { newCreateAssignmentDtoFromRequest } from './assignmentDtos';
import { AssignmentRepository } from './AssignmentRepository';

export class CreateAssignmentController {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async handle(req: Request, res: Response) {
    const createAssignmentDto = newCreateAssignmentDtoFromRequest(req.body);
    const { assignmentId } = await this.assignmentRepository.create(createAssignmentDto);

    res.status(201).json(
      newServerSuccessResponseDto({
        data: {
          assignmentId,
        },
      }),
    );
  }
}
