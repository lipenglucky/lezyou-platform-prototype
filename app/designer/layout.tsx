"use client";

import { ConsoleShell } from "@/components/layout/console-shell";
import {
  CalendarRange,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  PackageCheck,
  Settings,
  UserCircle,
  Wallet,
} from "lucide-react";

const NAV = [
  { href: "/designer", label: "工作台", icon: LayoutDashboard, exact: true },
  { href: "/designer/orders", label: "我的项目", icon: PackageCheck },
  { href: "/designer/bounties", label: "悬赏报名", icon: Megaphone },
  { href: "/designer/portfolio", label: "作品管理", icon: ImagePlus },
  { href: "/designer/calendar", label: "接单档期", icon: CalendarRange },
  { href: "/designer/wallet", label: "钱包 · 提现", icon: Wallet },
  { href: "/designer/profile", label: "个人主页", icon: UserCircle },
  { href: "/designer/settings", label: "账号设置", icon: Settings },
];

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConsoleShell title="设计师工作台" subtitle="设计师 · 陈牧之" nav={NAV}>
      {children}
    </ConsoleShell>
  );
}
