import Link from "next/link";
import type { Order } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge, SpecialtyBadge } from "./status-badges";
import { ArrowRight, Coins, MapPin, User2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getDesignerById } from "@/mocks/designers";
import { getClientById } from "@/mocks/clients";

interface Props {
  order: Order;
  href: string;
  perspective: "client" | "designer";
}

export function OrderRow({ order, href, perspective }: Props) {
  const designer = getDesignerById(order.designerId);
  const client = getClientById(order.clientId);
  const counterparty = perspective === "client" ? designer : client;

  const paid = order.stages.filter((s) => s.status !== "pending");
  const paidAmount = paid.reduce((sum, s) => sum + s.amount, 0);
  const progress = order.totalAmount
    ? Math.round((paidAmount / order.totalAmount) * 100)
    : 0;

  return (
    <Card className="p-5 transition-all hover:border-ink hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <SpecialtyBadge specialty={order.specialty} />
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-ink-40">{order.code}</span>
          </div>
          <Link href={href} className="block">
            <h3 className="text-base font-semibold leading-snug text-ink hover:text-brand">
              {order.title}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-60">
            <span className="inline-flex items-center gap-1.5">
              <User2 className="h-3.5 w-3.5" />
              {counterparty?.name ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5" />
              {formatCurrency(order.totalAmount)} ·
              {order.billingMode === "daily" ? "按天计费" : "按月雇佣"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {order.serviceMode === "onsite" ? "线下上门" : "线上远程"}
            </span>
            <span>下单 {formatDate(order.createdAt)}</span>
          </div>
        </div>
        <div className="flex w-48 flex-col items-end gap-2">
          <div className="w-full">
            <div className="mb-1 flex justify-between text-xs text-ink-60">
              <span>付款进度</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-20/60">
              <div
                className="h-full rounded-full bg-ink"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:gap-2 transition-all"
          >
            查看详情 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
