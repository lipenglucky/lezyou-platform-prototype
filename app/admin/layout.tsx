"use client";

import { ConsoleShell } from "@/components/layout/console-shell";
import {
  AlertCircle,
  ClipboardCheck,
  Coins,
  LayoutDashboard,
  PackageSearch,
  Users,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "工作台", icon: LayoutDashboard, exact: true },
  { href: "/admin/reviews", label: "资质审核", icon: ClipboardCheck },
  { href: "/admin/orders", label: "订单监管", icon: PackageSearch },
  { href: "/admin/disputes", label: "纠纷处理", icon: AlertCircle },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/fees", label: "手续费配置", icon: Coins },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConsoleShell title="管理员后台" subtitle="平台总后台" nav={NAV}>
      {children}
    </ConsoleShell>
  );
}
