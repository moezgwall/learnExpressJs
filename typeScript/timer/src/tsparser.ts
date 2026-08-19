

// we can use this instead of 3 inputs 

export interface ParsedTime {
    hours: number;
    minutes: number;
    seconds: number;
}

export function parseTime(t: string): ParsedTime {
    // list of sperators ':' '.' ' '
    const tokens = t.replace(/[:.\s]/g, '');
    if (!/^\d+$/.test(tokens)) {
        throw new Error('invalid format ...');
    }
    const padding = tokens.padStart(6, '0');
    if (padding.length > 6) throw new Error('too long ...');
    const hours = Number(padding.slice(0, 2));
    const minutes = Number(padding.slice(2, 4));
    const seconds = Number(padding.slice(4, 6));
    if (seconds > 59 || minutes > 59) throw new Error("invalid format mm/ss");

    return { hours, minutes, seconds };
}


