
import { timeSpan } from '../src/index';

const timer = new timeSpan(0, 0, 30, 'timer-display');

document.getElementById('start-btn')?.addEventListener('click', () => {
    timer.startTime();
});

document.getElementById('stop-btn')?.addEventListener('click', () => {
    timer.stop();
});

