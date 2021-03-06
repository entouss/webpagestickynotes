/*
 * jQuery UI Color Picker Widget
 *
 * Copyright 2012, Olav Andreas Lindekleiv (http://lindekleiv.com/)
 * Available under the BSD License
 * See the LICENSE file or http://opensource.org/licenses/BSD-3-Clause
 *
 * Available on BitBucket at
 * https://bitbucket.org/lindekleiv/jquery-ui-colorpicker
 */

var __indexOf = Array.prototype.indexOf || function(a) {
    for (var b = 0, c = this.length; b < c; b++) {
        if (b in this && this[b] === a)
            return b
    }
    return -1
}
;
$.widget("oal.colorPicker", {
    options: {
        size: 250,
        format: "hsla"
    },
    _create: function() {
        var a, b, c = this;
        this.lightness = 0;
        this.alpha = 1;
        this.fromCenter = 0;
        this.pickerPos = [0, 0];
        this.parent = $('<div class="colorpicker"></div>');
        this.parent.css({
            width: this.options.size + 36
        });
        this.element.addClass("colorInput");
        this.element.css({
            width: this.options.size + 36
        });
        this.element.wrap(this.parent);
        this.canvasId = "colorpicker" + parseInt(Math.random() * 9999);
        this.wheel = $("<canvas id='" + this.canvasId + "' width='" + this.options.size + "' height='" + this.options.size + "'></canvas>");
        this.element.before(this.wheel);
        this._draw();
        b = $('<div class="circle lightness"></div>').css({
            width: this.options.size,
            height: this.options.size
        });
        this.element.before(b);
        a = $('<div class="circle alpha"></div>').css({
            width: this.options.size,
            height: this.options.size
        });
        this.element.before(a);
        this.lightnessSlider = $('<div class="lightness slider"><span class="handle"></span></div>').css({
            height: this.options.size
        });
        this.element.before(this.lightnessSlider);

        this.lightnessSlider.find("span.handle").draggable({
            containment: "parent",
            drag: function(a, b) {
                return c._setLightness(b.position.top, true)
            },
            //Added
            stop: function(event, ui){
      				c.element.trigger('change');
      			}
        });
        this.alphaSlider = $('<div class="alpha slider"><span class="handle"></span></div>').css({
            height: this.options.size
        });
        this.element.before(this.alphaSlider);
        this.alphaSlider.find("span.handle").draggable({
            containment: "parent",
            drag: function(a, b) {
                return c._setAlpha(b.position.top, true)
            },
            //Added
            stop: function(event, ui){
      				c.element.trigger('change');
      			}
        });
        this.picker = $('<span class="picker"></span>').css({
            top: this.options.size / 2,
            left: this.options.size / 2
        });
        this.element.before(this.picker);
        this.picker.draggable({
            drag: function(a, b) {
                var d, e;
                d = b.position.left - c.options.size / 2;
                e = b.position.top - c.options.size / 2;
                return c._setHue(d, e, true)
            },
            //Added
            stop: function(event, ui){
      				c.element.trigger('change');
      			}
        });
        this.element.on("change", function() {
            var a, b, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u;
            d = c.element.val();
            if (d.indexOf("hsla(") === 0) {
                i = /^hsla\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)\)$/;
                n = i.exec(d),
                g = n[0],
                f = n[1],
                m = n[2],
                h = n[3],
                a = n[4];
                return c.setColor(f, m, h, a)
            } else if (d.indexOf("hsl(") === 0) {
                i = /^hsl\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%\)$/;
                o = i.exec(d),
                g = o[0],
                f = o[1],
                m = o[2],
                h = o[3];
                return c.setColor(f, m, h)
            } else if (d.indexOf("rgba(") === 0) {
                i = /^rgba\((\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d?.\d{1,2})\)$/;
                p = i.exec(d),
                l = p[0],
                j = p[1],
                e = p[2],
                b = p[3],
                a = p[4];
                q = c._toHsla(j, e, b, a),
                f = q[0],
                m = q[1],
                h = q[2],
                a = q[3];
                return c.setColor(f, m, h, a)
            } else if (d.indexOf("rgb(") === 0) {
                i = /^rgb\((\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d{1,3})\)$/;
                r = i.exec(d),
                k = r[0],
                j = r[1],
                e = r[2],
                b = r[3];
                s = c._toHsla(j, e, b),
                f = s[0],
                m = s[1],
                h = s[2],
                a = s[3];
                return c.setColor(f, m, h, a)
            } else if (d.indexOf("#") === 0 && d.length === 4) {
                j = parseInt(d[1] + d[1], 16);
                e = parseInt(d[2] + d[2], 16);
                b = parseInt(d[3] + d[3], 16);
                t = c._toHsla(j, e, b),
                f = t[0],
                m = t[1],
                h = t[2],
                a = t[3];
                return c.setColor(f, m, h, a)
            } else if (d.indexOf("#") === 0 && d.length === 7) {
                j = parseInt(d[1] + d[2], 16);
                e = parseInt(d[3] + d[4], 16);
                b = parseInt(d[5] + d[6], 16);
                u = c._toHsla(j, e, b),
                f = u[0],
                m = u[1],
                h = u[2],
                a = u[3];
                return c.setColor(f, m, h, a)
            }
        });
        a.on("click", function(a) {
            var b, d, e;
            b = $(a.target).offset();
            d = a.clientX - b.left - c.options.size / 2;
            e = a.clientY - b.top - c.options.size / 2;
            c._setHue(d, e);
            var r = c._update();
            c.element.trigger('change');
            return r;
        });
        this.lightnessSlider.on("click", function(a) {
            var d;
            d = $(a.target).offset();
            b = Math.abs(1 - (a.clientY - d.top) / c.options.size) * 100;
            c._setLightness(b, false);
            return c._update()
        });
        return this.alphaSlider.on("click", function(b) {
            var d;
            d = $(b.target).offset();
            a = Math.abs(1 - (b.clientY - d.top) / c.options.size);
            c._setAlpha(a, false);
            return c._update()
        })
    },
    _draw: function() {
        var a, b, c, d, e, f, g, h;
        b = document.getElementById(this.canvasId);
        a = b.getContext("2d");
        h = this.options.size;
        d = h / 2;
        f = h * 1.25;
        for (e = 0; 0 <= f ? e <= f : e >= f; 0 <= f ? e++ : e--) {
            a.save();
            c = e / f;
            a.strokeStyle = "hsl(" + c * 360 + ",100%,50%)";
            a.translate(d, d);
            a.rotate(Math.PI * 2 * e / f);
            a.beginPath();
            a.lineWidth = 3;
            a.moveTo(0, 0);
            a.lineTo(0, d);
            a.stroke();
            a.restore()
        }
        g = a.createRadialGradient(d, d, 0, d, d, d);
        g.addColorStop(0, "hsl(0, 0%, 50%)");
        g.addColorStop(1, "hsla(0, 0%, 50%, 0)");
        a.fillStyle = g;
        return a.fillRect(0, 0, this.options.size, this.options.size)
    },
    _setHue: function(a, b, c) {
        if (c == null)
            c = false;
        this.fromCenter = Math.sqrt(a * a + b * b);
        this.pickerPos = [a, b];
        if (c) {
            this._update();
            if (this.fromCenter >= this.options.size / 2)
                return false
        } else {
            return this.picker.css({
                top: b + this.options.size / 2,
                left: a + this.options.size / 2
            })
        }
    },
    _setLightness: function(a, b) {
        var c;
        if (b == null)
            b = false;
        if (b) {
            this.lightness = a / this.options.size - .5;
            this._update()
        } else {
            this.lightness = .5 - a / 100;
            this.lightnessSlider.find("span.handle").css({
                top: (this.lightness + .5) * this.options.size
            })
        }
        if (this.lightness < 0) {
            c = "rgba(255,255,255," + Math.abs(this.lightness * 2) + ")"
        } else {
            c = "rgba(0,0,0," + this.lightness * 2 + ")"
        }
        return this.wheel.next().css({
            backgroundColor: c
        })
    },
    _setAlpha: function(a, b) {
        if (b == null)
            b = false;
        if (b) {
            this.alpha = Math.abs(1 - a / this.options.size);
            this._update()
        } else {
            this.alpha = a;
            this.alphaSlider.find("span.handle").css({
                top: Math.abs(1 - this.alpha) * this.options.size
            })
        }
        return this.wheel.next().next().css({
            opacity: Math.abs(1 - this.alpha)
        })
    },
    _generateColor: function() {
        var a, b, c, d;
        b = parseInt(180 - (Math.atan2(this.pickerPos[0], this.pickerPos[1]) + Math.PI) / (Math.PI * 2) * 360);
        if (b < 0)
            b += 360;
        d = this.fromCenter / this.options.size * 100 * 2;
        c = Math.abs(this.lightness - .5) * 100;
        a = this.alpha;
        if (b > 360)
            b = 360;
        if (d > 100)
            d = 100;
        if (c > 100)
            c = 100;
        if (a > 1)
            a = 1;
        d = Math.round(d * 100) / 100;
        c = Math.round(c * 100) / 100;
        a = Math.round(a * 100) / 100;
        return [b, d, c, a]
    },
    _update: function() {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q;
        m = this._generateColor(),
        g = m[0],
        l = m[1],
        h = m[2],
        a = m[3];
        switch (this.options.format) {
        case "hsla":
            d = "hsla(" + g + ", " + l + "%, " + h + "%, " + a + ")";
            break;
        case "hsl":
            d = "hsl(" + g + ", " + l + "%, " + h + "%)";
            break;
        case "rgba":
            n = this._toRgba(g, l, h, a),
            i = n[0],
            e = n[1],
            b = n[2],
            a = n[3];
            d = "rgba(" + i + ", " + e + ", " + b + ", " + a + ")";
            break;
        case "rgb":
            o = this._toRgba(g, l, h),
            i = o[0],
            e = o[1],
            b = o[2],
            a = o[3];
            d = "rgb(" + i + ", " + e + ", " + b + ")";
            break;
        case "hex":
            p = this._toRgba(g, l, h),
            i = p[0],
            e = p[1],
            b = p[2],
            a = p[3];
            k = i.toString(16);
            f = e.toString(16);
            c = b.toString(16);
            if (k.length === 1)
                k = "0" + k;
            if (f.length === 1)
                f = "0" + f;
            if (c.length === 1)
                c = "0" + c;
            d = "#" + k + f + c;
            break;
        default:
            console.error("Color format not supported!")
        }
        this.element.val(d);
        this.element.css('background', d);
        this.picker.css({
            background: d
        });
        if ((q = this.options.format) === "hsl" || q === "hsla") {
            j = {
                hue: g,
                saturation: l,
                lightness: h
            }
        } else {
            j = {
                red: i,
                green: e,
                blue: b
            }
        }
        if (__indexOf.call(this.options.format, "a") >= 0)
            j.alpha = a;
        j.color = d;
        return this._trigger("colorChange", null, j)
    },
    _toRgba: function(a, b, c, d) {
        var e, f, g, h, i, j;
        if (d == null)
            d = 1;
        a = a / 360;
        b = b / 100;
        c = c / 100;
        if (b === 0) {
            j = c;
            f = c;
            e = c
        } else {
            g = function(a, b, c) {
                if (c < 0)
                    c += 1;
                if (c > 1)
                    c -= 1;
                if (c < 1 / 6)
                    return a + (b - a) * 6 * c;
                if (c < 1 / 2)
                    return b;
                if (c < 2 / 3)
                    return a + (b - a) * (2 / 3 - c) * 6;
                return a
            }
            ;
            if (c < .5) {
                i = c * (1 + b)
            } else {
                i = c + b - c * b
            }
            h = 2 * c - i;
            j = g(h, i, a + 1 / 3);
            f = g(h, i, a);
            e = g(h, i, a - 1 / 3)
        }
        return [parseInt(j * 255), parseInt(f * 255), parseInt(e * 255), d]
    },
    _toHsla: function(a, b, c, d) {
        var e, f, g, h, i, j, k;
        if (d == null)
            d = 1;
        a /= 255;
        b /= 255;
        c /= 255;
        i = Math.max(a, b, c);
        j = Math.min(a, b, c);
        g = (i + j) / 2;
        k = g;
        h = g;
        if (i === j) {
            g = 0;
            k = 0
        } else {
            f = i - j;
            if (h > .5) {
                k = f / (2 - i - j)
            } else {
                k = f / (i + j)
            }
            switch (i) {
            case a:
                if (b < c) {
                    e = 6
                } else {
                    e = 0
                }
                g = (b - c) / f + e;
                break;
            case b:
                g = (c - a) / f + 2;
                break;
            case c:
                g = (a - b) / f + 4
            }
            g /= 6
        }
        return [parseInt(g * 360), Math.round(k * 1e3) / 10, Math.round(h * 1e3) / 10, d]
    },
    setColor: function(a, b, c, d) {
        var e, f, g;
        if (d == null)
            d = 1;
        if (typeof a === "string" && (a.indexOf("hsl") === 0 || a.indexOf("rgb") === 0 || a.indexOf("#") === 0)) {
            this.element.val(a);
            this.element.css('background', a);
            this.element.trigger("change");
            return true
        }
        a = parseInt(a);
        a += 90;
        if (a > 360)
            a %= 360;
        if (a > 0) {
            e = b / 100 * (this.options.size / 2);
            f = Math.cos(a / 360 * Math.PI * 2) * e;
            g = Math.sin(a / 360 * Math.PI * 2) * e;
            this._setHue(f, g)
        }
        if (b >= 0 && b <= 100) {
            this.saturation = b
        } else if (b > 100) {
            this.saturation = 100
        } else {
            this.saturation = 0
        }
        if (c > 100) {
            c = 100
        } else if (c < 0) {
            c = 0
        }
        this._setLightness(c);
        if (d > 1) {
            d = 1
        } else if (d < 0) {
            d = 0
        }
        this._setAlpha(d);
        return this._update()
    },
    _setOption: function(a, b) {
        if (a === "format" && (b === "hsla" || b === "hsl" || b === "rgba" || b === "rgb" || b === "hex")) {
            this.options.format = b;
            this._update()
        }
        return $.Widget.prototype._setOption.apply(this, arguments)
    }
})
