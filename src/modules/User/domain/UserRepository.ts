import { User } from './User';
import { UserEmail } from './value-object/UserEmail';
import { UserId } from './value-object/UserId';

export interface UserRepository {
  save(user: User): Promise<void>;
  search(id: UserId): Promise<User | null>;
  searchByEmail(email: UserEmail): Promise<User | null>;
  delete: (id: UserId) => Promise<void>;
}
