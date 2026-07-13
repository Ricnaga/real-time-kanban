import { colors } from 'consola/utils';
import { logger } from './logs';

const INNER_WIDTH = 44;

function pad(text: string, width: number): string {
  return text + ' '.repeat(Math.max(0, width - text.length));
}

function boxLine(content: string): string {
  return `│ ${pad(content, INNER_WIDTH)}│`;
}

export function initStartupLogs(port: number) {
  const label = (name: string) => colors.yellow(`[${name}]`);
  const online = colors.bgGreen(colors.bold(colors.green(' ONLINE ')));
  const dot = colors.green('●');
  const url = colors.yellow(`http://localhost:${port}/graphql`);

  const lines = [
    `┌${'─'.repeat(INNER_WIDTH + 2)}┐`,
    boxLine(`${label('BACKEND')}  ${dot} ${online}`),
    boxLine(`${label('GRAPHQL')}  ${dot} ${online}`),
    boxLine(`${label('SERVER')}   ${dot} ${url}`),
    `└${'─'.repeat(INNER_WIDTH + 2)}┘`,
  ];

  logger.info(lines.join('\n'));
}
