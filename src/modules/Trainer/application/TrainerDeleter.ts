import { TrainerRepository } from '../domain/TrainerRepository';
import { TrainerId } from '../domain/value-object/TrainerId';

export class TrainerDeleter {
  private repository: TrainerRepository;

  constructor(repository: TrainerRepository) {
    this.repository = repository;
  }

  async run(id: string): Promise<void> {
    return this.repository.delete(new TrainerId(id));
  }
}
