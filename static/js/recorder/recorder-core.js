/*
录音
https://github.com/xiangyuecn/Recorder
src: recorder-core.js
*/
!function (y) {
    "use strict";
    var h = function () {
    }, A = function (e) {
        return new t(e)
    };
    A.IsOpen = function () {
        var e = A.Stream;
        if (e) {
            var t = e.getTracks && e.getTracks() || e.audioTracks || [], n = t[0];
            if (n) {
                var r = n.readyState;
                return "live" == r || r == n.LIVE
            }
        }
        return !1
    }, A.BufferSize = 4096, A.Destroy = function () {
        for (var e in M("Recorder Destroy"), g(), n) n[e]()
    };
    var n = {};
    A.BindDestroy = function (e, t) {
        n[e] = t
    }, A.Support = function () {
        var e = y.AudioContext;
        if (e || (e = y.webkitAudioContext), !e) return !1;
        var t = navigator.mediaDevices || {};
        return t.getUserMedia || (t = navigator).getUserMedia || (t.getUserMedia = t.webkitGetUserMedia || t.mozGetUserMedia || t.msGetUserMedia), !!t.getUserMedia && (A.Scope = t, A.Ctx && "closed" != A.Ctx.state || (A.Ctx = new e, A.BindDestroy("Ctx", function () {
            var e = A.Ctx;
            e && e.close && (e.close(), A.Ctx = 0)
        })), !0)
    };
    var k = "ConnectEnableWorklet";
    A[k] = !1;
    var d = function (e) {
        var t = (e = e || A).BufferSize || A.BufferSize, r = A.Ctx, n = e.Stream,
            a = n._m = r.createMediaStreamSource(n), u = n._call, o = function (e, t) {
                if (!t || h) for (var n in u) {
                    for (var r = t || e.inputBuffer.getChannelData(0), a = r.length, o = new Int16Array(a), s = 0, i = 0; i < a; i++) {
                        var c = Math.max(-1, Math.min(1, r[i]));
                        c = c < 0 ? 32768 * c : 32767 * c, o[i] = c, s += Math.abs(c)
                    }
                    for (var f in u) u[f](o, s);
                    return
                } else M(l + "多余回调", 3)
            }, s = "ScriptProcessor", l = "audioWorklet", i = "Recorder", c = i + " " + l, f = "RecProc",
            p = r.createScriptProcessor || r.createJavaScriptNode,
            v = "。由于" + l + "内部1秒375次回调，在移动端可能会有性能问题导致回调丢失录音变短，PC端无影响，暂不建议开启" + l + "。", m = function () {
                h = n.isWorklet = !1, I(n), M("Connect采用老的" + s + "，" + (A[k] ? "但已" : "可") + "设置" + i + "." + k + "=true尝试启用" + l + v, 3);
                var e = n._p = p.call(r, t, 1, 1);
                a.connect(e), e.connect(r.destination), e.onaudioprocess = function (e) {
                    o(e)
                }
            }, h = n.isWorklet = !p || A[k], d = y.AudioWorkletNode;
        if (h && r[l] && d) {
            var g, S = function () {
                return h && n._na
            }, _ = n._na = function () {
                "" !== g && (clearTimeout(g), g = setTimeout(function () {
                    g = 0, M(l + "未返回任何音频，恢复使用" + s, 3), S() && p && m()
                }, 500))
            }, C = function () {
                if (S()) {
                    var e = n._n = new d(r, f, {processorOptions: {bufferSize: t}});
                    a.connect(e), e.connect(r.destination), e.port.onmessage = function (e) {
                        g && (clearTimeout(g), g = ""), o(0, e.data.val)
                    }, M("Connect采用" + l + "方式，设置" + i + "." + k + "=false可恢复老式" + s + v, 3)
                }
            };
            r.resume()[u && "finally"](function () {
                if (S()) if (r[f]) C(); else {
                    var e, t,
                        n = (t = "class " + f + " extends AudioWorkletProcessor{", t += "constructor " + (e = function (e) {
                            return e.toString().replace(/^function|DEL_/g, "").replace(/\$RA/g, c)
                        })(function (e) {
                            DEL_super(e);
                            var t = this, n = e.processorOptions.bufferSize;
                            t.bufferSize = n, t.buffer = new Float32Array(2 * n), t.pos = 0, t.port.onmessage = function (e) {
                                e.data.kill && (t.kill = !0, console.log("$RA kill call"))
                            }, console.log("$RA .ctor call", e)
                        }), t += "process " + e(function (e, t, n) {
                            var r = this, a = r.bufferSize, o = r.buffer, s = r.pos;
                            if ((e = (e[0] || [])[0] || []).length) {
                                o.set(e, s);
                                var i = ~~((s += e.length) / a) * a;
                                if (i) {
                                    this.port.postMessage({val: o.slice(0, i)});
                                    var c = o.subarray(i, s);
                                    (o = new Float32Array(2 * a)).set(c), s = c.length, r.buffer = o
                                }
                                r.pos = s
                            }
                            return !r.kill
                        }), t += '}try{registerProcessor("' + f + '", ' + f + ')}catch(e){console.error("' + c + '注册失败",e)}', "data:text/javascript;base64," + btoa(unescape(encodeURIComponent(t))));
                    r[l].addModule(n).then(function (e) {
                        S() && (r[f] = 1, C(), g && _())
                    })[u && "catch"](function (e) {
                        M(l + ".addModule失败", 1, e), S() && m()
                    })
                }
            })
        } else m()
    }, I = function (e) {
        e._na = null, e._n && (e._n.port.postMessage({kill: !0}), e._n.disconnect(), e._n = null)
    }, g = function (e) {
        var t = (e = e || A) == A, n = e.Stream;
        if (n && (n._m && (n._m.disconnect(), n._m = null), n._p && (n._p.disconnect(), n._p.onaudioprocess = n._p = null), I(n), t)) {
            for (var r = n.getTracks && n.getTracks() || n.audioTracks || [], a = 0; a < r.length; a++) {
                var o = r[a];
                o.stop && o.stop()
            }
            n.stop && n.stop()
        }
        e.Stream = 0
    };
    A.SampleData = function (e, t, n, r, a) {
        r || (r = {});
        var o = r.index || 0, s = r.offset || 0, i = r.frameNext || [];
        a || (a = {});
        var c = a.frameSize || 1;
        a.frameType && (c = "mp3" == a.frameType ? 1152 : 1);
        for (var f = 0, u = o; u < e.length; u++) f += e[u].length;
        f = Math.max(0, f - Math.floor(s));
        var l = t / n;
        1 < l ? f = Math.floor(f / l) : (l = 1, n = t), f += i.length;
        for (var p = new Int16Array(f), v = 0, u = 0; u < i.length; u++) p[v] = i[u], v++;
        for (var m = e.length; o < m; o++) {
            for (var h = e[o], u = s, d = h.length; u < d;) {
                var g = Math.floor(u), S = Math.ceil(u), _ = u - g, C = h[g],
                    y = S < d ? h[S] : (e[o + 1] || [C])[0] || 0;
                p[v] = C + (y - C) * _, v++, u += l
            }
            s = u - d
        }
        i = null;
        var k = p.length % c;
        if (0 < k) {
            var I = 2 * (p.length - k);
            i = new Int16Array(p.buffer.slice(I)), p = new Int16Array(p.buffer.slice(0, I))
        }
        return {index: o, offset: s, frameNext: i, sampleRate: n, data: p}
    }, A.PowerLevel = function (e, t) {
        var n = e / t || 0;
        return n < 1251 ? Math.round(n / 1250 * 10) : Math.round(Math.min(100, Math.max(0, 100 * (1 + Math.log(n / 1e4) / Math.log(10)))))
    };
    var M = function (e, t) {
        var n = new Date,
            r = ("0" + n.getMinutes()).substr(-2) + ":" + ("0" + n.getSeconds()).substr(-2) + "." + ("00" + n.getMilliseconds()).substr(-3),
            a = this && this.envIn && this.envCheck && this.id,
            o = ["[" + r + " Recorder" + (a ? ":" + a : "") + "]" + e], s = arguments, i = y.console || {}, c = 2,
            f = i.log;
        for ("number" == typeof t ? f = 1 == t ? i.error : 3 == t ? i.warn : f : c = 1; c < s.length; c++) o.push(s[c]);
        u ? f && f("[IsLoser]" + o[0], 1 < o.length ? o : "") : f.apply(i, o)
    }, u = !0;
    try {
        u = !console.log.apply
    } catch (e) {
    }
    A.CLog = M;
    var r = 0;

    function t(e) {
        this.id = ++r, A.Traffic && A.Traffic();
        var t = {type: "mp3", bitRate: 16, sampleRate: 16e3, onProcess: h};
        for (var n in e) t[n] = e[n];
        this.set = t, this._S = 9, this.Sync = {O: 9, C: 9}
    }

    A.Sync = {O: 9, C: 9}, A.prototype = t.prototype = {
        CLog: M, _streamStore: function () {
            return this.set.sourceStream ? this : A
        }, open: function (e, n) {
            var r = this, t = r._streamStore();
            e = e || h;
            var a = function (e, t) {
                t = !!t, r.CLog("录音open失败：" + e + ",isUserNotAllow:" + t, 1), n && n(e, t)
            }, o = function () {
                r.CLog("open ok id:" + r.id), e(), r._SO = 0
            }, s = t.Sync, i = ++s.O, c = s.C;
            r._O = r._O_ = i, r._SO = r._S;
            var f = function () {
                if (c != s.C || !r._O) {
                    var e = "open被取消";
                    return i == s.O ? r.close() : e = "open被中断", a(e), !0
                }
            }, u = r.envCheck({envName: "H5", canProcess: !0});
            if (u) a("不能录音：" + u); else if (r.set.sourceStream) {
                if (!A.Support()) return void a("不支持此浏览器从流中获取录音");
                g(t), r.Stream = r.set.sourceStream, r.Stream._call = {};
                try {
                    d(t)
                } catch (e) {
                    return void a("从流中打开录音失败：" + e.message)
                }
                o()
            } else {
                var l = function (e, t) {
                    try {
                        y.top.a
                    } catch (e) {
                        return void a('无权录音(跨域，请尝试给iframe添加麦克风访问策略，如allow="camera;microphone")')
                    }
                    /Permission|Allow/i.test(e) ? a("用户拒绝了录音权限", !0) : !1 === y.isSecureContext ? a("无权录音(需https)") : /Found/i.test(e) ? a(t + "，无可用麦克风") : a(t)
                };
                if (A.IsOpen()) o(); else if (A.Support()) {
                    var p = function (e) {
                        (A.Stream = e)._call = {}, f() || setTimeout(function () {
                            f() || (A.IsOpen() ? (d(), o()) : a("录音功能无效：无音频流"))
                        }, 100)
                    }, v = function (e) {
                        var t = e.name || e.message || e.code + ":" + e;
                        r.CLog("请求录音权限错误", 1, e), l(t, "无法录音：" + t)
                    }, m = A.Scope.getUserMedia({audio: r.set.audioTrackSet || !0}, p, v);
                    m && m.then && m.then(p)[e && "catch"](v)
                } else l("", "此浏览器不支持录音")
            }
        }, close: function (e) {
            e = e || h;
            var t = this, n = t._streamStore();
            t._stop();
            var r = n.Sync;
            if (t._O = 0, t._O_ != r.O) return t.CLog("close被忽略（因为同时open了多个rec，只有最后一个会真正close）", 3), void e();
            r.C++, g(n), t.CLog("close"), e()
        }, mock: function (e, t) {
            var n = this;
            return n._stop(), n.isMock = 1, n.mockEnvInfo = null, n.buffers = [e], n.recSize = e.length, n.srcSampleRate = t, n
        }, envCheck: function (e) {
            var t, n = this.set;
            return t || (this[n.type + "_envCheck"] ? t = this[n.type + "_envCheck"](e, n) : n.takeoffEncodeChunk && (t = n.type + "类型不支持设置takeoffEncodeChunk")), t || ""
        }, envStart: function (e, t) {
            var n = this, r = n.set;
            if (n.isMock = e ? 1 : 0, n.mockEnvInfo = e, n.buffers = [], n.recSize = 0, n.envInLast = 0, n.envInFirst = 0, n.envInFix = 0, n.envInFixTs = [], r.sampleRate = Math.min(t, r.sampleRate), n.srcSampleRate = t, n.engineCtx = 0, n[r.type + "_start"]) {
                var a = n.engineCtx = n[r.type + "_start"](r);
                a && (a.pcmDatas = [], a.pcmSize = 0)
            }
        }, envResume: function () {
            this.envInFixTs = []
        }, envIn: function (e, t) {
            var a = this, o = a.set, s = a.engineCtx, n = a.srcSampleRate, r = e.length, i = A.PowerLevel(t, r),
                c = a.buffers, f = c.length;
            c.push(e);
            var u = c, l = f, p = Date.now(), v = Math.round(r / n * 1e3);
            a.envInLast = p, 1 == a.buffers.length && (a.envInFirst = p - v);
            var m = a.envInFixTs;
            m.splice(0, 0, {t: p, d: v});
            for (var h = p, d = 0, g = 0; g < m.length; g++) {
                var S = m[g];
                if (3e3 < p - S.t) {
                    m.length = g;
                    break
                }
                h = S.t, d += S.d
            }
            var _ = m[1], C = p - h;
            if (C / 3 < C - d && (_ && 1e3 < C || 6 <= m.length)) {
                var y = p - _.t - v;
                if (v / 5 < y) {
                    var k = !o.disableEnvInFix;
                    if (a.CLog("[" + p + "]" + (k ? "" : "未") + "补偿" + y + "ms", 3), a.envInFix += y, k) {
                        var I = new Int16Array(y * n / 1e3);
                        r += I.length, c.push(I)
                    }
                }
            }
            var M = a.recSize, x = r, b = M + x;
            if (a.recSize = b, s) {
                var R = A.SampleData(c, n, o.sampleRate, s.chunkInfo);
                s.chunkInfo = R, b = (M = s.pcmSize) + (x = R.data.length), s.pcmSize = b, c = s.pcmDatas, f = c.length, c.push(R.data), n = R.sampleRate
            }
            var L = Math.round(b / n * 1e3), w = c.length, T = u.length, z = function () {
                for (var e = O ? 0 : -x, t = null == c[0], n = f; n < w; n++) {
                    var r = c[n];
                    null == r ? t = 1 : (e += r.length, s && r.length && a[o.type + "_encode"](s, r))
                }
                if (t && s) for (n = l, u[0] && (n = 0); n < T; n++) u[n] = null;
                t && (e = O ? x : 0, c[0] = null), s ? s.pcmSize += e : a.recSize += e
            }, O = o.onProcess(c, i, L, n, f, z);
            if (!0 === O) {
                var D = 0;
                for (g = f; g < w; g++) null == c[g] ? D = 1 : c[g] = new Int16Array(0);
                D ? a.CLog("未进入异步前不能清除buffers", 3) : s ? s.pcmSize -= x : a.recSize -= x
            } else z()
        }, start: function () {
            var e = this, t = A.Ctx, n = 1;
            if (e.set.sourceStream ? e.Stream || (n = 0) : A.IsOpen() || (n = 0), n) if (e.CLog("开始录音"), e._stop(), e.state = 0, e.envStart(null, t.sampleRate), e._SO && e._SO + 1 != e._S) e.CLog("start被中断", 3); else {
                e._SO = 0;
                var r = function () {
                    e.state = 1, e.resume()
                };
                "suspended" == t.state ? (e.CLog("wait ctx resume..."), e.state = 3, t.resume().then(function () {
                    e.CLog("ctx resume"), 3 == e.state && r()
                })) : r()
            } else e.CLog("未open", 1)
        }, pause: function () {
            var e = this;
            e.state && (e.state = 2, e.CLog("pause"), delete e._streamStore().Stream._call[e.id])
        }, resume: function () {
            var e, n = this;
            if (n.state) {
                n.state = 1, n.CLog("resume"), n.envResume();
                var t = n._streamStore();
                t.Stream._call[n.id] = function (e, t) {
                    1 == n.state && n.envIn(e, t)
                }, (e = (t || A).Stream)._na && e._na()
            }
        }, _stop: function (e) {
            var t = this, n = t.set;
            t.isMock || t._S++, t.state && (t.pause(), t.state = 0), !e && t[n.type + "_stop"] && (t[n.type + "_stop"](t.engineCtx), t.engineCtx = 0)
        }, stop: function (n, t, e) {
            var r, a = this, o = a.set;
            a.CLog("stop " + (a.envInLast ? a.envInLast - a.envInFirst + "ms 补" + a.envInFix + "ms" : "-"));
            var s = function () {
                a._stop(), e && a.close()
            }, i = function (e) {
                a.CLog("结束录音失败：" + e, 1), t && t(e), s()
            }, c = function (e, t) {
                if (a.CLog("结束录音 编码" + (Date.now() - r) + "ms 音频" + t + "ms/" + e.size + "b"), o.takeoffEncodeChunk) a.CLog("启用takeoffEncodeChunk后stop返回的blob长度为0不提供音频数据", 3); else if (e.size < Math.max(100, t / 2)) return void i("生成的" + o.type + "无效");
                n && n(e, t), s()
            };
            if (!a.isMock) {
                var f = 3 == a.state;
                if (!a.state || f) return void i("未开始录音" + (f ? "，开始录音前无用户交互导致AudioContext未运行" : ""));
                a._stop(!0)
            }
            var u = a.recSize;
            if (u) if (a.buffers[0]) if (a[o.type]) {
                if (a.isMock) {
                    var l = a.envCheck(a.mockEnvInfo || {envName: "mock", canProcess: !1});
                    if (l) return void i("录音错误：" + l)
                }
                var p = a.engineCtx;
                if (a[o.type + "_complete"] && p) {
                    var v = Math.round(p.pcmSize / o.sampleRate * 1e3);
                    return r = Date.now(), void a[o.type + "_complete"](p, function (e) {
                        c(e, v)
                    }, i)
                }
                r = Date.now();
                var m = A.SampleData(a.buffers, a.srcSampleRate, o.sampleRate);
                o.sampleRate = m.sampleRate;
                var h = m.data;
                v = Math.round(h.length / o.sampleRate * 1e3), a.CLog("采样" + u + "->" + h.length + " 花:" + (Date.now() - r) + "ms"), setTimeout(function () {
                    r = Date.now(), a[o.type](h, function (e) {
                        c(e, v)
                    }, function (e) {
                        i(e)
                    })
                })
            } else i("未加载" + o.type + "编码器"); else i("音频buffers被释放"); else i("未采集到录音")
        }
    }, y.Recorder && y.Recorder.Destroy(), (y.Recorder = A).LM = "2022-03-05 11:53:19", A.TrafficImgUrl = "//ia.51.la/go1?id=20469973&pvFlag=1", A.Traffic = function () {
        var e = A.TrafficImgUrl;
        if (e) {
            var t = A.Traffic, n = location.href.replace(/#.*/, "");
            if (0 == e.indexOf("//") && (e = /^https:/i.test(n) ? "https:" + e : "http:" + e), !t[n]) {
                t[n] = 1;
                var r = new Image;
                r.src = e, M("Traffic Analysis Image: Recorder.TrafficImgUrl=" + A.TrafficImgUrl)
            }
        }
    }
}(window), "function" == typeof define && define.amd && define(function () {
    return Recorder
}), "object" == typeof module && module.exports && (module.exports = Recorder);