'use strict'

# coffeelint:disable=max_line_length

t = require '../../../index.js'

fail = -> @fail 'fail'

t.test 'cli common isObjectLike() passes for objects and functions', fail
t.test 'cli common isObjectLike() fails for other things', fail
t.test 'cli common resolveDefault() gets CJS default functions', fail
t.test 'cli common resolveDefault() gets CJS default functions with `default` property', fail
t.test 'cli common resolveDefault() gets CJS default arrays with `default` property', fail
t.test 'cli common resolveDefault() gets CJS default objects', fail
t.test 'cli common resolveDefault() gets CJS default primitives', fail
t.test 'cli common resolveDefault() gets ES6 default functions', fail
t.test 'cli common resolveDefault() gets ES6 default objects', fail
t.test 'cli common resolveDefault() gets ES6 default arrays', fail
t.test 'cli common resolveDefault() gets ES6 default objects with `default` property', fail
t.test 'cli common resolveDefault() gets ES6 default functions with `default` property', fail
t.test 'cli common resolveDefault() gets ES6 default arrays with `default` property', fail
t.test 'cli common resolveDefault() gets ES6 default primitives', fail
t.test 'cli common normalizeGlob() current directory normalizes a file', fail
t.test 'cli common normalizeGlob() current directory normalizes a glob', fail
t.test 'cli common normalizeGlob() current directory retains trailing slashes', fail
t.test 'cli common normalizeGlob() current directory retains negative', fail
t.test 'cli common normalizeGlob() current directory retains negative + trailing slashes', fail
t.test 'cli common normalizeGlob() absolute directory normalizes a file', fail
t.test 'cli common normalizeGlob() absolute directory normalizes a glob', fail
t.test 'cli common normalizeGlob() absolute directory retains trailing slashes', fail
t.test 'cli common normalizeGlob() absolute directory retains negative', fail
t.test 'cli common normalizeGlob() absolute directory retains negative + trailing slashes', fail
t.test 'cli common normalizeGlob() relative directory normalizes a file', fail
t.test 'cli common normalizeGlob() relative directory normalizes a glob', fail
t.test 'cli common normalizeGlob() relative directory retains trailing slashes', fail
t.test 'cli common normalizeGlob() relative directory retains negative', fail
t.test 'cli common normalizeGlob() relative directory retains negative + trailing slashes', fail
t.test 'cli common normalizeGlob() edge cases normalizes `.` with a cwd of `.`', fail
t.test 'cli common normalizeGlob() edge cases normalizes `..` with a cwd of `.`', fail
t.test 'cli common normalizeGlob() edge cases normalizes `.` with a cwd of `..`', fail
t.test 'cli common normalizeGlob() edge cases normalizes directories with a cwd of `..`', fail
t.test 'cli common normalizeGlob() edge cases removes excess `.`', fail
t.test 'cli common normalizeGlob() edge cases removes excess `..`', fail
t.test 'cli common normalizeGlob() edge cases removes excess combined junk', fail
t.test 'cli common globParent() strips glob magic to return parent path', fail
t.test 'cli common globParent() returns parent dirname from non-glob paths', fail
t.test 'cli common globParent() gets a base name', fail
t.test 'cli common globParent() gets a base name from a nested glob', fail
t.test 'cli common globParent() gets a base name from a flat file', fail
t.test 'cli common globParent() gets a base name from character class pattern', fail
t.test 'cli common globParent() gets a base name from brace , expansion', fail
t.test 'cli common globParent() gets a base name from brace .. expansion', fail
t.test 'cli common globParent() gets a base name from extglob', fail
t.test 'cli common globParent() gets a base name from a complex brace glob', fail
