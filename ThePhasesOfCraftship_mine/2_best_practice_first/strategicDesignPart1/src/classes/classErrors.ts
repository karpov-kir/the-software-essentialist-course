import { ServerException } from '../shared/errors';

export class ClassNotFoundException extends ServerException {
  constructor() {
    super({ type: 'class-not-found', statusCode: 404, message: 'Class not found' });
  }
}
