"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clientWallet, clientTransactions } from "@/mocks/wallet";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  CircleDollarSign,
  PiggyBank,
  ShieldCheck,
  Wallet,
  Receipt,
  ChevronRight,
} from "lucide-react";

export default function ClientWalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          钱包 · 支付记录
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          管理预存余额、付款方式,查看历史付款与平台托管资金。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="账户余额"
          value={formatCurrency(clientWallet.topUpBalance)}
          tone="brand"
          action={<Button variant="brand" size="sm">充值</Button>}
        />
        <StatCard
          icon={CircleDollarSign}
          label="累计支付"
          value={formatCurrency(clientWallet.totalSpent)}
          tone="ink"
        />
        <StatCard
          icon={PiggyBank}
          label="待付阶段款"
          value={formatCurrency(clientWallet.pendingPayments)}
          tone="amber"
        />
        <StatCard
          icon={ShieldCheck}
          label="平台托管中"
          value={formatCurrency(clientWallet.refundableEscrow)}
          tone="emerald"
        />
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold tracking-tight text-ink">
            付款方式
          </h3>
          <Button variant="outline" size="sm">添加付款方式</Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: "微信支付", desc: "默认付款方式", primary: true },
            { name: "支付宝", desc: "可选" },
            { name: "企业对公转账", desc: "需上传付款回单" },
          ].map((p) => (
            <div
              key={p.name}
              className={`flex items-center justify-between rounded-xl border p-4 ${p.primary ? "border-ink bg-ink-20/30" : "border-ink-20"}`}
            >
              <div>
                <div className="text-sm font-medium text-ink">{p.name}</div>
                <div className="text-xs text-ink-60">{p.desc}</div>
              </div>
              {p.primary ? <Badge variant="brand">默认</Badge> : null}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold tracking-tight text-ink">
            支付记录
          </h3>
          <span className="text-xs text-ink-40">
            共 {clientTransactions.length} 笔记录
          </span>
        </div>
        <div className="space-y-2.5">
          {clientTransactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-ink-20 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-20/40">
                  <Receipt className="h-4 w-4 text-ink-60" />
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">{t.note}</div>
                  <div className="text-xs text-ink-60">
                    {t.orderCode ? `订单 ${t.orderCode} · ` : ""}
                    {formatDateTime(t.occurredAt)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold text-ink">
                  {formatCurrency(t.amount)}
                </div>
                <div className="text-xs text-ink-60">资金已托管</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "brand" | "ink" | "amber" | "emerald";
  action?: React.ReactNode;
}) {
  const toneMap = {
    brand: "bg-brand/10 text-brand",
    ink: "bg-ink-20/40 text-ink",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-ink-40">
          {label}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${toneMap[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        {value}
      </div>
      {action ? <div className="mt-3">{action}</div> : null}
    </Card>
  );
}
