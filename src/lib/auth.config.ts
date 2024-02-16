import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { InvalidRequestException } from '@/modules/Shared/domain/exception/InvalidRequestException';
import { compare } from 'bcryptjs';
import { getTrainerByEmail } from '../app/data/get-trainer-by-email';

const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { email, password } = credentials as { email: string; password: string };

          if (!email || !password) {
            throw new InvalidRequestException('Invalid credentials');
          }

          const trainer = await getTrainerByEmail(email);

          if (!trainer) return null;

          const isValidPassword = await compare(password, trainer.password!.value);

          if (!isValidPassword) return null;

          return trainer.toPrimitives();
        } catch (error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
};

export default authConfig;
