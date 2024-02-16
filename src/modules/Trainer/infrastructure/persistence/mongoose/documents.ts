export interface TrainerDocument {
  _id: string;
  name: string;
  email: string;
  emailVerified: number;
  password: string;
  authProvider: string;
  providerAccountId: string;
  plan: string;
  role: string;
  customerId: string;
}

export interface TrainerSubscriptionDocument {
  _id: string;
  trainerId: string;
  stripeCurrentPeriodEnd: number;
  requestCount: number;
  requestLimit: number;
  requestReset: number;
}
