import {LocaleReferenceError} from "./errors/LocaleReferenceError";
import {TranslationReferenceError} from "./errors/TranslationReferenceError";
import {TranslationMap} from "./Translator";

export function validateLocaleIsDefined<Locale = string, Translations = {}>(locale: Locale, message: string = `Locale is not defined.`) {
    if (!locale) {
        throw new LocaleReferenceError(message);
    }
}

export function validateLocaleIsExists<Locale extends string = string, Translations = {}>(locale: Locale, locales: TranslationMap<Translations>, message: string = `Locale "${locale}" does not exist in the translations.`) {
    if (!locales || !locales[locale as string]) {
        throw new LocaleReferenceError(message);
    }
}

export function validateWordExistsInTranslations<Translations = {}>(word: keyof Translations, translations: Translations, message: string = `Word "${word}" does not exist in translations.`) {
    if (!translations || !translations[word]) {
        throw new TranslationReferenceError(message);
    }
}
