"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { designers } from "@/mocks/designers";
import { DesignerCard } from "@/components/domain/designer-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SPECIALTIES } from "@/lib/constants";
import type { Specialty, WorkloadStatus } from "@/lib/types";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesignersPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-ink-60">加载设计师列表...</div>}>
      <DesignersInner />
    </Suspense>
  );
}

function DesignersInner() {
  const params = useSearchParams();
  const initialSpecialty = params.get("specialty") as Specialty | null;

  const [keyword, setKeyword] = useState("");
  const [specialty, setSpecialty] = useState<Specialty | "all">(
    initialSpecialty ?? "all",
  );
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [travelOnly, setTravelOnly] = useState(false);
  const [handDrawingOnly, setHandDrawingOnly] = useState(false);
  const [workload, setWorkload] = useState<WorkloadStatus | "all">("all");
  const [city, setCity] = useState<string>("all");

  const cities = useMemo(() => {
    const set = new Set(designers.map((d) => d.location.split(" ·")[0]));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return designers
      .filter((d) =>
        keyword
          ? d.name.includes(keyword) ||
            d.tagline.includes(keyword) ||
            d.expertiseTags.some((t) => t.includes(keyword)) ||
            d.projectTypeTags.some((t) => t.includes(keyword))
          : true,
      )
      .filter((d) => (specialty === "all" ? true : d.specialty === specialty))
      .filter((d) => (onlineOnly ? d.onlineStatus === "online" : true))
      .filter((d) => (travelOnly ? d.isOpenToTravel : true))
      .filter((d) => (handDrawingOnly ? d.supportsHandDrawing : true))
      .filter((d) => (workload === "all" ? true : d.workloadStatus === workload))
      .filter((d) => (city === "all" ? true : d.location.startsWith(city)))
      .sort((a, b) => {
        if (a.onlineStatus !== b.onlineStatus)
          return a.onlineStatus === "online" ? -1 : 1;
        return b.rating - a.rating;
      });
  }, [keyword, specialty, onlineOnly, travelOnly, handDrawingOnly, workload, city]);

  const reset = () => {
    setKeyword("");
    setSpecialty("all");
    setOnlineOnly(false);
    setTravelOnly(false);
    setHandDrawingOnly(false);
    setWorkload("all");
    setCity("all");
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            找设计师
          </h1>
          <p className="mt-2 text-sm text-ink-60">
            在线设计师优先展示。点击卡片进入主页查看作品集与档期。
          </p>
        </div>
        <div className="text-sm text-ink-60">
          共 <span className="font-semibold text-ink">{filtered.length}</span> 位匹配
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="sticky top-20 h-fit p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <SlidersHorizontal className="h-4 w-4" /> 筛选条件
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              重置
            </Button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label>关键词</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-40" />
                <Input
                  placeholder="姓名 / 标签 / 项目类型"
                  className="pl-9"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>专业</Label>
              <div className="flex flex-wrap gap-2">
                {[{ value: "all", label: "全部" }, ...SPECIALTIES].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSpecialty(s.value as any)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      specialty === s.value
                        ? "border-ink bg-ink text-white"
                        : "border-ink-20 text-ink-60 hover:border-ink/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>负荷状态</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "all", l: "全部" },
                  { v: "free", l: "空闲" },
                  { v: "normal", l: "正常" },
                  { v: "busy", l: "饱满" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => setWorkload(o.v as any)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      workload === o.v
                        ? "border-ink bg-ink text-white"
                        : "border-ink-20 text-ink-60 hover:border-ink/40"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>所在城市</Label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCity("all")}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    city === "all"
                      ? "border-ink bg-ink text-white"
                      : "border-ink-20 text-ink-60 hover:border-ink/40"
                  }`}
                >
                  全部
                </button>
                {cities.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      city === c
                        ? "border-ink bg-ink text-white"
                        : "border-ink-20 text-ink-60 hover:border-ink/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label>仅显示在线</Label>
                  <p className="mt-1 text-[11px] text-ink-40">右上角带绿点的设计师</p>
                </div>
                <Switch checked={onlineOnly} onCheckedChange={setOnlineOnly} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>支持出差</Label>
                  <p className="mt-1 text-[11px] text-ink-40">线下上门服务可选</p>
                </div>
                <Switch checked={travelOnly} onCheckedChange={setTravelOnly} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>支持手改图</Label>
                </div>
                <Switch
                  checked={handDrawingOnly}
                  onCheckedChange={setHandDrawingOnly}
                />
              </div>
            </div>
          </div>
        </Card>

        <div>
          {filtered.length === 0 ? (
            <Card className="p-16 text-center text-ink-60">
              <Search className="mx-auto mb-3 h-8 w-8 text-ink-40" />
              没有匹配的设计师,请调整筛选条件。
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((d) => (
                <DesignerCard key={d.id} designer={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
