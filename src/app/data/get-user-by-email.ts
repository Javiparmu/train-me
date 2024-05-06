import { container } from '@/dependency-injection/inversify.config';
import { TYPES } from '@/dependency-injection/types';
import { UserFinder } from '@/modules/User/application/UserFinder';

export const getUserByEmail = async (email: string) => {
  const userFinder = container.get<UserFinder>(TYPES.UserFinder);

  return userFinder.run(email);
};
