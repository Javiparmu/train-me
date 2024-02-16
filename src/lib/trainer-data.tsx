import { cookies } from 'next/headers';

export const getTrainerIp = (): string => {
  return cookies().get('trainer-ip')?.value ?? 'Unknown';
};
