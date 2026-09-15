(function () {
    if (window.Heatmap) { return; }

    var STEP = 13;
    var CELL = 11;
    var TOP = 18;
    var NS = 'http://www.w3.org/2000/svg';
    var MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

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

    function render(container, weeks, options) {
        var dayRects = [];
        var textNodes = [];

        function build() {
            var numWeeks = weeks.length;
            var width = numWeeks * STEP - (STEP - CELL);
            var legendY = TOP + 7 * STEP + 2;
            var height = legendY + 22;

            var svg = el('svg', {
                viewBox: '0 0 ' + width + ' ' + height,
                width: '100%',
                role: 'img',
                'aria-label': options.ariaLabel || '热力图'
            });

            var lastMonth = -1;
            var lastLabelWeek = -10;

            weeks.forEach(function (week, w) {
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
                    title.textContent = options.tooltip(day);
                    rect.appendChild(title);
                    svg.appendChild(rect);
                    dayRects.push({ node: rect, level: day.level });
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
            var palette = options.palettes[theme()] || options.palettes.light;
            dayRects.forEach(function (entry) {
                entry.node.setAttribute('fill', entry.level === 0 ? palette.empty : palette.levels[Math.min(entry.level, 4) - 1]);
            });
            textNodes.forEach(function (node) {
                node.setAttribute('fill', palette.text);
            });
        }

        if (options.caption) {
            var caption = document.createElement('p');
            caption.textContent = options.caption;
            container.appendChild(caption);
        }
        container.appendChild(build());
        paint();
        window.addEventListener('themeChanged', paint);
    }

    window.Heatmap = { render: render };
})();
