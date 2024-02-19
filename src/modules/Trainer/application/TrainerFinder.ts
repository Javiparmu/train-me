import { Trainer } from '../domain/Trainer';
import { TrainerRepository } from '../domain/TrainerRepository';
import { TrainerEmail } from '../domain/value-object/TrainerEmail';
import { TrainerId } from '../domain/value-object/TrainerId';

export class TrainerFinder {
  private repository: TrainerRepository;

  constructor(repository: TrainerRepository) {
    this.repository = repository;
  }

  async run(email: string): Promise<Trainer | null> {
    return this.repository.searchByEmail(new TrainerEmail(email));
  }

  async runById(id: string): Promise<Trainer | null> {
    return this.repository.search(new TrainerId(id));
  }

  async runByProviderAccountId(providerAccountId: string): Promise<Trainer | null> {
    return this.repository.searchByProviderAccountId(providerAccountId);
  }
}
