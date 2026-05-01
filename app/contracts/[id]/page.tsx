"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSignature,
  Lock,
  Pen,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { useSessionStore } from "@/store/session-store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ContractPage({ params }: { params: { id: string } }) {
  const push = useSessionStore((s) => s.pushNotification);
  const [signedByDesigner, setSignedByDesigner] = useState(true);
  const [signedByClient, setSignedByClient] = useState(false);

  const allSigned = signedByDesigner && signedByClient;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container-page py-10">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/client/orders"
            className="inline-flex items-center gap-1 text-sm text-ink-60 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 返回我的订单
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-3.5 w-3.5" /> 打印
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> 下载 PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden">
            <div className="border-b border-ink-20 bg-ink p-8 text-white">
              <div className="flex items-center gap-2">
                <FileSignature className="h-5 w-5" />
                <Badge className="bg-white/15 text-white">电子合同</Badge>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                乐自由设计服务协议
              </h1>
              <div className="mt-2 text-sm text-white/70">
                合同编号 · {params.id}
              </div>
            </div>

            <div className="space-y-6 p-8 text-sm leading-relaxed text-ink">
              <Section title="一、合同主体">
                <Row label="甲方(委托人)">林家三口 · 个人</Row>
                <Row label="乙方(设计师)">陈牧之 · 上海市徐汇区</Row>
                <Row label="平台监管方">乐自由设计服务平台</Row>
              </Section>

              <Section title="二、服务内容">
                <p className="text-ink-80">
                  乙方为甲方提供「上海徐汇 · 复式住宅整装设计」服务,具体包括:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-ink-80">
                  <li>方案概念深化(含效果图 5 张以上)</li>
                  <li>施工图全套(含建筑、机电、定制家具)</li>
                  <li>软装陈设方案与采购清单</li>
                  <li>关键节点驻场指导(2 次)</li>
                </ul>
              </Section>

              <Section title="三、服务费用与付款节点">
                <Row label="合同总价款">{formatCurrency(28000)}(含税)</Row>
                <Row label="平台手续费率">8%(由乙方承担)</Row>
                <div className="mt-3 grid gap-2">
                  <PaymentRow stage="预付款 · 30%" amount={8400} />
                  <PaymentRow stage="方案确认款 · 40%" amount={11200} />
                  <PaymentRow stage="施工图 + 软装尾款 · 30%" amount={8400} />
                </div>
              </Section>

              <Section title="四、资金托管与结算">
                <p className="text-ink-80">
                  甲方付款后,款项由平台托管。乙方阶段成果上传 + 甲方付费验收解锁后,
                  款项进入 30 天验收期。验收期内甲方未提出异议,款项自动解冻并结算给乙方。
                </p>
              </Section>

              <Section title="五、知识产权">
                <p className="text-ink-80">
                  本合同对应的设计成果知识产权,在甲方支付完所有款项后归甲方所有。
                  乙方保留作品署名权与展示权。
                </p>
              </Section>

              <Section title="六、违约与纠纷">
                <p className="text-ink-80">
                  合作过程中如出现履约争议,可在订单详情页申请「平台介入」。
                  平台将根据沟通记录、阶段成果、付款记录等证据介入调解。
                </p>
              </Section>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <SignatureBlock
                  party="甲方(委托人)"
                  name="林家三口"
                  signed={signedByClient}
                  onSign={() => {
                    setSignedByClient(true);
                    push({
                      title: "签署成功",
                      description: "你已通过实名认证完成签署。",
                      variant: "success",
                    });
                  }}
                />
                <SignatureBlock
                  party="乙方(设计师)"
                  name="陈牧之"
                  signed={signedByDesigner}
                  onSign={() => {
                    setSignedByDesigner(true);
                    push({
                      title: "已签署",
                      variant: "success",
                    });
                  }}
                />
              </div>

              {allSigned && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-semibold text-emerald-900">
                        合同已生效 · 永久存档
                      </div>
                      <div className="mt-1 text-xs text-emerald-700">
                        合同将自动同步至双方账号「我的合同」,可随时查阅与下载。
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <Card className="p-5">
              <div className="text-xs uppercase tracking-wider text-ink-40">
                合同状态
              </div>
              <div className="mt-3 space-y-2.5">
                <SignStatus party="设计师" signed={signedByDesigner} />
                <SignStatus party="委托人" signed={signedByClient} />
              </div>
              {allSigned ? (
                <Badge variant="emerald" className="mt-4 w-full justify-center py-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 合同已生效
                </Badge>
              ) : (
                <Badge variant="amber" className="mt-4 w-full justify-center py-2">
                  等待签署中
                </Badge>
              )}
              <div className="mt-3 text-xs text-ink-60">
                生效时间 · {formatDate("2026-04-20")}
              </div>
            </Card>

            <Card className="space-y-2 p-5 text-xs text-ink-60">
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 h-3.5 w-3.5 text-ink-40" />
                合同采用区块链存证,签署后不可篡改。
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-ink-40" />
                由 e签宝提供电子签名服务(原型阶段为 mock)。
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-base font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-80">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-3">
      <span className="text-ink-60">{label}:</span>
      <span className="text-ink">{children}</span>
    </div>
  );
}

function PaymentRow({ stage, amount }: { stage: string; amount: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-20 bg-ink-20/20 px-4 py-2.5">
      <span className="text-sm">{stage}</span>
      <span className="text-sm font-semibold text-ink">{formatCurrency(amount)}</span>
    </div>
  );
}

function SignatureBlock({
  party,
  name,
  signed,
  onSign,
}: {
  party: string;
  name: string;
  signed: boolean;
  onSign: () => void;
}) {
  return (
    <div className="rounded-xl border border-ink-20 p-5">
      <div className="text-xs uppercase tracking-wider text-ink-40">{party}</div>
      <div className="mt-2 text-base font-semibold text-ink">{name}</div>
      {signed ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> 已电子签署
        </div>
      ) : (
        <Button variant="brand" size="sm" className="mt-4" onClick={onSign}>
          <Pen className="h-3.5 w-3.5" /> 立即签署
        </Button>
      )}
    </div>
  );
}

function SignStatus({ party, signed }: { party: string; signed: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-20 px-3 py-2 text-xs">
      <span className="text-ink-60">{party}</span>
      {signed ? (
        <span className="inline-flex items-center gap-1 text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> 已签
        </span>
      ) : (
        <span className="text-ink-40">未签</span>
      )}
    </div>
  );
}
