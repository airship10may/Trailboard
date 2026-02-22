import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteTrail,
  getTrail,
  parseDurationToMinutes,
  parseTags,
  updateTrail,
} from "../data/trails";
import { getButtonClass } from "../components/buttonVariants";

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const trail = id ? getTrail(id) : undefined;
  const [deletingTrailId, setDeletingTrailId] = useState<string | null>(null);
  const [editingTrailId, setEditingTrailId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const isDeleting = Boolean(id && deletingTrailId === id);
  const isEditing = Boolean(id && editingTrailId === id);

  function resetEditForm() {
    setTitleInput("");
    setDescriptionInput("");
    setTagsInput("");
    setDurationInput("");
    setFormError(null);
  }

  function handleStartEdit() {
    if (!id || !trail) return;

    setEditingTrailId(id);
    setTitleInput(trail.title);
    setDescriptionInput(trail.subtitle === "No description" ? "" : trail.subtitle);
    setTagsInput(trail.tags.map((tag) => `#${tag}`).join(" "));
    setDurationInput(trail.minutes > 0 ? String(trail.minutes) : "");
    setFormError(null);
  }

  function handleCancelEdit() {
    setEditingTrailId(null);
    resetEditForm();
  }

  function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id || !trail) return;

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

    const updated = updateTrail(id, {
      title,
      subtitle: descriptionInput.trim() || "No description",
      tags: parseTags(tagsInput),
      minutes: minutes ?? 0,
    });

    if (!updated) {
      setFormError("Card not found.");
      return;
    }

    setEditingTrailId(null);
    resetEditForm();
  }

  function handleDelete() {
    if (!id || isDeleting) return;

    const confirmed = window.confirm("Delete this card?");
    if (!confirmed) return;

    setDeletingTrailId(id);
    deleteTrail(id);
    navigate("/", { replace: true });
  }

  if (!trail) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-sm text-zinc-500">Not found</div>
        <Link className="mt-3 inline-block text-sm underline" to="/">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Trail ID: {trail.id}</div>
        <h1 className="mt-2 text-2xl font-semibold">{trail.title}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{trail.subtitle}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {trail.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
          <div className="font-medium">Mini interaction</div>
          <div className="mt-1 text-zinc-500 dark:text-zinc-400">
            ここは将来「フロントだけの状態管理」や「アニメーション実験」を足していく余地にします。
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className={getButtonClass("secondary")}
          >
            Back
          </Link>
          <button
            type="button"
            onClick={handleStartEdit}
            className={getButtonClass("success")}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={getButtonClass("danger")}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSaveEdit} className="mt-6 space-y-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
            <h2 className="text-sm font-semibold">Edit card</h2>
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

            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className={getButtonClass("secondary")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={getButtonClass("primary")}
              >
                Save
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
