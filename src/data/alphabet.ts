export type AlphabetWord = {
  ru: string;
  fa: string;
};

export type StrokeRole = "letter" | "link" | "next" | "default";

export type StrokePath =
  | string
  | {
      d: string;
      role?: StrokeRole;
    };

export type LetterConnection = {
  fa: string;
  strokes: StrokePath[];
};

export type AlphabetLetter = {
  char: string;
  slug: string;
  word: AlphabetWord;
  video?: string;
  connectVideo?: string;
  wordsVideo?: string;
  upper?: string[];
  lower?: string[];
  upperHints?: string[];
  lowerHints?: string[];
  connections?: Record<string, LetterConnection>;
  practiceWords?: AlphabetWord[];
};

export const VOWEL_LETTERS = [
  "А",
  "Е",
  "Ё",
  "И",
  "О",
  "У",
  "Ы",
  "Э",
  "Ю",
  "Я",
] as const;

export const CONNECTION_VOWELS = ["а", "о", "у", "э", "ы", "и", "я"] as const;

export const ALPHABET_ORDER = [
  "А",
  "Б",
  "В",
  "Г",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ы",
  "Ь",
  "Э",
  "Ю",
  "Я",
] as const;

export type AlphabetChar = (typeof ALPHABET_ORDER)[number];

const LETTER_SLUGS: Record<AlphabetChar, string> = {
  А: "a",
  Б: "b",
  В: "v",
  Г: "g",
  Д: "d",
  Е: "e",
  Ё: "yo",
  Ж: "zh",
  З: "z",
  И: "i",
  Й: "j",
  К: "k",
  Л: "l",
  М: "m",
  Н: "n",
  О: "o",
  П: "p",
  Р: "r",
  С: "s",
  Т: "t",
  У: "u",
  Ф: "f",
  Х: "kh",
  Ц: "ts",
  Ч: "ch",
  Ш: "sh",
  Щ: "shch",
  Ъ: "hard",
  Ы: "y",
  Ь: "soft",
  Э: "eh",
  Ю: "yu",
  Я: "ya",
};

