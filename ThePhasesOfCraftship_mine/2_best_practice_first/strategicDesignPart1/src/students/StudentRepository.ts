import { AssignmentNotFoundException } from '../assignments/exports';
import { ClassNotFoundException } from '../classes/exports';
import { prisma } from '../shared/database';
import {
  AssignStudentToAssignmentDto,
  CreateStudentDto,
  EnrollStudentInClassDto,
  GradeStudentAssignmentDto,
  newStudentAssignmentsDtoFromPrisma,
  newStudentDtoFromPrisma,
  newStudentGradesDtoFromPrisma,
  StudentAssignmentDto,
  StudentAssignmentStatus,
  StudentDto,
  StudentGradesDto,
} from './studentDtos';
import { StudentAlreadyEnrolledException, StudentNotFoundException } from './studentErrors';

export class StudentRepository {
  async create(createStudentDto: CreateStudentDto) {
    const student = await prisma.student.create({
      data: createStudentDto,
    });

    return {
      studentId: student.id,
    };
  }

  async findById(studentId: string): Promise<StudentDto> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    return newStudentDtoFromPrisma(student);
  }

  async find(): Promise<StudentDto[]> {
    const students = await prisma.student.findMany({
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return students.map(newStudentDtoFromPrisma);
  }

  async assignToAssignment(assignStudentToAssignmentDto: AssignStudentToAssignmentDto) {
    const student = await prisma.student.findUnique({
      where: {
        id: assignStudentToAssignmentDto.studentId,
      },
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignStudentToAssignmentDto.assignmentId,
      },
    });

    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    const studentAssignment = await prisma.studentAssignment.create({
      data: assignStudentToAssignmentDto,
    });

    return {
      studentAssignmentId: studentAssignment.id,
    };
  }

  private async isAlreadyEnrolledInClass({ studentId, classId }: { studentId: string; classId: string }) {
    return Boolean(
      await prisma.classEnrollment.findFirst({
        where: {
          studentId,
          classId,
        },
      }),
    );
  }

  async enrollInClass(enrollStudentInClassDto: EnrollStudentInClassDto) {
    const student = await prisma.student.findUnique({
      where: {
        id: enrollStudentInClassDto.studentId,
      },
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    const cls = await prisma.class.findUnique({
      where: {
        id: enrollStudentInClassDto.classId,
      },
    });

    if (!cls) {
      throw new ClassNotFoundException();
    }

    const isAlreadyEnrolledInClass = await this.isAlreadyEnrolledInClass(enrollStudentInClassDto);

    if (isAlreadyEnrolledInClass) {
      throw new StudentAlreadyEnrolledException();
    }

    await prisma.classEnrollment.create({
      data: enrollStudentInClassDto,
    });

    return {
      classId: enrollStudentInClassDto.classId,
      studentId: enrollStudentInClassDto.studentId,
    };
  }

  async getAssignments(studentId: string): Promise<StudentAssignmentDto[]> {
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    return newStudentAssignmentsDtoFromPrisma(
      await prisma.studentAssignment.findMany({
        where: {
          studentId,
        },
        include: {
          assignment: true,
        },
      }),
    );
  }

  async getGrades(studentId: string): Promise<StudentGradesDto[]> {
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId,
        status: StudentAssignmentStatus.Submitted,
        grade: {
          not: null,
        },
      },
      include: {
        assignment: true,
      },
    });

    return newStudentGradesDtoFromPrisma(studentAssignments);
  }

  private async hasAssignment(studentAssignmentId: string) {
    return Boolean(
      await prisma.studentAssignment.findUnique({
        where: {
          id: studentAssignmentId,
        },
      }),
    );
  }

  async gradeAssignment(gradeStudentAssignmentDto: GradeStudentAssignmentDto) {
    const studentHasAssignment = await this.hasAssignment(gradeStudentAssignmentDto.studentAssignmentId);

    if (!studentHasAssignment) {
      throw new AssignmentNotFoundException();
    }

    await prisma.studentAssignment.update({
      where: {
        id: gradeStudentAssignmentDto.studentAssignmentId,
      },
      data: {
        grade: gradeStudentAssignmentDto.grade,
      },
    });

    return {
      studentAssignmentId: gradeStudentAssignmentDto.studentAssignmentId,
    };
  }

  async submitAssignment(studentAssignmentId: string) {
    const studentHasAssignment = await this.hasAssignment(studentAssignmentId);

    if (!studentHasAssignment) {
      throw new AssignmentNotFoundException();
    }

    await prisma.studentAssignment.update({
      where: {
        id: studentAssignmentId,
      },
      data: {
        status: StudentAssignmentStatus.Submitted,
      },
    });

    return {
      studentAssignmentId,
    };
  }
}
