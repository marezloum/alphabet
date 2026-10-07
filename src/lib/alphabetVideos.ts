import {
  ALPHABET_DATA,
  ALPHABET_ORDER,
  letterHref,
  letterSlug,
  type AlphabetChar,
} from "@/data/alphabet";
import { readDb, updateDb, type AlphabetLetterRow } from "./db";
import { deleteUpload } from "./upload";

export type AlphabetLetterAdminRow = {
  slug: string;
  char: string;
  lower: string;
  wordRu: string;
  wordFa: string;
  fallbackVideo: string | null;
  video: string | null;
  source: "upload" | "code" | "none";
  lessonHref: string;
};

const VALID_SLUGS = new Set(ALPHABET_ORDER.map((char) => letterSlug(char)));

export function isAlphabetSlug(slug: string): boolean {
  return VALID_SLUGS.has(slug);
}

function codeVideo(char: AlphabetChar): string | null {
  const src = ALPHABET_DATA[char]?.video?.trim();
  return src || null;
}

function charForSlug(slug: string): AlphabetChar | undefined {
  return ALPHABET_ORDER.find((item) => letterSlug(item) === slug);
}

export function toAdminRow(
  char: AlphabetChar,
  stored: string | null | undefined,
): AlphabetLetterAdminRow {
  const slug = letterSlug(char);
  const override = stored?.trim() || null;
  const fallback = codeVideo(char);
  const video = override || fallback;
  return {
    slug,
    char,
    lower: char.toLowerCase(),
    wordRu: ALPHABET_DATA[char]?.word.ru ?? char,
    wordFa: ALPHABET_DATA[char]?.word.fa ?? "",
    fallbackVideo: fallback,
    video,
    source: override ? "upload" : fallback ? "code" : "none",
    lessonHref: letterHref(char),
  };
}

export function listAlphabetAdminRows(
  rows: AlphabetLetterRow[] | undefined,
): AlphabetLetterAdminRow[] {
  const bySlug = new Map((rows ?? []).map((row) => [row.slug, row.video]));
  return ALPHABET_ORDER.map((char) => toAdminRow(char, bySlug.get(letterSlug(char))));
}

export function getAlphabetAdminRow(
  rows: AlphabetLetterRow[] | undefined,
  slug: string,
): AlphabetLetterAdminRow | null {
  const char = charForSlug(slug);
  if (!char) return null;
  const stored = (rows ?? []).find((row) => row.slug === slug)?.video;
  return toAdminRow(char, stored);
}

export async function getAlphabetVideoMap(): Promise<Record<string, string>> {
  const db = await readDb();
  const map: Record<string, string> = {};
  for (const row of db.alphabetLetters ?? []) {
    const src = row.video?.trim();
    if (src) map[row.slug] = src;
  }
  return map;
}

function isManagedUpload(src: string | null | undefined): boolean {
  return Boolean(src?.startsWith("/uploads/alphabet/"));
}

export async function saveAlphabetVideo(
  slug: string,
  video: string,
): Promise<AlphabetLetterAdminRow | null> {
  if (!isAlphabetSlug(slug)) return null;
  const trimmed = video.trim();
  if (!trimmed) return null;

  return updateDb(async (db) => {
    const now = new Date().toISOString();
    const existing = (db.alphabetLetters ?? []).find((row) => row.slug === slug);
    if (existing) {
      if (isManagedUpload(existing.video) && existing.video !== trimmed) {
        await deleteUpload(existing.video);
      }
      existing.video = trimmed;
      existing.updated_at = now;
    } else {
      db.alphabetLetters.push({ slug, video: trimmed, updated_at: now });
    }
    return getAlphabetAdminRow(db.alphabetLetters, slug);
  });
}

export async function clearAlphabetVideo(
  slug: string,
): Promise<AlphabetLetterAdminRow | null> {
  if (!isAlphabetSlug(slug)) return null;

  return updateDb(async (db) => {
    const i = (db.alphabetLetters ?? []).findIndex((row) => row.slug === slug);
    if (i >= 0) {
      const prev = db.alphabetLetters[i];
      if (isManagedUpload(prev.video)) await deleteUpload(prev.video);
      db.alphabetLetters.splice(i, 1);
    }
    return getAlphabetAdminRow(db.alphabetLetters, slug);
  });
}
