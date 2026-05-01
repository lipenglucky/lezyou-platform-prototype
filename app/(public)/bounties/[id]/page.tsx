import Link from "next/link";
import { notFound } from "next/navigation";
import { bounties, getBountyById } from "@/mocks/bounties";
import { getDesignerById } from "@/mocks/designers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SpecialtyBadge } from "@/components/domain/status-badges";
import {
  CalendarDays,
  Coins,
  Download,
  FileBox,
  Star,
  Users,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function generateStaticParams() {
  return bounties.map((b) => ({ id: b.id }));
}

export default function BountyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const bounty = getBountyById(params.id);
  if (!bounty) notFound();

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex flex-wrap items-center gap-2">
              <SpecialtyBadge specialty={bounty.specialty} />
              {bounty.status === "open" && (
                <Badge variant="emerald">开放报名</Badge>
              )}
              {bounty.status === "in_review" && (
                <Badge variant="amber">审核中</Badge>
              )}
              <span className="text-xs text-ink-40">{bounty.code}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {bounty.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-60">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> 截止 {formatDate(bounty.deadline)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> {bounty.applicants.length} 位设计师报名
              </span>
              <span>发布于 {formatDateTime(bounty.publishedAt)}</span>
            </div>
            <Separator className="my-6" />
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-40">
                项目描述
              </div>
              <p className="text-sm leading-relaxed text-ink-80">
                {bounty.description}
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-40">
                服务要求
              </div>
              <ul className="space-y-2 text-sm text-ink-60">
                {bounty.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-40" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-40">
                项目附件
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {bounty.attachments.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-ink-20 bg-ink-20/20 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileBox className="h-4 w-4 text-ink-60" />
                      <div className="text-sm font-medium text-ink">{a.name}</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3.5 w-3.5" /> 下载
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  报名设计师
                </h2>
                <p className="mt-1 text-sm text-ink-60">
                  {bounty.applicants.length} 位设计师已申请,你可以挑选合作方
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {bounty.applicants.map((a) => {
                const d = getDesignerById(a.designerId);
                if (!d) return null;
                return (
                  <Card key={a.designerId} className="p-5">
                    <div className="flex flex-wrap items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={d.avatar} alt={d.name} />
                        <AvatarFallback>{d.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/designers/${d.id}`}
                            className="text-base font-semibold text-ink hover:text-brand"
                          >
                            {d.name}
                          </Link>
                          <SpecialtyBadge specialty={d.specialty} />
                          <span className="inline-flex items-center gap-1 text-xs text-ink-60">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {d.rating} · {d.completedProjects} 单经验
                          </span>
                        </div>
                        <p className="text-sm text-ink-80">{a.proposal}</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-ink-60">
                          <span>报价 <strong className="text-ink">{formatCurrency(a.quotedAmount)}</strong></span>
                          <span>预计工期 <strong className="text-ink">{a.estimatedDays} 天</strong></span>
                          <span>报名 {formatDateTime(a.appliedAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button>选择该设计师</Button>
                        <Button variant="outline">私信沟通</Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-6">
            <div className="text-xs uppercase tracking-wider text-ink-40">
              悬赏金额
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-brand">
              {bounty.rewardModel === "negotiable"
                ? "面议"
                : formatCurrency(bounty.reward)}
            </div>
            <p className="mt-1 text-xs text-ink-60">
              {bounty.rewardModel === "fixed"
                ? "选定设计师后资金转入平台托管"
                : "可在选定设计师后协商最终金额"}
            </p>

            <Separator className="my-5" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-60">截止时间</span>
                <span className="font-medium text-ink">
                  {formatDate(bounty.deadline)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-60">报名设计师</span>
                <span className="font-medium text-ink">
                  {bounty.applicants.length} 位
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-60">资料附件</span>
                <span className="font-medium text-ink">
                  {bounty.attachments.length} 份
                </span>
              </div>
            </div>

            <Button asChild variant="brand" size="lg" className="mt-6 w-full">
              <Link href={`/login?role=designer`}>
                <Coins className="h-4 w-4" /> 我是设计师 · 立即报名
              </Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="text-xs uppercase tracking-wider text-ink-40">
              悬赏发布方
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                禹
              </div>
              <div>
                <div className="text-sm font-medium text-ink">禹生文旅产业</div>
                <div className="text-xs text-ink-60">企业认证 · 已合作 14 个项目</div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
