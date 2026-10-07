import { redirect } from "next/navigation";
import { ALPHABET_ORDER, letterSlug } from "@/data/alphabet";

type LetterPageProps = {
  params: Promise<{ letter: string }>;
};

export function generateStaticParams() {
  return ALPHABET_ORDER.map((char) => ({ letter: letterSlug(char) }));
}

export default async function LetterPage({ params }: LetterPageProps) {
  const { letter } = await params;
  redirect(`/alphabet?letter=${encodeURIComponent(letter)}`);
}
