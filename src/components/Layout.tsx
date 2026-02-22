import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const loc = useLocation();
  const isHomeActive = loc.pathname === "/" || loc.pathname.startsWith("/trail/");

  return (
    <div className="min-h-dvh">
<header className="sticky top-0 z-10 border-b border-[var(--tb-border)] bg-[var(--tb-page-bg)]/70 backdrop-blur">
  <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
    <Link to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-xl bg-[var(--tb-text)]" />
      <div className="leading-tight">
        <div className="text-sm font-semibold text-[var(--tb-text)]">Trailboard</div>
        <div className="text-xs text-[var(--tb-muted)]">tiny app / no backend</div>
      </div>
    </Link>

    <nav className="flex items-center gap-2">
      <Link
        to="/"
        className={`rounded-xl px-3 py-2 text-sm border border-transparent ${
          isHomeActive
            ? "bg-[var(--tb-input-bg)] text-[var(--tb-text)] ring-2 ring-[var(--tb-border)]"
            : "text-[var(--tb-muted)] hover:bg-[var(--tb-input-bg)]"
        }`}
      >
        Home
      </Link>
      <Link
        to="/settings"
        className={`rounded-xl px-3 py-2 text-sm border border-transparent ${
          loc.pathname === "/settings"
            ? "bg-[var(--tb-input-bg)] text-[var(--tb-text)] ring-2 ring-[var(--tb-border)]"
            : "text-[var(--tb-muted)] hover:bg-[var(--tb-input-bg)]"
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

