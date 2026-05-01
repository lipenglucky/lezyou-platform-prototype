"use client";

import * as React from "react";
import type { Order, PaymentStage } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  CircleDollarSign,
  Download,
  Eye,
  FileBox,
  Lock,
  Upload,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";

const STAGE_STATUS_META: Record<
  PaymentStage["status"],
  { label: string; tone: string }
> = {
  pending: { label: "待付款", tone: "bg-ink-20/40 text-ink" },
  paid: { label: "已付款", tone: "bg-blue-100 text-blue-800" },
  frozen: { label: "已托管 · 验收期", tone: "bg-violet-100 text-violet-800" },
  released: { label: "已结算", tone: "bg-emerald-100 text-emerald-800" },
};

export function StageTimeline({
  order,
  perspective,
}: {
  order: Order;
  perspective: "client" | "designer";
}) {
  const push = useSessionStore((s) => s.pushNotification);

  const handlePay = (stage: PaymentStage) => {
    push({
      title: `支付成功 · ${formatCurrency(stage.amount)}`,
      description: `资金已托管,设计师可继续推进。验收无误后自动解冻。`,
      variant: "success",
    });
  };

  const handleConfirm = (stage: PaymentStage) => {
    push({
      title: `已确认成果 · 解锁下载`,
      description: `本阶段款 ${formatCurrency(stage.amount)} 进入设计师托管账户。`,
      variant: "success",
    });
  };

  const handleRevise = () => {
    push({
      title: "已提交返修需求",
      description: "设计师将收到通知并优先处理。",
    });
  };

  return (
    <div className="space-y-5">
      {order.stages.map((stage, i) => {
        const meta = STAGE_STATUS_META[stage.status];
        const isPaid = stage.status !== "pending";
        const showPayCTA = perspective === "client" && stage.status === "pending";
        const showPreviewAndConfirm =
          perspective === "client" &&
          stage.status === "frozen" &&
          (stage.deliverables?.length ?? 0) > 0;
        const showUploadCTA =
          perspective === "designer" && i > 0 && stage.status === "pending";

        return (
          <Card key={stage.id} className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="flex flex-1 items-start gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                    isPaid
                      ? "bg-ink text-white"
                      : "border border-ink-20 bg-white text-ink-60",
                  )}
                >
                  {isPaid ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-ink">
                      {stage.name}
                    </h4>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        meta.tone,
                      )}
                    >
                      {meta.label}
                    </span>
                    <Badge variant="outline">
                      占比 {Math.round(stage.ratio * 100)}%
                    </Badge>
                  </div>
                  <div className="text-2xl font-semibold tracking-tight text-ink">
                    {formatCurrency(stage.amount)}
                  </div>
                  {stage.paidAt ? (
                    <div className="text-xs text-ink-60">
                      付款时间 {formatDateTime(stage.paidAt)}
                    </div>
                  ) : null}
                  {stage.releasedAt ? (
                    <div className="text-xs text-emerald-700">
                      结算时间 {formatDateTime(stage.releasedAt)}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {showPayCTA ? (
                  <Button variant="brand" onClick={() => handlePay(stage)}>
                    <CircleDollarSign className="h-4 w-4" /> 立即支付
                  </Button>
                ) : null}
                {showPreviewAndConfirm ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        push({ title: "已打开成果预览", description: "可免费在线浏览" })
                      }
                    >
                      <Eye className="h-4 w-4" /> 在线预览
                    </Button>
                    <Button onClick={() => handleConfirm(stage)}>
                      <Check className="h-4 w-4" /> 确认验收
                    </Button>
                  </>
                ) : null}
                {showUploadCTA ? (
                  <Button
                    onClick={() =>
                      push({
                        title: "成果文件已上传",
                        description: "委托人将收到验收提醒。",
                        variant: "success",
                      })
                    }
                  >
                    <Upload className="h-4 w-4" /> 上传本阶段成果
                  </Button>
                ) : null}
              </div>
            </div>

            {(stage.deliverables?.length ?? 0) > 0 && (
              <div className="border-t border-ink-20 bg-ink-20/20 p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-60">
                  <FileBox className="h-3.5 w-3.5" /> 阶段成果文件
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {stage.deliverables!.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-xl border border-ink-20 bg-white p-3"
                    >
                      {file.thumbnail ? (
                        <img
                          src={file.thumbnail}
                          alt={file.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink-20">
                          <FileBox className="h-5 w-5 text-ink-60" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-ink">
                          {file.name}
                        </div>
                        <div className="text-xs text-ink-60">
                          {file.size} · {formatDateTime(file.uploadedAt)}
                        </div>
                      </div>
                      {perspective === "client" && stage.status === "frozen" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            push({
                              title: "需先验收确认才能下载",
                              variant: "destructive",
                            })
                          }
                        >
                          <Lock className="h-4 w-4" /> 锁定中
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            push({
                              title: "下载已开始",
                              description: file.name,
                            })
                          }
                        >
                          <Download className="h-4 w-4" /> 下载
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {perspective === "client" && stage.status === "frozen" ? (
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleRevise}>
                      申请返修
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
