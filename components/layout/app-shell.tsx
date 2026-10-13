"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "./header";
import { MobileNav, Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <div className="min-h-dvh">
      <Sidebar />
      <MobileNav open={navOpen} onClose={closeNav} />
      <div className="flex min-h-dvh flex-col md:pl-[68px] lg:pl-64">
        <Header onOpenNav={() => setNavOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
