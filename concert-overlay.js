(function () {
    'use strict';

    function createConcertOverlayController({ trigger, overlay, closeButton, backdrop, body }) {
        let returnFocus = trigger;

        function open() {
            returnFocus = document.activeElement || trigger;
            overlay.hidden = false;
            overlay.setAttribute('aria-hidden', 'false');
            body.classList.add('concert-overlay-open');
            closeButton.focus();
        }

        function close() {
            if (overlay.hidden) return;
            overlay.hidden = true;
            overlay.setAttribute('aria-hidden', 'true');
            body.classList.remove('concert-overlay-open');
            returnFocus.focus();
        }

        trigger.addEventListener('click', open);
        closeButton.addEventListener('click', close);
        backdrop.addEventListener('click', close);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !overlay.hidden) close();
        });

        return { open, close };
    }

    window.createConcertOverlayController = createConcertOverlayController;

    const trigger = document.getElementById('concert-overlay-trigger');
    const overlay = document.getElementById('concert-overlay');
    const closeButton = document.getElementById('concert-overlay-close');
    const backdrop = document.querySelector('.concert-overlay__backdrop');

    if (trigger && overlay && closeButton && backdrop) {
        createConcertOverlayController({
            trigger,
            overlay,
            closeButton,
            backdrop,
            body: document.body,
        });
    }
}());
