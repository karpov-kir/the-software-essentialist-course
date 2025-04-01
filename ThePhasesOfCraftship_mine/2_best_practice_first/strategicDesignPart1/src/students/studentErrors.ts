import { ServerException } from '../shared/errors';

export class StudentNotFoundException extends ServerException {
  constructor() {
    super({ type: 'student-not-found', statusCode: 404, message: 'Student not found' });
  }
}

export class StudentAlreadyEnrolledException extends ServerException {
  constructor() {
    super({ type: 'student-already-enrolled', statusCode: 400, message: 'Student already enrolled' });
  }
}
