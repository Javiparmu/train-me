import { TrainerFinder } from '@/modules/Trainer/application/TrainerFinder';
import { MongoTrainerRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerRepository';

export const getTrainerByEmail = async (email: string) => {
  const trainerFinder = new TrainerFinder(new MongoTrainerRepository());
  return trainerFinder.run(email);
};
