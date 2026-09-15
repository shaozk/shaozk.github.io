(function () {
    var DATA_URL = '/weread-stats.json';

    var container = document.getElementById('weread-heatmap');
    if (!container || container.dataset.loaded) { return; }
    container.dataset.loaded = '1';

    var PALETTES = {
        light: { empty: '#ebedf0', levels: ['#bfdbfe', '#60a5fa', '#2563eb', '#1e40af'], text: '#57606a' },
        dark: { empty: '#161b22', levels: ['#0b2a6b', '#1d4ed8', '#3b82f6', '#93c5fd'], text: '#8b949e' }
    };

    function pad(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    function keyOf(d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    function levelOf(minutes) {
        if (minutes >= 180) { return 4; }
        if (minutes >= 60) { return 3; }
        if (minutes >= 30) { return 2; }
        if (minutes >= 1) { return 1; }
        return 0;
    }

    function buildWeeks(daily) {
        var DAY = 86400000;
        var end = new Date();
        end.setHours(0, 0, 0, 0);
        var start = new Date(end.getTime() - 364 * DAY);
        start.setDate(start.getDate() - start.getDay());

        var weeks = [];
        for (var cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 7)) {
            var week = [];
            for (var i = 0; i < 7; i++) {
                var day = new Date(cur.getTime() + i * DAY);
                if (day > end) { break; }
                var key = keyOf(day);
                var minutes = Math.round((daily[key] || 0) / 60);
                week.push({ date: key, count: minutes, level: levelOf(minutes) });
            }
            weeks.push(week);
        }
        return weeks;
    }

    fetch(DATA_URL)
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (data) {
            var daily = data.daily || {};
            var weeks = buildWeeks(daily);
            var totalMinutes = weeks.reduce(function (sum, week) {
                return sum + week.reduce(function (s, day) { return s + day.count; }, 0);
            }, 0);
            window.Heatmap.render(container, weeks, {
                palettes: PALETTES,
                ariaLabel: '微信读书阅读热力图',
                caption: '过去一年阅读 ' + (totalMinutes >= 60 ? Math.round(totalMinutes / 60) + ' 小时' : totalMinutes + ' 分钟'),
                tooltip: function (day) { return day.date + ' · ' + day.count + ' 分钟'; }
            });
        })
        .catch(function () {
            container.remove();
        });
})();
