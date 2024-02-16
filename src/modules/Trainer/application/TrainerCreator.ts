import { TrainerRepository } from '../domain/TrainerRepository';
import { TrainerId } from '../domain/value-object/TrainerId';
import { TrainerEmail } from '../domain/value-object/TrainerEmail';
import { TrainerPassword } from '../domain/value-object/TrainerPassword';
import { Trainer } from '../domain/Trainer';
import { AuthProvider, TrainerAuthProvider } from '../domain/value-object/TrainerAuthProvider';
import { InvalidRequestException } from '@/modules/Shared/domain/exception/InvalidRequestException';
import { UnixDate } from '@/modules/Shared/domain/value-object/UnixDate';

export class TrainerCreator {
  private repository: TrainerRepository;

  constructor(repository: TrainerRepository) {
    this.repository = repository;
  }

  async run({
    id,
    email,
    emailVerified,
    password,
    authProvider,
    providerAccountId,
    customerId,
  }: {
    id: string;
    email?: string;
    emailVerified?: number;
    password?: string;
    authProvider?: AuthProvider;
    providerAccountId?: string;
    customerId?: string;
  }): Promise<void> {
    if (authProvider === 'credentials' && !password) {
      throw new InvalidRequestException('Password is required');
    }

    const trainer = new Trainer({
      id: new TrainerId(id),
      email: email ? new TrainerEmail(email) : undefined,
      emailVerified: emailVerified ? new UnixDate(emailVerified) : undefined,
      password: password ? new TrainerPassword(password) : undefined,
      authProvider: authProvider ? new TrainerAuthProvider(authProvider) : undefined,
      providerAccountId: providerAccountId ?? undefined,
      customerId: customerId ? new TrainerId(customerId) : undefined,
    });

    await this.repository.save(trainer);
  }
}
