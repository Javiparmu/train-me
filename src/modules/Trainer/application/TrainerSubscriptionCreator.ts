import { SubscriptionId } from '@/modules/Subscription/domain/value-object/SubscriptionId';
import { TrainerSubscription } from '../domain/TrainerSubscription';
import { TrainerSubscriptionRepository } from '../domain/TrainerSubscriptionRepository';
import { TrainerId } from '../domain/value-object/TrainerId';
import { StripeCurrentPeriodEnd } from '../domain/value-object/stripe/StripeCurrentPeriodEnd';
import { StripePriceId } from '../domain/value-object/stripe/StripePriceid';

export class TrainerSubscriptionCreator {
  private repository: TrainerSubscriptionRepository;

  constructor(repository: TrainerSubscriptionRepository) {
    this.repository = repository;
  }

  async run(document: {
    id: string;
    trainerId?: string;
    stripeCurrentPeriodEnd: number;
    stripePriceId?: string;
    requestCount?: number;
    requestLimit?: number;
    requestReset?: number;
  }): Promise<void> {
    const trainerSubscription = new TrainerSubscription({
      id: new SubscriptionId(document.id),
      trainerId: document.trainerId ? new TrainerId(document.trainerId) : undefined,
      stripeCurrentPeriodEnd: new StripeCurrentPeriodEnd(document.stripeCurrentPeriodEnd),
      stripePriceId: document.stripePriceId ? new StripePriceId(document.stripePriceId) : undefined,
    });

    await this.repository.save(trainerSubscription);
  }
}
