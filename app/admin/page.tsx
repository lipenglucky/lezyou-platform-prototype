"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviewQueue } from "@/mocks/reviews";
import { useSessionStore } from "@/store/session-store";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AdminDashboardPage() {
  const push = useSessionStore((s) => s.pushNotification);

  const designerQueue = reviewQueue.filter(
    (r) => r.type === "designer" && r.status === "pending",
  );
  const enterpriseQueue = reviewQueue.filter(
    (r) => r.type === "enterprise" && r.status === "pending",
  );

  const stats = [
    { label: "待审核入驻", value: designerQueue.length, icon: ClipboardCheck, tone: "amber" },
    { label: "待审核企业", value: enterpriseQueue.length, icon: Building2, tone: "amber" },
    { label: "今日新订单", value: 14, icon: TrendingUp, tone: "emerald" },
    { label: "进行中纠纷", value: 1, icon: AlertCircle, tone: "rose" },
  ];

  const handleApprove = (name: string) => {
    push({
      title: `已通过审核 · ${name}`,
      variant: "success",
      description: "已发送通知,账号正式上线。",
    });
  };

  const handleReject = (name: string) => {
    push({
      title: `已驳回 · ${name}`,
      variant: "destructive",
      description: "已通知申请人完善资料后重新提交。",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            管理员工作台
          </h2>
          <p className="mt-1 text-sm text-ink-60">
            审核入驻申请、监管订单与资金、处理用户纠纷。
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/orders">
              订单监管 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="brand">
            <Link href="/admin/disputes">处理纠纷</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const toneMap: Record<string, string> = {
            amber: "bg-amber-100 text-amber-700",
            emerald: "bg-emerald-100 text-emerald-700",
            rose: "bg-rose-100 text-rose-700",
          };
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-ink-40">
                  {s.label}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${toneMap[s.tone]}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {s.value}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-ink">
              资质审核队列
            </h3>
            <p className="mt-1 text-xs text-ink-60">
              设计师入驻申请与企业委托人营业执照,需在 1 个工作日内反馈。
            </p>
          </div>
        </div>

        <Tabs defaultValue="designer">
          <TabsList>
            <TabsTrigger value="designer" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              设计师入驻
              <Badge variant="muted">{designerQueue.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="gap-2">
              <Building2 className="h-3.5 w-3.5" />
              企业委托人
              <Badge variant="muted">{enterpriseQueue.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              历史记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="designer">
            <div className="space-y-3">
              {designerQueue.map((item) => (
                <Card key={item.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="amber">待审核</Badge>
                        <h4 className="text-base font-semibold text-ink">
                          {item.name}
                        </h4>
                        <span className="text-xs text-ink-40">
                          提交于 {formatDateTime(item.submittedAt)}
                        </span>
                      </div>
                      <div className="grid gap-x-6 gap-y-1.5 text-xs text-ink-60 md:grid-cols-2">
                        {Object.entries(item.payload).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-ink-40">{k}:</span>{" "}
                            <span className="text-ink">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(item.name)}
                      >
                        <XCircle className="h-3.5 w-3.5" /> 驳回
                      </Button>
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => handleApprove(item.name)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> 通过审核
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enterprise">
            <div className="space-y-3">
              {enterpriseQueue.map((item) => (
                <Card key={item.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="amber">待审核</Badge>
                        <h4 className="text-base font-semibold text-ink">
                          {item.name}
                        </h4>
                        <span className="text-xs text-ink-40">
                          提交于 {formatDateTime(item.submittedAt)}
                        </span>
                      </div>
                      <div className="grid gap-x-6 gap-y-1.5 text-xs text-ink-60 md:grid-cols-2">
                        {Object.entries(item.payload).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-ink-40">{k}:</span>{" "}
                            <span className="text-ink">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(item.name)}
                      >
                        <XCircle className="h-3.5 w-3.5" /> 驳回
                      </Button>
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => handleApprove(item.name)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> 通过审核
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-3">
              {reviewQueue
                .filter((r) => r.status !== "pending")
                .map((item) => (
                  <Card key={item.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {item.status === "approved" ? (
                            <Badge variant="emerald">已通过</Badge>
                          ) : (
                            <Badge variant="rose">已驳回</Badge>
                          )}
                          <h4 className="text-sm font-semibold text-ink">
                            {item.name}
                          </h4>
                          <span className="text-xs text-ink-40">
                            {formatDateTime(item.submittedAt)}
                          </span>
                        </div>
                        {item.payload["驳回理由"] && (
                          <div className="mt-2 text-xs text-ink-60">
                            驳回理由:{item.payload["驳回理由"]}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-ink-60" />
            <h3 className="text-base font-semibold tracking-tight text-ink">
              用户体量
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-ink">1,860</div>
              <div className="mt-1 text-xs text-ink-60">入驻设计师</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-ink">12,400</div>
              <div className="mt-1 text-xs text-ink-60">个人委托人</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-ink">468</div>
              <div className="mt-1 text-xs text-ink-60">企业委托人</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Coins className="h-4 w-4 text-ink-60" />
            <h3 className="text-base font-semibold tracking-tight text-ink">
              本月平台收入
            </h3>
          </div>
          <div className="text-3xl font-bold tracking-tight text-ink">
            {formatCurrency(348000)}
          </div>
          <div className="mt-1 text-xs text-ink-60">
            手续费率 8% · 较上月 +12.4%
          </div>
        </Card>
      </div>
    </div>
  );
}
