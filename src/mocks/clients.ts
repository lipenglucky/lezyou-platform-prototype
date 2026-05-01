import type { Client } from "@/lib/types";

export const clients: Client[] = [
  {
    id: "client_lin",
    name: "林家三口",
    avatar: "https://api.dicebear.com/7.x/initials/png?seed=林家&backgroundColor=E11D48&textColor=ffffff",
    type: "individual",
    verified: true,
    joinedAt: "2025-09-12",
  },
  {
    id: "client_yu",
    name: "禹生文旅集团",
    avatar: "https://api.dicebear.com/7.x/initials/png?seed=禹生&backgroundColor=0a0a0a&textColor=ffffff",
    type: "enterprise",
    verified: true,
    companyName: "禹生文旅产业（深圳）有限公司",
    joinedAt: "2024-11-03",
  },
  {
    id: "client_qing",
    name: "青源置业",
    avatar: "https://api.dicebear.com/7.x/initials/png?seed=青源&backgroundColor=525252&textColor=ffffff",
    type: "enterprise",
    verified: false,
    companyName: "青源置业（杭州）有限公司",
    joinedAt: "2026-04-21",
  },
];

export function getClientById(id: string) {
  return clients.find((c) => c.id === id);
}
