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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Plane,
  PencilLine,
  Sparkles,
  Upload,
  X,
  CalendarRange,
  Wifi,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SPECIALTIES, SUB_SPECIALTIES, getProjectTypes } from "@/lib/constants";
import type { Specialty, SubSpecialty } from "@/lib/types";
import { useSessionStore } from "@/store/session-store";

const STEPS = [
  { id: "basic", title: "基础信息", desc: "姓名 / 联系方式 / 所在地" },
  { id: "specialty", title: "专业方向", desc: "选择三大类与子专业" },
  { id: "portfolio", title: "作品上传", desc: "按项目类型分类作品集" },
  { id: "service", title: "服务设置", desc: "服务模式 / 标签 / 计费" },
  { id: "calendar", title: "档期 & 提交", desc: "可接单时间 + 提交审核" },
];

export default function DesignerOnboardingPage() {
  const router = useRouter();
  const push = useSessionStore((s) => s.pushNotification);
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("上海市 · 徐汇区(已自动定位)");
  const [years, setYears] = useState(5);
  const [inJob, setInJob] = useState(true);

  const [specialty, setSpecialty] = useState<Specialty>("architecture");
  const [subs, setSubs] = useState<SubSpecialty[]>([]);
  const [projectTags, setProjectTags] = useState<string[]>([]);

  const [portfolio, setPortfolio] = useState<{ category: string; count: number }[]>(
    [],
  );
  const [newCategory, setNewCategory] = useState("");

  const [supportTravel, setSupportTravel] = useState(true);
  const [supportHand, setSupportHand] = useState(true);
  const [serviceModes, setServiceModes] = useState<("online" | "onsite")[]>([
    "online",
  ]);
  const [meetingFlex, setMeetingFlex] = useState("工作日 09:00-21:00");
  const [dailyRate, setDailyRate] = useState(2000);
  const [monthlyRate, setMonthlyRate] = useState(35000);

  const [closeWeekend, setCloseWeekend] = useState(true);
  const [closeHoliday, setCloseHoliday] = useState(true);
  const [allYearOpen, setAllYearOpen] = useState(false);

  const handleSubmit = () => {
    push({
      title: "入驻申请已提交",
      description: "平台将在 1 个工作日内反馈审核结果。审核通过后即可上线接单。",
      variant: "success",
    });
    router.push("/login");
  };

  const toggleSub = (s: SubSpecialty) => {
    setSubs(subs.includes(s) ? subs.filter((x) => x !== s) : [...subs, s]);
  };

  const toggleProjectTag = (t: string) => {
    setProjectTags(
      projectTags.includes(t) ? projectTags.filter((x) => x !== t) : [...projectTags, t],
    );
  };

  const toggleServiceMode = (m: "online" | "onsite") => {
    setServiceModes(
      serviceModes.includes(m)
        ? serviceModes.filter((x) => x !== m)
        : [...serviceModes, m],
    );
  };

  return (
    <div className="container-page py-10">
      <Link
        href="/login"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-60 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> 返回登录页
      </Link>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit p-5 lg:sticky lg:top-20">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <h3 className="text-sm font-semibold text-ink">设计师入驻向导</h3>
          </div>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-3",
                  i === step
                    ? "bg-ink text-white"
                    : i < step
                      ? "bg-ink-20/40 text-ink"
                      : "text-ink-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    i === step
                      ? "bg-white text-ink"
                      : i < step
                        ? "bg-emerald-500 text-white"
                        : "border border-ink-20 bg-white text-ink-60",
                  )}
                >
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <div>
                  <div className="text-sm font-medium">{s.title}</div>
                  <div
                    className={cn(
                      "text-xs",
                      i === step ? "text-white/70" : "text-ink-40",
                    )}
                  >
                    {s.desc}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-8">
          {/* Step 1: 基础信息 */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-ink">第 1 步 · 基础信息</h2>
              <p className="text-sm text-ink-60">
                填写你的实名信息和联系方式,平台将与官方资质核验。
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>真实姓名 *</Label>
                  <Input
                    placeholder="请输入与身份证一致的姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>手机号 *</Label>
                  <Input
                    placeholder="11 位手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>所在地</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2"
                  />
                  <p className="mt-1.5 text-xs text-ink-40">
                    系统已根据 IP 自动定位,可手动修改
                  </p>
                </div>
                <div>
                  <Label>从业年限</Label>
                  <Input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value || 0))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>在职状态</Label>
                  <div className="mt-2 flex h-11 items-center justify-between rounded-xl border border-ink-20 px-4">
                    <span className="text-sm text-ink">
                      {inJob ? "在职 · 兼职接单" : "自由职业 · 全职接单"}
                    </span>
                    <Switch checked={inJob} onCheckedChange={setInJob} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 专业方向 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-ink">第 2 步 · 专业方向</h2>
              <p className="text-sm text-ink-60">
                选择主专业大类和擅长的子专业,以及擅长的项目类型标签。
              </p>

              <div>
                <Label>主专业大类 *</Label>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {SPECIALTIES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        setSpecialty(s.value);
                        setSubs([]);
                        setProjectTags([]);
                      }}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-all",
                        specialty === s.value
                          ? "border-ink bg-ink-20/30 shadow-sm"
                          : "border-ink-20 hover:border-ink/40",
                      )}
                    >
                      <div className="text-sm font-semibold text-ink">{s.label}</div>
                      <div className="mt-1 text-xs text-ink-60">{s.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>子专业(可多选)</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUB_SPECIALTIES[specialty].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => toggleSub(s.value)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                        subs.includes(s.value)
                          ? "border-ink bg-ink text-white"
                          : "border-ink-20 text-ink-60 hover:border-ink/40",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>擅长的项目类型(可多选)</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getProjectTypes(specialty).map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleProjectTag(t)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition-colors",
                        projectTags.includes(t)
                          ? "border-ink bg-ink text-white"
                          : "border-ink-20 text-ink-60 hover:border-ink/40",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 作品上传 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-ink">第 3 步 · 作品上传</h2>
              <p className="text-sm text-ink-60">
                按项目类型分类上传图片,作品将公开展示在你的个人主页。建议至少 6 件。
              </p>

              <div>
                <Label>新建作品分类</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="例如:商业综合体"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!newCategory.trim()) return;
                      setPortfolio([
                        ...portfolio,
                        { category: newCategory.trim(), count: 0 },
                      ]);
                      setNewCategory("");
                    }}
                  >
                    新建分类
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {portfolio.length === 0 && (
                  <Card className="border-dashed bg-ink-20/20 p-10 text-center text-sm text-ink-60">
                    暂无分类。从你擅长的项目类型中新建一个开始上传作品。
                  </Card>
                )}
                {portfolio.map((p, i) => (
                  <Card key={i} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="bg-ink">
                          {p.category}
                        </Badge>
                        <span className="text-sm text-ink-60">{p.count} 件作品</span>
                      </div>
                      <button
                        onClick={() =>
                          setPortfolio(portfolio.filter((_, j) => j !== i))
                        }
                        className="text-ink-40 hover:text-ink"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <button
                          key={j}
                          onClick={() => {
                            const next = [...portfolio];
                            next[i].count++;
                            setPortfolio(next);
                            push({
                              title: `已添加 1 张到「${p.category}」`,
                            });
                          }}
                          className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-ink-20 text-ink-40 hover:border-ink/40 hover:text-ink"
                        >
                          <ImagePlus className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: 服务设置 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-ink">第 4 步 · 服务设置</h2>
              <p className="text-sm text-ink-60">
                设置服务范围、是否支持出差/手改图、单价等。这些将展示在你的主页。
              </p>

              <div>
                <Label>接单范围(可多选)</Label>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <button
                    onClick={() => toggleServiceMode("online")}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                      serviceModes.includes("online")
                        ? "border-ink bg-ink-20/30"
                        : "border-ink-20 hover:border-ink/40",
                    )}
                  >
                    <Wifi className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink">纯线上接单</div>
                      <div className="text-xs text-ink-60">
                        远程沟通,在线交付文件
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => toggleServiceMode("onsite")}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                      serviceModes.includes("onsite")
                        ? "border-ink bg-ink-20/30"
                        : "border-ink-20 hover:border-ink/40",
                    )}
                  >
                    <CalendarRange className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-ink">线下上门服务</div>
                      <div className="text-xs text-ink-60">
                        现场踏勘 + 落地对接
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border border-ink-20 p-4">
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-ink-60" />
                    <span className="text-sm text-ink">支持出差</span>
                  </div>
                  <Switch checked={supportTravel} onCheckedChange={setSupportTravel} />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-ink-20 p-4">
                  <div className="flex items-center gap-2">
                    <PencilLine className="h-4 w-4 text-ink-60" />
                    <span className="text-sm text-ink">支持手改图</span>
                  </div>
                  <Switch checked={supportHand} onCheckedChange={setSupportHand} />
                </div>
              </div>

              <div>
                <Label>会议沟通时段</Label>
                <Input
                  className="mt-2"
                  placeholder="例如:工作日 09:00-21:00"
                  value={meetingFlex}
                  onChange={(e) => setMeetingFlex(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>按天计费单价 (¥/天)</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value || 0))}
                  />
                </div>
                <div>
                  <Label>按月雇佣单价 (¥/月)</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(Number(e.target.value || 0))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: 档期 + 提交 */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-ink">
                第 5 步 · 档期设置与提交审核
              </h2>
              <p className="text-sm text-ink-60">
                设置可接单时间,提交后由平台审核,通常 1 个工作日内反馈。
              </p>

              <Card className="space-y-4 p-5">
                <h3 className="text-sm font-semibold text-ink">档期偏好</h3>
                <ToggleRow
                  label="关闭周末档期"
                  checked={closeWeekend}
                  onChange={setCloseWeekend}
                />
                <ToggleRow
                  label="关闭法定节假日档期"
                  checked={closeHoliday}
                  onChange={setCloseHoliday}
                />
                <ToggleRow
                  label="全年全时段开放接单"
                  checked={allYearOpen}
                  onChange={setAllYearOpen}
                />
              </Card>

              <Card className="space-y-3 bg-ink-20/30 p-5 text-sm text-ink-60">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="font-medium text-ink">审核流程说明</div>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs">
                      <li>系统自动核验姓名 / 身份证 / 手机号实名</li>
                      <li>人工抽查作品集、专业资质</li>
                      <li>审核通过后账号正式上线,在线状态默认开启</li>
                      <li>审核结果将通过短信和站内消息通知</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-2 border-t border-ink-20 pt-6">
            <div className="text-xs text-ink-40">
              第 {step + 1} 步 / 共 {STEPS.length} 步
            </div>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4" /> 上一步
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button variant="brand" onClick={() => setStep(step + 1)}>
                  下一步 <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="brand" onClick={handleSubmit}>
                  <Upload className="h-4 w-4" /> 提交审核
                </Button>
              )}
            </div>
          </div>
        </Card>
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
