import { MongoRepository } from '@/modules/Shared/infrastructure/persistence/MongoRepository';
import { TrainerSubscription } from '../../domain/TrainerSubscription';
import { TrainerSubscriptionRepository } from '../../domain/TrainerSubscriptionRepository';
import { TrainerId } from '../../domain/value-object/TrainerId';
import TrainerSubscriptionModel from './mongoose/TrainerSubscription';
import { TrainerSubscriptionDocument } from './mongoose/documents';
import { MONTH_IN_MS } from '../../Shared/constants';
import { MongooseConnection } from '@/modules/Shared/infrastructure/persistence/MongooseConnection';

export class MongoTrainerSubscriptionRepository extends MongoRepository<TrainerSubscription> implements TrainerSubscriptionRepository {
  constructor() {
    super(TrainerSubscriptionModel);
  }

  public async save(trainerSubscription: TrainerSubscription): Promise<void> {
    await this.persist(trainerSubscription.id, trainerSubscription);
  }

  public async search(trainerId: TrainerId): Promise<TrainerSubscription | null> {
    await MongooseConnection.connect({ url: process.env.MONGODB_URI ?? '' });

    const trainerSubscription = await TrainerSubscriptionModel.findOne({ trainerId }).lean<TrainerSubscriptionDocument>();

    return trainerSubscription ? TrainerSubscription.fromPrimitives({ ...trainerSubscription, id: trainerSubscription._id }) : null;
  }

  public async searchValid(trainerId: TrainerId): Promise<TrainerSubscription | null> {
    await MongooseConnection.connect({ url: process.env.MONGODB_URI ?? '' });

    const trainerSubscription = await TrainerSubscriptionModel.findOne({
      trainerId,
      stripeCurrentPeriodEnd: { $gt: Date.now() - MONTH_IN_MS },
    }).lean<TrainerSubscriptionDocument>();

    return trainerSubscription ? TrainerSubscription.fromPrimitives({ ...trainerSubscription, id: trainerSubscription._id }) : null;
  }
}
