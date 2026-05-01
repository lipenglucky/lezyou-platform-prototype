"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessionStore } from "@/store/session-store";
import { getDesignerById } from "@/mocks/designers";
import { getClientById } from "@/mocks/clients";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coins,
  MessageCircle,
  Scale,
  Shield,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface Dispute {
  id: string;
  orderCode: string;
  title: string;
  clientId: string;
  designerId: string;
  amount: number;
  raisedBy: "client" | "designer";
  type: string;
  description: string;
  raisedAt: string;
  status: "open" | "in_review" | "resolved";
  evidence: { name: string }[];
}

const DISPUTES: Dispute[] = [
  {
    id: "dp_1",
    orderCode: "LZ20260415-003",
    title: "厦门鼓浪屿民宿 · 概念方案",
    clientId: "client_yu",
    designerId: "designer_tang",
    amount: 7200,
    raisedBy: "client",
    type: "成果质量异议",
    description:
      "二次返修后茶室体量虽已减小,但庭院仍显局促,与最初讨论的方案精神不符,希望平台介入评估。",
    raisedAt: "2026-04-30T09:30:00+08:00",
    status: "in_review",
    evidence: [
      { name: "原方案截图.jpg" },
      { name: "返修后截图.jpg" },
      { name: "微信沟通记录.pdf" },
    ],
  },
  {
    id: "dp_2",
    orderCode: "LZ20260328-008",
    title: "深圳办公空间 · 软装陈设",
    clientId: "client_qing",
    designerId: "designer_zhou",
    amount: 12000,
    raisedBy: "designer",
    type: "付款延迟",
    description:
      "成果上传 15 天,委托人未付款也未提出任何反馈,希望平台介入催款。",
    raisedAt: "2026-04-22T11:00:00+08:00",
    status: "open",
    evidence: [{ name: "成果交付确认邮件.eml" }],
  },
  {
    id: "dp_3",
    orderCode: "LZ20260120-002",
    title: "杭州滨江酒店改造",
    clientId: "client_lin",
    designerId: "designer_li",
    amount: 16000,
    raisedBy: "client",
    type: "返修响应慢",
    description: "提交返修需求 7 天未响应。",
    raisedAt: "2026-02-10T10:00:00+08:00",
    status: "resolved",
    evidence: [],
  },
];

export default function AdminDisputesPage() {
  const push = useSessionStore((s) => s.pushNotification);
  const [activeTab, setActiveTab] = useState<"open" | "in_review" | "resolved">(
    "open",
  );
  const counts = {
    open: DISPUTES.filter((d) => d.status === "open").length,
    in_review: DISPUTES.filter((d) => d.status === "in_review").length,
    resolved: DISPUTES.filter((d) => d.status === "resolved").length,
  };

  const filtered = DISPUTES.filter((d) => d.status === activeTab);

  const handleResolve = (which: "client" | "designer", d: Dispute) => {
    push({
      title: which === "client" ? "已支持委托人 · 退还托管资金" : "已支持设计师 · 解冻款项",
      description: `订单 ${d.orderCode} · ${formatCurrency(d.amount)} 已处理。`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          纠纷处理
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          针对设计师与委托人的服务争议,平台依据沟通记录、阶段成果、付款记录介入裁决。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="待受理" value={counts.open} icon={AlertCircle} tone="rose" />
        <StatCard label="处理中" value={counts.in_review} icon={Clock} tone="amber" />
        <StatCard label="已解决" value={counts.resolved} icon={CheckCircle2} tone="emerald" />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="open" className="gap-2">
            待受理 <Badge variant="rose">{counts.open}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in_review" className="gap-2">
            处理中 <Badge variant="amber">{counts.in_review}</Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="gap-2">
            已解决 <Badge variant="emerald">{counts.resolved}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <Card className="p-16 text-center text-ink-60">
                该状态下暂无纠纷。
              </Card>
            ) : (
              filtered.map((d) => {
                const client = getClientById(d.clientId);
                const designer = getDesignerById(d.designerId);
                return (
                  <Card key={d.id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="rose">{d.type}</Badge>
                          <Badge variant="outline">
                            发起方:{d.raisedBy === "client" ? "委托人" : "设计师"}
                          </Badge>
                          <span className="text-xs text-ink-40">{d.orderCode}</span>
                        </div>
                        <h3 className="text-base font-semibold text-ink">
                          {d.title}
                        </h3>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-60">
                          <span>涉及金额 <strong className="text-ink">{formatCurrency(d.amount)}</strong></span>
                          <span>发起 {formatDateTime(d.raisedAt)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-3.5 w-3.5" /> 三方沟通
                      </Button>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_360px]">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-ink-40">
                          争议描述
                        </div>
                        <p className="mt-2 text-sm text-ink-80">{d.description}</p>

                        {d.evidence.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs font-medium uppercase tracking-wider text-ink-40">
                              证据材料
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {d.evidence.map((e, i) => (
                                <Badge key={i} variant="muted">
                                  📎 {e.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 rounded-xl border border-ink-20 bg-ink-20/20 p-4">
                        <div className="text-xs font-medium uppercase tracking-wider text-ink-40">
                          双方信息
                        </div>
                        <PartyRow
                          label="委托人"
                          name={client?.name ?? ""}
                          avatar={client?.avatar ?? ""}
                        />
                        <PartyRow
                          label="设计师"
                          name={designer?.name ?? ""}
                          avatar={designer?.avatar ?? ""}
                        />

                        {d.status !== "resolved" && (
                          <div className="space-y-2 border-t border-ink-20 pt-3">
                            <div className="text-xs font-medium uppercase tracking-wider text-ink-40">
                              裁决操作
                            </div>
                            <Button
                              variant="brand"
                              size="sm"
                              className="w-full"
                              onClick={() => handleResolve("client", d)}
                            >
                              <Shield className="h-3.5 w-3.5" /> 支持委托人 · 退款
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => handleResolve("designer", d)}
                            >
                              <Coins className="h-3.5 w-3.5" /> 支持设计师 · 解冻
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-ink-60"
                            >
                              <Scale className="h-3.5 w-3.5" /> 部分裁决 · 各承担
                            </Button>
                          </div>
                        )}

                        {d.status === "resolved" && (
                          <div className="rounded-lg bg-emerald-100 px-3 py-2 text-xs text-emerald-800">
                            <CheckCircle2 className="mr-1 inline h-3 w-3" />
                            已结案 · 部分裁决:委托人承担 60%
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "rose" | "amber" | "emerald";
}) {
  const map = {
    rose: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-ink-40">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${map[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-ink">{value}</div>
    </Card>
  );
}

function PartyRow({ label, name, avatar }: { label: string; name: string; avatar: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-60">{label}</span>
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-ink">{name}</span>
      </div>
    </div>
  );
}
