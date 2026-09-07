(function () {
    var ul = document.querySelector('article .meta');
    if (!ul) { return; }
    var li = document.createElement('li');
    li.className = 'gc-views';
    li.textContent = '…';
    ul.appendChild(li);
    var url = 'https://shaozk.goatcounter.com/counter/' + encodeURIComponent(location.pathname) + '.json';
    fetch(url)
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (d) { li.textContent = (d.count || '0') + ' 次阅读'; })
        .catch(function () { li.textContent = '0 次阅读'; });
})();
