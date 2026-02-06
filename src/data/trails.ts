export type Trail = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  minutes: number;
};

export const trails: Trail[] = [
  {
    id: "a01",
    title: "余白を取り戻す",
    subtitle: "短い散歩と、呼吸を整える",
    tags: ["calm", "reset"],
    minutes: 12,
  },
  {
    id: "a02",
    title: "メモを磨く",
    subtitle: "1行だけ書く、を続ける",
    tags: ["writing", "habit"],
    minutes: 8,
  },
  {
    id: "a03",
    title: "設計を眺め直す",
    subtitle: "要件→データ→画面の順で整理",
    tags: ["design", "structure"],
    minutes: 15,
  },
];

export function getTrail(id: string) {
  return trails.find((t) => t.id === id);
}
