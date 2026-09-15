(function () {
    var API_URL = 'https://gh-calendar.rschristian.dev/user/shaozk';
    var STEP = 13;
    var CELL = 11;
    var TOP = 18;
    var NS = 'http://www.w3.org/2000/svg';
    var MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    var COLORS = {
        light: { empty: '#ebedf0', levels: ['#9be9a8', '#40c463', '#30a14e', '#216e39'], text: '#57606a' },
        dark: { empty: '#161b22', levels: ['#033a16', '#196c2e', '#2ea043', '#39d353'], text: '#8b949e' }
    };

    var container = document.getElementById('gh-heatmap');
    if (!container || container.dataset.loaded) { return; }
    container.dataset.loaded = '1';

    function theme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function el(name, attrs) {
        var node = document.createElementNS(NS, name);
        for (var key in attrs) {
            node.setAttribute(key, attrs[key]);
        }
        return node;
    }

    var dayRects = [];
    var textNodes = [];

    function build(contributions) {
        var weeks = contributions.length;
        var width = weeks * STEP - (STEP - CELL);
        var legendY = TOP + 7 * STEP + 2;
        var height = legendY + 22;

        var svg = el('svg', {
            viewBox: '0 0 ' + width + ' ' + height,
            width: '100%',
            role: 'img',
            'aria-label': 'GitHub 贡献热力图'
        });

        var lastMonth = -1;
        var lastLabelWeek = -10;

        contributions.forEach(function (week, w) {
            var first = week[0];
            if (first) {
                var month = parseInt(first.date.slice(5, 7), 10) - 1;
                if (month !== lastMonth && w - lastLabelWeek >= 3) {
                    var label = el('text', { x: w * STEP, y: 11, 'font-size': 10 });
                    label.textContent = MONTHS[month];
                    svg.appendChild(label);
                    textNodes.push(label);
                    lastMonth = month;
                    lastLabelWeek = w;
                }
            }
            week.forEach(function (day, d) {
                var rect = el('rect', {
                    x: w * STEP,
                    y: TOP + d * STEP,
                    width: CELL,
                    height: CELL,
                    rx: 2
                });
                var title = document.createElementNS(NS, 'title');
                title.textContent = day.date + ' ' + day.count + ' 次贡献';
                rect.appendChild(title);
                svg.appendChild(rect);
                dayRects.push({ node: rect, level: parseInt(day.intensity, 10) || 0 });
            });
        });

        var squaresRight = width - 26;
        var squaresLeft = squaresRight - 4 * STEP;
        var less = el('text', { x: squaresLeft - 8, y: legendY + 9, 'font-size': 10, 'text-anchor': 'end' });
        less.textContent = '少';
        svg.appendChild(less);
        textNodes.push(less);

        for (var i = 0; i < 5; i++) {
            var rect = el('rect', {
                x: squaresLeft + i * STEP,
                y: legendY,
                width: CELL,
                height: CELL,
                rx: 2
            });
            svg.appendChild(rect);
            dayRects.push({ node: rect, level: i });
        }

        var more = el('text', { x: squaresRight + 6, y: legendY + 9, 'font-size': 10 });
        more.textContent = '多';
        svg.appendChild(more);
        textNodes.push(more);

        return svg;
    }

    function paint() {
        var palette = COLORS[theme()];
        dayRects.forEach(function (entry) {
            entry.node.setAttribute('fill', entry.level === 0 ? palette.empty : palette.levels[Math.min(entry.level, 4) - 1]);
        });
        textNodes.forEach(function (node) {
            node.setAttribute('fill', palette.text);
        });
    }

    fetch(API_URL)
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (data) {
            var caption = document.createElement('p');
            caption.textContent = '过去一年 ' + (data.total || 0) + ' 次贡献';
            container.appendChild(caption);
            container.appendChild(build(data.contributions || []));
            paint();
            window.addEventListener('themeChanged', paint);
        })
        .catch(function () {
            container.remove();
        });
})();
