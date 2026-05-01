"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { OrderRow } from "@/components/domain/order-row";
import { orders } from "@/mocks/orders";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORDER_STATUS_META } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";
import { useSessionStore } from "@/store/session-store";
import { Badge } from "@/components/ui/badge";

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

export default function ClientOrdersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink-60">加载订单列表...</div>}>
      <ClientOrdersInner />
    </Suspense>
  );
}

function ClientOrdersInner() {
  const params = useSearchParams();
  const isNew = params.get("new") === "1";
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const draftOrders = useSessionStore((s) => s.draftOrders);

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
          我的订单
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          按状态查看你的全部委托项目,点击进入查看详情、付款、验收。
        </p>
      </div>

      {isNew && draftOrders.length > 0 && (
        <Card className="flex items-center justify-between bg-emerald-50 p-4 text-sm text-emerald-800">
          <div>
            <strong>新订单已创建!</strong> 编号 {draftOrders[draftOrders.length - 1].id}{" "}
            正在等待设计师签约。原型阶段订单存在浏览器本地。
          </div>
          <Badge variant="emerald">最新</Badge>
        </Card>
      )}

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
            该状态下暂无订单。
          </Card>
        ) : (
          filtered.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              href={`/client/orders/${o.id}`}
              perspective="client"
            />
          ))
        )}
      </div>
    </div>
  );
}
