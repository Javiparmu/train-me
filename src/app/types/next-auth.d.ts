// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    trainer: {
      trainerId: string;
      email: string;
      plan: string;
    };
  }
}
