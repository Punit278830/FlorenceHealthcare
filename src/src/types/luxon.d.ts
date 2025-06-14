declare module 'luxon' {
    export class DateTime {
        static now(): DateTime;
        static fromISO(text: string): DateTime;
        static fromJSDate(date: Date): DateTime;
        static fromObject(obj: { year?: number; month?: number; day?: number; hour?: number; minute?: number; second?: number; millisecond?: number }): DateTime;
        
        toISO(): string;
        toJSDate(): Date;
        toFormat(format: string): string;
        plus(duration: Duration): DateTime;
        minus(duration: Duration): DateTime;
        startOf(unit: string): DateTime;
        endOf(unit: string): DateTime;
        isValid: boolean;
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        millisecond: number;
    }

    export class Duration {
        static fromObject(obj: { years?: number; months?: number; days?: number; hours?: number; minutes?: number; seconds?: number; milliseconds?: number }): Duration;
        static fromISO(text: string): Duration;
        toISO(): string;
        toObject(): { years: number; months: number; days: number; hours: number; minutes: number; seconds: number; milliseconds: number };
    }
} 