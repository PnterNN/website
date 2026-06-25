/* ══════════════════════════════════════════════════════
   CINEMATICS — Film grain generator + Intro sequence
   ══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── FILM GRAIN GENERATOR ───
    function generateGrainTexture() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;

        const imageData = ctx.createImageData(256, 256);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255;
            data[i] = val;       // R
            data[i + 1] = val;   // G
            data[i + 2] = val;   // B
            data[i + 3] = 255;   // A
        }

        ctx.putImageData(imageData, 0, 0);

        const grainEl = document.querySelector('.film-grain');
        if (grainEl) {
            grainEl.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
            grainEl.style.backgroundRepeat = 'repeat';
        }
    }

    // ─── INTRO SEQUENCE ───
    function initIntro() {
        const overlay = document.getElementById('intro-overlay');
        if (!overlay) return;

        const skipBtn = overlay.querySelector('.intro-skip');
        const quote = overlay.querySelector('.intro-quote');
        let dismissed = false;

        // Prevent scroll during intro
        document.body.style.overflow = 'hidden';

        // After deblur animation completes (~3s), add glow class
        setTimeout(() => {
            if (quote && !dismissed) {
                quote.classList.add('glow');
            }
        }, 3000);

        function dismissIntro() {
            if (dismissed) return;
            dismissed = true;

            overlay.classList.add('fade-out');
            document.body.style.overflow = '';

            // Show side nav after overlay fades
            const sideNav = document.getElementById('sideNav');
            if (sideNav) {
                setTimeout(() => sideNav.classList.add('visible'), 800);
            }

            // Remove overlay from DOM after transition
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1500);
        }

        // Auto-dismiss after 5 seconds (giving animations time to play)
        setTimeout(dismissIntro, 5000);

        // Click skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dismissIntro();
            });
        }

        // Any key to skip
        document.addEventListener('keydown', function onKey() {
            dismissIntro();
            document.removeEventListener('keydown', onKey);
        });

        // Click anywhere to skip (after animations start)
        setTimeout(() => {
            overlay.addEventListener('click', dismissIntro, { once: true });
        }, 1500);
    }

    // ─── INITIALIZE ───
    document.addEventListener('DOMContentLoaded', () => {
        generateGrainTexture();
        initIntro();
    });
})();
