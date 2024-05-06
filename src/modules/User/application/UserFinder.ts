import { inject, injectable } from 'inversify';
import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';
import { UserEmail } from '../domain/value-object/UserEmail';
import { UserId } from '../domain/value-object/UserId';
import { TYPES } from '@/dependency-injection/types';

@injectable()
export class UserFinder {
  private repository: UserRepository;

  constructor(@inject(TYPES.UserRepository) repository: UserRepository) {
    this.repository = repository;
  }

  async run(email: string): Promise<User | null> {
    return this.repository.searchByEmail(new UserEmail(email));
  }

  async runById(id: string): Promise<User | null> {
    return this.repository.search(new UserId(id));
  }
}
