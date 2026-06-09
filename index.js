(function() {
    var fixing = false;

    function fixLayout() {
        if (fixing) return;
        fixing = true;

        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';

        // 温和地强制重排，不会闪
        var all = document.querySelectorAll('.popup, .dialogue_popup, [class*="popup"], [class*="dialog"], [class*="modal"]');
        all.forEach(function(el) {
            var old = el.style.paddingBottom || '';
            el.style.paddingBottom = '0.01px';
            void el.offsetHeight;
            el.style.paddingBottom = old;
        });

        requestAnimationFrame(function() {
            window.scrollTo(0, 0);
            fixing = false;
        });
    }

    // 键盘收回时触发
    document.addEventListener('focusout', function(e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
            setTimeout(fixLayout, 50);
            setTimeout(fixLayout, 200);
            setTimeout(fixLayout, 500);
            setTimeout(fixLayout, 1000);
        }
    });

    // 视口大小变化时触发
    if (window.visualViewport) {
        var lastHeight = window.visualViewport.height;
        window.visualViewport.addEventListener('resize', function() {
            var newHeight = window.visualViewport.height;
            // 只在键盘收回（高度变大）时修复
            if (newHeight > lastHeight + 50) {
                setTimeout(fixLayout, 50);
                setTimeout(fixLayout, 300);
            }
            lastHeight = newHeight;
        });
    }

    console.log('[Keyboard Fix v3] loaded');
})();
