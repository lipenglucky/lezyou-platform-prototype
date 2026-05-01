import type { Specialty, SubSpecialty } from "./types";

export const SPECIALTIES: { value: Specialty; label: string; description: string }[] = [
  {
    value: "architecture",
    label: "建筑设计",
    description: "方案设计、施工图、建筑改造与可研顾问",
  },
  {
    value: "landscape",
    label: "景观设计",
    description: "园建、绿化、给排水、电气一体化施工图",
  },
  {
    value: "interior",
    label: "室内设计",
    description: "住宅、商业空间、办公精装与软装陈设",
  },
];

export const SUB_SPECIALTIES: Record<Specialty, { value: SubSpecialty; label: string }[]> = {
  architecture: [
    { value: "concept", label: "方案概念" },
    { value: "construction_doc", label: "建筑施工图" },
    { value: "model", label: "建筑模型" },
  ],
  landscape: [
    { value: "garden_construction", label: "园建施工图" },
    { value: "greening", label: "绿化施工图" },
    { value: "drainage", label: "给排水施工图" },
    { value: "electrical", label: "电气施工图" },
  ],
  interior: [
    { value: "concept", label: "方案概念" },
    { value: "construction_doc", label: "室内施工图" },
    { value: "soft_decoration", label: "软装陈设" },
  ],
};

export const LANDSCAPE_PROJECT_TYPES = [
  "高层住宅",
  "公寓",
  "市政公园",
  "道路景观",
  "滨水步道",
  "湿地公园",
  "医院",
  "学校",
  "办公景观",
  "商业景观",
  "度假酒店及别墅区",
  "美丽乡村",
  "私人会所",
  "营地",
  "文旅",
  "自然风景区",
  "养老地产",
  "工厂产业园",
  "创新高科园区",
  "儿童乐园",
  "温泉度假",
  "主题乐园",
  "私宅别墅",
  "民宿花园",
  "其他",
];

export const ARCHITECTURE_PROJECT_TYPES = [
  "高层住宅",
  "公寓",
  "办公建筑",
  "商业综合体",
  "酒店度假",
  "学校",
  "医院",
  "工业厂房",
  "别墅",
  "民宿",
  "改造更新",
  "城市设计",
  "其他",
];

export const INTERIOR_PROJECT_TYPES = [
  "私宅住宅",
  "别墅大宅",
  "公寓样板间",
  "办公空间",
  "商业空间",
  "餐饮空间",
  "酒店客房",
  "民宿",
  "医美诊所",
  "教育空间",
  "展厅",
  "其他",
];

export function getProjectTypes(specialty: Specialty) {
  switch (specialty) {
    case "architecture":
      return ARCHITECTURE_PROJECT_TYPES;
    case "landscape":
      return LANDSCAPE_PROJECT_TYPES;
    case "interior":
      return INTERIOR_PROJECT_TYPES;
  }
}

export const ORDER_STATUS_META = {
  matching: { label: "待匹配设计师", tone: "muted" as const },
  pending_contract: { label: "待签约", tone: "amber" as const },
  in_progress: { label: "进行中", tone: "brand" as const },
  pending_review: { label: "待成果确认", tone: "blue" as const },
  in_revision: { label: "返修修改中", tone: "violet" as const },
  completed: { label: "已完成", tone: "emerald" as const },
  terminated: { label: "已终止", tone: "rose" as const },
};

export const WORKLOAD_META = {
  free: { label: "空闲接单", color: "bg-emerald-500" },
  normal: { label: "接单正常", color: "bg-amber-500" },
  busy: { label: "接单饱满", color: "bg-rose-500" },
};

export const ACTIVITY_META = {
  green: { label: "近 3 天活跃", color: "bg-emerald-500" },
  yellow: { label: "3-15 天内登录", color: "bg-amber-400" },
  red: { label: "15 天以上未登录", color: "bg-rose-500" },
};

export const PLATFORM_FEE_RATE = 0.08;

export const FROZEN_PERIOD_DAYS = 30;
