import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trails } from "../data/trails";

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");

  const filteredTrails = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return trails;

    return trails.filter((trail) => {
      const titleMatch = trail.title.toLowerCase().includes(normalized);
      const subtitleMatch = trail.subtitle.toLowerCase().includes(normalized);
      const tagMatch = trail.tags.some((tag) =>
        tag.toLowerCase().includes(normalized)
      );
      return titleMatch || subtitleMatch || tagMatch;
    });
  }, [query]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold">今日のボード</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          カードをクリックすると詳細へ遷移します（データはフロント内のモックです）
        </p>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <label
          htmlFor="trail-search"
          className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Search
        </label>
        <input
          id="trail-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, description, or tags"
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredTrails.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 md:col-span-2">
            No results
          </div>
        ) : (
          filteredTrails.map((t) => (
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
                  <span className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </button>
          ))
        )}
      </section>
    </div>
  );
}
