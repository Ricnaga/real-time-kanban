import { colors } from 'consola/utils';
import { logger } from './logs';

export function logServerOnline(port: number) {
  logger.info(
    `${colors.yellow('[GRAPHQL SERVER]')} ${colors.bgGreen(colors.bold(' ONLINE '))} ${colors.yellow(`→ http://localhost:${port}/graphql`)}`,
  );
}
