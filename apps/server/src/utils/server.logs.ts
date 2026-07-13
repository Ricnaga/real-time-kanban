import { colors } from 'consola/utils';
import { logger } from './logs';

export type Status = 'online' | 'offline' | 'warning';

export type StatusLine = {
  label: string;
  status: Status;
};

const INNER_WIDTH = 52;

const ANSI_REGEX = new RegExp(`[${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

function visibleLength(text: string): number {
  return text.replace(ANSI_REGEX, '').length;
}

function pad(text: string, width: number): string {
  const diff = width - visibleLength(text);
  return text + ' '.repeat(Math.max(0, diff));
}

function boxLine(content: string): string {
  return `│ ${pad(content, INNER_WIDTH + 1)}│`;
}

function statusBadge(status: Status): string {
  const dot = {
    online: colors.green('●'),
    offline: colors.red('●'),
    warning: colors.yellow('●'),
  }[status];

  const badge = {
    online: colors.bgGreen(colors.bold(colors.green(' ONLINE  '))),
    offline: colors.bgRed(colors.bold(colors.red(' OFFLINE '))),
    warning: colors.bgYellow(colors.bold(colors.yellow(' WARNING '))),
  }[status];

  return `${dot} ${badge}`;
}

export function initStartupLogs(port: number, status: StatusLine[]) {
  const label = (name: string) => colors.yellow(`[${name}]`);
  const url = colors.yellow(`http://localhost:${port}/graphql`);

  const allLabels = [...status.map((s) => s.label), 'GRAPHQL', 'SERVER'];
  const maxLabelLen = Math.max(...allLabels.map((l) => l.length));

  const services = status.filter((s) => s.label !== 'BACKEND');

  const serviceLines = services.map((s) =>
    boxLine(
      `  ${pad(label(s.label), maxLabelLen + 3)} ${statusBadge(s.status)}`,
    ),
  );

  const lines = [
    '',
    `┌${'─'.repeat(INNER_WIDTH + 2)}┐`,
    boxLine(pad(label('BACKEND'), maxLabelLen + 3)),
    ...serviceLines,
    boxLine(
      `${pad(label('GRAPHQL'), maxLabelLen + 3)}   ${statusBadge('online')}`,
    ),
    boxLine(`${pad(label('SERVER'), maxLabelLen + 3)}   ● ${url}`),
    `└${'─'.repeat(INNER_WIDTH + 2)}┘`,
  ];

  logger.info(lines.join('\n'));
}
