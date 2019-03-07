'use strict';
var _pwmeta1 = (ptnidx, content, filepath, line, extra) => {
    const version = 2, patterns = [
            {
                pattern: 'assert(value, [message])',
                args: [
                    {
                        index: 0,
                        name: 'value',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.ok(value, [message])',
                args: [
                    {
                        index: 0,
                        name: 'value',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.equal(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.notEqual(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.strictEqual(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.notStrictEqual(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.deepEqual(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.notDeepEqual(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.deepStrictEqual(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            },
            {
                pattern: 'assert.notDeepStrictEqual(actual, expected, [message])',
                args: [
                    {
                        index: 0,
                        name: 'actual',
                        kind: 'mandatory'
                    },
                    {
                        index: 1,
                        name: 'expected',
                        kind: 'mandatory'
                    },
                    {
                        index: 2,
                        name: 'message',
                        kind: 'optional',
                        message: true
                    }
                ]
            }
        ];
    return Object.assign({
        version,
        content,
        filepath,
        line
    }, extra, patterns[ptnidx]);
};
var _am1 = _pwmeta1(0, 'assert(5 < actual && actual < 13)', 'path/to/some_test.js', 3);
var _ArgumentRecorder1 = function () {
    const isPromiseLike = o => o !== null && typeof o === 'object' && typeof o.then === 'function' && typeof o.catch === 'function';
    const mark = (_this, s) => {
        return function () {
            const args = Array.from(arguments);
            _this.status = s;
            _this.value = args.length === 1 ? args[0] : args;
        };
    };
    class $Promise$ {
        constructor(prms) {
            this.status = 'pending';
            prms.then(mark(this, 'resolved'), mark(this, 'rejected'));
        }
    }
    const wrap = v => isPromiseLike(v) ? new $Promise$(v) : v;
    class ArgumentRecorder {
        constructor(callee, am, matchIndex) {
            this._callee = callee;
            this._am = am;
            this._logs = [];
            this._recorded = null;
            this._val = null;
            this._idx = matchIndex;
            const argconf = am.args[matchIndex];
            this._isBlock = !!argconf.block;
        }
        metadata() {
            return this._am;
        }
        matchIndex() {
            return this._idx;
        }
        val() {
            return this._val;
        }
        _tap(value, espath) {
            this._logs.push({
                value: wrap(value),
                espath
            });
            return value;
        }
        _rec(value, espath) {
            const empowered = this._callee && this._callee._empowered;
            try {
                if (!empowered)
                    return value;
                const log = {
                    value: wrap(value),
                    espath
                };
                this._logs.push(log);
                if (this._isBlock && empowered && typeof value === 'function') {
                    value = new Proxy(value, {
                        apply(target, thisArg, args) {
                            try {
                                const ret = target.apply(thisArg, args);
                                log.value = wrap(ret);
                                return ret;
                            } catch (e) {
                                log.value = e;
                                throw e;
                            }
                        }
                    });
                }
                this._recorded = {
                    value,
                    logs: [].concat(this._logs)
                };
                return this;
            } finally {
                this._val = value;
                this._logs = [];
            }
        }
        eject() {
            const ret = this._recorded;
            this._recorded = null;
            this._val = null;
            return ret;
        }
    }
    return ArgumentRecorder;
}();
var _ag1 = new _ArgumentRecorder1(assert, _am1, 0);
var _am2 = _pwmeta1(1, 'assert.ok(actual < 5 || 13 < actual)', 'path/to/some_test.js', 5);
var _ag2 = new _ArgumentRecorder1(assert.ok, _am2, 0);
var _am3 = _pwmeta1(0, 'assert(2 > actual && actual < 13)', 'path/to/some_test.js', 7);
var _ag3 = new _ArgumentRecorder1(assert, _am3, 0);
var _am4 = _pwmeta1(0, 'assert(2 > actual && actual < 13)', 'path/to/some_test.js', 9);
var _ag4 = new _ArgumentRecorder1(assert, _am4, 0);
var _am5 = _pwmeta1(2, 'assert.equal(5 < actual && actual < 13, falsy)', 'path/to/some_test.js', 11);
var _ag5 = new _ArgumentRecorder1(assert.equal, _am5, 0);
var _ag6 = new _ArgumentRecorder1(assert.equal, _am5, 1);
assert(_ag1._rec(_ag1._tap(5 < _ag1._tap(actual, 'arguments/0/left/right'), 'arguments/0/left') && _ag1._tap(_ag1._tap(actual, 'arguments/0/right/left') < 13, 'arguments/0/right'), 'arguments/0'));
assert.ok(_ag2._rec(_ag2._tap(_ag2._tap(actual, 'arguments/0/left/left') < 5, 'arguments/0/left') || _ag2._tap(13 < _ag2._tap(actual, 'arguments/0/right/right'), 'arguments/0/right'), 'arguments/0'));
assert(_ag3._rec(_ag3._tap(2 > _ag3._tap(actual, 'arguments/0/left/right'), 'arguments/0/left') && _ag3._tap(_ag3._tap(actual, 'arguments/0/right/left') < 13, 'arguments/0/right'), 'arguments/0'));
assert(_ag4._rec(_ag4._tap(2 > _ag4._tap(actual, 'arguments/0/left/right'), 'arguments/0/left') && _ag4._tap(_ag4._tap(actual, 'arguments/0/right/left') < 13, 'arguments/0/right'), 'arguments/0'));
assert.equal(_ag5._rec(_ag5._tap(5 < _ag5._tap(actual, 'arguments/0/left/right'), 'arguments/0/left') && _ag5._tap(_ag5._tap(actual, 'arguments/0/right/left') < 13, 'arguments/0/right'), 'arguments/0'), _ag6._rec(falsy, 'arguments/1'));
