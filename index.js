(function() {
    const originalHeight = window.innerHeight;
    window.addEventListener('resize', function() {
        setTimeout(function() {
            if (window.innerHeight >= originalHeight * 0.85) {
                forceReflow();
            }
        }, 300);
    });
    document.addEventListener('focusout', function(e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
            setTimeout(forceReflow, 100);
            setTimeout(forceReflow, 300);
            setTimeout(forceReflow, 600);
        }
    });
    document.addEventListener('touchstart', function() {
        if (!document.activeElement || (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !document.activeElement.isContentEditable)) {
            forceReflow();
        }
    });
    function forceReflow() {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        requestAnimationFrame(function() {
            document.documentElement.style.height = '';
            document.body.style.height = '';
        });
    }
    console.log('[Keyboard Fix] loaded');
})();
