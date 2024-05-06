import { UserRepository } from '../domain/UserRepository';
import { UserId } from '../domain/value-object/UserId';
import { UserEmail } from '../domain/value-object/UserEmail';
import { UserPassword } from '../domain/value-object/UserPassword';
import { User } from '../domain/User';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/dependency-injection/types';

@injectable()
export class UserCreator {
  private repository: UserRepository;

  constructor(@inject(TYPES.UserRepository) repository: UserRepository) {
    this.repository = repository;
  }

  async run({ id, email, password }: { id: string; email?: string; password?: string }): Promise<void> {
    const user = new User({
      id: new UserId(id),
      email: email ? new UserEmail(email) : undefined,
      password: password ? new UserPassword(password) : undefined,
    });

    await this.repository.save(user);
  }
}
