import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "trailboard.theme";

export default function Settings() {
  const initial = useMemo<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" ? "dark" : "light";
  }, []);

  const [theme, setTheme] = useState<Theme>(initial);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          バックエンドなしで「操作→状態→反映」を作る練習用です。
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`rounded-xl px-4 py-2 text-sm ${
              theme === "light"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-xl px-4 py-2 text-sm ${
              theme === "dark"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
            }`}
          >
            Dark
          </button>
        </div>
      </section>
    </div>
  );
}
