(() => {
    'use strict';

    const EXT_NAME = 'ST Mobile Keyboard Fix';

    if (window.__stMobileKeyboardFixLoaded) {
        return;
    }

    window.__stMobileKeyboardFixLoaded = true;

    console.log(`[${EXT_NAME}] loaded`);

    const root = document.documentElement;
    const body = document.body;

    const editableSelector = [
        'textarea',
        'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"])',
        '[contenteditable="true"]',
        '[contenteditable="plaintext-only"]'
    ].join(',');

    let activeInput = null;
    let activePanel = null;

    function isEditable(el) {
        return el && el.matches && el.matches(editableSelector);
    }

    function getViewportHeight() {
        if (window.visualViewport) {
            return window.visualViewport.height;
        }
        return window.innerHeight;
    }

    function updateViewportVars() {
        const height = Math.round(getViewportHeight());
        const offsetTop = Math.round(window.visualViewport?.offsetTop || 0);

        root.style.setProperty('--st-mkf-vh', `${height}px`);
        root.style.setProperty('--st-mkf-offset-top', `${offsetTop}px`);

        if (activeInput) {
            body.classList.add('st-mkf-keyboard-open');
        } else {
            body.classList.remove('st-mkf-keyboard-open');
        }
    }

    function findPanel(el) {
        if (!el || !el.closest) {
            return null;
        }
        return el.closest([
            '#dialogue_popup',
            '.popup',
            '.popup-content',
            '.modal',
            '.modal-content',
            '.ui-dialog',
            '.ui-dialog-content',
            '[role="dialog"]',
            '.drawer-content',
            '.inline-drawer-content',
            'form'
        ].join(','));
    }

    function setActivePanel(el) {
        if (activePanel) {
            activePanel.classList.remove('st-mkf-active-panel');
        }
        activePanel = findPanel(el);
        if (activePanel) {
            activePanel.classList.add('st-mkf-active-panel');
        }
    }

    function scrollInputIntoView() {
        if (!activeInput || !document.contains(activeInput)) {
            return;
        }
        updateViewportVars();
        try {
            activeInput.scrollIntoView({
                block: 'center',
                inline: 'nearest',
                behavior: 'auto'
            });
        } catch (e) {
            console.warn(`[${EXT_NAME}] scroll failed`, e);
        }
    }

    function delayedFix() {
        scrollInputIntoView();
        setTimeout(scrollInputIntoView, 100);
        setTimeout(scrollInputIntoView, 300);
        setTimeout(scrollInputIntoView, 600);
        setTimeout(scrollInputIntoView, 1000);
    }

    document.addEventListener('focusin', (event) => {
        const target = event.target;
        if (!isEditable(target)) {
            return;
        }
        activeInput = target;
        setActivePanel(target);
        updateViewportVars();
        delayedFix();
    }, true);

    document.addEventListener('focusout', () => {
        setTimeout(() => {
            if (!isEditable(document.activeElement)) {
                activeInput = null;
                if (activePanel) {
                    activePanel.classList.remove('st-mkf-active-panel');
                    activePanel = null;
                }
                body.classList.remove('st-mkf-keyboard-open');
                updateViewportVars();
            }
        }, 200);
    }, true);

    document.addEventListener('input', (event) => {
        if (!isEditable(event.target)) {
            return;
        }
        activeInput = event.target;
        setActivePanel(event.target);
        delayedFix();
    }, true);

    window.addEventListener('resize', () => {
        updateViewportVars();
        delayedFix();
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            updateViewportVars();
            delayedFix();
        }, 300);
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            updateViewportVars();
            delayedFix();
        });
        window.visualViewport.addEventListener('scroll', () => {
            updateViewportVars();
            delayedFix();
        });
    }

    updateViewportVars();
})();
