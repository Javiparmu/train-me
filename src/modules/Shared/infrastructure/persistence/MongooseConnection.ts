import { connection, connect, disconnect } from 'mongoose';
import MongoConfig from './MongoConfig';
import { TooManyConnectionAttemptsException } from '../../domain/exception/TooManyConnectionAttemptsException';
import { injectable } from 'inversify';

const MAX_ATTEMPTS = 5;
const RETRY_INTERVAL = 5000;

@injectable()
export class MongooseConnection {
  public async connect(config?: MongoConfig): Promise<void> {
    if (connection?.readyState === 0) {
      await connect(config?.url ?? process.env.MONGODB_URI ?? '', {
        ignoreUndefined: true,
      });

      connection.on('disconnected', () => {
        MongooseConnection.attemptReconnect(config);
      });
    }
  }

  public async disconnect(): Promise<void> {
    await disconnect();
  }

  private static async attemptReconnect(config?: MongoConfig, attempts = 0): Promise<void> {
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(async () => {
        try {
          await connect(config?.url ?? process.env.MONGODB_URI ?? '', {
            ignoreUndefined: true,
          });
        } catch (error) {
          await MongooseConnection.attemptReconnect(config, attempts + 1);
        }
      }, RETRY_INTERVAL);
    } else {
      await disconnect();

      throw new TooManyConnectionAttemptsException('mongodb');
    }
  }
}
