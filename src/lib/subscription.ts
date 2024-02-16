import { ValidTrainerSubscriptionFinder } from '@/modules/Trainer/application/ValidTrainerSubscriptionFinder';
import { MongoTrainerSubscriptionRepository } from '@/modules/Trainer/infrastructure/persistence/MongoTrainerSubscriptionRepository';

interface Subscription {
  plan: string;
  trainerId: string;
}

export const checkSubscription = async (trainerId?: string): Promise<Subscription | null> => {
  if (!trainerId) {
    return null;
  }

  const trainerSubscriptionFinder = new ValidTrainerSubscriptionFinder(new MongoTrainerSubscriptionRepository());
  const trainerSubscription = await trainerSubscriptionFinder.run(trainerId);

  if (!trainerSubscription) {
    return null;
  }

  return {
    plan: trainerSubscription.id.value,
    trainerId: trainerSubscription.trainerId!.value,
  };
};
