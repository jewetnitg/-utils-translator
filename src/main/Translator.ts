import {EventEmitter} from "events";
import {validateLocaleIsDefined, validateLocaleIsExists, validateWordExistsInTranslations} from "./validators";
import get = require("lodash.get");

export type LocaleChangeHandler = () => void;
export type UnsubscribeFromLocaleChanges = () => void;

export type Word<Translations = {}> = keyof Translations;

export interface TranslatorOptions<Locale extends string = string, Translations = {}> {
    defaultLocale?: Locale;
    locales?: {
        [name: string]: Translations;
    }
}

export interface Translator<Locale = string, Translations = {}> {
    setLocale(locale: Locale): void;

    getLocale(): Locale;

    getLocales(): Locale[];

    addLocale(locale: Locale, translations: Translations): void;

    translate<Data = {}>(word: Word<Translations>, data?: Data): string;

    onLocaleChange(changeHandler: LocaleChangeHandler): UnsubscribeFromLocaleChanges;
}

export type TranslationMap<Translations = {}> = { [name: string]: Translations };

export function Translator<Locale extends string = string, Translations extends { [name: string]: string } = { [name: string]: string }>(options: TranslatorOptions = {}): Translator<Locale, Translations> {
    const locales: TranslationMap<Translations> = {...(options.locales || {})} as TranslationMap<Translations>;
    const emitChange = () => eventEmitter.emit("change");
    const getTranslations = (): Translations => locales[currentLocale as string];
    const eventEmitter = new EventEmitter();
    let currentLocale: Locale;

    if (options.defaultLocale) {
        validateLocaleIsExists(options.defaultLocale, locales,
            `Can't set default locale "${options.defaultLocale}", locale is not defined.`);

        currentLocale = options.defaultLocale as Locale;
    }

    const render = (tpl: string, data: any) => {
        const regexp = /{{\s*([^{}]+)\s*}}/g;
        let rendered = tpl;
        let match: RegExpExecArray;

        regexp.lastIndex = 0;

        while (match = regexp.exec(tpl) as RegExpExecArray) {
            rendered = rendered.replace(match[0], get(data, match[1].trim()));
        }

        return rendered;
    }

    const translator: Translator<Locale, Translations> = {
        addLocale(locale: Locale, translations: Translations) {
            locales[locale] = translations;
            if (!currentLocale) translator.setLocale(locale);
        },
        getLocale() {
            return currentLocale;
        },
        getLocales() {
            return Object.keys(locales) as Locale[];
        },
        setLocale(locale: Locale) {
            validateLocaleIsExists(locale, locales,
                `Can't set locale "${locale}", locale is not defined.`);

            if (locale === currentLocale) return;

            currentLocale = locale;

            emitChange();
        },
        translate<Data = {}>(word: keyof Translations, data = {}) {
            word = render(word, data) as any;

            validateLocaleIsDefined(currentLocale,
                `Can't translate "${word}", no current locale.`);

            const translations = getTranslations();

            validateWordExistsInTranslations(word, translations,
                `Can't translate word "${word}" in locale "${currentLocale}", `
                + `word does not exist in translations.`);

            return render(translations[word as string], data);
        },
        onLocaleChange(changeHandler): UnsubscribeFromLocaleChanges {
            eventEmitter.addListener("change", changeHandler);

            return () => eventEmitter.removeListener("change", changeHandler);
        },
    };

    // add support for "translator instanceof Translator"
    Object.setPrototypeOf(translator, Translator.prototype);

    return translator;
}

export default Translator;