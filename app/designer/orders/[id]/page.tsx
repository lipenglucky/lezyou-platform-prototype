"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/mocks/orders";
import { getClientById } from "@/mocks/clients";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  OrderStatusBadge,
  SpecialtyBadge,
} from "@/components/domain/status-badges";
import { StageTimeline } from "@/components/domain/stage-timeline";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileSignature,
  MapPin,
  MessageSquare,
  Send,
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { useSessionStore } from "@/store/session-store";

export default function DesignerOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = getOrderById(params.id);
  if (!order) notFound();

  const client = getClientById(order.clientId);
  const push = useSessionStore((s) => s.pushNotification);

  return (
    <div className="space-y-6">
      <Link
        href="/designer/orders"
        className="inline-flex items-center gap-1 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回我的项目
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
                <div className="mt-1 text-xs text-emerald-700">
                  实际到账(扣 8% 手续费){" "}
                  {formatCurrency(Math.round(order.totalAmount * 0.92))}
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
          </Card>

          {order.status === "in_revision" && order.revisions.length > 0 ? (
            <Card className="border-violet-200 bg-violet-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-violet-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-violet-900">
                    委托人提交了返修需求 · 请尽快响应
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
                      <div className="mt-3 flex justify-end">
                        <Button
                          size="sm"
                          variant="brand"
                          onClick={() =>
                            push({
                              title: "返修方案已上传",
                              description: "委托人将收到通知。",
                              variant: "success",
                            })
                          }
                        >
                          <Upload className="h-3.5 w-3.5" /> 上传返修方案
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}

          <Card className="p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink">
                  阶段成果交付
                </h2>
                <p className="mt-1 text-sm text-ink-60">
                  上传阶段成果文件 · 委托人付款解锁下载后,款项进入你的托管钱包。
                </p>
              </div>
            </div>
            <StageTimeline order={order} perspective="designer" />
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
                      : m.authorRole === "designer"
                        ? "ml-auto max-w-md bg-ink text-white"
                        : "max-w-md bg-ink-20/30 text-ink"
                  }`}
                >
                  <div
                    className={`mb-1 flex items-center gap-2 text-xs ${m.authorRole === "designer" ? "text-white/60" : "text-ink-40"}`}
                  >
                    <span className="font-medium">
                      {m.authorRole === "system"
                        ? "系统"
                        : m.authorRole === "designer"
                          ? "我"
                          : client?.name}
                    </span>
                    <span>· {formatDateTime(m.createdAt)}</span>
                  </div>
                  {m.content}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                placeholder="输入消息与委托人沟通..."
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
              对接委托人
            </div>
            {client ? (
              <div className="mt-3 flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback>{client.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-ink">
                    {client.name}
                    {client.verified && client.type === "enterprise" && (
                      <Badge variant="brand" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> 企业认证
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-ink-60">
                    {client.type === "enterprise" ? client.companyName : "个人委托人"}
                  </div>
                </div>
              </div>
            ) : null}
          </Card>

          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-ink-40">
              电子合同
            </div>
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-ink-20 p-3">
              <FileSignature className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <div className="text-sm font-medium text-ink">
                  {order.contractId || "尚未生成"}
                </div>
                <div className="text-xs text-ink-60">已签署 · 永久存档</div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link href={`/contracts/${order.contractId || "preview"}`}>在线查阅合同</Link>
            </Button>
          </Card>

          <Card className="space-y-2 p-5 text-xs text-ink-60">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 text-brand" />
              每笔款项进入 30 天托管期,验收无误自动解冻可提现。
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 text-brand" />
              超过 30 天委托人无异议,系统自动确认成果无误。
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
