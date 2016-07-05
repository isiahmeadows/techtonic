"use strict"

/**
 * Note: do *not* assume the DOM is ready, or even that one even exists, because
 * both the tests and users may need to load mocks before initializing this
 * reporter. You may only rely on the `window` object from the options.
 */

var Promise = require("bluebird")
var m = require("../lib/messages.js")
var R = require("../lib/reporter.js")
var getType = require("../lib/util.js").getType

function Tree(name) {
    this.name = name
    this.status = R.Status.Unknown
    this.node = null
    this.children = Object.create(null)
}

function unhide(root) {
    var suites = root.getElementsByClassName("suite hidden")

    for (var i = 0; i < suites.length; i++) {
        suites[i].className = suites[i].className
            .replace(/\bhidden\b/g, "")
            .replace(/\s+/g, " ")
            .trim()
    }
}

function hideSuitesWithout(root, className) {
    var suites = root.getElementsByClassName("suite")

    for (var i = 0; i < suites.length; i++) {
        var suite = suites[i]

        if (!suite.getElementsByClassName(className).length &&
                !/\bhidden\b/.test(suite)) {
            suite.className += " hidden"
        }
    }
}

function setText(element, contents) {
    if (element.textContent) element.textContent = contents
    else element.innerText = contents
}

function addToggle(state, opts, name, pass) {
    var document = opts.window.document
    var entry = document.createElement("li")
    var label = document.createElement("em")
    var link = document.createElement("a")

    entry.appendChild(link)
    link.href = "javascript:void 0" // eslint-disable-line no-script-url
    link.addEventListener("click", function (e) {
        e.preventDefault()
        unhide(opts.root)
        if (pass) {
            state.report.className = state.report.className
                .replace(/\bfail\b/g, " pass")
                .replace(/\s+/g, " ").trim()
            if (state.report.className) hideSuitesWithout("test pass")
        } else {
            state.report.className = state.report.className
                .replace(/\bpass\b/g, " fail")
                .replace(/\s+/g, " ").trim()
            if (state.report.className) hideSuitesWithout("test fail")
        }
    }, false)
    link.appendChild(document.createTextNode(name))

    entry.appendChild(document.createTextNode(" "))
    entry.appendChild(label)
    label.appendChild(document.createTextNode("0"))
    state.base.appendChild(entry)
    return label
}

function addDuration(state, opts) {
    var document = opts.window.document
    var entry = document.createElement("li")
    var counter = document.createElement("em")

    entry.appendChild(document.createTextNode("duration: "))
    entry.appendChild(counter)
    counter.appendChild(document.createTextNode("0"))
    return counter
}

function getRoot(root, window) {
    if (root == null) {
        return window.document.getElementById("tl")
    } else if (typeof root === "string") {
        return window.document.getElementById(root)
    } else if (root instanceof window.Element) {
        return root
    } else {
        return null
    }
}

function updateStats(r) {
    setText(r.state.passes, r.passes)
    setText(r.state.failures, r.failures)
    setText(r.state.duration, R.formatTime(r.duration))
}

function onNextRepaint(r, callback) {
    if (r.opts.window.requestAnimationFrame) {
        r.opts.window.requestAnimationFrame(callback)
    } else if (global.setTimeout) {
        global.setTimeout(callback, 0)
    } else {
        r.opts.window.setTimeout(callback, 0)
    }
}

function initRoot(r, ev) {
    var document = r.opts.window.document

    if (!ev.path.length) {
        r.get([]).node = document.createElement("ul")
        r.state.report.appendChild(r.get([]).node)
        return
    }

    var stack = []

    for (var i = 0; i < ev.path.length; i++) {
        var entry = ev.path[i]
        var children = document.createElement("ul")

        r.get(stack).node = children
        stack.push(entry)

        var suite = document.createElement("li")
        var header = document.createElement("h1")

        suite.className = "suite"
        suite.appendChild(header)
        header.appendChild(document.createTextNode(entry.name))
        header.appendChild(children)

        r.get(stack).node.appendChild(suite)
    }
}

function showTestResult(r, ev) {
    var document = r.opts.window.document
    var className = ev.enter() ? "" : "test " + ev.type()
    var name = ev.path[ev.path.length - 1].name
    var outer = document.createElement("li")
    var inner = document.createElement(ev.enter() ? "h1" : "h2")

    inner.appendChild(document.createTextNode(name))

    if (!ev.skip()) {
        className += " " + R.speed(ev)
        var duration = document.createElement("span")

        duration.appendChild(document.createTextNode(R.formatTime(ev.duration)))
        inner.appendChild(duration)
    }

    outer.className = className
    outer.appendChild(inner)

    if (ev.enter()) {
        r.get(ev.path).node = document.createElement("ul")
        outer.appendChild(r.get(ev.path).node)
    }

    ev.path.pop()
    r.get(ev.path).node.appendChild(outer)
}

module.exports = R.on({
    accepts: ["root", "window", "reset"],
    create: function (args, methods) {
        var root = getRoot(args, global.window)
        var window = global.window

        if (root == null) {
            if (args.window != null) window = args.window
            root = getRoot(args.root, window)

            if (root == null) {
                throw new TypeError(m("type.reporter.dom.element",
                    getType(root)))
            }
        }

        return new R.Reporter(Tree,
            {window: window, root: root, reset: args.reset},
            methods)
    },

    // Clear the div first.
    init: function (state, opts) {
        var document = opts.window.document

        state.error = document.createElement("div")
        state.error.className = "error hidden"

        state.report = document.createElement("ul")
        state.report.className = "report"

        state.base = document.createElement("ul")
        state.base.className = "base"

        state.passes = addToggle(state, opts, "passes:", true)
        state.failures = addToggle(state, opts, "failures:", false)
        state.duration = addDuration(state, opts)

        var iframe = document.createElement("iframe")

        iframe.style.width = "100%"
        iframe.style.height = "100%"
        iframe.style.border = "0"
        iframe.style.padding = "0"
        iframe.style.margin = "0"
        iframe.appendChild(state.base)
        iframe.appendChild(state.report)

        opts.root.appendChild(iframe)
    },

    // Give the browser a chance to repaint before continuing (microtasks
    // normally block rendering).
    after: function (r) {
        return new Promise(function (resolve) { onNextRepaint(r, resolve) })
    },

    report: function (r, ev) {
        if (ev.start()) {
            initRoot(r, ev)
        } else if (ev.enter() || ev.pass() || ev.fail() || ev.skip()) {
            showTestResult(r, ev)
            updateStats(r)
        } else if (ev.extra()) {
            // TODO
            // r.get(ev.path).status = R.Status.Failing
            //
            // var child = r.get(ev.path).node
            // var parent = r.get(ev.path.slice(0, -1)).node
            //
            // child.className = child.className.replace(/\bpass\b/g, "fail")
        } else if (ev.error()) {
            if (r.opts.window.console) {
                var console = r.opts.window.conosle

                if (console.error) console.error(ev.value)
                else if (console.log) console.log(ev.value)
                else onNextRepaint(r, function () { throw ev.value })
            } else {
                onNextRepaint(r, function () { throw ev.value })
            }
        }
    },
})
