import { Primitives } from '@/modules/Shared/domain/Primitives';
import { TrainerEmail } from './value-object/TrainerEmail';
import { TrainerId } from './value-object/TrainerId';
import { TrainerPassword } from './value-object/TrainerPassword';
import { TrainerRole } from './value-object/TrainerRole';
import { AggregateRoot } from '@/modules/Shared/domain/AggregateRoot';
import { TrainerAuthProvider } from './value-object/TrainerAuthProvider';
import { CustomerId } from '@/modules/Customer/domain/value-object/CustomerId';
import { SubscriptionId } from '@/modules/Subscription/domain/value-object/SubscriptionId';
import { UnixDate } from '@/modules/Shared/domain/value-object/UnixDate';

export class Trainer extends AggregateRoot {
  readonly id: TrainerId;
  readonly email?: TrainerEmail;
  readonly emailVerified?: UnixDate;
  readonly password?: TrainerPassword;
  readonly authProvider?: TrainerAuthProvider;
  readonly providerAccountId?: string;
  readonly role?: TrainerRole;
  readonly plan?: SubscriptionId;
  readonly customerId?: CustomerId;

  constructor({
    id,
    email,
    emailVerified,
    password,
    authProvider,
    providerAccountId,
    role,
    plan,
    customerId,
  }: {
    id: TrainerId;
    email?: TrainerEmail;
    emailVerified?: UnixDate;
    password?: TrainerPassword;
    authProvider?: TrainerAuthProvider;
    providerAccountId?: string;
    role?: TrainerRole;
    plan?: SubscriptionId;
    customerId?: CustomerId;
  }) {
    super();
    this.id = id;
    this.email = email;
    this.emailVerified = emailVerified;
    this.password = password;
    this.authProvider = authProvider;
    this.providerAccountId = providerAccountId;
    this.role = role;
    this.plan = plan;
    this.customerId = customerId;
  }

  static fromPrimitives({
    id,
    email,
    emailVerified,
    password,
    authProvider,
    providerAccountId,
    role,
    plan,
    customerId,
  }: Primitives<Trainer>): Trainer {
    return new Trainer({
      id: new TrainerId(id),
      email: new TrainerEmail(email!),
      emailVerified: emailVerified ? new UnixDate(emailVerified) : undefined,
      password: password ? new TrainerPassword(password) : undefined,
      authProvider: new TrainerAuthProvider(authProvider!),
      providerAccountId: providerAccountId!,
      role: new TrainerRole(role!),
      plan: new SubscriptionId(plan!),
      customerId: customerId ? new CustomerId(customerId!) : undefined,
    });
  }

  toPrimitives(): Primitives<Trainer> {
    return {
      id: this.id.value,
      email: this.email?.value,
      emailVerified: this.emailVerified?.value,
      password: this.password?.value,
      authProvider: this.authProvider?.value,
      providerAccountId: this.providerAccountId,
      role: this.role?.value,
      plan: this.plan?.value,
      customerId: this.customerId?.value,
    };
  }
}
