import { CustomerId } from '@/modules/Customer/domain/value-object/CustomerId';
import { UnixDate } from '@/modules/Shared/domain/value-object/UnixDate';
import { TrainerAuthProvider } from '@/modules/Trainer/domain/value-object/TrainerAuthProvider';
import { TrainerEmail } from '@/modules/Trainer/domain/value-object/TrainerEmail';
import { TrainerId } from '@/modules/Trainer/domain/value-object/TrainerId';
import { TrainerPassword } from '@/modules/Trainer/domain/value-object/TrainerPassword';
import { TrainerRole } from '@/modules/Trainer/domain/value-object/TrainerRole';
import { StripePriceId } from '@/modules/Trainer/domain/value-object/stripe/StripePriceid';
import { Schema, model, models } from 'mongoose';

const trainerSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
      get: (id: string) => new TrainerId(id),
      set: (id: TrainerId) => id.value,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      get: (email: string) => new TrainerEmail(email),
      set: (email: TrainerEmail) => email?.value,
    },
    emailVerified: {
      type: Number,
      get: (emailVerified: number) => new UnixDate(emailVerified),
      set: (emailVerified: UnixDate) => emailVerified?.value,
    },
    password: {
      type: String,
      get: (password: string) => new TrainerPassword(password),
      set: (password: TrainerPassword) => password?.value,
    },
    authProvider: {
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
      get: (authProvider: string) => new TrainerAuthProvider(authProvider),
      set: (authProvider: TrainerAuthProvider) => authProvider?.value,
    },
    providerAccountId: String,
    role: {
      type: String,
      enum: ['trainer', 'admin'],
      default: 'trainer',
      get: (role: string) => new TrainerRole(role),
      set: (role: TrainerRole) => role?.value,
    },
    plan: {
      type: String,
      default: 'none',
      get: (plan: string) => new StripePriceId(plan),
      set: (plan: StripePriceId) => plan?.value,
    },
    customerId: {
      type: String,
      get: (customerId: string) => new CustomerId(customerId),
      set: (customerId: CustomerId) => customerId?.value,
    },
  },
  {
    timestamps: true,
    collection: 'trainers',
  },
);

export default models?.Trainer || model('Trainer', trainerSchema);
