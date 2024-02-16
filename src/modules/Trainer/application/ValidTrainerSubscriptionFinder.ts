import { TrainerSubscription } from '../domain/TrainerSubscription';
import { TrainerSubscriptionRepository } from '../domain/TrainerSubscriptionRepository';
import { TrainerId } from '../domain/value-object/TrainerId';

export class ValidTrainerSubscriptionFinder {
  private repository: TrainerSubscriptionRepository;

  constructor(repository: TrainerSubscriptionRepository) {
    this.repository = repository;
  }

  async run(id: string): Promise<TrainerSubscription | null> {
    return this.repository.searchValid(new TrainerId(id));
  }
}
