import { Briefcase, Building2, FileText, KanbanSquare, LayoutDashboard, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/commercial-opportunities", label: "Commercial Opportunities", icon: Briefcase },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/documents", label: "Documents", icon: FileText },
];

export const SETTINGS_NAV: NavItem = { href: "/settings", label: "Settings", icon: Settings };

export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function pageTitleFor(pathname: string | null) {
  const item = [...MAIN_NAV, SETTINGS_NAV].find((n) => isActivePath(pathname, n.href));
  return item?.label ?? "";
}
