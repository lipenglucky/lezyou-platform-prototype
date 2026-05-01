"use client";

import { Card } from "@/components/ui/card";
import { OrderRow } from "@/components/domain/order-row";
import { orders } from "@/mocks/orders";
import { Badge } from "@/components/ui/badge";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          订单监管
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          查看平台所有订单状态、资金流转、合同签署情况。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-ink-40">
            进行中订单
          </div>
          <div className="mt-2 text-2xl font-semibold text-ink">132</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-ink-40">
            托管中资金
          </div>
          <div className="mt-2 text-2xl font-semibold text-ink">¥ 1,820,000</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-wider text-ink-40">
            待解冻资金
          </div>
          <div className="mt-2 text-2xl font-semibold text-ink">¥ 320,400</div>
        </Card>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <OrderRow
            key={o.id}
            order={o}
            href={`/client/orders/${o.id}`}
            perspective="client"
          />
        ))}
      </div>
    </div>
  );
}
