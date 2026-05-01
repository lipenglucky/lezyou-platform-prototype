"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { bounties } from "@/mocks/bounties";
import { BountyCard } from "@/components/domain/bounty-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SPECIALTIES } from "@/lib/constants";
import type { Specialty } from "@/lib/types";
import { Megaphone, PlusCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function BountiesPage() {
  const [specialty, setSpecialty] = useState<Specialty | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "in_review">(
    "all",
  );

  const filtered = useMemo(() => {
    return bounties
      .filter((b) => (specialty === "all" ? true : b.specialty === specialty))
      .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter));
  }, [specialty, statusFilter]);

  const totalReward = bounties
    .filter((b) => b.status === "open")
    .reduce((sum, b) => sum + b.reward, 0);

  return (
    <div className="container-page py-10">
      <Card className="mb-8 overflow-hidden bg-ink p-8 text-white">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-brand/20 text-white">
              <Megaphone className="h-3 w-3" /> 悬赏大厅
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">
              公开招标 · 设计师主动报名
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              对设计师人选还没有明确想法?发布悬赏让符合专业的设计师主动来报名,
              你从中筛选合作。
            </p>
          </div>
          <Button asChild size="lg" variant="brand">
            <Link href="/bounties/new">
              <PlusCircle className="h-4 w-4" /> 发布悬赏项目
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
          <div>
            <div className="text-2xl font-semibold tracking-tight">
              {bounties.filter((b) => b.status === "open").length}
            </div>
            <div className="text-xs text-white/60">开放中的悬赏</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">
              {formatCurrency(totalReward)}
            </div>
            <div className="text-xs text-white/60">悬赏奖池总额</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">
              {bounties.reduce((sum, b) => sum + b.applicants.length, 0)}
            </div>
            <div className="text-xs text-white/60">设计师累计报名次数</div>
          </div>
        </div>
      </Card>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[{ value: "all", label: "全部专业" }, ...SPECIALTIES].map((s) => (
            <button
              key={s.value}
              onClick={() => setSpecialty(s.value as any)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                specialty === s.value
                  ? "border-ink bg-ink text-white"
                  : "border-ink-20 text-ink-60 hover:border-ink/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "全部状态" },
            { value: "open", label: "开放报名" },
            { value: "in_review", label: "审核中" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value as any)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                statusFilter === s.value
                  ? "border-ink bg-ink text-white"
                  : "border-ink-20 text-ink-60 hover:border-ink/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((b) => (
          <BountyCard key={b.id} bounty={b} />
        ))}
      </div>
    </div>
  );
}
