PRAGMA foreign_keys=off;
DROP TABLE "AssignmentGrade";
PRAGMA foreign_keys=on;

CREATE TABLE "GradedAssignment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "assignmentSubmissionId" TEXT NOT NULL,
  "grade" TEXT,
  CONSTRAINT "GradedAssignment_assignmentSubmissionId_fkey" FOREIGN KEY ("assignmentSubmissionId") REFERENCES "AssignmentSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "GradedAssignment_assignmentSubmissionId_key" ON "GradedAssignment"("assignmentSubmissionId");