export const ALPHABET_DATA: Partial<Record<AlphabetChar, AlphabetLetter>> = {
  А: {
    char: "А",
    slug: "a",
    word: { ru: "арбуз", fa: "هندوانه" },
    upper: [
      "M 14 72 Q 12 67 14 60 Q 18 38 26 18",
      "M 26 18 Q 30 46 36 72",
      "M 20 54 Q 24 47 30 49 Q 34 51 30 53 Q 24 55 20 54",
    ],
    lower: [
      "M 56 50 Q 44 36 34 40 Q 26 48 30 58 Q 38 68 52 62 Q 58 54 56 50",
      "M 56 50 Q 58 58 56 72 Q 54 76 60 74",
    ],
    practiceWords: [
      { ru: "арбуз", fa: "هندوانه" },
      { ru: "мама", fa: "مامان" },
      { ru: "сад", fa: "باغ" },
    ],
  },
  Б: {
    char: "Б",
    slug: "b",
    word: { ru: "банан", fa: "موز" },
    practiceWords: [
      { ru: "банан", fa: "موز" },
      { ru: "брат", fa: "برادر" },
      { ru: "хлеб", fa: "نان" },
    ],
  },
  В: {
    char: "В",
    slug: "v",
    word: { ru: "вода", fa: "آب" },
    practiceWords: [
      { ru: "вода", fa: "آب" },
      { ru: "волк", fa: "گرگ" },
      { ru: "вот", fa: "این است" },
    ],
  },
  Г: {
    char: "Г",
    slug: "g",
    word: { ru: "город", fa: "شهر" },
    practiceWords: [
      { ru: "город", fa: "شهر" },
      { ru: "гриб", fa: "قارچ" },
      { ru: "нога", fa: "پا" },
    ],
  },
  Д: {
    char: "Д",
    slug: "d",
    word: { ru: "дом", fa: "خانه" },
    practiceWords: [
      { ru: "дом", fa: "خانه" },
      { ru: "дядя", fa: "عمو" },
      { ru: "сад", fa: "باغ" },
    ],
  },
  Е: {
    char: "Е",
    slug: "e",
    word: { ru: "еда", fa: "غذا" },
    practiceWords: [
      { ru: "еда", fa: "غذا" },
      { ru: "ель", fa: "کاج" },
      { ru: "лето", fa: "تابستان" },
    ],
  },
  Ё: {
    char: "Ё",
    slug: "yo",
    word: { ru: "ёлка", fa: "درخت کاج" },
    practiceWords: [
      { ru: "ёлка", fa: "درخت کاج" },
      { ru: "ёж", fa: "جوجه‌تیغی" },
      { ru: "мёд", fa: "عسل" },
    ],
  },
  Ж: {
    char: "Ж",
    slug: "zh",
    word: { ru: "жук", fa: "سوسک" },
    practiceWords: [
      { ru: "жук", fa: "سوسک" },
      { ru: "нож", fa: "چاقو" },
      { ru: "лужа", fa: "چاله آب" },
    ],
  },
  З: {
    char: "З",
    slug: "z",
    word: { ru: "зима", fa: "زمستان" },
    practiceWords: [
      { ru: "зима", fa: "زمستان" },
      { ru: "зуб", fa: "دندان" },
      { ru: "ваза", fa: "گلدان" },
    ],
  },
  И: {
    char: "И",
    slug: "i",
    word: { ru: "игра", fa: "بازی" },
    practiceWords: [
      { ru: "игра", fa: "بازی" },
      { ru: "имя", fa: "اسم" },
      { ru: "игла", fa: "سوزن" },
    ],
  },
  Й: {
    char: "Й",
    slug: "j",
    word: { ru: "йогурт", fa: "ماست" },
    practiceWords: [
      { ru: "йогурт", fa: "ماست" },
      { ru: "йод", fa: "ید" },
      { ru: "май", fa: "مه" },
    ],
  },
  К: {
    char: "К",
    slug: "k",
    word: { ru: "кот", fa: "گربه" },
    upper: [
      "M 26 72 Q 26 45 26 18",
      "M 26 48 Q 54 18 76 22",
      "M 26 52 Q 54 78 76 72",
    ],
    lower: [
      "M 24 72 Q 24 50 24 32",
      "M 24 48 Q 46 30 66 32",
      "M 24 52 Q 46 68 66 72",
    ],
    practiceWords: [
      { ru: "кот", fa: "گربه" },
      { ru: "окно", fa: "پنجره" },
      { ru: "сок", fa: "آبمیوه" },
    ],
  },
  Л: {
    char: "Л",
    slug: "l",
    word: { ru: "луна", fa: "ماه" },
    practiceWords: [
      { ru: "луна", fa: "ماه" },
      { ru: "лампа", fa: "چراغ" },
      { ru: "лес", fa: "جنگل" },
    ],
  },
  М: {
    char: "М",
    slug: "m",
    word: { ru: "мама", fa: "مامان" },
    practiceWords: [
      { ru: "мама", fa: "مامان" },
      { ru: "дом", fa: "خانه" },
      { ru: "мост", fa: "پل" },
    ],
    upper: [
      "M 12 72 Q 14 45 14 18",
      "M 14 18 Q 32 20 46 72",
      "M 46 72 Q 48 45 50 18",
      "M 50 18 Q 68 45 76 72",
      "M 76 72 Q 82 72 88 58 Q 92 48 94 45",
    ],
    upperHints: [
      "Начало: перо на нижней линии (слева)",
      "Первая палка: наклон вверх к верхней линии",
      "Сверху дуга вниз — середина буквы",
      "Вторая палка: снизу снова к верхней линии",
      "Спуск + хвост: дуга на нижней линии вверх-вправо",
    ],
    lower: [
      "M 10 72 Q 10 48 12 40 Q 7 33 13 37",
      "M 13 37 L 13 72",
      "M 13 72 Q 22 72 30 48 Q 38 72 46 72",
      "M 46 72 Q 54 48 62 72",
      "M 62 72 Q 70 58 78 48",
    ],
    lowerHints: [
      "Начало на нижней линии",
      "Вверх с наклоном + маленькая петля",
      "Вниз до нижней линии",
      "Правая дуга + второй изгиб",
      "Вниз + хвост соединения",
    ],
    connections: {
      Ма: {
        fa: "Хвост М соединяется с петлёй а на верхней линии",
        strokes: [
          { d: "M 12 72 Q 14 45 14 18", role: "letter" },
          { d: "M 14 18 Q 32 20 46 72", role: "letter" },
          { d: "M 46 72 Q 48 45 50 18", role: "letter" },
          { d: "M 50 18 Q 68 45 76 72", role: "letter" },
          { d: "M 76 72 Q 84 72 90 48 Q 92 28 58 18", role: "link" },
          {
            d: "M 58 18 Q 44 16 36 32 Q 28 48 36 62 Q 44 72 54 72 Q 62 60 58 50 Q 54 42 66 44",
            role: "next",
          },
        ],
      },
      Мо: {
        fa: "Хвост М — левая часть о; о пишется одной линией",
        strokes: [
          { d: "M 12 72 Q 14 45 14 18", role: "letter" },
          { d: "M 14 18 Q 32 20 46 72", role: "letter" },
          { d: "M 46 72 Q 48 45 50 18", role: "letter" },
          { d: "M 50 18 Q 68 45 76 72", role: "letter" },
          { d: "M 76 72 Q 84 72 90 48 Q 92 28 58 18", role: "link" },
          {
            d: "M 58 18 C 42 18 36 45 36 45 C 36 72 58 72 58 72 C 80 72 80 45 80 45 C 80 18 58 18 58 18",
            role: "next",
          },
        ],
      },
      Му: {
        fa: "Начало у как у а — только хвост внизу другой",
        strokes: [
          { d: "M 12 72 Q 14 45 14 18", role: "letter" },
          { d: "M 14 18 Q 32 20 46 72", role: "letter" },
          { d: "M 46 72 Q 48 45 50 18", role: "letter" },
          { d: "M 50 18 Q 68 45 76 72", role: "letter" },
          { d: "M 76 72 Q 84 72 90 48 Q 92 28 58 18", role: "link" },
          {
            d: "M 58 18 Q 44 16 36 32 Q 28 50 36 65 Q 44 72 52 72 Q 58 62 56 55 Q 52 48 46 58 Q 40 68 34 64",
            role: "next",
          },
        ],
      },
      Мя: {
        fa: "я похожа на а — петля шире и ниже",
        strokes: [
          { d: "M 12 72 Q 14 45 14 18", role: "letter" },
          { d: "M 14 18 Q 32 20 46 72", role: "letter" },
          { d: "M 46 72 Q 48 45 50 18", role: "letter" },
          { d: "M 50 18 Q 68 45 76 72", role: "letter" },
          { d: "M 76 72 Q 84 72 90 48 Q 92 28 58 18", role: "link" },
          {
            d: "M 58 18 Q 38 14 28 36 Q 20 58 32 72 Q 44 72 52 72 Q 58 60 56 50 Q 54 40 66 42",
            role: "next",
          },
        ],
      },
    },
  },
  Н: {
    char: "Н",
    slug: "n",
    word: { ru: "нос", fa: "بینی" },
    practiceWords: [
      { ru: "нос", fa: "بینی" },
      { ru: "ночь", fa: "شب" },
      { ru: "небо", fa: "آسمان" },
    ],
  },
  О: {
    char: "О",
    slug: "o",
    word: { ru: "окно", fa: "پنجره" },
    upper: [
      "M 50 18 C 76 18 80 50 80 50 C 80 72 50 72 50 72 C 20 72 20 50 20 50 C 20 18 50 18 50 18",
    ],
    lower: [
      "M 50 38 C 64 38 68 55 68 55 C 68 72 50 72 50 72 C 32 72 32 55 32 55 C 32 38 50 38 50 38",
    ],
    practiceWords: [
      { ru: "окно", fa: "پنجره" },
      { ru: "дом", fa: "خانه" },
      { ru: "сок", fa: "آبمیوه" },
    ],
  },
  П: {
    char: "П",
    slug: "p",
    word: { ru: "папа", fa: "بابا" },
    practiceWords: [
      { ru: "папа", fa: "بابا" },
      { ru: "парк", fa: "پارک" },
      { ru: "суп", fa: "سوپ" },
    ],
  },
  Р: {
    char: "Р",
    slug: "r",
    word: { ru: "рука", fa: "دست" },
    practiceWords: [
      { ru: "рука", fa: "دست" },
      { ru: "рыба", fa: "ماهی" },
      { ru: "рот", fa: "دهان" },
    ],
  },
  С: {
    char: "С",
    slug: "s",
    word: { ru: "сад", fa: "باغ" },
    practiceWords: [
      { ru: "сад", fa: "باغ" },
      { ru: "суп", fa: "سوپ" },
      { ru: "сыр", fa: "پنیر" },
    ],
  },
  Т: {
    char: "Т",
    slug: "t",
    word: { ru: "там", fa: "آنجا" },
    practiceWords: [
      { ru: "там", fa: "آنجا" },
      { ru: "стол", fa: "میز" },
      { ru: "кот", fa: "گربه" },
    ],
  },
  У: {
    char: "У",
    slug: "u",
    word: { ru: "утро", fa: "صبح" },
    practiceWords: [
      { ru: "утро", fa: "صبح" },
      { ru: "ухо", fa: "گوش" },
      { ru: "утка", fa: "اردک" },
    ],
  },
  Ф: {
    char: "Ф",
    slug: "f",
    word: { ru: "флаг", fa: "پرچم" },
    practiceWords: [
      { ru: "флаг", fa: "پرچم" },
      { ru: "фото", fa: "عکس" },
      { ru: "кофе", fa: "قهوه" },
    ],
  },
  Х: {
    char: "Х",
    slug: "kh",
    word: { ru: "хлеб", fa: "نان" },
    practiceWords: [
      { ru: "хлеб", fa: "نان" },
      { ru: "хвост", fa: "دم" },
      { ru: "холод", fa: "سرما" },
    ],
  },
  Ц: {
    char: "Ц",
    slug: "ts",
    word: { ru: "цвет", fa: "رنگ" },
    practiceWords: [
      { ru: "цвет", fa: "رنگ" },
      { ru: "цирк", fa: "سیرک" },
      { ru: "цена", fa: "قیمت" },
    ],
  },
  Ч: {
    char: "Ч",
    slug: "ch",
    word: { ru: "чай", fa: "چای" },
    practiceWords: [
      { ru: "чай", fa: "چای" },
      { ru: "часы", fa: "ساعت" },
      { ru: "чашка", fa: "فنجان" },
    ],
  },
  Ш: {
    char: "Ш",
    slug: "sh",
    word: { ru: "школа", fa: "مدرسه" },
    practiceWords: [
      { ru: "школа", fa: "مدرسه" },
      { ru: "шар", fa: "توپ" },
      { ru: "шкаф", fa: "کمد" },
    ],
  },
  Щ: {
    char: "Щ",
    slug: "shch",
    word: { ru: "щенок", fa: "توله‌سگ" },
    practiceWords: [
      { ru: "щенок", fa: "توله‌سگ" },
      { ru: "щётка", fa: "برس" },
      { ru: "щит", fa: "سپر" },
    ],
  },
  Ъ: {
    char: "Ъ",
    slug: "hard",
    word: { ru: "объект", fa: "شیء" },
    practiceWords: [
      { ru: "объект", fa: "شیء" },
      { ru: "съезд", fa: "کنگره" },
      { ru: "объём", fa: "حجم" },
    ],
  },
  Ы: {
    char: "Ы",
    slug: "y",
    word: { ru: "сыр", fa: "پنیر" },
    practiceWords: [
      { ru: "сыр", fa: "پنیر" },
      { ru: "мыло", fa: "صابون" },
      { ru: "рыба", fa: "ماهی" },
    ],
  },
  Ь: {
    char: "Ь",
    slug: "soft",
    word: { ru: "день", fa: "روز" },
    practiceWords: [
      { ru: "день", fa: "روز" },
      { ru: "конь", fa: "اسب" },
      { ru: "соль", fa: "نمک" },
    ],
  },
  Э: {
    char: "Э",
    slug: "eh",
    word: { ru: "это", fa: "این" },
    practiceWords: [
      { ru: "это", fa: "این" },
      { ru: "эхо", fa: "پژواک" },
      { ru: "этаж", fa: "طبقه" },
    ],
  },
  Ю: {
    char: "Ю",
    slug: "yu",
    word: { ru: "юла", fa: "فرفره" },
    practiceWords: [
      { ru: "юла", fa: "فرفره" },
      { ru: "юбка", fa: "دامن" },
      { ru: "юг", fa: "جنوب" },
    ],
  },
  Я: {
    char: "Я",
    slug: "ya",
    word: { ru: "яблоко", fa: "سیب" },
    practiceWords: [
      { ru: "яблоко", fa: "سیب" },
      { ru: "язык", fa: "زبان" },
      { ru: "яйцо", fa: "تخم‌مرغ" },
    ],
  },
};

