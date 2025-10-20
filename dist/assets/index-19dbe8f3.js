function Xy(t, e) {
  for (var n = 0; n < e.length; n++) {
    const r = e[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const s in r)
        if (s !== "default" && !(s in t)) {
          const i = Object.getOwnPropertyDescriptor(r, s);
          i &&
            Object.defineProperty(
              t,
              s,
              i.get ? i : { enumerable: !0, get: () => r[s] }
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(t, Symbol.toStringTag, { value: "Module" })
  );
}
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const i of s)
      if (i.type === "childList")
        for (const o of i.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
    const i = {};
    return (
      s.integrity && (i.integrity = s.integrity),
      s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (i.credentials = "include")
        : s.crossOrigin === "anonymous"
        ? (i.credentials = "omit")
        : (i.credentials = "same-origin"),
      i
    );
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const i = n(s);
    fetch(s.href, i);
  }
})();
function Jy(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
    ? t.default
    : t;
}
var Bf = { exports: {} },
  rl = {},
  zf = { exports: {} },
  Z = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var _i = Symbol.for("react.element"),
  Zy = Symbol.for("react.portal"),
  ev = Symbol.for("react.fragment"),
  tv = Symbol.for("react.strict_mode"),
  nv = Symbol.for("react.profiler"),
  rv = Symbol.for("react.provider"),
  sv = Symbol.for("react.context"),
  iv = Symbol.for("react.forward_ref"),
  ov = Symbol.for("react.suspense"),
  lv = Symbol.for("react.memo"),
  av = Symbol.for("react.lazy"),
  Td = Symbol.iterator;
function cv(t) {
  return t === null || typeof t != "object"
    ? null
    : ((t = (Td && t[Td]) || t["@@iterator"]),
      typeof t == "function" ? t : null);
}
var Hf = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Wf = Object.assign,
  Gf = {};
function ns(t, e, n) {
  (this.props = t),
    (this.context = e),
    (this.refs = Gf),
    (this.updater = n || Hf);
}
ns.prototype.isReactComponent = {};
ns.prototype.setState = function (t, e) {
  if (typeof t != "object" && typeof t != "function" && t != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
    );
  this.updater.enqueueSetState(this, t, e, "setState");
};
ns.prototype.forceUpdate = function (t) {
  this.updater.enqueueForceUpdate(this, t, "forceUpdate");
};
function Vf() {}
Vf.prototype = ns.prototype;
function Fc(t, e, n) {
  (this.props = t),
    (this.context = e),
    (this.refs = Gf),
    (this.updater = n || Hf);
}
var Uc = (Fc.prototype = new Vf());
Uc.constructor = Fc;
Wf(Uc, ns.prototype);
Uc.isPureReactComponent = !0;
var kd = Array.isArray,
  Yf = Object.prototype.hasOwnProperty,
  Bc = { current: null },
  Kf = { key: !0, ref: !0, __self: !0, __source: !0 };
function Qf(t, e, n) {
  var r,
    s = {},
    i = null,
    o = null;
  if (e != null)
    for (r in (e.ref !== void 0 && (o = e.ref),
    e.key !== void 0 && (i = "" + e.key),
    e))
      Yf.call(e, r) && !Kf.hasOwnProperty(r) && (s[r] = e[r]);
  var l = arguments.length - 2;
  if (l === 1) s.children = n;
  else if (1 < l) {
    for (var a = Array(l), c = 0; c < l; c++) a[c] = arguments[c + 2];
    s.children = a;
  }
  if (t && t.defaultProps)
    for (r in ((l = t.defaultProps), l)) s[r] === void 0 && (s[r] = l[r]);
  return {
    $$typeof: _i,
    type: t,
    key: i,
    ref: o,
    props: s,
    _owner: Bc.current,
  };
}
function uv(t, e) {
  return {
    $$typeof: _i,
    type: t.type,
    key: e,
    ref: t.ref,
    props: t.props,
    _owner: t._owner,
  };
}
function zc(t) {
  return typeof t == "object" && t !== null && t.$$typeof === _i;
}
function dv(t) {
  var e = { "=": "=0", ":": "=2" };
  return (
    "$" +
    t.replace(/[=:]/g, function (n) {
      return e[n];
    })
  );
}
var Rd = /\/+/g;
function Fl(t, e) {
  return typeof t == "object" && t !== null && t.key != null
    ? dv("" + t.key)
    : e.toString(36);
}
function to(t, e, n, r, s) {
  var i = typeof t;
  (i === "undefined" || i === "boolean") && (t = null);
  var o = !1;
  if (t === null) o = !0;
  else
    switch (i) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (t.$$typeof) {
          case _i:
          case Zy:
            o = !0;
        }
    }
  if (o)
    return (
      (o = t),
      (s = s(o)),
      (t = r === "" ? "." + Fl(o, 0) : r),
      kd(s)
        ? ((n = ""),
          t != null && (n = t.replace(Rd, "$&/") + "/"),
          to(s, e, n, "", function (c) {
            return c;
          }))
        : s != null &&
          (zc(s) &&
            (s = uv(
              s,
              n +
                (!s.key || (o && o.key === s.key)
                  ? ""
                  : ("" + s.key).replace(Rd, "$&/") + "/") +
                t
            )),
          e.push(s)),
      1
    );
  if (((o = 0), (r = r === "" ? "." : r + ":"), kd(t)))
    for (var l = 0; l < t.length; l++) {
      i = t[l];
      var a = r + Fl(i, l);
      o += to(i, e, n, a, s);
    }
  else if (((a = cv(t)), typeof a == "function"))
    for (t = a.call(t), l = 0; !(i = t.next()).done; )
      (i = i.value), (a = r + Fl(i, l++)), (o += to(i, e, n, a, s));
  else if (i === "object")
    throw (
      ((e = String(t)),
      Error(
        "Objects are not valid as a React child (found: " +
          (e === "[object Object]"
            ? "object with keys {" + Object.keys(t).join(", ") + "}"
            : e) +
          "). If you meant to render a collection of children, use an array instead."
      ))
    );
  return o;
}
function Mi(t, e, n) {
  if (t == null) return t;
  var r = [],
    s = 0;
  return (
    to(t, r, "", "", function (i) {
      return e.call(n, i, s++);
    }),
    r
  );
}
function hv(t) {
  if (t._status === -1) {
    var e = t._result;
    (e = e()),
      e.then(
        function (n) {
          (t._status === 0 || t._status === -1) &&
            ((t._status = 1), (t._result = n));
        },
        function (n) {
          (t._status === 0 || t._status === -1) &&
            ((t._status = 2), (t._result = n));
        }
      ),
      t._status === -1 && ((t._status = 0), (t._result = e));
  }
  if (t._status === 1) return t._result.default;
  throw t._result;
}
var Je = { current: null },
  no = { transition: null },
  fv = {
    ReactCurrentDispatcher: Je,
    ReactCurrentBatchConfig: no,
    ReactCurrentOwner: Bc,
  };
function qf() {
  throw Error("act(...) is not supported in production builds of React.");
}
Z.Children = {
  map: Mi,
  forEach: function (t, e, n) {
    Mi(
      t,
      function () {
        e.apply(this, arguments);
      },
      n
    );
  },
  count: function (t) {
    var e = 0;
    return (
      Mi(t, function () {
        e++;
      }),
      e
    );
  },
  toArray: function (t) {
    return (
      Mi(t, function (e) {
        return e;
      }) || []
    );
  },
  only: function (t) {
    if (!zc(t))
      throw Error(
        "React.Children.only expected to receive a single React element child."
      );
    return t;
  },
};
Z.Component = ns;
Z.Fragment = ev;
Z.Profiler = nv;
Z.PureComponent = Fc;
Z.StrictMode = tv;
Z.Suspense = ov;
Z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = fv;
Z.act = qf;
Z.cloneElement = function (t, e, n) {
  if (t == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        t +
        "."
    );
  var r = Wf({}, t.props),
    s = t.key,
    i = t.ref,
    o = t._owner;
  if (e != null) {
    if (
      (e.ref !== void 0 && ((i = e.ref), (o = Bc.current)),
      e.key !== void 0 && (s = "" + e.key),
      t.type && t.type.defaultProps)
    )
      var l = t.type.defaultProps;
    for (a in e)
      Yf.call(e, a) &&
        !Kf.hasOwnProperty(a) &&
        (r[a] = e[a] === void 0 && l !== void 0 ? l[a] : e[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    l = Array(a);
    for (var c = 0; c < a; c++) l[c] = arguments[c + 2];
    r.children = l;
  }
  return { $$typeof: _i, type: t.type, key: s, ref: i, props: r, _owner: o };
};
Z.createContext = function (t) {
  return (
    (t = {
      $$typeof: sv,
      _currentValue: t,
      _currentValue2: t,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (t.Provider = { $$typeof: rv, _context: t }),
    (t.Consumer = t)
  );
};
Z.createElement = Qf;
Z.createFactory = function (t) {
  var e = Qf.bind(null, t);
  return (e.type = t), e;
};
Z.createRef = function () {
  return { current: null };
};
Z.forwardRef = function (t) {
  return { $$typeof: iv, render: t };
};
Z.isValidElement = zc;
Z.lazy = function (t) {
  return { $$typeof: av, _payload: { _status: -1, _result: t }, _init: hv };
};
Z.memo = function (t, e) {
  return { $$typeof: lv, type: t, compare: e === void 0 ? null : e };
};
Z.startTransition = function (t) {
  var e = no.transition;
  no.transition = {};
  try {
    t();
  } finally {
    no.transition = e;
  }
};
Z.unstable_act = qf;
Z.useCallback = function (t, e) {
  return Je.current.useCallback(t, e);
};
Z.useContext = function (t) {
  return Je.current.useContext(t);
};
Z.useDebugValue = function () {};
Z.useDeferredValue = function (t) {
  return Je.current.useDeferredValue(t);
};
Z.useEffect = function (t, e) {
  return Je.current.useEffect(t, e);
};
Z.useId = function () {
  return Je.current.useId();
};
Z.useImperativeHandle = function (t, e, n) {
  return Je.current.useImperativeHandle(t, e, n);
};
Z.useInsertionEffect = function (t, e) {
  return Je.current.useInsertionEffect(t, e);
};
Z.useLayoutEffect = function (t, e) {
  return Je.current.useLayoutEffect(t, e);
};
Z.useMemo = function (t, e) {
  return Je.current.useMemo(t, e);
};
Z.useReducer = function (t, e, n) {
  return Je.current.useReducer(t, e, n);
};
Z.useRef = function (t) {
  return Je.current.useRef(t);
};
Z.useState = function (t) {
  return Je.current.useState(t);
};
Z.useSyncExternalStore = function (t, e, n) {
  return Je.current.useSyncExternalStore(t, e, n);
};
Z.useTransition = function () {
  return Je.current.useTransition();
};
Z.version = "18.3.1";
zf.exports = Z;
var N = zf.exports;
const Hc = Jy(N),
  pv = Xy({ __proto__: null, default: Hc }, [N]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var mv = N,
  gv = Symbol.for("react.element"),
  yv = Symbol.for("react.fragment"),
  vv = Object.prototype.hasOwnProperty,
  _v = mv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  wv = { key: !0, ref: !0, __self: !0, __source: !0 };
function Xf(t, e, n) {
  var r,
    s = {},
    i = null,
    o = null;
  n !== void 0 && (i = "" + n),
    e.key !== void 0 && (i = "" + e.key),
    e.ref !== void 0 && (o = e.ref);
  for (r in e) vv.call(e, r) && !wv.hasOwnProperty(r) && (s[r] = e[r]);
  if (t && t.defaultProps)
    for (r in ((e = t.defaultProps), e)) s[r] === void 0 && (s[r] = e[r]);
  return {
    $$typeof: gv,
    type: t,
    key: i,
    ref: o,
    props: s,
    _owner: _v.current,
  };
}
rl.Fragment = yv;
rl.jsx = Xf;
rl.jsxs = Xf;
Bf.exports = rl;
var u = Bf.exports,
  Sa = {},
  Jf = { exports: {} },
  ft = {},
  Zf = { exports: {} },
  ep = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (t) {
  function e(j, z) {
    var G = j.length;
    j.push(z);
    e: for (; 0 < G; ) {
      var de = (G - 1) >>> 1,
        me = j[de];
      if (0 < s(me, z)) (j[de] = z), (j[G] = me), (G = de);
      else break e;
    }
  }
  function n(j) {
    return j.length === 0 ? null : j[0];
  }
  function r(j) {
    if (j.length === 0) return null;
    var z = j[0],
      G = j.pop();
    if (G !== z) {
      j[0] = G;
      e: for (var de = 0, me = j.length, ln = me >>> 1; de < ln; ) {
        var Wt = 2 * (de + 1) - 1,
          ds = j[Wt],
          Gt = Wt + 1,
          fr = j[Gt];
        if (0 > s(ds, G))
          Gt < me && 0 > s(fr, ds)
            ? ((j[de] = fr), (j[Gt] = G), (de = Gt))
            : ((j[de] = ds), (j[Wt] = G), (de = Wt));
        else if (Gt < me && 0 > s(fr, G)) (j[de] = fr), (j[Gt] = G), (de = Gt);
        else break e;
      }
    }
    return z;
  }
  function s(j, z) {
    var G = j.sortIndex - z.sortIndex;
    return G !== 0 ? G : j.id - z.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var i = performance;
    t.unstable_now = function () {
      return i.now();
    };
  } else {
    var o = Date,
      l = o.now();
    t.unstable_now = function () {
      return o.now() - l;
    };
  }
  var a = [],
    c = [],
    d = 1,
    h = null,
    f = 3,
    p = !1,
    g = !1,
    w = !1,
    E = typeof setTimeout == "function" ? setTimeout : null,
    y = typeof clearTimeout == "function" ? clearTimeout : null,
    m = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function v(j) {
    for (var z = n(c); z !== null; ) {
      if (z.callback === null) r(c);
      else if (z.startTime <= j)
        r(c), (z.sortIndex = z.expirationTime), e(a, z);
      else break;
      z = n(c);
    }
  }
  function _(j) {
    if (((w = !1), v(j), !g))
      if (n(a) !== null) (g = !0), Ne(C);
      else {
        var z = n(c);
        z !== null && Y(_, z.startTime - j);
      }
  }
  function C(j, z) {
    (g = !1), w && ((w = !1), y(A), (A = -1)), (p = !0);
    var G = f;
    try {
      for (
        v(z), h = n(a);
        h !== null && (!(h.expirationTime > z) || (j && !B()));

      ) {
        var de = h.callback;
        if (typeof de == "function") {
          (h.callback = null), (f = h.priorityLevel);
          var me = de(h.expirationTime <= z);
          (z = t.unstable_now()),
            typeof me == "function" ? (h.callback = me) : h === n(a) && r(a),
            v(z);
        } else r(a);
        h = n(a);
      }
      if (h !== null) var ln = !0;
      else {
        var Wt = n(c);
        Wt !== null && Y(_, Wt.startTime - z), (ln = !1);
      }
      return ln;
    } finally {
      (h = null), (f = G), (p = !1);
    }
  }
  var x = !1,
    O = null,
    A = -1,
    M = 5,
    P = -1;
  function B() {
    return !(t.unstable_now() - P < M);
  }
  function V() {
    if (O !== null) {
      var j = t.unstable_now();
      P = j;
      var z = !0;
      try {
        z = O(!0, j);
      } finally {
        z ? Ce() : ((x = !1), (O = null));
      }
    } else x = !1;
  }
  var Ce;
  if (typeof m == "function")
    Ce = function () {
      m(V);
    };
  else if (typeof MessageChannel < "u") {
    var jt = new MessageChannel(),
      Mt = jt.port2;
    (jt.port1.onmessage = V),
      (Ce = function () {
        Mt.postMessage(null);
      });
  } else
    Ce = function () {
      E(V, 0);
    };
  function Ne(j) {
    (O = j), x || ((x = !0), Ce());
  }
  function Y(j, z) {
    A = E(function () {
      j(t.unstable_now());
    }, z);
  }
  (t.unstable_IdlePriority = 5),
    (t.unstable_ImmediatePriority = 1),
    (t.unstable_LowPriority = 4),
    (t.unstable_NormalPriority = 3),
    (t.unstable_Profiling = null),
    (t.unstable_UserBlockingPriority = 2),
    (t.unstable_cancelCallback = function (j) {
      j.callback = null;
    }),
    (t.unstable_continueExecution = function () {
      g || p || ((g = !0), Ne(C));
    }),
    (t.unstable_forceFrameRate = function (j) {
      0 > j || 125 < j
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
          )
        : (M = 0 < j ? Math.floor(1e3 / j) : 5);
    }),
    (t.unstable_getCurrentPriorityLevel = function () {
      return f;
    }),
    (t.unstable_getFirstCallbackNode = function () {
      return n(a);
    }),
    (t.unstable_next = function (j) {
      switch (f) {
        case 1:
        case 2:
        case 3:
          var z = 3;
          break;
        default:
          z = f;
      }
      var G = f;
      f = z;
      try {
        return j();
      } finally {
        f = G;
      }
    }),
    (t.unstable_pauseExecution = function () {}),
    (t.unstable_requestPaint = function () {}),
    (t.unstable_runWithPriority = function (j, z) {
      switch (j) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          j = 3;
      }
      var G = f;
      f = j;
      try {
        return z();
      } finally {
        f = G;
      }
    }),
    (t.unstable_scheduleCallback = function (j, z, G) {
      var de = t.unstable_now();
      switch (
        (typeof G == "object" && G !== null
          ? ((G = G.delay), (G = typeof G == "number" && 0 < G ? de + G : de))
          : (G = de),
        j)
      ) {
        case 1:
          var me = -1;
          break;
        case 2:
          me = 250;
          break;
        case 5:
          me = 1073741823;
          break;
        case 4:
          me = 1e4;
          break;
        default:
          me = 5e3;
      }
      return (
        (me = G + me),
        (j = {
          id: d++,
          callback: z,
          priorityLevel: j,
          startTime: G,
          expirationTime: me,
          sortIndex: -1,
        }),
        G > de
          ? ((j.sortIndex = G),
            e(c, j),
            n(a) === null &&
              j === n(c) &&
              (w ? (y(A), (A = -1)) : (w = !0), Y(_, G - de)))
          : ((j.sortIndex = me), e(a, j), g || p || ((g = !0), Ne(C))),
        j
      );
    }),
    (t.unstable_shouldYield = B),
    (t.unstable_wrapCallback = function (j) {
      var z = f;
      return function () {
        var G = f;
        f = z;
        try {
          return j.apply(this, arguments);
        } finally {
          f = G;
        }
      };
    });
})(ep);
Zf.exports = ep;
var Cv = Zf.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ev = N,
  dt = Cv;
function I(t) {
  for (
    var e = "https://reactjs.org/docs/error-decoder.html?invariant=" + t, n = 1;
    n < arguments.length;
    n++
  )
    e += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    t +
    "; visit " +
    e +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var tp = new Set(),
  Hs = {};
function or(t, e) {
  Br(t, e), Br(t + "Capture", e);
}
function Br(t, e) {
  for (Hs[t] = e, t = 0; t < e.length; t++) tp.add(e[t]);
}
var en = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  xa = Object.prototype.hasOwnProperty,
  Sv =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Pd = {},
  Id = {};
function xv(t) {
  return xa.call(Id, t)
    ? !0
    : xa.call(Pd, t)
    ? !1
    : Sv.test(t)
    ? (Id[t] = !0)
    : ((Pd[t] = !0), !1);
}
function Nv(t, e, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof e) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
        ? !n.acceptsBooleans
        : ((t = t.toLowerCase().slice(0, 5)), t !== "data-" && t !== "aria-");
    default:
      return !1;
  }
}
function Tv(t, e, n, r) {
  if (e === null || typeof e > "u" || Nv(t, e, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !e;
      case 4:
        return e === !1;
      case 5:
        return isNaN(e);
      case 6:
        return isNaN(e) || 1 > e;
    }
  return !1;
}
function Ze(t, e, n, r, s, i, o) {
  (this.acceptsBooleans = e === 2 || e === 3 || e === 4),
    (this.attributeName = r),
    (this.attributeNamespace = s),
    (this.mustUseProperty = n),
    (this.propertyName = t),
    (this.type = e),
    (this.sanitizeURL = i),
    (this.removeEmptyString = o);
}
var ze = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (t) {
    ze[t] = new Ze(t, 0, !1, t, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (t) {
  var e = t[0];
  ze[e] = new Ze(e, 1, !1, t[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (t) {
  ze[t] = new Ze(t, 2, !1, t.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (t) {
  ze[t] = new Ze(t, 2, !1, t, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (t) {
    ze[t] = new Ze(t, 3, !1, t.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (t) {
  ze[t] = new Ze(t, 3, !0, t, null, !1, !1);
});
["capture", "download"].forEach(function (t) {
  ze[t] = new Ze(t, 4, !1, t, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (t) {
  ze[t] = new Ze(t, 6, !1, t, null, !1, !1);
});
["rowSpan", "start"].forEach(function (t) {
  ze[t] = new Ze(t, 5, !1, t.toLowerCase(), null, !1, !1);
});
var Wc = /[\-:]([a-z])/g;
function Gc(t) {
  return t[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (t) {
    var e = t.replace(Wc, Gc);
    ze[e] = new Ze(e, 1, !1, t, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (t) {
    var e = t.replace(Wc, Gc);
    ze[e] = new Ze(e, 1, !1, t, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (t) {
  var e = t.replace(Wc, Gc);
  ze[e] = new Ze(e, 1, !1, t, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (t) {
  ze[t] = new Ze(t, 1, !1, t.toLowerCase(), null, !1, !1);
});
ze.xlinkHref = new Ze(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1
);
["src", "href", "action", "formAction"].forEach(function (t) {
  ze[t] = new Ze(t, 1, !1, t.toLowerCase(), null, !0, !0);
});
function Vc(t, e, n, r) {
  var s = ze.hasOwnProperty(e) ? ze[e] : null;
  (s !== null
    ? s.type !== 0
    : r ||
      !(2 < e.length) ||
      (e[0] !== "o" && e[0] !== "O") ||
      (e[1] !== "n" && e[1] !== "N")) &&
    (Tv(e, n, s, r) && (n = null),
    r || s === null
      ? xv(e) && (n === null ? t.removeAttribute(e) : t.setAttribute(e, "" + n))
      : s.mustUseProperty
      ? (t[s.propertyName] = n === null ? (s.type === 3 ? !1 : "") : n)
      : ((e = s.attributeName),
        (r = s.attributeNamespace),
        n === null
          ? t.removeAttribute(e)
          : ((s = s.type),
            (n = s === 3 || (s === 4 && n === !0) ? "" : "" + n),
            r ? t.setAttributeNS(r, e, n) : t.setAttribute(e, n))));
}
var on = Ev.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  Di = Symbol.for("react.element"),
  vr = Symbol.for("react.portal"),
  _r = Symbol.for("react.fragment"),
  Yc = Symbol.for("react.strict_mode"),
  Na = Symbol.for("react.profiler"),
  np = Symbol.for("react.provider"),
  rp = Symbol.for("react.context"),
  Kc = Symbol.for("react.forward_ref"),
  Ta = Symbol.for("react.suspense"),
  ka = Symbol.for("react.suspense_list"),
  Qc = Symbol.for("react.memo"),
  un = Symbol.for("react.lazy"),
  sp = Symbol.for("react.offscreen"),
  Od = Symbol.iterator;
function ps(t) {
  return t === null || typeof t != "object"
    ? null
    : ((t = (Od && t[Od]) || t["@@iterator"]),
      typeof t == "function" ? t : null);
}
var we = Object.assign,
  Ul;
function Ts(t) {
  if (Ul === void 0)
    try {
      throw Error();
    } catch (n) {
      var e = n.stack.trim().match(/\n( *(at )?)/);
      Ul = (e && e[1]) || "";
    }
  return (
    `
` +
    Ul +
    t
  );
}
var Bl = !1;
function zl(t, e) {
  if (!t || Bl) return "";
  Bl = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (e)
      if (
        ((e = function () {
          throw Error();
        }),
        Object.defineProperty(e.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(e, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(t, [], e);
      } else {
        try {
          e.call();
        } catch (c) {
          r = c;
        }
        t.call(e.prototype);
      }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      t();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (
        var s = c.stack.split(`
`),
          i = r.stack.split(`
`),
          o = s.length - 1,
          l = i.length - 1;
        1 <= o && 0 <= l && s[o] !== i[l];

      )
        l--;
      for (; 1 <= o && 0 <= l; o--, l--)
        if (s[o] !== i[l]) {
          if (o !== 1 || l !== 1)
            do
              if ((o--, l--, 0 > l || s[o] !== i[l])) {
                var a =
                  `
` + s[o].replace(" at new ", " at ");
                return (
                  t.displayName &&
                    a.includes("<anonymous>") &&
                    (a = a.replace("<anonymous>", t.displayName)),
                  a
                );
              }
            while (1 <= o && 0 <= l);
          break;
        }
    }
  } finally {
    (Bl = !1), (Error.prepareStackTrace = n);
  }
  return (t = t ? t.displayName || t.name : "") ? Ts(t) : "";
}
function kv(t) {
  switch (t.tag) {
    case 5:
      return Ts(t.type);
    case 16:
      return Ts("Lazy");
    case 13:
      return Ts("Suspense");
    case 19:
      return Ts("SuspenseList");
    case 0:
    case 2:
    case 15:
      return (t = zl(t.type, !1)), t;
    case 11:
      return (t = zl(t.type.render, !1)), t;
    case 1:
      return (t = zl(t.type, !0)), t;
    default:
      return "";
  }
}
function Ra(t) {
  if (t == null) return null;
  if (typeof t == "function") return t.displayName || t.name || null;
  if (typeof t == "string") return t;
  switch (t) {
    case _r:
      return "Fragment";
    case vr:
      return "Portal";
    case Na:
      return "Profiler";
    case Yc:
      return "StrictMode";
    case Ta:
      return "Suspense";
    case ka:
      return "SuspenseList";
  }
  if (typeof t == "object")
    switch (t.$$typeof) {
      case rp:
        return (t.displayName || "Context") + ".Consumer";
      case np:
        return (t._context.displayName || "Context") + ".Provider";
      case Kc:
        var e = t.render;
        return (
          (t = t.displayName),
          t ||
            ((t = e.displayName || e.name || ""),
            (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
          t
        );
      case Qc:
        return (
          (e = t.displayName || null), e !== null ? e : Ra(t.type) || "Memo"
        );
      case un:
        (e = t._payload), (t = t._init);
        try {
          return Ra(t(e));
        } catch {}
    }
  return null;
}
function Rv(t) {
  var e = t.type;
  switch (t.tag) {
    case 24:
      return "Cache";
    case 9:
      return (e.displayName || "Context") + ".Consumer";
    case 10:
      return (e._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (t = e.render),
        (t = t.displayName || t.name || ""),
        e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return e;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Ra(e);
    case 8:
      return e === Yc ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof e == "function") return e.displayName || e.name || null;
      if (typeof e == "string") return e;
  }
  return null;
}
function In(t) {
  switch (typeof t) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return t;
    case "object":
      return t;
    default:
      return "";
  }
}
function ip(t) {
  var e = t.type;
  return (
    (t = t.nodeName) &&
    t.toLowerCase() === "input" &&
    (e === "checkbox" || e === "radio")
  );
}
function Pv(t) {
  var e = ip(t) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
    r = "" + t[e];
  if (
    !t.hasOwnProperty(e) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var s = n.get,
      i = n.set;
    return (
      Object.defineProperty(t, e, {
        configurable: !0,
        get: function () {
          return s.call(this);
        },
        set: function (o) {
          (r = "" + o), i.call(this, o);
        },
      }),
      Object.defineProperty(t, e, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (o) {
          r = "" + o;
        },
        stopTracking: function () {
          (t._valueTracker = null), delete t[e];
        },
      }
    );
  }
}
function Li(t) {
  t._valueTracker || (t._valueTracker = Pv(t));
}
function op(t) {
  if (!t) return !1;
  var e = t._valueTracker;
  if (!e) return !0;
  var n = e.getValue(),
    r = "";
  return (
    t && (r = ip(t) ? (t.checked ? "true" : "false") : t.value),
    (t = r),
    t !== n ? (e.setValue(t), !0) : !1
  );
}
function po(t) {
  if (((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u"))
    return null;
  try {
    return t.activeElement || t.body;
  } catch {
    return t.body;
  }
}
function Pa(t, e) {
  var n = e.checked;
  return we({}, e, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? t._wrapperState.initialChecked,
  });
}
function bd(t, e) {
  var n = e.defaultValue == null ? "" : e.defaultValue,
    r = e.checked != null ? e.checked : e.defaultChecked;
  (n = In(e.value != null ? e.value : n)),
    (t._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        e.type === "checkbox" || e.type === "radio"
          ? e.checked != null
          : e.value != null,
    });
}
function lp(t, e) {
  (e = e.checked), e != null && Vc(t, "checked", e, !1);
}
function Ia(t, e) {
  lp(t, e);
  var n = In(e.value),
    r = e.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && t.value === "") || t.value != n) && (t.value = "" + n)
      : t.value !== "" + n && (t.value = "" + n);
  else if (r === "submit" || r === "reset") {
    t.removeAttribute("value");
    return;
  }
  e.hasOwnProperty("value")
    ? Oa(t, e.type, n)
    : e.hasOwnProperty("defaultValue") && Oa(t, e.type, In(e.defaultValue)),
    e.checked == null &&
      e.defaultChecked != null &&
      (t.defaultChecked = !!e.defaultChecked);
}
function Ad(t, e, n) {
  if (e.hasOwnProperty("value") || e.hasOwnProperty("defaultValue")) {
    var r = e.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (e.value !== void 0 && e.value !== null)
      )
    )
      return;
    (e = "" + t._wrapperState.initialValue),
      n || e === t.value || (t.value = e),
      (t.defaultValue = e);
  }
  (n = t.name),
    n !== "" && (t.name = ""),
    (t.defaultChecked = !!t._wrapperState.initialChecked),
    n !== "" && (t.name = n);
}
function Oa(t, e, n) {
  (e !== "number" || po(t.ownerDocument) !== t) &&
    (n == null
      ? (t.defaultValue = "" + t._wrapperState.initialValue)
      : t.defaultValue !== "" + n && (t.defaultValue = "" + n));
}
var ks = Array.isArray;
function Or(t, e, n, r) {
  if (((t = t.options), e)) {
    e = {};
    for (var s = 0; s < n.length; s++) e["$" + n[s]] = !0;
    for (n = 0; n < t.length; n++)
      (s = e.hasOwnProperty("$" + t[n].value)),
        t[n].selected !== s && (t[n].selected = s),
        s && r && (t[n].defaultSelected = !0);
  } else {
    for (n = "" + In(n), e = null, s = 0; s < t.length; s++) {
      if (t[s].value === n) {
        (t[s].selected = !0), r && (t[s].defaultSelected = !0);
        return;
      }
      e !== null || t[s].disabled || (e = t[s]);
    }
    e !== null && (e.selected = !0);
  }
}
function ba(t, e) {
  if (e.dangerouslySetInnerHTML != null) throw Error(I(91));
  return we({}, e, {
    value: void 0,
    defaultValue: void 0,
    children: "" + t._wrapperState.initialValue,
  });
}
function jd(t, e) {
  var n = e.value;
  if (n == null) {
    if (((n = e.children), (e = e.defaultValue), n != null)) {
      if (e != null) throw Error(I(92));
      if (ks(n)) {
        if (1 < n.length) throw Error(I(93));
        n = n[0];
      }
      e = n;
    }
    e == null && (e = ""), (n = e);
  }
  t._wrapperState = { initialValue: In(n) };
}
function ap(t, e) {
  var n = In(e.value),
    r = In(e.defaultValue);
  n != null &&
    ((n = "" + n),
    n !== t.value && (t.value = n),
    e.defaultValue == null && t.defaultValue !== n && (t.defaultValue = n)),
    r != null && (t.defaultValue = "" + r);
}
function Md(t) {
  var e = t.textContent;
  e === t._wrapperState.initialValue && e !== "" && e !== null && (t.value = e);
}
function cp(t) {
  switch (t) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Aa(t, e) {
  return t == null || t === "http://www.w3.org/1999/xhtml"
    ? cp(e)
    : t === "http://www.w3.org/2000/svg" && e === "foreignObject"
    ? "http://www.w3.org/1999/xhtml"
    : t;
}
var $i,
  up = (function (t) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (e, n, r, s) {
          MSApp.execUnsafeLocalFunction(function () {
            return t(e, n, r, s);
          });
        }
      : t;
  })(function (t, e) {
    if (t.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in t)
      t.innerHTML = e;
    else {
      for (
        $i = $i || document.createElement("div"),
          $i.innerHTML = "<svg>" + e.valueOf().toString() + "</svg>",
          e = $i.firstChild;
        t.firstChild;

      )
        t.removeChild(t.firstChild);
      for (; e.firstChild; ) t.appendChild(e.firstChild);
    }
  });
function Ws(t, e) {
  if (e) {
    var n = t.firstChild;
    if (n && n === t.lastChild && n.nodeType === 3) {
      n.nodeValue = e;
      return;
    }
  }
  t.textContent = e;
}
var Is = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Iv = ["Webkit", "ms", "Moz", "O"];
Object.keys(Is).forEach(function (t) {
  Iv.forEach(function (e) {
    (e = e + t.charAt(0).toUpperCase() + t.substring(1)), (Is[e] = Is[t]);
  });
});
function dp(t, e, n) {
  return e == null || typeof e == "boolean" || e === ""
    ? ""
    : n || typeof e != "number" || e === 0 || (Is.hasOwnProperty(t) && Is[t])
    ? ("" + e).trim()
    : e + "px";
}
function hp(t, e) {
  t = t.style;
  for (var n in e)
    if (e.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        s = dp(n, e[n], r);
      n === "float" && (n = "cssFloat"), r ? t.setProperty(n, s) : (t[n] = s);
    }
}
var Ov = we(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  }
);
function ja(t, e) {
  if (e) {
    if (Ov[t] && (e.children != null || e.dangerouslySetInnerHTML != null))
      throw Error(I(137, t));
    if (e.dangerouslySetInnerHTML != null) {
      if (e.children != null) throw Error(I(60));
      if (
        typeof e.dangerouslySetInnerHTML != "object" ||
        !("__html" in e.dangerouslySetInnerHTML)
      )
        throw Error(I(61));
    }
    if (e.style != null && typeof e.style != "object") throw Error(I(62));
  }
}
function Ma(t, e) {
  if (t.indexOf("-") === -1) return typeof e.is == "string";
  switch (t) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Da = null;
function qc(t) {
  return (
    (t = t.target || t.srcElement || window),
    t.correspondingUseElement && (t = t.correspondingUseElement),
    t.nodeType === 3 ? t.parentNode : t
  );
}
var La = null,
  br = null,
  Ar = null;
function Dd(t) {
  if ((t = Ei(t))) {
    if (typeof La != "function") throw Error(I(280));
    var e = t.stateNode;
    e && ((e = al(e)), La(t.stateNode, t.type, e));
  }
}
function fp(t) {
  br ? (Ar ? Ar.push(t) : (Ar = [t])) : (br = t);
}
function pp() {
  if (br) {
    var t = br,
      e = Ar;
    if (((Ar = br = null), Dd(t), e)) for (t = 0; t < e.length; t++) Dd(e[t]);
  }
}
function mp(t, e) {
  return t(e);
}
function gp() {}
var Hl = !1;
function yp(t, e, n) {
  if (Hl) return t(e, n);
  Hl = !0;
  try {
    return mp(t, e, n);
  } finally {
    (Hl = !1), (br !== null || Ar !== null) && (gp(), pp());
  }
}
function Gs(t, e) {
  var n = t.stateNode;
  if (n === null) return null;
  var r = al(n);
  if (r === null) return null;
  n = r[e];
  e: switch (e) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) ||
        ((t = t.type),
        (r = !(
          t === "button" ||
          t === "input" ||
          t === "select" ||
          t === "textarea"
        ))),
        (t = !r);
      break e;
    default:
      t = !1;
  }
  if (t) return null;
  if (n && typeof n != "function") throw Error(I(231, e, typeof n));
  return n;
}
var $a = !1;
if (en)
  try {
    var ms = {};
    Object.defineProperty(ms, "passive", {
      get: function () {
        $a = !0;
      },
    }),
      window.addEventListener("test", ms, ms),
      window.removeEventListener("test", ms, ms);
  } catch {
    $a = !1;
  }
function bv(t, e, n, r, s, i, o, l, a) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    e.apply(n, c);
  } catch (d) {
    this.onError(d);
  }
}
var Os = !1,
  mo = null,
  go = !1,
  Fa = null,
  Av = {
    onError: function (t) {
      (Os = !0), (mo = t);
    },
  };
function jv(t, e, n, r, s, i, o, l, a) {
  (Os = !1), (mo = null), bv.apply(Av, arguments);
}
function Mv(t, e, n, r, s, i, o, l, a) {
  if ((jv.apply(this, arguments), Os)) {
    if (Os) {
      var c = mo;
      (Os = !1), (mo = null);
    } else throw Error(I(198));
    go || ((go = !0), (Fa = c));
  }
}
function lr(t) {
  var e = t,
    n = t;
  if (t.alternate) for (; e.return; ) e = e.return;
  else {
    t = e;
    do (e = t), e.flags & 4098 && (n = e.return), (t = e.return);
    while (t);
  }
  return e.tag === 3 ? n : null;
}
function vp(t) {
  if (t.tag === 13) {
    var e = t.memoizedState;
    if (
      (e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)),
      e !== null)
    )
      return e.dehydrated;
  }
  return null;
}
function Ld(t) {
  if (lr(t) !== t) throw Error(I(188));
}
function Dv(t) {
  var e = t.alternate;
  if (!e) {
    if (((e = lr(t)), e === null)) throw Error(I(188));
    return e !== t ? null : t;
  }
  for (var n = t, r = e; ; ) {
    var s = n.return;
    if (s === null) break;
    var i = s.alternate;
    if (i === null) {
      if (((r = s.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (s.child === i.child) {
      for (i = s.child; i; ) {
        if (i === n) return Ld(s), t;
        if (i === r) return Ld(s), e;
        i = i.sibling;
      }
      throw Error(I(188));
    }
    if (n.return !== r.return) (n = s), (r = i);
    else {
      for (var o = !1, l = s.child; l; ) {
        if (l === n) {
          (o = !0), (n = s), (r = i);
          break;
        }
        if (l === r) {
          (o = !0), (r = s), (n = i);
          break;
        }
        l = l.sibling;
      }
      if (!o) {
        for (l = i.child; l; ) {
          if (l === n) {
            (o = !0), (n = i), (r = s);
            break;
          }
          if (l === r) {
            (o = !0), (r = i), (n = s);
            break;
          }
          l = l.sibling;
        }
        if (!o) throw Error(I(189));
      }
    }
    if (n.alternate !== r) throw Error(I(190));
  }
  if (n.tag !== 3) throw Error(I(188));
  return n.stateNode.current === n ? t : e;
}
function _p(t) {
  return (t = Dv(t)), t !== null ? wp(t) : null;
}
function wp(t) {
  if (t.tag === 5 || t.tag === 6) return t;
  for (t = t.child; t !== null; ) {
    var e = wp(t);
    if (e !== null) return e;
    t = t.sibling;
  }
  return null;
}
var Cp = dt.unstable_scheduleCallback,
  $d = dt.unstable_cancelCallback,
  Lv = dt.unstable_shouldYield,
  $v = dt.unstable_requestPaint,
  Te = dt.unstable_now,
  Fv = dt.unstable_getCurrentPriorityLevel,
  Xc = dt.unstable_ImmediatePriority,
  Ep = dt.unstable_UserBlockingPriority,
  yo = dt.unstable_NormalPriority,
  Uv = dt.unstable_LowPriority,
  Sp = dt.unstable_IdlePriority,
  sl = null,
  Ut = null;
function Bv(t) {
  if (Ut && typeof Ut.onCommitFiberRoot == "function")
    try {
      Ut.onCommitFiberRoot(sl, t, void 0, (t.current.flags & 128) === 128);
    } catch {}
}
var It = Math.clz32 ? Math.clz32 : Wv,
  zv = Math.log,
  Hv = Math.LN2;
function Wv(t) {
  return (t >>>= 0), t === 0 ? 32 : (31 - ((zv(t) / Hv) | 0)) | 0;
}
var Fi = 64,
  Ui = 4194304;
function Rs(t) {
  switch (t & -t) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return t & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return t;
  }
}
function vo(t, e) {
  var n = t.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    s = t.suspendedLanes,
    i = t.pingedLanes,
    o = n & 268435455;
  if (o !== 0) {
    var l = o & ~s;
    l !== 0 ? (r = Rs(l)) : ((i &= o), i !== 0 && (r = Rs(i)));
  } else (o = n & ~s), o !== 0 ? (r = Rs(o)) : i !== 0 && (r = Rs(i));
  if (r === 0) return 0;
  if (
    e !== 0 &&
    e !== r &&
    !(e & s) &&
    ((s = r & -r), (i = e & -e), s >= i || (s === 16 && (i & 4194240) !== 0))
  )
    return e;
  if ((r & 4 && (r |= n & 16), (e = t.entangledLanes), e !== 0))
    for (t = t.entanglements, e &= r; 0 < e; )
      (n = 31 - It(e)), (s = 1 << n), (r |= t[n]), (e &= ~s);
  return r;
}
function Gv(t, e) {
  switch (t) {
    case 1:
    case 2:
    case 4:
      return e + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Vv(t, e) {
  for (
    var n = t.suspendedLanes,
      r = t.pingedLanes,
      s = t.expirationTimes,
      i = t.pendingLanes;
    0 < i;

  ) {
    var o = 31 - It(i),
      l = 1 << o,
      a = s[o];
    a === -1
      ? (!(l & n) || l & r) && (s[o] = Gv(l, e))
      : a <= e && (t.expiredLanes |= l),
      (i &= ~l);
  }
}
function Ua(t) {
  return (
    (t = t.pendingLanes & -1073741825),
    t !== 0 ? t : t & 1073741824 ? 1073741824 : 0
  );
}
function xp() {
  var t = Fi;
  return (Fi <<= 1), !(Fi & 4194240) && (Fi = 64), t;
}
function Wl(t) {
  for (var e = [], n = 0; 31 > n; n++) e.push(t);
  return e;
}
function wi(t, e, n) {
  (t.pendingLanes |= e),
    e !== 536870912 && ((t.suspendedLanes = 0), (t.pingedLanes = 0)),
    (t = t.eventTimes),
    (e = 31 - It(e)),
    (t[e] = n);
}
function Yv(t, e) {
  var n = t.pendingLanes & ~e;
  (t.pendingLanes = e),
    (t.suspendedLanes = 0),
    (t.pingedLanes = 0),
    (t.expiredLanes &= e),
    (t.mutableReadLanes &= e),
    (t.entangledLanes &= e),
    (e = t.entanglements);
  var r = t.eventTimes;
  for (t = t.expirationTimes; 0 < n; ) {
    var s = 31 - It(n),
      i = 1 << s;
    (e[s] = 0), (r[s] = -1), (t[s] = -1), (n &= ~i);
  }
}
function Jc(t, e) {
  var n = (t.entangledLanes |= e);
  for (t = t.entanglements; n; ) {
    var r = 31 - It(n),
      s = 1 << r;
    (s & e) | (t[r] & e) && (t[r] |= e), (n &= ~s);
  }
}
var re = 0;
function Np(t) {
  return (t &= -t), 1 < t ? (4 < t ? (t & 268435455 ? 16 : 536870912) : 4) : 1;
}
var Tp,
  Zc,
  kp,
  Rp,
  Pp,
  Ba = !1,
  Bi = [],
  vn = null,
  _n = null,
  wn = null,
  Vs = new Map(),
  Ys = new Map(),
  hn = [],
  Kv =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " "
    );
function Fd(t, e) {
  switch (t) {
    case "focusin":
    case "focusout":
      vn = null;
      break;
    case "dragenter":
    case "dragleave":
      _n = null;
      break;
    case "mouseover":
    case "mouseout":
      wn = null;
      break;
    case "pointerover":
    case "pointerout":
      Vs.delete(e.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Ys.delete(e.pointerId);
  }
}
function gs(t, e, n, r, s, i) {
  return t === null || t.nativeEvent !== i
    ? ((t = {
        blockedOn: e,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: i,
        targetContainers: [s],
      }),
      e !== null && ((e = Ei(e)), e !== null && Zc(e)),
      t)
    : ((t.eventSystemFlags |= r),
      (e = t.targetContainers),
      s !== null && e.indexOf(s) === -1 && e.push(s),
      t);
}
function Qv(t, e, n, r, s) {
  switch (e) {
    case "focusin":
      return (vn = gs(vn, t, e, n, r, s)), !0;
    case "dragenter":
      return (_n = gs(_n, t, e, n, r, s)), !0;
    case "mouseover":
      return (wn = gs(wn, t, e, n, r, s)), !0;
    case "pointerover":
      var i = s.pointerId;
      return Vs.set(i, gs(Vs.get(i) || null, t, e, n, r, s)), !0;
    case "gotpointercapture":
      return (
        (i = s.pointerId), Ys.set(i, gs(Ys.get(i) || null, t, e, n, r, s)), !0
      );
  }
  return !1;
}
function Ip(t) {
  var e = Hn(t.target);
  if (e !== null) {
    var n = lr(e);
    if (n !== null) {
      if (((e = n.tag), e === 13)) {
        if (((e = vp(n)), e !== null)) {
          (t.blockedOn = e),
            Pp(t.priority, function () {
              kp(n);
            });
          return;
        }
      } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  t.blockedOn = null;
}
function ro(t) {
  if (t.blockedOn !== null) return !1;
  for (var e = t.targetContainers; 0 < e.length; ) {
    var n = za(t.domEventName, t.eventSystemFlags, e[0], t.nativeEvent);
    if (n === null) {
      n = t.nativeEvent;
      var r = new n.constructor(n.type, n);
      (Da = r), n.target.dispatchEvent(r), (Da = null);
    } else return (e = Ei(n)), e !== null && Zc(e), (t.blockedOn = n), !1;
    e.shift();
  }
  return !0;
}
function Ud(t, e, n) {
  ro(t) && n.delete(e);
}
function qv() {
  (Ba = !1),
    vn !== null && ro(vn) && (vn = null),
    _n !== null && ro(_n) && (_n = null),
    wn !== null && ro(wn) && (wn = null),
    Vs.forEach(Ud),
    Ys.forEach(Ud);
}
function ys(t, e) {
  t.blockedOn === e &&
    ((t.blockedOn = null),
    Ba ||
      ((Ba = !0),
      dt.unstable_scheduleCallback(dt.unstable_NormalPriority, qv)));
}
function Ks(t) {
  function e(s) {
    return ys(s, t);
  }
  if (0 < Bi.length) {
    ys(Bi[0], t);
    for (var n = 1; n < Bi.length; n++) {
      var r = Bi[n];
      r.blockedOn === t && (r.blockedOn = null);
    }
  }
  for (
    vn !== null && ys(vn, t),
      _n !== null && ys(_n, t),
      wn !== null && ys(wn, t),
      Vs.forEach(e),
      Ys.forEach(e),
      n = 0;
    n < hn.length;
    n++
  )
    (r = hn[n]), r.blockedOn === t && (r.blockedOn = null);
  for (; 0 < hn.length && ((n = hn[0]), n.blockedOn === null); )
    Ip(n), n.blockedOn === null && hn.shift();
}
var jr = on.ReactCurrentBatchConfig,
  _o = !0;
function Xv(t, e, n, r) {
  var s = re,
    i = jr.transition;
  jr.transition = null;
  try {
    (re = 1), eu(t, e, n, r);
  } finally {
    (re = s), (jr.transition = i);
  }
}
function Jv(t, e, n, r) {
  var s = re,
    i = jr.transition;
  jr.transition = null;
  try {
    (re = 4), eu(t, e, n, r);
  } finally {
    (re = s), (jr.transition = i);
  }
}
function eu(t, e, n, r) {
  if (_o) {
    var s = za(t, e, n, r);
    if (s === null) ea(t, e, r, wo, n), Fd(t, r);
    else if (Qv(s, t, e, n, r)) r.stopPropagation();
    else if ((Fd(t, r), e & 4 && -1 < Kv.indexOf(t))) {
      for (; s !== null; ) {
        var i = Ei(s);
        if (
          (i !== null && Tp(i),
          (i = za(t, e, n, r)),
          i === null && ea(t, e, r, wo, n),
          i === s)
        )
          break;
        s = i;
      }
      s !== null && r.stopPropagation();
    } else ea(t, e, r, null, n);
  }
}
var wo = null;
function za(t, e, n, r) {
  if (((wo = null), (t = qc(r)), (t = Hn(t)), t !== null))
    if (((e = lr(t)), e === null)) t = null;
    else if (((n = e.tag), n === 13)) {
      if (((t = vp(e)), t !== null)) return t;
      t = null;
    } else if (n === 3) {
      if (e.stateNode.current.memoizedState.isDehydrated)
        return e.tag === 3 ? e.stateNode.containerInfo : null;
      t = null;
    } else e !== t && (t = null);
  return (wo = t), null;
}
function Op(t) {
  switch (t) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Fv()) {
        case Xc:
          return 1;
        case Ep:
          return 4;
        case yo:
        case Uv:
          return 16;
        case Sp:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var pn = null,
  tu = null,
  so = null;
function bp() {
  if (so) return so;
  var t,
    e = tu,
    n = e.length,
    r,
    s = "value" in pn ? pn.value : pn.textContent,
    i = s.length;
  for (t = 0; t < n && e[t] === s[t]; t++);
  var o = n - t;
  for (r = 1; r <= o && e[n - r] === s[i - r]; r++);
  return (so = s.slice(t, 1 < r ? 1 - r : void 0));
}
function io(t) {
  var e = t.keyCode;
  return (
    "charCode" in t
      ? ((t = t.charCode), t === 0 && e === 13 && (t = 13))
      : (t = e),
    t === 10 && (t = 13),
    32 <= t || t === 13 ? t : 0
  );
}
function zi() {
  return !0;
}
function Bd() {
  return !1;
}
function pt(t) {
  function e(n, r, s, i, o) {
    (this._reactName = n),
      (this._targetInst = s),
      (this.type = r),
      (this.nativeEvent = i),
      (this.target = o),
      (this.currentTarget = null);
    for (var l in t)
      t.hasOwnProperty(l) && ((n = t[l]), (this[l] = n ? n(i) : i[l]));
    return (
      (this.isDefaultPrevented = (
        i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
      )
        ? zi
        : Bd),
      (this.isPropagationStopped = Bd),
      this
    );
  }
  return (
    we(e.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = zi));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = zi));
      },
      persist: function () {},
      isPersistent: zi,
    }),
    e
  );
}
var rs = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  nu = pt(rs),
  Ci = we({}, rs, { view: 0, detail: 0 }),
  Zv = pt(Ci),
  Gl,
  Vl,
  vs,
  il = we({}, Ci, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: ru,
    button: 0,
    buttons: 0,
    relatedTarget: function (t) {
      return t.relatedTarget === void 0
        ? t.fromElement === t.srcElement
          ? t.toElement
          : t.fromElement
        : t.relatedTarget;
    },
    movementX: function (t) {
      return "movementX" in t
        ? t.movementX
        : (t !== vs &&
            (vs && t.type === "mousemove"
              ? ((Gl = t.screenX - vs.screenX), (Vl = t.screenY - vs.screenY))
              : (Vl = Gl = 0),
            (vs = t)),
          Gl);
    },
    movementY: function (t) {
      return "movementY" in t ? t.movementY : Vl;
    },
  }),
  zd = pt(il),
  e_ = we({}, il, { dataTransfer: 0 }),
  t_ = pt(e_),
  n_ = we({}, Ci, { relatedTarget: 0 }),
  Yl = pt(n_),
  r_ = we({}, rs, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  s_ = pt(r_),
  i_ = we({}, rs, {
    clipboardData: function (t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    },
  }),
  o_ = pt(i_),
  l_ = we({}, rs, { data: 0 }),
  Hd = pt(l_),
  a_ = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  c_ = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  u_ = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function d_(t) {
  var e = this.nativeEvent;
  return e.getModifierState ? e.getModifierState(t) : (t = u_[t]) ? !!e[t] : !1;
}
function ru() {
  return d_;
}
var h_ = we({}, Ci, {
    key: function (t) {
      if (t.key) {
        var e = a_[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress"
        ? ((t = io(t)), t === 13 ? "Enter" : String.fromCharCode(t))
        : t.type === "keydown" || t.type === "keyup"
        ? c_[t.keyCode] || "Unidentified"
        : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: ru,
    charCode: function (t) {
      return t.type === "keypress" ? io(t) : 0;
    },
    keyCode: function (t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function (t) {
      return t.type === "keypress"
        ? io(t)
        : t.type === "keydown" || t.type === "keyup"
        ? t.keyCode
        : 0;
    },
  }),
  f_ = pt(h_),
  p_ = we({}, il, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Wd = pt(p_),
  m_ = we({}, Ci, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: ru,
  }),
  g_ = pt(m_),
  y_ = we({}, rs, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  v_ = pt(y_),
  __ = we({}, il, {
    deltaX: function (t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function (t) {
      return "deltaY" in t
        ? t.deltaY
        : "wheelDeltaY" in t
        ? -t.wheelDeltaY
        : "wheelDelta" in t
        ? -t.wheelDelta
        : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  w_ = pt(__),
  C_ = [9, 13, 27, 32],
  su = en && "CompositionEvent" in window,
  bs = null;
en && "documentMode" in document && (bs = document.documentMode);
var E_ = en && "TextEvent" in window && !bs,
  Ap = en && (!su || (bs && 8 < bs && 11 >= bs)),
  Gd = String.fromCharCode(32),
  Vd = !1;
function jp(t, e) {
  switch (t) {
    case "keyup":
      return C_.indexOf(e.keyCode) !== -1;
    case "keydown":
      return e.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function Mp(t) {
  return (t = t.detail), typeof t == "object" && "data" in t ? t.data : null;
}
var wr = !1;
function S_(t, e) {
  switch (t) {
    case "compositionend":
      return Mp(e);
    case "keypress":
      return e.which !== 32 ? null : ((Vd = !0), Gd);
    case "textInput":
      return (t = e.data), t === Gd && Vd ? null : t;
    default:
      return null;
  }
}
function x_(t, e) {
  if (wr)
    return t === "compositionend" || (!su && jp(t, e))
      ? ((t = bp()), (so = tu = pn = null), (wr = !1), t)
      : null;
  switch (t) {
    case "paste":
      return null;
    case "keypress":
      if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
        if (e.char && 1 < e.char.length) return e.char;
        if (e.which) return String.fromCharCode(e.which);
      }
      return null;
    case "compositionend":
      return Ap && e.locale !== "ko" ? null : e.data;
    default:
      return null;
  }
}
var N_ = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Yd(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return e === "input" ? !!N_[t.type] : e === "textarea";
}
function Dp(t, e, n, r) {
  fp(r),
    (e = Co(e, "onChange")),
    0 < e.length &&
      ((n = new nu("onChange", "change", null, n, r)),
      t.push({ event: n, listeners: e }));
}
var As = null,
  Qs = null;
function T_(t) {
  Yp(t, 0);
}
function ol(t) {
  var e = Sr(t);
  if (op(e)) return t;
}
function k_(t, e) {
  if (t === "change") return e;
}
var Lp = !1;
if (en) {
  var Kl;
  if (en) {
    var Ql = "oninput" in document;
    if (!Ql) {
      var Kd = document.createElement("div");
      Kd.setAttribute("oninput", "return;"),
        (Ql = typeof Kd.oninput == "function");
    }
    Kl = Ql;
  } else Kl = !1;
  Lp = Kl && (!document.documentMode || 9 < document.documentMode);
}
function Qd() {
  As && (As.detachEvent("onpropertychange", $p), (Qs = As = null));
}
function $p(t) {
  if (t.propertyName === "value" && ol(Qs)) {
    var e = [];
    Dp(e, Qs, t, qc(t)), yp(T_, e);
  }
}
function R_(t, e, n) {
  t === "focusin"
    ? (Qd(), (As = e), (Qs = n), As.attachEvent("onpropertychange", $p))
    : t === "focusout" && Qd();
}
function P_(t) {
  if (t === "selectionchange" || t === "keyup" || t === "keydown")
    return ol(Qs);
}
function I_(t, e) {
  if (t === "click") return ol(e);
}
function O_(t, e) {
  if (t === "input" || t === "change") return ol(e);
}
function b_(t, e) {
  return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
}
var At = typeof Object.is == "function" ? Object.is : b_;
function qs(t, e) {
  if (At(t, e)) return !0;
  if (typeof t != "object" || t === null || typeof e != "object" || e === null)
    return !1;
  var n = Object.keys(t),
    r = Object.keys(e);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var s = n[r];
    if (!xa.call(e, s) || !At(t[s], e[s])) return !1;
  }
  return !0;
}
function qd(t) {
  for (; t && t.firstChild; ) t = t.firstChild;
  return t;
}
function Xd(t, e) {
  var n = qd(t);
  t = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = t + n.textContent.length), t <= e && r >= e))
        return { node: n, offset: e - t };
      t = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = qd(n);
  }
}
function Fp(t, e) {
  return t && e
    ? t === e
      ? !0
      : t && t.nodeType === 3
      ? !1
      : e && e.nodeType === 3
      ? Fp(t, e.parentNode)
      : "contains" in t
      ? t.contains(e)
      : t.compareDocumentPosition
      ? !!(t.compareDocumentPosition(e) & 16)
      : !1
    : !1;
}
function Up() {
  for (var t = window, e = po(); e instanceof t.HTMLIFrameElement; ) {
    try {
      var n = typeof e.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) t = e.contentWindow;
    else break;
    e = po(t.document);
  }
  return e;
}
function iu(t) {
  var e = t && t.nodeName && t.nodeName.toLowerCase();
  return (
    e &&
    ((e === "input" &&
      (t.type === "text" ||
        t.type === "search" ||
        t.type === "tel" ||
        t.type === "url" ||
        t.type === "password")) ||
      e === "textarea" ||
      t.contentEditable === "true")
  );
}
function A_(t) {
  var e = Up(),
    n = t.focusedElem,
    r = t.selectionRange;
  if (
    e !== n &&
    n &&
    n.ownerDocument &&
    Fp(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && iu(n)) {
      if (
        ((e = r.start),
        (t = r.end),
        t === void 0 && (t = e),
        "selectionStart" in n)
      )
        (n.selectionStart = e), (n.selectionEnd = Math.min(t, n.value.length));
      else if (
        ((t = ((e = n.ownerDocument || document) && e.defaultView) || window),
        t.getSelection)
      ) {
        t = t.getSelection();
        var s = n.textContent.length,
          i = Math.min(r.start, s);
        (r = r.end === void 0 ? i : Math.min(r.end, s)),
          !t.extend && i > r && ((s = r), (r = i), (i = s)),
          (s = Xd(n, i));
        var o = Xd(n, r);
        s &&
          o &&
          (t.rangeCount !== 1 ||
            t.anchorNode !== s.node ||
            t.anchorOffset !== s.offset ||
            t.focusNode !== o.node ||
            t.focusOffset !== o.offset) &&
          ((e = e.createRange()),
          e.setStart(s.node, s.offset),
          t.removeAllRanges(),
          i > r
            ? (t.addRange(e), t.extend(o.node, o.offset))
            : (e.setEnd(o.node, o.offset), t.addRange(e)));
      }
    }
    for (e = [], t = n; (t = t.parentNode); )
      t.nodeType === 1 &&
        e.push({ element: t, left: t.scrollLeft, top: t.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < e.length; n++)
      (t = e[n]),
        (t.element.scrollLeft = t.left),
        (t.element.scrollTop = t.top);
  }
}
var j_ = en && "documentMode" in document && 11 >= document.documentMode,
  Cr = null,
  Ha = null,
  js = null,
  Wa = !1;
function Jd(t, e, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Wa ||
    Cr == null ||
    Cr !== po(r) ||
    ((r = Cr),
    "selectionStart" in r && iu(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (js && qs(js, r)) ||
      ((js = r),
      (r = Co(Ha, "onSelect")),
      0 < r.length &&
        ((e = new nu("onSelect", "select", null, e, n)),
        t.push({ event: e, listeners: r }),
        (e.target = Cr))));
}
function Hi(t, e) {
  var n = {};
  return (
    (n[t.toLowerCase()] = e.toLowerCase()),
    (n["Webkit" + t] = "webkit" + e),
    (n["Moz" + t] = "moz" + e),
    n
  );
}
var Er = {
    animationend: Hi("Animation", "AnimationEnd"),
    animationiteration: Hi("Animation", "AnimationIteration"),
    animationstart: Hi("Animation", "AnimationStart"),
    transitionend: Hi("Transition", "TransitionEnd"),
  },
  ql = {},
  Bp = {};
en &&
  ((Bp = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete Er.animationend.animation,
    delete Er.animationiteration.animation,
    delete Er.animationstart.animation),
  "TransitionEvent" in window || delete Er.transitionend.transition);
function ll(t) {
  if (ql[t]) return ql[t];
  if (!Er[t]) return t;
  var e = Er[t],
    n;
  for (n in e) if (e.hasOwnProperty(n) && n in Bp) return (ql[t] = e[n]);
  return t;
}
var zp = ll("animationend"),
  Hp = ll("animationiteration"),
  Wp = ll("animationstart"),
  Gp = ll("transitionend"),
  Vp = new Map(),
  Zd =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
function Mn(t, e) {
  Vp.set(t, e), or(e, [t]);
}
for (var Xl = 0; Xl < Zd.length; Xl++) {
  var Jl = Zd[Xl],
    M_ = Jl.toLowerCase(),
    D_ = Jl[0].toUpperCase() + Jl.slice(1);
  Mn(M_, "on" + D_);
}
Mn(zp, "onAnimationEnd");
Mn(Hp, "onAnimationIteration");
Mn(Wp, "onAnimationStart");
Mn("dblclick", "onDoubleClick");
Mn("focusin", "onFocus");
Mn("focusout", "onBlur");
Mn(Gp, "onTransitionEnd");
Br("onMouseEnter", ["mouseout", "mouseover"]);
Br("onMouseLeave", ["mouseout", "mouseover"]);
Br("onPointerEnter", ["pointerout", "pointerover"]);
Br("onPointerLeave", ["pointerout", "pointerover"]);
or(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(" ")
);
or(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " "
  )
);
or("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
or(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" ")
);
or(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" ")
);
or(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
);
var Ps =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ),
  L_ = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ps));
function eh(t, e, n) {
  var r = t.type || "unknown-event";
  (t.currentTarget = n), Mv(r, e, void 0, t), (t.currentTarget = null);
}
function Yp(t, e) {
  e = (e & 4) !== 0;
  for (var n = 0; n < t.length; n++) {
    var r = t[n],
      s = r.event;
    r = r.listeners;
    e: {
      var i = void 0;
      if (e)
        for (var o = r.length - 1; 0 <= o; o--) {
          var l = r[o],
            a = l.instance,
            c = l.currentTarget;
          if (((l = l.listener), a !== i && s.isPropagationStopped())) break e;
          eh(s, l, c), (i = a);
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((l = r[o]),
            (a = l.instance),
            (c = l.currentTarget),
            (l = l.listener),
            a !== i && s.isPropagationStopped())
          )
            break e;
          eh(s, l, c), (i = a);
        }
    }
  }
  if (go) throw ((t = Fa), (go = !1), (Fa = null), t);
}
function fe(t, e) {
  var n = e[Qa];
  n === void 0 && (n = e[Qa] = new Set());
  var r = t + "__bubble";
  n.has(r) || (Kp(e, t, 2, !1), n.add(r));
}
function Zl(t, e, n) {
  var r = 0;
  e && (r |= 4), Kp(n, t, r, e);
}
var Wi = "_reactListening" + Math.random().toString(36).slice(2);
function Xs(t) {
  if (!t[Wi]) {
    (t[Wi] = !0),
      tp.forEach(function (n) {
        n !== "selectionchange" && (L_.has(n) || Zl(n, !1, t), Zl(n, !0, t));
      });
    var e = t.nodeType === 9 ? t : t.ownerDocument;
    e === null || e[Wi] || ((e[Wi] = !0), Zl("selectionchange", !1, e));
  }
}
function Kp(t, e, n, r) {
  switch (Op(e)) {
    case 1:
      var s = Xv;
      break;
    case 4:
      s = Jv;
      break;
    default:
      s = eu;
  }
  (n = s.bind(null, e, n, t)),
    (s = void 0),
    !$a ||
      (e !== "touchstart" && e !== "touchmove" && e !== "wheel") ||
      (s = !0),
    r
      ? s !== void 0
        ? t.addEventListener(e, n, { capture: !0, passive: s })
        : t.addEventListener(e, n, !0)
      : s !== void 0
      ? t.addEventListener(e, n, { passive: s })
      : t.addEventListener(e, n, !1);
}
function ea(t, e, n, r, s) {
  var i = r;
  if (!(e & 1) && !(e & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var o = r.tag;
      if (o === 3 || o === 4) {
        var l = r.stateNode.containerInfo;
        if (l === s || (l.nodeType === 8 && l.parentNode === s)) break;
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var a = o.tag;
            if (
              (a === 3 || a === 4) &&
              ((a = o.stateNode.containerInfo),
              a === s || (a.nodeType === 8 && a.parentNode === s))
            )
              return;
            o = o.return;
          }
        for (; l !== null; ) {
          if (((o = Hn(l)), o === null)) return;
          if (((a = o.tag), a === 5 || a === 6)) {
            r = i = o;
            continue e;
          }
          l = l.parentNode;
        }
      }
      r = r.return;
    }
  yp(function () {
    var c = i,
      d = qc(n),
      h = [];
    e: {
      var f = Vp.get(t);
      if (f !== void 0) {
        var p = nu,
          g = t;
        switch (t) {
          case "keypress":
            if (io(n) === 0) break e;
          case "keydown":
          case "keyup":
            p = f_;
            break;
          case "focusin":
            (g = "focus"), (p = Yl);
            break;
          case "focusout":
            (g = "blur"), (p = Yl);
            break;
          case "beforeblur":
          case "afterblur":
            p = Yl;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            p = zd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            p = t_;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            p = g_;
            break;
          case zp:
          case Hp:
          case Wp:
            p = s_;
            break;
          case Gp:
            p = v_;
            break;
          case "scroll":
            p = Zv;
            break;
          case "wheel":
            p = w_;
            break;
          case "copy":
          case "cut":
          case "paste":
            p = o_;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            p = Wd;
        }
        var w = (e & 4) !== 0,
          E = !w && t === "scroll",
          y = w ? (f !== null ? f + "Capture" : null) : f;
        w = [];
        for (var m = c, v; m !== null; ) {
          v = m;
          var _ = v.stateNode;
          if (
            (v.tag === 5 &&
              _ !== null &&
              ((v = _),
              y !== null && ((_ = Gs(m, y)), _ != null && w.push(Js(m, _, v)))),
            E)
          )
            break;
          m = m.return;
        }
        0 < w.length &&
          ((f = new p(f, g, null, n, d)), h.push({ event: f, listeners: w }));
      }
    }
    if (!(e & 7)) {
      e: {
        if (
          ((f = t === "mouseover" || t === "pointerover"),
          (p = t === "mouseout" || t === "pointerout"),
          f &&
            n !== Da &&
            (g = n.relatedTarget || n.fromElement) &&
            (Hn(g) || g[tn]))
        )
          break e;
        if (
          (p || f) &&
          ((f =
            d.window === d
              ? d
              : (f = d.ownerDocument)
              ? f.defaultView || f.parentWindow
              : window),
          p
            ? ((g = n.relatedTarget || n.toElement),
              (p = c),
              (g = g ? Hn(g) : null),
              g !== null &&
                ((E = lr(g)), g !== E || (g.tag !== 5 && g.tag !== 6)) &&
                (g = null))
            : ((p = null), (g = c)),
          p !== g)
        ) {
          if (
            ((w = zd),
            (_ = "onMouseLeave"),
            (y = "onMouseEnter"),
            (m = "mouse"),
            (t === "pointerout" || t === "pointerover") &&
              ((w = Wd),
              (_ = "onPointerLeave"),
              (y = "onPointerEnter"),
              (m = "pointer")),
            (E = p == null ? f : Sr(p)),
            (v = g == null ? f : Sr(g)),
            (f = new w(_, m + "leave", p, n, d)),
            (f.target = E),
            (f.relatedTarget = v),
            (_ = null),
            Hn(d) === c &&
              ((w = new w(y, m + "enter", g, n, d)),
              (w.target = v),
              (w.relatedTarget = E),
              (_ = w)),
            (E = _),
            p && g)
          )
            t: {
              for (w = p, y = g, m = 0, v = w; v; v = gr(v)) m++;
              for (v = 0, _ = y; _; _ = gr(_)) v++;
              for (; 0 < m - v; ) (w = gr(w)), m--;
              for (; 0 < v - m; ) (y = gr(y)), v--;
              for (; m--; ) {
                if (w === y || (y !== null && w === y.alternate)) break t;
                (w = gr(w)), (y = gr(y));
              }
              w = null;
            }
          else w = null;
          p !== null && th(h, f, p, w, !1),
            g !== null && E !== null && th(h, E, g, w, !0);
        }
      }
      e: {
        if (
          ((f = c ? Sr(c) : window),
          (p = f.nodeName && f.nodeName.toLowerCase()),
          p === "select" || (p === "input" && f.type === "file"))
        )
          var C = k_;
        else if (Yd(f))
          if (Lp) C = O_;
          else {
            C = P_;
            var x = R_;
          }
        else
          (p = f.nodeName) &&
            p.toLowerCase() === "input" &&
            (f.type === "checkbox" || f.type === "radio") &&
            (C = I_);
        if (C && (C = C(t, c))) {
          Dp(h, C, n, d);
          break e;
        }
        x && x(t, f, c),
          t === "focusout" &&
            (x = f._wrapperState) &&
            x.controlled &&
            f.type === "number" &&
            Oa(f, "number", f.value);
      }
      switch (((x = c ? Sr(c) : window), t)) {
        case "focusin":
          (Yd(x) || x.contentEditable === "true") &&
            ((Cr = x), (Ha = c), (js = null));
          break;
        case "focusout":
          js = Ha = Cr = null;
          break;
        case "mousedown":
          Wa = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          (Wa = !1), Jd(h, n, d);
          break;
        case "selectionchange":
          if (j_) break;
        case "keydown":
        case "keyup":
          Jd(h, n, d);
      }
      var O;
      if (su)
        e: {
          switch (t) {
            case "compositionstart":
              var A = "onCompositionStart";
              break e;
            case "compositionend":
              A = "onCompositionEnd";
              break e;
            case "compositionupdate":
              A = "onCompositionUpdate";
              break e;
          }
          A = void 0;
        }
      else
        wr
          ? jp(t, n) && (A = "onCompositionEnd")
          : t === "keydown" && n.keyCode === 229 && (A = "onCompositionStart");
      A &&
        (Ap &&
          n.locale !== "ko" &&
          (wr || A !== "onCompositionStart"
            ? A === "onCompositionEnd" && wr && (O = bp())
            : ((pn = d),
              (tu = "value" in pn ? pn.value : pn.textContent),
              (wr = !0))),
        (x = Co(c, A)),
        0 < x.length &&
          ((A = new Hd(A, t, null, n, d)),
          h.push({ event: A, listeners: x }),
          O ? (A.data = O) : ((O = Mp(n)), O !== null && (A.data = O)))),
        (O = E_ ? S_(t, n) : x_(t, n)) &&
          ((c = Co(c, "onBeforeInput")),
          0 < c.length &&
            ((d = new Hd("onBeforeInput", "beforeinput", null, n, d)),
            h.push({ event: d, listeners: c }),
            (d.data = O)));
    }
    Yp(h, e);
  });
}
function Js(t, e, n) {
  return { instance: t, listener: e, currentTarget: n };
}
function Co(t, e) {
  for (var n = e + "Capture", r = []; t !== null; ) {
    var s = t,
      i = s.stateNode;
    s.tag === 5 &&
      i !== null &&
      ((s = i),
      (i = Gs(t, n)),
      i != null && r.unshift(Js(t, i, s)),
      (i = Gs(t, e)),
      i != null && r.push(Js(t, i, s))),
      (t = t.return);
  }
  return r;
}
function gr(t) {
  if (t === null) return null;
  do t = t.return;
  while (t && t.tag !== 5);
  return t || null;
}
function th(t, e, n, r, s) {
  for (var i = e._reactName, o = []; n !== null && n !== r; ) {
    var l = n,
      a = l.alternate,
      c = l.stateNode;
    if (a !== null && a === r) break;
    l.tag === 5 &&
      c !== null &&
      ((l = c),
      s
        ? ((a = Gs(n, i)), a != null && o.unshift(Js(n, a, l)))
        : s || ((a = Gs(n, i)), a != null && o.push(Js(n, a, l)))),
      (n = n.return);
  }
  o.length !== 0 && t.push({ event: e, listeners: o });
}
var $_ = /\r\n?/g,
  F_ = /\u0000|\uFFFD/g;
function nh(t) {
  return (typeof t == "string" ? t : "" + t)
    .replace(
      $_,
      `
`
    )
    .replace(F_, "");
}
function Gi(t, e, n) {
  if (((e = nh(e)), nh(t) !== e && n)) throw Error(I(425));
}
function Eo() {}
var Ga = null,
  Va = null;
function Ya(t, e) {
  return (
    t === "textarea" ||
    t === "noscript" ||
    typeof e.children == "string" ||
    typeof e.children == "number" ||
    (typeof e.dangerouslySetInnerHTML == "object" &&
      e.dangerouslySetInnerHTML !== null &&
      e.dangerouslySetInnerHTML.__html != null)
  );
}
var Ka = typeof setTimeout == "function" ? setTimeout : void 0,
  U_ = typeof clearTimeout == "function" ? clearTimeout : void 0,
  rh = typeof Promise == "function" ? Promise : void 0,
  B_ =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof rh < "u"
      ? function (t) {
          return rh.resolve(null).then(t).catch(z_);
        }
      : Ka;
function z_(t) {
  setTimeout(function () {
    throw t;
  });
}
function ta(t, e) {
  var n = e,
    r = 0;
  do {
    var s = n.nextSibling;
    if ((t.removeChild(n), s && s.nodeType === 8))
      if (((n = s.data), n === "/$")) {
        if (r === 0) {
          t.removeChild(s), Ks(e);
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = s;
  } while (n);
  Ks(e);
}
function Cn(t) {
  for (; t != null; t = t.nextSibling) {
    var e = t.nodeType;
    if (e === 1 || e === 3) break;
    if (e === 8) {
      if (((e = t.data), e === "$" || e === "$!" || e === "$?")) break;
      if (e === "/$") return null;
    }
  }
  return t;
}
function sh(t) {
  t = t.previousSibling;
  for (var e = 0; t; ) {
    if (t.nodeType === 8) {
      var n = t.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (e === 0) return t;
        e--;
      } else n === "/$" && e++;
    }
    t = t.previousSibling;
  }
  return null;
}
var ss = Math.random().toString(36).slice(2),
  Ft = "__reactFiber$" + ss,
  Zs = "__reactProps$" + ss,
  tn = "__reactContainer$" + ss,
  Qa = "__reactEvents$" + ss,
  H_ = "__reactListeners$" + ss,
  W_ = "__reactHandles$" + ss;
function Hn(t) {
  var e = t[Ft];
  if (e) return e;
  for (var n = t.parentNode; n; ) {
    if ((e = n[tn] || n[Ft])) {
      if (
        ((n = e.alternate),
        e.child !== null || (n !== null && n.child !== null))
      )
        for (t = sh(t); t !== null; ) {
          if ((n = t[Ft])) return n;
          t = sh(t);
        }
      return e;
    }
    (t = n), (n = t.parentNode);
  }
  return null;
}
function Ei(t) {
  return (
    (t = t[Ft] || t[tn]),
    !t || (t.tag !== 5 && t.tag !== 6 && t.tag !== 13 && t.tag !== 3) ? null : t
  );
}
function Sr(t) {
  if (t.tag === 5 || t.tag === 6) return t.stateNode;
  throw Error(I(33));
}
function al(t) {
  return t[Zs] || null;
}
var qa = [],
  xr = -1;
function Dn(t) {
  return { current: t };
}
function pe(t) {
  0 > xr || ((t.current = qa[xr]), (qa[xr] = null), xr--);
}
function ue(t, e) {
  xr++, (qa[xr] = t.current), (t.current = e);
}
var On = {},
  Ye = Dn(On),
  st = Dn(!1),
  Xn = On;
function zr(t, e) {
  var n = t.type.contextTypes;
  if (!n) return On;
  var r = t.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === e)
    return r.__reactInternalMemoizedMaskedChildContext;
  var s = {},
    i;
  for (i in n) s[i] = e[i];
  return (
    r &&
      ((t = t.stateNode),
      (t.__reactInternalMemoizedUnmaskedChildContext = e),
      (t.__reactInternalMemoizedMaskedChildContext = s)),
    s
  );
}
function it(t) {
  return (t = t.childContextTypes), t != null;
}
function So() {
  pe(st), pe(Ye);
}
function ih(t, e, n) {
  if (Ye.current !== On) throw Error(I(168));
  ue(Ye, e), ue(st, n);
}
function Qp(t, e, n) {
  var r = t.stateNode;
  if (((e = e.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var s in r) if (!(s in e)) throw Error(I(108, Rv(t) || "Unknown", s));
  return we({}, n, r);
}
function xo(t) {
  return (
    (t =
      ((t = t.stateNode) && t.__reactInternalMemoizedMergedChildContext) || On),
    (Xn = Ye.current),
    ue(Ye, t),
    ue(st, st.current),
    !0
  );
}
function oh(t, e, n) {
  var r = t.stateNode;
  if (!r) throw Error(I(169));
  n
    ? ((t = Qp(t, e, Xn)),
      (r.__reactInternalMemoizedMergedChildContext = t),
      pe(st),
      pe(Ye),
      ue(Ye, t))
    : pe(st),
    ue(st, n);
}
var Yt = null,
  cl = !1,
  na = !1;
function qp(t) {
  Yt === null ? (Yt = [t]) : Yt.push(t);
}
function G_(t) {
  (cl = !0), qp(t);
}
function Ln() {
  if (!na && Yt !== null) {
    na = !0;
    var t = 0,
      e = re;
    try {
      var n = Yt;
      for (re = 1; t < n.length; t++) {
        var r = n[t];
        do r = r(!0);
        while (r !== null);
      }
      (Yt = null), (cl = !1);
    } catch (s) {
      throw (Yt !== null && (Yt = Yt.slice(t + 1)), Cp(Xc, Ln), s);
    } finally {
      (re = e), (na = !1);
    }
  }
  return null;
}
var Nr = [],
  Tr = 0,
  No = null,
  To = 0,
  gt = [],
  yt = 0,
  Jn = null,
  Qt = 1,
  qt = "";
function $n(t, e) {
  (Nr[Tr++] = To), (Nr[Tr++] = No), (No = t), (To = e);
}
function Xp(t, e, n) {
  (gt[yt++] = Qt), (gt[yt++] = qt), (gt[yt++] = Jn), (Jn = t);
  var r = Qt;
  t = qt;
  var s = 32 - It(r) - 1;
  (r &= ~(1 << s)), (n += 1);
  var i = 32 - It(e) + s;
  if (30 < i) {
    var o = s - (s % 5);
    (i = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (s -= o),
      (Qt = (1 << (32 - It(e) + s)) | (n << s) | r),
      (qt = i + t);
  } else (Qt = (1 << i) | (n << s) | r), (qt = t);
}
function ou(t) {
  t.return !== null && ($n(t, 1), Xp(t, 1, 0));
}
function lu(t) {
  for (; t === No; )
    (No = Nr[--Tr]), (Nr[Tr] = null), (To = Nr[--Tr]), (Nr[Tr] = null);
  for (; t === Jn; )
    (Jn = gt[--yt]),
      (gt[yt] = null),
      (qt = gt[--yt]),
      (gt[yt] = null),
      (Qt = gt[--yt]),
      (gt[yt] = null);
}
var ut = null,
  ct = null,
  ge = !1,
  kt = null;
function Jp(t, e) {
  var n = vt(5, null, null, 0);
  (n.elementType = "DELETED"),
    (n.stateNode = e),
    (n.return = t),
    (e = t.deletions),
    e === null ? ((t.deletions = [n]), (t.flags |= 16)) : e.push(n);
}
function lh(t, e) {
  switch (t.tag) {
    case 5:
      var n = t.type;
      return (
        (e =
          e.nodeType !== 1 || n.toLowerCase() !== e.nodeName.toLowerCase()
            ? null
            : e),
        e !== null
          ? ((t.stateNode = e), (ut = t), (ct = Cn(e.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (e = t.pendingProps === "" || e.nodeType !== 3 ? null : e),
        e !== null ? ((t.stateNode = e), (ut = t), (ct = null), !0) : !1
      );
    case 13:
      return (
        (e = e.nodeType !== 8 ? null : e),
        e !== null
          ? ((n = Jn !== null ? { id: Qt, overflow: qt } : null),
            (t.memoizedState = {
              dehydrated: e,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = vt(18, null, null, 0)),
            (n.stateNode = e),
            (n.return = t),
            (t.child = n),
            (ut = t),
            (ct = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Xa(t) {
  return (t.mode & 1) !== 0 && (t.flags & 128) === 0;
}
function Ja(t) {
  if (ge) {
    var e = ct;
    if (e) {
      var n = e;
      if (!lh(t, e)) {
        if (Xa(t)) throw Error(I(418));
        e = Cn(n.nextSibling);
        var r = ut;
        e && lh(t, e)
          ? Jp(r, n)
          : ((t.flags = (t.flags & -4097) | 2), (ge = !1), (ut = t));
      }
    } else {
      if (Xa(t)) throw Error(I(418));
      (t.flags = (t.flags & -4097) | 2), (ge = !1), (ut = t);
    }
  }
}
function ah(t) {
  for (t = t.return; t !== null && t.tag !== 5 && t.tag !== 3 && t.tag !== 13; )
    t = t.return;
  ut = t;
}
function Vi(t) {
  if (t !== ut) return !1;
  if (!ge) return ah(t), (ge = !0), !1;
  var e;
  if (
    ((e = t.tag !== 3) &&
      !(e = t.tag !== 5) &&
      ((e = t.type),
      (e = e !== "head" && e !== "body" && !Ya(t.type, t.memoizedProps))),
    e && (e = ct))
  ) {
    if (Xa(t)) throw (Zp(), Error(I(418)));
    for (; e; ) Jp(t, e), (e = Cn(e.nextSibling));
  }
  if ((ah(t), t.tag === 13)) {
    if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
      throw Error(I(317));
    e: {
      for (t = t.nextSibling, e = 0; t; ) {
        if (t.nodeType === 8) {
          var n = t.data;
          if (n === "/$") {
            if (e === 0) {
              ct = Cn(t.nextSibling);
              break e;
            }
            e--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || e++;
        }
        t = t.nextSibling;
      }
      ct = null;
    }
  } else ct = ut ? Cn(t.stateNode.nextSibling) : null;
  return !0;
}
function Zp() {
  for (var t = ct; t; ) t = Cn(t.nextSibling);
}
function Hr() {
  (ct = ut = null), (ge = !1);
}
function au(t) {
  kt === null ? (kt = [t]) : kt.push(t);
}
var V_ = on.ReactCurrentBatchConfig;
function _s(t, e, n) {
  if (
    ((t = n.ref), t !== null && typeof t != "function" && typeof t != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(I(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(I(147, t));
      var s = r,
        i = "" + t;
      return e !== null &&
        e.ref !== null &&
        typeof e.ref == "function" &&
        e.ref._stringRef === i
        ? e.ref
        : ((e = function (o) {
            var l = s.refs;
            o === null ? delete l[i] : (l[i] = o);
          }),
          (e._stringRef = i),
          e);
    }
    if (typeof t != "string") throw Error(I(284));
    if (!n._owner) throw Error(I(290, t));
  }
  return t;
}
function Yi(t, e) {
  throw (
    ((t = Object.prototype.toString.call(e)),
    Error(
      I(
        31,
        t === "[object Object]"
          ? "object with keys {" + Object.keys(e).join(", ") + "}"
          : t
      )
    ))
  );
}
function ch(t) {
  var e = t._init;
  return e(t._payload);
}
function em(t) {
  function e(y, m) {
    if (t) {
      var v = y.deletions;
      v === null ? ((y.deletions = [m]), (y.flags |= 16)) : v.push(m);
    }
  }
  function n(y, m) {
    if (!t) return null;
    for (; m !== null; ) e(y, m), (m = m.sibling);
    return null;
  }
  function r(y, m) {
    for (y = new Map(); m !== null; )
      m.key !== null ? y.set(m.key, m) : y.set(m.index, m), (m = m.sibling);
    return y;
  }
  function s(y, m) {
    return (y = Nn(y, m)), (y.index = 0), (y.sibling = null), y;
  }
  function i(y, m, v) {
    return (
      (y.index = v),
      t
        ? ((v = y.alternate),
          v !== null
            ? ((v = v.index), v < m ? ((y.flags |= 2), m) : v)
            : ((y.flags |= 2), m))
        : ((y.flags |= 1048576), m)
    );
  }
  function o(y) {
    return t && y.alternate === null && (y.flags |= 2), y;
  }
  function l(y, m, v, _) {
    return m === null || m.tag !== 6
      ? ((m = ca(v, y.mode, _)), (m.return = y), m)
      : ((m = s(m, v)), (m.return = y), m);
  }
  function a(y, m, v, _) {
    var C = v.type;
    return C === _r
      ? d(y, m, v.props.children, _, v.key)
      : m !== null &&
        (m.elementType === C ||
          (typeof C == "object" &&
            C !== null &&
            C.$$typeof === un &&
            ch(C) === m.type))
      ? ((_ = s(m, v.props)), (_.ref = _s(y, m, v)), (_.return = y), _)
      : ((_ = fo(v.type, v.key, v.props, null, y.mode, _)),
        (_.ref = _s(y, m, v)),
        (_.return = y),
        _);
  }
  function c(y, m, v, _) {
    return m === null ||
      m.tag !== 4 ||
      m.stateNode.containerInfo !== v.containerInfo ||
      m.stateNode.implementation !== v.implementation
      ? ((m = ua(v, y.mode, _)), (m.return = y), m)
      : ((m = s(m, v.children || [])), (m.return = y), m);
  }
  function d(y, m, v, _, C) {
    return m === null || m.tag !== 7
      ? ((m = Kn(v, y.mode, _, C)), (m.return = y), m)
      : ((m = s(m, v)), (m.return = y), m);
  }
  function h(y, m, v) {
    if ((typeof m == "string" && m !== "") || typeof m == "number")
      return (m = ca("" + m, y.mode, v)), (m.return = y), m;
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case Di:
          return (
            (v = fo(m.type, m.key, m.props, null, y.mode, v)),
            (v.ref = _s(y, null, m)),
            (v.return = y),
            v
          );
        case vr:
          return (m = ua(m, y.mode, v)), (m.return = y), m;
        case un:
          var _ = m._init;
          return h(y, _(m._payload), v);
      }
      if (ks(m) || ps(m))
        return (m = Kn(m, y.mode, v, null)), (m.return = y), m;
      Yi(y, m);
    }
    return null;
  }
  function f(y, m, v, _) {
    var C = m !== null ? m.key : null;
    if ((typeof v == "string" && v !== "") || typeof v == "number")
      return C !== null ? null : l(y, m, "" + v, _);
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case Di:
          return v.key === C ? a(y, m, v, _) : null;
        case vr:
          return v.key === C ? c(y, m, v, _) : null;
        case un:
          return (C = v._init), f(y, m, C(v._payload), _);
      }
      if (ks(v) || ps(v)) return C !== null ? null : d(y, m, v, _, null);
      Yi(y, v);
    }
    return null;
  }
  function p(y, m, v, _, C) {
    if ((typeof _ == "string" && _ !== "") || typeof _ == "number")
      return (y = y.get(v) || null), l(m, y, "" + _, C);
    if (typeof _ == "object" && _ !== null) {
      switch (_.$$typeof) {
        case Di:
          return (y = y.get(_.key === null ? v : _.key) || null), a(m, y, _, C);
        case vr:
          return (y = y.get(_.key === null ? v : _.key) || null), c(m, y, _, C);
        case un:
          var x = _._init;
          return p(y, m, v, x(_._payload), C);
      }
      if (ks(_) || ps(_)) return (y = y.get(v) || null), d(m, y, _, C, null);
      Yi(m, _);
    }
    return null;
  }
  function g(y, m, v, _) {
    for (
      var C = null, x = null, O = m, A = (m = 0), M = null;
      O !== null && A < v.length;
      A++
    ) {
      O.index > A ? ((M = O), (O = null)) : (M = O.sibling);
      var P = f(y, O, v[A], _);
      if (P === null) {
        O === null && (O = M);
        break;
      }
      t && O && P.alternate === null && e(y, O),
        (m = i(P, m, A)),
        x === null ? (C = P) : (x.sibling = P),
        (x = P),
        (O = M);
    }
    if (A === v.length) return n(y, O), ge && $n(y, A), C;
    if (O === null) {
      for (; A < v.length; A++)
        (O = h(y, v[A], _)),
          O !== null &&
            ((m = i(O, m, A)), x === null ? (C = O) : (x.sibling = O), (x = O));
      return ge && $n(y, A), C;
    }
    for (O = r(y, O); A < v.length; A++)
      (M = p(O, y, A, v[A], _)),
        M !== null &&
          (t && M.alternate !== null && O.delete(M.key === null ? A : M.key),
          (m = i(M, m, A)),
          x === null ? (C = M) : (x.sibling = M),
          (x = M));
    return (
      t &&
        O.forEach(function (B) {
          return e(y, B);
        }),
      ge && $n(y, A),
      C
    );
  }
  function w(y, m, v, _) {
    var C = ps(v);
    if (typeof C != "function") throw Error(I(150));
    if (((v = C.call(v)), v == null)) throw Error(I(151));
    for (
      var x = (C = null), O = m, A = (m = 0), M = null, P = v.next();
      O !== null && !P.done;
      A++, P = v.next()
    ) {
      O.index > A ? ((M = O), (O = null)) : (M = O.sibling);
      var B = f(y, O, P.value, _);
      if (B === null) {
        O === null && (O = M);
        break;
      }
      t && O && B.alternate === null && e(y, O),
        (m = i(B, m, A)),
        x === null ? (C = B) : (x.sibling = B),
        (x = B),
        (O = M);
    }
    if (P.done) return n(y, O), ge && $n(y, A), C;
    if (O === null) {
      for (; !P.done; A++, P = v.next())
        (P = h(y, P.value, _)),
          P !== null &&
            ((m = i(P, m, A)), x === null ? (C = P) : (x.sibling = P), (x = P));
      return ge && $n(y, A), C;
    }
    for (O = r(y, O); !P.done; A++, P = v.next())
      (P = p(O, y, A, P.value, _)),
        P !== null &&
          (t && P.alternate !== null && O.delete(P.key === null ? A : P.key),
          (m = i(P, m, A)),
          x === null ? (C = P) : (x.sibling = P),
          (x = P));
    return (
      t &&
        O.forEach(function (V) {
          return e(y, V);
        }),
      ge && $n(y, A),
      C
    );
  }
  function E(y, m, v, _) {
    if (
      (typeof v == "object" &&
        v !== null &&
        v.type === _r &&
        v.key === null &&
        (v = v.props.children),
      typeof v == "object" && v !== null)
    ) {
      switch (v.$$typeof) {
        case Di:
          e: {
            for (var C = v.key, x = m; x !== null; ) {
              if (x.key === C) {
                if (((C = v.type), C === _r)) {
                  if (x.tag === 7) {
                    n(y, x.sibling),
                      (m = s(x, v.props.children)),
                      (m.return = y),
                      (y = m);
                    break e;
                  }
                } else if (
                  x.elementType === C ||
                  (typeof C == "object" &&
                    C !== null &&
                    C.$$typeof === un &&
                    ch(C) === x.type)
                ) {
                  n(y, x.sibling),
                    (m = s(x, v.props)),
                    (m.ref = _s(y, x, v)),
                    (m.return = y),
                    (y = m);
                  break e;
                }
                n(y, x);
                break;
              } else e(y, x);
              x = x.sibling;
            }
            v.type === _r
              ? ((m = Kn(v.props.children, y.mode, _, v.key)),
                (m.return = y),
                (y = m))
              : ((_ = fo(v.type, v.key, v.props, null, y.mode, _)),
                (_.ref = _s(y, m, v)),
                (_.return = y),
                (y = _));
          }
          return o(y);
        case vr:
          e: {
            for (x = v.key; m !== null; ) {
              if (m.key === x)
                if (
                  m.tag === 4 &&
                  m.stateNode.containerInfo === v.containerInfo &&
                  m.stateNode.implementation === v.implementation
                ) {
                  n(y, m.sibling),
                    (m = s(m, v.children || [])),
                    (m.return = y),
                    (y = m);
                  break e;
                } else {
                  n(y, m);
                  break;
                }
              else e(y, m);
              m = m.sibling;
            }
            (m = ua(v, y.mode, _)), (m.return = y), (y = m);
          }
          return o(y);
        case un:
          return (x = v._init), E(y, m, x(v._payload), _);
      }
      if (ks(v)) return g(y, m, v, _);
      if (ps(v)) return w(y, m, v, _);
      Yi(y, v);
    }
    return (typeof v == "string" && v !== "") || typeof v == "number"
      ? ((v = "" + v),
        m !== null && m.tag === 6
          ? (n(y, m.sibling), (m = s(m, v)), (m.return = y), (y = m))
          : (n(y, m), (m = ca(v, y.mode, _)), (m.return = y), (y = m)),
        o(y))
      : n(y, m);
  }
  return E;
}
var Wr = em(!0),
  tm = em(!1),
  ko = Dn(null),
  Ro = null,
  kr = null,
  cu = null;
function uu() {
  cu = kr = Ro = null;
}
function du(t) {
  var e = ko.current;
  pe(ko), (t._currentValue = e);
}
function Za(t, e, n) {
  for (; t !== null; ) {
    var r = t.alternate;
    if (
      ((t.childLanes & e) !== e
        ? ((t.childLanes |= e), r !== null && (r.childLanes |= e))
        : r !== null && (r.childLanes & e) !== e && (r.childLanes |= e),
      t === n)
    )
      break;
    t = t.return;
  }
}
function Mr(t, e) {
  (Ro = t),
    (cu = kr = null),
    (t = t.dependencies),
    t !== null &&
      t.firstContext !== null &&
      (t.lanes & e && (nt = !0), (t.firstContext = null));
}
function Ct(t) {
  var e = t._currentValue;
  if (cu !== t)
    if (((t = { context: t, memoizedValue: e, next: null }), kr === null)) {
      if (Ro === null) throw Error(I(308));
      (kr = t), (Ro.dependencies = { lanes: 0, firstContext: t });
    } else kr = kr.next = t;
  return e;
}
var Wn = null;
function hu(t) {
  Wn === null ? (Wn = [t]) : Wn.push(t);
}
function nm(t, e, n, r) {
  var s = e.interleaved;
  return (
    s === null ? ((n.next = n), hu(e)) : ((n.next = s.next), (s.next = n)),
    (e.interleaved = n),
    nn(t, r)
  );
}
function nn(t, e) {
  t.lanes |= e;
  var n = t.alternate;
  for (n !== null && (n.lanes |= e), n = t, t = t.return; t !== null; )
    (t.childLanes |= e),
      (n = t.alternate),
      n !== null && (n.childLanes |= e),
      (n = t),
      (t = t.return);
  return n.tag === 3 ? n.stateNode : null;
}
var dn = !1;
function fu(t) {
  t.updateQueue = {
    baseState: t.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function rm(t, e) {
  (t = t.updateQueue),
    e.updateQueue === t &&
      (e.updateQueue = {
        baseState: t.baseState,
        firstBaseUpdate: t.firstBaseUpdate,
        lastBaseUpdate: t.lastBaseUpdate,
        shared: t.shared,
        effects: t.effects,
      });
}
function Jt(t, e) {
  return {
    eventTime: t,
    lane: e,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function En(t, e, n) {
  var r = t.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), ee & 2)) {
    var s = r.pending;
    return (
      s === null ? (e.next = e) : ((e.next = s.next), (s.next = e)),
      (r.pending = e),
      nn(t, n)
    );
  }
  return (
    (s = r.interleaved),
    s === null ? ((e.next = e), hu(r)) : ((e.next = s.next), (s.next = e)),
    (r.interleaved = e),
    nn(t, n)
  );
}
function oo(t, e, n) {
  if (
    ((e = e.updateQueue), e !== null && ((e = e.shared), (n & 4194240) !== 0))
  ) {
    var r = e.lanes;
    (r &= t.pendingLanes), (n |= r), (e.lanes = n), Jc(t, n);
  }
}
function uh(t, e) {
  var n = t.updateQueue,
    r = t.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var s = null,
      i = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        i === null ? (s = i = o) : (i = i.next = o), (n = n.next);
      } while (n !== null);
      i === null ? (s = i = e) : (i = i.next = e);
    } else s = i = e;
    (n = {
      baseState: r.baseState,
      firstBaseUpdate: s,
      lastBaseUpdate: i,
      shared: r.shared,
      effects: r.effects,
    }),
      (t.updateQueue = n);
    return;
  }
  (t = n.lastBaseUpdate),
    t === null ? (n.firstBaseUpdate = e) : (t.next = e),
    (n.lastBaseUpdate = e);
}
function Po(t, e, n, r) {
  var s = t.updateQueue;
  dn = !1;
  var i = s.firstBaseUpdate,
    o = s.lastBaseUpdate,
    l = s.shared.pending;
  if (l !== null) {
    s.shared.pending = null;
    var a = l,
      c = a.next;
    (a.next = null), o === null ? (i = c) : (o.next = c), (o = a);
    var d = t.alternate;
    d !== null &&
      ((d = d.updateQueue),
      (l = d.lastBaseUpdate),
      l !== o &&
        (l === null ? (d.firstBaseUpdate = c) : (l.next = c),
        (d.lastBaseUpdate = a)));
  }
  if (i !== null) {
    var h = s.baseState;
    (o = 0), (d = c = a = null), (l = i);
    do {
      var f = l.lane,
        p = l.eventTime;
      if ((r & f) === f) {
        d !== null &&
          (d = d.next =
            {
              eventTime: p,
              lane: 0,
              tag: l.tag,
              payload: l.payload,
              callback: l.callback,
              next: null,
            });
        e: {
          var g = t,
            w = l;
          switch (((f = e), (p = n), w.tag)) {
            case 1:
              if (((g = w.payload), typeof g == "function")) {
                h = g.call(p, h, f);
                break e;
              }
              h = g;
              break e;
            case 3:
              g.flags = (g.flags & -65537) | 128;
            case 0:
              if (
                ((g = w.payload),
                (f = typeof g == "function" ? g.call(p, h, f) : g),
                f == null)
              )
                break e;
              h = we({}, h, f);
              break e;
            case 2:
              dn = !0;
          }
        }
        l.callback !== null &&
          l.lane !== 0 &&
          ((t.flags |= 64),
          (f = s.effects),
          f === null ? (s.effects = [l]) : f.push(l));
      } else
        (p = {
          eventTime: p,
          lane: f,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null,
        }),
          d === null ? ((c = d = p), (a = h)) : (d = d.next = p),
          (o |= f);
      if (((l = l.next), l === null)) {
        if (((l = s.shared.pending), l === null)) break;
        (f = l),
          (l = f.next),
          (f.next = null),
          (s.lastBaseUpdate = f),
          (s.shared.pending = null);
      }
    } while (1);
    if (
      (d === null && (a = h),
      (s.baseState = a),
      (s.firstBaseUpdate = c),
      (s.lastBaseUpdate = d),
      (e = s.shared.interleaved),
      e !== null)
    ) {
      s = e;
      do (o |= s.lane), (s = s.next);
      while (s !== e);
    } else i === null && (s.shared.lanes = 0);
    (er |= o), (t.lanes = o), (t.memoizedState = h);
  }
}
function dh(t, e, n) {
  if (((t = e.effects), (e.effects = null), t !== null))
    for (e = 0; e < t.length; e++) {
      var r = t[e],
        s = r.callback;
      if (s !== null) {
        if (((r.callback = null), (r = n), typeof s != "function"))
          throw Error(I(191, s));
        s.call(r);
      }
    }
}
var Si = {},
  Bt = Dn(Si),
  ei = Dn(Si),
  ti = Dn(Si);
function Gn(t) {
  if (t === Si) throw Error(I(174));
  return t;
}
function pu(t, e) {
  switch ((ue(ti, e), ue(ei, t), ue(Bt, Si), (t = e.nodeType), t)) {
    case 9:
    case 11:
      e = (e = e.documentElement) ? e.namespaceURI : Aa(null, "");
      break;
    default:
      (t = t === 8 ? e.parentNode : e),
        (e = t.namespaceURI || null),
        (t = t.tagName),
        (e = Aa(e, t));
  }
  pe(Bt), ue(Bt, e);
}
function Gr() {
  pe(Bt), pe(ei), pe(ti);
}
function sm(t) {
  Gn(ti.current);
  var e = Gn(Bt.current),
    n = Aa(e, t.type);
  e !== n && (ue(ei, t), ue(Bt, n));
}
function mu(t) {
  ei.current === t && (pe(Bt), pe(ei));
}
var ve = Dn(0);
function Io(t) {
  for (var e = t; e !== null; ) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return e;
    } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
      if (e.flags & 128) return e;
    } else if (e.child !== null) {
      (e.child.return = e), (e = e.child);
      continue;
    }
    if (e === t) break;
    for (; e.sibling === null; ) {
      if (e.return === null || e.return === t) return null;
      e = e.return;
    }
    (e.sibling.return = e.return), (e = e.sibling);
  }
  return null;
}
var ra = [];
function gu() {
  for (var t = 0; t < ra.length; t++)
    ra[t]._workInProgressVersionPrimary = null;
  ra.length = 0;
}
var lo = on.ReactCurrentDispatcher,
  sa = on.ReactCurrentBatchConfig,
  Zn = 0,
  _e = null,
  Re = null,
  Me = null,
  Oo = !1,
  Ms = !1,
  ni = 0,
  Y_ = 0;
function We() {
  throw Error(I(321));
}
function yu(t, e) {
  if (e === null) return !1;
  for (var n = 0; n < e.length && n < t.length; n++)
    if (!At(t[n], e[n])) return !1;
  return !0;
}
function vu(t, e, n, r, s, i) {
  if (
    ((Zn = i),
    (_e = e),
    (e.memoizedState = null),
    (e.updateQueue = null),
    (e.lanes = 0),
    (lo.current = t === null || t.memoizedState === null ? X_ : J_),
    (t = n(r, s)),
    Ms)
  ) {
    i = 0;
    do {
      if (((Ms = !1), (ni = 0), 25 <= i)) throw Error(I(301));
      (i += 1),
        (Me = Re = null),
        (e.updateQueue = null),
        (lo.current = Z_),
        (t = n(r, s));
    } while (Ms);
  }
  if (
    ((lo.current = bo),
    (e = Re !== null && Re.next !== null),
    (Zn = 0),
    (Me = Re = _e = null),
    (Oo = !1),
    e)
  )
    throw Error(I(300));
  return t;
}
function _u() {
  var t = ni !== 0;
  return (ni = 0), t;
}
function $t() {
  var t = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return Me === null ? (_e.memoizedState = Me = t) : (Me = Me.next = t), Me;
}
function Et() {
  if (Re === null) {
    var t = _e.alternate;
    t = t !== null ? t.memoizedState : null;
  } else t = Re.next;
  var e = Me === null ? _e.memoizedState : Me.next;
  if (e !== null) (Me = e), (Re = t);
  else {
    if (t === null) throw Error(I(310));
    (Re = t),
      (t = {
        memoizedState: Re.memoizedState,
        baseState: Re.baseState,
        baseQueue: Re.baseQueue,
        queue: Re.queue,
        next: null,
      }),
      Me === null ? (_e.memoizedState = Me = t) : (Me = Me.next = t);
  }
  return Me;
}
function ri(t, e) {
  return typeof e == "function" ? e(t) : e;
}
function ia(t) {
  var e = Et(),
    n = e.queue;
  if (n === null) throw Error(I(311));
  n.lastRenderedReducer = t;
  var r = Re,
    s = r.baseQueue,
    i = n.pending;
  if (i !== null) {
    if (s !== null) {
      var o = s.next;
      (s.next = i.next), (i.next = o);
    }
    (r.baseQueue = s = i), (n.pending = null);
  }
  if (s !== null) {
    (i = s.next), (r = r.baseState);
    var l = (o = null),
      a = null,
      c = i;
    do {
      var d = c.lane;
      if ((Zn & d) === d)
        a !== null &&
          (a = a.next =
            {
              lane: 0,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
          (r = c.hasEagerState ? c.eagerState : t(r, c.action));
      else {
        var h = {
          lane: d,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null,
        };
        a === null ? ((l = a = h), (o = r)) : (a = a.next = h),
          (_e.lanes |= d),
          (er |= d);
      }
      c = c.next;
    } while (c !== null && c !== i);
    a === null ? (o = r) : (a.next = l),
      At(r, e.memoizedState) || (nt = !0),
      (e.memoizedState = r),
      (e.baseState = o),
      (e.baseQueue = a),
      (n.lastRenderedState = r);
  }
  if (((t = n.interleaved), t !== null)) {
    s = t;
    do (i = s.lane), (_e.lanes |= i), (er |= i), (s = s.next);
    while (s !== t);
  } else s === null && (n.lanes = 0);
  return [e.memoizedState, n.dispatch];
}
function oa(t) {
  var e = Et(),
    n = e.queue;
  if (n === null) throw Error(I(311));
  n.lastRenderedReducer = t;
  var r = n.dispatch,
    s = n.pending,
    i = e.memoizedState;
  if (s !== null) {
    n.pending = null;
    var o = (s = s.next);
    do (i = t(i, o.action)), (o = o.next);
    while (o !== s);
    At(i, e.memoizedState) || (nt = !0),
      (e.memoizedState = i),
      e.baseQueue === null && (e.baseState = i),
      (n.lastRenderedState = i);
  }
  return [i, r];
}
function im() {}
function om(t, e) {
  var n = _e,
    r = Et(),
    s = e(),
    i = !At(r.memoizedState, s);
  if (
    (i && ((r.memoizedState = s), (nt = !0)),
    (r = r.queue),
    wu(cm.bind(null, n, r, t), [t]),
    r.getSnapshot !== e || i || (Me !== null && Me.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      si(9, am.bind(null, n, r, s, e), void 0, null),
      Le === null)
    )
      throw Error(I(349));
    Zn & 30 || lm(n, e, s);
  }
  return s;
}
function lm(t, e, n) {
  (t.flags |= 16384),
    (t = { getSnapshot: e, value: n }),
    (e = _e.updateQueue),
    e === null
      ? ((e = { lastEffect: null, stores: null }),
        (_e.updateQueue = e),
        (e.stores = [t]))
      : ((n = e.stores), n === null ? (e.stores = [t]) : n.push(t));
}
function am(t, e, n, r) {
  (e.value = n), (e.getSnapshot = r), um(e) && dm(t);
}
function cm(t, e, n) {
  return n(function () {
    um(e) && dm(t);
  });
}
function um(t) {
  var e = t.getSnapshot;
  t = t.value;
  try {
    var n = e();
    return !At(t, n);
  } catch {
    return !0;
  }
}
function dm(t) {
  var e = nn(t, 1);
  e !== null && Ot(e, t, 1, -1);
}
function hh(t) {
  var e = $t();
  return (
    typeof t == "function" && (t = t()),
    (e.memoizedState = e.baseState = t),
    (t = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ri,
      lastRenderedState: t,
    }),
    (e.queue = t),
    (t = t.dispatch = q_.bind(null, _e, t)),
    [e.memoizedState, t]
  );
}
function si(t, e, n, r) {
  return (
    (t = { tag: t, create: e, destroy: n, deps: r, next: null }),
    (e = _e.updateQueue),
    e === null
      ? ((e = { lastEffect: null, stores: null }),
        (_e.updateQueue = e),
        (e.lastEffect = t.next = t))
      : ((n = e.lastEffect),
        n === null
          ? (e.lastEffect = t.next = t)
          : ((r = n.next), (n.next = t), (t.next = r), (e.lastEffect = t))),
    t
  );
}
function hm() {
  return Et().memoizedState;
}
function ao(t, e, n, r) {
  var s = $t();
  (_e.flags |= t),
    (s.memoizedState = si(1 | e, n, void 0, r === void 0 ? null : r));
}
function ul(t, e, n, r) {
  var s = Et();
  r = r === void 0 ? null : r;
  var i = void 0;
  if (Re !== null) {
    var o = Re.memoizedState;
    if (((i = o.destroy), r !== null && yu(r, o.deps))) {
      s.memoizedState = si(e, n, i, r);
      return;
    }
  }
  (_e.flags |= t), (s.memoizedState = si(1 | e, n, i, r));
}
function fh(t, e) {
  return ao(8390656, 8, t, e);
}
function wu(t, e) {
  return ul(2048, 8, t, e);
}
function fm(t, e) {
  return ul(4, 2, t, e);
}
function pm(t, e) {
  return ul(4, 4, t, e);
}
function mm(t, e) {
  if (typeof e == "function")
    return (
      (t = t()),
      e(t),
      function () {
        e(null);
      }
    );
  if (e != null)
    return (
      (t = t()),
      (e.current = t),
      function () {
        e.current = null;
      }
    );
}
function gm(t, e, n) {
  return (
    (n = n != null ? n.concat([t]) : null), ul(4, 4, mm.bind(null, e, t), n)
  );
}
function Cu() {}
function ym(t, e) {
  var n = Et();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && yu(e, r[1])
    ? r[0]
    : ((n.memoizedState = [t, e]), t);
}
function vm(t, e) {
  var n = Et();
  e = e === void 0 ? null : e;
  var r = n.memoizedState;
  return r !== null && e !== null && yu(e, r[1])
    ? r[0]
    : ((t = t()), (n.memoizedState = [t, e]), t);
}
function _m(t, e, n) {
  return Zn & 21
    ? (At(n, e) || ((n = xp()), (_e.lanes |= n), (er |= n), (t.baseState = !0)),
      e)
    : (t.baseState && ((t.baseState = !1), (nt = !0)), (t.memoizedState = n));
}
function K_(t, e) {
  var n = re;
  (re = n !== 0 && 4 > n ? n : 4), t(!0);
  var r = sa.transition;
  sa.transition = {};
  try {
    t(!1), e();
  } finally {
    (re = n), (sa.transition = r);
  }
}
function wm() {
  return Et().memoizedState;
}
function Q_(t, e, n) {
  var r = xn(t);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    Cm(t))
  )
    Em(e, n);
  else if (((n = nm(t, e, n, r)), n !== null)) {
    var s = qe();
    Ot(n, t, r, s), Sm(n, e, r);
  }
}
function q_(t, e, n) {
  var r = xn(t),
    s = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (Cm(t)) Em(e, s);
  else {
    var i = t.alternate;
    if (
      t.lanes === 0 &&
      (i === null || i.lanes === 0) &&
      ((i = e.lastRenderedReducer), i !== null)
    )
      try {
        var o = e.lastRenderedState,
          l = i(o, n);
        if (((s.hasEagerState = !0), (s.eagerState = l), At(l, o))) {
          var a = e.interleaved;
          a === null
            ? ((s.next = s), hu(e))
            : ((s.next = a.next), (a.next = s)),
            (e.interleaved = s);
          return;
        }
      } catch {
      } finally {
      }
    (n = nm(t, e, s, r)),
      n !== null && ((s = qe()), Ot(n, t, r, s), Sm(n, e, r));
  }
}
function Cm(t) {
  var e = t.alternate;
  return t === _e || (e !== null && e === _e);
}
function Em(t, e) {
  Ms = Oo = !0;
  var n = t.pending;
  n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)),
    (t.pending = e);
}
function Sm(t, e, n) {
  if (n & 4194240) {
    var r = e.lanes;
    (r &= t.pendingLanes), (n |= r), (e.lanes = n), Jc(t, n);
  }
}
var bo = {
    readContext: Ct,
    useCallback: We,
    useContext: We,
    useEffect: We,
    useImperativeHandle: We,
    useInsertionEffect: We,
    useLayoutEffect: We,
    useMemo: We,
    useReducer: We,
    useRef: We,
    useState: We,
    useDebugValue: We,
    useDeferredValue: We,
    useTransition: We,
    useMutableSource: We,
    useSyncExternalStore: We,
    useId: We,
    unstable_isNewReconciler: !1,
  },
  X_ = {
    readContext: Ct,
    useCallback: function (t, e) {
      return ($t().memoizedState = [t, e === void 0 ? null : e]), t;
    },
    useContext: Ct,
    useEffect: fh,
    useImperativeHandle: function (t, e, n) {
      return (
        (n = n != null ? n.concat([t]) : null),
        ao(4194308, 4, mm.bind(null, e, t), n)
      );
    },
    useLayoutEffect: function (t, e) {
      return ao(4194308, 4, t, e);
    },
    useInsertionEffect: function (t, e) {
      return ao(4, 2, t, e);
    },
    useMemo: function (t, e) {
      var n = $t();
      return (
        (e = e === void 0 ? null : e), (t = t()), (n.memoizedState = [t, e]), t
      );
    },
    useReducer: function (t, e, n) {
      var r = $t();
      return (
        (e = n !== void 0 ? n(e) : e),
        (r.memoizedState = r.baseState = e),
        (t = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: t,
          lastRenderedState: e,
        }),
        (r.queue = t),
        (t = t.dispatch = Q_.bind(null, _e, t)),
        [r.memoizedState, t]
      );
    },
    useRef: function (t) {
      var e = $t();
      return (t = { current: t }), (e.memoizedState = t);
    },
    useState: hh,
    useDebugValue: Cu,
    useDeferredValue: function (t) {
      return ($t().memoizedState = t);
    },
    useTransition: function () {
      var t = hh(!1),
        e = t[0];
      return (t = K_.bind(null, t[1])), ($t().memoizedState = t), [e, t];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (t, e, n) {
      var r = _e,
        s = $t();
      if (ge) {
        if (n === void 0) throw Error(I(407));
        n = n();
      } else {
        if (((n = e()), Le === null)) throw Error(I(349));
        Zn & 30 || lm(r, e, n);
      }
      s.memoizedState = n;
      var i = { value: n, getSnapshot: e };
      return (
        (s.queue = i),
        fh(cm.bind(null, r, i, t), [t]),
        (r.flags |= 2048),
        si(9, am.bind(null, r, i, n, e), void 0, null),
        n
      );
    },
    useId: function () {
      var t = $t(),
        e = Le.identifierPrefix;
      if (ge) {
        var n = qt,
          r = Qt;
        (n = (r & ~(1 << (32 - It(r) - 1))).toString(32) + n),
          (e = ":" + e + "R" + n),
          (n = ni++),
          0 < n && (e += "H" + n.toString(32)),
          (e += ":");
      } else (n = Y_++), (e = ":" + e + "r" + n.toString(32) + ":");
      return (t.memoizedState = e);
    },
    unstable_isNewReconciler: !1,
  },
  J_ = {
    readContext: Ct,
    useCallback: ym,
    useContext: Ct,
    useEffect: wu,
    useImperativeHandle: gm,
    useInsertionEffect: fm,
    useLayoutEffect: pm,
    useMemo: vm,
    useReducer: ia,
    useRef: hm,
    useState: function () {
      return ia(ri);
    },
    useDebugValue: Cu,
    useDeferredValue: function (t) {
      var e = Et();
      return _m(e, Re.memoizedState, t);
    },
    useTransition: function () {
      var t = ia(ri)[0],
        e = Et().memoizedState;
      return [t, e];
    },
    useMutableSource: im,
    useSyncExternalStore: om,
    useId: wm,
    unstable_isNewReconciler: !1,
  },
  Z_ = {
    readContext: Ct,
    useCallback: ym,
    useContext: Ct,
    useEffect: wu,
    useImperativeHandle: gm,
    useInsertionEffect: fm,
    useLayoutEffect: pm,
    useMemo: vm,
    useReducer: oa,
    useRef: hm,
    useState: function () {
      return oa(ri);
    },
    useDebugValue: Cu,
    useDeferredValue: function (t) {
      var e = Et();
      return Re === null ? (e.memoizedState = t) : _m(e, Re.memoizedState, t);
    },
    useTransition: function () {
      var t = oa(ri)[0],
        e = Et().memoizedState;
      return [t, e];
    },
    useMutableSource: im,
    useSyncExternalStore: om,
    useId: wm,
    unstable_isNewReconciler: !1,
  };
function Nt(t, e) {
  if (t && t.defaultProps) {
    (e = we({}, e)), (t = t.defaultProps);
    for (var n in t) e[n] === void 0 && (e[n] = t[n]);
    return e;
  }
  return e;
}
function ec(t, e, n, r) {
  (e = t.memoizedState),
    (n = n(r, e)),
    (n = n == null ? e : we({}, e, n)),
    (t.memoizedState = n),
    t.lanes === 0 && (t.updateQueue.baseState = n);
}
var dl = {
  isMounted: function (t) {
    return (t = t._reactInternals) ? lr(t) === t : !1;
  },
  enqueueSetState: function (t, e, n) {
    t = t._reactInternals;
    var r = qe(),
      s = xn(t),
      i = Jt(r, s);
    (i.payload = e),
      n != null && (i.callback = n),
      (e = En(t, i, s)),
      e !== null && (Ot(e, t, s, r), oo(e, t, s));
  },
  enqueueReplaceState: function (t, e, n) {
    t = t._reactInternals;
    var r = qe(),
      s = xn(t),
      i = Jt(r, s);
    (i.tag = 1),
      (i.payload = e),
      n != null && (i.callback = n),
      (e = En(t, i, s)),
      e !== null && (Ot(e, t, s, r), oo(e, t, s));
  },
  enqueueForceUpdate: function (t, e) {
    t = t._reactInternals;
    var n = qe(),
      r = xn(t),
      s = Jt(n, r);
    (s.tag = 2),
      e != null && (s.callback = e),
      (e = En(t, s, r)),
      e !== null && (Ot(e, t, r, n), oo(e, t, r));
  },
};
function ph(t, e, n, r, s, i, o) {
  return (
    (t = t.stateNode),
    typeof t.shouldComponentUpdate == "function"
      ? t.shouldComponentUpdate(r, i, o)
      : e.prototype && e.prototype.isPureReactComponent
      ? !qs(n, r) || !qs(s, i)
      : !0
  );
}
function xm(t, e, n) {
  var r = !1,
    s = On,
    i = e.contextType;
  return (
    typeof i == "object" && i !== null
      ? (i = Ct(i))
      : ((s = it(e) ? Xn : Ye.current),
        (r = e.contextTypes),
        (i = (r = r != null) ? zr(t, s) : On)),
    (e = new e(n, i)),
    (t.memoizedState = e.state !== null && e.state !== void 0 ? e.state : null),
    (e.updater = dl),
    (t.stateNode = e),
    (e._reactInternals = t),
    r &&
      ((t = t.stateNode),
      (t.__reactInternalMemoizedUnmaskedChildContext = s),
      (t.__reactInternalMemoizedMaskedChildContext = i)),
    e
  );
}
function mh(t, e, n, r) {
  (t = e.state),
    typeof e.componentWillReceiveProps == "function" &&
      e.componentWillReceiveProps(n, r),
    typeof e.UNSAFE_componentWillReceiveProps == "function" &&
      e.UNSAFE_componentWillReceiveProps(n, r),
    e.state !== t && dl.enqueueReplaceState(e, e.state, null);
}
function tc(t, e, n, r) {
  var s = t.stateNode;
  (s.props = n), (s.state = t.memoizedState), (s.refs = {}), fu(t);
  var i = e.contextType;
  typeof i == "object" && i !== null
    ? (s.context = Ct(i))
    : ((i = it(e) ? Xn : Ye.current), (s.context = zr(t, i))),
    (s.state = t.memoizedState),
    (i = e.getDerivedStateFromProps),
    typeof i == "function" && (ec(t, e, i, n), (s.state = t.memoizedState)),
    typeof e.getDerivedStateFromProps == "function" ||
      typeof s.getSnapshotBeforeUpdate == "function" ||
      (typeof s.UNSAFE_componentWillMount != "function" &&
        typeof s.componentWillMount != "function") ||
      ((e = s.state),
      typeof s.componentWillMount == "function" && s.componentWillMount(),
      typeof s.UNSAFE_componentWillMount == "function" &&
        s.UNSAFE_componentWillMount(),
      e !== s.state && dl.enqueueReplaceState(s, s.state, null),
      Po(t, n, s, r),
      (s.state = t.memoizedState)),
    typeof s.componentDidMount == "function" && (t.flags |= 4194308);
}
function Vr(t, e) {
  try {
    var n = "",
      r = e;
    do (n += kv(r)), (r = r.return);
    while (r);
    var s = n;
  } catch (i) {
    s =
      `
Error generating stack: ` +
      i.message +
      `
` +
      i.stack;
  }
  return { value: t, source: e, stack: s, digest: null };
}
function la(t, e, n) {
  return { value: t, source: null, stack: n ?? null, digest: e ?? null };
}
function nc(t, e) {
  try {
    console.error(e.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var e0 = typeof WeakMap == "function" ? WeakMap : Map;
function Nm(t, e, n) {
  (n = Jt(-1, n)), (n.tag = 3), (n.payload = { element: null });
  var r = e.value;
  return (
    (n.callback = function () {
      jo || ((jo = !0), (hc = r)), nc(t, e);
    }),
    n
  );
}
function Tm(t, e, n) {
  (n = Jt(-1, n)), (n.tag = 3);
  var r = t.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var s = e.value;
    (n.payload = function () {
      return r(s);
    }),
      (n.callback = function () {
        nc(t, e);
      });
  }
  var i = t.stateNode;
  return (
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (n.callback = function () {
        nc(t, e),
          typeof r != "function" &&
            (Sn === null ? (Sn = new Set([this])) : Sn.add(this));
        var o = e.stack;
        this.componentDidCatch(e.value, {
          componentStack: o !== null ? o : "",
        });
      }),
    n
  );
}
function gh(t, e, n) {
  var r = t.pingCache;
  if (r === null) {
    r = t.pingCache = new e0();
    var s = new Set();
    r.set(e, s);
  } else (s = r.get(e)), s === void 0 && ((s = new Set()), r.set(e, s));
  s.has(n) || (s.add(n), (t = p0.bind(null, t, e, n)), e.then(t, t));
}
function yh(t) {
  do {
    var e;
    if (
      ((e = t.tag === 13) &&
        ((e = t.memoizedState), (e = e !== null ? e.dehydrated !== null : !0)),
      e)
    )
      return t;
    t = t.return;
  } while (t !== null);
  return null;
}
function vh(t, e, n, r, s) {
  return t.mode & 1
    ? ((t.flags |= 65536), (t.lanes = s), t)
    : (t === e
        ? (t.flags |= 65536)
        : ((t.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((e = Jt(-1, 1)), (e.tag = 2), En(n, e, 1))),
          (n.lanes |= 1)),
      t);
}
var t0 = on.ReactCurrentOwner,
  nt = !1;
function Ke(t, e, n, r) {
  e.child = t === null ? tm(e, null, n, r) : Wr(e, t.child, n, r);
}
function _h(t, e, n, r, s) {
  n = n.render;
  var i = e.ref;
  return (
    Mr(e, s),
    (r = vu(t, e, n, r, i, s)),
    (n = _u()),
    t !== null && !nt
      ? ((e.updateQueue = t.updateQueue),
        (e.flags &= -2053),
        (t.lanes &= ~s),
        rn(t, e, s))
      : (ge && n && ou(e), (e.flags |= 1), Ke(t, e, r, s), e.child)
  );
}
function wh(t, e, n, r, s) {
  if (t === null) {
    var i = n.type;
    return typeof i == "function" &&
      !Pu(i) &&
      i.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((e.tag = 15), (e.type = i), km(t, e, i, r, s))
      : ((t = fo(n.type, null, r, e, e.mode, s)),
        (t.ref = e.ref),
        (t.return = e),
        (e.child = t));
  }
  if (((i = t.child), !(t.lanes & s))) {
    var o = i.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : qs), n(o, r) && t.ref === e.ref)
    )
      return rn(t, e, s);
  }
  return (
    (e.flags |= 1),
    (t = Nn(i, r)),
    (t.ref = e.ref),
    (t.return = e),
    (e.child = t)
  );
}
function km(t, e, n, r, s) {
  if (t !== null) {
    var i = t.memoizedProps;
    if (qs(i, r) && t.ref === e.ref)
      if (((nt = !1), (e.pendingProps = r = i), (t.lanes & s) !== 0))
        t.flags & 131072 && (nt = !0);
      else return (e.lanes = t.lanes), rn(t, e, s);
  }
  return rc(t, e, n, r, s);
}
function Rm(t, e, n) {
  var r = e.pendingProps,
    s = r.children,
    i = t !== null ? t.memoizedState : null;
  if (r.mode === "hidden")
    if (!(e.mode & 1))
      (e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        ue(Pr, at),
        (at |= n);
    else {
      if (!(n & 1073741824))
        return (
          (t = i !== null ? i.baseLanes | n : n),
          (e.lanes = e.childLanes = 1073741824),
          (e.memoizedState = {
            baseLanes: t,
            cachePool: null,
            transitions: null,
          }),
          (e.updateQueue = null),
          ue(Pr, at),
          (at |= t),
          null
        );
      (e.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = i !== null ? i.baseLanes : n),
        ue(Pr, at),
        (at |= r);
    }
  else
    i !== null ? ((r = i.baseLanes | n), (e.memoizedState = null)) : (r = n),
      ue(Pr, at),
      (at |= r);
  return Ke(t, e, s, n), e.child;
}
function Pm(t, e) {
  var n = e.ref;
  ((t === null && n !== null) || (t !== null && t.ref !== n)) &&
    ((e.flags |= 512), (e.flags |= 2097152));
}
function rc(t, e, n, r, s) {
  var i = it(n) ? Xn : Ye.current;
  return (
    (i = zr(e, i)),
    Mr(e, s),
    (n = vu(t, e, n, r, i, s)),
    (r = _u()),
    t !== null && !nt
      ? ((e.updateQueue = t.updateQueue),
        (e.flags &= -2053),
        (t.lanes &= ~s),
        rn(t, e, s))
      : (ge && r && ou(e), (e.flags |= 1), Ke(t, e, n, s), e.child)
  );
}
function Ch(t, e, n, r, s) {
  if (it(n)) {
    var i = !0;
    xo(e);
  } else i = !1;
  if ((Mr(e, s), e.stateNode === null))
    co(t, e), xm(e, n, r), tc(e, n, r, s), (r = !0);
  else if (t === null) {
    var o = e.stateNode,
      l = e.memoizedProps;
    o.props = l;
    var a = o.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = Ct(c))
      : ((c = it(n) ? Xn : Ye.current), (c = zr(e, c)));
    var d = n.getDerivedStateFromProps,
      h =
        typeof d == "function" ||
        typeof o.getSnapshotBeforeUpdate == "function";
    h ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((l !== r || a !== c) && mh(e, o, r, c)),
      (dn = !1);
    var f = e.memoizedState;
    (o.state = f),
      Po(e, r, o, s),
      (a = e.memoizedState),
      l !== r || f !== a || st.current || dn
        ? (typeof d == "function" && (ec(e, n, d, r), (a = e.memoizedState)),
          (l = dn || ph(e, n, l, r, f, a, c))
            ? (h ||
                (typeof o.UNSAFE_componentWillMount != "function" &&
                  typeof o.componentWillMount != "function") ||
                (typeof o.componentWillMount == "function" &&
                  o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == "function" &&
                  o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == "function" && (e.flags |= 4194308))
            : (typeof o.componentDidMount == "function" && (e.flags |= 4194308),
              (e.memoizedProps = r),
              (e.memoizedState = a)),
          (o.props = r),
          (o.state = a),
          (o.context = c),
          (r = l))
        : (typeof o.componentDidMount == "function" && (e.flags |= 4194308),
          (r = !1));
  } else {
    (o = e.stateNode),
      rm(t, e),
      (l = e.memoizedProps),
      (c = e.type === e.elementType ? l : Nt(e.type, l)),
      (o.props = c),
      (h = e.pendingProps),
      (f = o.context),
      (a = n.contextType),
      typeof a == "object" && a !== null
        ? (a = Ct(a))
        : ((a = it(n) ? Xn : Ye.current), (a = zr(e, a)));
    var p = n.getDerivedStateFromProps;
    (d =
      typeof p == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function") ||
      (typeof o.UNSAFE_componentWillReceiveProps != "function" &&
        typeof o.componentWillReceiveProps != "function") ||
      ((l !== h || f !== a) && mh(e, o, r, a)),
      (dn = !1),
      (f = e.memoizedState),
      (o.state = f),
      Po(e, r, o, s);
    var g = e.memoizedState;
    l !== h || f !== g || st.current || dn
      ? (typeof p == "function" && (ec(e, n, p, r), (g = e.memoizedState)),
        (c = dn || ph(e, n, c, r, f, g, a) || !1)
          ? (d ||
              (typeof o.UNSAFE_componentWillUpdate != "function" &&
                typeof o.componentWillUpdate != "function") ||
              (typeof o.componentWillUpdate == "function" &&
                o.componentWillUpdate(r, g, a),
              typeof o.UNSAFE_componentWillUpdate == "function" &&
                o.UNSAFE_componentWillUpdate(r, g, a)),
            typeof o.componentDidUpdate == "function" && (e.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024))
          : (typeof o.componentDidUpdate != "function" ||
              (l === t.memoizedProps && f === t.memoizedState) ||
              (e.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != "function" ||
              (l === t.memoizedProps && f === t.memoizedState) ||
              (e.flags |= 1024),
            (e.memoizedProps = r),
            (e.memoizedState = g)),
        (o.props = r),
        (o.state = g),
        (o.context = a),
        (r = c))
      : (typeof o.componentDidUpdate != "function" ||
          (l === t.memoizedProps && f === t.memoizedState) ||
          (e.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != "function" ||
          (l === t.memoizedProps && f === t.memoizedState) ||
          (e.flags |= 1024),
        (r = !1));
  }
  return sc(t, e, n, r, i, s);
}
function sc(t, e, n, r, s, i) {
  Pm(t, e);
  var o = (e.flags & 128) !== 0;
  if (!r && !o) return s && oh(e, n, !1), rn(t, e, i);
  (r = e.stateNode), (t0.current = e);
  var l =
    o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (e.flags |= 1),
    t !== null && o
      ? ((e.child = Wr(e, t.child, null, i)), (e.child = Wr(e, null, l, i)))
      : Ke(t, e, l, i),
    (e.memoizedState = r.state),
    s && oh(e, n, !0),
    e.child
  );
}
function Im(t) {
  var e = t.stateNode;
  e.pendingContext
    ? ih(t, e.pendingContext, e.pendingContext !== e.context)
    : e.context && ih(t, e.context, !1),
    pu(t, e.containerInfo);
}
function Eh(t, e, n, r, s) {
  return Hr(), au(s), (e.flags |= 256), Ke(t, e, n, r), e.child;
}
var ic = { dehydrated: null, treeContext: null, retryLane: 0 };
function oc(t) {
  return { baseLanes: t, cachePool: null, transitions: null };
}
function Om(t, e, n) {
  var r = e.pendingProps,
    s = ve.current,
    i = !1,
    o = (e.flags & 128) !== 0,
    l;
  if (
    ((l = o) ||
      (l = t !== null && t.memoizedState === null ? !1 : (s & 2) !== 0),
    l
      ? ((i = !0), (e.flags &= -129))
      : (t === null || t.memoizedState !== null) && (s |= 1),
    ue(ve, s & 1),
    t === null)
  )
    return (
      Ja(e),
      (t = e.memoizedState),
      t !== null && ((t = t.dehydrated), t !== null)
        ? (e.mode & 1
            ? t.data === "$!"
              ? (e.lanes = 8)
              : (e.lanes = 1073741824)
            : (e.lanes = 1),
          null)
        : ((o = r.children),
          (t = r.fallback),
          i
            ? ((r = e.mode),
              (i = e.child),
              (o = { mode: "hidden", children: o }),
              !(r & 1) && i !== null
                ? ((i.childLanes = 0), (i.pendingProps = o))
                : (i = pl(o, r, 0, null)),
              (t = Kn(t, r, n, null)),
              (i.return = e),
              (t.return = e),
              (i.sibling = t),
              (e.child = i),
              (e.child.memoizedState = oc(n)),
              (e.memoizedState = ic),
              t)
            : Eu(e, o))
    );
  if (((s = t.memoizedState), s !== null && ((l = s.dehydrated), l !== null)))
    return n0(t, e, o, r, l, s, n);
  if (i) {
    (i = r.fallback), (o = e.mode), (s = t.child), (l = s.sibling);
    var a = { mode: "hidden", children: r.children };
    return (
      !(o & 1) && e.child !== s
        ? ((r = e.child),
          (r.childLanes = 0),
          (r.pendingProps = a),
          (e.deletions = null))
        : ((r = Nn(s, a)), (r.subtreeFlags = s.subtreeFlags & 14680064)),
      l !== null ? (i = Nn(l, i)) : ((i = Kn(i, o, n, null)), (i.flags |= 2)),
      (i.return = e),
      (r.return = e),
      (r.sibling = i),
      (e.child = r),
      (r = i),
      (i = e.child),
      (o = t.child.memoizedState),
      (o =
        o === null
          ? oc(n)
          : {
              baseLanes: o.baseLanes | n,
              cachePool: null,
              transitions: o.transitions,
            }),
      (i.memoizedState = o),
      (i.childLanes = t.childLanes & ~n),
      (e.memoizedState = ic),
      r
    );
  }
  return (
    (i = t.child),
    (t = i.sibling),
    (r = Nn(i, { mode: "visible", children: r.children })),
    !(e.mode & 1) && (r.lanes = n),
    (r.return = e),
    (r.sibling = null),
    t !== null &&
      ((n = e.deletions),
      n === null ? ((e.deletions = [t]), (e.flags |= 16)) : n.push(t)),
    (e.child = r),
    (e.memoizedState = null),
    r
  );
}
function Eu(t, e) {
  return (
    (e = pl({ mode: "visible", children: e }, t.mode, 0, null)),
    (e.return = t),
    (t.child = e)
  );
}
function Ki(t, e, n, r) {
  return (
    r !== null && au(r),
    Wr(e, t.child, null, n),
    (t = Eu(e, e.pendingProps.children)),
    (t.flags |= 2),
    (e.memoizedState = null),
    t
  );
}
function n0(t, e, n, r, s, i, o) {
  if (n)
    return e.flags & 256
      ? ((e.flags &= -257), (r = la(Error(I(422)))), Ki(t, e, o, r))
      : e.memoizedState !== null
      ? ((e.child = t.child), (e.flags |= 128), null)
      : ((i = r.fallback),
        (s = e.mode),
        (r = pl({ mode: "visible", children: r.children }, s, 0, null)),
        (i = Kn(i, s, o, null)),
        (i.flags |= 2),
        (r.return = e),
        (i.return = e),
        (r.sibling = i),
        (e.child = r),
        e.mode & 1 && Wr(e, t.child, null, o),
        (e.child.memoizedState = oc(o)),
        (e.memoizedState = ic),
        i);
  if (!(e.mode & 1)) return Ki(t, e, o, null);
  if (s.data === "$!") {
    if (((r = s.nextSibling && s.nextSibling.dataset), r)) var l = r.dgst;
    return (r = l), (i = Error(I(419))), (r = la(i, r, void 0)), Ki(t, e, o, r);
  }
  if (((l = (o & t.childLanes) !== 0), nt || l)) {
    if (((r = Le), r !== null)) {
      switch (o & -o) {
        case 4:
          s = 2;
          break;
        case 16:
          s = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          s = 32;
          break;
        case 536870912:
          s = 268435456;
          break;
        default:
          s = 0;
      }
      (s = s & (r.suspendedLanes | o) ? 0 : s),
        s !== 0 &&
          s !== i.retryLane &&
          ((i.retryLane = s), nn(t, s), Ot(r, t, s, -1));
    }
    return Ru(), (r = la(Error(I(421)))), Ki(t, e, o, r);
  }
  return s.data === "$?"
    ? ((e.flags |= 128),
      (e.child = t.child),
      (e = m0.bind(null, t)),
      (s._reactRetry = e),
      null)
    : ((t = i.treeContext),
      (ct = Cn(s.nextSibling)),
      (ut = e),
      (ge = !0),
      (kt = null),
      t !== null &&
        ((gt[yt++] = Qt),
        (gt[yt++] = qt),
        (gt[yt++] = Jn),
        (Qt = t.id),
        (qt = t.overflow),
        (Jn = e)),
      (e = Eu(e, r.children)),
      (e.flags |= 4096),
      e);
}
function Sh(t, e, n) {
  t.lanes |= e;
  var r = t.alternate;
  r !== null && (r.lanes |= e), Za(t.return, e, n);
}
function aa(t, e, n, r, s) {
  var i = t.memoizedState;
  i === null
    ? (t.memoizedState = {
        isBackwards: e,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: s,
      })
    : ((i.isBackwards = e),
      (i.rendering = null),
      (i.renderingStartTime = 0),
      (i.last = r),
      (i.tail = n),
      (i.tailMode = s));
}
function bm(t, e, n) {
  var r = e.pendingProps,
    s = r.revealOrder,
    i = r.tail;
  if ((Ke(t, e, r.children, n), (r = ve.current), r & 2))
    (r = (r & 1) | 2), (e.flags |= 128);
  else {
    if (t !== null && t.flags & 128)
      e: for (t = e.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Sh(t, n, e);
        else if (t.tag === 19) Sh(t, n, e);
        else if (t.child !== null) {
          (t.child.return = t), (t = t.child);
          continue;
        }
        if (t === e) break e;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) break e;
          t = t.return;
        }
        (t.sibling.return = t.return), (t = t.sibling);
      }
    r &= 1;
  }
  if ((ue(ve, r), !(e.mode & 1))) e.memoizedState = null;
  else
    switch (s) {
      case "forwards":
        for (n = e.child, s = null; n !== null; )
          (t = n.alternate),
            t !== null && Io(t) === null && (s = n),
            (n = n.sibling);
        (n = s),
          n === null
            ? ((s = e.child), (e.child = null))
            : ((s = n.sibling), (n.sibling = null)),
          aa(e, !1, s, n, i);
        break;
      case "backwards":
        for (n = null, s = e.child, e.child = null; s !== null; ) {
          if (((t = s.alternate), t !== null && Io(t) === null)) {
            e.child = s;
            break;
          }
          (t = s.sibling), (s.sibling = n), (n = s), (s = t);
        }
        aa(e, !0, n, null, i);
        break;
      case "together":
        aa(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
  return e.child;
}
function co(t, e) {
  !(e.mode & 1) &&
    t !== null &&
    ((t.alternate = null), (e.alternate = null), (e.flags |= 2));
}
function rn(t, e, n) {
  if (
    (t !== null && (e.dependencies = t.dependencies),
    (er |= e.lanes),
    !(n & e.childLanes))
  )
    return null;
  if (t !== null && e.child !== t.child) throw Error(I(153));
  if (e.child !== null) {
    for (
      t = e.child, n = Nn(t, t.pendingProps), e.child = n, n.return = e;
      t.sibling !== null;

    )
      (t = t.sibling), (n = n.sibling = Nn(t, t.pendingProps)), (n.return = e);
    n.sibling = null;
  }
  return e.child;
}
function r0(t, e, n) {
  switch (e.tag) {
    case 3:
      Im(e), Hr();
      break;
    case 5:
      sm(e);
      break;
    case 1:
      it(e.type) && xo(e);
      break;
    case 4:
      pu(e, e.stateNode.containerInfo);
      break;
    case 10:
      var r = e.type._context,
        s = e.memoizedProps.value;
      ue(ko, r._currentValue), (r._currentValue = s);
      break;
    case 13:
      if (((r = e.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (ue(ve, ve.current & 1), (e.flags |= 128), null)
          : n & e.child.childLanes
          ? Om(t, e, n)
          : (ue(ve, ve.current & 1),
            (t = rn(t, e, n)),
            t !== null ? t.sibling : null);
      ue(ve, ve.current & 1);
      break;
    case 19:
      if (((r = (n & e.childLanes) !== 0), t.flags & 128)) {
        if (r) return bm(t, e, n);
        e.flags |= 128;
      }
      if (
        ((s = e.memoizedState),
        s !== null &&
          ((s.rendering = null), (s.tail = null), (s.lastEffect = null)),
        ue(ve, ve.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return (e.lanes = 0), Rm(t, e, n);
  }
  return rn(t, e, n);
}
var Am, lc, jm, Mm;
Am = function (t, e) {
  for (var n = e.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) t.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      (n.child.return = n), (n = n.child);
      continue;
    }
    if (n === e) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === e) return;
      n = n.return;
    }
    (n.sibling.return = n.return), (n = n.sibling);
  }
};
lc = function () {};
jm = function (t, e, n, r) {
  var s = t.memoizedProps;
  if (s !== r) {
    (t = e.stateNode), Gn(Bt.current);
    var i = null;
    switch (n) {
      case "input":
        (s = Pa(t, s)), (r = Pa(t, r)), (i = []);
        break;
      case "select":
        (s = we({}, s, { value: void 0 })),
          (r = we({}, r, { value: void 0 })),
          (i = []);
        break;
      case "textarea":
        (s = ba(t, s)), (r = ba(t, r)), (i = []);
        break;
      default:
        typeof s.onClick != "function" &&
          typeof r.onClick == "function" &&
          (t.onclick = Eo);
    }
    ja(n, r);
    var o;
    n = null;
    for (c in s)
      if (!r.hasOwnProperty(c) && s.hasOwnProperty(c) && s[c] != null)
        if (c === "style") {
          var l = s[c];
          for (o in l) l.hasOwnProperty(o) && (n || (n = {}), (n[o] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (Hs.hasOwnProperty(c)
              ? i || (i = [])
              : (i = i || []).push(c, null));
    for (c in r) {
      var a = r[c];
      if (
        ((l = s != null ? s[c] : void 0),
        r.hasOwnProperty(c) && a !== l && (a != null || l != null))
      )
        if (c === "style")
          if (l) {
            for (o in l)
              !l.hasOwnProperty(o) ||
                (a && a.hasOwnProperty(o)) ||
                (n || (n = {}), (n[o] = ""));
            for (o in a)
              a.hasOwnProperty(o) &&
                l[o] !== a[o] &&
                (n || (n = {}), (n[o] = a[o]));
          } else n || (i || (i = []), i.push(c, n)), (n = a);
        else
          c === "dangerouslySetInnerHTML"
            ? ((a = a ? a.__html : void 0),
              (l = l ? l.__html : void 0),
              a != null && l !== a && (i = i || []).push(c, a))
            : c === "children"
            ? (typeof a != "string" && typeof a != "number") ||
              (i = i || []).push(c, "" + a)
            : c !== "suppressContentEditableWarning" &&
              c !== "suppressHydrationWarning" &&
              (Hs.hasOwnProperty(c)
                ? (a != null && c === "onScroll" && fe("scroll", t),
                  i || l === a || (i = []))
                : (i = i || []).push(c, a));
    }
    n && (i = i || []).push("style", n);
    var c = i;
    (e.updateQueue = c) && (e.flags |= 4);
  }
};
Mm = function (t, e, n, r) {
  n !== r && (e.flags |= 4);
};
function ws(t, e) {
  if (!ge)
    switch (t.tailMode) {
      case "hidden":
        e = t.tail;
        for (var n = null; e !== null; )
          e.alternate !== null && (n = e), (e = e.sibling);
        n === null ? (t.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = t.tail;
        for (var r = null; n !== null; )
          n.alternate !== null && (r = n), (n = n.sibling);
        r === null
          ? e || t.tail === null
            ? (t.tail = null)
            : (t.tail.sibling = null)
          : (r.sibling = null);
    }
}
function Ge(t) {
  var e = t.alternate !== null && t.alternate.child === t.child,
    n = 0,
    r = 0;
  if (e)
    for (var s = t.child; s !== null; )
      (n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags & 14680064),
        (r |= s.flags & 14680064),
        (s.return = t),
        (s = s.sibling);
  else
    for (s = t.child; s !== null; )
      (n |= s.lanes | s.childLanes),
        (r |= s.subtreeFlags),
        (r |= s.flags),
        (s.return = t),
        (s = s.sibling);
  return (t.subtreeFlags |= r), (t.childLanes = n), e;
}
function s0(t, e, n) {
  var r = e.pendingProps;
  switch ((lu(e), e.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return Ge(e), null;
    case 1:
      return it(e.type) && So(), Ge(e), null;
    case 3:
      return (
        (r = e.stateNode),
        Gr(),
        pe(st),
        pe(Ye),
        gu(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (t === null || t.child === null) &&
          (Vi(e)
            ? (e.flags |= 4)
            : t === null ||
              (t.memoizedState.isDehydrated && !(e.flags & 256)) ||
              ((e.flags |= 1024), kt !== null && (mc(kt), (kt = null)))),
        lc(t, e),
        Ge(e),
        null
      );
    case 5:
      mu(e);
      var s = Gn(ti.current);
      if (((n = e.type), t !== null && e.stateNode != null))
        jm(t, e, n, r, s),
          t.ref !== e.ref && ((e.flags |= 512), (e.flags |= 2097152));
      else {
        if (!r) {
          if (e.stateNode === null) throw Error(I(166));
          return Ge(e), null;
        }
        if (((t = Gn(Bt.current)), Vi(e))) {
          (r = e.stateNode), (n = e.type);
          var i = e.memoizedProps;
          switch (((r[Ft] = e), (r[Zs] = i), (t = (e.mode & 1) !== 0), n)) {
            case "dialog":
              fe("cancel", r), fe("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              fe("load", r);
              break;
            case "video":
            case "audio":
              for (s = 0; s < Ps.length; s++) fe(Ps[s], r);
              break;
            case "source":
              fe("error", r);
              break;
            case "img":
            case "image":
            case "link":
              fe("error", r), fe("load", r);
              break;
            case "details":
              fe("toggle", r);
              break;
            case "input":
              bd(r, i), fe("invalid", r);
              break;
            case "select":
              (r._wrapperState = { wasMultiple: !!i.multiple }),
                fe("invalid", r);
              break;
            case "textarea":
              jd(r, i), fe("invalid", r);
          }
          ja(n, i), (s = null);
          for (var o in i)
            if (i.hasOwnProperty(o)) {
              var l = i[o];
              o === "children"
                ? typeof l == "string"
                  ? r.textContent !== l &&
                    (i.suppressHydrationWarning !== !0 &&
                      Gi(r.textContent, l, t),
                    (s = ["children", l]))
                  : typeof l == "number" &&
                    r.textContent !== "" + l &&
                    (i.suppressHydrationWarning !== !0 &&
                      Gi(r.textContent, l, t),
                    (s = ["children", "" + l]))
                : Hs.hasOwnProperty(o) &&
                  l != null &&
                  o === "onScroll" &&
                  fe("scroll", r);
            }
          switch (n) {
            case "input":
              Li(r), Ad(r, i, !0);
              break;
            case "textarea":
              Li(r), Md(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof i.onClick == "function" && (r.onclick = Eo);
          }
          (r = s), (e.updateQueue = r), r !== null && (e.flags |= 4);
        } else {
          (o = s.nodeType === 9 ? s : s.ownerDocument),
            t === "http://www.w3.org/1999/xhtml" && (t = cp(n)),
            t === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((t = o.createElement("div")),
                  (t.innerHTML = "<script></script>"),
                  (t = t.removeChild(t.firstChild)))
                : typeof r.is == "string"
                ? (t = o.createElement(n, { is: r.is }))
                : ((t = o.createElement(n)),
                  n === "select" &&
                    ((o = t),
                    r.multiple
                      ? (o.multiple = !0)
                      : r.size && (o.size = r.size)))
              : (t = o.createElementNS(t, n)),
            (t[Ft] = e),
            (t[Zs] = r),
            Am(t, e, !1, !1),
            (e.stateNode = t);
          e: {
            switch (((o = Ma(n, r)), n)) {
              case "dialog":
                fe("cancel", t), fe("close", t), (s = r);
                break;
              case "iframe":
              case "object":
              case "embed":
                fe("load", t), (s = r);
                break;
              case "video":
              case "audio":
                for (s = 0; s < Ps.length; s++) fe(Ps[s], t);
                s = r;
                break;
              case "source":
                fe("error", t), (s = r);
                break;
              case "img":
              case "image":
              case "link":
                fe("error", t), fe("load", t), (s = r);
                break;
              case "details":
                fe("toggle", t), (s = r);
                break;
              case "input":
                bd(t, r), (s = Pa(t, r)), fe("invalid", t);
                break;
              case "option":
                s = r;
                break;
              case "select":
                (t._wrapperState = { wasMultiple: !!r.multiple }),
                  (s = we({}, r, { value: void 0 })),
                  fe("invalid", t);
                break;
              case "textarea":
                jd(t, r), (s = ba(t, r)), fe("invalid", t);
                break;
              default:
                s = r;
            }
            ja(n, s), (l = s);
            for (i in l)
              if (l.hasOwnProperty(i)) {
                var a = l[i];
                i === "style"
                  ? hp(t, a)
                  : i === "dangerouslySetInnerHTML"
                  ? ((a = a ? a.__html : void 0), a != null && up(t, a))
                  : i === "children"
                  ? typeof a == "string"
                    ? (n !== "textarea" || a !== "") && Ws(t, a)
                    : typeof a == "number" && Ws(t, "" + a)
                  : i !== "suppressContentEditableWarning" &&
                    i !== "suppressHydrationWarning" &&
                    i !== "autoFocus" &&
                    (Hs.hasOwnProperty(i)
                      ? a != null && i === "onScroll" && fe("scroll", t)
                      : a != null && Vc(t, i, a, o));
              }
            switch (n) {
              case "input":
                Li(t), Ad(t, r, !1);
                break;
              case "textarea":
                Li(t), Md(t);
                break;
              case "option":
                r.value != null && t.setAttribute("value", "" + In(r.value));
                break;
              case "select":
                (t.multiple = !!r.multiple),
                  (i = r.value),
                  i != null
                    ? Or(t, !!r.multiple, i, !1)
                    : r.defaultValue != null &&
                      Or(t, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof s.onClick == "function" && (t.onclick = Eo);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (e.flags |= 4);
        }
        e.ref !== null && ((e.flags |= 512), (e.flags |= 2097152));
      }
      return Ge(e), null;
    case 6:
      if (t && e.stateNode != null) Mm(t, e, t.memoizedProps, r);
      else {
        if (typeof r != "string" && e.stateNode === null) throw Error(I(166));
        if (((n = Gn(ti.current)), Gn(Bt.current), Vi(e))) {
          if (
            ((r = e.stateNode),
            (n = e.memoizedProps),
            (r[Ft] = e),
            (i = r.nodeValue !== n) && ((t = ut), t !== null))
          )
            switch (t.tag) {
              case 3:
                Gi(r.nodeValue, n, (t.mode & 1) !== 0);
                break;
              case 5:
                t.memoizedProps.suppressHydrationWarning !== !0 &&
                  Gi(r.nodeValue, n, (t.mode & 1) !== 0);
            }
          i && (e.flags |= 4);
        } else
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[Ft] = e),
            (e.stateNode = r);
      }
      return Ge(e), null;
    case 13:
      if (
        (pe(ve),
        (r = e.memoizedState),
        t === null ||
          (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
      ) {
        if (ge && ct !== null && e.mode & 1 && !(e.flags & 128))
          Zp(), Hr(), (e.flags |= 98560), (i = !1);
        else if (((i = Vi(e)), r !== null && r.dehydrated !== null)) {
          if (t === null) {
            if (!i) throw Error(I(318));
            if (
              ((i = e.memoizedState),
              (i = i !== null ? i.dehydrated : null),
              !i)
            )
              throw Error(I(317));
            i[Ft] = e;
          } else
            Hr(), !(e.flags & 128) && (e.memoizedState = null), (e.flags |= 4);
          Ge(e), (i = !1);
        } else kt !== null && (mc(kt), (kt = null)), (i = !0);
        if (!i) return e.flags & 65536 ? e : null;
      }
      return e.flags & 128
        ? ((e.lanes = n), e)
        : ((r = r !== null),
          r !== (t !== null && t.memoizedState !== null) &&
            r &&
            ((e.child.flags |= 8192),
            e.mode & 1 &&
              (t === null || ve.current & 1 ? Oe === 0 && (Oe = 3) : Ru())),
          e.updateQueue !== null && (e.flags |= 4),
          Ge(e),
          null);
    case 4:
      return (
        Gr(), lc(t, e), t === null && Xs(e.stateNode.containerInfo), Ge(e), null
      );
    case 10:
      return du(e.type._context), Ge(e), null;
    case 17:
      return it(e.type) && So(), Ge(e), null;
    case 19:
      if ((pe(ve), (i = e.memoizedState), i === null)) return Ge(e), null;
      if (((r = (e.flags & 128) !== 0), (o = i.rendering), o === null))
        if (r) ws(i, !1);
        else {
          if (Oe !== 0 || (t !== null && t.flags & 128))
            for (t = e.child; t !== null; ) {
              if (((o = Io(t)), o !== null)) {
                for (
                  e.flags |= 128,
                    ws(i, !1),
                    r = o.updateQueue,
                    r !== null && ((e.updateQueue = r), (e.flags |= 4)),
                    e.subtreeFlags = 0,
                    r = n,
                    n = e.child;
                  n !== null;

                )
                  (i = n),
                    (t = r),
                    (i.flags &= 14680066),
                    (o = i.alternate),
                    o === null
                      ? ((i.childLanes = 0),
                        (i.lanes = t),
                        (i.child = null),
                        (i.subtreeFlags = 0),
                        (i.memoizedProps = null),
                        (i.memoizedState = null),
                        (i.updateQueue = null),
                        (i.dependencies = null),
                        (i.stateNode = null))
                      : ((i.childLanes = o.childLanes),
                        (i.lanes = o.lanes),
                        (i.child = o.child),
                        (i.subtreeFlags = 0),
                        (i.deletions = null),
                        (i.memoizedProps = o.memoizedProps),
                        (i.memoizedState = o.memoizedState),
                        (i.updateQueue = o.updateQueue),
                        (i.type = o.type),
                        (t = o.dependencies),
                        (i.dependencies =
                          t === null
                            ? null
                            : {
                                lanes: t.lanes,
                                firstContext: t.firstContext,
                              })),
                    (n = n.sibling);
                return ue(ve, (ve.current & 1) | 2), e.child;
              }
              t = t.sibling;
            }
          i.tail !== null &&
            Te() > Yr &&
            ((e.flags |= 128), (r = !0), ws(i, !1), (e.lanes = 4194304));
        }
      else {
        if (!r)
          if (((t = Io(o)), t !== null)) {
            if (
              ((e.flags |= 128),
              (r = !0),
              (n = t.updateQueue),
              n !== null && ((e.updateQueue = n), (e.flags |= 4)),
              ws(i, !0),
              i.tail === null && i.tailMode === "hidden" && !o.alternate && !ge)
            )
              return Ge(e), null;
          } else
            2 * Te() - i.renderingStartTime > Yr &&
              n !== 1073741824 &&
              ((e.flags |= 128), (r = !0), ws(i, !1), (e.lanes = 4194304));
        i.isBackwards
          ? ((o.sibling = e.child), (e.child = o))
          : ((n = i.last),
            n !== null ? (n.sibling = o) : (e.child = o),
            (i.last = o));
      }
      return i.tail !== null
        ? ((e = i.tail),
          (i.rendering = e),
          (i.tail = e.sibling),
          (i.renderingStartTime = Te()),
          (e.sibling = null),
          (n = ve.current),
          ue(ve, r ? (n & 1) | 2 : n & 1),
          e)
        : (Ge(e), null);
    case 22:
    case 23:
      return (
        ku(),
        (r = e.memoizedState !== null),
        t !== null && (t.memoizedState !== null) !== r && (e.flags |= 8192),
        r && e.mode & 1
          ? at & 1073741824 && (Ge(e), e.subtreeFlags & 6 && (e.flags |= 8192))
          : Ge(e),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(I(156, e.tag));
}
function i0(t, e) {
  switch ((lu(e), e.tag)) {
    case 1:
      return (
        it(e.type) && So(),
        (t = e.flags),
        t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
      );
    case 3:
      return (
        Gr(),
        pe(st),
        pe(Ye),
        gu(),
        (t = e.flags),
        t & 65536 && !(t & 128) ? ((e.flags = (t & -65537) | 128), e) : null
      );
    case 5:
      return mu(e), null;
    case 13:
      if (
        (pe(ve), (t = e.memoizedState), t !== null && t.dehydrated !== null)
      ) {
        if (e.alternate === null) throw Error(I(340));
        Hr();
      }
      return (
        (t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
      );
    case 19:
      return pe(ve), null;
    case 4:
      return Gr(), null;
    case 10:
      return du(e.type._context), null;
    case 22:
    case 23:
      return ku(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Qi = !1,
  Ve = !1,
  o0 = typeof WeakSet == "function" ? WeakSet : Set,
  F = null;
function Rr(t, e) {
  var n = t.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        Ee(t, e, r);
      }
    else n.current = null;
}
function ac(t, e, n) {
  try {
    n();
  } catch (r) {
    Ee(t, e, r);
  }
}
var xh = !1;
function l0(t, e) {
  if (((Ga = _o), (t = Up()), iu(t))) {
    if ("selectionStart" in t)
      var n = { start: t.selectionStart, end: t.selectionEnd };
    else
      e: {
        n = ((n = t.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var s = r.anchorOffset,
            i = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, i.nodeType;
          } catch {
            n = null;
            break e;
          }
          var o = 0,
            l = -1,
            a = -1,
            c = 0,
            d = 0,
            h = t,
            f = null;
          t: for (;;) {
            for (
              var p;
              h !== n || (s !== 0 && h.nodeType !== 3) || (l = o + s),
                h !== i || (r !== 0 && h.nodeType !== 3) || (a = o + r),
                h.nodeType === 3 && (o += h.nodeValue.length),
                (p = h.firstChild) !== null;

            )
              (f = h), (h = p);
            for (;;) {
              if (h === t) break t;
              if (
                (f === n && ++c === s && (l = o),
                f === i && ++d === r && (a = o),
                (p = h.nextSibling) !== null)
              )
                break;
              (h = f), (f = h.parentNode);
            }
            h = p;
          }
          n = l === -1 || a === -1 ? null : { start: l, end: a };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Va = { focusedElem: t, selectionRange: n }, _o = !1, F = e; F !== null; )
    if (((e = F), (t = e.child), (e.subtreeFlags & 1028) !== 0 && t !== null))
      (t.return = e), (F = t);
    else
      for (; F !== null; ) {
        e = F;
        try {
          var g = e.alternate;
          if (e.flags & 1024)
            switch (e.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (g !== null) {
                  var w = g.memoizedProps,
                    E = g.memoizedState,
                    y = e.stateNode,
                    m = y.getSnapshotBeforeUpdate(
                      e.elementType === e.type ? w : Nt(e.type, w),
                      E
                    );
                  y.__reactInternalSnapshotBeforeUpdate = m;
                }
                break;
              case 3:
                var v = e.stateNode.containerInfo;
                v.nodeType === 1
                  ? (v.textContent = "")
                  : v.nodeType === 9 &&
                    v.documentElement &&
                    v.removeChild(v.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(I(163));
            }
        } catch (_) {
          Ee(e, e.return, _);
        }
        if (((t = e.sibling), t !== null)) {
          (t.return = e.return), (F = t);
          break;
        }
        F = e.return;
      }
  return (g = xh), (xh = !1), g;
}
function Ds(t, e, n) {
  var r = e.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var s = (r = r.next);
    do {
      if ((s.tag & t) === t) {
        var i = s.destroy;
        (s.destroy = void 0), i !== void 0 && ac(e, n, i);
      }
      s = s.next;
    } while (s !== r);
  }
}
function hl(t, e) {
  if (
    ((e = e.updateQueue), (e = e !== null ? e.lastEffect : null), e !== null)
  ) {
    var n = (e = e.next);
    do {
      if ((n.tag & t) === t) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== e);
  }
}
function cc(t) {
  var e = t.ref;
  if (e !== null) {
    var n = t.stateNode;
    switch (t.tag) {
      case 5:
        t = n;
        break;
      default:
        t = n;
    }
    typeof e == "function" ? e(t) : (e.current = t);
  }
}
function Dm(t) {
  var e = t.alternate;
  e !== null && ((t.alternate = null), Dm(e)),
    (t.child = null),
    (t.deletions = null),
    (t.sibling = null),
    t.tag === 5 &&
      ((e = t.stateNode),
      e !== null &&
        (delete e[Ft], delete e[Zs], delete e[Qa], delete e[H_], delete e[W_])),
    (t.stateNode = null),
    (t.return = null),
    (t.dependencies = null),
    (t.memoizedProps = null),
    (t.memoizedState = null),
    (t.pendingProps = null),
    (t.stateNode = null),
    (t.updateQueue = null);
}
function Lm(t) {
  return t.tag === 5 || t.tag === 3 || t.tag === 4;
}
function Nh(t) {
  e: for (;;) {
    for (; t.sibling === null; ) {
      if (t.return === null || Lm(t.return)) return null;
      t = t.return;
    }
    for (
      t.sibling.return = t.return, t = t.sibling;
      t.tag !== 5 && t.tag !== 6 && t.tag !== 18;

    ) {
      if (t.flags & 2 || t.child === null || t.tag === 4) continue e;
      (t.child.return = t), (t = t.child);
    }
    if (!(t.flags & 2)) return t.stateNode;
  }
}
function uc(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6)
    (t = t.stateNode),
      e
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(t, e)
          : n.insertBefore(t, e)
        : (n.nodeType === 8
            ? ((e = n.parentNode), e.insertBefore(t, n))
            : ((e = n), e.appendChild(t)),
          (n = n._reactRootContainer),
          n != null || e.onclick !== null || (e.onclick = Eo));
  else if (r !== 4 && ((t = t.child), t !== null))
    for (uc(t, e, n), t = t.sibling; t !== null; ) uc(t, e, n), (t = t.sibling);
}
function dc(t, e, n) {
  var r = t.tag;
  if (r === 5 || r === 6)
    (t = t.stateNode), e ? n.insertBefore(t, e) : n.appendChild(t);
  else if (r !== 4 && ((t = t.child), t !== null))
    for (dc(t, e, n), t = t.sibling; t !== null; ) dc(t, e, n), (t = t.sibling);
}
var Fe = null,
  Tt = !1;
function cn(t, e, n) {
  for (n = n.child; n !== null; ) $m(t, e, n), (n = n.sibling);
}
function $m(t, e, n) {
  if (Ut && typeof Ut.onCommitFiberUnmount == "function")
    try {
      Ut.onCommitFiberUnmount(sl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      Ve || Rr(n, e);
    case 6:
      var r = Fe,
        s = Tt;
      (Fe = null),
        cn(t, e, n),
        (Fe = r),
        (Tt = s),
        Fe !== null &&
          (Tt
            ? ((t = Fe),
              (n = n.stateNode),
              t.nodeType === 8 ? t.parentNode.removeChild(n) : t.removeChild(n))
            : Fe.removeChild(n.stateNode));
      break;
    case 18:
      Fe !== null &&
        (Tt
          ? ((t = Fe),
            (n = n.stateNode),
            t.nodeType === 8
              ? ta(t.parentNode, n)
              : t.nodeType === 1 && ta(t, n),
            Ks(t))
          : ta(Fe, n.stateNode));
      break;
    case 4:
      (r = Fe),
        (s = Tt),
        (Fe = n.stateNode.containerInfo),
        (Tt = !0),
        cn(t, e, n),
        (Fe = r),
        (Tt = s);
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !Ve &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        s = r = r.next;
        do {
          var i = s,
            o = i.destroy;
          (i = i.tag),
            o !== void 0 && (i & 2 || i & 4) && ac(n, e, o),
            (s = s.next);
        } while (s !== r);
      }
      cn(t, e, n);
      break;
    case 1:
      if (
        !Ve &&
        (Rr(n, e),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          (r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount();
        } catch (l) {
          Ee(n, e, l);
        }
      cn(t, e, n);
      break;
    case 21:
      cn(t, e, n);
      break;
    case 22:
      n.mode & 1
        ? ((Ve = (r = Ve) || n.memoizedState !== null), cn(t, e, n), (Ve = r))
        : cn(t, e, n);
      break;
    default:
      cn(t, e, n);
  }
}
function Th(t) {
  var e = t.updateQueue;
  if (e !== null) {
    t.updateQueue = null;
    var n = t.stateNode;
    n === null && (n = t.stateNode = new o0()),
      e.forEach(function (r) {
        var s = g0.bind(null, t, r);
        n.has(r) || (n.add(r), r.then(s, s));
      });
  }
}
function xt(t, e) {
  var n = e.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var s = n[r];
      try {
        var i = t,
          o = e,
          l = o;
        e: for (; l !== null; ) {
          switch (l.tag) {
            case 5:
              (Fe = l.stateNode), (Tt = !1);
              break e;
            case 3:
              (Fe = l.stateNode.containerInfo), (Tt = !0);
              break e;
            case 4:
              (Fe = l.stateNode.containerInfo), (Tt = !0);
              break e;
          }
          l = l.return;
        }
        if (Fe === null) throw Error(I(160));
        $m(i, o, s), (Fe = null), (Tt = !1);
        var a = s.alternate;
        a !== null && (a.return = null), (s.return = null);
      } catch (c) {
        Ee(s, e, c);
      }
    }
  if (e.subtreeFlags & 12854)
    for (e = e.child; e !== null; ) Fm(e, t), (e = e.sibling);
}
function Fm(t, e) {
  var n = t.alternate,
    r = t.flags;
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((xt(e, t), Lt(t), r & 4)) {
        try {
          Ds(3, t, t.return), hl(3, t);
        } catch (w) {
          Ee(t, t.return, w);
        }
        try {
          Ds(5, t, t.return);
        } catch (w) {
          Ee(t, t.return, w);
        }
      }
      break;
    case 1:
      xt(e, t), Lt(t), r & 512 && n !== null && Rr(n, n.return);
      break;
    case 5:
      if (
        (xt(e, t),
        Lt(t),
        r & 512 && n !== null && Rr(n, n.return),
        t.flags & 32)
      ) {
        var s = t.stateNode;
        try {
          Ws(s, "");
        } catch (w) {
          Ee(t, t.return, w);
        }
      }
      if (r & 4 && ((s = t.stateNode), s != null)) {
        var i = t.memoizedProps,
          o = n !== null ? n.memoizedProps : i,
          l = t.type,
          a = t.updateQueue;
        if (((t.updateQueue = null), a !== null))
          try {
            l === "input" && i.type === "radio" && i.name != null && lp(s, i),
              Ma(l, o);
            var c = Ma(l, i);
            for (o = 0; o < a.length; o += 2) {
              var d = a[o],
                h = a[o + 1];
              d === "style"
                ? hp(s, h)
                : d === "dangerouslySetInnerHTML"
                ? up(s, h)
                : d === "children"
                ? Ws(s, h)
                : Vc(s, d, h, c);
            }
            switch (l) {
              case "input":
                Ia(s, i);
                break;
              case "textarea":
                ap(s, i);
                break;
              case "select":
                var f = s._wrapperState.wasMultiple;
                s._wrapperState.wasMultiple = !!i.multiple;
                var p = i.value;
                p != null
                  ? Or(s, !!i.multiple, p, !1)
                  : f !== !!i.multiple &&
                    (i.defaultValue != null
                      ? Or(s, !!i.multiple, i.defaultValue, !0)
                      : Or(s, !!i.multiple, i.multiple ? [] : "", !1));
            }
            s[Zs] = i;
          } catch (w) {
            Ee(t, t.return, w);
          }
      }
      break;
    case 6:
      if ((xt(e, t), Lt(t), r & 4)) {
        if (t.stateNode === null) throw Error(I(162));
        (s = t.stateNode), (i = t.memoizedProps);
        try {
          s.nodeValue = i;
        } catch (w) {
          Ee(t, t.return, w);
        }
      }
      break;
    case 3:
      if (
        (xt(e, t), Lt(t), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Ks(e.containerInfo);
        } catch (w) {
          Ee(t, t.return, w);
        }
      break;
    case 4:
      xt(e, t), Lt(t);
      break;
    case 13:
      xt(e, t),
        Lt(t),
        (s = t.child),
        s.flags & 8192 &&
          ((i = s.memoizedState !== null),
          (s.stateNode.isHidden = i),
          !i ||
            (s.alternate !== null && s.alternate.memoizedState !== null) ||
            (Nu = Te())),
        r & 4 && Th(t);
      break;
    case 22:
      if (
        ((d = n !== null && n.memoizedState !== null),
        t.mode & 1 ? ((Ve = (c = Ve) || d), xt(e, t), (Ve = c)) : xt(e, t),
        Lt(t),
        r & 8192)
      ) {
        if (
          ((c = t.memoizedState !== null),
          (t.stateNode.isHidden = c) && !d && t.mode & 1)
        )
          for (F = t, d = t.child; d !== null; ) {
            for (h = F = d; F !== null; ) {
              switch (((f = F), (p = f.child), f.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Ds(4, f, f.return);
                  break;
                case 1:
                  Rr(f, f.return);
                  var g = f.stateNode;
                  if (typeof g.componentWillUnmount == "function") {
                    (r = f), (n = f.return);
                    try {
                      (e = r),
                        (g.props = e.memoizedProps),
                        (g.state = e.memoizedState),
                        g.componentWillUnmount();
                    } catch (w) {
                      Ee(r, n, w);
                    }
                  }
                  break;
                case 5:
                  Rr(f, f.return);
                  break;
                case 22:
                  if (f.memoizedState !== null) {
                    Rh(h);
                    continue;
                  }
              }
              p !== null ? ((p.return = f), (F = p)) : Rh(h);
            }
            d = d.sibling;
          }
        e: for (d = null, h = t; ; ) {
          if (h.tag === 5) {
            if (d === null) {
              d = h;
              try {
                (s = h.stateNode),
                  c
                    ? ((i = s.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none"))
                    : ((l = h.stateNode),
                      (a = h.memoizedProps.style),
                      (o =
                        a != null && a.hasOwnProperty("display")
                          ? a.display
                          : null),
                      (l.style.display = dp("display", o)));
              } catch (w) {
                Ee(t, t.return, w);
              }
            }
          } else if (h.tag === 6) {
            if (d === null)
              try {
                h.stateNode.nodeValue = c ? "" : h.memoizedProps;
              } catch (w) {
                Ee(t, t.return, w);
              }
          } else if (
            ((h.tag !== 22 && h.tag !== 23) ||
              h.memoizedState === null ||
              h === t) &&
            h.child !== null
          ) {
            (h.child.return = h), (h = h.child);
            continue;
          }
          if (h === t) break e;
          for (; h.sibling === null; ) {
            if (h.return === null || h.return === t) break e;
            d === h && (d = null), (h = h.return);
          }
          d === h && (d = null), (h.sibling.return = h.return), (h = h.sibling);
        }
      }
      break;
    case 19:
      xt(e, t), Lt(t), r & 4 && Th(t);
      break;
    case 21:
      break;
    default:
      xt(e, t), Lt(t);
  }
}
function Lt(t) {
  var e = t.flags;
  if (e & 2) {
    try {
      e: {
        for (var n = t.return; n !== null; ) {
          if (Lm(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(I(160));
      }
      switch (r.tag) {
        case 5:
          var s = r.stateNode;
          r.flags & 32 && (Ws(s, ""), (r.flags &= -33));
          var i = Nh(t);
          dc(t, i, s);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            l = Nh(t);
          uc(t, l, o);
          break;
        default:
          throw Error(I(161));
      }
    } catch (a) {
      Ee(t, t.return, a);
    }
    t.flags &= -3;
  }
  e & 4096 && (t.flags &= -4097);
}
function a0(t, e, n) {
  (F = t), Um(t);
}
function Um(t, e, n) {
  for (var r = (t.mode & 1) !== 0; F !== null; ) {
    var s = F,
      i = s.child;
    if (s.tag === 22 && r) {
      var o = s.memoizedState !== null || Qi;
      if (!o) {
        var l = s.alternate,
          a = (l !== null && l.memoizedState !== null) || Ve;
        l = Qi;
        var c = Ve;
        if (((Qi = o), (Ve = a) && !c))
          for (F = s; F !== null; )
            (o = F),
              (a = o.child),
              o.tag === 22 && o.memoizedState !== null
                ? Ph(s)
                : a !== null
                ? ((a.return = o), (F = a))
                : Ph(s);
        for (; i !== null; ) (F = i), Um(i), (i = i.sibling);
        (F = s), (Qi = l), (Ve = c);
      }
      kh(t);
    } else
      s.subtreeFlags & 8772 && i !== null ? ((i.return = s), (F = i)) : kh(t);
  }
}
function kh(t) {
  for (; F !== null; ) {
    var e = F;
    if (e.flags & 8772) {
      var n = e.alternate;
      try {
        if (e.flags & 8772)
          switch (e.tag) {
            case 0:
            case 11:
            case 15:
              Ve || hl(5, e);
              break;
            case 1:
              var r = e.stateNode;
              if (e.flags & 4 && !Ve)
                if (n === null) r.componentDidMount();
                else {
                  var s =
                    e.elementType === e.type
                      ? n.memoizedProps
                      : Nt(e.type, n.memoizedProps);
                  r.componentDidUpdate(
                    s,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate
                  );
                }
              var i = e.updateQueue;
              i !== null && dh(e, i, r);
              break;
            case 3:
              var o = e.updateQueue;
              if (o !== null) {
                if (((n = null), e.child !== null))
                  switch (e.child.tag) {
                    case 5:
                      n = e.child.stateNode;
                      break;
                    case 1:
                      n = e.child.stateNode;
                  }
                dh(e, o, n);
              }
              break;
            case 5:
              var l = e.stateNode;
              if (n === null && e.flags & 4) {
                n = l;
                var a = e.memoizedProps;
                switch (e.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a.autoFocus && n.focus();
                    break;
                  case "img":
                    a.src && (n.src = a.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (e.memoizedState === null) {
                var c = e.alternate;
                if (c !== null) {
                  var d = c.memoizedState;
                  if (d !== null) {
                    var h = d.dehydrated;
                    h !== null && Ks(h);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(I(163));
          }
        Ve || (e.flags & 512 && cc(e));
      } catch (f) {
        Ee(e, e.return, f);
      }
    }
    if (e === t) {
      F = null;
      break;
    }
    if (((n = e.sibling), n !== null)) {
      (n.return = e.return), (F = n);
      break;
    }
    F = e.return;
  }
}
function Rh(t) {
  for (; F !== null; ) {
    var e = F;
    if (e === t) {
      F = null;
      break;
    }
    var n = e.sibling;
    if (n !== null) {
      (n.return = e.return), (F = n);
      break;
    }
    F = e.return;
  }
}
function Ph(t) {
  for (; F !== null; ) {
    var e = F;
    try {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          var n = e.return;
          try {
            hl(4, e);
          } catch (a) {
            Ee(e, n, a);
          }
          break;
        case 1:
          var r = e.stateNode;
          if (typeof r.componentDidMount == "function") {
            var s = e.return;
            try {
              r.componentDidMount();
            } catch (a) {
              Ee(e, s, a);
            }
          }
          var i = e.return;
          try {
            cc(e);
          } catch (a) {
            Ee(e, i, a);
          }
          break;
        case 5:
          var o = e.return;
          try {
            cc(e);
          } catch (a) {
            Ee(e, o, a);
          }
      }
    } catch (a) {
      Ee(e, e.return, a);
    }
    if (e === t) {
      F = null;
      break;
    }
    var l = e.sibling;
    if (l !== null) {
      (l.return = e.return), (F = l);
      break;
    }
    F = e.return;
  }
}
var c0 = Math.ceil,
  Ao = on.ReactCurrentDispatcher,
  Su = on.ReactCurrentOwner,
  wt = on.ReactCurrentBatchConfig,
  ee = 0,
  Le = null,
  ke = null,
  Be = 0,
  at = 0,
  Pr = Dn(0),
  Oe = 0,
  ii = null,
  er = 0,
  fl = 0,
  xu = 0,
  Ls = null,
  tt = null,
  Nu = 0,
  Yr = 1 / 0,
  Vt = null,
  jo = !1,
  hc = null,
  Sn = null,
  qi = !1,
  mn = null,
  Mo = 0,
  $s = 0,
  fc = null,
  uo = -1,
  ho = 0;
function qe() {
  return ee & 6 ? Te() : uo !== -1 ? uo : (uo = Te());
}
function xn(t) {
  return t.mode & 1
    ? ee & 2 && Be !== 0
      ? Be & -Be
      : V_.transition !== null
      ? (ho === 0 && (ho = xp()), ho)
      : ((t = re),
        t !== 0 || ((t = window.event), (t = t === void 0 ? 16 : Op(t.type))),
        t)
    : 1;
}
function Ot(t, e, n, r) {
  if (50 < $s) throw (($s = 0), (fc = null), Error(I(185)));
  wi(t, n, r),
    (!(ee & 2) || t !== Le) &&
      (t === Le && (!(ee & 2) && (fl |= n), Oe === 4 && fn(t, Be)),
      ot(t, r),
      n === 1 && ee === 0 && !(e.mode & 1) && ((Yr = Te() + 500), cl && Ln()));
}
function ot(t, e) {
  var n = t.callbackNode;
  Vv(t, e);
  var r = vo(t, t === Le ? Be : 0);
  if (r === 0)
    n !== null && $d(n), (t.callbackNode = null), (t.callbackPriority = 0);
  else if (((e = r & -r), t.callbackPriority !== e)) {
    if ((n != null && $d(n), e === 1))
      t.tag === 0 ? G_(Ih.bind(null, t)) : qp(Ih.bind(null, t)),
        B_(function () {
          !(ee & 6) && Ln();
        }),
        (n = null);
    else {
      switch (Np(r)) {
        case 1:
          n = Xc;
          break;
        case 4:
          n = Ep;
          break;
        case 16:
          n = yo;
          break;
        case 536870912:
          n = Sp;
          break;
        default:
          n = yo;
      }
      n = Km(n, Bm.bind(null, t));
    }
    (t.callbackPriority = e), (t.callbackNode = n);
  }
}
function Bm(t, e) {
  if (((uo = -1), (ho = 0), ee & 6)) throw Error(I(327));
  var n = t.callbackNode;
  if (Dr() && t.callbackNode !== n) return null;
  var r = vo(t, t === Le ? Be : 0);
  if (r === 0) return null;
  if (r & 30 || r & t.expiredLanes || e) e = Do(t, r);
  else {
    e = r;
    var s = ee;
    ee |= 2;
    var i = Hm();
    (Le !== t || Be !== e) && ((Vt = null), (Yr = Te() + 500), Yn(t, e));
    do
      try {
        h0();
        break;
      } catch (l) {
        zm(t, l);
      }
    while (1);
    uu(),
      (Ao.current = i),
      (ee = s),
      ke !== null ? (e = 0) : ((Le = null), (Be = 0), (e = Oe));
  }
  if (e !== 0) {
    if (
      (e === 2 && ((s = Ua(t)), s !== 0 && ((r = s), (e = pc(t, s)))), e === 1)
    )
      throw ((n = ii), Yn(t, 0), fn(t, r), ot(t, Te()), n);
    if (e === 6) fn(t, r);
    else {
      if (
        ((s = t.current.alternate),
        !(r & 30) &&
          !u0(s) &&
          ((e = Do(t, r)),
          e === 2 && ((i = Ua(t)), i !== 0 && ((r = i), (e = pc(t, i)))),
          e === 1))
      )
        throw ((n = ii), Yn(t, 0), fn(t, r), ot(t, Te()), n);
      switch (((t.finishedWork = s), (t.finishedLanes = r), e)) {
        case 0:
        case 1:
          throw Error(I(345));
        case 2:
          Fn(t, tt, Vt);
          break;
        case 3:
          if (
            (fn(t, r), (r & 130023424) === r && ((e = Nu + 500 - Te()), 10 < e))
          ) {
            if (vo(t, 0) !== 0) break;
            if (((s = t.suspendedLanes), (s & r) !== r)) {
              qe(), (t.pingedLanes |= t.suspendedLanes & s);
              break;
            }
            t.timeoutHandle = Ka(Fn.bind(null, t, tt, Vt), e);
            break;
          }
          Fn(t, tt, Vt);
          break;
        case 4:
          if ((fn(t, r), (r & 4194240) === r)) break;
          for (e = t.eventTimes, s = -1; 0 < r; ) {
            var o = 31 - It(r);
            (i = 1 << o), (o = e[o]), o > s && (s = o), (r &= ~i);
          }
          if (
            ((r = s),
            (r = Te() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                ? 480
                : 1080 > r
                ? 1080
                : 1920 > r
                ? 1920
                : 3e3 > r
                ? 3e3
                : 4320 > r
                ? 4320
                : 1960 * c0(r / 1960)) - r),
            10 < r)
          ) {
            t.timeoutHandle = Ka(Fn.bind(null, t, tt, Vt), r);
            break;
          }
          Fn(t, tt, Vt);
          break;
        case 5:
          Fn(t, tt, Vt);
          break;
        default:
          throw Error(I(329));
      }
    }
  }
  return ot(t, Te()), t.callbackNode === n ? Bm.bind(null, t) : null;
}
function pc(t, e) {
  var n = Ls;
  return (
    t.current.memoizedState.isDehydrated && (Yn(t, e).flags |= 256),
    (t = Do(t, e)),
    t !== 2 && ((e = tt), (tt = n), e !== null && mc(e)),
    t
  );
}
function mc(t) {
  tt === null ? (tt = t) : tt.push.apply(tt, t);
}
function u0(t) {
  for (var e = t; ; ) {
    if (e.flags & 16384) {
      var n = e.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var s = n[r],
            i = s.getSnapshot;
          s = s.value;
          try {
            if (!At(i(), s)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = e.child), e.subtreeFlags & 16384 && n !== null))
      (n.return = e), (e = n);
    else {
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return !0;
        e = e.return;
      }
      (e.sibling.return = e.return), (e = e.sibling);
    }
  }
  return !0;
}
function fn(t, e) {
  for (
    e &= ~xu,
      e &= ~fl,
      t.suspendedLanes |= e,
      t.pingedLanes &= ~e,
      t = t.expirationTimes;
    0 < e;

  ) {
    var n = 31 - It(e),
      r = 1 << n;
    (t[n] = -1), (e &= ~r);
  }
}
function Ih(t) {
  if (ee & 6) throw Error(I(327));
  Dr();
  var e = vo(t, 0);
  if (!(e & 1)) return ot(t, Te()), null;
  var n = Do(t, e);
  if (t.tag !== 0 && n === 2) {
    var r = Ua(t);
    r !== 0 && ((e = r), (n = pc(t, r)));
  }
  if (n === 1) throw ((n = ii), Yn(t, 0), fn(t, e), ot(t, Te()), n);
  if (n === 6) throw Error(I(345));
  return (
    (t.finishedWork = t.current.alternate),
    (t.finishedLanes = e),
    Fn(t, tt, Vt),
    ot(t, Te()),
    null
  );
}
function Tu(t, e) {
  var n = ee;
  ee |= 1;
  try {
    return t(e);
  } finally {
    (ee = n), ee === 0 && ((Yr = Te() + 500), cl && Ln());
  }
}
function tr(t) {
  mn !== null && mn.tag === 0 && !(ee & 6) && Dr();
  var e = ee;
  ee |= 1;
  var n = wt.transition,
    r = re;
  try {
    if (((wt.transition = null), (re = 1), t)) return t();
  } finally {
    (re = r), (wt.transition = n), (ee = e), !(ee & 6) && Ln();
  }
}
function ku() {
  (at = Pr.current), pe(Pr);
}
function Yn(t, e) {
  (t.finishedWork = null), (t.finishedLanes = 0);
  var n = t.timeoutHandle;
  if ((n !== -1 && ((t.timeoutHandle = -1), U_(n)), ke !== null))
    for (n = ke.return; n !== null; ) {
      var r = n;
      switch ((lu(r), r.tag)) {
        case 1:
          (r = r.type.childContextTypes), r != null && So();
          break;
        case 3:
          Gr(), pe(st), pe(Ye), gu();
          break;
        case 5:
          mu(r);
          break;
        case 4:
          Gr();
          break;
        case 13:
          pe(ve);
          break;
        case 19:
          pe(ve);
          break;
        case 10:
          du(r.type._context);
          break;
        case 22:
        case 23:
          ku();
      }
      n = n.return;
    }
  if (
    ((Le = t),
    (ke = t = Nn(t.current, null)),
    (Be = at = e),
    (Oe = 0),
    (ii = null),
    (xu = fl = er = 0),
    (tt = Ls = null),
    Wn !== null)
  ) {
    for (e = 0; e < Wn.length; e++)
      if (((n = Wn[e]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var s = r.next,
          i = n.pending;
        if (i !== null) {
          var o = i.next;
          (i.next = s), (r.next = o);
        }
        n.pending = r;
      }
    Wn = null;
  }
  return t;
}
function zm(t, e) {
  do {
    var n = ke;
    try {
      if ((uu(), (lo.current = bo), Oo)) {
        for (var r = _e.memoizedState; r !== null; ) {
          var s = r.queue;
          s !== null && (s.pending = null), (r = r.next);
        }
        Oo = !1;
      }
      if (
        ((Zn = 0),
        (Me = Re = _e = null),
        (Ms = !1),
        (ni = 0),
        (Su.current = null),
        n === null || n.return === null)
      ) {
        (Oe = 1), (ii = e), (ke = null);
        break;
      }
      e: {
        var i = t,
          o = n.return,
          l = n,
          a = e;
        if (
          ((e = Be),
          (l.flags |= 32768),
          a !== null && typeof a == "object" && typeof a.then == "function")
        ) {
          var c = a,
            d = l,
            h = d.tag;
          if (!(d.mode & 1) && (h === 0 || h === 11 || h === 15)) {
            var f = d.alternate;
            f
              ? ((d.updateQueue = f.updateQueue),
                (d.memoizedState = f.memoizedState),
                (d.lanes = f.lanes))
              : ((d.updateQueue = null), (d.memoizedState = null));
          }
          var p = yh(o);
          if (p !== null) {
            (p.flags &= -257),
              vh(p, o, l, i, e),
              p.mode & 1 && gh(i, c, e),
              (e = p),
              (a = c);
            var g = e.updateQueue;
            if (g === null) {
              var w = new Set();
              w.add(a), (e.updateQueue = w);
            } else g.add(a);
            break e;
          } else {
            if (!(e & 1)) {
              gh(i, c, e), Ru();
              break e;
            }
            a = Error(I(426));
          }
        } else if (ge && l.mode & 1) {
          var E = yh(o);
          if (E !== null) {
            !(E.flags & 65536) && (E.flags |= 256),
              vh(E, o, l, i, e),
              au(Vr(a, l));
            break e;
          }
        }
        (i = a = Vr(a, l)),
          Oe !== 4 && (Oe = 2),
          Ls === null ? (Ls = [i]) : Ls.push(i),
          (i = o);
        do {
          switch (i.tag) {
            case 3:
              (i.flags |= 65536), (e &= -e), (i.lanes |= e);
              var y = Nm(i, a, e);
              uh(i, y);
              break e;
            case 1:
              l = a;
              var m = i.type,
                v = i.stateNode;
              if (
                !(i.flags & 128) &&
                (typeof m.getDerivedStateFromError == "function" ||
                  (v !== null &&
                    typeof v.componentDidCatch == "function" &&
                    (Sn === null || !Sn.has(v))))
              ) {
                (i.flags |= 65536), (e &= -e), (i.lanes |= e);
                var _ = Tm(i, l, e);
                uh(i, _);
                break e;
              }
          }
          i = i.return;
        } while (i !== null);
      }
      Gm(n);
    } catch (C) {
      (e = C), ke === n && n !== null && (ke = n = n.return);
      continue;
    }
    break;
  } while (1);
}
function Hm() {
  var t = Ao.current;
  return (Ao.current = bo), t === null ? bo : t;
}
function Ru() {
  (Oe === 0 || Oe === 3 || Oe === 2) && (Oe = 4),
    Le === null || (!(er & 268435455) && !(fl & 268435455)) || fn(Le, Be);
}
function Do(t, e) {
  var n = ee;
  ee |= 2;
  var r = Hm();
  (Le !== t || Be !== e) && ((Vt = null), Yn(t, e));
  do
    try {
      d0();
      break;
    } catch (s) {
      zm(t, s);
    }
  while (1);
  if ((uu(), (ee = n), (Ao.current = r), ke !== null)) throw Error(I(261));
  return (Le = null), (Be = 0), Oe;
}
function d0() {
  for (; ke !== null; ) Wm(ke);
}
function h0() {
  for (; ke !== null && !Lv(); ) Wm(ke);
}
function Wm(t) {
  var e = Ym(t.alternate, t, at);
  (t.memoizedProps = t.pendingProps),
    e === null ? Gm(t) : (ke = e),
    (Su.current = null);
}
function Gm(t) {
  var e = t;
  do {
    var n = e.alternate;
    if (((t = e.return), e.flags & 32768)) {
      if (((n = i0(n, e)), n !== null)) {
        (n.flags &= 32767), (ke = n);
        return;
      }
      if (t !== null)
        (t.flags |= 32768), (t.subtreeFlags = 0), (t.deletions = null);
      else {
        (Oe = 6), (ke = null);
        return;
      }
    } else if (((n = s0(n, e, at)), n !== null)) {
      ke = n;
      return;
    }
    if (((e = e.sibling), e !== null)) {
      ke = e;
      return;
    }
    ke = e = t;
  } while (e !== null);
  Oe === 0 && (Oe = 5);
}
function Fn(t, e, n) {
  var r = re,
    s = wt.transition;
  try {
    (wt.transition = null), (re = 1), f0(t, e, n, r);
  } finally {
    (wt.transition = s), (re = r);
  }
  return null;
}
function f0(t, e, n, r) {
  do Dr();
  while (mn !== null);
  if (ee & 6) throw Error(I(327));
  n = t.finishedWork;
  var s = t.finishedLanes;
  if (n === null) return null;
  if (((t.finishedWork = null), (t.finishedLanes = 0), n === t.current))
    throw Error(I(177));
  (t.callbackNode = null), (t.callbackPriority = 0);
  var i = n.lanes | n.childLanes;
  if (
    (Yv(t, i),
    t === Le && ((ke = Le = null), (Be = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      qi ||
      ((qi = !0),
      Km(yo, function () {
        return Dr(), null;
      })),
    (i = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || i)
  ) {
    (i = wt.transition), (wt.transition = null);
    var o = re;
    re = 1;
    var l = ee;
    (ee |= 4),
      (Su.current = null),
      l0(t, n),
      Fm(n, t),
      A_(Va),
      (_o = !!Ga),
      (Va = Ga = null),
      (t.current = n),
      a0(n),
      $v(),
      (ee = l),
      (re = o),
      (wt.transition = i);
  } else t.current = n;
  if (
    (qi && ((qi = !1), (mn = t), (Mo = s)),
    (i = t.pendingLanes),
    i === 0 && (Sn = null),
    Bv(n.stateNode),
    ot(t, Te()),
    e !== null)
  )
    for (r = t.onRecoverableError, n = 0; n < e.length; n++)
      (s = e[n]), r(s.value, { componentStack: s.stack, digest: s.digest });
  if (jo) throw ((jo = !1), (t = hc), (hc = null), t);
  return (
    Mo & 1 && t.tag !== 0 && Dr(),
    (i = t.pendingLanes),
    i & 1 ? (t === fc ? $s++ : (($s = 0), (fc = t))) : ($s = 0),
    Ln(),
    null
  );
}
function Dr() {
  if (mn !== null) {
    var t = Np(Mo),
      e = wt.transition,
      n = re;
    try {
      if (((wt.transition = null), (re = 16 > t ? 16 : t), mn === null))
        var r = !1;
      else {
        if (((t = mn), (mn = null), (Mo = 0), ee & 6)) throw Error(I(331));
        var s = ee;
        for (ee |= 4, F = t.current; F !== null; ) {
          var i = F,
            o = i.child;
          if (F.flags & 16) {
            var l = i.deletions;
            if (l !== null) {
              for (var a = 0; a < l.length; a++) {
                var c = l[a];
                for (F = c; F !== null; ) {
                  var d = F;
                  switch (d.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ds(8, d, i);
                  }
                  var h = d.child;
                  if (h !== null) (h.return = d), (F = h);
                  else
                    for (; F !== null; ) {
                      d = F;
                      var f = d.sibling,
                        p = d.return;
                      if ((Dm(d), d === c)) {
                        F = null;
                        break;
                      }
                      if (f !== null) {
                        (f.return = p), (F = f);
                        break;
                      }
                      F = p;
                    }
                }
              }
              var g = i.alternate;
              if (g !== null) {
                var w = g.child;
                if (w !== null) {
                  g.child = null;
                  do {
                    var E = w.sibling;
                    (w.sibling = null), (w = E);
                  } while (w !== null);
                }
              }
              F = i;
            }
          }
          if (i.subtreeFlags & 2064 && o !== null) (o.return = i), (F = o);
          else
            e: for (; F !== null; ) {
              if (((i = F), i.flags & 2048))
                switch (i.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Ds(9, i, i.return);
                }
              var y = i.sibling;
              if (y !== null) {
                (y.return = i.return), (F = y);
                break e;
              }
              F = i.return;
            }
        }
        var m = t.current;
        for (F = m; F !== null; ) {
          o = F;
          var v = o.child;
          if (o.subtreeFlags & 2064 && v !== null) (v.return = o), (F = v);
          else
            e: for (o = m; F !== null; ) {
              if (((l = F), l.flags & 2048))
                try {
                  switch (l.tag) {
                    case 0:
                    case 11:
                    case 15:
                      hl(9, l);
                  }
                } catch (C) {
                  Ee(l, l.return, C);
                }
              if (l === o) {
                F = null;
                break e;
              }
              var _ = l.sibling;
              if (_ !== null) {
                (_.return = l.return), (F = _);
                break e;
              }
              F = l.return;
            }
        }
        if (
          ((ee = s), Ln(), Ut && typeof Ut.onPostCommitFiberRoot == "function")
        )
          try {
            Ut.onPostCommitFiberRoot(sl, t);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (re = n), (wt.transition = e);
    }
  }
  return !1;
}
function Oh(t, e, n) {
  (e = Vr(n, e)),
    (e = Nm(t, e, 1)),
    (t = En(t, e, 1)),
    (e = qe()),
    t !== null && (wi(t, 1, e), ot(t, e));
}
function Ee(t, e, n) {
  if (t.tag === 3) Oh(t, t, n);
  else
    for (; e !== null; ) {
      if (e.tag === 3) {
        Oh(e, t, n);
        break;
      } else if (e.tag === 1) {
        var r = e.stateNode;
        if (
          typeof e.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (Sn === null || !Sn.has(r)))
        ) {
          (t = Vr(n, t)),
            (t = Tm(e, t, 1)),
            (e = En(e, t, 1)),
            (t = qe()),
            e !== null && (wi(e, 1, t), ot(e, t));
          break;
        }
      }
      e = e.return;
    }
}
function p0(t, e, n) {
  var r = t.pingCache;
  r !== null && r.delete(e),
    (e = qe()),
    (t.pingedLanes |= t.suspendedLanes & n),
    Le === t &&
      (Be & n) === n &&
      (Oe === 4 || (Oe === 3 && (Be & 130023424) === Be && 500 > Te() - Nu)
        ? Yn(t, 0)
        : (xu |= n)),
    ot(t, e);
}
function Vm(t, e) {
  e === 0 &&
    (t.mode & 1
      ? ((e = Ui), (Ui <<= 1), !(Ui & 130023424) && (Ui = 4194304))
      : (e = 1));
  var n = qe();
  (t = nn(t, e)), t !== null && (wi(t, e, n), ot(t, n));
}
function m0(t) {
  var e = t.memoizedState,
    n = 0;
  e !== null && (n = e.retryLane), Vm(t, n);
}
function g0(t, e) {
  var n = 0;
  switch (t.tag) {
    case 13:
      var r = t.stateNode,
        s = t.memoizedState;
      s !== null && (n = s.retryLane);
      break;
    case 19:
      r = t.stateNode;
      break;
    default:
      throw Error(I(314));
  }
  r !== null && r.delete(e), Vm(t, n);
}
var Ym;
Ym = function (t, e, n) {
  if (t !== null)
    if (t.memoizedProps !== e.pendingProps || st.current) nt = !0;
    else {
      if (!(t.lanes & n) && !(e.flags & 128)) return (nt = !1), r0(t, e, n);
      nt = !!(t.flags & 131072);
    }
  else (nt = !1), ge && e.flags & 1048576 && Xp(e, To, e.index);
  switch (((e.lanes = 0), e.tag)) {
    case 2:
      var r = e.type;
      co(t, e), (t = e.pendingProps);
      var s = zr(e, Ye.current);
      Mr(e, n), (s = vu(null, e, r, t, s, n));
      var i = _u();
      return (
        (e.flags |= 1),
        typeof s == "object" &&
        s !== null &&
        typeof s.render == "function" &&
        s.$$typeof === void 0
          ? ((e.tag = 1),
            (e.memoizedState = null),
            (e.updateQueue = null),
            it(r) ? ((i = !0), xo(e)) : (i = !1),
            (e.memoizedState =
              s.state !== null && s.state !== void 0 ? s.state : null),
            fu(e),
            (s.updater = dl),
            (e.stateNode = s),
            (s._reactInternals = e),
            tc(e, r, t, n),
            (e = sc(null, e, r, !0, i, n)))
          : ((e.tag = 0), ge && i && ou(e), Ke(null, e, s, n), (e = e.child)),
        e
      );
    case 16:
      r = e.elementType;
      e: {
        switch (
          (co(t, e),
          (t = e.pendingProps),
          (s = r._init),
          (r = s(r._payload)),
          (e.type = r),
          (s = e.tag = v0(r)),
          (t = Nt(r, t)),
          s)
        ) {
          case 0:
            e = rc(null, e, r, t, n);
            break e;
          case 1:
            e = Ch(null, e, r, t, n);
            break e;
          case 11:
            e = _h(null, e, r, t, n);
            break e;
          case 14:
            e = wh(null, e, r, Nt(r.type, t), n);
            break e;
        }
        throw Error(I(306, r, ""));
      }
      return e;
    case 0:
      return (
        (r = e.type),
        (s = e.pendingProps),
        (s = e.elementType === r ? s : Nt(r, s)),
        rc(t, e, r, s, n)
      );
    case 1:
      return (
        (r = e.type),
        (s = e.pendingProps),
        (s = e.elementType === r ? s : Nt(r, s)),
        Ch(t, e, r, s, n)
      );
    case 3:
      e: {
        if ((Im(e), t === null)) throw Error(I(387));
        (r = e.pendingProps),
          (i = e.memoizedState),
          (s = i.element),
          rm(t, e),
          Po(e, r, null, n);
        var o = e.memoizedState;
        if (((r = o.element), i.isDehydrated))
          if (
            ((i = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (e.updateQueue.baseState = i),
            (e.memoizedState = i),
            e.flags & 256)
          ) {
            (s = Vr(Error(I(423)), e)), (e = Eh(t, e, r, n, s));
            break e;
          } else if (r !== s) {
            (s = Vr(Error(I(424)), e)), (e = Eh(t, e, r, n, s));
            break e;
          } else
            for (
              ct = Cn(e.stateNode.containerInfo.firstChild),
                ut = e,
                ge = !0,
                kt = null,
                n = tm(e, null, r, n),
                e.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling);
        else {
          if ((Hr(), r === s)) {
            e = rn(t, e, n);
            break e;
          }
          Ke(t, e, r, n);
        }
        e = e.child;
      }
      return e;
    case 5:
      return (
        sm(e),
        t === null && Ja(e),
        (r = e.type),
        (s = e.pendingProps),
        (i = t !== null ? t.memoizedProps : null),
        (o = s.children),
        Ya(r, s) ? (o = null) : i !== null && Ya(r, i) && (e.flags |= 32),
        Pm(t, e),
        Ke(t, e, o, n),
        e.child
      );
    case 6:
      return t === null && Ja(e), null;
    case 13:
      return Om(t, e, n);
    case 4:
      return (
        pu(e, e.stateNode.containerInfo),
        (r = e.pendingProps),
        t === null ? (e.child = Wr(e, null, r, n)) : Ke(t, e, r, n),
        e.child
      );
    case 11:
      return (
        (r = e.type),
        (s = e.pendingProps),
        (s = e.elementType === r ? s : Nt(r, s)),
        _h(t, e, r, s, n)
      );
    case 7:
      return Ke(t, e, e.pendingProps, n), e.child;
    case 8:
      return Ke(t, e, e.pendingProps.children, n), e.child;
    case 12:
      return Ke(t, e, e.pendingProps.children, n), e.child;
    case 10:
      e: {
        if (
          ((r = e.type._context),
          (s = e.pendingProps),
          (i = e.memoizedProps),
          (o = s.value),
          ue(ko, r._currentValue),
          (r._currentValue = o),
          i !== null)
        )
          if (At(i.value, o)) {
            if (i.children === s.children && !st.current) {
              e = rn(t, e, n);
              break e;
            }
          } else
            for (i = e.child, i !== null && (i.return = e); i !== null; ) {
              var l = i.dependencies;
              if (l !== null) {
                o = i.child;
                for (var a = l.firstContext; a !== null; ) {
                  if (a.context === r) {
                    if (i.tag === 1) {
                      (a = Jt(-1, n & -n)), (a.tag = 2);
                      var c = i.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var d = c.pending;
                        d === null
                          ? (a.next = a)
                          : ((a.next = d.next), (d.next = a)),
                          (c.pending = a);
                      }
                    }
                    (i.lanes |= n),
                      (a = i.alternate),
                      a !== null && (a.lanes |= n),
                      Za(i.return, n, e),
                      (l.lanes |= n);
                    break;
                  }
                  a = a.next;
                }
              } else if (i.tag === 10) o = i.type === e.type ? null : i.child;
              else if (i.tag === 18) {
                if (((o = i.return), o === null)) throw Error(I(341));
                (o.lanes |= n),
                  (l = o.alternate),
                  l !== null && (l.lanes |= n),
                  Za(o, n, e),
                  (o = i.sibling);
              } else o = i.child;
              if (o !== null) o.return = i;
              else
                for (o = i; o !== null; ) {
                  if (o === e) {
                    o = null;
                    break;
                  }
                  if (((i = o.sibling), i !== null)) {
                    (i.return = o.return), (o = i);
                    break;
                  }
                  o = o.return;
                }
              i = o;
            }
        Ke(t, e, s.children, n), (e = e.child);
      }
      return e;
    case 9:
      return (
        (s = e.type),
        (r = e.pendingProps.children),
        Mr(e, n),
        (s = Ct(s)),
        (r = r(s)),
        (e.flags |= 1),
        Ke(t, e, r, n),
        e.child
      );
    case 14:
      return (
        (r = e.type),
        (s = Nt(r, e.pendingProps)),
        (s = Nt(r.type, s)),
        wh(t, e, r, s, n)
      );
    case 15:
      return km(t, e, e.type, e.pendingProps, n);
    case 17:
      return (
        (r = e.type),
        (s = e.pendingProps),
        (s = e.elementType === r ? s : Nt(r, s)),
        co(t, e),
        (e.tag = 1),
        it(r) ? ((t = !0), xo(e)) : (t = !1),
        Mr(e, n),
        xm(e, r, s),
        tc(e, r, s, n),
        sc(null, e, r, !0, t, n)
      );
    case 19:
      return bm(t, e, n);
    case 22:
      return Rm(t, e, n);
  }
  throw Error(I(156, e.tag));
};
function Km(t, e) {
  return Cp(t, e);
}
function y0(t, e, n, r) {
  (this.tag = t),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = e),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null);
}
function vt(t, e, n, r) {
  return new y0(t, e, n, r);
}
function Pu(t) {
  return (t = t.prototype), !(!t || !t.isReactComponent);
}
function v0(t) {
  if (typeof t == "function") return Pu(t) ? 1 : 0;
  if (t != null) {
    if (((t = t.$$typeof), t === Kc)) return 11;
    if (t === Qc) return 14;
  }
  return 2;
}
function Nn(t, e) {
  var n = t.alternate;
  return (
    n === null
      ? ((n = vt(t.tag, e, t.key, t.mode)),
        (n.elementType = t.elementType),
        (n.type = t.type),
        (n.stateNode = t.stateNode),
        (n.alternate = t),
        (t.alternate = n))
      : ((n.pendingProps = e),
        (n.type = t.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = t.flags & 14680064),
    (n.childLanes = t.childLanes),
    (n.lanes = t.lanes),
    (n.child = t.child),
    (n.memoizedProps = t.memoizedProps),
    (n.memoizedState = t.memoizedState),
    (n.updateQueue = t.updateQueue),
    (e = t.dependencies),
    (n.dependencies =
      e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
    (n.sibling = t.sibling),
    (n.index = t.index),
    (n.ref = t.ref),
    n
  );
}
function fo(t, e, n, r, s, i) {
  var o = 2;
  if (((r = t), typeof t == "function")) Pu(t) && (o = 1);
  else if (typeof t == "string") o = 5;
  else
    e: switch (t) {
      case _r:
        return Kn(n.children, s, i, e);
      case Yc:
        (o = 8), (s |= 8);
        break;
      case Na:
        return (
          (t = vt(12, n, e, s | 2)), (t.elementType = Na), (t.lanes = i), t
        );
      case Ta:
        return (t = vt(13, n, e, s)), (t.elementType = Ta), (t.lanes = i), t;
      case ka:
        return (t = vt(19, n, e, s)), (t.elementType = ka), (t.lanes = i), t;
      case sp:
        return pl(n, s, i, e);
      default:
        if (typeof t == "object" && t !== null)
          switch (t.$$typeof) {
            case np:
              o = 10;
              break e;
            case rp:
              o = 9;
              break e;
            case Kc:
              o = 11;
              break e;
            case Qc:
              o = 14;
              break e;
            case un:
              (o = 16), (r = null);
              break e;
          }
        throw Error(I(130, t == null ? t : typeof t, ""));
    }
  return (
    (e = vt(o, n, e, s)), (e.elementType = t), (e.type = r), (e.lanes = i), e
  );
}
function Kn(t, e, n, r) {
  return (t = vt(7, t, r, e)), (t.lanes = n), t;
}
function pl(t, e, n, r) {
  return (
    (t = vt(22, t, r, e)),
    (t.elementType = sp),
    (t.lanes = n),
    (t.stateNode = { isHidden: !1 }),
    t
  );
}
function ca(t, e, n) {
  return (t = vt(6, t, null, e)), (t.lanes = n), t;
}
function ua(t, e, n) {
  return (
    (e = vt(4, t.children !== null ? t.children : [], t.key, e)),
    (e.lanes = n),
    (e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation,
    }),
    e
  );
}
function _0(t, e, n, r, s) {
  (this.tag = e),
    (this.containerInfo = t),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Wl(0)),
    (this.expirationTimes = Wl(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Wl(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = s),
    (this.mutableSourceEagerHydrationData = null);
}
function Iu(t, e, n, r, s, i, o, l, a) {
  return (
    (t = new _0(t, e, n, l, a)),
    e === 1 ? ((e = 1), i === !0 && (e |= 8)) : (e = 0),
    (i = vt(3, null, null, e)),
    (t.current = i),
    (i.stateNode = t),
    (i.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    fu(i),
    t
  );
}
function w0(t, e, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: vr,
    key: r == null ? null : "" + r,
    children: t,
    containerInfo: e,
    implementation: n,
  };
}
function Qm(t) {
  if (!t) return On;
  t = t._reactInternals;
  e: {
    if (lr(t) !== t || t.tag !== 1) throw Error(I(170));
    var e = t;
    do {
      switch (e.tag) {
        case 3:
          e = e.stateNode.context;
          break e;
        case 1:
          if (it(e.type)) {
            e = e.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      e = e.return;
    } while (e !== null);
    throw Error(I(171));
  }
  if (t.tag === 1) {
    var n = t.type;
    if (it(n)) return Qp(t, n, e);
  }
  return e;
}
function qm(t, e, n, r, s, i, o, l, a) {
  return (
    (t = Iu(n, r, !0, t, s, i, o, l, a)),
    (t.context = Qm(null)),
    (n = t.current),
    (r = qe()),
    (s = xn(n)),
    (i = Jt(r, s)),
    (i.callback = e ?? null),
    En(n, i, s),
    (t.current.lanes = s),
    wi(t, s, r),
    ot(t, r),
    t
  );
}
function ml(t, e, n, r) {
  var s = e.current,
    i = qe(),
    o = xn(s);
  return (
    (n = Qm(n)),
    e.context === null ? (e.context = n) : (e.pendingContext = n),
    (e = Jt(i, o)),
    (e.payload = { element: t }),
    (r = r === void 0 ? null : r),
    r !== null && (e.callback = r),
    (t = En(s, e, o)),
    t !== null && (Ot(t, s, o, i), oo(t, s, o)),
    o
  );
}
function Lo(t) {
  if (((t = t.current), !t.child)) return null;
  switch (t.child.tag) {
    case 5:
      return t.child.stateNode;
    default:
      return t.child.stateNode;
  }
}
function bh(t, e) {
  if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
    var n = t.retryLane;
    t.retryLane = n !== 0 && n < e ? n : e;
  }
}
function Ou(t, e) {
  bh(t, e), (t = t.alternate) && bh(t, e);
}
function C0() {
  return null;
}
var Xm =
  typeof reportError == "function"
    ? reportError
    : function (t) {
        console.error(t);
      };
function bu(t) {
  this._internalRoot = t;
}
gl.prototype.render = bu.prototype.render = function (t) {
  var e = this._internalRoot;
  if (e === null) throw Error(I(409));
  ml(t, e, null, null);
};
gl.prototype.unmount = bu.prototype.unmount = function () {
  var t = this._internalRoot;
  if (t !== null) {
    this._internalRoot = null;
    var e = t.containerInfo;
    tr(function () {
      ml(null, t, null, null);
    }),
      (e[tn] = null);
  }
};
function gl(t) {
  this._internalRoot = t;
}
gl.prototype.unstable_scheduleHydration = function (t) {
  if (t) {
    var e = Rp();
    t = { blockedOn: null, target: t, priority: e };
    for (var n = 0; n < hn.length && e !== 0 && e < hn[n].priority; n++);
    hn.splice(n, 0, t), n === 0 && Ip(t);
  }
};
function Au(t) {
  return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
}
function yl(t) {
  return !(
    !t ||
    (t.nodeType !== 1 &&
      t.nodeType !== 9 &&
      t.nodeType !== 11 &&
      (t.nodeType !== 8 || t.nodeValue !== " react-mount-point-unstable "))
  );
}
function Ah() {}
function E0(t, e, n, r, s) {
  if (s) {
    if (typeof r == "function") {
      var i = r;
      r = function () {
        var c = Lo(o);
        i.call(c);
      };
    }
    var o = qm(e, r, t, 0, null, !1, !1, "", Ah);
    return (
      (t._reactRootContainer = o),
      (t[tn] = o.current),
      Xs(t.nodeType === 8 ? t.parentNode : t),
      tr(),
      o
    );
  }
  for (; (s = t.lastChild); ) t.removeChild(s);
  if (typeof r == "function") {
    var l = r;
    r = function () {
      var c = Lo(a);
      l.call(c);
    };
  }
  var a = Iu(t, 0, !1, null, null, !1, !1, "", Ah);
  return (
    (t._reactRootContainer = a),
    (t[tn] = a.current),
    Xs(t.nodeType === 8 ? t.parentNode : t),
    tr(function () {
      ml(e, a, n, r);
    }),
    a
  );
}
function vl(t, e, n, r, s) {
  var i = n._reactRootContainer;
  if (i) {
    var o = i;
    if (typeof s == "function") {
      var l = s;
      s = function () {
        var a = Lo(o);
        l.call(a);
      };
    }
    ml(e, o, t, s);
  } else o = E0(n, e, t, s, r);
  return Lo(o);
}
Tp = function (t) {
  switch (t.tag) {
    case 3:
      var e = t.stateNode;
      if (e.current.memoizedState.isDehydrated) {
        var n = Rs(e.pendingLanes);
        n !== 0 &&
          (Jc(e, n | 1), ot(e, Te()), !(ee & 6) && ((Yr = Te() + 500), Ln()));
      }
      break;
    case 13:
      tr(function () {
        var r = nn(t, 1);
        if (r !== null) {
          var s = qe();
          Ot(r, t, 1, s);
        }
      }),
        Ou(t, 1);
  }
};
Zc = function (t) {
  if (t.tag === 13) {
    var e = nn(t, 134217728);
    if (e !== null) {
      var n = qe();
      Ot(e, t, 134217728, n);
    }
    Ou(t, 134217728);
  }
};
kp = function (t) {
  if (t.tag === 13) {
    var e = xn(t),
      n = nn(t, e);
    if (n !== null) {
      var r = qe();
      Ot(n, t, e, r);
    }
    Ou(t, e);
  }
};
Rp = function () {
  return re;
};
Pp = function (t, e) {
  var n = re;
  try {
    return (re = t), e();
  } finally {
    re = n;
  }
};
La = function (t, e, n) {
  switch (e) {
    case "input":
      if ((Ia(t, n), (e = n.name), n.type === "radio" && e != null)) {
        for (n = t; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + e) + '][type="radio"]'
          ),
            e = 0;
          e < n.length;
          e++
        ) {
          var r = n[e];
          if (r !== t && r.form === t.form) {
            var s = al(r);
            if (!s) throw Error(I(90));
            op(r), Ia(r, s);
          }
        }
      }
      break;
    case "textarea":
      ap(t, n);
      break;
    case "select":
      (e = n.value), e != null && Or(t, !!n.multiple, e, !1);
  }
};
mp = Tu;
gp = tr;
var S0 = { usingClientEntryPoint: !1, Events: [Ei, Sr, al, fp, pp, Tu] },
  Cs = {
    findFiberByHostInstance: Hn,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  x0 = {
    bundleType: Cs.bundleType,
    version: Cs.version,
    rendererPackageName: Cs.rendererPackageName,
    rendererConfig: Cs.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: on.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (t) {
      return (t = _p(t)), t === null ? null : t.stateNode;
    },
    findFiberByHostInstance: Cs.findFiberByHostInstance || C0,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Xi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Xi.isDisabled && Xi.supportsFiber)
    try {
      (sl = Xi.inject(x0)), (Ut = Xi);
    } catch {}
}
ft.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = S0;
ft.createPortal = function (t, e) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Au(e)) throw Error(I(200));
  return w0(t, e, null, n);
};
ft.createRoot = function (t, e) {
  if (!Au(t)) throw Error(I(299));
  var n = !1,
    r = "",
    s = Xm;
  return (
    e != null &&
      (e.unstable_strictMode === !0 && (n = !0),
      e.identifierPrefix !== void 0 && (r = e.identifierPrefix),
      e.onRecoverableError !== void 0 && (s = e.onRecoverableError)),
    (e = Iu(t, 1, !1, null, null, n, !1, r, s)),
    (t[tn] = e.current),
    Xs(t.nodeType === 8 ? t.parentNode : t),
    new bu(e)
  );
};
ft.findDOMNode = function (t) {
  if (t == null) return null;
  if (t.nodeType === 1) return t;
  var e = t._reactInternals;
  if (e === void 0)
    throw typeof t.render == "function"
      ? Error(I(188))
      : ((t = Object.keys(t).join(",")), Error(I(268, t)));
  return (t = _p(e)), (t = t === null ? null : t.stateNode), t;
};
ft.flushSync = function (t) {
  return tr(t);
};
ft.hydrate = function (t, e, n) {
  if (!yl(e)) throw Error(I(200));
  return vl(null, t, e, !0, n);
};
ft.hydrateRoot = function (t, e, n) {
  if (!Au(t)) throw Error(I(405));
  var r = (n != null && n.hydratedSources) || null,
    s = !1,
    i = "",
    o = Xm;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (s = !0),
      n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (e = qm(e, null, t, 1, n ?? null, s, !1, i, o)),
    (t[tn] = e.current),
    Xs(t),
    r)
  )
    for (t = 0; t < r.length; t++)
      (n = r[t]),
        (s = n._getVersion),
        (s = s(n._source)),
        e.mutableSourceEagerHydrationData == null
          ? (e.mutableSourceEagerHydrationData = [n, s])
          : e.mutableSourceEagerHydrationData.push(n, s);
  return new gl(e);
};
ft.render = function (t, e, n) {
  if (!yl(e)) throw Error(I(200));
  return vl(null, t, e, !1, n);
};
ft.unmountComponentAtNode = function (t) {
  if (!yl(t)) throw Error(I(40));
  return t._reactRootContainer
    ? (tr(function () {
        vl(null, null, t, !1, function () {
          (t._reactRootContainer = null), (t[tn] = null);
        });
      }),
      !0)
    : !1;
};
ft.unstable_batchedUpdates = Tu;
ft.unstable_renderSubtreeIntoContainer = function (t, e, n, r) {
  if (!yl(n)) throw Error(I(200));
  if (t == null || t._reactInternals === void 0) throw Error(I(38));
  return vl(t, e, n, !1, r);
};
ft.version = "18.3.1-next-f1338f8080-20240426";
function Jm() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Jm);
    } catch (t) {
      console.error(t);
    }
}
Jm(), (Jf.exports = ft);
var N0 = Jf.exports,
  jh = N0;
(Sa.createRoot = jh.createRoot), (Sa.hydrateRoot = jh.hydrateRoot);
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function oi() {
  return (
    (oi = Object.assign
      ? Object.assign.bind()
      : function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = arguments[e];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
          }
          return t;
        }),
    oi.apply(this, arguments)
  );
}
var gn;
(function (t) {
  (t.Pop = "POP"), (t.Push = "PUSH"), (t.Replace = "REPLACE");
})(gn || (gn = {}));
const Mh = "popstate";
function T0(t) {
  t === void 0 && (t = {});
  function e(r, s) {
    let { pathname: i, search: o, hash: l } = r.location;
    return gc(
      "",
      { pathname: i, search: o, hash: l },
      (s.state && s.state.usr) || null,
      (s.state && s.state.key) || "default"
    );
  }
  function n(r, s) {
    return typeof s == "string" ? s : eg(s);
  }
  return R0(e, n, null, t);
}
function be(t, e) {
  if (t === !1 || t === null || typeof t > "u") throw new Error(e);
}
function Zm(t, e) {
  if (!t) {
    typeof console < "u" && console.warn(e);
    try {
      throw new Error(e);
    } catch {}
  }
}
function k0() {
  return Math.random().toString(36).substr(2, 8);
}
function Dh(t, e) {
  return { usr: t.state, key: t.key, idx: e };
}
function gc(t, e, n, r) {
  return (
    n === void 0 && (n = null),
    oi(
      { pathname: typeof t == "string" ? t : t.pathname, search: "", hash: "" },
      typeof e == "string" ? is(e) : e,
      { state: n, key: (e && e.key) || r || k0() }
    )
  );
}
function eg(t) {
  let { pathname: e = "/", search: n = "", hash: r = "" } = t;
  return (
    n && n !== "?" && (e += n.charAt(0) === "?" ? n : "?" + n),
    r && r !== "#" && (e += r.charAt(0) === "#" ? r : "#" + r),
    e
  );
}
function is(t) {
  let e = {};
  if (t) {
    let n = t.indexOf("#");
    n >= 0 && ((e.hash = t.substr(n)), (t = t.substr(0, n)));
    let r = t.indexOf("?");
    r >= 0 && ((e.search = t.substr(r)), (t = t.substr(0, r))),
      t && (e.pathname = t);
  }
  return e;
}
function R0(t, e, n, r) {
  r === void 0 && (r = {});
  let { window: s = document.defaultView, v5Compat: i = !1 } = r,
    o = s.history,
    l = gn.Pop,
    a = null,
    c = d();
  c == null && ((c = 0), o.replaceState(oi({}, o.state, { idx: c }), ""));
  function d() {
    return (o.state || { idx: null }).idx;
  }
  function h() {
    l = gn.Pop;
    let E = d(),
      y = E == null ? null : E - c;
    (c = E), a && a({ action: l, location: w.location, delta: y });
  }
  function f(E, y) {
    l = gn.Push;
    let m = gc(w.location, E, y);
    n && n(m, E), (c = d() + 1);
    let v = Dh(m, c),
      _ = w.createHref(m);
    try {
      o.pushState(v, "", _);
    } catch (C) {
      if (C instanceof DOMException && C.name === "DataCloneError") throw C;
      s.location.assign(_);
    }
    i && a && a({ action: l, location: w.location, delta: 1 });
  }
  function p(E, y) {
    l = gn.Replace;
    let m = gc(w.location, E, y);
    n && n(m, E), (c = d());
    let v = Dh(m, c),
      _ = w.createHref(m);
    o.replaceState(v, "", _),
      i && a && a({ action: l, location: w.location, delta: 0 });
  }
  function g(E) {
    let y = s.location.origin !== "null" ? s.location.origin : s.location.href,
      m = typeof E == "string" ? E : eg(E);
    return (
      (m = m.replace(/ $/, "%20")),
      be(
        y,
        "No window.location.(origin|href) available to create URL for href: " +
          m
      ),
      new URL(m, y)
    );
  }
  let w = {
    get action() {
      return l;
    },
    get location() {
      return t(s, o);
    },
    listen(E) {
      if (a) throw new Error("A history only accepts one active listener");
      return (
        s.addEventListener(Mh, h),
        (a = E),
        () => {
          s.removeEventListener(Mh, h), (a = null);
        }
      );
    },
    createHref(E) {
      return e(s, E);
    },
    createURL: g,
    encodeLocation(E) {
      let y = g(E);
      return { pathname: y.pathname, search: y.search, hash: y.hash };
    },
    push: f,
    replace: p,
    go(E) {
      return o.go(E);
    },
  };
  return w;
}
var Lh;
(function (t) {
  (t.data = "data"),
    (t.deferred = "deferred"),
    (t.redirect = "redirect"),
    (t.error = "error");
})(Lh || (Lh = {}));
function P0(t, e, n) {
  return n === void 0 && (n = "/"), I0(t, e, n, !1);
}
function I0(t, e, n, r) {
  let s = typeof e == "string" ? is(e) : e,
    i = rg(s.pathname || "/", n);
  if (i == null) return null;
  let o = tg(t);
  O0(o);
  let l = null;
  for (let a = 0; l == null && a < o.length; ++a) {
    let c = z0(i);
    l = U0(o[a], c, r);
  }
  return l;
}
function tg(t, e, n, r) {
  e === void 0 && (e = []), n === void 0 && (n = []), r === void 0 && (r = "");
  let s = (i, o, l) => {
    let a = {
      relativePath: l === void 0 ? i.path || "" : l,
      caseSensitive: i.caseSensitive === !0,
      childrenIndex: o,
      route: i,
    };
    a.relativePath.startsWith("/") &&
      (be(
        a.relativePath.startsWith(r),
        'Absolute route path "' +
          a.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes."
      ),
      (a.relativePath = a.relativePath.slice(r.length)));
    let c = Qn([r, a.relativePath]),
      d = n.concat(a);
    i.children &&
      i.children.length > 0 &&
      (be(
        i.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + c + '".')
      ),
      tg(i.children, e, d, c)),
      !(i.path == null && !i.index) &&
        e.push({ path: c, score: $0(c, i.index), routesMeta: d });
  };
  return (
    t.forEach((i, o) => {
      var l;
      if (i.path === "" || !((l = i.path) != null && l.includes("?"))) s(i, o);
      else for (let a of ng(i.path)) s(i, o, a);
    }),
    e
  );
}
function ng(t) {
  let e = t.split("/");
  if (e.length === 0) return [];
  let [n, ...r] = e,
    s = n.endsWith("?"),
    i = n.replace(/\?$/, "");
  if (r.length === 0) return s ? [i, ""] : [i];
  let o = ng(r.join("/")),
    l = [];
  return (
    l.push(...o.map((a) => (a === "" ? i : [i, a].join("/")))),
    s && l.push(...o),
    l.map((a) => (t.startsWith("/") && a === "" ? "/" : a))
  );
}
function O0(t) {
  t.sort((e, n) =>
    e.score !== n.score
      ? n.score - e.score
      : F0(
          e.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex)
        )
  );
}
const b0 = /^:[\w-]+$/,
  A0 = 3,
  j0 = 2,
  M0 = 1,
  D0 = 10,
  L0 = -2,
  $h = (t) => t === "*";
function $0(t, e) {
  let n = t.split("/"),
    r = n.length;
  return (
    n.some($h) && (r += L0),
    e && (r += j0),
    n
      .filter((s) => !$h(s))
      .reduce((s, i) => s + (b0.test(i) ? A0 : i === "" ? M0 : D0), r)
  );
}
function F0(t, e) {
  return t.length === e.length && t.slice(0, -1).every((r, s) => r === e[s])
    ? t[t.length - 1] - e[e.length - 1]
    : 0;
}
function U0(t, e, n) {
  n === void 0 && (n = !1);
  let { routesMeta: r } = t,
    s = {},
    i = "/",
    o = [];
  for (let l = 0; l < r.length; ++l) {
    let a = r[l],
      c = l === r.length - 1,
      d = i === "/" ? e : e.slice(i.length) || "/",
      h = Fh(
        { path: a.relativePath, caseSensitive: a.caseSensitive, end: c },
        d
      ),
      f = a.route;
    if (
      (!h &&
        c &&
        n &&
        !r[r.length - 1].route.index &&
        (h = Fh(
          { path: a.relativePath, caseSensitive: a.caseSensitive, end: !1 },
          d
        )),
      !h)
    )
      return null;
    Object.assign(s, h.params),
      o.push({
        params: s,
        pathname: Qn([i, h.pathname]),
        pathnameBase: K0(Qn([i, h.pathnameBase])),
        route: f,
      }),
      h.pathnameBase !== "/" && (i = Qn([i, h.pathnameBase]));
  }
  return o;
}
function Fh(t, e) {
  typeof t == "string" && (t = { path: t, caseSensitive: !1, end: !0 });
  let [n, r] = B0(t.path, t.caseSensitive, t.end),
    s = e.match(n);
  if (!s) return null;
  let i = s[0],
    o = i.replace(/(.)\/+$/, "$1"),
    l = s.slice(1);
  return {
    params: r.reduce((c, d, h) => {
      let { paramName: f, isOptional: p } = d;
      if (f === "*") {
        let w = l[h] || "";
        o = i.slice(0, i.length - w.length).replace(/(.)\/+$/, "$1");
      }
      const g = l[h];
      return (
        p && !g ? (c[f] = void 0) : (c[f] = (g || "").replace(/%2F/g, "/")), c
      );
    }, {}),
    pathname: i,
    pathnameBase: o,
    pattern: t,
  };
}
function B0(t, e, n) {
  e === void 0 && (e = !1),
    n === void 0 && (n = !0),
    Zm(
      t === "*" || !t.endsWith("*") || t.endsWith("/*"),
      'Route path "' +
        t +
        '" will be treated as if it were ' +
        ('"' + t.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + t.replace(/\*$/, "/*") + '".')
    );
  let r = [],
    s =
      "^" +
      t
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, l, a) => (
            r.push({ paramName: l, isOptional: a != null }),
            a ? "/?([^\\/]+)?" : "/([^\\/]+)"
          )
        );
  return (
    t.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (s += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
      ? (s += "\\/*$")
      : t !== "" && t !== "/" && (s += "(?:(?=\\/|$))"),
    [new RegExp(s, e ? void 0 : "i"), r]
  );
}
function z0(t) {
  try {
    return t
      .split("/")
      .map((e) => decodeURIComponent(e).replace(/\//g, "%2F"))
      .join("/");
  } catch (e) {
    return (
      Zm(
        !1,
        'The URL path "' +
          t +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + e + ").")
      ),
      t
    );
  }
}
function rg(t, e) {
  if (e === "/") return t;
  if (!t.toLowerCase().startsWith(e.toLowerCase())) return null;
  let n = e.endsWith("/") ? e.length - 1 : e.length,
    r = t.charAt(n);
  return r && r !== "/" ? null : t.slice(n) || "/";
}
function H0(t, e) {
  e === void 0 && (e = "/");
  let {
    pathname: n,
    search: r = "",
    hash: s = "",
  } = typeof t == "string" ? is(t) : t;
  return {
    pathname: n ? (n.startsWith("/") ? n : W0(n, e)) : e,
    search: Q0(r),
    hash: q0(s),
  };
}
function W0(t, e) {
  let n = e.replace(/\/+$/, "").split("/");
  return (
    t.split("/").forEach((s) => {
      s === ".." ? n.length > 1 && n.pop() : s !== "." && n.push(s);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function da(t, e, n, r) {
  return (
    "Cannot include a '" +
    t +
    "' character in a manually specified " +
    ("`to." +
      e +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function G0(t) {
  return t.filter(
    (e, n) => n === 0 || (e.route.path && e.route.path.length > 0)
  );
}
function V0(t, e) {
  let n = G0(t);
  return e
    ? n.map((r, s) => (s === n.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function Y0(t, e, n, r) {
  r === void 0 && (r = !1);
  let s;
  typeof t == "string"
    ? (s = is(t))
    : ((s = oi({}, t)),
      be(
        !s.pathname || !s.pathname.includes("?"),
        da("?", "pathname", "search", s)
      ),
      be(
        !s.pathname || !s.pathname.includes("#"),
        da("#", "pathname", "hash", s)
      ),
      be(!s.search || !s.search.includes("#"), da("#", "search", "hash", s)));
  let i = t === "" || s.pathname === "",
    o = i ? "/" : s.pathname,
    l;
  if (o == null) l = n;
  else {
    let h = e.length - 1;
    if (!r && o.startsWith("..")) {
      let f = o.split("/");
      for (; f[0] === ".."; ) f.shift(), (h -= 1);
      s.pathname = f.join("/");
    }
    l = h >= 0 ? e[h] : "/";
  }
  let a = H0(s, l),
    c = o && o !== "/" && o.endsWith("/"),
    d = (i || o === ".") && n.endsWith("/");
  return !a.pathname.endsWith("/") && (c || d) && (a.pathname += "/"), a;
}
const Qn = (t) => t.join("/").replace(/\/\/+/g, "/"),
  K0 = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"),
  Q0 = (t) => (!t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t),
  q0 = (t) => (!t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t);
function X0(t) {
  return (
    t != null &&
    typeof t.status == "number" &&
    typeof t.statusText == "string" &&
    typeof t.internal == "boolean" &&
    "data" in t
  );
}
const sg = ["post", "put", "patch", "delete"];
new Set(sg);
const J0 = ["get", ...sg];
new Set(J0);
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function li() {
  return (
    (li = Object.assign
      ? Object.assign.bind()
      : function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = arguments[e];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
          }
          return t;
        }),
    li.apply(this, arguments)
  );
}
const ju = N.createContext(null),
  Z0 = N.createContext(null),
  _l = N.createContext(null),
  wl = N.createContext(null),
  ar = N.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  ig = N.createContext(null);
function Cl() {
  return N.useContext(wl) != null;
}
function cr() {
  return Cl() || be(!1), N.useContext(wl).location;
}
function og(t) {
  N.useContext(_l).static || N.useLayoutEffect(t);
}
function os() {
  let { isDataRoute: t } = N.useContext(ar);
  return t ? hw() : ew();
}
function ew() {
  Cl() || be(!1);
  let t = N.useContext(ju),
    { basename: e, future: n, navigator: r } = N.useContext(_l),
    { matches: s } = N.useContext(ar),
    { pathname: i } = cr(),
    o = JSON.stringify(V0(s, n.v7_relativeSplatPath)),
    l = N.useRef(!1);
  return (
    og(() => {
      l.current = !0;
    }),
    N.useCallback(
      function (c, d) {
        if ((d === void 0 && (d = {}), !l.current)) return;
        if (typeof c == "number") {
          r.go(c);
          return;
        }
        let h = Y0(c, JSON.parse(o), i, d.relative === "path");
        t == null &&
          e !== "/" &&
          (h.pathname = h.pathname === "/" ? e : Qn([e, h.pathname])),
          (d.replace ? r.replace : r.push)(h, d.state, d);
      },
      [e, r, o, i, t]
    )
  );
}
function El() {
  let { matches: t } = N.useContext(ar),
    e = t[t.length - 1];
  return e ? e.params : {};
}
function tw(t, e) {
  return nw(t, e);
}
function nw(t, e, n, r) {
  Cl() || be(!1);
  let { navigator: s } = N.useContext(_l),
    { matches: i } = N.useContext(ar),
    o = i[i.length - 1],
    l = o ? o.params : {};
  o && o.pathname;
  let a = o ? o.pathnameBase : "/";
  o && o.route;
  let c = cr(),
    d;
  if (e) {
    var h;
    let E = typeof e == "string" ? is(e) : e;
    a === "/" || ((h = E.pathname) != null && h.startsWith(a)) || be(!1),
      (d = E);
  } else d = c;
  let f = d.pathname || "/",
    p = f;
  if (a !== "/") {
    let E = a.replace(/^\//, "").split("/");
    p = "/" + f.replace(/^\//, "").split("/").slice(E.length).join("/");
  }
  let g = P0(t, { pathname: p }),
    w = lw(
      g &&
        g.map((E) =>
          Object.assign({}, E, {
            params: Object.assign({}, l, E.params),
            pathname: Qn([
              a,
              s.encodeLocation
                ? s.encodeLocation(E.pathname).pathname
                : E.pathname,
            ]),
            pathnameBase:
              E.pathnameBase === "/"
                ? a
                : Qn([
                    a,
                    s.encodeLocation
                      ? s.encodeLocation(E.pathnameBase).pathname
                      : E.pathnameBase,
                  ]),
          })
        ),
      i,
      n,
      r
    );
  return e && w
    ? N.createElement(
        wl.Provider,
        {
          value: {
            location: li(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              d
            ),
            navigationType: gn.Pop,
          },
        },
        w
      )
    : w;
}
function rw() {
  let t = dw(),
    e = X0(t)
      ? t.status + " " + t.statusText
      : t instanceof Error
      ? t.message
      : JSON.stringify(t),
    n = t instanceof Error ? t.stack : null,
    s = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" },
    i = null;
  return N.createElement(
    N.Fragment,
    null,
    N.createElement("h2", null, "Unexpected Application Error!"),
    N.createElement("h3", { style: { fontStyle: "italic" } }, e),
    n ? N.createElement("pre", { style: s }, n) : null,
    i
  );
}
const sw = N.createElement(rw, null);
class iw extends N.Component {
  constructor(e) {
    super(e),
      (this.state = {
        location: e.location,
        revalidation: e.revalidation,
        error: e.error,
      });
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  static getDerivedStateFromProps(e, n) {
    return n.location !== e.location ||
      (n.revalidation !== "idle" && e.revalidation === "idle")
      ? { error: e.error, location: e.location, revalidation: e.revalidation }
      : {
          error: e.error !== void 0 ? e.error : n.error,
          location: n.location,
          revalidation: e.revalidation || n.revalidation,
        };
  }
  componentDidCatch(e, n) {
    console.error(
      "React Router caught the following error during render",
      e,
      n
    );
  }
  render() {
    return this.state.error !== void 0
      ? N.createElement(
          ar.Provider,
          { value: this.props.routeContext },
          N.createElement(ig.Provider, {
            value: this.state.error,
            children: this.props.component,
          })
        )
      : this.props.children;
  }
}
function ow(t) {
  let { routeContext: e, match: n, children: r } = t,
    s = N.useContext(ju);
  return (
    s &&
      s.static &&
      s.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (s.staticContext._deepestRenderedBoundaryId = n.route.id),
    N.createElement(ar.Provider, { value: e }, r)
  );
}
function lw(t, e, n, r) {
  var s;
  if (
    (e === void 0 && (e = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    t == null)
  ) {
    var i;
    if (!n) return null;
    if (n.errors) t = n.matches;
    else if (
      (i = r) != null &&
      i.v7_partialHydration &&
      e.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      t = n.matches;
    else return null;
  }
  let o = t,
    l = (s = n) == null ? void 0 : s.errors;
  if (l != null) {
    let d = o.findIndex(
      (h) => h.route.id && (l == null ? void 0 : l[h.route.id]) !== void 0
    );
    d >= 0 || be(!1), (o = o.slice(0, Math.min(o.length, d + 1)));
  }
  let a = !1,
    c = -1;
  if (n && r && r.v7_partialHydration)
    for (let d = 0; d < o.length; d++) {
      let h = o[d];
      if (
        ((h.route.HydrateFallback || h.route.hydrateFallbackElement) && (c = d),
        h.route.id)
      ) {
        let { loaderData: f, errors: p } = n,
          g =
            h.route.loader &&
            f[h.route.id] === void 0 &&
            (!p || p[h.route.id] === void 0);
        if (h.route.lazy || g) {
          (a = !0), c >= 0 ? (o = o.slice(0, c + 1)) : (o = [o[0]]);
          break;
        }
      }
    }
  return o.reduceRight((d, h, f) => {
    let p,
      g = !1,
      w = null,
      E = null;
    n &&
      ((p = l && h.route.id ? l[h.route.id] : void 0),
      (w = h.route.errorElement || sw),
      a &&
        (c < 0 && f === 0
          ? (fw("route-fallback", !1), (g = !0), (E = null))
          : c === f &&
            ((g = !0), (E = h.route.hydrateFallbackElement || null))));
    let y = e.concat(o.slice(0, f + 1)),
      m = () => {
        let v;
        return (
          p
            ? (v = w)
            : g
            ? (v = E)
            : h.route.Component
            ? (v = N.createElement(h.route.Component, null))
            : h.route.element
            ? (v = h.route.element)
            : (v = d),
          N.createElement(ow, {
            match: h,
            routeContext: { outlet: d, matches: y, isDataRoute: n != null },
            children: v,
          })
        );
      };
    return n && (h.route.ErrorBoundary || h.route.errorElement || f === 0)
      ? N.createElement(iw, {
          location: n.location,
          revalidation: n.revalidation,
          component: w,
          error: p,
          children: m(),
          routeContext: { outlet: null, matches: y, isDataRoute: !0 },
        })
      : m();
  }, null);
}
var lg = (function (t) {
    return (
      (t.UseBlocker = "useBlocker"),
      (t.UseRevalidator = "useRevalidator"),
      (t.UseNavigateStable = "useNavigate"),
      t
    );
  })(lg || {}),
  $o = (function (t) {
    return (
      (t.UseBlocker = "useBlocker"),
      (t.UseLoaderData = "useLoaderData"),
      (t.UseActionData = "useActionData"),
      (t.UseRouteError = "useRouteError"),
      (t.UseNavigation = "useNavigation"),
      (t.UseRouteLoaderData = "useRouteLoaderData"),
      (t.UseMatches = "useMatches"),
      (t.UseRevalidator = "useRevalidator"),
      (t.UseNavigateStable = "useNavigate"),
      (t.UseRouteId = "useRouteId"),
      t
    );
  })($o || {});
function aw(t) {
  let e = N.useContext(ju);
  return e || be(!1), e;
}
function cw(t) {
  let e = N.useContext(Z0);
  return e || be(!1), e;
}
function uw(t) {
  let e = N.useContext(ar);
  return e || be(!1), e;
}
function ag(t) {
  let e = uw(),
    n = e.matches[e.matches.length - 1];
  return n.route.id || be(!1), n.route.id;
}
function dw() {
  var t;
  let e = N.useContext(ig),
    n = cw($o.UseRouteError),
    r = ag($o.UseRouteError);
  return e !== void 0 ? e : (t = n.errors) == null ? void 0 : t[r];
}
function hw() {
  let { router: t } = aw(lg.UseNavigateStable),
    e = ag($o.UseNavigateStable),
    n = N.useRef(!1);
  return (
    og(() => {
      n.current = !0;
    }),
    N.useCallback(
      function (s, i) {
        i === void 0 && (i = {}),
          n.current &&
            (typeof s == "number"
              ? t.navigate(s)
              : t.navigate(s, li({ fromRouteId: e }, i)));
      },
      [t, e]
    )
  );
}
const Uh = {};
function fw(t, e, n) {
  !e && !Uh[t] && (Uh[t] = !0);
}
function pw(t, e) {
  t == null || t.v7_startTransition,
    (t == null ? void 0 : t.v7_relativeSplatPath) === void 0 &&
      (!e || e.v7_relativeSplatPath),
    e &&
      (e.v7_fetcherPersist,
      e.v7_normalizeFormMethod,
      e.v7_partialHydration,
      e.v7_skipActionErrorRevalidation);
}
function Un(t) {
  be(!1);
}
function mw(t) {
  let {
    basename: e = "/",
    children: n = null,
    location: r,
    navigationType: s = gn.Pop,
    navigator: i,
    static: o = !1,
    future: l,
  } = t;
  Cl() && be(!1);
  let a = e.replace(/^\/*/, "/"),
    c = N.useMemo(
      () => ({
        basename: a,
        navigator: i,
        static: o,
        future: li({ v7_relativeSplatPath: !1 }, l),
      }),
      [a, l, i, o]
    );
  typeof r == "string" && (r = is(r));
  let {
      pathname: d = "/",
      search: h = "",
      hash: f = "",
      state: p = null,
      key: g = "default",
    } = r,
    w = N.useMemo(() => {
      let E = rg(d, a);
      return E == null
        ? null
        : {
            location: { pathname: E, search: h, hash: f, state: p, key: g },
            navigationType: s,
          };
    }, [a, d, h, f, p, g, s]);
  return w == null
    ? null
    : N.createElement(
        _l.Provider,
        { value: c },
        N.createElement(wl.Provider, { children: n, value: w })
      );
}
function gw(t) {
  let { children: e, location: n } = t;
  return tw(yc(e), n);
}
new Promise(() => {});
function yc(t, e) {
  e === void 0 && (e = []);
  let n = [];
  return (
    N.Children.forEach(t, (r, s) => {
      if (!N.isValidElement(r)) return;
      let i = [...e, s];
      if (r.type === N.Fragment) {
        n.push.apply(n, yc(r.props.children, i));
        return;
      }
      r.type !== Un && be(!1), !r.props.index || !r.props.children || be(!1);
      let o = {
        id: r.props.id || i.join("-"),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      r.props.children && (o.children = yc(r.props.children, i)), n.push(o);
    }),
    n
  );
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ const yw = "6";
try {
  window.__reactRouterVersion = yw;
} catch {}
const vw = "startTransition",
  Bh = pv[vw];
function _w(t) {
  let { basename: e, children: n, future: r, window: s } = t,
    i = N.useRef();
  i.current == null && (i.current = T0({ window: s, v5Compat: !0 }));
  let o = i.current,
    [l, a] = N.useState({ action: o.action, location: o.location }),
    { v7_startTransition: c } = r || {},
    d = N.useCallback(
      (h) => {
        c && Bh ? Bh(() => a(h)) : a(h);
      },
      [a, c]
    );
  return (
    N.useLayoutEffect(() => o.listen(d), [o, d]),
    N.useEffect(() => pw(r), [r]),
    N.createElement(mw, {
      basename: e,
      children: n,
      location: l.location,
      navigationType: l.action,
      navigator: o,
      future: r,
    })
  );
}
var zh;
(function (t) {
  (t.UseScrollRestoration = "useScrollRestoration"),
    (t.UseSubmit = "useSubmit"),
    (t.UseSubmitFetcher = "useSubmitFetcher"),
    (t.UseFetcher = "useFetcher"),
    (t.useViewTransitionState = "useViewTransitionState");
})(zh || (zh = {}));
var Hh;
(function (t) {
  (t.UseFetcher = "useFetcher"),
    (t.UseFetchers = "useFetchers"),
    (t.UseScrollRestoration = "useScrollRestoration");
})(Hh || (Hh = {}));
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const cg = {
  NODE_CLIENT: !1,
  NODE_ADMIN: !1,
  SDK_VERSION: "${JSCORE_VERSION}",
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const b = function (t, e) {
    if (!t) throw ls(e);
  },
  ls = function (t) {
    return new Error(
      "Firebase Database (" + cg.SDK_VERSION + ") INTERNAL ASSERT FAILED: " + t
    );
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const ug = function (t) {
    const e = [];
    let n = 0;
    for (let r = 0; r < t.length; r++) {
      let s = t.charCodeAt(r);
      s < 128
        ? (e[n++] = s)
        : s < 2048
        ? ((e[n++] = (s >> 6) | 192), (e[n++] = (s & 63) | 128))
        : (s & 64512) === 55296 &&
          r + 1 < t.length &&
          (t.charCodeAt(r + 1) & 64512) === 56320
        ? ((s = 65536 + ((s & 1023) << 10) + (t.charCodeAt(++r) & 1023)),
          (e[n++] = (s >> 18) | 240),
          (e[n++] = ((s >> 12) & 63) | 128),
          (e[n++] = ((s >> 6) & 63) | 128),
          (e[n++] = (s & 63) | 128))
        : ((e[n++] = (s >> 12) | 224),
          (e[n++] = ((s >> 6) & 63) | 128),
          (e[n++] = (s & 63) | 128));
    }
    return e;
  },
  ww = function (t) {
    const e = [];
    let n = 0,
      r = 0;
    for (; n < t.length; ) {
      const s = t[n++];
      if (s < 128) e[r++] = String.fromCharCode(s);
      else if (s > 191 && s < 224) {
        const i = t[n++];
        e[r++] = String.fromCharCode(((s & 31) << 6) | (i & 63));
      } else if (s > 239 && s < 365) {
        const i = t[n++],
          o = t[n++],
          l = t[n++],
          a =
            (((s & 7) << 18) | ((i & 63) << 12) | ((o & 63) << 6) | (l & 63)) -
            65536;
        (e[r++] = String.fromCharCode(55296 + (a >> 10))),
          (e[r++] = String.fromCharCode(56320 + (a & 1023)));
      } else {
        const i = t[n++],
          o = t[n++];
        e[r++] = String.fromCharCode(
          ((s & 15) << 12) | ((i & 63) << 6) | (o & 63)
        );
      }
    }
    return e.join("");
  },
  Mu = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    HAS_NATIVE_SUPPORT: typeof atob == "function",
    encodeByteArray(t, e) {
      if (!Array.isArray(t))
        throw Error("encodeByteArray takes an array as a parameter");
      this.init_();
      const n = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
        r = [];
      for (let s = 0; s < t.length; s += 3) {
        const i = t[s],
          o = s + 1 < t.length,
          l = o ? t[s + 1] : 0,
          a = s + 2 < t.length,
          c = a ? t[s + 2] : 0,
          d = i >> 2,
          h = ((i & 3) << 4) | (l >> 4);
        let f = ((l & 15) << 2) | (c >> 6),
          p = c & 63;
        a || ((p = 64), o || (f = 64)), r.push(n[d], n[h], n[f], n[p]);
      }
      return r.join("");
    },
    encodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? btoa(t)
        : this.encodeByteArray(ug(t), e);
    },
    decodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(t)
        : ww(this.decodeStringToByteArray(t, e));
    },
    decodeStringToByteArray(t, e) {
      this.init_();
      const n = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
        r = [];
      for (let s = 0; s < t.length; ) {
        const i = n[t.charAt(s++)],
          l = s < t.length ? n[t.charAt(s)] : 0;
        ++s;
        const c = s < t.length ? n[t.charAt(s)] : 64;
        ++s;
        const h = s < t.length ? n[t.charAt(s)] : 64;
        if ((++s, i == null || l == null || c == null || h == null))
          throw new Cw();
        const f = (i << 2) | (l >> 4);
        if ((r.push(f), c !== 64)) {
          const p = ((l << 4) & 240) | (c >> 2);
          if ((r.push(p), h !== 64)) {
            const g = ((c << 6) & 192) | h;
            r.push(g);
          }
        }
      }
      return r;
    },
    init_() {
      if (!this.byteToCharMap_) {
        (this.byteToCharMap_ = {}),
          (this.charToByteMap_ = {}),
          (this.byteToCharMapWebSafe_ = {}),
          (this.charToByteMapWebSafe_ = {});
        for (let t = 0; t < this.ENCODED_VALS.length; t++)
          (this.byteToCharMap_[t] = this.ENCODED_VALS.charAt(t)),
            (this.charToByteMap_[this.byteToCharMap_[t]] = t),
            (this.byteToCharMapWebSafe_[t] =
              this.ENCODED_VALS_WEBSAFE.charAt(t)),
            (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]] = t),
            t >= this.ENCODED_VALS_BASE.length &&
              ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)] = t),
              (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)] = t));
      }
    },
  };
class Cw extends Error {
  constructor() {
    super(...arguments), (this.name = "DecodeBase64StringError");
  }
}
const dg = function (t) {
    const e = ug(t);
    return Mu.encodeByteArray(e, !0);
  },
  Fo = function (t) {
    return dg(t).replace(/\./g, "");
  },
  vc = function (t) {
    try {
      return Mu.decodeString(t, !0);
    } catch (e) {
      console.error("base64Decode failed: ", e);
    }
    return null;
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Ew(t) {
  return hg(void 0, t);
}
function hg(t, e) {
  if (!(e instanceof Object)) return e;
  switch (e.constructor) {
    case Date:
      const n = e;
      return new Date(n.getTime());
    case Object:
      t === void 0 && (t = {});
      break;
    case Array:
      t = [];
      break;
    default:
      return e;
  }
  for (const n in e) !e.hasOwnProperty(n) || !Sw(n) || (t[n] = hg(t[n], e[n]));
  return t;
}
function Sw(t) {
  return t !== "__proto__";
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function xw() {
  if (typeof self < "u") return self;
  if (typeof window < "u") return window;
  if (typeof global < "u") return global;
  throw new Error("Unable to locate global object.");
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Nw = () => xw().__FIREBASE_DEFAULTS__,
  Tw = () => {
    if (typeof process > "u" || typeof process.env > "u") return;
    const t = {}.__FIREBASE_DEFAULTS__;
    if (t) return JSON.parse(t);
  },
  kw = () => {
    if (typeof document > "u") return;
    let t;
    try {
      t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    } catch {
      return;
    }
    const e = t && vc(t[1]);
    return e && JSON.parse(e);
  },
  fg = () => {
    try {
      return Nw() || Tw() || kw();
    } catch (t) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);
      return;
    }
  },
  Rw = (t) => {
    var e, n;
    return (n =
      (e = fg()) === null || e === void 0 ? void 0 : e.emulatorHosts) ===
      null || n === void 0
      ? void 0
      : n[t];
  },
  Pw = (t) => {
    const e = Rw(t);
    if (!e) return;
    const n = e.lastIndexOf(":");
    if (n <= 0 || n + 1 === e.length)
      throw new Error(`Invalid host ${e} with no separate hostname and port!`);
    const r = parseInt(e.substring(n + 1), 10);
    return e[0] === "[" ? [e.substring(1, n - 1), r] : [e.substring(0, n), r];
  },
  pg = () => {
    var t;
    return (t = fg()) === null || t === void 0 ? void 0 : t.config;
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class xi {
  constructor() {
    (this.reject = () => {}),
      (this.resolve = () => {}),
      (this.promise = new Promise((e, n) => {
        (this.resolve = e), (this.reject = n);
      }));
  }
  wrapCallback(e) {
    return (n, r) => {
      n ? this.reject(n) : this.resolve(r),
        typeof e == "function" &&
          (this.promise.catch(() => {}), e.length === 1 ? e(n) : e(n, r));
    };
  }
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Iw(t, e) {
  if (t.uid)
    throw new Error(
      'The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.'
    );
  const n = { alg: "none", type: "JWT" },
    r = e || "demo-project",
    s = t.iat || 0,
    i = t.sub || t.user_id;
  if (!i)
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  const o = Object.assign(
      {
        iss: `https://securetoken.google.com/${r}`,
        aud: r,
        iat: s,
        exp: s + 3600,
        auth_time: s,
        sub: i,
        user_id: i,
        firebase: { sign_in_provider: "custom", identities: {} },
      },
      t
    ),
    l = "";
  return [Fo(JSON.stringify(n)), Fo(JSON.stringify(o)), l].join(".");
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Ow() {
  return typeof navigator < "u" && typeof navigator.userAgent == "string"
    ? navigator.userAgent
    : "";
}
function mg() {
  return (
    typeof window < "u" &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ow())
  );
}
function bw() {
  return typeof navigator == "object" && navigator.product === "ReactNative";
}
function gg() {
  return cg.NODE_ADMIN === !0;
}
function Aw() {
  try {
    return typeof indexedDB == "object";
  } catch {
    return !1;
  }
}
function jw() {
  return new Promise((t, e) => {
    try {
      let n = !0;
      const r = "validate-browser-context-for-indexeddb-analytics-module",
        s = self.indexedDB.open(r);
      (s.onsuccess = () => {
        s.result.close(), n || self.indexedDB.deleteDatabase(r), t(!0);
      }),
        (s.onupgradeneeded = () => {
          n = !1;
        }),
        (s.onerror = () => {
          var i;
          e(
            ((i = s.error) === null || i === void 0 ? void 0 : i.message) || ""
          );
        });
    } catch (n) {
      e(n);
    }
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Mw = "FirebaseError";
class Ni extends Error {
  constructor(e, n, r) {
    super(n),
      (this.code = e),
      (this.customData = r),
      (this.name = Mw),
      Object.setPrototypeOf(this, Ni.prototype),
      Error.captureStackTrace &&
        Error.captureStackTrace(this, yg.prototype.create);
  }
}
class yg {
  constructor(e, n, r) {
    (this.service = e), (this.serviceName = n), (this.errors = r);
  }
  create(e, ...n) {
    const r = n[0] || {},
      s = `${this.service}/${e}`,
      i = this.errors[e],
      o = i ? Dw(i, r) : "Error",
      l = `${this.serviceName}: ${o} (${s}).`;
    return new Ni(s, l, r);
  }
}
function Dw(t, e) {
  return t.replace(Lw, (n, r) => {
    const s = e[r];
    return s != null ? String(s) : `<${r}?>`;
  });
}
const Lw = /\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ai(t) {
  return JSON.parse(t);
}
function Ie(t) {
  return JSON.stringify(t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const vg = function (t) {
    let e = {},
      n = {},
      r = {},
      s = "";
    try {
      const i = t.split(".");
      (e = ai(vc(i[0]) || "")),
        (n = ai(vc(i[1]) || "")),
        (s = i[2]),
        (r = n.d || {}),
        delete n.d;
    } catch {}
    return { header: e, claims: n, data: r, signature: s };
  },
  $w = function (t) {
    const e = vg(t),
      n = e.claims;
    return !!n && typeof n == "object" && n.hasOwnProperty("iat");
  },
  Fw = function (t) {
    const e = vg(t).claims;
    return typeof e == "object" && e.admin === !0;
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function zt(t, e) {
  return Object.prototype.hasOwnProperty.call(t, e);
}
function Kr(t, e) {
  if (Object.prototype.hasOwnProperty.call(t, e)) return t[e];
}
function Wh(t) {
  for (const e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1;
  return !0;
}
function Uo(t, e, n) {
  const r = {};
  for (const s in t)
    Object.prototype.hasOwnProperty.call(t, s) &&
      (r[s] = e.call(n, t[s], s, t));
  return r;
}
function _c(t, e) {
  if (t === e) return !0;
  const n = Object.keys(t),
    r = Object.keys(e);
  for (const s of n) {
    if (!r.includes(s)) return !1;
    const i = t[s],
      o = e[s];
    if (Gh(i) && Gh(o)) {
      if (!_c(i, o)) return !1;
    } else if (i !== o) return !1;
  }
  for (const s of r) if (!n.includes(s)) return !1;
  return !0;
}
function Gh(t) {
  return t !== null && typeof t == "object";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Uw(t) {
  const e = [];
  for (const [n, r] of Object.entries(t))
    Array.isArray(r)
      ? r.forEach((s) => {
          e.push(encodeURIComponent(n) + "=" + encodeURIComponent(s));
        })
      : e.push(encodeURIComponent(n) + "=" + encodeURIComponent(r));
  return e.length ? "&" + e.join("&") : "";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Bw {
  constructor() {
    (this.chain_ = []),
      (this.buf_ = []),
      (this.W_ = []),
      (this.pad_ = []),
      (this.inbuf_ = 0),
      (this.total_ = 0),
      (this.blockSize = 512 / 8),
      (this.pad_[0] = 128);
    for (let e = 1; e < this.blockSize; ++e) this.pad_[e] = 0;
    this.reset();
  }
  reset() {
    (this.chain_[0] = 1732584193),
      (this.chain_[1] = 4023233417),
      (this.chain_[2] = 2562383102),
      (this.chain_[3] = 271733878),
      (this.chain_[4] = 3285377520),
      (this.inbuf_ = 0),
      (this.total_ = 0);
  }
  compress_(e, n) {
    n || (n = 0);
    const r = this.W_;
    if (typeof e == "string")
      for (let h = 0; h < 16; h++)
        (r[h] =
          (e.charCodeAt(n) << 24) |
          (e.charCodeAt(n + 1) << 16) |
          (e.charCodeAt(n + 2) << 8) |
          e.charCodeAt(n + 3)),
          (n += 4);
    else
      for (let h = 0; h < 16; h++)
        (r[h] = (e[n] << 24) | (e[n + 1] << 16) | (e[n + 2] << 8) | e[n + 3]),
          (n += 4);
    for (let h = 16; h < 80; h++) {
      const f = r[h - 3] ^ r[h - 8] ^ r[h - 14] ^ r[h - 16];
      r[h] = ((f << 1) | (f >>> 31)) & 4294967295;
    }
    let s = this.chain_[0],
      i = this.chain_[1],
      o = this.chain_[2],
      l = this.chain_[3],
      a = this.chain_[4],
      c,
      d;
    for (let h = 0; h < 80; h++) {
      h < 40
        ? h < 20
          ? ((c = l ^ (i & (o ^ l))), (d = 1518500249))
          : ((c = i ^ o ^ l), (d = 1859775393))
        : h < 60
        ? ((c = (i & o) | (l & (i | o))), (d = 2400959708))
        : ((c = i ^ o ^ l), (d = 3395469782));
      const f = (((s << 5) | (s >>> 27)) + c + a + d + r[h]) & 4294967295;
      (a = l),
        (l = o),
        (o = ((i << 30) | (i >>> 2)) & 4294967295),
        (i = s),
        (s = f);
    }
    (this.chain_[0] = (this.chain_[0] + s) & 4294967295),
      (this.chain_[1] = (this.chain_[1] + i) & 4294967295),
      (this.chain_[2] = (this.chain_[2] + o) & 4294967295),
      (this.chain_[3] = (this.chain_[3] + l) & 4294967295),
      (this.chain_[4] = (this.chain_[4] + a) & 4294967295);
  }
  update(e, n) {
    if (e == null) return;
    n === void 0 && (n = e.length);
    const r = n - this.blockSize;
    let s = 0;
    const i = this.buf_;
    let o = this.inbuf_;
    for (; s < n; ) {
      if (o === 0) for (; s <= r; ) this.compress_(e, s), (s += this.blockSize);
      if (typeof e == "string") {
        for (; s < n; )
          if (((i[o] = e.charCodeAt(s)), ++o, ++s, o === this.blockSize)) {
            this.compress_(i), (o = 0);
            break;
          }
      } else
        for (; s < n; )
          if (((i[o] = e[s]), ++o, ++s, o === this.blockSize)) {
            this.compress_(i), (o = 0);
            break;
          }
    }
    (this.inbuf_ = o), (this.total_ += n);
  }
  digest() {
    const e = [];
    let n = this.total_ * 8;
    this.inbuf_ < 56
      ? this.update(this.pad_, 56 - this.inbuf_)
      : this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
    for (let s = this.blockSize - 1; s >= 56; s--)
      (this.buf_[s] = n & 255), (n /= 256);
    this.compress_(this.buf_);
    let r = 0;
    for (let s = 0; s < 5; s++)
      for (let i = 24; i >= 0; i -= 8)
        (e[r] = (this.chain_[s] >> i) & 255), ++r;
    return e;
  }
}
function Sl(t, e) {
  return `${t} failed: ${e} argument `;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const zw = function (t) {
    const e = [];
    let n = 0;
    for (let r = 0; r < t.length; r++) {
      let s = t.charCodeAt(r);
      if (s >= 55296 && s <= 56319) {
        const i = s - 55296;
        r++, b(r < t.length, "Surrogate pair missing trail surrogate.");
        const o = t.charCodeAt(r) - 56320;
        s = 65536 + (i << 10) + o;
      }
      s < 128
        ? (e[n++] = s)
        : s < 2048
        ? ((e[n++] = (s >> 6) | 192), (e[n++] = (s & 63) | 128))
        : s < 65536
        ? ((e[n++] = (s >> 12) | 224),
          (e[n++] = ((s >> 6) & 63) | 128),
          (e[n++] = (s & 63) | 128))
        : ((e[n++] = (s >> 18) | 240),
          (e[n++] = ((s >> 12) & 63) | 128),
          (e[n++] = ((s >> 6) & 63) | 128),
          (e[n++] = (s & 63) | 128));
    }
    return e;
  },
  xl = function (t) {
    let e = 0;
    for (let n = 0; n < t.length; n++) {
      const r = t.charCodeAt(n);
      r < 128
        ? e++
        : r < 2048
        ? (e += 2)
        : r >= 55296 && r <= 56319
        ? ((e += 4), n++)
        : (e += 3);
    }
    return e;
  };
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ur(t) {
  return t && t._delegate ? t._delegate : t;
}
class ci {
  constructor(e, n, r) {
    (this.name = e),
      (this.instanceFactory = n),
      (this.type = r),
      (this.multipleInstances = !1),
      (this.serviceProps = {}),
      (this.instantiationMode = "LAZY"),
      (this.onInstanceCreated = null);
  }
  setInstantiationMode(e) {
    return (this.instantiationMode = e), this;
  }
  setMultipleInstances(e) {
    return (this.multipleInstances = e), this;
  }
  setServiceProps(e) {
    return (this.serviceProps = e), this;
  }
  setInstanceCreatedCallback(e) {
    return (this.onInstanceCreated = e), this;
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Bn = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Hw {
  constructor(e, n) {
    (this.name = e),
      (this.container = n),
      (this.component = null),
      (this.instances = new Map()),
      (this.instancesDeferred = new Map()),
      (this.instancesOptions = new Map()),
      (this.onInitCallbacks = new Map());
  }
  get(e) {
    const n = this.normalizeInstanceIdentifier(e);
    if (!this.instancesDeferred.has(n)) {
      const r = new xi();
      if (
        (this.instancesDeferred.set(n, r),
        this.isInitialized(n) || this.shouldAutoInitialize())
      )
        try {
          const s = this.getOrInitializeService({ instanceIdentifier: n });
          s && r.resolve(s);
        } catch {}
    }
    return this.instancesDeferred.get(n).promise;
  }
  getImmediate(e) {
    var n;
    const r = this.normalizeInstanceIdentifier(
        e == null ? void 0 : e.identifier
      ),
      s =
        (n = e == null ? void 0 : e.optional) !== null && n !== void 0 ? n : !1;
    if (this.isInitialized(r) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({ instanceIdentifier: r });
      } catch (i) {
        if (s) return null;
        throw i;
      }
    else {
      if (s) return null;
      throw Error(`Service ${this.name} is not available`);
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
    if (this.component)
      throw Error(`Component for ${this.name} has already been provided`);
    if (((this.component = e), !!this.shouldAutoInitialize())) {
      if (Gw(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: Bn });
        } catch {}
      for (const [n, r] of this.instancesDeferred.entries()) {
        const s = this.normalizeInstanceIdentifier(n);
        try {
          const i = this.getOrInitializeService({ instanceIdentifier: s });
          r.resolve(i);
        } catch {}
      }
    }
  }
  clearInstance(e = Bn) {
    this.instancesDeferred.delete(e),
      this.instancesOptions.delete(e),
      this.instances.delete(e);
  }
  async delete() {
    const e = Array.from(this.instances.values());
    await Promise.all([
      ...e.filter((n) => "INTERNAL" in n).map((n) => n.INTERNAL.delete()),
      ...e.filter((n) => "_delete" in n).map((n) => n._delete()),
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(e = Bn) {
    return this.instances.has(e);
  }
  getOptions(e = Bn) {
    return this.instancesOptions.get(e) || {};
  }
  initialize(e = {}) {
    const { options: n = {} } = e,
      r = this.normalizeInstanceIdentifier(e.instanceIdentifier);
    if (this.isInitialized(r))
      throw Error(`${this.name}(${r}) has already been initialized`);
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`);
    const s = this.getOrInitializeService({
      instanceIdentifier: r,
      options: n,
    });
    for (const [i, o] of this.instancesDeferred.entries()) {
      const l = this.normalizeInstanceIdentifier(i);
      r === l && o.resolve(s);
    }
    return s;
  }
  onInit(e, n) {
    var r;
    const s = this.normalizeInstanceIdentifier(n),
      i =
        (r = this.onInitCallbacks.get(s)) !== null && r !== void 0
          ? r
          : new Set();
    i.add(e), this.onInitCallbacks.set(s, i);
    const o = this.instances.get(s);
    return (
      o && e(o, s),
      () => {
        i.delete(e);
      }
    );
  }
  invokeOnInitCallbacks(e, n) {
    const r = this.onInitCallbacks.get(n);
    if (r)
      for (const s of r)
        try {
          s(e, n);
        } catch {}
  }
  getOrInitializeService({ instanceIdentifier: e, options: n = {} }) {
    let r = this.instances.get(e);
    if (
      !r &&
      this.component &&
      ((r = this.component.instanceFactory(this.container, {
        instanceIdentifier: Ww(e),
        options: n,
      })),
      this.instances.set(e, r),
      this.instancesOptions.set(e, n),
      this.invokeOnInitCallbacks(r, e),
      this.component.onInstanceCreated)
    )
      try {
        this.component.onInstanceCreated(this.container, e, r);
      } catch {}
    return r || null;
  }
  normalizeInstanceIdentifier(e = Bn) {
    return this.component ? (this.component.multipleInstances ? e : Bn) : e;
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
}
function Ww(t) {
  return t === Bn ? void 0 : t;
}
function Gw(t) {
  return t.instantiationMode === "EAGER";
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Vw {
  constructor(e) {
    (this.name = e), (this.providers = new Map());
  }
  addComponent(e) {
    const n = this.getProvider(e.name);
    if (n.isComponentSet())
      throw new Error(
        `Component ${e.name} has already been registered with ${this.name}`
      );
    n.setComponent(e);
  }
  addOrOverwriteComponent(e) {
    this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name),
      this.addComponent(e);
  }
  getProvider(e) {
    if (this.providers.has(e)) return this.providers.get(e);
    const n = new Hw(e, this);
    return this.providers.set(e, n), n;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var ae;
(function (t) {
  (t[(t.DEBUG = 0)] = "DEBUG"),
    (t[(t.VERBOSE = 1)] = "VERBOSE"),
    (t[(t.INFO = 2)] = "INFO"),
    (t[(t.WARN = 3)] = "WARN"),
    (t[(t.ERROR = 4)] = "ERROR"),
    (t[(t.SILENT = 5)] = "SILENT");
})(ae || (ae = {}));
const Yw = {
    debug: ae.DEBUG,
    verbose: ae.VERBOSE,
    info: ae.INFO,
    warn: ae.WARN,
    error: ae.ERROR,
    silent: ae.SILENT,
  },
  Kw = ae.INFO,
  Qw = {
    [ae.DEBUG]: "log",
    [ae.VERBOSE]: "log",
    [ae.INFO]: "info",
    [ae.WARN]: "warn",
    [ae.ERROR]: "error",
  },
  qw = (t, e, ...n) => {
    if (e < t.logLevel) return;
    const r = new Date().toISOString(),
      s = Qw[e];
    if (s) console[s](`[${r}]  ${t.name}:`, ...n);
    else
      throw new Error(
        `Attempted to log a message with an invalid logType (value: ${e})`
      );
  };
class _g {
  constructor(e) {
    (this.name = e),
      (this._logLevel = Kw),
      (this._logHandler = qw),
      (this._userLogHandler = null);
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(e) {
    if (!(e in ae))
      throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
    this._logLevel = e;
  }
  setLogLevel(e) {
    this._logLevel = typeof e == "string" ? Yw[e] : e;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(e) {
    if (typeof e != "function")
      throw new TypeError("Value assigned to `logHandler` must be a function");
    this._logHandler = e;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(e) {
    this._userLogHandler = e;
  }
  debug(...e) {
    this._userLogHandler && this._userLogHandler(this, ae.DEBUG, ...e),
      this._logHandler(this, ae.DEBUG, ...e);
  }
  log(...e) {
    this._userLogHandler && this._userLogHandler(this, ae.VERBOSE, ...e),
      this._logHandler(this, ae.VERBOSE, ...e);
  }
  info(...e) {
    this._userLogHandler && this._userLogHandler(this, ae.INFO, ...e),
      this._logHandler(this, ae.INFO, ...e);
  }
  warn(...e) {
    this._userLogHandler && this._userLogHandler(this, ae.WARN, ...e),
      this._logHandler(this, ae.WARN, ...e);
  }
  error(...e) {
    this._userLogHandler && this._userLogHandler(this, ae.ERROR, ...e),
      this._logHandler(this, ae.ERROR, ...e);
  }
}
const Xw = (t, e) => e.some((n) => t instanceof n);
let Vh, Yh;
function Jw() {
  return (
    Vh ||
    (Vh = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  );
}
function Zw() {
  return (
    Yh ||
    (Yh = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  );
}
const wg = new WeakMap(),
  wc = new WeakMap(),
  Cg = new WeakMap(),
  ha = new WeakMap(),
  Du = new WeakMap();
function eC(t) {
  const e = new Promise((n, r) => {
    const s = () => {
        t.removeEventListener("success", i), t.removeEventListener("error", o);
      },
      i = () => {
        n(Tn(t.result)), s();
      },
      o = () => {
        r(t.error), s();
      };
    t.addEventListener("success", i), t.addEventListener("error", o);
  });
  return (
    e
      .then((n) => {
        n instanceof IDBCursor && wg.set(n, t);
      })
      .catch(() => {}),
    Du.set(e, t),
    e
  );
}
function tC(t) {
  if (wc.has(t)) return;
  const e = new Promise((n, r) => {
    const s = () => {
        t.removeEventListener("complete", i),
          t.removeEventListener("error", o),
          t.removeEventListener("abort", o);
      },
      i = () => {
        n(), s();
      },
      o = () => {
        r(t.error || new DOMException("AbortError", "AbortError")), s();
      };
    t.addEventListener("complete", i),
      t.addEventListener("error", o),
      t.addEventListener("abort", o);
  });
  wc.set(t, e);
}
let Cc = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === "done") return wc.get(t);
      if (e === "objectStoreNames") return t.objectStoreNames || Cg.get(t);
      if (e === "store")
        return n.objectStoreNames[1]
          ? void 0
          : n.objectStore(n.objectStoreNames[0]);
    }
    return Tn(t[e]);
  },
  set(t, e, n) {
    return (t[e] = n), !0;
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store")
      ? !0
      : e in t;
  },
};
function nC(t) {
  Cc = t(Cc);
}
function rC(t) {
  return t === IDBDatabase.prototype.transaction &&
    !("objectStoreNames" in IDBTransaction.prototype)
    ? function (e, ...n) {
        const r = t.call(fa(this), e, ...n);
        return Cg.set(r, e.sort ? e.sort() : [e]), Tn(r);
      }
    : Zw().includes(t)
    ? function (...e) {
        return t.apply(fa(this), e), Tn(wg.get(this));
      }
    : function (...e) {
        return Tn(t.apply(fa(this), e));
      };
}
function sC(t) {
  return typeof t == "function"
    ? rC(t)
    : (t instanceof IDBTransaction && tC(t),
      Xw(t, Jw()) ? new Proxy(t, Cc) : t);
}
function Tn(t) {
  if (t instanceof IDBRequest) return eC(t);
  if (ha.has(t)) return ha.get(t);
  const e = sC(t);
  return e !== t && (ha.set(t, e), Du.set(e, t)), e;
}
const fa = (t) => Du.get(t);
function iC(t, e, { blocked: n, upgrade: r, blocking: s, terminated: i } = {}) {
  const o = indexedDB.open(t, e),
    l = Tn(o);
  return (
    r &&
      o.addEventListener("upgradeneeded", (a) => {
        r(Tn(o.result), a.oldVersion, a.newVersion, Tn(o.transaction), a);
      }),
    n && o.addEventListener("blocked", (a) => n(a.oldVersion, a.newVersion, a)),
    l
      .then((a) => {
        i && a.addEventListener("close", () => i()),
          s &&
            a.addEventListener("versionchange", (c) =>
              s(c.oldVersion, c.newVersion, c)
            );
      })
      .catch(() => {}),
    l
  );
}
const oC = ["get", "getKey", "getAll", "getAllKeys", "count"],
  lC = ["put", "add", "delete", "clear"],
  pa = new Map();
function Kh(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string")) return;
  if (pa.get(e)) return pa.get(e);
  const n = e.replace(/FromIndex$/, ""),
    r = e !== n,
    s = lC.includes(n);
  if (
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
    !(s || oC.includes(n))
  )
    return;
  const i = async function (o, ...l) {
    const a = this.transaction(o, s ? "readwrite" : "readonly");
    let c = a.store;
    return (
      r && (c = c.index(l.shift())),
      (await Promise.all([c[n](...l), s && a.done]))[0]
    );
  };
  return pa.set(e, i), i;
}
nC((t) => ({
  ...t,
  get: (e, n, r) => Kh(e, n) || t.get(e, n, r),
  has: (e, n) => !!Kh(e, n) || t.has(e, n),
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class aC {
  constructor(e) {
    this.container = e;
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map((n) => {
        if (cC(n)) {
          const r = n.getImmediate();
          return `${r.library}/${r.version}`;
        } else return null;
      })
      .filter((n) => n)
      .join(" ");
  }
}
function cC(t) {
  const e = t.getComponent();
  return (e == null ? void 0 : e.type) === "VERSION";
}
const Ec = "@firebase/app",
  Qh = "0.9.13";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const nr = new _g("@firebase/app"),
  uC = "@firebase/app-compat",
  dC = "@firebase/analytics-compat",
  hC = "@firebase/analytics",
  fC = "@firebase/app-check-compat",
  pC = "@firebase/app-check",
  mC = "@firebase/auth",
  gC = "@firebase/auth-compat",
  yC = "@firebase/database",
  vC = "@firebase/database-compat",
  _C = "@firebase/functions",
  wC = "@firebase/functions-compat",
  CC = "@firebase/installations",
  EC = "@firebase/installations-compat",
  SC = "@firebase/messaging",
  xC = "@firebase/messaging-compat",
  NC = "@firebase/performance",
  TC = "@firebase/performance-compat",
  kC = "@firebase/remote-config",
  RC = "@firebase/remote-config-compat",
  PC = "@firebase/storage",
  IC = "@firebase/storage-compat",
  OC = "@firebase/firestore",
  bC = "@firebase/firestore-compat",
  AC = "firebase",
  jC = "9.23.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Sc = "[DEFAULT]",
  MC = {
    [Ec]: "fire-core",
    [uC]: "fire-core-compat",
    [hC]: "fire-analytics",
    [dC]: "fire-analytics-compat",
    [pC]: "fire-app-check",
    [fC]: "fire-app-check-compat",
    [mC]: "fire-auth",
    [gC]: "fire-auth-compat",
    [yC]: "fire-rtdb",
    [vC]: "fire-rtdb-compat",
    [_C]: "fire-fn",
    [wC]: "fire-fn-compat",
    [CC]: "fire-iid",
    [EC]: "fire-iid-compat",
    [SC]: "fire-fcm",
    [xC]: "fire-fcm-compat",
    [NC]: "fire-perf",
    [TC]: "fire-perf-compat",
    [kC]: "fire-rc",
    [RC]: "fire-rc-compat",
    [PC]: "fire-gcs",
    [IC]: "fire-gcs-compat",
    [OC]: "fire-fst",
    [bC]: "fire-fst-compat",
    "fire-js": "fire-js",
    [AC]: "fire-js-all",
  };
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Bo = new Map(),
  xc = new Map();
function DC(t, e) {
  try {
    t.container.addComponent(e);
  } catch (n) {
    nr.debug(
      `Component ${e.name} failed to register with FirebaseApp ${t.name}`,
      n
    );
  }
}
function zo(t) {
  const e = t.name;
  if (xc.has(e))
    return (
      nr.debug(`There were multiple attempts to register component ${e}.`), !1
    );
  xc.set(e, t);
  for (const n of Bo.values()) DC(n, t);
  return !0;
}
function LC(t, e) {
  const n = t.container.getProvider("heartbeat").getImmediate({ optional: !0 });
  return n && n.triggerHeartbeat(), t.container.getProvider(e);
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const $C = {
    "no-app":
      "No Firebase App '{$appName}' has been created - call initializeApp() first",
    "bad-app-name": "Illegal App name: '{$appName}",
    "duplicate-app":
      "Firebase App named '{$appName}' already exists with different options or config",
    "app-deleted": "Firebase App named '{$appName}' already deleted",
    "no-options":
      "Need to provide options, when not being deployed to hosting via source.",
    "invalid-app-argument":
      "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    "invalid-log-argument":
      "First argument to `onLog` must be null or a function.",
    "idb-open":
      "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-get":
      "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-set":
      "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-delete":
      "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  },
  kn = new yg("app", "Firebase", $C);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class FC {
  constructor(e, n, r) {
    (this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, n)),
      (this._name = n.name),
      (this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled),
      (this._container = r),
      this.container.addComponent(new ci("app", () => this, "PUBLIC"));
  }
  get automaticDataCollectionEnabled() {
    return this.checkDestroyed(), this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(e) {
    this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
  }
  get name() {
    return this.checkDestroyed(), this._name;
  }
  get options() {
    return this.checkDestroyed(), this._options;
  }
  get config() {
    return this.checkDestroyed(), this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(e) {
    this._isDeleted = e;
  }
  checkDestroyed() {
    if (this.isDeleted) throw kn.create("app-deleted", { appName: this._name });
  }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const UC = jC;
function Eg(t, e = {}) {
  let n = t;
  typeof e != "object" && (e = { name: e });
  const r = Object.assign({ name: Sc, automaticDataCollectionEnabled: !1 }, e),
    s = r.name;
  if (typeof s != "string" || !s)
    throw kn.create("bad-app-name", { appName: String(s) });
  if ((n || (n = pg()), !n)) throw kn.create("no-options");
  const i = Bo.get(s);
  if (i) {
    if (_c(n, i.options) && _c(r, i.config)) return i;
    throw kn.create("duplicate-app", { appName: s });
  }
  const o = new Vw(s);
  for (const a of xc.values()) o.addComponent(a);
  const l = new FC(n, r, o);
  return Bo.set(s, l), l;
}
function BC(t = Sc) {
  const e = Bo.get(t);
  if (!e && t === Sc && pg()) return Eg();
  if (!e) throw kn.create("no-app", { appName: t });
  return e;
}
function Lr(t, e, n) {
  var r;
  let s = (r = MC[t]) !== null && r !== void 0 ? r : t;
  n && (s += `-${n}`);
  const i = s.match(/\s|\//),
    o = e.match(/\s|\//);
  if (i || o) {
    const l = [`Unable to register library "${s}" with version "${e}":`];
    i &&
      l.push(
        `library name "${s}" contains illegal characters (whitespace or "/")`
      ),
      i && o && l.push("and"),
      o &&
        l.push(
          `version name "${e}" contains illegal characters (whitespace or "/")`
        ),
      nr.warn(l.join(" "));
    return;
  }
  zo(new ci(`${s}-version`, () => ({ library: s, version: e }), "VERSION"));
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const zC = "firebase-heartbeat-database",
  HC = 1,
  ui = "firebase-heartbeat-store";
let ma = null;
function Sg() {
  return (
    ma ||
      (ma = iC(zC, HC, {
        upgrade: (t, e) => {
          switch (e) {
            case 0:
              t.createObjectStore(ui);
          }
        },
      }).catch((t) => {
        throw kn.create("idb-open", { originalErrorMessage: t.message });
      })),
    ma
  );
}
async function WC(t) {
  try {
    return await (await Sg()).transaction(ui).objectStore(ui).get(xg(t));
  } catch (e) {
    if (e instanceof Ni) nr.warn(e.message);
    else {
      const n = kn.create("idb-get", {
        originalErrorMessage: e == null ? void 0 : e.message,
      });
      nr.warn(n.message);
    }
  }
}
async function qh(t, e) {
  try {
    const r = (await Sg()).transaction(ui, "readwrite");
    await r.objectStore(ui).put(e, xg(t)), await r.done;
  } catch (n) {
    if (n instanceof Ni) nr.warn(n.message);
    else {
      const r = kn.create("idb-set", {
        originalErrorMessage: n == null ? void 0 : n.message,
      });
      nr.warn(r.message);
    }
  }
}
function xg(t) {
  return `${t.name}!${t.options.appId}`;
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const GC = 1024,
  VC = 30 * 24 * 60 * 60 * 1e3;
class YC {
  constructor(e) {
    (this.container = e), (this._heartbeatsCache = null);
    const n = this.container.getProvider("app").getImmediate();
    (this._storage = new QC(n)),
      (this._heartbeatsCachePromise = this._storage
        .read()
        .then((r) => ((this._heartbeatsCache = r), r)));
  }
  async triggerHeartbeat() {
    const n = this.container
        .getProvider("platform-logger")
        .getImmediate()
        .getPlatformInfoString(),
      r = Xh();
    if (
      (this._heartbeatsCache === null &&
        (this._heartbeatsCache = await this._heartbeatsCachePromise),
      !(
        this._heartbeatsCache.lastSentHeartbeatDate === r ||
        this._heartbeatsCache.heartbeats.some((s) => s.date === r)
      ))
    )
      return (
        this._heartbeatsCache.heartbeats.push({ date: r, agent: n }),
        (this._heartbeatsCache.heartbeats =
          this._heartbeatsCache.heartbeats.filter((s) => {
            const i = new Date(s.date).valueOf();
            return Date.now() - i <= VC;
          })),
        this._storage.overwrite(this._heartbeatsCache)
      );
  }
  async getHeartbeatsHeader() {
    if (
      (this._heartbeatsCache === null && (await this._heartbeatsCachePromise),
      this._heartbeatsCache === null ||
        this._heartbeatsCache.heartbeats.length === 0)
    )
      return "";
    const e = Xh(),
      { heartbeatsToSend: n, unsentEntries: r } = KC(
        this._heartbeatsCache.heartbeats
      ),
      s = Fo(JSON.stringify({ version: 2, heartbeats: n }));
    return (
      (this._heartbeatsCache.lastSentHeartbeatDate = e),
      r.length > 0
        ? ((this._heartbeatsCache.heartbeats = r),
          await this._storage.overwrite(this._heartbeatsCache))
        : ((this._heartbeatsCache.heartbeats = []),
          this._storage.overwrite(this._heartbeatsCache)),
      s
    );
  }
}
function Xh() {
  return new Date().toISOString().substring(0, 10);
}
function KC(t, e = GC) {
  const n = [];
  let r = t.slice();
  for (const s of t) {
    const i = n.find((o) => o.agent === s.agent);
    if (i) {
      if ((i.dates.push(s.date), Jh(n) > e)) {
        i.dates.pop();
        break;
      }
    } else if ((n.push({ agent: s.agent, dates: [s.date] }), Jh(n) > e)) {
      n.pop();
      break;
    }
    r = r.slice(1);
  }
  return { heartbeatsToSend: n, unsentEntries: r };
}
class QC {
  constructor(e) {
    (this.app = e),
      (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck());
  }
  async runIndexedDBEnvironmentCheck() {
    return Aw()
      ? jw()
          .then(() => !0)
          .catch(() => !1)
      : !1;
  }
  async read() {
    return (await this._canUseIndexedDBPromise)
      ? (await WC(this.app)) || { heartbeats: [] }
      : { heartbeats: [] };
  }
  async overwrite(e) {
    var n;
    if (await this._canUseIndexedDBPromise) {
      const s = await this.read();
      return qh(this.app, {
        lastSentHeartbeatDate:
          (n = e.lastSentHeartbeatDate) !== null && n !== void 0
            ? n
            : s.lastSentHeartbeatDate,
        heartbeats: e.heartbeats,
      });
    } else return;
  }
  async add(e) {
    var n;
    if (await this._canUseIndexedDBPromise) {
      const s = await this.read();
      return qh(this.app, {
        lastSentHeartbeatDate:
          (n = e.lastSentHeartbeatDate) !== null && n !== void 0
            ? n
            : s.lastSentHeartbeatDate,
        heartbeats: [...s.heartbeats, ...e.heartbeats],
      });
    } else return;
  }
}
function Jh(t) {
  return Fo(JSON.stringify({ version: 2, heartbeats: t })).length;
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function qC(t) {
  zo(new ci("platform-logger", (e) => new aC(e), "PRIVATE")),
    zo(new ci("heartbeat", (e) => new YC(e), "PRIVATE")),
    Lr(Ec, Qh, t),
    Lr(Ec, Qh, "esm2017"),
    Lr("fire-js", "");
}
qC("");
const Zh = "@firebase/database",
  ef = "0.14.4";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let Ng = "";
function XC(t) {
  Ng = t;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class JC {
  constructor(e) {
    (this.domStorage_ = e), (this.prefix_ = "firebase:");
  }
  set(e, n) {
    n == null
      ? this.domStorage_.removeItem(this.prefixedName_(e))
      : this.domStorage_.setItem(this.prefixedName_(e), Ie(n));
  }
  get(e) {
    const n = this.domStorage_.getItem(this.prefixedName_(e));
    return n == null ? null : ai(n);
  }
  remove(e) {
    this.domStorage_.removeItem(this.prefixedName_(e));
  }
  prefixedName_(e) {
    return this.prefix_ + e;
  }
  toString() {
    return this.domStorage_.toString();
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ZC {
  constructor() {
    (this.cache_ = {}), (this.isInMemoryStorage = !0);
  }
  set(e, n) {
    n == null ? delete this.cache_[e] : (this.cache_[e] = n);
  }
  get(e) {
    return zt(this.cache_, e) ? this.cache_[e] : null;
  }
  remove(e) {
    delete this.cache_[e];
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Tg = function (t) {
    try {
      if (typeof window < "u" && typeof window[t] < "u") {
        const e = window[t];
        return (
          e.setItem("firebase:sentinel", "cache"),
          e.removeItem("firebase:sentinel"),
          new JC(e)
        );
      }
    } catch {}
    return new ZC();
  },
  Vn = Tg("localStorage"),
  Nc = Tg("sessionStorage");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const $r = new _g("@firebase/database"),
  eE = (function () {
    let t = 1;
    return function () {
      return t++;
    };
  })(),
  kg = function (t) {
    const e = zw(t),
      n = new Bw();
    n.update(e);
    const r = n.digest();
    return Mu.encodeByteArray(r);
  },
  Ti = function (...t) {
    let e = "";
    for (let n = 0; n < t.length; n++) {
      const r = t[n];
      Array.isArray(r) ||
      (r && typeof r == "object" && typeof r.length == "number")
        ? (e += Ti.apply(null, r))
        : typeof r == "object"
        ? (e += Ie(r))
        : (e += r),
        (e += " ");
    }
    return e;
  };
let qn = null,
  tf = !0;
const tE = function (t, e) {
    b(!e || t === !0 || t === !1, "Can't turn on custom loggers persistently."),
      t === !0
        ? (($r.logLevel = ae.VERBOSE),
          (qn = $r.log.bind($r)),
          e && Nc.set("logging_enabled", !0))
        : typeof t == "function"
        ? (qn = t)
        : ((qn = null), Nc.remove("logging_enabled"));
  },
  Ue = function (...t) {
    if (
      (tf === !0 &&
        ((tf = !1), qn === null && Nc.get("logging_enabled") === !0 && tE(!0)),
      qn)
    ) {
      const e = Ti.apply(null, t);
      qn(e);
    }
  },
  ki = function (t) {
    return function (...e) {
      Ue(t, ...e);
    };
  },
  Tc = function (...t) {
    const e = "FIREBASE INTERNAL ERROR: " + Ti(...t);
    $r.error(e);
  },
  sn = function (...t) {
    const e = `FIREBASE FATAL ERROR: ${Ti(...t)}`;
    throw ($r.error(e), new Error(e));
  },
  Xe = function (...t) {
    const e = "FIREBASE WARNING: " + Ti(...t);
    $r.warn(e);
  },
  nE = function () {
    typeof window < "u" &&
      window.location &&
      window.location.protocol &&
      window.location.protocol.indexOf("https:") !== -1 &&
      Xe(
        "Insecure Firebase access from a secure page. Please use https in calls to new Firebase()."
      );
  },
  Lu = function (t) {
    return (
      typeof t == "number" &&
      (t !== t ||
        t === Number.POSITIVE_INFINITY ||
        t === Number.NEGATIVE_INFINITY)
    );
  },
  rE = function (t) {
    if (document.readyState === "complete") t();
    else {
      let e = !1;
      const n = function () {
        if (!document.body) {
          setTimeout(n, Math.floor(10));
          return;
        }
        e || ((e = !0), t());
      };
      document.addEventListener
        ? (document.addEventListener("DOMContentLoaded", n, !1),
          window.addEventListener("load", n, !1))
        : document.attachEvent &&
          (document.attachEvent("onreadystatechange", () => {
            document.readyState === "complete" && n();
          }),
          window.attachEvent("onload", n));
    }
  },
  Qr = "[MIN_NAME]",
  rr = "[MAX_NAME]",
  dr = function (t, e) {
    if (t === e) return 0;
    if (t === Qr || e === rr) return -1;
    if (e === Qr || t === rr) return 1;
    {
      const n = nf(t),
        r = nf(e);
      return n !== null
        ? r !== null
          ? n - r === 0
            ? t.length - e.length
            : n - r
          : -1
        : r !== null
        ? 1
        : t < e
        ? -1
        : 1;
    }
  },
  sE = function (t, e) {
    return t === e ? 0 : t < e ? -1 : 1;
  },
  Es = function (t, e) {
    if (e && t in e) return e[t];
    throw new Error("Missing required key (" + t + ") in object: " + Ie(e));
  },
  $u = function (t) {
    if (typeof t != "object" || t === null) return Ie(t);
    const e = [];
    for (const r in t) e.push(r);
    e.sort();
    let n = "{";
    for (let r = 0; r < e.length; r++)
      r !== 0 && (n += ","), (n += Ie(e[r])), (n += ":"), (n += $u(t[e[r]]));
    return (n += "}"), n;
  },
  Rg = function (t, e) {
    const n = t.length;
    if (n <= e) return [t];
    const r = [];
    for (let s = 0; s < n; s += e)
      s + e > n ? r.push(t.substring(s, n)) : r.push(t.substring(s, s + e));
    return r;
  };
function He(t, e) {
  for (const n in t) t.hasOwnProperty(n) && e(n, t[n]);
}
const Pg = function (t) {
    b(!Lu(t), "Invalid JSON number");
    const e = 11,
      n = 52,
      r = (1 << (e - 1)) - 1;
    let s, i, o, l, a;
    t === 0
      ? ((i = 0), (o = 0), (s = 1 / t === -1 / 0 ? 1 : 0))
      : ((s = t < 0),
        (t = Math.abs(t)),
        t >= Math.pow(2, 1 - r)
          ? ((l = Math.min(Math.floor(Math.log(t) / Math.LN2), r)),
            (i = l + r),
            (o = Math.round(t * Math.pow(2, n - l) - Math.pow(2, n))))
          : ((i = 0), (o = Math.round(t / Math.pow(2, 1 - r - n)))));
    const c = [];
    for (a = n; a; a -= 1) c.push(o % 2 ? 1 : 0), (o = Math.floor(o / 2));
    for (a = e; a; a -= 1) c.push(i % 2 ? 1 : 0), (i = Math.floor(i / 2));
    c.push(s ? 1 : 0), c.reverse();
    const d = c.join("");
    let h = "";
    for (a = 0; a < 64; a += 8) {
      let f = parseInt(d.substr(a, 8), 2).toString(16);
      f.length === 1 && (f = "0" + f), (h = h + f);
    }
    return h.toLowerCase();
  },
  iE = function () {
    return !!(
      typeof window == "object" &&
      window.chrome &&
      window.chrome.extension &&
      !/^chrome/.test(window.location.href)
    );
  },
  oE = function () {
    return typeof Windows == "object" && typeof Windows.UI == "object";
  };
function lE(t, e) {
  let n = "Unknown Error";
  t === "too_big"
    ? (n =
        "The data requested exceeds the maximum size that can be accessed with a single request.")
    : t === "permission_denied"
    ? (n = "Client doesn't have permission to access the desired data.")
    : t === "unavailable" && (n = "The service is unavailable");
  const r = new Error(t + " at " + e._path.toString() + ": " + n);
  return (r.code = t.toUpperCase()), r;
}
const aE = new RegExp("^-?(0*)\\d{1,10}$"),
  cE = -2147483648,
  uE = 2147483647,
  nf = function (t) {
    if (aE.test(t)) {
      const e = Number(t);
      if (e >= cE && e <= uE) return e;
    }
    return null;
  },
  as = function (t) {
    try {
      t();
    } catch (e) {
      setTimeout(() => {
        const n = e.stack || "";
        throw (Xe("Exception was thrown by user callback.", n), e);
      }, Math.floor(0));
    }
  },
  dE = function () {
    return (
      (
        (typeof window == "object" &&
          window.navigator &&
          window.navigator.userAgent) ||
        ""
      ).search(
        /googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i
      ) >= 0
    );
  },
  Fs = function (t, e) {
    const n = setTimeout(t, e);
    return (
      typeof n == "number" && typeof Deno < "u" && Deno.unrefTimer
        ? Deno.unrefTimer(n)
        : typeof n == "object" && n.unref && n.unref(),
      n
    );
  };
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class hE {
  constructor(e, n) {
    (this.appName_ = e),
      (this.appCheckProvider = n),
      (this.appCheck = n == null ? void 0 : n.getImmediate({ optional: !0 })),
      this.appCheck || n == null || n.get().then((r) => (this.appCheck = r));
  }
  getToken(e) {
    return this.appCheck
      ? this.appCheck.getToken(e)
      : new Promise((n, r) => {
          setTimeout(() => {
            this.appCheck ? this.getToken(e).then(n, r) : n(null);
          }, 0);
        });
  }
  addTokenChangeListener(e) {
    var n;
    (n = this.appCheckProvider) === null ||
      n === void 0 ||
      n.get().then((r) => r.addTokenListener(e));
  }
  notifyForInvalidToken() {
    Xe(
      `Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class fE {
  constructor(e, n, r) {
    (this.appName_ = e),
      (this.firebaseOptions_ = n),
      (this.authProvider_ = r),
      (this.auth_ = null),
      (this.auth_ = r.getImmediate({ optional: !0 })),
      this.auth_ || r.onInit((s) => (this.auth_ = s));
  }
  getToken(e) {
    return this.auth_
      ? this.auth_
          .getToken(e)
          .catch((n) =>
            n && n.code === "auth/token-not-initialized"
              ? (Ue(
                  "Got auth/token-not-initialized error.  Treating as null token."
                ),
                null)
              : Promise.reject(n)
          )
      : new Promise((n, r) => {
          setTimeout(() => {
            this.auth_ ? this.getToken(e).then(n, r) : n(null);
          }, 0);
        });
  }
  addTokenChangeListener(e) {
    this.auth_
      ? this.auth_.addAuthTokenListener(e)
      : this.authProvider_.get().then((n) => n.addAuthTokenListener(e));
  }
  removeTokenChangeListener(e) {
    this.authProvider_.get().then((n) => n.removeAuthTokenListener(e));
  }
  notifyForInvalidToken() {
    let e =
      'Provided authentication credentials for the app named "' +
      this.appName_ +
      '" are invalid. This usually indicates your app was not initialized correctly. ';
    "credential" in this.firebaseOptions_
      ? (e +=
          'Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.')
      : "serviceAccount" in this.firebaseOptions_
      ? (e +=
          'Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.')
      : (e +=
          'Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.'),
      Xe(e);
  }
}
class Fr {
  constructor(e) {
    this.accessToken = e;
  }
  getToken(e) {
    return Promise.resolve({ accessToken: this.accessToken });
  }
  addTokenChangeListener(e) {
    e(this.accessToken);
  }
  removeTokenChangeListener(e) {}
  notifyForInvalidToken() {}
}
Fr.OWNER = "owner";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Fu = "5",
  Ig = "v",
  Og = "s",
  bg = "r",
  Ag = "f",
  jg =
    /(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,
  Mg = "ls",
  Dg = "p",
  kc = "ac",
  Lg = "websocket",
  $g = "long_polling";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Fg {
  constructor(e, n, r, s, i = !1, o = "", l = !1, a = !1) {
    (this.secure = n),
      (this.namespace = r),
      (this.webSocketOnly = s),
      (this.nodeAdmin = i),
      (this.persistenceKey = o),
      (this.includeNamespaceInQueryParams = l),
      (this.isUsingEmulator = a),
      (this._host = e.toLowerCase()),
      (this._domain = this._host.substr(this._host.indexOf(".") + 1)),
      (this.internalHost = Vn.get("host:" + e) || this._host);
  }
  isCacheableHost() {
    return this.internalHost.substr(0, 2) === "s-";
  }
  isCustomHost() {
    return (
      this._domain !== "firebaseio.com" &&
      this._domain !== "firebaseio-demo.com"
    );
  }
  get host() {
    return this._host;
  }
  set host(e) {
    e !== this.internalHost &&
      ((this.internalHost = e),
      this.isCacheableHost() &&
        Vn.set("host:" + this._host, this.internalHost));
  }
  toString() {
    let e = this.toURLString();
    return this.persistenceKey && (e += "<" + this.persistenceKey + ">"), e;
  }
  toURLString() {
    const e = this.secure ? "https://" : "http://",
      n = this.includeNamespaceInQueryParams ? `?ns=${this.namespace}` : "";
    return `${e}${this.host}/${n}`;
  }
}
function pE(t) {
  return (
    t.host !== t.internalHost ||
    t.isCustomHost() ||
    t.includeNamespaceInQueryParams
  );
}
function Ug(t, e, n) {
  b(typeof e == "string", "typeof type must == string"),
    b(typeof n == "object", "typeof params must == object");
  let r;
  if (e === Lg) r = (t.secure ? "wss://" : "ws://") + t.internalHost + "/.ws?";
  else if (e === $g)
    r = (t.secure ? "https://" : "http://") + t.internalHost + "/.lp?";
  else throw new Error("Unknown connection type: " + e);
  pE(t) && (n.ns = t.namespace);
  const s = [];
  return (
    He(n, (i, o) => {
      s.push(i + "=" + o);
    }),
    r + s.join("&")
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class mE {
  constructor() {
    this.counters_ = {};
  }
  incrementCounter(e, n = 1) {
    zt(this.counters_, e) || (this.counters_[e] = 0), (this.counters_[e] += n);
  }
  get() {
    return Ew(this.counters_);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const ga = {},
  ya = {};
function Uu(t) {
  const e = t.toString();
  return ga[e] || (ga[e] = new mE()), ga[e];
}
function gE(t, e) {
  const n = t.toString();
  return ya[n] || (ya[n] = e()), ya[n];
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class yE {
  constructor(e) {
    (this.onMessage_ = e),
      (this.pendingResponses = []),
      (this.currentResponseNum = 0),
      (this.closeAfterResponse = -1),
      (this.onClose = null);
  }
  closeAfter(e, n) {
    (this.closeAfterResponse = e),
      (this.onClose = n),
      this.closeAfterResponse < this.currentResponseNum &&
        (this.onClose(), (this.onClose = null));
  }
  handleResponse(e, n) {
    for (
      this.pendingResponses[e] = n;
      this.pendingResponses[this.currentResponseNum];

    ) {
      const r = this.pendingResponses[this.currentResponseNum];
      delete this.pendingResponses[this.currentResponseNum];
      for (let s = 0; s < r.length; ++s)
        r[s] &&
          as(() => {
            this.onMessage_(r[s]);
          });
      if (this.currentResponseNum === this.closeAfterResponse) {
        this.onClose && (this.onClose(), (this.onClose = null));
        break;
      }
      this.currentResponseNum++;
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const rf = "start",
  vE = "close",
  _E = "pLPCommand",
  wE = "pRTLPCB",
  Bg = "id",
  zg = "pw",
  Hg = "ser",
  CE = "cb",
  EE = "seg",
  SE = "ts",
  xE = "d",
  NE = "dframe",
  Wg = 1870,
  Gg = 30,
  TE = Wg - Gg,
  kE = 25e3,
  RE = 3e4;
class Ir {
  constructor(e, n, r, s, i, o, l) {
    (this.connId = e),
      (this.repoInfo = n),
      (this.applicationId = r),
      (this.appCheckToken = s),
      (this.authToken = i),
      (this.transportSessionId = o),
      (this.lastSessionId = l),
      (this.bytesSent = 0),
      (this.bytesReceived = 0),
      (this.everConnected_ = !1),
      (this.log_ = ki(e)),
      (this.stats_ = Uu(n)),
      (this.urlFn = (a) => (
        this.appCheckToken && (a[kc] = this.appCheckToken), Ug(n, $g, a)
      ));
  }
  open(e, n) {
    (this.curSegmentNum = 0),
      (this.onDisconnect_ = n),
      (this.myPacketOrderer = new yE(e)),
      (this.isClosed_ = !1),
      (this.connectTimeoutTimer_ = setTimeout(() => {
        this.log_("Timed out trying to connect."),
          this.onClosed_(),
          (this.connectTimeoutTimer_ = null);
      }, Math.floor(RE))),
      rE(() => {
        if (this.isClosed_) return;
        this.scriptTagHolder = new Bu(
          (...i) => {
            const [o, l, a, c, d] = i;
            if ((this.incrementIncomingBytes_(i), !!this.scriptTagHolder))
              if (
                (this.connectTimeoutTimer_ &&
                  (clearTimeout(this.connectTimeoutTimer_),
                  (this.connectTimeoutTimer_ = null)),
                (this.everConnected_ = !0),
                o === rf)
              )
                (this.id = l), (this.password = a);
              else if (o === vE)
                l
                  ? ((this.scriptTagHolder.sendNewPolls = !1),
                    this.myPacketOrderer.closeAfter(l, () => {
                      this.onClosed_();
                    }))
                  : this.onClosed_();
              else throw new Error("Unrecognized command received: " + o);
          },
          (...i) => {
            const [o, l] = i;
            this.incrementIncomingBytes_(i),
              this.myPacketOrderer.handleResponse(o, l);
          },
          () => {
            this.onClosed_();
          },
          this.urlFn
        );
        const r = {};
        (r[rf] = "t"),
          (r[Hg] = Math.floor(Math.random() * 1e8)),
          this.scriptTagHolder.uniqueCallbackIdentifier &&
            (r[CE] = this.scriptTagHolder.uniqueCallbackIdentifier),
          (r[Ig] = Fu),
          this.transportSessionId && (r[Og] = this.transportSessionId),
          this.lastSessionId && (r[Mg] = this.lastSessionId),
          this.applicationId && (r[Dg] = this.applicationId),
          this.appCheckToken && (r[kc] = this.appCheckToken),
          typeof location < "u" &&
            location.hostname &&
            jg.test(location.hostname) &&
            (r[bg] = Ag);
        const s = this.urlFn(r);
        this.log_("Connecting via long-poll to " + s),
          this.scriptTagHolder.addTag(s, () => {});
      });
  }
  start() {
    this.scriptTagHolder.startLongPoll(this.id, this.password),
      this.addDisconnectPingFrame(this.id, this.password);
  }
  static forceAllow() {
    Ir.forceAllow_ = !0;
  }
  static forceDisallow() {
    Ir.forceDisallow_ = !0;
  }
  static isAvailable() {
    return Ir.forceAllow_
      ? !0
      : !Ir.forceDisallow_ &&
          typeof document < "u" &&
          document.createElement != null &&
          !iE() &&
          !oE();
  }
  markConnectionHealthy() {}
  shutdown_() {
    (this.isClosed_ = !0),
      this.scriptTagHolder &&
        (this.scriptTagHolder.close(), (this.scriptTagHolder = null)),
      this.myDisconnFrame &&
        (document.body.removeChild(this.myDisconnFrame),
        (this.myDisconnFrame = null)),
      this.connectTimeoutTimer_ &&
        (clearTimeout(this.connectTimeoutTimer_),
        (this.connectTimeoutTimer_ = null));
  }
  onClosed_() {
    this.isClosed_ ||
      (this.log_("Longpoll is closing itself"),
      this.shutdown_(),
      this.onDisconnect_ &&
        (this.onDisconnect_(this.everConnected_), (this.onDisconnect_ = null)));
  }
  close() {
    this.isClosed_ ||
      (this.log_("Longpoll is being closed."), this.shutdown_());
  }
  send(e) {
    const n = Ie(e);
    (this.bytesSent += n.length),
      this.stats_.incrementCounter("bytes_sent", n.length);
    const r = dg(n),
      s = Rg(r, TE);
    for (let i = 0; i < s.length; i++)
      this.scriptTagHolder.enqueueSegment(this.curSegmentNum, s.length, s[i]),
        this.curSegmentNum++;
  }
  addDisconnectPingFrame(e, n) {
    this.myDisconnFrame = document.createElement("iframe");
    const r = {};
    (r[NE] = "t"),
      (r[Bg] = e),
      (r[zg] = n),
      (this.myDisconnFrame.src = this.urlFn(r)),
      (this.myDisconnFrame.style.display = "none"),
      document.body.appendChild(this.myDisconnFrame);
  }
  incrementIncomingBytes_(e) {
    const n = Ie(e).length;
    (this.bytesReceived += n),
      this.stats_.incrementCounter("bytes_received", n);
  }
}
class Bu {
  constructor(e, n, r, s) {
    (this.onDisconnect = r),
      (this.urlFn = s),
      (this.outstandingRequests = new Set()),
      (this.pendingSegs = []),
      (this.currentSerial = Math.floor(Math.random() * 1e8)),
      (this.sendNewPolls = !0);
    {
      (this.uniqueCallbackIdentifier = eE()),
        (window[_E + this.uniqueCallbackIdentifier] = e),
        (window[wE + this.uniqueCallbackIdentifier] = n),
        (this.myIFrame = Bu.createIFrame_());
      let i = "";
      this.myIFrame.src &&
        this.myIFrame.src.substr(0, 11) === "javascript:" &&
        (i = '<script>document.domain="' + document.domain + '";</script>');
      const o = "<html><body>" + i + "</body></html>";
      try {
        this.myIFrame.doc.open(),
          this.myIFrame.doc.write(o),
          this.myIFrame.doc.close();
      } catch (l) {
        Ue("frame writing exception"), l.stack && Ue(l.stack), Ue(l);
      }
    }
  }
  static createIFrame_() {
    const e = document.createElement("iframe");
    if (((e.style.display = "none"), document.body)) {
      document.body.appendChild(e);
      try {
        e.contentWindow.document || Ue("No IE domain setting required");
      } catch {
        const r = document.domain;
        e.src =
          "javascript:void((function(){document.open();document.domain='" +
          r +
          "';document.close();})())";
      }
    } else
      throw "Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
    return (
      e.contentDocument
        ? (e.doc = e.contentDocument)
        : e.contentWindow
        ? (e.doc = e.contentWindow.document)
        : e.document && (e.doc = e.document),
      e
    );
  }
  close() {
    (this.alive = !1),
      this.myIFrame &&
        ((this.myIFrame.doc.body.textContent = ""),
        setTimeout(() => {
          this.myIFrame !== null &&
            (document.body.removeChild(this.myIFrame), (this.myIFrame = null));
        }, Math.floor(0)));
    const e = this.onDisconnect;
    e && ((this.onDisconnect = null), e());
  }
  startLongPoll(e, n) {
    for (this.myID = e, this.myPW = n, this.alive = !0; this.newRequest_(); );
  }
  newRequest_() {
    if (
      this.alive &&
      this.sendNewPolls &&
      this.outstandingRequests.size < (this.pendingSegs.length > 0 ? 2 : 1)
    ) {
      this.currentSerial++;
      const e = {};
      (e[Bg] = this.myID), (e[zg] = this.myPW), (e[Hg] = this.currentSerial);
      let n = this.urlFn(e),
        r = "",
        s = 0;
      for (
        ;
        this.pendingSegs.length > 0 &&
        this.pendingSegs[0].d.length + Gg + r.length <= Wg;

      ) {
        const o = this.pendingSegs.shift();
        (r =
          r +
          "&" +
          EE +
          s +
          "=" +
          o.seg +
          "&" +
          SE +
          s +
          "=" +
          o.ts +
          "&" +
          xE +
          s +
          "=" +
          o.d),
          s++;
      }
      return (n = n + r), this.addLongPollTag_(n, this.currentSerial), !0;
    } else return !1;
  }
  enqueueSegment(e, n, r) {
    this.pendingSegs.push({ seg: e, ts: n, d: r }),
      this.alive && this.newRequest_();
  }
  addLongPollTag_(e, n) {
    this.outstandingRequests.add(n);
    const r = () => {
        this.outstandingRequests.delete(n), this.newRequest_();
      },
      s = setTimeout(r, Math.floor(kE)),
      i = () => {
        clearTimeout(s), r();
      };
    this.addTag(e, i);
  }
  addTag(e, n) {
    setTimeout(() => {
      try {
        if (!this.sendNewPolls) return;
        const r = this.myIFrame.doc.createElement("script");
        (r.type = "text/javascript"),
          (r.async = !0),
          (r.src = e),
          (r.onload = r.onreadystatechange =
            function () {
              const s = r.readyState;
              (!s || s === "loaded" || s === "complete") &&
                ((r.onload = r.onreadystatechange = null),
                r.parentNode && r.parentNode.removeChild(r),
                n());
            }),
          (r.onerror = () => {
            Ue("Long-poll script failed to load: " + e),
              (this.sendNewPolls = !1),
              this.close();
          }),
          this.myIFrame.doc.body.appendChild(r);
      } catch {}
    }, Math.floor(1));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const PE = 16384,
  IE = 45e3;
let Ho = null;
typeof MozWebSocket < "u"
  ? (Ho = MozWebSocket)
  : typeof WebSocket < "u" && (Ho = WebSocket);
class Rt {
  constructor(e, n, r, s, i, o, l) {
    (this.connId = e),
      (this.applicationId = r),
      (this.appCheckToken = s),
      (this.authToken = i),
      (this.keepaliveTimer = null),
      (this.frames = null),
      (this.totalFrames = 0),
      (this.bytesSent = 0),
      (this.bytesReceived = 0),
      (this.log_ = ki(this.connId)),
      (this.stats_ = Uu(n)),
      (this.connURL = Rt.connectionURL_(n, o, l, s, r)),
      (this.nodeAdmin = n.nodeAdmin);
  }
  static connectionURL_(e, n, r, s, i) {
    const o = {};
    return (
      (o[Ig] = Fu),
      typeof location < "u" &&
        location.hostname &&
        jg.test(location.hostname) &&
        (o[bg] = Ag),
      n && (o[Og] = n),
      r && (o[Mg] = r),
      s && (o[kc] = s),
      i && (o[Dg] = i),
      Ug(e, Lg, o)
    );
  }
  open(e, n) {
    (this.onDisconnect = n),
      (this.onMessage = e),
      this.log_("Websocket connecting to " + this.connURL),
      (this.everConnected_ = !1),
      Vn.set("previous_websocket_failure", !0);
    try {
      let r;
      gg(), (this.mySock = new Ho(this.connURL, [], r));
    } catch (r) {
      this.log_("Error instantiating WebSocket.");
      const s = r.message || r.data;
      s && this.log_(s), this.onClosed_();
      return;
    }
    (this.mySock.onopen = () => {
      this.log_("Websocket connected."), (this.everConnected_ = !0);
    }),
      (this.mySock.onclose = () => {
        this.log_("Websocket connection was disconnected."),
          (this.mySock = null),
          this.onClosed_();
      }),
      (this.mySock.onmessage = (r) => {
        this.handleIncomingFrame(r);
      }),
      (this.mySock.onerror = (r) => {
        this.log_("WebSocket error.  Closing connection.");
        const s = r.message || r.data;
        s && this.log_(s), this.onClosed_();
      });
  }
  start() {}
  static forceDisallow() {
    Rt.forceDisallow_ = !0;
  }
  static isAvailable() {
    let e = !1;
    if (typeof navigator < "u" && navigator.userAgent) {
      const n = /Android ([0-9]{0,}\.[0-9]{0,})/,
        r = navigator.userAgent.match(n);
      r && r.length > 1 && parseFloat(r[1]) < 4.4 && (e = !0);
    }
    return !e && Ho !== null && !Rt.forceDisallow_;
  }
  static previouslyFailed() {
    return Vn.isInMemoryStorage || Vn.get("previous_websocket_failure") === !0;
  }
  markConnectionHealthy() {
    Vn.remove("previous_websocket_failure");
  }
  appendFrame_(e) {
    if ((this.frames.push(e), this.frames.length === this.totalFrames)) {
      const n = this.frames.join("");
      this.frames = null;
      const r = ai(n);
      this.onMessage(r);
    }
  }
  handleNewFrameCount_(e) {
    (this.totalFrames = e), (this.frames = []);
  }
  extractFrameCount_(e) {
    if (
      (b(this.frames === null, "We already have a frame buffer"), e.length <= 6)
    ) {
      const n = Number(e);
      if (!isNaN(n)) return this.handleNewFrameCount_(n), null;
    }
    return this.handleNewFrameCount_(1), e;
  }
  handleIncomingFrame(e) {
    if (this.mySock === null) return;
    const n = e.data;
    if (
      ((this.bytesReceived += n.length),
      this.stats_.incrementCounter("bytes_received", n.length),
      this.resetKeepAlive(),
      this.frames !== null)
    )
      this.appendFrame_(n);
    else {
      const r = this.extractFrameCount_(n);
      r !== null && this.appendFrame_(r);
    }
  }
  send(e) {
    this.resetKeepAlive();
    const n = Ie(e);
    (this.bytesSent += n.length),
      this.stats_.incrementCounter("bytes_sent", n.length);
    const r = Rg(n, PE);
    r.length > 1 && this.sendString_(String(r.length));
    for (let s = 0; s < r.length; s++) this.sendString_(r[s]);
  }
  shutdown_() {
    (this.isClosed_ = !0),
      this.keepaliveTimer &&
        (clearInterval(this.keepaliveTimer), (this.keepaliveTimer = null)),
      this.mySock && (this.mySock.close(), (this.mySock = null));
  }
  onClosed_() {
    this.isClosed_ ||
      (this.log_("WebSocket is closing itself"),
      this.shutdown_(),
      this.onDisconnect &&
        (this.onDisconnect(this.everConnected_), (this.onDisconnect = null)));
  }
  close() {
    this.isClosed_ ||
      (this.log_("WebSocket is being closed"), this.shutdown_());
  }
  resetKeepAlive() {
    clearInterval(this.keepaliveTimer),
      (this.keepaliveTimer = setInterval(() => {
        this.mySock && this.sendString_("0"), this.resetKeepAlive();
      }, Math.floor(IE)));
  }
  sendString_(e) {
    try {
      this.mySock.send(e);
    } catch (n) {
      this.log_(
        "Exception thrown from WebSocket.send():",
        n.message || n.data,
        "Closing connection."
      ),
        setTimeout(this.onClosed_.bind(this), 0);
    }
  }
}
Rt.responsesRequiredToBeHealthy = 2;
Rt.healthyTimeout = 3e4;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class di {
  constructor(e) {
    this.initTransports_(e);
  }
  static get ALL_TRANSPORTS() {
    return [Ir, Rt];
  }
  static get IS_TRANSPORT_INITIALIZED() {
    return this.globalTransportInitialized_;
  }
  initTransports_(e) {
    const n = Rt && Rt.isAvailable();
    let r = n && !Rt.previouslyFailed();
    if (
      (e.webSocketOnly &&
        (n ||
          Xe(
            "wss:// URL used, but browser isn't known to support websockets.  Trying anyway."
          ),
        (r = !0)),
      r)
    )
      this.transports_ = [Rt];
    else {
      const s = (this.transports_ = []);
      for (const i of di.ALL_TRANSPORTS) i && i.isAvailable() && s.push(i);
      di.globalTransportInitialized_ = !0;
    }
  }
  initialTransport() {
    if (this.transports_.length > 0) return this.transports_[0];
    throw new Error("No transports available");
  }
  upgradeTransport() {
    return this.transports_.length > 1 ? this.transports_[1] : null;
  }
}
di.globalTransportInitialized_ = !1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const OE = 6e4,
  bE = 5e3,
  AE = 10 * 1024,
  jE = 100 * 1024,
  va = "t",
  sf = "d",
  ME = "s",
  of = "r",
  DE = "e",
  lf = "o",
  af = "a",
  cf = "n",
  uf = "p",
  LE = "h";
class $E {
  constructor(e, n, r, s, i, o, l, a, c, d) {
    (this.id = e),
      (this.repoInfo_ = n),
      (this.applicationId_ = r),
      (this.appCheckToken_ = s),
      (this.authToken_ = i),
      (this.onMessage_ = o),
      (this.onReady_ = l),
      (this.onDisconnect_ = a),
      (this.onKill_ = c),
      (this.lastSessionId = d),
      (this.connectionCount = 0),
      (this.pendingDataMessages = []),
      (this.state_ = 0),
      (this.log_ = ki("c:" + this.id + ":")),
      (this.transportManager_ = new di(n)),
      this.log_("Connection created"),
      this.start_();
  }
  start_() {
    const e = this.transportManager_.initialTransport();
    (this.conn_ = new e(
      this.nextTransportId_(),
      this.repoInfo_,
      this.applicationId_,
      this.appCheckToken_,
      this.authToken_,
      null,
      this.lastSessionId
    )),
      (this.primaryResponsesRequired_ = e.responsesRequiredToBeHealthy || 0);
    const n = this.connReceiver_(this.conn_),
      r = this.disconnReceiver_(this.conn_);
    (this.tx_ = this.conn_),
      (this.rx_ = this.conn_),
      (this.secondaryConn_ = null),
      (this.isHealthy_ = !1),
      setTimeout(() => {
        this.conn_ && this.conn_.open(n, r);
      }, Math.floor(0));
    const s = e.healthyTimeout || 0;
    s > 0 &&
      (this.healthyTimeout_ = Fs(() => {
        (this.healthyTimeout_ = null),
          this.isHealthy_ ||
            (this.conn_ && this.conn_.bytesReceived > jE
              ? (this.log_(
                  "Connection exceeded healthy timeout but has received " +
                    this.conn_.bytesReceived +
                    " bytes.  Marking connection healthy."
                ),
                (this.isHealthy_ = !0),
                this.conn_.markConnectionHealthy())
              : this.conn_ && this.conn_.bytesSent > AE
              ? this.log_(
                  "Connection exceeded healthy timeout but has sent " +
                    this.conn_.bytesSent +
                    " bytes.  Leaving connection alive."
                )
              : (this.log_("Closing unhealthy connection after timeout."),
                this.close()));
      }, Math.floor(s)));
  }
  nextTransportId_() {
    return "c:" + this.id + ":" + this.connectionCount++;
  }
  disconnReceiver_(e) {
    return (n) => {
      e === this.conn_
        ? this.onConnectionLost_(n)
        : e === this.secondaryConn_
        ? (this.log_("Secondary connection lost."),
          this.onSecondaryConnectionLost_())
        : this.log_("closing an old connection");
    };
  }
  connReceiver_(e) {
    return (n) => {
      this.state_ !== 2 &&
        (e === this.rx_
          ? this.onPrimaryMessageReceived_(n)
          : e === this.secondaryConn_
          ? this.onSecondaryMessageReceived_(n)
          : this.log_("message on old connection"));
    };
  }
  sendRequest(e) {
    const n = { t: "d", d: e };
    this.sendData_(n);
  }
  tryCleanupConnection() {
    this.tx_ === this.secondaryConn_ &&
      this.rx_ === this.secondaryConn_ &&
      (this.log_(
        "cleaning up and promoting a connection: " + this.secondaryConn_.connId
      ),
      (this.conn_ = this.secondaryConn_),
      (this.secondaryConn_ = null));
  }
  onSecondaryControl_(e) {
    if (va in e) {
      const n = e[va];
      n === af
        ? this.upgradeIfSecondaryHealthy_()
        : n === of
        ? (this.log_("Got a reset on secondary, closing it"),
          this.secondaryConn_.close(),
          (this.tx_ === this.secondaryConn_ ||
            this.rx_ === this.secondaryConn_) &&
            this.close())
        : n === lf &&
          (this.log_("got pong on secondary."),
          this.secondaryResponsesRequired_--,
          this.upgradeIfSecondaryHealthy_());
    }
  }
  onSecondaryMessageReceived_(e) {
    const n = Es("t", e),
      r = Es("d", e);
    if (n === "c") this.onSecondaryControl_(r);
    else if (n === "d") this.pendingDataMessages.push(r);
    else throw new Error("Unknown protocol layer: " + n);
  }
  upgradeIfSecondaryHealthy_() {
    this.secondaryResponsesRequired_ <= 0
      ? (this.log_("Secondary connection is healthy."),
        (this.isHealthy_ = !0),
        this.secondaryConn_.markConnectionHealthy(),
        this.proceedWithUpgrade_())
      : (this.log_("sending ping on secondary."),
        this.secondaryConn_.send({ t: "c", d: { t: uf, d: {} } }));
  }
  proceedWithUpgrade_() {
    this.secondaryConn_.start(),
      this.log_("sending client ack on secondary"),
      this.secondaryConn_.send({ t: "c", d: { t: af, d: {} } }),
      this.log_("Ending transmission on primary"),
      this.conn_.send({ t: "c", d: { t: cf, d: {} } }),
      (this.tx_ = this.secondaryConn_),
      this.tryCleanupConnection();
  }
  onPrimaryMessageReceived_(e) {
    const n = Es("t", e),
      r = Es("d", e);
    n === "c" ? this.onControl_(r) : n === "d" && this.onDataMessage_(r);
  }
  onDataMessage_(e) {
    this.onPrimaryResponse_(), this.onMessage_(e);
  }
  onPrimaryResponse_() {
    this.isHealthy_ ||
      (this.primaryResponsesRequired_--,
      this.primaryResponsesRequired_ <= 0 &&
        (this.log_("Primary connection is healthy."),
        (this.isHealthy_ = !0),
        this.conn_.markConnectionHealthy()));
  }
  onControl_(e) {
    const n = Es(va, e);
    if (sf in e) {
      const r = e[sf];
      if (n === LE) {
        const s = Object.assign({}, r);
        this.repoInfo_.isUsingEmulator && (s.h = this.repoInfo_.host),
          this.onHandshake_(s);
      } else if (n === cf) {
        this.log_("recvd end transmission on primary"),
          (this.rx_ = this.secondaryConn_);
        for (let s = 0; s < this.pendingDataMessages.length; ++s)
          this.onDataMessage_(this.pendingDataMessages[s]);
        (this.pendingDataMessages = []), this.tryCleanupConnection();
      } else
        n === ME
          ? this.onConnectionShutdown_(r)
          : n === of
          ? this.onReset_(r)
          : n === DE
          ? Tc("Server Error: " + r)
          : n === lf
          ? (this.log_("got pong on primary."),
            this.onPrimaryResponse_(),
            this.sendPingOnPrimaryIfNecessary_())
          : Tc("Unknown control packet command: " + n);
    }
  }
  onHandshake_(e) {
    const n = e.ts,
      r = e.v,
      s = e.h;
    (this.sessionId = e.s),
      (this.repoInfo_.host = s),
      this.state_ === 0 &&
        (this.conn_.start(),
        this.onConnectionEstablished_(this.conn_, n),
        Fu !== r && Xe("Protocol version mismatch detected"),
        this.tryStartUpgrade_());
  }
  tryStartUpgrade_() {
    const e = this.transportManager_.upgradeTransport();
    e && this.startUpgrade_(e);
  }
  startUpgrade_(e) {
    (this.secondaryConn_ = new e(
      this.nextTransportId_(),
      this.repoInfo_,
      this.applicationId_,
      this.appCheckToken_,
      this.authToken_,
      this.sessionId
    )),
      (this.secondaryResponsesRequired_ = e.responsesRequiredToBeHealthy || 0);
    const n = this.connReceiver_(this.secondaryConn_),
      r = this.disconnReceiver_(this.secondaryConn_);
    this.secondaryConn_.open(n, r),
      Fs(() => {
        this.secondaryConn_ &&
          (this.log_("Timed out trying to upgrade."),
          this.secondaryConn_.close());
      }, Math.floor(OE));
  }
  onReset_(e) {
    this.log_("Reset packet received.  New host: " + e),
      (this.repoInfo_.host = e),
      this.state_ === 1
        ? this.close()
        : (this.closeConnections_(), this.start_());
  }
  onConnectionEstablished_(e, n) {
    this.log_("Realtime connection established."),
      (this.conn_ = e),
      (this.state_ = 1),
      this.onReady_ &&
        (this.onReady_(n, this.sessionId), (this.onReady_ = null)),
      this.primaryResponsesRequired_ === 0
        ? (this.log_("Primary connection is healthy."), (this.isHealthy_ = !0))
        : Fs(() => {
            this.sendPingOnPrimaryIfNecessary_();
          }, Math.floor(bE));
  }
  sendPingOnPrimaryIfNecessary_() {
    !this.isHealthy_ &&
      this.state_ === 1 &&
      (this.log_("sending ping on primary."),
      this.sendData_({ t: "c", d: { t: uf, d: {} } }));
  }
  onSecondaryConnectionLost_() {
    const e = this.secondaryConn_;
    (this.secondaryConn_ = null),
      (this.tx_ === e || this.rx_ === e) && this.close();
  }
  onConnectionLost_(e) {
    (this.conn_ = null),
      !e && this.state_ === 0
        ? (this.log_("Realtime connection failed."),
          this.repoInfo_.isCacheableHost() &&
            (Vn.remove("host:" + this.repoInfo_.host),
            (this.repoInfo_.internalHost = this.repoInfo_.host)))
        : this.state_ === 1 && this.log_("Realtime connection lost."),
      this.close();
  }
  onConnectionShutdown_(e) {
    this.log_("Connection shutdown command received. Shutting down..."),
      this.onKill_ && (this.onKill_(e), (this.onKill_ = null)),
      (this.onDisconnect_ = null),
      this.close();
  }
  sendData_(e) {
    if (this.state_ !== 1) throw "Connection is not connected";
    this.tx_.send(e);
  }
  close() {
    this.state_ !== 2 &&
      (this.log_("Closing realtime connection."),
      (this.state_ = 2),
      this.closeConnections_(),
      this.onDisconnect_ &&
        (this.onDisconnect_(), (this.onDisconnect_ = null)));
  }
  closeConnections_() {
    this.log_("Shutting down all connections"),
      this.conn_ && (this.conn_.close(), (this.conn_ = null)),
      this.secondaryConn_ &&
        (this.secondaryConn_.close(), (this.secondaryConn_ = null)),
      this.healthyTimeout_ &&
        (clearTimeout(this.healthyTimeout_), (this.healthyTimeout_ = null));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Vg {
  put(e, n, r, s) {}
  merge(e, n, r, s) {}
  refreshAuthToken(e) {}
  refreshAppCheckToken(e) {}
  onDisconnectPut(e, n, r) {}
  onDisconnectMerge(e, n, r) {}
  onDisconnectCancel(e, n) {}
  reportStats(e) {}
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Yg {
  constructor(e) {
    (this.allowedEvents_ = e),
      (this.listeners_ = {}),
      b(Array.isArray(e) && e.length > 0, "Requires a non-empty array");
  }
  trigger(e, ...n) {
    if (Array.isArray(this.listeners_[e])) {
      const r = [...this.listeners_[e]];
      for (let s = 0; s < r.length; s++) r[s].callback.apply(r[s].context, n);
    }
  }
  on(e, n, r) {
    this.validateEventType_(e),
      (this.listeners_[e] = this.listeners_[e] || []),
      this.listeners_[e].push({ callback: n, context: r });
    const s = this.getInitialEvent(e);
    s && n.apply(r, s);
  }
  off(e, n, r) {
    this.validateEventType_(e);
    const s = this.listeners_[e] || [];
    for (let i = 0; i < s.length; i++)
      if (s[i].callback === n && (!r || r === s[i].context)) {
        s.splice(i, 1);
        return;
      }
  }
  validateEventType_(e) {
    b(
      this.allowedEvents_.find((n) => n === e),
      "Unknown event: " + e
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Wo extends Yg {
  constructor() {
    super(["online"]),
      (this.online_ = !0),
      typeof window < "u" &&
        typeof window.addEventListener < "u" &&
        !mg() &&
        (window.addEventListener(
          "online",
          () => {
            this.online_ || ((this.online_ = !0), this.trigger("online", !0));
          },
          !1
        ),
        window.addEventListener(
          "offline",
          () => {
            this.online_ && ((this.online_ = !1), this.trigger("online", !1));
          },
          !1
        ));
  }
  static getInstance() {
    return new Wo();
  }
  getInitialEvent(e) {
    return b(e === "online", "Unknown event type: " + e), [this.online_];
  }
  currentlyOnline() {
    return this.online_;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const df = 32,
  hf = 768;
class ie {
  constructor(e, n) {
    if (n === void 0) {
      this.pieces_ = e.split("/");
      let r = 0;
      for (let s = 0; s < this.pieces_.length; s++)
        this.pieces_[s].length > 0 &&
          ((this.pieces_[r] = this.pieces_[s]), r++);
      (this.pieces_.length = r), (this.pieceNum_ = 0);
    } else (this.pieces_ = e), (this.pieceNum_ = n);
  }
  toString() {
    let e = "";
    for (let n = this.pieceNum_; n < this.pieces_.length; n++)
      this.pieces_[n] !== "" && (e += "/" + this.pieces_[n]);
    return e || "/";
  }
}
function te() {
  return new ie("");
}
function K(t) {
  return t.pieceNum_ >= t.pieces_.length ? null : t.pieces_[t.pieceNum_];
}
function bn(t) {
  return t.pieces_.length - t.pieceNum_;
}
function ce(t) {
  let e = t.pieceNum_;
  return e < t.pieces_.length && e++, new ie(t.pieces_, e);
}
function zu(t) {
  return t.pieceNum_ < t.pieces_.length
    ? t.pieces_[t.pieces_.length - 1]
    : null;
}
function FE(t) {
  let e = "";
  for (let n = t.pieceNum_; n < t.pieces_.length; n++)
    t.pieces_[n] !== "" &&
      (e += "/" + encodeURIComponent(String(t.pieces_[n])));
  return e || "/";
}
function hi(t, e = 0) {
  return t.pieces_.slice(t.pieceNum_ + e);
}
function Kg(t) {
  if (t.pieceNum_ >= t.pieces_.length) return null;
  const e = [];
  for (let n = t.pieceNum_; n < t.pieces_.length - 1; n++) e.push(t.pieces_[n]);
  return new ie(e, 0);
}
function Se(t, e) {
  const n = [];
  for (let r = t.pieceNum_; r < t.pieces_.length; r++) n.push(t.pieces_[r]);
  if (e instanceof ie)
    for (let r = e.pieceNum_; r < e.pieces_.length; r++) n.push(e.pieces_[r]);
  else {
    const r = e.split("/");
    for (let s = 0; s < r.length; s++) r[s].length > 0 && n.push(r[s]);
  }
  return new ie(n, 0);
}
function J(t) {
  return t.pieceNum_ >= t.pieces_.length;
}
function Qe(t, e) {
  const n = K(t),
    r = K(e);
  if (n === null) return e;
  if (n === r) return Qe(ce(t), ce(e));
  throw new Error(
    "INTERNAL ERROR: innerPath (" + e + ") is not within outerPath (" + t + ")"
  );
}
function UE(t, e) {
  const n = hi(t, 0),
    r = hi(e, 0);
  for (let s = 0; s < n.length && s < r.length; s++) {
    const i = dr(n[s], r[s]);
    if (i !== 0) return i;
  }
  return n.length === r.length ? 0 : n.length < r.length ? -1 : 1;
}
function Hu(t, e) {
  if (bn(t) !== bn(e)) return !1;
  for (let n = t.pieceNum_, r = e.pieceNum_; n <= t.pieces_.length; n++, r++)
    if (t.pieces_[n] !== e.pieces_[r]) return !1;
  return !0;
}
function _t(t, e) {
  let n = t.pieceNum_,
    r = e.pieceNum_;
  if (bn(t) > bn(e)) return !1;
  for (; n < t.pieces_.length; ) {
    if (t.pieces_[n] !== e.pieces_[r]) return !1;
    ++n, ++r;
  }
  return !0;
}
class BE {
  constructor(e, n) {
    (this.errorPrefix_ = n),
      (this.parts_ = hi(e, 0)),
      (this.byteLength_ = Math.max(1, this.parts_.length));
    for (let r = 0; r < this.parts_.length; r++)
      this.byteLength_ += xl(this.parts_[r]);
    Qg(this);
  }
}
function zE(t, e) {
  t.parts_.length > 0 && (t.byteLength_ += 1),
    t.parts_.push(e),
    (t.byteLength_ += xl(e)),
    Qg(t);
}
function HE(t) {
  const e = t.parts_.pop();
  (t.byteLength_ -= xl(e)), t.parts_.length > 0 && (t.byteLength_ -= 1);
}
function Qg(t) {
  if (t.byteLength_ > hf)
    throw new Error(
      t.errorPrefix_ +
        "has a key path longer than " +
        hf +
        " bytes (" +
        t.byteLength_ +
        ")."
    );
  if (t.parts_.length > df)
    throw new Error(
      t.errorPrefix_ +
        "path specified exceeds the maximum depth that can be written (" +
        df +
        ") or object contains a cycle " +
        zn(t)
    );
}
function zn(t) {
  return t.parts_.length === 0
    ? ""
    : "in property '" + t.parts_.join(".") + "'";
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Wu extends Yg {
  constructor() {
    super(["visible"]);
    let e, n;
    typeof document < "u" &&
      typeof document.addEventListener < "u" &&
      (typeof document.hidden < "u"
        ? ((n = "visibilitychange"), (e = "hidden"))
        : typeof document.mozHidden < "u"
        ? ((n = "mozvisibilitychange"), (e = "mozHidden"))
        : typeof document.msHidden < "u"
        ? ((n = "msvisibilitychange"), (e = "msHidden"))
        : typeof document.webkitHidden < "u" &&
          ((n = "webkitvisibilitychange"), (e = "webkitHidden"))),
      (this.visible_ = !0),
      n &&
        document.addEventListener(
          n,
          () => {
            const r = !document[e];
            r !== this.visible_ &&
              ((this.visible_ = r), this.trigger("visible", r));
          },
          !1
        );
  }
  static getInstance() {
    return new Wu();
  }
  getInitialEvent(e) {
    return b(e === "visible", "Unknown event type: " + e), [this.visible_];
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Ss = 1e3,
  WE = 60 * 5 * 1e3,
  ff = 30 * 1e3,
  GE = 1.3,
  VE = 3e4,
  YE = "server_kill",
  pf = 3;
class Zt extends Vg {
  constructor(e, n, r, s, i, o, l, a) {
    if (
      (super(),
      (this.repoInfo_ = e),
      (this.applicationId_ = n),
      (this.onDataUpdate_ = r),
      (this.onConnectStatus_ = s),
      (this.onServerInfoUpdate_ = i),
      (this.authTokenProvider_ = o),
      (this.appCheckTokenProvider_ = l),
      (this.authOverride_ = a),
      (this.id = Zt.nextPersistentConnectionId_++),
      (this.log_ = ki("p:" + this.id + ":")),
      (this.interruptReasons_ = {}),
      (this.listens = new Map()),
      (this.outstandingPuts_ = []),
      (this.outstandingGets_ = []),
      (this.outstandingPutCount_ = 0),
      (this.outstandingGetCount_ = 0),
      (this.onDisconnectRequestQueue_ = []),
      (this.connected_ = !1),
      (this.reconnectDelay_ = Ss),
      (this.maxReconnectDelay_ = WE),
      (this.securityDebugCallback_ = null),
      (this.lastSessionId = null),
      (this.establishConnectionTimer_ = null),
      (this.visible_ = !1),
      (this.requestCBHash_ = {}),
      (this.requestNumber_ = 0),
      (this.realtime_ = null),
      (this.authToken_ = null),
      (this.appCheckToken_ = null),
      (this.forceTokenRefresh_ = !1),
      (this.invalidAuthTokenCount_ = 0),
      (this.invalidAppCheckTokenCount_ = 0),
      (this.firstConnection_ = !0),
      (this.lastConnectionAttemptTime_ = null),
      (this.lastConnectionEstablishedTime_ = null),
      a && !gg())
    )
      throw new Error(
        "Auth override specified in options, but not supported on non Node.js platforms"
      );
    Wu.getInstance().on("visible", this.onVisible_, this),
      e.host.indexOf("fblocal") === -1 &&
        Wo.getInstance().on("online", this.onOnline_, this);
  }
  sendRequest(e, n, r) {
    const s = ++this.requestNumber_,
      i = { r: s, a: e, b: n };
    this.log_(Ie(i)),
      b(
        this.connected_,
        "sendRequest call when we're not connected not allowed."
      ),
      this.realtime_.sendRequest(i),
      r && (this.requestCBHash_[s] = r);
  }
  get(e) {
    this.initConnection_();
    const n = new xi(),
      s = {
        action: "g",
        request: { p: e._path.toString(), q: e._queryObject },
        onComplete: (o) => {
          const l = o.d;
          o.s === "ok" ? n.resolve(l) : n.reject(l);
        },
      };
    this.outstandingGets_.push(s), this.outstandingGetCount_++;
    const i = this.outstandingGets_.length - 1;
    return this.connected_ && this.sendGet_(i), n.promise;
  }
  listen(e, n, r, s) {
    this.initConnection_();
    const i = e._queryIdentifier,
      o = e._path.toString();
    this.log_("Listen called for " + o + " " + i),
      this.listens.has(o) || this.listens.set(o, new Map()),
      b(
        e._queryParams.isDefault() || !e._queryParams.loadsAllData(),
        "listen() called for non-default but complete query"
      ),
      b(
        !this.listens.get(o).has(i),
        "listen() called twice for same path/queryId."
      );
    const l = { onComplete: s, hashFn: n, query: e, tag: r };
    this.listens.get(o).set(i, l), this.connected_ && this.sendListen_(l);
  }
  sendGet_(e) {
    const n = this.outstandingGets_[e];
    this.sendRequest("g", n.request, (r) => {
      delete this.outstandingGets_[e],
        this.outstandingGetCount_--,
        this.outstandingGetCount_ === 0 && (this.outstandingGets_ = []),
        n.onComplete && n.onComplete(r);
    });
  }
  sendListen_(e) {
    const n = e.query,
      r = n._path.toString(),
      s = n._queryIdentifier;
    this.log_("Listen on " + r + " for " + s);
    const i = { p: r },
      o = "q";
    e.tag && ((i.q = n._queryObject), (i.t = e.tag)),
      (i.h = e.hashFn()),
      this.sendRequest(o, i, (l) => {
        const a = l.d,
          c = l.s;
        Zt.warnOnListenWarnings_(a, n),
          (this.listens.get(r) && this.listens.get(r).get(s)) === e &&
            (this.log_("listen response", l),
            c !== "ok" && this.removeListen_(r, s),
            e.onComplete && e.onComplete(c, a));
      });
  }
  static warnOnListenWarnings_(e, n) {
    if (e && typeof e == "object" && zt(e, "w")) {
      const r = Kr(e, "w");
      if (Array.isArray(r) && ~r.indexOf("no_index")) {
        const s = '".indexOn": "' + n._queryParams.getIndex().toString() + '"',
          i = n._path.toString();
        Xe(
          `Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${i} to your security rules for better performance.`
        );
      }
    }
  }
  refreshAuthToken(e) {
    (this.authToken_ = e),
      this.log_("Auth token refreshed"),
      this.authToken_
        ? this.tryAuth()
        : this.connected_ && this.sendRequest("unauth", {}, () => {}),
      this.reduceReconnectDelayIfAdminCredential_(e);
  }
  reduceReconnectDelayIfAdminCredential_(e) {
    ((e && e.length === 40) || Fw(e)) &&
      (this.log_(
        "Admin auth credential detected.  Reducing max reconnect time."
      ),
      (this.maxReconnectDelay_ = ff));
  }
  refreshAppCheckToken(e) {
    (this.appCheckToken_ = e),
      this.log_("App check token refreshed"),
      this.appCheckToken_
        ? this.tryAppCheck()
        : this.connected_ && this.sendRequest("unappeck", {}, () => {});
  }
  tryAuth() {
    if (this.connected_ && this.authToken_) {
      const e = this.authToken_,
        n = $w(e) ? "auth" : "gauth",
        r = { cred: e };
      this.authOverride_ === null
        ? (r.noauth = !0)
        : typeof this.authOverride_ == "object" &&
          (r.authvar = this.authOverride_),
        this.sendRequest(n, r, (s) => {
          const i = s.s,
            o = s.d || "error";
          this.authToken_ === e &&
            (i === "ok"
              ? (this.invalidAuthTokenCount_ = 0)
              : this.onAuthRevoked_(i, o));
        });
    }
  }
  tryAppCheck() {
    this.connected_ &&
      this.appCheckToken_ &&
      this.sendRequest("appcheck", { token: this.appCheckToken_ }, (e) => {
        const n = e.s,
          r = e.d || "error";
        n === "ok"
          ? (this.invalidAppCheckTokenCount_ = 0)
          : this.onAppCheckRevoked_(n, r);
      });
  }
  unlisten(e, n) {
    const r = e._path.toString(),
      s = e._queryIdentifier;
    this.log_("Unlisten called for " + r + " " + s),
      b(
        e._queryParams.isDefault() || !e._queryParams.loadsAllData(),
        "unlisten() called for non-default but complete query"
      ),
      this.removeListen_(r, s) &&
        this.connected_ &&
        this.sendUnlisten_(r, s, e._queryObject, n);
  }
  sendUnlisten_(e, n, r, s) {
    this.log_("Unlisten on " + e + " for " + n);
    const i = { p: e },
      o = "n";
    s && ((i.q = r), (i.t = s)), this.sendRequest(o, i);
  }
  onDisconnectPut(e, n, r) {
    this.initConnection_(),
      this.connected_
        ? this.sendOnDisconnect_("o", e, n, r)
        : this.onDisconnectRequestQueue_.push({
            pathString: e,
            action: "o",
            data: n,
            onComplete: r,
          });
  }
  onDisconnectMerge(e, n, r) {
    this.initConnection_(),
      this.connected_
        ? this.sendOnDisconnect_("om", e, n, r)
        : this.onDisconnectRequestQueue_.push({
            pathString: e,
            action: "om",
            data: n,
            onComplete: r,
          });
  }
  onDisconnectCancel(e, n) {
    this.initConnection_(),
      this.connected_
        ? this.sendOnDisconnect_("oc", e, null, n)
        : this.onDisconnectRequestQueue_.push({
            pathString: e,
            action: "oc",
            data: null,
            onComplete: n,
          });
  }
  sendOnDisconnect_(e, n, r, s) {
    const i = { p: n, d: r };
    this.log_("onDisconnect " + e, i),
      this.sendRequest(e, i, (o) => {
        s &&
          setTimeout(() => {
            s(o.s, o.d);
          }, Math.floor(0));
      });
  }
  put(e, n, r, s) {
    this.putInternal("p", e, n, r, s);
  }
  merge(e, n, r, s) {
    this.putInternal("m", e, n, r, s);
  }
  putInternal(e, n, r, s, i) {
    this.initConnection_();
    const o = { p: n, d: r };
    i !== void 0 && (o.h = i),
      this.outstandingPuts_.push({ action: e, request: o, onComplete: s }),
      this.outstandingPutCount_++;
    const l = this.outstandingPuts_.length - 1;
    this.connected_ ? this.sendPut_(l) : this.log_("Buffering put: " + n);
  }
  sendPut_(e) {
    const n = this.outstandingPuts_[e].action,
      r = this.outstandingPuts_[e].request,
      s = this.outstandingPuts_[e].onComplete;
    (this.outstandingPuts_[e].queued = this.connected_),
      this.sendRequest(n, r, (i) => {
        this.log_(n + " response", i),
          delete this.outstandingPuts_[e],
          this.outstandingPutCount_--,
          this.outstandingPutCount_ === 0 && (this.outstandingPuts_ = []),
          s && s(i.s, i.d);
      });
  }
  reportStats(e) {
    if (this.connected_) {
      const n = { c: e };
      this.log_("reportStats", n),
        this.sendRequest("s", n, (r) => {
          if (r.s !== "ok") {
            const i = r.d;
            this.log_("reportStats", "Error sending stats: " + i);
          }
        });
    }
  }
  onDataMessage_(e) {
    if ("r" in e) {
      this.log_("from server: " + Ie(e));
      const n = e.r,
        r = this.requestCBHash_[n];
      r && (delete this.requestCBHash_[n], r(e.b));
    } else {
      if ("error" in e) throw "A server-side error has occurred: " + e.error;
      "a" in e && this.onDataPush_(e.a, e.b);
    }
  }
  onDataPush_(e, n) {
    this.log_("handleServerMessage", e, n),
      e === "d"
        ? this.onDataUpdate_(n.p, n.d, !1, n.t)
        : e === "m"
        ? this.onDataUpdate_(n.p, n.d, !0, n.t)
        : e === "c"
        ? this.onListenRevoked_(n.p, n.q)
        : e === "ac"
        ? this.onAuthRevoked_(n.s, n.d)
        : e === "apc"
        ? this.onAppCheckRevoked_(n.s, n.d)
        : e === "sd"
        ? this.onSecurityDebugPacket_(n)
        : Tc(
            "Unrecognized action received from server: " +
              Ie(e) +
              `
Are you using the latest client?`
          );
  }
  onReady_(e, n) {
    this.log_("connection ready"),
      (this.connected_ = !0),
      (this.lastConnectionEstablishedTime_ = new Date().getTime()),
      this.handleTimestamp_(e),
      (this.lastSessionId = n),
      this.firstConnection_ && this.sendConnectStats_(),
      this.restoreState_(),
      (this.firstConnection_ = !1),
      this.onConnectStatus_(!0);
  }
  scheduleConnect_(e) {
    b(
      !this.realtime_,
      "Scheduling a connect when we're already connected/ing?"
    ),
      this.establishConnectionTimer_ &&
        clearTimeout(this.establishConnectionTimer_),
      (this.establishConnectionTimer_ = setTimeout(() => {
        (this.establishConnectionTimer_ = null), this.establishConnection_();
      }, Math.floor(e)));
  }
  initConnection_() {
    !this.realtime_ && this.firstConnection_ && this.scheduleConnect_(0);
  }
  onVisible_(e) {
    e &&
      !this.visible_ &&
      this.reconnectDelay_ === this.maxReconnectDelay_ &&
      (this.log_("Window became visible.  Reducing delay."),
      (this.reconnectDelay_ = Ss),
      this.realtime_ || this.scheduleConnect_(0)),
      (this.visible_ = e);
  }
  onOnline_(e) {
    e
      ? (this.log_("Browser went online."),
        (this.reconnectDelay_ = Ss),
        this.realtime_ || this.scheduleConnect_(0))
      : (this.log_("Browser went offline.  Killing connection."),
        this.realtime_ && this.realtime_.close());
  }
  onRealtimeDisconnect_() {
    if (
      (this.log_("data client disconnected"),
      (this.connected_ = !1),
      (this.realtime_ = null),
      this.cancelSentTransactions_(),
      (this.requestCBHash_ = {}),
      this.shouldReconnect_())
    ) {
      this.visible_
        ? this.lastConnectionEstablishedTime_ &&
          (new Date().getTime() - this.lastConnectionEstablishedTime_ > VE &&
            (this.reconnectDelay_ = Ss),
          (this.lastConnectionEstablishedTime_ = null))
        : (this.log_("Window isn't visible.  Delaying reconnect."),
          (this.reconnectDelay_ = this.maxReconnectDelay_),
          (this.lastConnectionAttemptTime_ = new Date().getTime()));
      const e = new Date().getTime() - this.lastConnectionAttemptTime_;
      let n = Math.max(0, this.reconnectDelay_ - e);
      (n = Math.random() * n),
        this.log_("Trying to reconnect in " + n + "ms"),
        this.scheduleConnect_(n),
        (this.reconnectDelay_ = Math.min(
          this.maxReconnectDelay_,
          this.reconnectDelay_ * GE
        ));
    }
    this.onConnectStatus_(!1);
  }
  async establishConnection_() {
    if (this.shouldReconnect_()) {
      this.log_("Making a connection attempt"),
        (this.lastConnectionAttemptTime_ = new Date().getTime()),
        (this.lastConnectionEstablishedTime_ = null);
      const e = this.onDataMessage_.bind(this),
        n = this.onReady_.bind(this),
        r = this.onRealtimeDisconnect_.bind(this),
        s = this.id + ":" + Zt.nextConnectionId_++,
        i = this.lastSessionId;
      let o = !1,
        l = null;
      const a = function () {
          l ? l.close() : ((o = !0), r());
        },
        c = function (h) {
          b(l, "sendRequest call when we're not connected not allowed."),
            l.sendRequest(h);
        };
      this.realtime_ = { close: a, sendRequest: c };
      const d = this.forceTokenRefresh_;
      this.forceTokenRefresh_ = !1;
      try {
        const [h, f] = await Promise.all([
          this.authTokenProvider_.getToken(d),
          this.appCheckTokenProvider_.getToken(d),
        ]);
        o
          ? Ue("getToken() completed but was canceled")
          : (Ue("getToken() completed. Creating connection."),
            (this.authToken_ = h && h.accessToken),
            (this.appCheckToken_ = f && f.token),
            (l = new $E(
              s,
              this.repoInfo_,
              this.applicationId_,
              this.appCheckToken_,
              this.authToken_,
              e,
              n,
              r,
              (p) => {
                Xe(p + " (" + this.repoInfo_.toString() + ")"),
                  this.interrupt(YE);
              },
              i
            )));
      } catch (h) {
        this.log_("Failed to get token: " + h),
          o || (this.repoInfo_.nodeAdmin && Xe(h), a());
      }
    }
  }
  interrupt(e) {
    Ue("Interrupting connection for reason: " + e),
      (this.interruptReasons_[e] = !0),
      this.realtime_
        ? this.realtime_.close()
        : (this.establishConnectionTimer_ &&
            (clearTimeout(this.establishConnectionTimer_),
            (this.establishConnectionTimer_ = null)),
          this.connected_ && this.onRealtimeDisconnect_());
  }
  resume(e) {
    Ue("Resuming connection for reason: " + e),
      delete this.interruptReasons_[e],
      Wh(this.interruptReasons_) &&
        ((this.reconnectDelay_ = Ss),
        this.realtime_ || this.scheduleConnect_(0));
  }
  handleTimestamp_(e) {
    const n = e - new Date().getTime();
    this.onServerInfoUpdate_({ serverTimeOffset: n });
  }
  cancelSentTransactions_() {
    for (let e = 0; e < this.outstandingPuts_.length; e++) {
      const n = this.outstandingPuts_[e];
      n &&
        "h" in n.request &&
        n.queued &&
        (n.onComplete && n.onComplete("disconnect"),
        delete this.outstandingPuts_[e],
        this.outstandingPutCount_--);
    }
    this.outstandingPutCount_ === 0 && (this.outstandingPuts_ = []);
  }
  onListenRevoked_(e, n) {
    let r;
    n ? (r = n.map((i) => $u(i)).join("$")) : (r = "default");
    const s = this.removeListen_(e, r);
    s && s.onComplete && s.onComplete("permission_denied");
  }
  removeListen_(e, n) {
    const r = new ie(e).toString();
    let s;
    if (this.listens.has(r)) {
      const i = this.listens.get(r);
      (s = i.get(n)), i.delete(n), i.size === 0 && this.listens.delete(r);
    } else s = void 0;
    return s;
  }
  onAuthRevoked_(e, n) {
    Ue("Auth token revoked: " + e + "/" + n),
      (this.authToken_ = null),
      (this.forceTokenRefresh_ = !0),
      this.realtime_.close(),
      (e === "invalid_token" || e === "permission_denied") &&
        (this.invalidAuthTokenCount_++,
        this.invalidAuthTokenCount_ >= pf &&
          ((this.reconnectDelay_ = ff),
          this.authTokenProvider_.notifyForInvalidToken()));
  }
  onAppCheckRevoked_(e, n) {
    Ue("App check token revoked: " + e + "/" + n),
      (this.appCheckToken_ = null),
      (this.forceTokenRefresh_ = !0),
      (e === "invalid_token" || e === "permission_denied") &&
        (this.invalidAppCheckTokenCount_++,
        this.invalidAppCheckTokenCount_ >= pf &&
          this.appCheckTokenProvider_.notifyForInvalidToken());
  }
  onSecurityDebugPacket_(e) {
    this.securityDebugCallback_
      ? this.securityDebugCallback_(e)
      : "msg" in e &&
        console.log(
          "FIREBASE: " +
            e.msg.replace(
              `
`,
              `
FIREBASE: `
            )
        );
  }
  restoreState_() {
    this.tryAuth(), this.tryAppCheck();
    for (const e of this.listens.values())
      for (const n of e.values()) this.sendListen_(n);
    for (let e = 0; e < this.outstandingPuts_.length; e++)
      this.outstandingPuts_[e] && this.sendPut_(e);
    for (; this.onDisconnectRequestQueue_.length; ) {
      const e = this.onDisconnectRequestQueue_.shift();
      this.sendOnDisconnect_(e.action, e.pathString, e.data, e.onComplete);
    }
    for (let e = 0; e < this.outstandingGets_.length; e++)
      this.outstandingGets_[e] && this.sendGet_(e);
  }
  sendConnectStats_() {
    const e = {};
    let n = "js";
    (e["sdk." + n + "." + Ng.replace(/\./g, "-")] = 1),
      mg()
        ? (e["framework.cordova"] = 1)
        : bw() && (e["framework.reactnative"] = 1),
      this.reportStats(e);
  }
  shouldReconnect_() {
    const e = Wo.getInstance().currentlyOnline();
    return Wh(this.interruptReasons_) && e;
  }
}
Zt.nextPersistentConnectionId_ = 0;
Zt.nextConnectionId_ = 0;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Q {
  constructor(e, n) {
    (this.name = e), (this.node = n);
  }
  static Wrap(e, n) {
    return new Q(e, n);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Nl {
  getCompare() {
    return this.compare.bind(this);
  }
  indexedValueChanged(e, n) {
    const r = new Q(Qr, e),
      s = new Q(Qr, n);
    return this.compare(r, s) !== 0;
  }
  minPost() {
    return Q.MIN;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let Ji;
class qg extends Nl {
  static get __EMPTY_NODE() {
    return Ji;
  }
  static set __EMPTY_NODE(e) {
    Ji = e;
  }
  compare(e, n) {
    return dr(e.name, n.name);
  }
  isDefinedOn(e) {
    throw ls("KeyIndex.isDefinedOn not expected to be called.");
  }
  indexedValueChanged(e, n) {
    return !1;
  }
  minPost() {
    return Q.MIN;
  }
  maxPost() {
    return new Q(rr, Ji);
  }
  makePost(e, n) {
    return (
      b(typeof e == "string", "KeyIndex indexValue must always be a string."),
      new Q(e, Ji)
    );
  }
  toString() {
    return ".key";
  }
}
const Ur = new qg();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Zi {
  constructor(e, n, r, s, i = null) {
    (this.isReverse_ = s), (this.resultGenerator_ = i), (this.nodeStack_ = []);
    let o = 1;
    for (; !e.isEmpty(); )
      if (((e = e), (o = n ? r(e.key, n) : 1), s && (o *= -1), o < 0))
        this.isReverse_ ? (e = e.left) : (e = e.right);
      else if (o === 0) {
        this.nodeStack_.push(e);
        break;
      } else
        this.nodeStack_.push(e), this.isReverse_ ? (e = e.right) : (e = e.left);
  }
  getNext() {
    if (this.nodeStack_.length === 0) return null;
    let e = this.nodeStack_.pop(),
      n;
    if (
      (this.resultGenerator_
        ? (n = this.resultGenerator_(e.key, e.value))
        : (n = { key: e.key, value: e.value }),
      this.isReverse_)
    )
      for (e = e.left; !e.isEmpty(); ) this.nodeStack_.push(e), (e = e.right);
    else
      for (e = e.right; !e.isEmpty(); ) this.nodeStack_.push(e), (e = e.left);
    return n;
  }
  hasNext() {
    return this.nodeStack_.length > 0;
  }
  peek() {
    if (this.nodeStack_.length === 0) return null;
    const e = this.nodeStack_[this.nodeStack_.length - 1];
    return this.resultGenerator_
      ? this.resultGenerator_(e.key, e.value)
      : { key: e.key, value: e.value };
  }
}
class De {
  constructor(e, n, r, s, i) {
    (this.key = e),
      (this.value = n),
      (this.color = r ?? De.RED),
      (this.left = s ?? rt.EMPTY_NODE),
      (this.right = i ?? rt.EMPTY_NODE);
  }
  copy(e, n, r, s, i) {
    return new De(
      e ?? this.key,
      n ?? this.value,
      r ?? this.color,
      s ?? this.left,
      i ?? this.right
    );
  }
  count() {
    return this.left.count() + 1 + this.right.count();
  }
  isEmpty() {
    return !1;
  }
  inorderTraversal(e) {
    return (
      this.left.inorderTraversal(e) ||
      !!e(this.key, this.value) ||
      this.right.inorderTraversal(e)
    );
  }
  reverseTraversal(e) {
    return (
      this.right.reverseTraversal(e) ||
      e(this.key, this.value) ||
      this.left.reverseTraversal(e)
    );
  }
  min_() {
    return this.left.isEmpty() ? this : this.left.min_();
  }
  minKey() {
    return this.min_().key;
  }
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  insert(e, n, r) {
    let s = this;
    const i = r(e, s.key);
    return (
      i < 0
        ? (s = s.copy(null, null, null, s.left.insert(e, n, r), null))
        : i === 0
        ? (s = s.copy(null, n, null, null, null))
        : (s = s.copy(null, null, null, null, s.right.insert(e, n, r))),
      s.fixUp_()
    );
  }
  removeMin_() {
    if (this.left.isEmpty()) return rt.EMPTY_NODE;
    let e = this;
    return (
      !e.left.isRed_() && !e.left.left.isRed_() && (e = e.moveRedLeft_()),
      (e = e.copy(null, null, null, e.left.removeMin_(), null)),
      e.fixUp_()
    );
  }
  remove(e, n) {
    let r, s;
    if (((r = this), n(e, r.key) < 0))
      !r.left.isEmpty() &&
        !r.left.isRed_() &&
        !r.left.left.isRed_() &&
        (r = r.moveRedLeft_()),
        (r = r.copy(null, null, null, r.left.remove(e, n), null));
    else {
      if (
        (r.left.isRed_() && (r = r.rotateRight_()),
        !r.right.isEmpty() &&
          !r.right.isRed_() &&
          !r.right.left.isRed_() &&
          (r = r.moveRedRight_()),
        n(e, r.key) === 0)
      ) {
        if (r.right.isEmpty()) return rt.EMPTY_NODE;
        (s = r.right.min_()),
          (r = r.copy(s.key, s.value, null, null, r.right.removeMin_()));
      }
      r = r.copy(null, null, null, null, r.right.remove(e, n));
    }
    return r.fixUp_();
  }
  isRed_() {
    return this.color;
  }
  fixUp_() {
    let e = this;
    return (
      e.right.isRed_() && !e.left.isRed_() && (e = e.rotateLeft_()),
      e.left.isRed_() && e.left.left.isRed_() && (e = e.rotateRight_()),
      e.left.isRed_() && e.right.isRed_() && (e = e.colorFlip_()),
      e
    );
  }
  moveRedLeft_() {
    let e = this.colorFlip_();
    return (
      e.right.left.isRed_() &&
        ((e = e.copy(null, null, null, null, e.right.rotateRight_())),
        (e = e.rotateLeft_()),
        (e = e.colorFlip_())),
      e
    );
  }
  moveRedRight_() {
    let e = this.colorFlip_();
    return (
      e.left.left.isRed_() && ((e = e.rotateRight_()), (e = e.colorFlip_())), e
    );
  }
  rotateLeft_() {
    const e = this.copy(null, null, De.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight_() {
    const e = this.copy(null, null, De.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip_() {
    const e = this.left.copy(null, null, !this.left.color, null, null),
      n = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, n);
  }
  checkMaxDepth_() {
    const e = this.check_();
    return Math.pow(2, e) <= this.count() + 1;
  }
  check_() {
    if (this.isRed_() && this.left.isRed_())
      throw new Error(
        "Red node has red child(" + this.key + "," + this.value + ")"
      );
    if (this.right.isRed_())
      throw new Error(
        "Right child of (" + this.key + "," + this.value + ") is red"
      );
    const e = this.left.check_();
    if (e !== this.right.check_()) throw new Error("Black depths differ");
    return e + (this.isRed_() ? 0 : 1);
  }
}
De.RED = !0;
De.BLACK = !1;
class KE {
  copy(e, n, r, s, i) {
    return this;
  }
  insert(e, n, r) {
    return new De(e, n, null);
  }
  remove(e, n) {
    return this;
  }
  count() {
    return 0;
  }
  isEmpty() {
    return !0;
  }
  inorderTraversal(e) {
    return !1;
  }
  reverseTraversal(e) {
    return !1;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  check_() {
    return 0;
  }
  isRed_() {
    return !1;
  }
}
class rt {
  constructor(e, n = rt.EMPTY_NODE) {
    (this.comparator_ = e), (this.root_ = n);
  }
  insert(e, n) {
    return new rt(
      this.comparator_,
      this.root_
        .insert(e, n, this.comparator_)
        .copy(null, null, De.BLACK, null, null)
    );
  }
  remove(e) {
    return new rt(
      this.comparator_,
      this.root_
        .remove(e, this.comparator_)
        .copy(null, null, De.BLACK, null, null)
    );
  }
  get(e) {
    let n,
      r = this.root_;
    for (; !r.isEmpty(); ) {
      if (((n = this.comparator_(e, r.key)), n === 0)) return r.value;
      n < 0 ? (r = r.left) : n > 0 && (r = r.right);
    }
    return null;
  }
  getPredecessorKey(e) {
    let n,
      r = this.root_,
      s = null;
    for (; !r.isEmpty(); )
      if (((n = this.comparator_(e, r.key)), n === 0)) {
        if (r.left.isEmpty()) return s ? s.key : null;
        for (r = r.left; !r.right.isEmpty(); ) r = r.right;
        return r.key;
      } else n < 0 ? (r = r.left) : n > 0 && ((s = r), (r = r.right));
    throw new Error(
      "Attempted to find predecessor key for a nonexistent key.  What gives?"
    );
  }
  isEmpty() {
    return this.root_.isEmpty();
  }
  count() {
    return this.root_.count();
  }
  minKey() {
    return this.root_.minKey();
  }
  maxKey() {
    return this.root_.maxKey();
  }
  inorderTraversal(e) {
    return this.root_.inorderTraversal(e);
  }
  reverseTraversal(e) {
    return this.root_.reverseTraversal(e);
  }
  getIterator(e) {
    return new Zi(this.root_, null, this.comparator_, !1, e);
  }
  getIteratorFrom(e, n) {
    return new Zi(this.root_, e, this.comparator_, !1, n);
  }
  getReverseIteratorFrom(e, n) {
    return new Zi(this.root_, e, this.comparator_, !0, n);
  }
  getReverseIterator(e) {
    return new Zi(this.root_, null, this.comparator_, !0, e);
  }
}
rt.EMPTY_NODE = new KE();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function QE(t, e) {
  return dr(t.name, e.name);
}
function Gu(t, e) {
  return dr(t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let Rc;
function qE(t) {
  Rc = t;
}
const Xg = function (t) {
    return typeof t == "number" ? "number:" + Pg(t) : "string:" + t;
  },
  Jg = function (t) {
    if (t.isLeafNode()) {
      const e = t.val();
      b(
        typeof e == "string" ||
          typeof e == "number" ||
          (typeof e == "object" && zt(e, ".sv")),
        "Priority must be a string or number."
      );
    } else b(t === Rc || t.isEmpty(), "priority of unexpected type.");
    b(
      t === Rc || t.getPriority().isEmpty(),
      "Priority nodes can't have a priority of their own."
    );
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let mf;
class je {
  constructor(e, n = je.__childrenNodeConstructor.EMPTY_NODE) {
    (this.value_ = e),
      (this.priorityNode_ = n),
      (this.lazyHash_ = null),
      b(
        this.value_ !== void 0 && this.value_ !== null,
        "LeafNode shouldn't be created with null/undefined value."
      ),
      Jg(this.priorityNode_);
  }
  static set __childrenNodeConstructor(e) {
    mf = e;
  }
  static get __childrenNodeConstructor() {
    return mf;
  }
  isLeafNode() {
    return !0;
  }
  getPriority() {
    return this.priorityNode_;
  }
  updatePriority(e) {
    return new je(this.value_, e);
  }
  getImmediateChild(e) {
    return e === ".priority"
      ? this.priorityNode_
      : je.__childrenNodeConstructor.EMPTY_NODE;
  }
  getChild(e) {
    return J(e)
      ? this
      : K(e) === ".priority"
      ? this.priorityNode_
      : je.__childrenNodeConstructor.EMPTY_NODE;
  }
  hasChild() {
    return !1;
  }
  getPredecessorChildName(e, n) {
    return null;
  }
  updateImmediateChild(e, n) {
    return e === ".priority"
      ? this.updatePriority(n)
      : n.isEmpty() && e !== ".priority"
      ? this
      : je.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(
          e,
          n
        ).updatePriority(this.priorityNode_);
  }
  updateChild(e, n) {
    const r = K(e);
    return r === null
      ? n
      : n.isEmpty() && r !== ".priority"
      ? this
      : (b(
          r !== ".priority" || bn(e) === 1,
          ".priority must be the last token in a path"
        ),
        this.updateImmediateChild(
          r,
          je.__childrenNodeConstructor.EMPTY_NODE.updateChild(ce(e), n)
        ));
  }
  isEmpty() {
    return !1;
  }
  numChildren() {
    return 0;
  }
  forEachChild(e, n) {
    return !1;
  }
  val(e) {
    return e && !this.getPriority().isEmpty()
      ? { ".value": this.getValue(), ".priority": this.getPriority().val() }
      : this.getValue();
  }
  hash() {
    if (this.lazyHash_ === null) {
      let e = "";
      this.priorityNode_.isEmpty() ||
        (e += "priority:" + Xg(this.priorityNode_.val()) + ":");
      const n = typeof this.value_;
      (e += n + ":"),
        n === "number" ? (e += Pg(this.value_)) : (e += this.value_),
        (this.lazyHash_ = kg(e));
    }
    return this.lazyHash_;
  }
  getValue() {
    return this.value_;
  }
  compareTo(e) {
    return e === je.__childrenNodeConstructor.EMPTY_NODE
      ? 1
      : e instanceof je.__childrenNodeConstructor
      ? -1
      : (b(e.isLeafNode(), "Unknown node type"), this.compareToLeafNode_(e));
  }
  compareToLeafNode_(e) {
    const n = typeof e.value_,
      r = typeof this.value_,
      s = je.VALUE_TYPE_ORDER.indexOf(n),
      i = je.VALUE_TYPE_ORDER.indexOf(r);
    return (
      b(s >= 0, "Unknown leaf type: " + n),
      b(i >= 0, "Unknown leaf type: " + r),
      s === i
        ? r === "object"
          ? 0
          : this.value_ < e.value_
          ? -1
          : this.value_ === e.value_
          ? 0
          : 1
        : i - s
    );
  }
  withIndex() {
    return this;
  }
  isIndexed() {
    return !0;
  }
  equals(e) {
    if (e === this) return !0;
    if (e.isLeafNode()) {
      const n = e;
      return (
        this.value_ === n.value_ && this.priorityNode_.equals(n.priorityNode_)
      );
    } else return !1;
  }
}
je.VALUE_TYPE_ORDER = ["object", "boolean", "number", "string"];
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let Zg, ey;
function XE(t) {
  Zg = t;
}
function JE(t) {
  ey = t;
}
class ZE extends Nl {
  compare(e, n) {
    const r = e.node.getPriority(),
      s = n.node.getPriority(),
      i = r.compareTo(s);
    return i === 0 ? dr(e.name, n.name) : i;
  }
  isDefinedOn(e) {
    return !e.getPriority().isEmpty();
  }
  indexedValueChanged(e, n) {
    return !e.getPriority().equals(n.getPriority());
  }
  minPost() {
    return Q.MIN;
  }
  maxPost() {
    return new Q(rr, new je("[PRIORITY-POST]", ey));
  }
  makePost(e, n) {
    const r = Zg(e);
    return new Q(n, new je("[PRIORITY-POST]", r));
  }
  toString() {
    return ".priority";
  }
}
const xe = new ZE();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const eS = Math.log(2);
class tS {
  constructor(e) {
    const n = (i) => parseInt(Math.log(i) / eS, 10),
      r = (i) => parseInt(Array(i + 1).join("1"), 2);
    (this.count = n(e + 1)), (this.current_ = this.count - 1);
    const s = r(this.count);
    this.bits_ = (e + 1) & s;
  }
  nextBitIsOne() {
    const e = !(this.bits_ & (1 << this.current_));
    return this.current_--, e;
  }
}
const Go = function (t, e, n, r) {
  t.sort(e);
  const s = function (a, c) {
      const d = c - a;
      let h, f;
      if (d === 0) return null;
      if (d === 1)
        return (
          (h = t[a]),
          (f = n ? n(h) : h),
          new De(f, h.node, De.BLACK, null, null)
        );
      {
        const p = parseInt(d / 2, 10) + a,
          g = s(a, p),
          w = s(p + 1, c);
        return (
          (h = t[p]), (f = n ? n(h) : h), new De(f, h.node, De.BLACK, g, w)
        );
      }
    },
    i = function (a) {
      let c = null,
        d = null,
        h = t.length;
      const f = function (g, w) {
          const E = h - g,
            y = h;
          h -= g;
          const m = s(E + 1, y),
            v = t[E],
            _ = n ? n(v) : v;
          p(new De(_, v.node, w, null, m));
        },
        p = function (g) {
          c ? ((c.left = g), (c = g)) : ((d = g), (c = g));
        };
      for (let g = 0; g < a.count; ++g) {
        const w = a.nextBitIsOne(),
          E = Math.pow(2, a.count - (g + 1));
        w ? f(E, De.BLACK) : (f(E, De.BLACK), f(E, De.RED));
      }
      return d;
    },
    o = new tS(t.length),
    l = i(o);
  return new rt(r || e, l);
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let _a;
const yr = {};
class Xt {
  constructor(e, n) {
    (this.indexes_ = e), (this.indexSet_ = n);
  }
  static get Default() {
    return (
      b(yr && xe, "ChildrenNode.ts has not been loaded"),
      (_a = _a || new Xt({ ".priority": yr }, { ".priority": xe })),
      _a
    );
  }
  get(e) {
    const n = Kr(this.indexes_, e);
    if (!n) throw new Error("No index defined for " + e);
    return n instanceof rt ? n : null;
  }
  hasIndex(e) {
    return zt(this.indexSet_, e.toString());
  }
  addIndex(e, n) {
    b(
      e !== Ur,
      "KeyIndex always exists and isn't meant to be added to the IndexMap."
    );
    const r = [];
    let s = !1;
    const i = n.getIterator(Q.Wrap);
    let o = i.getNext();
    for (; o; ) (s = s || e.isDefinedOn(o.node)), r.push(o), (o = i.getNext());
    let l;
    s ? (l = Go(r, e.getCompare())) : (l = yr);
    const a = e.toString(),
      c = Object.assign({}, this.indexSet_);
    c[a] = e;
    const d = Object.assign({}, this.indexes_);
    return (d[a] = l), new Xt(d, c);
  }
  addToIndexes(e, n) {
    const r = Uo(this.indexes_, (s, i) => {
      const o = Kr(this.indexSet_, i);
      if ((b(o, "Missing index implementation for " + i), s === yr))
        if (o.isDefinedOn(e.node)) {
          const l = [],
            a = n.getIterator(Q.Wrap);
          let c = a.getNext();
          for (; c; ) c.name !== e.name && l.push(c), (c = a.getNext());
          return l.push(e), Go(l, o.getCompare());
        } else return yr;
      else {
        const l = n.get(e.name);
        let a = s;
        return l && (a = a.remove(new Q(e.name, l))), a.insert(e, e.node);
      }
    });
    return new Xt(r, this.indexSet_);
  }
  removeFromIndexes(e, n) {
    const r = Uo(this.indexes_, (s) => {
      if (s === yr) return s;
      {
        const i = n.get(e.name);
        return i ? s.remove(new Q(e.name, i)) : s;
      }
    });
    return new Xt(r, this.indexSet_);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let xs;
class H {
  constructor(e, n, r) {
    (this.children_ = e),
      (this.priorityNode_ = n),
      (this.indexMap_ = r),
      (this.lazyHash_ = null),
      this.priorityNode_ && Jg(this.priorityNode_),
      this.children_.isEmpty() &&
        b(
          !this.priorityNode_ || this.priorityNode_.isEmpty(),
          "An empty node cannot have a priority"
        );
  }
  static get EMPTY_NODE() {
    return xs || (xs = new H(new rt(Gu), null, Xt.Default));
  }
  isLeafNode() {
    return !1;
  }
  getPriority() {
    return this.priorityNode_ || xs;
  }
  updatePriority(e) {
    return this.children_.isEmpty()
      ? this
      : new H(this.children_, e, this.indexMap_);
  }
  getImmediateChild(e) {
    if (e === ".priority") return this.getPriority();
    {
      const n = this.children_.get(e);
      return n === null ? xs : n;
    }
  }
  getChild(e) {
    const n = K(e);
    return n === null ? this : this.getImmediateChild(n).getChild(ce(e));
  }
  hasChild(e) {
    return this.children_.get(e) !== null;
  }
  updateImmediateChild(e, n) {
    if ((b(n, "We should always be passing snapshot nodes"), e === ".priority"))
      return this.updatePriority(n);
    {
      const r = new Q(e, n);
      let s, i;
      n.isEmpty()
        ? ((s = this.children_.remove(e)),
          (i = this.indexMap_.removeFromIndexes(r, this.children_)))
        : ((s = this.children_.insert(e, n)),
          (i = this.indexMap_.addToIndexes(r, this.children_)));
      const o = s.isEmpty() ? xs : this.priorityNode_;
      return new H(s, o, i);
    }
  }
  updateChild(e, n) {
    const r = K(e);
    if (r === null) return n;
    {
      b(
        K(e) !== ".priority" || bn(e) === 1,
        ".priority must be the last token in a path"
      );
      const s = this.getImmediateChild(r).updateChild(ce(e), n);
      return this.updateImmediateChild(r, s);
    }
  }
  isEmpty() {
    return this.children_.isEmpty();
  }
  numChildren() {
    return this.children_.count();
  }
  val(e) {
    if (this.isEmpty()) return null;
    const n = {};
    let r = 0,
      s = 0,
      i = !0;
    if (
      (this.forEachChild(xe, (o, l) => {
        (n[o] = l.val(e)),
          r++,
          i && H.INTEGER_REGEXP_.test(o)
            ? (s = Math.max(s, Number(o)))
            : (i = !1);
      }),
      !e && i && s < 2 * r)
    ) {
      const o = [];
      for (const l in n) o[l] = n[l];
      return o;
    } else
      return (
        e &&
          !this.getPriority().isEmpty() &&
          (n[".priority"] = this.getPriority().val()),
        n
      );
  }
  hash() {
    if (this.lazyHash_ === null) {
      let e = "";
      this.getPriority().isEmpty() ||
        (e += "priority:" + Xg(this.getPriority().val()) + ":"),
        this.forEachChild(xe, (n, r) => {
          const s = r.hash();
          s !== "" && (e += ":" + n + ":" + s);
        }),
        (this.lazyHash_ = e === "" ? "" : kg(e));
    }
    return this.lazyHash_;
  }
  getPredecessorChildName(e, n, r) {
    const s = this.resolveIndex_(r);
    if (s) {
      const i = s.getPredecessorKey(new Q(e, n));
      return i ? i.name : null;
    } else return this.children_.getPredecessorKey(e);
  }
  getFirstChildName(e) {
    const n = this.resolveIndex_(e);
    if (n) {
      const r = n.minKey();
      return r && r.name;
    } else return this.children_.minKey();
  }
  getFirstChild(e) {
    const n = this.getFirstChildName(e);
    return n ? new Q(n, this.children_.get(n)) : null;
  }
  getLastChildName(e) {
    const n = this.resolveIndex_(e);
    if (n) {
      const r = n.maxKey();
      return r && r.name;
    } else return this.children_.maxKey();
  }
  getLastChild(e) {
    const n = this.getLastChildName(e);
    return n ? new Q(n, this.children_.get(n)) : null;
  }
  forEachChild(e, n) {
    const r = this.resolveIndex_(e);
    return r
      ? r.inorderTraversal((s) => n(s.name, s.node))
      : this.children_.inorderTraversal(n);
  }
  getIterator(e) {
    return this.getIteratorFrom(e.minPost(), e);
  }
  getIteratorFrom(e, n) {
    const r = this.resolveIndex_(n);
    if (r) return r.getIteratorFrom(e, (s) => s);
    {
      const s = this.children_.getIteratorFrom(e.name, Q.Wrap);
      let i = s.peek();
      for (; i != null && n.compare(i, e) < 0; ) s.getNext(), (i = s.peek());
      return s;
    }
  }
  getReverseIterator(e) {
    return this.getReverseIteratorFrom(e.maxPost(), e);
  }
  getReverseIteratorFrom(e, n) {
    const r = this.resolveIndex_(n);
    if (r) return r.getReverseIteratorFrom(e, (s) => s);
    {
      const s = this.children_.getReverseIteratorFrom(e.name, Q.Wrap);
      let i = s.peek();
      for (; i != null && n.compare(i, e) > 0; ) s.getNext(), (i = s.peek());
      return s;
    }
  }
  compareTo(e) {
    return this.isEmpty()
      ? e.isEmpty()
        ? 0
        : -1
      : e.isLeafNode() || e.isEmpty()
      ? 1
      : e === Ri
      ? -1
      : 0;
  }
  withIndex(e) {
    if (e === Ur || this.indexMap_.hasIndex(e)) return this;
    {
      const n = this.indexMap_.addIndex(e, this.children_);
      return new H(this.children_, this.priorityNode_, n);
    }
  }
  isIndexed(e) {
    return e === Ur || this.indexMap_.hasIndex(e);
  }
  equals(e) {
    if (e === this) return !0;
    if (e.isLeafNode()) return !1;
    {
      const n = e;
      if (this.getPriority().equals(n.getPriority()))
        if (this.children_.count() === n.children_.count()) {
          const r = this.getIterator(xe),
            s = n.getIterator(xe);
          let i = r.getNext(),
            o = s.getNext();
          for (; i && o; ) {
            if (i.name !== o.name || !i.node.equals(o.node)) return !1;
            (i = r.getNext()), (o = s.getNext());
          }
          return i === null && o === null;
        } else return !1;
      else return !1;
    }
  }
  resolveIndex_(e) {
    return e === Ur ? null : this.indexMap_.get(e.toString());
  }
}
H.INTEGER_REGEXP_ = /^(0|[1-9]\d*)$/;
class nS extends H {
  constructor() {
    super(new rt(Gu), H.EMPTY_NODE, Xt.Default);
  }
  compareTo(e) {
    return e === this ? 0 : 1;
  }
  equals(e) {
    return e === this;
  }
  getPriority() {
    return this;
  }
  getImmediateChild(e) {
    return H.EMPTY_NODE;
  }
  isEmpty() {
    return !1;
  }
}
const Ri = new nS();
Object.defineProperties(Q, {
  MIN: { value: new Q(Qr, H.EMPTY_NODE) },
  MAX: { value: new Q(rr, Ri) },
});
qg.__EMPTY_NODE = H.EMPTY_NODE;
je.__childrenNodeConstructor = H;
qE(Ri);
JE(Ri);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const rS = !0;
function Pe(t, e = null) {
  if (t === null) return H.EMPTY_NODE;
  if (
    (typeof t == "object" && ".priority" in t && (e = t[".priority"]),
    b(
      e === null ||
        typeof e == "string" ||
        typeof e == "number" ||
        (typeof e == "object" && ".sv" in e),
      "Invalid priority type found: " + typeof e
    ),
    typeof t == "object" &&
      ".value" in t &&
      t[".value"] !== null &&
      (t = t[".value"]),
    typeof t != "object" || ".sv" in t)
  ) {
    const n = t;
    return new je(n, Pe(e));
  }
  if (!(t instanceof Array) && rS) {
    const n = [];
    let r = !1;
    if (
      (He(t, (o, l) => {
        if (o.substring(0, 1) !== ".") {
          const a = Pe(l);
          a.isEmpty() ||
            ((r = r || !a.getPriority().isEmpty()), n.push(new Q(o, a)));
        }
      }),
      n.length === 0)
    )
      return H.EMPTY_NODE;
    const i = Go(n, QE, (o) => o.name, Gu);
    if (r) {
      const o = Go(n, xe.getCompare());
      return new H(i, Pe(e), new Xt({ ".priority": o }, { ".priority": xe }));
    } else return new H(i, Pe(e), Xt.Default);
  } else {
    let n = H.EMPTY_NODE;
    return (
      He(t, (r, s) => {
        if (zt(t, r) && r.substring(0, 1) !== ".") {
          const i = Pe(s);
          (i.isLeafNode() || !i.isEmpty()) &&
            (n = n.updateImmediateChild(r, i));
        }
      }),
      n.updatePriority(Pe(e))
    );
  }
}
XE(Pe);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class sS extends Nl {
  constructor(e) {
    super(),
      (this.indexPath_ = e),
      b(
        !J(e) && K(e) !== ".priority",
        "Can't create PathIndex with empty path or .priority key"
      );
  }
  extractChild(e) {
    return e.getChild(this.indexPath_);
  }
  isDefinedOn(e) {
    return !e.getChild(this.indexPath_).isEmpty();
  }
  compare(e, n) {
    const r = this.extractChild(e.node),
      s = this.extractChild(n.node),
      i = r.compareTo(s);
    return i === 0 ? dr(e.name, n.name) : i;
  }
  makePost(e, n) {
    const r = Pe(e),
      s = H.EMPTY_NODE.updateChild(this.indexPath_, r);
    return new Q(n, s);
  }
  maxPost() {
    const e = H.EMPTY_NODE.updateChild(this.indexPath_, Ri);
    return new Q(rr, e);
  }
  toString() {
    return hi(this.indexPath_, 0).join("/");
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class iS extends Nl {
  compare(e, n) {
    const r = e.node.compareTo(n.node);
    return r === 0 ? dr(e.name, n.name) : r;
  }
  isDefinedOn(e) {
    return !0;
  }
  indexedValueChanged(e, n) {
    return !e.equals(n);
  }
  minPost() {
    return Q.MIN;
  }
  maxPost() {
    return Q.MAX;
  }
  makePost(e, n) {
    const r = Pe(e);
    return new Q(n, r);
  }
  toString() {
    return ".value";
  }
}
const oS = new iS();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function ty(t) {
  return { type: "value", snapshotNode: t };
}
function qr(t, e) {
  return { type: "child_added", snapshotNode: e, childName: t };
}
function fi(t, e) {
  return { type: "child_removed", snapshotNode: e, childName: t };
}
function pi(t, e, n) {
  return { type: "child_changed", snapshotNode: e, childName: t, oldSnap: n };
}
function lS(t, e) {
  return { type: "child_moved", snapshotNode: e, childName: t };
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Vu {
  constructor(e) {
    this.index_ = e;
  }
  updateChild(e, n, r, s, i, o) {
    b(
      e.isIndexed(this.index_),
      "A node must be indexed if only a child is updated"
    );
    const l = e.getImmediateChild(n);
    return (l.getChild(s).equals(r.getChild(s)) &&
      l.isEmpty() === r.isEmpty()) ||
      (o != null &&
        (r.isEmpty()
          ? e.hasChild(n)
            ? o.trackChildChange(fi(n, l))
            : b(
                e.isLeafNode(),
                "A child remove without an old child only makes sense on a leaf node"
              )
          : l.isEmpty()
          ? o.trackChildChange(qr(n, r))
          : o.trackChildChange(pi(n, r, l))),
      e.isLeafNode() && r.isEmpty())
      ? e
      : e.updateImmediateChild(n, r).withIndex(this.index_);
  }
  updateFullNode(e, n, r) {
    return (
      r != null &&
        (e.isLeafNode() ||
          e.forEachChild(xe, (s, i) => {
            n.hasChild(s) || r.trackChildChange(fi(s, i));
          }),
        n.isLeafNode() ||
          n.forEachChild(xe, (s, i) => {
            if (e.hasChild(s)) {
              const o = e.getImmediateChild(s);
              o.equals(i) || r.trackChildChange(pi(s, i, o));
            } else r.trackChildChange(qr(s, i));
          })),
      n.withIndex(this.index_)
    );
  }
  updatePriority(e, n) {
    return e.isEmpty() ? H.EMPTY_NODE : e.updatePriority(n);
  }
  filtersNodes() {
    return !1;
  }
  getIndexedFilter() {
    return this;
  }
  getIndex() {
    return this.index_;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class mi {
  constructor(e) {
    (this.indexedFilter_ = new Vu(e.getIndex())),
      (this.index_ = e.getIndex()),
      (this.startPost_ = mi.getStartPost_(e)),
      (this.endPost_ = mi.getEndPost_(e)),
      (this.startIsInclusive_ = !e.startAfterSet_),
      (this.endIsInclusive_ = !e.endBeforeSet_);
  }
  getStartPost() {
    return this.startPost_;
  }
  getEndPost() {
    return this.endPost_;
  }
  matches(e) {
    const n = this.startIsInclusive_
        ? this.index_.compare(this.getStartPost(), e) <= 0
        : this.index_.compare(this.getStartPost(), e) < 0,
      r = this.endIsInclusive_
        ? this.index_.compare(e, this.getEndPost()) <= 0
        : this.index_.compare(e, this.getEndPost()) < 0;
    return n && r;
  }
  updateChild(e, n, r, s, i, o) {
    return (
      this.matches(new Q(n, r)) || (r = H.EMPTY_NODE),
      this.indexedFilter_.updateChild(e, n, r, s, i, o)
    );
  }
  updateFullNode(e, n, r) {
    n.isLeafNode() && (n = H.EMPTY_NODE);
    let s = n.withIndex(this.index_);
    s = s.updatePriority(H.EMPTY_NODE);
    const i = this;
    return (
      n.forEachChild(xe, (o, l) => {
        i.matches(new Q(o, l)) || (s = s.updateImmediateChild(o, H.EMPTY_NODE));
      }),
      this.indexedFilter_.updateFullNode(e, s, r)
    );
  }
  updatePriority(e, n) {
    return e;
  }
  filtersNodes() {
    return !0;
  }
  getIndexedFilter() {
    return this.indexedFilter_;
  }
  getIndex() {
    return this.index_;
  }
  static getStartPost_(e) {
    if (e.hasStart()) {
      const n = e.getIndexStartName();
      return e.getIndex().makePost(e.getIndexStartValue(), n);
    } else return e.getIndex().minPost();
  }
  static getEndPost_(e) {
    if (e.hasEnd()) {
      const n = e.getIndexEndName();
      return e.getIndex().makePost(e.getIndexEndValue(), n);
    } else return e.getIndex().maxPost();
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class aS {
  constructor(e) {
    (this.withinDirectionalStart = (n) =>
      this.reverse_ ? this.withinEndPost(n) : this.withinStartPost(n)),
      (this.withinDirectionalEnd = (n) =>
        this.reverse_ ? this.withinStartPost(n) : this.withinEndPost(n)),
      (this.withinStartPost = (n) => {
        const r = this.index_.compare(this.rangedFilter_.getStartPost(), n);
        return this.startIsInclusive_ ? r <= 0 : r < 0;
      }),
      (this.withinEndPost = (n) => {
        const r = this.index_.compare(n, this.rangedFilter_.getEndPost());
        return this.endIsInclusive_ ? r <= 0 : r < 0;
      }),
      (this.rangedFilter_ = new mi(e)),
      (this.index_ = e.getIndex()),
      (this.limit_ = e.getLimit()),
      (this.reverse_ = !e.isViewFromLeft()),
      (this.startIsInclusive_ = !e.startAfterSet_),
      (this.endIsInclusive_ = !e.endBeforeSet_);
  }
  updateChild(e, n, r, s, i, o) {
    return (
      this.rangedFilter_.matches(new Q(n, r)) || (r = H.EMPTY_NODE),
      e.getImmediateChild(n).equals(r)
        ? e
        : e.numChildren() < this.limit_
        ? this.rangedFilter_.getIndexedFilter().updateChild(e, n, r, s, i, o)
        : this.fullLimitUpdateChild_(e, n, r, i, o)
    );
  }
  updateFullNode(e, n, r) {
    let s;
    if (n.isLeafNode() || n.isEmpty()) s = H.EMPTY_NODE.withIndex(this.index_);
    else if (this.limit_ * 2 < n.numChildren() && n.isIndexed(this.index_)) {
      s = H.EMPTY_NODE.withIndex(this.index_);
      let i;
      this.reverse_
        ? (i = n.getReverseIteratorFrom(
            this.rangedFilter_.getEndPost(),
            this.index_
          ))
        : (i = n.getIteratorFrom(
            this.rangedFilter_.getStartPost(),
            this.index_
          ));
      let o = 0;
      for (; i.hasNext() && o < this.limit_; ) {
        const l = i.getNext();
        if (this.withinDirectionalStart(l))
          if (this.withinDirectionalEnd(l))
            (s = s.updateImmediateChild(l.name, l.node)), o++;
          else break;
        else continue;
      }
    } else {
      (s = n.withIndex(this.index_)), (s = s.updatePriority(H.EMPTY_NODE));
      let i;
      this.reverse_
        ? (i = s.getReverseIterator(this.index_))
        : (i = s.getIterator(this.index_));
      let o = 0;
      for (; i.hasNext(); ) {
        const l = i.getNext();
        o < this.limit_ &&
        this.withinDirectionalStart(l) &&
        this.withinDirectionalEnd(l)
          ? o++
          : (s = s.updateImmediateChild(l.name, H.EMPTY_NODE));
      }
    }
    return this.rangedFilter_.getIndexedFilter().updateFullNode(e, s, r);
  }
  updatePriority(e, n) {
    return e;
  }
  filtersNodes() {
    return !0;
  }
  getIndexedFilter() {
    return this.rangedFilter_.getIndexedFilter();
  }
  getIndex() {
    return this.index_;
  }
  fullLimitUpdateChild_(e, n, r, s, i) {
    let o;
    if (this.reverse_) {
      const h = this.index_.getCompare();
      o = (f, p) => h(p, f);
    } else o = this.index_.getCompare();
    const l = e;
    b(l.numChildren() === this.limit_, "");
    const a = new Q(n, r),
      c = this.reverse_
        ? l.getFirstChild(this.index_)
        : l.getLastChild(this.index_),
      d = this.rangedFilter_.matches(a);
    if (l.hasChild(n)) {
      const h = l.getImmediateChild(n);
      let f = s.getChildAfterChild(this.index_, c, this.reverse_);
      for (; f != null && (f.name === n || l.hasChild(f.name)); )
        f = s.getChildAfterChild(this.index_, f, this.reverse_);
      const p = f == null ? 1 : o(f, a);
      if (d && !r.isEmpty() && p >= 0)
        return (
          i != null && i.trackChildChange(pi(n, r, h)),
          l.updateImmediateChild(n, r)
        );
      {
        i != null && i.trackChildChange(fi(n, h));
        const w = l.updateImmediateChild(n, H.EMPTY_NODE);
        return f != null && this.rangedFilter_.matches(f)
          ? (i != null && i.trackChildChange(qr(f.name, f.node)),
            w.updateImmediateChild(f.name, f.node))
          : w;
      }
    } else
      return r.isEmpty()
        ? e
        : d && o(c, a) >= 0
        ? (i != null &&
            (i.trackChildChange(fi(c.name, c.node)),
            i.trackChildChange(qr(n, r))),
          l
            .updateImmediateChild(n, r)
            .updateImmediateChild(c.name, H.EMPTY_NODE))
        : e;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Yu {
  constructor() {
    (this.limitSet_ = !1),
      (this.startSet_ = !1),
      (this.startNameSet_ = !1),
      (this.startAfterSet_ = !1),
      (this.endSet_ = !1),
      (this.endNameSet_ = !1),
      (this.endBeforeSet_ = !1),
      (this.limit_ = 0),
      (this.viewFrom_ = ""),
      (this.indexStartValue_ = null),
      (this.indexStartName_ = ""),
      (this.indexEndValue_ = null),
      (this.indexEndName_ = ""),
      (this.index_ = xe);
  }
  hasStart() {
    return this.startSet_;
  }
  isViewFromLeft() {
    return this.viewFrom_ === "" ? this.startSet_ : this.viewFrom_ === "l";
  }
  getIndexStartValue() {
    return (
      b(this.startSet_, "Only valid if start has been set"),
      this.indexStartValue_
    );
  }
  getIndexStartName() {
    return (
      b(this.startSet_, "Only valid if start has been set"),
      this.startNameSet_ ? this.indexStartName_ : Qr
    );
  }
  hasEnd() {
    return this.endSet_;
  }
  getIndexEndValue() {
    return (
      b(this.endSet_, "Only valid if end has been set"), this.indexEndValue_
    );
  }
  getIndexEndName() {
    return (
      b(this.endSet_, "Only valid if end has been set"),
      this.endNameSet_ ? this.indexEndName_ : rr
    );
  }
  hasLimit() {
    return this.limitSet_;
  }
  hasAnchoredLimit() {
    return this.limitSet_ && this.viewFrom_ !== "";
  }
  getLimit() {
    return b(this.limitSet_, "Only valid if limit has been set"), this.limit_;
  }
  getIndex() {
    return this.index_;
  }
  loadsAllData() {
    return !(this.startSet_ || this.endSet_ || this.limitSet_);
  }
  isDefault() {
    return this.loadsAllData() && this.index_ === xe;
  }
  copy() {
    const e = new Yu();
    return (
      (e.limitSet_ = this.limitSet_),
      (e.limit_ = this.limit_),
      (e.startSet_ = this.startSet_),
      (e.startAfterSet_ = this.startAfterSet_),
      (e.indexStartValue_ = this.indexStartValue_),
      (e.startNameSet_ = this.startNameSet_),
      (e.indexStartName_ = this.indexStartName_),
      (e.endSet_ = this.endSet_),
      (e.endBeforeSet_ = this.endBeforeSet_),
      (e.indexEndValue_ = this.indexEndValue_),
      (e.endNameSet_ = this.endNameSet_),
      (e.indexEndName_ = this.indexEndName_),
      (e.index_ = this.index_),
      (e.viewFrom_ = this.viewFrom_),
      e
    );
  }
}
function cS(t) {
  return t.loadsAllData()
    ? new Vu(t.getIndex())
    : t.hasLimit()
    ? new aS(t)
    : new mi(t);
}
function gf(t) {
  const e = {};
  if (t.isDefault()) return e;
  let n;
  if (
    (t.index_ === xe
      ? (n = "$priority")
      : t.index_ === oS
      ? (n = "$value")
      : t.index_ === Ur
      ? (n = "$key")
      : (b(t.index_ instanceof sS, "Unrecognized index type!"),
        (n = t.index_.toString())),
    (e.orderBy = Ie(n)),
    t.startSet_)
  ) {
    const r = t.startAfterSet_ ? "startAfter" : "startAt";
    (e[r] = Ie(t.indexStartValue_)),
      t.startNameSet_ && (e[r] += "," + Ie(t.indexStartName_));
  }
  if (t.endSet_) {
    const r = t.endBeforeSet_ ? "endBefore" : "endAt";
    (e[r] = Ie(t.indexEndValue_)),
      t.endNameSet_ && (e[r] += "," + Ie(t.indexEndName_));
  }
  return (
    t.limitSet_ &&
      (t.isViewFromLeft()
        ? (e.limitToFirst = t.limit_)
        : (e.limitToLast = t.limit_)),
    e
  );
}
function yf(t) {
  const e = {};
  if (
    (t.startSet_ &&
      ((e.sp = t.indexStartValue_),
      t.startNameSet_ && (e.sn = t.indexStartName_),
      (e.sin = !t.startAfterSet_)),
    t.endSet_ &&
      ((e.ep = t.indexEndValue_),
      t.endNameSet_ && (e.en = t.indexEndName_),
      (e.ein = !t.endBeforeSet_)),
    t.limitSet_)
  ) {
    e.l = t.limit_;
    let n = t.viewFrom_;
    n === "" && (t.isViewFromLeft() ? (n = "l") : (n = "r")), (e.vf = n);
  }
  return t.index_ !== xe && (e.i = t.index_.toString()), e;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Vo extends Vg {
  constructor(e, n, r, s) {
    super(),
      (this.repoInfo_ = e),
      (this.onDataUpdate_ = n),
      (this.authTokenProvider_ = r),
      (this.appCheckTokenProvider_ = s),
      (this.log_ = ki("p:rest:")),
      (this.listens_ = {});
  }
  reportStats(e) {
    throw new Error("Method not implemented.");
  }
  static getListenId_(e, n) {
    return n !== void 0
      ? "tag$" + n
      : (b(
          e._queryParams.isDefault(),
          "should have a tag if it's not a default query."
        ),
        e._path.toString());
  }
  listen(e, n, r, s) {
    const i = e._path.toString();
    this.log_("Listen called for " + i + " " + e._queryIdentifier);
    const o = Vo.getListenId_(e, r),
      l = {};
    this.listens_[o] = l;
    const a = gf(e._queryParams);
    this.restRequest_(i + ".json", a, (c, d) => {
      let h = d;
      if (
        (c === 404 && ((h = null), (c = null)),
        c === null && this.onDataUpdate_(i, h, !1, r),
        Kr(this.listens_, o) === l)
      ) {
        let f;
        c
          ? c === 401
            ? (f = "permission_denied")
            : (f = "rest_error:" + c)
          : (f = "ok"),
          s(f, null);
      }
    });
  }
  unlisten(e, n) {
    const r = Vo.getListenId_(e, n);
    delete this.listens_[r];
  }
  get(e) {
    const n = gf(e._queryParams),
      r = e._path.toString(),
      s = new xi();
    return (
      this.restRequest_(r + ".json", n, (i, o) => {
        let l = o;
        i === 404 && ((l = null), (i = null)),
          i === null
            ? (this.onDataUpdate_(r, l, !1, null), s.resolve(l))
            : s.reject(new Error(l));
      }),
      s.promise
    );
  }
  refreshAuthToken(e) {}
  restRequest_(e, n = {}, r) {
    return (
      (n.format = "export"),
      Promise.all([
        this.authTokenProvider_.getToken(!1),
        this.appCheckTokenProvider_.getToken(!1),
      ]).then(([s, i]) => {
        s && s.accessToken && (n.auth = s.accessToken),
          i && i.token && (n.ac = i.token);
        const o =
          (this.repoInfo_.secure ? "https://" : "http://") +
          this.repoInfo_.host +
          e +
          "?ns=" +
          this.repoInfo_.namespace +
          Uw(n);
        this.log_("Sending REST request for " + o);
        const l = new XMLHttpRequest();
        (l.onreadystatechange = () => {
          if (r && l.readyState === 4) {
            this.log_(
              "REST Response for " + o + " received. status:",
              l.status,
              "response:",
              l.responseText
            );
            let a = null;
            if (l.status >= 200 && l.status < 300) {
              try {
                a = ai(l.responseText);
              } catch {
                Xe(
                  "Failed to parse JSON response for " +
                    o +
                    ": " +
                    l.responseText
                );
              }
              r(null, a);
            } else
              l.status !== 401 &&
                l.status !== 404 &&
                Xe(
                  "Got unsuccessful REST response for " +
                    o +
                    " Status: " +
                    l.status
                ),
                r(l.status);
            r = null;
          }
        }),
          l.open("GET", o, !0),
          l.send();
      })
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class uS {
  constructor() {
    this.rootNode_ = H.EMPTY_NODE;
  }
  getNode(e) {
    return this.rootNode_.getChild(e);
  }
  updateSnapshot(e, n) {
    this.rootNode_ = this.rootNode_.updateChild(e, n);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Yo() {
  return { value: null, children: new Map() };
}
function ny(t, e, n) {
  if (J(e)) (t.value = n), t.children.clear();
  else if (t.value !== null) t.value = t.value.updateChild(e, n);
  else {
    const r = K(e);
    t.children.has(r) || t.children.set(r, Yo());
    const s = t.children.get(r);
    (e = ce(e)), ny(s, e, n);
  }
}
function Pc(t, e, n) {
  t.value !== null
    ? n(e, t.value)
    : dS(t, (r, s) => {
        const i = new ie(e.toString() + "/" + r);
        Pc(s, i, n);
      });
}
function dS(t, e) {
  t.children.forEach((n, r) => {
    e(r, n);
  });
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class hS {
  constructor(e) {
    (this.collection_ = e), (this.last_ = null);
  }
  get() {
    const e = this.collection_.get(),
      n = Object.assign({}, e);
    return (
      this.last_ &&
        He(this.last_, (r, s) => {
          n[r] = n[r] - s;
        }),
      (this.last_ = e),
      n
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const vf = 10 * 1e3,
  fS = 30 * 1e3,
  pS = 5 * 60 * 1e3;
class mS {
  constructor(e, n) {
    (this.server_ = n),
      (this.statsToReport_ = {}),
      (this.statsListener_ = new hS(e));
    const r = vf + (fS - vf) * Math.random();
    Fs(this.reportStats_.bind(this), Math.floor(r));
  }
  reportStats_() {
    const e = this.statsListener_.get(),
      n = {};
    let r = !1;
    He(e, (s, i) => {
      i > 0 && zt(this.statsToReport_, s) && ((n[s] = i), (r = !0));
    }),
      r && this.server_.reportStats(n),
      Fs(this.reportStats_.bind(this), Math.floor(Math.random() * 2 * pS));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var Pt;
(function (t) {
  (t[(t.OVERWRITE = 0)] = "OVERWRITE"),
    (t[(t.MERGE = 1)] = "MERGE"),
    (t[(t.ACK_USER_WRITE = 2)] = "ACK_USER_WRITE"),
    (t[(t.LISTEN_COMPLETE = 3)] = "LISTEN_COMPLETE");
})(Pt || (Pt = {}));
function Ku() {
  return { fromUser: !0, fromServer: !1, queryId: null, tagged: !1 };
}
function Qu() {
  return { fromUser: !1, fromServer: !0, queryId: null, tagged: !1 };
}
function qu(t) {
  return { fromUser: !1, fromServer: !0, queryId: t, tagged: !0 };
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Ko {
  constructor(e, n, r) {
    (this.path = e),
      (this.affectedTree = n),
      (this.revert = r),
      (this.type = Pt.ACK_USER_WRITE),
      (this.source = Ku());
  }
  operationForChild(e) {
    if (J(this.path)) {
      if (this.affectedTree.value != null)
        return (
          b(
            this.affectedTree.children.isEmpty(),
            "affectedTree should not have overlapping affected paths."
          ),
          this
        );
      {
        const n = this.affectedTree.subtree(new ie(e));
        return new Ko(te(), n, this.revert);
      }
    } else
      return (
        b(K(this.path) === e, "operationForChild called for unrelated child."),
        new Ko(ce(this.path), this.affectedTree, this.revert)
      );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class gi {
  constructor(e, n) {
    (this.source = e), (this.path = n), (this.type = Pt.LISTEN_COMPLETE);
  }
  operationForChild(e) {
    return J(this.path)
      ? new gi(this.source, te())
      : new gi(this.source, ce(this.path));
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class sr {
  constructor(e, n, r) {
    (this.source = e),
      (this.path = n),
      (this.snap = r),
      (this.type = Pt.OVERWRITE);
  }
  operationForChild(e) {
    return J(this.path)
      ? new sr(this.source, te(), this.snap.getImmediateChild(e))
      : new sr(this.source, ce(this.path), this.snap);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Xr {
  constructor(e, n, r) {
    (this.source = e),
      (this.path = n),
      (this.children = r),
      (this.type = Pt.MERGE);
  }
  operationForChild(e) {
    if (J(this.path)) {
      const n = this.children.subtree(new ie(e));
      return n.isEmpty()
        ? null
        : n.value
        ? new sr(this.source, te(), n.value)
        : new Xr(this.source, te(), n);
    } else
      return (
        b(
          K(this.path) === e,
          "Can't get a merge for a child not on the path of the operation"
        ),
        new Xr(this.source, ce(this.path), this.children)
      );
  }
  toString() {
    return (
      "Operation(" +
      this.path +
      ": " +
      this.source.toString() +
      " merge: " +
      this.children.toString() +
      ")"
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class An {
  constructor(e, n, r) {
    (this.node_ = e), (this.fullyInitialized_ = n), (this.filtered_ = r);
  }
  isFullyInitialized() {
    return this.fullyInitialized_;
  }
  isFiltered() {
    return this.filtered_;
  }
  isCompleteForPath(e) {
    if (J(e)) return this.isFullyInitialized() && !this.filtered_;
    const n = K(e);
    return this.isCompleteForChild(n);
  }
  isCompleteForChild(e) {
    return (
      (this.isFullyInitialized() && !this.filtered_) || this.node_.hasChild(e)
    );
  }
  getNode() {
    return this.node_;
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class gS {
  constructor(e) {
    (this.query_ = e), (this.index_ = this.query_._queryParams.getIndex());
  }
}
function yS(t, e, n, r) {
  const s = [],
    i = [];
  return (
    e.forEach((o) => {
      o.type === "child_changed" &&
        t.index_.indexedValueChanged(o.oldSnap, o.snapshotNode) &&
        i.push(lS(o.childName, o.snapshotNode));
    }),
    Ns(t, s, "child_removed", e, r, n),
    Ns(t, s, "child_added", e, r, n),
    Ns(t, s, "child_moved", i, r, n),
    Ns(t, s, "child_changed", e, r, n),
    Ns(t, s, "value", e, r, n),
    s
  );
}
function Ns(t, e, n, r, s, i) {
  const o = r.filter((l) => l.type === n);
  o.sort((l, a) => _S(t, l, a)),
    o.forEach((l) => {
      const a = vS(t, l, i);
      s.forEach((c) => {
        c.respondsTo(l.type) && e.push(c.createEvent(a, t.query_));
      });
    });
}
function vS(t, e, n) {
  return (
    e.type === "value" ||
      e.type === "child_removed" ||
      (e.prevName = n.getPredecessorChildName(
        e.childName,
        e.snapshotNode,
        t.index_
      )),
    e
  );
}
function _S(t, e, n) {
  if (e.childName == null || n.childName == null)
    throw ls("Should only compare child_ events.");
  const r = new Q(e.childName, e.snapshotNode),
    s = new Q(n.childName, n.snapshotNode);
  return t.index_.compare(r, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Tl(t, e) {
  return { eventCache: t, serverCache: e };
}
function Us(t, e, n, r) {
  return Tl(new An(e, n, r), t.serverCache);
}
function ry(t, e, n, r) {
  return Tl(t.eventCache, new An(e, n, r));
}
function Qo(t) {
  return t.eventCache.isFullyInitialized() ? t.eventCache.getNode() : null;
}
function ir(t) {
  return t.serverCache.isFullyInitialized() ? t.serverCache.getNode() : null;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let wa;
const wS = () => (wa || (wa = new rt(sE)), wa);
class le {
  constructor(e, n = wS()) {
    (this.value = e), (this.children = n);
  }
  static fromObject(e) {
    let n = new le(null);
    return (
      He(e, (r, s) => {
        n = n.set(new ie(r), s);
      }),
      n
    );
  }
  isEmpty() {
    return this.value === null && this.children.isEmpty();
  }
  findRootMostMatchingPathAndValue(e, n) {
    if (this.value != null && n(this.value))
      return { path: te(), value: this.value };
    if (J(e)) return null;
    {
      const r = K(e),
        s = this.children.get(r);
      if (s !== null) {
        const i = s.findRootMostMatchingPathAndValue(ce(e), n);
        return i != null
          ? { path: Se(new ie(r), i.path), value: i.value }
          : null;
      } else return null;
    }
  }
  findRootMostValueAndPath(e) {
    return this.findRootMostMatchingPathAndValue(e, () => !0);
  }
  subtree(e) {
    if (J(e)) return this;
    {
      const n = K(e),
        r = this.children.get(n);
      return r !== null ? r.subtree(ce(e)) : new le(null);
    }
  }
  set(e, n) {
    if (J(e)) return new le(n, this.children);
    {
      const r = K(e),
        i = (this.children.get(r) || new le(null)).set(ce(e), n),
        o = this.children.insert(r, i);
      return new le(this.value, o);
    }
  }
  remove(e) {
    if (J(e))
      return this.children.isEmpty()
        ? new le(null)
        : new le(null, this.children);
    {
      const n = K(e),
        r = this.children.get(n);
      if (r) {
        const s = r.remove(ce(e));
        let i;
        return (
          s.isEmpty()
            ? (i = this.children.remove(n))
            : (i = this.children.insert(n, s)),
          this.value === null && i.isEmpty()
            ? new le(null)
            : new le(this.value, i)
        );
      } else return this;
    }
  }
  get(e) {
    if (J(e)) return this.value;
    {
      const n = K(e),
        r = this.children.get(n);
      return r ? r.get(ce(e)) : null;
    }
  }
  setTree(e, n) {
    if (J(e)) return n;
    {
      const r = K(e),
        i = (this.children.get(r) || new le(null)).setTree(ce(e), n);
      let o;
      return (
        i.isEmpty()
          ? (o = this.children.remove(r))
          : (o = this.children.insert(r, i)),
        new le(this.value, o)
      );
    }
  }
  fold(e) {
    return this.fold_(te(), e);
  }
  fold_(e, n) {
    const r = {};
    return (
      this.children.inorderTraversal((s, i) => {
        r[s] = i.fold_(Se(e, s), n);
      }),
      n(e, this.value, r)
    );
  }
  findOnPath(e, n) {
    return this.findOnPath_(e, te(), n);
  }
  findOnPath_(e, n, r) {
    const s = this.value ? r(n, this.value) : !1;
    if (s) return s;
    if (J(e)) return null;
    {
      const i = K(e),
        o = this.children.get(i);
      return o ? o.findOnPath_(ce(e), Se(n, i), r) : null;
    }
  }
  foreachOnPath(e, n) {
    return this.foreachOnPath_(e, te(), n);
  }
  foreachOnPath_(e, n, r) {
    if (J(e)) return this;
    {
      this.value && r(n, this.value);
      const s = K(e),
        i = this.children.get(s);
      return i ? i.foreachOnPath_(ce(e), Se(n, s), r) : new le(null);
    }
  }
  foreach(e) {
    this.foreach_(te(), e);
  }
  foreach_(e, n) {
    this.children.inorderTraversal((r, s) => {
      s.foreach_(Se(e, r), n);
    }),
      this.value && n(e, this.value);
  }
  foreachChild(e) {
    this.children.inorderTraversal((n, r) => {
      r.value && e(n, r.value);
    });
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class bt {
  constructor(e) {
    this.writeTree_ = e;
  }
  static empty() {
    return new bt(new le(null));
  }
}
function Bs(t, e, n) {
  if (J(e)) return new bt(new le(n));
  {
    const r = t.writeTree_.findRootMostValueAndPath(e);
    if (r != null) {
      const s = r.path;
      let i = r.value;
      const o = Qe(s, e);
      return (i = i.updateChild(o, n)), new bt(t.writeTree_.set(s, i));
    } else {
      const s = new le(n),
        i = t.writeTree_.setTree(e, s);
      return new bt(i);
    }
  }
}
function Ic(t, e, n) {
  let r = t;
  return (
    He(n, (s, i) => {
      r = Bs(r, Se(e, s), i);
    }),
    r
  );
}
function _f(t, e) {
  if (J(e)) return bt.empty();
  {
    const n = t.writeTree_.setTree(e, new le(null));
    return new bt(n);
  }
}
function Oc(t, e) {
  return hr(t, e) != null;
}
function hr(t, e) {
  const n = t.writeTree_.findRootMostValueAndPath(e);
  return n != null ? t.writeTree_.get(n.path).getChild(Qe(n.path, e)) : null;
}
function wf(t) {
  const e = [],
    n = t.writeTree_.value;
  return (
    n != null
      ? n.isLeafNode() ||
        n.forEachChild(xe, (r, s) => {
          e.push(new Q(r, s));
        })
      : t.writeTree_.children.inorderTraversal((r, s) => {
          s.value != null && e.push(new Q(r, s.value));
        }),
    e
  );
}
function Rn(t, e) {
  if (J(e)) return t;
  {
    const n = hr(t, e);
    return n != null ? new bt(new le(n)) : new bt(t.writeTree_.subtree(e));
  }
}
function bc(t) {
  return t.writeTree_.isEmpty();
}
function Jr(t, e) {
  return sy(te(), t.writeTree_, e);
}
function sy(t, e, n) {
  if (e.value != null) return n.updateChild(t, e.value);
  {
    let r = null;
    return (
      e.children.inorderTraversal((s, i) => {
        s === ".priority"
          ? (b(i.value !== null, "Priority writes must always be leaf nodes"),
            (r = i.value))
          : (n = sy(Se(t, s), i, n));
      }),
      !n.getChild(t).isEmpty() &&
        r !== null &&
        (n = n.updateChild(Se(t, ".priority"), r)),
      n
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function kl(t, e) {
  return ay(e, t);
}
function CS(t, e, n, r, s) {
  b(r > t.lastWriteId, "Stacking an older write on top of newer ones"),
    s === void 0 && (s = !0),
    t.allWrites.push({ path: e, snap: n, writeId: r, visible: s }),
    s && (t.visibleWrites = Bs(t.visibleWrites, e, n)),
    (t.lastWriteId = r);
}
function ES(t, e, n, r) {
  b(r > t.lastWriteId, "Stacking an older merge on top of newer ones"),
    t.allWrites.push({ path: e, children: n, writeId: r, visible: !0 }),
    (t.visibleWrites = Ic(t.visibleWrites, e, n)),
    (t.lastWriteId = r);
}
function SS(t, e) {
  for (let n = 0; n < t.allWrites.length; n++) {
    const r = t.allWrites[n];
    if (r.writeId === e) return r;
  }
  return null;
}
function xS(t, e) {
  const n = t.allWrites.findIndex((l) => l.writeId === e);
  b(n >= 0, "removeWrite called with nonexistent writeId.");
  const r = t.allWrites[n];
  t.allWrites.splice(n, 1);
  let s = r.visible,
    i = !1,
    o = t.allWrites.length - 1;
  for (; s && o >= 0; ) {
    const l = t.allWrites[o];
    l.visible &&
      (o >= n && NS(l, r.path) ? (s = !1) : _t(r.path, l.path) && (i = !0)),
      o--;
  }
  if (s) {
    if (i) return TS(t), !0;
    if (r.snap) t.visibleWrites = _f(t.visibleWrites, r.path);
    else {
      const l = r.children;
      He(l, (a) => {
        t.visibleWrites = _f(t.visibleWrites, Se(r.path, a));
      });
    }
    return !0;
  } else return !1;
}
function NS(t, e) {
  if (t.snap) return _t(t.path, e);
  for (const n in t.children)
    if (t.children.hasOwnProperty(n) && _t(Se(t.path, n), e)) return !0;
  return !1;
}
function TS(t) {
  (t.visibleWrites = iy(t.allWrites, kS, te())),
    t.allWrites.length > 0
      ? (t.lastWriteId = t.allWrites[t.allWrites.length - 1].writeId)
      : (t.lastWriteId = -1);
}
function kS(t) {
  return t.visible;
}
function iy(t, e, n) {
  let r = bt.empty();
  for (let s = 0; s < t.length; ++s) {
    const i = t[s];
    if (e(i)) {
      const o = i.path;
      let l;
      if (i.snap)
        _t(n, o)
          ? ((l = Qe(n, o)), (r = Bs(r, l, i.snap)))
          : _t(o, n) && ((l = Qe(o, n)), (r = Bs(r, te(), i.snap.getChild(l))));
      else if (i.children) {
        if (_t(n, o)) (l = Qe(n, o)), (r = Ic(r, l, i.children));
        else if (_t(o, n))
          if (((l = Qe(o, n)), J(l))) r = Ic(r, te(), i.children);
          else {
            const a = Kr(i.children, K(l));
            if (a) {
              const c = a.getChild(ce(l));
              r = Bs(r, te(), c);
            }
          }
      } else throw ls("WriteRecord should have .snap or .children");
    }
  }
  return r;
}
function oy(t, e, n, r, s) {
  if (!r && !s) {
    const i = hr(t.visibleWrites, e);
    if (i != null) return i;
    {
      const o = Rn(t.visibleWrites, e);
      if (bc(o)) return n;
      if (n == null && !Oc(o, te())) return null;
      {
        const l = n || H.EMPTY_NODE;
        return Jr(o, l);
      }
    }
  } else {
    const i = Rn(t.visibleWrites, e);
    if (!s && bc(i)) return n;
    if (!s && n == null && !Oc(i, te())) return null;
    {
      const o = function (c) {
          return (
            (c.visible || s) &&
            (!r || !~r.indexOf(c.writeId)) &&
            (_t(c.path, e) || _t(e, c.path))
          );
        },
        l = iy(t.allWrites, o, e),
        a = n || H.EMPTY_NODE;
      return Jr(l, a);
    }
  }
}
function RS(t, e, n) {
  let r = H.EMPTY_NODE;
  const s = hr(t.visibleWrites, e);
  if (s)
    return (
      s.isLeafNode() ||
        s.forEachChild(xe, (i, o) => {
          r = r.updateImmediateChild(i, o);
        }),
      r
    );
  if (n) {
    const i = Rn(t.visibleWrites, e);
    return (
      n.forEachChild(xe, (o, l) => {
        const a = Jr(Rn(i, new ie(o)), l);
        r = r.updateImmediateChild(o, a);
      }),
      wf(i).forEach((o) => {
        r = r.updateImmediateChild(o.name, o.node);
      }),
      r
    );
  } else {
    const i = Rn(t.visibleWrites, e);
    return (
      wf(i).forEach((o) => {
        r = r.updateImmediateChild(o.name, o.node);
      }),
      r
    );
  }
}
function PS(t, e, n, r, s) {
  b(r || s, "Either existingEventSnap or existingServerSnap must exist");
  const i = Se(e, n);
  if (Oc(t.visibleWrites, i)) return null;
  {
    const o = Rn(t.visibleWrites, i);
    return bc(o) ? s.getChild(n) : Jr(o, s.getChild(n));
  }
}
function IS(t, e, n, r) {
  const s = Se(e, n),
    i = hr(t.visibleWrites, s);
  if (i != null) return i;
  if (r.isCompleteForChild(n)) {
    const o = Rn(t.visibleWrites, s);
    return Jr(o, r.getNode().getImmediateChild(n));
  } else return null;
}
function OS(t, e) {
  return hr(t.visibleWrites, e);
}
function bS(t, e, n, r, s, i, o) {
  let l;
  const a = Rn(t.visibleWrites, e),
    c = hr(a, te());
  if (c != null) l = c;
  else if (n != null) l = Jr(a, n);
  else return [];
  if (((l = l.withIndex(o)), !l.isEmpty() && !l.isLeafNode())) {
    const d = [],
      h = o.getCompare(),
      f = i ? l.getReverseIteratorFrom(r, o) : l.getIteratorFrom(r, o);
    let p = f.getNext();
    for (; p && d.length < s; ) h(p, r) !== 0 && d.push(p), (p = f.getNext());
    return d;
  } else return [];
}
function AS() {
  return { visibleWrites: bt.empty(), allWrites: [], lastWriteId: -1 };
}
function qo(t, e, n, r) {
  return oy(t.writeTree, t.treePath, e, n, r);
}
function Xu(t, e) {
  return RS(t.writeTree, t.treePath, e);
}
function Cf(t, e, n, r) {
  return PS(t.writeTree, t.treePath, e, n, r);
}
function Xo(t, e) {
  return OS(t.writeTree, Se(t.treePath, e));
}
function jS(t, e, n, r, s, i) {
  return bS(t.writeTree, t.treePath, e, n, r, s, i);
}
function Ju(t, e, n) {
  return IS(t.writeTree, t.treePath, e, n);
}
function ly(t, e) {
  return ay(Se(t.treePath, e), t.writeTree);
}
function ay(t, e) {
  return { treePath: t, writeTree: e };
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class MS {
  constructor() {
    this.changeMap = new Map();
  }
  trackChildChange(e) {
    const n = e.type,
      r = e.childName;
    b(
      n === "child_added" || n === "child_changed" || n === "child_removed",
      "Only child changes supported for tracking"
    ),
      b(r !== ".priority", "Only non-priority child changes can be tracked.");
    const s = this.changeMap.get(r);
    if (s) {
      const i = s.type;
      if (n === "child_added" && i === "child_removed")
        this.changeMap.set(r, pi(r, e.snapshotNode, s.snapshotNode));
      else if (n === "child_removed" && i === "child_added")
        this.changeMap.delete(r);
      else if (n === "child_removed" && i === "child_changed")
        this.changeMap.set(r, fi(r, s.oldSnap));
      else if (n === "child_changed" && i === "child_added")
        this.changeMap.set(r, qr(r, e.snapshotNode));
      else if (n === "child_changed" && i === "child_changed")
        this.changeMap.set(r, pi(r, e.snapshotNode, s.oldSnap));
      else
        throw ls(
          "Illegal combination of changes: " + e + " occurred after " + s
        );
    } else this.changeMap.set(r, e);
  }
  getChanges() {
    return Array.from(this.changeMap.values());
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class DS {
  getCompleteChild(e) {
    return null;
  }
  getChildAfterChild(e, n, r) {
    return null;
  }
}
const cy = new DS();
class Zu {
  constructor(e, n, r = null) {
    (this.writes_ = e),
      (this.viewCache_ = n),
      (this.optCompleteServerCache_ = r);
  }
  getCompleteChild(e) {
    const n = this.viewCache_.eventCache;
    if (n.isCompleteForChild(e)) return n.getNode().getImmediateChild(e);
    {
      const r =
        this.optCompleteServerCache_ != null
          ? new An(this.optCompleteServerCache_, !0, !1)
          : this.viewCache_.serverCache;
      return Ju(this.writes_, e, r);
    }
  }
  getChildAfterChild(e, n, r) {
    const s =
        this.optCompleteServerCache_ != null
          ? this.optCompleteServerCache_
          : ir(this.viewCache_),
      i = jS(this.writes_, s, n, 1, r, e);
    return i.length === 0 ? null : i[0];
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function LS(t) {
  return { filter: t };
}
function $S(t, e) {
  b(
    e.eventCache.getNode().isIndexed(t.filter.getIndex()),
    "Event snap not indexed"
  ),
    b(
      e.serverCache.getNode().isIndexed(t.filter.getIndex()),
      "Server snap not indexed"
    );
}
function FS(t, e, n, r, s) {
  const i = new MS();
  let o, l;
  if (n.type === Pt.OVERWRITE) {
    const c = n;
    c.source.fromUser
      ? (o = Ac(t, e, c.path, c.snap, r, s, i))
      : (b(c.source.fromServer, "Unknown source."),
        (l = c.source.tagged || (e.serverCache.isFiltered() && !J(c.path))),
        (o = Jo(t, e, c.path, c.snap, r, s, l, i)));
  } else if (n.type === Pt.MERGE) {
    const c = n;
    c.source.fromUser
      ? (o = BS(t, e, c.path, c.children, r, s, i))
      : (b(c.source.fromServer, "Unknown source."),
        (l = c.source.tagged || e.serverCache.isFiltered()),
        (o = jc(t, e, c.path, c.children, r, s, l, i)));
  } else if (n.type === Pt.ACK_USER_WRITE) {
    const c = n;
    c.revert
      ? (o = WS(t, e, c.path, r, s, i))
      : (o = zS(t, e, c.path, c.affectedTree, r, s, i));
  } else if (n.type === Pt.LISTEN_COMPLETE) o = HS(t, e, n.path, r, i);
  else throw ls("Unknown operation type: " + n.type);
  const a = i.getChanges();
  return US(e, o, a), { viewCache: o, changes: a };
}
function US(t, e, n) {
  const r = e.eventCache;
  if (r.isFullyInitialized()) {
    const s = r.getNode().isLeafNode() || r.getNode().isEmpty(),
      i = Qo(t);
    (n.length > 0 ||
      !t.eventCache.isFullyInitialized() ||
      (s && !r.getNode().equals(i)) ||
      !r.getNode().getPriority().equals(i.getPriority())) &&
      n.push(ty(Qo(e)));
  }
}
function uy(t, e, n, r, s, i) {
  const o = e.eventCache;
  if (Xo(r, n) != null) return e;
  {
    let l, a;
    if (J(n))
      if (
        (b(
          e.serverCache.isFullyInitialized(),
          "If change path is empty, we must have complete server data"
        ),
        e.serverCache.isFiltered())
      ) {
        const c = ir(e),
          d = c instanceof H ? c : H.EMPTY_NODE,
          h = Xu(r, d);
        l = t.filter.updateFullNode(e.eventCache.getNode(), h, i);
      } else {
        const c = qo(r, ir(e));
        l = t.filter.updateFullNode(e.eventCache.getNode(), c, i);
      }
    else {
      const c = K(n);
      if (c === ".priority") {
        b(bn(n) === 1, "Can't have a priority with additional path components");
        const d = o.getNode();
        a = e.serverCache.getNode();
        const h = Cf(r, n, d, a);
        h != null ? (l = t.filter.updatePriority(d, h)) : (l = o.getNode());
      } else {
        const d = ce(n);
        let h;
        if (o.isCompleteForChild(c)) {
          a = e.serverCache.getNode();
          const f = Cf(r, n, o.getNode(), a);
          f != null
            ? (h = o.getNode().getImmediateChild(c).updateChild(d, f))
            : (h = o.getNode().getImmediateChild(c));
        } else h = Ju(r, c, e.serverCache);
        h != null
          ? (l = t.filter.updateChild(o.getNode(), c, h, d, s, i))
          : (l = o.getNode());
      }
    }
    return Us(e, l, o.isFullyInitialized() || J(n), t.filter.filtersNodes());
  }
}
function Jo(t, e, n, r, s, i, o, l) {
  const a = e.serverCache;
  let c;
  const d = o ? t.filter : t.filter.getIndexedFilter();
  if (J(n)) c = d.updateFullNode(a.getNode(), r, null);
  else if (d.filtersNodes() && !a.isFiltered()) {
    const p = a.getNode().updateChild(n, r);
    c = d.updateFullNode(a.getNode(), p, null);
  } else {
    const p = K(n);
    if (!a.isCompleteForPath(n) && bn(n) > 1) return e;
    const g = ce(n),
      E = a.getNode().getImmediateChild(p).updateChild(g, r);
    p === ".priority"
      ? (c = d.updatePriority(a.getNode(), E))
      : (c = d.updateChild(a.getNode(), p, E, g, cy, null));
  }
  const h = ry(e, c, a.isFullyInitialized() || J(n), d.filtersNodes()),
    f = new Zu(s, h, i);
  return uy(t, h, n, s, f, l);
}
function Ac(t, e, n, r, s, i, o) {
  const l = e.eventCache;
  let a, c;
  const d = new Zu(s, e, i);
  if (J(n))
    (c = t.filter.updateFullNode(e.eventCache.getNode(), r, o)),
      (a = Us(e, c, !0, t.filter.filtersNodes()));
  else {
    const h = K(n);
    if (h === ".priority")
      (c = t.filter.updatePriority(e.eventCache.getNode(), r)),
        (a = Us(e, c, l.isFullyInitialized(), l.isFiltered()));
    else {
      const f = ce(n),
        p = l.getNode().getImmediateChild(h);
      let g;
      if (J(f)) g = r;
      else {
        const w = d.getCompleteChild(h);
        w != null
          ? zu(f) === ".priority" && w.getChild(Kg(f)).isEmpty()
            ? (g = w)
            : (g = w.updateChild(f, r))
          : (g = H.EMPTY_NODE);
      }
      if (p.equals(g)) a = e;
      else {
        const w = t.filter.updateChild(l.getNode(), h, g, f, d, o);
        a = Us(e, w, l.isFullyInitialized(), t.filter.filtersNodes());
      }
    }
  }
  return a;
}
function Ef(t, e) {
  return t.eventCache.isCompleteForChild(e);
}
function BS(t, e, n, r, s, i, o) {
  let l = e;
  return (
    r.foreach((a, c) => {
      const d = Se(n, a);
      Ef(e, K(d)) && (l = Ac(t, l, d, c, s, i, o));
    }),
    r.foreach((a, c) => {
      const d = Se(n, a);
      Ef(e, K(d)) || (l = Ac(t, l, d, c, s, i, o));
    }),
    l
  );
}
function Sf(t, e, n) {
  return (
    n.foreach((r, s) => {
      e = e.updateChild(r, s);
    }),
    e
  );
}
function jc(t, e, n, r, s, i, o, l) {
  if (e.serverCache.getNode().isEmpty() && !e.serverCache.isFullyInitialized())
    return e;
  let a = e,
    c;
  J(n) ? (c = r) : (c = new le(null).setTree(n, r));
  const d = e.serverCache.getNode();
  return (
    c.children.inorderTraversal((h, f) => {
      if (d.hasChild(h)) {
        const p = e.serverCache.getNode().getImmediateChild(h),
          g = Sf(t, p, f);
        a = Jo(t, a, new ie(h), g, s, i, o, l);
      }
    }),
    c.children.inorderTraversal((h, f) => {
      const p = !e.serverCache.isCompleteForChild(h) && f.value === null;
      if (!d.hasChild(h) && !p) {
        const g = e.serverCache.getNode().getImmediateChild(h),
          w = Sf(t, g, f);
        a = Jo(t, a, new ie(h), w, s, i, o, l);
      }
    }),
    a
  );
}
function zS(t, e, n, r, s, i, o) {
  if (Xo(s, n) != null) return e;
  const l = e.serverCache.isFiltered(),
    a = e.serverCache;
  if (r.value != null) {
    if ((J(n) && a.isFullyInitialized()) || a.isCompleteForPath(n))
      return Jo(t, e, n, a.getNode().getChild(n), s, i, l, o);
    if (J(n)) {
      let c = new le(null);
      return (
        a.getNode().forEachChild(Ur, (d, h) => {
          c = c.set(new ie(d), h);
        }),
        jc(t, e, n, c, s, i, l, o)
      );
    } else return e;
  } else {
    let c = new le(null);
    return (
      r.foreach((d, h) => {
        const f = Se(n, d);
        a.isCompleteForPath(f) && (c = c.set(d, a.getNode().getChild(f)));
      }),
      jc(t, e, n, c, s, i, l, o)
    );
  }
}
function HS(t, e, n, r, s) {
  const i = e.serverCache,
    o = ry(e, i.getNode(), i.isFullyInitialized() || J(n), i.isFiltered());
  return uy(t, o, n, r, cy, s);
}
function WS(t, e, n, r, s, i) {
  let o;
  if (Xo(r, n) != null) return e;
  {
    const l = new Zu(r, e, s),
      a = e.eventCache.getNode();
    let c;
    if (J(n) || K(n) === ".priority") {
      let d;
      if (e.serverCache.isFullyInitialized()) d = qo(r, ir(e));
      else {
        const h = e.serverCache.getNode();
        b(h instanceof H, "serverChildren would be complete if leaf node"),
          (d = Xu(r, h));
      }
      (d = d), (c = t.filter.updateFullNode(a, d, i));
    } else {
      const d = K(n);
      let h = Ju(r, d, e.serverCache);
      h == null &&
        e.serverCache.isCompleteForChild(d) &&
        (h = a.getImmediateChild(d)),
        h != null
          ? (c = t.filter.updateChild(a, d, h, ce(n), l, i))
          : e.eventCache.getNode().hasChild(d)
          ? (c = t.filter.updateChild(a, d, H.EMPTY_NODE, ce(n), l, i))
          : (c = a),
        c.isEmpty() &&
          e.serverCache.isFullyInitialized() &&
          ((o = qo(r, ir(e))),
          o.isLeafNode() && (c = t.filter.updateFullNode(c, o, i)));
    }
    return (
      (o = e.serverCache.isFullyInitialized() || Xo(r, te()) != null),
      Us(e, c, o, t.filter.filtersNodes())
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class GS {
  constructor(e, n) {
    (this.query_ = e), (this.eventRegistrations_ = []);
    const r = this.query_._queryParams,
      s = new Vu(r.getIndex()),
      i = cS(r);
    this.processor_ = LS(i);
    const o = n.serverCache,
      l = n.eventCache,
      a = s.updateFullNode(H.EMPTY_NODE, o.getNode(), null),
      c = i.updateFullNode(H.EMPTY_NODE, l.getNode(), null),
      d = new An(a, o.isFullyInitialized(), s.filtersNodes()),
      h = new An(c, l.isFullyInitialized(), i.filtersNodes());
    (this.viewCache_ = Tl(h, d)), (this.eventGenerator_ = new gS(this.query_));
  }
  get query() {
    return this.query_;
  }
}
function VS(t) {
  return t.viewCache_.serverCache.getNode();
}
function YS(t) {
  return Qo(t.viewCache_);
}
function KS(t, e) {
  const n = ir(t.viewCache_);
  return n &&
    (t.query._queryParams.loadsAllData() ||
      (!J(e) && !n.getImmediateChild(K(e)).isEmpty()))
    ? n.getChild(e)
    : null;
}
function xf(t) {
  return t.eventRegistrations_.length === 0;
}
function QS(t, e) {
  t.eventRegistrations_.push(e);
}
function Nf(t, e, n) {
  const r = [];
  if (n) {
    b(e == null, "A cancel should cancel all event registrations.");
    const s = t.query._path;
    t.eventRegistrations_.forEach((i) => {
      const o = i.createCancelEvent(n, s);
      o && r.push(o);
    });
  }
  if (e) {
    let s = [];
    for (let i = 0; i < t.eventRegistrations_.length; ++i) {
      const o = t.eventRegistrations_[i];
      if (!o.matches(e)) s.push(o);
      else if (e.hasAnyCallback()) {
        s = s.concat(t.eventRegistrations_.slice(i + 1));
        break;
      }
    }
    t.eventRegistrations_ = s;
  } else t.eventRegistrations_ = [];
  return r;
}
function Tf(t, e, n, r) {
  e.type === Pt.MERGE &&
    e.source.queryId !== null &&
    (b(
      ir(t.viewCache_),
      "We should always have a full cache before handling merges"
    ),
    b(
      Qo(t.viewCache_),
      "Missing event cache, even though we have a server cache"
    ));
  const s = t.viewCache_,
    i = FS(t.processor_, s, e, n, r);
  return (
    $S(t.processor_, i.viewCache),
    b(
      i.viewCache.serverCache.isFullyInitialized() ||
        !s.serverCache.isFullyInitialized(),
      "Once a server snap is complete, it should never go back"
    ),
    (t.viewCache_ = i.viewCache),
    dy(t, i.changes, i.viewCache.eventCache.getNode(), null)
  );
}
function qS(t, e) {
  const n = t.viewCache_.eventCache,
    r = [];
  return (
    n.getNode().isLeafNode() ||
      n.getNode().forEachChild(xe, (i, o) => {
        r.push(qr(i, o));
      }),
    n.isFullyInitialized() && r.push(ty(n.getNode())),
    dy(t, r, n.getNode(), e)
  );
}
function dy(t, e, n, r) {
  const s = r ? [r] : t.eventRegistrations_;
  return yS(t.eventGenerator_, e, n, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let Zo;
class hy {
  constructor() {
    this.views = new Map();
  }
}
function XS(t) {
  b(!Zo, "__referenceConstructor has already been defined"), (Zo = t);
}
function JS() {
  return b(Zo, "Reference.ts has not been loaded"), Zo;
}
function ZS(t) {
  return t.views.size === 0;
}
function ed(t, e, n, r) {
  const s = e.source.queryId;
  if (s !== null) {
    const i = t.views.get(s);
    return (
      b(i != null, "SyncTree gave us an op for an invalid query."),
      Tf(i, e, n, r)
    );
  } else {
    let i = [];
    for (const o of t.views.values()) i = i.concat(Tf(o, e, n, r));
    return i;
  }
}
function fy(t, e, n, r, s) {
  const i = e._queryIdentifier,
    o = t.views.get(i);
  if (!o) {
    let l = qo(n, s ? r : null),
      a = !1;
    l
      ? (a = !0)
      : r instanceof H
      ? ((l = Xu(n, r)), (a = !1))
      : ((l = H.EMPTY_NODE), (a = !1));
    const c = Tl(new An(l, a, !1), new An(r, s, !1));
    return new GS(e, c);
  }
  return o;
}
function ex(t, e, n, r, s, i) {
  const o = fy(t, e, r, s, i);
  return (
    t.views.has(e._queryIdentifier) || t.views.set(e._queryIdentifier, o),
    QS(o, n),
    qS(o, n)
  );
}
function tx(t, e, n, r) {
  const s = e._queryIdentifier,
    i = [];
  let o = [];
  const l = jn(t);
  if (s === "default")
    for (const [a, c] of t.views.entries())
      (o = o.concat(Nf(c, n, r))),
        xf(c) &&
          (t.views.delete(a),
          c.query._queryParams.loadsAllData() || i.push(c.query));
  else {
    const a = t.views.get(s);
    a &&
      ((o = o.concat(Nf(a, n, r))),
      xf(a) &&
        (t.views.delete(s),
        a.query._queryParams.loadsAllData() || i.push(a.query)));
  }
  return (
    l && !jn(t) && i.push(new (JS())(e._repo, e._path)),
    { removed: i, events: o }
  );
}
function py(t) {
  const e = [];
  for (const n of t.views.values())
    n.query._queryParams.loadsAllData() || e.push(n);
  return e;
}
function Pn(t, e) {
  let n = null;
  for (const r of t.views.values()) n = n || KS(r, e);
  return n;
}
function my(t, e) {
  if (e._queryParams.loadsAllData()) return Rl(t);
  {
    const r = e._queryIdentifier;
    return t.views.get(r);
  }
}
function gy(t, e) {
  return my(t, e) != null;
}
function jn(t) {
  return Rl(t) != null;
}
function Rl(t) {
  for (const e of t.views.values())
    if (e.query._queryParams.loadsAllData()) return e;
  return null;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ let el;
function nx(t) {
  b(!el, "__referenceConstructor has already been defined"), (el = t);
}
function rx() {
  return b(el, "Reference.ts has not been loaded"), el;
}
let sx = 1;
class kf {
  constructor(e) {
    (this.listenProvider_ = e),
      (this.syncPointTree_ = new le(null)),
      (this.pendingWriteTree_ = AS()),
      (this.tagToQueryMap = new Map()),
      (this.queryToTagMap = new Map());
  }
}
function yy(t, e, n, r, s) {
  return (
    CS(t.pendingWriteTree_, e, n, r, s), s ? cs(t, new sr(Ku(), e, n)) : []
  );
}
function ix(t, e, n, r) {
  ES(t.pendingWriteTree_, e, n, r);
  const s = le.fromObject(n);
  return cs(t, new Xr(Ku(), e, s));
}
function yn(t, e, n = !1) {
  const r = SS(t.pendingWriteTree_, e);
  if (xS(t.pendingWriteTree_, e)) {
    let i = new le(null);
    return (
      r.snap != null
        ? (i = i.set(te(), !0))
        : He(r.children, (o) => {
            i = i.set(new ie(o), !0);
          }),
      cs(t, new Ko(r.path, i, n))
    );
  } else return [];
}
function Pi(t, e, n) {
  return cs(t, new sr(Qu(), e, n));
}
function ox(t, e, n) {
  const r = le.fromObject(n);
  return cs(t, new Xr(Qu(), e, r));
}
function lx(t, e) {
  return cs(t, new gi(Qu(), e));
}
function ax(t, e, n) {
  const r = nd(t, n);
  if (r) {
    const s = rd(r),
      i = s.path,
      o = s.queryId,
      l = Qe(i, e),
      a = new gi(qu(o), l);
    return sd(t, i, a);
  } else return [];
}
function tl(t, e, n, r, s = !1) {
  const i = e._path,
    o = t.syncPointTree_.get(i);
  let l = [];
  if (o && (e._queryIdentifier === "default" || gy(o, e))) {
    const a = tx(o, e, n, r);
    ZS(o) && (t.syncPointTree_ = t.syncPointTree_.remove(i));
    const c = a.removed;
    if (((l = a.events), !s)) {
      const d = c.findIndex((f) => f._queryParams.loadsAllData()) !== -1,
        h = t.syncPointTree_.findOnPath(i, (f, p) => jn(p));
      if (d && !h) {
        const f = t.syncPointTree_.subtree(i);
        if (!f.isEmpty()) {
          const p = dx(f);
          for (let g = 0; g < p.length; ++g) {
            const w = p[g],
              E = w.query,
              y = Cy(t, w);
            t.listenProvider_.startListening(
              zs(E),
              yi(t, E),
              y.hashFn,
              y.onComplete
            );
          }
        }
      }
      !h &&
        c.length > 0 &&
        !r &&
        (d
          ? t.listenProvider_.stopListening(zs(e), null)
          : c.forEach((f) => {
              const p = t.queryToTagMap.get(Pl(f));
              t.listenProvider_.stopListening(zs(f), p);
            }));
    }
    hx(t, c);
  }
  return l;
}
function vy(t, e, n, r) {
  const s = nd(t, r);
  if (s != null) {
    const i = rd(s),
      o = i.path,
      l = i.queryId,
      a = Qe(o, e),
      c = new sr(qu(l), a, n);
    return sd(t, o, c);
  } else return [];
}
function cx(t, e, n, r) {
  const s = nd(t, r);
  if (s) {
    const i = rd(s),
      o = i.path,
      l = i.queryId,
      a = Qe(o, e),
      c = le.fromObject(n),
      d = new Xr(qu(l), a, c);
    return sd(t, o, d);
  } else return [];
}
function Mc(t, e, n, r = !1) {
  const s = e._path;
  let i = null,
    o = !1;
  t.syncPointTree_.foreachOnPath(s, (f, p) => {
    const g = Qe(f, s);
    (i = i || Pn(p, g)), (o = o || jn(p));
  });
  let l = t.syncPointTree_.get(s);
  l
    ? ((o = o || jn(l)), (i = i || Pn(l, te())))
    : ((l = new hy()), (t.syncPointTree_ = t.syncPointTree_.set(s, l)));
  let a;
  i != null
    ? (a = !0)
    : ((a = !1),
      (i = H.EMPTY_NODE),
      t.syncPointTree_.subtree(s).foreachChild((p, g) => {
        const w = Pn(g, te());
        w && (i = i.updateImmediateChild(p, w));
      }));
  const c = gy(l, e);
  if (!c && !e._queryParams.loadsAllData()) {
    const f = Pl(e);
    b(!t.queryToTagMap.has(f), "View does not exist, but we have a tag");
    const p = fx();
    t.queryToTagMap.set(f, p), t.tagToQueryMap.set(p, f);
  }
  const d = kl(t.pendingWriteTree_, s);
  let h = ex(l, e, n, d, i, a);
  if (!c && !o && !r) {
    const f = my(l, e);
    h = h.concat(px(t, e, f));
  }
  return h;
}
function td(t, e, n) {
  const s = t.pendingWriteTree_,
    i = t.syncPointTree_.findOnPath(e, (o, l) => {
      const a = Qe(o, e),
        c = Pn(l, a);
      if (c) return c;
    });
  return oy(s, e, i, n, !0);
}
function ux(t, e) {
  const n = e._path;
  let r = null;
  t.syncPointTree_.foreachOnPath(n, (c, d) => {
    const h = Qe(c, n);
    r = r || Pn(d, h);
  });
  let s = t.syncPointTree_.get(n);
  s
    ? (r = r || Pn(s, te()))
    : ((s = new hy()), (t.syncPointTree_ = t.syncPointTree_.set(n, s)));
  const i = r != null,
    o = i ? new An(r, !0, !1) : null,
    l = kl(t.pendingWriteTree_, e._path),
    a = fy(s, e, l, i ? o.getNode() : H.EMPTY_NODE, i);
  return YS(a);
}
function cs(t, e) {
  return _y(e, t.syncPointTree_, null, kl(t.pendingWriteTree_, te()));
}
function _y(t, e, n, r) {
  if (J(t.path)) return wy(t, e, n, r);
  {
    const s = e.get(te());
    n == null && s != null && (n = Pn(s, te()));
    let i = [];
    const o = K(t.path),
      l = t.operationForChild(o),
      a = e.children.get(o);
    if (a && l) {
      const c = n ? n.getImmediateChild(o) : null,
        d = ly(r, o);
      i = i.concat(_y(l, a, c, d));
    }
    return s && (i = i.concat(ed(s, t, r, n))), i;
  }
}
function wy(t, e, n, r) {
  const s = e.get(te());
  n == null && s != null && (n = Pn(s, te()));
  let i = [];
  return (
    e.children.inorderTraversal((o, l) => {
      const a = n ? n.getImmediateChild(o) : null,
        c = ly(r, o),
        d = t.operationForChild(o);
      d && (i = i.concat(wy(d, l, a, c)));
    }),
    s && (i = i.concat(ed(s, t, r, n))),
    i
  );
}
function Cy(t, e) {
  const n = e.query,
    r = yi(t, n);
  return {
    hashFn: () => (VS(e) || H.EMPTY_NODE).hash(),
    onComplete: (s) => {
      if (s === "ok") return r ? ax(t, n._path, r) : lx(t, n._path);
      {
        const i = lE(s, n);
        return tl(t, n, null, i);
      }
    },
  };
}
function yi(t, e) {
  const n = Pl(e);
  return t.queryToTagMap.get(n);
}
function Pl(t) {
  return t._path.toString() + "$" + t._queryIdentifier;
}
function nd(t, e) {
  return t.tagToQueryMap.get(e);
}
function rd(t) {
  const e = t.indexOf("$");
  return (
    b(e !== -1 && e < t.length - 1, "Bad queryKey."),
    { queryId: t.substr(e + 1), path: new ie(t.substr(0, e)) }
  );
}
function sd(t, e, n) {
  const r = t.syncPointTree_.get(e);
  b(r, "Missing sync point for query tag that we're tracking");
  const s = kl(t.pendingWriteTree_, e);
  return ed(r, n, s, null);
}
function dx(t) {
  return t.fold((e, n, r) => {
    if (n && jn(n)) return [Rl(n)];
    {
      let s = [];
      return (
        n && (s = py(n)),
        He(r, (i, o) => {
          s = s.concat(o);
        }),
        s
      );
    }
  });
}
function zs(t) {
  return t._queryParams.loadsAllData() && !t._queryParams.isDefault()
    ? new (rx())(t._repo, t._path)
    : t;
}
function hx(t, e) {
  for (let n = 0; n < e.length; ++n) {
    const r = e[n];
    if (!r._queryParams.loadsAllData()) {
      const s = Pl(r),
        i = t.queryToTagMap.get(s);
      t.queryToTagMap.delete(s), t.tagToQueryMap.delete(i);
    }
  }
}
function fx() {
  return sx++;
}
function px(t, e, n) {
  const r = e._path,
    s = yi(t, e),
    i = Cy(t, n),
    o = t.listenProvider_.startListening(zs(e), s, i.hashFn, i.onComplete),
    l = t.syncPointTree_.subtree(r);
  if (s) b(!jn(l.value), "If we're adding a query, it shouldn't be shadowed");
  else {
    const a = l.fold((c, d, h) => {
      if (!J(c) && d && jn(d)) return [Rl(d).query];
      {
        let f = [];
        return (
          d && (f = f.concat(py(d).map((p) => p.query))),
          He(h, (p, g) => {
            f = f.concat(g);
          }),
          f
        );
      }
    });
    for (let c = 0; c < a.length; ++c) {
      const d = a[c];
      t.listenProvider_.stopListening(zs(d), yi(t, d));
    }
  }
  return o;
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class id {
  constructor(e) {
    this.node_ = e;
  }
  getImmediateChild(e) {
    const n = this.node_.getImmediateChild(e);
    return new id(n);
  }
  node() {
    return this.node_;
  }
}
class od {
  constructor(e, n) {
    (this.syncTree_ = e), (this.path_ = n);
  }
  getImmediateChild(e) {
    const n = Se(this.path_, e);
    return new od(this.syncTree_, n);
  }
  node() {
    return td(this.syncTree_, this.path_);
  }
}
const mx = function (t) {
    return (
      (t = t || {}), (t.timestamp = t.timestamp || new Date().getTime()), t
    );
  },
  Rf = function (t, e, n) {
    if (!t || typeof t != "object") return t;
    if (
      (b(".sv" in t, "Unexpected leaf node or priority contents"),
      typeof t[".sv"] == "string")
    )
      return gx(t[".sv"], e, n);
    if (typeof t[".sv"] == "object") return yx(t[".sv"], e);
    b(!1, "Unexpected server value: " + JSON.stringify(t, null, 2));
  },
  gx = function (t, e, n) {
    switch (t) {
      case "timestamp":
        return n.timestamp;
      default:
        b(!1, "Unexpected server value: " + t);
    }
  },
  yx = function (t, e, n) {
    t.hasOwnProperty("increment") ||
      b(!1, "Unexpected server value: " + JSON.stringify(t, null, 2));
    const r = t.increment;
    typeof r != "number" && b(!1, "Unexpected increment value: " + r);
    const s = e.node();
    if (
      (b(
        s !== null && typeof s < "u",
        "Expected ChildrenNode.EMPTY_NODE for nulls"
      ),
      !s.isLeafNode())
    )
      return r;
    const o = s.getValue();
    return typeof o != "number" ? r : o + r;
  },
  Ey = function (t, e, n, r) {
    return ld(e, new od(n, t), r);
  },
  Sy = function (t, e, n) {
    return ld(t, new id(e), n);
  };
function ld(t, e, n) {
  const r = t.getPriority().val(),
    s = Rf(r, e.getImmediateChild(".priority"), n);
  let i;
  if (t.isLeafNode()) {
    const o = t,
      l = Rf(o.getValue(), e, n);
    return l !== o.getValue() || s !== o.getPriority().val()
      ? new je(l, Pe(s))
      : t;
  } else {
    const o = t;
    return (
      (i = o),
      s !== o.getPriority().val() && (i = i.updatePriority(new je(s))),
      o.forEachChild(xe, (l, a) => {
        const c = ld(a, e.getImmediateChild(l), n);
        c !== a && (i = i.updateImmediateChild(l, c));
      }),
      i
    );
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class ad {
  constructor(e = "", n = null, r = { children: {}, childCount: 0 }) {
    (this.name = e), (this.parent = n), (this.node = r);
  }
}
function cd(t, e) {
  let n = e instanceof ie ? e : new ie(e),
    r = t,
    s = K(n);
  for (; s !== null; ) {
    const i = Kr(r.node.children, s) || { children: {}, childCount: 0 };
    (r = new ad(s, r, i)), (n = ce(n)), (s = K(n));
  }
  return r;
}
function us(t) {
  return t.node.value;
}
function xy(t, e) {
  (t.node.value = e), Dc(t);
}
function Ny(t) {
  return t.node.childCount > 0;
}
function vx(t) {
  return us(t) === void 0 && !Ny(t);
}
function Il(t, e) {
  He(t.node.children, (n, r) => {
    e(new ad(n, t, r));
  });
}
function Ty(t, e, n, r) {
  n && !r && e(t),
    Il(t, (s) => {
      Ty(s, e, !0, r);
    }),
    n && r && e(t);
}
function _x(t, e, n) {
  let r = n ? t : t.parent;
  for (; r !== null; ) {
    if (e(r)) return !0;
    r = r.parent;
  }
  return !1;
}
function Ii(t) {
  return new ie(t.parent === null ? t.name : Ii(t.parent) + "/" + t.name);
}
function Dc(t) {
  t.parent !== null && wx(t.parent, t.name, t);
}
function wx(t, e, n) {
  const r = vx(n),
    s = zt(t.node.children, e);
  r && s
    ? (delete t.node.children[e], t.node.childCount--, Dc(t))
    : !r && !s && ((t.node.children[e] = n.node), t.node.childCount++, Dc(t));
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Cx = /[\[\].#$\/\u0000-\u001F\u007F]/,
  Ex = /[\[\].#$\u0000-\u001F\u007F]/,
  Ca = 10 * 1024 * 1024,
  ud = function (t) {
    return typeof t == "string" && t.length !== 0 && !Cx.test(t);
  },
  ky = function (t) {
    return typeof t == "string" && t.length !== 0 && !Ex.test(t);
  },
  Sx = function (t) {
    return t && (t = t.replace(/^\/*\.info(\/|$)/, "/")), ky(t);
  },
  xx = function (t) {
    return (
      t === null ||
      typeof t == "string" ||
      (typeof t == "number" && !Lu(t)) ||
      (t && typeof t == "object" && zt(t, ".sv"))
    );
  },
  Ry = function (t, e, n, r) {
    (r && e === void 0) || Ol(Sl(t, "value"), e, n);
  },
  Ol = function (t, e, n) {
    const r = n instanceof ie ? new BE(n, t) : n;
    if (e === void 0) throw new Error(t + "contains undefined " + zn(r));
    if (typeof e == "function")
      throw new Error(
        t + "contains a function " + zn(r) + " with contents = " + e.toString()
      );
    if (Lu(e)) throw new Error(t + "contains " + e.toString() + " " + zn(r));
    if (typeof e == "string" && e.length > Ca / 3 && xl(e) > Ca)
      throw new Error(
        t +
          "contains a string greater than " +
          Ca +
          " utf8 bytes " +
          zn(r) +
          " ('" +
          e.substring(0, 50) +
          "...')"
      );
    if (e && typeof e == "object") {
      let s = !1,
        i = !1;
      if (
        (He(e, (o, l) => {
          if (o === ".value") s = !0;
          else if (o !== ".priority" && o !== ".sv" && ((i = !0), !ud(o)))
            throw new Error(
              t +
                " contains an invalid key (" +
                o +
                ") " +
                zn(r) +
                `.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`
            );
          zE(r, o), Ol(t, l, r), HE(r);
        }),
        s && i)
      )
        throw new Error(
          t +
            ' contains ".value" child ' +
            zn(r) +
            " in addition to actual children."
        );
    }
  },
  Nx = function (t, e) {
    let n, r;
    for (n = 0; n < e.length; n++) {
      r = e[n];
      const i = hi(r);
      for (let o = 0; o < i.length; o++)
        if (!(i[o] === ".priority" && o === i.length - 1)) {
          if (!ud(i[o]))
            throw new Error(
              t +
                "contains an invalid key (" +
                i[o] +
                ") in path " +
                r.toString() +
                `. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`
            );
        }
    }
    e.sort(UE);
    let s = null;
    for (n = 0; n < e.length; n++) {
      if (((r = e[n]), s !== null && _t(s, r)))
        throw new Error(
          t +
            "contains a path " +
            s.toString() +
            " that is ancestor of another path " +
            r.toString()
        );
      s = r;
    }
  },
  Tx = function (t, e, n, r) {
    if (r && e === void 0) return;
    const s = Sl(t, "values");
    if (!(e && typeof e == "object") || Array.isArray(e))
      throw new Error(
        s + " must be an object containing the children to replace."
      );
    const i = [];
    He(e, (o, l) => {
      const a = new ie(o);
      if ((Ol(s, l, Se(n, a)), zu(a) === ".priority" && !xx(l)))
        throw new Error(
          s +
            "contains an invalid value for '" +
            a.toString() +
            "', which must be a valid Firebase priority (a string, finite number, server value, or null)."
        );
      i.push(a);
    }),
      Nx(s, i);
  },
  Py = function (t, e, n, r) {
    if (!(r && n === void 0) && !ky(n))
      throw new Error(
        Sl(t, e) +
          'was an invalid path = "' +
          n +
          `". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`
      );
  },
  kx = function (t, e, n, r) {
    n && (n = n.replace(/^\/*\.info(\/|$)/, "/")), Py(t, e, n, r);
  },
  dd = function (t, e) {
    if (K(e) === ".info")
      throw new Error(t + " failed = Can't modify data under /.info/");
  },
  Rx = function (t, e) {
    const n = e.path.toString();
    if (
      typeof e.repoInfo.host != "string" ||
      e.repoInfo.host.length === 0 ||
      (!ud(e.repoInfo.namespace) &&
        e.repoInfo.host.split(":")[0] !== "localhost") ||
      (n.length !== 0 && !Sx(n))
    )
      throw new Error(
        Sl(t, "url") +
          `must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`
      );
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Px {
  constructor() {
    (this.eventLists_ = []), (this.recursionDepth_ = 0);
  }
}
function bl(t, e) {
  let n = null;
  for (let r = 0; r < e.length; r++) {
    const s = e[r],
      i = s.getPath();
    n !== null && !Hu(i, n.path) && (t.eventLists_.push(n), (n = null)),
      n === null && (n = { events: [], path: i }),
      n.events.push(s);
  }
  n && t.eventLists_.push(n);
}
function Iy(t, e, n) {
  bl(t, n), Oy(t, (r) => Hu(r, e));
}
function St(t, e, n) {
  bl(t, n), Oy(t, (r) => _t(r, e) || _t(e, r));
}
function Oy(t, e) {
  t.recursionDepth_++;
  let n = !0;
  for (let r = 0; r < t.eventLists_.length; r++) {
    const s = t.eventLists_[r];
    if (s) {
      const i = s.path;
      e(i) ? (Ix(t.eventLists_[r]), (t.eventLists_[r] = null)) : (n = !1);
    }
  }
  n && (t.eventLists_ = []), t.recursionDepth_--;
}
function Ix(t) {
  for (let e = 0; e < t.events.length; e++) {
    const n = t.events[e];
    if (n !== null) {
      t.events[e] = null;
      const r = n.getEventRunner();
      qn && Ue("event: " + n.toString()), as(r);
    }
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Ox = "repo_interrupt",
  bx = 25;
class Ax {
  constructor(e, n, r, s) {
    (this.repoInfo_ = e),
      (this.forceRestClient_ = n),
      (this.authTokenProvider_ = r),
      (this.appCheckProvider_ = s),
      (this.dataUpdateCount = 0),
      (this.statsListener_ = null),
      (this.eventQueue_ = new Px()),
      (this.nextWriteId_ = 1),
      (this.interceptServerDataCallback_ = null),
      (this.onDisconnect_ = Yo()),
      (this.transactionQueueTree_ = new ad()),
      (this.persistentConnection_ = null),
      (this.key = this.repoInfo_.toURLString());
  }
  toString() {
    return (
      (this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host
    );
  }
}
function jx(t, e, n) {
  if (((t.stats_ = Uu(t.repoInfo_)), t.forceRestClient_ || dE()))
    (t.server_ = new Vo(
      t.repoInfo_,
      (r, s, i, o) => {
        Pf(t, r, s, i, o);
      },
      t.authTokenProvider_,
      t.appCheckProvider_
    )),
      setTimeout(() => If(t, !0), 0);
  else {
    if (typeof n < "u" && n !== null) {
      if (typeof n != "object")
        throw new Error(
          "Only objects are supported for option databaseAuthVariableOverride"
        );
      try {
        Ie(n);
      } catch (r) {
        throw new Error("Invalid authOverride provided: " + r);
      }
    }
    (t.persistentConnection_ = new Zt(
      t.repoInfo_,
      e,
      (r, s, i, o) => {
        Pf(t, r, s, i, o);
      },
      (r) => {
        If(t, r);
      },
      (r) => {
        Mx(t, r);
      },
      t.authTokenProvider_,
      t.appCheckProvider_,
      n
    )),
      (t.server_ = t.persistentConnection_);
  }
  t.authTokenProvider_.addTokenChangeListener((r) => {
    t.server_.refreshAuthToken(r);
  }),
    t.appCheckProvider_.addTokenChangeListener((r) => {
      t.server_.refreshAppCheckToken(r.token);
    }),
    (t.statsReporter_ = gE(t.repoInfo_, () => new mS(t.stats_, t.server_))),
    (t.infoData_ = new uS()),
    (t.infoSyncTree_ = new kf({
      startListening: (r, s, i, o) => {
        let l = [];
        const a = t.infoData_.getNode(r._path);
        return (
          a.isEmpty() ||
            ((l = Pi(t.infoSyncTree_, r._path, a)),
            setTimeout(() => {
              o("ok");
            }, 0)),
          l
        );
      },
      stopListening: () => {},
    })),
    hd(t, "connected", !1),
    (t.serverSyncTree_ = new kf({
      startListening: (r, s, i, o) => (
        t.server_.listen(r, i, s, (l, a) => {
          const c = o(l, a);
          St(t.eventQueue_, r._path, c);
        }),
        []
      ),
      stopListening: (r, s) => {
        t.server_.unlisten(r, s);
      },
    }));
}
function by(t) {
  const n = t.infoData_.getNode(new ie(".info/serverTimeOffset")).val() || 0;
  return new Date().getTime() + n;
}
function Al(t) {
  return mx({ timestamp: by(t) });
}
function Pf(t, e, n, r, s) {
  t.dataUpdateCount++;
  const i = new ie(e);
  n = t.interceptServerDataCallback_ ? t.interceptServerDataCallback_(e, n) : n;
  let o = [];
  if (s)
    if (r) {
      const a = Uo(n, (c) => Pe(c));
      o = cx(t.serverSyncTree_, i, a, s);
    } else {
      const a = Pe(n);
      o = vy(t.serverSyncTree_, i, a, s);
    }
  else if (r) {
    const a = Uo(n, (c) => Pe(c));
    o = ox(t.serverSyncTree_, i, a);
  } else {
    const a = Pe(n);
    o = Pi(t.serverSyncTree_, i, a);
  }
  let l = i;
  o.length > 0 && (l = Zr(t, i)), St(t.eventQueue_, l, o);
}
function If(t, e) {
  hd(t, "connected", e), e === !1 && Fx(t);
}
function Mx(t, e) {
  He(e, (n, r) => {
    hd(t, n, r);
  });
}
function hd(t, e, n) {
  const r = new ie("/.info/" + e),
    s = Pe(n);
  t.infoData_.updateSnapshot(r, s);
  const i = Pi(t.infoSyncTree_, r, s);
  St(t.eventQueue_, r, i);
}
function fd(t) {
  return t.nextWriteId_++;
}
function Dx(t, e, n) {
  const r = ux(t.serverSyncTree_, e);
  return r != null
    ? Promise.resolve(r)
    : t.server_.get(e).then(
        (s) => {
          const i = Pe(s).withIndex(e._queryParams.getIndex());
          Mc(t.serverSyncTree_, e, n, !0);
          let o;
          if (e._queryParams.loadsAllData())
            o = Pi(t.serverSyncTree_, e._path, i);
          else {
            const l = yi(t.serverSyncTree_, e);
            o = vy(t.serverSyncTree_, e._path, i, l);
          }
          return (
            St(t.eventQueue_, e._path, o),
            tl(t.serverSyncTree_, e, n, null, !0),
            i
          );
        },
        (s) => (
          Oi(t, "get for query " + Ie(e) + " failed: " + s),
          Promise.reject(new Error(s))
        )
      );
}
function Lx(t, e, n, r, s) {
  Oi(t, "set", { path: e.toString(), value: n, priority: r });
  const i = Al(t),
    o = Pe(n, r),
    l = td(t.serverSyncTree_, e),
    a = Sy(o, l, i),
    c = fd(t),
    d = yy(t.serverSyncTree_, e, a, c, !0);
  bl(t.eventQueue_, d),
    t.server_.put(e.toString(), o.val(!0), (f, p) => {
      const g = f === "ok";
      g || Xe("set at " + e + " failed: " + f);
      const w = yn(t.serverSyncTree_, c, !g);
      St(t.eventQueue_, e, w), Lc(t, s, f, p);
    });
  const h = md(t, e);
  Zr(t, h), St(t.eventQueue_, h, []);
}
function $x(t, e, n, r) {
  Oi(t, "update", { path: e.toString(), value: n });
  let s = !0;
  const i = Al(t),
    o = {};
  if (
    (He(n, (l, a) => {
      (s = !1), (o[l] = Ey(Se(e, l), Pe(a), t.serverSyncTree_, i));
    }),
    s)
  )
    Ue("update() called with empty data.  Don't do anything."),
      Lc(t, r, "ok", void 0);
  else {
    const l = fd(t),
      a = ix(t.serverSyncTree_, e, o, l);
    bl(t.eventQueue_, a),
      t.server_.merge(e.toString(), n, (c, d) => {
        const h = c === "ok";
        h || Xe("update at " + e + " failed: " + c);
        const f = yn(t.serverSyncTree_, l, !h),
          p = f.length > 0 ? Zr(t, e) : e;
        St(t.eventQueue_, p, f), Lc(t, r, c, d);
      }),
      He(n, (c) => {
        const d = md(t, Se(e, c));
        Zr(t, d);
      }),
      St(t.eventQueue_, e, []);
  }
}
function Fx(t) {
  Oi(t, "onDisconnectEvents");
  const e = Al(t),
    n = Yo();
  Pc(t.onDisconnect_, te(), (s, i) => {
    const o = Ey(s, i, t.serverSyncTree_, e);
    ny(n, s, o);
  });
  let r = [];
  Pc(n, te(), (s, i) => {
    r = r.concat(Pi(t.serverSyncTree_, s, i));
    const o = md(t, s);
    Zr(t, o);
  }),
    (t.onDisconnect_ = Yo()),
    St(t.eventQueue_, te(), r);
}
function Ux(t, e, n) {
  let r;
  K(e._path) === ".info"
    ? (r = Mc(t.infoSyncTree_, e, n))
    : (r = Mc(t.serverSyncTree_, e, n)),
    Iy(t.eventQueue_, e._path, r);
}
function Of(t, e, n) {
  let r;
  K(e._path) === ".info"
    ? (r = tl(t.infoSyncTree_, e, n))
    : (r = tl(t.serverSyncTree_, e, n)),
    Iy(t.eventQueue_, e._path, r);
}
function Bx(t) {
  t.persistentConnection_ && t.persistentConnection_.interrupt(Ox);
}
function Oi(t, ...e) {
  let n = "";
  t.persistentConnection_ && (n = t.persistentConnection_.id + ":"),
    Ue(n, ...e);
}
function Lc(t, e, n, r) {
  e &&
    as(() => {
      if (n === "ok") e(null);
      else {
        const s = (n || "error").toUpperCase();
        let i = s;
        r && (i += ": " + r);
        const o = new Error(i);
        (o.code = s), e(o);
      }
    });
}
function Ay(t, e, n) {
  return td(t.serverSyncTree_, e, n) || H.EMPTY_NODE;
}
function pd(t, e = t.transactionQueueTree_) {
  if ((e || jl(t, e), us(e))) {
    const n = My(t, e);
    b(n.length > 0, "Sending zero length transaction queue"),
      n.every((s) => s.status === 0) && zx(t, Ii(e), n);
  } else
    Ny(e) &&
      Il(e, (n) => {
        pd(t, n);
      });
}
function zx(t, e, n) {
  const r = n.map((c) => c.currentWriteId),
    s = Ay(t, e, r);
  let i = s;
  const o = s.hash();
  for (let c = 0; c < n.length; c++) {
    const d = n[c];
    b(
      d.status === 0,
      "tryToSendTransactionQueue_: items in queue should all be run."
    ),
      (d.status = 1),
      d.retryCount++;
    const h = Qe(e, d.path);
    i = i.updateChild(h, d.currentOutputSnapshotRaw);
  }
  const l = i.val(!0),
    a = e;
  t.server_.put(
    a.toString(),
    l,
    (c) => {
      Oi(t, "transaction put response", { path: a.toString(), status: c });
      let d = [];
      if (c === "ok") {
        const h = [];
        for (let f = 0; f < n.length; f++)
          (n[f].status = 2),
            (d = d.concat(yn(t.serverSyncTree_, n[f].currentWriteId))),
            n[f].onComplete &&
              h.push(() =>
                n[f].onComplete(null, !0, n[f].currentOutputSnapshotResolved)
              ),
            n[f].unwatcher();
        jl(t, cd(t.transactionQueueTree_, e)),
          pd(t, t.transactionQueueTree_),
          St(t.eventQueue_, e, d);
        for (let f = 0; f < h.length; f++) as(h[f]);
      } else {
        if (c === "datastale")
          for (let h = 0; h < n.length; h++)
            n[h].status === 3 ? (n[h].status = 4) : (n[h].status = 0);
        else {
          Xe("transaction at " + a.toString() + " failed: " + c);
          for (let h = 0; h < n.length; h++)
            (n[h].status = 4), (n[h].abortReason = c);
        }
        Zr(t, e);
      }
    },
    o
  );
}
function Zr(t, e) {
  const n = jy(t, e),
    r = Ii(n),
    s = My(t, n);
  return Hx(t, s, r), r;
}
function Hx(t, e, n) {
  if (e.length === 0) return;
  const r = [];
  let s = [];
  const o = e.filter((l) => l.status === 0).map((l) => l.currentWriteId);
  for (let l = 0; l < e.length; l++) {
    const a = e[l],
      c = Qe(n, a.path);
    let d = !1,
      h;
    if (
      (b(
        c !== null,
        "rerunTransactionsUnderNode_: relativePath should not be null."
      ),
      a.status === 4)
    )
      (d = !0),
        (h = a.abortReason),
        (s = s.concat(yn(t.serverSyncTree_, a.currentWriteId, !0)));
    else if (a.status === 0)
      if (a.retryCount >= bx)
        (d = !0),
          (h = "maxretry"),
          (s = s.concat(yn(t.serverSyncTree_, a.currentWriteId, !0)));
      else {
        const f = Ay(t, a.path, o);
        a.currentInputSnapshot = f;
        const p = e[l].update(f.val());
        if (p !== void 0) {
          Ol("transaction failed: Data returned ", p, a.path);
          let g = Pe(p);
          (typeof p == "object" && p != null && zt(p, ".priority")) ||
            (g = g.updatePriority(f.getPriority()));
          const E = a.currentWriteId,
            y = Al(t),
            m = Sy(g, f, y);
          (a.currentOutputSnapshotRaw = g),
            (a.currentOutputSnapshotResolved = m),
            (a.currentWriteId = fd(t)),
            o.splice(o.indexOf(E), 1),
            (s = s.concat(
              yy(t.serverSyncTree_, a.path, m, a.currentWriteId, a.applyLocally)
            )),
            (s = s.concat(yn(t.serverSyncTree_, E, !0)));
        } else
          (d = !0),
            (h = "nodata"),
            (s = s.concat(yn(t.serverSyncTree_, a.currentWriteId, !0)));
      }
    St(t.eventQueue_, n, s),
      (s = []),
      d &&
        ((e[l].status = 2),
        (function (f) {
          setTimeout(f, Math.floor(0));
        })(e[l].unwatcher),
        e[l].onComplete &&
          (h === "nodata"
            ? r.push(() => e[l].onComplete(null, !1, e[l].currentInputSnapshot))
            : r.push(() => e[l].onComplete(new Error(h), !1, null))));
  }
  jl(t, t.transactionQueueTree_);
  for (let l = 0; l < r.length; l++) as(r[l]);
  pd(t, t.transactionQueueTree_);
}
function jy(t, e) {
  let n,
    r = t.transactionQueueTree_;
  for (n = K(e); n !== null && us(r) === void 0; )
    (r = cd(r, n)), (e = ce(e)), (n = K(e));
  return r;
}
function My(t, e) {
  const n = [];
  return Dy(t, e, n), n.sort((r, s) => r.order - s.order), n;
}
function Dy(t, e, n) {
  const r = us(e);
  if (r) for (let s = 0; s < r.length; s++) n.push(r[s]);
  Il(e, (s) => {
    Dy(t, s, n);
  });
}
function jl(t, e) {
  const n = us(e);
  if (n) {
    let r = 0;
    for (let s = 0; s < n.length; s++)
      n[s].status !== 2 && ((n[r] = n[s]), r++);
    (n.length = r), xy(e, n.length > 0 ? n : void 0);
  }
  Il(e, (r) => {
    jl(t, r);
  });
}
function md(t, e) {
  const n = Ii(jy(t, e)),
    r = cd(t.transactionQueueTree_, e);
  return (
    _x(r, (s) => {
      Ea(t, s);
    }),
    Ea(t, r),
    Ty(r, (s) => {
      Ea(t, s);
    }),
    n
  );
}
function Ea(t, e) {
  const n = us(e);
  if (n) {
    const r = [];
    let s = [],
      i = -1;
    for (let o = 0; o < n.length; o++)
      n[o].status === 3 ||
        (n[o].status === 1
          ? (b(i === o - 1, "All SENT items should be at beginning of queue."),
            (i = o),
            (n[o].status = 3),
            (n[o].abortReason = "set"))
          : (b(n[o].status === 0, "Unexpected transaction status in abort"),
            n[o].unwatcher(),
            (s = s.concat(yn(t.serverSyncTree_, n[o].currentWriteId, !0))),
            n[o].onComplete &&
              r.push(n[o].onComplete.bind(null, new Error("set"), !1, null))));
    i === -1 ? xy(e, void 0) : (n.length = i + 1), St(t.eventQueue_, Ii(e), s);
    for (let o = 0; o < r.length; o++) as(r[o]);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function Wx(t) {
  let e = "";
  const n = t.split("/");
  for (let r = 0; r < n.length; r++)
    if (n[r].length > 0) {
      let s = n[r];
      try {
        s = decodeURIComponent(s.replace(/\+/g, " "));
      } catch {}
      e += "/" + s;
    }
  return e;
}
function Gx(t) {
  const e = {};
  t.charAt(0) === "?" && (t = t.substring(1));
  for (const n of t.split("&")) {
    if (n.length === 0) continue;
    const r = n.split("=");
    r.length === 2
      ? (e[decodeURIComponent(r[0])] = decodeURIComponent(r[1]))
      : Xe(`Invalid query segment '${n}' in query '${t}'`);
  }
  return e;
}
const bf = function (t, e) {
    const n = Vx(t),
      r = n.namespace;
    n.domain === "firebase.com" &&
      sn(
        n.host +
          " is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"
      ),
      (!r || r === "undefined") &&
        n.domain !== "localhost" &&
        sn(
          "Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"
        ),
      n.secure || nE();
    const s = n.scheme === "ws" || n.scheme === "wss";
    return {
      repoInfo: new Fg(n.host, n.secure, r, s, e, "", r !== n.subdomain),
      path: new ie(n.pathString),
    };
  },
  Vx = function (t) {
    let e = "",
      n = "",
      r = "",
      s = "",
      i = "",
      o = !0,
      l = "https",
      a = 443;
    if (typeof t == "string") {
      let c = t.indexOf("//");
      c >= 0 && ((l = t.substring(0, c - 1)), (t = t.substring(c + 2)));
      let d = t.indexOf("/");
      d === -1 && (d = t.length);
      let h = t.indexOf("?");
      h === -1 && (h = t.length),
        (e = t.substring(0, Math.min(d, h))),
        d < h && (s = Wx(t.substring(d, h)));
      const f = Gx(t.substring(Math.min(t.length, h)));
      (c = e.indexOf(":")),
        c >= 0
          ? ((o = l === "https" || l === "wss"),
            (a = parseInt(e.substring(c + 1), 10)))
          : (c = e.length);
      const p = e.slice(0, c);
      if (p.toLowerCase() === "localhost") n = "localhost";
      else if (p.split(".").length <= 2) n = p;
      else {
        const g = e.indexOf(".");
        (r = e.substring(0, g).toLowerCase()),
          (n = e.substring(g + 1)),
          (i = r);
      }
      "ns" in f && (i = f.ns);
    }
    return {
      host: e,
      port: a,
      domain: n,
      subdomain: r,
      secure: o,
      scheme: l,
      pathString: s,
      namespace: i,
    };
  };
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Af =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",
  Yx = (function () {
    let t = 0;
    const e = [];
    return function (n) {
      const r = n === t;
      t = n;
      let s;
      const i = new Array(8);
      for (s = 7; s >= 0; s--)
        (i[s] = Af.charAt(n % 64)), (n = Math.floor(n / 64));
      b(n === 0, "Cannot push at time == 0");
      let o = i.join("");
      if (r) {
        for (s = 11; s >= 0 && e[s] === 63; s--) e[s] = 0;
        e[s]++;
      } else for (s = 0; s < 12; s++) e[s] = Math.floor(Math.random() * 64);
      for (s = 0; s < 12; s++) o += Af.charAt(e[s]);
      return b(o.length === 20, "nextPushId: Length should be 20."), o;
    };
  })();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Ly {
  constructor(e, n, r, s) {
    (this.eventType = e),
      (this.eventRegistration = n),
      (this.snapshot = r),
      (this.prevName = s);
  }
  getPath() {
    const e = this.snapshot.ref;
    return this.eventType === "value" ? e._path : e.parent._path;
  }
  getEventType() {
    return this.eventType;
  }
  getEventRunner() {
    return this.eventRegistration.getEventRunner(this);
  }
  toString() {
    return (
      this.getPath().toString() +
      ":" +
      this.eventType +
      ":" +
      Ie(this.snapshot.exportVal())
    );
  }
}
class $y {
  constructor(e, n, r) {
    (this.eventRegistration = e), (this.error = n), (this.path = r);
  }
  getPath() {
    return this.path;
  }
  getEventType() {
    return "cancel";
  }
  getEventRunner() {
    return this.eventRegistration.getEventRunner(this);
  }
  toString() {
    return this.path.toString() + ":cancel";
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class Fy {
  constructor(e, n) {
    (this.snapshotCallback = e), (this.cancelCallback = n);
  }
  onValue(e, n) {
    this.snapshotCallback.call(null, e, n);
  }
  onCancel(e) {
    return (
      b(
        this.hasCancelCallback,
        "Raising a cancel event on a listener with no cancel callback"
      ),
      this.cancelCallback.call(null, e)
    );
  }
  get hasCancelCallback() {
    return !!this.cancelCallback;
  }
  matches(e) {
    return (
      this.snapshotCallback === e.snapshotCallback ||
      (this.snapshotCallback.userCallback !== void 0 &&
        this.snapshotCallback.userCallback ===
          e.snapshotCallback.userCallback &&
        this.snapshotCallback.context === e.snapshotCallback.context)
    );
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ class gd {
  constructor(e, n, r, s) {
    (this._repo = e),
      (this._path = n),
      (this._queryParams = r),
      (this._orderByCalled = s);
  }
  get key() {
    return J(this._path) ? null : zu(this._path);
  }
  get ref() {
    return new Ht(this._repo, this._path);
  }
  get _queryIdentifier() {
    const e = yf(this._queryParams),
      n = $u(e);
    return n === "{}" ? "default" : n;
  }
  get _queryObject() {
    return yf(this._queryParams);
  }
  isEqual(e) {
    if (((e = ur(e)), !(e instanceof gd))) return !1;
    const n = this._repo === e._repo,
      r = Hu(this._path, e._path),
      s = this._queryIdentifier === e._queryIdentifier;
    return n && r && s;
  }
  toJSON() {
    return this.toString();
  }
  toString() {
    return this._repo.toString() + FE(this._path);
  }
}
class Ht extends gd {
  constructor(e, n) {
    super(e, n, new Yu(), !1);
  }
  get parent() {
    const e = Kg(this._path);
    return e === null ? null : new Ht(this._repo, e);
  }
  get root() {
    let e = this;
    for (; e.parent !== null; ) e = e.parent;
    return e;
  }
}
class es {
  constructor(e, n, r) {
    (this._node = e), (this.ref = n), (this._index = r);
  }
  get priority() {
    return this._node.getPriority().val();
  }
  get key() {
    return this.ref.key;
  }
  get size() {
    return this._node.numChildren();
  }
  child(e) {
    const n = new ie(e),
      r = ts(this.ref, e);
    return new es(this._node.getChild(n), r, xe);
  }
  exists() {
    return !this._node.isEmpty();
  }
  exportVal() {
    return this._node.val(!0);
  }
  forEach(e) {
    return this._node.isLeafNode()
      ? !1
      : !!this._node.forEachChild(this._index, (r, s) =>
          e(new es(s, ts(this.ref, r), xe))
        );
  }
  hasChild(e) {
    const n = new ie(e);
    return !this._node.getChild(n).isEmpty();
  }
  hasChildren() {
    return this._node.isLeafNode() ? !1 : !this._node.isEmpty();
  }
  toJSON() {
    return this.exportVal();
  }
  val() {
    return this._node.val();
  }
}
function L(t, e) {
  return (
    (t = ur(t)),
    t._checkNotDeleted("ref"),
    e !== void 0 ? ts(t._root, e) : t._root
  );
}
function ts(t, e) {
  return (
    (t = ur(t)),
    K(t._path) === null
      ? kx("child", "path", e, !1)
      : Py("child", "path", e, !1),
    new Ht(t._repo, Se(t._path, e))
  );
}
function Kx(t, e) {
  (t = ur(t)), dd("push", t._path), Ry("push", e, t._path, !0);
  const n = by(t._repo),
    r = Yx(n),
    s = ts(t, r),
    i = ts(t, r);
  let o;
  return (
    e != null ? (o = Kt(i, e).then(() => i)) : (o = Promise.resolve(i)),
    (s.then = o.then.bind(o)),
    (s.catch = o.then.bind(o, void 0)),
    s
  );
}
function Qx(t) {
  return dd("remove", t._path), Kt(t, null);
}
function Kt(t, e) {
  (t = ur(t)), dd("set", t._path), Ry("set", e, t._path, !1);
  const n = new xi();
  return (
    Lx(
      t._repo,
      t._path,
      e,
      null,
      n.wrapCallback(() => {})
    ),
    n.promise
  );
}
function X(t, e) {
  Tx("update", e, t._path, !1);
  const n = new xi();
  return (
    $x(
      t._repo,
      t._path,
      e,
      n.wrapCallback(() => {})
    ),
    n.promise
  );
}
function ht(t) {
  t = ur(t);
  const e = new Fy(() => {}),
    n = new Ml(e);
  return Dx(t._repo, t, n).then(
    (r) => new es(r, new Ht(t._repo, t._path), t._queryParams.getIndex())
  );
}
class Ml {
  constructor(e) {
    this.callbackContext = e;
  }
  respondsTo(e) {
    return e === "value";
  }
  createEvent(e, n) {
    const r = n._queryParams.getIndex();
    return new Ly(
      "value",
      this,
      new es(e.snapshotNode, new Ht(n._repo, n._path), r)
    );
  }
  getEventRunner(e) {
    return e.getEventType() === "cancel"
      ? () => this.callbackContext.onCancel(e.error)
      : () => this.callbackContext.onValue(e.snapshot, null);
  }
  createCancelEvent(e, n) {
    return this.callbackContext.hasCancelCallback ? new $y(this, e, n) : null;
  }
  matches(e) {
    return e instanceof Ml
      ? !e.callbackContext || !this.callbackContext
        ? !0
        : e.callbackContext.matches(this.callbackContext)
      : !1;
  }
  hasAnyCallback() {
    return this.callbackContext !== null;
  }
}
class yd {
  constructor(e, n) {
    (this.eventType = e), (this.callbackContext = n);
  }
  respondsTo(e) {
    let n = e === "children_added" ? "child_added" : e;
    return (
      (n = n === "children_removed" ? "child_removed" : n), this.eventType === n
    );
  }
  createCancelEvent(e, n) {
    return this.callbackContext.hasCancelCallback ? new $y(this, e, n) : null;
  }
  createEvent(e, n) {
    b(e.childName != null, "Child events should have a childName.");
    const r = ts(new Ht(n._repo, n._path), e.childName),
      s = n._queryParams.getIndex();
    return new Ly(e.type, this, new es(e.snapshotNode, r, s), e.prevName);
  }
  getEventRunner(e) {
    return e.getEventType() === "cancel"
      ? () => this.callbackContext.onCancel(e.error)
      : () => this.callbackContext.onValue(e.snapshot, e.prevName);
  }
  matches(e) {
    return e instanceof yd
      ? this.eventType === e.eventType &&
          (!this.callbackContext ||
            !e.callbackContext ||
            this.callbackContext.matches(e.callbackContext))
      : !1;
  }
  hasAnyCallback() {
    return !!this.callbackContext;
  }
}
function qx(t, e, n, r, s) {
  let i;
  if (
    (typeof r == "object" && ((i = void 0), (s = r)),
    typeof r == "function" && (i = r),
    s && s.onlyOnce)
  ) {
    const a = n,
      c = (d, h) => {
        Of(t._repo, t, l), a(d, h);
      };
    (c.userCallback = n.userCallback), (c.context = n.context), (n = c);
  }
  const o = new Fy(n, i || void 0),
    l = e === "value" ? new Ml(o) : new yd(e, o);
  return Ux(t._repo, t, l), () => Of(t._repo, t, l);
}
function mt(t, e, n, r) {
  return qx(t, "value", e, n, r);
}
XS(Ht);
nx(Ht);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const Xx = "FIREBASE_DATABASE_EMULATOR_HOST",
  $c = {};
let Jx = !1;
function Zx(t, e, n, r) {
  (t.repoInfo_ = new Fg(
    `${e}:${n}`,
    !1,
    t.repoInfo_.namespace,
    t.repoInfo_.webSocketOnly,
    t.repoInfo_.nodeAdmin,
    t.repoInfo_.persistenceKey,
    t.repoInfo_.includeNamespaceInQueryParams,
    !0
  )),
    r && (t.authTokenProvider_ = r);
}
function e1(t, e, n, r, s) {
  let i = r || t.options.databaseURL;
  i === void 0 &&
    (t.options.projectId ||
      sn(
        "Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."
      ),
    Ue("Using default host for project ", t.options.projectId),
    (i = `${t.options.projectId}-default-rtdb.firebaseio.com`));
  let o = bf(i, s),
    l = o.repoInfo,
    a,
    c;
  typeof process < "u" && process.env && (c = process.env[Xx]),
    c
      ? ((a = !0),
        (i = `http://${c}?ns=${l.namespace}`),
        (o = bf(i, s)),
        (l = o.repoInfo))
      : (a = !o.repoInfo.secure);
  const d = s && a ? new Fr(Fr.OWNER) : new fE(t.name, t.options, e);
  Rx("Invalid Firebase Database URL", o),
    J(o.path) ||
      sn(
        "Database URL must point to the root of a Firebase Database (not including a child path)."
      );
  const h = n1(l, t, d, new hE(t.name, n));
  return new r1(h, t);
}
function t1(t, e) {
  const n = $c[e];
  (!n || n[t.key] !== t) &&
    sn(`Database ${e}(${t.repoInfo_}) has already been deleted.`),
    Bx(t),
    delete n[t.key];
}
function n1(t, e, n, r) {
  let s = $c[e.name];
  s || ((s = {}), ($c[e.name] = s));
  let i = s[t.toURLString()];
  return (
    i &&
      sn(
        "Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."
      ),
    (i = new Ax(t, Jx, n, r)),
    (s[t.toURLString()] = i),
    i
  );
}
class r1 {
  constructor(e, n) {
    (this._repoInternal = e),
      (this.app = n),
      (this.type = "database"),
      (this._instanceStarted = !1);
  }
  get _repo() {
    return (
      this._instanceStarted ||
        (jx(
          this._repoInternal,
          this.app.options.appId,
          this.app.options.databaseAuthVariableOverride
        ),
        (this._instanceStarted = !0)),
      this._repoInternal
    );
  }
  get _root() {
    return (
      this._rootInternal || (this._rootInternal = new Ht(this._repo, te())),
      this._rootInternal
    );
  }
  _delete() {
    return (
      this._rootInternal !== null &&
        (t1(this._repo, this.app.name),
        (this._repoInternal = null),
        (this._rootInternal = null)),
      Promise.resolve()
    );
  }
  _checkNotDeleted(e) {
    this._rootInternal === null &&
      sn("Cannot call " + e + " on a deleted database.");
  }
}
function s1(t = BC(), e) {
  const n = LC(t, "database").getImmediate({ identifier: e });
  if (!n._instanceStarted) {
    const r = Pw("database");
    r && i1(n, ...r);
  }
  return n;
}
function i1(t, e, n, r = {}) {
  (t = ur(t)),
    t._checkNotDeleted("useEmulator"),
    t._instanceStarted &&
      sn(
        "Cannot call useEmulator() after instance has already been initialized."
      );
  const s = t._repoInternal;
  let i;
  if (s.repoInfo_.nodeAdmin)
    r.mockUserToken &&
      sn(
        'mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'
      ),
      (i = new Fr(Fr.OWNER));
  else if (r.mockUserToken) {
    const o =
      typeof r.mockUserToken == "string"
        ? r.mockUserToken
        : Iw(r.mockUserToken, t.app.options.projectId);
    i = new Fr(o);
  }
  Zx(s, e, n, i);
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ function o1(t) {
  XC(UC),
    zo(
      new ci(
        "database",
        (e, { instanceIdentifier: n }) => {
          const r = e.getProvider("app").getImmediate(),
            s = e.getProvider("auth-internal"),
            i = e.getProvider("app-check-internal");
          return e1(r, s, i, n);
        },
        "PUBLIC"
      ).setMultipleInstances(!0)
    ),
    Lr(Zh, ef, t),
    Lr(Zh, ef, "esm2017");
}
Zt.prototype.simpleListen = function (t, e) {
  this.sendRequest("q", { p: t }, e);
};
Zt.prototype.echo = function (t, e) {
  this.sendRequest("echo", { d: t }, e);
};
o1();
var l1 = "firebase",
  a1 = "9.23.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Lr(l1, a1, "app");
const c1 = {
    apiKey: "AIzaSyDFNr6i4ByM6or5CuS_y8V5jVpeK3h9gIg",
    authDomain: "love-letter-a8996.firebaseapp.com",
    projectId: "love-letter-a8996",
    databaseURL:
      "https://love-letter-a8996-default-rtdb.europe-west1.firebasedatabase.app/",
    storageBucket: "love-letter-a8996.firebasestorage.app",
    messagingSenderId: "528950757466",
    appId: "1:528950757466:web:fe0a7a38d23af956d2f063",
    measurementId: "G-2JGDPSP9X0",
  },
  u1 = Eg(c1),
  $ = s1(u1),
  jf = [
    { name: "Sir Lancelint", gender: "male" },
    { name: "Lady Scriptoria", gender: "female" },
    { name: "Dame JSONette", gender: "female" },
    { name: "Lord Loopalot", gender: "male" },
    { name: "Count Bracket", gender: "male" },
    { name: "Baroness Backendia", gender: "female" },
    { name: "Sir Bugslay", gender: "male" },
    { name: "Duchess Deploya", gender: "female" },
    { name: "The Null Knight", gender: "neutral" },
    { name: "Captain Callback", gender: "neutral" },
    { name: "Baroness Booleania", gender: "female" },
    { name: "Duke of Debugshire", gender: "male" },
    { name: "Dame Dotenv", gender: "female" },
    { name: "Lady Lambda", gender: "female" },
    { name: "Sir Console.log", gender: "male" },
    { name: "Countess Cloudflare", gender: "female" },
    { name: "Lord Semicolin", gender: "male" },
    { name: "Madame Mergeconflict", gender: "female" },
    { name: "The Rogue of Regex", gender: "neutral" },
    { name: "Princess Patchnote", gender: "female" },
    { name: "Sir Gitpullalot", gender: "male" },
    { name: "Monk of Markdown", gender: "neutral" },
    { name: "Viscount VanillaJS", gender: "male" },
    { name: "Lady Lintalot", gender: "female" },
    { name: "The Earl of Else", gender: "male" },
    { name: "Sir Nullpointer", gender: "male" },
    { name: "Lady Latency", gender: "female" },
    { name: "Duke of Downtime", gender: "male" },
    { name: "Lord Hotfix", gender: "male" },
    { name: "Sir Stacktrace", gender: "male" },
    { name: "Madame Middleware", gender: "female" },
    { name: "Monk of Microservices", gender: "neutral" },
    { name: "The Earl of Exceptions", gender: "male" },
    { name: "Dame Deployfail", gender: "female" },
    { name: "Count Cronjob", gender: "male" },
    { name: "Baroness Bandwidth", gender: "female" },
    { name: "Sir Unit Testington", gender: "male" },
    { name: "Lady Prototype", gender: "female" },
    { name: "Duchess Dependency", gender: "female" },
    { name: "Captain Commit", gender: "neutral" },
    { name: "Lady Pipenv", gender: "female" },
    { name: "Sir Agileton", gender: "male" },
    { name: "Madame Milestone", gender: "female" },
    { name: "Countess Callbackhell", gender: "female" },
    { name: "Sir Scrumptious", gender: "male" },
    { name: "The Vagrant of Versioning", gender: "neutral" },
    { name: "Baroness Browsercache", gender: "female" },
    { name: "Lord Jira", gender: "male" },
    { name: "The Knight of Nightly Builds", gender: "neutral" },
    { name: "Dame Dataclass", gender: "female" },
    { name: "Lord Overload", gender: "male" },
    { name: "Countess Console.error", gender: "female" },
    { name: "Sir Storypointless", gender: "male" },
    { name: "Lady Pullrequest", gender: "female" },
    { name: "Viscount VPN", gender: "male" },
    { name: "Lady ServicePortal", gender: "female" },
    { name: "The Lord of Frameworks", gender: "neutral" },
    { name: "Baroness Branchmergia", gender: "female" },
    { name: "Sir ScriptaLot", gender: "male" },
    { name: "Lady InfiniteLoopia", gender: "female" },
    { name: "Lord OutOfMemory", gender: "male" },
    { name: "Duchess Dockeria", gender: "female" },
    { name: "The Herald of HotReload", gender: "neutral" },
    { name: "Master of CodeDisaster", gender: "male" },
    { name: "Master of LockingEveryoneOut", gender: "male" },
    { name: "Lord TableQuery", gender: "male" },
    { name: "Lord of the BlueScreen of Death", gender: "male" },
    { name: "Dame Widgetonia", gender: "female" },
    { name: "The Prophet of Patchday", gender: "neutral" },
    { name: "Sir InfiniteScroll", gender: "male" },
    { name: "Lady Querystring", gender: "female" },
    { name: "Lord Outageborn", gender: "male" },
    { name: "Dame Deadlockia", gender: "female" },
    { name: "The Baron of Backups", gender: "male" },
    { name: "Countess Nullish", gender: "female" },
    { name: "Sir SyntaxError", gender: "male" },
    { name: "The Herald of Hexcodes", gender: "neutral" },
    { name: "Lord Timeout", gender: "male" },
    { name: "Captain Codefreeze", gender: "neutral" },
    { name: "The Abbot of APIs", gender: "neutral" },
    { name: "Sir FeatureCreep", gender: "male" },
    { name: "Lady Escapia", gender: "female" },
    { name: "Duchess Dropdownia", gender: "female" },
    { name: "Lord Lagomir", gender: "male" },
    { name: "The Pagefault Prophet", gender: "neutral" },
    { name: "Duchess DarkMode", gender: "female" },
    { name: "Sir SessionExpired", gender: "male" },
    { name: "Viscountess Webhookia", gender: "female" },
    { name: "Count Refactor", gender: "male" },
    { name: "Lord Legacycode", gender: "male" },
    { name: "Dame Datanode", gender: "female" },
    { name: "The Knight of Kanban", gender: "neutral" },
    { name: "Baroness Bottleneckia", gender: "female" },
    { name: "Sir SLAye", gender: "male" },
  ];
function Uy(t = null) {
  const e = t ? jf.filter((r) => r.gender === t || r.gender === "neutral") : jf;
  return e[Math.floor(Math.random() * e.length)].name;
}
const By = "/assets/princess-square-7a5d1feb.jpeg",
  nl = "/assets/love-letter-c644cc37.png";
function d1() {
  const [t, e] = N.useState(""),
    [n, r] = N.useState(""),
    [s, i] = N.useState(""),
    [o, l] = N.useState(""),
    [a, c] = N.useState(""),
    [d, h] = N.useState([]),
    [f, p] = N.useState(!1),
    g = os(),
    w = cr();
  N.useEffect(() => {
    var _;
    (_ = w.state) != null &&
      _.kickedMessage &&
      (c(w.state.kickedMessage), setTimeout(() => c(""), 5e3));
  }, [w.state]);
  const E = async () => {
      const _ = [];
      if (
        (t.trim() ||
          _.push("⚔️ A noble nickname is required to enter the court!"),
        n.trim() || _.push("👑 Thy true name must be revealed to join!"),
        o.trim() || _.push("🏰 A sacred room code is required for entry!"),
        n.trim() &&
          n.trim().length < 3 &&
          _.push("📜 Thy true name must be at least 3 characters long!"),
        n.trim() &&
          n.trim().length > 30 &&
          _.push("📜 Thy true name must be less than 30 characters!"),
        t.trim() &&
          t.trim().length < 3 &&
          _.push("⚔️ Thy noble nickname must be at least 3 characters long!"),
        t.trim() &&
          t.trim().length > 30 &&
          _.push("⚔️ Thy noble nickname must be less than 30 characters!"),
        _.length > 0)
      )
        return h(_), !1;
      try {
        p(!0);
        const C = L($, `rooms/${o.trim()}`);
        if (!(await ht(C)).exists())
          return (
            _.push("🚫 This mystical chamber does not exist in our realm!"),
            h(_),
            !1
          );
        const O = L($, `rooms/${o.trim()}/players`),
          A = await ht(O);
        if (A.exists()) {
          const M = A.val(),
            P = Object.values(M);
          P.some((Ce) => Ce.name.toLowerCase() === t.trim().toLowerCase()) &&
            _.push("👥 This noble nickname is already taken in this chamber!"),
            P.some(
              (Ce) => Ce.realName.toLowerCase() === n.trim().toLowerCase()
            ) && _.push("👥 This true name is already known in this chamber!");
        }
        return _.length > 0 ? (h(_), !1) : !0;
      } catch (C) {
        return (
          console.error("Validation error:", C),
          _.push("⚡ A mystical error occurred while checking the chamber!"),
          h(_),
          !1
        );
      } finally {
        p(!1);
      }
    },
    y = (_, C) => {
      _(C), d.length > 0 && h([]);
    },
    m = async () => {
      (await E()) &&
        g(`/room/${o.trim()}`, {
          state: { nickname: t.trim(), realName: n.trim() },
        });
    },
    v = () => {
      const _ = Uy(s);
      e(_);
      const C = document.querySelector(".generate-name-btn");
      C &&
        (C.classList.add("success-glow"),
        setTimeout(() => C.classList.remove("success-glow"), 600));
    };
  return u.jsxs("div", {
    className: "royal-landing-container",
    children: [
      u.jsxs("div", {
        className: "royal-header",
        children: [
          u.jsx("img", {
            src: nl,
            alt: "Love Letter",
            className: "royal-header-image",
          }),
          u.jsxs("div", {
            className: "royal-header-text",
            children: [
              u.jsx("h1", {
                className: "royal-title-centered floating",
                children: "LOVE LETTER",
              }),
              u.jsx("p", {
                className: "royal-subtitle-centered",
                children: `"Who wants to win a princess's heart... and her noble crown?"`,
              }),
            ],
          }),
          u.jsx("img", {
            src: nl,
            alt: "Love Letter",
            className: "royal-header-image",
          }),
        ],
      }),
      u.jsxs("div", {
        className: "royal-main-content",
        children: [
          u.jsxs("div", {
            className: "royal-form-panel",
            children: [
              a &&
                u.jsxs("div", {
                  className: "kicked-message",
                  children: [
                    u.jsxs("p", { children: ["⚔️ ", a, " ⚔️"] }),
                    u.jsx("p", {
                      style: { fontSize: "0.8rem", opacity: 0.8 },
                      children:
                        "Fear not, noble soul! You may join another royal court below.",
                    }),
                  ],
                }),
              u.jsxs("div", {
                className: "royal-form-group",
                children: [
                  u.jsx("label", {
                    className: "royal-label",
                    children: "Thy True Name:",
                  }),
                  u.jsx("input", {
                    className: "royal-input",
                    value: n,
                    onChange: (_) => y(r, _.target.value),
                    placeholder: "By what name art thou known in the realm?",
                  }),
                ],
              }),
              u.jsxs("fieldset", {
                className: "royal-fieldset",
                children: [
                  u.jsx("legend", {
                    className: "royal-legend",
                    children: "Choose Thy Courtly Title & Moniker",
                  }),
                  u.jsxs("div", {
                    className: "name-generator-container",
                    children: [
                      u.jsx("div", {
                        className: "name-generator-input royal-form-group",
                        children: u.jsx("input", {
                          className: "royal-input",
                          value: t,
                          onChange: (_) => y(e, _.target.value),
                          placeholder: "Enter thy courtly nickname",
                        }),
                      }),
                      u.jsx("button", {
                        className: "royal-button generate-name-btn",
                        onClick: v,
                        children: "🎲 Generate Noble Name",
                      }),
                    ],
                  }),
                  u.jsxs("div", {
                    className: "gender-options",
                    children: [
                      u.jsxs("label", {
                        className: "gender-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            name: "gender",
                            value: "female",
                            checked: s === "female",
                            onChange: (_) => i(_.target.value),
                          }),
                          u.jsx("span", {
                            className: "gender-option-label",
                            children: "👸 Lady name",
                          }),
                        ],
                      }),
                      u.jsxs("label", {
                        className: "gender-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            name: "gender",
                            value: "male",
                            checked: s === "male",
                            onChange: (_) => i(_.target.value),
                          }),
                          u.jsx("span", {
                            className: "gender-option-label",
                            children: "🤴 Lord name",
                          }),
                        ],
                      }),
                      u.jsxs("label", {
                        className: "gender-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            name: "gender",
                            value: "",
                            checked: s === "",
                            onChange: (_) => i(_.target.value),
                          }),
                          u.jsx("span", {
                            className: "gender-option-label",
                            children: "⚡ Neutral name",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              u.jsxs("div", {
                className: "royal-form-group room-code-group",
                children: [
                  u.jsx("label", {
                    className: "royal-label",
                    children: "Sacred Room Code:",
                  }),
                  u.jsx("input", {
                    className: "royal-input",
                    value: o,
                    onChange: (_) => y(l, _.target.value),
                    placeholder: "Enter the mystical chamber code...",
                  }),
                ],
              }),
              d.length > 0 &&
                u.jsx("div", {
                  className: "validation-errors",
                  children: d.map((_, C) =>
                    u.jsx("div", { className: "error-message", children: _ }, C)
                  ),
                }),
              u.jsx("button", {
                onClick: m,
                className: "royal-button",
                disabled:
                  !(t != null && t.trim()) ||
                  !(n != null && n.trim()) ||
                  !(o != null && o.trim()) ||
                  d.length > 0 ||
                  f,
                style: {
                  width: "100%",
                  fontSize: "1.2rem",
                  opacity:
                    !(t != null && t.trim()) ||
                    !(n != null && n.trim()) ||
                    !(o != null && o.trim()) ||
                    d.length > 0 ||
                    f
                      ? 0.6
                      : 1,
                  cursor:
                    !(t != null && t.trim()) ||
                    !(n != null && n.trim()) ||
                    !(o != null && o.trim()) ||
                    d.length > 0 ||
                    f
                      ? "not-allowed"
                      : "pointer",
                },
                children: f
                  ? "⏳ Verifying Royal Credentials..."
                  : "🏰 Enter the Royal Court 🏰",
              }),
            ],
          }),
          u.jsxs("div", {
            className: "royal-artwork-panel",
            children: [
              u.jsxs("div", {
                className: "story-container",
                children: [
                  u.jsx("p", {
                    className: "story-1",
                    children:
                      "⚔️ The throne is vacant: the King is dead, the Queen a traitor.",
                  }),
                  u.jsx("p", {
                    className: "story-2",
                    children:
                      "👑 Only Princess Charlotte remains, drowning in sorrow and gossip.",
                  }),
                  u.jsx("p", {
                    className: "story-2",
                    children: "❤️‍🔥 Could you be the one to heal her misery…",
                  }),
                  u.jsx("p", {
                    className: "story-2",
                    children: "…and upgrade yourself from nobody to sovereign?",
                  }),
                  u.jsx("p", {
                    className: "story-1 story-4",
                    children: "HOW?",
                  }),
                  u.jsxs("p", {
                    className: "story-3",
                    children: [
                      "💌 Find a fool brave enough to carry your love letter past locked doors. ",
                      u.jsx("br", {}),
                      "Only then may she read your plea… or laugh at it over tea. 🫖",
                    ],
                  }),
                ],
              }),
              u.jsx("img", {
                src: By,
                alt: "Princess of the Royal Court",
                className: "princess-artwork",
              }),
            ],
          }),
        ],
      }),
      u.jsx("footer", {
        className: "royal-footer",
        children: u.jsx("p", {
          className: "royal-footer-text",
          children: "Made by Amandine & Archie, with love ❤️‍🔥",
        }),
      }),
    ],
  });
}
const h1 = [
  "SWORD",
  "BLADE",
  "SHIELD",
  "LANCE",
  "MACE",
  "DAGGER",
  "BOW",
  "ARROW",
  "CASTLE",
  "TOWER",
  "THRONE",
  "COURT",
  "HALL",
  "CHAMBER",
  "GATE",
  "BRIDGE",
  "CROWN",
  "ROYAL",
  "NOBLE",
  "KING",
  "QUEEN",
  "PRINCE",
  "LORD",
  "LADY",
  "KNIGHT",
  "HONOR",
  "VALOR",
  "GLORY",
  "QUEST",
  "COURAGE",
  "FAITH",
  "OATH",
  "DRAGON",
  "MAGIC",
  "SPELL",
  "RUNE",
  "CRYSTAL",
  "POTION",
  "ENCHANT",
  "MYSTIC",
  "FLAME",
  "STORM",
  "SHADOW",
  "LIGHT",
  "DAWN",
  "MOON",
  "STAR",
  "SUN",
  "WIND",
  "EARTH",
  "FIRE",
  "WATER",
  "ICE",
  "THUNDER",
  "FROST",
  "MIST",
  "GOLD",
  "SILVER",
  "RUBY",
  "PEARL",
  "DIAMOND",
  "STEEL",
  "IRON",
  "BRONZE",
  "WOLF",
  "EAGLE",
  "LION",
  "BEAR",
  "STAG",
  "RAVEN",
  "FALCON",
  "PHOENIX",
  "ROSE",
  "OAK",
  "THORN",
  "LILY",
  "VINE",
  "FOREST",
  "RIVER",
  "MOUNTAIN",
  "REALM",
  "DESTINY",
  "LEGEND",
  "MYTH",
  "SAGA",
  "TALE",
  "DREAM",
  "SPIRIT",
];
function f1() {
  return [...h1]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .join("-");
}
function p1() {
  const [t, e] = N.useState(""),
    [n, r] = N.useState(""),
    [s, i] = N.useState(""),
    [o, l] = N.useState("normal"),
    [a, c] = N.useState(!1),
    d = os(),
    h = async () => {
      if (!(!t || !n)) {
        c(!0);
        try {
          const p = f1();
          await Kt(L($, `rooms/${p}`), {
            host: t,
            mode: o,
            players: {
              [t]: { name: t, realName: n, tokens: 0, discard: [], isOut: !1 },
            },
            gameState: "waiting",
          }),
            d(`/room/${p}`, { state: { nickname: t, realName: n } });
        } catch (p) {
          console.error("Failed to create room:", p), c(!1);
        }
      }
    },
    f = () => {
      const p = Uy(s);
      e(p);
      const g = document.querySelector(".generate-name-btn");
      g &&
        (g.classList.add("success-glow"),
        setTimeout(() => g.classList.remove("success-glow"), 600));
    };
  return u.jsxs("div", {
    className: "royal-landing-container",
    children: [
      u.jsxs("div", {
        className: "royal-header",
        children: [
          u.jsx("img", {
            src: nl,
            alt: "Love Letter",
            className: "royal-header-image",
          }),
          u.jsxs("div", {
            className: "royal-header-text",
            children: [
              u.jsx("h1", {
                className: "royal-title-centered floating",
                children: "Establish Royal Court",
              }),
              u.jsx("p", {
                className: "royal-subtitle-centered",
                children:
                  '"Noble Game Master, Prepare Thy Sacred Chamber for the Grand Tournament of Love Letters!"',
              }),
            ],
          }),
          u.jsx("img", {
            src: nl,
            alt: "Love Letter",
            className: "royal-header-image",
          }),
        ],
      }),
      u.jsxs("div", {
        className: "royal-main-content",
        children: [
          u.jsxs("div", {
            className: "royal-form-panel",
            children: [
              u.jsxs("div", {
                className: "royal-form-group",
                children: [
                  u.jsx("label", {
                    className: "royal-label",
                    children: "Thy Noble Name:",
                  }),
                  u.jsx("input", {
                    className: "royal-input",
                    value: n,
                    onChange: (p) => r(p.target.value),
                    placeholder: "By what name shall the court know thee?",
                  }),
                ],
              }),
              u.jsxs("fieldset", {
                className: "royal-fieldset",
                children: [
                  u.jsx("legend", {
                    className: "royal-legend",
                    children: "Thy Courtly Title & Royal Moniker",
                  }),
                  u.jsxs("div", {
                    className: "name-generator-container",
                    children: [
                      u.jsx("div", {
                        className: "name-generator-input royal-form-group",
                        children: u.jsx("input", {
                          className: "royal-input",
                          value: t,
                          onChange: (p) => e(p.target.value),
                          placeholder: "Enter thy majestic court name",
                        }),
                      }),
                      u.jsx("button", {
                        className: "royal-button generate-name-btn",
                        onClick: f,
                        children: "🎲 Generate Royal Name",
                      }),
                    ],
                  }),
                  u.jsxs("div", {
                    className: "gender-options",
                    children: [
                      u.jsxs("label", {
                        className: "gender-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            name: "gender",
                            value: "female",
                            checked: s === "female",
                            onChange: (p) => i(p.target.value),
                          }),
                          u.jsx("span", {
                            className: "gender-option-label",
                            children: "👸 Lady name",
                          }),
                        ],
                      }),
                      u.jsxs("label", {
                        className: "gender-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            name: "gender",
                            value: "male",
                            checked: s === "male",
                            onChange: (p) => i(p.target.value),
                          }),
                          u.jsx("span", {
                            className: "gender-option-label",
                            children: "🤴 Lord name",
                          }),
                        ],
                      }),
                      u.jsxs("label", {
                        className: "gender-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            name: "gender",
                            value: "",
                            checked: s === "",
                            onChange: (p) => i(p.target.value),
                          }),
                          u.jsx("span", {
                            className: "gender-option-label",
                            children: "⚡ Neutral name",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              u.jsxs("fieldset", {
                className: "royal-fieldset",
                children: [
                  u.jsx("legend", {
                    className: "royal-legend",
                    children: "Royal Tournament Mode",
                  }),
                  u.jsxs("div", {
                    className: "mode-options",
                    children: [
                      u.jsxs("label", {
                        className: "mode-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            value: "normal",
                            checked: o === "normal",
                            onChange: (p) => l(p.target.value),
                            style: { display: "none" },
                          }),
                          u.jsxs("div", {
                            className: "mode-option-content",
                            children: [
                              u.jsx("div", { children: "🎲 Classic Court" }),
                              u.jsx("div", {
                                style: { fontSize: "0.9rem", opacity: 0.8 },
                                children: "(2–4 Noble Suitors)",
                              }),
                              u.jsx("div", {
                                style: {
                                  fontSize: "0.8rem",
                                  marginTop: "0.5rem",
                                  fontStyle: "italic",
                                },
                                children:
                                  "A refined gathering for intimate courtship",
                              }),
                            ],
                          }),
                        ],
                      }),
                      u.jsxs("label", {
                        className: "mode-option",
                        children: [
                          u.jsx("input", {
                            type: "radio",
                            value: "premium",
                            checked: o === "premium",
                            onChange: (p) => l(p.target.value),
                            style: { display: "none" },
                          }),
                          u.jsxs("div", {
                            className: "mode-option-content",
                            children: [
                              u.jsx("div", { children: "🧙 Premium Court" }),
                              u.jsx("div", {
                                style: { fontSize: "0.9rem", opacity: 0.8 },
                                children: "(5–8 Noble Suitors)",
                              }),
                              u.jsx("div", {
                                style: {
                                  fontSize: "0.8rem",
                                  marginTop: "0.5rem",
                                  fontStyle: "italic",
                                },
                                children:
                                  "A grand tournament with extended royal intrigue",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              u.jsx("button", {
                onClick: h,
                className: "royal-button create-button",
                disabled: !t || !n || a,
                style: {
                  width: "100%",
                  fontSize: "1.2rem",
                  opacity: !t || !n || a ? 0.6 : 1,
                  cursor: !t || !n || a ? "not-allowed" : "pointer",
                },
                children: a
                  ? u.jsx(u.Fragment, {
                      children: "🏗️ Establishing Royal Court... 🏗️",
                    })
                  : u.jsx(u.Fragment, {
                      children: "👑 Establish thy Royal Court 👑",
                    }),
              }),
            ],
          }),
          u.jsx("div", {
            className: "royal-artwork-panel",
            children: u.jsx("img", {
              src: By,
              alt: "Princess of the Royal Court",
              className: "princess-artwork",
              style: { margin: "4rem" },
            }),
          }),
        ],
      }),
      u.jsx("footer", {
        className: "royal-footer",
        children: u.jsx("p", {
          className: "royal-footer-text",
          children: "Made by Amandine & Archie, with love ❤️‍🔥",
        }),
      }),
    ],
  });
}
const vi = [
  {
    id: 0,
    name: "Jester",
    strength: 0,
    countNormal: 0,
    countPremium: 1,
    effect: "Choose a player. If they win, you gain a token.",
  },
  {
    id: 1,
    name: "Guard",
    strength: 1,
    countNormal: 5,
    countPremium: 8,
    effect: "Guess a strength (≠1). If correct, target is eliminated.",
  },
  {
    id: 2,
    name: "Priest",
    strength: 2,
    countNormal: 2,
    countPremium: 2,
    effect: "View another player's hand.",
  },
  {
    id: 3,
    name: "Baron",
    strength: 3,
    countNormal: 2,
    countPremium: 2,
    effect: "Compare hands. Lower card is eliminated.",
  },
  {
    id: 4,
    name: "Handmaid",
    strength: 4,
    countNormal: 2,
    countPremium: 2,
    effect: "You are protected until your next turn.",
  },
  {
    id: 5,
    name: "Prince",
    strength: 5,
    countNormal: 2,
    countPremium: 2,
    effect: "Target discards hand and draws a new one.",
  },
  {
    id: 6,
    name: "Phantom King",
    strength: 6,
    countNormal: 1,
    countPremium: 1,
    effect: "Trade hands with another player.",
  },
  {
    id: 7,
    name: "Countess",
    strength: 7,
    countNormal: 1,
    countPremium: 1,
    effect: "Must be played if with Prince or Phantom King.",
  },
  {
    id: 8,
    name: "Princess",
    strength: 8,
    countNormal: 1,
    countPremium: 1,
    effect: "If discarded, you are eliminated.",
  },
  {
    id: 9,
    name: "Inquisitor",
    strength: 9,
    countNormal: 0,
    countPremium: 1,
    effect: "Guess a strength. If correct, gain an affection token.",
  },
  {
    id: 10,
    name: "Chamberlain",
    strength: 6,
    countNormal: 0,
    countPremium: 1,
    effect: "If eliminated, gain 1 affection token.",
  },
  {
    id: 11,
    name: "Regent Queen",
    strength: 7,
    countNormal: 0,
    countPremium: 1,
    effect: "Compare hands. Higher is eliminated.",
  },
  {
    id: 12,
    name: "Court Whisperer",
    strength: 4,
    countNormal: 0,
    countPremium: 2,
    effect: "Choose who the next player must target.",
  },
  {
    id: 13,
    name: "Royal Confessor",
    strength: 2,
    countNormal: 0,
    countPremium: 2,
    effect: "Trade hands. View the new card if you wish.",
  },
  {
    id: 14,
    name: "Assassin",
    strength: 0,
    countNormal: 0,
    countPremium: 1,
    effect: "If targeted with Guard, eliminate attacker instead.",
  },
  {
    id: 15,
    name: "Baroness",
    strength: 3,
    countNormal: 0,
    countPremium: 2,
    effect: "View the hands of two players.",
  },
  {
    id: 16,
    name: "Duke",
    strength: 5,
    countNormal: 0,
    countPremium: 2,
    effect: "If discarded or played, add +1 to your hand strength.",
  },
];
function zy(t = "normal") {
  const e = [];
  vi.forEach((n) => {
    const r = t === "premium" ? n.countPremium : n.countNormal;
    for (let s = 0; s < r; s++)
      e.push({
        id: n.id,
        name: n.name,
        strength: n.strength,
        effect: n.effect,
      });
  });
  for (let n = e.length - 1; n > 0; n--) {
    const r = Math.floor(Math.random() * (n + 1));
    [e[n], e[r]] = [e[r], e[n]];
  }
  return e;
}
const m1 = "/assets/waiting-room-a7c03f1c.jpeg";
function g1() {
  const { id: t } = El(),
    { state: e } = cr(),
    n = os(),
    r = e == null ? void 0 : e.nickname,
    s = e == null ? void 0 : e.realName,
    [i, o] = N.useState([]),
    [l, a] = N.useState(""),
    [c, d] = N.useState(!1);
  N.useState(1);
  const [h, f] = N.useState("normal");
  N.useEffect(() => {
    const v = L($, `rooms/${t}`);
    if (r) {
      const C = L($, `rooms/${t}/players/${r}`);
      X(C, { name: r, realName: s || "", isOut: !1, tokens: 0 });
    }
    const _ = mt(v, (C) => {
      const x = C.val();
      x != null && x.players && o(Object.values(x.players)),
        x != null && x.host && a(x.host),
        x != null && x.mode && f(x.mode),
        (x == null ? void 0 : x.gameState) === "inRound" && d(!0);
    });
    return () => _();
  }, [t, r, s]),
    N.useEffect(() => {
      c && n(`/play/${t}`, { state: { nickname: r } });
    }, [c, n, t, r]),
    N.useEffect(() => {
      r &&
        i.length > 0 &&
        (i.some((_) => _.name === r) ||
          (console.log(`Player ${r} was kicked from the room`),
          n("/", {
            state: {
              kickedMessage:
                "You were removed from the royal court by the Game Master.",
            },
          })));
    }, [i, r, n]);
  const p = r === l,
    g = i.length,
    w = g >= 2 && g <= 11,
    E = g > 11,
    y = async (v) => {
      if (!p || v === l) {
        console.warn("Cannot kick: either not host or trying to kick host");
        return;
      }
      if (
        window.confirm(
          `⚔️ Art thou certain thou wishest to banish ${v} from the royal court? This action cannot be undone! 👑`
        )
      )
        try {
          const C = L($, `rooms/${t}/players/${v}`);
          await Qx(C),
            console.log(`Player ${v} has been banished from the royal court`);
        } catch (C) {
          console.error("Failed to kick player:", C);
        }
    },
    m = () => {
      if (g < 2 || g > 11) {
        console.warn(
          `Cannot start game with ${g} players. Must be 2-11 players.`
        );
        return;
      }
      const v = L($, `rooms/${t}`);
      mt(
        v,
        (_) => {
          const C = _.val();
          if (!(C != null && C.players)) return;
          const x = Object.keys(C.players),
            A = [...zy(C.mode || "normal")],
            M = A.shift(),
            P = {};
          x.forEach((V) => {
            P[V] = {
              ...C.players[V],
              hand: [A.shift()],
              discard: [],
              isOut: !1,
            };
          });
          const B = x[Math.floor(Math.random() * x.length)];
          X(v, {
            gameState: "inRound",
            players: P,
            round: { hiddenCard: M, deck: A, currentPlayer: B },
          });
        },
        { onlyOnce: !0 }
      );
    };
  return u.jsxs("div", {
    className: "royal-landing-container",
    children: [
      u.jsx("div", {
        className: "royal-header",
        children: u.jsxs("div", {
          className: "royal-header-text",
          children: [
            u.jsx("h1", {
              className: "royal-title-centered floating",
              children: "THE ROYAL ANTECHAMBER",
            }),
            u.jsxs("p", {
              className: "royal-subtitle-centered",
              children: [
                '"Sacred Court Code: ',
                u.jsx("strong", { children: t }),
                '"',
              ],
            }),
          ],
        }),
      }),
      u.jsxs("div", {
        className: "royal-main-content",
        children: [
          u.jsxs("div", {
            className: "royal-form-panel",
            children: [
              u.jsxs("div", {
                className: "royal-guest-section",
                children: [
                  u.jsxs("h3", {
                    className: "royal-section-title",
                    children: [
                      "⚔️ Noble Guests in Attendance",
                      " ",
                      u.jsxs("span", {
                        className: `guest-counter ${E ? "over-capacity" : ""}`,
                        children: ["(", g, "/11)"],
                      }),
                      " ",
                      "⚔️",
                    ],
                  }),
                  u.jsx("div", {
                    className: "royal-guest-list",
                    children: i.map((v, _) =>
                      u.jsxs(
                        "div",
                        {
                          className: "royal-guest-card",
                          children: [
                            u.jsx("div", {
                              className: "guest-position-number",
                              children: _ + 1,
                            }),
                            u.jsx("div", {
                              className: "guest-info",
                              children: u.jsxs("div", {
                                className: "guest-nickname",
                                children: [
                                  v.name === l && "👑 ",
                                  v.name,
                                  "   ",
                                  u.jsxs("span", {
                                    className: "guest-realname",
                                    children: ["(", v.realName, ")"],
                                  }),
                                  "   ",
                                  v.name === r && " ← you",
                                ],
                              }),
                            }),
                            u.jsx("div", {
                              className: "guest-status",
                              children:
                                v.name === l
                                  ? "Host & Game Master"
                                  : "Noble Guest",
                            }),
                            p &&
                              v.name !== l &&
                              (E || g > 2) &&
                              u.jsx("button", {
                                onClick: () => y(v.name),
                                className: "kick-player-button",
                                title: `Banish ${v.name} from the royal court`,
                                children: "🚫 Banish",
                              }),
                          ],
                        },
                        _
                      )
                    ),
                  }),
                  i.length < 2 &&
                    u.jsxs("div", {
                      className: "waiting-notice",
                      children: [
                        u.jsx("p", {
                          children:
                            "🕰️ The court requires at least 2 noble souls to begin the tournament...",
                        }),
                        u.jsxs("p", {
                          style: { fontSize: "0.8rem", opacity: 0.7 },
                          children: [
                            'Share the sacred code "',
                            u.jsx("strong", { children: t }),
                            '" with fellow courtiers!',
                          ],
                        }),
                      ],
                    }),
                  E &&
                    u.jsxs("div", {
                      className: "over-capacity-notice",
                      children: [
                        u.jsx("p", {
                          children:
                            "⚠️ The royal court is overflowing! Maximum 11 noble guests allowed.",
                        }),
                        u.jsx("p", {
                          style: { fontSize: "0.8rem", opacity: 0.7 },
                          children: p
                            ? "Use the 'Banish' buttons to remove guests before starting the tournament..."
                            : "The Game Master must remove some guests before the tournament can begin...",
                        }),
                      ],
                    }),
                ],
              }),
              p &&
                w &&
                u.jsx("button", {
                  onClick: m,
                  className: "royal-button royal-start-button",
                  children: "🎺 COMMENCE THE ROYAL TOURNAMENT 🎺",
                }),
              p &&
                !w &&
                u.jsx("button", {
                  disabled: !0,
                  className: "royal-button royal-start-button",
                  style: { opacity: 0.5, cursor: "not-allowed" },
                  children:
                    g < 2
                      ? "⏳ Awaiting More Noble Guests ⏳"
                      : "⚠️ Too Many Guests in Court ⚠️",
                }),
              !p &&
                u.jsx("div", {
                  className: "non-host-message",
                  children: u.jsx("p", {
                    children:
                      "⏳ Awaiting the Game Master's call to begin the tournament...",
                  }),
                }),
            ],
          }),
          u.jsxs("div", {
            className: "royal-artwork-panel",
            children: [
              u.jsxs("div", {
                className: "welcome-message-container",
                children: [
                  u.jsxs("p", {
                    className: "welcome-message",
                    children: [
                      "🏰 Welcome to the Royal Antechamber,",
                      " ",
                      u.jsx("strong", { className: "noble-name", children: r }),
                      "! 🏰",
                    ],
                  }),
                  u.jsx("p", {
                    style: {
                      fontSize: "0.9rem",
                      opacity: 0.9,
                      marginTop: "0.5rem",
                    },
                    children:
                      "The royal court awaits more noble souls before the tournament of hearts may commence.",
                  }),
                ],
              }),
              u.jsx("img", {
                src: m1,
                alt: "Royal Waiting Chamber",
                className: "waiting-room-artwork",
              }),
            ],
          }),
        ],
      }),
      u.jsx("footer", {
        className: "royal-footer",
        children: u.jsx("p", {
          className: "royal-footer-text",
          children: "Made by Amandine & Archie, with love ❤️‍🔥",
        }),
      }),
    ],
  });
}
function y1({
  players: t,
  currentPlayer: e,
  cardPlayed: n,
  protectedPlayers: r = [],
  onConfirm: s,
  onCancel: i,
}) {
  var w;
  const [o, l] = N.useState(""),
    [a, c] = N.useState(2),
    d = Object.entries(t).filter(
      ([E, y]) => E !== e && !y.isOut && !r.includes(E)
    ),
    h = n === 1,
    f = n === 5,
    p = n === 6,
    g = d.length === 0 && !f;
  return (
    console.log(
      "TargetModal has been called! / players: ",
      t,
      " / currentPlayer: ",
      e,
      " / cardPlayed: ",
      n,
      " / protectedPlayers: ",
      r,
      " / hasNoTargets: ",
      g
    ),
    u.jsx("div", {
      className: "modal",
      children: u.jsxs("div", {
        className: "modal-content",
        children: [
          u.jsx("h3", { children: "Select a target for your card" }),
          g &&
            !f &&
            u.jsx("p", {
              style: {
                color: "#888",
                fontStyle: "italic",
                marginBottom: "10px",
              },
              children:
                "🫖 All other players are enjoying tea with the Princess' Handmaid and cannot be targeted.",
            }),
          f &&
            d.length === 0 &&
            u.jsx("p", {
              style: {
                color: "#D4AF37",
                fontStyle: "italic",
                marginBottom: "10px",
              },
              children:
                "👑 All other players are protected, but as royalty, you may always command yourself!",
            }),
          p &&
            u.jsx("p", {
              style: {
                color: "#8A2BE2",
                fontStyle: "italic",
                marginBottom: "10px",
              },
              children:
                "👻 The Phantom King may choose to trade hands with someone... or remain in the shadows.",
            }),
          u.jsx("div", {
            className: "dropdown-section-label",
            children: "Select a target for your card",
          }),
          u.jsxs("select", {
            className: "royal-select",
            value: o,
            onChange: (E) => l(E.target.value),
            children: [
              u.jsx("option", { value: "", children: "-- Choose a player --" }),
              p &&
                u.jsx("option", {
                  value: "Nobody",
                  children: "👻 Nobody (skip effect)",
                }),
              d.map(([E, y]) =>
                u.jsxs(
                  "option",
                  { value: E, children: [y.name, " (", y.realName, ")"] },
                  E
                )
              ),
              f &&
                u.jsxs("option", {
                  value: e,
                  children: [
                    "👑 Yourself (",
                    ((w = t[e]) == null ? void 0 : w.name) || e,
                    ")",
                  ],
                }),
              g &&
                !f &&
                u.jsx("option", {
                  value: "SKIP_TURN",
                  children: "Skip turn (no available targets)",
                }),
            ],
          }),
          h &&
            u.jsxs(u.Fragment, {
              children: [
                u.jsx("div", {
                  className: "dropdown-section-label",
                  children: "Guess a strength (≠ 1)",
                }),
                u.jsx("select", {
                  className: "royal-select",
                  value: a,
                  onChange: (E) => c(Number(E.target.value)),
                  children: [0, 2, 3, 4, 5, 6, 7, 8, 9].map((E) =>
                    u.jsx("option", { value: E, children: E }, E)
                  ),
                }),
              ],
            }),
          u.jsxs("div", {
            style: { marginTop: "1rem" },
            children: [
              u.jsx("button", {
                onClick: () => s({ target: o, guess: a }),
                disabled: !o,
                children: "Confirm",
              }),
              u.jsx("button", {
                onClick: i,
                style: { marginLeft: "1rem" },
                children: "Cancel",
              }),
            ],
          }),
        ],
      }),
    })
  );
}
const v1 = (t) =>
  ({
    Guard: "guard1.jpeg",
    Priest: "priest1.jpeg",
    Baron: "baron1.jpeg",
    Handmaid: "handmaid1.jpeg",
    Prince: "prince1.jpeg",
    "Phantom King": "countess1.jpeg",
    Countess: "countess1.jpeg",
    Princess: "princess-portrait1.jpeg",
    Jester: "countess1.jpeg",
    Inquisitor: "countess1.jpeg",
    Chamberlain: "countess1.jpeg",
    "Regent Queen": "countess1.jpeg",
    "Court Whisperer": "countess1.jpeg",
    "Royal Confessor": "countess1.jpeg",
    Assassin: "countess1.jpeg",
    Baroness: "countess1.jpeg",
    Duke: "countess1.jpeg",
  }[t] || "countess1.jpeg");
function Mf({ resultText: t, cardDetails: e = null, onClose: n }) {
  console.log("EffectResultModal has been called! / resultText: ", t);
  const r = (l) =>
      l
        ? l
            .split(
              `
`
            )
            .map((a, c) => {
              let d = a.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
              return (
                (d = d.replace(/\*(.*?)\*/g, "<em>$1</em>")),
                u.jsxs(
                  Hc.Fragment,
                  {
                    children: [
                      u.jsx("span", { dangerouslySetInnerHTML: { __html: d } }),
                      c <
                        l.split(`
`).length -
                          1 && u.jsx("br", {}),
                    ],
                  },
                  c
                )
              );
            })
        : "",
    s =
      (t == null ? void 0 : t.includes("tea and biscuits")) ||
      (t == null ? void 0 : t.includes("protected from courtly intrigue")),
    i =
      e &&
      ((t == null ? void 0 : t.includes("divine light reveals")) ||
        e["Revealed Card"] ||
        e["Target Player"]);
  let o = null;
  if (i && e) {
    const l = e["Revealed Card"],
      a = e["Card Effect"];
    if (l) {
      const c = l.match(/^(.+?)\s*\(Strength\s*(\d+)\)$/);
      c &&
        (o = {
          name: c[1].trim(),
          strength: parseInt(c[2]),
          effect: a || "No effect description available",
        });
    }
  }
  return u.jsx("div", {
    className: "modal",
    style: _1,
    children: u.jsxs("div", {
      className: "modal-content",
      style: { ...w1, ...(s ? C1 : {}), ...(i ? I1 : {}) },
      children: [
        u.jsx("div", {
          style: {
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: i
              ? "#6a4c93"
              : s
              ? "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)"
              : "#8b0000",
            border: `3px solid ${i ? "#9b59b6" : s ? "#8bc34a" : "#ffd700"}`,
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.6)",
            zIndex: 1001,
          },
          children: i ? "🔍" : s ? "🛡️" : "📜",
        }),
        u.jsx("h3", {
          style: E1(s, i),
          children: i
            ? "Priest's Divine Revelation"
            : s
            ? "Protected by the Handmaid"
            : "Effect Result",
        }),
        i && o
          ? u.jsxs("div", {
              style: O1,
              children: [
                u.jsxs("div", {
                  style: b1,
                  children: [
                    u.jsxs("div", {
                      style: A1,
                      children: [
                        u.jsx("div", { style: j1, children: o.strength }),
                        u.jsx("div", {
                          style: {
                            ...M1,
                            backgroundImage: `url('/src/img/${v1(o.name)}')`,
                          },
                        }),
                        u.jsxs("div", {
                          style: D1,
                          children: [
                            u.jsx("div", { style: L1, children: o.name }),
                            u.jsx("div", { style: $1, children: o.effect }),
                          ],
                        }),
                      ],
                    }),
                    u.jsxs("div", {
                      style: F1,
                      children: ["🎯 ", e["Target Player"], "'s Card"],
                    }),
                  ],
                }),
                u.jsxs("div", {
                  style: U1,
                  children: [
                    u.jsx("div", { style: B1, children: "👁️‍🗨️" }),
                    u.jsx("div", { style: z1, children: r(t) }),
                  ],
                }),
              ],
            })
          : u.jsxs(u.Fragment, {
              children: [
                u.jsx("div", { style: S1, children: r(t) }),
                e &&
                  !i &&
                  u.jsx("div", {
                    style: x1,
                    children: Object.entries(e).map(([l, a]) =>
                      u.jsxs(
                        "div",
                        {
                          style: N1,
                          children: [
                            u.jsxs("strong", { children: [l, ":"] }),
                            " ",
                            a,
                          ],
                        },
                        l
                      )
                    ),
                  }),
              ],
            }),
        u.jsx("div", {
          style: { ...T1, ...(s ? R1 : {}) },
          children: u.jsx("button", {
            onClick: n,
            style: { ...k1, ...(s ? P1 : {}) },
            onMouseEnter: (l) => {
              s
                ? ((l.target.style.background =
                    "linear-gradient(135deg, rgb(46, 125, 50) 0%, rgb(76, 175, 80) 100%)"),
                  (l.target.style.transform = "translateY(-2px)"),
                  (l.target.style.boxShadow =
                    "0 6px 25px rgba(76, 175, 80, 0.5)"))
                : ((l.target.style.background =
                    "linear-gradient(135deg, #fff 0%, #ffd700 100%)"),
                  (l.target.style.transform = "translateY(-2px)"),
                  (l.target.style.boxShadow =
                    "0 6px 25px rgba(255, 215, 0, 0.5)"));
            },
            onMouseLeave: (l) => {
              s
                ? ((l.target.style.background =
                    "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)"),
                  (l.target.style.transform = "translateY(0)"),
                  (l.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)"))
                : ((l.target.style.background =
                    "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)"),
                  (l.target.style.transform = "translateY(0)"),
                  (l.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.4)"));
            },
            children: s ? "🍰✨ Very Well ✨🫖" : "Continue",
          }),
        }),
      ],
    }),
  });
}
const _1 = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px) brightness(0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1e3,
    animation: "effectModalFadeIn 0.3s ease-out",
  },
  w1 = {
    background:
      "linear-gradient(135deg, #2d1b1b 0%, #4a0000 50%, #8b0000 100%)",
    padding: "0",
    borderRadius: "20px",
    boxShadow:
      "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 215, 0, 0.3)",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
    border: "4px solid #ffd700",
    position: "relative",
    fontFamily: '"Cinzel", serif',
    animation:
      "effectModalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  C1 = {
    background: "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)",
    border: "4px solid #8bc34a",
    boxShadow:
      "0 25px 70px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(139, 195, 74, 0.4), inset 0 1px 0 rgba(139, 195, 74, 0.3)",
  },
  E1 = (t, e) => ({
    background: e
      ? "linear-gradient(135deg, #4a0028 0%, #6a4c93 100%)"
      : t
      ? "linear-gradient(135deg, rgb(15 44 15) 0%, rgb(46, 125, 50) 100%);"
      : "linear-gradient(135deg, #8b0000 0%, #a52a2a 100%)",
    color: "#ffd700",
    margin: "0",
    padding: "35px 25px 15px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    fontFamily: '"Cinzel", serif',
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    borderBottom: `2px solid ${
      e ? "#9b59b6" : t ? "rgb(139, 195, 74)" : "#ffd700"
    }`,
    borderRadius: "20px 20px 0 0",
    position: "relative",
  }),
  S1 = {
    fontSize: "1.2rem",
    textAlign: "justify",
    lineHeight: "1.6",
    color: "white",
    margin: "0",
    padding: "25px",
    background:
      "linear-gradient(135deg, rgb(45, 27, 27) 0%, rgb(74, 0, 0) 100%)",
    fontFamily: '"Lora", serif',
  },
  x1 = {
    margin: "0",
    padding: "20px 25px",
    background: "linear-gradient(135deg, #f0ead6 0%, #e8dcc0 100%)",
    textAlign: "left",
    borderTop: "2px solid #d4af37",
    borderBottom: "2px solid #d4af37",
    fontFamily: '"Lora", serif',
  },
  N1 = { marginBottom: "0.5rem", color: "#2c1810", fontSize: "1rem" },
  T1 = {
    padding: "15px 25px 20px",
    background: "linear-gradient(135deg, #2d1b1b 0%, #4a0000 100%)",
    borderRadius: "0 0 20px 20px",
  },
  k1 = {
    padding: "12px 24px",
    fontSize: "1.2rem",
    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
    color: "#8b0000",
    border: "2px solid #8b4513",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: '"Cinzel", serif',
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
    minWidth: "140px",
    width: "55%",
  },
  R1 = {
    background:
      "linear-gradient(135deg, rgb(26, 77, 26) 0%, rgb(46, 125, 50) 50%, rgb(76, 175, 80) 100%)",
  },
  P1 = {
    width: "70%",
    background: "linear-gradient(135deg, rgb(13, 44, 6) 0%, rgb(0, 0, 0) 100%)",
    color: "rgb(255, 215, 0)",
    border: "2px solid #8bc34a",
  },
  I1 = {
    width: "90%",
    maxWidth: "800px",
    background:
      "linear-gradient(135deg, #1a0811 0%, #2d1320 30%, #4a0028 70%, #2d1b1b 100%)",
    border: "4px solid #9b59b6",
    boxShadow:
      "0 20px 60px rgba(0, 0, 0, 0.9), 0 8px 25px rgba(155, 89, 182, 0.4)",
  },
  O1 = {
    display: "flex",
    gap: "30px",
    alignItems: "flex-start",
    marginTop: "20px",
  },
  b1 = {
    flex: "0 0 300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  A1 = {
    position: "relative",
    backgroundColor: "#2d1b1b",
    border: "3px solid #ffd700",
    borderRadius: "15px",
    padding: "20px",
    width: "250px",
    height: "350px",
    display: "flex",
    flexDirection: "column",
    cursor: "default",
    boxShadow:
      "0 15px 35px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(255, 215, 0, 0.4)",
    background:
      "linear-gradient(135deg, #2d1b1b 0%, #4a0000 50%, #8b0000 100%)",
    transition: "all 0.3s ease",
    transform: "perspective(1000px) rotateY(-3deg) rotateX(2deg)",
  },
  j1 = {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "#ffd700",
    color: "#8b0000",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    fontFamily: '"Cinzel", serif',
    border: "2px solid #8b0000",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
    zIndex: 10,
  },
  M1 = {
    width: "100%",
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "10px",
    margin: "15px 0",
    border: "2px solid rgba(255, 215, 0, 0.3)",
    boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.4)",
  },
  D1 = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
  },
  L1 = {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#ffd700",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    fontFamily: '"Cinzel", serif',
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  $1 = {
    fontSize: "0.95rem",
    color: "#e6d7b0",
    fontStyle: "italic",
    lineHeight: "1.4",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
    fontFamily: '"Lora", serif',
  },
  F1 = {
    marginTop: "15px",
    fontSize: "1.1rem",
    color: "#9b59b6",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    fontFamily: '"Cinzel", serif',
    textAlign: "center",
  },
  U1 = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "15px",
    padding: "30px",
    border: "2px solid rgba(155, 89, 182, 0.3)",
  },
  B1 = {
    fontSize: "4rem",
    marginBottom: "20px",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))",
    animation: "priestGlow 2s ease-in-out infinite alternate",
  },
  z1 = {
    fontSize: "1.2rem",
    color: "#e6d7b0",
    lineHeight: "1.6",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    fontFamily: '"Lora", serif',
  },
  H1 = `
@keyframes priestGlow {
  0% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 10px rgba(155, 89, 182, 0.3));
  }
  100% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 20px rgba(155, 89, 182, 0.6));
  }
}
`;
if (typeof document < "u") {
  const t = document.createElement("style");
  (t.textContent = H1), document.head.appendChild(t);
}
function W1({ promptData: t, onReveal: e, onIgnore: n, onAcknowledge: r }) {
  const { attacker: s, guessedStrength: i, targetCard: o } = t,
    l = (o == null ? void 0 : o.id) === 14,
    a = t == null ? void 0 : t.isCorrectGuess;
  let c = "🛡️ You've been targeted!",
    d = "",
    h = null;
  return (
    !l && !a
      ? ((d = `${s} played a Guard and guessed strength ${i}, but you're holding ${o.name} (Strength ${o.strength}). You're safe... for now.`),
        (h = u.jsx("button", {
          className: "assassin-modal-btn assassin-modal-btn-acknowledge",
          onClick: r,
          children: "Continue",
        })))
      : !l && a
      ? ((d = `${s} played a Guard and guessed your strength (${i}) correctly! You've been ELIMINATED.`),
        (h = u.jsx("button", {
          className: "assassin-modal-btn assassin-modal-btn-fate",
          onClick: r,
          children: "Face your fate",
        })))
      : l && a
      ? ((d = `🗡️ ${s} guessed your card exactly! But little did they know... you hold the Assassin! Time to stab them back!`),
        (h = u.jsx("button", {
          className: "assassin-modal-btn assassin-modal-btn-strike",
          onClick: e,
          children: "⚔️ Strike with Assassin",
        })))
      : l &&
        !a &&
        ((d = `${s} guessed strength ${i}, but you hold ${o.name} (Strength ${o.strength}). Reveal the Assassin anyway and smite them?`),
        (h = u.jsxs("div", {
          className: "assassin-modal-btn-group",
          children: [
            u.jsx("button", {
              className: "assassin-modal-btn assassin-modal-btn-strike",
              onClick: e,
              children: "⚔️ Reveal & Smite",
            }),
            u.jsx("button", {
              className: "assassin-modal-btn assassin-modal-btn-mercy",
              onClick: n,
              children: "🕊️ Let them live",
            }),
          ],
        }))),
    u.jsx("div", {
      className: "assassin-modal-overlay",
      children: u.jsxs("div", {
        className: "assassin-modal-content",
        children: [
          u.jsx("div", {
            className: "assassin-modal-header",
            children: u.jsx("h3", {
              className: "assassin-modal-title",
              children: c,
            }),
          }),
          u.jsx("div", {
            className: "assassin-modal-body",
            children: u.jsx("p", {
              className: "assassin-modal-message",
              children: d,
            }),
          }),
          u.jsx("div", { className: "assassin-modal-footer", children: h }),
        ],
      }),
    })
  );
}
function G1({ attacker: t, targetCard: e }) {
  return u.jsx("div", {
    className: "modal",
    children: u.jsxs("div", {
      className: "modal-content",
      children: [
        u.jsx("h3", { children: "🔮 Holy Revelation! 📿" }),
        u.jsxs("p", {
          children: [
            u.jsx("strong", { children: t }),
            " has played the Priest card and is peering into your soul!",
          ],
        }),
        u.jsxs("p", {
          children: [
            "🙈⚡ Your ",
            u.jsx("strong", {
              children: (e == null ? void 0 : e.name) || "card",
            }),
            " (Strength ",
            (e == null ? void 0 : e.strength) || "?",
            ") is being revealed to them through divine magic!",
          ],
        }),
        u.jsx("p", {
          style: { fontStyle: "italic", color: "#666", marginTop: "1rem" },
          children:
            "📜 Fear not, noble one - this mystical peek has no other effect upon thee... 🏰",
        }),
      ],
    }),
  });
}
const Df = ({
  isOpen: t,
  onConfirm: e,
  userRole: n,
  attackerName: r,
  targetName: s,
  attackerCard: i,
  targetCard: o,
  eliminatedPlayer: l,
  isTie: a,
}) => {
  if (!t) return null;
  const d = l === (n === "attacker" ? r : s);
  return u.jsx("div", {
    className: "baron-modal-background",
    children: u.jsx("div", {
      className: "baron-modal-overlay",
      children: u.jsxs("div", {
        className: "baron-modal-content",
        children: [
          u.jsx("div", {
            className: "baron-modal-header",
            children: u.jsx("h2", {
              className: "baron-modal-title",
              children: "⚔️ Baron's Duel ⚔️",
            }),
          }),
          u.jsxs("div", {
            className: "baron-arena",
            children: [
              u.jsxs("div", {
                className: "baron-combat-arena",
                children: [
                  u.jsxs("div", {
                    className: "baron-knight",
                    children: [
                      u.jsxs("div", {
                        className: "baron-knight-name",
                        children: ["🏰 ", r],
                      }),
                      u.jsxs("div", {
                        className: "baron-duel-card",
                        children: [
                          u.jsx("div", {
                            className: "baron-card-name",
                            children: i.name,
                          }),
                          u.jsxs("div", {
                            className: "baron-card-strength",
                            children: ["Strength: ", i.strength],
                          }),
                          i.effect &&
                            u.jsxs("div", {
                              className: "baron-card-effect",
                              children: ['"', i.effect, '"'],
                            }),
                        ],
                      }),
                    ],
                  }),
                  u.jsx("div", {
                    className: "baron-vs-section",
                    children: u.jsx("div", {
                      className: "baron-crossed-swords",
                      children: "⚔️",
                    }),
                  }),
                  u.jsxs("div", {
                    className: "baron-knight",
                    children: [
                      u.jsxs("div", {
                        className: "baron-knight-name",
                        children: ["🏰 ", s],
                      }),
                      u.jsxs("div", {
                        className: "baron-duel-card",
                        children: [
                          u.jsx("div", {
                            className: "baron-card-name",
                            children: o.name,
                          }),
                          u.jsxs("div", {
                            className: "baron-card-strength",
                            children: ["Strength: ", o.strength],
                          }),
                          o.effect &&
                            u.jsxs("div", {
                              className: "baron-card-effect",
                              children: ['"', o.effect, '"'],
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              u.jsx("div", {
                className: `baron-result-section ${
                  a
                    ? "baron-result-tie"
                    : d
                    ? "baron-result-defeat"
                    : "baron-result-victory"
                }`,
                children: a
                  ? u.jsxs(u.Fragment, {
                      children: [
                        u.jsx("span", {
                          className: "baron-result-icon",
                          children: "🤝",
                        }),
                        u.jsxs("div", {
                          className: "baron-result-message",
                          children: [
                            u.jsx("div", {
                              className: "baron-result-title",
                              style: { color: "#87ceeb" },
                              children: "Honorable Draw!",
                            }),
                            u.jsx("div", {
                              className: "baron-result-subtitle",
                              style: { color: "#b0c4de" },
                              children:
                                "Both knights live to fight another day",
                            }),
                          ],
                        }),
                        u.jsx("span", {
                          className: "baron-result-icon",
                          children: "🤝",
                        }),
                      ],
                    })
                  : u.jsxs(u.Fragment, {
                      children: [
                        u.jsx("span", {
                          className: "baron-result-icon",
                          children: d ? "💀" : "🏆",
                        }),
                        u.jsxs("div", {
                          className: "baron-result-message",
                          children: [
                            u.jsx("div", {
                              className: "baron-result-title",
                              style: { color: d ? "#ff6b6b" : "#90ee90" },
                              children: l === r ? `${s} Wins!` : `${r} Wins!`,
                            }),
                            u.jsxs("div", {
                              className: "baron-result-subtitle",
                              style: { color: d ? "#ffcccb" : "#b8ffb8" },
                              children: [l, " is eliminated from the round"],
                            }),
                          ],
                        }),
                        u.jsx("span", {
                          className: "baron-result-icon",
                          children: d ? "💀" : "🏆",
                        }),
                      ],
                    }),
              }),
            ],
          }),
          u.jsxs("div", {
            className: "baron-action-section",
            children: [
              n === "attacker" &&
                u.jsx("button", {
                  onClick: e,
                  className: "baron-continue-button",
                  children: "Continue",
                }),
              n === "target" &&
                u.jsxs("div", {
                  className: "baron-waiting-text",
                  children: ["⏳ Awaiting ", r, "'s command to continue..."],
                }),
            ],
          }),
        ],
      }),
    }),
  });
};
function V1({ roundResult: t, players: e, onContinue: n }) {
  var o, l;
  const [r, s] = N.useState(5);
  N.useEffect(() => {
    const a = setInterval(() => {
      s((c) => (c <= 1 ? (clearInterval(a), n(), 0) : c - 1));
    }, 5e3);
    return () => clearInterval(a);
  }, [n]);
  const i = () => {
    n();
  };
  if (t.type === "lastPlayerStanding") {
    const a = t.winner,
      c = e[a],
      d = (o = c == null ? void 0 : c.hand) == null ? void 0 : o[0],
      h = Object.keys(e).filter((f) => e[f].isOut);
    return u.jsx("div", {
      className: "modal-overlay",
      children: u.jsxs("div", {
        className: "modal-content round-end-modal",
        children: [
          u.jsx("div", {
            className: "modal-header",
            children: u.jsx("h2", {
              children: "🏆 Victory in the Royal Court! 🏆",
            }),
          }),
          u.jsx("div", {
            className: "modal-body",
            children: u.jsxs("div", {
              className: "victory-announcement",
              children: [
                u.jsxs("p", {
                  className: "victory-text",
                  children: [
                    "⚔️",
                    " ",
                    u.jsx("strong", {
                      children:
                        "The battle for the Princess's heart has concluded!",
                    }),
                    " ",
                    "⚔️",
                  ],
                }),
                u.jsxs("div", {
                  className: "winner-showcase",
                  children: [
                    u.jsx("h3", { children: "👑 Last Noble Standing 👑" }),
                    u.jsxs("div", {
                      className: "winner-card",
                      children: [
                        u.jsxs("p", {
                          className: "winner-name",
                          children: [
                            u.jsx("strong", {
                              children: (c == null ? void 0 : c.realName) || a,
                            }),
                            u.jsxs("span", {
                              className: "nickname",
                              children: [
                                "(",
                                (c == null ? void 0 : c.name) || a,
                                ")",
                              ],
                            }),
                          ],
                        }),
                        u.jsxs("p", {
                          className: "winner-hand",
                          children: [
                            "Holding:",
                            " ",
                            u.jsx("strong", {
                              children:
                                (d == null ? void 0 : d.name) || "Unknown Card",
                            }),
                            u.jsxs("span", {
                              className: "card-strength",
                              children: [
                                "(Strength: ",
                                (d == null ? void 0 : d.strength) || "?",
                                ")",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                h.length > 0 &&
                  u.jsxs("div", {
                    className: "eliminated-section",
                    children: [
                      u.jsx("h4", { children: "⚰️ Fallen in Battle ⚰️" }),
                      u.jsx("div", {
                        className: "eliminated-list",
                        children: h.map((f) => {
                          var p;
                          return u.jsx(
                            "span",
                            {
                              className: "eliminated-player",
                              children:
                                ((p = e[f]) == null ? void 0 : p.realName) || f,
                            },
                            f
                          );
                        }),
                      }),
                    ],
                  }),
                u.jsxs("p", {
                  className: "flavor-text",
                  children: [
                    "🌹 With cunning and fortune,",
                    " ",
                    u.jsx("strong", {
                      children: (c == null ? void 0 : c.realName) || a,
                    }),
                    " emerges victorious! Their love letter shall reach the Princess, earning them a precious Love Token! 💕",
                  ],
                }),
              ],
            }),
          }),
          u.jsxs("div", {
            className: "modal-footer",
            children: [
              u.jsx("button", {
                className: "btn btn-primary continue-btn",
                onClick: i,
                children: "⚡ View Round Scoring Board ⚡",
              }),
              u.jsxs("p", {
                className: "auto-redirect-text",
                children: [
                  "Auto-redirecting in ",
                  r,
                  " second",
                  r !== 1 ? "s" : "",
                  "...",
                ],
              }),
            ],
          }),
        ],
      }),
    });
  }
  if (t.type === "deckEmpty") {
    const a = t.winners || [],
      c = t.finalStandings || [];
    return u.jsx("div", {
      className: "modal-overlay",
      children: u.jsxs("div", {
        className: "modal-content round-end-modal",
        children: [
          u.jsx("div", {
            className: "modal-header",
            children: u.jsx("h2", {
              children: "⚔️ The Grand Battle of Hearts! ⚔️",
            }),
          }),
          u.jsx("div", {
            className: "modal-body",
            children: u.jsxs("div", {
              className: "victory-announcement",
              children: [
                u.jsxs("p", {
                  className: "victory-text",
                  children: [
                    "📜",
                    " ",
                    u.jsx("strong", {
                      children:
                        "The last turn has been played and the deck lies empty!",
                    }),
                    " ",
                    "📜",
                  ],
                }),
                u.jsx("p", {
                  className: "battle-intro",
                  children:
                    "🏰 Now comes the grand battle among the Princess's suitors! Whose love letter bears the strongest seal? 💌",
                }),
                u.jsxs("div", {
                  className: "strength-battle",
                  children: [
                    u.jsx("h3", { children: "🗡️ Final Standings 🗡️" }),
                    u.jsx("div", {
                      className: "players-showcase",
                      children: c.map((d, h) => {
                        var w;
                        const f = e[d.player],
                          p = (w = d.hand) == null ? void 0 : w[0],
                          g = a.includes(d.player);
                        return u.jsxs(
                          "div",
                          {
                            className: `player-standing ${g ? "winner" : ""}`,
                            children: [
                              u.jsx("div", {
                                className: "standing-rank",
                                children: g ? "👑" : `#${h + 1}`,
                              }),
                              u.jsxs("div", {
                                className: "player-info",
                                children: [
                                  u.jsx("strong", {
                                    children:
                                      (f == null ? void 0 : f.realName) ||
                                      d.player,
                                  }),
                                  u.jsx("br", {}),
                                  u.jsxs("span", {
                                    className: "nickname",
                                    children: [
                                      "(",
                                      (f == null ? void 0 : f.name) || d.player,
                                      ")",
                                    ],
                                  }),
                                ],
                              }),
                              u.jsxs("div", {
                                className: "card-info",
                                children: [
                                  u.jsx("div", {
                                    className: "card-name",
                                    children:
                                      (p == null ? void 0 : p.name) ||
                                      "Unknown",
                                  }),
                                  u.jsxs("div", {
                                    className: "card-strength",
                                    children: ["Strength: ", d.strength],
                                  }),
                                ],
                              }),
                            ],
                          },
                          d.player
                        );
                      }),
                    }),
                  ],
                }),
                u.jsx("div", {
                  className: "winner-announcement",
                  children:
                    a.length === 1
                      ? u.jsxs("p", {
                          className: "flavor-text",
                          children: [
                            "🌹",
                            " ",
                            u.jsx("strong", {
                              children:
                                ((l = e[a[0]]) == null ? void 0 : l.realName) ||
                                a[0],
                            }),
                            " ",
                            "triumphs! Their letter bears the mightiest seal and wins the Princess's favor! 💕",
                          ],
                        })
                      : u.jsxs("p", {
                          className: "flavor-text",
                          children: [
                            "⚖️ A noble tie!",
                            " ",
                            u.jsx("strong", {
                              children: a
                                .map((d) => {
                                  var h;
                                  return (
                                    ((h = e[d]) == null
                                      ? void 0
                                      : h.realName) || d
                                  );
                                })
                                .join(" and "),
                            }),
                            "share equal strength! Both earn the Princess's admiration! 💕",
                          ],
                        }),
                }),
              ],
            }),
          }),
          u.jsxs("div", {
            className: "modal-footer",
            children: [
              u.jsx("button", {
                className: "btn btn-primary continue-btn",
                onClick: i,
                children: "⚡ View Round Scoring Board ⚡",
              }),
              u.jsxs("p", {
                className: "auto-redirect-text",
                children: [
                  "Auto-redirecting in ",
                  r,
                  " second",
                  r !== 1 ? "s" : "",
                  "...",
                ],
              }),
            ],
          }),
        ],
      }),
    });
  }
  return null;
}
async function vd(t) {
  var e, n;
  try {
    const r = L($, `rooms/${t}`),
      s = await ht(r);
    if (!s.exists()) return { isRoundEnd: !1, error: "Room not found" };
    const i = s.val(),
      { players: o, round: l } = i;
    if (!o || !l) return { isRoundEnd: !1 };
    const a = Object.keys(o).filter((d) => !o[d].isOut),
      c = Object.keys(o).filter((d) => o[d].isOut);
    if (a.length === 1)
      return (
        console.log("🏆 ROUND END DETECTED: Last player standing!", {
          winner: a[0],
          type: "lastPlayerStanding",
        }),
        {
          isRoundEnd: !0,
          type: "lastPlayerStanding",
          winner: a[0],
          winnerName: ((e = o[a[0]]) == null ? void 0 : e.name) || a[0],
          activePlayers: a,
          eliminatedPlayers: c,
        }
      );
    if (!l.deck || l.deck.length === 0) {
      console.log(
        "🏆 ROUND END DETECTED: Deck empty - checking strength comparison",
        {
          activePlayers: a,
          type: "deckEmpty",
          deckExists: !!l.deck,
          deckLength: ((n = l.deck) == null ? void 0 : n.length) || 0,
        }
      );
      const d = a.map((p) => {
        const g = o[p].hand,
          w = g && g.length > 0 ? g[0] : null;
        return {
          player: p,
          hand: g || [],
          strength: (w == null ? void 0 : w.strength) || 0,
        };
      });
      d.sort((p, g) => g.strength - p.strength);
      const h = d[0].strength,
        f = d.filter((p) => p.strength === h);
      return (
        console.log("🏆 STRENGTH COMPARISON RESULTS:", {
          playerStrengths: d,
          highestStrength: h,
          winners: f.map((p) => p.player),
        }),
        {
          isRoundEnd: !0,
          type: "deckEmpty",
          winners: f.map((p) => p.player),
          winnerNames: f.map((p) => {
            var g;
            return ((g = o[p.player]) == null ? void 0 : g.name) || p.player;
          }),
          finalStandings: d,
        }
      );
    }
    return { isRoundEnd: !1, activePlayers: a, eliminatedPlayers: c };
  } catch (r) {
    return (
      console.error("🚨 Error checking round end conditions:", r),
      { isRoundEnd: !1 }
    );
  }
}
async function Hy(t) {
  var e, n, r, s, i;
  try {
    const o = await vd(t);
    if (!o.isRoundEnd)
      return { success: !1, message: "Round has not ended yet" };
    console.log("🎯 TRIGGERING ROUND END:", o);
    const l = L($, `rooms/${t}`),
      c = (await ht(l)).val(),
      d = {};
    if (o.type === "lastPlayerStanding") {
      const f = ((e = c.players[o.winner]) == null ? void 0 : e.tokens) || 0;
      d[`players/${o.winner}/tokens`] = f + 1;
    } else
      o.type === "deckEmpty" &&
        o.winners.forEach((f) => {
          var g;
          const p = ((g = c.players[f]) == null ? void 0 : g.tokens) || 0;
          d[`players/${f}/tokens`] = p + 1;
        });
    const h = {
      roundNumber: ((n = c.gameStats) == null ? void 0 : n.currentRound) || 1,
      type: o.type,
      winner: o.winner || ((r = o.winners) == null ? void 0 : r[0]),
      winners: o.winners || [o.winner],
      winnerNames: o.winnerNames || [o.winnerName],
      hiddenCard: ((s = c.round) == null ? void 0 : s.hiddenCard) || null,
      finalStandings: o.finalStandings || [],
      timestamp: Date.now(),
    };
    return (
      (d.gameState = "roundScoring"),
      (d.roundResult = h),
      (d["gameStats/lastRoundWinner"] = h.winner),
      (d["gameStats/totalRoundsPlayed"] =
        (((i = c.gameStats) == null ? void 0 : i.totalRoundsPlayed) || 0) + 1),
      await X(l, d),
      console.log("✅ ROUND END TRIGGERED SUCCESSFULLY:", {
        updates: d,
        roundResult: h,
      }),
      { success: !0, roundResult: h }
    );
  } catch (o) {
    return (
      console.error("🚨 Error triggering round end:", o),
      { success: !1, error: o.message }
    );
  }
}
async function Wy(t, e) {
  console.log(`🔍 ROUND END CHECK: ${t}`, { roomCode: e });
  const n = await vd(e);
  if ((console.log(`🔍 ROUND END RESULT: ${t}`, n), n.isRoundEnd)) {
    console.log(`🎯 ROUND END DETECTED - TRIGGERING: ${t}`);
    const r = await Hy(e);
    console.log(`🎯 ROUND END TRIGGER RESULT: ${t}`, r);
  }
  return n;
}
const Y1 = {
  1: { advanceOnAttacker: !0, advanceOnTarget: !1 },
  2: { advanceOnAttacker: !0, advanceOnTarget: !1 },
  3: { advanceOnAttacker: !0, advanceOnTarget: !1 },
  4: { advanceOnAttacker: !0, advanceOnTarget: !1 },
  5: { advanceOnAttacker: !1, advanceOnTarget: !0 },
  6: { advanceOnAttacker: !0, advanceOnTarget: !1 },
  7: { advanceOnAttacker: !0, advanceOnTarget: !1 },
  8: { advanceOnAttacker: !0, advanceOnTarget: !1 },
};
function K1(t, e) {
  const n = Y1[t];
  return n
    ? (console.log(
        "shouldAdvanceTurnOnModal / isAttacker: ",
        e,
        " / function returns: ",
        e ? n.advanceOnAttacker : n.advanceOnTarget
      ),
      e ? n.advanceOnAttacker : n.advanceOnTarget)
    : e;
}
async function Lf({ roomCode: t, attacker: e, target: n, guess: r }) {
  if (r === 1)
    return {
      requiresPrompt: !1,
      target: n,
      attacker: e,
      hasAssassin: !1,
      guessedStrength: r,
      actualStrength: null,
      isCorrectGuess: !1,
      targetCard: null,
      result: "wrongGuess",
      eliminatedPlayer: null,
      error: "Cannot guess Guard (strength 1)",
    };
  const i = (await ht(L($, `rooms/${t}`))).val(),
    l = i.players[n].hand[0];
  i.mode;
  const a = l.id === 14,
    c = l.strength === r;
  return {
    requiresPrompt: !0,
    target: n,
    attacker: e,
    hasAssassin: a,
    guessedStrength: r,
    actualStrength: l.strength,
    isCorrectGuess: c,
    targetCard: l,
    result: c ? "correctGuess" : "wrongGuess",
    eliminatedPlayer: c ? n : null,
  };
}
async function Q1({ roomCode: t, attacker: e, target: n }) {
  const s = (await ht(L($, `rooms/${t}`))).val(),
    i = s.round.deck || [],
    o = i.length > 0 ? i[0] : null,
    l = i.slice(1),
    a = {
      [`players/${e}/isOut`]: !0,
      [`players/${n}/discard`]: [...(s.players[n].discard || []), 0],
      [`players/${n}/hand`]: o ? [o] : [],
      round: { ...s.round, deck: l },
    };
  return (
    await X(L($, `rooms/${t}`), a),
    Wy("After Assassin Defense", t),
    { attackerEliminated: !0, newCard: o }
  );
}
async function $f({ roomCode: t, attacker: e, target: n }) {
  var c, d;
  const s = (await ht(L($, `rooms/${t}`))).val();
  if (!s || !s.players || !s.players[n])
    return { result: "error", message: "Target player not found" };
  const i = s.players[n];
  if (!i || !i.hand || i.hand.length === 0)
    return { result: "error", message: "Target has no cards" };
  const o = i.hand[0];
  if (!o) return { result: "error", message: "Target has no cards" };
  const l = vi.find((h) => h.id === o.id),
    a = {
      ...o,
      effect: (l == null ? void 0 : l.effect) || "Unknown card effect",
    };
  return {
    result: "revealCard",
    attacker: e,
    target: n,
    targetCard: a,
    attackerMessage: `🔍✨ The divine light reveals ${i.name}'s secret! They hold: ${a.name} (Strength ${a.strength})`,
    targetMessage: `🙈⚡ A holy priest peers into your soul! Your ${
      a.name
    } has been revealed to ${
      ((c = s.players[e]) == null ? void 0 : c.name) || e
    }!`,
    publicMessage: `🔮📿 ${
      ((d = s.players[e]) == null ? void 0 : d.name) || e
    } plays Priest and communes with the spirits to glimpse ${
      i.name
    }'s hand! The mystic arts are at work... 🌟`,
  };
}
async function Ff({ roomCode: t, attacker: e, target: n }) {
  var f, p, g, w, E, y, m, v;
  const s = (await ht(L($, `rooms/${t}`))).val(),
    i = s.players[e].hand[0],
    o = s.players[n].hand[0],
    l = vi.find((_) => _.id === i.id) || i,
    a = vi.find((_) => _.id === o.id) || o;
  let c = null,
    d = null,
    h = null;
  return (
    i.strength > o.strength
      ? ((c = n), (d = e), (h = a))
      : o.strength > i.strength && ((c = e), (d = n), (h = l)),
    {
      requiresPrompt: !1,
      attacker: e,
      target: n,
      attackerCard: l,
      targetCard: a,
      eliminatedPlayer: c,
      winner: d,
      isTie: !c,
      result: c ? "elimination" : "tie",
      attackerMessage:
        c === n
          ? `⚔️🏆 Your Baron's duel is victorious! Your ${l.name} (${
              l.strength
            }) defeats ${
              ((f = s.players[n]) == null ? void 0 : f.name) || n
            }'s ${a.name} (${a.strength}). They are eliminated from the round!`
          : c === e
          ? `⚔️💀 Your Baron's duel ends in defeat! Your ${l.name} (${
              l.strength
            }) falls to ${
              ((p = s.players[n]) == null ? void 0 : p.name) || n
            }'s ${a.name} (${a.strength}). You are eliminated!`
          : `⚔️🤝 An honorable draw! Your ${l.name} (${l.strength}) matches ${
              ((g = s.players[n]) == null ? void 0 : g.name) || n
            }'s ${a.name} (${
              a.strength
            }). Both knights live to fight another day!`,
      targetMessage:
        c === n
          ? `⚔️💀 A Baron challenges you to a duel and emerges victorious! Their ${l.name} (${l.strength}) defeats your ${a.name} (${a.strength}). You are eliminated from the round!`
          : c === e
          ? `⚔️🏆 A Baron challenges you to a duel but you triumph! Your ${a.name} (${a.strength}) defeats their ${l.name} (${l.strength}). The challenger is eliminated!`
          : `⚔️🤝 A Baron challenges you to an honorable duel! Your ${a.name} (${a.strength}) matches their ${l.name} (${l.strength}). 'Tis a tie - both knights stand strong!`,
      publicMessage: c
        ? `⚖️💥 ${
            ((w = s.players[e]) == null ? void 0 : w.name) || e
          } plays Baron and challenges ${
            ((E = s.players[n]) == null ? void 0 : E.name) || n
          } to a duel of honor! ${h.name} (${
            h.strength
          }) falls to superior strength - ${
            ((y = s.players[c]) == null ? void 0 : y.name) || c
          } is eliminated! ⚔️👑`
        : `⚖️🤝 ${
            ((m = s.players[e]) == null ? void 0 : m.name) || e
          } plays Baron and challenges ${
            ((v = s.players[n]) == null ? void 0 : v.name) || n
          } to a duel! Both cards match in strength - an honorable draw with no casualties! 🛡️✨`,
    }
  );
}
async function q1({ roomCode: t, attacker: e, target: n }) {
  var O, A;
  const s = (await ht(L($, `rooms/${t}`))).val();
  if (!s || !s.players[n])
    return {
      requiresPrompt: !1,
      result: "error",
      error: "Invalid target player",
    };
  const i = s.players[n],
    o = i.hand[0],
    l = s.round.deck || [],
    a = e === n,
    c = [...(i.discard || []), o],
    d = o.id === 8;
  let h = [],
    f = [...l],
    p = !1,
    g = null;
  !d && f.length > 0 && ((g = f.pop()), (h = [g]), (p = !0));
  const w = {
    [`players/${n}/hand`]: h,
    [`players/${n}/discard`]: c,
    "round/deck": f,
  };
  d && (w[`players/${n}/isOut`] = !0), await X(L($, `rooms/${t}`), w);
  const E = ((O = s.players[e]) == null ? void 0 : O.name) || e,
    y = ((A = s.players[n]) == null ? void 0 : A.name) || n,
    m = o.name,
    v = (g == null ? void 0 : g.name) || "none";
  let _, C, x;
  return (
    d
      ? a
        ? ((_ = `👑💀 OH NO! ${E} commanded themselves to discard... and revealed the PRINCESS! They are eliminated from the royal court! The Princess cannot be discarded! 💀👑`),
          (C = `👑💀 ROYAL TRAGEDY! 💀👑

By your own royal decree, you commanded yourself to discard your hand...
But alas! You held the PRINCESS!

💀 The Princess cannot be discarded for any reason!
💀 You are eliminated from the round!

"Even royalty must follow the rules of love..."
- The Court`))
        : ((_ = `👑💀 ROYAL CATASTROPHE! ${E} commanded ${y} to discard their hand... revealing the PRINCESS! ${y} is eliminated! The Princess's beauty cannot be discarded! 💀👑`),
          (C = `👑💀 ROYAL CATASTROPHE! 💀👑

Your royal decree was followed...
But ${y} held the PRINCESS!

Discarded Card: ${m} (Strength: ${o.strength})

💀 The Princess cannot be discarded!
💀 ${y} is eliminated!

"Love's greatest treasure cannot be cast aside..."
- The Royal Court`),
          (x = `👑💀 ROYAL DOOM! 💀👑

${E} commanded you with the Prince's authority to discard your hand...

Your card was: ${m} (Strength: ${o.strength})

But... it was the PRINCESS! 💀

The Princess cannot be discarded for any reason!
You are eliminated from the round!

"Even under royal command, love cannot be discarded..."
- The Princess`))
      : a
      ? ((_ = `👑✨ ${E} uses the Prince's wisdom on themselves! They discard ${m} and ${
          p ? `draw ${v}` : "find no cards left in the royal deck"
        }! A fresh start from the royal court! ✨👑`),
        (C = `👑✨ ROYAL SELF-REFLECTION! ✨👑

By your own royal decree, you have renewed your hand!

Discarded: ${m} (Strength: ${o.strength})
${
  p
    ? `New Card: ${v} (Strength: ${g.strength})`
    : "No cards remain in the royal deck!"
}

"Wisdom lies in knowing when to start anew..."
- His Royal Highness, The Prince`))
      : ((_ = `👑✨ ${E} commands ${y} with the Prince's authority! ${y} discards ${m} and ${
          p ? "draws a fresh card" : "finds the royal deck empty"
        }! By royal decree! ✨👑`),
        (C = `👑✨ ROYAL DECREE EXECUTED! ✨👑

Your command has been followed!
${y} discarded: ${m} (Strength: ${o.strength})
${
  p
    ? "They drew a new card from the royal deck!"
    : "The royal deck was empty - no new card drawn!"
}

"The Prince's wisdom guides the court..."
- The Royal Court`),
        (x = `👑✨ ROYAL COMMAND! ✨👑

${E} has commanded you with the Prince's authority!

Your discarded card: ${m} (Strength: ${o.strength})
${o.effect ? `Effect: ${o.effect}` : ""}

${
  p
    ? `Your new card: ${v} (Strength: ${g.strength})
${g.effect ? `Effect: ${g.effect}` : ""}`
    : "The royal deck was empty - you draw no new card!"
}

"By royal decree, a fresh beginning awaits..."
- His Royal Highness, The Prince`)),
    {
      requiresPrompt: !1,
      result: d ? "princessEliminated" : "cardSwapped",
      attacker: e,
      target: n,
      isSelfTarget: a,
      discardedCard: o,
      newCard: p ? g : null,
      wasPrincessDiscarded: d,
      eliminatedPlayer: d ? n : null,
      publicMessage: _,
      attackerMessage: C,
      targetMessage: a ? null : x,
    }
  );
}
async function X1({ roomCode: t, player: e }) {
  var o;
  const r = (await ht(L($, `rooms/${t}`))).val(),
    s = r.protectedPlayers || [],
    i = s.includes(e) ? s : [...s, e];
  return (
    await X(L($, `rooms/${t}`), { protectedPlayers: i }),
    {
      requiresPrompt: !1,
      result: "protection",
      protectedPlayer: e,
      publicMessage: `🫖✨ ${
        ((o = r.players[e]) == null ? void 0 : o.name) || e
      } calls upon the Princess' Handmaid! She graciously invites them for tea and biscuits in her cozy chambers. They are now protected until their next turn! ☕🛡️`,
      playerMessage: `The Princess' loyal Handmaid has taken you under her wing! She invites you for tea and biscuits in her cozy chambers.

☕ Protection Status: ACTIVE ☕
⏰ Duration: Until your next turn begins
🛡️ Effect: You cannot be targeted by any cards

"Come, dear guest, let us chat by the fireplace while the others play their games. You're safe with me!"
- The Princess' Handmaid`,
    }
  );
}
async function J1({ roomCode: t, player: e }) {
  console.log("🎭 COUNTESS DEBUG: The royal matriarch takes the stage...", {
    player: e,
  });
  try {
    const n = L($, `rooms/${t}`),
      r = await ht(n);
    if (!r.exists()) throw new Error("The royal chambers have vanished...");
    const i = r.val().players[e];
    return (
      console.log("🎭 COUNTESS: Royal presence confirmed", {
        player: e,
        hand: i.hand,
      }),
      {
        result: "countess_played",
        message: "The Countess has graced the court with her presence!",
        publicMessage: `🎭✨ The Countess herself has appeared in court with ${
          i.name || e
        }! Her regal presence commands attention as she whispers secrets of court intrigue. What royal machinations are afoot? 👑💫`,
        playerMessage: `🎭✨ THE COUNTESS ✨🎭

You have played the Countess!

👑 Royal Effect: None.
🎪 Protocol: Always takes precedence over the Prince or the King, for matters related to the Princess.

"My dear, no one knows the Princess as I do. Let me handle that."
- The Countess`,
      }
    );
  } catch (n) {
    return (
      console.error("🎭 COUNTESS ERROR: Royal scandal!", n),
      { result: "error", message: "The Countess encountered a royal mishap!" }
    );
  }
}
async function Uf({ roomCode: t, attacker: e, target: n }) {
  console.log("🎭 PHANTOM KING DEBUG: The ethereal sovereign awakens...", {
    attacker: e,
    target: n,
  });
  try {
    const r = L($, `rooms/${t}`),
      s = await ht(r);
    if (!s.exists())
      throw new Error(
        "The royal chambers have vanished into the ethereal void..."
      );
    const i = s.val(),
      o = i.players[e];
    if (n === "Nobody")
      return (
        console.log("🎭 PHANTOM KING: The king chooses discretion over action"),
        {
          result: "skipped",
          message: `👻 ${e} gazed into the shadows and chose to keep their royal secrets... The Phantom King's power remains dormant.`,
          resultText: `🎭 ROYAL DISCRETION! 👑

You chose not to trade hands with anyone.

"Sometimes the greatest power is knowing when not to use it..."
- The Phantom King

*The shadows whisper of wisdom in restraint*`,
          attackerMessage: null,
          targetMessage: null,
        }
      );
    const l = i.players[n];
    if (!l || l.isOut)
      throw new Error(
        "The chosen soul has already departed from this realm..."
      );
    if (!o.hand || o.hand.length !== 1)
      throw new Error(
        "The phantom requires exactly one card remaining after playing the Phantom King..."
      );
    if (!l.hand || l.hand.length !== 1)
      throw new Error("The target must have exactly one card to exchange...");
    const a = o.hand[0],
      c = l.hand[0];
    console.log("🎭 PHANTOM KING: Weaving mystical exchange between:", {
      attackerCard: a.name,
      targetCard: c.name,
    });
    const d = [c],
      h = [a],
      f = { [`players/${e}/hand`]: d, [`players/${n}/hand`]: h };
    await X(r, f),
      console.log(
        "🎭 PHANTOM KING: The mystical exchange is complete! Cards have crossed realms"
      );
    const p = `🎭 PHANTOM KING'S MYSTICAL EXCHANGE! 👑

Your royal decree has bound fates together!

**You surrendered:**
${a.name} (Strength: ${a.strength})
*"${a.effect || "A card of mysterious power"}"*

**You received in return:**
${c.name} (Strength: ${c.strength})  
*"${c.effect || "A card of mysterious power"}"*

"Through shadow and mist, the cards have found new masters..."
- His Phantom Majesty`,
      g = `👻 SUMMONED BY THE PHANTOM KING! 🎭

The ethereal sovereign has commanded an exchange of fates!

**Taken from your grasp:**
${c.name} (Strength: ${c.strength})
*"${c.effect || "A card of mysterious power"}"*

**Bestowed upon you:**
${a.name} (Strength: ${a.strength})
*"${a.effect || "A card of mysterious power"}"*

"Your destiny intertwines with royal mystery... Accept this gift from beyond the veil."
- By Royal Phantom Decree`;
    return {
      result: "success",
      message: `👻 ${e} channeled the Phantom King's otherworldly power and exchanged destinies with ${n}! The cards have crossed between realms in a dance of shadows...`,
      resultText: p,
      attackerMessage: {
        cardName: "Phantom King",
        from: e,
        message: p,
        selectedCardIndex: 0,
        shouldAdvanceTurn: !0,
        visibleTo: e,
      },
      targetMessage: {
        cardName: "Phantom King",
        from: e,
        message: g,
        selectedCardIndex: 0,
        shouldAdvanceTurn: !1,
        visibleTo: n,
      },
    };
  } catch (r) {
    return (
      console.error(
        "🎭 PHANTOM KING ERROR: The shadows reject this exchange:",
        r
      ),
      {
        result: "error",
        message: `💀 The Phantom King's power falters... ${r.message}`,
      }
    );
  }
}
async function Z1({ roomCode: t, player: e }) {
  console.log("👑 PRINCESS DEBUG: The ultimate tragedy unfolds...", {
    player: e,
  });
  try {
    const n = L($, `rooms/${t}`),
      r = await ht(n);
    if (!r.exists()) throw new Error("The royal court has vanished...");
    const i = r.val().players[e];
    if (!i) throw new Error("The player has disappeared from court...");
    console.log("👑 PRINCESS: The ultimate sacrifice begins", {
      player: e,
      hand: i.hand,
    });
    const o = i.name || e,
      l = { [`rooms/${t}/players/${e}/isOut`]: !0 };
    await X(L($), l),
      Wy("After Princess Elimination", t),
      console.log("👑 PRINCESS: Player eliminated by royal decree", {
        player: e,
        eliminated: !0,
      });
    const a = `👑💀 ROYAL CATASTROPHE! ${o} has played the PRINCESS herself! 💀👑

💔 In a moment of desperate love, they approached the Princess directly...
💔 But the Princess, in all her royal dignity, simply turned away!
💔 "${o}, you presume too much!" declared Her Highness.
💔 They are banished from the royal court! 👑✨💀`,
      c = `👑💀 ULTIMATE ROYAL BLUNDER! 💀👑

Oh no! You played the PRINCESS! 🙈

💔 You approached Her Royal Highness directly with your letter...
💔 But she gave you the coldest royal stare before walking away, ignoring you.

💀 You are eliminated from the round, you hopeless romantic! 💀

"Next time, try working your way up the social ladder first..."
- The Princess (rolling her eyes) 🙄`;
    return {
      result: "princess_played",
      message: "The Princess has spoken! You are eliminated!",
      publicMessage: a,
      playerMessage: c,
      eliminatedPlayer: e,
      attackerMessage: {
        cardName: "Princess",
        from: e,
        message: c,
        selectedCardIndex: 0,
        shouldAdvanceTurn: !0,
        visibleTo: e,
      },
    };
  } catch (n) {
    return (
      console.error("👑 PRINCESS ERROR: Royal scandal!", n),
      {
        result: "error",
        message: `👑 The Princess encountered a royal mishap! ${n.message}`,
      }
    );
  }
}
function oe(t, e) {
  const n = L($, `rooms/${t}/notifications`);
  Kx(n, { message: e, timestamp: Date.now() });
}
const eo = {
    0: "Jester",
    1: "Guard",
    2: "Priest",
    3: "Baron",
    4: "Handmaid",
    5: "Prince",
    6: "Phantom King",
    7: "Countess",
    8: "Princess",
    9: "Inquisitor",
    10: "Chamberlain",
    11: "Regent Queen",
    12: "Court Whisperer",
    13: "Royal Confessor",
    14: "Assassin",
    15: "Baroness",
    16: "Duke",
  },
  eN = (t) =>
    ({
      Guard: "guard1.jpeg",
      Priest: "priest1.jpeg",
      Baron: "baron1.jpeg",
      Handmaid: "handmaid1.jpeg",
      Prince: "prince1.jpeg",
      "Phantom King": "countess1.jpeg",
      Countess: "countess1.jpeg",
      Princess: "princess-portrait1.jpeg",
      Jester: "countess1.jpeg",
      Inquisitor: "countess1.jpeg",
      Chamberlain: "countess1.jpeg",
      "Regent Queen": "countess1.jpeg",
      "Court Whisperer": "countess1.jpeg",
      "Royal Confessor": "countess1.jpeg",
      Assassin: "countess1.jpeg",
      Duke: "countess1.jpeg",
    }[t] || "countess1.jpeg");
function tN() {
  var wd, Cd, Ed, Sd, xd, Nd;
  const { id: t } = El(),
    { state: e } = cr(),
    n = os(),
    r = e == null ? void 0 : e.nickname,
    [s, i] = N.useState(null),
    [o, l] = N.useState(null),
    [a, c] = N.useState(!1),
    [d, h] = N.useState(null),
    [f, p] = N.useState(!1),
    [g, w] = N.useState(null),
    [E, y] = N.useState(null),
    [m, v] = N.useState(!1),
    [_, C] = N.useState(null);
  N.useState("");
  const [x, O] = N.useState(null),
    [A, M] = N.useState(null),
    [P, B] = N.useState(null),
    [V, Ce] = N.useState([]),
    [jt, Mt] = N.useState(null);
  N.useEffect(() => {
    const T = L($, `rooms/${t}`),
      k = mt(T, (R) => {
        var se, et, he, ye, ne;
        const S = R.val(),
          U =
            (se = s == null ? void 0 : s.round) == null
              ? void 0
              : se.currentPlayer,
          D =
            (et = S == null ? void 0 : S.round) == null
              ? void 0
              : et.currentPlayer,
          q =
            (he = S == null ? void 0 : S.round) == null
              ? void 0
              : he.isFinalTurn;
        if (
          (U !== D &&
            (console.log("🔄 CURRENT PLAYER CHANGED:", {
              oldCurrentPlayer: U,
              newCurrentPlayer: D,
              isMyTurn: D === r,
              currentIsPlaying: a,
              isFinalTurn: q,
            }),
            D === r &&
              a &&
              (console.log(
                "🔄 TURN START: Resetting isPlaying = false for new turn"
              ),
              c(!1))),
          q &&
            !((ye = s == null ? void 0 : s.round) != null && ye.isFinalTurn) &&
            console.log(
              "🏆 FINAL TURN FLAG DETECTED: This is the last turn of the round!"
            ),
          i(S),
          S != null && S.players && r && l(S.players[r]),
          (S == null ? void 0 : S.gameState) === "roundScoring" &&
            S != null &&
            S.roundResult)
        ) {
          console.log(
            "🏆 ROUND ENDED - Showing round end modal",
            S.roundResult
          ),
            Mt(S.roundResult);
          return;
        }
        if ((S == null ? void 0 : S.gameState) === "gameEnd") {
          console.log("🏆 Game ended - Redirecting to Game Scoring"),
            n(`/game_scoring/${t}`, { state: { nickname: r, realName } });
          return;
        }
        ((ne = S == null ? void 0 : S.round) == null
          ? void 0
          : ne.currentPlayer) !== r &&
          g != null &&
          g.isInfoOnly &&
          w(null);
      });
    return () => k();
  }, [t, r, g, P]),
    N.useEffect(() => {
      const T = L($, `rooms/${t}/guardPrompt`),
        k = mt(T, (R) => {
          const S = R.val();
          S && S.target === r ? (y(S), v(!0)) : S || (y(null), v(!1));
        });
      return () => k();
    }, [t, r]),
    N.useEffect(() => {
      const T = L($, `rooms/${t}/notifications`),
        k = mt(T, (R) => {
          const S = R.val();
          if (S) {
            const U = Object.values(S).sort(
              (D, q) => D.timestamp - q.timestamp
            );
            Ce(U);
          }
        });
      return () => k();
    }, [t]),
    N.useEffect(() => {
      console.log("actionResult useEffect called!");
      const T = L($, `rooms/${t}/actionResult`),
        k = mt(T, (R) => {
          const S = R.val();
          console.log(
            "attacker is nickname? => ",
            (S == null ? void 0 : S.attacker) === r,
            " / data.resultText: ",
            S == null ? void 0 : S.resultText
          ),
            S && S.attacker === r && S.resultText
              ? w(S.resultText)
              : S || w(null);
        });
      return () => k();
    }, [t, r]),
    N.useEffect(() => {
      const T = L($, `rooms/${t}/priestTarget`),
        k = mt(T, (R) => {
          const S = R.val();
          S && S.visibleTo === r ? C(S) : S || C(null);
        });
      return () => k();
    }, [t, r]),
    N.useEffect(() => {
      const T = L($, `rooms/${t}/baronTarget`),
        k = mt(T, (R) => {
          const S = R.val();
          S && S.visibleTo === r ? M(S) : S || M(null);
        });
      return () => k();
    }, [t, r]),
    N.useEffect(() => {
      const T = L($, `rooms/${t}/targetMessage`),
        k = mt(T, (R) => {
          const S = R.val();
          console.log("🎯 TARGET MESSAGE LISTENER: Received data:", {
            data: S,
            nickname: r,
            isVisibleToMe: (S == null ? void 0 : S.visibleTo) === r,
          }),
            S && S.visibleTo === r
              ? (console.log(
                  "🎯 TARGET MESSAGE LISTENER: Setting target message modal data:",
                  S
                ),
                B(S))
              : S ||
                (console.log(
                  "🎯 TARGET MESSAGE LISTENER: Clearing target message modal data"
                ),
                B(null));
        });
      return () => k();
    }, [t, r]);
  const { round: Ne, players: Y } = s || {},
    j = Ne == null ? void 0 : Ne.currentPlayer,
    z = r === j,
    G = () => {
      var U, D, q, se;
      if ((s == null ? void 0 : s.gameState) === "roundScoring") {
        console.log("🛑 DRAW CARD blocked - Round has ended");
        return;
      }
      if (
        (console.log(
          "🃏 DRAW CARD button clicked / NOT my Turn? => ",
          !z,
          " / playerHandLength: ",
          (U = o.hand) == null ? void 0 : U.length,
          " / isPlaying? ",
          a,
          " / should NOT draw? => ",
          !z || ((D = o.hand) == null ? void 0 : D.length) !== 1 || a
        ),
        console.log("🔍 DIAGNOSTIC - isPlaying state analysis:", {
          isPlaying: a,
          isMyTurn: z,
          currentPlayer: j,
          nickname: r,
          playerHandLength:
            (q = o == null ? void 0 : o.hand) == null ? void 0 : q.length,
          selectedCardIndex: d,
          showTargetModal: f,
          resultModalData: !!g,
          priestTargetModalData: !!_,
          baronResultModalData: !!x,
          targetMessageModalData: !!P,
        }),
        !z || ((se = o.hand) == null ? void 0 : se.length) !== 1 || a)
      )
        return;
      if (!Ne.deck || Ne.deck.length === 0) {
        console.log("❌ Cannot draw card: deck is empty"),
          Ne.isFinalTurn &&
            console.log(
              "🏆 FINAL TURN: Deck is empty and this is flagged as the final turn"
            );
        return;
      }
      const T = Ne.deck[0],
        k = Ne.deck.slice(1),
        R = [...o.hand, T],
        S = L($, `rooms/${t}`);
      k.length === 0
        ? (console.log(
            "🏆 DECK EMPTY: Last card drawn, flagging this as the final turn in Firebase"
          ),
          X(S, {
            round: { ...Ne, deck: k, isFinalTurn: !0 },
            [`players/${r}/hand`]: R,
          }))
        : X(S, { round: { ...Ne, deck: k }, [`players/${r}/hand`]: R });
    },
    de = (T) => {
      if (!T || T.length !== 2) return { forced: !1 };
      const k = T.some((U) => U.id === 7),
        R = T.some((U) => U.id === 5),
        S = T.some((U) => U.id === 6);
      return k && R
        ? {
            forced: !0,
            countessIndex: T.findIndex((U) => U.id === 7),
            blockedCard: "Prince",
            reason:
              "🎭 The Countess knows the Princess's preferences better than the Prince - she must handle this personally!",
          }
        : k && S
        ? {
            forced: !0,
            countessIndex: T.findIndex((U) => U.id === 7),
            blockedCard: "Phantom King",
            reason:
              "🎭 The Countess is a master of court etiquette - she insists on handling this delicate matter herself!",
          }
        : { forced: !1 };
    },
    me = (T, k = null) => {
      if ((s == null ? void 0 : s.gameState) === "roundScoring") {
        console.log("🛑 PLAY CARD blocked - Round has ended");
        return;
      }
      const R = o.hand[T];
      if (k && [1, 2, 3, 6].includes(R.id)) {
        fr(T, k);
        return;
      }
      [1, 2, 3, 6].includes(R.id)
        ? (h(T), p(!0))
        : R.id === 4
        ? ln(T)
        : R.id === 5
        ? (h(T), p(!0))
        : R.id === 7
        ? Wt(T)
        : R.id === 8 && ds(T);
    },
    ln = async (T) => {
      h(T), console.log("🛡️ HANDMAID: Setting isPlaying = true"), c(!0);
      const k = await X1({ roomCode: t, player: r });
      oe(t, k.publicMessage),
        w({ resultText: k.playerMessage, isHandmaidProtection: !0 });
    },
    Wt = async (T) => {
      h(T), console.log("🎭 COUNTESS: Setting isPlaying = true"), c(!0);
      const k = await J1({ roomCode: t, player: r });
      oe(t, k.publicMessage),
        w({ resultText: k.playerMessage, isCountessRoyalty: !0 });
    },
    ds = async (T) => {
      h(T), console.log("👑 PRINCESS: Setting isPlaying = true"), c(!0);
      const k = await Z1({ roomCode: t, player: r });
      oe(t, k.publicMessage),
        w({ resultText: k.playerMessage, isPrincessElimination: !0 });
    },
    Gt = async ({ target: T, guess: k }) => {
      var an, Dt;
      const R = o.hand[d];
      if (
        (p(!1),
        console.log(
          "🎯 TARGET CONFIRM: Setting isPlaying = true for card:",
          (R == null ? void 0 : R.name) || (R == null ? void 0 : R.id)
        ),
        c(!0),
        T === "SKIP_TURN")
      ) {
        w({
          resultText: `🫖✨ Alas! All other players are cozily protected by the Princess' Handmaid, sipping tea in her chambers. Your ${
            eo[R.id]
          } cannot find a target, so your turn is skipped. The card takes no effect! ☕🛡️`,
        });
        return;
      }
      if (R.id === 1) {
        const W = await Lf({ roomCode: t, attacker: r, target: T, guess: k });
        oe(
          t,
          `${r} played a Guard and pointed their finger at ${T}, whispering: "Strength ${k}!"`
        );
        const Ae = L($, `rooms/${t}/guardPrompt`);
        await X(Ae, {
          ...W,
          timestamp: Date.now(),
          cardPlayInfo: { playedCardIndex: d, playerNickname: r },
        });
        return;
      } else if (R.id === 2) {
        const W = await $f({ roomCode: t, attacker: r, target: T });
        if (W.result === "error") {
          w({ resultText: `❌ Error: ${W.message}` });
          return;
        }
        oe(t, W.publicMessage),
          await X(L($, `rooms/${t}/priestTarget`), {
            visibleTo: T,
            attacker: r,
            targetCard: W.targetCard,
          }),
          w({
            resultText: W.attackerMessage,
            cardDetails: {
              "Target Player": T,
              "Revealed Card": `${W.targetCard.name} (Strength ${W.targetCard.strength})`,
              "Card Effect":
                W.targetCard.effect || "No effect description available",
            },
          });
        return;
      } else if (R.id === 3) {
        const W = await Ff({ roomCode: t, attacker: r, target: T });
        if (W.result === "error") {
          w({ resultText: `❌ Error: ${W.message}` });
          return;
        }
        oe(t, W.publicMessage),
          await X(L($, `rooms/${t}/baronTarget`), {
            visibleTo: T,
            attacker: r,
            targetName: T,
            attackerCard: W.attackerCard,
            targetCard: W.targetCard,
            eliminatedPlayer: W.eliminatedPlayer,
            isTie: W.isTie,
            targetMessage: W.targetMessage,
          }),
          O({
            attackerName: r,
            targetName: T,
            attackerCard: W.attackerCard,
            targetCard: W.targetCard,
            eliminatedPlayer: W.eliminatedPlayer,
            isTie: W.isTie,
            attackerMessage: W.attackerMessage,
            targetMessage: W.targetMessage,
          });
        return;
      } else if (R.id === 5) {
        await Kt(L($, `rooms/${t}/targetMessage`), null);
        const W = [...o.hand],
          Ae = await q1({ roomCode: t, attacker: r, target: T });
        if (Ae.result === "error") {
          w({ resultText: `❌ Error: ${Ae.error}` });
          return;
        }
        console.log(
          "PRINCE RESULT from applyPrinceEffect:",
          Ae,
          " / isSelfTarget? => ",
          Ae == null ? void 0 : Ae.isSelfTarget
        ),
          oe(t, Ae.publicMessage),
          w({
            resultText: Ae.attackerMessage,
            isInfoOnly: !Ae.isSelfTarget,
            isPrinceModal: !0,
            originalCardId: 5,
            originalAttackerHand: W,
          }),
          !Ae.isSelfTarget &&
            Ae.targetMessage &&
            (console.log(
              "🤴 PRINCE DEBUG: Creating target message for external target:",
              { target: T, targetMessage: Ae.targetMessage }
            ),
            await X(L($, `rooms/${t}/targetMessage`), {
              visibleTo: T,
              message: Ae.targetMessage,
              from: r,
              cardName: "Prince",
              shouldAdvanceTurn: !0,
              selectedCardIndex: d,
              originalAttackerHand: W,
            })),
          console.log(
            "🤴 PRINCE DEBUG: Target message sent to Firebase for player:",
            T
          );
        return;
      } else if (R.id === 6) {
        console.log(
          "🎭 PHANTOM KING DEBUG: The ethereal sovereign awakens, preparing mystical exchange with target:",
          T
        );
        try {
          console.log(
            "🎭 PHANTOM KING STEP 1: Discarding the ethereal sovereign..."
          );
          const W = o.hand.filter((mr, Ai) => Ai !== d),
            Ae = [...(o.discard || []), R];
          await X(L($, `rooms/${t}`), {
            [`players/${r}/hand`]: W,
            [`players/${r}/discard`]: Ae,
          }),
            console.log(
              "🎭 PHANTOM KING STEP 1 COMPLETE: Phantom King banished to discard pile"
            ),
            console.log(
              "🎭 PHANTOM KING STEP 2: Weaving mystical hand exchange..."
            );
          const lt = await Uf({ roomCode: t, attacker: r, target: T });
          lt.result === "success"
            ? (console.log(
                "🎭 PHANTOM KING STEP 2 COMPLETE: Hands have been exchanged"
              ),
              console.log(
                "🎭 PHANTOM KING STEP 3: Manifesting ethereal communications..."
              ),
              lt.targetMessage &&
                (console.log(
                  "🎭 PHANTOM KING: Sending ethereal message to target"
                ),
                await X(L($, `rooms/${t}/targetMessage`), lt.targetMessage)),
              w({ resultText: lt.resultText, isInfoOnly: !1, cardPlayed: 6 }),
              await oe(t, lt.message),
              console.log(
                "🎭 PHANTOM KING STEP 3 COMPLETE: All communications sent"
              ))
            : lt.result === "skipped"
            ? (w({ resultText: lt.resultText, isInfoOnly: !1, cardPlayed: 6 }),
              await oe(t, lt.message))
            : (console.error("🎭 Phantom King exchange failed:", lt.message),
              w({
                resultText: `💀 The Phantom King's power falters... ${lt.message}`,
              }));
        } catch (W) {
          console.error("🎭 Error invoking Phantom King magic:", W),
            w({
              resultText: `💀 The shadows reject this exchange: ${W.message}`,
            });
        }
        return;
      }
      const { playedCardIndex: S, playerNickname: U } = cardPlayInfo,
        D = Y[U];
      if (!D || !D.hand || D.hand.length !== 2) {
        console.error(
          "Invalid attacker player data for completing Guard turn:",
          {
            playerNickname: U,
            attackerPlayer: D,
            handLength:
              (an = D == null ? void 0 : D.hand) == null ? void 0 : an.length,
          }
        );
        return;
      }
      const q = D.hand[S],
        se = D.hand[1 - S],
        et = [...(D.discard || []), q],
        he = Object.keys(Y).filter((W) => !Y[W].isOut),
        ye = he.indexOf(U);
      let ne = (ye + 1) % he.length;
      for (; (Dt = Y[he[ne]]) != null && Dt.isOut && ne !== ye; )
        ne = (ne + 1) % he.length;
      const $e = he[ne],
        pr = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
          (W) => W !== $e
        );
      await X(L($, `rooms/${t}`), {
        [`players/${U}/hand`]: [se],
        [`players/${U}/discard`]: et,
        "round/currentPlayer": $e,
        protectedPlayers: pr,
      }),
        oe(t, `🕰️ The crown now passes to ${$e}. Destiny awaits...`);
    },
    fr = async (T, { target: k, guess: R }) => {
      const S = o.hand[T];
      if (
        (console.log(
          "🎯 TARGET CONFIRM WITH INDEX: Setting isPlaying = true for card:",
          (S == null ? void 0 : S.name) || (S == null ? void 0 : S.id)
        ),
        c(!0),
        !S)
      ) {
        console.error("❌ ERROR: cardPlayed is undefined. cardIndex:", T),
          c(!1);
        return;
      }
      if (k === "SKIP_TURN") {
        w({
          resultText: `🫖✨ Alas! All other players are cozily protected by the Princess' Handmaid, sipping tea in her chambers. Your ${
            eo[S.id]
          } cannot find a target, so your turn is skipped. The card takes no effect! ☕🛡️`,
        });
        return;
      }
      if (S.id === 1) {
        const U = await Lf({ roomCode: t, attacker: r, target: k, guess: R });
        oe(
          t,
          `${r} played a Guard and pointed their finger at ${k}, whispering: "Strength ${R}!"`
        );
        const D = L($, `rooms/${t}/guardPrompt`);
        await X(D, {
          ...U,
          timestamp: Date.now(),
          cardPlayInfo: { playedCardIndex: T, playerNickname: r },
        });
        return;
      } else if (S.id === 2) {
        const U = await $f({ roomCode: t, attacker: r, target: k });
        w({ resultText: U.attackerMessage }), oe(t, U.publicMessage);
        return;
      } else if (S.id === 3) {
        const U = await Ff({ roomCode: t, attacker: r, target: k });
        w({ resultText: U.attackerMessage }), oe(t, U.publicMessage);
        return;
      } else if (S.id === 6) {
        const U = await Uf({ roomCode: t, attacker: r, target: k });
        w({ resultText: U.attackerMessage, cardPlayed: 6 }),
          oe(t, U.publicMessage);
        return;
      }
      c(!1),
        console.error(
          "❌ Unknown card ID in handleTargetConfirmWithIndex:",
          S == null ? void 0 : S.id
        );
    },
    hs = async () => {
      var T;
      if ((g == null ? void 0 : g.cardPlayed) === 6) {
        console.log("👻 PHANTOM KING: Using special turn completion"),
          await Gy();
        return;
      }
      if (g != null && g.isCountessRoyalty) {
        console.log("🎭 COUNTESS: Using special turn completion"), await Vy();
        return;
      }
      if (g != null && g.isHandmaidProtection) {
        console.log("🛡️ HANDMAID: Using special turn completion"), await Yy();
        return;
      }
      if (g != null && g.isPrincessElimination) {
        console.log("👑 PRINCESS: Using special turn completion"), await Ky();
        return;
      }
      if (
        d == null ||
        d < 0 ||
        !(o != null && o.hand) ||
        o.hand.length === 0 ||
        d >= o.hand.length
      ) {
        console.error(
          "Cannot complete turn - invalid selectedCardIndex or hand state:",
          {
            selectedCardIndex: d,
            handLength:
              (T = o == null ? void 0 : o.hand) == null ? void 0 : T.length,
          }
        );
        return;
      }
      await Dl(d);
    },
    Dl = async (T) => {
      var $e, bi, pr, an;
      if (
        (console.log("🔄 TURN COMPLETION DEBUG: Starting with data:", {
          cardIndex: T,
          cardIndexType: typeof T,
          player: o,
          playerHand: o == null ? void 0 : o.hand,
          handLength:
            ($e = o == null ? void 0 : o.hand) == null ? void 0 : $e.length,
          nickname: r,
          roomCode: t,
        }),
        T == null ||
          T < 0 ||
          !(o != null && o.hand) ||
          o.hand.length === 0 ||
          T >= o.hand.length)
      ) {
        console.error(
          "🔄 TURN COMPLETION ERROR: Cannot complete turn - invalid cardIndex or hand state:",
          {
            cardIndex: T,
            cardIndexType: typeof T,
            handLength:
              (bi = o == null ? void 0 : o.hand) == null ? void 0 : bi.length,
            player: o,
          }
        );
        return;
      }
      const k = o.hand[T],
        R = o.hand.filter((Dt, W) => W !== T),
        S = [...(o.discard || []), k],
        U = Object.keys(Y).filter((Dt) => !Y[Dt].isOut),
        D = U.indexOf(r);
      let q = (D + 1) % U.length;
      for (; (pr = Y[U[q]]) != null && pr.isOut && q !== D; )
        q = (q + 1) % U.length;
      const se = U[q];
      if (!k || !se) {
        console.error("Invalid values detected before Firebase update:", {
          playedCard: k,
          remainingHand: R,
          nextPlayer: se,
        });
        return;
      }
      const he = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
        (Dt) => Dt !== se
      );
      await X(L($, `rooms/${t}`), {
        [`players/${r}/hand`]: R,
        [`players/${r}/discard`]: S,
        "round/currentPlayer": se,
        protectedPlayers: he,
      }),
        oe(t, `🕰️ The crown now passes to ${se}. Destiny awaits...`),
        console.log("🔍 ROUND END CHECK: After Turn Completion");
      const ye = await vd(t),
        ne =
          (an = s == null ? void 0 : s.round) == null ? void 0 : an.isFinalTurn;
      if (
        (console.log("🏆 FINAL TURN CHECK:", {
          isFinalTurn: ne,
          roundEndResult: ye,
        }),
        ye.isRoundEnd || ne)
      ) {
        console.log("🏆 ROUND END DETECTED:", {
          roundEndResult: ye,
          isFinalTurn: ne,
        }),
          setTimeout(async () => {
            console.log("🏆 TRIGGERING ROUND END after delay"), await Hy(t);
          }, 3e3);
        return;
      }
      console.log(
        "🔄 TURN COMPLETION: Setting isPlaying = false in completeTurnWithCardIndex"
      ),
        c(!1),
        h(null);
    },
    Ll = async (T) => {
      if (!(T != null && T.cardPlayInfo)) {
        console.error(
          "🔄 GUARD TURN COMPLETION ERROR: Missing cardPlayInfo in guardData:",
          T
        );
        return;
      }
      const { playedCardIndex: k, playerNickname: R } = T.cardPlayInfo;
      if (
        (console.log("🛡️ GUARD TURN COMPLETION DEBUG: Starting with data:", {
          playedCardIndex: k,
          playerNickname: R,
          currentNickname: r,
          guardData: T,
        }),
        R !== r)
      ) {
        console.log(
          "🛡️ GUARD TURN COMPLETION: Not the attacker, skipping turn completion"
        );
        return;
      }
      await Dl(k);
    },
    _d = async (T, k, R) => {
      var an, Dt;
      console.log("👑 PRINCE TURN COMPLETION DEBUG: Starting with data:", {
        cardIndex: T,
        attackerNickname: k,
        currentNickname: r,
        originalAttackerHand: R,
        players: Y,
        roomData: s,
      });
      const S = k === r;
      if ((console.log("👑 PRINCE TURN: isSelfTargeting? => ", S), S)) {
        if (
          (console.log(
            "👑 PRINCE TURN: Self-targeting - Prince effect already applied, only completing turn"
          ),
          T == null || !R || R.length !== 2)
        ) {
          console.error(
            "👑 PRINCE TURN COMPLETION ERROR: Invalid data for self-targeting:",
            { cardIndex: T, originalAttackerHand: R }
          );
          return;
        }
        const W = R[T],
          lt = [...(Y[k].discard || []), W],
          mr = Object.keys(Y).filter(($l) => !Y[$l].isOut),
          Ai = mr.indexOf(k);
        let fs = (Ai + 1) % mr.length;
        for (; (an = Y[mr[fs]]) != null && an.isOut && fs !== Ai; )
          fs = (fs + 1) % mr.length;
        const ji = mr[fs],
          qy = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
            ($l) => $l !== ji
          );
        console.log(
          "👑 PRINCE TURN COMPLETION: Self-targeting - updating discard and advancing turn:",
          { newDiscard: lt, nextPlayer: ji }
        ),
          await X(L($, `rooms/${t}`), {
            [`players/${k}/discard`]: lt,
            "round/currentPlayer": ji,
            protectedPlayers: qy,
          }),
          oe(t, `🕰️ The crown now passes to ${ji}. Destiny awaits...`);
        return;
      }
      const U = Y[k],
        D = U == null ? void 0 : U.hand;
      if (
        (console.log(
          "👑 PRINCE TURN: Using current attacker hand for external targeting:",
          D
        ),
        T == null || !D || D.length !== 2)
      ) {
        console.error(
          "👑 PRINCE TURN COMPLETION ERROR: Cannot complete turn - invalid data:",
          {
            cardIndex: T,
            cardIndexType: typeof T,
            attackerHand: D,
            attackerHandLength: D == null ? void 0 : D.length,
            isSelfTargeting: S,
            originalAttackerHand: R,
          }
        );
        return;
      }
      const q = D[T],
        se = D[1 - T],
        et = [...(U.discard || []), q],
        he = Object.keys(Y).filter((W) => !Y[W].isOut),
        ye = he.indexOf(k);
      let ne = (ye + 1) % he.length;
      for (; (Dt = Y[he[ne]]) != null && Dt.isOut && ne !== ye; )
        ne = (ne + 1) % he.length;
      const $e = he[ne];
      if (!q || !se || !$e) {
        console.error(
          "👑 PRINCE Invalid values detected before Firebase update:",
          { playedCard: q, remainingCard: se, nextPlayer: $e }
        );
        return;
      }
      console.log(
        "👑 PRINCE TURN COMPLETION: Updating Firebase for external targeting:",
        {
          attackerNickname: k,
          remainingCard: se,
          newDiscard: et,
          nextPlayer: $e,
        }
      );
      const pr = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
        (W) => W !== $e
      );
      await X(L($, `rooms/${t}`), {
        [`players/${k}/hand`]: [se],
        [`players/${k}/discard`]: et,
        "round/currentPlayer": $e,
        protectedPlayers: pr,
      }),
        oe(t, `🕰️ The crown now passes to ${$e}. Destiny awaits...`),
        r === k &&
          (console.log(
            "🔄 GUARD TURN COMPLETION: Setting isPlaying = false for attacker"
          ),
          c(!1),
          h(null));
    },
    Gy = async () => {
      var q;
      console.log(
        "👻 PHANTOM KING TURN COMPLETION: The ethereal sovereign completes their mystical work"
      );
      const T = Object.keys(Y).filter((se) => !Y[se].isOut),
        k = T.indexOf(r);
      let R = (k + 1) % T.length;
      for (; (q = Y[T[R]]) != null && q.isOut && R !== k; )
        R = (R + 1) % T.length;
      const S = T[R],
        D = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
          (se) => se !== S
        );
      await X(L($, `rooms/${t}`), {
        "round/currentPlayer": S,
        protectedPlayers: D,
      }),
        oe(t, `🕰️ The crown now passes to ${S}. Destiny awaits...`),
        c(!1),
        h(null);
    },
    Vy = async () => {
      var he;
      console.log(
        "🎭 COUNTESS TURN COMPLETION: Her royal majesty completes her audience"
      );
      const T = o.hand[d];
      if (!T || T.id !== 7) {
        console.error(
          "🎭 COUNTESS ERROR: Cannot complete turn - invalid Countess card"
        );
        return;
      }
      const k = o.hand.filter((ye, ne) => ne !== d),
        R = [...(o.discard || []), T],
        S = Object.keys(Y).filter((ye) => !Y[ye].isOut),
        U = S.indexOf(r);
      let D = (U + 1) % S.length;
      for (; (he = Y[S[D]]) != null && he.isOut && D !== U; )
        D = (D + 1) % S.length;
      const q = S[D],
        et = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
          (ye) => ye !== q
        );
      await X(L($, `rooms/${t}`), {
        [`players/${r}/hand`]: k,
        [`players/${r}/discard`]: R,
        "round/currentPlayer": q,
        protectedPlayers: et,
      }),
        oe(
          t,
          `🕰️ The royal audience concludes. The crown now passes to ${q}. 👑`
        ),
        console.log("🔄 COUNTESS TURN COMPLETION: Setting isPlaying = false"),
        c(!1),
        h(null);
    },
    Yy = async () => {
      var he, ye;
      if (
        (console.log(
          "🛡️ HANDMAID TURN COMPLETION: Protection granted, completing turn"
        ),
        d == null || !o.hand || d >= o.hand.length)
      ) {
        console.error(
          "🛡️ HANDMAID ERROR: Cannot complete turn - invalid selectedCardIndex:",
          {
            selectedCardIndex: d,
            handLength: (he = o.hand) == null ? void 0 : he.length,
          }
        );
        return;
      }
      const T = o.hand[d];
      if (!T || T.id !== 4) {
        console.error(
          "🛡️ HANDMAID ERROR: Cannot complete turn - invalid Handmaid card:",
          T
        );
        return;
      }
      const k = o.hand.filter((ne, $e) => $e !== d),
        R = [...(o.discard || []), T],
        S = Object.keys(Y).filter((ne) => !Y[ne].isOut),
        U = S.indexOf(r);
      let D = (U + 1) % S.length;
      for (; (ye = Y[S[D]]) != null && ye.isOut && D !== U; )
        D = (D + 1) % S.length;
      const q = S[D],
        et = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
          (ne) => ne !== q
        );
      await X(L($, `rooms/${t}`), {
        [`players/${r}/hand`]: k,
        [`players/${r}/discard`]: R,
        "round/currentPlayer": q,
        protectedPlayers: et,
      }),
        oe(
          t,
          `🕰️ The protective charm is cast. The crown now passes to ${q}. 🛡️`
        ),
        console.log("🔄 HANDMAID TURN COMPLETION: Setting isPlaying = false"),
        c(!1),
        h(null);
    },
    Ky = async () => {
      var he, ye;
      if (
        (console.log(
          "👑 PRINCESS TURN COMPLETION: The royal tragedy concludes"
        ),
        d == null || !o.hand || d >= o.hand.length)
      ) {
        console.error(
          "👑 PRINCESS ERROR: Cannot complete turn - invalid selectedCardIndex:",
          {
            selectedCardIndex: d,
            handLength: (he = o.hand) == null ? void 0 : he.length,
          }
        );
        return;
      }
      const T = o.hand[d];
      if (!T || T.id !== 8) {
        console.error(
          "👑 PRINCESS ERROR: Cannot complete turn - invalid Princess card:",
          T
        );
        return;
      }
      const k = o.hand.filter((ne, $e) => $e !== d),
        R = [...(o.discard || []), T],
        S = Object.keys(Y).filter((ne) => !Y[ne].isOut),
        U = S.indexOf(r);
      let D = (U + 1) % S.length;
      for (; (ye = Y[S[D]]) != null && ye.isOut && D !== U; )
        D = (D + 1) % S.length;
      const q = S[D],
        et = ((s == null ? void 0 : s.protectedPlayers) || []).filter(
          (ne) => ne !== q
        );
      await X(L($, `rooms/${t}`), {
        [`players/${r}/hand`]: k,
        [`players/${r}/discard`]: R,
        "round/currentPlayer": q,
        protectedPlayers: et,
      }),
        oe(
          t,
          `🕰️ The royal bloodline mourns. The crown now passes to ${q}. 💀`
        ),
        console.log("🔄 PRINCESS TURN COMPLETION: Setting isPlaying = false"),
        c(!1),
        h(null);
    },
    Qy = (T, k) => {
      console.log("🎯 Player section clicked:", T, k);
    };
  if (!s || !o || !Ne || !Y)
    return u.jsx("div", {
      className: "play-loading",
      children: "⏳ Loading game state...",
    });
  {
    const T =
      ((wd = s == null ? void 0 : s.gameStats) == null
        ? void 0
        : wd.roundNumber) || 1;
    return u.jsxs("div", {
      className: "royal-play-container",
      children: [
        u.jsxs("div", {
          className: "royal-game-area",
          children: [
            u.jsx("div", {
              className: `current-player-banner ${j === r ? "is-my-turn" : ""}`,
              children:
                j === r
                  ? u.jsx("span", { children: "👑 YOUR ROYAL TURN 👑" })
                  : u.jsxs("span", {
                      children: [
                        "🎭 AWAITING ",
                        j == null ? void 0 : j.toUpperCase(),
                        "'S ROYAL DECREE 🎭",
                      ],
                    }),
            }),
            ((Cd = Y[r]) == null ? void 0 : Cd.isOut) &&
              u.jsxs("div", {
                className: "elimination-message",
                children: [
                  u.jsx("strong", { children: "💀 You’ve been eliminated!" }),
                  u.jsx("br", {}),
                  "You can no longer play this round, but may still witness the drama as it unfolds...",
                ],
              }),
            u.jsx("div", {
              className: "game-grid",
              children: Object.entries(Y).map(([k, R]) => {
                var se;
                const S =
                    (se = s == null ? void 0 : s.protectedPlayers) == null
                      ? void 0
                      : se.includes(k),
                  U = k === j,
                  D = R.isOut,
                  q = k === r;
                return u.jsxs(
                  "div",
                  {
                    className: `royal-player-section ${
                      U ? "is-current-player" : ""
                    } ${D ? "is-eliminated" : ""} ${S ? "is-protected" : ""}`,
                    onClick: () => Qy(k, R),
                    children: [
                      u.jsxs("div", {
                        className: "player-header",
                        children: [
                          u.jsxs("div", {
                            className: `player-name ${q ? "is-you" : ""}`,
                            children: [
                              U && "👑 ",
                              R.name,
                              R.realName &&
                                u.jsxs("div", {
                                  className: "player-real-name",
                                  children: ["(", q ? "You" : R.realName, ")"],
                                }),
                              D && " 💀",
                            ],
                          }),
                          u.jsxs("div", {
                            className: "player-tokens",
                            children: ["❤️ ", R.tokens || 0],
                          }),
                        ],
                      }),
                      u.jsx("div", {
                        className: "player-info-grid",
                        children:
                          R.discard &&
                          R.discard.length > 0 &&
                          u.jsxs("div", {
                            className: "player-stat",
                            children: [
                              u.jsx("span", {
                                className: "player-stat-label",
                                children: "Last Played",
                              }),
                              u.jsxs("span", {
                                className: "player-stat-value",
                                children: [
                                  R.discard[R.discard.length - 1].name,
                                  " (Strength",
                                  " ",
                                  R.discard[R.discard.length - 1].strength,
                                  ")",
                                ],
                              }),
                            ],
                          }),
                      }),
                      S &&
                        u.jsx("div", {
                          style: {
                            textAlign: "center",
                            marginTop: "0.5rem",
                            color: "#90EE90",
                            fontSize: "0.8rem",
                          },
                          children: "🫖✨ Protected by Handmaid",
                        }),
                      D &&
                        u.jsx("div", {
                          style: {
                            textAlign: "center",
                            marginTop: "0.5rem",
                            color: "#888",
                            fontSize: "0.8rem",
                          },
                          children: "Eliminated this round",
                        }),
                    ],
                  },
                  k
                );
              }),
            }),
            z &&
              !g &&
              !x &&
              u.jsx("div", {
                className: "royal-action-area-background",
                children: u.jsx("div", {
                  className: "royal-action-area-overlay",
                  children: u.jsxs("div", {
                    className: "royal-actions-area",
                    children: [
                      z &&
                        u.jsxs("div", {
                          className: "turn-section",
                          children: [
                            ((Ed = o.hand) == null ? void 0 : Ed.length) ===
                              1 && u.jsx("h3", { children: "It’s your turn!" }),
                            ((Sd = o.hand) == null ? void 0 : Sd.length) ===
                              1 &&
                              u.jsx("button", {
                                className: "draw-card-button",
                                onClick: G,
                                children: "Draw Card",
                              }),
                            ((xd = o.hand) == null ? void 0 : xd.length) ===
                              2 &&
                              u.jsx("div", {
                                children: (() => {
                                  var R;
                                  const k = de(o.hand);
                                  return (
                                    console.log(
                                      "🎭 COUNTESS DEBUG: Force play check result:",
                                      {
                                        hand: o.hand,
                                        countessForce: k,
                                        handLength:
                                          (R = o.hand) == null
                                            ? void 0
                                            : R.length,
                                      }
                                    ),
                                    u.jsxs(u.Fragment, {
                                      children: [
                                        u.jsx("p", {
                                          children: "Choose a card to play:",
                                        }),
                                        k.forced &&
                                          u.jsxs("div", {
                                            className: "countess-warning",
                                            children: [
                                              u.jsx("strong", {
                                                children:
                                                  "🎭 Royal Protocol Alert:",
                                              }),
                                              u.jsx("br", {}),
                                              k.reason,
                                            ],
                                          }),
                                        u.jsx("div", {
                                          className: "card-selection-container",
                                          children: o.hand.map((S, U) => {
                                            const D =
                                              k.forced &&
                                              ((S.id === 5 &&
                                                k.blockedCard === "Prince") ||
                                                (S.id === 6 &&
                                                  k.blockedCard ===
                                                    "Phantom King"));
                                            return u.jsxs(
                                              "button",
                                              {
                                                onClick: () => me(U),
                                                className: `card-button ${
                                                  D ? "blocked" : ""
                                                }`,
                                                disabled: a || D,
                                                title: D
                                                  ? `Cannot play ${S.name} - Countess demands precedence!`
                                                  : "",
                                                children: [
                                                  u.jsx("div", {
                                                    className: "card-strength",
                                                    children: S.strength,
                                                  }),
                                                  u.jsx("div", {
                                                    className: "card-image",
                                                    style: {
                                                      backgroundImage: `url('/src/img/${eN(
                                                        S.name
                                                      )}')`,
                                                    },
                                                  }),
                                                  u.jsxs("div", {
                                                    className: "card-content",
                                                    children: [
                                                      u.jsx("div", {
                                                        className: "card-name",
                                                        children: S.name,
                                                      }),
                                                      u.jsx("div", {
                                                        className:
                                                          "card-effect",
                                                        children: S.effect,
                                                      }),
                                                      D &&
                                                        u.jsx("div", {
                                                          className:
                                                            "card-blocked-text",
                                                          children:
                                                            "🎭 Blocked by Countess",
                                                        }),
                                                    ],
                                                  }),
                                                ],
                                              },
                                              U
                                            );
                                          }),
                                        }),
                                      ],
                                    })
                                  );
                                })(),
                              }),
                          ],
                        }),
                      f &&
                        d !== null &&
                        ((Nd = o.hand) == null ? void 0 : Nd[d]) &&
                        u.jsx(y1, {
                          players: Y,
                          currentPlayer: r,
                          cardPlayed: o.hand[d].id,
                          protectedPlayers:
                            (s == null ? void 0 : s.protectedPlayers) || [],
                          onConfirm: Gt,
                          onCancel: () => p(!1),
                        }),
                      P &&
                        u.jsx(Mf, {
                          resultText: P.message,
                          onClose: async () => {
                            var k;
                            if (
                              (console.log(
                                "🎯 TARGET MODAL DEBUG: Target modal closing with data:",
                                {
                                  targetMessageModalData: P,
                                  shouldAdvanceTurn: P.shouldAdvanceTurn,
                                  selectedCardIndex: P.selectedCardIndex,
                                  currentPlayer: o,
                                  currentHand: o == null ? void 0 : o.hand,
                                  handLength:
                                    (k = o == null ? void 0 : o.hand) == null
                                      ? void 0
                                      : k.length,
                                }
                              ),
                              await Kt(L($, `rooms/${t}/targetMessage`), null),
                              B(null),
                              P.shouldAdvanceTurn &&
                                P.selectedCardIndex !== null)
                            ) {
                              console.log(
                                "🎯 TARGET MODAL DEBUG: Attempting to complete turn with cardIndex:",
                                P.selectedCardIndex
                              );
                              const R =
                                P.cardName === "Prince"
                                  ? 5
                                  : P.cardName === "Phantom King"
                                  ? 6
                                  : null;
                              K1(R, !1)
                                ? P.cardName === "Prince"
                                  ? (console.log(
                                      "🎯 TARGET MODAL DEBUG: Prince - completing turn"
                                    ),
                                    await _d(
                                      P.selectedCardIndex,
                                      P.from,
                                      P.originalAttackerHand
                                    ))
                                  : (console.log(
                                      "🎯 TARGET MODAL DEBUG: Advancing turn for card:",
                                      P.cardName
                                    ),
                                    await Dl(P.selectedCardIndex))
                                : console.log(
                                    "🎯 TARGET MODAL DEBUG: Target modal for",
                                    P.cardName,
                                    "should not advance turn"
                                  );
                            } else
                              console.log(
                                "🎯 TARGET MODAL DEBUG: NOT advancing turn because:",
                                {
                                  shouldAdvanceTurn: P.shouldAdvanceTurn,
                                  selectedCardIndex: P.selectedCardIndex,
                                }
                              );
                          },
                        }),
                    ],
                  }),
                }),
              }),
            x &&
              u.jsx(Df, {
                isOpen: !0,
                userRole: r === x.attackerName ? "attacker" : "target",
                attackerName: x.attackerName,
                targetName: x.targetName,
                attackerCard: x.attackerCard,
                targetCard: x.targetCard,
                eliminatedPlayer: x.eliminatedPlayer,
                isTie: x.isTie,
                message:
                  r === x.attackerName ? x.attackerMessage : x.targetMessage,
                onConfirm: async () => {
                  x.eliminatedPlayer &&
                    !x.isTie &&
                    (await X(L($, `rooms/${t}/players/${x.eliminatedPlayer}`), {
                      isOut: !0,
                    }),
                    oe(
                      t,
                      `⚔️💥 ${x.eliminatedPlayer} has been eliminated in the Baron's duel!`
                    )),
                    await Kt(L($, `rooms/${t}/baronTarget`), null),
                    O(null),
                    d !== null && hs();
                },
              }),
            _ && u.jsx(G1, { attacker: _.attacker, targetCard: _.targetCard }),
            A &&
              u.jsx(Df, {
                isOpen: !0,
                userRole: "target",
                attackerName: A.attacker,
                targetName: A.targetName,
                attackerCard: A.attackerCard,
                targetCard: A.targetCard,
                eliminatedPlayer: A.eliminatedPlayer,
                isTie: A.isTie,
                message: A.targetMessage,
              }),
            m &&
              E &&
              r === E.target &&
              u.jsx(W1, {
                promptData: E,
                onAcknowledge: async () => {
                  const {
                    isCorrectGuess: k,
                    targetCard: R,
                    target: S,
                    attacker: U,
                  } = E;
                  let D;
                  k
                    ? (await X(L($, `rooms/${t}/players/${S}`), { isOut: !0 }),
                      oe(
                        t,
                        `🎯 ${U} guessed correctly! ${S} had the ${
                          eo[R.id]
                        }. Removed from play.`
                      ),
                      (D = `💀 Your suspicion proved true! ${S} held the ${
                        eo[R.id]
                      } and has been cast from the court.`))
                    : (oe(
                        t,
                        `😎 ${S} shook their head. "Not even close." The guess was wrong.`
                      ),
                      (D = `😅 Alas! ${S} was not holding strength ${E.guessedStrength}. Your accusation echoes hollowly in the halls.`)),
                    await X(L($, `rooms/${t}`), { guardPrompt: null }),
                    await X(L($, `rooms/${t}/actionResult`), {
                      resultText: D,
                      attacker: U,
                    }),
                    await Ll(E),
                    y(null),
                    v(!1);
                },
                onReveal: async () => {
                  const { target: k, attacker: R } = E;
                  await Q1({ roomCode: t, attacker: R, target: k }),
                    oe(
                      t,
                      `☠️ ${R} guessed the Assassin… and paid the price. Well struck, ${k}!`
                    );
                  const S = `☠️ A fatal mistake! ${k} revealed the Assassin and struck you down. Your legacy ends here...`;
                  await X(L($, `rooms/${t}`), { guardPrompt: null }),
                    await X(L($, `rooms/${t}/actionResult`), {
                      resultText: S,
                      attacker: R,
                    }),
                    await Ll(E),
                    y(null),
                    v(!1);
                },
                onIgnore: async () => {
                  const { target: k } = E;
                  oe(
                    t,
                    `😎 ${k} shook their head. "Not even close." The guess was wrong.`
                  );
                  const R = `😅 Alas! ${k} was not holding strength ${E.guessedStrength}. Your accusation echoes hollowly in the halls.`;
                  await X(L($, `rooms/${t}`), { guardPrompt: null }),
                    await X(L($, `rooms/${t}/actionResult`), {
                      resultText: R,
                      attacker: E.attacker,
                    }),
                    await Ll(E),
                    y(null),
                    v(!1);
                },
              }),
            g &&
              u.jsx(Mf, {
                resultText: g.resultText || g,
                cardDetails: g.cardDetails || null,
                onClose: async () => {
                  var k;
                  if (
                    (console.log(
                      "⚔️ RESULT MODAL DEBUG: Result modal closing with data:",
                      {
                        resultModalData: g,
                        isInfoOnly: g.isInfoOnly,
                        selectedCardIndex: d,
                        nickname: r,
                      }
                    ),
                    await Kt(L($, `rooms/${t}/actionResult`), null),
                    await Kt(L($, `rooms/${t}/priestTarget`), null),
                    await Kt(L($, `rooms/${t}/baronTarget`), null),
                    w(null),
                    g.isInfoOnly)
                  )
                    console.log(
                      "⚔️ RESULT MODAL DEBUG: Info-only modal (Prince attacker), NOT advancing turn"
                    );
                  else {
                    if (
                      (console.log(
                        "⚔️ RESULT MODAL DEBUG: Not info-only, checking if should advance turn"
                      ),
                      g.isHandmaidProtection)
                    ) {
                      console.log(
                        "🛡️ HANDMAID MODAL: Using special turn completion"
                      ),
                        hs();
                      return;
                    }
                    if (g.isCountessRoyalty) {
                      console.log(
                        "🎭 COUNTESS MODAL: Using special turn completion"
                      ),
                        hs();
                      return;
                    }
                    if (g.isPrincessElimination) {
                      console.log(
                        "👑 PRINCESS MODAL: Using special turn completion"
                      ),
                        hs();
                      return;
                    }
                    if (d !== null) {
                      const R =
                          (k = o == null ? void 0 : o.discard) == null
                            ? void 0
                            : k[o.discard.length - 1],
                        S = R == null ? void 0 : R.id;
                      console.log(
                        "⚔️ RESULT MODAL DEBUG: Advancing turn for card ID:",
                        S
                      ),
                        g.isPrinceModal && g.originalCardId === 5
                          ? (console.log(
                              "👑 RESULT MODAL: Prince self-targeting, using completePrinceTurn"
                            ),
                            await _d(d, r, g.originalAttackerHand))
                          : hs();
                    }
                  }
                },
              }),
          ],
        }),
        u.jsx("div", {
          className: "royal-right-sidebar",
          children: u.jsxs("div", {
            className: "royal-chronicle-sidebar",
            children: [
              u.jsxs("div", {
                className: "chronicle-header",
                children: [
                  u.jsx("div", {
                    className: "round-container",
                    children: u.jsxs("div", {
                      className: "round-content",
                      children: [
                        u.jsx("span", {
                          role: "img",
                          "aria-label": "Round",
                          children: "⚔️",
                        }),
                        u.jsx("span", { children: "Round" }),
                        u.jsx("span", {
                          className: "round-number",
                          children: T,
                        }),
                      ],
                    }),
                  }),
                  u.jsx("h3", { children: "📜 Game Chronicle" }),
                ],
              }),
              u.jsxs("div", {
                className: "chronicle-content",
                children: [
                  V.map((k, R) =>
                    u.jsxs(
                      "div",
                      {
                        className: "chronicle-notification",
                        children: [
                          u.jsx("span", {
                            className: "chronicle-arrow",
                            children: "➤",
                          }),
                          u.jsx("span", {
                            className: "chronicle-message",
                            children: k.message,
                          }),
                        ],
                      },
                      R
                    )
                  ),
                  V.length === 0 &&
                    u.jsx("div", {
                      className: "chronicle-empty",
                      children: u.jsx("em", {
                        children:
                          "📜 The chronicle awaits the first royal decree...",
                      }),
                    }),
                ],
              }),
            ],
          }),
        }),
        jt &&
          u.jsx(V1, {
            roundResult: jt,
            players: (s == null ? void 0 : s.players) || {},
            onContinue: () => {
              console.log("🏆 Round End Modal - Continuing to scoring board"),
                Mt(null),
                n(`/round_scoring/${t}`, {
                  state: {
                    nickname: r,
                    realName: e == null ? void 0 : e.realName,
                  },
                });
            },
          }),
      ],
    });
  }
}
function nN() {
  var O, A;
  const { id: t } = El(),
    { state: e } = cr(),
    n = os(),
    r = e == null ? void 0 : e.nickname,
    s = e == null ? void 0 : e.realName,
    [i, o] = N.useState(null),
    [l, a] = N.useState(!0),
    [c, d] = N.useState(!1);
  N.useEffect(() => {
    if (!t) return;
    const M = L($, `rooms/${t}`),
      P = mt(M, (B) => {
        const V = B.val();
        o(V),
          a(!1),
          setTimeout(() => d(!0), 100),
          (V == null ? void 0 : V.gameState) === "inRound" &&
            (console.log("🎮 New round started - Redirecting back to game"),
            n(`/play/${t}`, { state: { nickname: r, realName: s } })),
          (V == null ? void 0 : V.gameState) === "gameEnd" &&
            (console.log("🏆 Game ended - Redirecting to Game Scoring"),
            n(`/game_scoring/${t}`, { state: { nickname: r, realName: s } }));
      });
    return () => P();
  }, [t, r, s, n]);
  const h = async () => {
      var M, P;
      if (!(!i || i.host !== r))
        try {
          console.log("🎮 Starting new round...");
          const B = Object.keys(i.players),
            V = i.mode || "normal",
            Ce = (M = i.gameStats) == null ? void 0 : M.lastRoundWinner,
            jt = zy(V),
            Mt = jt[0],
            Ne = jt.slice(1),
            Y = {
              deck: Ne.slice(B.length),
              hiddenCard: Mt,
              currentPlayer: Ce || B[0],
              isFinalTurn: !1,
            },
            j = {};
          B.forEach((me, ln) => {
            (j[`players/${me}/hand`] = [Ne[ln]]),
              (j[`players/${me}/discard`] = []),
              (j[`players/${me}/isOut`] = !1);
          });
          const z =
              (((P = i.gameStats) == null ? void 0 : P.totalRoundsPlayed) ||
                0) + 1,
            G = {
              gameState: "inRound",
              roundResult: null,
              round: Y,
              notifications: null,
              protectedPlayers: [],
              guardPrompt: null,
              actionResult: null,
              priestTarget: null,
              baronTarget: null,
              targetMessage: null,
              "gameStats/currentRound": z,
              ...j,
            },
            de = L($, `rooms/${t}`);
          await X(de, G), console.log("✅ New round started successfully!");
        } catch (B) {
          console.error("❌ Error starting new round:", B);
        }
    },
    f = (M) => {
      const P = Math.max(...Object.values(M).map((Ce) => Ce.tokens || 0)),
        B = Object.keys(M).filter((Ce) => (M[Ce].tokens || 0) === P),
        V = Math.floor(Math.random() * B.length);
      return B[V];
    },
    p = async (M) => {
      var B;
      if (
        !(
          !i ||
          i.host !== r ||
          M === r ||
          !window.confirm(
            `🏰 Royal Decree: Are you sure you want to banish ${M} from the realm? They will be removed from future rounds.`
          )
        )
      )
        try {
          const V = { [`players/${M}`]: null };
          if (((B = i.gameStats) == null ? void 0 : B.lastRoundWinner) === M) {
            console.log(
              "🔄 Kicked player was LastRoundWinner, finding replacement..."
            );
            const Mt = { ...i.players };
            if ((delete Mt[M], Object.keys(Mt).length > 0)) {
              const Ne = f(Mt);
              (V["gameStats/lastRoundWinner"] = Ne),
                console.log(`👑 New LastRoundWinner: ${Ne}`);
            } else V["gameStats/lastRoundWinner"] = null;
          }
          const jt = L($, `rooms/${t}`);
          await X(jt, V),
            console.log(`👑 Player ${M} has been banished from the realm`);
        } catch (V) {
          console.error("❌ Error kicking player:", V);
        }
    },
    g = async () => {
      var M;
      if (!(!i || i.host !== r))
        try {
          const P = {
              gameState: "gameEnd",
              finalResults: {
                completedRounds:
                  ((M = i.gameStats) == null ? void 0 : M.totalRoundsPlayed) ||
                  0,
                finalWinner: w(),
                timestamp: Date.now(),
              },
            },
            B = L($, `rooms/${t}`);
          await X(B, P),
            console.log("🏁 Game ended - redirecting to Game Scoring"),
            n(`/game_scoring/${t}`, { state: { nickname: r, realName: s } });
        } catch (P) {
          console.error("❌ Error ending game:", P);
        }
    },
    w = () => {
      if (!(i != null && i.players)) return null;
      const M = Object.entries(i.players),
        P = Math.max(...M.map(([V, Ce]) => Ce.tokens || 0)),
        B = M.filter(([V, Ce]) => (Ce.tokens || 0) === P);
      return B.length === 1 ? B[0][0] : B.map(([V]) => V);
    },
    E = () =>
      i != null && i.players
        ? Object.entries(i.players)
            .sort(([, M], [, P]) => (P.tokens || 0) - (M.tokens || 0))
            .map(([M, P]) => ({ name: M, ...P }))
        : [],
    y = (M) => {
      const P = M.name,
        B = M.realName;
      return P && B && P !== B
        ? { primary: P, secondary: B }
        : { primary: P || B, secondary: null };
    },
    m = () => {
      var P, B;
      const M =
        (B =
          (P = i == null ? void 0 : i.roundResult) == null
            ? void 0
            : P.hiddenCard) == null
          ? void 0
          : B.id;
      return M ? vi.find((V) => V.id === M) : null;
    };
  if (l)
    return u.jsx("div", {
      className: "loading-container",
      children: u.jsx("div", {
        className: "loading-box",
        children: "⏳ Loading the royal chronicles...",
      }),
    });
  if (!i)
    return u.jsx("div", {
      className: "loading-container",
      children: u.jsx("div", {
        className: "loading-box",
        children: "❌ The royal court has vanished...",
      }),
    });
  const v = i.roundResult,
    _ = i.host === r,
    C = E(),
    x = m();
  return u.jsx("div", {
    className: `round-scoring-container ${c ? "fade-in" : ""}`,
    children: u.jsxs("div", {
      className: "round-scoring-main",
      children: [
        u.jsx("div", { className: "corner-decoration corner-top-left" }),
        u.jsx("div", { className: "corner-decoration corner-top-right" }),
        u.jsx("div", { className: "corner-decoration corner-bottom-left" }),
        u.jsx("div", { className: "corner-decoration corner-bottom-right" }),
        u.jsxs("div", {
          className: "main-content",
          children: [
            u.jsx("h1", {
              className: "main-title",
              children: "⚜️ Royal Scoring Chronicles ⚜️",
            }),
            u.jsxs("div", {
              className: "content-layout",
              children: [
                u.jsxs("div", {
                  className: "main-column",
                  children: [
                    v &&
                      u.jsxs("div", {
                        className: "round-winner-section",
                        children: [
                          v.winners && v.winners.length > 1
                            ? u.jsxs("h2", {
                                className: "round-winner-title",
                                children: [
                                  "🎉 Round ",
                                  v.roundNumber,
                                  " Winners:",
                                  " ",
                                  u.jsxs("span", {
                                    className: "round-winner-name",
                                    children: [
                                      ((O = v.winnerNames) == null
                                        ? void 0
                                        : O.join(", ")) || v.winners.join(", "),
                                      " ",
                                      "🎉",
                                    ],
                                  }),
                                ],
                              })
                            : u.jsxs("h2", {
                                className: "round-winner-title",
                                children: [
                                  "🎉 Round ",
                                  v.roundNumber,
                                  " Winner:",
                                  " ",
                                  u.jsxs("span", {
                                    className: "round-winner-name",
                                    children: [
                                      ((A = v.winnerNames) == null
                                        ? void 0
                                        : A[0]) ||
                                        v.winnerName ||
                                        v.winner,
                                      " ",
                                      "🎉",
                                    ],
                                  }),
                                ],
                              }),
                          u.jsxs("div", {
                            className: "victory-type",
                            children: [
                              u.jsx("span", {
                                className: "victory-type-label",
                                children: "Victory Type:",
                              }),
                              " ",
                              u.jsx("span", {
                                className: "victory-type-value",
                                children:
                                  v.type === "lastPlayerStanding"
                                    ? "⚔️ Last Noble Standing"
                                    : "🃏 Highest Card (Deck Exhausted)",
                              }),
                            ],
                          }),
                        ],
                      }),
                    u.jsxs("div", {
                      className: "leaderboard-section",
                      children: [
                        u.jsx("h3", {
                          className: "leaderboard-title",
                          children: "💝 Love Tokens Leaderboard 💝",
                        }),
                        u.jsx("div", {
                          className: "leaderboard-list",
                          children: C.map((M, P) => {
                            const B = y(M),
                              V = M.name === r;
                            return u.jsxs(
                              "div",
                              {
                                className: `player-row ${
                                  P === 0 ? "winner" : "regular"
                                }`,
                                children: [
                                  u.jsxs("div", {
                                    className: "player-info-section",
                                    children: [
                                      u.jsx("span", {
                                        className: `player-rank ${
                                          P === 0 ? "winner" : "regular"
                                        }`,
                                        children: P === 0 ? "👑" : `${P + 1}.`,
                                      }),
                                      u.jsxs("div", {
                                        className: "player-names",
                                        children: [
                                          u.jsxs("div", {
                                            className: "player-nickname",
                                            children: [
                                              B.primary,
                                              V &&
                                                u.jsx("span", {
                                                  className:
                                                    "player-you-indicator",
                                                  children: "(You)",
                                                }),
                                            ],
                                          }),
                                          B.secondary &&
                                            u.jsx("div", {
                                              className: "player-realname",
                                              children: B.secondary,
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  u.jsxs("div", {
                                    className: "player-actions",
                                    children: [
                                      u.jsxs("span", {
                                        className: "love-tokens",
                                        children: [
                                          M.tokens || 0,
                                          " love token",
                                          (M.tokens || 0) !== 1 ? "s" : "",
                                        ],
                                      }),
                                      _ &&
                                        M.name !== r &&
                                        u.jsx("button", {
                                          onClick: () => p(M.name),
                                          className: "banish-button",
                                          title: `Banish ${M.name} from the realm`,
                                          children: "⚔️ Banish",
                                        }),
                                    ],
                                  }),
                                ],
                              },
                              M.name
                            );
                          }),
                        }),
                      ],
                    }),
                    _ &&
                      u.jsxs("div", {
                        className: "host-actions",
                        children: [
                          u.jsx("button", {
                            onClick: h,
                            className: "action-button new-round-button",
                            children: "🎮 Commence New Round",
                          }),
                          u.jsx("button", {
                            onClick: g,
                            className: "action-button end-game-button",
                            children: "🏁 End Royal Tournament",
                          }),
                        ],
                      }),
                    !_ &&
                      u.jsx("div", {
                        className: "waiting-message",
                        children:
                          "🕰️ Awaiting the host's royal decree to begin the next round or conclude the tournament...",
                      }),
                  ],
                }),
                u.jsx("div", {
                  className: "side-column",
                  children:
                    x &&
                    u.jsxs("div", {
                      className: "hidden-card-section",
                      children: [
                        u.jsx("div", {
                          className: "hidden-card-label",
                          children: "🤫 COURT SECRET 🤫",
                        }),
                        u.jsx("h3", {
                          className: "hidden-card-title",
                          children: "🃏 The Hidden Card Revealed 🃏",
                        }),
                        u.jsxs("div", {
                          className: "hidden-card-details",
                          children: [
                            u.jsx("div", {
                              className: "hidden-card-name",
                              children: x.name,
                            }),
                            u.jsxs("div", {
                              className: "hidden-card-info",
                              children: [
                                "Strength: ",
                                x.strength,
                                " |",
                                " ",
                                u.jsx("em", { children: x.effect }),
                              ],
                            }),
                          ],
                        }),
                        u.jsx("p", {
                          className: "hidden-card-flavor",
                          children:
                            "This card was secretly discarded at the round's beginning...",
                        }),
                      ],
                    }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function rN() {
  var _;
  const { id: t } = El(),
    { state: e } = cr(),
    n = os(),
    r = e == null ? void 0 : e.nickname;
  e == null || e.realName;
  const [s, i] = N.useState(null),
    [o, l] = N.useState(!0),
    [a, c] = N.useState(!1),
    [d, h] = N.useState([]);
  N.useEffect(() => {
    const C = setTimeout(() => c(!0), 300);
    return () => clearTimeout(C);
  }, []),
    N.useEffect(() => {
      if (!t) return;
      const C = L($, `rooms/${t}`),
        x = mt(C, (O) => {
          const A = O.val();
          console.log("🏆 GameScoring - Room data received:", A),
            A && i(A),
            l(!1);
        });
      return () => x();
    }, [t]),
    N.useEffect(() => {
      if (!t) return;
      const C = L($, `rooms/${t}/notifications`),
        x = mt(C, (O) => {
          const A = O.val();
          A && h(Object.values(A));
        });
      return () => x();
    }, [t]),
    N.useEffect(() => {
      !o &&
        (!s || s.gameState !== "gameEnd") &&
        (console.log("🏆 GameScoring - Invalid state, redirecting to landing"),
        n("/"));
    }, [s, o, n]);
  const f = async () => {
      if (!(!s || s.host !== r))
        try {
          console.log("🏰 Host ending game session and returning to landing");
          const C = {
              gameState: "returnToLanding",
              redirectMessage:
                "🏰 The royal tournament has concluded! Returning to the royal court...",
            },
            x = L($, `rooms/${t}`);
          await X(x, C),
            setTimeout(() => {
              n("/create");
            }, 1500);
        } catch (C) {
          console.error("❌ Error returning to landing:", C);
        }
    },
    p = () =>
      s != null && s.players
        ? Object.entries(s.players)
            .sort(([, C], [, x]) => (x.tokens || 0) - (C.tokens || 0))
            .map(([C, x]) => ({ name: C, ...x }))
        : [],
    g = (C) => {
      const x = C.name,
        O = C.realName;
      return x && O && x !== O
        ? { primary: x, secondary: O }
        : { primary: x || O, secondary: null };
    },
    w = () => {
      const C = p();
      if (C.length === 0) return null;
      const O = C[0].tokens || 0,
        A = C.filter((M) => (M.tokens || 0) === O);
      return { istie: A.length > 1, winners: A, maxTokens: O };
    };
  if (
    (N.useEffect(() => {
      (s == null ? void 0 : s.gameState) === "returnToLanding" &&
        setTimeout(() => {
          n("/");
        }, 2e3);
    }, [s == null ? void 0 : s.gameState, n]),
    o)
  )
    return u.jsx("div", {
      className: "game-scoring-loading",
      children: u.jsx("div", {
        className: "loading-spinner",
        children: "⏳ Preparing the royal coronation ceremony...",
      }),
    });
  if (!s)
    return u.jsx("div", {
      className: "game-scoring-loading",
      children: u.jsx("div", {
        className: "loading-spinner",
        children: "❌ The royal court has vanished into the mists...",
      }),
    });
  const E = w(),
    y = s.host === r,
    m = p(),
    v = ((_ = s.gameStats) == null ? void 0 : _.totalRoundsPlayed) || 0;
  return s.gameState === "returnToLanding"
    ? u.jsx("div", {
        className: "game-scoring-container redirect-message",
        children: u.jsxs("div", {
          className: "redirect-content",
          children: [
            u.jsx("h1", { children: "🏰 Royal Tournament Concluded" }),
            u.jsx("p", { children: s.redirectMessage }),
            u.jsx("div", { className: "loading-spinner", children: "⏳" }),
          ],
        }),
      })
    : u.jsx("div", {
        className: `game-scoring-container ${a ? "fade-in" : ""}`,
        children: u.jsxs("div", {
          className: "game-scoring-main",
          children: [
            u.jsx("div", {
              className: "royal-decoration royal-top-left",
              children: "👑",
            }),
            u.jsx("div", {
              className: "royal-decoration royal-top-right",
              children: "👑",
            }),
            u.jsx("div", {
              className: "royal-decoration royal-bottom-left",
              children: "⚜️",
            }),
            u.jsx("div", {
              className: "royal-decoration royal-bottom-right",
              children: "⚜️",
            }),
            u.jsxs("div", {
              className: "content-layout",
              children: [
                u.jsxs("div", {
                  className: "main-column",
                  children: [
                    u.jsxs("div", {
                      className: "epic-header",
                      children: [
                        u.jsx("h1", {
                          className: "royal-title",
                          children: "🏰 ROYAL TOURNAMENT FINALE 🏰",
                        }),
                        u.jsx("div", {
                          className: "epic-subtitle",
                          children:
                            "⚔️ The Battle for the Princess's Heart Has Concluded ⚔️",
                        }),
                      ],
                    }),
                    E &&
                      u.jsx("div", {
                        className: "winner-announcement",
                        children: E.istie
                          ? u.jsxs(u.Fragment, {
                              children: [
                                u.jsx("h2", {
                                  className: "winner-title",
                                  children: "👑 ROYAL TIE! 👑",
                                }),
                                u.jsxs("div", {
                                  className: "winner-text",
                                  children: [
                                    "Multiple suitors have won the Princess's heart with",
                                    " ",
                                    u.jsx("span", {
                                      className: "token-count",
                                      children: E.maxTokens,
                                    }),
                                    " ",
                                    "love tokens each:",
                                  ],
                                }),
                                u.jsx("div", {
                                  className: "winners-list",
                                  children: E.winners.map((C, x) => {
                                    const O = g(C);
                                    return u.jsxs(
                                      "div",
                                      {
                                        className: "winner-name",
                                        children: [
                                          "🎭 ",
                                          O.primary,
                                          O.secondary &&
                                            u.jsxs("span", {
                                              className: "winner-real-name",
                                              children: [
                                                " ",
                                                "(",
                                                O.secondary,
                                                ")",
                                              ],
                                            }),
                                        ],
                                      },
                                      C.name
                                    );
                                  }),
                                }),
                                u.jsx("div", {
                                  className: "epic-phrase",
                                  children:
                                    '"In matters of the heart, even the wisest Princess cannot choose between such worthy suitors! A royal wedding feast shall honor them all!"',
                                }),
                              ],
                            })
                          : u.jsxs(u.Fragment, {
                              children: [
                                u.jsx("h2", {
                                  className: "winner-title",
                                  children: "👑 BEHOLD THE CHAMPION! 👑",
                                }),
                                (() => {
                                  const C = E.winners[0],
                                    x = g(C);
                                  return u.jsxs(u.Fragment, {
                                    children: [
                                      u.jsxs("div", {
                                        className: "winner-text",
                                        children: [
                                          "The Princess's heart belongs to:",
                                          " ",
                                          u.jsx("span", {
                                            className: "champion-name",
                                            children: x.primary,
                                          }),
                                          x.secondary &&
                                            u.jsxs("span", {
                                              className: "champion-real-name",
                                              children: [
                                                " ",
                                                "(",
                                                x.secondary,
                                                ")",
                                              ],
                                            }),
                                        ],
                                      }),
                                      u.jsxs("div", {
                                        className: "token-display",
                                        children: [
                                          "With",
                                          " ",
                                          u.jsx("span", {
                                            className: "token-count",
                                            children: E.maxTokens,
                                          }),
                                          " ",
                                          "precious love tokens!",
                                        ],
                                      }),
                                      u.jsx("div", {
                                        className: "epic-phrase",
                                        children: `"Through wit, charm, and noble deeds, our champion has proven worthy of the Princess's hand. Let the royal wedding bells ring throughout the kingdom!"`,
                                      }),
                                    ],
                                  });
                                })(),
                              ],
                            }),
                      }),
                    u.jsxs("div", {
                      className: "final-leaderboard",
                      children: [
                        u.jsx("h3", {
                          className: "leaderboard-title",
                          children: "🏆 Final Court Rankings 🏆",
                        }),
                        u.jsx("div", {
                          className: "leaderboard-list",
                          children: m.map((C, x) => {
                            const O = g(C),
                              A = C.name === r,
                              M = E && E.winners.some((P) => P.name === C.name);
                            return u.jsxs(
                              "div",
                              {
                                className: `final-player-row ${
                                  x === 0 ? "champion" : "noble"
                                } ${M ? "winner" : ""}`,
                                children: [
                                  u.jsxs("div", {
                                    className: "player-rank-section",
                                    children: [
                                      u.jsx("span", {
                                        className: "player-rank",
                                        children:
                                          x === 0
                                            ? "👑"
                                            : x === 1
                                            ? "🥈"
                                            : x === 2
                                            ? "🥉"
                                            : `${x + 1}.`,
                                      }),
                                      u.jsxs("div", {
                                        className: "player-names",
                                        children: [
                                          u.jsxs("div", {
                                            className: "player-nickname",
                                            children: [
                                              O.primary,
                                              A &&
                                                u.jsx("span", {
                                                  className:
                                                    "player-you-indicator",
                                                  children: "(You)",
                                                }),
                                            ],
                                          }),
                                          O.secondary &&
                                            u.jsx("div", {
                                              className: "player-realname",
                                              children: O.secondary,
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  u.jsxs("div", {
                                    className: "player-score",
                                    children: [
                                      u.jsxs("span", {
                                        className: "final-tokens",
                                        children: [
                                          C.tokens || 0,
                                          " love token",
                                          (C.tokens || 0) !== 1 ? "s" : "",
                                        ],
                                      }),
                                      M &&
                                        u.jsx("span", {
                                          className: "winner-badge",
                                          children: "👑 Champion",
                                        }),
                                    ],
                                  }),
                                ],
                              },
                              C.name
                            );
                          }),
                        }),
                      ],
                    }),
                    y &&
                      u.jsxs("div", {
                        className: "host-final-actions",
                        children: [
                          u.jsx("button", {
                            onClick: f,
                            className: "return-to-court-button",
                            children: "🏰 Return to Royal Court",
                          }),
                          u.jsx("div", {
                            className: "host-note",
                            children:
                              "This will redirect all players back to the main court",
                          }),
                        ],
                      }),
                    !y &&
                      u.jsx("div", {
                        className: "awaiting-host-message",
                        children:
                          "🕰️ Awaiting the host's command to return to the royal court...",
                      }),
                  ],
                }),
                u.jsx("div", {
                  className: "side-column",
                  children: u.jsxs("div", {
                    className: "princess-wedding",
                    children: [
                      u.jsxs("div", {
                        className: "wedding-frame",
                        children: [
                          u.jsx("div", { className: "princess-image" }),
                          u.jsx("div", {
                            className: "wedding-caption",
                            children: "💐 The Princess awaits her champion 💐",
                          }),
                        ],
                      }),
                      u.jsxs("div", {
                        className: "tournament-summary",
                        children: [
                          u.jsx("h3", {
                            className: "summary-title",
                            children: "⚔️ Tournament Chronicle ⚔️",
                          }),
                          u.jsxs("div", {
                            className: "summary-stats",
                            children: [
                              u.jsxs("div", {
                                className: "stat-item",
                                children: [
                                  u.jsx("span", {
                                    className: "stat-label",
                                    children: "Total Rounds Played:",
                                  }),
                                  u.jsx("span", {
                                    className: "stat-value",
                                    children: v,
                                  }),
                                ],
                              }),
                              u.jsxs("div", {
                                className: "stat-item",
                                children: [
                                  u.jsx("span", {
                                    className: "stat-label",
                                    children: "Noble Participants:",
                                  }),
                                  u.jsx("span", {
                                    className: "stat-value",
                                    children: m.length,
                                  }),
                                ],
                              }),
                              u.jsxs("div", {
                                className: "stat-item",
                                children: [
                                  u.jsx("span", {
                                    className: "stat-label",
                                    children: "Game Mode:",
                                  }),
                                  u.jsx("span", {
                                    className: "stat-value",
                                    children:
                                      s.mode === "premium"
                                        ? "👑 Premium Court"
                                        : "🏰 Royal Court",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      });
}
function sN() {
  return u.jsx(_w, {
    children: u.jsxs(gw, {
      children: [
        u.jsx(Un, { path: "/", element: u.jsx(d1, {}) }),
        u.jsx(Un, { path: "/create", element: u.jsx(p1, {}) }),
        u.jsx(Un, { path: "/room/:id", element: u.jsx(g1, {}) }),
        u.jsx(Un, { path: "/play/:id", element: u.jsx(tN, {}) }),
        u.jsx(Un, { path: "/round_scoring/:id", element: u.jsx(nN, {}) }),
        u.jsx(Un, { path: "/game_scoring/:id", element: u.jsx(rN, {}) }),
      ],
    }),
  });
}
Sa.createRoot(document.getElementById("root")).render(
  u.jsx(Hc.StrictMode, { children: u.jsx(sN, {}) })
);
