"use strict"

/* global Map, Symbol */

describe("assert (base)", function () {
    describe("assert()", function () {
        it("works", function () {
            function fail(arg, message) {
                try {
                    assert.assert(arg, message)
                    throw new Error("Expected assertion to throw")
                } catch (e) {
                    assert.equal(e.message, message)
                }
            }

            assert.assert(true)
            assert.assert(1)
            assert.assert(Infinity)
            assert.assert("foo")
            assert.assert({})
            assert.assert([])
            assert.assert(new Date())
            if (typeof Symbol === "function") assert.assert(Symbol())

            fail(undefined, "message")
            fail(null, "message")
            fail(false, "message")
            fail(0, "message")
            fail("", "message")
            fail(NaN, "message")
        })

        it("escapes the message", function () {
            Util.fail("assert", undefined, "{test}")
            Util.fail("assert", null, "{test}")
            Util.fail("assert", false, "{test}")
            Util.fail("assert", 0, "{test}")
            Util.fail("assert", "", "{test}")
            Util.fail("assert", NaN, "{test}")
        })
    })

    Util.basic("ok()", function () {
        assert.ok(true)
        assert.ok(1)
        assert.ok(Infinity)
        assert.ok("foo")
        assert.ok({})
        assert.ok([])
        assert.ok(new Date())
        if (typeof Symbol === "function") assert.ok(Symbol())

        Util.fail("ok")
        Util.fail("ok", undefined)
        Util.fail("ok", null)
        Util.fail("ok", false)
        Util.fail("ok", 0)
        Util.fail("ok", "")
        Util.fail("ok", NaN)
    })

    Util.basic("notOk()", function () {
        Util.fail("notOk", true)
        Util.fail("notOk", 1)
        Util.fail("notOk", Infinity)
        Util.fail("notOk", "foo")
        Util.fail("notOk", {})
        Util.fail("notOk", [])
        Util.fail("notOk", new Date())
        if (typeof Symbol === "function") Util.fail("notOk", Symbol())

        assert.notOk()
        assert.notOk(undefined)
        assert.notOk(null)
        assert.notOk(false)
        assert.notOk(0)
        assert.notOk("")
        assert.notOk(NaN)
    })

    Util.basic("equal()", function () {
        assert.equal(0, 0)
        assert.equal(1, 1)
        assert.equal(null, null)
        assert.equal(undefined, undefined)
        assert.equal(Infinity, Infinity)
        assert.equal(NaN, NaN)
        assert.equal("", "")
        assert.equal("foo", "foo")

        var obj = {}

        assert.equal(obj, obj)

        Util.fail("equal", {}, {})
        Util.fail("equal", null, undefined)
        Util.fail("equal", 0, 1)
        Util.fail("equal", 1, "1")
    })

    Util.basic("notEqual()", function () {
        Util.fail("notEqual", 0, 0)
        Util.fail("notEqual", 1, 1)
        Util.fail("notEqual", null, null)
        Util.fail("notEqual", undefined, undefined)
        Util.fail("notEqual", Infinity, Infinity)
        Util.fail("notEqual", NaN, NaN)
        Util.fail("notEqual", "", "")
        Util.fail("notEqual", "foo", "foo")

        var obj = {}

        Util.fail("notEqual", obj, obj)

        assert.notEqual({}, {})
        assert.notEqual(null, undefined)
        assert.notEqual(0, 1)
        assert.notEqual(1, "1")
    })

    Util.basic("equalLoose()", function () {
        assert.equalLoose(0, 0)
        assert.equalLoose(1, 1)
        assert.equalLoose(null, null)
        assert.equalLoose(undefined, undefined)
        assert.equalLoose(Infinity, Infinity)
        assert.equalLoose(NaN, NaN)
        assert.equalLoose("", "")
        assert.equalLoose("foo", "foo")
        assert.equalLoose(null, undefined)
        assert.equalLoose(1, "1")

        var obj = {}

        assert.equalLoose(obj, obj)

        Util.fail("equalLoose", {}, {})
        Util.fail("equalLoose", 0, 1)
    })

    Util.basic("notEqualLoose()", function () {
        Util.fail("notEqualLoose", 0, 0)
        Util.fail("notEqualLoose", 1, 1)
        Util.fail("notEqualLoose", null, null)
        Util.fail("notEqualLoose", undefined, undefined)
        Util.fail("notEqualLoose", Infinity, Infinity)
        Util.fail("notEqualLoose", NaN, NaN)
        Util.fail("notEqualLoose", "", "")
        Util.fail("notEqualLoose", "foo", "foo")
        Util.fail("notEqualLoose", null, undefined)
        Util.fail("notEqualLoose", 1, "1")

        var obj = {}

        Util.fail("notEqualLoose", obj, obj)

        assert.notEqualLoose({}, {})
        assert.notEqualLoose(0, 1)
    })

    Util.basic("deepEqual()", function () {
        assert.deepEqual(0, 0)
        assert.deepEqual(1, 1)
        assert.deepEqual(null, null)
        assert.deepEqual(undefined, undefined)
        assert.deepEqual(Infinity, Infinity)
        assert.deepEqual(NaN, NaN)
        assert.deepEqual("", "")
        assert.deepEqual("foo", "foo")

        var obj = {}

        assert.deepEqual(obj, obj)

        assert.deepEqual({}, {})
        Util.fail("deepEqual", null, undefined)
        Util.fail("deepEqual", 0, 1)
        Util.fail("deepEqual", 1, "1")

        assert.deepEqual(
            {a: [2, 3], b: [4]},
            {a: [2, 3], b: [4]})
    })

    Util.basic("notDeepEqual()", function () {
        Util.fail("notDeepEqual", 0, 0)
        Util.fail("notDeepEqual", 1, 1)
        Util.fail("notDeepEqual", null, null)
        Util.fail("notDeepEqual", undefined, undefined)
        Util.fail("notDeepEqual", Infinity, Infinity)
        Util.fail("notDeepEqual", NaN, NaN)
        Util.fail("notDeepEqual", "", "")
        Util.fail("notDeepEqual", "foo", "foo")

        var obj = {}

        Util.fail("notDeepEqual", obj, obj)

        Util.fail("notDeepEqual", {}, {})
        assert.notDeepEqual(null, undefined)
        assert.notDeepEqual(0, 1)
        assert.notDeepEqual(1, "1")

        Util.fail("notDeepEqual",
            {a: [2, 3], b: [4]},
            {a: [2, 3], b: [4]})
    })

    function F() { this.value = 1 }
    Util.methods(F, {
        get prop() { return 1 },
    })

    Util.basic("hasOwn()", function () {
        assert.hasOwn({prop: 1}, "prop")
        assert.hasOwn({prop: 1}, "prop", 1)
        assert.hasOwn(new F(), "value", 1)

        Util.fail("hasOwn", {prop: 1}, "toString")
        Util.fail("hasOwn", {prop: 1}, "value")
        Util.fail("hasOwn", {prop: 1}, "prop", 2)
        Util.fail("hasOwn", {prop: 1}, "prop", "1")
        Util.fail("hasOwn", new F(), "prop")
        Util.fail("hasOwn", new F(), "prop", 1)
        Util.fail("hasOwn", new F(), "value", 2)
    })

    Util.basic("notHasOwn()", function () {
        Util.fail("notHasOwn", {prop: 1}, "prop")
        Util.fail("notHasOwn", {prop: 1}, "prop", 1)
        Util.fail("notHasOwn", new F(), "value", 1)

        assert.notHasOwn({prop: 1}, "toString")
        assert.notHasOwn({prop: 1}, "value")
        assert.notHasOwn({prop: 1}, "prop", 2)
        assert.notHasOwn({prop: 1}, "prop", "1")
        assert.notHasOwn(new F(), "prop")
        assert.notHasOwn(new F(), "prop", 1)
        assert.notHasOwn(new F(), "value", 2)
    })

    Util.basic("hasOwnLoose()", function () {
        assert.hasOwnLoose({prop: 1}, "prop", 1)
        assert.hasOwnLoose(new F(), "value", 1)
        assert.hasOwnLoose({prop: 1}, "prop", "1")

        Util.fail("hasOwnLoose", {prop: 1}, "prop", 2)
        Util.fail("hasOwnLoose", new F(), "prop", 1)
        Util.fail("hasOwnLoose", new F(), "value", 2)
    })

    Util.basic("notHasOwnLoose()", function () {
        Util.fail("notHasOwnLoose", {prop: 1}, "prop", 1)
        Util.fail("notHasOwnLoose", new F(), "value", 1)
        Util.fail("notHasOwnLoose", {prop: 1}, "prop", "1")

        assert.notHasOwnLoose({prop: 1}, "prop", 2)
        assert.notHasOwnLoose(new F(), "prop", 1)
        assert.notHasOwnLoose(new F(), "value", 2)
    })

    Util.basic("hasKey()", function () {
        assert.hasKey({prop: 1}, "prop")
        assert.hasKey({prop: 1}, "prop", 1)
        assert.hasKey(new F(), "value", 1)
        assert.hasKey({prop: 1}, "toString")
        assert.hasKey(new F(), "prop")
        assert.hasKey(new F(), "prop", 1)

        Util.fail("hasKey", {prop: 1}, "value")
        Util.fail("hasKey", {prop: 1}, "prop", 2)
        Util.fail("hasKey", {prop: 1}, "prop", "1")
        Util.fail("hasKey", new F(), "value", 2)
    })

    Util.basic("notHasKey()", function () {
        Util.fail("notHasKey", {prop: 1}, "prop")
        Util.fail("notHasKey", {prop: 1}, "prop", 1)
        Util.fail("notHasKey", new F(), "value", 1)
        Util.fail("notHasKey", {prop: 1}, "toString")
        Util.fail("notHasKey", new F(), "prop")
        Util.fail("notHasKey", new F(), "prop", 1)

        assert.notHasKey({prop: 1}, "value")
        assert.notHasKey({prop: 1}, "prop", 2)
        assert.notHasKey({prop: 1}, "prop", "1")
        assert.notHasKey(new F(), "value", 2)
    })

    Util.basic("hasKeyLoose()", function () {
        assert.hasKeyLoose({prop: 1}, "prop", 1)
        assert.hasKeyLoose(new F(), "value", 1)
        assert.hasKeyLoose(new F(), "prop", 1)
        assert.hasKeyLoose({prop: 1}, "prop", "1")

        Util.fail("hasKeyLoose", {prop: 1}, "prop", 2)
        Util.fail("hasKeyLoose", new F(), "value", 2)
    })

    Util.basic("notHasKeyLoose()", function () {
        Util.fail("notHasKeyLoose", {prop: 1}, "prop", 1)
        Util.fail("notHasKeyLoose", new F(), "value", 1)
        Util.fail("notHasKeyLoose", new F(), "prop", 1)
        Util.fail("notHasKeyLoose", {prop: 1}, "prop", "1")

        assert.notHasKeyLoose({prop: 1}, "prop", 2)
        assert.notHasKeyLoose(new F(), "value", 2)
    })

    if (typeof Map !== "undefined") {
        Util.basic("has()", function () {
            assert.has(new Map([["prop", 1]]), "prop")
            assert.has(new Map([["prop", 1]]), "prop", 1)

            Util.fail("has", new Map([["prop", 1]]), "value")
            Util.fail("has", new Map([["prop", 1]]), "prop", 2)
            Util.fail("has", new Map([["prop", 1]]), "prop", "1")
        })

        Util.basic("notHas()", function () {
            Util.fail("notHas", new Map([["prop", 1]]), "prop")
            Util.fail("notHas", new Map([["prop", 1]]), "prop", 1)

            assert.notHas(new Map([["prop", 1]]), "value")
            assert.notHas(new Map([["prop", 1]]), "prop", 2)
            assert.notHas(new Map([["prop", 1]]), "prop", "1")
        })

        Util.basic("hasLoose()", function () {
            assert.hasLoose(new Map([["prop", 1]]), "prop", 1)
            assert.hasLoose(new Map([["prop", 1]]), "prop", "1")

            Util.fail("hasLoose", new Map([["prop", 1]]), "prop", 2)
        })

        Util.basic("notHasLoose()", function () {
            Util.fail("notHasLoose", new Map([["prop", 1]]), "prop", 1)
            Util.fail("notHasLoose", new Map([["prop", 1]]), "prop", "1")

            assert.notHasLoose(new Map([["prop", 1]]), "prop", 2)
        })
    }
})