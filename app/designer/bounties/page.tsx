"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bounties } from "@/mocks/bounties";
import { Megaphone, Users } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function DesignerBountiesPage() {
  const matchingBounties = bounties.filter(
    (b) => b.specialty === "architecture",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            悬赏报名
          </h2>
          <p className="mt-1 text-sm text-ink-60">
            根据你的专业自动推荐悬赏项目,主动报名争取合作。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/bounties">
            <Megaphone className="h-4 w-4" /> 浏览全部悬赏
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {matchingBounties.map((b) => (
          <Card key={b.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Badge variant="brand">匹配你的专业</Badge>
                <Link
                  href={`/bounties/${b.id}`}
                  className="block text-base font-semibold text-ink hover:text-brand"
                >
                  {b.title}
                </Link>
                <p className="line-clamp-2 text-sm text-ink-60">
                  {b.description}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-60">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> 已有 {b.applicants.length} 位报名
                  </span>
                  <span>截止 {formatDate(b.deadline)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xl font-bold text-brand">
                  {b.rewardModel === "negotiable"
                    ? "面议"
                    : formatCurrency(b.reward)}
                </div>
                <Button>立即报名</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
