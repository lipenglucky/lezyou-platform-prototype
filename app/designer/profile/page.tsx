"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Pencil } from "lucide-react";

export default function DesignerProfileEditorPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            个人主页
          </h2>
          <p className="mt-1 text-sm text-ink-60">
            维护对外公开的个人简介、专业能力、服务标签。
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/designers/designer_chen">
              <Eye className="h-4 w-4" /> 预览主页
            </Link>
          </Button>
          <Button variant="brand">
            <Pencil className="h-4 w-4" /> 编辑信息
          </Button>
        </div>
      </div>

      <Card className="p-12 text-center text-ink-60">
        <p>个人主页编辑器(原型阶段)</p>
        <p className="mt-2 text-xs">点击「预览主页」查看对外展示效果。</p>
      </Card>
    </div>
  );
}
