import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDesignerById, designers } from "@/mocks/designers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActivityDot } from "@/components/domain/activity-dot";
import {
  OnlineDot,
  SpecialtyBadge,
  WorkloadBadge,
} from "@/components/domain/status-badges";
import { SUB_SPECIALTIES, SPECIALTIES } from "@/lib/constants";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PencilLine,
  Plane,
  Sparkles,
  Star,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return designers.map((d) => ({ id: d.id }));
}

export default function DesignerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const designer = getDesignerById(params.id);
  if (!designer) notFound();

  const specialty = SPECIALTIES.find((s) => s.value === designer.specialty)!;
  const subSpecialtyLabels = designer.subSpecialties
    .map((s) => SUB_SPECIALTIES[designer.specialty].find((x) => x.value === s)?.label)
    .filter(Boolean);

  const portfolioGrouped = designer.portfolio.reduce<
    Record<string, typeof designer.portfolio>
  >((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const startOfMonth = new Date("2026-05-01");
  const monthDays = Array.from({ length: 31 }).map((_, i) => {
    const d = new Date(startOfMonth);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <Card className="p-8">
            <div className="flex flex-wrap items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-white">
                  <AvatarImage src={designer.avatar} alt={designer.name} />
                  <AvatarFallback>{designer.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1">
                  <ActivityDot level={designer.activityIndicator} />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-ink">
                    {designer.name}
                  </h1>
                  <SpecialtyBadge specialty={designer.specialty} />
                  <Badge variant="outline" className="gap-1.5">
                    <OnlineDot status={designer.onlineStatus} />
                    {designer.onlineStatus === "online" ? "实时在线" : "离线"}
                  </Badge>
                  <WorkloadBadge status={designer.workloadStatus} />
                </div>
                <p className="text-base text-ink-60">{designer.tagline}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-60">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {designer.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {designer.yearsOfExperience} 年从业
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {designer.rating} ({designer.reviewCount} 条好评)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    完成 {designer.completedProjects} 个项目
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="muted">
                    {designer.isInJob ? "在职 · 兼职接单" : "自由职业 · 全职接单"}
                  </Badge>
                  {designer.isOpenToTravel ? (
                    <Badge variant="outline" className="gap-1">
                      <Plane className="h-3 w-3" /> 支持出差
                    </Badge>
                  ) : null}
                  {designer.supportsHandDrawing ? (
                    <Badge variant="outline" className="gap-1">
                      <PencilLine className="h-3 w-3" /> 支持手改图
                    </Badge>
                  ) : null}
                  {designer.serviceModes.includes("online") && (
                    <Badge variant="outline">线上接单</Badge>
                  )}
                  {designer.serviceModes.includes("onsite") && (
                    <Badge variant="outline">线下上门</Badge>
                  )}
                </div>
              </div>
            </div>
            <Separator className="my-7" />
            <p className="text-sm leading-relaxed text-ink-60">{designer.bio}</p>
          </Card>

          <Card className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  作品集
                </h2>
                <p className="mt-1 text-sm text-ink-60">
                  按项目类型分类展示 · 共 {designer.portfolio.length} 件
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(portfolioGrouped).map(([category, items]) => (
                <div key={category}>
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="default" className="bg-ink">
                      {category}
                    </Badge>
                    <span className="text-xs text-ink-40">{items.length} 件</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {items.map((p) => (
                      <div
                        key={p.id}
                        className="group relative overflow-hidden rounded-xl"
                      >
                        <Image
                          src={p.cover}
                          alt={p.title}
                          width={600}
                          height={400}
                          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-ink/0 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="text-xs text-white">
                            <div className="font-medium">{p.title}</div>
                            <div className="opacity-70">{p.year}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <div className="mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                专业擅长
              </h2>
              <p className="mt-1 text-sm text-ink-60">
                {specialty.label} · {subSpecialtyLabels.join(" / ")}
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>擅长能力</Label>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {designer.expertiseTags.map((t) => (
                    <Badge key={t} variant="muted">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>擅长项目类型</Label>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {designer.projectTypeTags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  接单档期
                </h2>
                <p className="mt-1 text-sm text-ink-60">
                  线下上门服务需在档期内选择 · 沟通时段 {designer.meetingFlexibility}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-60">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> 可预约
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-ink-20" /> 不可预约
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {["一", "二", "三", "四", "五", "六", "日"].map((d) => (
                <div key={d} className="text-ink-40">
                  {d}
                </div>
              ))}
              {monthDays.map((d) => {
                const slot = designer.calendar.find((s) => s.date === d);
                const day = new Date(d).getDate();
                return (
                  <div
                    key={d}
                    className={`flex h-12 items-center justify-center rounded-lg text-xs font-medium ${
                      slot?.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-ink-20/40 text-ink-40 line-through"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-6">
            <div className="text-xs uppercase tracking-wider text-ink-40">
              定向下单 · 立即合作
            </div>
            <div className="mt-3 grid gap-3">
              <div className="rounded-xl border border-ink-20 p-4">
                <div className="text-xs text-ink-60">按天计费</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-ink">
                  {formatCurrency(designer.dailyRate)}
                  <span className="ml-1 text-xs font-normal text-ink-60">/ 工日</span>
                </div>
              </div>
              <div className="rounded-xl border border-brand/30 bg-brand/5 p-4">
                <div className="text-xs text-brand-700">按月雇佣</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-brand">
                  {formatCurrency(designer.monthlyRate)}
                  <span className="ml-1 text-xs font-normal text-ink-60">/ 月</span>
                </div>
                <div className="mt-2 text-[11px] text-ink-60">
                  首月预付,每月 20 号续约确认
                </div>
              </div>
            </div>
            <Button asChild variant="brand" size="lg" className="mt-5 w-full">
              <Link href={`/order/new?designer=${designer.id}`}>
                <Sparkles className="h-4 w-4" /> 发起定向下单
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="mt-2 w-full">
              <Link href={`/order/new?designer=${designer.id}&mode=onsite`}>
                <Calendar className="h-4 w-4" /> 预约线下上门
              </Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="mb-3 text-xs uppercase tracking-wider text-ink-40">
              最近活跃
            </div>
            <div className="flex items-center gap-3">
              <ActivityDot level={designer.activityIndicator} />
              <div className="text-sm text-ink-60">
                上次登录 · {formatDate(designer.lastActiveAt)}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-3 text-xs uppercase tracking-wider text-ink-40">
              平台保障
            </div>
            <ul className="space-y-2.5 text-sm text-ink-60">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>实名 + 资质审核通过的认证设计师</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>资金平台托管,30 天验收期保障售后</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>电子合同自动签署,永久存档可查</span>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-medium uppercase tracking-wider text-ink-40">
      {children}
    </div>
  );
}
