import 'reflect-metadata'
import { colors } from 'consola/utils'
import { logger } from '../utils/logs'
import '@/backend/shared/container'

export async function initInstance() {
  logger.info(
    `${colors.yellow('[BACKEND]')} ${colors.bgGreen(colors.bold(' ONLINE '))} ${colors.yellow('→ DI Container configurado')}`,
  )
}
