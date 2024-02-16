import { MongooseConnection } from '@/modules/Shared/infrastructure/persistence/MongooseConnection';
import { TrainerCreator } from '@/modules/Trainer/application/TrainerCreator';
import { TrainerDeleter } from '@/modules/Trainer/application/TrainerDeleter';
import { TrainerFinder } from '@/modules/Trainer/application/TrainerFinder';
import { AuthProvider } from '@/modules/Trainer/domain/value-object/TrainerAuthProvider';
import { MongoTrainerRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerRepository';
import { VerificationTokenCreator } from '@/modules/VerificationToken/application/VerificationTokenCreator';
import { VerificationTokenDeleter } from '@/modules/VerificationToken/application/VerificationTokenDeleter';
import { VerificationTokenFinder } from '@/modules/VerificationToken/application/VerificationTokenFinder';
import { MongoVerificationTokenRepository } from '@/modules/VerificationToken/infrastructure/persistence/MongoVerificationTokenRepository';
import { Account, User } from 'next-auth';
import { randomUUID } from 'crypto';

type Awaitable<T> = T | PromiseLike<T>;

type ProviderType = 'oidc' | 'oauth' | 'email' | 'credentials';

interface AdapterTrainer extends User {
  id: string;
  email: string;
  emailVerified: Date | null;
}

interface AdapterAccount extends Account {
  trainerId: string;
  type: Extract<ProviderType, 'oauth' | 'oidc' | 'email'>;
}

interface AdapterSession {
  sessionToken: string;
  trainerId: string;
  expires: Date;
}

interface VerificationToken {
  identifier: string;
  expires: Date;
  token: string;
}

interface Adapter {
  createTrainer?(trainer: AdapterTrainer): Awaitable<AdapterTrainer>;
  getTrainer?(id: string): Awaitable<AdapterTrainer | null>;
  getTrainerByEmail?(email: string): Awaitable<AdapterTrainer | null>;
  getTrainerByAccount?(providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>): Awaitable<AdapterTrainer | null>;
  updateTrainer?(trainer: Partial<AdapterTrainer> & Pick<AdapterTrainer, 'id'>): Awaitable<AdapterTrainer>;
  deleteTrainer?(trainerId: string): Promise<void> | Awaitable<AdapterTrainer | null | undefined>;
  linkAccount?(account: AdapterAccount): Promise<void> | Awaitable<AdapterAccount | null | undefined>;
  unlinkAccount?(
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ): Promise<void> | Awaitable<AdapterAccount | undefined>;
  createSession?(session: { sessionToken: string; trainerId: string; expires: Date }): Awaitable<AdapterSession>;
  getSessionAndTrainer?(sessionToken: string): Awaitable<{ session: AdapterSession; trainer: AdapterTrainer } | null>;
  updateSession?(session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>): Awaitable<AdapterSession | null | undefined>;
  deleteSession?(sessionToken: string): Promise<void> | Awaitable<AdapterSession | null | undefined>;
  createVerificationToken?(verificationToken: VerificationToken): Awaitable<VerificationToken | null | undefined>;
  useVerificationToken?(params: { identifier: string; token: string }): Awaitable<VerificationToken | null>;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
declare module 'next-auth/adapters' {
  type JsonObject = {
    [Key in string]?: JsonValue;
  };
  type JsonArray = JsonValue[];
  type JsonPrimitive = string | number | boolean | null;
  type JsonValue = JsonPrimitive | JsonObject | JsonArray;
  interface AdapterAccount {
    type: 'oauth' | 'email' | 'oidc';
    [key: string]: JsonValue | undefined;
  }
}

export function MongooseAdapter(): Adapter {
  return {
    async createTrainer({ id, email, emailVerified }) {
      await MongooseConnection.connect();

      console.log('Creating trainer', id, email, emailVerified);

      const trainerId = randomUUID();

      const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
      await trainerCreator.run({
        id: trainerId,
        email,
        emailVerified: emailVerified ? emailVerified.getTime() : undefined,
      });

      return {
        id: trainerId,
        email,
        emailVerified: emailVerified,
      };
    },
    async getTrainer(id) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.runById(id);

      if (!trainer) return null;

      return {
        id: trainer.id.value,
        email: trainer.email?.value ?? '',
        emailVerified: new Date(trainer.emailVerified?.value ?? 0),
      };
    },
    async getTrainerByEmail(email) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.run(email);

      if (!trainer) return null;

      return {
        id: trainer.id.value,
        email: trainer.email?.value ?? '',
        emailVerified: new Date(trainer.emailVerified?.value ?? 0),
      };
    },
    async getTrainerByAccount(data) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.runByProviderAccountId(data.providerAccountId);

      if (!trainer) return null;

      return {
        id: trainer.id.value,
        email: trainer.email?.value ?? '',
        emailVerified: new Date(trainer.emailVerified?.value ?? 0),
      };
    },
    async updateTrainer(data) {
      await MongooseConnection.connect();

      const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
      await trainerCreator.run({
        id: data.id,
        email: data.email,
        emailVerified: data.emailVerified?.getTime(),
      });

      return {
        id: data.id,
        email: data.email ?? '',
        emailVerified: new Date(data.emailVerified ?? 0),
      };
    },
    async deleteTrainer(id) {
      await MongooseConnection.connect();

      const trainerCreator = new TrainerDeleter(new MongoTrainerRepository());
      await trainerCreator.run(id);
    },
    linkAccount: async (data) => {
      await MongooseConnection.connect();

      const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
      await trainerCreator.run({
        id: data.trainerId,
        email: data.email?.toString(),
        emailVerified: new Date().getTime(),
        authProvider: data.provider as AuthProvider,
        providerAccountId: data.providerAccountId,
      });
    },
    async unlinkAccount() {
      return;
    },
    async getSessionAndTrainer(sessionToken) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.runById(sessionToken);

      return {
        trainer: {
          id: trainer?.id.value ?? '',
          email: trainer?.email?.value ?? '',
          emailVerified: new Date(trainer?.emailVerified?.value ?? 0),
        },
        session: {
          sessionToken,
          trainerId: trainer?.id.value ?? '',
          expires: new Date(),
        },
      };
    },
    async createSession(data) {
      return data;
    },
    async updateSession() {
      return null;
    },
    async deleteSession() {
      return null;
    },
    async createVerificationToken(data) {
      await MongooseConnection.connect();

      const tokenCreator = new VerificationTokenCreator(new MongoVerificationTokenRepository());
      await tokenCreator.run({
        id: data.identifier,
        email: 'oauth@email.com',
        token: data.token,
        expiresAt: data.expires.getTime(),
      });

      return data;
    },
    async useVerificationToken(identifier_token) {
      await MongooseConnection.connect();

      const tokenFinder = new VerificationTokenFinder(new MongoVerificationTokenRepository());
      const verificationToken = await tokenFinder.runByToken(identifier_token.identifier);

      if (!verificationToken) return null;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = verificationToken;

      const tokenDeleter = new VerificationTokenDeleter(new MongoVerificationTokenRepository());
      await tokenDeleter.run(verificationToken.id.value);

      return {
        identifier: verificationToken.id.value,
        token: verificationToken.token.value,
        expires: new Date(verificationToken.expiresAt.value),
      };
    },
  };
}
