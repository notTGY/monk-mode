# monk-mode
Disable distractions on the web

1. static rule for `declarative_net_request`
to redirect all images to my website as proxy.
Pitfall: problems if browser is fingerprinted.
```
{
  "id": 1,
  "priority": 1,
  "action": {
    "type": "redirect",
    "redirect": {
      "regexSubstitution": "https://\\1.xyz.com/"
    }
  },
  "condition": {
    "regexFilter": "^https://www\\.(abc|def)\\.xyz\\.com/",
    "resourceTypes": [
      "main_frame"
    ]
  }
}
```

2. PWA-like background service worker.
```
{
  "name": "Awesome Test Extension",
  ...
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  },
  ...
}
```
Pitfalls: 30 seconds of no events -> shuts down sw,
single request takes more than 5 minutes,
when fetch() takes more than 30 seconds.
```
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(/* your caching logic here */);
  }

  // If you don't call event.respondWith() for some requests,
  // the normal loading behavior will be used by default.
};
```

3. Manually pixelate images inside content script
