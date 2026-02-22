export type PromptSubmission = {
  promptText: string;
  answerText: string;
  submittedAt: number;
};

export const PROMPT_SUBMISSIONS_STORAGE_KEY = "trailboard.prompt_submissions.v1";

function isPromptSubmission(value: unknown): value is PromptSubmission {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PromptSubmission>;

  return (
    typeof candidate.promptText === "string" &&
    typeof candidate.answerText === "string" &&
    typeof candidate.submittedAt === "number" &&
    Number.isFinite(candidate.submittedAt)
  );
}

export function loadPromptSubmissions(): PromptSubmission[] {
  const raw = localStorage.getItem(PROMPT_SUBMISSIONS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    if (!parsed.every(isPromptSubmission)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function savePromptSubmissions(submissions: PromptSubmission[]) {
  localStorage.setItem(
    PROMPT_SUBMISSIONS_STORAGE_KEY,
    JSON.stringify(submissions)
  );
}
