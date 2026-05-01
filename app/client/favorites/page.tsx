"use client";

import { Card } from "@/components/ui/card";
import { DesignerCard } from "@/components/domain/designer-card";
import { designers } from "@/mocks/designers";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const favorites = designers.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          关注的设计师
        </h2>
        <p className="mt-1 text-sm text-ink-60">
          收藏喜欢的设计师,合作时一键找到。
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-16 text-center text-ink-60">
          <Heart className="mx-auto mb-3 h-8 w-8 text-ink-40" />
          还没有收藏的设计师
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((d) => (
            <DesignerCard key={d.id} designer={d} />
          ))}
        </div>
      )}
    </div>
  );
}
