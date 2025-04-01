import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { ValidationException } from '../shared/errors';

export interface CreateClassDto {
  name: string;
}

const createClassDtoSchema = z.object({
  name: z.string().nonempty(),
});

export function newCreateClassDtoFromRequest(body: unknown): CreateClassDto {
  const parsed = createClassDtoSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationException({ message: 'Class data is invalid' });
  }

  return parsed.data;
}

export interface ClassAssignmentDto {
  id: string;
  title: string;
  class: {
    id: string;
    name: string;
  };
  studentTasks: Array<{
    id: string;
    student: {
      id: string;
      name: string;
    };
    status: string;
  }>;
}

export function newClassAssignmentDtoFromPrisma(
  assignment: Prisma.AssignmentGetPayload<{
    include: {
      class: true;
      studentTasks: {
        include: {
          student: true;
        };
      };
    };
  }>,
): ClassAssignmentDto {
  return {
    id: assignment.id,
    title: assignment.title,
    class: {
      id: assignment.class.id,
      name: assignment.class.name,
    },
    studentTasks: assignment.studentTasks.map((studentTask) => ({
      id: studentTask.id,
      student: {
        id: studentTask.student.id,
        name: studentTask.student.name,
      },
      status: studentTask.status,
    })),
  };
}
