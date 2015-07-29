export declare enum NumberFormatStyle {
    DECIMAL = 0,
    PERCENT = 1,
    CURRENCY = 2,
}
export declare class NumberFormatter {
    static format(number: number, locale: string, style: NumberFormatStyle, {minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, currency, currencyAsSymbol}?: {
        minimumIntegerDigits?: int;
        minimumFractionDigits?: int;
        maximumFractionDigits?: int;
        currency?: string;
        currencyAsSymbol?: boolean;
    }): string;
}
export declare class DateFormatter {
    static format(date: Date, locale: string, pattern: string): string;
}
