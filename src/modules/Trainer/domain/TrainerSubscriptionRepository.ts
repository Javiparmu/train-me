import { TrainerSubscription } from './TrainerSubscription';
import { TrainerId } from './value-object/TrainerId';

export interface TrainerSubscriptionRepository {
  save(subscription: TrainerSubscription): Promise<void>;
  search(id: TrainerId): Promise<TrainerSubscription | null>;
  searchValid(id: TrainerId): Promise<TrainerSubscription | null>;
}
