import { inject, injectable } from 'inversify';
import { UserRepository } from '../domain/UserRepository';
import { UserId } from '../domain/value-object/UserId';
import { TYPES } from '@/dependency-injection/types';

@injectable()
export class UserDeleter {
  private repository: UserRepository;

  constructor(@inject(TYPES.UserRepository) repository: UserRepository) {
    this.repository = repository;
  }

  async run(id: string): Promise<void> {
    return this.repository.delete(new UserId(id));
  }
}
