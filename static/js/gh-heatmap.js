(function () {
    var API_URL = 'https://gh-calendar.rschristian.dev/user/shaozk';

    var container = document.getElementById('gh-heatmap');
    if (!container || container.dataset.loaded) { return; }
    container.dataset.loaded = '1';

    var PALETTES = {
        light: { empty: '#ebedf0', levels: ['#9be9a8', '#40c463', '#30a14e', '#216e39'], text: '#57606a' },
        dark: { empty: '#161b22', levels: ['#033a16', '#196c2e', '#2ea043', '#39d353'], text: '#8b949e' }
    };

    fetch(API_URL)
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (data) {
            var weeks = (data.contributions || []).map(function (week) {
                return week.map(function (day) {
                    return { date: day.date, count: day.count, level: parseInt(day.intensity, 10) || 0 };
                });
            });
            window.Heatmap.render(container, weeks, {
                palettes: PALETTES,
                ariaLabel: 'GitHub 贡献热力图',
                caption: '过去一年 ' + (data.total || 0) + ' 次贡献',
                tooltip: function (day) { return day.date + ' ' + day.count + ' 次贡献'; }
            });
        })
        .catch(function () {
            container.remove();
        });
})();
