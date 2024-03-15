'use server';

import { AuthError } from 'next-auth';
import { UserFinder } from '@/modules/User/application/UserFinder';
import { MongoUserRepository } from '@/modules/User/infrastructure/persistence/MongoUserRepository';
import { DEFAULT_LOGIN_REDIRECT } from '../routes';
import { signIn } from '@/lib/auth';

export const login = async (email: string, password: string, callbackUrl: string | null) => {
  const userFinder = new UserFinder(new MongoUserRepository());
  const user = await userFinder.run(email);

  if (!user) {
    return {
      error: 'Invalid credentials!',
    };
  } else {
    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
      });

      return {
        success: 'You have been successfully logged in!',
      };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'Invalid credentials!' };
          default:
            return { error: 'Something went wrong!' };
        }
      }

      throw error;
    }
  }
};
