import { SubscriptionId } from '@/modules/Subscription/domain/value-object/SubscriptionId';
import { TrainerRepository } from '../domain/TrainerRepository';
import { TrainerSubscription } from '../domain/TrainerSubscription';
import { TrainerId } from '../domain/value-object/TrainerId';
import { StripeCurrentPeriodEnd } from '../domain/value-object/stripe/StripeCurrentPeriodEnd';
import { StripePriceId } from '../domain/value-object/stripe/StripePriceid';

export class TrainerUpgrade {
  private repository: TrainerRepository;

  constructor(repository: TrainerRepository) {
    this.repository = repository;
  }

  async run(document: {
    id: string;
    trainerId: string;
    stripeCurrentPeriodEnd: number;
    stripePriceId: string;
    requestCount: number;
    requestLimit: number;
    requestReset: number;
  }): Promise<void> {
    const trainerSubscription = new TrainerSubscription({
      id: new SubscriptionId(document.id),
      trainerId: new TrainerId(document.trainerId),
      stripeCurrentPeriodEnd: new StripeCurrentPeriodEnd(document.stripeCurrentPeriodEnd),
      stripePriceId: new StripePriceId(document.stripePriceId),
    });

    await this.repository.subscribe(trainerSubscription);
  }
}
