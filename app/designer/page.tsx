"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderRow } from "@/components/domain/order-row";
import { StatusControls } from "@/components/domain/status-controls";
import { getDesignerById } from "@/mocks/designers";
import { orders } from "@/mocks/orders";
import { designerWallet } from "@/mocks/wallet";
import {
  ArrowRight,
  CalendarRange,
  CircleDollarSign,
  Eye,
  Star,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DesignerDashboardPage() {
  const designer = getDesignerById("designer_chen")!;
  const myOrders = orders.slice(0, 4);

  const stats = [
    {
      label: "进行中订单",
      value: orders.filter((o) =>
        ["in_progress", "pending_review", "in_revision"].includes(o.status),
      ).length,
      icon: CalendarRange,
    },
    {
      label: "本月收入",
      value: formatCurrency(designerWallet.monthlyTrend.at(-1)?.income ?? 0),
      icon: CircleDollarSign,
    },
    {
      label: "可提现余额",
      value: formatCurrency(designerWallet.available),
      icon: TrendingUp,
    },
    {
      label: "近 7 天主页访问",
      value: "246",
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            陈牧之,你好 👋
          </h2>
          <p className="mt-1 text-sm text-ink-60">
            今天有 1 条返修需要响应,1 个新订单待签约。本月收入 {formatCurrency(designerWallet.monthlyTrend.at(-1)?.income ?? 0)}。
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/bounties">
              浏览悬赏 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="brand">
            <Link href="/designer/wallet">立即提现</Link>
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
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight text-ink">
                我的项目
              </h3>
              <Link
                href="/designer/orders"
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
                  href={`/designer/orders/${o.id}`}
                  perspective="designer"
                />
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden bg-ink p-7 text-white">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20">
                  <Star className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-sm text-white/70">
                    平台综合评分(满分 5.0)
                  </div>
                  <div className="mt-1 text-3xl font-bold tracking-tight">
                    {designer.rating}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    基于 {designer.reviewCount} 条委托人评价
                  </div>
                </div>
              </div>
              <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                查看评价详情
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <StatusControls designer={designer} />
        </div>
      </div>
    </div>
  );
}
