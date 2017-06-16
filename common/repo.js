'use strict'

var storage = [
    { id: 1, username: 'krunal', password: '123456', displayName: 'Krunal', email: 'kmahera@officebrain.com', ownerId: 'u6f2vu9P22vfP5oxL' },
    { id: 2, username: 'customer', password: '123456', displayName: 'Rohit', email: 'rbajaniya@officebrain.com', ownerId: 'WrPhWTomx3j3hS6Ty' },
    { id: 3, username: 'paul', password: '123456', displayName: 'Paul', email: 'paul@officebrain.com', ownerId: 'pi4v28wiizb8tHrrT' },
    { id: 4, username: 'alpesh', password: '123456', displayName: 'Alpesh', email: 'avasani@officebrain.com', ownerId: 'ai4v28wiizb8tHrrT' },
    { id: 5, username: 'chirag', password: '123456', displayName: 'Chirag', email: 'chirag@officebrain.com', ownerId: 'ci4v28wiizb8tHrrT' },
    { id: 6, username: 'aakron', password: '123456', displayName: 'Aakron', email: 'aakron@test.com', ownerId: 'hi4v28wiizb8tHrrT' },
    { id: 7, username: 'ballpro', password: '123456', displayName: 'BallPro', email: 'ballpro@officebrain.com', ownerId: 'bi4v28wiizb8tHrrT' }
]

function findById(id, cb) {
    process.nextTick(() => {
        var idx = id - 1

        if (storage[idx]) {
            cb(null, storage[idx])
        } else {
            cb(new Error('User ' + id + ' does not exist'))
        }
    })
}

function findByUsername(username, cb) {
    process.nextTick(() => {
        for (var i = 0, len = storage.length; i < len; i++) {
            var record = storage[i]

            if (record.username === username) {
                return cb(null, record)
            }
        }

        return cb(null, null)
    })
}

exports.users = {
    findById: findById,
    findByUsername: findByUsername
}