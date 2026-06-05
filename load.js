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

function animateChar(el, finalChar, settleTime, opts = {}) {
    el.classList.add('random');
    el.classList.remove('final');

    const startTime = performance.now();
    // choose faster timings for non-last letters, keep slow for last (opts provided)
    const isLast = opts && (opts.finalFadeOut || opts.finalFadeIn);
    const startInterval = isLast ? 20 : 8; // non-last starts faster
    const endInterval = isLast ? 140 : 60; // non-last settles quicker
    const randomReplaceOpts = isLast ? { fadeOut: 80, fadeIn: 160 } : { fadeOut: 30, fadeIn: 60 };
    let lastTime = startTime;

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / settleTime, 1);
        const interval = startInterval + (endInterval - startInterval) * Math.pow(progress, 2);
        const delta = now - lastTime;

        if (delta >= interval) {
            if (finalChar && progress >= 1) {
                // Use slower, smoother timings for final replacement if provided
                const finalOpts = {
                    fadeOut: (opts && opts.finalFadeOut) || 100,
                    fadeIn: (opts && opts.finalFadeIn) || 200
                };
                doReplace(el, finalChar, finalOpts).then(() => {
                    el.classList.remove('random');
                    el.classList.add('final');
                });
                return;
            }

            const glyph = getRandom();
            if (!el._replacing) doReplace(el, glyph, randomReplaceOpts);
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
            const isLast = (i === chars.length - 1);
            // faster initial replace for non-last; keep slower for last
            if (isLast) {
                doReplace(char, glyph, { fadeOut: 80, fadeIn: 160 });
            } else {
                doReplace(char, glyph, { fadeOut: 30, fadeIn: 60 });
            }
        }, i * 40 + 40);
    });

    // Step 2: after initial word displays, morph each char to the final target
    const initialDisplayTime = chars.length * 40 + 240; // wait until initial fills finish
    setTimeout(() => {
        chars.forEach((char, i) => {
            // determine if this is the last character
            const isLast = (i === chars.length - 1);
            const opts = isLast ? { finalFadeOut: 300, finalFadeIn: 600 } : undefined;

            // each char will now animate to its final target (BEHRUZ)
            animateChar(char, target[i], (i + 1) * settleInterval, opts);

            // Safety fallback: force final glyph after expected settle time plus margin
            const defaultMargin = 360;
            const lastExtra = isLast ? ((opts.finalFadeOut || 0) + (opts.finalFadeIn || 0) + 200) : 0;
            const fallback = initialDisplayTime + (i + 1) * settleInterval + defaultMargin + lastExtra;
            setTimeout(() => {
                // cancel any replacing flag and set to final explicitly
                char._replacing = false;
                char.textContent = target[i];
                char.classList.remove('random');
                char.classList.add('final');
            }, fallback);
        });
    }, initialDisplayTime);

    // schedule loader finish after the last fallback has run
    const defaultMargin = 360;
    const lastFinalFadeOut = 300;
    const lastFinalFadeIn = 600;
    const lastExtra = lastFinalFadeOut + lastFinalFadeIn + 200; // matches per-char calculation for last char
    const lastFallback = initialDisplayTime + (chars.length) * settleInterval + defaultMargin + lastExtra;

    function finishLoader() {
        const overlay = document.getElementById('loader-overlay');
        const site = document.getElementById('site-root');
        if (site) {
            site.classList.remove('site-blur');
            site.classList.add('site-clear');
        }
        if (overlay) {
            overlay.classList.add('hidden');
            // remove overlay from DOM after transition
            overlay.addEventListener('transitionend', function onEnd() {
                overlay.removeEventListener('transitionend', onEnd);
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            });
        }
    }
    setTimeout(finishLoader, lastFallback + 1300);
}

document.addEventListener('DOMContentLoaded', run);
