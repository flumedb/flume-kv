var tape = require('tape')

module.exports = function (create) {

  var file = '/tmp/test_flume-kv_'+Date.now()

  function testFooBar(t, db, next) {
    db.get('foo', function (err, value) {
      if(err) throw err
      t.deepEqual(value, {foo: true})
      db.get('bar', function (err, value) {
        if(err) throw err
        t.deepEqual(value, {bar: true})
        db.get('baz', function (err, v) {
          t.notOk(v)
          t.ok(err, 'expected baz to be missing')
          next()
        })
      })
    })
  }

  tape('load an empty database', function (t) {

    var db = create(file)

    db.load(function (err, meta) {
      t.ok(err)
      db.batch({foo: {foo: true}, bar: {bar: true}}, {version: 1, since: 2}, function (err) {
        testFooBar(t, db, function () {
          db.close(function () {
            t.end()
          })
        })
      })
    })
  })

  tape('reopen the same database', function (t) {

    var db = create(file)

    db.load(function (err, meta) {
      if(err) throw err
      t.deepEqual(meta, {version: 1, since: 2})

      testFooBar(t, db, function () {
//        db.close(function () {
//          t.end()
//        })
        db.destroy(function (err) {
          if(err) throw err
          t.end()
        })
      })
    })
  })

  tape('load an empty database 2', function (t) {

    var db = create(file)

    db.load(function (err, meta) {
      t.ok(err)
      db.batch({foo: {foo: true}, bar: {bar: true}}, {version: 1, since: 2}, function (err) {
        testFooBar(t, db, function () {
          db.close(function () {
            t.end()
          })
        })
      })
    })
  })

  tape('done', function (t) {
    console.log('success')
    t.end()
  })
}

