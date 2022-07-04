import 'dotenv/config';
import app from './src/app';
import logger from './src/config/logger';

const PORT: number = Number(process.env.PORT) || 3000;

function main(): void {
  app.listen(PORT, () => {
    logger.info.info(`Server is running on port ${PORT}`);
  });
}

main();
