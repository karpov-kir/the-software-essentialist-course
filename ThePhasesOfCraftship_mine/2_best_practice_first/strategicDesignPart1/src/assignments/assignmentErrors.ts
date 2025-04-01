import { ServerException } from '../shared/errors';

export class AssignmentNotFoundException extends ServerException {
  constructor() {
    super({
      type: 'assignment-not-found',
      message: 'Assignment not found',
      statusCode: 404,
    });
  }
}
