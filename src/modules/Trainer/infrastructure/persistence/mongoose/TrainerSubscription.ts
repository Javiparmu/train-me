import { SubscriptionId } from '@/modules/Subscription/domain/value-object/SubscriptionId';
import { TrainerId } from '@/modules/Trainer/domain/value-object/TrainerId';
import { StripeCurrentPeriodEnd } from '@/modules/Trainer/domain/value-object/stripe/StripeCurrentPeriodEnd';
import { StripePriceId } from '@/modules/Trainer/domain/value-object/stripe/StripePriceid';
import { Schema, model, models } from 'mongoose';

const trainerSubscriptionSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
      get: (stripeSubscriptionId: string) => new SubscriptionId(stripeSubscriptionId),
      set: (stripeSubscriptionId: SubscriptionId) => stripeSubscriptionId.value,
    },
    trainerId: {
      type: String,
      required: true,
      get: (trainerId: string) => new TrainerId(trainerId),
      set: (trainerId: TrainerId) => trainerId.value,
    },
    stripeCurrentPeriodEnd: {
      type: Number,
      required: true,
      get: (stripeCurrentPeriodEnd: number) => new StripeCurrentPeriodEnd(stripeCurrentPeriodEnd),
      set: (stripeCurrentPeriodEnd: StripeCurrentPeriodEnd) => stripeCurrentPeriodEnd.value,
    },
    stripePriceId: {
      type: String,
      required: true,
      get: (stripePriceId: string) => new StripePriceId(stripePriceId),
      set: (stripePriceId: StripePriceId) => stripePriceId.value,
    },
  },
  {
    timestamps: true,
    collection: 'trainerSubscriptions',
  },
);

export default models?.TrainerSubscription || model('TrainerSubscription', trainerSubscriptionSchema);
