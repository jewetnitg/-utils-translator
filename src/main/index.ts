export interface Translator<Locale = string, Translations = {}> {
    setLocale(locale: string): void;
    addLocale(locale: string, translations: Translations): void;
    translate<Data = {}>(word: keyof Translations, data: Data): string;

}