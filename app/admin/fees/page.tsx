"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSessionStore } from "@/store/session-store";

export default function AdminFeesPage() {
  const push = useSessionStore((s) => s.pushNotification);
  const [feeRate, setFeeRate] = useState(8);
  const [frozenDays, setFrozenDays] = useState(30);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          手续费配置
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          调整平台手续费率与资金冻结周期。修改后下一笔订单生效。
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-ink">手续费率</h3>
        <p className="mt-1 text-sm text-ink-60">
          针对设计师每笔到账金额扣除。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <Label>手续费率 (%)</Label>
            <Input
              type="number"
              className="mt-2"
              value={feeRate}
              onChange={(e) => setFeeRate(Number(e.target.value || 0))}
            />
          </div>
          <div>
            <Label>资金冻结周期 (天)</Label>
            <Input
              type="number"
              className="mt-2"
              value={frozenDays}
              onChange={(e) => setFrozenDays(Number(e.target.value || 0))}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            variant="brand"
            onClick={() =>
              push({
                title: "手续费配置已更新",
                description: `费率 ${feeRate}% · 冻结期 ${frozenDays} 天`,
                variant: "success",
              })
            }
          >
            保存配置
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-semibold text-ink">分账规则</h3>
        <div className="mt-5 space-y-3 text-sm text-ink">
          <Row label="设计师到账" value={`${100 - feeRate}%`} />
          <Row label="平台手续费" value={`${feeRate}%`} />
          <Row label="冻结周期" value={`${frozenDays} 天`} />
          <Row
            label="自动确认机制"
            value={`委托人 ${frozenDays} 天内未确认或申请返修,系统自动确认`}
          />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-20 p-4">
      <span className="text-ink-60">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
