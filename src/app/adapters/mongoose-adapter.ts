import { MongooseConnection } from '@/modules/Shared/infrastructure/persistence/MongooseConnection';
import { TrainerCreator } from '@/modules/Trainer/application/TrainerCreator';
import { TrainerDeleter } from '@/modules/Trainer/application/TrainerDeleter';
import { TrainerFinder } from '@/modules/Trainer/application/TrainerFinder';
import { AuthProvider } from '@/modules/Trainer/domain/value-object/TrainerAuthProvider';
import { MongoTrainerRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerRepository';
import { Account, User } from 'next-auth';
import { randomUUID } from 'crypto';

type Awaitable<T> = T | PromiseLike<T>;

type ProviderType = 'oidc' | 'oauth' | 'email' | 'credentials';

interface AdapterUser extends User {
  id: string;
  email: string;
}

interface AdapterAccount extends Account {
  userId: string;
  type: Extract<ProviderType, 'oauth' | 'oidc' | 'email'>;
}

interface AdapterSession {
  sessionToken: string;
  userId: string;
  expires: Date;
}

interface VerificationToken {
  identifier: string;
  expires: Date;
  token: string;
}

interface Adapter {
  createUser?(user: AdapterUser): Awaitable<AdapterUser>;
  getUser?(id: string): Awaitable<AdapterUser | null>;
  getUserByEmail?(email: string): Awaitable<AdapterUser | null>;
  getUserByAccount?(providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>): Awaitable<AdapterUser | null>;
  updateUser?(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Awaitable<AdapterUser>;
  deleteUser?(userId: string): Promise<void> | Awaitable<AdapterUser | null | undefined>;
  linkAccount?(account: AdapterAccount): Promise<void> | Awaitable<AdapterAccount | null | undefined>;
  unlinkAccount?(
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ): Promise<void> | Awaitable<AdapterAccount | undefined>;
  createSession?(session: { sessionToken: string; userId: string; expires: Date }): Awaitable<AdapterSession>;
  getSessionAndUser?(sessionToken: string): Awaitable<{ session: AdapterSession; user: AdapterUser } | null>;
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
    async createUser({ id, email }) {
      await MongooseConnection.connect();

      console.log('Creating trainer', id, email);

      const trainerId = randomUUID();

      const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
      await trainerCreator.run({
        id: trainerId,
        email,
      });

      return {
        id: trainerId,
        email,
      };
    },
    async getUser(id) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.runById(id);

      if (!trainer) return null;

      return {
        id: trainer.id.value,
        email: trainer.email?.value ?? '',
      };
    },
    async getUserByEmail(email) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.run(email);

      if (!trainer) return null;

      return {
        id: trainer.id.value,
        email: trainer.email?.value ?? '',
      };
    },
    async getUserByAccount(data) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.runByProviderAccountId(data.providerAccountId);

      if (!trainer) return null;

      return {
        id: trainer.id.value,
        email: trainer.email?.value ?? '',
      };
    },
    async updateUser(data) {
      await MongooseConnection.connect();

      const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
      await trainerCreator.run({
        id: data.id,
        email: data.email,
      });

      return {
        id: data.id,
        email: data.email ?? '',
      };
    },
    async deleteUser(id) {
      await MongooseConnection.connect();

      const trainerCreator = new TrainerDeleter(new MongoTrainerRepository());
      await trainerCreator.run(id);
    },
    linkAccount: async (data) => {
      await MongooseConnection.connect();

      const trainerCreator = new TrainerCreator(new MongoTrainerRepository());
      await trainerCreator.run({
        id: data.userId,
        email: data.email?.toString(),
        authProvider: data.provider as AuthProvider,
        providerAccountId: data.providerAccountId,
      });
    },
    async unlinkAccount() {
      return;
    },
    async getSessionAndUser(sessionToken) {
      await MongooseConnection.connect();

      const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
      const trainer = await trainerFinder.runById(sessionToken);

      return {
        user: {
          id: trainer?.id.value ?? '',
          email: trainer?.email?.value ?? '',
        },
        session: {
          sessionToken,
          userId: trainer?.id.value ?? '',
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
  };
}
