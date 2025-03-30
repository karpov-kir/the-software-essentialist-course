import { Request, Response } from 'express';

import { ValidationException } from '../shared/errors';
import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { isUuid } from '../utils/validation';
import { AssignmentNotFoundException } from './assignmentErrors';
import { AssignmentRepository } from './AssignmentRepository';

export class GetAssignmentByIdController {
  constructor(private readonly assignmentRepository: AssignmentRepository) {}

  async handle(req: Request, res: Response) {
    const { id: assignmentId } = req.params;

    if (!isUuid(assignmentId)) {
      throw new ValidationException({ message: 'Invalid assignment id' });
    }

    const assignmentDto = await this.assignmentRepository.findById(assignmentId);

    if (!assignmentDto) {
      throw new AssignmentNotFoundException();
    }

    res.status(200).json(newServerSuccessResponseDto({ data: assignmentDto }));
  }
}
