import { prisma } from '../shared/database';
import { ClassAssignmentDto, CreateClassDto, newClassAssignmentDtoFromPrisma } from './classDtos';
import { ClassNotFoundException } from './classErrors';

export class ClassRepository {
  async create(createClassDto: CreateClassDto) {
    const cls = await prisma.class.create({
      data: createClassDto,
    });

    return { classId: cls.id };
  }

  async getAssignments(classId: string): Promise<ClassAssignmentDto[]> {
    const cls = await prisma.class.findUnique({ where: { id: classId } });

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        classId,
      },
      include: {
        class: true,
        studentTasks: {
          include: {
            student: true,
          },
        },
      },
    });

    return assignments.map((assignment) => newClassAssignmentDtoFromPrisma(assignment));
  }
}
