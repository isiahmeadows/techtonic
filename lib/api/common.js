"use strict"

var assert = require("../util").assert

exports.addHook = function (list, callback) {
    assert(list == null || Array.isArray(list))
    assert(typeof callback === "function")

    if (list != null) {
        list.push(callback)
        return list
    } else {
        return [callback]
    }
}

exports.removeHook = function (list, callback) {
    assert(list == null || Array.isArray(list))
    assert(typeof callback === "function")

    if (list == null) return undefined
    if (list.length === 1) {
        if (list[0] === callback) return undefined
    } else {
        var index = list.indexOf(callback)

        if (index >= 0) list.splice(index, 1)
    }
    return list
}

exports.hasHook = function (list, callback) {
    assert(list == null || Array.isArray(list))
    assert(typeof callback === "function")

    if (list == null) return false
    if (list.length > 1) return list.indexOf(callback) >= 0
    return list[0] === callback
}
