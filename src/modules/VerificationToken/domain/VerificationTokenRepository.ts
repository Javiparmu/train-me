import { VerificationToken } from './VerificationToken';
import { TrainerEmail } from '@/modules/Trainer/domain/value-object/TrainerEmail';
import { VerificationTokenId } from './value-object/VerificationTokenId';
import { Token } from './value-object/Token';

export interface VerificationTokenRepository {
  save(verificationToken: VerificationToken): Promise<void>;
  find(verificationTokenId: VerificationTokenId): Promise<VerificationToken | null>;
  findByEmail(trainerEmail: TrainerEmail): Promise<VerificationToken | null>;
  findByToken(token: Token): Promise<VerificationToken | null>;
  delete(verificationTokenId: VerificationTokenId): Promise<void>;
}
