"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConsoleNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface Props {
  title: string;
  subtitle: string;
  nav: ConsoleNavItem[];
  children: ReactNode;
  rightSlot?: ReactNode;
}

export function ConsoleShell({
  title,
  subtitle,
  nav,
  children,
  rightSlot,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-20 bg-white lg:flex">
        <Link href="/" className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-ink">
              乐自由
            </span>
            <span className="text-[11px] text-ink-40">{subtitle}</span>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "text-ink-60 hover:bg-ink-20/40 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-ink-20 px-6 py-4 text-[11px] text-ink-40">
          <Link href="/" className="hover:text-ink">
            ← 返回平台首页
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-20 bg-white/80 px-8 backdrop-blur-xl">
          <h1 className="text-lg font-semibold tracking-tight text-ink">
            {title}
          </h1>
          <div className="flex items-center gap-2">{rightSlot}</div>
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
