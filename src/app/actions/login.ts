'use server';

import { signIn } from '@/lib';
import { AuthError } from 'next-auth';
import { TrainerFinder } from '@/modules/Trainer/application/TrainerFinder';
import { MongoTrainerRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerRepository';
import { DEFAULT_LOGIN_REDIRECT } from '../routes';

export const login = async (email: string, password: string, callbackUrl: string | null) => {
  const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
  const trainer = await trainerFinder.run(email);

  if (!trainer) {
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
