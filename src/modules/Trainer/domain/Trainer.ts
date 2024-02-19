import { Primitives } from '@/modules/Shared/domain/Primitives';
import { TrainerEmail } from './value-object/TrainerEmail';
import { TrainerId } from './value-object/TrainerId';
import { TrainerPassword } from './value-object/TrainerPassword';
import { AggregateRoot } from '@/modules/Shared/domain/AggregateRoot';
import { TrainerAuthProvider } from './value-object/TrainerAuthProvider';

export class Trainer extends AggregateRoot {
  readonly id: TrainerId;
  readonly email?: TrainerEmail;
  readonly password?: TrainerPassword;
  readonly authProvider?: TrainerAuthProvider;
  readonly providerAccountId?: string;

  constructor({
    id,
    email,
    password,
    authProvider,
    providerAccountId,
  }: {
    id: TrainerId;
    email?: TrainerEmail;
    password?: TrainerPassword;
    authProvider?: TrainerAuthProvider;
    providerAccountId?: string;
  }) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
    this.authProvider = authProvider;
    this.providerAccountId = providerAccountId;
  }

  static fromPrimitives({ id, email, password, authProvider, providerAccountId }: Primitives<Trainer>): Trainer {
    return new Trainer({
      id: new TrainerId(id),
      email: new TrainerEmail(email!),
      password: password ? new TrainerPassword(password) : undefined,
      authProvider: new TrainerAuthProvider(authProvider!),
      providerAccountId: providerAccountId!,
    });
  }

  toPrimitives(): Primitives<Trainer> {
    return {
      id: this.id.value,
      email: this.email?.value,
      password: this.password?.value,
      authProvider: this.authProvider?.value,
      providerAccountId: this.providerAccountId,
    };
  }
}
