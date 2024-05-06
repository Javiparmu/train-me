import { MongoRepository } from '@/modules/Shared/infrastructure/persistence/MongoRepository';
import { User } from '../../domain/User';
import { UserRepository } from '../../domain/UserRepository';
import UserModel from '@/modules/User/infrastructure/persistence/mongoose/User';
import { UserId } from '../../domain/value-object/UserId';
import { UserEmail } from '../../domain/value-object/UserEmail';
import { UserDocument } from './mongoose/documents';
import { injectable } from 'inversify';

@injectable()
export class MongoUserRepository extends MongoRepository<User> implements UserRepository {
  protected get model() {
    return UserModel;
  }

  public async save(user: User): Promise<void> {
    await this.persist(user.id, user);
  }

  public async search(id: UserId): Promise<User | null> {
    await this.connection.connect();

    const user = await this.model.findById(id).lean<UserDocument>();

    return user ? User.fromPrimitives({ ...user, id: user._id }) : null;
  }

  public async searchByEmail(email: UserEmail): Promise<User | null> {
    await this.connection.connect();

    const user = await this.model.findOne({ email }).lean<UserDocument>();

    return user ? User.fromPrimitives({ ...user, id: user._id }) : null;
  }

  public async delete(id: UserId): Promise<void> {
    await this.connection.connect();

    await this.model.findByIdAndDelete(id);
  }
}
