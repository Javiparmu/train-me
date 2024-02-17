import { Trainer } from './Trainer';
import { TrainerEmail } from './value-object/TrainerEmail';
import { TrainerId } from './value-object/TrainerId';

export interface TrainerRepository {
  save(trainer: Trainer): Promise<void>;
  search(id: TrainerId): Promise<Trainer | null>;
  searchByEmail(email: TrainerEmail): Promise<Trainer | null>;
  searchByProviderAccountId(providerAccountId: string): Promise<Trainer | null>;
  delete: (id: TrainerId) => Promise<void>;
}
