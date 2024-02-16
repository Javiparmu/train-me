import { AggregateRoot } from '@/modules/Shared/domain/AggregateRoot';
import { VerificationTokenId } from './value-object/VerificationTokenId';
import { TrainerEmail } from '@/modules/Trainer/domain/value-object/TrainerEmail';
import { UnixDate } from '@/modules/Shared/domain/value-object/UnixDate';
import { Token } from './value-object/Token';
import { Primitives } from '@/modules/Shared/domain/Primitives';

export class VerificationToken extends AggregateRoot {
  readonly id: VerificationTokenId;
  readonly email: TrainerEmail;
  readonly token: Token;
  readonly expiresAt: UnixDate;

  constructor({ id, email, token, expiresAt }: { id: VerificationTokenId; email: TrainerEmail; token: Token; expiresAt: UnixDate }) {
    super();
    this.id = id;
    this.email = email;
    this.token = token;
    this.expiresAt = expiresAt;
  }

  static fromPrimitives({ id, email, token, expiresAt }: Primitives<VerificationToken>): VerificationToken {
    return new VerificationToken({
      id: new VerificationTokenId(id),
      email: new TrainerEmail(email),
      token: new Token(token),
      expiresAt: new UnixDate(expiresAt),
    });
  }

  toPrimitives(): Primitives<VerificationToken> {
    return {
      id: this.id.value,
      email: this.email.value,
      token: this.token.value,
      expiresAt: this.expiresAt.value,
    };
  }
}
