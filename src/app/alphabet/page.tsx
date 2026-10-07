import { BackLink } from "@/components/chrome/BackLink";
import { PageIntro } from "@/components/chrome/PageIntro";
import { AlphabetWorkspace } from "@/components/alphabet/AlphabetWorkspace";

export const metadata = {
  title: "Базовый курс | Lexoverse",
  description:
    "Базовый уровень A0–B1: алфавит, пропись и первые уроки русского.",
};

type AlphabetPageProps = {
  searchParams: Promise<{ letter?: string | string[] }>;
};

export default async function AlphabetPage({ searchParams }: AlphabetPageProps) {
  const { letter } = await searchParams;
  const initialSlug = Array.isArray(letter) ? letter[0] : letter;

  return (
    <main className="px-2 pb-10 pt-2">
      <BackLink href="/">На главную</BackLink>
      <PageIntro title="Базовый курс" />
      <AlphabetWorkspace initialSlug={initialSlug} />
    </main>
  );
}
