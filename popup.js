document.addEventListener('DOMContentLoaded', function () {
    var bg = chrome.extension.getBackgroundPage();
    var cache = document.getElementById('cache-info');
    var headers = document.getElementById('header-info');
    cache.innerHTML = bg.info.cache.join('<br>');
    headers.innerHTML = bg.info.headers.join('<br>');
});