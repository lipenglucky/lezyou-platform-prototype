"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, orders } from "@/mocks/orders";
import { getDesignerById } from "@/mocks/designers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge, SpecialtyBadge } from "@/components/domain/status-badges";
import { StageTimeline } from "@/components/domain/stage-timeline";
import { ORDER_STATUS_META } from "@/lib/constants";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileSignature,
  Info,
  MapPin,
  MessageSquare,
  Send,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default function ClientOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = getOrderById(params.id);
  if (!order) notFound();

  const designer = getDesignerById(order.designerId);
  const meta = ORDER_STATUS_META[order.status];

  return (
    <div className="space-y-6">
      <Link
        href="/client/orders"
        className="inline-flex items-center gap-1 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回我的订单
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <SpecialtyBadge specialty={order.specialty} />
                  <OrderStatusBadge status={order.status} />
                  <span className="text-xs text-ink-40">{order.code}</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-ink">
                  {order.title}
                </h1>
                <p className="max-w-2xl text-sm text-ink-60">
                  {order.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-ink-60">订单总额</div>
                <div className="text-2xl font-semibold tracking-tight text-ink">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
              <Field label="服务模式" value={order.serviceMode === "online" ? "纯线上" : "线下上门"} icon={MapPin} />
              <Field label="计费模式" value={order.billingMode === "daily" ? "按天计费" : "按月雇佣"} icon={Clock} />
              <Field label="项目类型" value={order.projectType} />
              <Field label="预期交付" value={formatDate(order.expectedDeliveryAt)} icon={Calendar} />
            </div>

            {order.onsiteSchedule ? (
              <div className="mt-5 rounded-xl border border-ink-20 bg-ink-20/20 p-4 text-sm">
                <div className="text-xs font-medium uppercase tracking-wider text-ink-40">
                  线下上门安排
                </div>
                <div className="mt-2 text-ink">
                  {formatDate(order.onsiteSchedule.from)} 至 {formatDate(order.onsiteSchedule.to)} ·{" "}
                  {order.onsiteSchedule.address}
                </div>
              </div>
            ) : null}
          </Card>

          {order.status === "in_revision" && order.revisions.length > 0 ? (
            <Card className="border-violet-200 bg-violet-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-violet-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-violet-900">
                    已提交返修需求 · 等待设计师响应
                  </div>
                  {order.revisions.map((r) => (
                    <div key={r.id} className="mt-3 rounded-lg bg-white p-4">
                      <div className="text-xs text-ink-40">
                        {formatDateTime(r.createdAt)}
                      </div>
                      <div className="mt-1 text-sm text-ink">
                        {r.description}
                      </div>
                      {r.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {r.attachments.map((a, i) => (
                            <Badge key={i} variant="muted">
                              📎 {a.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}

          <Card className="p-7">
            <div className="mb-5">
              <h2 className="text-lg font-semibold tracking-tight text-ink">
                付款进度 & 阶段成果
              </h2>
              <p className="mt-1 text-sm text-ink-60">
                设计师上传成果文件后,你可在线免费预览。预览满意后付款解锁下载。
              </p>
            </div>
            <StageTimeline order={order} perspective="client" />
          </Card>

          <Card className="p-7">
            <div className="mb-5 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-ink-60" />
              <h2 className="text-lg font-semibold tracking-tight text-ink">
                沟通记录
              </h2>
            </div>
            <div className="space-y-3">
              {order.messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl p-4 text-sm ${
                    m.authorRole === "system"
                      ? "border border-dashed border-ink-20 text-ink-60"
                      : "bg-ink-20/30 text-ink"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-ink-40">
                    <span className="font-medium">
                      {m.authorRole === "system"
                        ? "系统"
                        : m.authorRole === "client"
                          ? "我"
                          : designer?.name}
                    </span>
                    <span>· {formatDateTime(m.createdAt)}</span>
                  </div>
                  {m.content}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                placeholder="输入消息与设计师沟通..."
                className="flex h-11 w-full rounded-xl border border-ink-20 bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
              />
              <Button>
                <Send className="h-4 w-4" /> 发送
              </Button>
            </div>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-ink-40">
              对接设计师
            </div>
            {designer ? (
              <Link
                href={`/designers/${designer.id}`}
                className="mt-3 flex items-start gap-3"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={designer.avatar} alt={designer.name} />
                  <AvatarFallback>{designer.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink hover:text-brand">
                    {designer.name}
                  </div>
                  <div className="text-xs text-ink-60">{designer.tagline}</div>
                </div>
              </Link>
            ) : null}
            <Button variant="outline" size="sm" className="mt-4 w-full">
              <MessageSquare className="h-3.5 w-3.5" /> 与设计师对话
            </Button>
          </Card>

          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-ink-40">
              电子合同
            </div>
            {order.contractId ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-ink-20 p-3">
                  <FileSignature className="mt-0.5 h-4 w-4 text-brand" />
                  <div>
                    <div className="text-sm font-medium text-ink">
                      {order.contractId}
                    </div>
                    <div className="text-xs text-ink-60">
                      已签署 · 永久存档
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/contracts/${order.contractId}`}>在线查阅合同</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-3 text-sm text-ink-60">合同生成中...</div>
            )}
          </Card>

          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-ink-40">
              当前状态说明
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-ink-60">
              <Info className="mt-0.5 h-3.5 w-3.5 text-ink-40" />
              {meta.label} ·{" "}
              {order.status === "in_progress" &&
                "设计师正在推进项目,等待阶段成果上传。"}
              {order.status === "pending_review" &&
                "设计师已上传阶段成果,请预览并付款解锁下载。"}
              {order.status === "in_revision" &&
                "设计师已收到返修需求,正在优化中。"}
              {order.status === "completed" &&
                "项目已结案,所有资金已结算并解冻。"}
              {order.status === "pending_contract" &&
                "电子合同已生成,等待双方签署。"}
              {order.status === "matching" &&
                "悬赏招标中,等待设计师报名匹配。"}
            </div>
          </Card>

          <Card className="space-y-2 p-5 text-xs text-ink-60">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 text-brand" />
              所有阶段付款进入平台 30 天验收期托管,确保你的售后权益。
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <div className="text-xs text-ink-40">{label}</div>
      <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
        {Icon ? <Icon className="h-3.5 w-3.5 text-ink-60" /> : null}
        {value}
      </div>
    </div>
  );
}
