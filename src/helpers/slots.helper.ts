function formatMinutes(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function parseTime(time: string): number {
    const [h = 0, m = 0] = time.split(':').map(Number);
    return h * 60 + m;
}

export function generateSlots(timeStart: string, timeEnd: string, slotDuration: number): string[] {
    const slots: string[] = [];
    let current = parseTime(timeStart);
    const end = parseTime(timeEnd);

    while (current < end) {
        slots.push(formatMinutes(current));
        current += slotDuration;
    }

    return slots;
}
