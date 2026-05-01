"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileSignature,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useSessionStore } from "@/store/session-store";

export default function EnterpriseOnboardingPage() {
  const router = useRouter();
  const push = useSessionStore((s) => s.pushNotification);

  const [companyName, setCompanyName] = useState("");
  const [creditCode, setCreditCode] = useState("");
  const [legalRep, setLegalRep] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [scope, setScope] = useState("");
  const [licenseUploaded, setLicenseUploaded] = useState(false);

  const handleSubmit = () => {
    if (!companyName || !creditCode || !contactPhone) {
      push({ title: "请填写必填项", variant: "destructive" });
      return;
    }
    if (!licenseUploaded) {
      push({ title: "请上传营业执照", variant: "destructive" });
      return;
    }
    push({
      title: "企业认证申请已提交",
      description: "平台将在 1-2 个工作日内反馈审核结果。",
      variant: "success",
    });
    router.push("/login");
  };

  return (
    <div className="container-page py-10">
      <Link
        href="/login"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回登录页
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="p-8">
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="gap-1">
              <Building2 className="h-3 w-3" /> 企业委托人认证
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            企业认证 · 信息填写
          </h1>
          <p className="mt-1 text-sm text-ink-60">
            认证通过后获得 <Badge variant="brand">企业认证</Badge> 标识,享受发票、专属客服、更高额度。
          </p>

          <div className="mt-7 space-y-6">
            <div>
              <Label>企业全称 *</Label>
              <Input
                placeholder="例如:禹生文旅产业(深圳)有限公司"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>统一社会信用代码 *</Label>
                <Input
                  placeholder="18 位"
                  value={creditCode}
                  onChange={(e) => setCreditCode(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>法定代表人</Label>
                <Input
                  value={legalRep}
                  onChange={(e) => setLegalRep(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>联系人 *</Label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>联系人手机 *</Label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>主营经营范围</Label>
              <Textarea
                rows={3}
                placeholder="如:房地产开发、文旅项目投资..."
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>营业执照(扫描件 / 高清照片)*</Label>
              {licenseUploaded ? (
                <div className="mt-3 flex items-start justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <FileSignature className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-medium text-emerald-900">
                        营业执照_2026.pdf
                      </div>
                      <div className="mt-0.5 text-xs text-emerald-700">
                        2.4 MB · 已上传 · 等待审核
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setLicenseUploaded(false)}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setLicenseUploaded(true);
                    push({
                      title: "营业执照上传成功",
                      description: "已通过 OCR 自动识别,信息将进入人工审核。",
                      variant: "success",
                    });
                  }}
                  className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-20 bg-ink-20/20 p-10 text-ink-60 hover:border-ink/40 hover:text-ink"
                >
                  <Upload className="h-6 w-6" />
                  <div className="text-sm font-medium">点击上传营业执照</div>
                  <div className="text-xs text-ink-40">
                    支持 JPG / PNG / PDF · 单文件不超过 10MB
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2 border-t border-ink-20 pt-6">
            <Button variant="ghost" onClick={() => router.back()}>
              取消
            </Button>
            <Button variant="brand" onClick={handleSubmit}>
              <Upload className="h-4 w-4" /> 提交审核
            </Button>
          </div>
        </Card>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="space-y-4 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold text-ink">企业认证特权</h3>
            </div>
            <ul className="space-y-2 text-sm text-ink-60">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                头像旁显示企业认证标识
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                可申请增值税专用发票
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                单笔订单额度上限提升至 100 万
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                专属对接客服一对一支持
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                支持企业对公转账付款
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
