import { Model } from 'mongoose';
import { AggregateRoot } from '../../domain/AggregateRoot';
import { StringValueObject } from '../../domain/value-object/StringValueObject';
import { MongooseConnection } from './MongooseConnection';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/dependency-injection/types';

@injectable()
export abstract class MongoRepository<T extends AggregateRoot> {
  constructor(@inject(TYPES.MongooseConnection) protected readonly connection: MongooseConnection) {}

  protected abstract get model(): Model<T>;

  public async persist(id: StringValueObject, aggregateRoot: T): Promise<void> {
    await this.connection.connect({ url: process.env.MONGODB_URI ?? '' });

    const document = { ...aggregateRoot, _id: id };
    await this.model.updateOne({ _id: id }, { $set: document }, { upsert: true, strict: true });
  }
}
