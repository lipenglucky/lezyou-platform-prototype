"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleStore } from "@/store/role-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/designers", label: "找设计师" },
  { href: "/bounties", label: "悬赏大厅" },
  { href: "/bounties/new", label: "发布需求" },
  { href: "/admin", label: "管理员入口" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const role = useRoleStore((s) => s.role);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-20 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight text-ink">
              乐自由
            </span>
            <span className="text-[11px] text-ink-40">工程设计 · 服务对接平台</span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-ink-60 transition-colors hover:text-ink",
                pathname?.startsWith(n.href) && "bg-ink-20/40 text-ink",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {hydrated && role !== "guest" ? (
            <Button asChild variant="outline" size="sm">
              <Link
                href={
                  role === "client"
                    ? "/client"
                    : role === "designer"
                      ? "/designer"
                      : "/admin"
                }
              >
                进入工作台
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login?register=1">立即入驻</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
