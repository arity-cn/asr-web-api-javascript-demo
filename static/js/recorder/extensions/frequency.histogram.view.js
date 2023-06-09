/*
录音
https://github.com/xiangyuecn/Recorder
src: extensions/frequency.histogram.view.js
*/
!function () {
    "use strict";
    var t = function (t) {
        return new e(t)
    }, e = function (t) {
        var e = this, r = {
            scale: 2,
            fps: 20,
            lineCount: 30,
            widthRatio: .6,
            spaceWidth: 0,
            minHeight: 0,
            position: -1,
            mirrorEnable: !1,
            stripeEnable: !0,
            stripeHeight: 3,
            stripeMargin: 6,
            fallDuration: 1e3,
            stripeFallDuration: 3500,
            linear: [0, "rgba(0,187,17,1)", .5, "rgba(255,215,0,1)", 1, "rgba(255,102,0,1)"],
            stripeLinear: null,
            shadowBlur: 0,
            shadowColor: "#bbb",
            stripeShadowBlur: -1,
            stripeShadowColor: "",
            onDraw: function (t, e) {
            }
        };
        for (var a in t) r[a] = t[a];
        e.set = t = r;
        var i = t.elem;
        i && ("string" == typeof i ? i = document.querySelector(i) : i.length && (i = i[0])), i && (t.width = i.offsetWidth, t.height = i.offsetHeight);
        var o = t.scale, l = t.width * o, n = t.height * o, h = e.elem = document.createElement("div"),
            s = ["", "transform-origin:0 0;", "transform:scale(" + 1 / o + ");"];
        h.innerHTML = '<div style="width:' + t.width + "px;height:" + t.height + 'px;overflow:hidden"><div style="width:' + l + "px;height:" + n + "px;" + s.join("-webkit-") + s.join("-ms-") + s.join("-moz-") + s.join("") + '"><canvas/></div></div>';
        var f = e.canvas = h.querySelector("canvas");
        e.ctx = f.getContext("2d");
        if (f.width = l, f.height = n, i && (i.innerHTML = "", i.appendChild(h)), !Recorder.LibFFT) throw new Error("需要lib.fft.js支持");
        e.fft = Recorder.LibFFT(1024), e.lastH = [], e.stripesH = []
    };
    e.prototype = t.prototype = {
        genLinear: function (t, e, r, a) {
            for (var i = t.createLinearGradient(0, r, 0, a), o = 0; o < e.length;) i.addColorStop(e[o++], e[o++]);
            return i
        }, input: function (t, e, r) {
            var a = this;
            a.sampleRate = r, a.pcmData = t, a.pcmPos = 0, a.inputTime = Date.now(), a.schedule()
        }, schedule: function () {
            var t = this, e = t.set, r = Math.floor(1e3 / e.fps);
            t.timer || (t.timer = setInterval(function () {
                t.schedule()
            }, r));
            var a = Date.now(), i = t.drawTime || 0;
            if (a - t.inputTime > 1.3 * e.stripeFallDuration) return clearInterval(t.timer), void (t.timer = 0);
            if (!(a - i < r)) {
                t.drawTime = a;
                for (var o = t.fft.bufferSize, l = t.pcmData, n = t.pcmPos, h = new Int16Array(o), s = 0; s < o && n < l.length; s++, n++) h[s] = l[n];
                t.pcmPos = n;
                var f = t.fft.transform(h);
                t.draw(f, t.sampleRate)
            }
        }, draw: function (t, e) {
            var r = this, a = r.set, i = r.ctx, o = a.scale, l = a.width * o, n = a.height * o, h = a.lineCount,
                s = r.fft.bufferSize, f = a.position, d = Math.abs(a.position), c = 1 == f ? 0 : n, p = n;
            d < 1 && (c = p /= 2, p = Math.floor(p * (1 + d)), c = Math.floor(0 < f ? c * (1 - d) : c * (1 + d)));
            for (var u = r.lastH, v = r.stripesH, w = Math.ceil(p / (a.fallDuration / (1e3 / a.fps))), g = Math.ceil(p / (a.stripeFallDuration / (1e3 / a.fps))), m = a.stripeMargin * o, M = 1 << (Math.round(Math.log(s) / Math.log(2) + 3) << 1), b = Math.log(M) / Math.log(10), L = 20 * Math.log(32767) / Math.log(10), y = s / 2, S = Math.min(y, Math.floor(5e3 * y / (e / 2))), C = S == y, H = C ? h : Math.round(.8 * h), R = S / H, D = C ? 0 : (y - S) / (h - H), x = 0, F = 0; F < h; F++) {
                var T = Math.ceil(x);
                x += F < H ? R : D;
                for (var B = Math.min(Math.ceil(x), y), E = 0, j = T; j < B; j++) E = Math.max(E, Math.abs(t[j]));
                var I = M < E ? Math.floor(17 * (Math.log(E) / Math.log(10) - b)) : 0, q = p * Math.min(I / L, 1);
                u[F] = (u[F] || 0) - w, q < u[F] && (q = u[F]), q < 0 && (q = 0), u[F] = q;
                var z = v[F] || 0;
                if (q && z < q + m) v[F] = q + m; else {
                    var P = z - g;
                    P < 0 && (P = 0), v[F] = P
                }
            }
            i.clearRect(0, 0, l, n);
            var W = r.genLinear(i, a.linear, c, c - p),
                k = a.stripeLinear && r.genLinear(i, a.stripeLinear, c, c - p) || W,
                A = r.genLinear(i, a.linear, c, c + p),
                G = a.stripeLinear && r.genLinear(i, a.stripeLinear, c, c + p) || A;
            i.shadowBlur = a.shadowBlur * o, i.shadowColor = a.shadowColor;
            var V = a.mirrorEnable, J = V ? 2 * h - 1 : h, K = a.widthRatio, N = a.spaceWidth * o;
            0 != N && (K = (l - N * (J + 1)) / l);
            for (var O = Math.max(1 * o, Math.floor(l * K / J)), Q = (l - J * O) / (J + 1), U = a.minHeight * o, X = V ? l / 2 - (Q + O / 2) : 0, Y = (F = 0, X); F < h; F++) Y += Q, $ = Math.floor(Y), q = Math.max(u[F], U), 0 != c && (_ = c - q, i.fillStyle = W, i.fillRect($, _, O, q)), c != n && (i.fillStyle = A, i.fillRect($, c, O, q)), Y += O;
            if (a.stripeEnable) {
                var Z = a.stripeShadowBlur;
                i.shadowBlur = (-1 == Z ? a.shadowBlur : Z) * o, i.shadowColor = a.stripeShadowColor || a.shadowColor;
                var $, _, tt = a.stripeHeight * o;
                for (F = 0, Y = X; F < h; F++) Y += Q, $ = Math.floor(Y), q = v[F], 0 != c && ((_ = c - q - tt) < 0 && (_ = 0), i.fillStyle = k, i.fillRect($, _, O, tt)), c != n && (n < (_ = c + q) + tt && (_ = n - tt), i.fillStyle = G, i.fillRect($, _, O, tt)), Y += O
            }
            if (V) {
                var et = Math.floor(l / 2);
                i.save(), i.scale(-1, 1), i.drawImage(r.canvas, Math.ceil(l / 2), 0, et, n, -et, 0, et, n), i.restore()
            }
            a.onDraw(t, e)
        }
    }, Recorder.FrequencyHistogramView = t
}();