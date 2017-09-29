export interface LocaleReferenceError extends ReferenceError {
    name: "LocaleReferenceError";
}

export function LocaleReferenceError(message: string) {
    ReferenceError.call(this, message);
}

LocaleReferenceError.prototype = new ReferenceError();
LocaleReferenceError.prototype.name = "LocaleReferenceError";

LocaleReferenceError.prototype.constructor = LocaleReferenceError;