import { TrainerAuthProvider } from '@/modules/Trainer/domain/value-object/TrainerAuthProvider';
import { TrainerEmail } from '@/modules/Trainer/domain/value-object/TrainerEmail';
import { TrainerId } from '@/modules/Trainer/domain/value-object/TrainerId';
import { TrainerPassword } from '@/modules/Trainer/domain/value-object/TrainerPassword';
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
  },
  {
    timestamps: true,
    collection: 'trainers',
  },
);

export default models?.Trainer || model('Trainer', trainerSchema);
