import { colors } from 'consola/utils';
import { logger } from './logs';

export type Status = 'online' | 'offline' | 'warning';

export type StatusLine = {
  label: string;
  status: Status;
  url?: string;
};

const ANSI_REGEX = new RegExp(`[${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

function visibleLength(text: string): number {
  return text.replace(ANSI_REGEX, '').length;
}

function pad(text: string, width: number): string {
  const diff = width - visibleLength(text);
  return text + ' '.repeat(Math.max(0, diff));
}

function statusBadge(status: Status, url?: string): string {
  const dot = {
    online: colors.green('●'),
    offline: colors.red('●'),
    warning: colors.yellow('●'),
  }[status];

  if (status === 'online' && url) {
    return `${dot} ${colors.yellow(url)}`;
  }

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

  const maxLabelLen = Math.max(
    ...status.map((s) => s.label.length),
    'SERVER'.length,
  );

  const lineContents = [
    ...status.map(
      (s) =>
        `${pad(label(s.label), maxLabelLen + 3)} ${statusBadge(s.status, s.url)}`,
    ),
    `${pad(label('SERVER'), maxLabelLen + 3)} ● ${url}`,
  ];

  const innerWidth = Math.max(...lineContents.map(visibleLength));

  const boxLine = (content: string) => `  ${content}`;

  const lines = [
    '',
    `┌${'─'.repeat(innerWidth + 2)}┐`,
    ...lineContents.map(boxLine),
    `└${'─'.repeat(innerWidth + 2)}┘`,
  ];

  logger.info(lines.join('\n'));
}
