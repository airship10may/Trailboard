import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const loc = useLocation();
  const isHomeActive = loc.pathname === "/" || loc.pathname.startsWith("/trail/");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/70 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-zinc-900 dark:bg-zinc-100" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Trailboard</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                tiny app / no backend
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`rounded-xl px-3 py-2 text-sm ${
                isHomeActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/settings"
              className={`rounded-xl px-3 py-2 text-sm ${
                loc.pathname === "/settings"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
