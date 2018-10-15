
var button = {
  'active': false,
  'status': null,
  'hits':   null
};

var info = {
  cache: '',
  headers: []
};


chrome.webRequest.onHeadersReceived.addListener(function (details) {
  if (details.type === 'main_frame') {

    button.active = false;
    button.status = null;
    button.hits = null;

    var headers = details.responseHeaders;
    var cacheHeaders = [
      'x-cache',
      'x-fastcgi-cache',
      'varnish-cache',
      'cf-cache-status'
    ];

    var partialCacheHeaders = [
      'x-drupal-cache',
      'x-ee-cache'
    ];

    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      
      info.headers.push(header.name + ': ' + header.value );

      if (cacheHeaders.indexOf(header.name.toLowerCase()) !== -1) {
          var val = header.value.toLowerCase();
          
          button.active = true;
          // console.log( header.name, val, val.indexOf('hit') );
          if (val.indexOf('hit') !== -1) {
              button.status = 'hit';
          } else if (val.indexOf('bypass') !== -1) {
              button.status = 'pass';
          } else if (val.indexOf('miss') !== -1) {
              button.status = 'miss';
          }

          info.cache = header.name + ': ' + button.status;
      }
      
      button.hits = (header.name === 'X-Cache-Hits') ? parseInt(header.value, 10) : null;
    }
    if (button.status != 'hit') {
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if (partialCacheHeaders.indexOf(header.name.toLowerCase()) !== -1) {
          var val = header.value.toLowerCase();
          button.active = true;
          if (val.indexOf('hit') !== -1) {
              button.status = 'partial';
          }
        }
      }
    }
  }
}, {
  urls: [
    "http://*/*",
    "https://*/*"
  ]
}, [ 'responseHeaders' ]);

chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.frameId === 0) {

    var color = (button.active) ? 'blue' : 'gray';
    switch (button.status) {
      case 'hit':
        color = 'green';  // icon
        chrome.browserAction.setBadgeBackgroundColor({
          color: [0, 160, 0, 200],
          tabId: details.tabId
        });
        chrome.browserAction.setBadgeText({
          text: 'HIT',
          tabId: details.tabId
        });
        break;
      case 'partial':
        color = 'gray';  // icon
        chrome.browserAction.setBadgeBackgroundColor({
          color: [0, 160, 0, 200],
          tabId: details.tabId
        });
        chrome.browserAction.setBadgeText({
          text: 'CMS',
          tabId: details.tabId
        });
        break;
      case 'miss':
        color = 'red';  // icon
        chrome.browserAction.setBadgeBackgroundColor({
          color: [255, 51, 0, 200],
          tabId: details.tabId
        });
        chrome.browserAction.setBadgeText({
          text: 'MISS',
          tabId: details.tabId
        });
        break;
      case 'pass':
        color = 'blue'; // icon
        chrome.browserAction.setBadgeBackgroundColor({
          color: [0, 51, 204, 200],
          tabId: details.tabId
        });
        chrome.browserAction.setBadgeText({
          text: 'PASS',
          tabId: details.tabId
        });
      break;
    }
    chrome.browserAction.setIcon({
      path: 'icon-' + color + '128.png',
      tabId: details.tabId
    });
    
  }
});