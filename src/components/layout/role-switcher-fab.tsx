"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lightbulb, Repeat, ShieldCheck, Sparkles, User } from "lucide-react";
import type { Role } from "@/lib/types";

const ROLE_OPTIONS: { value: Role; label: string; route: string; icon: any; description: string }[] = [
  {
    value: "client",
    label: "委托人 · 林家三口",
    route: "/client",
    icon: User,
    description: "个人委托人,正在装修上海徐汇复式住宅。",
  },
  {
    value: "designer",
    label: "设计师 · 陈牧之",
    route: "/designer",
    icon: Sparkles,
    description: "12 年经验建筑设计师,手上 3 单进行中。",
  },
  {
    value: "admin",
    label: "管理员 · 平台总后台",
    route: "/admin",
    icon: ShieldCheck,
    description: "审核入驻、监管订单、处理纠纷。",
  },
  {
    value: "guest",
    label: "访客 · 公开浏览",
    route: "/",
    icon: Lightbulb,
    description: "未登录状态,只能浏览设计师与悬赏。",
  },
];

export function RoleSwitcherFab() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const { role, setRole } = useRoleStore();

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  const current = ROLE_OPTIONS.find((r) => r.value === role) ?? ROLE_OPTIONS[3];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-ink-20 bg-white pl-3 pr-4 py-2 shadow-2xl shadow-ink/10 transition-all hover:border-ink hover:shadow-ink/20">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white">
            <Repeat className="h-3.5 w-3.5" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-ink-40">
              演示身份切换
            </div>
            <div className="text-xs font-semibold text-ink">{current.label}</div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>演示身份切换</DialogTitle>
          <DialogDescription>
            原型阶段的便利功能：一键切换三种身份(委托人 / 设计师 / 管理员),
            查看同一笔订单在不同视角下的呈现。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2.5">
          {ROLE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isCurrent = opt.value === role;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setRole(opt.value);
                  setOpen(false);
                  router.push(opt.route);
                }}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  isCurrent
                    ? "border-ink bg-ink-20/30"
                    : "border-ink-20 hover:border-ink/40 hover:bg-ink-20/10"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink">
                    {opt.label}
                  </div>
                  <div className="text-xs text-ink-60">{opt.description}</div>
                </div>
                {isCurrent ? (
                  <span className="text-xs font-medium text-brand">当前身份</span>
                ) : null}
              </button>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
