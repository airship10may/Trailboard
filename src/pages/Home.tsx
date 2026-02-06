import { useNavigate } from "react-router-dom";
import { trails } from "../data/trails";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold">今日のボード</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          カードをクリックすると詳細へ遷移します（データはフロント内のモックです）
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {trails.map((t) => (
          <button
            key={t.id}
            onClick={() => nav(`/trail/${t.id}`)}
            className="group rounded-3xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-semibold">{t.title}</div>
                <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {t.subtitle}
                </div>
              </div>
              <div className="rounded-2xl bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {t.minutes}m
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-5 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="inline-flex items-center gap-1">
                Open detail
                <span className="transition group-hover:translate-x-0.5">→</span>
              </span>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}
