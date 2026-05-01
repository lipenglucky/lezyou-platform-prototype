"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DemoNotification {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
  createdAt: number;
}

interface SessionState {
  draftOrders: Array<{ id: string; designerId: string; createdAt: string; payload: any }>;
  draftBounties: Array<{ id: string; createdAt: string; payload: any }>;
  notifications: DemoNotification[];
  pushNotification: (n: Omit<DemoNotification, "id" | "createdAt">) => void;
  dismissNotification: (id: string) => void;
  appendDraftOrder: (designerId: string, payload: any) => string;
  appendDraftBounty: (payload: any) => string;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      draftOrders: [],
      draftBounties: [],
      notifications: [],
      pushNotification: (n) => {
        const note: DemoNotification = {
          id: Math.random().toString(36).slice(2, 10),
          createdAt: Date.now(),
          ...n,
        };
        set({ notifications: [...get().notifications, note] });
        setTimeout(() => {
          set({
            notifications: get().notifications.filter((x) => x.id !== note.id),
          });
        }, 4500);
      },
      dismissNotification: (id) =>
        set({ notifications: get().notifications.filter((n) => n.id !== id) }),
      appendDraftOrder: (designerId, payload) => {
        const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
        set({
          draftOrders: [
            ...get().draftOrders,
            { id, designerId, createdAt: new Date().toISOString(), payload },
          ],
        });
        return id;
      },
      appendDraftBounty: (payload) => {
        const id = `BTY-${Date.now().toString(36).toUpperCase()}`;
        set({
          draftBounties: [
            ...get().draftBounties,
            { id, createdAt: new Date().toISOString(), payload },
          ],
        });
        return id;
      },
    }),
    { name: "lezyou-session" },
  ),
);
