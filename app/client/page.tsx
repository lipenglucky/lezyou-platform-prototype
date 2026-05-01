"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderRow } from "@/components/domain/order-row";
import { orders } from "@/mocks/orders";
import { bounties } from "@/mocks/bounties";
import { clientWallet } from "@/mocks/wallet";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  Megaphone,
  Sparkles,
  Wallet,
  CalendarRange,
  CircleDollarSign,
  ClipboardList,
} from "lucide-react";

export default function ClientDashboardPage() {
  const myOrders = orders.slice(0, 3);
  const myBounties = bounties.slice(0, 2);

  const stats = [
    {
      label: "进行中订单",
      value: orders.filter((o) =>
        ["in_progress", "pending_review", "in_revision"].includes(o.status),
      ).length,
      icon: ClipboardList,
    },
    {
      label: "本月已支出",
      value: formatCurrency(38400),
      icon: CircleDollarSign,
    },
    {
      label: "已托管资金",
      value: formatCurrency(clientWallet.refundableEscrow),
      icon: Wallet,
    },
    {
      label: "悬赏招标中",
      value: bounties.filter((b) => b.status === "open").length,
      icon: Megaphone,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            林先生,你好 👋
          </h2>
          <p className="mt-1 text-sm text-ink-60">
            今天是 2026-05-01。你有 1 个订单待验收,1 个返修待设计师回应。
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/designers">
              找设计师 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="brand">
            <Link href="/bounties/new">
              <Megaphone className="h-4 w-4" /> 发布悬赏
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-ink-40">
                  {s.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-20/50">
                  <Icon className="h-4 w-4 text-ink-60" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                {s.value}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              最近订单
            </h3>
            <Link
              href="/client/orders"
              className="text-xs font-medium text-brand hover:text-brand-700"
            >
              查看全部 →
            </Link>
          </div>
          <div className="space-y-3">
            {myOrders.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                href={`/client/orders/${o.id}`}
                perspective="client"
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-ink">
              我的悬赏
            </h3>
            <Link
              href="/client/bounties"
              className="text-xs font-medium text-brand hover:text-brand-700"
            >
              查看全部 →
            </Link>
          </div>
          <div className="space-y-3">
            {myBounties.map((b) => (
              <Link
                key={b.id}
                href={`/bounties/${b.id}`}
                className="block rounded-xl border border-ink-20 p-4 transition-colors hover:border-ink"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Badge variant="emerald" className="mb-2">
                      开放报名
                    </Badge>
                    <div className="line-clamp-2 text-sm font-medium text-ink">
                      {b.title}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-brand">
                      {b.rewardModel === "negotiable"
                        ? "面议"
                        : formatCurrency(b.reward)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-ink-60">
                  {b.applicants.length} 位设计师已报名
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden bg-ink p-7 text-white">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20">
              <CalendarRange className="h-5 w-5 text-brand-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Sparkles className="h-3.5 w-3.5" /> 按月雇佣 · 续约提醒
              </div>
              <div className="mt-1 text-base font-semibold">
                你正在按月雇佣设计师 <strong>李然</strong>(室内设计)
              </div>
              <div className="mt-1 text-xs text-white/60">
                本月雇佣周期至 2026-05-31。请在每月 20 号前确认次月续约,
                未按时续费将自动终止。
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link href="/client/monthly">查看续约</Link>
            </Button>
            <Button asChild variant="brand">
              <Link href="/client/monthly">立即续约下月</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
