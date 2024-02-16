import { MongoRepository } from '@/modules/Shared/infrastructure/persistence/MongoRepository';
import { Trainer } from '../../domain/Trainer';
import { TrainerRepository } from '../../domain/TrainerRepository';
import TrainerModel from '@/modules/Trainer/infrastructure/persistence/mongoose/Trainer';
import { TrainerId } from '../../domain/value-object/TrainerId';
import { TrainerEmail } from '../../domain/value-object/TrainerEmail';
import { TrainerDocument } from './mongoose/documents';
import { MongoTrainerSubscriptionRepository } from './MongoTrainerSubscriptionRepository';
import { TrainerSubscription } from '../../domain/TrainerSubscription';
import { MongooseConnection } from '@/modules/Shared/infrastructure/persistence/MongooseConnection';
import { SubscriptionId } from '@/modules/Subscription/domain/value-object/SubscriptionId';

export class MongoTrainerRepository extends MongoRepository<Trainer> implements TrainerRepository {
  private readonly trainerSubscriptionRepository = new MongoTrainerSubscriptionRepository();

  constructor() {
    super(TrainerModel);
  }

  public async save(trainer: Trainer): Promise<void> {
    await this.persist(trainer.id, trainer);
  }

  public async search(id: TrainerId): Promise<Trainer | null> {
    await MongooseConnection.connect();

    const trainer = await TrainerModel.findById(id).lean<TrainerDocument>();

    return trainer ? Trainer.fromPrimitives({ ...trainer, id: trainer._id }) : null;
  }

  public async searchByEmail(email: TrainerEmail): Promise<Trainer | null> {
    await MongooseConnection.connect();

    const trainer = await TrainerModel.findOne({ email }).lean<TrainerDocument>();

    return trainer ? Trainer.fromPrimitives({ ...trainer, id: trainer._id }) : null;
  }

  public async searchByProviderAccountId(providerAccountId: string): Promise<Trainer | null> {
    await MongooseConnection.connect();

    const trainer = await TrainerModel.findOne({ providerAccountId }).lean<TrainerDocument>();

    return trainer ? Trainer.fromPrimitives({ ...trainer, id: trainer._id }) : null;
  }

  public async subscribe(subscription: TrainerSubscription): Promise<void> {
    await MongooseConnection.connect();

    await this.trainerSubscriptionRepository.save(subscription);

    const trainer = new Trainer({
      id: subscription.trainerId!,
      plan: new SubscriptionId(subscription.id.value),
    });

    await this.save(trainer);
  }

  public async getIsSubscribed(id: TrainerId): Promise<boolean> {
    const trainerSubscription = await this.trainerSubscriptionRepository.searchValid(id);

    return !!trainerSubscription;
  }

  public async delete(id: TrainerId): Promise<void> {
    await MongooseConnection.connect();

    await TrainerModel.findByIdAndDelete(id);
  }
}
