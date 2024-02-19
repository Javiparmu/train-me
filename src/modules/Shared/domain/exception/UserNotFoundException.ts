import { CustomException } from './CustomException';

export class TrainerNotFoundException extends CustomException {
  constructor() {
    super('Trainer not found', 404);
  }
}
