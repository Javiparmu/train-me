const TYPES = {
  MongooseConnection: Symbol.for('Mongoose.Connection'),
  UserRepository: Symbol.for('User.Repository'),
  UserCreator: Symbol.for('User.Creator'),
  UserFinder: Symbol.for('User.Finder'),
  UserDeleter: Symbol.for('User.Deleter'),
};

export { TYPES };
