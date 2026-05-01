"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getDesignerById } from "@/mocks/designers";
import { useSessionStore } from "@/store/session-store";
import { CalendarRange, Save } from "lucide-react";

export default function CalendarPage() {
  const designer = getDesignerById("designer_chen")!;
  const push = useSessionStore((s) => s.pushNotification);
  const [closeWeekend, setCloseWeekend] = useState(true);
  const [closeHoliday, setCloseHoliday] = useState(true);
  const [allDay, setAllDay] = useState(false);

  const monthDays = Array.from({ length: 31 }).map((_, i) => {
    const d = new Date("2026-05-01");
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          接单档期
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          设置你的可接单时间,委托人发起线下上门服务时只能选择空闲档期。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-ink-60" />
              <h3 className="text-base font-semibold text-ink">2026 年 5 月</h3>
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
                <button
                  key={d}
                  onClick={() =>
                    push({
                      title: slot?.available ? "已关闭该日档期" : "已开放该日档期",
                    })
                  }
                  className={`flex h-12 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                    slot?.available
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-ink-20/40 text-ink-40 hover:bg-ink-20/60"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <h3 className="text-sm font-semibold text-ink">批量设置</h3>
            <ToggleRow
              label="关闭周末"
              checked={closeWeekend}
              onChange={setCloseWeekend}
            />
            <ToggleRow
              label="关闭法定节假日"
              checked={closeHoliday}
              onChange={setCloseHoliday}
            />
            <ToggleRow
              label="全年全时段开放接单"
              checked={allDay}
              onChange={setAllDay}
            />
            <Button variant="brand" className="w-full">
              <Save className="h-4 w-4" /> 保存设置
            </Button>
          </Card>

          <Card className="p-5 text-xs text-ink-60">
            <div className="font-medium text-ink">沟通时段</div>
            <div className="mt-1">{designer.meetingFlexibility}</div>
            <Label className="mt-4 block">修改沟通时段</Label>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              编辑
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
