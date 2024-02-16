import { VerificationTokenCreator } from '@/modules/VerificationToken/application/VerificationTokenCreator';
import { VerificationTokenDeleter } from '@/modules/VerificationToken/application/VerificationTokenDeleter';
import { VerificationTokenFinder } from '@/modules/VerificationToken/application/VerificationTokenFinder';
import { MongoVerificationTokenRepository } from '@/modules/VerificationToken/infrastructure/persistence/MongoVerificationTokenRepository';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '../../lib';
import { TrainerCreator } from '@/modules/Trainer/application/TrainerCreator';
import { MongoTrainerRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerRepository';
import { hash } from 'bcryptjs';
import { TrainerFinder } from '@/modules/Trainer/application/TrainerFinder';

export const generateVerificationToken = async (email: string, password: string) => {
  const tokenFinder = new VerificationTokenFinder(new MongoVerificationTokenRepository());
  const foundToken = await tokenFinder.runByEmail(email);

  if (foundToken) {
    const tokenDeleter = new VerificationTokenDeleter(new MongoVerificationTokenRepository());
    await tokenDeleter.run(foundToken.id.value);
  }

  const token = randomUUID();

  const tokenCreator = new VerificationTokenCreator(new MongoVerificationTokenRepository());
  await tokenCreator.run({
    id: randomUUID(),
    email,
    token,
    expiresAt: new Date().getTime() + 1000 * 60 * 5,
  });

  const hashedPassword = await hash(password, 10);

  const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
  const trainer = await trainerFinder.run(email);

  const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
  await trainerCreator.run({
    id: trainer ? trainer.id.value : randomUUID(),
    email,
    password: hashedPassword,
    authProvider: 'credentials',
  });

  await sendVerificationEmail(email, token);
};
