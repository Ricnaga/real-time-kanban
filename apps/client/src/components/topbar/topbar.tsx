'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu } from 'radix-ui';
import { topbarStyles } from './topbar.tv';

const navItems = [
  { href: '/', label: 'Estatísticas' },
  { href: '/board', label: 'Board' },
];

export function Topbar() {
  const pathname = usePathname();
  const styles = topbarStyles();

  return (
    <NavigationMenu.Root className={styles.root()}>
      <NavigationMenu.List className={styles.list()}>
        {navItems.map(({ href, label }) => (
          <NavigationMenu.Item key={href}>
            <NavigationMenu.Link
              asChild
              active={pathname === href}
              className={styles.link()}
            >
              <Link href={href}>{label}</Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
