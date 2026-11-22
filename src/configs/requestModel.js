const mongoose = require('mongoose')
const { AsyncLocalStorage } = require('node:async_hooks')

// Holds the per-request mongoose Connection (used on Cloudflare Workers, where a
// socket opened in one request cannot be reused by another).
const connectionStore = new AsyncLocalStorage()

// Drop-in replacement for mongoose.model(name, schema). Outside a request
// connection (plain Node) it behaves exactly like the default model; inside
// connectionStore.run(conn, ...) every access goes to conn's copy of the model.
const defineModel = (name, schema) => {
    const base = mongoose.model(name, schema)
    const current = () => {
        const conn = connectionStore.getStore()
        return conn ? conn.model(name) : base
    }
    return new Proxy(base, {
        get(_target, prop) {
            const model = current()
            const value = Reflect.get(model, prop, model)
            return typeof value === 'function' && prop !== 'prototype' ? value.bind(model) : value
        },
        construct(_target, args) {
            return Reflect.construct(current(), args)
        },
    })
}

module.exports = { connectionStore, defineModel }
