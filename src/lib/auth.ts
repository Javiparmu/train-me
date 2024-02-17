import { TrainerFinder } from '@/modules/Trainer/application/TrainerFinder';
import { MongoTrainerRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerRepository';
import NextAuth from 'next-auth';
import { MongooseAdapter } from '../app/adapters/mongoose-adapter';
import authConfig from './auth.config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;
      if (account?.provider !== 'credentials') return true;

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token && session.trainer) {
        session.trainer.trainerId = token.id as string;
        session.trainer.plan = token.plan as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      } else if (token) {
        const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
        const foundTrainer = await trainerFinder.run(token.email!);

        if (foundTrainer) {
          token.id = foundTrainer.id.value;
        }
      }

      return token;
    },
  },
  adapter: MongooseAdapter(),
});
