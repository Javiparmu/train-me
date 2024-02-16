import { TrainerId } from './value-object/TrainerId';
import { AggregateRoot } from '@/modules/Shared/domain/AggregateRoot';
import { StripeCurrentPeriodEnd } from './value-object/stripe/StripeCurrentPeriodEnd';
import { Primitives } from '@/modules/Shared/domain/Primitives';
import { SubscriptionId } from '@/modules/Subscription/domain/value-object/SubscriptionId';
import { StripePriceId } from './value-object/stripe/StripePriceid';

// REPLACE with your domain logic
export class TrainerSubscription extends AggregateRoot {
  readonly id: SubscriptionId;
  readonly trainerId?: TrainerId;
  readonly stripeCurrentPeriodEnd: StripeCurrentPeriodEnd;
  readonly stripePriceId?: StripePriceId;

  constructor({
    id,
    trainerId,
    stripeCurrentPeriodEnd,
    stripePriceId,
  }: {
    id: SubscriptionId;
    trainerId?: TrainerId;
    stripeCurrentPeriodEnd: StripeCurrentPeriodEnd;
    stripePriceId?: StripePriceId;
  }) {
    super();
    this.id = id;
    this.trainerId = trainerId;
    this.stripeCurrentPeriodEnd = stripeCurrentPeriodEnd;
    this.stripePriceId = stripePriceId;
  }

  static fromPrimitives({
    id,
    trainerId,
    stripeCurrentPeriodEnd,
    stripePriceId,
  }: Primitives<TrainerSubscription>): TrainerSubscription {
    return new TrainerSubscription({
      id: new SubscriptionId(id),
      trainerId: new TrainerId(trainerId!),
      stripeCurrentPeriodEnd: new StripeCurrentPeriodEnd(stripeCurrentPeriodEnd),
      stripePriceId: new StripePriceId(stripePriceId!),
    });
  }

  toPrimitives(): Primitives<TrainerSubscription> {
    return {
      id: this.id.value,
      trainerId: this.trainerId?.value,
      stripeCurrentPeriodEnd: this.stripeCurrentPeriodEnd.value,
      stripePriceId: this.stripePriceId?.value,
    };
  }
}