export function letterSlug(char: AlphabetChar): string {
  return LETTER_SLUGS[char];
}

export function getLetterBySlug(slug: string): AlphabetLetter | undefined {
  const char = ALPHABET_ORDER.find((item) => LETTER_SLUGS[item] === slug);
  if (!char) return undefined;
  return (
    ALPHABET_DATA[char] ?? {
      char,
      slug,
      word: { ru: char, fa: "" },
    }
  );
}

export function isLetterReady(letter: AlphabetLetter | undefined): boolean {
  if (!letter) return false;
  return Boolean(
    letter.upper?.length ||
      letter.lower?.length ||
      letter.practiceWords?.length ||
      letter.video,
  );
}

export function isVowel(char: string): boolean {
  return (VOWEL_LETTERS as readonly string[]).includes(char);
}

export function hasConnectStep(char: string): boolean {
  return !isVowel(char) && char !== "Ъ" && char !== "Ь";
}

export function getPracticeWords(letter: AlphabetLetter): AlphabetWord[] {
  if (letter.practiceWords && letter.practiceWords.length > 0) {
    return letter.practiceWords.slice(0, 3);
  }
  return [letter.word];
}

export function pathData(item: StrokePath): string {
  return typeof item === "string" ? item : item.d;
}

export function pathRole(item: StrokePath): StrokeRole {
  return typeof item === "string" ? "default" : (item.role ?? "default");
}

export function letterHref(char: AlphabetChar): string {
  return `/alphabet?letter=${LETTER_SLUGS[char]}`;
}
