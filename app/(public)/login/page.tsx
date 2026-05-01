"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRoleStore } from "@/store/role-store";
import { useSessionStore } from "@/store/session-store";
import {
  Sparkles,
  ShieldCheck,
  User,
  Building2,
  ArrowRight,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-ink-60">加载中...</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const isRegister = params.get("register") === "1";
  const initialRole = (params.get("role") as Role) || "client";
  const setRole = useRoleStore((s) => s.setRole);
  const push = useSessionStore((s) => s.pushNotification);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [activeRole, setActiveRole] = useState<Role>(initialRole);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const sendCode = () => {
    if (!/^1\d{10}$/.test(phone)) {
      push({ title: "请输入正确的手机号", variant: "destructive" });
      return;
    }
    setSeconds(60);
    push({
      title: "验证码已发送",
      description: `演示用验证码:888888`,
    });
  };

  const handleSubmit = () => {
    if (code !== "888888") {
      push({
        title: "验证码错误",
        description: "演示用验证码固定为 888888",
        variant: "destructive",
      });
      return;
    }
    setRole(activeRole);
    push({
      title: `欢迎回来 · ${activeRole === "client" ? "委托人" : activeRole === "designer" ? "设计师" : "管理员"}`,
      variant: "success",
    });
    router.push(
      activeRole === "client"
        ? "/client"
        : activeRole === "designer"
          ? "/designer"
          : "/admin",
    );
  };

  return (
    <div className="container-page py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <Badge variant="muted" className="gap-1">
            <Sparkles className="h-3 w-3 text-brand" />
            {isRegister ? "立即入驻" : "欢迎回来"}
          </Badge>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-ink">
            一个账号,
            <br />
            打通{" "}
            <span className="text-brand">委托 · 设计 · 管理</span> 三端工作。
          </h1>
          <p className="max-w-xl text-sm text-ink-60">
            手机号 + 短信验证码即可登录。原型阶段任意手机号 + 验证码{" "}
            <code className="rounded bg-ink-20/40 px-1.5 py-0.5 text-xs">888888</code>{" "}
            即可。
          </p>
          <div className="grid gap-3 pt-2">
            <Card className="flex items-start gap-3 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <div className="text-sm font-medium text-ink">资质审核保障</div>
                <div className="text-xs text-ink-60">
                  设计师入驻须通过实名 + 作品集审核,企业委托人需上传营业执照。
                </div>
              </div>
            </Card>
            <Card className="flex items-start gap-3 p-4">
              <User className="mt-0.5 h-5 w-5 text-brand" />
              <div>
                <div className="text-sm font-medium text-ink">个人 / 企业 双账号体系</div>
                <div className="text-xs text-ink-60">
                  个人委托人无需审核;企业委托人通过审核后获得 <Badge variant="brand" className="ml-1">企业认证</Badge> 标识。
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-8">
          <Tabs
            value={activeRole}
            onValueChange={(v) => setActiveRole(v as Role)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="client" className="flex-1">
                <User className="h-3.5 w-3.5" /> 委托人
              </TabsTrigger>
              <TabsTrigger value="designer" className="flex-1">
                <Sparkles className="h-3.5 w-3.5" /> 设计师
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex-1">
                <ShieldCheck className="h-3.5 w-3.5" /> 管理员
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeRole}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>手机号</Label>
                  <Input
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>短信验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="6 位数字"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={sendCode}
                      disabled={seconds > 0}
                    >
                      {seconds > 0 ? `${seconds} 秒` : "获取验证码"}
                    </Button>
                  </div>
                </div>

                {activeRole === "client" && isRegister ? (
                  <div className="rounded-xl border border-ink-20 bg-ink-20/20 p-4">
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-40">
                      注册类型
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="rounded-xl border border-ink bg-white p-3 text-left">
                        <div className="flex items-center gap-2 font-medium text-ink">
                          <User className="h-4 w-4" /> 个人委托人
                        </div>
                        <div className="mt-1 text-xs text-ink-60">
                          无需审核,立即可下单
                        </div>
                      </button>
                      <Link
                        href="/onboarding/enterprise"
                        className="rounded-xl border border-ink-20 bg-white p-3 text-left hover:border-ink/40"
                      >
                        <div className="flex items-center gap-2 font-medium text-ink">
                          <Building2 className="h-4 w-4" /> 企业委托人
                        </div>
                        <div className="mt-1 text-xs text-ink-60">
                          需上传营业执照,审核通过获得企业认证 →
                        </div>
                      </Link>
                    </div>
                  </div>
                ) : null}

                {activeRole === "designer" && isRegister ? (
                  <Link
                    href="/onboarding/designer"
                    className="block rounded-xl border border-brand/30 bg-brand/5 p-4 text-xs text-ink-60 hover:border-brand/60"
                  >
                    设计师入驻需完成 <strong className="text-brand">5 步资料填写</strong>(基础信息 →
                    专业 → 作品上传 → 服务设置 → 档期),提交后由平台审核,
                    通常 1 个工作日内反馈。
                    <div className="mt-2 font-medium text-brand">
                      点此进入入驻向导 →
                    </div>
                  </Link>
                ) : null}

                <Button
                  size="lg"
                  variant="brand"
                  className="w-full"
                  onClick={handleSubmit}
                >
                  {isRegister ? "完成注册并登录" : "登录"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex items-center justify-between text-xs text-ink-60">
            {isRegister ? (
              <Link href="/login" className="hover:text-ink">
                已有账号 → 立即登录
              </Link>
            ) : (
              <Link href="/login?register=1" className="hover:text-ink">
                还没有账号 → 立即注册
              </Link>
            )}
            <Link href="/" className="hover:text-ink">
              返回首页
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
