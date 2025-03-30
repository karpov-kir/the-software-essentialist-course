import { Prisma, Student } from '@prisma/client';
import { z } from 'zod';

import { ValidationException } from '../shared/errors';

export interface AssignStudentToAssignmentDto {
  studentId: string;
  assignmentId: string;
}

const assignStudentToAssignmentDtoSchema = z.object({
  studentId: z.string().nonempty(),
  assignmentId: z.string().nonempty(),
});

export function newAssignStudentToAssignmentDtoFromRequest(body: unknown): AssignStudentToAssignmentDto {
  const parsed = assignStudentToAssignmentDtoSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationException({ message: 'Invalid assignment data' });
  }

  return parsed.data;
}

export interface CreateStudentDto {
  name: string;
}

const createStudentDtoSchema = z.object({
  name: z.string().nonempty(),
});

export function newCreateStudentDtoFromRequest(body: unknown): CreateStudentDto {
  const parsed = createStudentDtoSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationException({ message: 'Invalid student data' });
  }

  return parsed.data;
}

export interface EnrollStudentInClassDto {
  studentId: string;
  classId: string;
}

const enrollStudentInClassDtoSchema = z.object({
  studentId: z.string().nonempty(),
  classId: z.string().nonempty(),
});

export function newEnrollStudentInClassDtoFromRequest(body: unknown): EnrollStudentInClassDto {
  const parsed = enrollStudentInClassDtoSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationException({ message: 'Invalid enrollment data' });
  }

  return parsed.data;
}

export enum GradeType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export interface GradeStudentAssignmentDto {
  studentAssignmentId: string;
  grade: string;
}

const gradeStudentAssignmentDtoSchema = z.object({
  studentAssignmentId: z.string().nonempty(),
  grade: z.nativeEnum(GradeType),
});

export function newGradeStudentAssignmentDtoFromRequest(body: unknown): GradeStudentAssignmentDto {
  const parsed = gradeStudentAssignmentDtoSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationException({ message: 'Invalid grade data' });
  }

  return parsed.data;
}

export enum StudentAssignmentStatus {
  NotStarted = 'NOT_STARTED',
  Submitted = 'SUBMITTED',
}

export interface StudentAssignmentDto {
  id: string;
  studentId: string;
  grade: GradeType;
  status: StudentAssignmentStatus;
  assignment: {
    id: string;
    classId: string;
    title: string;
  };
}

export function newStudentAssignmentsDtoFromPrisma(
  assignments: Array<
    Prisma.StudentAssignmentGetPayload<{
      include: {
        assignment: true;
      };
    }>
  >,
): StudentAssignmentDto[] {
  return assignments.map((assignment) => ({
    id: assignment.id,
    studentId: assignment.studentId,
    grade: assignment.grade as GradeType,
    status: assignment.status as StudentAssignmentStatus,
    assignment: {
      id: assignment.assignment.id,
      classId: assignment.assignment.classId,
      title: assignment.assignment.title,
    },
  }));
}

export interface StudentDto {
  id: string;
  name: string;
}

export function newStudentDtoFromPrisma(student: Student): StudentDto {
  return {
    id: student.id,
    name: student.name,
  };
}

export interface StudentGradesDto {
  id: string;
  studentId: string;
  grade: GradeType;
  assignment: {
    id: string;
    classId: string;
    title: string;
  };
}

export function newStudentGradesDtoFromPrisma(
  studentAssignments: Array<
    Prisma.StudentAssignmentGetPayload<{
      include: {
        assignment: true;
      };
    }>
  >,
): StudentGradesDto[] {
  return studentAssignments.map((studentAssignment) => ({
    id: studentAssignment.id,
    studentId: studentAssignment.studentId,
    grade: studentAssignment.grade as GradeType,
    assignment: {
      id: studentAssignment.assignment.id,
      classId: studentAssignment.assignment.classId,
      title: studentAssignment.assignment.title,
    },
  }));
}
