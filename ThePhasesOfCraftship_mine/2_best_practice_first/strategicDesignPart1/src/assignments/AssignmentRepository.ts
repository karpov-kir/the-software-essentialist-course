import { prisma } from '../shared/database';
import { AssignmentDto, CreateAssignmentDto, newAssignmentDtoFromPrisma } from './assignmentDtos';

export class AssignmentRepository {
  async findById(assignmentId: string): Promise<AssignmentDto | undefined> {
    const assignment = await prisma.assignment.findUnique({
      include: {
        class: true,
      },
      where: { id: assignmentId },
    });

    return assignment ? newAssignmentDtoFromPrisma(assignment) : undefined;
  }

  async create(createAssignmentDto: CreateAssignmentDto) {
    const assignment = await prisma.assignment.create({
      data: createAssignmentDto,
    });

    return { assignmentId: assignment.id };
  }
}
