import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { ValidationException } from '../shared/errors';

export interface CreateAssignmentDto {
  classId: string;
  title: string;
}

const createAssignmentDtoSchema = z.object({
  classId: z.string().nonempty(),
  title: z.string().nonempty(),
});

export function newCreateAssignmentDtoFromRequest(body: unknown): CreateAssignmentDto {
  const parsed = createAssignmentDtoSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationException({ message: 'Assignment data is invalid' });
  }

  return parsed.data;
}

export interface AssignmentDto {
  id: string;
  title: string;
  class: {
    id: string;
    name: string;
  };
}

export function newAssignmentDtoFromPrisma(
  assignment: Prisma.AssignmentGetPayload<{
    include: {
      class: true;
    };
  }>,
): AssignmentDto {
  return {
    id: assignment.id,
    title: assignment.title,
    class: {
      id: assignment.class.id,
      name: assignment.class.name,
    },
  };
}
