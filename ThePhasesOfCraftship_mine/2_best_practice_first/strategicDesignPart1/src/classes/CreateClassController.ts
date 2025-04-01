import { Request, Response } from 'express';

import { newServerSuccessResponseDto } from '../shared/serverResponseDto';
import { newCreateClassDtoFromRequest } from './classDtos';
import { ClassRepository } from './ClassRepository';

export class CreateClassController {
  constructor(private readonly classRepository: ClassRepository) {}

  async handle(req: Request, res: Response) {
    const createClassDto = newCreateClassDtoFromRequest(req.body);
    const { classId } = await this.classRepository.create(createClassDto);

    res.status(201).json(newServerSuccessResponseDto({ data: { classId } }));
  }
}
