"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPECIALTIES, getProjectTypes } from "@/lib/constants";
import type { Specialty } from "@/lib/types";
import {
  ArrowLeft,
  Coins,
  Megaphone,
  Paperclip,
  PlusCircle,
  Sparkles,
  X,
} from "lucide-react";
import { useSessionStore } from "@/store/session-store";
import { formatCurrency } from "@/lib/utils";

export default function NewBountyPage() {
  const router = useRouter();
  const push = useSessionStore((s) => s.pushNotification);
  const append = useSessionStore((s) => s.appendDraftBounty);

  const [title, setTitle] = useState("");
  const [specialty, setSpecialty] = useState<Specialty>("landscape");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState(50000);
  const [rewardModel, setRewardModel] = useState<"fixed" | "negotiable">(
    "fixed",
  );
  const [deadline, setDeadline] = useState("");
  const [reqs, setReqs] = useState<string[]>(["有相关项目实战案例"]);
  const [reqInput, setReqInput] = useState("");
  const [attachments, setAttachments] = useState<string[]>([
    "项目任务书.pdf",
  ]);

  const addReq = () => {
    if (!reqInput.trim()) return;
    setReqs([...reqs, reqInput.trim()]);
    setReqInput("");
  };

  const handleSubmit = () => {
    if (!title || !description || !deadline) {
      push({ title: "请完善必填项", variant: "destructive" });
      return;
    }
    const id = append({
      title,
      specialty,
      projectType,
      description,
      reward,
      rewardModel,
      deadline,
      reqs,
      attachments,
    });
    push({
      title: "悬赏发布成功",
      description: `编号 ${id},符合专业的设计师将能看到并报名。`,
      variant: "success",
    });
    router.push("/bounties");
  };

  return (
    <div className="container-page py-10">
      <Link
        href="/bounties"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回悬赏大厅
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Card className="p-8">
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="gap-1">
              <Megaphone className="h-3 w-3" /> 公开悬赏招标
            </Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            发布项目悬赏
          </h1>
          <p className="mt-1 text-sm text-ink-60">
            填写项目信息和悬赏金额,符合专业的设计师可主动报名。你从中筛选合作方。
          </p>

          <div className="mt-7 space-y-6">
            <div>
              <Label>项目名称 *</Label>
              <Input
                placeholder="例如:苏州相城区 8 万㎡ 城市公园方案征集"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>所属专业 *</Label>
                <Select
                  value={specialty}
                  onValueChange={(v) => {
                    setSpecialty(v as Specialty);
                    setProjectType("");
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>项目类型</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="选择项目类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {getProjectTypes(specialty).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>项目详细描述 *</Label>
              <Textarea
                rows={6}
                placeholder="请描述项目背景、规模、设计深度、关键节点、汇报时间等"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>服务要求(可逐条添加)</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  placeholder="例如:5 年以上市政公园经验"
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addReq();
                    }
                  }}
                />
                <Button variant="outline" onClick={addReq}>
                  <PlusCircle className="h-4 w-4" /> 添加
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {reqs.map((r, i) => (
                  <Badge
                    key={i}
                    variant="muted"
                    className="cursor-pointer gap-1 pr-1"
                    onClick={() => setReqs(reqs.filter((_, j) => j !== i))}
                  >
                    {r}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>悬赏模式</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button
                    variant={rewardModel === "fixed" ? "default" : "outline"}
                    onClick={() => setRewardModel("fixed")}
                  >
                    固定金额
                  </Button>
                  <Button
                    variant={rewardModel === "negotiable" ? "default" : "outline"}
                    onClick={() => setRewardModel("negotiable")}
                  >
                    面议
                  </Button>
                </div>
              </div>
              <div>
                <Label>截止时间 *</Label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            {rewardModel === "fixed" && (
              <div>
                <Label>悬赏金额 (¥) *</Label>
                <Input
                  type="number"
                  step={1000}
                  min={1000}
                  value={reward}
                  onChange={(e) => setReward(Number(e.target.value || 0))}
                  className="mt-2"
                />
                <p className="mt-1.5 text-xs text-ink-40">
                  预算金额仅对设计师参考,选定后转入平台托管。
                </p>
              </div>
            )}

            <div>
              <Label>项目附件</Label>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {attachments.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-ink-20 bg-ink-20/20 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 text-sm text-ink">
                      <Paperclip className="h-3.5 w-3.5 text-ink-60" />
                      {a}
                    </div>
                    <button
                      onClick={() =>
                        setAttachments(attachments.filter((_, j) => j !== i))
                      }
                      className="text-ink-40 hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setAttachments([
                      ...attachments,
                      `附件_${attachments.length + 1}.pdf`,
                    ])
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-ink-20 p-2.5 text-sm text-ink-60 hover:border-ink/40 hover:text-ink"
                >
                  <Paperclip className="h-3.5 w-3.5" /> 上传附件
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              取消
            </Button>
            <Button variant="brand" onClick={handleSubmit}>
              <Megaphone className="h-4 w-4" /> 立即发布
            </Button>
          </div>
        </Card>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-6">
            <div className="mb-3 text-xs uppercase tracking-wider text-ink-40">
              悬赏预算预览
            </div>
            <div className="text-3xl font-bold tracking-tight text-brand">
              {rewardModel === "negotiable" ? "面议" : formatCurrency(reward)}
            </div>
            <p className="mt-1.5 text-xs text-ink-60">
              {rewardModel === "fixed"
                ? "选定设计师后金额转入平台托管"
                : "可在选定设计师后协商最终金额"}
            </p>
          </Card>

          <Card className="space-y-3 p-6 text-xs text-ink-60">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 text-brand" />
              发布后符合专业的设计师可在悬赏大厅自主报名。
            </div>
            <div className="flex items-start gap-2">
              <Coins className="mt-0.5 h-3.5 w-3.5 text-brand" />
              选择中标设计师后,系统自动生成正式订单与电子合同。
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
