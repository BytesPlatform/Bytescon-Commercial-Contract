"use client";

import { ChevronRight, Menu as MenuIcon, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { pageTitleFor } from "@/lib/navigation";
import { GlobalSearch } from "./global-search";
import { Notifications } from "./notifications";
import { ThemeToggle } from "./theme-toggle";

function PageTitle() {
  const pathname = usePathname();
  const title = pageTitleFor(pathname);
  const isDetail = /^\/commercial-opportunities\/[^/]+/.test(pathname ?? "");
  if (isDetail) {
    return (
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
        <Link href="/commercial-opportunities" className="truncate text-muted hover:text-ink">
          <span className="sm:hidden">Opportunities</span>
          <span className="hidden sm:inline">Commercial Opportunities</span>
        </Link>
        <ChevronRight className="size-3.5 shrink-0 text-faint" />
        <span className="truncate font-medium text-ink">Details</span>
      </nav>
    );
  }
  return <p className="truncate text-sm font-semibold text-ink">{title}</p>;
}

export function Header({ onOpenNav }: { onOpenNav: () => void }) {
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-md supports-[backdrop-filter]:bg-surface/75">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button onClick={onOpenNav} className="-ml-1.5 rounded-lg p-1.5 text-muted hover:bg-surface-3 hover:text-ink md:hidden" aria-label="Open navigation">
          <MenuIcon className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <Suspense fallback={<span className="block h-4 w-32 rounded bg-surface-3" />}>
            <PageTitle />
          </Suspense>
        </div>
        <GlobalSearch className="hidden w-64 sm:block lg:w-80" />
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setMobileSearch((s) => !s)}
            className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-3 hover:text-ink sm:hidden"
            aria-label={mobileSearch ? "Close search" : "Search"}
          >
            {mobileSearch ? <X className="size-[18px]" /> : <Search className="size-[18px]" />}
          </button>
          <Notifications />
          <ThemeToggle />
          <div className="ml-1.5 hidden items-center gap-2.5 border-l border-line pl-3 sm:flex">
            <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[11px] font-semibold text-white dark:from-slate-500 dark:to-slate-700" aria-hidden>
              JR
            </span>
            <span className="hidden flex-col leading-tight xl:flex">
              <span className="text-[13px] font-medium text-ink">Jordan Reyes</span>
              <span className="text-[11px] text-muted">Business Development</span>
            </span>
          </div>
        </div>
      </div>
      {mobileSearch && (
        <div className="border-t border-line px-4 py-2.5 sm:hidden">
          <GlobalSearch autoFocus onNavigate={() => setMobileSearch(false)} />
        </div>
      )}
    </header>
  );
}
