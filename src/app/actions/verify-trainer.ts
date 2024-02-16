'use server';

import { TrainerFinder } from '@/modules/Trainer/application/TrainerFinder';
import { getVerificationTokenByToken } from '../data/get-verification-token-by-token';
import { MongoTrainerRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerRepository';
import { TrainerCreator } from '@/modules/Trainer/application/TrainerCreator';
import { VerificationTokenDeleter } from '@/modules/VerificationToken/application/VerificationTokenDeleter';
import { MongoVerificationTokenRepository } from '@/modules/VerificationToken/infrastructure/persistence/MongoVerificationTokenRepository';
import { sendRegistrationEmail } from '@/lib';

export const verifyTrainer = async (token: string) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) {
    return {
      error: 'Invalid token!',
    };
  }

  if (verificationToken.expiresAt.value < new Date().getTime()) {
    return {
      error: 'Token expired!',
    };
  }

  const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
  const trainer = await trainerFinder.run(verificationToken.email.value);

  if (!trainer) {
    return {
      error: 'Trainer not found!',
    };
  }

  if (trainer.emailVerified) {
    return {
      error: 'Email already verified!',
    };
  }

  const email = verificationToken.email.value;

  const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
  await trainerCreator.run({
    id: trainer.id.value,
    email,
    emailVerified: new Date().getTime(),
  });

  const tokenDeleter = new VerificationTokenDeleter(new MongoVerificationTokenRepository());
  await tokenDeleter.run(verificationToken.id.value);

  await sendRegistrationEmail(email, email.split('@')[0]);

  return {
    success: 'Your account has been verified!',
  };
};
