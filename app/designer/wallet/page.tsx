"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { designerWallet, designerTransactions } from "@/mocks/wallet";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ArrowDownToLine,
  CircleDollarSign,
  Lock,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Receipt,
  Coins,
} from "lucide-react";
import { useSessionStore } from "@/store/session-store";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DesignerWalletPage() {
  const push = useSessionStore((s) => s.pushNotification);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(
    designerWallet.available,
  );

  const handleWithdraw = () => {
    push({
      title: "提现申请已提交",
      description: `${formatCurrency(withdrawAmount)} 将于 1 个工作日内到账中国建设银行尾号 8821。`,
      variant: "success",
    });
    setWithdrawOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          钱包 · 提现
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          所有项目款项进入 30 天托管期,验收无误后自动解冻可提现。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-40">
              可提现余额
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <Wallet className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-emerald-700">
            {formatCurrency(designerWallet.available)}
          </div>
          <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
            <DialogTrigger asChild>
              <Button variant="brand" size="sm" className="mt-3 w-full">
                <ArrowDownToLine className="h-4 w-4" /> 立即提现
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>提现到银行卡</DialogTitle>
                <DialogDescription>
                  提现将于 1 个工作日内到账。原型阶段不会真实发生。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>提现金额</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={withdrawAmount}
                    max={designerWallet.available}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value || 0))}
                  />
                  <p className="mt-1 text-xs text-ink-60">
                    最多可提现 {formatCurrency(designerWallet.available)}
                  </p>
                </div>
                <div>
                  <Label>到账银行卡</Label>
                  <div className="mt-2 rounded-xl border border-ink-20 p-3 text-sm">
                    <div className="font-medium text-ink">
                      中国建设银行 · 尾号 8821
                    </div>
                    <div className="mt-1 text-xs text-ink-60">
                      持卡人 · 陈牧之
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
                  取消
                </Button>
                <Button variant="brand" onClick={handleWithdraw}>
                  确认提现
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-40">
              托管中(冻结)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
              <Lock className="h-4 w-4 text-violet-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-ink">
            {formatCurrency(designerWallet.pendingFrozen)}
          </div>
          <div className="mt-1 text-xs text-ink-60">30 天后自动解冻</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-40">
              累计收入
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-20/50">
              <CircleDollarSign className="h-4 w-4 text-ink-60" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-ink">
            {formatCurrency(designerWallet.totalIncome)}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-ink-40">
              已扣手续费(8%)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-20/50">
              <Receipt className="h-4 w-4 text-ink-60" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-ink">
            {formatCurrency(designerWallet.feeAccumulated)}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-ink">
              收入趋势
            </h3>
            <p className="mt-1 text-xs text-ink-60">近 6 个月入账与提现</p>
          </div>
          <Badge variant="muted">
            <TrendingUp className="h-3 w-3" /> 同比 +28%
          </Badge>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={designerWallet.monthlyTrend}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a0a0a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0a0a0a" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="withdrawGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E11D48" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#E11D48" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5E5E5" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#A3A3A3" fontSize={11} />
              <YAxis stroke="#A3A3A3" fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E5E5E5",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#0a0a0a"
                fill="url(#incomeGrad)"
                name="入账"
              />
              <Area
                type="monotone"
                dataKey="withdraw"
                stroke="#E11D48"
                fill="url(#withdrawGrad)"
                name="提现"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold tracking-tight text-ink">
            交易流水
          </h3>
          <span className="text-xs text-ink-40">
            共 {designerTransactions.length} 笔记录
          </span>
        </div>
        <div className="space-y-2.5">
          {designerTransactions.map((t) => {
            const isPositive = t.amount > 0;
            const TypeIcon =
              t.type === "income"
                ? Coins
                : t.type === "withdraw"
                  ? ArrowDownToLine
                  : t.type === "fee"
                    ? Receipt
                    : ShieldCheck;
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-ink-20 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      t.status === "frozen"
                        ? "bg-violet-100 text-violet-600"
                        : t.type === "withdraw"
                          ? "bg-rose-100 text-rose-600"
                          : t.type === "fee"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <TypeIcon className="h-4 w-4" />
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
                  <div
                    className={`text-base font-semibold ${
                      isPositive ? "text-ink" : "text-ink-60"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {formatCurrency(t.amount)}
                  </div>
                  <Badge
                    variant={
                      t.status === "frozen"
                        ? "violet"
                        : t.status === "withdrawn"
                          ? "muted"
                          : "emerald"
                    }
                  >
                    {t.status === "frozen"
                      ? "托管中"
                      : t.status === "withdrawn"
                        ? "已提现"
                        : "可提现"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
