# flume-kv

A wrapper around level/indexeddb intended for use with flumedb modules.

## motivation

why not just use leveldown?

Well, there are some leveldb features (like the iterator) that are not general.
Although the leveldb iterator is useful, it makes caching much more difficult,
and often all you need is an unsorted key value store.

## License

MIT

