(function() {
    // 针对弹窗（dialog/popup）键盘收回后卡半屏的问题
    
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', function() {
            fixLayout();
        });
    }

    document.addEventListener('focusout', function(e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
            setTimeout(fixLayout, 50);
            setTimeout(fixLayout, 150);
            setTimeout(fixLayout, 300);
            setTimeout(fixLayout, 500);
            setTimeout(fixLayout, 1000);
        }
    });

    function fixLayout() {
        // 强制滚动回顶部
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // 强制重设高度
        var fullHeight = window.innerHeight + 'px';
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.getElementById('top-settings-holder') && (document.getElementById('top-settings-holder').style.minHeight = '');
        
        // 找到所有弹窗类元素，强制刷新
        var popups = document.querySelectorAll('.popup, .dialogue_popup, [class*="popup"], [class*="dialog"], [class*="modal"]');
        popups.forEach(function(el) {
            el.style.transform = 'translateZ(0)';
            el.style.maxHeight = '100vh';
            el.style.maxHeight = '-webkit-fill-available';
        });

        // 最暴力的方法：强制触发整页重排
        document.body.style.display = 'none';
        void document.body.offsetHeight;
        document.body.style.display = '';
        
        // 再来一次滚动修正
        requestAnimationFrame(function() {
            window.scrollTo(0, 0);
            if (window.visualViewport) {
                window.scrollTo(0, window.visualViewport.offsetTop * -1);
            }
        });
    }

    console.log('[Keyboard Fix v2] loaded');
})();
