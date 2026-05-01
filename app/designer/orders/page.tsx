"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { OrderRow } from "@/components/domain/order-row";
import { orders } from "@/mocks/orders";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORDER_STATUS_META } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";

const STATUSES: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "matching", label: ORDER_STATUS_META.matching.label },
  { value: "pending_contract", label: ORDER_STATUS_META.pending_contract.label },
  { value: "in_progress", label: ORDER_STATUS_META.in_progress.label },
  { value: "pending_review", label: ORDER_STATUS_META.pending_review.label },
  { value: "in_revision", label: ORDER_STATUS_META.in_revision.label },
  { value: "completed", label: ORDER_STATUS_META.completed.label },
  { value: "terminated", label: ORDER_STATUS_META.terminated.label },
];

export default function DesignerOrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => (tab === "all" ? true : o.status === tab));
  }, [tab]);

  const counts = useMemo(() => {
    return STATUSES.map((s) => ({
      value: s.value,
      count:
        s.value === "all"
          ? orders.length
          : orders.filter((o) => o.status === s.value).length,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          我的项目
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          按状态查看你的全部接单情况,点击进入查看详情、上传成果。
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="flex flex-wrap gap-1 overflow-auto">
          {STATUSES.map((s) => (
            <TabsTrigger key={s.value} value={s.value} className="gap-1.5">
              {s.label}
              <span className="rounded-full bg-ink-20/50 px-1.5 py-0 text-[10px] font-medium text-ink-60 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                {counts.find((c) => c.value === s.value)?.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-16 text-center text-ink-60">
            该状态下暂无项目。
          </Card>
        ) : (
          filtered.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              href={`/designer/orders/${o.id}`}
              perspective="designer"
            />
          ))
        )}
      </div>
    </div>
  );
}
