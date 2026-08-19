
import { timeSpan } from '../src/index';
import { parseTime } from '../src/tsparser';

let timer: timeSpan | null = null;

document.getElementById('start-btn')?.addEventListener('click', () => {
    // const HH = document.getElementById('hours') as HTMLInputElement;
    // const MM = document.getElementById('mints') as HTMLInputElement;
    // const SS = document.getElementById('secs') as HTMLInputElement;
    const inputTime = document.getElementById('input-time') as HTMLInputElement;
    // const vhh = Number(HH.value) || 0;
    // const vmm = Number(MM.value) || 0;
    // const vss = Number(SS.value) || 0;

    try {
        const { hours, minutes, seconds } = parseTime(inputTime.value);

        if (timer) {
            timer.stop();
        }

        timer = new timeSpan(hours, minutes, seconds, 'timer-display');
        timer.startTime();

    } catch (err) {
        alert((err as Error).message);
    }




});

document.getElementById('stop-btn')?.addEventListener('click', () => {
    timer?.stop();
});

