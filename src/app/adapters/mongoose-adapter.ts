import { UserCreator } from '@/modules/User/application/UserCreator';
import { UserDeleter } from '@/modules/User/application/UserDeleter';
import { UserFinder } from '@/modules/User/application/UserFinder';
import { Account, User } from 'next-auth';
import { randomUUID } from 'crypto';
import { container } from '@/dependency-injection/inversify.config';
import { TYPES } from '@/dependency-injection/types';

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

interface Adapter {
  createUser?(user: AdapterUser): Awaitable<AdapterUser>;
  getUser?(id: string): Awaitable<AdapterUser | null>;
  getUserByEmail?(email: string): Awaitable<AdapterUser | null>;
  getUserByAccount?(
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ): Awaitable<AdapterUser | null>;
  updateUser?(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Awaitable<AdapterUser>;
  deleteUser?(userId: string): Promise<void> | Awaitable<AdapterUser | null | undefined>;
  linkAccount?(account: AdapterAccount): Promise<void> | Awaitable<AdapterAccount | null | undefined>;
  unlinkAccount?(
    providerAccountId: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
  ): Promise<void> | Awaitable<AdapterAccount | undefined>;
  createSession?(session: { sessionToken: string; userId: string; expires: Date }): Awaitable<AdapterSession>;
  getSessionAndUser?(sessionToken: string): Awaitable<{ session: AdapterSession; user: AdapterUser } | null>;
  updateSession?(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ): Awaitable<AdapterSession | null | undefined>;
  deleteSession?(sessionToken: string): Promise<void> | Awaitable<AdapterSession | null | undefined>;
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
  const userCreator = container.get<UserCreator>(TYPES.UserCreator);
  const userFinder = container.get<UserFinder>(TYPES.UserFinder);
  const userDeleter = container.get<UserDeleter>(TYPES.UserDeleter);

  return {
    async createUser({ email }) {
      const userId = randomUUID();

      await userCreator.run({
        id: userId,
        email,
      });

      return {
        id: userId,
        email,
      };
    },
    async getUser(id) {
      const user = await userFinder.runById(id);

      if (!user) return null;

      return {
        id: user.id.value,
        email: user.email?.value ?? '',
      };
    },
    async getUserByEmail(email) {
      const user = await userFinder.run(email);

      if (!user) return null;

      return {
        id: user.id.value,
        email: user.email?.value ?? '',
      };
    },
    async updateUser(data) {
      await userCreator.run({
        id: data.id,
        email: data.email,
      });

      return {
        id: data.id,
        email: data.email ?? '',
      };
    },
    async deleteUser(id) {
      await userDeleter.run(id);
    },
    linkAccount: async (data) => {
      await userCreator.run({
        id: data.userId,
        email: data.email?.toString(),
      });
    },
    async unlinkAccount() {
      return;
    },
    async getSessionAndUser(sessionToken) {
      const user = await userFinder.runById(sessionToken);

      return {
        user: {
          id: user?.id.value ?? '',
          email: user?.email?.value ?? '',
        },
        session: {
          sessionToken,
          userId: user?.id.value ?? '',
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
