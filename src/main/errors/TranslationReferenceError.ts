export interface TranslationReferenceError extends ReferenceError {
    name: "TranslationReferenceError";
}

export function TranslationReferenceError(message: string) {
    ReferenceError.call(this, message);
}

TranslationReferenceError.prototype = new ReferenceError();
TranslationReferenceError.prototype.name = "TranslationReferenceError";

TranslationReferenceError.prototype.constructor = TranslationReferenceError;