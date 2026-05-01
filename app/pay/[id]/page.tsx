"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useSessionStore } from "@/store/session-store";
import { formatCurrency } from "@/lib/utils";

const METHODS = [
  { key: "wechat", name: "微信支付", color: "bg-[#07C160]", desc: "扫码完成支付" },
  { key: "alipay", name: "支付宝", color: "bg-[#1677FF]", desc: "扫码完成支付" },
  { key: "corp", name: "企业对公", color: "bg-ink", desc: "凭付款回单核验" },
];

export default function PaymentPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink-60">加载支付页...</div>}>
      <PaymentInner id={params.id} />
    </Suspense>
  );
}

function PaymentInner({ id }: { id: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const push = useSessionStore((s) => s.pushNotification);
  const amount = Number(search.get("amount") || 8400);
  const stage = search.get("stage") || "预付款";
  const orderCode = search.get("order") || id;

  const [method, setMethod] = useState("wechat");
  const [paid, setPaid] = useState(false);
  const [seconds, setSeconds] = useState(180);

  useEffect(() => {
    if (paid || seconds <= 0) return;
    const t = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, paid]);

  const simulate = () => {
    push({
      title: `${METHODS.find((m) => m.key === method)?.name}支付成功`,
      description: `${formatCurrency(amount)} 已托管至平台。`,
      variant: "success",
    });
    setPaid(true);
    setTimeout(() => router.push("/client/orders"), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container-page py-10">
        <Link
          href="/client/orders"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-60 hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 返回我的订单
        </Link>

        <div className="mx-auto max-w-2xl">
          <Card className="overflow-hidden">
            <div className="border-b border-ink-20 bg-ink p-6 text-white">
              <div className="text-xs text-white/60">订单 {orderCode}</div>
              <div className="mt-1 text-base text-white/80">{stage}</div>
              <div className="mt-3 text-4xl font-bold tracking-tight">
                {formatCurrency(amount)}
              </div>
            </div>

            <div className="p-6">
              {!paid && (
                <>
                  <div className="text-xs font-medium uppercase tracking-wider text-ink-40">
                    选择付款方式
                  </div>
                  <div className="mt-3 grid gap-2.5 md:grid-cols-3">
                    {METHODS.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setMethod(m.key)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                          method === m.key
                            ? "border-ink bg-ink-20/30 shadow-sm"
                            : "border-ink-20 hover:border-ink/40"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.color} text-white`}
                        >
                          {m.key === "corp" ? (
                            <CreditCard className="h-4 w-4" />
                          ) : (
                            <Smartphone className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-ink">
                            {m.name}
                          </div>
                          <div className="text-xs text-ink-60">{m.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {method !== "corp" ? (
                    <div className="mt-7 flex flex-col items-center">
                      <div className="rounded-3xl border border-ink-20 bg-white p-6 shadow-md">
                        <div className="grid grid-cols-12 gap-1">
                          {Array.from({ length: 144 }).map((_, i) => {
                            const filled = (i * 7 + Math.floor(i / 5)) % 3 !== 0;
                            return (
                              <div
                                key={i}
                                className={`aspect-square rounded-sm ${
                                  filled ? "bg-ink" : "bg-white"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <div className="text-sm font-medium text-ink">
                          请使用「
                          {METHODS.find((m) => m.key === method)?.name}
                          」扫码支付
                        </div>
                        <div className="mt-1 text-xs text-ink-60">
                          二维码 {Math.floor(seconds / 60)}:
                          {String(seconds % 60).padStart(2, "0")} 后失效
                        </div>
                      </div>
                      <Button variant="brand" className="mt-5" onClick={simulate}>
                        模拟扫码完成支付
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-7 rounded-2xl border border-ink-20 bg-ink-20/20 p-5 text-sm">
                      <div className="font-medium text-ink">
                        平台收款账户(对公)
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-ink-60">
                        <div>开户名:乐自由(上海)信息科技有限公司</div>
                        <div>开户行:招商银行 上海分行营业部</div>
                        <div>账号:121 9012 3456 7890</div>
                        <div>付款时请备注订单号 {orderCode}</div>
                      </div>
                      <Button variant="brand" className="mt-5" onClick={simulate}>
                        我已完成转账,提交付款回单
                      </Button>
                    </div>
                  )}
                </>
              )}

              {paid && (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-ink">
                    支付成功
                  </h3>
                  <p className="mt-2 text-sm text-ink-60">
                    {formatCurrency(amount)} 已托管至平台
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                    正在跳转回订单详情...
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="mt-5 space-y-2 p-5 text-xs text-ink-60">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-emerald-600" />
              本笔款项由平台资金托管账户保管,30 天验收期内未通过验收可退款。
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="muted" className="mt-0.5">PCI DSS</Badge>
              支付链路通过 PCI DSS 认证,无敏感信息留存。
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
