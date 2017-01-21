var Level = require('level')

function create(dir) {
  closed = false
  return Level(dir, {keyEncoding: 'utf8', valueEncoding: 'json'})
}


module.exports = function (file) {
  var META = '\x00'
  var db
  function load (cb) {
    if(db) throw new Error('already loaded')
    db = create(file)
    db.get(META, {keyEncoding: 'utf8'}, cb)
  }
  return {
    load: load,
    batch: function (data, meta, cb) {
      var a = [{key: META, value: meta, keyEncoding: 'utf8', type: 'put'}]
      for(var k in data)
        a.push({key: k, value: data[k], type: 'put'})
      db.batch(a, cb)
    },
    get: function (key, cb) {
      db.get(key, cb)
    },
    destroy: function (cb) {
      db.close(function () {
        db = null
        Level.destroy(file, cb)
      })
    },
    close: function (cb) {
      db.close(cb)
    }
  }
}












