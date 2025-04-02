CREATE TABLE "Student" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL
);

CREATE TABLE "Class" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL
);

CREATE TABLE "ClassEnrollment" (
  "studentId" TEXT NOT NULL,
  "classId" TEXT NOT NULL,

  PRIMARY KEY ("studentId", "classId"),
  CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Assignment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "classId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  CONSTRAINT "Assignment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "StudentAssignment" (
  "studentId" TEXT NOT NULL,
  "assignmentId" TEXT NOT NULL,
  "grade" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',

  PRIMARY KEY ("studentId", "assignmentId"),
  CONSTRAINT "StudentAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "StudentAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ReportCard" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  CONSTRAINT "ReportCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ClassGradeReport" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "classId" TEXT NOT NULL,
  CONSTRAINT "ClassGradeReport_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

CREATE UNIQUE INDEX "ClassGradeReport_classId_key" ON "ClassGradeReport"("classId");
