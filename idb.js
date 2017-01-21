
module.exports = function (file) {
  var db
  var env = typeof window == 'object' ? window : self;

  function load (cb) {
    var req = env.indexedDB.open(file, 1)
    req.onsuccess = function (ev) {

      db = ev.target.result
      db.transaction(['meta'],'readonly').objectStore('meta')
      .get('meta')
      .onsuccess = function (ev) {
        if(ev.target.result) cb(null, ev.target.result)
        else cb(new Error('meta value is missing'))
      }
    }

    req.onupgradeneeded = function (ev) {
      console.log('upgrade needed')
      db = ev.target.result
      db.createObjectStore('meta')
      db.createObjectStore('data')
    }

    req.onerror = function (ev) {
      throw new Error('could not load indexdb:'+dir)
    }
  }

  function destroy (cb) {
//    var tx = db.transaction(['meta', 'data'])
    db.close(function () {})
    var tx = env.indexedDB.deleteDatabase(file)
//    tx.deleteDatabase('data')
//    tx.onversionchange = function () {
//      cb()
//  //    load(cb)
//    }
    tx.onsuccess = function () { cb() }
    tx.onerror = cb
  }

  return {
    load: load,
    batch: function (data, meta, cb) {
      var tx = db.transaction(['meta', 'data'], 'readwrite')
      tx.onabort = tx.onerror = function (err) { cb(err || error) }
      tx.oncomplete = function () {
        cb()
      }
      function onError (_err) {
        error = _err
        tx.abort()
      }

      tx.objectStore('meta').put(meta, 'meta').onerror = onError
      var dataStore = tx.objectStore('data')
      for(var k in data)
        dataStore.put(data[k], k).onerror = onError
    },
    get: function (key, cb) {
      var tx = db.transaction(['data'], 'readonly')
      var req = tx.objectStore('data').get(key)
      req.onsuccess = function (ev) {
        if(!ev.target.result) cb(new Error('not found'))
        else cb(null, ev.target.result)
      }
      req.onerror = function () {
        cb(new Error('key not found:'+key))
      }
    },
    destroy: destroy,
    close: function (cb) {
      db.close()
      //IDB doesn't actually tell you when your own database is closed!!! thanks IDB!
      cb()
    }
  }
}

