"use client";

import { ConsoleShell } from "@/components/layout/console-shell";
import {
  CalendarRange,
  LayoutDashboard,
  PackageSearch,
  Megaphone,
  Wallet,
  Heart,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/client", label: "工作台", icon: LayoutDashboard, exact: true },
  { href: "/client/orders", label: "我的订单", icon: PackageSearch },
  { href: "/client/bounties", label: "我的悬赏", icon: Megaphone },
  { href: "/client/monthly", label: "按月雇佣", icon: CalendarRange },
  { href: "/client/wallet", label: "钱包 · 支付", icon: Wallet },
  { href: "/client/favorites", label: "关注的设计师", icon: Heart },
  { href: "/client/settings", label: "账号设置", icon: Settings },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConsoleShell title="委托人工作台" subtitle="委托人 · 林家三口" nav={NAV}>
      {children}
    </ConsoleShell>
  );
}
