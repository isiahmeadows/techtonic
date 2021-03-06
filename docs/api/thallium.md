*[Up](../api.md)*

# Primary API

These are the most common methods you'll ever use.

- [Tests with `t.test(name, callback)`](#tests)
- [`t.skip()`](#skip)
- [Using plugins with `t.call(plugin)`](#call)
- [Reflection with `t.reflect`](#reflect)
- [Using reporters with `t.reporter = reporter`](#reporter)
- [`t.timeout`](#timeout)
- [`t.slow`](#slow)
- [`t.attempts`](#attempts)
- [`t.isFailable`](#isFailable)
- [`t.only`](#only)
- [`t.run(opts?)` and `t.options`](#run)
- [Adding test hooks with `t.before(func)`, `t.beforeAll(func)`, `t.after(func)`, and `t.afterAll(func)`](#test-hooks)
- [`t.files`](#files)
- [`t.clearTests()`](#clear-tests)

<a id="tests"></a>
## Tests

```js
t.test("name", callback)
```

The basic test definition method, used for defining block tests. Should be familiar to you if you have used Mocha, Tape or similar.

```js
// JavaScript
t.test("1 should equal 1", () => {
    assert.equal(1, 1)
})
```

```coffee
# CoffeeScript
t.test '1 should equal 1', ->
    assert.equal 1, 1
```

This calls the callback on a separate event loop tick with the state correctly set to that test.

<a id="skip"></a>
## t.skip()

```js
t.skip()
```

Throw an opaque non-error to signify that this test should be skipped. Thallium will catch it and handle it specially to mark the test as skipped rather than failed.

### Async tests

Promises and other thenables are always automatically resolved when returned from the `callback`, and rejections are reported as test errors. This provides for great and simple async support, without changing anything.

```js
const fs = require("fs")
const pcall = require("promise-call")

// Promises
t.test("reads files correctly", t =>
    pcall(fs.readFile, "file.txt", "utf-8")
    .then(data => assert.equal(data, "contents\n")))

// Async functions
t.test("reads files correctly", async t => {
    const data = await pcall(fs.readFile, "file.txt", "utf-8")
    assert.equal(data, "contents\n")
})
```

```coffee
# CoffeeScript
fs = require 'fs'
pcall = require 'promise-call'

t.test 'reads files correctly', ->
    pcall(fs.readFile, 'file.txt', 'utf-8').then (data) ->
        assert.equal data, 'contents\n'
```

<a id="call"></a>
## Using plugins

```js
t.call(plugin)
```

Call a [plugin](../plugins.md) and return its result.

<a id="reflect"></a>
## Reflection

```js
t.reflect // getter
```

Get a [Reflect](../reflect.md) instance, the same value that's passed to plugins invoked with `t.call()`.

<a id="reporter"></a>
## Using reporters

```js
t.reporter = ["builtin", opts={}] // setter
t.reporter = reporter // setter
```

Use a [reporter](../reporters.md). The first version uses a built-in reporter given by name (with optional options), and the second a reporter reference. Note that this only works at the root level, and it replaces any old one that was previously used.

<a id="timeout"></a>
## t.timeout

```js
var timeout = t.timeout // getter
t.timeout = timeout // setter
```

Get or set the max timeout in milliseconds for async tests, so Thallium knows how long to wait until it should fail the test. When accessing the property, it gets the current active timeout, or the default of `2000` if none is set. When setting the property, set it to the timeout you wish, `0` to inherit the parent's timeout (or default), or `Infinity` to disable it. When setting it, the timeout is floored to `0` in case it's negative.

<a id="slow"></a>
## t.slow

```js
var slow = t.slow // getter
t.slow = slow // setter
```

Get or set the max slow threshold in milliseconds, so Thallium knows when it should consider a test to be slow. When accessing the property, it gets the current active threshold, or the default of `75` if none is set. When setting the property, set it to the duration you wish, `0` to inherit the parent's threshold (or default), or `Infinity` to disable it. When setting it, the threshold is floored to `0` in case it's negative.

<a id="attempts"></a>
## t.attempts

```js
var attempts = t.attempts // getter
t.attempts = attempts // setter
```

Get or set the max attempts allowed for that test, so Thallium knows how many retries are allowed before giving up. This is helpful for tests that depend on the file system or other external resources it isn't guaranteed to get or at least in any particular order. When accessing the property, it gets the current active attempt count, or the default of `1` if none was set, and is always positive. When setting the property, set it to the count you wish, `0` to reset it to the parent's attempt count, or `Infinity` to always retry on error (not recommended, since it'll be easy to create an infinite loop).

<a id="isFailable"></a>
## t.isFailable

```js
var isFailable = t.isFailable // getter
t.isFailable = isFailable // setter
```

Get whether this test is failable, or set it as either failable/non-failable. Tests default to non-failable, but when you're working on cracking down a backlog of issues, you may want to still run the failing tests, but not have them failing the build while you're fixing them all.

<a id="only"></a>
## t.only(...paths)

```js
t.only = [...paths] // setter
```

Only run tests that are inside this path. This can be set globally before tests are run. It's a lot like Mocha's `--grep` or `--fgrep`, but far more flexible. Also, only the whitelisted subtests contained in the `paths` run, and inner block/async tests aren't even initialized.

The `paths` are used as an exclusive union of tests and their children to run.

```js
t.only = [
    ["one"],
    ["two", "inner 1"],
]

t.test("one", t => {
    t.test("inner").equal(1, 1)
})

t.test("two", t => {
    t.test("inner 1").equal(0, 0)

    // Doesn't run
    t.test("inner 2").equal(0, 1)
})
```

This can even filter out child tests.

```js

t.test("one", t => {
    t.test("inner").equal(1, 1)
})

t.test("two", t => {
    t.only(["inner 1"])
    t.test("inner 1").equal(0, 0)

    // Doesn't run
    t.test("inner 2").equal(0, 1)
})
```

Also, empty arrays match no test, and passing no arguments will prevent all tests from running.

<a id="run"></a>
## t.run(opts?) and t.options

```js
t.options = opts // setter, optional
t.run(opts={}).then(...)
```

This will run all your tests. If you're using the CLI, this is unnecessary, as it's handled for you, but if you're simply using a single test file, and you just want to use `node test.js`, you can use this. Also, it's good for if you're running it in the browser. It returns a promise resolved whenever the test is completed.

If it's rejected, the rejection always caused by one of two things:

1. A reporter threw/returned an error it didn't catch.
2. Thallium itself threw an error it didn't catch.

Either case is fatal, but Thallium restores its state for a subsequent rerun (in case of flaky reporters). If it isn't, and the error isn't from the reporter, it's a bug [you definitely should report](https://github.com/isiahmeadows/thallium/issues/new))

You can set the options per-test, or you may also specify default options by assigning them to `t.options` (write-only) before they're run (like in your config).

The following options are accepted, none required:

- `only` - Much like `t.only`, except it's specified and handled per-run.
- `skip` - Skip tests in this run using the same kind of selector as `only`.

<a id="test-hooks"></a>
## Adding test hooks

```js
t.before(func)
t.beforeAll(func)
t.after(func)
t.afterAll(func)
```

Schedule a callback to run on every test. In each group, they're fired in the order they're added, and here's how they work:

1. Run the test body
2. If the test didn't define any subtests, return
3. Run all the `beforeAll` hooks defined for this test only
4. For each subtest:
    - Run all `before` hooks defined from the root test to this one
    - Run the child test with relevant hooks.
    - Run all `after` hooks defined from the root test to this one
5. Run all the `afterAll` hooks defined for this test only

You may also run plugins within these hooks, and in the case of `before` and `after` hooks, you can even run plugins in the context of the child test itself.

<a id="files"></a>
## t.files

```js
var files = t.files // getter
t.files = files // setter
```

Get the files to be executed, or set them to what you want. See the [CLI configuration section](./cli.md#configuration) for more details.

<a id="clear-tests"></a>
## t.clearTests()

```js
t.clearTests()
```

Clear all previously defined tests. Mainly useful for automation, when you need to reload all the tests.
