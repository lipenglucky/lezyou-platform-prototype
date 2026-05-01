"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/lib/types";

interface RoleState {
  role: Role;
  identityId: string;
  setRole: (role: Role, identityId?: string) => void;
}

const DEFAULT_IDENTITY_BY_ROLE: Record<Role, string> = {
  guest: "",
  client: "client_lin",
  designer: "designer_chen",
  admin: "admin_root",
};

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: "guest",
      identityId: "",
      setRole: (role, identityId) =>
        set({
          role,
          identityId: identityId ?? DEFAULT_IDENTITY_BY_ROLE[role],
        }),
    }),
    {
      name: "lezyou-role",
    },
  ),
);
