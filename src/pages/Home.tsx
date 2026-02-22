import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createTrailId,
  getPreferredTrails,
  parseDurationToMinutes,
  parseTags,
  saveTrails,
} from "../data/trails";
import type { Trail } from "../data/trails";
import { isPremiumActive, loadEntitlement } from "../data/entitlement";

const FREE_CARD_LIMIT = 10;

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [items, setItems] = useState<Trail[]>(() => getPreferredTrails());
  const [entitlement] = useState(() => loadEntitlement());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const premiumActive = useMemo(
    () => isPremiumActive(entitlement),
    [entitlement]
  );
  const isCreateLimitReached = !premiumActive && items.length >= FREE_CARD_LIMIT;

  const tagSummaries = useMemo(() => {
    const counts = new Map<string, number>();

    items.forEach((trail) => {
      trail.tags.forEach((tag) => {
        const normalized = tag.trim().toLowerCase();
        if (!normalized) return;
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort(([aTag, aCount], [bTag, bCount]) => {
        if (bCount !== aCount) return bCount - aCount;
        return aTag.localeCompare(bTag);
      })
      .map(([tag, count]) => ({ tag, count }));
  }, [items]);

  const filteredTrails = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return items.filter((trail) => {
      const queryMatch =
        !normalized ||
        trail.title.toLowerCase().includes(normalized) ||
        trail.subtitle.toLowerCase().includes(normalized) ||
        trail.tags.some((tag) => tag.toLowerCase().includes(normalized));
      const selectedTagMatch = selectedTags.every((selectedTag) =>
        trail.tags.some((tag) => tag.toLowerCase() === selectedTag)
      );

      return queryMatch && selectedTagMatch;
    });
  }, [items, query, selectedTags]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((value) => value !== tag) : [...prev, tag]
    );
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormError(null);
  }

  function resetForm() {
    setTitleInput("");
    setDescriptionInput("");
    setTagsInput("");
    setDurationInput("");
    setFormError(null);
  }

  function handleOpenModal() {
    if (isCreateLimitReached) return;
    resetForm();
    setIsModalOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isCreateLimitReached) {
      setFormError(
        `Free plan can create up to ${FREE_CARD_LIMIT} cards. Upgrade to Premium to add more.`
      );
      return;
    }

    const title = titleInput.trim();
    if (!title) {
      setFormError("Title is required.");
      return;
    }

    const minutes = parseDurationToMinutes(durationInput);
    if (durationInput.trim() && minutes === null) {
      setFormError("Duration must be a number or format like 12m.");
      return;
    }

    const nextTrail: Trail = {
      id: createTrailId(),
      title,
      subtitle: descriptionInput.trim() || "No description",
      tags: parseTags(tagsInput),
      minutes: minutes ?? 0,
    };

    const nextTrails = [nextTrail, ...items];
    setItems(nextTrails);
    saveTrails(nextTrails);
    closeModal();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">今日のボード</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              カードをクリックすると詳細へ遷移します。
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenModal}
            disabled={isCreateLimitReached}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm ${
              isCreateLimitReached
                ? "cursor-not-allowed bg-zinc-300 text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300"
                : "bg-zinc-900 text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
            }`}
          >
            + New
          </button>
        </div>
        {isCreateLimitReached && (
          <p className="mt-3 text-sm text-amber-700 dark:text-amber-300">
            Free plan limit reached ({FREE_CARD_LIMIT} cards). Upgrade to Premium
            to create more cards.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
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
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
        />

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Tags
            </p>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Clear
              </button>
            )}
          </div>

          {tagSummaries.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">No tags</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tagSummaries.map(({ tag, count }) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    #{tag} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredTrails.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 md:col-span-2">
            No results
          </div>
        ) : (
          filteredTrails.map((t) => (
            <button
              key={t.id}
              onClick={() => nav(`/trail/${t.id}`)}
              className="group rounded-3xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-semibold">{t.title}</div>
                  <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {t.subtitle}
                  </div>
                </div>
                <div className="rounded-2xl bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-zinc-950/40 p-4 sm:items-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          >
            <h2 className="text-lg font-semibold">Create Card</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block text-zinc-700 dark:text-zinc-300">
                  Title *
                </span>
                <input
                  value={titleInput}
                  onChange={(event) => setTitleInput(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-zinc-700 dark:text-zinc-300">
                  Description
                </span>
                <input
                  value={descriptionInput}
                  onChange={(event) => setDescriptionInput(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-zinc-700 dark:text-zinc-300">
                  Tags
                </span>
                <input
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="#calm #reset"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-zinc-700 dark:text-zinc-300">
                  Duration
                </span>
                <input
                  value={durationInput}
                  onChange={(event) => setDurationInput(event.target.value)}
                  placeholder="12 or 12m"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
                />
              </label>
            </div>

            {formError && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                {formError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
