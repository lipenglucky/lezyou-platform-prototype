"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bounties } from "@/mocks/bounties";
import { Megaphone, Users } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientBountiesPage() {
  const myBounties = bounties.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            我的悬赏
          </h2>
          <p className="mt-1 text-sm text-ink-60">
            管理你发布的悬赏项目,查看报名设计师并选择合作方。
          </p>
        </div>
        <Button asChild variant="brand">
          <Link href="/bounties/new">
            <Megaphone className="h-4 w-4" /> 发布新悬赏
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {myBounties.map((b) => (
          <Card key={b.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="emerald">
                    {b.status === "open"
                      ? "开放报名"
                      : b.status === "in_review"
                        ? "审核中"
                        : "已完结"}
                  </Badge>
                  <span className="text-xs text-ink-40">{b.code}</span>
                </div>
                <Link
                  href={`/bounties/${b.id}`}
                  className="block text-base font-semibold text-ink hover:text-brand"
                >
                  {b.title}
                </Link>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-60">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {b.applicants.length} 位报名
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
                <Button asChild variant="outline" size="sm">
                  <Link href={`/bounties/${b.id}`}>查看报名设计师</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
