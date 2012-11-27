var webappCache = window.applicationCache;

function updateCache() {
    webappCache.swapCache();
}

webappCache.addEventListener("updateready", updateCache, false);

function errorCache() {
    alert("Cache failed to update");
}

webappCache.addEventListener("error", errorCache, false);

  function logEvent(event) {

      console.log(event.type);

  }

  window.applicationCache.addEventListener('checking',logEvent,false);

  window.applicationCache.addEventListener('noupdate',logEvent,false);

  window.applicationCache.addEventListener('downloading',logEvent,false);

  window.applicationCache.addEventListener('cached',logEvent,false);

  window.applicationCache.addEventListener('updateready',logEvent,false);

  window.applicationCache.addEventListener('obsolete',logEvent,false);

  window.applicationCache.addEventListener('error',logEvent,false);