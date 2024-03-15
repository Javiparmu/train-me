import { Primitives } from '@/modules/Shared/domain/Primitives';
import { UserEmail } from './value-object/UserEmail';
import { UserId } from './value-object/UserId';
import { UserPassword } from './value-object/UserPassword';
import { UserRole } from './value-object/UserRole';
import { AggregateRoot } from '@/modules/Shared/domain/AggregateRoot';

export class User extends AggregateRoot {
  readonly id: UserId;
  readonly email?: UserEmail;
  readonly password?: UserPassword;
  readonly role?: UserRole;

  constructor({
    id,
    email,
    password,
    role,
  }: {
    id: UserId;
    email?: UserEmail;
    password?: UserPassword;
    role?: UserRole;
  }) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  static fromPrimitives({ id, email, password, role }: Primitives<User>): User {
    return new User({
      id: new UserId(id),
      email: new UserEmail(email!),
      password: password ? new UserPassword(password) : undefined,
      role: new UserRole(role!),
    });
  }

  toPrimitives(): Primitives<User> {
    return {
      id: this.id.value,
      email: this.email?.value,
      password: this.password?.value,
      role: this.role?.value,
    };
  }
}
