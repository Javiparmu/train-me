import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserRepository } from '@/modules/User/domain/UserRepository';
import { MongoUserRepository } from '@/modules/User/infrastructure/persistence/MongoUserRepository';
import { UserCreator } from '@/modules/User/application/UserCreator';
import { UserFinder } from '@/modules/User/application/UserFinder';
import { UserDeleter } from '@/modules/User/application/UserDeleter';
import { MongooseConnection } from '@/modules/Shared/infrastructure/persistence/MongooseConnection';

const container = new Container();

// Mongoose
container.bind(TYPES.MongooseConnection).to(MongooseConnection);

// User
container.bind<UserRepository>(TYPES.UserRepository).to(MongoUserRepository);
container.bind<UserCreator>(TYPES.UserCreator).to(UserCreator);
container.bind<UserFinder>(TYPES.UserFinder).to(UserFinder);
container.bind<UserDeleter>(TYPES.UserDeleter).to(UserDeleter);

export { container };
