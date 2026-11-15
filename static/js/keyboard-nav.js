(function () {
    'use strict';

    var SCROLL_STEP = 80;
    var GG_INTERVAL = 500;
    var lastGTime = 0;
    var overlay = null;
    var lastFocused = null;

    function isTypingTarget(el) {
        if (!el) { return false; }
        var tag = el.tagName;
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
    }

    function isSearchModalOpen() {
        var modal = document.getElementById('searchModal');
        return !!modal && modal.style.display === 'block';
    }

    function smoothScrollBy(y) {
        window.scrollBy({ top: y, behavior: 'smooth' });
    }

    function adjacentArticleLink(side) {
        var nav = document.querySelector('nav.article-navigation');
        if (!nav) { return null; }
        var divs = nav.querySelectorAll(':scope > div > a');
        if (divs.length === 0) { return null; }
        if (side === 'left') { return divs[0]; }
        if (side === 'right') { return divs[divs.length - 1]; }
        return null;
    }

    function goArticle(side) {
        var link = adjacentArticleLink(side);
        if (link && link.href) {
            window.location.href = link.href;
        }
    }

    function buildHelpPanel() {
        overlay = document.createElement('div');
        overlay.className = 'kb-nav-overlay';
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) { hideHelpPanel(); }
        });

        var dialog = document.createElement('div');
        dialog.className = 'kb-nav-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', '键盘快捷键');

        var title = document.createElement('h2');
        title.textContent = '键盘快捷键';

        var list = document.createElement('ul');
        var shortcuts = [
            { keys: ['j', 'k'], desc: '向下 / 向上滚动' },
            { keys: ['g', 'g'], desc: '回到顶部' },
            { keys: ['G'], desc: '跳到底部' },
            { keys: ['←', '→'], desc: '上一篇 / 下一篇（文章页）' },
            { keys: ['Ctrl', 'K'], desc: '搜索（macOS 为 ⌘K）' },
            { keys: ['?'], desc: '显示本面板' },
            { keys: ['Esc'], desc: '关闭面板' }
        ];
        shortcuts.forEach(function (s) {
            var li = document.createElement('li');
            var kbdWrap = document.createElement('span');
            kbdWrap.className = 'kb-nav-keys';
            s.keys.forEach(function (k, i) {
                if (i > 0) {
                    var sep = document.createElement('span');
                    sep.className = 'kb-nav-sep';
                    sep.textContent = '+';
                    kbdWrap.appendChild(sep);
                }
                var kbd = document.createElement('kbd');
                kbd.textContent = k;
                kbdWrap.appendChild(kbd);
            });
            var desc = document.createElement('span');
            desc.textContent = s.desc;
            li.appendChild(kbdWrap);
            li.appendChild(desc);
            list.appendChild(li);
        });

        dialog.appendChild(title);
        dialog.appendChild(list);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    function showHelpPanel() {
        if (!overlay) { buildHelpPanel(); }
        lastFocused = document.activeElement;
        overlay.classList.add('kb-nav-visible');
        document.body.style.overflow = 'hidden';
        var firstKbd = overlay.querySelector('kbd');
        if (firstKbd) { firstKbd.setAttribute('tabindex', '-1'); firstKbd.focus(); }
    }

    function hideHelpPanel() {
        if (!overlay || !overlay.classList.contains('kb-nav-visible')) { return; }
        overlay.classList.remove('kb-nav-visible');
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
        lastFocused = null;
    }

    function isHelpPanelVisible() {
        return !!overlay && overlay.classList.contains('kb-nav-visible');
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            hideHelpPanel();
            return;
        }

        if (e.ctrlKey || e.metaKey || e.altKey) { return; }
        if (isTypingTarget(e.target)) { return; }
        if (isSearchModalOpen()) { return; }
        if (isHelpPanelVisible()) { return; }

        switch (e.key) {
            case 'j':
                e.preventDefault();
                smoothScrollBy(SCROLL_STEP);
                break;
            case 'k':
                e.preventDefault();
                smoothScrollBy(-SCROLL_STEP);
                break;
            case 'g':
                e.preventDefault();
                var now = Date.now();
                if (now - lastGTime < GG_INTERVAL) {
                    lastGTime = 0;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    lastGTime = now;
                }
                break;
            case 'G':
                e.preventDefault();
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                break;
            case 'ArrowLeft':
                if (adjacentArticleLink('left')) {
                    e.preventDefault();
                    goArticle('left');
                }
                break;
            case 'ArrowRight':
                if (adjacentArticleLink('right')) {
                    e.preventDefault();
                    goArticle('right');
                }
                break;
            case '?':
                e.preventDefault();
                showHelpPanel();
                break;
        }
    });
})();
