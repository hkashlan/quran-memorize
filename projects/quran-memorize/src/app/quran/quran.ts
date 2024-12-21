export interface Recitation {
  audioUrl: string;
  notes: Note[];
}

export interface Note {
  pageNumber: number;
  lineNumber: number;
  word: number;
  timestamp: number;
  note: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean; };
}

export interface Surah {
  number: number;
  name: string;
  ayahs: Array<Ayah>;
}

export interface QuranWrapper {
  data: {
    surahs: Array<Surah>;
    edition: any;
  }
}
