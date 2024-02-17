export interface TrainerDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  authProvider: string;
  providerAccountId: string;
}
