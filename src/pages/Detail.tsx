import { Link, useParams } from "react-router-dom";
import { getTrail } from "../data/trails";

export default function Detail() {
  const { id } = useParams();
  const t = id ? getTrail(id) : undefined;

  if (!t) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm text-zinc-500">Not found</div>
        <Link className="mt-3 inline-block text-sm underline" to="/">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Trail ID: {t.id}</div>
        <h1 className="mt-2 text-2xl font-semibold">{t.title}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {t.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
          <div className="font-medium">Mini interaction</div>
          <div className="mt-1 text-zinc-500 dark:text-zinc-400">
            ここは将来「フロントだけの状態管理」や「アニメーション実験」を足していく余地にします。
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            Back
          </Link>
          <Link
            to="/settings"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
