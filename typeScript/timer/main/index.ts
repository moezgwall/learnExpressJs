
import { timeSpan } from '../src/index';

let timer: timeSpan | null = null;

document.getElementById('start-btn')?.addEventListener('click', () => {
    const HH = document.getElementById('hours') as HTMLInputElement;
    const MM = document.getElementById('mints') as HTMLInputElement;
    const SS = document.getElementById('secs') as HTMLInputElement;

    const vhh = Number(HH.value) || 0;
    const vmm = Number(MM.value) || 0;
    const vss = Number(SS.value) || 0;

    if (timer) {
        timer.stop();
    }
    timer = new timeSpan(vhh, vmm, vss, 'timer-display');

    timer.startTime();
});

document.getElementById('stop-btn')?.addEventListener('click', () => {
    timer?.stop();
});

