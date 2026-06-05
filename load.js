const target = ['B', 'E', 'H', 'R', 'U', 'Z'];
const chars = document.querySelectorAll('.char');
const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*'.split('');

function getRandom() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function decodeChar(el, finalChar, settleTime) {
    el.style.color = 'var(--text-tertiary)';

    const startTime = performance.now();
    const startInterval = 30;
    const endInterval = 150;

    let lastTime = startTime;

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / settleTime, 1);
        const interval = startInterval + (endInterval - startInterval) * (progress * progress);
        const delta = now - lastTime;

        if (delta >= interval) {
            if (progress < 1) {
                el.textContent = getRandom();
                lastTime = now;
            } else {
                el.textContent = finalChar;
                el.style.color = '';
                return;
            }
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function run() {
    chars.forEach((char, i) => {
        decodeChar(char, target[i], (i + 1) * 600);
    });
}

document.addEventListener('DOMContentLoaded', run);
