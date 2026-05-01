"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { designers } from "@/mocks/designers";
import { clients } from "@/mocks/clients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityDot } from "@/components/domain/activity-dot";
import { OnlineDot } from "@/components/domain/status-badges";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          用户管理
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          查看所有设计师与委托人账号,管理状态与权限。
        </p>
      </div>

      <Tabs defaultValue="designers">
        <TabsList>
          <TabsTrigger value="designers">设计师 · {designers.length}</TabsTrigger>
          <TabsTrigger value="clients">委托人 · {clients.length}</TabsTrigger>
        </TabsList>

        <TabsContent value="designers">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-20 bg-ink-20/20 text-xs uppercase tracking-wider text-ink-40">
                <tr>
                  <th className="px-5 py-3 text-left">设计师</th>
                  <th className="px-5 py-3 text-left">专业</th>
                  <th className="px-5 py-3 text-left">所在地</th>
                  <th className="px-5 py-3 text-left">在线 / 活跃</th>
                  <th className="px-5 py-3 text-right">完成订单</th>
                </tr>
              </thead>
              <tbody>
                {designers.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-ink-20 last:border-b-0"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/designers/${d.id}`}
                        className="flex items-center gap-3 hover:text-brand"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={d.avatar} alt={d.name} />
                          <AvatarFallback>{d.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-ink">{d.name}</div>
                          <div className="text-xs text-ink-60">{d.tagline}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink-60">
                      {d.specialty === "architecture"
                        ? "建筑设计"
                        : d.specialty === "landscape"
                          ? "景观设计"
                          : "室内设计"}
                    </td>
                    <td className="px-5 py-3 text-ink-60">{d.location}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <OnlineDot status={d.onlineStatus} />
                        <ActivityDot level={d.activityIndicator} size="sm" />
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-ink">
                      {d.completedProjects}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-20 bg-ink-20/20 text-xs uppercase tracking-wider text-ink-40">
                <tr>
                  <th className="px-5 py-3 text-left">名称</th>
                  <th className="px-5 py-3 text-left">类型</th>
                  <th className="px-5 py-3 text-left">认证状态</th>
                  <th className="px-5 py-3 text-left">注册时间</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-ink-20 last:border-b-0"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={c.avatar} alt={c.name} />
                          <AvatarFallback>{c.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-ink">{c.name}</div>
                          {c.companyName && (
                            <div className="text-xs text-ink-60">
                              {c.companyName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={c.type === "enterprise" ? "brand" : "muted"}>
                        {c.type === "enterprise" ? "企业" : "个人"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={c.verified ? "emerald" : "amber"}>
                        {c.verified ? "已认证" : "待审核"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-60">{c.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
