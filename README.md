# Cache Hit

Shows if cache was HIT or MISS for the current page/resource.

Will check the following headers to determine a match.

Proxy:
* x-cache
* x-fastcgi-cache
* varnish-cache
* cf-cache-status

CMS:
* x-drupal-cache
* x-ee-cache


Issues: https://github.com/jjpmann/cache-hit/issues