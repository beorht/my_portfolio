const target = ['B', 'E', 'H', 'R', 'U', 'Z'];
const chars = document.querySelectorAll('.char');
const symbols = 'abcdefghijklmnopqrstuvwxyz'.split('');

function getRandom() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function animateChar(el, finalChar, settleTime) {
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
            if (finalChar && progress >= 1) {
                el.textContent = finalChar;
                el.style.color = '';
                return;
            }
            el.textContent = getRandom();
            lastTime = now;
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function run() {
    const settleInterval = 600;
    chars.forEach((char, i) => {
        animateChar(char, target[i], (i + 1) * settleInterval);
    });
}

document.addEventListener('DOMContentLoaded', run);
