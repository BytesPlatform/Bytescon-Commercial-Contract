"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { MAIN_NAV, SETTINGS_NAV, isActivePath, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utilities";

interface NavListProps {
  /** "rail" = icon-only on tablet, full labels on desktop. "full" = always labelled (mobile drawer). */
  variant: "rail" | "full";
  onNavigate?: () => void;
}

function NavLink({ item, active, variant, onNavigate }: { item: NavItem; active: boolean } & NavListProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={variant === "rail" ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
        variant === "rail" && "justify-center lg:justify-start",
        active ? "bg-accent-soft text-accent-ink" : "text-muted hover:bg-surface-3 hover:text-ink",
      )}
    >
      {active && <span className="absolute top-2 bottom-2 -left-3 w-[3px] rounded-r-full bg-accent max-lg:hidden" aria-hidden />}
      <Icon className={cn("size-[18px] shrink-0", active ? "text-accent" : "text-faint group-hover:text-ink-2")} strokeWidth={1.9} />
      <span className={cn("truncate", variant === "rail" && "hidden lg:inline")}>{item.label}</span>
    </Link>
  );
}

function Links({ pathname, ...props }: NavListProps & { pathname: string | null }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {MAIN_NAV.map((item) => (
        <li key={item.href}>
          <NavLink item={item} active={isActivePath(pathname, item.href)} {...props} />
        </li>
      ))}
    </ul>
  );
}

function ActiveLinks(props: NavListProps) {
  return <Links pathname={usePathname()} {...props} />;
}

/** Pathname is read inside Suspense so routes with dynamic params keep a static shell. */
export function MainNav(props: NavListProps) {
  return (
    <Suspense fallback={<Links pathname={null} {...props} />}>
      <ActiveLinks {...props} />
    </Suspense>
  );
}

function ActiveSettingsLink(props: NavListProps) {
  return <NavLink item={SETTINGS_NAV} active={isActivePath(usePathname(), SETTINGS_NAV.href)} {...props} />;
}

export function SettingsNav(props: NavListProps) {
  return (
    <Suspense fallback={<NavLink item={SETTINGS_NAV} active={false} {...props} />}>
      <ActiveSettingsLink {...props} />
    </Suspense>
  );
}
