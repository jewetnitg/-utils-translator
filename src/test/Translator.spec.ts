import {LocaleReferenceError} from "../main/errors/LocaleReferenceError";
import {TranslationReferenceError} from "../main/errors/TranslationReferenceError";
import {Translator} from "../main/Translator";
import createSpy = jasmine.createSpy;

describe("const translator: Translator = Translator<Locale, Translations>({defaultLocale, locales});", () => {
    const locale = "LOCALE";
    const translations = {translation: "Hello, {{       \nname   }}!"};

    it("should be an instance of translator", done => {
        const translator: Translator = Translator();
        expect(translator).toBeInstanceOf(Translator);
        done();
    });

    it("should be able to be constructed with or without the new keyword", done => {
        const withoutNewKeyword = Translator();
        // checking just one method is enough, it either returned a translator or it didn't,
        // it won't have returned half of it
        expect(withoutNewKeyword.getLocale).toBeDefined();

        const usingNewKeyword = new (Translator as any)();
        expect(usingNewKeyword.getLocale).toBeDefined();

        done();
    });

    it("should add the provided locales", done => {
        const translator: Translator = Translator({locales: {[locale]: {}}});
        expect(translator.getLocales()).toContain(locale);
        done();
    });

    it("should set the locale to the provided defaultLocale", done => {
        const translator: Translator = Translator({defaultLocale: locale, locales: {[locale]: {}}});
        expect(translator.getLocale()).toBe(locale);
        done();
    });

    it("should throw an error if constructed with a defaultLocale that is not provided in the locales", done => {
        const constructWithUndefinedDefaultLocale
            = () => Translator({defaultLocale: locale, locales: {}});
        const constructWithoutLocales
            = () => Translator({defaultLocale: locale, locales: {}});

        expect(constructWithoutLocales).toThrow(LocaleReferenceError as any);
        expect(constructWithUndefinedDefaultLocale).toThrow(LocaleReferenceError as any);

        done();
    });

    describe("translator.addLocale(locale: Locale, translations: Translations)", () => {

        it("should add the locale", done => {
            const translator: Translator = Translator();

            translator.addLocale(locale, translations);

            expect(translator.getLocales()).toContain(locale);

            done();
        });

        it("should set the locale as the current locale if no current locale is set", done => {
            const translator: Translator = Translator();

            translator.addLocale(locale, translations);

            expect(translator.getLocale()).toBe(locale);

            done();
        });

    });

    describe("translator.getLocale(): Locale", () => {

        it("should return the current locale", done => {
            const translator: Translator = Translator({defaultLocale: locale, locales: {[locale]: {}}});

            expect(translator.getLocale()).toBe(locale);

            done();
        });

    });

    describe("translator.setLocale(): Locale", () => {

        it("should throw a LocaleReferenceError if trying to set a locale that is not defined", done => {
            const translator: Translator = Translator({locales: {[`${Date.now() - 1000}`]: {}}});

            const setLocaleThatIsNotDefined
                = () => translator.setLocale(`${Date.now()}`);

            expect(setLocaleThatIsNotDefined).toThrow(LocaleReferenceError as any);

            done();
        });

        it("should set the locale", done => {
            const translator: Translator = Translator({locales: {[locale]: {}}});

            translator.setLocale(locale);

            expect(translator.getLocale()).toBe(locale);

            done();
        });

    });

    describe("translator.onLocaleChange(changeHandler: () => void): UnsubscribeFromLocaleChanges", () => {

        it("should fire the provided changeListener whenever the locale changes", done => {
            const locale2 = "locale2";
            const translator: Translator = Translator({defaultLocale: locale, locales: {[locale]: {}, [locale2]: {}}});
            const changeListener = createSpy("changeListener");

            translator.onLocaleChange(changeListener);
            translator.setLocale(locale);

            expect(changeListener).not.toHaveBeenCalled();

            translator.setLocale(locale2);

            expect(changeListener).toHaveBeenCalled();

            done();
        });

        it("should return an UnsubscribeFromLocaleChanges function to remove the event listener", done => {
            const locale2 = "locale2";
            const translator: Translator = Translator({defaultLocale: locale, locales: {[locale]: {}, [locale2]: {}}});
            const changeListener = createSpy("changeListener");

            const stopListening = translator.onLocaleChange(changeListener);

            stopListening();

            translator.setLocale(locale2);

            expect(changeListener).not.toHaveBeenCalled();

            done();
        });

    });

    describe("translator.translate<Data = {}>(word: keyof Translations, data: Data): string", () => {

        it("should throw a LocaleReferenceError if no locale is set", done => {
            const translator: Translator<any, any> = Translator({});
            const translate = () => translator.translate("");
            expect(translate).toThrow(LocaleReferenceError as any);
            done();
        });

        it("should throw a TranslationReferenceError if the provided word does not exist in the translations", done => {
            const translator: Translator<any, any> = Translator({
                defaultLocale: locale,
                locales: {
                    [locale]: {},
                },
            });
            const translate = () => translator.translate("word-b");

            expect(translate).toThrow(TranslationReferenceError as any);

            done();
        });

        it("should return the translated value", done => {
            const translation = "translation";
            const word = "word";
            const translator: Translator<any, any> = Translator({
                defaultLocale: locale,
                locales: {
                    [locale]: {
                        [word]: translation,
                    },
                },
            });

            expect(translator.translate(word)).toBe(translation);

            done();
        });

        it("should replace template variables in the translation with values from the provided data", done => {
            const translation = "translation {{test}} {{  test   }}";
            const data = {test: ":)"};
            const expectedTranslation = `translation ${data.test} ${data.test}`;
            const word = "word";
            const translator: Translator<any, any> = Translator({
                defaultLocale: locale,
                locales: {
                    [locale]: {
                        [word]: translation,
                    },
                },
            });

            expect(translator.translate(word, data)).toBe(expectedTranslation);

            done();
        });

        it("should replace template variables in the provided word with the values from the provided data", done => {
            const translation = "translation";
            const word = "word";
            const data = {test: word};
            const translator: Translator<any, any> = Translator({
                defaultLocale: locale,
                locales: {
                    [locale]: {
                        [word]: translation,
                    },
                },
            });

            expect(translator.translate(`{{test}}`, data)).toBe(translation);

            done();
        });

        it("should support deep template values", done => {
            const translation = "translation {{test.test}}";
            const data = {test: {test: ":)"}};
            const expectedTranslation = `translation ${data.test.test}`;
            const word = "word";
            const translator: Translator<any, any> = Translator({
                defaultLocale: locale,
                locales: {
                    [locale]: {
                        [word]: translation,
                    },
                },
            });

            expect(translator.translate(word, data)).toBe(expectedTranslation);

            done();
        });

    });

});
