const target = ['B', 'E', 'H', 'R', 'U', 'Z'];
const chars = document.querySelectorAll('.char');
const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*'.split('');

function getRandom() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function decodeChar(el, finalChar) {
    return new Promise(resolve => {
        el.style.opacity = '1';

        const totalDuration = 1100; // мс на одну букву
        const startInterval = 40;  // быстро в начале
        const endInterval = 180;   // медленно в конце

        let elapsed = 0;
        let lastTime = performance.now();

        function step(now) {
            const progress = Math.min(elapsed / totalDuration, 1);
            // замедление по квадратичной кривой
            const interval = startInterval + (endInterval - startInterval) * (progress * progress);
            const delta = now - lastTime;

            if (delta >= interval) {
                if (progress < 1) {
                    el.textContent = getRandom();
                    elapsed += delta;
                    lastTime = now;
                } else {
                    el.textContent = finalChar;
                    resolve();
                    return;
                }
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}

async function run() {
    for (let i = 0; i < target.length; i++) {
        await decodeChar(chars[i], target[i]);
    }
}

document.addEventListener('DOMContentLoaded', run);