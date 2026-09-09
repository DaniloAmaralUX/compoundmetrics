"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/content/navigation";
import styles from "./shell.module.css";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const links = navigation.map((item) => (
    <Link key={item.href} href={item.href} className={styles.link} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
      {item.label}
    </Link>
  ));
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="Compound Design — home">
          <span className={styles.mark} aria-hidden="true">
            CD
          </span>
          <span>Compound Design</span>
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          {links}
        </nav>
        <details className={styles.menu}>
          <summary className={styles.summary} aria-label="Menu" />
          <nav className={styles.menuList} aria-label="Primary">
            {links}
          </nav>
        </details>
      </div>
    </header>
  );
}
