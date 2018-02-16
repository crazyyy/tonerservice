(function(modules) {
  var installedModules = {};

  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;
    var module = installedModules[moduleId] = {
      exports: {},
      id: moduleId,
      loaded: false
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.loaded = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.p = "/";
  return __webpack_require__(0);
})([function(module, exports, __webpack_require__) {
  __webpack_require__(4);
  __webpack_require__(5);
  __webpack_require__(6);
  __webpack_require__(7);
  __webpack_require__(8);
  __webpack_require__(9);
  __webpack_require__(1);
  __webpack_require__(10);
  __webpack_require__(11);
  __webpack_require__(12);
  __webpack_require__(13);
  __webpack_require__(14);
  __webpack_require__(15);
  __webpack_require__(16);
  module.exports = __webpack_require__(17);
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = {};
  var modules = {};
  var primary = [];
  var secondary = window.Webflow || [];
  var jQuery = window.jQuery;
  var jQuerywin = jQuery(window);
  var jQuerydoc = jQuery(document);
  var isFunction = jQuery.isFunction;
  var _ = Webflow._ = __webpack_require__(18);
  var tram = __webpack_require__(3) && jQuery.tram;
  var domready = false;
  var destroyed = false;
  var Modernizr = window.Modernizr;
  var noop = function() {};
  tram.config.hideBackface = false;
  tram.config.keepInherited = true;
  Webflow.define = function(name, factory, options) {
    if (modules[name]) unbindModule(modules[name]);
    var instance = modules[name] = factory(jQuery, _, options) || {};
    bindModule(instance);
    return instance;
  };
  Webflow.require = function(name) {
    return modules[name];
  };

  function bindModule(module) {
    if (Webflow.env()) {
      isFunction(module.design) && jQuerywin.on('__wf_design', module.design);
      isFunction(module.preview) && jQuerywin.on('__wf_preview', module.preview);
    }
    isFunction(module.destroy) && jQuerywin.on('__wf_destroy', module.destroy);
    if (module.ready && isFunction(module.ready)) {
      addReady(module);
    }
  }

  function addReady(module) {
    if (domready) {
      module.ready();
      return;
    }
    if (_.contains(primary, module.ready)) return;
    primary.push(module.ready);
  }

  function unbindModule(module) {
    isFunction(module.design) && jQuerywin.off('__wf_design', module.design);
    isFunction(module.preview) && jQuerywin.off('__wf_preview', module.preview);
    isFunction(module.destroy) && jQuerywin.off('__wf_destroy', module.destroy);
    if (module.ready && isFunction(module.ready)) {
      removeReady(module);
    }
  }

  function removeReady(module) {
    primary = _.filter(primary, function(readyFn) {
      return readyFn !== module.ready;
    });
  }
  Webflow.push = function(ready) {
    if (domready) {
      isFunction(ready) && ready();
      return;
    }
    secondary.push(ready);
  };
  Webflow.env = function(mode) {
    var designFlag = window.__wf_design;
    var inApp = typeof designFlag !== 'undefined';
    if (!mode) return inApp;
    if (mode === 'design') return inApp && designFlag;
    if (mode === 'preview') return inApp && !designFlag;
    if (mode === 'slug') return inApp && window.__wf_slug;
    if (mode === 'editor') return window.WebflowEditor;
    if (mode === 'test') return window.__wf_test;
    if (mode === 'frame') return window !== window.top;
  };
  var userAgent = navigator.userAgent.toLowerCase();
  var appVersion = navigator.appVersion.toLowerCase();
  var touch = Webflow.env.touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch;
  var chrome = Webflow.env.chrome = /chrome/.test(userAgent) && /Google/.test(navigator.vendor) && parseInt(appVersion.match(/chrome\/(\d+)\./)[1], 10);
  var ios = Webflow.env.ios = Modernizr && Modernizr.ios;
  Webflow.env.safari = /safari/.test(userAgent) && !chrome && !ios;
  var touchTarget;
  touch && jQuerydoc.on('touchstart mousedown', function(evt) {
    touchTarget = evt.target;
  });
  Webflow.validClick = touch ? function(clickTarget) {
    return clickTarget === touchTarget || jQuery.contains(clickTarget, touchTarget);
  } : function() {
    return true;
  };
  var resizeEvents = 'resize.webflow orientationchange.webflow load.webflow';
  var scrollEvents = 'scroll.webflow ' + resizeEvents;
  Webflow.resize = eventProxy(jQuerywin, resizeEvents);
  Webflow.scroll = eventProxy(jQuerywin, scrollEvents);
  Webflow.redraw = eventProxy();

  function eventProxy(target, types) {
    var handlers = [];
    var proxy = {};
    proxy.up = _.throttle(function(evt) {
      _.each(handlers, function(h) {
        h(evt);
      });
    });
    if (target && types) target.on(types, proxy.up);
    proxy.on = function(handler) {
      if (typeof handler !== 'function') return;
      if (_.contains(handlers, handler)) return;
      handlers.push(handler);
    };
    proxy.off = function(handler) {
      if (!arguments.length) {
        handlers = [];
        return;
      }
      handlers = _.filter(handlers, function(h) {
        return h !== handler;
      });
    };
    return proxy;
  }
  Webflow.location = function(url) {
    window.location = url;
  };
  Webflow.app = Webflow.env() ? {} : null;
  if (Webflow.app) {
    var redraw = new Event('__wf_redraw');
    Webflow.app.redrawElement = function(i, el) {
      el.dispatchEvent(redraw);
    };
    Webflow.location = function(url) {
      window.dispatchEvent(new CustomEvent('__wf_location', {
        detail: url
      }));
    };
  }
  Webflow.ready = function() {
    domready = true;
    if (destroyed) {
      restoreModules();
    } else {
      _.each(primary, callReady);
    }
    _.each(secondary, callReady);
    Webflow.resize.up();
  };

  function callReady(readyFn) {
    isFunction(readyFn) && readyFn();
  }

  function restoreModules() {
    destroyed = false;
    _.each(modules, bindModule);
  }
  var deferLoad;
  Webflow.load = function(handler) {
    deferLoad.then(handler);
  };

  function bindLoad() {
    if (deferLoad) {
      deferLoad.reject();
      jQuerywin.off('load', deferLoad.resolve);
    }
    deferLoad = new jQuery.Deferred();
    jQuerywin.on('load', deferLoad.resolve);
  }
  Webflow.destroy = function(options) {
    options = options || {};
    destroyed = true;
    jQuerywin.triggerHandler('__wf_destroy');
    if (options.domready != null) {
      domready = options.domready;
    }
    _.each(modules, unbindModule);
    Webflow.resize.off();
    Webflow.scroll.off();
    Webflow.redraw.off();
    primary = [];
    secondary = [];
    if (deferLoad.state() === 'pending') bindLoad();
  };
  jQuery(Webflow.ready);
  bindLoad();
  module.exports = window.Webflow = Webflow;
}, function(module, exports) {
  'use strict';
  var jQuery = window.jQuery;
  var api = {};
  var eventQueue = [];
  var namespace = '.w-ix';
  var eventTriggers = {
    reset: function(i, el) {
      el.__wf_intro = null;
    },
    intro: function(i, el) {
      if (el.__wf_intro) return;
      el.__wf_intro = true;
      jQuery(el).triggerHandler(api.types.INTRO);
    },
    outro: function(i, el) {
      if (!el.__wf_intro) return;
      el.__wf_intro = null;
      jQuery(el).triggerHandler(api.types.OUTRO);
    }
  };
  api.triggers = {};
  api.types = {
    INTRO: 'w-ix-intro' + namespace,
    OUTRO: 'w-ix-outro' + namespace
  };
  api.init = function() {
    var count = eventQueue.length;
    for (var i = 0; i < count; i++) {
      var memo = eventQueue[i];
      memo[0](0, memo[1]);
    }
    eventQueue = [];
    jQuery.extend(api.triggers, eventTriggers);
  };
  api.async = function() {
    for (var key in eventTriggers) {
      var func = eventTriggers[key];
      if (!eventTriggers.hasOwnProperty(key)) continue;
      api.triggers[key] = function(i, el) {
        eventQueue.push([func, el]);
      };
    }
  };
  api.async();
  module.exports = api;
}, function(module, exports) {
  window.tram = function(a) {
    function b(a, b) {
      var c = new L.Bare;
      return c.init(a, b)
    }

    function c(a) {
      return a.replace(/[A-Z]/g, function(a) {
        return "-" + a.toLowerCase()
      })
    }

    function d(a) {
      var b = parseInt(a.slice(1), 16),
        c = b >> 16 & 255,
        d = b >> 8 & 255,
        e = 255 & b;
      return [c, d, e]
    }

    function e(a, b, c) {
      return "#" + (1 << 24 | a << 16 | b << 8 | c).toString(16).slice(1)
    }

    function f() {}

    function g(a, b) {
      _("Type warning: Expected: [" + a + "] Got: [" + typeof b + "] " + b)
    }

    function h(a, b, c) {
      _("Units do not match [" + a + "]: " + b + ", " + c)
    }

    function i(a, b, c) {
      if (void 0 !== b && (c = b), void 0 === a) return c;
      var d = c;
      return Z.test(a) || !jQuery.test(a) ? d = parseInt(a, 10) : jQuery.test(a) && (d = 1e3 * parseFloat(a)), 0 > d && (d = 0), d === d ? d : c
    }

    function j(a) {
      for (var b = -1, c = a ? a.length : 0, d = []; ++b < c;) {
        var e = a[b];
        e && d.push(e)
      }
      return d
    }
    var k = function(a, b, c) {
        function d(a) {
          return "object" == typeof a
        }

        function e(a) {
          return "function" == typeof a
        }

        function f() {}

        function g(h, i) {
          function j() {
            var a = new k;
            return e(a.init) && a.init.apply(a, arguments), a
          }

          function k() {}
          i === c && (i = h, h = Object), j.Bare = k;
          var l, m = f[a] = h[a],
            n = k[a] = j[a] = new f;
          return n.constructor = j, j.mixin = function(b) {
            return k[a] = j[a] = g(j, b)[a], j
          }, j.open = function(a) {
            if (l = {}, e(a) ? l = a.call(j, n, m, j, h) : d(a) && (l = a), d(l))
              for (var c in l) b.call(l, c) && (n[c] = l[c]);
            return e(n.init) || (n.init = h), j
          }, j.open(i)
        }
        return g
      }("prototype", {}.hasOwnProperty),
      l = {
        ease: ["ease", function(a, b, c, d) {
          var e = (a /= d) * a,
            f = e * a;
          return b + c * (-2.75 * f * e + 11 * e * e + -15.5 * f + 8 * e + .25 * a)
        }],
        "ease-in": ["ease-in", function(a, b, c, d) {
          var e = (a /= d) * a,
            f = e * a;
          return b + c * (-1 * f * e + 3 * e * e + -3 * f + 2 * e)
        }],
        "ease-out": ["ease-out", function(a, b, c, d) {
          var e = (a /= d) * a,
            f = e * a;
          return b + c * (.3 * f * e + -1.6 * e * e + 2.2 * f + -1.8 * e + 1.9 * a)
        }],
        "ease-in-out": ["ease-in-out", function(a, b, c, d) {
          var e = (a /= d) * a,
            f = e * a;
          return b + c * (2 * f * e + -5 * e * e + 2 * f + 2 * e)
        }],
        linear: ["linear", function(a, b, c, d) {
          return c * a / d + b
        }],
        "ease-in-quad": ["cubic-bezier(0.550, 0.085, 0.680, 0.530)", function(a, b, c, d) {
          return c * (a /= d) * a + b
        }],
        "ease-out-quad": ["cubic-bezier(0.250, 0.460, 0.450, 0.940)", function(a, b, c, d) {
          return -c * (a /= d) * (a - 2) + b
        }],
        "ease-in-out-quad": ["cubic-bezier(0.455, 0.030, 0.515, 0.955)", function(a, b, c, d) {
          return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
        }],
        "ease-in-cubic": ["cubic-bezier(0.550, 0.055, 0.675, 0.190)", function(a, b, c, d) {
          return c * (a /= d) * a * a + b
        }],
        "ease-out-cubic": ["cubic-bezier(0.215, 0.610, 0.355, 1)", function(a, b, c, d) {
          return c * ((a = a / d - 1) * a * a + 1) + b
        }],
        "ease-in-out-cubic": ["cubic-bezier(0.645, 0.045, 0.355, 1)", function(a, b, c, d) {
          return (a /= d / 2) < 1 ? c / 2 * a * a * a + b : c / 2 * ((a -= 2) * a * a + 2) + b
        }],
        "ease-in-quart": ["cubic-bezier(0.895, 0.030, 0.685, 0.220)", function(a, b, c, d) {
          return c * (a /= d) * a * a * a + b
        }],
        "ease-out-quart": ["cubic-bezier(0.165, 0.840, 0.440, 1)", function(a, b, c, d) {
          return -c * ((a = a / d - 1) * a * a * a - 1) + b
        }],
        "ease-in-out-quart": ["cubic-bezier(0.770, 0, 0.175, 1)", function(a, b, c, d) {
          return (a /= d / 2) < 1 ? c / 2 * a * a * a * a + b : -c / 2 * ((a -= 2) * a * a * a - 2) + b
        }],
        "ease-in-quint": ["cubic-bezier(0.755, 0.050, 0.855, 0.060)", function(a, b, c, d) {
          return c * (a /= d) * a * a * a * a + b
        }],
        "ease-out-quint": ["cubic-bezier(0.230, 1, 0.320, 1)", function(a, b, c, d) {
          return c * ((a = a / d - 1) * a * a * a * a + 1) + b
        }],
        "ease-in-out-quint": ["cubic-bezier(0.860, 0, 0.070, 1)", function(a, b, c, d) {
          return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
        }],
        "ease-in-sine": ["cubic-bezier(0.470, 0, 0.745, 0.715)", function(a, b, c, d) {
          return -c * Math.cos(a / d * (Math.PI / 2)) + c + b
        }],
        "ease-out-sine": ["cubic-bezier(0.390, 0.575, 0.565, 1)", function(a, b, c, d) {
          return c * Math.sin(a / d * (Math.PI / 2)) + b
        }],
        "ease-in-out-sine": ["cubic-bezier(0.445, 0.050, 0.550, 0.950)", function(a, b, c, d) {
          return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b
        }],
        "ease-in-expo": ["cubic-bezier(0.950, 0.050, 0.795, 0.035)", function(a, b, c, d) {
          return 0 === a ? b : c * Math.pow(2, 10 * (a / d - 1)) + b
        }],
        "ease-out-expo": ["cubic-bezier(0.190, 1, 0.220, 1)", function(a, b, c, d) {
          return a === d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b
        }],
        "ease-in-out-expo": ["cubic-bezier(1, 0, 0, 1)", function(a, b, c, d) {
          return 0 === a ? b : a === d ? b + c : (a /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (a - 1)) + b : c / 2 * (-Math.pow(2, -10 * --a) + 2) + b
        }],
        "ease-in-circ": ["cubic-bezier(0.600, 0.040, 0.980, 0.335)", function(a, b, c, d) {
          return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b
        }],
        "ease-out-circ": ["cubic-bezier(0.075, 0.820, 0.165, 1)", function(a, b, c, d) {
          return c * Math.sqrt(1 - (a = a / d - 1) * a) + b
        }],
        "ease-in-out-circ": ["cubic-bezier(0.785, 0.135, 0.150, 0.860)", function(a, b, c, d) {
          return (a /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b : c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
        }],
        "ease-in-back": ["cubic-bezier(0.600, -0.280, 0.735, 0.045)", function(a, b, c, d, e) {
          return void 0 === e && (e = 1.70158), c * (a /= d) * a * ((e + 1) * a - e) + b
        }],
        "ease-out-back": ["cubic-bezier(0.175, 0.885, 0.320, 1.275)", function(a, b, c, d, e) {
          return void 0 === e && (e = 1.70158), c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b
        }],
        "ease-in-out-back": ["cubic-bezier(0.680, -0.550, 0.265, 1.550)", function(a, b, c, d, e) {
          return void 0 === e && (e = 1.70158), (a /= d / 2) < 1 ? c / 2 * a * a * (((e *= 1.525) + 1) * a - e) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b
        }]
      },
      m = {
        "ease-in-back": "cubic-bezier(0.600, 0, 0.735, 0.045)",
        "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1)",
        "ease-in-out-back": "cubic-bezier(0.680, 0, 0.265, 1)"
      },
      n = document,
      o = window,
      p = "bkwld-tram",
      q = /[\-\.0-9]/g,
      r = /[A-Z]/,
      s = "number",
      t = /^(rgb|#)/,
      u = /(em|cm|mm|in|pt|pc|px)jQuery/,
      v = /(em|cm|mm|in|pt|pc|px|%)jQuery/,
      w = /(deg|rad|turn)jQuery/,
      x = "unitless",
      y = /(all|none) 0s ease 0s/,
      z = /^(width|height)jQuery/,
      A = " ",
      B = n.createElement("a"),
      C = ["Webkit", "Moz", "O", "ms"],
      D = ["-webkit-", "-moz-", "-o-", "-ms-"],
      E = function(a) {
        if (a in B.style) return {
          dom: a,
          css: a
        };
        var b, c, d = "",
          e = a.split("-");
        for (b = 0; b < e.length; b++) d += e[b].charAt(0).toUpperCase() + e[b].slice(1);
        for (b = 0; b < C.length; b++)
          if (c = C[b] + d, c in B.style) return {
            dom: c,
            css: D[b] + a
          }
      },
      F = b.support = {
        bind: Function.prototype.bind,
        transform: E("transform"),
        transition: E("transition"),
        backface: E("backface-visibility"),
        timing: E("transition-timing-function")
      };
    if (F.transition) {
      var G = F.timing.dom;
      if (B.style[G] = l["ease-in-back"][0], !B.style[G])
        for (var H in m) l[H][0] = m[H]
    }
    var I = b.frame = function() {
        var a = o.requestAnimationFrame || o.webkitRequestAnimationFrame || o.mozRequestAnimationFrame || o.oRequestAnimationFrame || o.msRequestAnimationFrame;
        return a && F.bind ? a.bind(o) : function(a) {
          o.setTimeout(a, 16)
        }
      }(),
      J = b.now = function() {
        var a = o.performance,
          b = a && (a.now || a.webkitNow || a.msNow || a.mozNow);
        return b && F.bind ? b.bind(a) : Date.now || function() {
          return +new Date
        }
      }(),
      K = k(function(b) {
        function d(a, b) {
          var c = j(("" + a).split(A)),
            d = c[0];
          b = b || {};
          var e = X[d];
          if (!e) return _("Unsupported property: " + d);
          if (!b.weak || !this.props[d]) {
            var f = e[0],
              g = this.props[d];
            return g || (g = this.props[d] = new f.Bare), g.init(this.jQueryel, c, e, b), g
          }
        }

        function e(a, b, c) {
          if (a) {
            var e = typeof a;
            if (b || (this.timer && this.timer.destroy(), this.queue = [], this.active = !1), "number" == e && b) return this.timer = new R({
              duration: a,
              context: this,
              complete: h
            }), void(this.active = !0);
            if ("string" == e && b) {
              switch (a) {
                case "hide":
                  n.call(this);
                  break;
                case "stop":
                  k.call(this);
                  break;
                case "redraw":
                  o.call(this);
                  break;
                default:
                  d.call(this, a, c && c[1])
              }
              return h.call(this)
            }
            if ("function" == e) return void a.call(this, this);
            if ("object" == e) {
              var f = 0;
              t.call(this, a, function(a, b) {
                a.span > f && (f = a.span), a.stop(), a.animate(b)
              }, function(a) {
                "wait" in a && (f = i(a.wait, 0))
              }), s.call(this), f > 0 && (this.timer = new R({
                duration: f,
                context: this
              }), this.active = !0, b && (this.timer.complete = h));
              var g = this,
                j = !1,
                l = {};
              I(function() {
                t.call(g, a, function(a) {
                  a.active && (j = !0, l[a.name] = a.nextStyle)
                }), j && g.jQueryel.css(l)
              })
            }
          }
        }

        function f(a) {
          a = i(a, 0), this.active ? this.queue.push({
            options: a
          }) : (this.timer = new R({
            duration: a,
            context: this,
            complete: h
          }), this.active = !0)
        }

        function g(a) {
          return this.active ? (this.queue.push({
            options: a,
            args: arguments
          }), void(this.timer.complete = h)) : _("No active transition timer. Use start() or wait() before then().")
        }

        function h() {
          if (this.timer && this.timer.destroy(), this.active = !1, this.queue.length) {
            var a = this.queue.shift();
            e.call(this, a.options, !0, a.args)
          }
        }

        function k(a) {
          this.timer && this.timer.destroy(), this.queue = [], this.active = !1;
          var b;
          "string" == typeof a ? (b = {}, b[a] = 1) : b = "object" == typeof a && null != a ? a : this.props, t.call(this, b, u), s.call(this)
        }

        function l(a) {
          k.call(this, a), t.call(this, a, v, w)
        }

        function m(a) {
          "string" != typeof a && (a = "block"), this.el.style.display = a
        }

        function n() {
          k.call(this), this.el.style.display = "none"
        }

        function o() {
          this.el.offsetHeight
        }

        function q() {
          k.call(this), a.removeData(this.el, p), this.jQueryel = this.el = null
        }

        function s() {
          var a, b, c = [];
          this.upstream && c.push(this.upstream);
          for (a in this.props) b = this.props[a], b.active && c.push(b.string);
          c = c.join(","), this.style !== c && (this.style = c, this.el.style[F.transition.dom] = c)
        }

        function t(a, b, e) {
          var f, g, h, i, j = b !== u,
            k = {};
          for (f in a) h = a[f], f in Y ? (k.transform || (k.transform = {}), k.transform[f] = h) : (r.test(f) && (f = c(f)), f in X ? k[f] = h : (i || (i = {}), i[f] = h));
          for (f in k) {
            if (h = k[f], g = this.props[f], !g) {
              if (!j) continue;
              g = d.call(this, f)
            }
            b.call(this, g, h)
          }
          e && i && e.call(this, i)
        }

        function u(a) {
          a.stop()
        }

        function v(a, b) {
          a.set(b)
        }

        function w(a) {
          this.jQueryel.css(a)
        }

        function x(a, c) {
          b[a] = function() {
            return this.children ? z.call(this, c, arguments) : (this.el && c.apply(this, arguments), this)
          }
        }

        function z(a, b) {
          var c, d = this.children.length;
          for (c = 0; d > c; c++) a.apply(this.children[c], b);
          return this
        }
        b.init = function(b) {
          if (this.jQueryel = a(b), this.el = this.jQueryel[0], this.props = {}, this.queue = [], this.style = "", this.active = !1, T.keepInherited && !T.fallback) {
            var c = V(this.el, "transition");
            c && !y.test(c) && (this.upstream = c)
          }
          F.backface && T.hideBackface && U(this.el, F.backface.css, "hidden")
        }, x("add", d), x("start", e), x("wait", f), x("then", g), x("next", h), x("stop", k), x("set", l), x("show", m), x("hide", n), x("redraw", o), x("destroy", q)
      }),
      L = k(K, function(b) {
        function c(b, c) {
          var d = a.data(b, p) || a.data(b, p, new K.Bare);
          return d.el || d.init(b), c ? d.start(c) : d
        }
        b.init = function(b, d) {
          var e = a(b);
          if (!e.length) return this;
          if (1 === e.length) return c(e[0], d);
          var f = [];
          return e.each(function(a, b) {
            f.push(c(b, d))
          }), this.children = f, this
        }
      }),
      M = k(function(a) {
        function b() {
          var a = this.get();
          this.update("auto");
          var b = this.get();
          return this.update(a), b
        }

        function c(a, b, c) {
          return void 0 !== b && (c = b), a in l ? a : c
        }

        function d(a) {
          var b = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(a);
          return (b ? e(b[1], b[2], b[3]) : a).replace(/#(\w)(\w)(\w)jQuery/, "#jQuery1jQuery1jQuery2jQuery2jQuery3jQuery3")
        }
        var f = {
          duration: 500,
          ease: "ease",
          delay: 0
        };
        a.init = function(a, b, d, e) {
          this.jQueryel = a, this.el = a[0];
          var g = b[0];
          d[2] && (g = d[2]), W[g] && (g = W[g]), this.name = g, this.type = d[1], this.duration = i(b[1], this.duration, f.duration), this.ease = c(b[2], this.ease, f.ease), this.delay = i(b[3], this.delay, f.delay), this.span = this.duration + this.delay, this.active = !1, this.nextStyle = null, this.auto = z.test(this.name), this.unit = e.unit || this.unit || T.defaultUnit, this.angle = e.angle || this.angle || T.defaultAngle, T.fallback || e.fallback ? this.animate = this.fallback : (this.animate = this.transition, this.string = this.name + A + this.duration + "ms" + ("ease" != this.ease ? A + l[this.ease][0] : "") + (this.delay ? A + this.delay + "ms" : ""))
        }, a.set = function(a) {
          a = this.convert(a, this.type), this.update(a), this.redraw()
        }, a.transition = function(a) {
          this.active = !0, a = this.convert(a, this.type), this.auto && ("auto" == this.el.style[this.name] && (this.update(this.get()), this.redraw()), "auto" == a && (a = b.call(this))), this.nextStyle = a
        }, a.fallback = function(a) {
          var c = this.el.style[this.name] || this.convert(this.get(), this.type);
          a = this.convert(a, this.type), this.auto && ("auto" == c && (c = this.convert(this.get(), this.type)), "auto" == a && (a = b.call(this))), this.tween = new Q({
            from: c,
            to: a,
            duration: this.duration,
            delay: this.delay,
            ease: this.ease,
            update: this.update,
            context: this
          })
        }, a.get = function() {
          return V(this.el, this.name)
        }, a.update = function(a) {
          U(this.el, this.name, a)
        }, a.stop = function() {
          (this.active || this.nextStyle) && (this.active = !1, this.nextStyle = null, U(this.el, this.name, this.get()));
          var a = this.tween;
          a && a.context && a.destroy()
        }, a.convert = function(a, b) {
          if ("auto" == a && this.auto) return a;
          var c, e = "number" == typeof a,
            f = "string" == typeof a;
          switch (b) {
            case s:
              if (e) return a;
              if (f && "" === a.replace(q, "")) return +a;
              c = "number(unitless)";
              break;
            case t:
              if (f) {
                if ("" === a && this.original) return this.original;
                if (b.test(a)) return "#" == a.charAt(0) && 7 == a.length ? a : d(a)
              }
              c = "hex or rgb string";
              break;
            case u:
              if (e) return a + this.unit;
              if (f && b.test(a)) return a;
              c = "number(px) or string(unit)";
              break;
            case v:
              if (e) return a + this.unit;
              if (f && b.test(a)) return a;
              c = "number(px) or string(unit or %)";
              break;
            case w:
              if (e) return a + this.angle;
              if (f && b.test(a)) return a;
              c = "number(deg) or string(angle)";
              break;
            case x:
              if (e) return a;
              if (f && v.test(a)) return a;
              c = "number(unitless) or string(unit or %)"
          }
          return g(c, a), a
        }, a.redraw = function() {
          this.el.offsetHeight
        }
      }),
      N = k(M, function(a, b) {
        a.init = function() {
          b.init.apply(this, arguments), this.original || (this.original = this.convert(this.get(), t))
        }
      }),
      O = k(M, function(a, b) {
        a.init = function() {
          b.init.apply(this, arguments), this.animate = this.fallback
        }, a.get = function() {
          return this.jQueryel[this.name]()
        }, a.update = function(a) {
          this.jQueryel[this.name](a)
        }
      }),
      P = k(M, function(a, b) {
        function c(a, b) {
          var c, d, e, f, g;
          for (c in a) f = Y[c], e = f[0], d = f[1] || c, g = this.convert(a[c], e), b.call(this, d, g, e)
        }
        a.init = function() {
          b.init.apply(this, arguments), this.current || (this.current = {}, Y.perspective && T.perspective && (this.current.perspective = T.perspective, U(this.el, this.name, this.style(this.current)), this.redraw()))
        }, a.set = function(a) {
          c.call(this, a, function(a, b) {
            this.current[a] = b
          }), U(this.el, this.name, this.style(this.current)), this.redraw()
        }, a.transition = function(a) {
          var b = this.values(a);
          this.tween = new S({
            current: this.current,
            values: b,
            duration: this.duration,
            delay: this.delay,
            ease: this.ease
          });
          var c, d = {};
          for (c in this.current) d[c] = c in b ? b[c] : this.current[c];
          this.active = !0, this.nextStyle = this.style(d)
        }, a.fallback = function(a) {
          var b = this.values(a);
          this.tween = new S({
            current: this.current,
            values: b,
            duration: this.duration,
            delay: this.delay,
            ease: this.ease,
            update: this.update,
            context: this
          })
        }, a.update = function() {
          U(this.el, this.name, this.style(this.current))
        }, a.style = function(a) {
          var b, c = "";
          for (b in a) c += b + "(" + a[b] + ") ";
          return c
        }, a.values = function(a) {
          var b, d = {};
          return c.call(this, a, function(a, c, e) {
            d[a] = c, void 0 === this.current[a] && (b = 0, ~a.indexOf("scale") && (b = 1), this.current[a] = this.convert(b, e))
          }), d
        }
      }),
      Q = k(function(b) {
        function c(a) {
          1 === n.push(a) && I(g)
        }

        function g() {
          var a, b, c, d = n.length;
          if (d)
            for (I(g), b = J(), a = d; a--;) c = n[a], c && c.render(b)
        }

        function i(b) {
          var c, d = a.inArray(b, n);
          d >= 0 && (c = n.slice(d + 1), n.length = d, c.length && (n = n.concat(c)))
        }

        function j(a) {
          return Math.round(a * o) / o
        }

        function k(a, b, c) {
          return e(a[0] + c * (b[0] - a[0]), a[1] + c * (b[1] - a[1]), a[2] + c * (b[2] - a[2]))
        }
        var m = {
          ease: l.ease[1],
          from: 0,
          to: 1
        };
        b.init = function(a) {
          this.duration = a.duration || 0, this.delay = a.delay || 0;
          var b = a.ease || m.ease;
          l[b] && (b = l[b][1]), "function" != typeof b && (b = m.ease), this.ease = b, this.update = a.update || f, this.complete = a.complete || f, this.context = a.context || this, this.name = a.name;
          var c = a.from,
            d = a.to;
          void 0 === c && (c = m.from), void 0 === d && (d = m.to), this.unit = a.unit || "", "number" == typeof c && "number" == typeof d ? (this.begin = c, this.change = d - c) : this.format(d, c), this.value = this.begin + this.unit, this.start = J(), a.autoplay !== !1 && this.play()
        }, b.play = function() {
          this.active || (this.start || (this.start = J()), this.active = !0, c(this))
        }, b.stop = function() {
          this.active && (this.active = !1, i(this))
        }, b.render = function(a) {
          var b, c = a - this.start;
          if (this.delay) {
            if (c <= this.delay) return;
            c -= this.delay
          }
          if (c < this.duration) {
            var d = this.ease(c, 0, 1, this.duration);
            return b = this.startRGB ? k(this.startRGB, this.endRGB, d) : j(this.begin + d * this.change), this.value = b + this.unit, void this.update.call(this.context, this.value)
          }
          b = this.endHex || this.begin + this.change, this.value = b + this.unit, this.update.call(this.context, this.value), this.complete.call(this.context), this.destroy()
        }, b.format = function(a, b) {
          if (b += "", a += "", "#" == a.charAt(0)) return this.startRGB = d(b), this.endRGB = d(a), this.endHex = a, this.begin = 0, void(this.change = 1);
          if (!this.unit) {
            var c = b.replace(q, ""),
              e = a.replace(q, "");
            c !== e && h("tween", b, a), this.unit = c
          }
          b = parseFloat(b), a = parseFloat(a), this.begin = this.value = b, this.change = a - b
        }, b.destroy = function() {
          this.stop(), this.context = null, this.ease = this.update = this.complete = f
        };
        var n = [],
          o = 1e3
      }),
      R = k(Q, function(a) {
        a.init = function(a) {
          this.duration = a.duration || 0, this.complete = a.complete || f, this.context = a.context, this.play()
        }, a.render = function(a) {
          var b = a - this.start;
          b < this.duration || (this.complete.call(this.context), this.destroy())
        }
      }),
      S = k(Q, function(a, b) {
        a.init = function(a) {
          this.context = a.context, this.update = a.update, this.tweens = [], this.current = a.current;
          var b, c;
          for (b in a.values) c = a.values[b], this.current[b] !== c && this.tweens.push(new Q({
            name: b,
            from: this.current[b],
            to: c,
            duration: a.duration,
            delay: a.delay,
            ease: a.ease,
            autoplay: !1
          }));
          this.play()
        }, a.render = function(a) {
          var b, c, d = this.tweens.length,
            e = !1;
          for (b = d; b--;) c = this.tweens[b], c.context && (c.render(a), this.current[c.name] = c.value, e = !0);
          return e ? void(this.update && this.update.call(this.context)) : this.destroy()
        }, a.destroy = function() {
          if (b.destroy.call(this), this.tweens) {
            var a, c = this.tweens.length;
            for (a = c; a--;) this.tweens[a].destroy();
            this.tweens = null, this.current = null
          }
        }
      }),
      T = b.config = {
        defaultUnit: "px",
        defaultAngle: "deg",
        keepInherited: !1,
        hideBackface: !1,
        perspective: "",
        fallback: !F.transition,
        agentTests: []
      };
    b.fallback = function(a) {
      if (!F.transition) return T.fallback = !0;
      T.agentTests.push("(" + a + ")");
      var b = new RegExp(T.agentTests.join("|"), "i");
      T.fallback = b.test(navigator.userAgent)
    }, b.fallback("6.0.[2-5] Safari"), b.tween = function(a) {
      return new Q(a)
    }, b.delay = function(a, b, c) {
      return new R({
        complete: b,
        duration: a,
        context: c
      })
    }, a.fn.tram = function(a) {
      return b.call(null, this, a)
    };
    var U = a.style,
      V = a.css,
      W = {
        transform: F.transform && F.transform.css
      },
      X = {
        color: [N, t],
        background: [N, t, "background-color"],
        "outline-color": [N, t],
        "border-color": [N, t],
        "border-top-color": [N, t],
        "border-right-color": [N, t],
        "border-bottom-color": [N, t],
        "border-left-color": [N, t],
        "border-width": [M, u],
        "border-top-width": [M, u],
        "border-right-width": [M, u],
        "border-bottom-width": [M, u],
        "border-left-width": [M, u],
        "border-spacing": [M, u],
        "letter-spacing": [M, u],
        margin: [M, u],
        "margin-top": [M, u],
        "margin-right": [M, u],
        "margin-bottom": [M, u],
        "margin-left": [M, u],
        padding: [M, u],
        "padding-top": [M, u],
        "padding-right": [M, u],
        "padding-bottom": [M, u],
        "padding-left": [M, u],
        "outline-width": [M, u],
        opacity: [M, s],
        top: [M, v],
        right: [M, v],
        bottom: [M, v],
        left: [M, v],
        "font-size": [M, v],
        "text-indent": [M, v],
        "word-spacing": [M, v],
        width: [M, v],
        "min-width": [M, v],
        "max-width": [M, v],
        height: [M, v],
        "min-height": [M, v],
        "max-height": [M, v],
        "line-height": [M, x],
        "scroll-top": [O, s, "scrollTop"],
        "scroll-left": [O, s, "scrollLeft"]
      },
      Y = {};
    F.transform && (X.transform = [P], Y = {
      x: [v, "translateX"],
      y: [v, "translateY"],
      rotate: [w],
      rotateX: [w],
      rotateY: [w],
      scale: [s],
      scaleX: [s],
      scaleY: [s],
      skew: [w],
      skewX: [w],
      skewY: [w]
    }), F.transform && F.backface && (Y.z = [v, "translateZ"], Y.rotateZ = [w], Y.scaleZ = [s], Y.perspective = [u]);
    var Z = /ms/,
      jQuery = /s|\./,
      _ = function() {
        var a = "warn",
          b = window.console;
        return b && b[a] ? function(c) {
          b[a](c)
        } : f
      }();
    return a.tram = b
  }(window.jQuery);
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  Webflow.define('brand', module.exports = function(jQuery, _) {
    var api = {};
    var jQueryhtml = jQuery('html');
    var jQuerybody = jQuery('body');
    var location = window.location;
    var inApp = Webflow.env();
    api.ready = function() {
      var doBranding = jQueryhtml.attr('data-wf-status');
      if (doBranding) {
        var jQuerybranding = jQuery('<div></div>');
        var jQuerylink = jQuery('<a></a>');
        jQuerylink.attr('href', 'http://webflow.com?utm_campaign=brandjs');
        jQuerybranding.css({
          position: 'fixed',
          bottom: 0,
          right: 0,
          borderTopLeftRadius: '5px',
          backgroundColor: '#2b3239',
          padding: '8px 12px 5px 15px',
          fontFamily: 'Arial',
          fontSize: '10px',
          textTransform: 'uppercase',
          opacity: '0',
          transition: 'opacity 0.50s ease-in-out'
        });
        jQuerylink.css({
          color: '#AAADB0',
          textDecoration: 'none'
        });
        var jQuerywebflowLogo = jQuery('<img>');
        jQuerywebflowLogo.attr('src', 'https://daks2k3a4ib2z.cloudfront.net/54153e6a3d25f2755b1f14ed/5445a4b1944ecdaa4df86d3e_subdomain-brand.svg');
        jQuerywebflowLogo.css({
          opacity: 0.9,
          width: '57px',
          verticalAlign: 'middle',
          paddingLeft: '4px',
          paddingBottom: '3px'
        });
        jQuerybranding.text('Built with');
        jQuerybranding.append(jQuerywebflowLogo);
        jQuerylink.append(jQuerybranding);
        jQuerybody.append(jQuerylink);
        if (/PhantomJS/.test(window.navigator.userAgent)) {
          return;
        }
        jQuerybranding.css({
          opacity: '1.0'
        });
      }
    };
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  var IXEvents = __webpack_require__(2);
  Webflow.define('dropdown', module.exports = function(jQuery, _) {
    var api = {};
    var jQuerydoc = jQuery(document);
    var jQuerydropdowns;
    var designer;
    var inApp = Webflow.env();
    var touch = Webflow.env.touch;
    var namespace = '.w-dropdown';
    var stateOpen = 'w--open';
    var closeEvent = 'w-close' + namespace;
    var ix = IXEvents.triggers;
    api.ready = api.design = api.preview = init;

    function init() {
      designer = inApp && Webflow.env('design');
      jQuerydropdowns = jQuerydoc.find(namespace);
      jQuerydropdowns.each(build);
    }

    function build(i, el) {
      var jQueryel = jQuery(el);
      var data = jQuery.data(el, namespace);
      if (!data) data = jQuery.data(el, namespace, {
        open: false,
        el: jQueryel,
        config: {}
      });
      data.list = jQueryel.children('.w-dropdown-list');
      data.toggle = jQueryel.children('.w-dropdown-toggle');
      data.links = data.list.children('.w-dropdown-link');
      data.outside = outside(data);
      data.complete = complete(data);
      data.leave = leave(data);
      jQueryel.off(namespace);
      data.toggle.off(namespace);
      configure(data);
      if (data.nav) data.nav.off(namespace);
      data.nav = jQueryel.closest('.w-nav');
      data.nav.on(closeEvent, handler(data));
      if (designer) {
        jQueryel.on('setting' + namespace, handler(data));
      } else {
        data.toggle.on('tap' + namespace, toggle(data));
        if (data.config.hover) {
          data.toggle.on('mouseenter' + namespace, enter(data));
        }
        jQueryel.on(closeEvent, handler(data));
        inApp && close(data);
      }
    }

    function configure(data) {
      data.config = {
        hover: Boolean(data.el.attr('data-hover')) && !touch,
        delay: Number(data.el.attr('data-delay')) || 0
      };
    }

    function handler(data) {
      return function(evt, options) {
        options = options || {};
        if (evt.type === 'w-close') {
          return close(data);
        }
        if (evt.type === 'setting') {
          configure(data);
          options.open === true && open(data, true);
          options.open === false && close(data, true);
          return;
        }
      };
    }

    function toggle(data) {
      return _.debounce(function() {
        data.open ? close(data) : open(data);
      });
    }

    function open(data) {
      if (data.open) return;
      closeOthers(data);
      data.open = true;
      data.list.addClass(stateOpen);
      data.toggle.addClass(stateOpen);
      ix.intro(0, data.el[0]);
      Webflow.redraw.up();
      if (!designer) jQuerydoc.on('tap' + namespace, data.outside);
      if (data.hovering) data.el.on('mouseleave' + namespace, data.leave);
      window.clearTimeout(data.delayId);
    }

    function close(data, immediate) {
      if (!data.open) return;
      if (data.config.hover && data.hovering) return;
      data.open = false;
      var config = data.config;
      ix.outro(0, data.el[0]);
      jQuerydoc.off('tap' + namespace, data.outside);
      data.el.off('mouseleave' + namespace, data.leave);
      window.clearTimeout(data.delayId);
      if (!config.delay || immediate) return data.complete();
      data.delayId = window.setTimeout(data.complete, config.delay);
    }

    function closeOthers(data) {
      var self = data.el[0];
      jQuerydropdowns.each(function(i, other) {
        var jQueryother = jQuery(other);
        if (jQueryother.is(self) || jQueryother.has(self).length) return;
        jQueryother.triggerHandler(closeEvent);
      });
    }

    function outside(data) {
      if (data.outside) jQuerydoc.off('tap' + namespace, data.outside);
      return _.debounce(function(evt) {
        if (!data.open) return;
        var jQuerytarget = jQuery(evt.target);
        if (jQuerytarget.closest('.w-dropdown-toggle').length) return;
        if (!data.el.is(jQuerytarget.closest(namespace))) {
          close(data);
        }
      });
    }

    function complete(data) {
      return function() {
        data.list.removeClass(stateOpen);
        data.toggle.removeClass(stateOpen);
      };
    }

    function enter(data) {
      return function() {
        data.hovering = true;
        open(data);
      };
    }

    function leave(data) {
      return function() {
        data.hovering = false;
        close(data);
      };
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  Webflow.define('edit', module.exports = function(jQuery, _, options) {
    options = options || {};
    if (Webflow.env('test') || Webflow.env('frame')) {
      if (!options.fixture) {
        return {
          exit: 1
        };
      }
    }
    var api = {};
    var jQuerywin = jQuery(window);
    var jQueryhtml = jQuery(document.documentElement);
    var location = document.location;
    var hashchange = 'hashchange';
    var loaded;
    var loadEditor = options.load || load;
    var hasLocalStorage = false;
    try {
      hasLocalStorage = localStorage && localStorage.getItem && localStorage.getItem('WebflowEditor');
    } catch (e) {}
    if (hasLocalStorage) {
      loadEditor();
    } else if (location.search) {
      if (/[?&](edit)(?:[=&?]|jQuery)/.test(location.search) || /\?editjQuery/.test(location.href)) {
        loadEditor();
      }
    } else {
      jQuerywin.on(hashchange, checkHash).triggerHandler(hashchange);
    }

    function checkHash() {
      if (loaded) return;
      if (/\?edit/.test(location.hash)) loadEditor();
    }

    function load() {
      loaded = true;
      window.WebflowEditor = true;
      jQuerywin.off(hashchange, checkHash);
      jQuery.ajax({
        url: cleanSlashes(("https://editor-api.webflow.com") + '/api/editor/view'),
        data: {
          siteId: jQueryhtml.attr('data-wf-site')
        },
        xhrFields: {
          withCredentials: true
        },
        dataType: 'json',
        crossDomain: true,
        success: success
      });
    }

    function success(data) {
      if (!data) {
        console.error('Could not load editor data');
        return;
      }
      getScript(prefix(data.scriptPath), function() {
        window.WebflowEditor(data);
      });
    }

    function getScript(url, done) {
      jQuery.ajax({
        type: 'GET',
        url: url,
        dataType: 'script',
        cache: true
      }).then(done, error);
    }

    function error(jqXHR, textStatus, errorThrown) {
      console.error('Could not load editor script: ' + textStatus);
      throw errorThrown;
    }

    function prefix(url) {
      return (url.indexOf('//') >= 0) ? url : cleanSlashes(("https://editor-api.webflow.com") + url);
    }

    function cleanSlashes(url) {
      return url.replace(/([^:])\/\//g, 'jQuery1/');
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  var Webflow = __webpack_require__(1);
  Webflow.define('forms', module.exports = function(jQuery, _) {
    var api = {};
    __webpack_require__(19);
    var jQuerydoc = jQuery(document);
    var jQueryforms;
    var loc = window.location;
    var retro = window.XDomainRequest && !window.atob;
    var namespace = '.w-form';
    var siteId;
    var emailField = /e(\-)?mail/i;
    var emailValue = /^\S+@\S+jQuery/;
    var alert = window.alert;
    var listening;
    var chimpRegex = /list-manage[1-9]?.com/i;
    var disconnected = _.debounce(function() {
      alert('Oops! This page has improperly configured forms. Please contact your website administrator to fix this issue.');
    }, 100);
    api.ready = function() {
      init();
      if (!listening) addListeners();
    };
    api.preview = api.design = function() {
      init();
    };

    function init() {
      siteId = jQuery('html').attr('data-wf-site');
      jQueryforms = jQuery(namespace + ' form');
      if (!jQueryforms.length) return;
      jQueryforms.each(build);
    }

    function build(i, el) {
      var jQueryel = jQuery(el);
      var data = jQuery.data(el, namespace);
      if (!data) data = jQuery.data(el, namespace, {
        form: jQueryel
      });
      reset(data);
      var wrap = jQueryel.closest('div.w-form');
      data.done = wrap.find('> .w-form-done');
      data.fail = wrap.find('> .w-form-fail');
      var action = data.action = jQueryel.attr('action');
      data.handler = null;
      data.redirect = jQueryel.attr('data-redirect');
      if (chimpRegex.test(action)) {
        data.handler = submitMailChimp;
        return;
      }
      if (action) return;
      if (siteId) {
        data.handler = submitWebflow;
        return;
      }
      disconnected();
    }

    function addListeners() {
      listening = true;
      jQuerydoc.on('submit', namespace + ' form', function(evt) {
        var data = jQuery.data(this, namespace);
        if (data.handler) {
          data.evt = evt;
          data.handler(data);
        }
      });
    }

    function reset(data) {
      var btn = data.btn = data.form.find(':input[type="submit"]');
      data.wait = data.btn.attr('data-wait') || null;
      data.success = false;
      btn.prop('disabled', false);
      data.label && btn.val(data.label);
    }

    function disableBtn(data) {
      var btn = data.btn;
      var wait = data.wait;
      btn.prop('disabled', true);
      if (wait) {
        data.label = btn.val();
        btn.val(wait);
      }
    }

    function findFields(form, result) {
      var status = null;
      result = result || {};
      form.find(':input:not([type="submit"])').each(function(i, el) {
        var field = jQuery(el);
        var type = field.attr('type');
        var name = field.attr('data-name') || field.attr('name') || ('Field ' + (i + 1));
        var value = field.val();
        if (type === 'checkbox') {
          value = field.is(':checked');
        }
        if (type === 'radio') {
          if (result[name] === null || typeof result[name] === 'string') {
            return;
          }
          value = form.find('input[name="' + field.attr('name') + '"]:checked').val() || null;
        }
        if (typeof value === 'string') value = jQuery.trim(value);
        result[name] = value;
        status = status || getStatus(field, name, value);
      });
      return status;
    }

    function getStatus(field, name, value) {
      var status = null;
      if (!field.attr('required')) return null;
      if (!value) status = 'Please fill out the required field: ' + name;
      else if (emailField.test(name) || emailField.test(field.attr('type'))) {
        if (!emailValue.test(value)) status = 'Please enter a valid email address for: ' + name;
      }
      return status;
    }

    function submitWebflow(data) {
      reset(data);
      var form = data.form;
      var payload = {
        name: form.attr('data-name') || form.attr('name') || 'Untitled Form',
        source: loc.href,
        test: Webflow.env(),
        fields: {}
      };
      preventDefault(data);
      var status = findFields(form, payload.fields);
      if (status) return alert(status);
      disableBtn(data);
      if (!siteId) {
        afterSubmit(data);
        return;
      }
      var url = ("https://webflow.com") + '/api/v1/form/' + siteId;
      if (retro && url.indexOf(("https://webflow.com")) >= 0) {
        url = url.replace(("https://webflow.com"), ("http://formdata.webflow.com"));
      }
      jQuery.ajax({
        url: url,
        type: 'POST',
        data: payload,
        dataType: 'json',
        crossDomain: true
      }).done(function() {
        data.success = true;
        afterSubmit(data);
      }).fail(function(response, textStatus, jqXHR) {
        afterSubmit(data);
      });
    }

    function submitMailChimp(data) {
      reset(data);
      var form = data.form;
      var payload = {};
      if (/^https/.test(loc.href) && !/^https/.test(data.action)) {
        form.attr('method', 'post');
        return;
      }
      preventDefault(data);
      var status = findFields(form, payload);
      if (status) return alert(status);
      disableBtn(data);
      var fullName;
      _.each(payload, function(value, key) {
        if (emailField.test(key)) payload.EMAIL = value;
        if (/^((full[ _-]?)?name)jQuery/i.test(key)) fullName = value;
        if (/^(first[ _-]?name)jQuery/i.test(key)) payload.FNAME = value;
        if (/^(last[ _-]?name)jQuery/i.test(key)) payload.LNAME = value;
      });
      if (fullName && !payload.FNAME) {
        fullName = fullName.split(' ');
        payload.FNAME = fullName[0];
        payload.LNAME = payload.LNAME || fullName[1];
      }
      var url = data.action.replace('/post?', '/post-json?') + '&c=?';
      var userId = url.indexOf('u=') + 2;
      userId = url.substring(userId, url.indexOf('&', userId));
      var listId = url.indexOf('id=') + 3;
      listId = url.substring(listId, url.indexOf('&', listId));
      payload['b_' + userId + '_' + listId] = '';
      jQuery.ajax({
        url: url,
        data: payload,
        dataType: 'jsonp'
      }).done(function(resp) {
        data.success = (resp.result === 'success' || /already/.test(resp.msg));
        if (!data.success) console.info('MailChimp error: ' + resp.msg);
        afterSubmit(data);
      }).fail(function(response, textStatus, jqXHR) {
        afterSubmit(data);
      });
    }

    function afterSubmit(data) {
      var form = data.form;
      var wrap = form.closest('div.w-form');
      var redirect = data.redirect;
      var success = data.success;
      if (success && redirect) {
        Webflow.location(redirect);
        return;
      }
      data.done.toggle(success);
      data.fail.toggle(!success);
      form.toggle(!success);
      reset(data);
    }

    function preventDefault(data) {
      data.evt && data.evt.preventDefault();
      data.evt = null;
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  Webflow.define('gplus', module.exports = function(jQuery, _) {
    var jQuerydoc = jQuery(document);
    var api = {};
    var loaded;
    api.ready = function() {
      if (!Webflow.env() && !loaded) init();
    };

    function init() {
      jQuerydoc.find('.w-widget-gplus').length && load();
    }

    function load() {
      loaded = true;
      jQuery.getScript('https://apis.google.com/js/plusone.js');
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  var IXEvents = __webpack_require__(2);
  Webflow.define('ix', module.exports = function(jQuery, _) {
    var api = {};
    var designer;
    var jQuerywin = jQuery(window);
    var namespace = '.w-ix';
    var tram = jQuery.tram;
    var env = Webflow.env;
    var inApp = env();
    var emptyFix = env.chrome && env.chrome < 35;
    var transNone = 'none 0s ease 0s';
    var jQuerysubs = jQuery();
    var config = {};
    var anchors = [];
    var loads = [];
    var readys = [];
    var destroyed;
    var readyDelay = 1;
    var components = {
      tabs: '.w-tab-link, .w-tab-pane',
      dropdown: '.w-dropdown',
      slider: '.w-slide',
      navbar: '.w-nav'
    };
    api.init = function(list) {
      setTimeout(function() {
        configure(list);
      }, 1);
    };
    api.preview = function() {
      designer = false;
      readyDelay = 100;
      setTimeout(function() {
        configure(window.__wf_ix);
      }, 1);
    };
    api.design = function() {
      designer = true;
      api.destroy();
    };
    api.destroy = function() {
      destroyed = true;
      jQuerysubs.each(teardown);
      Webflow.scroll.off(scroll);
      IXEvents.async();
      anchors = [];
      loads = [];
      readys = [];
    };
    api.ready = function() {
      if (config && destroyed) {
        destroyed = false;
        init();
      }
    };
    api.run = run;
    api.style = inApp ? styleApp : stylePub;

    function configure(list) {
      if (!list) return;
      config = {};
      _.each(list, function(item) {
        config[item.slug] = item.value;
      });
      init();
    }

    function init() {
      var els = jQuery('[data-ix]');
      if (!els.length) return;
      els.each(teardown);
      els.each(build);
      if (anchors.length) {
        Webflow.scroll.on(scroll);
        setTimeout(scroll, 1);
      }
      if (loads.length) Webflow.load(runLoads);
      if (readys.length) setTimeout(runReadys, readyDelay);
      IXEvents.init();
      Webflow.redraw.up();
    }

    function build(i, el) {
      var jQueryel = jQuery(el);
      var id = jQueryel.attr('data-ix');
      var ix = config[id];
      if (!ix) return;
      var triggers = ix.triggers;
      if (!triggers) return;
      api.style(jQueryel, ix.style);
      _.each(triggers, function(trigger) {
        var state = {};
        var type = trigger.type;
        var stepsB = trigger.stepsB && trigger.stepsB.length;

        function runA() {
          run(trigger, jQueryel, {
            group: 'A'
          });
        }

        function runB() {
          run(trigger, jQueryel, {
            group: 'B'
          });
        }
        if (type === 'load') {
          (trigger.preload && !inApp) ? loads.push(runA): readys.push(runA);
          return;
        }
        if (type === 'click') {
          jQueryel.on('click' + namespace, function(evt) {
            if (!Webflow.validClick(evt.currentTarget)) return;
            if (jQueryel.attr('href') === '#') evt.preventDefault();
            run(trigger, jQueryel, {
              group: state.clicked ? 'B' : 'A'
            });
            if (stepsB) state.clicked = !state.clicked;
          });
          jQuerysubs = jQuerysubs.add(jQueryel);
          return;
        }
        if (type === 'hover') {
          jQueryel.on('mouseenter' + namespace, runA);
          jQueryel.on('mouseleave' + namespace, runB);
          jQuerysubs = jQuerysubs.add(jQueryel);
          return;
        }
        if (type === 'scroll') {
          anchors.push({
            el: jQueryel,
            trigger: trigger,
            state: {
              active: false
            },
            offsetTop: convert(trigger.offsetTop),
            offsetBot: convert(trigger.offsetBot)
          });
          return;
        }
        var proxy = components[type];
        if (proxy) {
          var jQueryproxy = jQueryel.closest(proxy);
          jQueryproxy.on(IXEvents.types.INTRO, runA).on(IXEvents.types.OUTRO, runB);
          jQuerysubs = jQuerysubs.add(jQueryproxy);
          return;
        }
      });
    }

    function convert(offset) {
      if (!offset) return 0;
      offset = String(offset);
      var result = parseInt(offset, 10);
      if (result !== result) return 0;
      if (offset.indexOf('%') > 0) {
        result /= 100;
        if (result >= 1) result = 0.999;
      }
      return result;
    }

    function teardown(i, el) {
      jQuery(el).off(namespace);
    }

    function scroll() {
      var viewTop = jQuerywin.scrollTop();
      var viewHeight = jQuerywin.height();
      var count = anchors.length;
      for (var i = 0; i < count; i++) {
        var anchor = anchors[i];
        var jQueryel = anchor.el;
        var trigger = anchor.trigger;
        var stepsB = trigger.stepsB && trigger.stepsB.length;
        var state = anchor.state;
        var top = jQueryel.offset().top;
        var height = jQueryel.outerHeight();
        var offsetTop = anchor.offsetTop;
        var offsetBot = anchor.offsetBot;
        if (offsetTop < 1 && offsetTop > 0) offsetTop *= viewHeight;
        if (offsetBot < 1 && offsetBot > 0) offsetBot *= viewHeight;
        var active = (top + height - offsetTop >= viewTop && top + offsetBot <= viewTop + viewHeight);
        if (active === state.active) continue;
        if (active === false && !stepsB) continue;
        state.active = active;
        run(trigger, jQueryel, {
          group: active ? 'A' : 'B'
        });
      }
    }

    function runLoads() {
      var count = loads.length;
      for (var i = 0; i < count; i++) {
        loads[i]();
      }
    }

    function runReadys() {
      var count = readys.length;
      for (var i = 0; i < count; i++) {
        readys[i]();
      }
    }

    function run(trigger, jQueryel, opts, replay) {
      opts = opts || {};
      var done = opts.done;
      if (designer && !opts.force) return;
      var group = opts.group || 'A';
      var loop = trigger['loop' + group];
      var steps = trigger['steps' + group];
      if (!steps || !steps.length) return;
      if (steps.length < 2) loop = false;
      if (!replay) {
        var selector = trigger.selector;
        if (selector) {
          if (trigger.descend) {
            jQueryel = jQueryel.find(selector);
          } else if (trigger.siblings) {
            jQueryel = jQueryel.siblings(selector);
          } else {
            jQueryel = jQuery(selector);
          }
          if (inApp) jQueryel.attr('data-ix-affect', 1);
        }
        if (emptyFix) jQueryel.addClass('w-ix-emptyfix');
        if (trigger.preserve3d) jQueryel.css('transform-style', 'preserve-3d');
      }
      var _tram = tram(jQueryel);
      var meta = {};
      for (var i = 0; i < steps.length; i++) {
        addStep(_tram, steps[i], meta);
      }

      function fin() {
        if (loop) return run(trigger, jQueryel, opts, true);
        if (meta.width === 'auto') _tram.set({
          width: 'auto'
        });
        if (meta.height === 'auto') _tram.set({
          height: 'auto'
        });
        done && done();
      }
      meta.start ? _tram.then(fin) : fin();
    }

    function addStep(_tram, step, meta) {
      var addMethod = 'add';
      var startMethod = 'start';
      if (meta.start) addMethod = startMethod = 'then';
      var transitions = step.transition;
      if (transitions) {
        transitions = transitions.split(',');
        for (var i = 0; i < transitions.length; i++) {
          var transition = transitions[i];
          _tram[addMethod](transition);
        }
      }
      var clean = tramify(step) || {};
      if (clean.width != null) meta.width = clean.width;
      if (clean.height != null) meta.height = clean.height;
      if (transitions == null) {
        if (meta.start) {
          _tram.then(function() {
            var queue = this.queue;
            this.set(clean);
            if (clean.display) {
              _tram.redraw();
              Webflow.redraw.up();
            }
            this.queue = queue;
            this.next();
          });
        } else {
          _tram.set(clean);
          if (clean.display) {
            _tram.redraw();
            Webflow.redraw.up();
          }
        }
        var wait = clean.wait;
        if (wait != null) {
          _tram.wait(wait);
          meta.start = true;
        }
      } else {
        if (clean.display) {
          var display = clean.display;
          delete clean.display;
          if (meta.start) {
            _tram.then(function() {
              var queue = this.queue;
              this.set({
                display: display
              }).redraw();
              Webflow.redraw.up();
              this.queue = queue;
              this.next();
            });
          } else {
            _tram.set({
              display: display
            }).redraw();
            Webflow.redraw.up();
          }
        }
        _tram[startMethod](clean);
        meta.start = true;
      }
    }

    function styleApp(el, data) {
      var _tram = tram(el);
      el.css('transition', '');
      var computed = el.css('transition');
      if (computed === transNone) computed = _tram.upstream = null;
      _tram.upstream = transNone;
      _tram.set(tramify(data));
      _tram.upstream = computed;
    }

    function stylePub(el, data) {
      tram(el).set(tramify(data));
    }

    function tramify(obj) {
      var result = {};
      var found = false;
      for (var x in obj) {
        if (x === 'transition') continue;
        result[x] = obj[x];
        found = true;
      }
      return found ? result : null;
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);

  function createLightbox(window, document, jQuery) {
    var tram = jQuery.tram;
    var isArray = Array.isArray;
    var namespace = 'w-lightbox';
    var prefix = namespace + '-';
    var prefixRegex = /(^|\s+)/g;
    var items = [];
    var currentIndex;
    var jQueryrefs;
    var spinner;

    function lightbox(thing, index) {
      items = isArray(thing) ? thing : [thing];
      if (!jQueryrefs) {
        lightbox.build();
      }
      if (items.length > 1) {
        jQueryrefs.items = jQueryrefs.empty;
        items.forEach(function(item) {
          var jQuerythumbnail = dom('thumbnail');
          var jQueryitem = dom('item').append(jQuerythumbnail);
          jQueryrefs.items = jQueryrefs.items.add(jQueryitem);
          loadImage(item.thumbnailUrl || item.url, function(jQueryimage) {
            if (jQueryimage.prop('width') > jQueryimage.prop('height')) {
              addClass(jQueryimage, 'wide');
            } else {
              addClass(jQueryimage, 'tall');
            }
            jQuerythumbnail.append(addClass(jQueryimage, 'thumbnail-image'));
          });
        });
        jQueryrefs.strip.empty().append(jQueryrefs.items);
        addClass(jQueryrefs.content, 'group');
      }
      tram(removeClass(jQueryrefs.lightbox, 'hide').focus()).add('opacity .3s').start({
        opacity: 1
      });
      addClass(jQueryrefs.html, 'noscroll');
      return lightbox.show(index || 0);
    }
    lightbox.build = function() {
      lightbox.destroy();
      jQueryrefs = {
        html: jQuery(document.documentElement),
        empty: jQuery()
      };
      jQueryrefs.arrowLeft = dom('control left inactive');
      jQueryrefs.arrowRight = dom('control right inactive');
      jQueryrefs.close = dom('control close');
      jQueryrefs.spinner = dom('spinner');
      jQueryrefs.strip = dom('strip');
      spinner = new Spinner(jQueryrefs.spinner, prefixed('hide'));
      jQueryrefs.content = dom('content').append(jQueryrefs.spinner, jQueryrefs.arrowLeft, jQueryrefs.arrowRight, jQueryrefs.close);
      jQueryrefs.container = dom('container').append(jQueryrefs.content, jQueryrefs.strip);
      jQueryrefs.lightbox = dom('backdrop hide').append(jQueryrefs.container);
      jQueryrefs.strip.on('tap', selector('item'), itemTapHandler);
      jQueryrefs.content.on('swipe', swipeHandler).on('tap', selector('left'), handlerPrev).on('tap', selector('right'), handlerNext).on('tap', selector('close'), handlerHide).on('tap', selector('image, caption'), handlerNext);
      jQueryrefs.container.on('tap', selector('view, strip'), handlerHide).on('dragstart', selector('img'), preventDefault);
      jQueryrefs.lightbox.on('keydown', keyHandler).on('focusin', focusThis);
      jQuery('body').append(jQueryrefs.lightbox.prop('tabIndex', 0));
      return lightbox;
    };
    lightbox.destroy = function() {
      if (!jQueryrefs) {
        return;
      }
      removeClass(jQueryrefs.html, 'noscroll');
      jQueryrefs.lightbox.remove();
      jQueryrefs = undefined;
    };
    lightbox.show = function(index) {
      if (index === currentIndex) {
        return;
      }
      var item = items[index];
      if (!item) {
        return lightbox.hide();
      }
      var previousIndex = currentIndex;
      currentIndex = index;
      spinner.show();
      var url = item.html && svgDataUri(item.width, item.height) || item.url;
      loadImage(url, function(jQueryimage) {
        if (index !== currentIndex) {
          return;
        }
        var jQueryfigure = dom('figure', 'figure').append(addClass(jQueryimage, 'image'));
        var jQueryframe = dom('frame').append(jQueryfigure);
        var jQuerynewView = dom('view').append(jQueryframe);
        var jQueryhtml, isIframe;
        if (item.html) {
          jQueryhtml = jQuery(item.html);
          isIframe = jQueryhtml.is('iframe');
          if (isIframe) {
            jQueryhtml.on('load', transitionToNewView);
          }
          jQueryfigure.append(addClass(jQueryhtml, 'embed'));
        }
        if (item.caption) {
          jQueryfigure.append(dom('caption', 'figcaption').text(item.caption));
        }
        jQueryrefs.spinner.before(jQuerynewView);
        if (!isIframe) {
          transitionToNewView();
        }

        function transitionToNewView() {
          spinner.hide();
          if (index !== currentIndex) {
            jQuerynewView.remove();
            return;
          }
          toggleClass(jQueryrefs.arrowLeft, 'inactive', index <= 0);
          toggleClass(jQueryrefs.arrowRight, 'inactive', index >= items.length - 1);
          if (jQueryrefs.view) {
            tram(jQueryrefs.view).add('opacity .3s').start({
              opacity: 0
            }).then(remover(jQueryrefs.view));
            tram(jQuerynewView).add('opacity .3s').add('transform .3s').set({
              x: index > previousIndex ? '80px' : '-80px'
            }).start({
              opacity: 1,
              x: 0
            });
          } else {
            jQuerynewView.css('opacity', 1);
          }
          jQueryrefs.view = jQuerynewView;
          if (jQueryrefs.items) {
            addClass(removeClass(jQueryrefs.items, 'active').eq(index), 'active');
          }
        }
      });
      return lightbox;
    };
    lightbox.hide = function() {
      tram(jQueryrefs.lightbox).add('opacity .3s').start({
        opacity: 0
      }).then(hideLightbox);
      return lightbox;
    };
    lightbox.prev = function() {
      if (currentIndex > 0) {
        lightbox.show(currentIndex - 1);
      }
    };
    lightbox.next = function() {
      if (currentIndex < items.length - 1) {
        lightbox.show(currentIndex + 1);
      }
    };

    function createHandler(action) {
      return function(event) {
        if (this !== event.target) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        action();
      };
    }
    var handlerPrev = createHandler(lightbox.prev);
    var handlerNext = createHandler(lightbox.next);
    var handlerHide = createHandler(lightbox.hide);
    var itemTapHandler = function(event) {
      var index = jQuery(this).index();
      event.preventDefault();
      lightbox.show(index);
    };
    var swipeHandler = function(event, data) {
      event.preventDefault();
      if (data.direction === 'left') {
        lightbox.next();
      } else if (data.direction === 'right') {
        lightbox.prev();
      }
    };
    var focusThis = function() {
      this.focus();
    };

    function preventDefault(event) {
      event.preventDefault();
    }

    function keyHandler(event) {
      var keyCode = event.keyCode;
      if (keyCode === 27) {
        lightbox.hide();
      } else if (keyCode === 37) {
        lightbox.prev();
      } else if (keyCode === 39) {
        lightbox.next();
      }
    }

    function hideLightbox() {
      if (jQueryrefs) {
        removeClass(jQueryrefs.html, 'noscroll');
        addClass(jQueryrefs.lightbox, 'hide');
        jQueryrefs.strip.empty();
        jQueryrefs.view && jQueryrefs.view.remove();
        removeClass(jQueryrefs.content, 'group');
        addClass(jQueryrefs.arrowLeft, 'inactive');
        addClass(jQueryrefs.arrowRight, 'inactive');
        currentIndex = jQueryrefs.view = undefined;
      }
    }

    function loadImage(url, callback) {
      var jQueryimage = dom('img', 'img');
      jQueryimage.one('load', function() {
        callback(jQueryimage);
      });
      jQueryimage.attr('src', url);
      return jQueryimage;
    }

    function remover(jQueryelement) {
      return function() {
        jQueryelement.remove();
      };
    }

    function Spinner(jQueryspinner, className, delay) {
      this.jQueryelement = jQueryspinner;
      this.className = className;
      this.delay = delay || 200;
      this.hide();
    }
    Spinner.prototype.show = function() {
      var spinner = this;
      if (spinner.timeoutId) {
        return;
      }
      spinner.timeoutId = setTimeout(function() {
        spinner.jQueryelement.removeClass(spinner.className);
        delete spinner.timeoutId;
      }, spinner.delay);
    };
    Spinner.prototype.hide = function() {
      var spinner = this;
      if (spinner.timeoutId) {
        clearTimeout(spinner.timeoutId);
        delete spinner.timeoutId;
        return;
      }
      spinner.jQueryelement.addClass(spinner.className);
    };

    function prefixed(string, isSelector) {
      return string.replace(prefixRegex, (isSelector ? ' .' : ' ') + prefix);
    }

    function selector(string) {
      return prefixed(string, true);
    }

    function addClass(jQueryelement, className) {
      return jQueryelement.addClass(prefixed(className));
    }

    function removeClass(jQueryelement, className) {
      return jQueryelement.removeClass(prefixed(className));
    }

    function toggleClass(jQueryelement, className, shouldAdd) {
      return jQueryelement.toggleClass(prefixed(className), shouldAdd);
    }

    function dom(className, tag) {
      return addClass(jQuery(document.createElement(tag || 'div')), className);
    }

    function isObject(value) {
      return typeof value === 'object' && value != null && !isArray(value);
    }

    function svgDataUri(width, height) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"/>';
      return 'data:image/svg+xml;charset=utf-8,' + encodeURI(svg);
    }(function() {
      var ua = window.navigator.userAgent;
      var iOSRegex = /(iPhone|iPad|iPod);[^OS]*OS (\d)/;
      var iOSMatches = ua.match(iOSRegex);
      var android = ua.indexOf('Android ') > -1 && ua.indexOf('Chrome') === -1;
      if (!android && (!iOSMatches || iOSMatches[2] > 7)) {
        return;
      }
      var styleNode = document.createElement('style');
      document.head.appendChild(styleNode);
      window.addEventListener('orientationchange', refresh, true);

      function refresh() {
        var vh = window.innerHeight;
        var vw = window.innerWidth;
        var content = '.w-lightbox-content, .w-lightbox-view, .w-lightbox-view:before {' + 'height:' + vh + 'px' + '}' + '.w-lightbox-view {' + 'width:' + vw + 'px' + '}' + '.w-lightbox-group, .w-lightbox-group .w-lightbox-view, .w-lightbox-group .w-lightbox-view:before {' + 'height:' + (0.86 * vh) + 'px' + '}' + '.w-lightbox-image {' + 'max-width:' + vw + 'px;' + 'max-height:' + vh + 'px' + '}' + '.w-lightbox-group .w-lightbox-image {' + 'max-height:' + (0.86 * vh) + 'px' + '}' + '.w-lightbox-strip {' + 'padding: 0 ' + (0.01 * vh) + 'px' + '}' + '.w-lightbox-item {' + 'width:' + (0.1 * vh) + 'px;' + 'padding:' + (0.02 * vh) + 'px ' + (0.01 * vh) + 'px' + '}' + '.w-lightbox-thumbnail {' + 'height:' + (0.1 * vh) + 'px' + '}' + '@media (min-width: 768px) {' + '.w-lightbox-content, .w-lightbox-view, .w-lightbox-view:before {' + 'height:' + (0.96 * vh) + 'px' + '}' + '.w-lightbox-content {' + 'margin-top:' + (0.02 * vh) + 'px' + '}' + '.w-lightbox-group, .w-lightbox-group .w-lightbox-view, .w-lightbox-group .w-lightbox-view:before {' + 'height:' + (0.84 * vh) + 'px' + '}' + '.w-lightbox-image {' + 'max-width:' + (0.96 * vw) + 'px;' + 'max-height:' + (0.96 * vh) + 'px' + '}' + '.w-lightbox-group .w-lightbox-image {' + 'max-width:' + (0.823 * vw) + 'px;' + 'max-height:' + (0.84 * vh) + 'px' + '}' + '}';
        styleNode.textContent = content;
      }
      refresh();
    })();
    return lightbox;
  }
  Webflow.define('lightbox', module.exports = function(jQuery, _) {
    var api = {};
    var lightbox = createLightbox(window, document, jQuery);
    var jQuerydoc = jQuery(document);
    var jQuerybody;
    var jQuerylightboxes;
    var designer;
    var inApp = Webflow.env();
    var namespace = '.w-lightbox';
    var groups;
    api.ready = api.design = api.preview = init;

    function init() {
      designer = inApp && Webflow.env('design');
      jQuerybody = jQuery(document.body);
      lightbox.destroy();
      groups = {};
      jQuerylightboxes = jQuerydoc.find(namespace);
      jQuerylightboxes.webflowLightBox();
    }
    jQuery.fn.extend({
      webflowLightBox: function() {
        var jQueryel = this;
        jQuery.each(jQueryel, function(i, el) {
          var data = jQuery.data(el, namespace);
          if (!data) {
            data = jQuery.data(el, namespace, {
              el: jQuery(el),
              mode: 'images',
              images: [],
              embed: ''
            });
          }
          data.el.off(namespace);
          configure(data);
          if (designer) {
            data.el.on('setting' + namespace, configure.bind(null, data));
          } else {
            data.el.on('tap' + namespace, tapHandler(data)).on('click' + namespace, function(e) {
              e.preventDefault();
            });
          }
        });
      }
    });

    function configure(data) {
      var json = data.el.children('.w-json').html();
      var groupName, groupItems;
      if (!json) {
        data.items = [];
        return;
      }
      try {
        json = JSON.parse(json);
      } catch (e) {
        console.error('Malformed lightbox JSON configuration.', e);
      }
      supportOldLightboxJson(json);
      groupName = json.group;
      if (groupName) {
        groupItems = groups[groupName];
        if (!groupItems) {
          groupItems = groups[groupName] = [];
        }
        data.items = groupItems;
        if (json.items.length) {
          data.index = groupItems.length;
          groupItems.push.apply(groupItems, json.items);
        }
      } else {
        data.items = json.items;
      }
    }

    function tapHandler(data) {
      return function() {
        data.items.length && lightbox(data.items, data.index || 0);
      };
    }

    function supportOldLightboxJson(data) {
      if (data.images) {
        data.images.forEach(function(item) {
          item.type = 'image';
        });
        data.items = data.images;
      }
      if (data.embed) {
        data.embed.type = 'video';
        data.items = [data.embed];
      }
      if (data.groupId) {
        data.group = data.groupId;
      }
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  Webflow.define('links', module.exports = function(jQuery, _) {
    var api = {};
    var jQuerywin = jQuery(window);
    var designer;
    var inApp = Webflow.env();
    var location = window.location;
    var tempLink = document.createElement('a');
    var linkCurrent = 'w--current';
    var validHash = /^#[a-zA-Z][\w:.-]*jQuery/;
    var indexPage = /index\.(html|php)jQuery/;
    var dirList = /\/jQuery/;
    var anchors;
    var slug;
    api.ready = api.design = api.preview = init;

    function init() {
      designer = inApp && Webflow.env('design');
      slug = Webflow.env('slug') || location.pathname || '';
      Webflow.scroll.off(scroll);
      anchors = [];
      var links = document.links;
      for (var i = 0; i < links.length; ++i) {
        select(links[i]);
      }
      if (anchors.length) {
        Webflow.scroll.on(scroll);
        scroll();
      }
    }

    function select(link) {
      var href = (designer && link.getAttribute('href-disabled')) || link.getAttribute('href');
      tempLink.href = href;
      if (href.indexOf(':') >= 0) return;
      var jQuerylink = jQuery(link);
      if (href.indexOf('#') === 0 && validHash.test(href)) {
        var jQuerysection = jQuery(href);
        jQuerysection.length && anchors.push({
          link: jQuerylink,
          sec: jQuerysection,
          active: false
        });
        return;
      }
      if (href === '#') return;
      var match = (tempLink.href === location.href) || (href === slug) || (indexPage.test(href) && dirList.test(slug));
      setClass(jQuerylink, linkCurrent, match);
    }

    function scroll() {
      var viewTop = jQuerywin.scrollTop();
      var viewHeight = jQuerywin.height();
      _.each(anchors, function(anchor) {
        var jQuerylink = anchor.link;
        var jQuerysection = anchor.sec;
        var top = jQuerysection.offset().top;
        var height = jQuerysection.outerHeight();
        var offset = viewHeight * 0.5;
        var active = (jQuerysection.is(':visible') && top + height - offset >= viewTop && top + offset <= viewTop + viewHeight);
        if (anchor.active === active) return;
        anchor.active = active;
        setClass(jQuerylink, linkCurrent, active);
        if (designer) jQuerylink[0].__wf_current = active;
      });
    }

    function setClass(jQueryelem, className, add) {
      var exists = jQueryelem.hasClass(className);
      if (add && exists) return;
      if (!add && !exists) return;
      add ? jQueryelem.addClass(className) : jQueryelem.removeClass(className);
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  Webflow.define('maps', module.exports = function(jQuery, _) {
    var api = {};
    var jQuerydoc = jQuery(document);
    var google = null;
    var jQuerymaps;
    var namespace = '.w-widget-map';
    api.ready = function() {
      if (!Webflow.env()) initMaps();
    };
    api.preview = function() {
      jQuerymaps = jQuerydoc.find(namespace);
      Webflow.resize.off(triggerRedraw);
      if (jQuerymaps.length) {
        Webflow.resize.on(triggerRedraw);
        triggerRedraw();
      }
    };
    api.design = function(evt) {
      jQuerymaps = jQuerydoc.find(namespace);
      Webflow.resize.off(triggerRedraw);
      jQuerymaps.length && _.defer(triggerRedraw);
    };
    api.destroy = removeListeners;

    function triggerRedraw() {
      if (jQuerymaps.length && Webflow.app) {
        jQuerymaps.each(Webflow.app.redrawElement);
      }
    }

    function initMaps() {
      jQuerymaps = jQuerydoc.find(namespace);
      if (!jQuerymaps.length) return;
      if (google === null) {
        jQuery.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=_wf_maps_loaded');
        window._wf_maps_loaded = mapsLoaded;
      } else {
        mapsLoaded();
      }

      function mapsLoaded() {
        window._wf_maps_loaded = function() {};
        google = window.google;
        jQuerymaps.each(renderMap);
        removeListeners();
        addListeners();
      }
    }

    function removeListeners() {
      Webflow.resize.off(resizeMaps);
      Webflow.redraw.off(resizeMaps);
    }

    function addListeners() {
      Webflow.resize.on(resizeMaps);
      Webflow.redraw.on(resizeMaps);
    }

    function renderMap(i, el) {
      var data = jQuery(el).data();
      getState(el, data);
    }

    function resizeMaps() {
      jQuerymaps.each(resizeMap);
    }

    function resizeMap(i, el) {
      var state = getState(el);
      google.maps.event.trigger(state.map, 'resize');
      state.setMapPosition();
    }
    var store = 'w-widget-map';

    function getState(el, data) {
      var state = jQuery.data(el, store);
      if (state) return state;
      var jQueryel = jQuery(el);
      state = jQuery.data(el, store, {
        latLng: '51.511214,-0.119824',
        tooltip: '',
        style: 'roadmap',
        zoom: 12,
        marker: new google.maps.Marker({
          draggable: false
        }),
        infowindow: new google.maps.InfoWindow({
          disableAutoPan: true
        })
      });
      var latLng = data.widgetLatlng || state.latLng;
      state.latLng = latLng;
      var coords = latLng.split(',');
      var latLngObj = new google.maps.LatLng(coords[0], coords[1]);
      state.latLngObj = latLngObj;
      var mapDraggable = (Webflow.env.touch && data.disableTouch) ? false : true;
      state.map = new google.maps.Map(el, {
        center: state.latLngObj,
        zoom: state.zoom,
        maxZoom: 18,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        scrollwheel: !data.disableScroll,
        draggable: mapDraggable,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeId: state.style
      });
      state.marker.setMap(state.map);
      state.setMapPosition = function() {
        state.map.setCenter(state.latLngObj);
        var offsetX = 0;
        var offsetY = 0;
        var padding = jQueryel.css(['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']);
        offsetX -= parseInt(padding.paddingLeft, 10);
        offsetX += parseInt(padding.paddingRight, 10);
        offsetY -= parseInt(padding.paddingTop, 10);
        offsetY += parseInt(padding.paddingBottom, 10);
        if (offsetX || offsetY) {
          state.map.panBy(offsetX, offsetY);
        }
        jQueryel.css('position', '');
      };
      google.maps.event.addListener(state.map, 'tilesloaded', function() {
        google.maps.event.clearListeners(state.map, 'tilesloaded');
        state.setMapPosition();
      });
      state.setMapPosition();
      state.marker.setPosition(state.latLngObj);
      state.infowindow.setPosition(state.latLngObj);
      var tooltip = data.widgetTooltip;
      if (tooltip) {
        state.tooltip = tooltip;
        state.infowindow.setContent(tooltip);
        if (!state.infowindowOpen) {
          state.infowindow.open(state.map, state.marker);
          state.infowindowOpen = true;
        }
      }
      var style = data.widgetStyle;
      if (style) {
        state.map.setMapTypeId(style);
      }
      var zoom = data.widgetZoom;
      if (zoom != null) {
        state.zoom = zoom;
        state.map.setZoom(+zoom);
      }
      google.maps.event.addListener(state.marker, 'click', function() {
        window.open('https://maps.google.com/?z=' + state.zoom + '&daddr=' + state.latLng);
      });
      return state;
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  var IXEvents = __webpack_require__(2);
  Webflow.define('navbar', module.exports = function(jQuery, _) {
    var api = {};
    var tram = jQuery.tram;
    var jQuerywin = jQuery(window);
    var jQuerydoc = jQuery(document);
    var jQuerybody;
    var jQuerynavbars;
    var designer;
    var inApp = Webflow.env();
    var overlay = '<div class="w-nav-overlay" data-wf-ignore />';
    var namespace = '.w-nav';
    var buttonOpen = 'w--open';
    var menuOpen = 'w--nav-menu-open';
    var linkOpen = 'w--nav-link-open';
    var ix = IXEvents.triggers;
    api.ready = api.design = api.preview = init;
    api.destroy = removeListeners;

    function init() {
      designer = inApp && Webflow.env('design');
      jQuerybody = jQuery(document.body);
      jQuerynavbars = jQuerydoc.find(namespace);
      if (!jQuerynavbars.length) return;
      jQuerynavbars.each(build);
      removeListeners();
      addListeners();
    }

    function removeListeners() {
      Webflow.resize.off(resizeAll);
    }

    function addListeners() {
      Webflow.resize.on(resizeAll);
    }

    function resizeAll() {
      jQuerynavbars.each(resize);
    }

    function build(i, el) {
      var jQueryel = jQuery(el);
      var data = jQuery.data(el, namespace);
      if (!data) data = jQuery.data(el, namespace, {
        open: false,
        el: jQueryel,
        config: {}
      });
      data.menu = jQueryel.find('.w-nav-menu');
      data.links = data.menu.find('.w-nav-link');
      data.dropdowns = data.menu.find('.w-dropdown');
      data.button = jQueryel.find('.w-nav-button');
      data.container = jQueryel.find('.w-container');
      data.outside = outside(data);
      data.el.off(namespace);
      data.button.off(namespace);
      data.menu.off(namespace);
      configure(data);
      if (designer) {
        removeOverlay(data);
        data.el.on('setting' + namespace, handler(data));
      } else {
        addOverlay(data);
        data.button.on('tap' + namespace, toggle(data));
        data.menu.on('click' + namespace, 'a', navigate(data));
      }
      resize(i, el);
    }

    function removeOverlay(data) {
      if (!data.overlay) return;
      close(data, true);
      data.overlay.remove();
      data.overlay = null;
    }

    function addOverlay(data) {
      if (data.overlay) return;
      data.overlay = jQuery(overlay).appendTo(data.el);
      data.parent = data.menu.parent();
      close(data, true);
    }

    function configure(data) {
      var config = {};
      var old = data.config || {};
      var animation = config.animation = data.el.attr('data-animation') || 'default';
      config.animOver = /^over/.test(animation);
      config.animDirect = /leftjQuery/.test(animation) ? -1 : 1;
      if (old.animation !== animation) {
        data.open && _.defer(reopen, data);
      }
      config.easing = data.el.attr('data-easing') || 'ease';
      config.easing2 = data.el.attr('data-easing2') || 'ease';
      var duration = data.el.attr('data-duration');
      config.duration = duration != null ? +duration : 400;
      config.docHeight = data.el.attr('data-doc-height');
      data.config = config;
    }

    function handler(data) {
      return function(evt, options) {
        options = options || {};
        var winWidth = jQuerywin.width();
        configure(data);
        options.open === true && open(data, true);
        options.open === false && close(data, true);
        data.open && _.defer(function() {
          if (winWidth !== jQuerywin.width()) reopen(data);
        });
      };
    }

    function reopen(data) {
      if (!data.open) return;
      close(data, true);
      open(data, true);
    }

    function toggle(data) {
      return _.debounce(function(evt) {
        data.open ? close(data) : open(data);
      });
    }

    function navigate(data) {
      return function(evt) {
        var link = jQuery(this);
        var href = link.attr('href');
        if (!Webflow.validClick(evt.currentTarget)) {
          evt.preventDefault();
          return;
        }
        if (href && href.indexOf('#') === 0 && data.open) {
          close(data);
        }
      };
    }

    function outside(data) {
      if (data.outside) jQuerydoc.off('tap' + namespace, data.outside);
      return _.debounce(function(evt) {
        if (!data.open) return;
        var menu = jQuery(evt.target).closest('.w-nav-menu');
        if (!data.menu.is(menu)) {
          close(data);
        }
      });
    }

    function resize(i, el) {
      var data = jQuery.data(el, namespace);
      var collapsed = data.collapsed = data.button.css('display') !== 'none';
      if (data.open && !collapsed && !designer) close(data, true);
      if (data.container.length) {
        var updateEachMax = updateMax(data);
        data.links.each(updateEachMax);
        data.dropdowns.each(updateEachMax);
      }
      if (data.open) {
        setOverlayHeight(data);
      }
    }
    var maxWidth = 'max-width';

    function updateMax(data) {
      var containMax = data.container.css(maxWidth);
      if (containMax === 'none') containMax = '';
      return function(i, link) {
        link = jQuery(link);
        link.css(maxWidth, '');
        if (link.css(maxWidth) === 'none') link.css(maxWidth, containMax);
      };
    }

    function open(data, immediate) {
      if (data.open) return;
      data.open = true;
      data.menu.addClass(menuOpen);
      data.links.addClass(linkOpen);
      data.button.addClass(buttonOpen);
      var config = data.config;
      var animation = config.animation;
      if (animation === 'none' || !tram.support.transform) immediate = true;
      var bodyHeight = setOverlayHeight(data);
      var menuHeight = data.menu.outerHeight(true);
      var menuWidth = data.menu.outerWidth(true);
      var navHeight = data.el.height();
      var navbarEl = data.el[0];
      resize(0, navbarEl);
      ix.intro(0, navbarEl);
      Webflow.redraw.up();
      if (!designer) jQuerydoc.on('tap' + namespace, data.outside);
      if (immediate) return;
      var transConfig = 'transform ' + config.duration + 'ms ' + config.easing;
      if (data.overlay) {
        data.overlay.show().append(data.menu);
      }
      if (config.animOver) {
        tram(data.menu).add(transConfig).set({
          x: config.animDirect * menuWidth,
          height: bodyHeight
        }).start({
          x: 0
        });
        data.overlay && data.overlay.width(menuWidth);
        return;
      }
      var offsetY = navHeight + menuHeight;
      tram(data.menu).add(transConfig).set({
        y: -offsetY
      }).start({
        y: 0
      });
    }

    function setOverlayHeight(data) {
      var config = data.config;
      var bodyHeight = config.docHeight ? jQuerydoc.height() : jQuerybody.height();
      if (config.animOver) {
        data.menu.height(bodyHeight);
      } else if (data.el.css('position') !== 'fixed') {
        bodyHeight -= data.el.height();
      }
      data.overlay && data.overlay.height(bodyHeight);
      return bodyHeight;
    }

    function close(data, immediate) {
      if (!data.open) return;
      data.open = false;
      data.button.removeClass(buttonOpen);
      var config = data.config;
      if (config.animation === 'none' || !tram.support.transform) immediate = true;
      var animation = config.animation;
      ix.outro(0, data.el[0]);
      jQuerydoc.off('tap' + namespace, data.outside);
      if (immediate) {
        tram(data.menu).stop();
        complete();
        return;
      }
      var transConfig = 'transform ' + config.duration + 'ms ' + config.easing2;
      var menuHeight = data.menu.outerHeight(true);
      var menuWidth = data.menu.outerWidth(true);
      var navHeight = data.el.height();
      if (config.animOver) {
        tram(data.menu).add(transConfig).start({
          x: menuWidth * config.animDirect
        }).then(complete);
        return;
      }
      var offsetY = navHeight + menuHeight;
      tram(data.menu).add(transConfig).start({
        y: -offsetY
      }).then(complete);

      function complete() {
        data.menu.height('');
        tram(data.menu).set({
          x: 0,
          y: 0
        });
        data.menu.removeClass(menuOpen);
        data.links.removeClass(linkOpen);
        if (data.overlay && data.overlay.children().length) {
          data.menu.appendTo(data.parent);
          data.overlay.attr('style', '').hide();
        }
        data.el.triggerHandler('w-close');
      }
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  Webflow.define('scroll', module.exports = function(jQuery, _) {
    var jQuerydoc = jQuery(document);
    var win = window;
    var loc = win.location;
    var history = inIframe() ? null : win.history;
    var validHash = /^[a-zA-Z0-9][\w:.-]*jQuery/;

    function inIframe() {
      try {
        return !!win.frameElement;
      } catch (e) {
        return true;
      }
    }

    function ready() {
      if (loc.hash) {
        findEl(loc.hash.substring(1));
      }
      var locHref = loc.href.split('#')[0];
      jQuerydoc.on('click', 'a', function(e) {
        if (Webflow.env('design')) {
          return;
        }
        if (window.jQuery.mobile && jQuery(e.currentTarget).hasClass('ui-link')) return;
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          return;
        }
        var parts = this.href.split('#');
        var hash = parts[0] === locHref ? parts[1] : null;
        if (hash) {
          findEl(hash, e);
        }
      });
    }

    function findEl(hash, e) {
      if (!validHash.test(hash)) return;
      var el = jQuery('#' + hash);
      if (!el.length) {
        return;
      }
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (loc.hash !== hash && history && history.pushState && !(Webflow.env.chrome && loc.protocol === 'file:')) {
        var oldHash = history.state && history.state.hash;
        if (oldHash !== hash) {
          history.pushState({
            hash: hash
          }, '', '#' + hash);
        }
      }
      var rootTag = Webflow.env('editor') ? '.w-editor-body' : 'body';
      var header = jQuery('header, ' + rootTag + ' > .header, ' + rootTag + ' > .w-nav:not([data-no-scroll])');
      var offset = header.css('position') === 'fixed' ? header.outerHeight() : 0;
      win.setTimeout(function() {
        scroll(el, offset);
      }, e ? 0 : 300);
    }

    function scroll(el, offset) {
      alert("sdfsdf");
      var start = jQuery(win).scrollTop();
      var end = el.offset().top - offset;
      if (el.data('scroll') === 'mid') {
        var available = jQuery(win).height() - offset;
        var elHeight = el.outerHeight();
        if (elHeight < available) {
          end -= Math.round((available - elHeight) / 2);
        }
      }
      var mult = 1;
      jQuery('body').add(el).each(function(i) {
        var time = parseFloat(jQuery(this).attr('data-scroll-time'), 10);
        if (!isNaN(time) && (time === 0 || time > 0)) {
          mult = time;
        }
      });
      if (!Date.now) {
        Date.now = function() {
          return new Date().getTime();
        };
      }
      var clock = Date.now();
      var animate = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || function(fn) {
        win.setTimeout(fn, 15);
      };
      var duration = (472.143 * Math.log(Math.abs(start - end) + 125) - 2000) * mult;
      var step = function() {
        var elapsed = Date.now() - clock;
        win.scroll(0, getY(start, end, elapsed, duration));
        if (elapsed <= duration) {
          animate(step);
        }
      };
      step();
    }

    function getY(start, end, elapsed, duration) {
      if (elapsed > duration) {
        return end;
      }
      return start + (end - start) * ease(elapsed / duration);
    }

    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    return {
      ready: ready
    };
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  var IXEvents = __webpack_require__(2);
  Webflow.define('slider', module.exports = function(jQuery, _) {
    var api = {};
    var tram = jQuery.tram;
    var jQuerydoc = jQuery(document);
    var jQuerysliders;
    var designer;
    var inApp = Webflow.env();
    var namespace = '.w-slider';
    var dot = '<div class="w-slider-dot" data-wf-ignore />';
    var ix = IXEvents.triggers;
    var fallback;
    var inRedraw;
    api.ready = function() {
      init();
    };
    api.design = function() {
      designer = true;
      init();
    };
    api.preview = function() {
      designer = false;
      init();
    };
    api.redraw = function() {
      inRedraw = true;
      init();
    };
    api.destroy = removeListeners;

    function init() {
      jQuerysliders = jQuerydoc.find(namespace);
      if (!jQuerysliders.length) return;
      jQuerysliders.filter(':visible').each(build);
      inRedraw = null;
      if (fallback) return;
      removeListeners();
      addListeners();
    }

    function removeListeners() {
      Webflow.resize.off(renderAll);
      Webflow.redraw.off(api.redraw);
    }

    function addListeners() {
      Webflow.resize.on(renderAll);
      Webflow.redraw.on(api.redraw);
    }

    function renderAll() {
      jQuerysliders.filter(':visible').each(render);
    }

    function build(i, el) {
      var jQueryel = jQuery(el);
      var data = jQuery.data(el, namespace);
      if (!data) {
        data = jQuery.data(el, namespace, {
          index: 0,
          depth: 1,
          el: jQueryel,
          config: {}
        });
      }
      data.mask = jQueryel.children('.w-slider-mask');
      data.left = jQueryel.children('.w-slider-arrow-left');
      data.right = jQueryel.children('.w-slider-arrow-right');
      data.nav = jQueryel.children('.w-slider-nav');
      data.slides = data.mask.children('.w-slide');
      data.slides.each(ix.reset);
      if (inRedraw) data.maskWidth = 0;
      if (!tram.support.transform) {
        data.left.hide();
        data.right.hide();
        data.nav.hide();
        fallback = true;
        return;
      }
      data.el.off(namespace);
      data.left.off(namespace);
      data.right.off(namespace);
      data.nav.off(namespace);
      configure(data);
      if (designer) {
        data.el.on('setting' + namespace, handler(data));
        stopTimer(data);
        data.hasTimer = false;
      } else {
        data.el.on('swipe' + namespace, handler(data));
        data.left.on('tap' + namespace, previousFunction(data));
        data.right.on('tap' + namespace, next(data));
        if (data.config.autoplay && !data.hasTimer) {
          data.hasTimer = true;
          data.timerCount = 1;
          startTimer(data);
        }
      }
      data.nav.on('tap' + namespace, '> div', handler(data));
      if (!inApp) {
        data.mask.contents().filter(function() {
          return this.nodeType === 3;
        }).remove();
      }
      render(i, el);
    }

    function configure(data) {
      var config = {};
      config.crossOver = 0;
      config.animation = data.el.attr('data-animation') || 'slide';
      if (config.animation === 'outin') {
        config.animation = 'cross';
        config.crossOver = 0.5;
      }
      config.easing = data.el.attr('data-easing') || 'ease';
      var duration = data.el.attr('data-duration');
      config.duration = duration != null ? +duration : 500;
      if (+data.el.attr('data-infinite')) config.infinite = true;
      if (+data.el.attr('data-disable-swipe')) config.disableSwipe = true;
      if (+data.el.attr('data-hide-arrows')) {
        config.hideArrows = true;
      } else if (data.config.hideArrows) {
        data.left.show();
        data.right.show();
      }
      if (+data.el.attr('data-autoplay')) {
        config.autoplay = true;
        config.delay = +data.el.attr('data-delay') || 2000;
        config.timerMax = +data.el.attr('data-autoplay-limit');
        var touchEvents = 'mousedown' + namespace + ' touchstart' + namespace;
        if (!designer) {
          data.el.off(touchEvents).one(touchEvents, function() {
            stopTimer(data);
          });
        }
      }
      var arrowWidth = data.right.width();
      config.edge = arrowWidth ? arrowWidth + 40 : 100;
      data.config = config;
    }

    function previousFunction(data) {
      return function(evt) {
        change(data, {
          index: data.index - 1,
          vector: -1
        });
      };
    }

    function next(data) {
      return function(evt) {
        change(data, {
          index: data.index + 1,
          vector: 1
        });
      };
    }

    function select(data, value) {
      var found = null;
      if (value === data.slides.length) {
        init();
        layout(data);
      }
      _.each(data.anchors, function(anchor, index) {
        jQuery(anchor.els).each(function(i, el) {
          if (jQuery(el).index() === value) found = index;
        });
      });
      if (found != null) change(data, {
        index: found,
        immediate: true
      });
    }

    function startTimer(data) {
      stopTimer(data);
      var config = data.config;
      var timerMax = config.timerMax;
      if (timerMax && data.timerCount++ > timerMax) return;
      data.timerId = window.setTimeout(function() {
        if (data.timerId == null || designer) return;
        next(data)();
        startTimer(data);
      }, config.delay);
    }

    function stopTimer(data) {
      window.clearTimeout(data.timerId);
      data.timerId = null;
    }

    function handler(data) {
      return function(evt, options) {
        options = options || {};
        var config = data.config;
        if (designer && evt.type === 'setting') {
          if (options.select === 'prev') return previousFunction(data)();
          if (options.select === 'next') return next(data)();
          configure(data);
          layout(data);
          if (options.select == null) return;
          select(data, options.select);
          return;
        }
        if (evt.type === 'swipe') {
          if (config.disableSwipe) return;
          if (Webflow.env('editor')) return;
          if (options.direction === 'left') return next(data)();
          if (options.direction === 'right') return previousFunction(data)();
          return;
        }
        if (data.nav.has(evt.target).length) {
          change(data, {
            index: jQuery(evt.target).index()
          });
        }
      };
    }

    function change(data, options) {
      options = options || {};
      var config = data.config;
      var anchors = data.anchors;
      data.previous = data.index;
      var index = options.index;
      var shift = {};
      if (index < 0) {
        index = anchors.length - 1;
        if (config.infinite) {
          shift.x = -data.endX;
          shift.from = 0;
          shift.to = anchors[0].width;
        }
      } else if (index >= anchors.length) {
        index = 0;
        if (config.infinite) {
          shift.x = anchors[anchors.length - 1].width;
          shift.from = -anchors[anchors.length - 1].x;
          shift.to = shift.from - shift.x;
        }
      }
      data.index = index;
      var active = data.nav.children().eq(data.index).addClass('w-active');
      data.nav.children().not(active).removeClass('w-active');
      if (config.hideArrows) {
        data.index === anchors.length - 1 ? data.right.hide() : data.right.show();
        data.index === 0 ? data.left.hide() : data.left.show();
      }
      var lastOffsetX = data.offsetX || 0;
      var offsetX = data.offsetX = -anchors[data.index].x;
      var resetConfig = {
        x: offsetX,
        opacity: 1,
        visibility: ''
      };
      var targets = jQuery(anchors[data.index].els);
      var prevTargs = jQuery(anchors[data.previous] && anchors[data.previous].els);
      var others = data.slides.not(targets);
      var animation = config.animation;
      var easing = config.easing;
      var duration = Math.round(config.duration);
      var vector = options.vector || (data.index > data.previous ? 1 : -1);
      var fadeRule = 'opacity ' + duration + 'ms ' + easing;
      var slideRule = 'transform ' + duration + 'ms ' + easing;
      if (!designer) {
        targets.each(ix.intro);
        others.each(ix.outro);
      }
      if (options.immediate && !inRedraw) {
        tram(targets).set(resetConfig);
        resetOthers();
        return;
      }
      if (data.index === data.previous) return;
      if (animation === 'cross') {
        var reduced = Math.round(duration - duration * config.crossOver);
        var wait = Math.round(duration - reduced);
        fadeRule = 'opacity ' + reduced + 'ms ' + easing;
        tram(prevTargs).set({
          visibility: ''
        }).add(fadeRule).start({
          opacity: 0
        });
        tram(targets).set({
          visibility: '',
          x: offsetX,
          opacity: 0,
          zIndex: data.depth++
        }).add(fadeRule).wait(wait).then({
          opacity: 1
        }).then(resetOthers);
        return;
      }
      if (animation === 'fade') {
        tram(prevTargs).set({
          visibility: ''
        }).stop();
        tram(targets).set({
          visibility: '',
          x: offsetX,
          opacity: 0,
          zIndex: data.depth++
        }).add(fadeRule).start({
          opacity: 1
        }).then(resetOthers);
        return;
      }
      if (animation === 'over') {
        resetConfig = {
          x: data.endX
        };
        tram(prevTargs).set({
          visibility: ''
        }).stop();
        tram(targets).set({
          visibility: '',
          zIndex: data.depth++,
          x: offsetX + anchors[data.index].width * vector
        }).add(slideRule).start({
          x: offsetX
        }).then(resetOthers);
        return;
      }
      if (config.infinite && shift.x) {
        tram(data.slides.not(prevTargs)).set({
          visibility: '',
          x: shift.x
        }).add(slideRule).start({
          x: offsetX
        });
        tram(prevTargs).set({
          visibility: '',
          x: shift.from
        }).add(slideRule).start({
          x: shift.to
        });
        data.shifted = prevTargs;
      } else {
        if (config.infinite && data.shifted) {
          tram(data.shifted).set({
            visibility: '',
            x: lastOffsetX
          });
          data.shifted = null;
        }
        tram(data.slides).set({
          visibility: ''
        }).add(slideRule).start({
          x: offsetX
        });
      }

      function resetOthers() {
        targets = jQuery(anchors[data.index].els);
        others = data.slides.not(targets);
        if (animation !== 'slide') resetConfig.visibility = 'hidden';
        tram(others).set(resetConfig);
      }
    }

    function render(i, el) {
      var data = jQuery.data(el, namespace);
      if (maskChanged(data)) return layout(data);
      if (designer && slidesChanged(data)) layout(data);
    }

    function layout(data) {
      var pages = 1;
      var offset = 0;
      var anchor = 0;
      var width = 0;
      var maskWidth = data.maskWidth;
      var threshold = maskWidth - data.config.edge;
      if (threshold < 0) threshold = 0;
      data.anchors = [{
        els: [],
        x: 0,
        width: 0
      }];
      data.slides.each(function(i, el) {
        if (anchor - offset > threshold) {
          pages++;
          offset += maskWidth;
          data.anchors[pages - 1] = {
            els: [],
            x: anchor,
            width: 0
          };
        }
        width = jQuery(el).outerWidth(true);
        anchor += width;
        data.anchors[pages - 1].width += width;
        data.anchors[pages - 1].els.push(el);
      });
      data.endX = anchor;
      if (designer) data.pages = null;
      if (data.nav.length && data.pages !== pages) {
        data.pages = pages;
        buildNav(data);
      }
      var index = data.index;
      if (index >= pages) index = pages - 1;
      change(data, {
        immediate: true,
        index: index
      });
    }

    function buildNav(data) {
      var dots = [];
      var jQuerydot;
      var spacing = data.el.attr('data-nav-spacing');
      if (spacing) spacing = parseFloat(spacing) + 'px';
      for (var i = 0; i < data.pages; i++) {
        jQuerydot = jQuery(dot);
        if (data.nav.hasClass('w-num')) jQuerydot.text(i + 1);
        if (spacing != null) {
          jQuerydot.css({
            'margin-left': spacing,
            'margin-right': spacing
          });
        }
        dots.push(jQuerydot);
      }
      data.nav.empty().append(dots);
    }

    function maskChanged(data) {
      var maskWidth = data.mask.width();
      if (data.maskWidth !== maskWidth) {
        data.maskWidth = maskWidth;
        return true;
      }
      return false;
    }

    function slidesChanged(data) {
      var slidesWidth = 0;
      data.slides.each(function(i, el) {
        slidesWidth += jQuery(el).outerWidth(true);
      });
      if (data.slidesWidth !== slidesWidth) {
        data.slidesWidth = slidesWidth;
        return true;
      }
      return false;
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  var IXEvents = __webpack_require__(2);
  Webflow.define('tabs', module.exports = function(jQuery, _) {
    var api = {};
    var tram = jQuery.tram;
    var jQuerywin = jQuery(window);
    var jQuerydoc = jQuery(document);
    var jQuerytabs;
    var design;
    var env = Webflow.env;
    var safari = env.safari;
    var inApp = env();
    var tabAttr = 'data-w-tab';
    var namespace = '.w-tabs';
    var linkCurrent = 'w--current';
    var tabActive = 'w--tab-active';
    var ix = IXEvents.triggers;
    var inRedraw;
    api.ready = api.design = api.preview = init;
    api.redraw = function() {
      inRedraw = true;
      init();
    };
    api.destroy = function() {
      jQuerytabs = jQuerydoc.find(namespace);
      if (!jQuerytabs.length) return;
      jQuerytabs.each(resetIX);
      removeListeners();
    };

    function init() {
      design = inApp && Webflow.env('design');
      jQuerytabs = jQuerydoc.find(namespace);
      if (!jQuerytabs.length) return;
      jQuerytabs.each(build);
      Webflow.env('preview') && jQuerytabs.each(resetIX);
      inRedraw = null;
      removeListeners();
      addListeners();
    }

    function removeListeners() {
      Webflow.redraw.off(api.redraw);
    }

    function addListeners() {
      Webflow.redraw.on(api.redraw);
    }

    function resetIX(i, el) {
      var jQueryel = jQuery(el);
      var data = jQuery.data(el, namespace);
      if (!data) return;
      data.links && data.links.each(ix.reset);
      data.panes && data.panes.each(ix.reset);
    }

    function build(i, el) {
      var jQueryel = jQuery(el);
      var data = jQuery.data(el, namespace);
      if (!data) data = jQuery.data(el, namespace, {
        el: jQueryel,
        config: {}
      });
      data.current = null;
      data.menu = jQueryel.children('.w-tab-menu');
      data.links = data.menu.children('.w-tab-link');
      data.content = jQueryel.children('.w-tab-content');
      data.panes = data.content.children('.w-tab-pane');
      data.el.off(namespace);
      data.links.off(namespace);
      configure(data);
      if (!design) {
        data.links.on('click' + namespace, linkSelect(data));
        var jQuerylink = data.links.filter('.' + linkCurrent);
        var tab = jQuerylink.attr(tabAttr);
        tab && changeTab(data, {
          tab: tab,
          immediate: true
        });
      }
    }

    function configure(data) {
      var config = {};
      var old = data.config || {};
      config.easing = data.el.attr('data-easing') || 'ease';
      var intro = +data.el.attr('data-duration-in');
      intro = config.intro = intro === intro ? intro : 0;
      var outro = +data.el.attr('data-duration-out');
      outro = config.outro = outro === outro ? outro : 0;
      config.immediate = !intro && !outro;
      data.config = config;
    }

    function linkSelect(data) {
      return function(evt) {
        var tab = evt.currentTarget.getAttribute(tabAttr);
        tab && changeTab(data, {
          tab: tab
        });
      };
    }

    function changeTab(data, options) {
      options = options || {};
      var config = data.config;
      var easing = config.easing;
      var tab = options.tab;
      if (tab === data.current) return;
      data.current = tab;
      data.links.each(function(i, el) {
        var jQueryel = jQuery(el);
        if (el.getAttribute(tabAttr) === tab) jQueryel.addClass(linkCurrent).each(ix.intro);
        else if (jQueryel.hasClass(linkCurrent)) jQueryel.removeClass(linkCurrent).each(ix.outro);
      });
      var targets = [];
      var previous = [];
      data.panes.each(function(i, el) {
        var jQueryel = jQuery(el);
        if (el.getAttribute(tabAttr) === tab) {
          targets.push(el);
        } else if (jQueryel.hasClass(tabActive)) {
          previous.push(el);
        }
      });
      var jQuerytargets = jQuery(targets);
      var jQueryprevious = jQuery(previous);
      if (options.immediate || config.immediate) {
        jQuerytargets.addClass(tabActive).each(ix.intro);
        jQueryprevious.removeClass(tabActive);
        if (!inRedraw) Webflow.redraw.up();
        return;
      }
      if (jQueryprevious.length && config.outro) {
        jQueryprevious.each(ix.outro);
        tram(jQueryprevious).add('opacity ' + config.outro + 'ms ' + easing, {
          fallback: safari
        }).start({
          opacity: 0
        }).then(intro);
      } else {
        intro();
      }

      function intro() {
        jQueryprevious.removeClass(tabActive).removeAttr('style');
        jQuerytargets.addClass(tabActive).each(ix.intro);
        Webflow.redraw.up();
        if (!config.intro) return tram(jQuerytargets).set({
          opacity: 1
        });
        tram(jQuerytargets).set({
          opacity: 0
        }).redraw().add('opacity ' + config.intro + 'ms ' + easing, {
          fallback: safari
        }).start({
          opacity: 1
        });
      }
    }
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var Webflow = __webpack_require__(1);
  Webflow.define('touch', module.exports = function(jQuery, _) {
    var api = {};
    var fallback = !document.addEventListener;
    var getSelection = window.getSelection;
    if (fallback) {
      jQuery.event.special.tap = {
        bindType: 'click',
        delegateType: 'click'
      };
    }
    api.init = function(el) {
      if (fallback) return null;
      el = typeof el === 'string' ? jQuery(el).get(0) : el;
      return el ? new Touch(el) : null;
    };

    function Touch(el) {
      var active = false;
      var dirty = false;
      var useTouch = false;
      var thresholdX = Math.min(Math.round(window.innerWidth * 0.04), 40);
      var startX, startY, lastX;
      el.addEventListener('touchstart', start, false);
      el.addEventListener('touchmove', move, false);
      el.addEventListener('touchend', end, false);
      el.addEventListener('touchcancel', cancel, false);
      el.addEventListener('mousedown', start, false);
      el.addEventListener('mousemove', move, false);
      el.addEventListener('mouseup', end, false);
      el.addEventListener('mouseout', cancel, false);

      function start(evt) {
        var touches = evt.touches;
        if (touches && touches.length > 1) {
          return;
        }
        active = true;
        dirty = false;
        if (touches) {
          useTouch = true;
          startX = touches[0].clientX;
          startY = touches[0].clientY;
        } else {
          startX = evt.clientX;
          startY = evt.clientY;
        }
        lastX = startX;
      }

      function move(evt) {
        if (!active) return;
        if (useTouch && evt.type === 'mousemove') {
          evt.preventDefault();
          evt.stopPropagation();
          return;
        }
        var touches = evt.touches;
        var x = touches ? touches[0].clientX : evt.clientX;
        var y = touches ? touches[0].clientY : evt.clientY;
        var velocityX = x - lastX;
        lastX = x;
        if (Math.abs(velocityX) > thresholdX && getSelection && getSelection() + '' === '') {
          triggerEvent('swipe', evt, {
            direction: velocityX > 0 ? 'right' : 'left'
          });
          cancel();
        }
        if (Math.abs(x - startX) > 10 || Math.abs(y - startY) > 10) {
          dirty = true;
        }
      }

      function end(evt) {
        if (!active) return;
        active = false;
        if (useTouch && evt.type === 'mouseup') {
          evt.preventDefault();
          evt.stopPropagation();
          useTouch = false;
          return;
        }
        if (!dirty) triggerEvent('tap', evt);
      }

      function cancel(evt) {
        active = false;
      }

      function destroy() {
        el.removeEventListener('touchstart', start, false);
        el.removeEventListener('touchmove', move, false);
        el.removeEventListener('touchend', end, false);
        el.removeEventListener('touchcancel', cancel, false);
        el.removeEventListener('mousedown', start, false);
        el.removeEventListener('mousemove', move, false);
        el.removeEventListener('mouseup', end, false);
        el.removeEventListener('mouseout', cancel, false);
        el = null;
      }
      this.destroy = destroy;
    }

    function triggerEvent(type, evt, data) {
      var newEvent = jQuery.Event(type, {
        originalEvent: evt
      });
      jQuery(evt.target).trigger(newEvent, data);
    }
    api.instance = api.init(document);
    return api;
  });
}, function(module, exports, __webpack_require__) {
  'use strict';
  var jQuery = window.jQuery;
  var tram = __webpack_require__(3) && jQuery.tram;
  module.exports = (function() {
    var _ = {};
    _.VERSION = '1.6.0-Webflow';
    var breaker = {};
    var ArrayProto = Array.prototype,
      ObjProto = Object.prototype,
      FuncProto = Function.prototype;
    var
      push = ArrayProto.push,
      slice = ArrayProto.slice,
      concat = ArrayProto.concat,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;
    var
      nativeForEach = ArrayProto.forEach,
      nativeMap = ArrayProto.map,
      nativeReduce = ArrayProto.reduce,
      nativeReduceRight = ArrayProto.reduceRight,
      nativeFilter = ArrayProto.filter,
      nativeEvery = ArrayProto.every,
      nativeSome = ArrayProto.some,
      nativeIndexOf = ArrayProto.indexOf,
      nativeLastIndexOf = ArrayProto.lastIndexOf,
      nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeBind = FuncProto.bind;
    var each = _.each = _.forEach = function(obj, iterator, context) {
      if (obj == null) return obj;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
          if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
      }
      return obj;
    };
    _.map = _.collect = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      each(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
      });
      return results;
    };
    _.find = _.detect = function(obj, predicate, context) {
      var result;
      any(obj, function(value, index, list) {
        if (predicate.call(context, value, index, list)) {
          result = value;
          return true;
        }
      });
      return result;
    };
    _.filter = _.select = function(obj, predicate, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
      each(obj, function(value, index, list) {
        if (predicate.call(context, value, index, list)) results.push(value);
      });
      return results;
    };
    var any = _.some = _.any = function(obj, predicate, context) {
      predicate || (predicate = _.identity);
      var result = false;
      if (obj == null) return result;
      if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
      each(obj, function(value, index, list) {
        if (result || (result = predicate.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
    _.contains = _.include = function(obj, target) {
      if (obj == null) return false;
      if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
      return any(obj, function(value) {
        return value === target;
      });
    };
    _.delay = function(func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function() {
        return func.apply(null, args);
      }, wait);
    };
    _.defer = function(func) {
      return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };
    _.throttle = function(func) {
      var wait, args, context;
      return function() {
        if (wait) return;
        wait = true;
        args = arguments;
        context = this;
        tram.frame(function() {
          wait = false;
          func.apply(context, args);
        });
      };
    };
    _.debounce = function(func, wait, immediate) {
      var timeout, args, context, timestamp, result;
      var later = function() {
        var last = _.now() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      };
      return function() {
        context = this;
        args = arguments;
        timestamp = _.now();
        var callNow = immediate && !timeout;
        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }
        return result;
      };
    };
    _.defaults = function(obj) {
      if (!_.isObject(obj)) return obj;
      for (var i = 1, length = arguments.length; i < length; i++) {
        var source = arguments[i];
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
      return obj;
    };
    _.keys = function(obj) {
      if (!_.isObject(obj)) return [];
      if (nativeKeys) return nativeKeys(obj);
      var keys = [];
      for (var key in obj)
        if (_.has(obj, key)) keys.push(key);
      return keys;
    };
    _.has = function(obj, key) {
      return hasOwnProperty.call(obj, key);
    };
    _.isObject = function(obj) {
      return obj === Object(obj);
    };
    _.now = Date.now || function() {
      return new Date().getTime();
    };
    _.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };
    var noMatch = /(.)^/;
    var escapes = {
      "'": "'",
      '\\': '\\',
      '\r': 'r',
      '\n': 'n',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function(match) {
      return '\\' + escapes[match];
    };
    _.template = function(text, settings, oldSettings) {
      if (!settings && oldSettings) settings = oldSettings;
      settings = _.defaults({}, settings, _.templateSettings);
      var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|jQuery', 'g');
      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;
        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }
        return match;
      });
      source += "';\n";
      if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
      source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
      try {
        var render = new Function(settings.variable || 'obj', '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }
      var template = function(data) {
        return render.call(this, data, _);
      };
      var argument = settings.variable || 'obj';
      template.source = 'function(' + argument + '){\n' + source + '}';
      return template;
    };
    return _;
  }());
}, function(module, exports) {
  module.exports = function(jQuery) {
    if (jQuery.support.cors || !jQuery.ajaxTransport || !window.XDomainRequest) {
      return
    }
    var httpRegEx = /^https?:\/\//i;
    var getOrPostRegEx = /^get|postjQuery/i;
    var sameSchemeRegEx = new RegExp("^" + location.protocol, "i");
    jQuery.ajaxTransport("* text html xml json", function(options, userOptions, jqXHR) {
      if (!options.crossDomain || !options.async || !getOrPostRegEx.test(options.type) || !httpRegEx.test(options.url) || !sameSchemeRegEx.test(options.url)) {
        return
      }
      var xdr = null;
      return {
        send: function(headers, complete) {
          var postData = "";
          var userType = (userOptions.dataType || "").toLowerCase();
          xdr = new XDomainRequest;
          if (/^\d+jQuery/.test(userOptions.timeout)) {
            xdr.timeout = userOptions.timeout
          }
          xdr.ontimeout = function() {
            complete(500, "timeout")
          };
          xdr.onload = function() {
            var allResponseHeaders = "Content-Length: " + xdr.responseText.length + "\r\nContent-Type: " + xdr.contentType;
            var status = {
              code: 200,
              message: "success"
            };
            var responses = {
              text: xdr.responseText
            };
            try {
              if (userType === "html" || /text\/html/i.test(xdr.contentType)) {
                responses.html = xdr.responseText
              } else if (userType === "json" || userType !== "text" && /\/json/i.test(xdr.contentType)) {
                try {
                  responses.json = jQuery.parseJSON(xdr.responseText)
                } catch (e) {
                  status.code = 500;
                  status.message = "parseerror"
                }
              } else if (userType === "xml" || userType !== "text" && /\/xml/i.test(xdr.contentType)) {
                var doc = new ActiveXObject("Microsoft.XMLDOM");
                doc.async = false;
                try {
                  doc.loadXML(xdr.responseText)
                } catch (e) {
                  doc = undefined
                }
                if (!doc || !doc.documentElement || doc.getElementsByTagName("parsererror").length) {
                  status.code = 500;
                  status.message = "parseerror";
                  throw "Invalid XML: " + xdr.responseText
                }
                responses.xml = doc
              }
            } catch (parseMessage) {
              throw parseMessage
            } finally {
              complete(status.code, status.message, responses, allResponseHeaders)
            }
          };
          xdr.onprogress = function() {};
          xdr.onerror = function() {
            complete(500, "error", {
              text: xdr.responseText
            })
          };
          if (userOptions.data) {
            postData = jQuery.type(userOptions.data) === "string" ? userOptions.data : jQuery.param(userOptions.data)
          }
          xdr.open(options.type, options.url);
          xdr.send(postData)
        },
        abort: function() {
          if (xdr) {
            xdr.abort()
          }
        }
      }
    })
  }(window.jQuery);
}]);
Webflow.require('ix').init([{
  "slug": "open-form",
  "name": "Open form",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".form-overlay",
      "stepsA": [{
        "display": "block"
      }, {
        "opacity": 1,
        "transition": "opacity 500ms ease-in 0ms"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".form-modal",
      "stepsA": [{
        "wait": 400
      }, {
        "opacity": 1,
        "transition": "transform 500ms ease 0ms, opacity 500ms ease-in 0ms",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".shadow-section",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-form-overlay",
  "name": "close form overlay",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".form-overlay",
      "stepsA": [{
        "wait": 400
      }, {
        "opacity": 0,
        "transition": "opacity 500ms ease 0ms"
      }, {
        "display": "none"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".form-modal",
      "stepsA": [{
        "opacity": 0,
        "transition": "transform 500ms ease 0ms, opacity 500ms ease 0ms",
        "scaleX": 0.8,
        "scaleY": 0.8,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-brother-block",
  "name": "Close brother block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".shadow-section",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-brother-block",
  "name": "Open brother block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-canon-block",
  "name": "Open canon block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease-in 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-canon-block",
  "name": "Close canon block ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".shadow-section",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-epson-block",
  "name": "Open epson block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-epson-block",
  "name": "Close  epson block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-hp-block",
  "name": "Open hp block ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-hp-block",
  "name": "Close  hp block ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-kyocera-block",
  "name": "Open kyocera block ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-kyocera-block",
  "name": "Close  kyocera block ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-lexmark-block",
  "name": "Open lexmark block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-lexmark-block",
  "name": "Close   lexmark block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-panasonic-block",
  "name": "Open panasonic block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-panasonic-block",
  "name": "Close panasonic block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-samsung-block",
  "name": "Open samsung block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-samsung-block",
  "name": "Close samsung block",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "open-xerox-block",
  "name": "Open xerox block ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 300ms ease 0ms, opacity 500ms ease 0ms",
        "x": "100%",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".brother-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".canon-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".epson-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".hp-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".kyocera-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".lexmark-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".panasonic-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".samsung-block",
      "stepsA": [{
        "transition": "transform 500ms ease-in 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 300ms ease 0ms",
        "x": "200px",
        "y": "0px",
        "z": "0px",
        "scaleX": 0.7000000000000001,
        "scaleY": 0.7000000000000001,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-xerox-block",
  "name": "Close xerox block ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".xerox-block",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }, {
      "type": "click",
      "selector": ".div-brand",
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "question",
  "name": "Question",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".answer-block",
      "siblings": true,
      "stepsA": [{
        "display": "block"
      }, {
        "height": "auto",
        "transition": "height 300ms ease-out-circ 0ms"
      }, {
        "opacity": 1,
        "wait": 500,
        "transition": "opacity 500ms ease 0ms"
      }],
      "stepsB": [{
        "display": "none"
      }, {
        "height": "auto",
        "transition": "height 300ms ease 0ms"
      }, {
        "opacity": 0,
        "transition": "opacity 500ms ease 0ms"
      }]
    }, {
      "type": "click",
      "selector": ".answer-block",
      "descend": true,
      "stepsA": [{
        "opacity": 0,
        "transition": "opacity 200ms ease 0ms"
      }, {
        "height": "0px",
        "transition": "height 200ms ease-in-out-back 0ms"
      }, {
        "display": "none"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "close-answer",
  "name": "Close answer",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".answer-block",
      "stepsA": [{
        "opacity": 0,
        "transition": "opacity 100ms ease 0ms"
      }, {
        "height": "0px",
        "transition": "height 100ms ease-in-out-back 0ms"
      }, {
        "display": "none"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "small-divider",
  "name": "Small divider",
  "value": {
    "style": {
      "width": "40px"
    },
    "triggers": []
  }
}, {
  "slug": "divider-expand",
  "name": "Divider expand",
  "value": {
    "style": {},
    "triggers": [{
      "type": "hover",
      "selector": ".small-divider",
      "siblings": true,
      "stepsA": [{
        "width": "100px",
        "transition": "width 250ms ease 0ms"
      }],
      "stepsB": [{
        "width": "40px",
        "transition": "width 250ms ease 0ms"
      }]
    }]
  }
}, {
  "slug": "transport-page-appear",
  "name": "Transport page appear",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "20%",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 250ms ease-out 0ms, opacity 250ms ease-out 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "new-interaction",
  "name": "New Interaction",
  "value": {
    "style": {},
    "triggers": []
  }
}, {
  "slug": "loading",
  "name": "Loading ",
  "value": {
    "style": {},
    "triggers": [{
      "type": "load",
      "selector": ".loading",
      "preload": true,
      "stepsA": [{
        "display": "block",
        "opacity": 0,
        "wait": 500,
        "transition": "opacity 500ms ease-in 0ms"
      }, {
        "display": "none",
        "wait": 200
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "card-appear-300-no-exit",
  "name": "Card Appear 300 no exit",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 300
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px"
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px"
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "card-appear-400-no-exit",
  "name": "Card Appear 400 no exit",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 400
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px"
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px"
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "card-appear-500-no-exit",
  "name": "Card Appear 500 no exit",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 500
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px"
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px"
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "card-appear-600-no-exit",
  "name": "Card Appear 600 no exit ",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 600
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px"
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px"
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "graph-bubble-appear-1",
  "name": "Graph Bubble Appear 1",
  "value": {
    "style": {
      "opacity": 0,
      "x": "-45px",
      "y": "0px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "30%",
      "stepsA": [{
        "wait": 300
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "45deg",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1,
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "graph-bubble-appear-2",
  "name": "Graph Bubble Appear 2",
  "value": {
    "style": {
      "opacity": 0,
      "x": "-45px",
      "y": "0px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "30%",
      "stepsA": [{
        "wait": 500
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "45deg",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1,
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "line-form-on-scroll",
  "name": "Line form on scroll",
  "value": {
    "style": {
      "width": "0%"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "30%",
      "stepsA": [{
        "width": "100%",
        "transition": "width 800ms ease 0ms"
      }],
      "stepsB": [{
        "width": "0%",
        "transition": "width 800ms ease 0ms"
      }]
    }]
  }
}, {
  "slug": "bubble-effect-12-sec",
  "name": "Bubble effect 1.2 sec",
  "value": {
    "style": {
      "opacity": 0,
      "scaleX": 0.5,
      "scaleY": 0.5,
      "scaleZ": 1
    },
    "triggers": [{
      "type": "scroll",
      "offsetTop": "6%",
      "offsetBot": "30%",
      "stepsA": [{
        "wait": 1200
      }, {
        "opacity": 1,
        "transition": "transform 300ms ease-in 0ms, opacity 300ms ease-in 0ms",
        "scaleX": 1.1,
        "scaleY": 1.1,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.92,
        "scaleY": 0.92,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.05,
        "scaleY": 1.05,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.96,
        "scaleY": 0.96,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.98,
        "scaleY": 0.98,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "bubble-effect-15-sec",
  "name": "Bubble effect 1.5 sec ",
  "value": {
    "style": {
      "opacity": 0,
      "scaleX": 0.5,
      "scaleY": 0.5,
      "scaleZ": 1
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "30%",
      "stepsA": [{
        "wait": 1500
      }, {
        "opacity": 1,
        "transition": "transform 300ms ease-in 0ms, opacity 300ms ease-in 0ms",
        "scaleX": 1.1,
        "scaleY": 1.1,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.92,
        "scaleY": 0.92,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.05,
        "scaleY": 1.05,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.96,
        "scaleY": 0.96,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.98,
        "scaleY": 0.98,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "bubble-effect-18-sec",
  "name": "Bubble effect 1.8 sec ",
  "value": {
    "style": {
      "opacity": 0,
      "scaleX": 0.5,
      "scaleY": 0.5,
      "scaleZ": 1
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "30%",
      "stepsA": [{
        "wait": 1800
      }, {
        "opacity": 1,
        "transition": "transform 300ms ease-in 0ms, opacity 300ms ease-in 0ms",
        "scaleX": 1.1,
        "scaleY": 1.1,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.92,
        "scaleY": 0.92,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.05,
        "scaleY": 1.05,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.96,
        "scaleY": 0.96,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.98,
        "scaleY": 0.98,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "ball-city-1",
  "name": "Ball city 1",
  "value": {
    "style": {},
    "triggers": [{
      "type": "hover",
      "stepsA": [{
        "transition": "transform 300ms ease-in-out-back 0ms",
        "x": "-50px",
        "y": "-50px",
        "z": "0px"
      }, {
        "wait": 400
      }, {
        "transition": "transform 400ms ease-in-out-back 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "ball-city-2",
  "name": "Ball city 2",
  "value": {
    "style": {},
    "triggers": [{
      "type": "hover",
      "stepsA": [{
        "transition": "transform 300ms ease-in-out-back 0ms",
        "x": "50px",
        "y": "-50px",
        "z": "0px"
      }, {
        "wait": 400
      }, {
        "transition": "transform 400ms ease-in-out-back 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "ball-city-3",
  "name": "Ball city 3",
  "value": {
    "style": {},
    "triggers": [{
      "type": "hover",
      "stepsA": [{
        "transition": "transform 300ms ease-in-out-back 0ms",
        "x": "0px",
        "y": "50px",
        "z": "0px"
      }, {
        "wait": 400
      }, {
        "transition": "transform 400ms ease-in-out-back 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "ball-city-4",
  "name": "Ball city 4",
  "value": {
    "style": {},
    "triggers": [{
      "type": "hover",
      "stepsA": [{
        "transition": "transform 300ms ease-in-out-back 0ms",
        "x": "-50px",
        "y": "50px",
        "z": "0px"
      }, {
        "wait": 400
      }, {
        "transition": "transform 400ms ease-in-out-back 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "arrow-button-clients",
  "name": "Arrow button clients",
  "value": {
    "style": {},
    "triggers": [{
      "type": "click",
      "selector": ".client-row-3",
      "stepsA": [{
        "display": "block",
        "opacity": 1,
        "height": "100%",
        "transition": "opacity 400ms ease 0ms, height 400ms ease 0ms"
      }],
      "stepsB": [{
        "opacity": 0,
        "height": "0px",
        "transition": "opacity 400ms ease 0ms, height 400ms ease 0ms"
      }, {
        "wait": 15
      }, {
        "display": "none"
      }]
    }, {
      "type": "click",
      "selector": ".arrow-clients",
      "stepsA": [{
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "180deg"
      }],
      "stepsB": [{
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "0deg"
      }]
    }, {
      "type": "click",
      "selector": ".arrow-text",
      "stepsA": [{
        "opacity": 0,
        "transition": "opacity 200ms ease 0ms"
      }],
      "stepsB": [{
        "wait": 700
      }, {
        "opacity": 1,
        "transition": "opacity 200ms ease 0ms"
      }]
    }, {
      "type": "click",
      "selector": ".client-row-4",
      "stepsA": [{
        "display": "block",
        "opacity": 1,
        "height": "100%",
        "transition": "opacity 400ms ease 0ms, height 400ms ease 0ms"
      }],
      "stepsB": [{
        "opacity": 0,
        "height": "0px",
        "transition": "opacity 400ms ease 0ms, height 400ms ease 0ms"
      }, {
        "wait": 15
      }, {
        "display": "none"
      }]
    }]
  }
}, {
  "slug": "hide-client-row",
  "name": "Hide Client Row",
  "value": {
    "style": {
      "display": "none",
      "opacity": 0,
      "height": "0px"
    },
    "triggers": []
  }
}, {
  "slug": "logo-appear-100",
  "name": "Logo Appear 100",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 100
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": [{
        "title": "Initial Appearance",
        "opacity": 0,
        "transition": "transform 100ms ease 0ms, opacity 100ms ease 0ms",
        "x": "0px",
        "y": "100px",
        "z": "0px"
      }]
    }]
  }
}, {
  "slug": "logo-appear-200",
  "name": "Logo Appear 200",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 200
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": [{
        "title": "Initial Appearance",
        "opacity": 0,
        "transition": "transform 100ms ease 0ms, opacity 100ms ease 0ms",
        "x": "0px",
        "y": "100px",
        "z": "0px"
      }]
    }]
  }
}, {
  "slug": "logo-appear-300",
  "name": "Logo Appear 300",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 300
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": [{
        "title": "Initial Appearance",
        "opacity": 0,
        "transition": "transform 100ms ease 0ms, opacity 100ms ease 0ms",
        "x": "0px",
        "y": "100px",
        "z": "0px"
      }]
    }]
  }
}, {
  "slug": "logo-appear-400",
  "name": "Logo Appear 400",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "15%",
      "stepsA": [{
        "wait": 400
      }, {
        "opacity": 1,
        "transition": "transform 400ms ease 0ms, opacity 400ms ease 0ms",
        "x": "0px",
        "y": "-5px",
        "z": "0px",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 300ms ease 0ms",
        "x": "0px",
        "y": "3px",
        "z": "0px",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }, {
        "transition": "transform 350ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": [{
        "title": "Initial Appearance",
        "opacity": 0,
        "transition": "transform 100ms ease 0ms, opacity 100ms ease 0ms",
        "x": "0px",
        "y": "100px",
        "z": "0px"
      }]
    }]
  }
}, {
  "slug": "loading-page-block",
  "name": "Loading page block",
  "value": {
    "style": {
      "display": "block"
    },
    "triggers": []
  }
}, {
  "slug": "color-on-hover",
  "name": "Color on hover",
  "value": {
    "style": {
      "opacity": 0
    },
    "triggers": [{
      "type": "hover",
      "stepsA": [{
        "opacity": 1,
        "transition": "opacity 250ms ease-in 0ms"
      }],
      "stepsB": [{
        "opacity": 0,
        "transition": "opacity 250ms ease-out 0ms"
      }]
    }, {
      "type": "hover",
      "selector": ".logo-column",
      "descend": true,
      "stepsA": [{
        "opacity": 1,
        "transition": "opacity 250ms ease-in 0ms"
      }],
      "stepsB": [{
        "opacity": 0.8500000000000001,
        "transition": "opacity 250ms ease-out 0ms"
      }]
    }]
  }
}, {
  "slug": "rotate-icon",
  "name": "Rotate icon",
  "value": {
    "style": {},
    "triggers": [{
      "type": "hover",
      "loopA": true,
      "stepsA": [{
        "transition": "transform 1000ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "180deg"
      }],
      "stepsB": [{
        "transition": "transform 1000ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "0deg"
      }]
    }]
  }
}, {
  "slug": "fade-inout-timeline-li",
  "name": "Fade In/Out Timeline LI",
  "value": {
    "style": {
      "opacity": 0,
      "x": "0px",
      "y": "100px",
      "z": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "25%",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 700ms ease 0ms, opacity 300ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "loop-arrow",
  "name": "Loop arrow",
  "value": {
    "style": {},
    "triggers": [{
      "type": "load",
      "preload": true,
      "loopA": true,
      "stepsA": [{
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "7px",
        "z": "0px"
      }, {
        "transition": "transform 500ms ease 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px"
      }],
      "stepsB": []
    }]
  }
}, {
  "slug": "horizontal-loading-bar",
  "name": "Horizontal Loading Bar",
  "value": {
    "style": {
      "width": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "stepsA": [{
        "width": "150px",
        "transition": "width 650ms ease 0ms"
      }],
      "stepsB": [{
        "width": "0%",
        "transition": "width 650ms ease 0ms"
      }]
    }]
  }
}, {
  "slug": "horizontal-loading-bar-2",
  "name": "Horizontal Loading Bar 2",
  "value": {
    "style": {
      "width": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "stepsA": [{
        "wait": 300
      }, {
        "width": "200px",
        "transition": "width 650ms ease 0ms"
      }],
      "stepsB": [{
        "width": "0px",
        "transition": "width 650ms ease 0ms"
      }]
    }]
  }
}, {
  "slug": "horizontal-loading-bar-3",
  "name": "Horizontal Loading Bar 3",
  "value": {
    "style": {
      "width": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "stepsA": [{
        "wait": 600
      }, {
        "width": "250px",
        "transition": "width 650ms ease 0ms"
      }],
      "stepsB": [{
        "width": "0%",
        "transition": "width 650ms ease 0ms"
      }]
    }]
  }
}, {
  "slug": "horizontal-loading-bar-4",
  "name": "Horizontal Loading Bar 4",
  "value": {
    "style": {
      "width": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "stepsA": [{
        "wait": 900
      }, {
        "width": "300px",
        "transition": "width 650ms ease 0ms"
      }],
      "stepsB": [{
        "width": "0%",
        "transition": "width 650ms ease 0ms"
      }]
    }]
  }
}, {
  "slug": "horizontal-loading-bar-5",
  "name": "Horizontal Loading Bar 5",
  "value": {
    "style": {
      "width": "0px"
    },
    "triggers": [{
      "type": "scroll",
      "stepsA": [{
        "wait": 1200
      }, {
        "width": "350px",
        "transition": "width 650ms ease 0ms"
      }],
      "stepsB": [{
        "width": "0%",
        "transition": "width 650ms ease 0ms"
      }]
    }]
  }
}, {
  "slug": "menu-button",
  "name": "Menu button",
  "value": {
    "style": {},
    "triggers": [{
      "type": "dropdown",
      "stepsA": [{
        "opacity": 0,
        "transition": "transform 650ms ease 0ms, opacity 650ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "180deg",
        "scaleX": 0.05,
        "scaleY": 0.05,
        "scaleZ": 1
      }],
      "stepsB": [{
        "opacity": 1,
        "transition": "transform 650ms ease 0ms, opacity 650ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "0deg",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }]
    }, {
      "type": "dropdown",
      "selector": ".close",
      "stepsA": [{
        "opacity": 1,
        "transition": "transform 650ms ease 0ms, opacity 650ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "180deg"
      }],
      "stepsB": [{
        "opacity": 0,
        "transition": "transform 650ms ease 0ms, opacity 650ms ease 0ms",
        "rotateX": "0deg",
        "rotateY": "0deg",
        "rotateZ": "0deg"
      }]
    }]
  }
}, {
  "slug": "on-load-display-none",
  "name": "On Load Display None",
  "value": {
    "style": {
      "opacity": 0
    },
    "triggers": []
  }
}, {
  "slug": "bubble-out-top",
  "name": "Bubble out Top",
  "value": {
    "style": {},
    "triggers": [{
      "type": "dropdown",
      "stepsA": [{
        "opacity": 0,
        "scaleX": 0.5,
        "scaleY": 0.5,
        "scaleZ": 1
      }, {
        "display": "block",
        "opacity": 1,
        "transition": "transform 200ms ease-in-cubic 0ms, opacity 200ms ease-in-cubic 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1.15,
        "scaleY": 1.15,
        "scaleZ": 1
      }, {
        "transition": "transform 150ms ease-out-cubic 0ms",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": [{
        "transition": "transform 150ms ease-in-cubic 0ms",
        "scaleX": 1.15,
        "scaleY": 1.15,
        "scaleZ": 1
      }, {
        "opacity": 0,
        "transition": "transform 200ms ease-out-cubic 0ms, opacity 200ms ease-out-cubic 0ms",
        "scaleX": 0.25,
        "scaleY": 0.25,
        "scaleZ": 1
      }]
    }]
  }
}, {
  "slug": "bubble-out-top-2",
  "name": "Bubble out Top 2",
  "value": {
    "style": {},
    "triggers": [{
      "type": "dropdown",
      "stepsA": [{
        "display": "none",
        "transition": "transform 200ms ease-in-cubic 0ms"
      }, {
        "opacity": 0,
        "scaleX": 0.5,
        "scaleY": 0.5,
        "scaleZ": 1
      }, {
        "display": "block",
        "opacity": 1,
        "transition": "transform 200ms ease-in-cubic 0ms, opacity 200ms ease-in-cubic 0ms",
        "x": "0px",
        "y": "0px",
        "z": "0px",
        "scaleX": 1.15,
        "scaleY": 1.15,
        "scaleZ": 1
      }, {
        "transition": "transform 150ms ease-out-cubic 0ms",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": [{
        "wait": 300
      }, {
        "transition": "transform 150ms ease-in-cubic 0ms",
        "scaleX": 1.15,
        "scaleY": 1.15,
        "scaleZ": 1
      }, {
        "opacity": 0,
        "transition": "transform 200ms ease-out-cubic 0ms, opacity 200ms ease-out-cubic 0ms",
        "scaleX": 0.25,
        "scaleY": 0.25,
        "scaleZ": 1
      }]
    }]
  }
}, {
  "slug": "bubble-effect-21-sec",
  "name": "Bubble effect 2.1 sec ",
  "value": {
    "style": {
      "opacity": 0,
      "scaleX": 0.5,
      "scaleY": 0.5,
      "scaleZ": 1
    },
    "triggers": [{
      "type": "scroll",
      "offsetBot": "30%",
      "stepsA": [{
        "wait": 2100
      }, {
        "opacity": 1,
        "transition": "transform 300ms ease-in 0ms, opacity 300ms ease-in 0ms",
        "scaleX": 1.1,
        "scaleY": 1.1,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.92,
        "scaleY": 0.92,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.05,
        "scaleY": 1.05,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.96,
        "scaleY": 0.96,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1.02,
        "scaleY": 1.02,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 0.98,
        "scaleY": 0.98,
        "scaleZ": 1
      }, {
        "transition": "transform 200ms ease-out 0ms",
        "scaleX": 1,
        "scaleY": 1,
        "scaleZ": 1
      }],
      "stepsB": []
    }]
  }
}]);

function initBtn() {
  jQuery("#priceBlock").scroll(function() {
    if (jQuery(this).scrollTop() > 100) {
      jQuery('#upClick').css("top", jQuery(this).scrollTop());
      jQuery('#upClick').show();
    } else {
      jQuery('#upClick').hide();
    }
  });
  jQuery('#upClick').click(function() {
    jQuery("#priceBlock").animate({
      scrollTop: 0
    }, 600);
    return false;
  });
}(function($, d) {
  $(d).ready(function() {
    const mobileMenu = $(".w-nav-menu").find(".menu");
    mobileMenu.prepend('<li class="menu-item menu-item-type-post_type menu-item-object-page">' + '<a href="/">Главная</a>' + '</li>');
    $("#loadPrice").wrap('<div class="c-psevdoScroll"></div>');
    $(".tabs-menu-price").wrap('<div class="c-psevdoScroll"></div>');
    if ($(".table--price-list")[0]) {
      $(".table--price-list").before('<h2 class="c-test">' + $(".table--price-list").find('h2').html() + '</h2>');
    }
    $(".table--price-list").wrap('<div class="c-psevdoScroll"></div>');
    const price = $(".c-psevdoScroll").before('<div><div class="c-scrollTop"><div class="c-scrollTop__inner"></div></div></div>');
    $(".c-scrollTop").scroll(function() {
      console.log($(".c-psevdoScroll"));
      $(".c-psevdoScroll").scrollLeft($(this).scrollLeft());
    });
    $(".c-psevdoScroll").scroll(function() {
      $(".c-scrollTop").scrollLeft($(this).scrollLeft());
    });
  });
}(jQuery, document));
