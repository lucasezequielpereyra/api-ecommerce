import mongoose, { ConnectOptions } from 'mongoose';
import logger from './logger';

export async function connect(): Promise<void> {
  const URL: string | undefined = process.env.DB_URL;

  try {
    if (URL) {
      const db = await mongoose.connect(URL);
      logger.info.info(
        `Server is connected to mongodb ${db.connection.db.namespace}`,
      );
    } else {
      throw new Error('DB_URL is not defined');
    }
  } catch (error) {
    logger.error.error(error);
  }
}
