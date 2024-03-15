import { UserEmail } from '@/modules/User/domain/value-object/UserEmail';
import { UserId } from '@/modules/User/domain/value-object/UserId';
import { UserPassword } from '@/modules/User/domain/value-object/UserPassword';
import { UserRole } from '@/modules/User/domain/value-object/UserRole';
import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
      get: (id: string) => new UserId(id),
      set: (id: UserId) => id.value,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      get: (email: string) => new UserEmail(email),
      set: (email: UserEmail) => email?.value,
    },
    password: {
      type: String,
      get: (password: string) => new UserPassword(password),
      set: (password: UserPassword) => password?.value,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      get: (role: string) => new UserRole(role),
      set: (role: UserRole) => role?.value,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

export default models?.User || model('User', userSchema);
