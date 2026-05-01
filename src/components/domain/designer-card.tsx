"use client";

import Link from "next/link";
import Image from "next/image";
import type { Designer } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  OnlineDot,
  SpecialtyBadge,
  WorkloadBadge,
} from "@/components/domain/status-badges";
import { ActivityDot } from "@/components/domain/activity-dot";
import { MapPin, Star, Briefcase, Plane, PencilLine } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function DesignerCard({ designer }: { designer: Designer }) {
  const cover = designer.portfolio[0]?.cover;
  return (
    <Link
      href={`/designers/${designer.id}`}
      className="group block transition-transform hover:-translate-y-1"
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-20">
          {cover ? (
            <Image
              src={cover}
              alt={designer.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : null}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge variant="default" className="bg-white/90 text-ink">
              <OnlineDot status={designer.onlineStatus} />
              {designer.onlineStatus === "online" ? "在线" : "离线"}
            </Badge>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-white">
                <AvatarImage src={designer.avatar} alt={designer.name} />
                <AvatarFallback>{designer.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white p-0.5">
                <ActivityDot level={designer.activityIndicator} size="sm" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-semibold text-ink">
                  {designer.name}
                </h3>
                <SpecialtyBadge specialty={designer.specialty} />
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-ink-60">
                {designer.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <WorkloadBadge status={designer.workloadStatus} />
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
          </div>

          <div className="flex items-center justify-between text-xs text-ink-60">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {designer.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {designer.yearsOfExperience} 年经验
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {designer.rating}
            </span>
          </div>

          <div className="flex items-end justify-between border-t border-ink-20 pt-4">
            <div>
              <div className="text-xs text-ink-40">日单价</div>
              <div className="text-lg font-semibold tracking-tight text-ink">
                {formatCurrency(designer.dailyRate)}
                <span className="ml-0.5 text-xs font-normal text-ink-60">/天</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-ink-40">月度雇佣</div>
              <div className="text-sm font-semibold text-brand">
                {formatCurrency(designer.monthlyRate)}
                <span className="ml-0.5 text-xs font-normal text-ink-60">/月</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
