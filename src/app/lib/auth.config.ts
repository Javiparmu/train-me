import CredentialsProvider from 'next-auth/providers/credentials';
import { InvalidRequestException } from '@/modules/Shared/domain/exception/InvalidRequestException';
import { compare } from 'bcryptjs';
import { getUserByEmail } from '../data/get-user-by-email';

const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { email, password } = credentials as { email: string; password: string };

          if (!email || !password) {
            throw new InvalidRequestException('Invalid credentials');
          }

          const user = await getUserByEmail(email);

          if (!user) return null;

          const isValidPassword = await compare(password, user.password!.value);

          if (!isValidPassword) return null;

          return user.toPrimitives();
        } catch (error) {
          return null;
        }
      },
    }),
  ],
};

export default authConfig;
