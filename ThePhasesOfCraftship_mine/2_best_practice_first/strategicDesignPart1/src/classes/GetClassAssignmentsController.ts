import { Request, Response } from 'express';

import { ValidationException } from '../shared/errors';
import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { isUuid } from '../utils/validation';
import { ClassRepository } from './ClassRepository';

export class GetClassAssignmentsController {
  constructor(private readonly classRepository: ClassRepository) {}

  async handle(req: Request, res: Response) {
    const { id: classId } = req.params;

    if (!isUuid(classId)) {
      throw new ValidationException({ message: 'Invalid class id' });
    }

    const classAssignmentDtos = await this.classRepository.getAssignments(classId);

    res.status(200).json(newServerSuccessResponseDto({ data: classAssignmentDtos }));
  }
}
