const target = ['B', 'E', 'H', 'R', 'U', 'Z'];
const chars = document.querySelectorAll('.char');
// include uppercase to make random glyphs visually consistent
const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

function getRandom() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// doReplace supports custom fade timings; longer for smoother, deliberate feel
async function doReplace(el, glyph, opts = {}) {
    if (el._replacing) return;
    el._replacing = true;

    const fadeOut = typeof opts.fadeOut === 'number' ? opts.fadeOut : 100;
    const fadeIn = typeof opts.fadeIn === 'number' ? opts.fadeIn : 200;

    el.classList.add('fade-out');
    await sleep(fadeOut);

    el.textContent = glyph;

    el.classList.remove('fade-out');
    el.classList.add('fade-in');
    await sleep(fadeIn);
    el.classList.remove('fade-in');

    el._replacing = false;
}

function animateChar(el, finalChar, settleTime) {
    el.classList.add('random');
    el.classList.remove('final');

    const startTime = performance.now();
    const startInterval = 20; // slightly slower randomization start
    const endInterval = 140;  // slower settling for longer duration
    let lastTime = startTime;

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / settleTime, 1);
        const interval = startInterval + (endInterval - startInterval) * Math.pow(progress, 2);
        const delta = now - lastTime;

        if (delta >= interval) {
            if (finalChar && progress >= 1) {
                // final settle with a smooth replace and unblur
                doReplace(el, finalChar).then(() => {
                    el.classList.remove('random');
                    el.classList.add('final');
                });
                return;
            }

            const glyph = getRandom();
            if (!el._replacing) doReplace(el, glyph, { fadeOut: 80, fadeIn: 160 });
            lastTime = now;
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function run() {
    const settleInterval = 420; // longer overall settling to increase animation duration

    // start with a collective blur
    chars.forEach(char => char.classList.add('blurred'));

    // Step 1: initial random word (per-letter stagger, moderate fades)
    chars.forEach((char, i) => {
        setTimeout(() => {
            char.classList.remove('blurred');
            const glyph = getRandom();
            // moderate replace for initial word
            doReplace(char, glyph, { fadeOut: 80, fadeIn: 160 });
        }, i * 40 + 40);
    });

    // Step 2: after initial word displays, morph each char to the final target
    const initialDisplayTime = chars.length * 40 + 240; // wait until initial fills finish
    setTimeout(() => {
        chars.forEach((char, i) => {
            // each char will now animate to its final target (BEHRUZ)
            animateChar(char, target[i], (i + 1) * settleInterval);

            // Safety fallback: force final glyph after expected settle time plus larger margin
            const fallback = initialDisplayTime + (i + 1) * settleInterval + 360;
            setTimeout(() => {
                // cancel any replacing flag and set to final explicitly
                char._replacing = false;
                char.textContent = target[i];
                char.classList.remove('random');
                char.classList.add('final');
            }, fallback);
        });
    }, initialDisplayTime);
}

document.addEventListener('DOMContentLoaded', run);
