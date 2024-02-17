import { MongoRepository } from '@/modules/Shared/infrastructure/persistence/MongoRepository';
import { Trainer } from '../../domain/Trainer';
import { TrainerRepository } from '../../domain/TrainerRepository';
import TrainerModel from '@/modules/Trainer/infrastructure/persistence/mongoose/Trainer';
import { TrainerId } from '../../domain/value-object/TrainerId';
import { TrainerEmail } from '../../domain/value-object/TrainerEmail';
import { TrainerDocument } from './mongoose/documents';
import { MongooseConnection } from '@/modules/Shared/infrastructure/persistence/MongooseConnection';

export class MongoTrainerRepository extends MongoRepository<Trainer> implements TrainerRepository {
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

  public async delete(id: TrainerId): Promise<void> {
    await MongooseConnection.connect();

    await TrainerModel.findByIdAndDelete(id);
  }
}
