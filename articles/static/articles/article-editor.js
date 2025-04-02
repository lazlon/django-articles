var cl = Object.defineProperty;
var dl = (o, e, t) => e in o ? cl(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var j = (o, e, t) => dl(o, typeof e != "symbol" ? e + "" : e, t);
const ul = (o, e) => o === e, we = Symbol("solid-proxy"), Qi = typeof Proxy == "function", Jo = Symbol("solid-track"), eo = {
  equals: ul
};
let es = ss;
const De = 1, to = 2, ts = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Z = null;
let $o = null, hl = null, V = null, ae = null, Oe = null, bo = 0;
function Kt(o, e) {
  const t = V, n = Z, r = o.length === 0, i = e === void 0 ? n : e, s = r ? ts : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, a = r ? o : () => o(() => He(() => Ot(s)));
  Z = s, V = null;
  try {
    return pt(a, !0);
  } finally {
    V = t, Z = n;
  }
}
function Me(o, e) {
  e = e ? Object.assign({}, eo, e) : eo;
  const t = {
    value: o,
    observers: null,
    observerSlots: null,
    comparator: e.equals || void 0
  }, n = (r) => (typeof r == "function" && (r = r(t.value)), is(t, r));
  return [rs.bind(t), n];
}
function q(o, e, t) {
  const n = fn(o, e, !1, De);
  $t(n);
}
function os(o, e, t) {
  es = bl;
  const n = fn(o, e, !1, De);
  n.user = !0, Oe ? Oe.push(n) : $t(n);
}
function Q(o, e, t) {
  t = t ? Object.assign({}, eo, t) : eo;
  const n = fn(o, e, !0, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = t.equals || void 0, $t(n), rs.bind(n);
}
function pl(o) {
  return pt(o, !1);
}
function He(o) {
  if (V === null) return o();
  const e = V;
  V = null;
  try {
    return o();
  } finally {
    V = e;
  }
}
function ns(o) {
  os(() => He(o));
}
function fl(o) {
  return Z === null || (Z.cleanups === null ? Z.cleanups = [o] : Z.cleanups.push(o)), o;
}
function Qo() {
  return V;
}
function ge() {
  return Z;
}
function rs() {
  if (this.sources && this.state)
    if (this.state === De) $t(this);
    else {
      const o = ae;
      ae = null, pt(() => no(this), !1), ae = o;
    }
  if (V) {
    const o = this.observers ? this.observers.length : 0;
    V.sources ? (V.sources.push(this), V.sourceSlots.push(o)) : (V.sources = [this], V.sourceSlots = [o]), this.observers ? (this.observers.push(V), this.observerSlots.push(V.sources.length - 1)) : (this.observers = [V], this.observerSlots = [V.sources.length - 1]);
  }
  return this.value;
}
function is(o, e, t) {
  let n = o.value;
  return (!o.comparator || !o.comparator(n, e)) && (o.value = e, o.observers && o.observers.length && pt(() => {
    for (let r = 0; r < o.observers.length; r += 1) {
      const i = o.observers[r], s = $o && $o.running;
      s && $o.disposed.has(i), (s ? !i.tState : !i.state) && (i.pure ? ae.push(i) : Oe.push(i), i.observers && as(i)), s || (i.state = De);
    }
    if (ae.length > 1e6)
      throw ae = [], new Error();
  }, !1)), e;
}
function $t(o) {
  if (!o.fn) return;
  Ot(o);
  const e = bo;
  gl(
    o,
    o.value,
    e
  );
}
function gl(o, e, t) {
  let n;
  const r = Z, i = V;
  V = Z = o;
  try {
    n = o.fn(e);
  } catch (s) {
    return o.pure && (o.state = De, o.owned && o.owned.forEach(Ot), o.owned = null), o.updatedAt = t + 1, ls(s);
  } finally {
    V = i, Z = r;
  }
  (!o.updatedAt || o.updatedAt <= t) && (o.updatedAt != null && "observers" in o ? is(o, n) : o.value = n, o.updatedAt = t);
}
function fn(o, e, t, n = De, r) {
  const i = {
    fn: o,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: Z,
    context: Z ? Z.context : null,
    pure: t
  };
  return Z === null || Z !== ts && (Z.owned ? Z.owned.push(i) : Z.owned = [i]), i;
}
function oo(o) {
  if (o.state === 0) return;
  if (o.state === to) return no(o);
  if (o.suspense && He(o.suspense.inFallback)) return o.suspense.effects.push(o);
  const e = [o];
  for (; (o = o.owner) && (!o.updatedAt || o.updatedAt < bo); )
    o.state && e.push(o);
  for (let t = e.length - 1; t >= 0; t--)
    if (o = e[t], o.state === De)
      $t(o);
    else if (o.state === to) {
      const n = ae;
      ae = null, pt(() => no(o, e[0]), !1), ae = n;
    }
}
function pt(o, e) {
  if (ae) return o();
  let t = !1;
  e || (ae = []), Oe ? t = !0 : Oe = [], bo++;
  try {
    const n = o();
    return ml(t), n;
  } catch (n) {
    t || (Oe = null), ae = null, ls(n);
  }
}
function ml(o) {
  if (ae && (ss(ae), ae = null), o) return;
  const e = Oe;
  Oe = null, e.length && pt(() => es(e), !1);
}
function ss(o) {
  for (let e = 0; e < o.length; e++) oo(o[e]);
}
function bl(o) {
  let e, t = 0;
  for (e = 0; e < o.length; e++) {
    const n = o[e];
    n.user ? o[t++] = n : oo(n);
  }
  for (e = 0; e < t; e++) oo(o[e]);
}
function no(o, e) {
  o.state = 0;
  for (let t = 0; t < o.sources.length; t += 1) {
    const n = o.sources[t];
    if (n.sources) {
      const r = n.state;
      r === De ? n !== e && (!n.updatedAt || n.updatedAt < bo) && oo(n) : r === to && no(n, e);
    }
  }
}
function as(o) {
  for (let e = 0; e < o.observers.length; e += 1) {
    const t = o.observers[e];
    t.state || (t.state = to, t.pure ? ae.push(t) : Oe.push(t), t.observers && as(t));
  }
}
function Ot(o) {
  let e;
  if (o.sources)
    for (; o.sources.length; ) {
      const t = o.sources.pop(), n = o.sourceSlots.pop(), r = t.observers;
      if (r && r.length) {
        const i = r.pop(), s = t.observerSlots.pop();
        n < r.length && (i.sourceSlots[s] = n, r[n] = i, t.observerSlots[n] = s);
      }
    }
  if (o.tOwned) {
    for (e = o.tOwned.length - 1; e >= 0; e--) Ot(o.tOwned[e]);
    delete o.tOwned;
  }
  if (o.owned) {
    for (e = o.owned.length - 1; e >= 0; e--) Ot(o.owned[e]);
    o.owned = null;
  }
  if (o.cleanups) {
    for (e = o.cleanups.length - 1; e >= 0; e--) o.cleanups[e]();
    o.cleanups = null;
  }
  o.state = 0;
}
function vl(o) {
  return o instanceof Error ? o : new Error(typeof o == "string" ? o : "Unknown error", {
    cause: o
  });
}
function ls(o, e = Z) {
  throw vl(o);
}
const yl = Symbol("fallback");
function hi(o) {
  for (let e = 0; e < o.length; e++) o[e]();
}
function kl(o, e, t = {}) {
  let n = [], r = [], i = [], s = 0, a = e.length > 1 ? [] : null;
  return fl(() => hi(i)), () => {
    let l = o() || [], c = l.length, d, u;
    return l[Jo], He(() => {
      let g, f, b, N, M, _, H, E, C;
      if (c === 0)
        s !== 0 && (hi(i), i = [], n = [], r = [], s = 0, a && (a = [])), t.fallback && (n = [yl], r[0] = Kt((G) => (i[0] = G, t.fallback())), s = 1);
      else if (s === 0) {
        for (r = new Array(c), u = 0; u < c; u++)
          n[u] = l[u], r[u] = Kt(h);
        s = c;
      } else {
        for (b = new Array(c), N = new Array(c), a && (M = new Array(c)), _ = 0, H = Math.min(s, c); _ < H && n[_] === l[_]; _++) ;
        for (H = s - 1, E = c - 1; H >= _ && E >= _ && n[H] === l[E]; H--, E--)
          b[E] = r[H], N[E] = i[H], a && (M[E] = a[H]);
        for (g = /* @__PURE__ */ new Map(), f = new Array(E + 1), u = E; u >= _; u--)
          C = l[u], d = g.get(C), f[u] = d === void 0 ? -1 : d, g.set(C, u);
        for (d = _; d <= H; d++)
          C = n[d], u = g.get(C), u !== void 0 && u !== -1 ? (b[u] = r[d], N[u] = i[d], a && (M[u] = a[d]), u = f[u], g.set(C, u)) : i[d]();
        for (u = _; u < c; u++)
          u in b ? (r[u] = b[u], i[u] = N[u], a && (a[u] = M[u], a[u](u))) : r[u] = Kt(h);
        r = r.slice(0, s = c), n = l.slice(0);
      }
      return r;
    });
    function h(g) {
      if (i[u] = g, a) {
        const [f, b] = Me(u);
        return a[u] = b, e(l[u], f);
      }
      return e(l[u]);
    }
  };
}
function m(o, e) {
  return He(() => o(e || {}));
}
function Ft() {
  return !0;
}
const en = {
  get(o, e, t) {
    return e === we ? t : o.get(e);
  },
  has(o, e) {
    return e === we ? !0 : o.has(e);
  },
  set: Ft,
  deleteProperty: Ft,
  getOwnPropertyDescriptor(o, e) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return o.get(e);
      },
      set: Ft,
      deleteProperty: Ft
    };
  },
  ownKeys(o) {
    return o.keys();
  }
};
function jo(o) {
  return (o = typeof o == "function" ? o() : o) ? o : {};
}
function wl() {
  for (let o = 0, e = this.length; o < e; ++o) {
    const t = this[o]();
    if (t !== void 0) return t;
  }
}
function R(...o) {
  let e = !1;
  for (let s = 0; s < o.length; s++) {
    const a = o[s];
    e = e || !!a && we in a, o[s] = typeof a == "function" ? (e = !0, Q(a)) : a;
  }
  if (Qi && e)
    return new Proxy(
      {
        get(s) {
          for (let a = o.length - 1; a >= 0; a--) {
            const l = jo(o[a])[s];
            if (l !== void 0) return l;
          }
        },
        has(s) {
          for (let a = o.length - 1; a >= 0; a--)
            if (s in jo(o[a])) return !0;
          return !1;
        },
        keys() {
          const s = [];
          for (let a = 0; a < o.length; a++)
            s.push(...Object.keys(jo(o[a])));
          return [...new Set(s)];
        }
      },
      en
    );
  const t = {}, n = /* @__PURE__ */ Object.create(null);
  for (let s = o.length - 1; s >= 0; s--) {
    const a = o[s];
    if (!a) continue;
    const l = Object.getOwnPropertyNames(a);
    for (let c = l.length - 1; c >= 0; c--) {
      const d = l[c];
      if (d === "__proto__" || d === "constructor") continue;
      const u = Object.getOwnPropertyDescriptor(a, d);
      if (!n[d])
        n[d] = u.get ? {
          enumerable: !0,
          configurable: !0,
          get: wl.bind(t[d] = [u.get.bind(a)])
        } : u.value !== void 0 ? u : void 0;
      else {
        const h = t[d];
        h && (u.get ? h.push(u.get.bind(a)) : u.value !== void 0 && h.push(() => u.value));
      }
    }
  }
  const r = {}, i = Object.keys(n);
  for (let s = i.length - 1; s >= 0; s--) {
    const a = i[s], l = n[a];
    l && l.get ? Object.defineProperty(r, a, l) : r[a] = l ? l.value : void 0;
  }
  return r;
}
function cs(o, ...e) {
  if (Qi && we in o) {
    const r = new Set(e.length > 1 ? e.flat() : e[0]), i = e.map((s) => new Proxy(
      {
        get(a) {
          return s.includes(a) ? o[a] : void 0;
        },
        has(a) {
          return s.includes(a) && a in o;
        },
        keys() {
          return s.filter((a) => a in o);
        }
      },
      en
    ));
    return i.push(
      new Proxy(
        {
          get(s) {
            return r.has(s) ? void 0 : o[s];
          },
          has(s) {
            return r.has(s) ? !1 : s in o;
          },
          keys() {
            return Object.keys(o).filter((s) => !r.has(s));
          }
        },
        en
      )
    ), i;
  }
  const t = {}, n = e.map(() => ({}));
  for (const r of Object.getOwnPropertyNames(o)) {
    const i = Object.getOwnPropertyDescriptor(o, r), s = !i.get && !i.set && i.enumerable && i.writable && i.configurable;
    let a = !1, l = 0;
    for (const c of e)
      c.includes(r) && (a = !0, s ? n[l][r] = i.value : Object.defineProperty(n[l], r, i)), ++l;
    a || (s ? t[r] = i.value : Object.defineProperty(t, r, i));
  }
  return [...n, t];
}
function ds(o) {
  const e = "fallback" in o && {
    fallback: () => o.fallback
  };
  return Q(kl(() => o.each, o.children, e || void 0));
}
const xl = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
], Cl = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...xl
]), El = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]), Sl = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), Tl = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function Bl(o, e) {
  const t = Tl[o];
  return typeof t == "object" ? t[e] ? t.$ : void 0 : t;
}
const _l = /* @__PURE__ */ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
]), Ol = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]), Ml = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
function Il(o, e, t) {
  let n = t.length, r = e.length, i = n, s = 0, a = 0, l = e[r - 1].nextSibling, c = null;
  for (; s < r || a < i; ) {
    if (e[s] === t[a]) {
      s++, a++;
      continue;
    }
    for (; e[r - 1] === t[i - 1]; )
      r--, i--;
    if (r === s) {
      const d = i < n ? a ? t[a - 1].nextSibling : t[i - a] : l;
      for (; a < i; ) o.insertBefore(t[a++], d);
    } else if (i === a)
      for (; s < r; )
        (!c || !c.has(e[s])) && e[s].remove(), s++;
    else if (e[s] === t[i - 1] && t[a] === e[r - 1]) {
      const d = e[--r].nextSibling;
      o.insertBefore(t[a++], e[s++].nextSibling), o.insertBefore(t[--i], d), e[r] = t[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let u = a;
        for (; u < i; ) c.set(t[u], u++);
      }
      const d = c.get(e[s]);
      if (d != null)
        if (a < d && d < i) {
          let u = s, h = 1, g;
          for (; ++u < r && u < i && !((g = c.get(e[u])) == null || g !== d + h); )
            h++;
          if (h > d - a) {
            const f = e[s];
            for (; a < d; ) o.insertBefore(t[a++], f);
          } else o.replaceChild(t[a++], e[s++]);
        } else s++;
      else e[s++].remove();
    }
  }
}
const pi = "_$DX_DELEGATE";
function ft(o, e, t, n = {}) {
  let r;
  return Kt((i) => {
    r = i, e === document ? o() : k(e, o(), e.firstChild ? null : void 0, t);
  }, n.owner), () => {
    r(), e.textContent = "";
  };
}
function y(o, e, t, n) {
  let r;
  const i = () => {
    const a = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
    return a.innerHTML = o, t ? a.content.firstChild.firstChild : n ? a.firstChild : a.content.firstChild;
  }, s = e ? () => He(() => document.importNode(r || (r = i()), !0)) : () => (r || (r = i())).cloneNode(!0);
  return s.cloneNode = s, s;
}
function Je(o, e = window.document) {
  const t = e[pi] || (e[pi] = /* @__PURE__ */ new Set());
  for (let n = 0, r = o.length; n < r; n++) {
    const i = o[n];
    t.has(i) || (t.add(i), e.addEventListener(i, jl));
  }
}
function A(o, e, t) {
  t == null ? o.removeAttribute(e) : o.setAttribute(e, t);
}
function Ll(o, e, t, n) {
  n == null ? o.removeAttributeNS(e, t) : o.setAttributeNS(e, t, n);
}
function Al(o, e, t) {
  t ? o.setAttribute(e, "") : o.removeAttribute(e);
}
function Qe(o, e) {
  e == null ? o.removeAttribute("class") : o.className = e;
}
function us(o, e, t, n) {
  if (n)
    Array.isArray(t) ? (o[`$$${e}`] = t[0], o[`$$${e}Data`] = t[1]) : o[`$$${e}`] = t;
  else if (Array.isArray(t)) {
    const r = t[0];
    o.addEventListener(e, t[0] = (i) => r.call(o, t[1], i));
  } else o.addEventListener(e, t, typeof t != "function" && t);
}
function Pl(o, e, t = {}) {
  const n = Object.keys(e || {}), r = Object.keys(t);
  let i, s;
  for (i = 0, s = r.length; i < s; i++) {
    const a = r[i];
    !a || a === "undefined" || e[a] || (fi(o, a, !1), delete t[a]);
  }
  for (i = 0, s = n.length; i < s; i++) {
    const a = n[i], l = !!e[a];
    !a || a === "undefined" || t[a] === l || !l || (fi(o, a, !0), t[a] = l);
  }
  return t;
}
function hs(o, e, t) {
  if (!e) return t ? A(o, "style") : e;
  const n = o.style;
  if (typeof e == "string") return n.cssText = e;
  typeof t == "string" && (n.cssText = t = void 0), t || (t = {}), e || (e = {});
  let r, i;
  for (i in t)
    e[i] == null && n.removeProperty(i), delete t[i];
  for (i in e)
    r = e[i], r !== t[i] && (n.setProperty(i, r), t[i] = r);
  return t;
}
function gn(o, e = {}, t, n) {
  const r = {};
  return n || q(
    () => r.children = It(o, e.children, r.children)
  ), q(() => typeof e.ref == "function" && Mt(e.ref, o)), q(() => Nl(o, e, t, !0, r, !0)), r;
}
function Mt(o, e, t) {
  return He(() => o(e, t));
}
function k(o, e, t, n) {
  if (t !== void 0 && !n && (n = []), typeof e != "function") return It(o, e, n, t);
  q((r) => It(o, e(), r, t), n);
}
function Nl(o, e, t, n, r = {}, i = !1) {
  e || (e = {});
  for (const s in r)
    if (!(s in e)) {
      if (s === "children") continue;
      r[s] = gi(o, s, null, r[s], t, i, e);
    }
  for (const s in e) {
    if (s === "children")
      continue;
    const a = e[s];
    r[s] = gi(o, s, a, r[s], t, i, e);
  }
}
function $l(o) {
  return o.toLowerCase().replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function fi(o, e, t) {
  const n = e.trim().split(/\s+/);
  for (let r = 0, i = n.length; r < i; r++)
    o.classList.toggle(n[r], t);
}
function gi(o, e, t, n, r, i, s) {
  let a, l, c, d, u;
  if (e === "style") return hs(o, t, n);
  if (e === "classList") return Pl(o, t, n);
  if (t === n) return n;
  if (e === "ref")
    i || t(o);
  else if (e.slice(0, 3) === "on:") {
    const h = e.slice(3);
    n && o.removeEventListener(h, n, typeof n != "function" && n), t && o.addEventListener(h, t, typeof t != "function" && t);
  } else if (e.slice(0, 10) === "oncapture:") {
    const h = e.slice(10);
    n && o.removeEventListener(h, n, !0), t && o.addEventListener(h, t, !0);
  } else if (e.slice(0, 2) === "on") {
    const h = e.slice(2).toLowerCase(), g = _l.has(h);
    if (!g && n) {
      const f = Array.isArray(n) ? n[0] : n;
      o.removeEventListener(h, f);
    }
    (g || t) && (us(o, h, t, g), g && Je([h]));
  } else if (e.slice(0, 5) === "attr:")
    A(o, e.slice(5), t);
  else if (e.slice(0, 5) === "bool:")
    Al(o, e.slice(5), t);
  else if ((u = e.slice(0, 5) === "prop:") || (c = El.has(e)) || !r && ((d = Bl(e, o.tagName)) || (l = Cl.has(e))) || (a = o.nodeName.includes("-") || "is" in s))
    u && (e = e.slice(5), l = !0), e === "class" || e === "className" ? Qe(o, t) : a && !l && !c ? o[$l(e)] = t : o[d || e] = t;
  else {
    const h = r && e.indexOf(":") > -1 && Ml[e.split(":")[0]];
    h ? Ll(o, h, e, t) : A(o, Sl[e] || e, t);
  }
  return t;
}
function jl(o) {
  let e = o.target;
  const t = `$$${o.type}`, n = o.target, r = o.currentTarget, i = (l) => Object.defineProperty(o, "target", {
    configurable: !0,
    value: l
  }), s = () => {
    const l = e[t];
    if (l && !e.disabled) {
      const c = e[`${t}Data`];
      if (c !== void 0 ? l.call(e, c, o) : l.call(e, o), o.cancelBubble) return;
    }
    return e.host && typeof e.host != "string" && !e.host._$host && e.contains(o.target) && i(e.host), !0;
  }, a = () => {
    for (; s() && (e = e._$host || e.parentNode || e.host); ) ;
  };
  if (Object.defineProperty(o, "currentTarget", {
    configurable: !0,
    get() {
      return e || document;
    }
  }), o.composedPath) {
    const l = o.composedPath();
    i(l[0]);
    for (let c = 0; c < l.length - 2 && (e = l[c], !!s()); c++) {
      if (e._$host) {
        e = e._$host, a();
        break;
      }
      if (e.parentNode === r)
        break;
    }
  } else a();
  i(n);
}
function It(o, e, t, n, r) {
  for (; typeof t == "function"; ) t = t();
  if (e === t) return t;
  const i = typeof e, s = n !== void 0;
  if (o = s && t[0] && t[0].parentNode || o, i === "string" || i === "number") {
    if (i === "number" && (e = e.toString(), e === t))
      return t;
    if (s) {
      let a = t[0];
      a && a.nodeType === 3 ? a.data !== e && (a.data = e) : a = document.createTextNode(e), t = rt(o, t, n, a);
    } else
      t !== "" && typeof t == "string" ? t = o.firstChild.data = e : t = o.textContent = e;
  } else if (e == null || i === "boolean")
    t = rt(o, t, n);
  else {
    if (i === "function")
      return q(() => {
        let a = e();
        for (; typeof a == "function"; ) a = a();
        t = It(o, a, t, n);
      }), () => t;
    if (Array.isArray(e)) {
      const a = [], l = t && Array.isArray(t);
      if (tn(a, e, t, r))
        return q(() => t = It(o, a, t, n, !0)), () => t;
      if (a.length === 0) {
        if (t = rt(o, t, n), s) return t;
      } else l ? t.length === 0 ? mi(o, a, n) : Il(o, t, a) : (t && rt(o), mi(o, a));
      t = a;
    } else if (e.nodeType) {
      if (Array.isArray(t)) {
        if (s) return t = rt(o, t, n, e);
        rt(o, t, null, e);
      } else t == null || t === "" || !o.firstChild ? o.appendChild(e) : o.replaceChild(e, o.firstChild);
      t = e;
    }
  }
  return t;
}
function tn(o, e, t, n) {
  let r = !1;
  for (let i = 0, s = e.length; i < s; i++) {
    let a = e[i], l = t && t[o.length], c;
    if (!(a == null || a === !0 || a === !1)) if ((c = typeof a) == "object" && a.nodeType)
      o.push(a);
    else if (Array.isArray(a))
      r = tn(o, a, l) || r;
    else if (c === "function")
      if (n) {
        for (; typeof a == "function"; ) a = a();
        r = tn(
          o,
          Array.isArray(a) ? a : [a],
          Array.isArray(l) ? l : [l]
        ) || r;
      } else
        o.push(a), r = !0;
    else {
      const d = String(a);
      l && l.nodeType === 3 && l.data === d ? o.push(l) : o.push(document.createTextNode(d));
    }
  }
  return r;
}
function mi(o, e, t = null) {
  for (let n = 0, r = e.length; n < r; n++) o.insertBefore(e[n], t);
}
function rt(o, e, t, n) {
  if (t === void 0) return o.textContent = "";
  const r = n || document.createTextNode("");
  if (e.length) {
    let i = !1;
    for (let s = e.length - 1; s >= 0; s--) {
      const a = e[s];
      if (r !== a) {
        const l = a.parentNode === o;
        !i && !s ? l ? o.replaceChild(r, a) : o.insertBefore(r, t) : l && a.remove();
      } else i = !0;
    }
  } else o.insertBefore(r, t);
  return [r];
}
const Rl = "http://www.w3.org/2000/svg";
function Dl(o, e = !1) {
  return e ? document.createElementNS(Rl, o) : document.createElement(o);
}
function Hl(o, e) {
  const t = Q(o);
  return Q(() => {
    const n = t();
    switch (typeof n) {
      case "function":
        return He(() => n(e));
      case "string":
        const r = Ol.has(n), i = Dl(n, r);
        return gn(i, e, r), i;
    }
  });
}
function Fl(o) {
  const [, e] = cs(o, ["component"]);
  return Hl(() => o.component, e);
}
(function() {
  try {
    if (typeof document < "u") {
      var o = document.createElement("style");
      o.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-block:only-of-type .ce-paragraph[data-placeholder-active]:empty:before,.ce-block:only-of-type .ce-paragraph[data-placeholder-active][data-empty=true]:before{content:attr(data-placeholder-active)}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")), document.head.appendChild(o);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const zl = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
function Ul(o) {
  const e = document.createElement("div");
  e.innerHTML = o.trim();
  const t = document.createDocumentFragment();
  return t.append(...Array.from(e.childNodes)), t;
}
/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
class mn {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data: e, config: t, api: n, readOnly: r }) {
    this.api = n, this.readOnly = r, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = t.placeholder ? t.placeholder : mn.DEFAULT_PLACEHOLDER, this._data = e ?? {}, this._element = null, this._preserveBlank = t.preserveBlank ?? !1;
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete" || !this._element)
      return;
    const { textContent: t } = this._element;
    t === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  drawView() {
    const e = document.createElement("DIV");
    return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = "false", e.dataset.placeholderActive = this.api.i18n.t(this._placeholder), this._data.text && (e.innerHTML = this._data.text), this.readOnly || (e.contentEditable = "true", e.addEventListener("keyup", this.onKeyUp)), e;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element = this.drawView(), this._element;
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {ParagraphData} data
   * @public
   */
  merge(e) {
    if (!this._element)
      return;
    this._data.text += e.text;
    const t = Ul(e.text);
    this._element.appendChild(t), this._element.normalize();
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return !(e.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(e) {
    return {
      text: e.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {HTMLPasteEvent} event - event with pasted data
   */
  onPaste(e) {
    const t = {
      text: e.detail.data.innerHTML
    };
    this._data = t, window.requestAnimationFrame(() => {
      this._element && (this._element.innerHTML = this._data.text || "");
    });
  }
  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   * @returns {ConversionConfig}
   */
  static get conversionConfig() {
    return {
      export: "text",
      // to convert Paragraph to other block, use 'text' property of saved data
      import: "text"
      // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }
  /**
   * Sanitizer rules
   * @returns {SanitizerConfig} - Edtior.js sanitizer config
   */
  static get sanitize() {
    return {
      text: {
        br: !0
      }
    };
  }
  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {PasteConfig} - Paragraph Paste Setting
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }
  /**
   * Icon and title for displaying at the Toolbox
   *
   * @returns {ToolboxConfig} - Paragraph Toolbox Setting
   */
  static get toolbox() {
    return {
      icon: zl,
      title: "Text"
    };
  }
}
const on = Symbol("store-raw"), dt = Symbol("store-node"), Be = Symbol("store-has"), ps = Symbol("store-self");
function fs(o) {
  let e = o[we];
  if (!e && (Object.defineProperty(o, we, {
    value: e = new Proxy(o, Kl)
  }), !Array.isArray(o))) {
    const t = Object.keys(o), n = Object.getOwnPropertyDescriptors(o);
    for (let r = 0, i = t.length; r < i; r++) {
      const s = t[r];
      n[s].get && Object.defineProperty(o, s, {
        enumerable: n[s].enumerable,
        get: n[s].get.bind(e)
      });
    }
  }
  return e;
}
function ro(o) {
  let e;
  return o != null && typeof o == "object" && (o[we] || !(e = Object.getPrototypeOf(o)) || e === Object.prototype || Array.isArray(o));
}
function Xe(o, e = /* @__PURE__ */ new Set()) {
  let t, n, r, i;
  if (t = o != null && o[on]) return t;
  if (!ro(o) || e.has(o)) return o;
  if (Array.isArray(o)) {
    Object.isFrozen(o) ? o = o.slice(0) : e.add(o);
    for (let s = 0, a = o.length; s < a; s++)
      r = o[s], (n = Xe(r, e)) !== r && (o[s] = n);
  } else {
    Object.isFrozen(o) ? o = Object.assign({}, o) : e.add(o);
    const s = Object.keys(o), a = Object.getOwnPropertyDescriptors(o);
    for (let l = 0, c = s.length; l < c; l++)
      i = s[l], !a[i].get && (r = o[i], (n = Xe(r, e)) !== r && (o[i] = n));
  }
  return o;
}
function io(o, e) {
  let t = o[e];
  return t || Object.defineProperty(o, e, {
    value: t = /* @__PURE__ */ Object.create(null)
  }), t;
}
function Lt(o, e, t) {
  if (o[e]) return o[e];
  const [n, r] = Me(t, {
    equals: !1,
    internal: !0
  });
  return n.$ = r, o[e] = n;
}
function Wl(o, e) {
  const t = Reflect.getOwnPropertyDescriptor(o, e);
  return !t || t.get || !t.configurable || e === we || e === dt || (delete t.value, delete t.writable, t.get = () => o[we][e]), t;
}
function gs(o) {
  Qo() && Lt(io(o, dt), ps)();
}
function ql(o) {
  return gs(o), Reflect.ownKeys(o);
}
const Kl = {
  get(o, e, t) {
    if (e === on) return o;
    if (e === we) return t;
    if (e === Jo)
      return gs(o), t;
    const n = io(o, dt), r = n[e];
    let i = r ? r() : o[e];
    if (e === dt || e === Be || e === "__proto__") return i;
    if (!r) {
      const s = Object.getOwnPropertyDescriptor(o, e);
      Qo() && (typeof i != "function" || o.hasOwnProperty(e)) && !(s && s.get) && (i = Lt(n, e, i)());
    }
    return ro(i) ? fs(i) : i;
  },
  has(o, e) {
    return e === on || e === we || e === Jo || e === dt || e === Be || e === "__proto__" ? !0 : (Qo() && Lt(io(o, Be), e)(), e in o);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: ql,
  getOwnPropertyDescriptor: Wl
};
function so(o, e, t, n = !1) {
  if (!n && o[e] === t) return;
  const r = o[e], i = o.length;
  t === void 0 ? (delete o[e], o[Be] && o[Be][e] && r !== void 0 && o[Be][e].$()) : (o[e] = t, o[Be] && o[Be][e] && r === void 0 && o[Be][e].$());
  let s = io(o, dt), a;
  if ((a = Lt(s, e, r)) && a.$(() => t), Array.isArray(o) && o.length !== i) {
    for (let l = o.length; l < i; l++) (a = s[l]) && a.$();
    (a = Lt(s, "length", i)) && a.$(o.length);
  }
  (a = s[ps]) && a.$();
}
function ms(o, e) {
  const t = Object.keys(e);
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    so(o, r, e[r]);
  }
}
function Vl(o, e) {
  if (typeof e == "function" && (e = e(o)), e = Xe(e), Array.isArray(e)) {
    if (o === e) return;
    let t = 0, n = e.length;
    for (; t < n; t++) {
      const r = e[t];
      o[t] !== r && so(o, t, r);
    }
    so(o, "length", n);
  } else ms(o, e);
}
function Et(o, e, t = []) {
  let n, r = o;
  if (e.length > 1) {
    n = e.shift();
    const s = typeof n, a = Array.isArray(o);
    if (Array.isArray(n)) {
      for (let l = 0; l < n.length; l++)
        Et(o, [n[l]].concat(e), t);
      return;
    } else if (a && s === "function") {
      for (let l = 0; l < o.length; l++)
        n(o[l], l) && Et(o, [l].concat(e), t);
      return;
    } else if (a && s === "object") {
      const { from: l = 0, to: c = o.length - 1, by: d = 1 } = n;
      for (let u = l; u <= c; u += d)
        Et(o, [u].concat(e), t);
      return;
    } else if (e.length > 1) {
      Et(o[n], e, [n].concat(t));
      return;
    }
    r = o[n], t = [n].concat(t);
  }
  let i = e[0];
  typeof i == "function" && (i = i(r, t), i === r) || n === void 0 && i == null || (i = Xe(i), n === void 0 || ro(r) && ro(i) && !Array.isArray(i) ? ms(r, i) : so(o, n, i));
}
function bs(...[o, e]) {
  const t = Xe(o || {}), n = Array.isArray(t), r = fs(t);
  function i(...s) {
    pl(() => {
      n && s.length === 1 ? Vl(t, s[0]) : Et(t, s);
    });
  }
  return [r, i];
}
function Ce(o) {
  if (!o) return "";
  for (; o.endsWith("<br>") || /\s$/.test(o); )
    o = o.trim(), o = o.replace(/(<br\s*\/?>)+$/i, "");
  return o;
}
function Yl(o, e) {
  return o.reduce(
    (t, n) => (e(n) ? t.push([n]) : t[t.length - 1].push(n), t),
    [[]]
  );
}
function de(o) {
  const e = document.createElement("div"), t = ft(() => o({}), e), n = e.innerHTML;
  return t(), n;
}
class Fe {
  constructor(e) {
    j(this, "api");
    j(this, "block");
    j(this, "store");
    j(this, "initialData");
    j(this, "element");
    j(this, "destroy");
    this.api = e.api, this.block = e.block, this.initialData = e.data, this.element = document.createElement("div");
  }
  save() {
    return Xe(this.store[0]);
  }
  rendered() {
    const e = Object.keys(this.initialData).length > 0 ? this.initialData : this.defaultData;
    this.destroy = ft(() => (this.store = bs(e), this.render()), this.element);
  }
}
function ze(o) {
  const e = ({ onChange: t, ...n }) => {
    var r;
    return r = class {
      constructor(s) {
        j(this, "instance");
        j(this, "updated", t);
        j(this, "moved", t);
        this.instance = new o.tool(s), this.instance.photoApi = n;
      }
      static renderer(s) {
        return de(() => o.renderer(s));
      }
      static parser(s) {
        const a = o.parser(s);
        if (a)
          return { type: o.type, data: a };
      }
      rendered() {
        this.instance.rendered();
      }
      destroy() {
        var s, a;
        (a = (s = this.instance).destroy) == null || a.call(s), t();
      }
      render() {
        return this.instance.element;
      }
      save() {
        return this.instance.save();
      }
      renderSettings() {
        var s, a;
        return ((a = (s = this.instance).renderSettings) == null ? void 0 : a.call(s)) || [];
      }
      validate(s) {
        return typeof this.instance.validate == "function" ? this.instance.validate(s) : !0;
      }
    }, j(r, "type", o.type), j(r, "toolSettings", {
      class: r,
      ...o.toolSettings
    }), j(r, "toolbox", {
      title: o.toolbox.title,
      icon: o.toolbox.icon
    }), r;
  };
  return window.ArticleEditorPlugins ?? (window.ArticleEditorPlugins = []), window.ArticleEditorPlugins.push(e), e;
}
function jt(o, e) {
  const t = ({ onChange: n }) => {
    var r;
    return r = class extends o {
      static renderer(s) {
        return de(() => e.renderer(s));
      }
      static parser(s) {
        const a = e.parser(s);
        if (a)
          return { type: e.type, data: a };
      }
      updated() {
        var s;
        (s = super.updated) == null || s.call(this), n();
      }
      moved(s) {
        var a;
        (a = super.moved) == null || a.call(this, s), n();
      }
      destroy() {
        var s;
        (s = super.destroy) == null || s.call(this), n();
      }
    }, j(r, "type", e.type), j(r, "toolbox", e.toolbox || o.toolbox), (() => {
      const s = Object.getOwnPropertyDescriptors(o);
      for (const [a, l] of Object.entries(s))
        ["name", "length", "prototype", "toolbox"].includes(a) || Object.defineProperty(r, a, l);
    })(), j(r, "toolSettings", {
      class: r,
      ...e.toolSettings
    }), r;
  };
  return window.ArticleEditorPlugins ?? (window.ArticleEditorPlugins = []), window.ArticleEditorPlugins.push(t), t;
}
function Xl(o) {
  return Object.fromEntries(
    Array.from(o ?? []).map((e) => [e.nodeName, e.nodeValue])
  );
}
function bi(o = {}) {
  const e = Object.entries(o).map(([t, n]) => `${t}="${n}"`).join(" ");
  return e ? ` ${e}` : "";
}
function vs(o) {
  return Array.from(o.childNodes).map((t) => {
    switch (t.nodeType) {
      case t.ELEMENT_NODE:
        return {
          // NOTE: nodeName is in UPPERCASE when DOMParser is text/html
          type: t.nodeName.toLowerCase(),
          attributes: Xl(t.attributes),
          content: vs(t),
          dataset: t instanceof HTMLElement ? t.dataset : new DOMStringMap()
        };
      case t.TEXT_NODE:
        return {
          type: "#text",
          content: t.nodeValue ?? ""
        };
      case t.COMMENT_NODE:
        return {
          type: "#comment",
          content: t.nodeValue ?? ""
        };
      default:
        throw Error(`missing case for node type ${t.nodeType}`);
    }
  }).filter((t) => t.type === "#text" || t.type === "#comment" ? !/^\s*$/.test(t.content) : !0);
}
function te(o) {
  if (!o)
    return "";
  if (typeof o == "string")
    return o;
  if (Array.isArray(o))
    return o.map(te).join(" ");
  switch (o.type) {
    case "#text":
      return o.content;
    case "#comment":
      return `<!--${o.content}-->`;
    case "img":
    case "hr":
    case "br":
      return `<${o.type} ${bi(o.attributes ?? {})}>`;
    default: {
      const e = o.type, t = o.content.map(te).join(""), n = bi(o.attributes);
      return `<${e}${n}>${t}</${e}>`;
    }
  }
}
/**
* @license lucide-solid v0.485.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Gl = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, it = Gl, Zl = /* @__PURE__ */ y("<svg>"), vi = (o) => o.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Jl = (o) => o.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Ql = (o) => {
  const e = Jl(o);
  return e.charAt(0).toUpperCase() + e.slice(1);
}, ec = (...o) => o.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), tc = (o) => {
  const [e, t] = cs(o, ["color", "size", "strokeWidth", "children", "class", "name", "iconNode", "absoluteStrokeWidth"]);
  return (() => {
    var n = Zl();
    return gn(n, R(it, {
      get width() {
        return e.size ?? it.width;
      },
      get height() {
        return e.size ?? it.height;
      },
      get stroke() {
        return e.color ?? it.stroke;
      },
      get "stroke-width"() {
        return Q(() => !!e.absoluteStrokeWidth)() ? Number(e.strokeWidth ?? it["stroke-width"]) * 24 / Number(e.size) : Number(e.strokeWidth ?? it["stroke-width"]);
      },
      get class() {
        return ec("lucide", "lucide-icon", ...e.name != null ? [`lucide-${vi(Ql(e.name))}`, `lucide-${vi(e.name)}`] : [], e.class != null ? e.class : "");
      }
    }, t), !0, !0), k(n, m(ds, {
      get each() {
        return e.iconNode;
      },
      children: ([r, i]) => m(Fl, R({
        component: r
      }, i))
    })), n;
  })();
}, X = tc, oc = [["polyline", {
  points: "4 7 4 4 20 4 20 7",
  key: "1nosan"
}], ["line", {
  x1: "9",
  x2: "15",
  y1: "20",
  y2: "20",
  key: "swin9y"
}], ["line", {
  x1: "12",
  x2: "12",
  y1: "4",
  y2: "20",
  key: "1tx1rr"
}]], nc = (o) => m(X, R(o, {
  iconNode: oc,
  name: "type"
})), rc = nc, ic = /* @__PURE__ */ y("<p>");
jt(mn, {
  type: "paragraph",
  toolSettings: {
    inlineToolbar: !0
  },
  renderer: ({
    text: o
  }) => (() => {
    var e = ic();
    return q(() => e.innerHTML = Ce(o)), e;
  })(),
  toolbox: {
    title: "Text",
    icon: de(rc)
  },
  parser: (o) => {
    switch (o.type) {
      case "#text":
        return {
          text: o.content
        };
      case "p":
        return {
          text: te(o.content)
        };
    }
  }
});
(function() {
  try {
    if (typeof document < "u") {
      var o = document.createElement("style");
      o.appendChild(document.createTextNode(".ce-header{padding:.6em 0 3px;margin:0;line-height:1.25em;outline:none}.ce-header p,.ce-header div{padding:0!important;margin:0!important}")), document.head.appendChild(o);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const sc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 17V10.2135C19 10.1287 18.9011 10.0824 18.836 10.1367L16 12.5"/></svg>', ac = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10 19 9.5 19 12C19 13.9771 16.0684 13.9997 16.0012 16.8981C15.9999 16.9533 16.0448 17 16.1 17L19.3 17"/></svg>', lc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10.5 16.8323 10 17.6 10C18.3677 10 19.5 10.311 19.5 11.5C19.5 12.5315 18.7474 12.9022 18.548 12.9823C18.5378 12.9864 18.5395 13.0047 18.5503 13.0063C18.8115 13.0456 20 13.3065 20 14.8C20 16 19.5 17 17.8 17C17.8 17 16 17 16 16.3"/></svg>', cc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 10L15.2834 14.8511C15.246 14.9178 15.294 15 15.3704 15C16.8489 15 18.7561 15 20.2 15M19 17C19 15.7187 19 14.8813 19 13.6"/></svg>', dc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 15.9C16 15.9 16.3768 17 17.8 17C19.5 17 20 15.6199 20 14.7C20 12.7323 17.6745 12.0486 16.1635 12.9894C16.094 13.0327 16 12.9846 16 12.9027V10.1C16 10.0448 16.0448 10 16.1 10H19.8"/></svg>', uc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19.5 10C16.5 10.5 16 13.3285 16 15M16 15V15C16 16.1046 16.8954 17 18 17H18.3246C19.3251 17 20.3191 16.3492 20.2522 15.3509C20.0612 12.4958 16 12.6611 16 15Z"/></svg>', hc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 7L9 12M9 17V12M9 12L15 12M15 7V12M15 17L15 12"/></svg>';
/**
 * Header block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */
let pc = class {
  constructor({ data: e, config: t, api: n, readOnly: r }) {
    this.api = n, this.readOnly = r, this._settings = t, this._data = this.normalizeData(e), this._element = this.getTag();
  }
  /**
   * Styles
   */
  get _CSS() {
    return {
      block: this.api.styles.block,
      wrapper: "ce-header"
    };
  }
  /**
   * Check if data is valid
   * 
   * @param {any} data - data to check
   * @returns {data is HeaderData}
   * @private
   */
  isHeaderData(e) {
    return e.text !== void 0;
  }
  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData(e) {
    const t = { text: "", level: this.defaultLevel.number };
    return this.isHeaderData(e) && (t.text = e.text || "", e.level !== void 0 && !isNaN(parseInt(e.level.toString())) && (t.level = parseInt(e.level.toString()))), t;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElement}
   * @public
   */
  render() {
    return this._element;
  }
  /**
   * Returns header block tunes config
   *
   * @returns {Array}
   */
  renderSettings() {
    return this.levels.map((e) => ({
      icon: e.svg,
      label: this.api.i18n.t(`Heading ${e.number}`),
      onActivate: () => this.setLevel(e.number),
      closeOnActivate: !0,
      isActive: this.currentLevel.number === e.number,
      render: () => document.createElement("div")
    }));
  }
  /**
   * Callback for Block's settings buttons
   *
   * @param {number} level - level to set
   */
  setLevel(e) {
    this.data = {
      level: e,
      text: this.data.text
    };
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {HeaderData} data - saved data to merger with current block
   * @public
   */
  merge(e) {
    this._element.insertAdjacentHTML("beforeend", e.text);
  }
  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return e.text.trim() !== "";
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save(e) {
    return {
      text: e.innerHTML,
      level: this.currentLevel.number
    };
  }
  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: "text",
      // use 'text' property for other blocks
      import: "text"
      // fill 'text' property from other block's export string
    };
  }
  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      level: !1,
      text: {}
    };
  }
  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Get current Tools`s data
   *
   * @returns {HeaderData} Current data
   * @private
   */
  get data() {
    return this._data.text = this._element.innerHTML, this._data.level = this.currentLevel.number, this._data;
  }
  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {HeaderData} data — data to set
   * @private
   */
  set data(e) {
    if (this._data = this.normalizeData(e), e.level !== void 0 && this._element.parentNode) {
      const t = this.getTag();
      t.innerHTML = this._element.innerHTML, this._element.parentNode.replaceChild(t, this._element), this._element = t;
    }
    e.text !== void 0 && (this._element.innerHTML = this._data.text || "");
  }
  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
  getTag() {
    const e = document.createElement(this.currentLevel.tag);
    return e.innerHTML = this._data.text || "", e.classList.add(this._CSS.wrapper), e.contentEditable = this.readOnly ? "false" : "true", e.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || ""), e;
  }
  /**
   * Get current level
   *
   * @returns {level}
   */
  get currentLevel() {
    let e = this.levels.find((t) => t.number === this._data.level);
    return e || (e = this.defaultLevel), e;
  }
  /**
   * Return default level
   *
   * @returns {level}
   */
  get defaultLevel() {
    if (this._settings.defaultLevel) {
      const e = this.levels.find((t) => t.number === this._settings.defaultLevel);
      if (e)
        return e;
      console.warn("(ง'̀-'́)ง Heading Tool: the default level specified was not found in available levels");
    }
    return this.levels[1];
  }
  /**
   * @typedef {object} level
   * @property {number} number - level number
   * @property {string} tag - tag corresponds with level number
   * @property {string} svg - icon
   */
  /**
   * Available header levels
   *
   * @returns {level[]}
   */
  get levels() {
    const e = [
      {
        number: 1,
        tag: "H1",
        svg: sc
      },
      {
        number: 2,
        tag: "H2",
        svg: ac
      },
      {
        number: 3,
        tag: "H3",
        svg: lc
      },
      {
        number: 4,
        tag: "H4",
        svg: cc
      },
      {
        number: 5,
        tag: "H5",
        svg: dc
      },
      {
        number: 6,
        tag: "H6",
        svg: uc
      }
    ];
    return this._settings.levels ? e.filter(
      (t) => this._settings.levels.includes(t.number)
    ) : e;
  }
  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(e) {
    const t = e.detail;
    if ("data" in t) {
      const n = t.data;
      let r = this.defaultLevel.number;
      switch (n.tagName) {
        case "H1":
          r = 1;
          break;
        case "H2":
          r = 2;
          break;
        case "H3":
          r = 3;
          break;
        case "H4":
          r = 4;
          break;
        case "H5":
          r = 5;
          break;
        case "H6":
          r = 6;
          break;
      }
      this._settings.levels && (r = this._settings.levels.reduce((i, s) => Math.abs(s - r) < Math.abs(i - r) ? s : i)), this.data = {
        level: r,
        text: n.innerHTML
      };
    }
  }
  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["H1", "H2", "H3", "H4", "H5", "H6"]
    };
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: hc,
      title: "Heading"
    };
  }
};
var fc = [["path", {
  d: "M6 12h12",
  key: "8npq4p"
}], ["path", {
  d: "M6 20V4",
  key: "1w1bmo"
}], ["path", {
  d: "M18 20V4",
  key: "o2hl4u"
}]], gc = (o) => m(X, R(o, {
  iconNode: fc,
  name: "heading"
})), mc = gc, bc = /* @__PURE__ */ y("<h2>"), vc = /* @__PURE__ */ y("<h3>"), yc = /* @__PURE__ */ y("<h4>");
jt(pc, {
  type: "header",
  toolbox: {
    title: "Heading",
    icon: de(mc)
  },
  toolSettings: {
    inlineToolbar: !0,
    shortcut: "CMD+SHIFT+H",
    config: {
      levels: [2, 3, 4],
      defaultLevel: 2
    }
  },
  renderer: ({
    level: o,
    text: e
  }) => {
    switch (o) {
      case 2:
        return (() => {
          var t = bc();
          return q(() => t.innerHTML = Ce(e)), t;
        })();
      case 3:
        return (() => {
          var t = vc();
          return q(() => t.innerHTML = Ce(e)), t;
        })();
      case 4:
        return (() => {
          var t = yc();
          return q(() => t.innerHTML = Ce(e)), t;
        })();
    }
  },
  parser: (o) => {
    if (o.type === "h2" || o.type === "h3" || o.type === "h4")
      return {
        level: parseInt(o.type[1]),
        text: te(o.content)
      };
  }
});
var kc = /* @__PURE__ */ y('<div class="text-fg py-1 flex flex-col"><div>'), wc = /* @__PURE__ */ y("<button type=button>"), xc = /* @__PURE__ */ y("<div contenteditable=true>");
function Ie(o) {
  return (() => {
    var e = kc(), t = e.firstChild;
    return k(t, () => o.children), q(() => Qe(t, o.class)), e;
  })();
}
function Ve(o) {
  return (() => {
    var e = wc();
    return us(e, "click", o.onClick, !0), k(e, () => o.children), q(() => Qe(e, "border-none transition rounded-lg bg-fg/10 hover:bg-fg/14 active:bg-fg/18 " + o.class)), e;
  })();
}
function ve(o) {
  let e;
  return os(() => {
    e.innerHTML !== o.text && (e.innerHTML = o.text ?? "");
  }), ns(() => {
    new MutationObserver((n) => {
      for (const r of n)
        (r.type === "childList" || r.type === "characterData") && o.onChange(Ce(e.innerHTML));
    }).observe(e, {
      childList: !0,
      characterData: !0,
      subtree: !0
    });
  }), (() => {
    var t = xc();
    return Mt((n) => e = n, t), q((n) => {
      var r = o.text ? {} : {
        "--placeholder": `"${o.placeholder ?? ""}"`
      }, i = `before:content-(--placeholder) before:text-fg/50 ${o.class}`;
      return n.e = hs(t, r, n.e), i !== n.t && Qe(t, n.t = i), n;
    }, {
      e: void 0,
      t: void 0
    }), t;
  })();
}
Je(["click"]);
var Cc = [["rect", {
  width: "18",
  height: "18",
  x: "3",
  y: "3",
  rx: "2",
  ry: "2",
  key: "1m3agn"
}], ["circle", {
  cx: "9",
  cy: "9",
  r: "2",
  key: "af1f0g"
}], ["path", {
  d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
  key: "1xmnt7"
}]], Ec = (o) => m(X, R(o, {
  iconNode: Cc,
  name: "image"
})), Sc = Ec, Tc = /* @__PURE__ */ y("<image-card><article-photo>", !0, !1, !1), Bc = /* @__PURE__ */ y("<figcaption>"), _c = /* @__PURE__ */ y("<img class=rounded>");
ze({
  type: "image-card",
  renderer: ({
    id: o,
    caption: e,
    wide: t
  }) => (() => {
    var n = Tc(), r = n.firstChild;
    return A(n, "wide", t), n._$owner = ge(), A(r, "id", o), r._$owner = ge(), k(n, e && (() => {
      var i = Bc();
      return i.innerHTML = e, i;
    })(), null), n;
  })(),
  parser: (o) => {
    var e, t;
    if (o.type === "image-card") {
      const n = o.content[0], r = o.content[1];
      return {
        id: ((e = n.attributes) == null ? void 0 : e.id) || "",
        caption: te(r),
        wide: !!((t = o.attributes) != null && t.wide)
      };
    }
  },
  toolbox: {
    title: "Image Card",
    icon: de(Sc)
  },
  toolSettings: {
    inlineToolbar: !0
  },
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {
        id: "",
        caption: "",
        wide: !1
      });
    }
    validate(t) {
      return !!t.id;
    }
    render() {
      const {
        getPhotoUrl: t,
        selectPhoto: n
      } = this.photoApi, [r, i] = Me(""), [s, a] = this.store;
      t(s.id).then((c) => i(c));
      function l() {
        n(1).then((c) => {
          if (c && c.length > 0) {
            const {
              id: d,
              url: u
            } = c[0];
            i(u), a("id", d);
          }
        });
      }
      return m(Ie, {
        class: "flex flex-col gap-1",
        get children() {
          return [Q(() => Q(() => !!(s.id && r()))() ? (() => {
            var c = _c();
            return c.$$click = l, q(() => A(c, "src", r())), c;
          })() : m(Ve, {
            class: "p-1",
            onClick: l,
            children: "Select Photo"
          })), m(ve, {
            class: "px-1.5 py-0.5 rounded-lg border-[1pt] border-fg/20",
            get text() {
              return s.caption ?? "";
            },
            onChange: (c) => a("caption", c),
            placeholder: "Caption"
          })];
        }
      });
    }
  }
});
Je(["click"]);
var Oc = [["path", {
  d: "M18 22H4a2 2 0 0 1-2-2V6",
  key: "pblm9e"
}], ["path", {
  d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18",
  key: "nf6bnh"
}], ["circle", {
  cx: "12",
  cy: "8",
  r: "2",
  key: "1822b1"
}], ["rect", {
  width: "16",
  height: "16",
  x: "6",
  y: "2",
  rx: "2",
  key: "12espp"
}]], Mc = (o) => m(X, R(o, {
  iconNode: Oc,
  name: "images"
})), Ic = Mc, Lc = /* @__PURE__ */ y("<gallery-card><gallery-card-container>", !0, !1, !1), Ac = /* @__PURE__ */ y("<gallery-card-row>", !0, !1, !1), Pc = /* @__PURE__ */ y("<article-photo>", !0, !1, !1), Nc = /* @__PURE__ */ y("<figcaption>");
function $c(o) {
  const [e, t, n, r, i, s, a, l, c] = o;
  switch (o.length) {
    case 0:
      return [];
    case 1:
      return [[e]];
    case 2:
      return [[e, t]];
    case 3:
      return [[e, t], [n]];
    case 4:
      return [[e, t], [n, r]];
    case 5:
      return [[e, t, n], [r, i]];
    case 6:
      return [[e, t, n], [r, i, s]];
    case 7:
      return [[e, t, n], [r, i], [s, a]];
    case 8:
      return [[e, t, n], [r, i, s], [a, l]];
    case 9:
      return [[e, t, n], [r, i, s], [a, l, c]];
    default:
      throw Error("TODO: support beyond 9");
  }
}
ze({
  type: "gallery-card",
  toolSettings: {
    inlineToolbar: !0
  },
  toolbox: {
    title: "Gallery Card",
    icon: de(Ic)
  },
  renderer: ({
    caption: o,
    photos: e
  }) => (() => {
    var t = Lc(), n = t.firstChild;
    return t._$owner = ge(), n._$owner = ge(), k(n, () => $c(e).map((r) => (() => {
      var i = Ac();
      return i._$owner = ge(), k(i, () => r.map((s) => (() => {
        var a = Pc();
        return A(a, "id", s), a._$owner = ge(), a;
      })())), i;
    })())), k(t, o && (() => {
      var r = Nc();
      return r.innerHTML = o, r;
    })(), null), t;
  })(),
  parser: (o) => {
    if (o.type === "gallery-card") {
      const e = o.content[0].content, t = o.content[1];
      return {
        caption: te(t),
        photos: e.map((n) => n.content.map((r) => r.attributes.id)).flat()
      };
    }
  },
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {
        photos: []
      });
    }
    render() {
      const [t, n] = this.store;
      return m(Ie, {
        class: "flex flex-col gap-2",
        children: "GalleryCard"
      });
    }
  }
});
(function() {
  try {
    if (typeof document < "u") {
      var o = document.createElement("style");
      o.appendChild(document.createTextNode('.cdx-list{margin:0;padding:0;outline:none;display:grid;counter-reset:item;gap:var(--spacing-s);padding:var(--spacing-xs);--spacing-s: 8px;--spacing-xs: 6px;--list-counter-type: numeric;--radius-border: 5px;--checkbox-background: #fff;--color-border: #C9C9C9;--color-bg-checked: #369FFF;--line-height: 1.45em;--color-bg-checked-hover: #0059AB;--color-tick: #fff;--size-checkbox: 1.2em}.cdx-list__item{line-height:var(--line-height);display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;grid-template-areas:"checkbox content" ". child"}.cdx-list__item-children{display:grid;grid-area:child;gap:var(--spacing-s);padding-top:var(--spacing-s)}.cdx-list__item [contenteditable]{outline:none}.cdx-list__item-content{word-break:break-word;white-space:pre-wrap;grid-area:content;padding-left:var(--spacing-s)}.cdx-list__item:before{counter-increment:item;white-space:nowrap}.cdx-list-ordered .cdx-list__item:before{content:counters(item,".",var(--list-counter-type)) "."}.cdx-list-ordered{counter-reset:item}.cdx-list-unordered .cdx-list__item:before{content:"•"}.cdx-list-checklist .cdx-list__item:before{content:""}.cdx-list__settings .cdx-settings-button{width:50%}.cdx-list__checkbox{padding-top:calc((var(--line-height) - var(--size-checkbox)) / 2);grid-area:checkbox;width:var(--size-checkbox);height:var(--size-checkbox);display:flex;cursor:pointer}.cdx-list__checkbox svg{opacity:0;height:var(--size-checkbox);width:var(--size-checkbox);left:-1px;top:-1px;position:absolute}@media (hover: hover){.cdx-list__checkbox:not(.cdx-list__checkbox--no-hover):hover .cdx-list__checkbox-check svg{opacity:1}}.cdx-list__checkbox--checked{line-height:var(--line-height)}@media (hover: hover){.cdx-list__checkbox--checked:not(.cdx-list__checkbox--checked--no-hover):hover .cdx-checklist__checkbox-check{background:var(--color-bg-checked-hover);border-color:var(--color-bg-checked-hover)}}.cdx-list__checkbox--checked .cdx-list__checkbox-check{background:var(--color-bg-checked);border-color:var(--color-bg-checked)}.cdx-list__checkbox--checked .cdx-list__checkbox-check svg{opacity:1}.cdx-list__checkbox--checked .cdx-list__checkbox-check svg path{stroke:var(--color-tick)}.cdx-list__checkbox--checked .cdx-list__checkbox-check:before{opacity:0;visibility:visible;transform:scale(2.5)}.cdx-list__checkbox-check{cursor:pointer;display:inline-block;position:relative;margin:0 auto;width:var(--size-checkbox);height:var(--size-checkbox);box-sizing:border-box;border-radius:var(--radius-border);border:1px solid var(--color-border);background:var(--checkbox-background)}.cdx-list__checkbox-check:before{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:100%;background-color:var(--color-bg-checked);visibility:hidden;pointer-events:none;transform:scale(1);transition:transform .4s ease-out,opacity .4s}.cdx-list-start-with-field{background:#F8F8F8;border:1px solid rgba(226,226,229,.2);border-radius:6px;padding:2px;display:grid;grid-template-columns:auto auto 1fr;grid-template-rows:auto}.cdx-list-start-with-field--invalid{background:#FFECED;border:1px solid #E13F3F}.cdx-list-start-with-field--invalid .cdx-list-start-with-field__input{color:#e13f3f}.cdx-list-start-with-field__input{font-size:14px;outline:none;font-weight:500;font-family:inherit;border:0;background:transparent;margin:0;padding:0;line-height:22px;min-width:calc(100% - var(--toolbox-buttons-size) - var(--icon-margin-right))}.cdx-list-start-with-field__input::placeholder{color:var(--grayText);font-weight:500}')), document.head.appendChild(o);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const jc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"/></svg>', yi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9.2 12L11.0586 13.8586C11.1367 13.9367 11.2633 13.9367 11.3414 13.8586L14.7 10.5"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>', ki = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="9" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 17H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 12H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 7H4.99002"/></svg>', wi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="12" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="12" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="12" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.79999 14L7.79999 7.2135C7.79999 7.12872 7.7011 7.0824 7.63597 7.13668L4.79999 9.5"/></svg>', Rc = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 14.2L10 7.4135C10 7.32872 9.90111 7.28241 9.83598 7.33668L7 9.7" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M13.2087 14.2H13.2" stroke="black" stroke-width="1.6" stroke-linecap="round"/></svg>', Dc = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.2087 14.2H13.2" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M10 14.2L10 9.5" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M10 7.01L10 7" stroke="black" stroke-width="1.8" stroke-linecap="round"/></svg>', Hc = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.2087 14.2H13.2" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M10 14.2L10 7.2" stroke="black" stroke-width="1.6" stroke-linecap="round"/></svg>', Fc = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.0087 14.2H16" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M7 14.2L7.78865 12M13 14.2L12.1377 12M7.78865 12C7.78865 12 9.68362 7 10 7C10.3065 7 12.1377 12 12.1377 12M7.78865 12L12.1377 12" stroke="black" stroke-width="1.6" stroke-linecap="round"/></svg>', zc = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2087 14.2H14.2" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M11.5 14.5C11.5 14.5 11 13.281 11 12.5M7 9.5C7 9.5 7.5 8.5 9 8.5C10.5 8.5 11 9.5 11 10.5L11 11.5M11 11.5L11 12.5M11 11.5C11 11.5 7 11 7 13C7 15.3031 11 15 11 12.5" stroke="black" stroke-width="1.6" stroke-linecap="round"/></svg>', Uc = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 14.2L8 7.4135C8 7.32872 7.90111 7.28241 7.83598 7.33668L5 9.7" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M14 13L16.4167 10.7778M16.4167 10.7778L14 8.5M16.4167 10.7778H11.6562" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var ao = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wc(o) {
  if (o.__esModule)
    return o;
  var e = o.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(o).forEach(function(n) {
    var r = Object.getOwnPropertyDescriptor(o, n);
    Object.defineProperty(t, n, r.get ? r : {
      enumerable: !0,
      get: function() {
        return o[n];
      }
    });
  }), t;
}
var F = {}, bn = {}, vn = {};
Object.defineProperty(vn, "__esModule", { value: !0 });
vn.allInputsSelector = qc;
function qc() {
  var o = ["text", "password", "email", "number", "search", "tel", "url"];
  return "[contenteditable=true], textarea, input:not([type]), " + o.map(function(e) {
    return 'input[type="'.concat(e, '"]');
  }).join(", ");
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.allInputsSelector = void 0;
  var e = vn;
  Object.defineProperty(o, "allInputsSelector", { enumerable: !0, get: function() {
    return e.allInputsSelector;
  } });
})(bn);
var et = {}, yn = {};
Object.defineProperty(yn, "__esModule", { value: !0 });
yn.isNativeInput = Kc;
function Kc(o) {
  var e = [
    "INPUT",
    "TEXTAREA"
  ];
  return o && o.tagName ? e.includes(o.tagName) : !1;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isNativeInput = void 0;
  var e = yn;
  Object.defineProperty(o, "isNativeInput", { enumerable: !0, get: function() {
    return e.isNativeInput;
  } });
})(et);
var ys = {}, kn = {};
Object.defineProperty(kn, "__esModule", { value: !0 });
kn.append = Vc;
function Vc(o, e) {
  Array.isArray(e) ? e.forEach(function(t) {
    o.appendChild(t);
  }) : o.appendChild(e);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.append = void 0;
  var e = kn;
  Object.defineProperty(o, "append", { enumerable: !0, get: function() {
    return e.append;
  } });
})(ys);
var wn = {}, xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.blockElements = Yc;
function Yc() {
  return [
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "output",
    "p",
    "pre",
    "ruby",
    "section",
    "table",
    "tbody",
    "thead",
    "tr",
    "tfoot",
    "ul",
    "video"
  ];
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.blockElements = void 0;
  var e = xn;
  Object.defineProperty(o, "blockElements", { enumerable: !0, get: function() {
    return e.blockElements;
  } });
})(wn);
var ks = {}, Cn = {};
Object.defineProperty(Cn, "__esModule", { value: !0 });
Cn.calculateBaseline = Xc;
function Xc(o) {
  var e = window.getComputedStyle(o), t = parseFloat(e.fontSize), n = parseFloat(e.lineHeight) || t * 1.2, r = parseFloat(e.paddingTop), i = parseFloat(e.borderTopWidth), s = parseFloat(e.marginTop), a = t * 0.8, l = (n - t) / 2, c = s + i + r + l + a;
  return c;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.calculateBaseline = void 0;
  var e = Cn;
  Object.defineProperty(o, "calculateBaseline", { enumerable: !0, get: function() {
    return e.calculateBaseline;
  } });
})(ks);
var ws = {}, En = {}, Sn = {}, Tn = {};
Object.defineProperty(Tn, "__esModule", { value: !0 });
Tn.isContentEditable = Gc;
function Gc(o) {
  return o.contentEditable === "true";
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isContentEditable = void 0;
  var e = Tn;
  Object.defineProperty(o, "isContentEditable", { enumerable: !0, get: function() {
    return e.isContentEditable;
  } });
})(Sn);
Object.defineProperty(En, "__esModule", { value: !0 });
En.canSetCaret = Qc;
var Zc = et, Jc = Sn;
function Qc(o) {
  var e = !0;
  if ((0, Zc.isNativeInput)(o))
    switch (o.type) {
      case "file":
      case "checkbox":
      case "radio":
      case "hidden":
      case "submit":
      case "button":
      case "image":
      case "reset":
        e = !1;
        break;
    }
  else
    e = (0, Jc.isContentEditable)(o);
  return e;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.canSetCaret = void 0;
  var e = En;
  Object.defineProperty(o, "canSetCaret", { enumerable: !0, get: function() {
    return e.canSetCaret;
  } });
})(ws);
var vo = {}, Bn = {};
function ed(o, e, t) {
  const n = t.value !== void 0 ? "value" : "get", r = t[n], i = `#${e}Cache`;
  if (t[n] = function(...s) {
    return this[i] === void 0 && (this[i] = r.apply(this, s)), this[i];
  }, n === "get" && t.set) {
    const s = t.set;
    t.set = function(a) {
      delete o[i], s.apply(this, a);
    };
  }
  return t;
}
function xs() {
  const o = {
    win: !1,
    mac: !1,
    x11: !1,
    linux: !1
  }, e = Object.keys(o).find((t) => window.navigator.appVersion.toLowerCase().indexOf(t) !== -1);
  return e !== void 0 && (o[e] = !0), o;
}
function _n(o) {
  return o != null && o !== "" && (typeof o != "object" || Object.keys(o).length > 0);
}
function td(o) {
  return !_n(o);
}
const od = () => typeof window < "u" && window.navigator !== null && _n(window.navigator.platform) && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
function nd(o) {
  const e = xs();
  return o = o.replace(/shift/gi, "⇧").replace(/backspace/gi, "⌫").replace(/enter/gi, "⏎").replace(/up/gi, "↑").replace(/left/gi, "→").replace(/down/gi, "↓").replace(/right/gi, "←").replace(/escape/gi, "⎋").replace(/insert/gi, "Ins").replace(/delete/gi, "␡").replace(/\+/gi, "+"), e.mac ? o = o.replace(/ctrl|cmd/gi, "⌘").replace(/alt/gi, "⌥") : o = o.replace(/cmd/gi, "Ctrl").replace(/windows/gi, "WIN"), o;
}
function rd(o) {
  return o[0].toUpperCase() + o.slice(1);
}
function id(o) {
  const e = document.createElement("div");
  e.style.position = "absolute", e.style.left = "-999px", e.style.bottom = "-999px", e.innerHTML = o, document.body.appendChild(e);
  const t = window.getSelection(), n = document.createRange();
  if (n.selectNode(e), t === null)
    throw new Error("Cannot copy text to clipboard");
  t.removeAllRanges(), t.addRange(n), document.execCommand("copy"), document.body.removeChild(e);
}
function sd(o, e, t) {
  let n;
  return (...r) => {
    const i = this, s = () => {
      n = void 0, t !== !0 && o.apply(i, r);
    }, a = t === !0 && n !== void 0;
    window.clearTimeout(n), n = window.setTimeout(s, e), a && o.apply(i, r);
  };
}
function je(o) {
  return Object.prototype.toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
function ad(o) {
  return je(o) === "boolean";
}
function Cs(o) {
  return je(o) === "function" || je(o) === "asyncfunction";
}
function ld(o) {
  return Cs(o) && /^\s*class\s+/.test(o.toString());
}
function cd(o) {
  return je(o) === "number";
}
function Vt(o) {
  return je(o) === "object";
}
function dd(o) {
  return Promise.resolve(o) === o;
}
function ud(o) {
  return je(o) === "string";
}
function hd(o) {
  return je(o) === "undefined";
}
function nn(o, ...e) {
  if (!e.length)
    return o;
  const t = e.shift();
  if (Vt(o) && Vt(t))
    for (const n in t)
      Vt(t[n]) ? (o[n] === void 0 && Object.assign(o, { [n]: {} }), nn(o[n], t[n])) : Object.assign(o, { [n]: t[n] });
  return nn(o, ...e);
}
function pd(o, e, t) {
  const n = `«${e}» is deprecated and will be removed in the next major release. Please use the «${t}» instead.`;
  o && console.warn(n);
}
function fd(o) {
  try {
    return new URL(o).href;
  } catch {
  }
  return o.substring(0, 2) === "//" ? window.location.protocol + o : window.location.origin + o;
}
function gd(o) {
  return o > 47 && o < 58 || o === 32 || o === 13 || o === 229 || o > 64 && o < 91 || o > 95 && o < 112 || o > 185 && o < 193 || o > 218 && o < 223;
}
const md = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
  SLASH: 191
}, bd = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4
};
class vd {
  constructor() {
    this.completed = Promise.resolve();
  }
  /**
   * Add new promise to queue
   * @param operation - promise should be added to queue
   */
  add(e) {
    return new Promise((t, n) => {
      this.completed = this.completed.then(e).then(t).catch(n);
    });
  }
}
function yd(o, e, t = void 0) {
  let n, r, i, s = null, a = 0;
  t || (t = {});
  const l = function() {
    a = t.leading === !1 ? 0 : Date.now(), s = null, i = o.apply(n, r), s === null && (n = r = null);
  };
  return function() {
    const c = Date.now();
    !a && t.leading === !1 && (a = c);
    const d = e - (c - a);
    return n = this, r = arguments, d <= 0 || d > e ? (s && (clearTimeout(s), s = null), a = c, i = o.apply(n, r), s === null && (n = r = null)) : !s && t.trailing !== !1 && (s = setTimeout(l, d)), i;
  };
}
const kd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PromiseQueue: vd,
  beautifyShortcut: nd,
  cacheable: ed,
  capitalize: rd,
  copyTextToClipboard: id,
  debounce: sd,
  deepMerge: nn,
  deprecationAssert: pd,
  getUserOS: xs,
  getValidUrl: fd,
  isBoolean: ad,
  isClass: ld,
  isEmpty: td,
  isFunction: Cs,
  isIosDevice: od,
  isNumber: cd,
  isObject: Vt,
  isPrintableKey: gd,
  isPromise: dd,
  isString: ud,
  isUndefined: hd,
  keyCodes: md,
  mouseButtons: bd,
  notEmpty: _n,
  throttle: yd,
  typeOf: je
}, Symbol.toStringTag, { value: "Module" })), On = /* @__PURE__ */ Wc(kd);
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.containsOnlyInlineElements = Cd;
var wd = On, xd = wn;
function Cd(o) {
  var e;
  (0, wd.isString)(o) ? (e = document.createElement("div"), e.innerHTML = o) : e = o;
  var t = function(n) {
    return !(0, xd.blockElements)().includes(n.tagName.toLowerCase()) && Array.from(n.children).every(t);
  };
  return Array.from(e.children).every(t);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.containsOnlyInlineElements = void 0;
  var e = Bn;
  Object.defineProperty(o, "containsOnlyInlineElements", { enumerable: !0, get: function() {
    return e.containsOnlyInlineElements;
  } });
})(vo);
var Es = {}, Mn = {}, yo = {}, In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.make = Ed;
function Ed(o, e, t) {
  var n;
  e === void 0 && (e = null), t === void 0 && (t = {});
  var r = document.createElement(o);
  if (Array.isArray(e)) {
    var i = e.filter(function(a) {
      return a !== void 0;
    });
    (n = r.classList).add.apply(n, i);
  } else
    e !== null && r.classList.add(e);
  for (var s in t)
    Object.prototype.hasOwnProperty.call(t, s) && (r[s] = t[s]);
  return r;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.make = void 0;
  var e = In;
  Object.defineProperty(o, "make", { enumerable: !0, get: function() {
    return e.make;
  } });
})(yo);
Object.defineProperty(Mn, "__esModule", { value: !0 });
Mn.fragmentToString = Td;
var Sd = yo;
function Td(o) {
  var e = (0, Sd.make)("div");
  return e.appendChild(o), e.innerHTML;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.fragmentToString = void 0;
  var e = Mn;
  Object.defineProperty(o, "fragmentToString", { enumerable: !0, get: function() {
    return e.fragmentToString;
  } });
})(Es);
var Ss = {}, Ln = {};
Object.defineProperty(Ln, "__esModule", { value: !0 });
Ln.getContentLength = _d;
var Bd = et;
function _d(o) {
  var e, t;
  return (0, Bd.isNativeInput)(o) ? o.value.length : o.nodeType === Node.TEXT_NODE ? o.length : (t = (e = o.textContent) === null || e === void 0 ? void 0 : e.length) !== null && t !== void 0 ? t : 0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getContentLength = void 0;
  var e = Ln;
  Object.defineProperty(o, "getContentLength", { enumerable: !0, get: function() {
    return e.getContentLength;
  } });
})(Ss);
var An = {}, Pn = {}, xi = ao && ao.__spreadArray || function(o, e, t) {
  if (t || arguments.length === 2)
    for (var n = 0, r = e.length, i; n < r; n++)
      (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return o.concat(i || Array.prototype.slice.call(e));
};
Object.defineProperty(Pn, "__esModule", { value: !0 });
Pn.getDeepestBlockElements = Ts;
var Od = vo;
function Ts(o) {
  return (0, Od.containsOnlyInlineElements)(o) ? [o] : Array.from(o.children).reduce(function(e, t) {
    return xi(xi([], e, !0), Ts(t), !0);
  }, []);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getDeepestBlockElements = void 0;
  var e = Pn;
  Object.defineProperty(o, "getDeepestBlockElements", { enumerable: !0, get: function() {
    return e.getDeepestBlockElements;
  } });
})(An);
var Bs = {}, Nn = {}, ko = {}, $n = {};
Object.defineProperty($n, "__esModule", { value: !0 });
$n.isLineBreakTag = Md;
function Md(o) {
  return [
    "BR",
    "WBR"
  ].includes(o.tagName);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isLineBreakTag = void 0;
  var e = $n;
  Object.defineProperty(o, "isLineBreakTag", { enumerable: !0, get: function() {
    return e.isLineBreakTag;
  } });
})(ko);
var wo = {}, jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.isSingleTag = Id;
function Id(o) {
  return [
    "AREA",
    "BASE",
    "BR",
    "COL",
    "COMMAND",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "KEYGEN",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ].includes(o.tagName);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isSingleTag = void 0;
  var e = jn;
  Object.defineProperty(o, "isSingleTag", { enumerable: !0, get: function() {
    return e.isSingleTag;
  } });
})(wo);
Object.defineProperty(Nn, "__esModule", { value: !0 });
Nn.getDeepestNode = _s;
var Ld = et, Ad = ko, Pd = wo;
function _s(o, e) {
  e === void 0 && (e = !1);
  var t = e ? "lastChild" : "firstChild", n = e ? "previousSibling" : "nextSibling";
  if (o.nodeType === Node.ELEMENT_NODE && o[t]) {
    var r = o[t];
    if ((0, Pd.isSingleTag)(r) && !(0, Ld.isNativeInput)(r) && !(0, Ad.isLineBreakTag)(r))
      if (r[n])
        r = r[n];
      else if (r.parentNode !== null && r.parentNode[n])
        r = r.parentNode[n];
      else
        return r.parentNode;
    return _s(r, e);
  }
  return o;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getDeepestNode = void 0;
  var e = Nn;
  Object.defineProperty(o, "getDeepestNode", { enumerable: !0, get: function() {
    return e.getDeepestNode;
  } });
})(Bs);
var Os = {}, Rn = {}, zt = ao && ao.__spreadArray || function(o, e, t) {
  if (t || arguments.length === 2)
    for (var n = 0, r = e.length, i; n < r; n++)
      (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return o.concat(i || Array.prototype.slice.call(e));
};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.findAllInputs = Dd;
var Nd = vo, $d = An, jd = bn, Rd = et;
function Dd(o) {
  return Array.from(o.querySelectorAll((0, jd.allInputsSelector)())).reduce(function(e, t) {
    return (0, Rd.isNativeInput)(t) || (0, Nd.containsOnlyInlineElements)(t) ? zt(zt([], e, !0), [t], !1) : zt(zt([], e, !0), (0, $d.getDeepestBlockElements)(t), !0);
  }, []);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.findAllInputs = void 0;
  var e = Rn;
  Object.defineProperty(o, "findAllInputs", { enumerable: !0, get: function() {
    return e.findAllInputs;
  } });
})(Os);
var Ms = {}, Dn = {};
Object.defineProperty(Dn, "__esModule", { value: !0 });
Dn.isCollapsedWhitespaces = Hd;
function Hd(o) {
  return !/[^\t\n\r ]/.test(o);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isCollapsedWhitespaces = void 0;
  var e = Dn;
  Object.defineProperty(o, "isCollapsedWhitespaces", { enumerable: !0, get: function() {
    return e.isCollapsedWhitespaces;
  } });
})(Ms);
var Hn = {}, Fn = {};
Object.defineProperty(Fn, "__esModule", { value: !0 });
Fn.isElement = zd;
var Fd = On;
function zd(o) {
  return (0, Fd.isNumber)(o) ? !1 : !!o && !!o.nodeType && o.nodeType === Node.ELEMENT_NODE;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isElement = void 0;
  var e = Fn;
  Object.defineProperty(o, "isElement", { enumerable: !0, get: function() {
    return e.isElement;
  } });
})(Hn);
var Is = {}, zn = {}, Un = {}, Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.isLeaf = Ud;
function Ud(o) {
  return o === null ? !1 : o.childNodes.length === 0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isLeaf = void 0;
  var e = Wn;
  Object.defineProperty(o, "isLeaf", { enumerable: !0, get: function() {
    return e.isLeaf;
  } });
})(Un);
var qn = {}, Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.isNodeEmpty = Yd;
var Wd = ko, qd = Hn, Kd = et, Vd = wo;
function Yd(o, e) {
  var t = "";
  return (0, Vd.isSingleTag)(o) && !(0, Wd.isLineBreakTag)(o) ? !1 : ((0, qd.isElement)(o) && (0, Kd.isNativeInput)(o) ? t = o.value : o.textContent !== null && (t = o.textContent.replace("​", "")), e !== void 0 && (t = t.replace(new RegExp(e, "g"), "")), t.trim().length === 0);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isNodeEmpty = void 0;
  var e = Kn;
  Object.defineProperty(o, "isNodeEmpty", { enumerable: !0, get: function() {
    return e.isNodeEmpty;
  } });
})(qn);
Object.defineProperty(zn, "__esModule", { value: !0 });
zn.isEmpty = Zd;
var Xd = Un, Gd = qn;
function Zd(o, e) {
  o.normalize();
  for (var t = [o]; t.length > 0; ) {
    var n = t.shift();
    if (n) {
      if (o = n, (0, Xd.isLeaf)(o) && !(0, Gd.isNodeEmpty)(o, e))
        return !1;
      t.push.apply(t, Array.from(o.childNodes));
    }
  }
  return !0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isEmpty = void 0;
  var e = zn;
  Object.defineProperty(o, "isEmpty", { enumerable: !0, get: function() {
    return e.isEmpty;
  } });
})(Is);
var Ls = {}, Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.isFragment = Qd;
var Jd = On;
function Qd(o) {
  return (0, Jd.isNumber)(o) ? !1 : !!o && !!o.nodeType && o.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isFragment = void 0;
  var e = Vn;
  Object.defineProperty(o, "isFragment", { enumerable: !0, get: function() {
    return e.isFragment;
  } });
})(Ls);
var As = {}, Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.isHTMLString = tu;
var eu = yo;
function tu(o) {
  var e = (0, eu.make)("div");
  return e.innerHTML = o, e.childElementCount > 0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isHTMLString = void 0;
  var e = Yn;
  Object.defineProperty(o, "isHTMLString", { enumerable: !0, get: function() {
    return e.isHTMLString;
  } });
})(As);
var Ps = {}, Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.offset = ou;
function ou(o) {
  var e = o.getBoundingClientRect(), t = window.pageXOffset || document.documentElement.scrollLeft, n = window.pageYOffset || document.documentElement.scrollTop, r = e.top + n, i = e.left + t;
  return {
    top: r,
    left: i,
    bottom: r + e.height,
    right: i + e.width
  };
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.offset = void 0;
  var e = Xn;
  Object.defineProperty(o, "offset", { enumerable: !0, get: function() {
    return e.offset;
  } });
})(Ps);
var Ns = {}, Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.prepend = nu;
function nu(o, e) {
  Array.isArray(e) ? (e = e.reverse(), e.forEach(function(t) {
    return o.prepend(t);
  })) : o.prepend(e);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.prepend = void 0;
  var e = Gn;
  Object.defineProperty(o, "prepend", { enumerable: !0, get: function() {
    return e.prepend;
  } });
})(Ns);
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.prepend = o.offset = o.make = o.isLineBreakTag = o.isSingleTag = o.isNodeEmpty = o.isLeaf = o.isHTMLString = o.isFragment = o.isEmpty = o.isElement = o.isContentEditable = o.isCollapsedWhitespaces = o.findAllInputs = o.isNativeInput = o.allInputsSelector = o.getDeepestNode = o.getDeepestBlockElements = o.getContentLength = o.fragmentToString = o.containsOnlyInlineElements = o.canSetCaret = o.calculateBaseline = o.blockElements = o.append = void 0;
  var e = bn;
  Object.defineProperty(o, "allInputsSelector", { enumerable: !0, get: function() {
    return e.allInputsSelector;
  } });
  var t = et;
  Object.defineProperty(o, "isNativeInput", { enumerable: !0, get: function() {
    return t.isNativeInput;
  } });
  var n = ys;
  Object.defineProperty(o, "append", { enumerable: !0, get: function() {
    return n.append;
  } });
  var r = wn;
  Object.defineProperty(o, "blockElements", { enumerable: !0, get: function() {
    return r.blockElements;
  } });
  var i = ks;
  Object.defineProperty(o, "calculateBaseline", { enumerable: !0, get: function() {
    return i.calculateBaseline;
  } });
  var s = ws;
  Object.defineProperty(o, "canSetCaret", { enumerable: !0, get: function() {
    return s.canSetCaret;
  } });
  var a = vo;
  Object.defineProperty(o, "containsOnlyInlineElements", { enumerable: !0, get: function() {
    return a.containsOnlyInlineElements;
  } });
  var l = Es;
  Object.defineProperty(o, "fragmentToString", { enumerable: !0, get: function() {
    return l.fragmentToString;
  } });
  var c = Ss;
  Object.defineProperty(o, "getContentLength", { enumerable: !0, get: function() {
    return c.getContentLength;
  } });
  var d = An;
  Object.defineProperty(o, "getDeepestBlockElements", { enumerable: !0, get: function() {
    return d.getDeepestBlockElements;
  } });
  var u = Bs;
  Object.defineProperty(o, "getDeepestNode", { enumerable: !0, get: function() {
    return u.getDeepestNode;
  } });
  var h = Os;
  Object.defineProperty(o, "findAllInputs", { enumerable: !0, get: function() {
    return h.findAllInputs;
  } });
  var g = Ms;
  Object.defineProperty(o, "isCollapsedWhitespaces", { enumerable: !0, get: function() {
    return g.isCollapsedWhitespaces;
  } });
  var f = Sn;
  Object.defineProperty(o, "isContentEditable", { enumerable: !0, get: function() {
    return f.isContentEditable;
  } });
  var b = Hn;
  Object.defineProperty(o, "isElement", { enumerable: !0, get: function() {
    return b.isElement;
  } });
  var N = Is;
  Object.defineProperty(o, "isEmpty", { enumerable: !0, get: function() {
    return N.isEmpty;
  } });
  var M = Ls;
  Object.defineProperty(o, "isFragment", { enumerable: !0, get: function() {
    return M.isFragment;
  } });
  var _ = As;
  Object.defineProperty(o, "isHTMLString", { enumerable: !0, get: function() {
    return _.isHTMLString;
  } });
  var H = Un;
  Object.defineProperty(o, "isLeaf", { enumerable: !0, get: function() {
    return H.isLeaf;
  } });
  var E = qn;
  Object.defineProperty(o, "isNodeEmpty", { enumerable: !0, get: function() {
    return E.isNodeEmpty;
  } });
  var C = ko;
  Object.defineProperty(o, "isLineBreakTag", { enumerable: !0, get: function() {
    return C.isLineBreakTag;
  } });
  var G = wo;
  Object.defineProperty(o, "isSingleTag", { enumerable: !0, get: function() {
    return G.isSingleTag;
  } });
  var ne = yo;
  Object.defineProperty(o, "make", { enumerable: !0, get: function() {
    return ne.make;
  } });
  var w = Ps;
  Object.defineProperty(o, "offset", { enumerable: !0, get: function() {
    return w.offset;
  } });
  var v = Ns;
  Object.defineProperty(o, "prepend", { enumerable: !0, get: function() {
    return v.prepend;
  } });
})(F);
const ue = "cdx-list", se = {
  wrapper: ue,
  item: `${ue}__item`,
  itemContent: `${ue}__item-content`,
  itemChildren: `${ue}__item-children`
};
let $s = class Ae {
  /**
   * Getter for all CSS classes used in unordered list rendering
   */
  static get CSS() {
    return {
      ...se,
      orderedList: `${ue}-ordered`
    };
  }
  /**
   * Assign passed readonly mode and config to relevant class properties
   * @param readonly - read-only mode flag
   * @param config - user config for Tool
   */
  constructor(e, t) {
    this.config = t, this.readOnly = e;
  }
  /**
   * Renders ol wrapper for list
   * @param isRoot - boolean variable that represents level of the wrappre (root or childList)
   * @returns - created html ol element
   */
  renderWrapper(e) {
    let t;
    return e === !0 ? t = F.make("ol", [Ae.CSS.wrapper, Ae.CSS.orderedList]) : t = F.make("ol", [Ae.CSS.orderedList, Ae.CSS.itemChildren]), t;
  }
  /**
   * Redners list item element
   * @param content - content used in list item rendering
   * @param _meta - meta of the list item unused in rendering of the ordered list
   * @returns - created html list item element
   */
  renderItem(e, t) {
    const n = F.make("li", Ae.CSS.item), r = F.make("div", Ae.CSS.itemContent, {
      innerHTML: e,
      contentEditable: (!this.readOnly).toString()
    });
    return n.appendChild(r), n;
  }
  /**
   * Return the item content
   * @param item - item wrapper (<li>)
   * @returns - item content string
   */
  getItemContent(e) {
    const t = e.querySelector(`.${Ae.CSS.itemContent}`);
    return !t || F.isEmpty(t) ? "" : t.innerHTML;
  }
  /**
   * Returns item meta, for ordered list
   * @returns item meta object
   */
  getItemMeta() {
    return {};
  }
  /**
   * Returns default item meta used on creation of the new item
   */
  composeDefaultMeta() {
    return {};
  }
}, js = class Pe {
  /**
   * Getter for all CSS classes used in unordered list rendering
   */
  static get CSS() {
    return {
      ...se,
      unorderedList: `${ue}-unordered`
    };
  }
  /**
   * Assign passed readonly mode and config to relevant class properties
   * @param readonly - read-only mode flag
   * @param config - user config for Tool
   */
  constructor(e, t) {
    this.config = t, this.readOnly = e;
  }
  /**
   * Renders ol wrapper for list
   * @param isRoot - boolean variable that represents level of the wrappre (root or childList)
   * @returns - created html ul element
   */
  renderWrapper(e) {
    let t;
    return e === !0 ? t = F.make("ul", [Pe.CSS.wrapper, Pe.CSS.unorderedList]) : t = F.make("ul", [Pe.CSS.unorderedList, Pe.CSS.itemChildren]), t;
  }
  /**
   * Redners list item element
   * @param content - content used in list item rendering
   * @param _meta - meta of the list item unused in rendering of the unordered list
   * @returns - created html list item element
   */
  renderItem(e, t) {
    const n = F.make("li", Pe.CSS.item), r = F.make("div", Pe.CSS.itemContent, {
      innerHTML: e,
      contentEditable: (!this.readOnly).toString()
    });
    return n.appendChild(r), n;
  }
  /**
   * Return the item content
   * @param item - item wrapper (<li>)
   * @returns - item content string
   */
  getItemContent(e) {
    const t = e.querySelector(`.${Pe.CSS.itemContent}`);
    return !t || F.isEmpty(t) ? "" : t.innerHTML;
  }
  /**
   * Returns item meta, for unordered list
   * @returns Item meta object
   */
  getItemMeta() {
    return {};
  }
  /**
   * Returns default item meta used on creation of the new item
   */
  composeDefaultMeta() {
    return {};
  }
};
function qe(o) {
  return o.nodeType === Node.ELEMENT_NODE;
}
var Bt = {}, Zn = {}, xo = {}, Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
Co.getContenteditableSlice = iu;
var ru = F;
function iu(o, e, t, n, r) {
  var i;
  r === void 0 && (r = !1);
  var s = document.createRange();
  if (n === "left" ? (s.setStart(o, 0), s.setEnd(e, t)) : (s.setStart(e, t), s.setEnd(o, o.childNodes.length)), r === !0) {
    var a = s.extractContents();
    return (0, ru.fragmentToString)(a);
  }
  var l = s.cloneContents(), c = document.createElement("div");
  c.appendChild(l);
  var d = (i = c.textContent) !== null && i !== void 0 ? i : "";
  return d;
}
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.checkContenteditableSliceForEmptiness = lu;
var su = F, au = Co;
function lu(o, e, t, n) {
  var r = (0, au.getContenteditableSlice)(o, e, t, n);
  return (0, su.isCollapsedWhitespaces)(r);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.checkContenteditableSliceForEmptiness = void 0;
  var e = xo;
  Object.defineProperty(o, "checkContenteditableSliceForEmptiness", { enumerable: !0, get: function() {
    return e.checkContenteditableSliceForEmptiness;
  } });
})(Zn);
var Rs = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getContenteditableSlice = void 0;
  var e = Co;
  Object.defineProperty(o, "getContenteditableSlice", { enumerable: !0, get: function() {
    return e.getContenteditableSlice;
  } });
})(Rs);
var Ds = {}, Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.focus = du;
var cu = F;
function du(o, e) {
  var t, n;
  if (e === void 0 && (e = !0), (0, cu.isNativeInput)(o)) {
    o.focus();
    var r = e ? 0 : o.value.length;
    o.setSelectionRange(r, r);
  } else {
    var i = document.createRange(), s = window.getSelection();
    if (!s)
      return;
    var a = function(h, g) {
      g === void 0 && (g = !1);
      var f = document.createTextNode("");
      g ? h.insertBefore(f, h.firstChild) : h.appendChild(f), i.setStart(f, 0), i.setEnd(f, 0);
    }, l = function(h) {
      return h != null;
    }, c = o.childNodes, d = e ? c[0] : c[c.length - 1];
    if (l(d)) {
      for (; l(d) && d.nodeType !== Node.TEXT_NODE; )
        d = e ? d.firstChild : d.lastChild;
      if (l(d) && d.nodeType === Node.TEXT_NODE) {
        var u = (n = (t = d.textContent) === null || t === void 0 ? void 0 : t.length) !== null && n !== void 0 ? n : 0, r = e ? 0 : u;
        i.setStart(d, r), i.setEnd(d, r);
      } else
        a(o, e);
    } else
      a(o);
    s.removeAllRanges(), s.addRange(i);
  }
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.focus = void 0;
  var e = Jn;
  Object.defineProperty(o, "focus", { enumerable: !0, get: function() {
    return e.focus;
  } });
})(Ds);
var Qn = {}, Eo = {};
Object.defineProperty(Eo, "__esModule", { value: !0 });
Eo.getCaretNodeAndOffset = uu;
function uu() {
  var o = window.getSelection();
  if (o === null)
    return [null, 0];
  var e = o.focusNode, t = o.focusOffset;
  return e === null ? [null, 0] : (e.nodeType !== Node.TEXT_NODE && e.childNodes.length > 0 && (e.childNodes[t] !== void 0 ? (e = e.childNodes[t], t = 0) : (e = e.childNodes[t - 1], e.textContent !== null && (t = e.textContent.length))), [e, t]);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getCaretNodeAndOffset = void 0;
  var e = Eo;
  Object.defineProperty(o, "getCaretNodeAndOffset", { enumerable: !0, get: function() {
    return e.getCaretNodeAndOffset;
  } });
})(Qn);
var Hs = {}, So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
So.getRange = hu;
function hu() {
  var o = window.getSelection();
  return o && o.rangeCount ? o.getRangeAt(0) : null;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getRange = void 0;
  var e = So;
  Object.defineProperty(o, "getRange", { enumerable: !0, get: function() {
    return e.getRange;
  } });
})(Hs);
var Fs = {}, er = {};
Object.defineProperty(er, "__esModule", { value: !0 });
er.isCaretAtEndOfInput = gu;
var Ci = F, pu = Qn, fu = Zn;
function gu(o) {
  var e = (0, Ci.getDeepestNode)(o, !0);
  if (e === null)
    return !0;
  if ((0, Ci.isNativeInput)(e))
    return e.selectionEnd === e.value.length;
  var t = (0, pu.getCaretNodeAndOffset)(), n = t[0], r = t[1];
  return n === null ? !1 : (0, fu.checkContenteditableSliceForEmptiness)(o, n, r, "right");
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isCaretAtEndOfInput = void 0;
  var e = er;
  Object.defineProperty(o, "isCaretAtEndOfInput", { enumerable: !0, get: function() {
    return e.isCaretAtEndOfInput;
  } });
})(Fs);
var zs = {}, tr = {};
Object.defineProperty(tr, "__esModule", { value: !0 });
tr.isCaretAtStartOfInput = vu;
var Ut = F, mu = Eo, bu = xo;
function vu(o) {
  var e = (0, Ut.getDeepestNode)(o);
  if (e === null || (0, Ut.isEmpty)(o))
    return !0;
  if ((0, Ut.isNativeInput)(e))
    return e.selectionEnd === 0;
  if ((0, Ut.isEmpty)(o))
    return !0;
  var t = (0, mu.getCaretNodeAndOffset)(), n = t[0], r = t[1];
  return n === null ? !1 : (0, bu.checkContenteditableSliceForEmptiness)(o, n, r, "left");
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isCaretAtStartOfInput = void 0;
  var e = tr;
  Object.defineProperty(o, "isCaretAtStartOfInput", { enumerable: !0, get: function() {
    return e.isCaretAtStartOfInput;
  } });
})(zs);
var Us = {}, or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.save = wu;
var yu = F, ku = So;
function wu() {
  var o = (0, ku.getRange)(), e = (0, yu.make)("span");
  if (e.id = "cursor", e.hidden = !0, !!o)
    return o.insertNode(e), function() {
      var t = window.getSelection();
      t && (o.setStartAfter(e), o.setEndAfter(e), t.removeAllRanges(), t.addRange(o), setTimeout(function() {
        e.remove();
      }, 150));
    };
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.save = void 0;
  var e = or;
  Object.defineProperty(o, "save", { enumerable: !0, get: function() {
    return e.save;
  } });
})(Us);
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.save = o.isCaretAtStartOfInput = o.isCaretAtEndOfInput = o.getRange = o.getCaretNodeAndOffset = o.focus = o.getContenteditableSlice = o.checkContenteditableSliceForEmptiness = void 0;
  var e = Zn;
  Object.defineProperty(o, "checkContenteditableSliceForEmptiness", { enumerable: !0, get: function() {
    return e.checkContenteditableSliceForEmptiness;
  } });
  var t = Rs;
  Object.defineProperty(o, "getContenteditableSlice", { enumerable: !0, get: function() {
    return t.getContenteditableSlice;
  } });
  var n = Ds;
  Object.defineProperty(o, "focus", { enumerable: !0, get: function() {
    return n.focus;
  } });
  var r = Qn;
  Object.defineProperty(o, "getCaretNodeAndOffset", { enumerable: !0, get: function() {
    return r.getCaretNodeAndOffset;
  } });
  var i = Hs;
  Object.defineProperty(o, "getRange", { enumerable: !0, get: function() {
    return i.getRange;
  } });
  var s = Fs;
  Object.defineProperty(o, "isCaretAtEndOfInput", { enumerable: !0, get: function() {
    return s.isCaretAtEndOfInput;
  } });
  var a = zs;
  Object.defineProperty(o, "isCaretAtStartOfInput", { enumerable: !0, get: function() {
    return a.isCaretAtStartOfInput;
  } });
  var l = Us;
  Object.defineProperty(o, "save", { enumerable: !0, get: function() {
    return l.save;
  } });
})(Bt);
let xu = class J {
  /**
   * Getter for all CSS classes used in unordered list rendering
   */
  static get CSS() {
    return {
      ...se,
      checklist: `${ue}-checklist`,
      itemChecked: `${ue}__checkbox--checked`,
      noHover: `${ue}__checkbox--no-hover`,
      checkbox: `${ue}__checkbox-check`,
      checkboxContainer: `${ue}__checkbox`
    };
  }
  /**
   * Assign passed readonly mode and config to relevant class properties
   * @param readonly - read-only mode flag
   * @param config - user config for Tool
   */
  constructor(e, t) {
    this.config = t, this.readOnly = e;
  }
  /**
   * Renders ul wrapper for list
   * @param isRoot - boolean variable that represents level of the wrappre (root or childList)
   * @returns - created html ul element
   */
  renderWrapper(e) {
    let t;
    return e === !0 ? (t = F.make("ul", [J.CSS.wrapper, J.CSS.checklist]), t.addEventListener("click", (n) => {
      const r = n.target;
      if (r) {
        const i = r.closest(`.${J.CSS.checkboxContainer}`);
        i && i.contains(r) && this.toggleCheckbox(i);
      }
    })) : t = F.make("ul", [J.CSS.checklist, J.CSS.itemChildren]), t;
  }
  /**
   * Redners list item element
   * @param content - content used in list item rendering
   * @param meta - meta of the list item used in rendering of the checklist
   * @returns - created html list item element
   */
  renderItem(e, t) {
    const n = F.make("li", [J.CSS.item, J.CSS.item]), r = F.make("div", J.CSS.itemContent, {
      innerHTML: e,
      contentEditable: (!this.readOnly).toString()
    }), i = F.make("span", J.CSS.checkbox), s = F.make("div", J.CSS.checkboxContainer);
    return t.checked === !0 && s.classList.add(J.CSS.itemChecked), i.innerHTML = jc, s.appendChild(i), n.appendChild(s), n.appendChild(r), n;
  }
  /**
   * Return the item content
   * @param item - item wrapper (<li>)
   * @returns - item content string
   */
  getItemContent(e) {
    const t = e.querySelector(`.${J.CSS.itemContent}`);
    return !t || F.isEmpty(t) ? "" : t.innerHTML;
  }
  /**
   * Return meta object of certain element
   * @param item - will be returned meta information of this item
   * @returns Item meta object
   */
  getItemMeta(e) {
    const t = e.querySelector(`.${J.CSS.checkboxContainer}`);
    return {
      checked: t ? t.classList.contains(J.CSS.itemChecked) : !1
    };
  }
  /**
   * Returns default item meta used on creation of the new item
   */
  composeDefaultMeta() {
    return { checked: !1 };
  }
  /**
   * Toggle checklist item state
   * @param checkbox - checkbox element to be toggled
   */
  toggleCheckbox(e) {
    e.classList.toggle(J.CSS.itemChecked), e.classList.add(J.CSS.noHover), e.addEventListener("mouseleave", () => this.removeSpecialHoverBehavior(e), { once: !0 });
  }
  /**
   * Removes class responsible for special hover behavior on an item
   * @param el - item wrapper
   */
  removeSpecialHoverBehavior(e) {
    e.classList.remove(J.CSS.noHover);
  }
};
function Ro(o, e = "after") {
  const t = [];
  let n;
  function r(i) {
    switch (e) {
      case "after":
        return i.nextElementSibling;
      case "before":
        return i.previousElementSibling;
    }
  }
  for (n = r(o); n !== null; )
    t.push(n), n = r(n);
  return t.length !== 0 ? t : null;
}
function Se(o, e = !0) {
  let t = o;
  return o.classList.contains(se.item) && (t = o.querySelector(`.${se.itemChildren}`)), t === null ? [] : e ? Array.from(t.querySelectorAll(`:scope > .${se.item}`)) : Array.from(t.querySelectorAll(`.${se.item}`));
}
function Cu(o) {
  return o.nextElementSibling === null;
}
function Eu(o) {
  return o.querySelector(`.${se.itemChildren}`) !== null;
}
function Ne(o) {
  return o.querySelector(`.${se.itemChildren}`);
}
function Do(o) {
  let e = o;
  o.classList.contains(se.item) && (e = Ne(o)), e !== null && Se(e).length === 0 && e.remove();
}
function Yt(o) {
  return o.querySelector(`.${se.itemContent}`);
}
function st(o, e = !0) {
  const t = Yt(o);
  t && Bt.focus(t, e);
}
let Ho = class {
  /**
   * Getter method to get current item
   * @returns current list item or null if caret position is not undefined
   */
  get currentItem() {
    const e = window.getSelection();
    if (!e)
      return null;
    let t = e.anchorNode;
    return !t || (qe(t) || (t = t.parentNode), !t) || !qe(t) ? null : t.closest(`.${se.item}`);
  }
  /**
   * Method that returns nesting level of the current item, null if there is no selection
   */
  get currentItemLevel() {
    const e = this.currentItem;
    if (e === null)
      return null;
    let t = e.parentNode, n = 0;
    for (; t !== null && t !== this.listWrapper; )
      qe(t) && t.classList.contains(se.item) && (n += 1), t = t.parentNode;
    return n + 1;
  }
  /**
   * Assign all passed params and renderer to relevant class properties
   * @param params - tool constructor options
   * @param params.data - previously saved data
   * @param params.config - user config for Tool
   * @param params.api - Editor.js API
   * @param params.readOnly - read-only mode flag
   * @param renderer - renderer instance initialized in tool class
   */
  constructor({ data: e, config: t, api: n, readOnly: r, block: i }, s) {
    this.config = t, this.data = e, this.readOnly = r, this.api = n, this.block = i, this.renderer = s;
  }
  /**
   * Function that is responsible for rendering list with contents
   * @returns Filled with content wrapper element of the list
   */
  render() {
    return this.listWrapper = this.renderer.renderWrapper(!0), this.data.items.length ? this.appendItems(this.data.items, this.listWrapper) : this.appendItems(
      [
        {
          content: "",
          meta: {},
          items: []
        }
      ],
      this.listWrapper
    ), this.readOnly || this.listWrapper.addEventListener(
      "keydown",
      (e) => {
        switch (e.key) {
          case "Enter":
            this.enterPressed(e);
            break;
          case "Backspace":
            this.backspace(e);
            break;
          case "Tab":
            e.shiftKey ? this.shiftTab(e) : this.addTab(e);
            break;
        }
      },
      !1
    ), "start" in this.data.meta && this.data.meta.start !== void 0 && this.changeStartWith(this.data.meta.start), "counterType" in this.data.meta && this.data.meta.counterType !== void 0 && this.changeCounters(this.data.meta.counterType), this.listWrapper;
  }
  /**
   * Function that is responsible for list content saving
   * @param wrapper - optional argument wrapper
   * @returns whole list saved data if wrapper not passes, otherwise will return data of the passed wrapper
   */
  save(e) {
    const t = e ?? this.listWrapper, n = (s) => Se(s).map((a) => {
      const l = Ne(a), c = this.renderer.getItemContent(a), d = this.renderer.getItemMeta(a), u = l ? n(l) : [];
      return {
        content: c,
        meta: d,
        items: u
      };
    }), r = t ? n(t) : [];
    let i = {
      style: this.data.style,
      meta: {},
      items: r
    };
    return this.data.style === "ordered" && (i.meta = {
      start: this.data.meta.start,
      counterType: this.data.meta.counterType
    }), i;
  }
  /**
   * On paste sanitzation config. Allow only tags that are allowed in the Tool.
   * @returns - config that determines tags supposted by paste handler
   * @todo - refactor and move to list instance
   */
  static get pasteConfig() {
    return {
      tags: ["OL", "UL", "LI"]
    };
  }
  /**
   * Method that specified hot to merge two List blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * Content of the first item of the next List would be merged with deepest item in current list
   * Other items of the next List would be appended to the current list without any changes in nesting levels
   * @param data - data of the second list to be merged with current
   */
  merge(e) {
    const t = this.block.holder.querySelectorAll(`.${se.item}`), n = t[t.length - 1], r = Yt(n);
    if (n === null || r === null || (r.insertAdjacentHTML("beforeend", e.items[0].content), this.listWrapper === void 0))
      return;
    const i = Se(this.listWrapper);
    if (i.length === 0)
      return;
    const s = i[i.length - 1];
    let a = Ne(s);
    const l = e.items.shift();
    l !== void 0 && (l.items.length !== 0 && (a === null && (a = this.renderer.renderWrapper(!1)), this.appendItems(l.items, a)), e.items.length > 0 && this.appendItems(e.items, this.listWrapper));
  }
  /**
   * On paste callback that is fired from Editor.
   * @param event - event with pasted data
   * @todo - refactor and move to list instance
   */
  onPaste(e) {
    const t = e.detail.data;
    this.data = this.pasteHandler(t);
    const n = this.listWrapper;
    n && n.parentNode && n.parentNode.replaceChild(this.render(), n);
  }
  /**
   * Handle UL, OL and LI tags paste and returns List data
   * @param element - html element that contains whole list
   * @todo - refactor and move to list instance
   */
  pasteHandler(e) {
    const { tagName: t } = e;
    let n = "unordered", r;
    switch (t) {
      case "OL":
        n = "ordered", r = "ol";
        break;
      case "UL":
      case "LI":
        n = "unordered", r = "ul";
    }
    const i = {
      style: n,
      meta: {},
      items: []
    };
    n === "ordered" && (this.data.meta.counterType = "numeric", this.data.meta.start = 1);
    const s = (a) => Array.from(a.querySelectorAll(":scope > li")).map((l) => {
      const c = l.querySelector(`:scope > ${r}`), d = c ? s(c) : [];
      return {
        content: l.innerHTML ?? "",
        meta: {},
        items: d
      };
    });
    return i.items = s(e), i;
  }
  /**
   * Changes ordered list start property value
   * @param index - new value of the start property
   */
  changeStartWith(e) {
    this.listWrapper.style.setProperty("counter-reset", `item ${e - 1}`), this.data.meta.start = e;
  }
  /**
   * Changes ordered list counterType property value
   * @param counterType - new value of the counterType value
   */
  changeCounters(e) {
    this.listWrapper.style.setProperty("--list-counter-type", e), this.data.meta.counterType = e;
  }
  /**
   * Handles Enter keypress
   * @param event - keydown
   */
  enterPressed(e) {
    var t;
    const n = this.currentItem;
    if (e.stopPropagation(), e.preventDefault(), e.isComposing || n === null)
      return;
    const r = ((t = this.renderer) == null ? void 0 : t.getItemContent(n).trim().length) === 0, i = n.parentNode === this.listWrapper, s = n.previousElementSibling === null, a = this.api.blocks.getCurrentBlockIndex();
    if (i && r)
      if (Cu(n) && !Eu(n)) {
        s ? this.convertItemToDefaultBlock(a, !0) : this.convertItemToDefaultBlock();
        return;
      } else {
        this.splitList(n);
        return;
      }
    else if (r) {
      this.unshiftItem(n);
      return;
    } else
      this.splitItem(n);
  }
  /**
   * Handle backspace
   * @param event - keydown
   */
  backspace(e) {
    var t;
    const n = this.currentItem;
    if (n !== null && Bt.isCaretAtStartOfInput(n) && ((t = window.getSelection()) == null ? void 0 : t.isCollapsed) !== !1) {
      if (e.stopPropagation(), n.parentNode === this.listWrapper && n.previousElementSibling === null) {
        this.convertFirstItemToDefaultBlock();
        return;
      }
      e.preventDefault(), this.mergeItemWithPrevious(n);
    }
  }
  /**
   * Reduce indentation for current item
   * @param event - keydown
   */
  shiftTab(e) {
    e.stopPropagation(), e.preventDefault(), this.currentItem !== null && this.unshiftItem(this.currentItem);
  }
  /**
   * Decrease indentation of the passed item
   * @param item - list item to be unshifted
   */
  unshiftItem(e) {
    if (!e.parentNode || !qe(e.parentNode))
      return;
    const t = e.parentNode.closest(`.${se.item}`);
    if (!t)
      return;
    let n = Ne(e);
    if (e.parentElement === null)
      return;
    const r = Ro(e);
    r !== null && (n === null && (n = this.renderer.renderWrapper(!1)), r.forEach((i) => {
      n.appendChild(i);
    }), e.appendChild(n)), t.after(e), st(e, !1), Do(t);
  }
  /**
   * Method that is used for list splitting and moving trailing items to the new separated list
   * @param item - current item html element
   */
  splitList(e) {
    const t = Se(e), n = this.block, r = this.api.blocks.getCurrentBlockIndex();
    if (t.length !== 0) {
      const l = t[0];
      this.unshiftItem(l), st(e, !1);
    }
    if (e.previousElementSibling === null && e.parentNode === this.listWrapper) {
      this.convertItemToDefaultBlock(r);
      return;
    }
    const i = Ro(e);
    if (i === null)
      return;
    const s = this.renderer.renderWrapper(!0);
    i.forEach((l) => {
      s.appendChild(l);
    });
    const a = this.save(s);
    a.meta.start = this.data.style == "ordered" ? 1 : void 0, this.api.blocks.insert(n == null ? void 0 : n.name, a, this.config, r + 1), this.convertItemToDefaultBlock(r + 1), s.remove();
  }
  /**
   * Method that is used for splitting item content and moving trailing content to the new sibling item
   * @param currentItem - current item html element
   */
  splitItem(e) {
    const [t, n] = Bt.getCaretNodeAndOffset();
    if (t === null)
      return;
    const r = Yt(e);
    let i;
    r === null ? i = "" : i = Bt.getContenteditableSlice(r, t, n, "right", !0);
    const s = Ne(e), a = this.renderItem(i);
    e == null || e.after(a), s && a.appendChild(s), st(a);
  }
  /**
   * Method that is used for merging current item with previous one
   * Content of the current item would be appended to the previous item
   * Current item children would not change nesting level
   * @param item - current item html element
   */
  mergeItemWithPrevious(e) {
    const t = e.previousElementSibling, n = e.parentNode;
    if (n === null || !qe(n))
      return;
    const r = n.closest(`.${se.item}`);
    if (!t && !r || t && !qe(t))
      return;
    let i;
    if (t) {
      const u = Se(t, !1);
      u.length !== 0 && u.length !== 0 ? i = u[u.length - 1] : i = t;
    } else
      i = r;
    const s = this.renderer.getItemContent(e);
    if (!i)
      return;
    st(i, !1);
    const a = Yt(i);
    if (a === null)
      return;
    a.insertAdjacentHTML("beforeend", s);
    const l = Se(e);
    if (l.length === 0) {
      e.remove(), Do(i);
      return;
    }
    const c = t || r, d = Ne(c) ?? this.renderer.renderWrapper(!1);
    t ? l.forEach((u) => {
      d.appendChild(u);
    }) : l.forEach((u) => {
      d.prepend(u);
    }), Ne(c) === null && i.appendChild(d), e.remove();
  }
  /**
   * Add indentation to current item
   * @param event - keydown
   */
  addTab(e) {
    var t;
    e.stopPropagation(), e.preventDefault();
    const n = this.currentItem;
    if (!n)
      return;
    if (((t = this.config) == null ? void 0 : t.maxLevel) !== void 0) {
      const s = this.currentItemLevel;
      if (s !== null && s === this.config.maxLevel)
        return;
    }
    const r = n.previousSibling;
    if (r === null || !qe(r))
      return;
    const i = Ne(r);
    if (i)
      i.appendChild(n), Se(n).forEach((s) => {
        i.appendChild(s);
      });
    else {
      const s = this.renderer.renderWrapper(!1);
      s.appendChild(n), Se(n).forEach((a) => {
        s.appendChild(a);
      }), r.appendChild(s);
    }
    Do(n), st(n, !1);
  }
  /**
   * Convert current item to default block with passed index
   * @param newBloxkIndex - optional parameter represents index, where would be inseted default block
   * @param removeList - optional parameter, that represents condition, if List should be removed
   */
  convertItemToDefaultBlock(e, t) {
    let n;
    const r = this.currentItem, i = r !== null ? this.renderer.getItemContent(r) : "";
    t === !0 && this.api.blocks.delete(), e !== void 0 ? n = this.api.blocks.insert(void 0, { text: i }, void 0, e) : n = this.api.blocks.insert(), r == null || r.remove(), this.api.caret.setToBlock(n, "start");
  }
  /**
   * Convert first item of the list to default block
   * This method could be called when backspace button pressed at start of the first item of the list
   * First item of the list would be converted to the paragraph and first item children would be unshifted
   */
  convertFirstItemToDefaultBlock() {
    const e = this.currentItem;
    if (e === null)
      return;
    const t = Se(e);
    if (t.length !== 0) {
      const s = t[0];
      this.unshiftItem(s), st(e);
    }
    const n = Ro(e), r = this.api.blocks.getCurrentBlockIndex(), i = n === null;
    this.convertItemToDefaultBlock(r, i);
  }
  /**
   * Method that calls render function of the renderer with a necessary item meta cast
   * @param itemContent - content to be rendered in new item
   * @param meta - meta used in list item rendering
   * @returns html element of the rendered item
   */
  renderItem(e, t) {
    const n = t ?? this.renderer.composeDefaultMeta();
    switch (!0) {
      case this.renderer instanceof $s:
        return this.renderer.renderItem(e, n);
      case this.renderer instanceof js:
        return this.renderer.renderItem(e, n);
      default:
        return this.renderer.renderItem(e, n);
    }
  }
  /**
   * Renders children list
   * @param items - list data used in item rendering
   * @param parentElement - where to append passed items
   */
  appendItems(e, t) {
    e.forEach((n) => {
      var r;
      const i = this.renderItem(n.content, n.meta);
      if (t.appendChild(i), n.items.length) {
        const s = (r = this.renderer) == null ? void 0 : r.renderWrapper(!1);
        this.appendItems(n.items, s), i.appendChild(s);
      }
    });
  }
};
const at = {
  wrapper: `${ue}-start-with-field`,
  input: `${ue}-start-with-field__input`,
  startWithElementWrapperInvalid: `${ue}-start-with-field--invalid`
};
function Su(o, { value: e, placeholder: t, attributes: n, sanitize: r }) {
  const i = F.make("div", at.wrapper), s = F.make("input", at.input, {
    placeholder: t,
    /**
     * Used to prevent focusing on the input by Tab key
     * (Popover in the Toolbar lays below the blocks,
     * so Tab in the last block will focus this hidden input if this property is not set)
     */
    tabIndex: -1,
    /**
     * Value of the start property, if it is not specified, then it is set to one
     */
    value: e
  });
  for (const a in n)
    s.setAttribute(a, n[a]);
  return i.appendChild(s), s.addEventListener("input", () => {
    r !== void 0 && (s.value = r(s.value));
    const a = s.checkValidity();
    !a && !i.classList.contains(at.startWithElementWrapperInvalid) && i.classList.add(at.startWithElementWrapperInvalid), a && i.classList.contains(at.startWithElementWrapperInvalid) && i.classList.remove(at.startWithElementWrapperInvalid), a && o(s.value);
  }), i;
}
const vt = /* @__PURE__ */ new Map([
  /**
   * Value that represents default arabic numbers for counters
   */
  ["Numeric", "numeric"],
  /**
   * Value that represents lower roman numbers for counteres
   */
  ["Lower Roman", "lower-roman"],
  /**
   * Value that represents upper roman numbers for counters
   */
  ["Upper Roman", "upper-roman"],
  /**
   * Value that represents lower alpha characters for counters
   */
  ["Lower Alpha", "lower-alpha"],
  /**
   * Value that represents upper alpha characters for counters
   */
  ["Upper Alpha", "upper-alpha"]
]), Ei = /* @__PURE__ */ new Map([
  /**
   * Value that represents Icon for Numeric counter type
   */
  ["numeric", Rc],
  /**
   * Value that represents Icon for Lower Roman counter type
   */
  ["lower-roman", Dc],
  /**
   * Value that represents Icon for Upper Roman counter type
   */
  ["upper-roman", Hc],
  /**
   * Value that represents Icon for Lower Alpha counter type
   */
  ["lower-alpha", zc],
  /**
   * Value that represents Icon for Upper Alpha counter type
   */
  ["upper-alpha", Fc]
]);
function Tu(o) {
  return o.replace(/\D+/g, "");
}
function Bu(o) {
  return typeof o.items[0] == "string";
}
function _u(o) {
  return !("meta" in o);
}
function Ou(o) {
  return typeof o.items[0] != "string" && "text" in o.items[0] && "checked" in o.items[0] && typeof o.items[0].text == "string" && typeof o.items[0].checked == "boolean";
}
function Mu(o) {
  const e = [];
  return Bu(o) ? (o.items.forEach((t) => {
    e.push({
      content: t,
      meta: {},
      items: []
    });
  }), {
    style: o.style,
    meta: {},
    items: e
  }) : Ou(o) ? (o.items.forEach((t) => {
    e.push({
      content: t.text,
      meta: {
        checked: t.checked
      },
      items: []
    });
  }), {
    style: "checklist",
    meta: {},
    items: e
  }) : _u(o) ? {
    style: o.style,
    meta: {},
    items: o.items
  } : o;
}
let Iu = class rn {
  /**
   * Notify core that read-only mode is supported
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Allow to use native Enter behaviour
   */
  static get enableLineBreaks() {
    return !0;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  static get toolbox() {
    return [
      {
        icon: ki,
        title: "Unordered List",
        data: {
          style: "unordered"
        }
      },
      {
        icon: wi,
        title: "Ordered List",
        data: {
          style: "ordered"
        }
      },
      {
        icon: yi,
        title: "Checklist",
        data: {
          style: "checklist"
        }
      }
    ];
  }
  /**
   * On paste sanitzation config. Allow only tags that are allowed in the Tool.
   * @returns - paste config object used in editor
   */
  static get pasteConfig() {
    return {
      tags: ["OL", "UL", "LI"]
    };
  }
  /**
   * Convert from text to list with import and export list to text
   */
  static get conversionConfig() {
    return {
      export: (e) => rn.joinRecursive(e),
      import: (e, t) => ({
        meta: {},
        items: [
          {
            content: e,
            meta: {},
            items: []
          }
        ],
        style: (t == null ? void 0 : t.defaultStyle) !== void 0 ? t.defaultStyle : "unordered"
      })
    };
  }
  /**
   * Get list style name
   */
  get listStyle() {
    return this.data.style || this.defaultListStyle;
  }
  /**
   * Set list style
   * @param style - new style to set
   */
  set listStyle(e) {
    var t;
    this.data.style = e, this.changeTabulatorByStyle();
    const n = this.list.render();
    (t = this.listElement) == null || t.replaceWith(n), this.listElement = n;
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   * @param params - tool constructor options
   * @param params.data - previously saved data
   * @param params.config - user config for Tool
   * @param params.api - Editor.js API
   * @param params.readOnly - read-only mode flag
   */
  constructor({ data: e, config: t, api: n, readOnly: r, block: i }) {
    var s;
    this.api = n, this.readOnly = r, this.config = t, this.block = i, this.defaultListStyle = ((s = this.config) == null ? void 0 : s.defaultStyle) || "unordered", this.defaultCounterTypes = this.config.counterTypes || Array.from(vt.values());
    const a = {
      style: this.defaultListStyle,
      meta: {},
      items: []
    };
    this.data = Object.keys(e).length ? Mu(e) : a, this.listStyle === "ordered" && this.data.meta.counterType === void 0 && (this.data.meta.counterType = "numeric"), this.changeTabulatorByStyle();
  }
  /**
   * Convert from list to text for conversionConfig
   * @param data - current data of the list
   * @returns - string of the recursively merged contents of the items of the list
   */
  static joinRecursive(e) {
    return e.items.map((t) => `${t.content} ${rn.joinRecursive(t)}`).join("");
  }
  /**
   * Function that is responsible for content rendering
   * @returns rendered list wrapper with all contents
   */
  render() {
    return this.listElement = this.list.render(), this.listElement;
  }
  /**
   * Function that is responsible for content saving
   * @returns formatted content used in editor
   */
  save() {
    return this.data = this.list.save(), this.data;
  }
  /**
   * Function that is responsible for mergind two lists into one
   * @param data - data of the next standing list, that should be merged with current
   */
  merge(e) {
    this.list.merge(e);
  }
  /**
   * Creates Block Tune allowing to change the list style
   * @returns array of tune configs
   */
  renderSettings() {
    const e = [
      {
        label: this.api.i18n.t("Unordered"),
        icon: ki,
        closeOnActivate: !0,
        isActive: this.listStyle == "unordered",
        onActivate: () => {
          this.listStyle = "unordered";
        }
      },
      {
        label: this.api.i18n.t("Ordered"),
        icon: wi,
        closeOnActivate: !0,
        isActive: this.listStyle == "ordered",
        onActivate: () => {
          this.listStyle = "ordered";
        }
      },
      {
        label: this.api.i18n.t("Checklist"),
        icon: yi,
        closeOnActivate: !0,
        isActive: this.listStyle == "checklist",
        onActivate: () => {
          this.listStyle = "checklist";
        }
      }
    ];
    if (this.listStyle === "ordered") {
      const t = Su(
        (i) => this.changeStartWith(Number(i)),
        {
          value: String(this.data.meta.start ?? 1),
          placeholder: "",
          attributes: {
            required: "true"
          },
          sanitize: (i) => Tu(i)
        }
      ), n = [
        {
          label: this.api.i18n.t("Start with"),
          icon: Uc,
          children: {
            items: [
              {
                element: t,
                // @ts-expect-error ts(2820) can not use PopoverItem enum from editor.js types
                type: "html"
              }
            ]
          }
        }
      ], r = {
        label: this.api.i18n.t("Counter type"),
        icon: Ei.get(this.data.meta.counterType),
        children: {
          items: []
        }
      };
      vt.forEach((i, s) => {
        const a = vt.get(s);
        this.defaultCounterTypes.includes(a) && r.children.items.push({
          title: this.api.i18n.t(s),
          icon: Ei.get(a),
          isActive: this.data.meta.counterType === vt.get(s),
          closeOnActivate: !0,
          onActivate: () => {
            this.changeCounters(vt.get(s));
          }
        });
      }), r.children.items.length > 1 && n.push(r), e.push({ type: "separator" }, ...n);
    }
    return e;
  }
  /**
   * On paste callback that is fired from Editor.
   * @param event - event with pasted data
   */
  onPaste(e) {
    const { tagName: t } = e.detail.data;
    switch (t) {
      case "OL":
        this.listStyle = "ordered";
        break;
      case "UL":
      case "LI":
        this.listStyle = "unordered";
    }
    this.list.onPaste(e);
  }
  /**
   * Handle UL, OL and LI tags paste and returns List data
   * @param element - html element that contains whole list
   */
  pasteHandler(e) {
    return this.list.pasteHandler(e);
  }
  /**
   * Changes ordered list counterType property value
   * @param counterType - new value of the counterType value
   */
  changeCounters(e) {
    var t;
    (t = this.list) == null || t.changeCounters(e), this.data.meta.counterType = e;
  }
  /**
   * Changes ordered list start property value
   * @param index - new value of the start property
   */
  changeStartWith(e) {
    var t;
    (t = this.list) == null || t.changeStartWith(e), this.data.meta.start = e;
  }
  /**
   * This method allows changing tabulator respectfully to passed style
   */
  changeTabulatorByStyle() {
    switch (this.listStyle) {
      case "ordered":
        this.list = new Ho(
          {
            data: this.data,
            readOnly: this.readOnly,
            api: this.api,
            config: this.config,
            block: this.block
          },
          new $s(this.readOnly, this.config)
        );
        break;
      case "unordered":
        this.list = new Ho(
          {
            data: this.data,
            readOnly: this.readOnly,
            api: this.api,
            config: this.config,
            block: this.block
          },
          new js(this.readOnly, this.config)
        );
        break;
      case "checklist":
        this.list = new Ho(
          {
            data: this.data,
            readOnly: this.readOnly,
            api: this.api,
            config: this.config,
            block: this.block
          },
          new xu(this.readOnly, this.config)
        );
        break;
    }
  }
};
var Lu = [["path", {
  d: "M3 12h.01",
  key: "nlz23k"
}], ["path", {
  d: "M3 18h.01",
  key: "1tta3j"
}], ["path", {
  d: "M3 6h.01",
  key: "1rqtza"
}], ["path", {
  d: "M8 12h13",
  key: "1za7za"
}], ["path", {
  d: "M8 18h13",
  key: "1lx6n3"
}], ["path", {
  d: "M8 6h13",
  key: "ik3vkj"
}]], Au = (o) => m(X, R(o, {
  iconNode: Lu,
  name: "list"
})), Pu = Au, Nu = /* @__PURE__ */ y("<ul>"), Fo = /* @__PURE__ */ y("<li>"), $u = /* @__PURE__ */ y("<ol>"), ju = /* @__PURE__ */ y("<ul data-checklist>");
jt(Iu, {
  type: "list",
  toolbox: {
    title: "List",
    icon: de(Pu)
  },
  toolSettings: {
    inlineToolbar: !0,
    config: {
      defaultStyle: "unordered",
      maxLevel: 1
      // TODO: support nesting
    }
  },
  renderer: (o) => {
    switch (o.style) {
      case "unordered":
        return (() => {
          var e = Nu();
          return k(e, () => o.items.map((t) => (() => {
            var n = Fo();
            return k(n, () => Ce(t.content)), n;
          })())), e;
        })();
      case "ordered":
        return (() => {
          var e = $u();
          return k(e, () => o.items.map((t) => (() => {
            var n = Fo();
            return k(n, () => Ce(t.content)), n;
          })())), q((t) => {
            var n = o.meta.start, r = o.meta.counterType;
            return n !== t.e && A(e, "data-start", t.e = n), r !== t.t && A(e, "data-counter-type", t.t = r), t;
          }, {
            e: void 0,
            t: void 0
          }), e;
        })();
      case "checklist":
        return (() => {
          var e = ju();
          return k(e, () => o.items.map((t) => (() => {
            var n = Fo();
            return gn(n, R(() => t.meta.checked && {
              "data-checked": ""
            }), !1, !0), k(n, () => Ce(t.content)), n;
          })())), e;
        })();
    }
  },
  parser: (o) => {
    if (o.type === "ol" || o.type === "ul")
      return o.type === "ul" && "checklist" in o.dataset ? {
        style: "checklist",
        items: o.content.map((e) => ({
          content: te(e.content),
          meta: {
            checked: "dataset" in e && "checked" in e.dataset
          },
          items: []
        }))
      } : o.type === "ol" ? {
        style: "ordered",
        meta: {
          start: parseInt(o.dataset.start ?? "1"),
          counterType: o.dataset.counterType ?? "numeric"
        },
        items: o.content.map((e) => ({
          content: te(e.content),
          meta: {},
          items: []
        }))
      } : {
        style: "unordered",
        items: o.content.map((e) => ({
          content: te(e.content),
          meta: {},
          items: []
        }))
      };
  }
});
var Ru = [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["line", {
  x1: "12",
  x2: "12",
  y1: "8",
  y2: "12",
  key: "1pkeuh"
}], ["line", {
  x1: "12",
  x2: "12.01",
  y1: "16",
  y2: "16",
  key: "4dfq90"
}]], Du = (o) => m(X, R(o, {
  iconNode: Ru,
  name: "circle-alert"
})), Hu = Du, Fu = /* @__PURE__ */ y("<callout-card>", !0, !1, !1), zu = /* @__PURE__ */ y("<div>");
const Si = [{
  emoji: "💡",
  label: "Note"
}, {
  emoji: "❓",
  label: "Question"
}, {
  emoji: "❗",
  label: "Warning"
}], Ti = {
  slate: "bg-slate-300 dark:bg-slate-600",
  white: "bg-zinc-100 dark:bg-zinc-900",
  green: "bg-green-300 dark:bg-green-400",
  red: "bg-red-300 dark:bg-red-400"
};
ze({
  type: "callout-card",
  toolbox: {
    title: "Callout Card",
    icon: de(Hu)
  },
  toolSettings: {
    inlineToolbar: !0
  },
  parser: (o) => {
    var e, t;
    if (o.type === "callout-card") {
      const n = ((e = o.attributes) == null ? void 0 : e.emoji) ?? "";
      return {
        color: ((t = o.attributes) == null ? void 0 : t.color) ?? "slate",
        emoji: n,
        text: te(o.content)
      };
    }
  },
  renderer: ({
    text: o,
    color: e,
    emoji: t
  }) => (() => {
    var n = Fu();
    return A(n, "color", e), A(n, "emoji", t), n._$owner = ge(), k(n, o), n;
  })(),
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {
        text: "",
        color: "slate",
        emoji: Si[0].emoji
      });
    }
    renderSettings() {
      const [, t] = this.store;
      return [...Si.map((n) => ({
        icon: n.emoji,
        label: n.label,
        onActivate: () => t("emoji", n.emoji)
      })), {
        type: "separator"
      }, ...Object.keys(Ti).map((n) => ({
        icon: "",
        // icon: asString(PaintRoller),
        label: n.charAt(0).toUpperCase() + n.slice(1),
        onActivate: () => t("color", n)
      }))];
    }
    render() {
      const [t, n] = this.store;
      return m(Ie, {
        get children() {
          var r = zu();
          return k(r, m(ve, {
            class: "p-2 text-xl rounded-lg",
            get text() {
              return t.emoji ?? "";
            },
            onChange: (i) => n("emoji", i)
          }), null), k(r, m(ve, {
            class: "grow p-2 text-wrap rounded-lg",
            get text() {
              return t.text;
            },
            onChange: (i) => n("text", i)
          }), null), q(() => Qe(r, `flex ${Ti[t.color]} shadow rounded-lg`)), r;
        }
      });
    }
  }
});
var Uu = [["path", {
  d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
  key: "vktsd0"
}], ["circle", {
  cx: "7.5",
  cy: "7.5",
  r: ".5",
  fill: "currentColor",
  key: "kqv944"
}]], Wu = (o) => m(X, R(o, {
  iconNode: Uu,
  name: "tag"
})), qu = Wu, Ku = /* @__PURE__ */ y("<product-card><article-photo></article-photo><product-card-title></product-card-title><p>", !0, !1, !1), Vu = /* @__PURE__ */ y("<a>"), Yu = /* @__PURE__ */ y("<img class=rounded>"), Xu = /* @__PURE__ */ y('<div class="flex flex-col m-2 p-2 rounded border-[1pt] border-fg/20">');
ze({
  type: "product-card",
  renderer: ({
    img: o,
    title: e,
    description: t,
    button: n
  }) => (() => {
    var r = Ku(), i = r.firstChild, s = i.nextSibling, a = s.nextSibling;
    return r._$owner = ge(), A(i, "id", o), i._$owner = ge(), s._$owner = ge(), k(s, e), k(a, t), k(r, n && (() => {
      var l = Vu();
      return k(l, () => n.text), q(() => A(l, "href", n.href)), l;
    })(), null), r;
  })(),
  parser: (o) => {
    var e, t;
    if (o.type === "product-card") {
      const [n, r, i, s] = o.content;
      return {
        img: ((e = n.attributes) == null ? void 0 : e.id) || "",
        title: te(r.content),
        description: te(i.content),
        ...s && {
          button: {
            text: te(s.content),
            href: ((t = s.attributes) == null ? void 0 : t.href) || ""
          }
        }
      };
    }
  },
  toolbox: {
    title: "Product",
    icon: de(qu)
  },
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {
        img: "",
        title: "",
        description: ""
      });
    }
    validate(t) {
      return !!t.img;
    }
    renderSettings() {
      const [t, n] = this.store;
      return {
        label: "Button",
        // icon: Icon(ExternalLink),
        toggle: !0,
        isActive: !!t.button,
        onActivate: () => {
          t.button ? n("button", void 0) : n("button", {
            text: "",
            href: ""
          });
        }
      };
    }
    render() {
      const {
        getPhotoUrl: t,
        selectPhoto: n
      } = this.photoApi, [r, i] = Me(""), [s, a] = this.store;
      t(s.img).then((c) => i(c));
      function l() {
        n(1).then((c) => {
          if (c && c.length > 0) {
            const {
              id: d,
              url: u
            } = c[0];
            i(u), a("img", d);
          }
        });
      }
      return m(Ie, {
        get children() {
          return m(Ie, {
            class: "flex flex-col gap-1 p-2 rounded-lg border-[1pt] border-fg/20",
            get children() {
              return [Q(() => Q(() => !!r())() ? (() => {
                var c = Yu();
                return c.$$click = l, q(() => A(c, "src", r())), c;
              })() : m(Ve, {
                class: "p-1",
                onClick: l,
                children: "Select Photo"
              })), m(ve, {
                class: "px-1.5 py-0.5 rounded",
                get text() {
                  return s.title ?? "";
                },
                onChange: (c) => a("title", c),
                placeholder: "Title"
              }), m(ve, {
                class: "px-1.5 py-0.5 rounded",
                get text() {
                  return s.description ?? "";
                },
                onChange: (c) => a("description", c),
                placeholder: "Caption"
              }), Q(() => Q(() => !!s.button)() && (() => {
                var c = Xu();
                return k(c, m(ve, {
                  placeholder: "Text",
                  get text() {
                    return s.button.text;
                  },
                  onChange: (d) => a("button", "text", d)
                }), null), k(c, m(ve, {
                  placeholder: "Link",
                  get text() {
                    return s.button.href;
                  },
                  onChange: (d) => a("button", "href", d)
                }), null), c;
              })())];
            }
          });
        }
      });
    }
  }
});
Je(["click"]);
(function() {
  var o;
  try {
    if (typeof document < "u") {
      var e = document.createElement("style");
      e.nonce = (o = document.head.querySelector("meta[property=csp-nonce]")) == null ? void 0 : o.content, e.appendChild(document.createTextNode('.tc-wrap{--color-background:#f9f9fb;--color-text-secondary:#7b7e89;--color-border:#e8e8eb;--cell-size:34px;--toolbox-icon-size:18px;--toolbox-padding:6px;--toolbox-aiming-field-size:calc(var(--toolbox-icon-size) + var(--toolbox-padding)*2);border-left:0;position:relative;height:100%;width:100%;margin-top:var(--toolbox-icon-size);box-sizing:border-box;display:grid;grid-template-columns:calc(100% - var(--cell-size)) var(--cell-size);z-index:0}.tc-wrap--readonly{grid-template-columns:100% var(--cell-size)}.tc-wrap svg{vertical-align:top}@media print{.tc-wrap{border-left-color:var(--color-border);border-left-style:solid;border-left-width:1px;grid-template-columns:100% var(--cell-size)}}@media print{.tc-wrap .tc-row:after{display:none}}.tc-table{position:relative;width:100%;height:100%;display:grid;font-size:14px;border-top:1px solid var(--color-border);line-height:1.4}.tc-table:after{width:calc(var(--cell-size));height:100%;left:calc(var(--cell-size)*-1);top:0}.tc-table:after,.tc-table:before{position:absolute;content:""}.tc-table:before{width:100%;height:var(--toolbox-aiming-field-size);top:calc(var(--toolbox-aiming-field-size)*-1);left:0}.tc-table--heading .tc-row:first-child{font-weight:600;border-bottom:2px solid var(--color-border)}.tc-table--heading .tc-row:first-child [contenteditable]:empty:before{content:attr(heading);color:var(--color-text-secondary)}.tc-table--heading .tc-row:first-child:after{bottom:-2px;border-bottom:2px solid var(--color-border)}.tc-add-column,.tc-add-row{display:flex;color:var(--color-text-secondary)}@media print{.tc-add{display:none}}.tc-add-column{padding:4px 0;justify-content:center;border-top:1px solid var(--color-border)}.tc-add-column--disabled{visibility:hidden}@media print{.tc-add-column{display:none}}.tc-add-row{height:var(--cell-size);align-items:center;padding-left:4px;position:relative}.tc-add-row--disabled{display:none}.tc-add-row:before{content:"";position:absolute;right:calc(var(--cell-size)*-1);width:var(--cell-size);height:100%}@media print{.tc-add-row{display:none}}.tc-add-column,.tc-add-row{transition:0s;cursor:pointer;will-change:background-color}.tc-add-column:hover,.tc-add-row:hover{transition:background-color .1s ease;background-color:var(--color-background)}.tc-add-row{margin-top:1px}.tc-add-row:hover:before{transition:.1s;background-color:var(--color-background)}.tc-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(10px,1fr));position:relative;border-bottom:1px solid var(--color-border)}.tc-row:after{content:"";pointer-events:none;position:absolute;width:var(--cell-size);height:100%;bottom:-1px;right:calc(var(--cell-size)*-1);border-bottom:1px solid var(--color-border)}.tc-row--selected{background:var(--color-background)}.tc-row--selected:after{background:var(--color-background)}.tc-cell{border-right:1px solid var(--color-border);padding:6px 12px;overflow:hidden;outline:none;line-break:normal}.tc-cell--selected{background:var(--color-background)}.tc-wrap--readonly .tc-row:after{display:none}.tc-toolbox{--toolbox-padding:6px;--popover-margin:30px;--toggler-click-zone-size:30px;--toggler-dots-color:#7b7e89;--toggler-dots-color-hovered:#1d202b;position:absolute;cursor:pointer;z-index:1;opacity:0;transition:opacity .1s;will-change:left,opacity}.tc-toolbox--column{top:calc(var(--toggler-click-zone-size)*-1);transform:translate(calc(var(--toggler-click-zone-size)*-1/2));will-change:left,opacity}.tc-toolbox--row{left:calc(var(--popover-margin)*-1);transform:translateY(calc(var(--toggler-click-zone-size)*-1/2));margin-top:-1px;will-change:top,opacity}.tc-toolbox--showed{opacity:1}.tc-toolbox .tc-popover{position:absolute;top:0;left:var(--popover-margin)}.tc-toolbox__toggler{display:flex;align-items:center;justify-content:center;width:var(--toggler-click-zone-size);height:var(--toggler-click-zone-size);color:var(--toggler-dots-color);opacity:0;transition:opacity .15s ease;will-change:opacity}.tc-toolbox__toggler:hover{color:var(--toggler-dots-color-hovered)}.tc-toolbox__toggler svg{fill:currentColor}.tc-wrap:hover .tc-toolbox__toggler{opacity:1}.tc-settings .cdx-settings-button{width:50%;margin:0}.tc-popover{--color-border:#eaeaea;--color-background:#fff;--color-background-hover:rgba(232,232,235,.49);--color-background-confirm:#e24a4a;--color-background-confirm-hover:#d54040;--color-text-confirm:#fff;background:var(--color-background);border:1px solid var(--color-border);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;padding:6px;display:none;will-change:opacity,transform}.tc-popover--opened{display:block;animation:menuShowing .1s cubic-bezier(.215,.61,.355,1) forwards}.tc-popover__item{display:flex;align-items:center;padding:2px 14px 2px 2px;border-radius:5px;cursor:pointer;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;user-select:none}.tc-popover__item:hover{background:var(--color-background-hover)}.tc-popover__item:not(:last-of-type){margin-bottom:2px}.tc-popover__item-icon{display:inline-flex;width:26px;height:26px;align-items:center;justify-content:center;background:var(--color-background);border-radius:5px;border:1px solid var(--color-border);margin-right:8px}.tc-popover__item-label{line-height:22px;font-size:14px;font-weight:500}.tc-popover__item--confirm{background:var(--color-background-confirm);color:var(--color-text-confirm)}.tc-popover__item--confirm:hover{background-color:var(--color-background-confirm-hover)}.tc-popover__item--confirm .tc-popover__item-icon{background:var(--color-background-confirm);border-color:#0000001a}.tc-popover__item--confirm .tc-popover__item-icon svg{transition:transform .2s ease-in;transform:rotate(90deg) scale(1.2)}.tc-popover__item--hidden{display:none}@keyframes menuShowing{0%{opacity:0;transform:translateY(-8px) scale(.9)}70%{opacity:1;transform:translateY(2px)}to{transform:translateY(0)}}')), document.head.appendChild(e);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
function fe(o, e, t = {}) {
  const n = document.createElement(o);
  Array.isArray(e) ? n.classList.add(...e) : e && n.classList.add(e);
  for (const r in t)
    Object.prototype.hasOwnProperty.call(t, r) && (n[r] = t[r]);
  return n;
}
function Bi(o) {
  const e = o.getBoundingClientRect();
  return {
    y1: Math.floor(e.top + window.pageYOffset),
    x1: Math.floor(e.left + window.pageXOffset),
    x2: Math.floor(e.right + window.pageXOffset),
    y2: Math.floor(e.bottom + window.pageYOffset)
  };
}
function _i(o, e) {
  const t = Bi(o), n = Bi(e);
  return {
    fromTopBorder: n.y1 - t.y1,
    fromLeftBorder: n.x1 - t.x1,
    fromRightBorder: t.x2 - n.x2,
    fromBottomBorder: t.y2 - n.y2
  };
}
function Gu(o, e) {
  const t = o.getBoundingClientRect(), { width: n, height: r, x: i, y: s } = t, { clientX: a, clientY: l } = e;
  return {
    width: n,
    height: r,
    x: a - i,
    y: l - s
  };
}
function Oi(o, e) {
  return e.parentNode.insertBefore(o, e);
}
function Mi(o, e = !0) {
  const t = document.createRange(), n = window.getSelection();
  t.selectNodeContents(o), t.collapse(e), n.removeAllRanges(), n.addRange(t);
}
let Zu = class pe {
  /**
   * @param {object} options - constructor options
   * @param {PopoverItem[]} options.items - constructor options
   */
  constructor({ items: e }) {
    this.items = e, this.wrapper = void 0, this.itemEls = [];
  }
  /**
   * Set of CSS classnames used in popover
   *
   * @returns {object}
   */
  static get CSS() {
    return {
      popover: "tc-popover",
      popoverOpened: "tc-popover--opened",
      item: "tc-popover__item",
      itemHidden: "tc-popover__item--hidden",
      itemConfirmState: "tc-popover__item--confirm",
      itemIcon: "tc-popover__item-icon",
      itemLabel: "tc-popover__item-label"
    };
  }
  /**
   * Returns the popover element
   *
   * @returns {Element}
   */
  render() {
    return this.wrapper = fe("div", pe.CSS.popover), this.items.forEach((e, t) => {
      const n = fe("div", pe.CSS.item), r = fe("div", pe.CSS.itemIcon, {
        innerHTML: e.icon
      }), i = fe("div", pe.CSS.itemLabel, {
        textContent: e.label
      });
      n.dataset.index = t, n.appendChild(r), n.appendChild(i), this.wrapper.appendChild(n), this.itemEls.push(n);
    }), this.wrapper.addEventListener("click", (e) => {
      this.popoverClicked(e);
    }), this.wrapper;
  }
  /**
   * Popover wrapper click listener
   * Used to delegate clicks in items
   *
   * @returns {void}
   */
  popoverClicked(e) {
    const t = e.target.closest(`.${pe.CSS.item}`);
    if (!t)
      return;
    const n = t.dataset.index, r = this.items[n];
    if (r.confirmationRequired && !this.hasConfirmationState(t)) {
      this.setConfirmationState(t);
      return;
    }
    r.onClick();
  }
  /**
   * Enable the confirmation state on passed item
   *
   * @returns {void}
   */
  setConfirmationState(e) {
    e.classList.add(pe.CSS.itemConfirmState);
  }
  /**
   * Disable the confirmation state on passed item
   *
   * @returns {void}
   */
  clearConfirmationState(e) {
    e.classList.remove(pe.CSS.itemConfirmState);
  }
  /**
   * Check if passed item has the confirmation state
   *
   * @returns {boolean}
   */
  hasConfirmationState(e) {
    return e.classList.contains(pe.CSS.itemConfirmState);
  }
  /**
   * Return an opening state
   *
   * @returns {boolean}
   */
  get opened() {
    return this.wrapper.classList.contains(pe.CSS.popoverOpened);
  }
  /**
   * Opens the popover
   *
   * @returns {void}
   */
  open() {
    this.items.forEach((e, t) => {
      typeof e.hideIf == "function" && this.itemEls[t].classList.toggle(pe.CSS.itemHidden, e.hideIf());
    }), this.wrapper.classList.add(pe.CSS.popoverOpened);
  }
  /**
   * Closes the popover
   *
   * @returns {void}
   */
  close() {
    this.wrapper.classList.remove(pe.CSS.popoverOpened), this.itemEls.forEach((e) => {
      this.clearConfirmationState(e);
    });
  }
};
const Ju = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9L10 12M10 12L7 15M10 12H4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9L14 12M14 12L17 15M14 12H20"/></svg>', Ii = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>', Qu = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 9.16666L18.2167 12.5M18.2167 12.5L14.8833 15.8333M18.2167 12.5H10.05C9.16594 12.5 8.31809 12.1488 7.69297 11.5237C7.06785 10.8986 6.71666 10.0507 6.71666 9.16666"/></svg>', eh = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.9167 14.9167L11.5833 18.25M11.5833 18.25L8.25 14.9167M11.5833 18.25L11.5833 10.0833C11.5833 9.19928 11.9345 8.35143 12.5596 7.72631C13.1848 7.10119 14.0326 6.75 14.9167 6.75"/></svg>', th = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.13333 14.9167L12.4667 18.25M12.4667 18.25L15.8 14.9167M12.4667 18.25L12.4667 10.0833C12.4667 9.19928 12.1155 8.35143 11.4904 7.72631C10.8652 7.10119 10.0174 6.75 9.13333 6.75"/></svg>', oh = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 15.8333L18.2167 12.5M18.2167 12.5L14.8833 9.16667M18.2167 12.5L10.05 12.5C9.16595 12.5 8.31811 12.8512 7.69299 13.4763C7.06787 14.1014 6.71667 14.9493 6.71667 15.8333"/></svg>', nh = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.41 9.66H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 9.66H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.31 14.36H9.3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 14.36H14.59"/></svg>', Li = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>', rh = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9L20 12L17 15"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 12H20"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9L4 12L7 15"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12H10"/></svg>', ih = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>', sh = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M14 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><path stroke="currentColor" stroke-width="2" d="M5 14H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>', ah = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
class $e {
  /**
   * Creates toolbox buttons and toolbox menus
   *
   * @param {Object} config
   * @param {any} config.api - Editor.js api
   * @param {PopoverItem[]} config.items - Editor.js api
   * @param {function} config.onOpen - callback fired when the Popover is opening
   * @param {function} config.onClose - callback fired when the Popover is closing
   * @param {string} config.cssModifier - the modifier for the Toolbox. Allows to add some specific styles.
   */
  constructor({ api: e, items: t, onOpen: n, onClose: r, cssModifier: i = "" }) {
    this.api = e, this.items = t, this.onOpen = n, this.onClose = r, this.cssModifier = i, this.popover = null, this.wrapper = this.createToolbox();
  }
  /**
   * Style classes
   */
  static get CSS() {
    return {
      toolbox: "tc-toolbox",
      toolboxShowed: "tc-toolbox--showed",
      toggler: "tc-toolbox__toggler"
    };
  }
  /**
   * Returns rendered Toolbox element
   */
  get element() {
    return this.wrapper;
  }
  /**
   * Creating a toolbox to open menu for a manipulating columns
   *
   * @returns {Element}
   */
  createToolbox() {
    const e = fe("div", [
      $e.CSS.toolbox,
      this.cssModifier ? `${$e.CSS.toolbox}--${this.cssModifier}` : ""
    ]);
    e.dataset.mutationFree = "true";
    const t = this.createPopover(), n = this.createToggler();
    return e.appendChild(n), e.appendChild(t), e;
  }
  /**
   * Creates the Toggler
   *
   * @returns {Element}
   */
  createToggler() {
    const e = fe("div", $e.CSS.toggler, {
      innerHTML: nh
    });
    return e.addEventListener("click", () => {
      this.togglerClicked();
    }), e;
  }
  /**
   * Creates the Popover instance and render it
   *
   * @returns {Element}
   */
  createPopover() {
    return this.popover = new Zu({
      items: this.items
    }), this.popover.render();
  }
  /**
   * Toggler click handler. Opens/Closes the popover
   *
   * @returns {void}
   */
  togglerClicked() {
    this.popover.opened ? (this.popover.close(), this.onClose()) : (this.popover.open(), this.onOpen());
  }
  /**
   * Shows the Toolbox
   *
   * @param {function} computePositionMethod - method that returns the position coordinate
   * @returns {void}
   */
  show(e) {
    const t = e();
    Object.entries(t).forEach(([n, r]) => {
      this.wrapper.style[n] = r;
    }), this.wrapper.classList.add($e.CSS.toolboxShowed);
  }
  /**
   * Hides the Toolbox
   *
   * @returns {void}
   */
  hide() {
    this.popover.close(), this.wrapper.classList.remove($e.CSS.toolboxShowed);
  }
}
function lh(o, e) {
  let t = 0;
  return function(...n) {
    const r = (/* @__PURE__ */ new Date()).getTime();
    if (!(r - t < o))
      return t = r, e(...n);
  };
}
const L = {
  wrapper: "tc-wrap",
  wrapperReadOnly: "tc-wrap--readonly",
  table: "tc-table",
  row: "tc-row",
  withHeadings: "tc-table--heading",
  rowSelected: "tc-row--selected",
  cell: "tc-cell",
  cellSelected: "tc-cell--selected",
  addRow: "tc-add-row",
  addRowDisabled: "tc-add-row--disabled",
  addColumn: "tc-add-column",
  addColumnDisabled: "tc-add-column--disabled"
};
let ch = class {
  /**
   * Creates
   *
   * @constructor
   * @param {boolean} readOnly - read-only mode flag
   * @param {object} api - Editor.js API
   * @param {TableData} data - Editor.js API
   * @param {TableConfig} config - Editor.js API
   */
  constructor(e, t, n, r) {
    this.readOnly = e, this.api = t, this.data = n, this.config = r, this.wrapper = null, this.table = null, this.toolboxColumn = this.createColumnToolbox(), this.toolboxRow = this.createRowToolbox(), this.createTableWrapper(), this.hoveredRow = 0, this.hoveredColumn = 0, this.selectedRow = 0, this.selectedColumn = 0, this.tunes = {
      withHeadings: !1
    }, this.resize(), this.fill(), this.focusedCell = {
      row: 0,
      column: 0
    }, this.documentClicked = (i) => {
      const s = i.target.closest(`.${L.table}`) !== null, a = i.target.closest(`.${L.wrapper}`) === null;
      (s || a) && this.hideToolboxes();
      const l = i.target.closest(`.${L.addRow}`), c = i.target.closest(`.${L.addColumn}`);
      l && l.parentNode === this.wrapper ? (this.addRow(void 0, !0), this.hideToolboxes()) : c && c.parentNode === this.wrapper && (this.addColumn(void 0, !0), this.hideToolboxes());
    }, this.readOnly || this.bindEvents();
  }
  /**
   * Returns the rendered table wrapper
   *
   * @returns {Element}
   */
  getWrapper() {
    return this.wrapper;
  }
  /**
   * Hangs the necessary handlers to events
   */
  bindEvents() {
    document.addEventListener("click", this.documentClicked), this.table.addEventListener("mousemove", lh(150, (e) => this.onMouseMoveInTable(e)), { passive: !0 }), this.table.onkeypress = (e) => this.onKeyPressListener(e), this.table.addEventListener("keydown", (e) => this.onKeyDownListener(e)), this.table.addEventListener("focusin", (e) => this.focusInTableListener(e));
  }
  /**
   * Configures and creates the toolbox for manipulating with columns
   *
   * @returns {Toolbox}
   */
  createColumnToolbox() {
    return new $e({
      api: this.api,
      cssModifier: "column",
      items: [
        {
          label: this.api.i18n.t("Add column to left"),
          icon: eh,
          hideIf: () => this.numberOfColumns === this.config.maxcols,
          onClick: () => {
            this.addColumn(this.selectedColumn, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Add column to right"),
          icon: th,
          hideIf: () => this.numberOfColumns === this.config.maxcols,
          onClick: () => {
            this.addColumn(this.selectedColumn + 1, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Delete column"),
          icon: Ii,
          hideIf: () => this.numberOfColumns === 1,
          confirmationRequired: !0,
          onClick: () => {
            this.deleteColumn(this.selectedColumn), this.hideToolboxes();
          }
        }
      ],
      onOpen: () => {
        this.selectColumn(this.hoveredColumn), this.hideRowToolbox();
      },
      onClose: () => {
        this.unselectColumn();
      }
    });
  }
  /**
   * Configures and creates the toolbox for manipulating with rows
   *
   * @returns {Toolbox}
   */
  createRowToolbox() {
    return new $e({
      api: this.api,
      cssModifier: "row",
      items: [
        {
          label: this.api.i18n.t("Add row above"),
          icon: oh,
          hideIf: () => this.numberOfRows === this.config.maxrows,
          onClick: () => {
            this.addRow(this.selectedRow, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Add row below"),
          icon: Qu,
          hideIf: () => this.numberOfRows === this.config.maxrows,
          onClick: () => {
            this.addRow(this.selectedRow + 1, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Delete row"),
          icon: Ii,
          hideIf: () => this.numberOfRows === 1,
          confirmationRequired: !0,
          onClick: () => {
            this.deleteRow(this.selectedRow), this.hideToolboxes();
          }
        }
      ],
      onOpen: () => {
        this.selectRow(this.hoveredRow), this.hideColumnToolbox();
      },
      onClose: () => {
        this.unselectRow();
      }
    });
  }
  /**
   * When you press enter it moves the cursor down to the next row
   * or creates it if the click occurred on the last one
   */
  moveCursorToNextRow() {
    this.focusedCell.row !== this.numberOfRows ? (this.focusedCell.row += 1, this.focusCell(this.focusedCell)) : (this.addRow(), this.focusedCell.row += 1, this.focusCell(this.focusedCell), this.updateToolboxesPosition(0, 0));
  }
  /**
   * Get table cell by row and col index
   *
   * @param {number} row - cell row coordinate
   * @param {number} column - cell column coordinate
   * @returns {HTMLElement}
   */
  getCell(e, t) {
    return this.table.querySelectorAll(`.${L.row}:nth-child(${e}) .${L.cell}`)[t - 1];
  }
  /**
   * Get table row by index
   *
   * @param {number} row - row coordinate
   * @returns {HTMLElement}
   */
  getRow(e) {
    return this.table.querySelector(`.${L.row}:nth-child(${e})`);
  }
  /**
   * The parent of the cell which is the row
   *
   * @param {HTMLElement} cell - cell element
   * @returns {HTMLElement}
   */
  getRowByCell(e) {
    return e.parentElement;
  }
  /**
   * Ger row's first cell
   *
   * @param {Element} row - row to find its first cell
   * @returns {Element}
   */
  getRowFirstCell(e) {
    return e.querySelector(`.${L.cell}:first-child`);
  }
  /**
   * Set the sell's content by row and column numbers
   *
   * @param {number} row - cell row coordinate
   * @param {number} column - cell column coordinate
   * @param {string} content - cell HTML content
   */
  setCellContent(e, t, n) {
    const r = this.getCell(e, t);
    r.innerHTML = n;
  }
  /**
   * Add column in table on index place
   * Add cells in each row
   *
   * @param {number} columnIndex - number in the array of columns, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the first cell
   */
  addColumn(e = -1, t = !1) {
    var n;
    let r = this.numberOfColumns;
    if (this.config && this.config.maxcols && this.numberOfColumns >= this.config.maxcols)
      return;
    for (let s = 1; s <= this.numberOfRows; s++) {
      let a;
      const l = this.createCell();
      if (e > 0 && e <= r ? (a = this.getCell(s, e), Oi(l, a)) : a = this.getRow(s).appendChild(l), s === 1) {
        const c = this.getCell(s, e > 0 ? e : r + 1);
        c && t && Mi(c);
      }
    }
    const i = this.wrapper.querySelector(`.${L.addColumn}`);
    (n = this.config) != null && n.maxcols && this.numberOfColumns > this.config.maxcols - 1 && i && i.classList.add(L.addColumnDisabled), this.addHeadingAttrToFirstRow();
  }
  /**
   * Add row in table on index place
   *
   * @param {number} index - number in the array of rows, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the inserted row
   * @returns {HTMLElement} row
   */
  addRow(e = -1, t = !1) {
    let n, r = fe("div", L.row);
    this.tunes.withHeadings && this.removeHeadingAttrFromFirstRow();
    let i = this.numberOfColumns;
    if (this.config && this.config.maxrows && this.numberOfRows >= this.config.maxrows && a)
      return;
    if (e > 0 && e <= this.numberOfRows) {
      let l = this.getRow(e);
      n = Oi(r, l);
    } else
      n = this.table.appendChild(r);
    this.fillRow(n, i), this.tunes.withHeadings && this.addHeadingAttrToFirstRow();
    const s = this.getRowFirstCell(n);
    s && t && Mi(s);
    const a = this.wrapper.querySelector(`.${L.addRow}`);
    return this.config && this.config.maxrows && this.numberOfRows >= this.config.maxrows && a && a.classList.add(L.addRowDisabled), n;
  }
  /**
   * Delete a column by index
   *
   * @param {number} index
   */
  deleteColumn(e) {
    for (let n = 1; n <= this.numberOfRows; n++) {
      const r = this.getCell(n, e);
      if (!r)
        return;
      r.remove();
    }
    const t = this.wrapper.querySelector(`.${L.addColumn}`);
    t && t.classList.remove(L.addColumnDisabled);
  }
  /**
   * Delete a row by index
   *
   * @param {number} index
   */
  deleteRow(e) {
    this.getRow(e).remove();
    const t = this.wrapper.querySelector(`.${L.addRow}`);
    t && t.classList.remove(L.addRowDisabled), this.addHeadingAttrToFirstRow();
  }
  /**
   * Create a wrapper containing a table, toolboxes
   * and buttons for adding rows and columns
   *
   * @returns {HTMLElement} wrapper - where all buttons for a table and the table itself will be
   */
  createTableWrapper() {
    if (this.wrapper = fe("div", L.wrapper), this.table = fe("div", L.table), this.readOnly && this.wrapper.classList.add(L.wrapperReadOnly), this.wrapper.appendChild(this.toolboxRow.element), this.wrapper.appendChild(this.toolboxColumn.element), this.wrapper.appendChild(this.table), !this.readOnly) {
      const e = fe("div", L.addColumn, {
        innerHTML: Li
      }), t = fe("div", L.addRow, {
        innerHTML: Li
      });
      this.wrapper.appendChild(e), this.wrapper.appendChild(t);
    }
  }
  /**
   * Returns the size of the table based on initial data or config "size" property
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  computeInitialSize() {
    const e = this.data && this.data.content, t = Array.isArray(e), n = t ? e.length : !1, r = t ? e.length : void 0, i = n ? e[0].length : void 0, s = Number.parseInt(this.config && this.config.rows), a = Number.parseInt(this.config && this.config.cols), l = !isNaN(s) && s > 0 ? s : void 0, c = !isNaN(a) && a > 0 ? a : void 0;
    return {
      rows: r || l || 2,
      cols: i || c || 2
    };
  }
  /**
   * Resize table to match config size or transmitted data size
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  resize() {
    const { rows: e, cols: t } = this.computeInitialSize();
    for (let n = 0; n < e; n++)
      this.addRow();
    for (let n = 0; n < t; n++)
      this.addColumn();
  }
  /**
   * Fills the table with data passed to the constructor
   *
   * @returns {void}
   */
  fill() {
    const e = this.data;
    if (e && e.content)
      for (let t = 0; t < e.content.length; t++)
        for (let n = 0; n < e.content[t].length; n++)
          this.setCellContent(t + 1, n + 1, e.content[t][n]);
  }
  /**
   * Fills a row with cells
   *
   * @param {HTMLElement} row - row to fill
   * @param {number} numberOfColumns - how many cells should be in a row
   */
  fillRow(e, t) {
    for (let n = 1; n <= t; n++) {
      const r = this.createCell();
      e.appendChild(r);
    }
  }
  /**
   * Creating a cell element
   *
   * @return {Element}
   */
  createCell() {
    return fe("div", L.cell, {
      contentEditable: !this.readOnly
    });
  }
  /**
   * Get number of rows in the table
   */
  get numberOfRows() {
    return this.table.childElementCount;
  }
  /**
   * Get number of columns in the table
   */
  get numberOfColumns() {
    return this.numberOfRows ? this.table.querySelectorAll(`.${L.row}:first-child .${L.cell}`).length : 0;
  }
  /**
   * Is the column toolbox menu displayed or not
   *
   * @returns {boolean}
   */
  get isColumnMenuShowing() {
    return this.selectedColumn !== 0;
  }
  /**
   * Is the row toolbox menu displayed or not
   *
   * @returns {boolean}
   */
  get isRowMenuShowing() {
    return this.selectedRow !== 0;
  }
  /**
   * Recalculate position of toolbox icons
   *
   * @param {Event} event - mouse move event
   */
  onMouseMoveInTable(e) {
    const { row: t, column: n } = this.getHoveredCell(e);
    this.hoveredColumn = n, this.hoveredRow = t, this.updateToolboxesPosition();
  }
  /**
   * Prevents default Enter behaviors
   * Adds Shift+Enter processing
   *
   * @param {KeyboardEvent} event - keypress event
   */
  onKeyPressListener(e) {
    if (e.key === "Enter") {
      if (e.shiftKey)
        return !0;
      this.moveCursorToNextRow();
    }
    return e.key !== "Enter";
  }
  /**
   * Prevents tab keydown event from bubbling
   * so that it only works inside the table
   *
   * @param {KeyboardEvent} event - keydown event
   */
  onKeyDownListener(e) {
    e.key === "Tab" && e.stopPropagation();
  }
  /**
   * Set the coordinates of the cell that the focus has moved to
   *
   * @param {FocusEvent} event - focusin event
   */
  focusInTableListener(e) {
    const t = e.target, n = this.getRowByCell(t);
    this.focusedCell = {
      row: Array.from(this.table.querySelectorAll(`.${L.row}`)).indexOf(n) + 1,
      column: Array.from(n.querySelectorAll(`.${L.cell}`)).indexOf(t) + 1
    };
  }
  /**
   * Unselect row/column
   * Close toolbox menu
   * Hide toolboxes
   *
   * @returns {void}
   */
  hideToolboxes() {
    this.hideRowToolbox(), this.hideColumnToolbox(), this.updateToolboxesPosition();
  }
  /**
   * Unselect row, close toolbox
   *
   * @returns {void}
   */
  hideRowToolbox() {
    this.unselectRow(), this.toolboxRow.hide();
  }
  /**
   * Unselect column, close toolbox
   *
   * @returns {void}
   */
  hideColumnToolbox() {
    this.unselectColumn(), this.toolboxColumn.hide();
  }
  /**
   * Set the cursor focus to the focused cell
   *
   * @returns {void}
   */
  focusCell() {
    this.focusedCellElem.focus();
  }
  /**
   * Get current focused element
   *
   * @returns {HTMLElement} - focused cell
   */
  get focusedCellElem() {
    const { row: e, column: t } = this.focusedCell;
    return this.getCell(e, t);
  }
  /**
   * Update toolboxes position
   *
   * @param {number} row - hovered row
   * @param {number} column - hovered column
   */
  updateToolboxesPosition(e = this.hoveredRow, t = this.hoveredColumn) {
    this.isColumnMenuShowing || t > 0 && t <= this.numberOfColumns && this.toolboxColumn.show(() => ({
      left: `calc((100% - var(--cell-size)) / (${this.numberOfColumns} * 2) * (1 + (${t} - 1) * 2))`
    })), this.isRowMenuShowing || e > 0 && e <= this.numberOfRows && this.toolboxRow.show(() => {
      const n = this.getRow(e), { fromTopBorder: r } = _i(this.table, n), { height: i } = n.getBoundingClientRect();
      return {
        top: `${Math.ceil(r + i / 2)}px`
      };
    });
  }
  /**
   * Makes the first row headings
   *
   * @param {boolean} withHeadings - use headings row or not
   */
  setHeadingsSetting(e) {
    this.tunes.withHeadings = e, e ? (this.table.classList.add(L.withHeadings), this.addHeadingAttrToFirstRow()) : (this.table.classList.remove(L.withHeadings), this.removeHeadingAttrFromFirstRow());
  }
  /**
   * Adds an attribute for displaying the placeholder in the cell
   */
  addHeadingAttrToFirstRow() {
    for (let e = 1; e <= this.numberOfColumns; e++) {
      let t = this.getCell(1, e);
      t && t.setAttribute("heading", this.api.i18n.t("Heading"));
    }
  }
  /**
   * Removes an attribute for displaying the placeholder in the cell
   */
  removeHeadingAttrFromFirstRow() {
    for (let e = 1; e <= this.numberOfColumns; e++) {
      let t = this.getCell(1, e);
      t && t.removeAttribute("heading");
    }
  }
  /**
   * Add effect of a selected row
   *
   * @param {number} index
   */
  selectRow(e) {
    const t = this.getRow(e);
    t && (this.selectedRow = e, t.classList.add(L.rowSelected));
  }
  /**
   * Remove effect of a selected row
   */
  unselectRow() {
    if (this.selectedRow <= 0)
      return;
    const e = this.table.querySelector(`.${L.rowSelected}`);
    e && e.classList.remove(L.rowSelected), this.selectedRow = 0;
  }
  /**
   * Add effect of a selected column
   *
   * @param {number} index
   */
  selectColumn(e) {
    for (let t = 1; t <= this.numberOfRows; t++) {
      const n = this.getCell(t, e);
      n && n.classList.add(L.cellSelected);
    }
    this.selectedColumn = e;
  }
  /**
   * Remove effect of a selected column
   */
  unselectColumn() {
    if (this.selectedColumn <= 0)
      return;
    let e = this.table.querySelectorAll(`.${L.cellSelected}`);
    Array.from(e).forEach((t) => {
      t.classList.remove(L.cellSelected);
    }), this.selectedColumn = 0;
  }
  /**
   * Calculates the row and column that the cursor is currently hovering over
   * The search was optimized from O(n) to O (log n) via bin search to reduce the number of calculations
   *
   * @param {Event} event - mousemove event
   * @returns hovered cell coordinates as an integer row and column
   */
  getHoveredCell(e) {
    let t = this.hoveredRow, n = this.hoveredColumn;
    const { width: r, height: i, x: s, y: a } = Gu(this.table, e);
    return s >= 0 && (n = this.binSearch(
      this.numberOfColumns,
      (l) => this.getCell(1, l),
      ({ fromLeftBorder: l }) => s < l,
      ({ fromRightBorder: l }) => s > r - l
    )), a >= 0 && (t = this.binSearch(
      this.numberOfRows,
      (l) => this.getCell(l, 1),
      ({ fromTopBorder: l }) => a < l,
      ({ fromBottomBorder: l }) => a > i - l
    )), {
      row: t || this.hoveredRow,
      column: n || this.hoveredColumn
    };
  }
  /**
   * Looks for the index of the cell the mouse is hovering over.
   * Cells can be represented as ordered intervals with left and
   * right (upper and lower for rows) borders inside the table, if the mouse enters it, then this is our index
   *
   * @param {number} numberOfCells - upper bound of binary search
   * @param {function} getCell - function to take the currently viewed cell
   * @param {function} beforeTheLeftBorder - determines the cursor position, to the left of the cell or not
   * @param {function} afterTheRightBorder - determines the cursor position, to the right of the cell or not
   * @returns {number}
   */
  binSearch(e, t, n, r) {
    let i = 0, s = e + 1, a = 0, l;
    for (; i < s - 1 && a < 10; ) {
      l = Math.ceil((i + s) / 2);
      const c = t(l), d = _i(this.table, c);
      if (n(d))
        s = l;
      else if (r(d))
        i = l;
      else
        break;
      a++;
    }
    return l;
  }
  /**
   * Collects data from cells into a two-dimensional array
   *
   * @returns {string[][]}
   */
  getData() {
    const e = [];
    for (let t = 1; t <= this.numberOfRows; t++) {
      const n = this.table.querySelector(`.${L.row}:nth-child(${t})`), r = Array.from(n.querySelectorAll(`.${L.cell}`));
      r.every((i) => !i.textContent.trim()) || e.push(r.map((i) => i.innerHTML));
    }
    return e;
  }
  /**
   * Remove listeners on the document
   */
  destroy() {
    document.removeEventListener("click", this.documentClicked);
  }
};
class dh {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Allow to press Enter inside the CodeTool textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return !0;
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {TableConstructor} init
   */
  constructor({ data: e, config: t, api: n, readOnly: r, block: i }) {
    this.api = n, this.readOnly = r, this.config = t, this.data = {
      withHeadings: this.getConfig("withHeadings", !1, e),
      stretched: this.getConfig("stretched", !1, e),
      content: e && e.content ? e.content : []
    }, this.table = null, this.block = i;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: ah,
      title: "Table"
    };
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this.table = new ch(this.readOnly, this.api, this.data, this.config), this.container = fe("div", this.api.styles.block), this.container.appendChild(this.table.getWrapper()), this.table.setHeadingsSetting(this.data.withHeadings), this.container;
  }
  /**
   * Returns plugin settings
   *
   * @returns {Array}
   */
  renderSettings() {
    return [
      {
        label: this.api.i18n.t("With headings"),
        icon: ih,
        isActive: this.data.withHeadings,
        closeOnActivate: !0,
        toggle: !0,
        onActivate: () => {
          this.data.withHeadings = !0, this.table.setHeadingsSetting(this.data.withHeadings);
        }
      },
      {
        label: this.api.i18n.t("Without headings"),
        icon: sh,
        isActive: !this.data.withHeadings,
        closeOnActivate: !0,
        toggle: !0,
        onActivate: () => {
          this.data.withHeadings = !1, this.table.setHeadingsSetting(this.data.withHeadings);
        }
      },
      {
        label: this.data.stretched ? this.api.i18n.t("Collapse") : this.api.i18n.t("Stretch"),
        icon: this.data.stretched ? Ju : rh,
        closeOnActivate: !0,
        toggle: !0,
        onActivate: () => {
          this.data.stretched = !this.data.stretched, this.block.stretched = this.data.stretched;
        }
      }
    ];
  }
  /**
   * Extract table data from the view
   *
   * @returns {TableData} - saved data
   */
  save() {
    const e = this.table.getData();
    return {
      withHeadings: this.data.withHeadings,
      stretched: this.data.stretched,
      content: e
    };
  }
  /**
   * Plugin destroyer
   *
   * @returns {void}
   */
  destroy() {
    this.table.destroy();
  }
  /**
   * A helper to get config value.
   *
   * @param {string} configName - the key to get from the config.
   * @param {any} defaultValue - default value if config doesn't have passed key
   * @param {object} savedData - previously saved data. If passed, the key will be got from there, otherwise from the config
   * @returns {any} - config value.
   */
  getConfig(e, t = void 0, n = void 0) {
    const r = this.data || n;
    return r ? r[e] ? r[e] : t : this.config && this.config[e] ? this.config[e] : t;
  }
  /**
   * Table onPaste configuration
   *
   * @public
   */
  static get pasteConfig() {
    return { tags: ["TABLE", "TR", "TH", "TD"] };
  }
  /**
   * On paste callback that is fired from Editor
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(e) {
    const t = e.detail.data, n = t.querySelector(":scope > thead, tr:first-of-type th"), r = Array.from(t.querySelectorAll("tr")).map((i) => Array.from(i.querySelectorAll("th, td")).map((s) => s.innerHTML));
    this.data = {
      withHeadings: n !== null,
      content: r
    }, this.table.wrapper && this.table.wrapper.replaceWith(this.render());
  }
}
var uh = [["path", {
  d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  key: "gugj83"
}]], hh = (o) => m(X, R(o, {
  iconNode: uh,
  name: "table-2"
})), ph = hh, fh = /* @__PURE__ */ y("<table><tbody>"), gh = /* @__PURE__ */ y("<thead><tr>"), Ai = /* @__PURE__ */ y("<td>"), mh = /* @__PURE__ */ y("<tr>");
jt(dh, {
  type: "table",
  toolSettings: {
    inlineToolbar: !0,
    config: {
      rows: 2,
      cols: 3,
      withHeadings: !1
    }
  },
  toolbox: {
    title: "Table",
    icon: de(ph)
  },
  renderer: ({
    content: o,
    withHeadings: e
  }) => (() => {
    var t = fh(), n = t.firstChild;
    return k(t, e && (() => {
      var r = gh(), i = r.firstChild;
      return k(i, () => o[0].map((s) => (() => {
        var a = Ai();
        return k(a, () => Ce(s)), a;
      })())), r;
    })(), n), k(n, () => o.slice(e ? 1 : 0).map((r) => (() => {
      var i = mh();
      return k(i, () => r.map((s) => (() => {
        var a = Ai();
        return k(a, () => Ce(s)), a;
      })())), i;
    })())), t;
  })(),
  parser: (o) => {
    if (o.type == "table") {
      const e = (n) => n, t = e(e(o.content)[0].content);
      return o.content.length > 1 && t.push(...e(e(o.content)[1].content)), {
        withHeadings: o.content.length > 1,
        content: t.map((n) => e(n.content).map((r) => te(r.content)))
      };
    }
  }
});
var bh = [["path", {
  d: "M5 12h14",
  key: "1ays0h"
}]], vh = (o) => m(X, R(o, {
  iconNode: bh,
  name: "minus"
})), yh = vh, kh = /* @__PURE__ */ y("<hr>"), wh = /* @__PURE__ */ y('<hr class="border-t-[1pt] border-fg/20">');
ze({
  type: "line",
  parser: (o) => {
    if (o.type === "hr") return {};
  },
  renderer: () => kh(),
  toolbox: {
    title: "Line",
    icon: de(yh)
  },
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {});
    }
    render() {
      return m(Ie, {
        get children() {
          return wh();
        }
      });
    }
  }
});
var xh = [["path", {
  d: "M15 3h6v6",
  key: "1q9fwt"
}], ["path", {
  d: "M10 14 21 3",
  key: "gplh6r"
}], ["path", {
  d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
  key: "a6xqqp"
}]], Ch = (o) => m(X, R(o, {
  iconNode: xh,
  name: "external-link"
})), Pi = Ch, Eh = /* @__PURE__ */ y("<link-button>", !0, !1, !1), Sh = /* @__PURE__ */ y('<div class="flex flex-col grow"><div class="flex gap-1"><span>href: </span></div><div class="flex gap-1"><span>label: ');
ze({
  type: "link-button",
  toolSettings: {
    inlineToolbar: !0
  },
  renderer: ({
    label: o,
    href: e
  }) => (() => {
    var t = Eh();
    return A(t, "href", e), t._$owner = ge(), k(t, o), t;
  })(),
  parser: (o) => {
    var e;
    if (o.type == "link-button")
      return {
        href: ((e = o.attributes) == null ? void 0 : e.href) ?? "",
        label: te(o.content)
      };
  },
  toolbox: {
    title: "Link Button",
    icon: de(Pi)
  },
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {
        label: "",
        href: ""
      });
    }
    validate(t) {
      return !!t.href;
    }
    render() {
      const [t, n] = this.store;
      return m(Ie, {
        class: "flex p-1 rounded-lg border-[1pt] border-fg/20",
        get children() {
          return [m(Pi, {
            class: "my-auto mx-3 ml-2 text-fg"
          }), (() => {
            var r = Sh(), i = r.firstChild;
            i.firstChild;
            var s = i.nextSibling;
            return s.firstChild, k(i, m(ve, {
              class: "grow rounded",
              placeholder: "href",
              get text() {
                return t.href;
              },
              onChange: (a) => n("href", a)
            }), null), k(s, m(ve, {
              class: "grow rounded",
              placeholder: "Label",
              get text() {
                return t.label;
              },
              onChange: (a) => n("label", a)
            }), null), r;
          })()];
        }
      });
    }
  }
});
var Th = [["line", {
  x1: "22",
  x2: "2",
  y1: "6",
  y2: "6",
  key: "15w7dq"
}], ["line", {
  x1: "22",
  x2: "2",
  y1: "18",
  y2: "18",
  key: "1ip48p"
}], ["line", {
  x1: "6",
  x2: "6",
  y1: "2",
  y2: "22",
  key: "a2lnyx"
}], ["line", {
  x1: "18",
  x2: "18",
  y1: "2",
  y2: "22",
  key: "8vb6jd"
}]], Bh = (o) => m(X, R(o, {
  iconNode: Th,
  name: "frame"
})), _h = Bh, Oh = /* @__PURE__ */ y("<embed-card>", !0, !1, !1), Mh = /* @__PURE__ */ y('<iframe class="rounded mb-0">'), Ih = /* @__PURE__ */ y("<div>");
ze({
  type: "embed-card",
  parser(o) {
    var e;
    if (o.type === "embed-card")
      return {
        src: ((e = o.attributes) == null ? void 0 : e.src) ?? "",
        caption: te(o.content)
      };
  },
  renderer: ({
    src: o,
    caption: e
  }) => (() => {
    var t = Oh();
    return A(t, "src", o), t._$owner = ge(), k(t, e ?? ""), t;
  })(),
  toolbox: {
    title: "Embed Card",
    icon: de(_h)
  },
  toolSettings: {
    inlineToolbar: !0
  },
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {
        src: "",
        caption: ""
      });
    }
    render() {
      const [t, n] = this.store;
      return m(Ie, {
        class: "p-2 border-[1pt] border-fg/20 rounded-lg flex flex-col gap-2",
        get children() {
          return [(() => {
            var r = Mh();
            return r.style.setProperty("border", "none"), q(() => A(r, "src", t.src)), r;
          })(), (() => {
            var r = Ih();
            return k(r, m(ve, {
              placeholder: "Source",
              class: "p-0.5 rounded",
              get text() {
                return t.src;
              },
              onChange: (i) => n("src", i)
            }), null), k(r, m(ve, {
              placeholder: "Caption",
              class: "p-0.5 rounded",
              get text() {
                return t.caption ?? "";
              },
              onChange: (i) => n("caption", i)
            }), null), r;
          })()];
        }
      });
    }
  }
});
(function() {
  try {
    if (typeof document < "u") {
      var o = document.createElement("style");
      o.appendChild(document.createTextNode(".ce-rawtool__textarea{min-height:200px;resize:vertical;border-radius:8px;border:0;background-color:#1e2128;font-family:Menlo,Monaco,Consolas,Courier New,monospace;font-size:12px;line-height:1.6;letter-spacing:-.2px;color:#a1a7b6;overscroll-behavior:contain}")), document.head.appendChild(o);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const Lh = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.6954 5C17.912 5 18.8468 6.07716 18.6755 7.28165L17.426 16.0659C17.3183 16.8229 16.7885 17.4522 16.061 17.6873L12.6151 18.8012C12.2152 18.9304 11.7848 18.9304 11.3849 18.8012L7.93898 17.6873C7.21148 17.4522 6.6817 16.8229 6.57403 16.0659L5.32454 7.28165C5.15322 6.07716 6.088 5 7.30461 5H16.6954Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8.4H9L9.42857 11.7939H14.5714L14.3571 13.2788L14.1429 14.7636L12 15.4L9.85714 14.7636L9.77143 14.3394"/></svg>';
/**
 * Raw HTML Tool for CodeX Editor
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
class nr {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Should this tool be displayed at the Editor's Toolbox
   *
   * @returns {boolean}
   * @public
   */
  static get displayInToolbox() {
    return !0;
  }
  /**
   * Allow to press Enter inside the RawTool textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return !0;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: Lh,
      title: "Raw HTML"
    };
  }
  /**
   * @typedef {object} RawData — plugin saved data
   * @param {string} html - previously saved HTML code
   * @property
   */
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {RawData} data — previously saved HTML data
   * @param {object} config - user config for Tool
   * @param {object} api - CodeX Editor API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor({ data: e, config: t, api: n, readOnly: r }) {
    this.api = n, this.readOnly = r, this.placeholder = n.i18n.t(t.placeholder || nr.DEFAULT_PLACEHOLDER), this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: "ce-rawtool",
      textarea: "ce-rawtool__textarea"
    }, this.data = {
      html: e.html || ""
    }, this.textarea = null, this.resizeDebounce = null;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement} this.element - RawTool's wrapper
   * @public
   */
  render() {
    const e = document.createElement("div"), t = 100;
    return this.textarea = document.createElement("textarea"), e.classList.add(this.CSS.baseClass, this.CSS.wrapper), this.textarea.classList.add(this.CSS.textarea, this.CSS.input), this.textarea.textContent = this.data.html, this.textarea.placeholder = this.placeholder, this.readOnly ? this.textarea.disabled = !0 : this.textarea.addEventListener("input", () => {
      this.onInput();
    }), e.appendChild(this.textarea), setTimeout(() => {
      this.resize();
    }, t), e;
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} rawToolsWrapper - RawTool's wrapper, containing textarea with raw HTML code
   * @returns {RawData} - raw HTML code
   * @public
   */
  save(e) {
    return {
      html: e.querySelector("textarea").value
    };
  }
  /**
   * Default placeholder for RawTool's textarea
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_PLACEHOLDER() {
    return "Enter HTML code";
  }
  /**
   * Automatic sanitize config
   */
  static get sanitize() {
    return {
      html: !0
      // Allow HTML tags
    };
  }
  /**
   * Textarea change event
   *
   * @returns {void}
   */
  onInput() {
    this.resizeDebounce && clearTimeout(this.resizeDebounce), this.resizeDebounce = setTimeout(() => {
      this.resize();
    }, 200);
  }
  /**
   * Resize textarea to fit whole height
   *
   * @returns {void}
   */
  resize() {
    this.textarea.style.height = "auto", this.textarea.style.height = this.textarea.scrollHeight + "px";
  }
}
var Ah = [["path", {
  d: "m18 16 4-4-4-4",
  key: "1inbqp"
}], ["path", {
  d: "m6 8-4 4 4 4",
  key: "15zrgr"
}], ["path", {
  d: "m14.5 4-5 16",
  key: "e7oirm"
}]], Ph = (o) => m(X, R(o, {
  iconNode: Ah,
  name: "code-xml"
})), Nh = Ph;
jt(nr, {
  type: "raw",
  toolbox: {
    title: "HTML",
    icon: de(Nh)
  },
  renderer: ({
    html: o
  }) => o,
  // anything thats defined is valid, so we need to return void
  // in order to make non parseable data fallback to a raw type
  parser: () => {
  }
});
var $h = [["path", {
  d: "M13.234 20.252 21 12.3",
  key: "1cbrk9"
}], ["path", {
  d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
  key: "1pkts6"
}]], jh = (o) => m(X, R(o, {
  iconNode: $h,
  name: "paperclip"
})), Ni = jh, Rh = /* @__PURE__ */ y("<file-card>", !0, !1, !1);
ze({
  type: "file-card",
  toolbox: {
    title: "File Card",
    icon: de(Ni)
  },
  parser: (o) => {
    if (o.type === "file-card")
      return {
        file: o.attributes.file
      };
  },
  renderer: ({
    file: o
  }) => (() => {
    var e = Rh();
    return A(e, "file", o), e._$owner = ge(), e;
  })(),
  tool: class extends Fe {
    constructor() {
      super(...arguments);
      j(this, "defaultData", {
        file: ""
      });
    }
    validate(t) {
      return !!t.file;
    }
    render() {
      const [t, n] = this.store;
      return m(Ie, {
        class: "flex items-center border-[1pt] border-fg/20 rounded-lg p-1 px-2 gap-2",
        get children() {
          return [m(Ni, {}), m(ve, {
            class: "grow",
            get text() {
              return t.file;
            },
            onChange: (r) => n("file", r)
          })];
        }
      });
    }
  }
});
(function() {
  try {
    if (typeof document < "u") {
      var o = document.createElement("style");
      o.appendChild(document.createTextNode(".ce-hint--align-start{text-align:left}.ce-hint--align-center{text-align:center}.ce-hint__description{opacity:.6;margin-top:3px}")), document.head.appendChild(o);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
var At = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function To(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
function Dh(o) {
  if (o.__esModule)
    return o;
  var e = o.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(o).forEach(function(n) {
    var r = Object.getOwnPropertyDescriptor(o, n);
    Object.defineProperty(t, n, r.get ? r : {
      enumerable: !0,
      get: function() {
        return o[n];
      }
    });
  }), t;
}
function zo() {
}
Object.assign(zo, {
  default: zo,
  register: zo,
  revert: function() {
  },
  __esModule: !0
});
Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(o) {
  const e = (this.document || this.ownerDocument).querySelectorAll(o);
  let t = e.length;
  for (; --t >= 0 && e.item(t) !== this; )
    ;
  return t > -1;
});
Element.prototype.closest || (Element.prototype.closest = function(o) {
  let e = this;
  if (!document.documentElement.contains(e))
    return null;
  do {
    if (e.matches(o))
      return e;
    e = e.parentElement || e.parentNode;
  } while (e !== null);
  return null;
});
Element.prototype.prepend || (Element.prototype.prepend = function(o) {
  const e = document.createDocumentFragment();
  Array.isArray(o) || (o = [o]), o.forEach((t) => {
    const n = t instanceof Node;
    e.appendChild(n ? t : document.createTextNode(t));
  }), this.insertBefore(e, this.firstChild);
});
Element.prototype.scrollIntoViewIfNeeded || (Element.prototype.scrollIntoViewIfNeeded = function(o) {
  o = arguments.length === 0 ? !0 : !!o;
  const e = this.parentNode, t = window.getComputedStyle(e, null), n = parseInt(t.getPropertyValue("border-top-width")), r = parseInt(t.getPropertyValue("border-left-width")), i = this.offsetTop - e.offsetTop < e.scrollTop, s = this.offsetTop - e.offsetTop + this.clientHeight - n > e.scrollTop + e.clientHeight, a = this.offsetLeft - e.offsetLeft < e.scrollLeft, l = this.offsetLeft - e.offsetLeft + this.clientWidth - r > e.scrollLeft + e.clientWidth, c = i && !s;
  (i || s) && o && (e.scrollTop = this.offsetTop - e.offsetTop - e.clientHeight / 2 - n + this.clientHeight / 2), (a || l) && o && (e.scrollLeft = this.offsetLeft - e.offsetLeft - e.clientWidth / 2 - r + this.clientWidth / 2), (i || s || a || l) && !o && this.scrollIntoView(c);
});
window.requestIdleCallback = window.requestIdleCallback || function(o) {
  const e = Date.now();
  return setTimeout(function() {
    o({
      didTimeout: !1,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - e));
      }
    });
  }, 1);
};
window.cancelIdleCallback = window.cancelIdleCallback || function(o) {
  clearTimeout(o);
};
let Hh = (o = 21) => crypto.getRandomValues(new Uint8Array(o)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
var Ws = /* @__PURE__ */ ((o) => (o.VERBOSE = "VERBOSE", o.INFO = "INFO", o.WARN = "WARN", o.ERROR = "ERROR", o))(Ws || {});
const B = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46
}, Fh = {
  LEFT: 0
};
function Rt(o, e, t = "log", n, r = "color: inherit") {
  if (!("console" in window) || !window.console[t])
    return;
  const i = ["info", "log", "warn", "error"].includes(t), s = [];
  switch (Rt.logLevel) {
    case "ERROR":
      if (t !== "error")
        return;
      break;
    case "WARN":
      if (!["error", "warn"].includes(t))
        return;
      break;
    case "INFO":
      if (!i || o)
        return;
      break;
  }
  n && s.push(n);
  const a = "Editor.js 2.31.0-rc.7";
  o && (i ? (s.unshift(`line-height: 1em;
            color: #006FEA;
            display: inline-block;
            font-size: 11px;
            line-height: 1em;
            background-color: #fff;
            padding: 4px 9px;
            border-radius: 30px;
            border: 1px solid rgba(56, 138, 229, 0.16);
            margin: 4px 5px 4px 0;`, r), e = `%c${a}%c ${e}`) : e = `( ${a} )${e}`);
  try {
    i ? n ? console[t](`${e} %o`, ...s) : console[t](e, ...s) : console[t](e);
  } catch {
  }
}
Rt.logLevel = "VERBOSE";
function zh(o) {
  Rt.logLevel = o;
}
const D = Rt.bind(window, !1), be = Rt.bind(window, !0);
function Ge(o) {
  return Object.prototype.toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
function W(o) {
  return Ge(o) === "function" || Ge(o) === "asyncfunction";
}
function oe(o) {
  return Ge(o) === "object";
}
function Le(o) {
  return Ge(o) === "string";
}
function Uh(o) {
  return Ge(o) === "boolean";
}
function $i(o) {
  return Ge(o) === "number";
}
function ji(o) {
  return Ge(o) === "undefined";
}
function ye(o) {
  return o ? Object.keys(o).length === 0 && o.constructor === Object : !0;
}
function qs(o) {
  return o > 47 && o < 58 || // number keys
  o === 32 || o === 13 || // Space bar & return key(s)
  o === 229 || // processing key input for certain languages — Chinese, Japanese, etc.
  o > 64 && o < 91 || // letter keys
  o > 95 && o < 112 || // Numpad keys
  o > 185 && o < 193 || // ;=,-./` (in order)
  o > 218 && o < 223;
}
async function Wh(o, e = () => {
}, t = () => {
}) {
  async function n(r, i, s) {
    try {
      await r.function(r.data), await i(ji(r.data) ? {} : r.data);
    } catch {
      s(ji(r.data) ? {} : r.data);
    }
  }
  return o.reduce(async (r, i) => (await r, n(i, e, t)), Promise.resolve());
}
function Ks(o) {
  return Array.prototype.slice.call(o);
}
function lo(o, e) {
  return function() {
    const t = this, n = arguments;
    window.setTimeout(() => o.apply(t, n), e);
  };
}
function qh(o) {
  return o.name.split(".").pop();
}
function Kh(o) {
  return /^[-\w]+\/([-+\w]+|\*)$/.test(o);
}
function Ri(o, e, t) {
  let n;
  return (...r) => {
    const i = this, s = () => {
      n = null, o.apply(i, r);
    };
    window.clearTimeout(n), n = window.setTimeout(s, e);
  };
}
function sn(o, e, t = void 0) {
  let n, r, i, s = null, a = 0;
  t || (t = {});
  const l = function() {
    a = t.leading === !1 ? 0 : Date.now(), s = null, i = o.apply(n, r), s || (n = r = null);
  };
  return function() {
    const c = Date.now();
    !a && t.leading === !1 && (a = c);
    const d = e - (c - a);
    return n = this, r = arguments, d <= 0 || d > e ? (s && (clearTimeout(s), s = null), a = c, i = o.apply(n, r), s || (n = r = null)) : !s && t.trailing !== !1 && (s = setTimeout(l, d)), i;
  };
}
function Vh() {
  const o = {
    win: !1,
    mac: !1,
    x11: !1,
    linux: !1
  }, e = Object.keys(o).find((t) => window.navigator.appVersion.toLowerCase().indexOf(t) !== -1);
  return e && (o[e] = !0), o;
}
function co(o) {
  return o[0].toUpperCase() + o.slice(1);
}
function an(o, ...e) {
  if (!e.length)
    return o;
  const t = e.shift();
  if (oe(o) && oe(t))
    for (const n in t)
      oe(t[n]) ? (o[n] || Object.assign(o, { [n]: {} }), an(o[n], t[n])) : Object.assign(o, { [n]: t[n] });
  return an(o, ...e);
}
function rr(o) {
  const e = Vh();
  return o = o.replace(/shift/gi, "⇧").replace(/backspace/gi, "⌫").replace(/enter/gi, "⏎").replace(/up/gi, "↑").replace(/left/gi, "→").replace(/down/gi, "↓").replace(/right/gi, "←").replace(/escape/gi, "⎋").replace(/insert/gi, "Ins").replace(/delete/gi, "␡").replace(/\+/gi, " + "), e.mac ? o = o.replace(/ctrl|cmd/gi, "⌘").replace(/alt/gi, "⌥") : o = o.replace(/cmd/gi, "Ctrl").replace(/windows/gi, "WIN"), o;
}
function Yh(o) {
  try {
    return new URL(o).href;
  } catch {
  }
  return o.substring(0, 2) === "//" ? window.location.protocol + o : window.location.origin + o;
}
function Xh() {
  return Hh(10);
}
function Gh(o) {
  window.open(o, "_blank");
}
function Zh(o = "") {
  return `${o}${Math.floor(Math.random() * 1e8).toString(16)}`;
}
function ln(o, e, t) {
  const n = `«${e}» is deprecated and will be removed in the next major release. Please use the «${t}» instead.`;
  o && be(n, "warn");
}
function gt(o, e, t) {
  const n = t.value ? "value" : "get", r = t[n], i = `#${e}Cache`;
  if (t[n] = function(...s) {
    return this[i] === void 0 && (this[i] = r.apply(this, ...s)), this[i];
  }, n === "get" && t.set) {
    const s = t.set;
    t.set = function(a) {
      delete o[i], s.apply(this, a);
    };
  }
  return t;
}
const Vs = 650;
function mt() {
  return window.matchMedia(`(max-width: ${Vs}px)`).matches;
}
const cn = typeof window < "u" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
function Jh(o, e) {
  const t = Array.isArray(o) || oe(o), n = Array.isArray(e) || oe(e);
  return t || n ? JSON.stringify(o) === JSON.stringify(e) : o === e;
}
class p {
  /**
   * Check if passed tag has no closed tag
   *
   * @param {HTMLElement} tag - element to check
   * @returns {boolean}
   */
  static isSingleTag(e) {
    return e.tagName && [
      "AREA",
      "BASE",
      "BR",
      "COL",
      "COMMAND",
      "EMBED",
      "HR",
      "IMG",
      "INPUT",
      "KEYGEN",
      "LINK",
      "META",
      "PARAM",
      "SOURCE",
      "TRACK",
      "WBR"
    ].includes(e.tagName);
  }
  /**
   * Check if element is BR or WBR
   *
   * @param {HTMLElement} element - element to check
   * @returns {boolean}
   */
  static isLineBreakTag(e) {
    return e && e.tagName && [
      "BR",
      "WBR"
    ].includes(e.tagName);
  }
  /**
   * Helper for making Elements with class name and attributes
   *
   * @param  {string} tagName - new Element tag name
   * @param  {string[]|string} [classNames] - list or name of CSS class name(s)
   * @param  {object} [attributes] - any attributes
   * @returns {HTMLElement}
   */
  static make(e, t = null, n = {}) {
    const r = document.createElement(e);
    if (Array.isArray(t)) {
      const i = t.filter((s) => s !== void 0);
      r.classList.add(...i);
    } else
      t && r.classList.add(t);
    for (const i in n)
      Object.prototype.hasOwnProperty.call(n, i) && (r[i] = n[i]);
    return r;
  }
  /**
   * Creates Text Node with the passed content
   *
   * @param {string} content - text content
   * @returns {Text}
   */
  static text(e) {
    return document.createTextNode(e);
  }
  /**
   * Append one or several elements to the parent
   *
   * @param  {Element|DocumentFragment} parent - where to append
   * @param  {Element|Element[]|DocumentFragment|Text|Text[]} elements - element or elements list
   */
  static append(e, t) {
    Array.isArray(t) ? t.forEach((n) => e.appendChild(n)) : e.appendChild(t);
  }
  /**
   * Append element or a couple to the beginning of the parent elements
   *
   * @param {Element} parent - where to append
   * @param {Element|Element[]} elements - element or elements list
   */
  static prepend(e, t) {
    Array.isArray(t) ? (t = t.reverse(), t.forEach((n) => e.prepend(n))) : e.prepend(t);
  }
  /**
   * Swap two elements in parent
   *
   * @param {HTMLElement} el1 - from
   * @param {HTMLElement} el2 - to
   * @deprecated
   */
  static swap(e, t) {
    const n = document.createElement("div"), r = e.parentNode;
    r.insertBefore(n, e), r.insertBefore(e, t), r.insertBefore(t, n), r.removeChild(n);
  }
  /**
   * Selector Decorator
   *
   * Returns first match
   *
   * @param {Element} el - element we searching inside. Default - DOM Document
   * @param {string} selector - searching string
   * @returns {Element}
   */
  static find(e = document, t) {
    return e.querySelector(t);
  }
  /**
   * Get Element by Id
   *
   * @param {string} id - id to find
   * @returns {HTMLElement | null}
   */
  static get(e) {
    return document.getElementById(e);
  }
  /**
   * Selector Decorator.
   *
   * Returns all matches
   *
   * @param {Element|Document} el - element we searching inside. Default - DOM Document
   * @param {string} selector - searching string
   * @returns {NodeList}
   */
  static findAll(e = document, t) {
    return e.querySelectorAll(t);
  }
  /**
   * Returns CSS selector for all text inputs
   */
  static get allInputsSelector() {
    return "[contenteditable=true], textarea, input:not([type]), " + ["text", "password", "email", "number", "search", "tel", "url"].map((e) => `input[type="${e}"]`).join(", ");
  }
  /**
   * Find all contenteditable, textarea and editable input elements passed holder contains
   *
   * @param holder - element where to find inputs
   */
  static findAllInputs(e) {
    return Ks(e.querySelectorAll(p.allInputsSelector)).reduce((t, n) => p.isNativeInput(n) || p.containsOnlyInlineElements(n) ? [...t, n] : [...t, ...p.getDeepestBlockElements(n)], []);
  }
  /**
   * Search for deepest node which is Leaf.
   * Leaf is the vertex that doesn't have any child nodes
   *
   * @description Method recursively goes throw the all Node until it finds the Leaf
   * @param {Node} node - root Node. From this vertex we start Deep-first search
   *                      {@link https://en.wikipedia.org/wiki/Depth-first_search}
   * @param {boolean} [atLast] - find last text node
   * @returns - it can be text Node or Element Node, so that caret will able to work with it
   *            Can return null if node is Document or DocumentFragment, or node is not attached to the DOM
   */
  static getDeepestNode(e, t = !1) {
    const n = t ? "lastChild" : "firstChild", r = t ? "previousSibling" : "nextSibling";
    if (e && e.nodeType === Node.ELEMENT_NODE && e[n]) {
      let i = e[n];
      if (p.isSingleTag(i) && !p.isNativeInput(i) && !p.isLineBreakTag(i))
        if (i[r])
          i = i[r];
        else if (i.parentNode[r])
          i = i.parentNode[r];
        else
          return i.parentNode;
      return this.getDeepestNode(i, t);
    }
    return e;
  }
  /**
   * Check if object is DOM node
   *
   * @param {*} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isElement(e) {
    return $i(e) ? !1 : e && e.nodeType && e.nodeType === Node.ELEMENT_NODE;
  }
  /**
   * Check if object is DocumentFragment node
   *
   * @param {object} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isFragment(e) {
    return $i(e) ? !1 : e && e.nodeType && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }
  /**
   * Check if passed element is contenteditable
   *
   * @param {HTMLElement} element - html element to check
   * @returns {boolean}
   */
  static isContentEditable(e) {
    return e.contentEditable === "true";
  }
  /**
   * Checks target if it is native input
   *
   * @param {*} target - HTML element or string
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNativeInput(e) {
    const t = [
      "INPUT",
      "TEXTAREA"
    ];
    return e && e.tagName ? t.includes(e.tagName) : !1;
  }
  /**
   * Checks if we can set caret
   *
   * @param {HTMLElement} target - target to check
   * @returns {boolean}
   */
  static canSetCaret(e) {
    let t = !0;
    if (p.isNativeInput(e))
      switch (e.type) {
        case "file":
        case "checkbox":
        case "radio":
        case "hidden":
        case "submit":
        case "button":
        case "image":
        case "reset":
          t = !1;
          break;
      }
    else
      t = p.isContentEditable(e);
    return t;
  }
  /**
   * Checks node if it is empty
   *
   * @description Method checks simple Node without any childs for emptiness
   * If you have Node with 2 or more children id depth, you better use {@link Dom#isEmpty} method
   * @param {Node} node - node to check
   * @param {string} [ignoreChars] - char or substring to treat as empty
   * @returns {boolean} true if it is empty
   */
  static isNodeEmpty(e, t) {
    let n;
    return this.isSingleTag(e) && !this.isLineBreakTag(e) ? !1 : (this.isElement(e) && this.isNativeInput(e) ? n = e.value : n = e.textContent.replace("​", ""), t && (n = n.replace(new RegExp(t, "g"), "")), n.length === 0);
  }
  /**
   * checks node if it is doesn't have any child nodes
   *
   * @param {Node} node - node to check
   * @returns {boolean}
   */
  static isLeaf(e) {
    return e ? e.childNodes.length === 0 : !1;
  }
  /**
   * breadth-first search (BFS)
   * {@link https://en.wikipedia.org/wiki/Breadth-first_search}
   *
   * @description Pushes to stack all DOM leafs and checks for emptiness
   * @param {Node} node - node to check
   * @param {string} [ignoreChars] - char or substring to treat as empty
   * @returns {boolean}
   */
  static isEmpty(e, t) {
    const n = [e];
    for (; n.length > 0; )
      if (e = n.shift(), !!e) {
        if (this.isLeaf(e) && !this.isNodeEmpty(e, t))
          return !1;
        e.childNodes && n.push(...Array.from(e.childNodes));
      }
    return !0;
  }
  /**
   * Check if string contains html elements
   *
   * @param {string} str - string to check
   * @returns {boolean}
   */
  static isHTMLString(e) {
    const t = p.make("div");
    return t.innerHTML = e, t.childElementCount > 0;
  }
  /**
   * Return length of node`s text content
   *
   * @param {Node} node - node with content
   * @returns {number}
   */
  static getContentLength(e) {
    return p.isNativeInput(e) ? e.value.length : e.nodeType === Node.TEXT_NODE ? e.length : e.textContent.length;
  }
  /**
   * Return array of names of block html elements
   *
   * @returns {string[]}
   */
  static get blockElements() {
    return [
      "address",
      "article",
      "aside",
      "blockquote",
      "canvas",
      "div",
      "dl",
      "dt",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "header",
      "hgroup",
      "hr",
      "li",
      "main",
      "nav",
      "noscript",
      "ol",
      "output",
      "p",
      "pre",
      "ruby",
      "section",
      "table",
      "tbody",
      "thead",
      "tr",
      "tfoot",
      "ul",
      "video"
    ];
  }
  /**
   * Check if passed content includes only inline elements
   *
   * @param {string|HTMLElement} data - element or html string
   * @returns {boolean}
   */
  static containsOnlyInlineElements(e) {
    let t;
    Le(e) ? (t = document.createElement("div"), t.innerHTML = e) : t = e;
    const n = (r) => !p.blockElements.includes(r.tagName.toLowerCase()) && Array.from(r.children).every(n);
    return Array.from(t.children).every(n);
  }
  /**
   * Find and return all block elements in the passed parent (including subtree)
   *
   * @param {HTMLElement} parent - root element
   * @returns {HTMLElement[]}
   */
  static getDeepestBlockElements(e) {
    return p.containsOnlyInlineElements(e) ? [e] : Array.from(e.children).reduce((t, n) => [...t, ...p.getDeepestBlockElements(n)], []);
  }
  /**
   * Helper for get holder from {string} or return HTMLElement
   *
   * @param {string | HTMLElement} element - holder's id or holder's HTML Element
   * @returns {HTMLElement}
   */
  static getHolder(e) {
    return Le(e) ? document.getElementById(e) : e;
  }
  /**
   * Returns true if element is anchor (is A tag)
   *
   * @param {Element} element - element to check
   * @returns {boolean}
   */
  static isAnchor(e) {
    return e.tagName.toLowerCase() === "a";
  }
  /**
   * Return element's offset related to the document
   *
   * @todo handle case when editor initialized in scrollable popup
   * @param el - element to compute offset
   */
  static offset(e) {
    const t = e.getBoundingClientRect(), n = window.pageXOffset || document.documentElement.scrollLeft, r = window.pageYOffset || document.documentElement.scrollTop, i = t.top + r, s = t.left + n;
    return {
      top: i,
      left: s,
      bottom: i + t.height,
      right: s + t.width
    };
  }
}
function Qh(o) {
  return !/[^\t\n\r ]/.test(o);
}
function ep(o) {
  const e = window.getComputedStyle(o), t = parseFloat(e.fontSize), n = parseFloat(e.lineHeight) || t * 1.2, r = parseFloat(e.paddingTop), i = parseFloat(e.borderTopWidth), s = parseFloat(e.marginTop), a = t * 0.8, l = (n - t) / 2;
  return s + i + r + l + a;
}
function Ys(o) {
  o.dataset.empty = p.isEmpty(o) ? "true" : "false";
}
const tp = {
  blockTunes: {
    toggler: {
      "Click to tune": "",
      "or drag to move": ""
    }
  },
  inlineToolbar: {
    converter: {
      "Convert to": ""
    }
  },
  toolbar: {
    toolbox: {
      Add: ""
    }
  },
  popover: {
    Filter: "",
    "Nothing found": "",
    "Convert to": ""
  }
}, op = {
  Text: "",
  Link: "",
  Bold: "",
  Italic: ""
}, np = {
  link: {
    "Add a link": ""
  },
  stub: {
    "The block can not be displayed correctly.": ""
  }
}, rp = {
  delete: {
    Delete: "",
    "Click to delete": ""
  },
  moveUp: {
    "Move up": ""
  },
  moveDown: {
    "Move down": ""
  }
}, Xs = {
  ui: tp,
  toolNames: op,
  tools: np,
  blockTunes: rp
}, Gs = class lt {
  /**
   * Type-safe translation for internal UI texts:
   * Perform translation of the string by namespace and a key
   *
   * @example I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune')
   * @param internalNamespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static ui(e, t) {
    return lt._t(e, t);
  }
  /**
   * Translate for external strings that is not presented in default dictionary.
   * For example, for user-specified tool names
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static t(e, t) {
    return lt._t(e, t);
  }
  /**
   * Adjust module for using external dictionary
   *
   * @param dictionary - new messages list to override default
   */
  static setDictionary(e) {
    lt.currentDictionary = e;
  }
  /**
   * Perform translation both for internal and external namespaces
   * If there is no translation found, returns passed key as a translated message
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static _t(e, t) {
    const n = lt.getNamespace(e);
    return !n || !n[t] ? t : n[t];
  }
  /**
   * Find messages section by namespace path
   *
   * @param namespace - path to section
   */
  static getNamespace(e) {
    return e.split(".").reduce((t, n) => !t || !Object.keys(t).length ? {} : t[n], lt.currentDictionary);
  }
};
Gs.currentDictionary = Xs;
let ce = Gs;
class Zs extends Error {
}
class Dt {
  constructor() {
    this.subscribers = {};
  }
  /**
   * Subscribe any event on callback
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  on(e, t) {
    e in this.subscribers || (this.subscribers[e] = []), this.subscribers[e].push(t);
  }
  /**
   * Subscribe any event on callback. Callback will be called once and be removed from subscribers array after call.
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  once(e, t) {
    e in this.subscribers || (this.subscribers[e] = []);
    const n = (r) => {
      const i = t(r), s = this.subscribers[e].indexOf(n);
      return s !== -1 && this.subscribers[e].splice(s, 1), i;
    };
    this.subscribers[e].push(n);
  }
  /**
   * Emit callbacks with passed data
   *
   * @param eventName - event name
   * @param data - subscribers get this data when they were fired
   */
  emit(e, t) {
    ye(this.subscribers) || !this.subscribers[e] || this.subscribers[e].reduce((n, r) => {
      const i = r(n);
      return i !== void 0 ? i : n;
    }, t);
  }
  /**
   * Unsubscribe callback from event
   *
   * @param eventName - event name
   * @param callback - event handler
   */
  off(e, t) {
    if (this.subscribers[e] === void 0) {
      console.warn(`EventDispatcher .off(): there is no subscribers for event "${e.toString()}". Probably, .off() called before .on()`);
      return;
    }
    for (let n = 0; n < this.subscribers[e].length; n++)
      if (this.subscribers[e][n] === t) {
        delete this.subscribers[e][n];
        break;
      }
  }
  /**
   * Destroyer
   * clears subscribers list
   */
  destroy() {
    this.subscribers = {};
  }
}
function Te(o) {
  Object.setPrototypeOf(this, {
    /**
     * Block id
     *
     * @returns {string}
     */
    get id() {
      return o.id;
    },
    /**
     * Tool name
     *
     * @returns {string}
     */
    get name() {
      return o.name;
    },
    /**
     * Tool config passed on Editor's initialization
     *
     * @returns {ToolConfig}
     */
    get config() {
      return o.config;
    },
    /**
     * .ce-block element, that wraps plugin contents
     *
     * @returns {HTMLElement}
     */
    get holder() {
      return o.holder;
    },
    /**
     * True if Block content is empty
     *
     * @returns {boolean}
     */
    get isEmpty() {
      return o.isEmpty;
    },
    /**
     * True if Block is selected with Cross-Block selection
     *
     * @returns {boolean}
     */
    get selected() {
      return o.selected;
    },
    /**
     * Set Block's stretch state
     *
     * @param {boolean} state — state to set
     */
    set stretched(e) {
      o.stretched = e;
    },
    /**
     * True if Block is stretched
     *
     * @returns {boolean}
     */
    get stretched() {
      return o.stretched;
    },
    /**
     * True if Block has inputs to be focused
     */
    get focusable() {
      return o.focusable;
    },
    /**
     * Call Tool method with errors handler under-the-hood
     *
     * @param {string} methodName - method to call
     * @param {object} param - object with parameters
     * @returns {unknown}
     */
    call(e, t) {
      return o.call(e, t);
    },
    /**
     * Save Block content
     *
     * @returns {Promise<void|SavedData>}
     */
    save() {
      return o.save();
    },
    /**
     * Validate Block data
     *
     * @param {BlockToolData} data - data to validate
     * @returns {Promise<boolean>}
     */
    validate(e) {
      return o.validate(e);
    },
    /**
     * Allows to say Editor that Block was changed. Used to manually trigger Editor's 'onChange' callback
     * Can be useful for block changes invisible for editor core.
     */
    dispatchChange() {
      o.dispatchChange();
    },
    /**
     * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
     * This method returns the entry that is related to the Block (depended on the Block data)
     */
    getActiveToolboxEntry() {
      return o.getActiveToolboxEntry();
    }
  });
}
class Ht {
  constructor() {
    this.allListeners = [];
  }
  /**
   * Assigns event listener on element and returns unique identifier
   *
   * @param {EventTarget} element - DOM element that needs to be listened
   * @param {string} eventType - event type
   * @param {Function} handler - method that will be fired on event
   * @param {boolean|AddEventListenerOptions} options - useCapture or {capture, passive, once}
   */
  on(e, t, n, r = !1) {
    const i = Zh("l"), s = {
      id: i,
      element: e,
      eventType: t,
      handler: n,
      options: r
    };
    if (!this.findOne(e, t, n))
      return this.allListeners.push(s), e.addEventListener(t, n, r), i;
  }
  /**
   * Removes event listener from element
   *
   * @param {EventTarget} element - DOM element that we removing listener
   * @param {string} eventType - event type
   * @param {Function} handler - remove handler, if element listens several handlers on the same event type
   * @param {boolean|AddEventListenerOptions} options - useCapture or {capture, passive, once}
   */
  off(e, t, n, r) {
    const i = this.findAll(e, t, n);
    i.forEach((s, a) => {
      const l = this.allListeners.indexOf(i[a]);
      l > -1 && (this.allListeners.splice(l, 1), s.element.removeEventListener(s.eventType, s.handler, s.options));
    });
  }
  /**
   * Removes listener by id
   *
   * @param {string} id - listener identifier
   */
  offById(e) {
    const t = this.findById(e);
    t && t.element.removeEventListener(t.eventType, t.handler, t.options);
  }
  /**
   * Finds and returns first listener by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} [eventType] - event type
   * @param {Function} [handler] - event handler
   * @returns {ListenerData|null}
   */
  findOne(e, t, n) {
    const r = this.findAll(e, t, n);
    return r.length > 0 ? r[0] : null;
  }
  /**
   * Return all stored listeners by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} eventType - event type
   * @param {Function} handler - event handler
   * @returns {ListenerData[]}
   */
  findAll(e, t, n) {
    let r;
    const i = e ? this.findByEventTarget(e) : [];
    return e && t && n ? r = i.filter((s) => s.eventType === t && s.handler === n) : e && t ? r = i.filter((s) => s.eventType === t) : r = i, r;
  }
  /**
   * Removes all listeners
   */
  removeAll() {
    this.allListeners.map((e) => {
      e.element.removeEventListener(e.eventType, e.handler, e.options);
    }), this.allListeners = [];
  }
  /**
   * Module cleanup on destruction
   */
  destroy() {
    this.removeAll();
  }
  /**
   * Search method: looks for listener by passed element
   *
   * @param {EventTarget} element - searching element
   * @returns {Array} listeners that found on element
   */
  findByEventTarget(e) {
    return this.allListeners.filter((t) => {
      if (t.element === e)
        return t;
    });
  }
  /**
   * Search method: looks for listener by passed event type
   *
   * @param {string} eventType - event type
   * @returns {ListenerData[]} listeners that found on element
   */
  findByType(e) {
    return this.allListeners.filter((t) => {
      if (t.eventType === e)
        return t;
    });
  }
  /**
   * Search method: looks for listener by passed handler
   *
   * @param {Function} handler - event handler
   * @returns {ListenerData[]} listeners that found on element
   */
  findByHandler(e) {
    return this.allListeners.filter((t) => {
      if (t.handler === e)
        return t;
    });
  }
  /**
   * Returns listener data found by id
   *
   * @param {string} id - listener identifier
   * @returns {ListenerData}
   */
  findById(e) {
    return this.allListeners.find((t) => t.id === e);
  }
}
class P {
  /**
   * @class
   * @param options - Module options
   * @param options.config - Module config
   * @param options.eventsDispatcher - Common event bus
   */
  constructor({ config: e, eventsDispatcher: t }) {
    if (this.nodes = {}, this.listeners = new Ht(), this.readOnlyMutableListeners = {
      /**
       * Assigns event listener on DOM element and pushes into special array that might be removed
       *
       * @param {EventTarget} element - DOM Element
       * @param {string} eventType - Event name
       * @param {Function} handler - Event handler
       * @param {boolean|AddEventListenerOptions} options - Listening options
       */
      on: (n, r, i, s = !1) => {
        this.mutableListenerIds.push(
          this.listeners.on(n, r, i, s)
        );
      },
      /**
       * Clears all mutable listeners
       */
      clearAll: () => {
        for (const n of this.mutableListenerIds)
          this.listeners.offById(n);
        this.mutableListenerIds = [];
      }
    }, this.mutableListenerIds = [], new.target === P)
      throw new TypeError("Constructors for abstract class Module are not allowed.");
    this.config = e, this.eventsDispatcher = t;
  }
  /**
   * Editor modules setter
   *
   * @param {EditorModules} Editor - Editor's Modules
   */
  set state(e) {
    this.Editor = e;
  }
  /**
   * Remove memorized nodes
   */
  removeAllNodes() {
    for (const e in this.nodes) {
      const t = this.nodes[e];
      t instanceof HTMLElement && t.remove();
    }
  }
  /**
   * Returns true if current direction is RTL (Right-To-Left)
   */
  get isRtl() {
    return this.config.i18n.direction === "rtl";
  }
}
class x {
  constructor() {
    this.instance = null, this.selection = null, this.savedSelectionRange = null, this.isFakeBackgroundEnabled = !1, this.commandBackground = "backColor", this.commandRemoveFormat = "removeFormat";
  }
  /**
   * Editor styles
   *
   * @returns {{editorWrapper: string, editorZone: string}}
   */
  static get CSS() {
    return {
      editorWrapper: "codex-editor",
      editorZone: "codex-editor__redactor"
    };
  }
  /**
   * Returns selected anchor
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorNode}
   *
   * @returns {Node|null}
   */
  static get anchorNode() {
    const e = window.getSelection();
    return e ? e.anchorNode : null;
  }
  /**
   * Returns selected anchor element
   *
   * @returns {Element|null}
   */
  static get anchorElement() {
    const e = window.getSelection();
    if (!e)
      return null;
    const t = e.anchorNode;
    return t ? p.isElement(t) ? t : t.parentElement : null;
  }
  /**
   * Returns selection offset according to the anchor node
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
   *
   * @returns {number|null}
   */
  static get anchorOffset() {
    const e = window.getSelection();
    return e ? e.anchorOffset : null;
  }
  /**
   * Is current selection range collapsed
   *
   * @returns {boolean|null}
   */
  static get isCollapsed() {
    const e = window.getSelection();
    return e ? e.isCollapsed : null;
  }
  /**
   * Check current selection if it is at Editor's zone
   *
   * @returns {boolean}
   */
  static get isAtEditor() {
    return this.isSelectionAtEditor(x.get());
  }
  /**
   * Check if passed selection is at Editor's zone
   *
   * @param selection - Selection object to check
   */
  static isSelectionAtEditor(e) {
    if (!e)
      return !1;
    let t = e.anchorNode || e.focusNode;
    t && t.nodeType === Node.TEXT_NODE && (t = t.parentNode);
    let n = null;
    return t && t instanceof Element && (n = t.closest(`.${x.CSS.editorZone}`)), n ? n.nodeType === Node.ELEMENT_NODE : !1;
  }
  /**
   * Check if passed range at Editor zone
   *
   * @param range - range to check
   */
  static isRangeAtEditor(e) {
    if (!e)
      return;
    let t = e.startContainer;
    t && t.nodeType === Node.TEXT_NODE && (t = t.parentNode);
    let n = null;
    return t && t instanceof Element && (n = t.closest(`.${x.CSS.editorZone}`)), n ? n.nodeType === Node.ELEMENT_NODE : !1;
  }
  /**
   * Methods return boolean that true if selection exists on the page
   */
  static get isSelectionExists() {
    return !!x.get().anchorNode;
  }
  /**
   * Return first range
   *
   * @returns {Range|null}
   */
  static get range() {
    return this.getRangeFromSelection(this.get());
  }
  /**
   * Returns range from passed Selection object
   *
   * @param selection - Selection object to get Range from
   */
  static getRangeFromSelection(e) {
    return e && e.rangeCount ? e.getRangeAt(0) : null;
  }
  /**
   * Calculates position and size of selected text
   *
   * @returns {DOMRect | ClientRect}
   */
  static get rect() {
    let e = document.selection, t, n = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    if (e && e.type !== "Control")
      return e = e, t = e.createRange(), n.x = t.boundingLeft, n.y = t.boundingTop, n.width = t.boundingWidth, n.height = t.boundingHeight, n;
    if (!window.getSelection)
      return D("Method window.getSelection is not supported", "warn"), n;
    if (e = window.getSelection(), e.rangeCount === null || isNaN(e.rangeCount))
      return D("Method SelectionUtils.rangeCount is not supported", "warn"), n;
    if (e.rangeCount === 0)
      return n;
    if (t = e.getRangeAt(0).cloneRange(), t.getBoundingClientRect && (n = t.getBoundingClientRect()), n.x === 0 && n.y === 0) {
      const r = document.createElement("span");
      if (r.getBoundingClientRect) {
        r.appendChild(document.createTextNode("​")), t.insertNode(r), n = r.getBoundingClientRect();
        const i = r.parentNode;
        i.removeChild(r), i.normalize();
      }
    }
    return n;
  }
  /**
   * Returns selected text as String
   *
   * @returns {string}
   */
  static get text() {
    return window.getSelection ? window.getSelection().toString() : "";
  }
  /**
   * Returns window SelectionUtils
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Window/getSelection}
   *
   * @returns {Selection}
   */
  static get() {
    return window.getSelection();
  }
  /**
   * Set focus to contenteditable or native input element
   *
   * @param element - element where to set focus
   * @param offset - offset of cursor
   */
  static setCursor(e, t = 0) {
    const n = document.createRange(), r = window.getSelection();
    return p.isNativeInput(e) ? p.canSetCaret(e) ? (e.focus(), e.selectionStart = e.selectionEnd = t, e.getBoundingClientRect()) : void 0 : (n.setStart(e, t), n.setEnd(e, t), r.removeAllRanges(), r.addRange(n), n.getBoundingClientRect());
  }
  /**
   * Check if current range exists and belongs to container
   *
   * @param container - where range should be
   */
  static isRangeInsideContainer(e) {
    const t = x.range;
    return t === null ? !1 : e.contains(t.startContainer);
  }
  /**
   * Adds fake cursor to the current range
   */
  static addFakeCursor() {
    const e = x.range;
    if (e === null)
      return;
    const t = p.make("span", "codex-editor__fake-cursor");
    t.dataset.mutationFree = "true", e.collapse(), e.insertNode(t);
  }
  /**
   * Check if passed element contains a fake cursor
   *
   * @param el - where to check
   */
  static isFakeCursorInsideContainer(e) {
    return p.find(e, ".codex-editor__fake-cursor") !== null;
  }
  /**
   * Removes fake cursor from a container
   *
   * @param container - container to look for
   */
  static removeFakeCursor(e = document.body) {
    const t = p.find(e, ".codex-editor__fake-cursor");
    t && t.remove();
  }
  /**
   * Removes fake background
   */
  removeFakeBackground() {
    this.isFakeBackgroundEnabled && (this.isFakeBackgroundEnabled = !1, document.execCommand(this.commandRemoveFormat));
  }
  /**
   * Sets fake background
   */
  setFakeBackground() {
    document.execCommand(this.commandBackground, !1, "#a8d6ff"), this.isFakeBackgroundEnabled = !0;
  }
  /**
   * Save SelectionUtils's range
   */
  save() {
    this.savedSelectionRange = x.range;
  }
  /**
   * Restore saved SelectionUtils's range
   */
  restore() {
    if (!this.savedSelectionRange)
      return;
    const e = window.getSelection();
    e.removeAllRanges(), e.addRange(this.savedSelectionRange);
  }
  /**
   * Clears saved selection
   */
  clearSaved() {
    this.savedSelectionRange = null;
  }
  /**
   * Collapse current selection
   */
  collapseToEnd() {
    const e = window.getSelection(), t = document.createRange();
    t.selectNodeContents(e.focusNode), t.collapse(!1), e.removeAllRanges(), e.addRange(t);
  }
  /**
   * Looks ahead to find passed tag from current selection
   *
   * @param  {string} tagName       - tag to found
   * @param  {string} [className]   - tag's class name
   * @param  {number} [searchDepth] - count of tags that can be included. For better performance.
   * @returns {HTMLElement|null}
   */
  findParentTag(e, t, n = 10) {
    const r = window.getSelection();
    let i = null;
    return !r || !r.anchorNode || !r.focusNode ? null : ([
      /** the Node in which the selection begins */
      r.anchorNode,
      /** the Node in which the selection ends */
      r.focusNode
    ].forEach((s) => {
      let a = n;
      for (; a > 0 && s.parentNode && !(s.tagName === e && (i = s, t && s.classList && !s.classList.contains(t) && (i = null), i)); )
        s = s.parentNode, a--;
    }), i);
  }
  /**
   * Expands selection range to the passed parent node
   *
   * @param {HTMLElement} element - element which contents should be selected
   */
  expandToTag(e) {
    const t = window.getSelection();
    t.removeAllRanges();
    const n = document.createRange();
    n.selectNodeContents(e), t.addRange(n);
  }
}
function ip(o, e) {
  const { type: t, target: n, addedNodes: r, removedNodes: i } = o;
  return o.type === "attributes" && o.attributeName === "data-empty" ? !1 : !!(e.contains(n) || t === "childList" && (Array.from(r).some((s) => s === e) || Array.from(i).some((s) => s === e)));
}
const dn = "redactor dom changed", Js = "block changed", Qs = "fake cursor is about to be toggled", ea = "fake cursor have been set", Pt = "editor mobile layout toggled";
function un(o, e) {
  if (!o.conversionConfig)
    return !1;
  const t = o.conversionConfig[e];
  return W(t) || Le(t);
}
function uo(o, e) {
  return un(o.tool, e);
}
function ta(o, e) {
  return Object.entries(o).some(([t, n]) => e[t] && Jh(e[t], n));
}
async function oa(o, e) {
  const t = (await o.save()).data, n = e.find((r) => r.name === o.name);
  return n !== void 0 && !un(n, "export") ? [] : e.reduce((r, i) => {
    if (!un(i, "import") || i.toolbox === void 0)
      return r;
    const s = i.toolbox.filter((a) => {
      if (ye(a) || a.icon === void 0)
        return !1;
      if (a.data !== void 0) {
        if (ta(a.data, t))
          return !1;
      } else if (i.name === o.name)
        return !1;
      return !0;
    });
    return r.push({
      ...i,
      toolbox: s
    }), r;
  }, []);
}
function Di(o, e) {
  return o.mergeable ? o.name === e.name ? !0 : uo(e, "export") && uo(o, "import") : !1;
}
function sp(o, e) {
  const t = e == null ? void 0 : e.export;
  return W(t) ? t(o) : Le(t) ? o[t] : (t !== void 0 && D("Conversion «export» property must be a string or function. String means key of saved data object to export. Function should export processed string to export."), "");
}
function Hi(o, e, t) {
  const n = e == null ? void 0 : e.import;
  return W(n) ? n(o, t) : Le(n) ? {
    [n]: o
  } : (n !== void 0 && D("Conversion «import» property must be a string or function. String means key of tool data to import. Function accepts a imported string and return composed tool data."), {});
}
var z = /* @__PURE__ */ ((o) => (o.Default = "default", o.Separator = "separator", o.Html = "html", o))(z || {}), _e = /* @__PURE__ */ ((o) => (o.APPEND_CALLBACK = "appendCallback", o.RENDERED = "rendered", o.MOVED = "moved", o.UPDATED = "updated", o.REMOVED = "removed", o.ON_PASTE = "onPaste", o))(_e || {});
class ee extends Dt {
  /**
   * @param options - block constructor options
   * @param [options.id] - block's id. Will be generated if omitted.
   * @param options.data - Tool's initial data
   * @param options.tool — block's tool
   * @param options.api - Editor API module for pass it to the Block Tunes
   * @param options.readOnly - Read-Only flag
   * @param [eventBus] - Editor common event bus. Allows to subscribe on some Editor events. Could be omitted when "virtual" Block is created. See BlocksAPI@composeBlockData.
   */
  constructor({
    id: e = Xh(),
    data: t,
    tool: n,
    readOnly: r,
    tunesData: i
  }, s) {
    super(), this.cachedInputs = [], this.toolRenderedElement = null, this.tunesInstances = /* @__PURE__ */ new Map(), this.defaultTunesInstances = /* @__PURE__ */ new Map(), this.unavailableTunesData = {}, this.inputIndex = 0, this.editorEventBus = null, this.handleFocus = () => {
      this.dropInputsCache(), this.updateCurrentInput();
    }, this.didMutated = (a = void 0) => {
      const l = a === void 0, c = a instanceof InputEvent;
      !l && !c && this.detectToolRootChange(a);
      let d;
      l || c ? d = !0 : d = !(a.length > 0 && a.every((u) => {
        const { addedNodes: h, removedNodes: g, target: f } = u;
        return [
          ...Array.from(h),
          ...Array.from(g),
          f
        ].some((b) => (p.isElement(b) || (b = b.parentElement), b && b.closest('[data-mutation-free="true"]') !== null));
      })), d && (this.dropInputsCache(), this.updateCurrentInput(), this.toggleInputsEmptyMark(), this.call(
        "updated"
        /* UPDATED */
      ), this.emit("didMutated", this));
    }, this.name = n.name, this.id = e, this.settings = n.settings, this.config = n.settings.config || {}, this.editorEventBus = s || null, this.blockAPI = new Te(this), this.tool = n, this.toolInstance = n.create(t, this.blockAPI, r), this.tunes = n.tunes, this.composeTunes(i), this.holder = this.compose(), window.requestIdleCallback(() => {
      this.watchBlockMutations(), this.addInputEvents(), this.toggleInputsEmptyMark();
    });
  }
  /**
   * CSS classes for the Block
   *
   * @returns {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      wrapper: "ce-block",
      wrapperStretched: "ce-block--stretched",
      content: "ce-block__content",
      selected: "ce-block--selected",
      dropTarget: "ce-block--drop-target"
    };
  }
  /**
   * Find and return all editable elements (contenteditable and native inputs) in the Tool HTML
   */
  get inputs() {
    if (this.cachedInputs.length !== 0)
      return this.cachedInputs;
    const e = p.findAllInputs(this.holder);
    return this.inputIndex > e.length - 1 && (this.inputIndex = e.length - 1), this.cachedInputs = e, e;
  }
  /**
   * Return current Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  get currentInput() {
    return this.inputs[this.inputIndex];
  }
  /**
   * Set input index to the passed element
   *
   * @param element - HTML Element to set as current input
   */
  set currentInput(e) {
    const t = this.inputs.findIndex((n) => n === e || n.contains(e));
    t !== -1 && (this.inputIndex = t);
  }
  /**
   * Return first Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  get firstInput() {
    return this.inputs[0];
  }
  /**
   * Return first Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  get lastInput() {
    const e = this.inputs;
    return e[e.length - 1];
  }
  /**
   * Return next Tool`s input or undefined if it doesn't exist
   * If Block doesn't contain inputs, return undefined
   */
  get nextInput() {
    return this.inputs[this.inputIndex + 1];
  }
  /**
   * Return previous Tool`s input or undefined if it doesn't exist
   * If Block doesn't contain inputs, return undefined
   */
  get previousInput() {
    return this.inputs[this.inputIndex - 1];
  }
  /**
   * Get Block's JSON data
   *
   * @returns {object}
   */
  get data() {
    return this.save().then((e) => e && !ye(e.data) ? e.data : {});
  }
  /**
   * Returns tool's sanitizer config
   *
   * @returns {object}
   */
  get sanitize() {
    return this.tool.sanitizeConfig;
  }
  /**
   * is block mergeable
   * We plugin have merge function then we call it mergeable
   *
   * @returns {boolean}
   */
  get mergeable() {
    return W(this.toolInstance.merge);
  }
  /**
   * If Block contains inputs, it is focusable
   */
  get focusable() {
    return this.inputs.length !== 0;
  }
  /**
   * Check block for emptiness
   *
   * @returns {boolean}
   */
  get isEmpty() {
    const e = p.isEmpty(this.pluginsContent, "/"), t = !this.hasMedia;
    return e && t;
  }
  /**
   * Check if block has a media content such as images, iframe and other
   *
   * @returns {boolean}
   */
  get hasMedia() {
    const e = [
      "img",
      "iframe",
      "video",
      "audio",
      "source",
      "input",
      "textarea",
      "twitterwidget"
    ];
    return !!this.holder.querySelector(e.join(","));
  }
  /**
   * Set selected state
   * We don't need to mark Block as Selected when it is empty
   *
   * @param {boolean} state - 'true' to select, 'false' to remove selection
   */
  set selected(e) {
    var t, n;
    this.holder.classList.toggle(ee.CSS.selected, e);
    const r = e === !0 && x.isRangeInsideContainer(this.holder), i = e === !1 && x.isFakeCursorInsideContainer(this.holder);
    (r || i) && ((t = this.editorEventBus) == null || t.emit(Qs, { state: e }), r ? x.addFakeCursor() : x.removeFakeCursor(this.holder), (n = this.editorEventBus) == null || n.emit(ea, { state: e }));
  }
  /**
   * Returns True if it is Selected
   *
   * @returns {boolean}
   */
  get selected() {
    return this.holder.classList.contains(ee.CSS.selected);
  }
  /**
   * Set stretched state
   *
   * @param {boolean} state - 'true' to enable, 'false' to disable stretched state
   */
  set stretched(e) {
    this.holder.classList.toggle(ee.CSS.wrapperStretched, e);
  }
  /**
   * Return Block's stretched state
   *
   * @returns {boolean}
   */
  get stretched() {
    return this.holder.classList.contains(ee.CSS.wrapperStretched);
  }
  /**
   * Toggle drop target state
   *
   * @param {boolean} state - 'true' if block is drop target, false otherwise
   */
  set dropTarget(e) {
    this.holder.classList.toggle(ee.CSS.dropTarget, e);
  }
  /**
   * Returns Plugins content
   *
   * @returns {HTMLElement}
   */
  get pluginsContent() {
    return this.toolRenderedElement;
  }
  /**
   * Calls Tool's method
   *
   * Method checks tool property {MethodName}. Fires method with passes params If it is instance of Function
   *
   * @param {string} methodName - method to call
   * @param {object} params - method argument
   */
  call(e, t) {
    if (W(this.toolInstance[e])) {
      e === "appendCallback" && D(
        "`appendCallback` hook is deprecated and will be removed in the next major release. Use `rendered` hook instead",
        "warn"
      );
      try {
        this.toolInstance[e].call(this.toolInstance, t);
      } catch (n) {
        D(`Error during '${e}' call: ${n.message}`, "error");
      }
    }
  }
  /**
   * Call plugins merge method
   *
   * @param {BlockToolData} data - data to merge
   */
  async mergeWith(e) {
    await this.toolInstance.merge(e);
  }
  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   *
   * @returns {object}
   */
  async save() {
    const e = await this.toolInstance.save(this.pluginsContent), t = this.unavailableTunesData;
    [
      ...this.tunesInstances.entries(),
      ...this.defaultTunesInstances.entries()
    ].forEach(([i, s]) => {
      if (W(s.save))
        try {
          t[i] = s.save();
        } catch (a) {
          D(`Tune ${s.constructor.name} save method throws an Error %o`, "warn", a);
        }
    });
    const n = window.performance.now();
    let r;
    return Promise.resolve(e).then((i) => (r = window.performance.now(), {
      id: this.id,
      tool: this.name,
      data: i,
      tunes: t,
      time: r - n
    })).catch((i) => {
      D(`Saving process for ${this.name} tool failed due to the ${i}`, "log", "red");
    });
  }
  /**
   * Uses Tool's validation method to check the correctness of output data
   * Tool's validation method is optional
   *
   * @description Method returns true|false whether data passed the validation or not
   * @param {BlockToolData} data - data to validate
   * @returns {Promise<boolean>} valid
   */
  async validate(e) {
    let t = !0;
    return this.toolInstance.validate instanceof Function && (t = await this.toolInstance.validate(e)), t;
  }
  /**
   * Returns data to render in Block Tunes menu.
   * Splits block tunes into 2 groups: block specific tunes and common tunes
   */
  getTunes() {
    const e = [], t = [], n = typeof this.toolInstance.renderSettings == "function" ? this.toolInstance.renderSettings() : [];
    return p.isElement(n) ? e.push({
      type: z.Html,
      element: n
    }) : Array.isArray(n) ? e.push(...n) : e.push(n), [
      ...this.tunesInstances.values(),
      ...this.defaultTunesInstances.values()
    ].map((r) => r.render()).forEach((r) => {
      p.isElement(r) ? t.push({
        type: z.Html,
        element: r
      }) : Array.isArray(r) ? t.push(...r) : t.push(r);
    }), {
      toolTunes: e,
      commonTunes: t
    };
  }
  /**
   * Update current input index with selection anchor node
   */
  updateCurrentInput() {
    this.currentInput = p.isNativeInput(document.activeElement) || !x.anchorNode ? document.activeElement : x.anchorNode;
  }
  /**
   * Allows to say Editor that Block was changed. Used to manually trigger Editor's 'onChange' callback
   * Can be useful for block changes invisible for editor core.
   */
  dispatchChange() {
    this.didMutated();
  }
  /**
   * Call Tool instance destroy method
   */
  destroy() {
    this.unwatchBlockMutations(), this.removeInputEvents(), super.destroy(), W(this.toolInstance.destroy) && this.toolInstance.destroy();
  }
  /**
   * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
   * This method returns the entry that is related to the Block (depended on the Block data)
   */
  async getActiveToolboxEntry() {
    const e = this.tool.toolbox;
    if (e.length === 1)
      return Promise.resolve(this.tool.toolbox[0]);
    const t = await this.data, n = e;
    return n == null ? void 0 : n.find((r) => ta(r.data, t));
  }
  /**
   * Exports Block data as string using conversion config
   */
  async exportDataAsString() {
    const e = await this.data;
    return sp(e, this.tool.conversionConfig);
  }
  /**
   * Make default Block wrappers and put Tool`s content there
   *
   * @returns {HTMLDivElement}
   */
  compose() {
    const e = p.make("div", ee.CSS.wrapper), t = p.make("div", ee.CSS.content), n = this.toolInstance.render();
    e.setAttribute("data-cy", "block-wrapper"), e.dataset.id = this.id, this.toolRenderedElement = n, t.appendChild(this.toolRenderedElement);
    let r = t;
    return [...this.tunesInstances.values(), ...this.defaultTunesInstances.values()].forEach((i) => {
      if (W(i.wrap))
        try {
          r = i.wrap(r);
        } catch (s) {
          D(`Tune ${i.constructor.name} wrap method throws an Error %o`, "warn", s);
        }
    }), e.appendChild(r), e;
  }
  /**
   * Instantiate Block Tunes
   *
   * @param tunesData - current Block tunes data
   * @private
   */
  composeTunes(e) {
    Array.from(this.tunes.values()).forEach((t) => {
      (t.isInternal ? this.defaultTunesInstances : this.tunesInstances).set(t.name, t.create(e[t.name], this.blockAPI));
    }), Object.entries(e).forEach(([t, n]) => {
      this.tunesInstances.has(t) || (this.unavailableTunesData[t] = n);
    });
  }
  /**
   * Adds focus event listeners to all inputs and contenteditable
   */
  addInputEvents() {
    this.inputs.forEach((e) => {
      e.addEventListener("focus", this.handleFocus), p.isNativeInput(e) && e.addEventListener("input", this.didMutated);
    });
  }
  /**
   * removes focus event listeners from all inputs and contenteditable
   */
  removeInputEvents() {
    this.inputs.forEach((e) => {
      e.removeEventListener("focus", this.handleFocus), p.isNativeInput(e) && e.removeEventListener("input", this.didMutated);
    });
  }
  /**
   * Listen common editor Dom Changed event and detect mutations related to the  Block
   */
  watchBlockMutations() {
    var e;
    this.redactorDomChangedCallback = (t) => {
      const { mutations: n } = t;
      n.some((r) => ip(r, this.toolRenderedElement)) && this.didMutated(n);
    }, (e = this.editorEventBus) == null || e.on(dn, this.redactorDomChangedCallback);
  }
  /**
   * Remove redactor dom change event listener
   */
  unwatchBlockMutations() {
    var e;
    (e = this.editorEventBus) == null || e.off(dn, this.redactorDomChangedCallback);
  }
  /**
   * Sometimes Tool can replace own main element, for example H2 -> H4 or UL -> OL
   * We need to detect such changes and update a link to tools main element with the new one
   *
   * @param mutations - records of block content mutations
   */
  detectToolRootChange(e) {
    e.forEach((t) => {
      if (Array.from(t.removedNodes).includes(this.toolRenderedElement)) {
        const n = t.addedNodes[t.addedNodes.length - 1];
        this.toolRenderedElement = n;
      }
    });
  }
  /**
   * Clears inputs cached value
   */
  dropInputsCache() {
    this.cachedInputs = [];
  }
  /**
   * Mark inputs with 'data-empty' attribute with the empty state
   */
  toggleInputsEmptyMark() {
    this.inputs.forEach(Ys);
  }
}
class ap extends P {
  constructor() {
    super(...arguments), this.insert = (e = this.config.defaultBlock, t = {}, n = {}, r, i, s, a) => {
      const l = this.Editor.BlockManager.insert({
        id: a,
        tool: e,
        data: t,
        index: r,
        needToFocus: i,
        replace: s
      });
      return new Te(l);
    }, this.composeBlockData = async (e) => {
      const t = this.Editor.Tools.blockTools.get(e);
      return new ee({
        tool: t,
        api: this.Editor.API,
        readOnly: !0,
        data: {},
        tunesData: {}
      }).data;
    }, this.update = async (e, t, n) => {
      const { BlockManager: r } = this.Editor, i = r.getBlockById(e);
      if (i === void 0)
        throw new Error(`Block with id "${e}" not found`);
      const s = await r.update(i, t, n);
      return new Te(s);
    }, this.convert = async (e, t, n) => {
      var r, i;
      const { BlockManager: s, Tools: a } = this.Editor, l = s.getBlockById(e);
      if (!l)
        throw new Error(`Block with id "${e}" not found`);
      const c = a.blockTools.get(l.name), d = a.blockTools.get(t);
      if (!d)
        throw new Error(`Block Tool with type "${t}" not found`);
      const u = ((r = c == null ? void 0 : c.conversionConfig) == null ? void 0 : r.export) !== void 0, h = ((i = d.conversionConfig) == null ? void 0 : i.import) !== void 0;
      if (u && h) {
        const g = await s.convert(l, t, n);
        return new Te(g);
      } else {
        const g = [
          u ? !1 : co(l.name),
          h ? !1 : co(t)
        ].filter(Boolean).join(" and ");
        throw new Error(`Conversion from "${l.name}" to "${t}" is not possible. ${g} tool(s) should provide a "conversionConfig"`);
      }
    }, this.insertMany = (e, t = this.Editor.BlockManager.blocks.length - 1) => {
      this.validateIndex(t);
      const n = e.map(({ id: r, type: i, data: s }) => this.Editor.BlockManager.composeBlock({
        id: r,
        tool: i || this.config.defaultBlock,
        data: s
      }));
      return this.Editor.BlockManager.insertMany(n, t), n.map((r) => new Te(r));
    };
  }
  /**
   * Available methods
   *
   * @returns {Blocks}
   */
  get methods() {
    return {
      clear: () => this.clear(),
      render: (e) => this.render(e),
      renderFromHTML: (e) => this.renderFromHTML(e),
      delete: (e) => this.delete(e),
      swap: (e, t) => this.swap(e, t),
      move: (e, t) => this.move(e, t),
      getBlockByIndex: (e) => this.getBlockByIndex(e),
      getById: (e) => this.getById(e),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
      getBlockIndex: (e) => this.getBlockIndex(e),
      getBlocksCount: () => this.getBlocksCount(),
      getBlockByElement: (e) => this.getBlockByElement(e),
      stretchBlock: (e, t = !0) => this.stretchBlock(e, t),
      insertNewBlock: () => this.insertNewBlock(),
      insert: this.insert,
      insertMany: this.insertMany,
      update: this.update,
      composeBlockData: this.composeBlockData,
      convert: this.convert
    };
  }
  /**
   * Returns Blocks count
   *
   * @returns {number}
   */
  getBlocksCount() {
    return this.Editor.BlockManager.blocks.length;
  }
  /**
   * Returns current block index
   *
   * @returns {number}
   */
  getCurrentBlockIndex() {
    return this.Editor.BlockManager.currentBlockIndex;
  }
  /**
   * Returns the index of Block by id;
   *
   * @param id - block id
   */
  getBlockIndex(e) {
    const t = this.Editor.BlockManager.getBlockById(e);
    if (!t) {
      be("There is no block with id `" + e + "`", "warn");
      return;
    }
    return this.Editor.BlockManager.getBlockIndex(t);
  }
  /**
   * Returns BlockAPI object by Block index
   *
   * @param {number} index - index to get
   */
  getBlockByIndex(e) {
    const t = this.Editor.BlockManager.getBlockByIndex(e);
    if (t === void 0) {
      be("There is no block at index `" + e + "`", "warn");
      return;
    }
    return new Te(t);
  }
  /**
   * Returns BlockAPI object by Block id
   *
   * @param id - id of block to get
   */
  getById(e) {
    const t = this.Editor.BlockManager.getBlockById(e);
    return t === void 0 ? (be("There is no block with id `" + e + "`", "warn"), null) : new Te(t);
  }
  /**
   * Get Block API object by any child html element
   *
   * @param element - html element to get Block by
   */
  getBlockByElement(e) {
    const t = this.Editor.BlockManager.getBlock(e);
    if (t === void 0) {
      be("There is no block corresponding to element `" + e + "`", "warn");
      return;
    }
    return new Te(t);
  }
  /**
   * Call Block Manager method that swap Blocks
   *
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   * @deprecated — use 'move' instead
   */
  swap(e, t) {
    D(
      "`blocks.swap()` method is deprecated and will be removed in the next major release. Use `block.move()` method instead",
      "info"
    ), this.Editor.BlockManager.swap(e, t);
  }
  /**
   * Move block from one index to another
   *
   * @param {number} toIndex - index to move to
   * @param {number} fromIndex - index to move from
   */
  move(e, t) {
    this.Editor.BlockManager.move(e, t);
  }
  /**
   * Deletes Block
   *
   * @param {number} blockIndex - index of Block to delete
   */
  delete(e = this.Editor.BlockManager.currentBlockIndex) {
    try {
      const t = this.Editor.BlockManager.getBlockByIndex(e);
      this.Editor.BlockManager.removeBlock(t);
    } catch (t) {
      be(t, "warn");
      return;
    }
    this.Editor.BlockManager.blocks.length === 0 && this.Editor.BlockManager.insert(), this.Editor.BlockManager.currentBlock && this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END), this.Editor.Toolbar.close();
  }
  /**
   * Clear Editor's area
   */
  async clear() {
    await this.Editor.BlockManager.clear(!0), this.Editor.InlineToolbar.close();
  }
  /**
   * Fills Editor with Blocks data
   *
   * @param {OutputData} data — Saved Editor data
   */
  async render(e) {
    if (e === void 0 || e.blocks === void 0)
      throw new Error("Incorrect data passed to the render() method");
    this.Editor.ModificationsObserver.disable(), await this.Editor.BlockManager.clear(), await this.Editor.Renderer.render(e.blocks), this.Editor.ModificationsObserver.enable();
  }
  /**
   * Render passed HTML string
   *
   * @param {string} data - HTML string to render
   * @returns {Promise<void>}
   */
  renderFromHTML(e) {
    return this.Editor.BlockManager.clear(), this.Editor.Paste.processText(e, !0);
  }
  /**
   * Stretch Block's content
   *
   * @param {number} index - index of Block to stretch
   * @param {boolean} status - true to enable, false to disable
   * @deprecated Use BlockAPI interface to stretch Blocks
   */
  stretchBlock(e, t = !0) {
    ln(
      !0,
      "blocks.stretchBlock()",
      "BlockAPI"
    );
    const n = this.Editor.BlockManager.getBlockByIndex(e);
    n && (n.stretched = t);
  }
  /**
   * Insert new Block
   * After set caret to this Block
   *
   * @todo remove in 3.0.0
   * @deprecated with insert() method
   */
  insertNewBlock() {
    D("Method blocks.insertNewBlock() is deprecated and it will be removed in the next major release. Use blocks.insert() instead.", "warn"), this.insert();
  }
  /**
   * Validated block index and throws an error if it's invalid
   *
   * @param index - index to validate
   */
  validateIndex(e) {
    if (typeof e != "number")
      throw new Error("Index should be a number");
    if (e < 0)
      throw new Error("Index should be greater than or equal to 0");
    if (e === null)
      throw new Error("Index should be greater than or equal to 0");
  }
}
function lp(o, e) {
  return typeof o == "number" ? e.BlockManager.getBlockByIndex(o) : typeof o == "string" ? e.BlockManager.getBlockById(o) : e.BlockManager.getBlockById(o.id);
}
class cp extends P {
  constructor() {
    super(...arguments), this.setToFirstBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.firstBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.firstBlock, e, t), !0) : !1, this.setToLastBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.lastBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.lastBlock, e, t), !0) : !1, this.setToPreviousBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.previousBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.previousBlock, e, t), !0) : !1, this.setToNextBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.nextBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.nextBlock, e, t), !0) : !1, this.setToBlock = (e, t = this.Editor.Caret.positions.DEFAULT, n = 0) => {
      const r = lp(e, this.Editor);
      return r === void 0 ? !1 : (this.Editor.Caret.setToBlock(r, t, n), !0);
    }, this.focus = (e = !1) => e ? this.setToLastBlock(this.Editor.Caret.positions.END) : this.setToFirstBlock(this.Editor.Caret.positions.START);
  }
  /**
   * Available methods
   *
   * @returns {Caret}
   */
  get methods() {
    return {
      setToFirstBlock: this.setToFirstBlock,
      setToLastBlock: this.setToLastBlock,
      setToPreviousBlock: this.setToPreviousBlock,
      setToNextBlock: this.setToNextBlock,
      setToBlock: this.setToBlock,
      focus: this.focus
    };
  }
}
class dp extends P {
  /**
   * Available methods
   *
   * @returns {Events}
   */
  get methods() {
    return {
      emit: (e, t) => this.emit(e, t),
      off: (e, t) => this.off(e, t),
      on: (e, t) => this.on(e, t)
    };
  }
  /**
   * Subscribe on Events
   *
   * @param {string} eventName - event name to subscribe
   * @param {Function} callback - event handler
   */
  on(e, t) {
    this.eventsDispatcher.on(e, t);
  }
  /**
   * Emit event with data
   *
   * @param {string} eventName - event to emit
   * @param {object} data - event's data
   */
  emit(e, t) {
    this.eventsDispatcher.emit(e, t);
  }
  /**
   * Unsubscribe from Event
   *
   * @param {string} eventName - event to unsubscribe
   * @param {Function} callback - event handler
   */
  off(e, t) {
    this.eventsDispatcher.off(e, t);
  }
}
class ir extends P {
  /**
   * Return namespace section for tool or block tune
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  static getNamespace(e, t) {
    return t ? `blockTunes.${e}` : `tools.${e}`;
  }
  /**
   * Return I18n API methods with global dictionary access
   */
  get methods() {
    return {
      t: () => {
        be("I18n.t() method can be accessed only from Tools", "warn");
      }
    };
  }
  /**
   * Return I18n API methods with tool namespaced dictionary
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  getMethodsForTool(e, t) {
    return Object.assign(
      this.methods,
      {
        t: (n) => ce.t(ir.getNamespace(e, t), n)
      }
    );
  }
}
class up extends P {
  /**
   * Editor.js Core API modules
   */
  get methods() {
    return {
      blocks: this.Editor.BlocksAPI.methods,
      caret: this.Editor.CaretAPI.methods,
      tools: this.Editor.ToolsAPI.methods,
      events: this.Editor.EventsAPI.methods,
      listeners: this.Editor.ListenersAPI.methods,
      notifier: this.Editor.NotifierAPI.methods,
      sanitizer: this.Editor.SanitizerAPI.methods,
      saver: this.Editor.SaverAPI.methods,
      selection: this.Editor.SelectionAPI.methods,
      styles: this.Editor.StylesAPI.classes,
      toolbar: this.Editor.ToolbarAPI.methods,
      inlineToolbar: this.Editor.InlineToolbarAPI.methods,
      tooltip: this.Editor.TooltipAPI.methods,
      i18n: this.Editor.I18nAPI.methods,
      readOnly: this.Editor.ReadOnlyAPI.methods,
      ui: this.Editor.UiAPI.methods
    };
  }
  /**
   * Returns Editor.js Core API methods for passed tool
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  getMethodsForTool(e, t) {
    return Object.assign(
      this.methods,
      {
        i18n: this.Editor.I18nAPI.getMethodsForTool(e, t)
      }
    );
  }
}
class hp extends P {
  /**
   * Available methods
   *
   * @returns {InlineToolbar}
   */
  get methods() {
    return {
      close: () => this.close(),
      open: () => this.open()
    };
  }
  /**
   * Open Inline Toolbar
   */
  open() {
    this.Editor.InlineToolbar.tryToShow();
  }
  /**
   * Close Inline Toolbar
   */
  close() {
    this.Editor.InlineToolbar.close();
  }
}
class pp extends P {
  /**
   * Available methods
   *
   * @returns {Listeners}
   */
  get methods() {
    return {
      on: (e, t, n, r) => this.on(e, t, n, r),
      off: (e, t, n, r) => this.off(e, t, n, r),
      offById: (e) => this.offById(e)
    };
  }
  /**
   * Ads a DOM event listener. Return it's id.
   *
   * @param {HTMLElement} element - Element to set handler to
   * @param {string} eventType - event type
   * @param {() => void} handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  on(e, t, n, r) {
    return this.listeners.on(e, t, n, r);
  }
  /**
   * Removes DOM listener from element
   *
   * @param {Element} element - Element to remove handler from
   * @param eventType - event type
   * @param handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  off(e, t, n, r) {
    this.listeners.off(e, t, n, r);
  }
  /**
   * Removes DOM listener by the listener id
   *
   * @param id - id of the listener to remove
   */
  offById(e) {
    this.listeners.offById(e);
  }
}
var na = { exports: {} };
(function(o, e) {
  (function(t, n) {
    o.exports = n();
  })(window, function() {
    return function(t) {
      var n = {};
      function r(i) {
        if (n[i])
          return n[i].exports;
        var s = n[i] = { i, l: !1, exports: {} };
        return t[i].call(s.exports, s, s.exports, r), s.l = !0, s.exports;
      }
      return r.m = t, r.c = n, r.d = function(i, s, a) {
        r.o(i, s) || Object.defineProperty(i, s, { enumerable: !0, get: a });
      }, r.r = function(i) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(i, "__esModule", { value: !0 });
      }, r.t = function(i, s) {
        if (1 & s && (i = r(i)), 8 & s || 4 & s && typeof i == "object" && i && i.__esModule)
          return i;
        var a = /* @__PURE__ */ Object.create(null);
        if (r.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: i }), 2 & s && typeof i != "string")
          for (var l in i)
            r.d(a, l, (function(c) {
              return i[c];
            }).bind(null, l));
        return a;
      }, r.n = function(i) {
        var s = i && i.__esModule ? function() {
          return i.default;
        } : function() {
          return i;
        };
        return r.d(s, "a", s), s;
      }, r.o = function(i, s) {
        return Object.prototype.hasOwnProperty.call(i, s);
      }, r.p = "/", r(r.s = 0);
    }([function(t, n, r) {
      r(1), /*!
      * Codex JavaScript Notification module
      * https://github.com/codex-team/js-notifier
      */
      t.exports = function() {
        var i = r(6), s = "cdx-notify--bounce-in", a = null;
        return { show: function(l) {
          if (l.message) {
            (function() {
              if (a)
                return !0;
              a = i.getWrapper(), document.body.appendChild(a);
            })();
            var c = null, d = l.time || 8e3;
            switch (l.type) {
              case "confirm":
                c = i.confirm(l);
                break;
              case "prompt":
                c = i.prompt(l);
                break;
              default:
                c = i.alert(l), window.setTimeout(function() {
                  c.remove();
                }, d);
            }
            a.appendChild(c), c.classList.add(s);
          }
        } };
      }();
    }, function(t, n, r) {
      var i = r(2);
      typeof i == "string" && (i = [[t.i, i, ""]]);
      var s = { hmr: !0, transform: void 0, insertInto: void 0 };
      r(4)(i, s), i.locals && (t.exports = i.locals);
    }, function(t, n, r) {
      (t.exports = r(3)(!1)).push([t.i, `.cdx-notify--error{background:#fffbfb!important}.cdx-notify--error::before{background:#fb5d5d!important}.cdx-notify__input{max-width:130px;padding:5px 10px;background:#f7f7f7;border:0;border-radius:3px;font-size:13px;color:#656b7c;outline:0}.cdx-notify__input:-ms-input-placeholder{color:#656b7c}.cdx-notify__input::placeholder{color:#656b7c}.cdx-notify__input:focus:-ms-input-placeholder{color:rgba(101,107,124,.3)}.cdx-notify__input:focus::placeholder{color:rgba(101,107,124,.3)}.cdx-notify__button{border:none;border-radius:3px;font-size:13px;padding:5px 10px;cursor:pointer}.cdx-notify__button:last-child{margin-left:10px}.cdx-notify__button--cancel{background:#f2f5f7;box-shadow:0 2px 1px 0 rgba(16,19,29,0);color:#656b7c}.cdx-notify__button--cancel:hover{background:#eee}.cdx-notify__button--confirm{background:#34c992;box-shadow:0 1px 1px 0 rgba(18,49,35,.05);color:#fff}.cdx-notify__button--confirm:hover{background:#33b082}.cdx-notify__btns-wrapper{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;margin-top:5px}.cdx-notify__cross{position:absolute;top:5px;right:5px;width:10px;height:10px;padding:5px;opacity:.54;cursor:pointer}.cdx-notify__cross::after,.cdx-notify__cross::before{content:'';position:absolute;left:9px;top:5px;height:12px;width:2px;background:#575d67}.cdx-notify__cross::before{transform:rotate(-45deg)}.cdx-notify__cross::after{transform:rotate(45deg)}.cdx-notify__cross:hover{opacity:1}.cdx-notifies{position:fixed;z-index:2;bottom:20px;left:20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif}.cdx-notify{position:relative;width:220px;margin-top:15px;padding:13px 16px;background:#fff;box-shadow:0 11px 17px 0 rgba(23,32,61,.13);border-radius:5px;font-size:14px;line-height:1.4em;word-wrap:break-word}.cdx-notify::before{content:'';position:absolute;display:block;top:0;left:0;width:3px;height:calc(100% - 6px);margin:3px;border-radius:5px;background:0 0}@keyframes bounceIn{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1)}}.cdx-notify--bounce-in{animation-name:bounceIn;animation-duration:.6s;animation-iteration-count:1}.cdx-notify--success{background:#fafffe!important}.cdx-notify--success::before{background:#41ffb1!important}`, ""]);
    }, function(t, n) {
      t.exports = function(r) {
        var i = [];
        return i.toString = function() {
          return this.map(function(s) {
            var a = function(l, c) {
              var d = l[1] || "", u = l[3];
              if (!u)
                return d;
              if (c && typeof btoa == "function") {
                var h = (f = u, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(f)))) + " */"), g = u.sources.map(function(b) {
                  return "/*# sourceURL=" + u.sourceRoot + b + " */";
                });
                return [d].concat(g).concat([h]).join(`
`);
              }
              var f;
              return [d].join(`
`);
            }(s, r);
            return s[2] ? "@media " + s[2] + "{" + a + "}" : a;
          }).join("");
        }, i.i = function(s, a) {
          typeof s == "string" && (s = [[null, s, ""]]);
          for (var l = {}, c = 0; c < this.length; c++) {
            var d = this[c][0];
            typeof d == "number" && (l[d] = !0);
          }
          for (c = 0; c < s.length; c++) {
            var u = s[c];
            typeof u[0] == "number" && l[u[0]] || (a && !u[2] ? u[2] = a : a && (u[2] = "(" + u[2] + ") and (" + a + ")"), i.push(u));
          }
        }, i;
      };
    }, function(t, n, r) {
      var i, s, a = {}, l = (i = function() {
        return window && document && document.all && !window.atob;
      }, function() {
        return s === void 0 && (s = i.apply(this, arguments)), s;
      }), c = /* @__PURE__ */ function(w) {
        var v = {};
        return function(T) {
          if (typeof T == "function")
            return T();
          if (v[T] === void 0) {
            var I = (function(S) {
              return document.querySelector(S);
            }).call(this, T);
            if (window.HTMLIFrameElement && I instanceof window.HTMLIFrameElement)
              try {
                I = I.contentDocument.head;
              } catch {
                I = null;
              }
            v[T] = I;
          }
          return v[T];
        };
      }(), d = null, u = 0, h = [], g = r(5);
      function f(w, v) {
        for (var T = 0; T < w.length; T++) {
          var I = w[T], S = a[I.id];
          if (S) {
            S.refs++;
            for (var O = 0; O < S.parts.length; O++)
              S.parts[O](I.parts[O]);
            for (; O < I.parts.length; O++)
              S.parts.push(E(I.parts[O], v));
          } else {
            var U = [];
            for (O = 0; O < I.parts.length; O++)
              U.push(E(I.parts[O], v));
            a[I.id] = { id: I.id, refs: 1, parts: U };
          }
        }
      }
      function b(w, v) {
        for (var T = [], I = {}, S = 0; S < w.length; S++) {
          var O = w[S], U = v.base ? O[0] + v.base : O[0], $ = { css: O[1], media: O[2], sourceMap: O[3] };
          I[U] ? I[U].parts.push($) : T.push(I[U] = { id: U, parts: [$] });
        }
        return T;
      }
      function N(w, v) {
        var T = c(w.insertInto);
        if (!T)
          throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var I = h[h.length - 1];
        if (w.insertAt === "top")
          I ? I.nextSibling ? T.insertBefore(v, I.nextSibling) : T.appendChild(v) : T.insertBefore(v, T.firstChild), h.push(v);
        else if (w.insertAt === "bottom")
          T.appendChild(v);
        else {
          if (typeof w.insertAt != "object" || !w.insertAt.before)
            throw new Error(`[Style Loader]

 Invalid value for parameter 'insertAt' ('options.insertAt') found.
 Must be 'top', 'bottom', or Object.
 (https://github.com/webpack-contrib/style-loader#insertat)
`);
          var S = c(w.insertInto + " " + w.insertAt.before);
          T.insertBefore(v, S);
        }
      }
      function M(w) {
        if (w.parentNode === null)
          return !1;
        w.parentNode.removeChild(w);
        var v = h.indexOf(w);
        v >= 0 && h.splice(v, 1);
      }
      function _(w) {
        var v = document.createElement("style");
        return w.attrs.type === void 0 && (w.attrs.type = "text/css"), H(v, w.attrs), N(w, v), v;
      }
      function H(w, v) {
        Object.keys(v).forEach(function(T) {
          w.setAttribute(T, v[T]);
        });
      }
      function E(w, v) {
        var T, I, S, O;
        if (v.transform && w.css) {
          if (!(O = v.transform(w.css)))
            return function() {
            };
          w.css = O;
        }
        if (v.singleton) {
          var U = u++;
          T = d || (d = _(v)), I = ne.bind(null, T, U, !1), S = ne.bind(null, T, U, !0);
        } else
          w.sourceMap && typeof URL == "function" && typeof URL.createObjectURL == "function" && typeof URL.revokeObjectURL == "function" && typeof Blob == "function" && typeof btoa == "function" ? (T = function($) {
            var re = document.createElement("link");
            return $.attrs.type === void 0 && ($.attrs.type = "text/css"), $.attrs.rel = "stylesheet", H(re, $.attrs), N($, re), re;
          }(v), I = (function($, re, bt) {
            var We = bt.css, No = bt.sourceMap, al = re.convertToAbsoluteUrls === void 0 && No;
            (re.convertToAbsoluteUrls || al) && (We = g(We)), No && (We += `
/*# sourceMappingURL=data:application/json;base64,` + btoa(unescape(encodeURIComponent(JSON.stringify(No)))) + " */");
            var ll = new Blob([We], { type: "text/css" }), ui = $.href;
            $.href = URL.createObjectURL(ll), ui && URL.revokeObjectURL(ui);
          }).bind(null, T, v), S = function() {
            M(T), T.href && URL.revokeObjectURL(T.href);
          }) : (T = _(v), I = (function($, re) {
            var bt = re.css, We = re.media;
            if (We && $.setAttribute("media", We), $.styleSheet)
              $.styleSheet.cssText = bt;
            else {
              for (; $.firstChild; )
                $.removeChild($.firstChild);
              $.appendChild(document.createTextNode(bt));
            }
          }).bind(null, T), S = function() {
            M(T);
          });
        return I(w), function($) {
          if ($) {
            if ($.css === w.css && $.media === w.media && $.sourceMap === w.sourceMap)
              return;
            I(w = $);
          } else
            S();
        };
      }
      t.exports = function(w, v) {
        if (typeof DEBUG < "u" && DEBUG && typeof document != "object")
          throw new Error("The style-loader cannot be used in a non-browser environment");
        (v = v || {}).attrs = typeof v.attrs == "object" ? v.attrs : {}, v.singleton || typeof v.singleton == "boolean" || (v.singleton = l()), v.insertInto || (v.insertInto = "head"), v.insertAt || (v.insertAt = "bottom");
        var T = b(w, v);
        return f(T, v), function(I) {
          for (var S = [], O = 0; O < T.length; O++) {
            var U = T[O];
            ($ = a[U.id]).refs--, S.push($);
          }
          for (I && f(b(I, v), v), O = 0; O < S.length; O++) {
            var $;
            if (($ = S[O]).refs === 0) {
              for (var re = 0; re < $.parts.length; re++)
                $.parts[re]();
              delete a[$.id];
            }
          }
        };
      };
      var C, G = (C = [], function(w, v) {
        return C[w] = v, C.filter(Boolean).join(`
`);
      });
      function ne(w, v, T, I) {
        var S = T ? "" : I.css;
        if (w.styleSheet)
          w.styleSheet.cssText = G(v, S);
        else {
          var O = document.createTextNode(S), U = w.childNodes;
          U[v] && w.removeChild(U[v]), U.length ? w.insertBefore(O, U[v]) : w.appendChild(O);
        }
      }
    }, function(t, n) {
      t.exports = function(r) {
        var i = typeof window < "u" && window.location;
        if (!i)
          throw new Error("fixUrls requires window.location");
        if (!r || typeof r != "string")
          return r;
        var s = i.protocol + "//" + i.host, a = s + i.pathname.replace(/\/[^\/]*$/, "/");
        return r.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(l, c) {
          var d, u = c.trim().replace(/^"(.*)"$/, function(h, g) {
            return g;
          }).replace(/^'(.*)'$/, function(h, g) {
            return g;
          });
          return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(u) ? l : (d = u.indexOf("//") === 0 ? u : u.indexOf("/") === 0 ? s + u : a + u.replace(/^\.\//, ""), "url(" + JSON.stringify(d) + ")");
        });
      };
    }, function(t, n, r) {
      var i, s, a, l, c, d, u, h, g;
      t.exports = (i = "cdx-notifies", s = "cdx-notify", a = "cdx-notify__cross", l = "cdx-notify__button--confirm", c = "cdx-notify__button--cancel", d = "cdx-notify__input", u = "cdx-notify__button", h = "cdx-notify__btns-wrapper", { alert: g = function(f) {
        var b = document.createElement("DIV"), N = document.createElement("DIV"), M = f.message, _ = f.style;
        return b.classList.add(s), _ && b.classList.add(s + "--" + _), b.innerHTML = M, N.classList.add(a), N.addEventListener("click", b.remove.bind(b)), b.appendChild(N), b;
      }, confirm: function(f) {
        var b = g(f), N = document.createElement("div"), M = document.createElement("button"), _ = document.createElement("button"), H = b.querySelector("." + a), E = f.cancelHandler, C = f.okHandler;
        return N.classList.add(h), M.innerHTML = f.okText || "Confirm", _.innerHTML = f.cancelText || "Cancel", M.classList.add(u), _.classList.add(u), M.classList.add(l), _.classList.add(c), E && typeof E == "function" && (_.addEventListener("click", E), H.addEventListener("click", E)), C && typeof C == "function" && M.addEventListener("click", C), M.addEventListener("click", b.remove.bind(b)), _.addEventListener("click", b.remove.bind(b)), N.appendChild(M), N.appendChild(_), b.appendChild(N), b;
      }, prompt: function(f) {
        var b = g(f), N = document.createElement("div"), M = document.createElement("button"), _ = document.createElement("input"), H = b.querySelector("." + a), E = f.cancelHandler, C = f.okHandler;
        return N.classList.add(h), M.innerHTML = f.okText || "Ok", M.classList.add(u), M.classList.add(l), _.classList.add(d), f.placeholder && _.setAttribute("placeholder", f.placeholder), f.default && (_.value = f.default), f.inputType && (_.type = f.inputType), E && typeof E == "function" && H.addEventListener("click", E), C && typeof C == "function" && M.addEventListener("click", function() {
          C(_.value);
        }), M.addEventListener("click", b.remove.bind(b)), N.appendChild(_), N.appendChild(M), b.appendChild(N), b;
      }, getWrapper: function() {
        var f = document.createElement("DIV");
        return f.classList.add(i), f;
      } });
    }]);
  });
})(na);
var fp = na.exports;
const gp = /* @__PURE__ */ To(fp);
class mp {
  /**
   * Show web notification
   *
   * @param {NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions} options - notification options
   */
  show(e) {
    gp.show(e);
  }
}
class bp extends P {
  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.notifier = new mp();
  }
  /**
   * Available methods
   */
  get methods() {
    return {
      show: (e) => this.show(e)
    };
  }
  /**
   * Show notification
   *
   * @param {NotifierOptions} options - message option
   */
  show(e) {
    return this.notifier.show(e);
  }
}
class vp extends P {
  /**
   * Available methods
   */
  get methods() {
    const e = () => this.isEnabled;
    return {
      toggle: (t) => this.toggle(t),
      get isEnabled() {
        return e();
      }
    };
  }
  /**
   * Set or toggle read-only state
   *
   * @param {boolean|undefined} state - set or toggle state
   * @returns {boolean} current value
   */
  toggle(e) {
    return this.Editor.ReadOnly.toggle(e);
  }
  /**
   * Returns current read-only state
   */
  get isEnabled() {
    return this.Editor.ReadOnly.isEnabled;
  }
}
var ra = { exports: {} };
(function(o, e) {
  (function(t, n) {
    o.exports = n();
  })(At, function() {
    function t(u) {
      var h = u.tags, g = Object.keys(h), f = g.map(function(b) {
        return typeof h[b];
      }).every(function(b) {
        return b === "object" || b === "boolean" || b === "function";
      });
      if (!f)
        throw new Error("The configuration was invalid");
      this.config = u;
    }
    var n = ["P", "LI", "TD", "TH", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "PRE"];
    function r(u) {
      return n.indexOf(u.nodeName) !== -1;
    }
    var i = ["A", "B", "STRONG", "I", "EM", "SUB", "SUP", "U", "STRIKE"];
    function s(u) {
      return i.indexOf(u.nodeName) !== -1;
    }
    t.prototype.clean = function(u) {
      const h = document.implementation.createHTMLDocument(), g = h.createElement("div");
      return g.innerHTML = u, this._sanitize(h, g), g.innerHTML;
    }, t.prototype._sanitize = function(u, h) {
      var g = a(u, h), f = g.firstChild();
      if (f)
        do {
          if (f.nodeType === Node.TEXT_NODE)
            if (f.data.trim() === "" && (f.previousElementSibling && r(f.previousElementSibling) || f.nextElementSibling && r(f.nextElementSibling))) {
              h.removeChild(f), this._sanitize(u, h);
              break;
            } else
              continue;
          if (f.nodeType === Node.COMMENT_NODE) {
            h.removeChild(f), this._sanitize(u, h);
            break;
          }
          var b = s(f), N;
          b && (N = Array.prototype.some.call(f.childNodes, r));
          var M = !!h.parentNode, _ = r(h) && r(f) && M, H = f.nodeName.toLowerCase(), E = l(this.config, H, f), C = b && N;
          if (C || c(f, E) || !this.config.keepNestedBlockElements && _) {
            if (!(f.nodeName === "SCRIPT" || f.nodeName === "STYLE"))
              for (; f.childNodes.length > 0; )
                h.insertBefore(f.childNodes[0], f);
            h.removeChild(f), this._sanitize(u, h);
            break;
          }
          for (var G = 0; G < f.attributes.length; G += 1) {
            var ne = f.attributes[G];
            d(ne, E, f) && (f.removeAttribute(ne.name), G = G - 1);
          }
          this._sanitize(u, f);
        } while (f = g.nextSibling());
    };
    function a(u, h) {
      return u.createTreeWalker(
        h,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
        null,
        !1
      );
    }
    function l(u, h, g) {
      return typeof u.tags[h] == "function" ? u.tags[h](g) : u.tags[h];
    }
    function c(u, h) {
      return typeof h > "u" ? !0 : typeof h == "boolean" ? !h : !1;
    }
    function d(u, h, g) {
      var f = u.name.toLowerCase();
      return h === !0 ? !1 : typeof h[f] == "function" ? !h[f](u.value, g) : typeof h[f] > "u" || h[f] === !1 ? !0 : typeof h[f] == "string" ? h[f] !== u.value : !1;
    }
    return t;
  });
})(ra);
var yp = ra.exports;
const kp = /* @__PURE__ */ To(yp);
function sr(o, e) {
  return o.map((t) => {
    const n = W(e) ? e(t.tool) : e;
    return ye(n) || (t.data = ar(t.data, n)), t;
  });
}
function xe(o, e = {}) {
  const t = {
    tags: e
  };
  return new kp(t).clean(o);
}
function ar(o, e) {
  return Array.isArray(o) ? wp(o, e) : oe(o) ? xp(o, e) : Le(o) ? Cp(o, e) : o;
}
function wp(o, e) {
  return o.map((t) => ar(t, e));
}
function xp(o, e) {
  const t = {};
  for (const n in o) {
    if (!Object.prototype.hasOwnProperty.call(o, n))
      continue;
    const r = o[n], i = Ep(e[n]) ? e[n] : e;
    t[n] = ar(r, i);
  }
  return t;
}
function Cp(o, e) {
  return oe(e) ? xe(o, e) : e === !1 ? xe(o, {}) : o;
}
function Ep(o) {
  return oe(o) || Uh(o) || W(o);
}
class Sp extends P {
  /**
   * Available methods
   *
   * @returns {SanitizerConfig}
   */
  get methods() {
    return {
      clean: (e, t) => this.clean(e, t)
    };
  }
  /**
   * Perform sanitizing of a string
   *
   * @param {string} taintString - what to sanitize
   * @param {SanitizerConfig} config - sanitizer config
   * @returns {string}
   */
  clean(e, t) {
    return xe(e, t);
  }
}
class Tp extends P {
  /**
   * Available methods
   *
   * @returns {Saver}
   */
  get methods() {
    return {
      save: () => this.save()
    };
  }
  /**
   * Return Editor's data
   *
   * @returns {OutputData}
   */
  save() {
    const e = "Editor's content can not be saved in read-only mode";
    return this.Editor.ReadOnly.isEnabled ? (be(e, "warn"), Promise.reject(new Error(e))) : this.Editor.Saver.save();
  }
}
class Bp extends P {
  constructor() {
    super(...arguments), this.selectionUtils = new x();
  }
  /**
   * Available methods
   *
   * @returns {SelectionAPIInterface}
   */
  get methods() {
    return {
      findParentTag: (e, t) => this.findParentTag(e, t),
      expandToTag: (e) => this.expandToTag(e),
      save: () => this.selectionUtils.save(),
      restore: () => this.selectionUtils.restore(),
      setFakeBackground: () => this.selectionUtils.setFakeBackground(),
      removeFakeBackground: () => this.selectionUtils.removeFakeBackground()
    };
  }
  /**
   * Looks ahead from selection and find passed tag with class name
   *
   * @param {string} tagName - tag to find
   * @param {string} className - tag's class name
   * @returns {HTMLElement|null}
   */
  findParentTag(e, t) {
    return this.selectionUtils.findParentTag(e, t);
  }
  /**
   * Expand selection to passed tag
   *
   * @param {HTMLElement} node - tag that should contain selection
   */
  expandToTag(e) {
    this.selectionUtils.expandToTag(e);
  }
}
class _p extends P {
  /**
   * Available methods
   */
  get methods() {
    return {
      getBlockTools: () => Array.from(this.Editor.Tools.blockTools.values())
    };
  }
}
class Op extends P {
  /**
   * Exported classes
   */
  get classes() {
    return {
      /**
       * Base Block styles
       */
      block: "cdx-block",
      /**
       * Inline Tools styles
       */
      inlineToolButton: "ce-inline-tool",
      inlineToolButtonActive: "ce-inline-tool--active",
      /**
       * UI elements
       */
      input: "cdx-input",
      loader: "cdx-loader",
      button: "cdx-button",
      /**
       * Settings styles
       */
      settingsButton: "cdx-settings-button",
      settingsButtonActive: "cdx-settings-button--active"
    };
  }
}
class Mp extends P {
  /**
   * Available methods
   *
   * @returns {Toolbar}
   */
  get methods() {
    return {
      close: () => this.close(),
      open: () => this.open(),
      toggleBlockSettings: (e) => this.toggleBlockSettings(e),
      toggleToolbox: (e) => this.toggleToolbox(e)
    };
  }
  /**
   * Open toolbar
   */
  open() {
    this.Editor.Toolbar.moveAndOpen();
  }
  /**
   * Close toolbar and all included elements
   */
  close() {
    this.Editor.Toolbar.close();
  }
  /**
   * Toggles Block Setting of the current block
   *
   * @param {boolean} openingState —  opening state of Block Setting
   */
  toggleBlockSettings(e) {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      be("Could't toggle the Toolbar because there is no block selected ", "warn");
      return;
    }
    e ?? !this.Editor.BlockSettings.opened ? (this.Editor.Toolbar.moveAndOpen(), this.Editor.BlockSettings.open()) : this.Editor.BlockSettings.close();
  }
  /**
   * Open toolbox
   *
   * @param {boolean} openingState - Opening state of toolbox
   */
  toggleToolbox(e) {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      be("Could't toggle the Toolbox because there is no block selected ", "warn");
      return;
    }
    e ?? !this.Editor.Toolbar.toolbox.opened ? (this.Editor.Toolbar.moveAndOpen(), this.Editor.Toolbar.toolbox.open()) : this.Editor.Toolbar.toolbox.close();
  }
}
var ia = { exports: {} };
/*!
 * CodeX.Tooltips
 * 
 * @version 1.0.5
 * 
 * @licence MIT
 * @author CodeX <https://codex.so>
 * 
 * 
 */
(function(o, e) {
  (function(t, n) {
    o.exports = n();
  })(window, function() {
    return function(t) {
      var n = {};
      function r(i) {
        if (n[i])
          return n[i].exports;
        var s = n[i] = { i, l: !1, exports: {} };
        return t[i].call(s.exports, s, s.exports, r), s.l = !0, s.exports;
      }
      return r.m = t, r.c = n, r.d = function(i, s, a) {
        r.o(i, s) || Object.defineProperty(i, s, { enumerable: !0, get: a });
      }, r.r = function(i) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(i, "__esModule", { value: !0 });
      }, r.t = function(i, s) {
        if (1 & s && (i = r(i)), 8 & s || 4 & s && typeof i == "object" && i && i.__esModule)
          return i;
        var a = /* @__PURE__ */ Object.create(null);
        if (r.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: i }), 2 & s && typeof i != "string")
          for (var l in i)
            r.d(a, l, (function(c) {
              return i[c];
            }).bind(null, l));
        return a;
      }, r.n = function(i) {
        var s = i && i.__esModule ? function() {
          return i.default;
        } : function() {
          return i;
        };
        return r.d(s, "a", s), s;
      }, r.o = function(i, s) {
        return Object.prototype.hasOwnProperty.call(i, s);
      }, r.p = "", r(r.s = 0);
    }([function(t, n, r) {
      t.exports = r(1);
    }, function(t, n, r) {
      r.r(n), r.d(n, "default", function() {
        return i;
      });
      class i {
        constructor() {
          this.nodes = { wrapper: null, content: null }, this.showed = !1, this.offsetTop = 10, this.offsetLeft = 10, this.offsetRight = 10, this.hidingDelay = 0, this.handleWindowScroll = () => {
            this.showed && this.hide(!0);
          }, this.loadStyles(), this.prepare(), window.addEventListener("scroll", this.handleWindowScroll, { passive: !0 });
        }
        get CSS() {
          return { tooltip: "ct", tooltipContent: "ct__content", tooltipShown: "ct--shown", placement: { left: "ct--left", bottom: "ct--bottom", right: "ct--right", top: "ct--top" } };
        }
        show(a, l, c) {
          this.nodes.wrapper || this.prepare(), this.hidingTimeout && clearTimeout(this.hidingTimeout);
          const d = Object.assign({ placement: "bottom", marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, delay: 70, hidingDelay: 0 }, c);
          if (d.hidingDelay && (this.hidingDelay = d.hidingDelay), this.nodes.content.innerHTML = "", typeof l == "string")
            this.nodes.content.appendChild(document.createTextNode(l));
          else {
            if (!(l instanceof Node))
              throw Error("[CodeX Tooltip] Wrong type of «content» passed. It should be an instance of Node or String. But " + typeof l + " given.");
            this.nodes.content.appendChild(l);
          }
          switch (this.nodes.wrapper.classList.remove(...Object.values(this.CSS.placement)), d.placement) {
            case "top":
              this.placeTop(a, d);
              break;
            case "left":
              this.placeLeft(a, d);
              break;
            case "right":
              this.placeRight(a, d);
              break;
            case "bottom":
            default:
              this.placeBottom(a, d);
          }
          d && d.delay ? this.showingTimeout = setTimeout(() => {
            this.nodes.wrapper.classList.add(this.CSS.tooltipShown), this.showed = !0;
          }, d.delay) : (this.nodes.wrapper.classList.add(this.CSS.tooltipShown), this.showed = !0);
        }
        hide(a = !1) {
          if (this.hidingDelay && !a)
            return this.hidingTimeout && clearTimeout(this.hidingTimeout), void (this.hidingTimeout = setTimeout(() => {
              this.hide(!0);
            }, this.hidingDelay));
          this.nodes.wrapper.classList.remove(this.CSS.tooltipShown), this.showed = !1, this.showingTimeout && clearTimeout(this.showingTimeout);
        }
        onHover(a, l, c) {
          a.addEventListener("mouseenter", () => {
            this.show(a, l, c);
          }), a.addEventListener("mouseleave", () => {
            this.hide();
          });
        }
        destroy() {
          this.nodes.wrapper.remove(), window.removeEventListener("scroll", this.handleWindowScroll);
        }
        prepare() {
          this.nodes.wrapper = this.make("div", this.CSS.tooltip), this.nodes.content = this.make("div", this.CSS.tooltipContent), this.append(this.nodes.wrapper, this.nodes.content), this.append(document.body, this.nodes.wrapper);
        }
        loadStyles() {
          const a = "codex-tooltips-style";
          if (document.getElementById(a))
            return;
          const l = r(2), c = this.make("style", null, { textContent: l.toString(), id: a });
          this.prepend(document.head, c);
        }
        placeBottom(a, l) {
          const c = a.getBoundingClientRect(), d = c.left + a.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2, u = c.bottom + window.pageYOffset + this.offsetTop + l.marginTop;
          this.applyPlacement("bottom", d, u);
        }
        placeTop(a, l) {
          const c = a.getBoundingClientRect(), d = c.left + a.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2, u = c.top + window.pageYOffset - this.nodes.wrapper.clientHeight - this.offsetTop;
          this.applyPlacement("top", d, u);
        }
        placeLeft(a, l) {
          const c = a.getBoundingClientRect(), d = c.left - this.nodes.wrapper.offsetWidth - this.offsetLeft - l.marginLeft, u = c.top + window.pageYOffset + a.clientHeight / 2 - this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("left", d, u);
        }
        placeRight(a, l) {
          const c = a.getBoundingClientRect(), d = c.right + this.offsetRight + l.marginRight, u = c.top + window.pageYOffset + a.clientHeight / 2 - this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("right", d, u);
        }
        applyPlacement(a, l, c) {
          this.nodes.wrapper.classList.add(this.CSS.placement[a]), this.nodes.wrapper.style.left = l + "px", this.nodes.wrapper.style.top = c + "px";
        }
        make(a, l = null, c = {}) {
          const d = document.createElement(a);
          Array.isArray(l) ? d.classList.add(...l) : l && d.classList.add(l);
          for (const u in c)
            c.hasOwnProperty(u) && (d[u] = c[u]);
          return d;
        }
        append(a, l) {
          Array.isArray(l) ? l.forEach((c) => a.appendChild(c)) : a.appendChild(l);
        }
        prepend(a, l) {
          Array.isArray(l) ? (l = l.reverse()).forEach((c) => a.prepend(c)) : a.prepend(l);
        }
      }
    }, function(t, n) {
      t.exports = `.ct{z-index:999;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1),-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);will-change:opacity,top,left;-webkit-box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);border-radius:9px}.ct,.ct:before{position:absolute;top:0;left:0}.ct:before{content:"";bottom:0;right:0;background-color:#1d202b;z-index:-1;border-radius:4px}@supports(-webkit-mask-box-image:url("")){.ct:before{border-radius:0;-webkit-mask-box-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10.71 0h2.58c3.02 0 4.64.42 6.1 1.2a8.18 8.18 0 013.4 3.4C23.6 6.07 24 7.7 24 10.71v2.58c0 3.02-.42 4.64-1.2 6.1a8.18 8.18 0 01-3.4 3.4c-1.47.8-3.1 1.21-6.11 1.21H10.7c-3.02 0-4.64-.42-6.1-1.2a8.18 8.18 0 01-3.4-3.4C.4 17.93 0 16.3 0 13.29V10.7c0-3.02.42-4.64 1.2-6.1a8.18 8.18 0 013.4-3.4C6.07.4 7.7 0 10.71 0z"/></svg>') 48% 41% 37.9% 53.3%}}@media (--mobile){.ct{display:none}}.ct__content{padding:6px 10px;color:#cdd1e0;font-size:12px;text-align:center;letter-spacing:.02em;line-height:1em}.ct:after{content:"";width:8px;height:8px;position:absolute;background-color:#1d202b;z-index:-1}.ct--bottom{-webkit-transform:translateY(5px);transform:translateY(5px)}.ct--bottom:after{top:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--top{-webkit-transform:translateY(-5px);transform:translateY(-5px)}.ct--top:after{top:auto;bottom:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--left{-webkit-transform:translateX(-5px);transform:translateX(-5px)}.ct--left:after{top:50%;left:auto;right:0;-webkit-transform:translate(41.6%,-50%) rotate(-45deg);transform:translate(41.6%,-50%) rotate(-45deg)}.ct--right{-webkit-transform:translateX(5px);transform:translateX(5px)}.ct--right:after{top:50%;left:0;-webkit-transform:translate(-41.6%,-50%) rotate(-45deg);transform:translate(-41.6%,-50%) rotate(-45deg)}.ct--shown{opacity:1;-webkit-transform:none;transform:none}`;
    }]).default;
  });
})(ia);
var Ip = ia.exports;
const Lp = /* @__PURE__ */ To(Ip);
let ke = null;
function lr() {
  ke || (ke = new Lp());
}
function Ap(o, e, t) {
  lr(), ke == null || ke.show(o, e, t);
}
function ho(o = !1) {
  lr(), ke == null || ke.hide(o);
}
function po(o, e, t) {
  lr(), ke == null || ke.onHover(o, e, t);
}
function Pp() {
  ke == null || ke.destroy(), ke = null;
}
class Np extends P {
  /**
   * @class
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    });
  }
  /**
   * Available methods
   */
  get methods() {
    return {
      show: (e, t, n) => this.show(e, t, n),
      hide: () => this.hide(),
      onHover: (e, t, n) => this.onHover(e, t, n)
    };
  }
  /**
   * Method show tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  show(e, t, n) {
    Ap(e, t, n);
  }
  /**
   * Method hides tooltip on HTML page
   */
  hide() {
    ho();
  }
  /**
   * Decorator for showing Tooltip by mouseenter/mouseleave
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  onHover(e, t, n) {
    po(e, t, n);
  }
}
class $p extends P {
  /**
   * Available methods / getters
   */
  get methods() {
    return {
      nodes: this.editorNodes
      /**
       * There can be added some UI methods, like toggleThinMode() etc
       */
    };
  }
  /**
   * Exported classes
   */
  get editorNodes() {
    return {
      /**
       * Top-level editor instance wrapper
       */
      wrapper: this.Editor.UI.nodes.wrapper,
      /**
       * Element that holds all the Blocks
       */
      redactor: this.Editor.UI.nodes.redactor
    };
  }
}
function sa(o, e) {
  const t = {};
  return Object.entries(o).forEach(([n, r]) => {
    if (oe(r)) {
      const i = e ? `${e}.${n}` : n;
      Object.values(r).every((s) => Le(s)) ? t[n] = i : t[n] = sa(r, i);
      return;
    }
    t[n] = r;
  }), t;
}
const me = sa(Xs);
function jp(o, e) {
  const t = {};
  return Object.keys(o).forEach((n) => {
    const r = e[n];
    r !== void 0 ? t[r] = o[n] : t[n] = o[n];
  }), t;
}
const aa = class St {
  /**
   * @param {HTMLElement[]} nodeList — the list of iterable HTML-items
   * @param {string} focusedCssClass - user-provided CSS-class that will be set in flipping process
   */
  constructor(e, t) {
    this.cursor = -1, this.items = [], this.items = e || [], this.focusedCssClass = t;
  }
  /**
   * Returns Focused button Node
   *
   * @returns {HTMLElement}
   */
  get currentItem() {
    return this.cursor === -1 ? null : this.items[this.cursor];
  }
  /**
   * Sets cursor to specified position
   *
   * @param cursorPosition - new cursor position
   */
  setCursor(e) {
    e < this.items.length && e >= -1 && (this.dropCursor(), this.cursor = e, this.items[this.cursor].classList.add(this.focusedCssClass));
  }
  /**
   * Sets items. Can be used when iterable items changed dynamically
   *
   * @param {HTMLElement[]} nodeList - nodes to iterate
   */
  setItems(e) {
    this.items = e;
  }
  /**
   * Sets cursor next to the current
   */
  next() {
    this.cursor = this.leafNodesAndReturnIndex(St.directions.RIGHT);
  }
  /**
   * Sets cursor before current
   */
  previous() {
    this.cursor = this.leafNodesAndReturnIndex(St.directions.LEFT);
  }
  /**
   * Sets cursor to the default position and removes CSS-class from previously focused item
   */
  dropCursor() {
    this.cursor !== -1 && (this.items[this.cursor].classList.remove(this.focusedCssClass), this.cursor = -1);
  }
  /**
   * Leafs nodes inside the target list from active element
   *
   * @param {string} direction - leaf direction. Can be 'left' or 'right'
   * @returns {number} index of focused node
   */
  leafNodesAndReturnIndex(e) {
    if (this.items.length === 0)
      return this.cursor;
    let t = this.cursor;
    return t === -1 ? t = e === St.directions.RIGHT ? -1 : 0 : this.items[t].classList.remove(this.focusedCssClass), e === St.directions.RIGHT ? t = (t + 1) % this.items.length : t = (this.items.length + t - 1) % this.items.length, p.canSetCaret(this.items[t]) && lo(() => x.setCursor(this.items[t]), 50)(), this.items[t].classList.add(this.focusedCssClass), t;
  }
};
aa.directions = {
  RIGHT: "right",
  LEFT: "left"
};
let yt = aa;
class Ze {
  /**
   * @param options - different constructing settings
   */
  constructor(e) {
    this.iterator = null, this.activated = !1, this.flipCallbacks = [], this.onKeyDown = (t) => {
      if (this.isEventReadyForHandling(t))
        switch (Ze.usedKeys.includes(t.keyCode) && t.preventDefault(), t.keyCode) {
          case B.TAB:
            this.handleTabPress(t);
            break;
          case B.LEFT:
          case B.UP:
            this.flipLeft();
            break;
          case B.RIGHT:
          case B.DOWN:
            this.flipRight();
            break;
          case B.ENTER:
            this.handleEnterPress(t);
            break;
        }
    }, this.iterator = new yt(e.items, e.focusedItemClass), this.activateCallback = e.activateCallback, this.allowedKeys = e.allowedKeys || Ze.usedKeys;
  }
  /**
   * True if flipper is currently activated
   */
  get isActivated() {
    return this.activated;
  }
  /**
   * Array of keys (codes) that is handled by Flipper
   * Used to:
   *  - preventDefault only for this keys, not all keydowns (@see constructor)
   *  - to skip external behaviours only for these keys, when filler is activated (@see BlockEvents@arrowRightAndDown)
   */
  static get usedKeys() {
    return [
      B.TAB,
      B.LEFT,
      B.RIGHT,
      B.ENTER,
      B.UP,
      B.DOWN
    ];
  }
  /**
   * Active tab/arrows handling by flipper
   *
   * @param items - Some modules (like, InlineToolbar, BlockSettings) might refresh buttons dynamically
   * @param cursorPosition - index of the item that should be focused once flipper is activated
   */
  activate(e, t) {
    this.activated = !0, e && this.iterator.setItems(e), t !== void 0 && this.iterator.setCursor(t), document.addEventListener("keydown", this.onKeyDown, !0);
  }
  /**
   * Disable tab/arrows handling by flipper
   */
  deactivate() {
    this.activated = !1, this.dropCursor(), document.removeEventListener("keydown", this.onKeyDown);
  }
  /**
   * Focus first item
   */
  focusFirst() {
    this.dropCursor(), this.flipRight();
  }
  /**
   * Focuses previous flipper iterator item
   */
  flipLeft() {
    this.iterator.previous(), this.flipCallback();
  }
  /**
   * Focuses next flipper iterator item
   */
  flipRight() {
    this.iterator.next(), this.flipCallback();
  }
  /**
   * Return true if some button is focused
   */
  hasFocus() {
    return !!this.iterator.currentItem;
  }
  /**
   * Registeres function that should be executed on each navigation action
   *
   * @param cb - function to execute
   */
  onFlip(e) {
    this.flipCallbacks.push(e);
  }
  /**
   * Unregisteres function that is executed on each navigation action
   *
   * @param cb - function to stop executing
   */
  removeOnFlip(e) {
    this.flipCallbacks = this.flipCallbacks.filter((t) => t !== e);
  }
  /**
   * Drops flipper's iterator cursor
   *
   * @see DomIterator#dropCursor
   */
  dropCursor() {
    this.iterator.dropCursor();
  }
  /**
   * This function is fired before handling flipper keycodes
   * The result of this function defines if it is need to be handled or not
   *
   * @param {KeyboardEvent} event - keydown keyboard event
   * @returns {boolean}
   */
  isEventReadyForHandling(e) {
    return this.activated && this.allowedKeys.includes(e.keyCode);
  }
  /**
   * When flipper is activated tab press will leaf the items
   *
   * @param {KeyboardEvent} event - tab keydown event
   */
  handleTabPress(e) {
    switch (e.shiftKey ? yt.directions.LEFT : yt.directions.RIGHT) {
      case yt.directions.RIGHT:
        this.flipRight();
        break;
      case yt.directions.LEFT:
        this.flipLeft();
        break;
    }
  }
  /**
   * Enter press will click current item if flipper is activated
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  handleEnterPress(e) {
    this.activated && (this.iterator.currentItem && (e.stopPropagation(), e.preventDefault(), this.iterator.currentItem.click()), W(this.activateCallback) && this.activateCallback(this.iterator.currentItem));
  }
  /**
   * Fired after flipping in any direction
   */
  flipCallback() {
    this.iterator.currentItem && this.iterator.currentItem.scrollIntoViewIfNeeded(), this.flipCallbacks.forEach((e) => e());
  }
}
const Rp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 12L9 7.1C9 7.04477 9.04477 7 9.1 7H10.4C11.5 7 14 7.1 14 9.5C14 9.5 14 12 11 12M9 12V16.8C9 16.9105 9.08954 17 9.2 17H12.5C14 17 15 16 15 14.5C15 11.7046 11 12 11 12M9 12H11"/></svg>', Dp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 10L11.8586 14.8586C11.9367 14.9367 12.0633 14.9367 12.1414 14.8586L17 10"/></svg>', Hp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.5 17.5L9.64142 12.6414C9.56331 12.5633 9.56331 12.4367 9.64142 12.3586L14.5 7.5"/></svg>', Fp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9.58284 17.5L14.4414 12.6414C14.5195 12.5633 14.5195 12.4367 14.4414 12.3586L9.58284 7.5"/></svg>', zp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 15L11.8586 10.1414C11.9367 10.0633 12.0633 10.0633 12.1414 10.1414L17 15"/></svg>', Up = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>', Wp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/></svg>', qp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13.34 10C12.4223 12.7337 11 17 11 17"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.21 7H14.2"/></svg>', Fi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72"/></svg>', Kp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.40999 7.29999H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 7.29999H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.30999 12H9.3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 12H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.40999 16.7H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 16.7H14.59"/></svg>', Vp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>', la = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M11.5 17.5L5 11M5 11V15.5M5 11H9.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12.5 6.5L19 13M19 13V8.5M19 13H14.5"/></svg>', Yp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" stroke-width="2"/><line x1="15.4142" x2="19" y1="15" y2="18.5858" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>', Xp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M15.7795 11.5C15.7795 11.5 16.053 11.1962 16.5497 10.6722C17.4442 9.72856 17.4701 8.2475 16.5781 7.30145V7.30145C15.6482 6.31522 14.0873 6.29227 13.1288 7.25073L11.8796 8.49999"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8.24517 12.3883C8.24517 12.3883 7.97171 12.6922 7.47504 13.2161C6.58051 14.1598 6.55467 15.6408 7.44666 16.5869V16.5869C8.37653 17.5731 9.93744 17.5961 10.8959 16.6376L12.1452 15.3883"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M17.7802 15.1032L16.597 14.9422C16.0109 14.8624 15.4841 15.3059 15.4627 15.8969L15.4199 17.0818"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6.39064 9.03238L7.58432 9.06668C8.17551 9.08366 8.6522 8.58665 8.61056 7.99669L8.5271 6.81397"/><line x1="12.1142" x2="11.7" y1="12.2" y2="11.7858" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>', Gp = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/><line x1="12" x2="12" y1="9" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 15.02V15.01"/></svg>', Zp = "__", Jp = "--";
function Ue(o) {
  return (e, t) => [[o, e].filter((n) => !!n).join(Zp), t].filter((n) => !!n).join(Jp);
}
const kt = Ue("ce-hint"), wt = {
  root: kt(),
  alignedStart: kt(null, "align-left"),
  alignedCenter: kt(null, "align-center"),
  title: kt("title"),
  description: kt("description")
};
class Qp {
  /**
   * Constructs the hint content instance
   *
   * @param params - hint content parameters
   */
  constructor(e) {
    this.nodes = {
      root: p.make("div", [wt.root, e.alignment === "center" ? wt.alignedCenter : wt.alignedStart]),
      title: p.make("div", wt.title, { textContent: e.title })
    }, this.nodes.root.appendChild(this.nodes.title), e.description !== void 0 && (this.nodes.description = p.make("div", wt.description, { textContent: e.description }), this.nodes.root.appendChild(this.nodes.description));
  }
  /**
   * Returns the root element of the hint content
   */
  getElement() {
    return this.nodes.root;
  }
}
class cr {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(e) {
    this.params = e;
  }
  /**
   * Item name if exists
   */
  get name() {
    if (this.params !== void 0 && "name" in this.params)
      return this.params.name;
  }
  /**
   * Destroys the instance
   */
  destroy() {
    ho();
  }
  /**
   * Called when children popover is opened (if exists)
   */
  onChildrenOpen() {
    var e;
    this.params !== void 0 && "children" in this.params && typeof ((e = this.params.children) == null ? void 0 : e.onOpen) == "function" && this.params.children.onOpen();
  }
  /**
   * Called when children popover is closed (if exists)
   */
  onChildrenClose() {
    var e;
    this.params !== void 0 && "children" in this.params && typeof ((e = this.params.children) == null ? void 0 : e.onClose) == "function" && this.params.children.onClose();
  }
  /**
   * Called on popover item click
   */
  handleClick() {
    var e, t;
    this.params !== void 0 && "onActivate" in this.params && ((t = (e = this.params).onActivate) == null || t.call(e, this.params));
  }
  /**
   * Adds hint to the item element if hint data is provided
   *
   * @param itemElement - popover item root element to add hint to
   * @param hintData - hint data
   */
  addHint(e, t) {
    const n = new Qp(t);
    po(e, n.getElement(), {
      placement: t.position,
      hidingDelay: 100
    });
  }
  /**
   * Returns item children that are represented as popover items
   */
  get children() {
    var e;
    return this.params !== void 0 && "children" in this.params && ((e = this.params.children) == null ? void 0 : e.items) !== void 0 ? this.params.children.items : [];
  }
  /**
   * Returns true if item has any type of children
   */
  get hasChildren() {
    return this.children.length > 0;
  }
  /**
   * Returns true if item children should be open instantly after popover is opened and not on item click/hover
   */
  get isChildrenOpen() {
    var e;
    return this.params !== void 0 && "children" in this.params && ((e = this.params.children) == null ? void 0 : e.isOpen) === !0;
  }
  /**
   * True if item children items should be navigatable via keyboard
   */
  get isChildrenFlippable() {
    var e;
    return !(this.params === void 0 || !("children" in this.params) || ((e = this.params.children) == null ? void 0 : e.isFlippable) === !1);
  }
  /**
   * Returns true if item has children that should be searchable
   */
  get isChildrenSearchable() {
    var e;
    return this.params !== void 0 && "children" in this.params && ((e = this.params.children) == null ? void 0 : e.searchable) === !0;
  }
  /**
   * True if popover should close once item is activated
   */
  get closeOnActivate() {
    return this.params !== void 0 && "closeOnActivate" in this.params && this.params.closeOnActivate;
  }
  /**
   * True if item is active
   */
  get isActive() {
    return this.params === void 0 || !("isActive" in this.params) ? !1 : typeof this.params.isActive == "function" ? this.params.isActive() : this.params.isActive === !0;
  }
}
const he = Ue("ce-popover-item"), K = {
  container: he(),
  active: he(null, "active"),
  disabled: he(null, "disabled"),
  focused: he(null, "focused"),
  hidden: he(null, "hidden"),
  confirmationState: he(null, "confirmation"),
  noHover: he(null, "no-hover"),
  noFocus: he(null, "no-focus"),
  title: he("title"),
  secondaryTitle: he("secondary-title"),
  icon: he("icon"),
  iconTool: he("icon", "tool"),
  iconChevronRight: he("icon", "chevron-right"),
  wobbleAnimation: Ue("wobble")()
};
class Ke extends cr {
  /**
   * Constructs popover item instance
   *
   * @param params - popover item construction params
   * @param renderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t) {
    super(e), this.params = e, this.nodes = {
      root: null,
      icon: null
    }, this.confirmationState = null, this.removeSpecialFocusBehavior = () => {
      var n;
      (n = this.nodes.root) == null || n.classList.remove(K.noFocus);
    }, this.removeSpecialHoverBehavior = () => {
      var n;
      (n = this.nodes.root) == null || n.classList.remove(K.noHover);
    }, this.onErrorAnimationEnd = () => {
      var n, r;
      (n = this.nodes.icon) == null || n.classList.remove(K.wobbleAnimation), (r = this.nodes.icon) == null || r.removeEventListener("animationend", this.onErrorAnimationEnd);
    }, this.nodes.root = this.make(e, t);
  }
  /**
   * True if item is disabled and hence not clickable
   */
  get isDisabled() {
    return this.params.isDisabled === !0;
  }
  /**
   * Exposes popover item toggle parameter
   */
  get toggle() {
    return this.params.toggle;
  }
  /**
   * Item title
   */
  get title() {
    return this.params.title;
  }
  /**
   * True if confirmation state is enabled for popover item
   */
  get isConfirmationStateEnabled() {
    return this.confirmationState !== null;
  }
  /**
   * True if item is focused in keyboard navigation process
   */
  get isFocused() {
    return this.nodes.root === null ? !1 : this.nodes.root.classList.contains(K.focused);
  }
  /**
   * Returns popover item root element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Called on popover item click
   */
  handleClick() {
    if (this.isConfirmationStateEnabled && this.confirmationState !== null) {
      this.activateOrEnableConfirmationMode(this.confirmationState);
      return;
    }
    this.activateOrEnableConfirmationMode(this.params);
  }
  /**
   * Toggles item active state
   *
   * @param isActive - true if item should strictly should become active
   */
  toggleActive(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(K.active, e);
  }
  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  toggleHidden(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(K.hidden, e);
  }
  /**
   * Resets popover item to its original state
   */
  reset() {
    this.isConfirmationStateEnabled && this.disableConfirmationMode();
  }
  /**
   * Method called once item becomes focused during keyboard navigation
   */
  onFocus() {
    this.disableSpecialHoverAndFocusBehavior();
  }
  /**
   * Constructs HTML element corresponding to popover item params
   *
   * @param params - item construction params
   * @param renderParams - popover item render params
   */
  make(e, t) {
    var n, r;
    const i = (t == null ? void 0 : t.wrapperTag) || "div", s = p.make(i, K.container, {
      type: i === "button" ? "button" : void 0
    });
    return e.name && (s.dataset.itemName = e.name), this.nodes.icon = p.make("div", [K.icon, K.iconTool], {
      innerHTML: e.icon || Wp
    }), s.appendChild(this.nodes.icon), e.title !== void 0 && s.appendChild(p.make("div", K.title, {
      innerHTML: e.title || ""
    })), e.secondaryLabel && s.appendChild(p.make("div", K.secondaryTitle, {
      textContent: e.secondaryLabel
    })), this.hasChildren && s.appendChild(p.make("div", [K.icon, K.iconChevronRight], {
      innerHTML: Fp
    })), this.isActive && s.classList.add(K.active), e.isDisabled && s.classList.add(K.disabled), e.hint !== void 0 && ((n = t == null ? void 0 : t.hint) == null ? void 0 : n.enabled) !== !1 && this.addHint(s, {
      ...e.hint,
      position: ((r = t == null ? void 0 : t.hint) == null ? void 0 : r.position) || "right"
    }), s;
  }
  /**
   * Activates confirmation mode for the item.
   *
   * @param newState - new popover item params that should be applied
   */
  enableConfirmationMode(e) {
    if (this.nodes.root === null)
      return;
    const t = {
      ...this.params,
      ...e,
      confirmation: "confirmation" in e ? e.confirmation : void 0
    }, n = this.make(t);
    this.nodes.root.innerHTML = n.innerHTML, this.nodes.root.classList.add(K.confirmationState), this.confirmationState = e, this.enableSpecialHoverAndFocusBehavior();
  }
  /**
   * Returns item to its original state
   */
  disableConfirmationMode() {
    if (this.nodes.root === null)
      return;
    const e = this.make(this.params);
    this.nodes.root.innerHTML = e.innerHTML, this.nodes.root.classList.remove(K.confirmationState), this.confirmationState = null, this.disableSpecialHoverAndFocusBehavior();
  }
  /**
   * Enables special focus and hover behavior for item in confirmation state.
   * This is needed to prevent item from being highlighted as hovered/focused just after click.
   */
  enableSpecialHoverAndFocusBehavior() {
    var e, t, n;
    (e = this.nodes.root) == null || e.classList.add(K.noHover), (t = this.nodes.root) == null || t.classList.add(K.noFocus), (n = this.nodes.root) == null || n.addEventListener("mouseleave", this.removeSpecialHoverBehavior, { once: !0 });
  }
  /**
   * Disables special focus and hover behavior
   */
  disableSpecialHoverAndFocusBehavior() {
    var e;
    this.removeSpecialFocusBehavior(), this.removeSpecialHoverBehavior(), (e = this.nodes.root) == null || e.removeEventListener("mouseleave", this.removeSpecialHoverBehavior);
  }
  /**
   * Executes item's onActivate callback if the item has no confirmation configured
   *
   * @param item - item to activate or bring to confirmation mode
   */
  activateOrEnableConfirmationMode(e) {
    var t;
    if (!("confirmation" in e) || e.confirmation === void 0)
      try {
        (t = e.onActivate) == null || t.call(e, e), this.disableConfirmationMode();
      } catch {
        this.animateError();
      }
    else
      this.enableConfirmationMode(e.confirmation);
  }
  /**
   * Animates item which symbolizes that error occured while executing 'onActivate()' callback
   */
  animateError() {
    var e, t, n;
    (e = this.nodes.icon) != null && e.classList.contains(K.wobbleAnimation) || ((t = this.nodes.icon) == null || t.classList.add(K.wobbleAnimation), (n = this.nodes.icon) == null || n.addEventListener("animationend", this.onErrorAnimationEnd));
  }
}
const Uo = Ue("ce-popover-item-separator"), Wo = {
  container: Uo(),
  line: Uo("line"),
  hidden: Uo(null, "hidden")
};
class ca extends cr {
  /**
   * Constructs the instance
   */
  constructor() {
    super(), this.nodes = {
      root: p.make("div", Wo.container),
      line: p.make("div", Wo.line)
    }, this.nodes.root.appendChild(this.nodes.line);
  }
  /**
   * Returns popover separator root element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  toggleHidden(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(Wo.hidden, e);
  }
}
var Ee = /* @__PURE__ */ ((o) => (o.Closed = "closed", o.ClosedOnActivate = "closed-on-activate", o))(Ee || {});
const le = Ue("ce-popover"), Y = {
  popover: le(),
  popoverContainer: le("container"),
  popoverOpenTop: le(null, "open-top"),
  popoverOpenLeft: le(null, "open-left"),
  popoverOpened: le(null, "opened"),
  search: le("search"),
  nothingFoundMessage: le("nothing-found-message"),
  nothingFoundMessageDisplayed: le("nothing-found-message", "displayed"),
  items: le("items"),
  overlay: le("overlay"),
  overlayHidden: le("overlay", "hidden"),
  popoverNested: le(null, "nested"),
  getPopoverNestedClass: (o) => le(null, `nested-level-${o.toString()}`),
  popoverInline: le(null, "inline"),
  popoverHeader: le("header")
};
var ut = /* @__PURE__ */ ((o) => (o.NestingLevel = "--nesting-level", o.PopoverHeight = "--popover-height", o.InlinePopoverWidth = "--inline-popover-width", o.TriggerItemLeft = "--trigger-item-left", o.TriggerItemTop = "--trigger-item-top", o))(ut || {});
const zi = Ue("ce-popover-item-html"), Ui = {
  root: zi(),
  hidden: zi(null, "hidden")
};
class Nt extends cr {
  /**
   * Constructs the instance
   *
   * @param params – instance parameters
   * @param renderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t) {
    var n, r;
    super(e), this.nodes = {
      root: p.make("div", Ui.root)
    }, this.nodes.root.appendChild(e.element), e.name && (this.nodes.root.dataset.itemName = e.name), e.hint !== void 0 && ((n = t == null ? void 0 : t.hint) == null ? void 0 : n.enabled) !== !1 && this.addHint(this.nodes.root, {
      ...e.hint,
      position: ((r = t == null ? void 0 : t.hint) == null ? void 0 : r.position) || "right"
    });
  }
  /**
   * Returns popover item root element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  toggleHidden(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(Ui.hidden, e);
  }
  /**
   * Returns list of buttons and inputs inside custom content
   */
  getControls() {
    const e = this.nodes.root.querySelectorAll(
      `button, ${p.allInputsSelector}`
    );
    return Array.from(e);
  }
}
class da extends Dt {
  /**
   * Constructs the instance
   *
   * @param params - popover construction params
   * @param itemsRenderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t = {}) {
    super(), this.params = e, this.itemsRenderParams = t, this.listeners = new Ht(), this.messages = {
      nothingFound: "Nothing found",
      search: "Search"
    }, this.items = this.buildItems(e.items), e.messages && (this.messages = {
      ...this.messages,
      ...e.messages
    }), this.nodes = {}, this.nodes.popoverContainer = p.make("div", [Y.popoverContainer]), this.nodes.nothingFoundMessage = p.make("div", [Y.nothingFoundMessage], {
      textContent: this.messages.nothingFound
    }), this.nodes.popoverContainer.appendChild(this.nodes.nothingFoundMessage), this.nodes.items = p.make("div", [Y.items]), this.items.forEach((n) => {
      const r = n.getElement();
      r !== null && this.nodes.items.appendChild(r);
    }), this.nodes.popoverContainer.appendChild(this.nodes.items), this.listeners.on(this.nodes.popoverContainer, "click", (n) => this.handleClick(n)), this.nodes.popover = p.make("div", [
      Y.popover,
      this.params.class
    ]), this.nodes.popover.appendChild(this.nodes.popoverContainer);
  }
  /**
   * List of default popover items that are searchable and may have confirmation state
   */
  get itemsDefault() {
    return this.items.filter((e) => e instanceof Ke);
  }
  /**
   * Returns HTML element corresponding to the popover
   */
  getElement() {
    return this.nodes.popover;
  }
  /**
   * Open popover
   */
  show() {
    this.nodes.popover.classList.add(Y.popoverOpened), this.search !== void 0 && this.search.focus();
  }
  /**
   * Closes popover
   */
  hide() {
    this.nodes.popover.classList.remove(Y.popoverOpened), this.nodes.popover.classList.remove(Y.popoverOpenTop), this.itemsDefault.forEach((e) => e.reset()), this.search !== void 0 && this.search.clear(), this.emit(Ee.Closed);
  }
  /**
   * Clears memory
   */
  destroy() {
    var e;
    this.items.forEach((t) => t.destroy()), this.nodes.popover.remove(), this.listeners.removeAll(), (e = this.search) == null || e.destroy();
  }
  /**
   * Looks for the item by name and imitates click on it
   *
   * @param name - name of the item to activate
   */
  activateItemByName(e) {
    const t = this.items.find((n) => n.name === e);
    this.handleItemClick(t);
  }
  /**
   * Factory method for creating popover items
   *
   * @param items - list of items params
   */
  buildItems(e) {
    return e.map((t) => {
      switch (t.type) {
        case z.Separator:
          return new ca();
        case z.Html:
          return new Nt(t, this.itemsRenderParams[z.Html]);
        default:
          return new Ke(t, this.itemsRenderParams[z.Default]);
      }
    });
  }
  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  getTargetItem(e) {
    return this.items.filter((t) => t instanceof Ke || t instanceof Nt).find((t) => {
      const n = t.getElement();
      return n === null ? !1 : e.composedPath().includes(n);
    });
  }
  /**
   * Handles popover item click
   *
   * @param item - item to handle click of
   */
  handleItemClick(e) {
    if (!("isDisabled" in e && e.isDisabled)) {
      if (e.hasChildren) {
        this.showNestedItems(e), "handleClick" in e && typeof e.handleClick == "function" && e.handleClick();
        return;
      }
      this.itemsDefault.filter((t) => t !== e).forEach((t) => t.reset()), "handleClick" in e && typeof e.handleClick == "function" && e.handleClick(), this.toggleItemActivenessIfNeeded(e), e.closeOnActivate && (this.hide(), this.emit(Ee.ClosedOnActivate));
    }
  }
  /**
   * Handles clicks inside popover
   *
   * @param event - item to handle click of
   */
  handleClick(e) {
    const t = this.getTargetItem(e);
    t !== void 0 && this.handleItemClick(t);
  }
  /**
   * - Toggles item active state, if clicked popover item has property 'toggle' set to true.
   *
   * - Performs radiobutton-like behavior if the item has property 'toggle' set to string key.
   * (All the other items with the same key get inactive, and the item gets active)
   *
   * @param clickedItem - popover item that was clicked
   */
  toggleItemActivenessIfNeeded(e) {
    if (e instanceof Ke && (e.toggle === !0 && e.toggleActive(), typeof e.toggle == "string")) {
      const t = this.itemsDefault.filter((n) => n.toggle === e.toggle);
      if (t.length === 1) {
        e.toggleActive();
        return;
      }
      t.forEach((n) => {
        n.toggleActive(n === e);
      });
    }
  }
}
var fo = /* @__PURE__ */ ((o) => (o.Search = "search", o))(fo || {});
const qo = Ue("cdx-search-field"), Ko = {
  wrapper: qo(),
  icon: qo("icon"),
  input: qo("input")
};
class ef extends Dt {
  /**
   * @param options - available config
   * @param options.items - searchable items list
   * @param options.placeholder - input placeholder
   */
  constructor({ items: e, placeholder: t }) {
    super(), this.listeners = new Ht(), this.items = e, this.wrapper = p.make("div", Ko.wrapper);
    const n = p.make("div", Ko.icon, {
      innerHTML: Yp
    });
    this.input = p.make("input", Ko.input, {
      placeholder: t,
      /**
       * Used to prevent focusing on the input by Tab key
       * (Popover in the Toolbar lays below the blocks,
       * so Tab in the last block will focus this hidden input if this property is not set)
       */
      tabIndex: -1
    }), this.wrapper.appendChild(n), this.wrapper.appendChild(this.input), this.listeners.on(this.input, "input", () => {
      this.searchQuery = this.input.value, this.emit(fo.Search, {
        query: this.searchQuery,
        items: this.foundItems
      });
    });
  }
  /**
   * Returns search field element
   */
  getElement() {
    return this.wrapper;
  }
  /**
   * Sets focus to the input
   */
  focus() {
    this.input.focus();
  }
  /**
   * Clears search query and results
   */
  clear() {
    this.input.value = "", this.searchQuery = "", this.emit(fo.Search, {
      query: "",
      items: this.foundItems
    });
  }
  /**
   * Clears memory
   */
  destroy() {
    this.listeners.removeAll();
  }
  /**
   * Returns list of found items for the current search query
   */
  get foundItems() {
    return this.items.filter((e) => this.checkItem(e));
  }
  /**
   * Contains logic for checking whether passed item conforms the search query
   *
   * @param item - item to be checked
   */
  checkItem(e) {
    var t, n;
    const r = ((t = e.title) == null ? void 0 : t.toLowerCase()) || "", i = (n = this.searchQuery) == null ? void 0 : n.toLowerCase();
    return i !== void 0 ? r.includes(i) : !1;
  }
}
var tf = Object.defineProperty, of = Object.getOwnPropertyDescriptor, nf = (o, e, t, n) => {
  for (var r = of(e, t), i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (r = s(e, t, r) || r);
  return r && tf(e, t, r), r;
};
const ua = class ha extends da {
  /**
   * Construct the instance
   *
   * @param params - popover params
   * @param itemsRenderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t) {
    super(e, t), this.nestingLevel = 0, this.nestedPopoverTriggerItem = null, this.previouslyHoveredItem = null, this.scopeElement = document.body, this.hide = () => {
      var n;
      super.hide(), this.destroyNestedPopoverIfExists(), (n = this.flipper) == null || n.deactivate(), this.previouslyHoveredItem = null;
    }, this.onFlip = () => {
      const n = this.itemsDefault.find((r) => r.isFocused);
      n == null || n.onFocus();
    }, this.onSearch = (n) => {
      var r;
      const i = n.query === "", s = n.items.length === 0;
      this.items.forEach((l) => {
        let c = !1;
        l instanceof Ke ? c = !n.items.includes(l) : (l instanceof ca || l instanceof Nt) && (c = s || !i), l.toggleHidden(c);
      }), this.toggleNothingFoundMessage(s);
      const a = n.query === "" ? this.flippableElements : n.items.map((l) => l.getElement());
      (r = this.flipper) != null && r.isActivated && (this.flipper.deactivate(), this.flipper.activate(a));
    }, e.nestingLevel !== void 0 && (this.nestingLevel = e.nestingLevel), this.nestingLevel > 0 && this.nodes.popover.classList.add(Y.popoverNested), e.scopeElement !== void 0 && (this.scopeElement = e.scopeElement), this.nodes.popoverContainer !== null && this.listeners.on(this.nodes.popoverContainer, "mouseover", (n) => this.handleHover(n)), e.searchable && this.addSearch(), e.flippable !== !1 && (this.flipper = new Ze({
      items: this.flippableElements,
      focusedItemClass: K.focused,
      allowedKeys: [
        B.TAB,
        B.UP,
        B.DOWN,
        B.ENTER
      ]
    }), this.flipper.onFlip(this.onFlip));
  }
  /**
   * Returns true if some item inside popover is focused
   */
  hasFocus() {
    return this.flipper === void 0 ? !1 : this.flipper.hasFocus();
  }
  /**
   * Scroll position inside items container of the popover
   */
  get scrollTop() {
    return this.nodes.items === null ? 0 : this.nodes.items.scrollTop;
  }
  /**
   * Returns visible element offset top
   */
  get offsetTop() {
    return this.nodes.popoverContainer === null ? 0 : this.nodes.popoverContainer.offsetTop;
  }
  /**
   * Open popover
   */
  show() {
    var e;
    this.nodes.popover.style.setProperty(ut.PopoverHeight, this.size.height + "px"), this.shouldOpenBottom || this.nodes.popover.classList.add(Y.popoverOpenTop), this.shouldOpenRight || this.nodes.popover.classList.add(Y.popoverOpenLeft), super.show(), (e = this.flipper) == null || e.activate(this.flippableElements);
  }
  /**
   * Clears memory
   */
  destroy() {
    this.hide(), super.destroy();
  }
  /**
   * Handles displaying nested items for the item.
   *
   * @param item – item to show nested popover for
   */
  showNestedItems(e) {
    this.nestedPopover !== null && this.nestedPopover !== void 0 || (this.nestedPopoverTriggerItem = e, this.showNestedPopoverForItem(e));
  }
  /**
   * Handles hover events inside popover items container
   *
   * @param event - hover event data
   */
  handleHover(e) {
    const t = this.getTargetItem(e);
    t !== void 0 && this.previouslyHoveredItem !== t && (this.destroyNestedPopoverIfExists(), this.previouslyHoveredItem = t, t.hasChildren && this.showNestedPopoverForItem(t));
  }
  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used for correct positioning of the nested popover
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  setTriggerItemPosition(e, t) {
    const n = t.getElement(), r = (n ? n.offsetTop : 0) - this.scrollTop, i = this.offsetTop + r;
    e.style.setProperty(ut.TriggerItemTop, i + "px");
  }
  /**
   * Destroys existing nested popover
   */
  destroyNestedPopoverIfExists() {
    var e, t;
    this.nestedPopover === void 0 || this.nestedPopover === null || (this.nestedPopover.off(Ee.ClosedOnActivate, this.hide), this.nestedPopover.hide(), this.nestedPopover.destroy(), this.nestedPopover.getElement().remove(), this.nestedPopover = null, (e = this.flipper) == null || e.activate(this.flippableElements), (t = this.nestedPopoverTriggerItem) == null || t.onChildrenClose());
  }
  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  showNestedPopoverForItem(e) {
    var t;
    this.nestedPopover = new ha({
      searchable: e.isChildrenSearchable,
      items: e.children,
      nestingLevel: this.nestingLevel + 1,
      flippable: e.isChildrenFlippable,
      messages: this.messages
    }), e.onChildrenOpen(), this.nestedPopover.on(Ee.ClosedOnActivate, this.hide);
    const n = this.nestedPopover.getElement();
    return this.nodes.popover.appendChild(n), this.setTriggerItemPosition(n, e), n.style.setProperty(ut.NestingLevel, this.nestedPopover.nestingLevel.toString()), this.nestedPopover.show(), (t = this.flipper) == null || t.deactivate(), this.nestedPopover;
  }
  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  get shouldOpenBottom() {
    if (this.nodes.popover === void 0 || this.nodes.popover === null)
      return !1;
    const e = this.nodes.popoverContainer.getBoundingClientRect(), t = this.scopeElement.getBoundingClientRect(), n = this.size.height, r = e.top + n, i = e.top - n, s = Math.min(window.innerHeight, t.bottom);
    return i < t.top || r <= s;
  }
  /**
   * Checks if popover should be opened left.
   * It should happen when there is enough space in the right or not enough space in the left
   */
  get shouldOpenRight() {
    if (this.nodes.popover === void 0 || this.nodes.popover === null)
      return !1;
    const e = this.nodes.popover.getBoundingClientRect(), t = this.scopeElement.getBoundingClientRect(), n = this.size.width, r = e.right + n, i = e.left - n, s = Math.min(window.innerWidth, t.right);
    return i < t.left || r <= s;
  }
  get size() {
    var e;
    const t = {
      height: 0,
      width: 0
    };
    if (this.nodes.popover === null)
      return t;
    const n = this.nodes.popover.cloneNode(!0);
    n.style.visibility = "hidden", n.style.position = "absolute", n.style.top = "-1000px", n.classList.add(Y.popoverOpened), (e = n.querySelector("." + Y.popoverNested)) == null || e.remove(), document.body.appendChild(n);
    const r = n.querySelector("." + Y.popoverContainer);
    return t.height = r.offsetHeight, t.width = r.offsetWidth, n.remove(), t;
  }
  /**
   * Returns list of elements available for keyboard navigation.
   */
  get flippableElements() {
    return this.items.map((e) => {
      if (e instanceof Ke)
        return e.getElement();
      if (e instanceof Nt)
        return e.getControls();
    }).flat().filter((e) => e != null);
  }
  /**
   * Adds search to the popover
   */
  addSearch() {
    this.search = new ef({
      items: this.itemsDefault,
      placeholder: this.messages.search
    }), this.search.on(fo.Search, this.onSearch);
    const e = this.search.getElement();
    e.classList.add(Y.search), this.nodes.popoverContainer.insertBefore(e, this.nodes.popoverContainer.firstChild);
  }
  /**
   * Toggles nothing found message visibility
   *
   * @param isDisplayed - true if the message should be displayed
   */
  toggleNothingFoundMessage(e) {
    this.nodes.nothingFoundMessage.classList.toggle(Y.nothingFoundMessageDisplayed, e);
  }
};
nf([
  gt
], ua.prototype, "size");
let dr = ua;
class rf extends dr {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(e) {
    const t = !mt();
    super(
      {
        ...e,
        class: Y.popoverInline
      },
      {
        [z.Default]: {
          /**
           * We use button instead of div here to fix bug associated with focus loss (which leads to selection change) on click in safari
           *
           * @todo figure out better way to solve the issue
           */
          wrapperTag: "button",
          hint: {
            position: "top",
            alignment: "center",
            enabled: t
          }
        },
        [z.Html]: {
          hint: {
            position: "top",
            alignment: "center",
            enabled: t
          }
        }
      }
    ), this.items.forEach((n) => {
      !(n instanceof Ke) && !(n instanceof Nt) || n.hasChildren && n.isChildrenOpen && this.showNestedItems(n);
    });
  }
  /**
   * Returns visible element offset top
   */
  get offsetLeft() {
    return this.nodes.popoverContainer === null ? 0 : this.nodes.popoverContainer.offsetLeft;
  }
  /**
   * Open popover
   */
  show() {
    this.nestingLevel === 0 && this.nodes.popover.style.setProperty(
      ut.InlinePopoverWidth,
      this.size.width + "px"
    ), super.show();
  }
  /**
   * Disable hover event handling.
   * Overrides parent's class behavior
   */
  handleHover() {
  }
  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used to position nested popover right below clicked item
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  setTriggerItemPosition(e, t) {
    const n = t.getElement(), r = n ? n.offsetLeft : 0, i = this.offsetLeft + r;
    e.style.setProperty(
      ut.TriggerItemLeft,
      i + "px"
    );
  }
  /**
   * Handles displaying nested items for the item.
   * Overriding in order to add toggling behaviour
   *
   * @param item – item to toggle nested popover for
   */
  showNestedItems(e) {
    if (this.nestedPopoverTriggerItem === e) {
      this.destroyNestedPopoverIfExists(), this.nestedPopoverTriggerItem = null;
      return;
    }
    super.showNestedItems(e);
  }
  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  showNestedPopoverForItem(e) {
    const t = super.showNestedPopoverForItem(e);
    return t.getElement().classList.add(Y.getPopoverNestedClass(t.nestingLevel)), t;
  }
  /**
   * Overrides default item click handling.
   * Helps to close nested popover once other item is clicked.
   *
   * @param item - clicked item
   */
  handleItemClick(e) {
    var t;
    e !== this.nestedPopoverTriggerItem && ((t = this.nestedPopoverTriggerItem) == null || t.handleClick(), super.destroyNestedPopoverIfExists()), super.handleItemClick(e);
  }
}
const pa = class Tt {
  constructor() {
    this.scrollPosition = null;
  }
  /**
   * Locks body element scroll
   */
  lock() {
    cn ? this.lockHard() : document.body.classList.add(Tt.CSS.scrollLocked);
  }
  /**
   * Unlocks body element scroll
   */
  unlock() {
    cn ? this.unlockHard() : document.body.classList.remove(Tt.CSS.scrollLocked);
  }
  /**
   * Locks scroll in a hard way (via setting fixed position to body element)
   */
  lockHard() {
    this.scrollPosition = window.pageYOffset, document.documentElement.style.setProperty(
      "--window-scroll-offset",
      `${this.scrollPosition}px`
    ), document.body.classList.add(Tt.CSS.scrollLockedHard);
  }
  /**
   * Unlocks hard scroll lock
   */
  unlockHard() {
    document.body.classList.remove(Tt.CSS.scrollLockedHard), this.scrollPosition !== null && window.scrollTo(0, this.scrollPosition), this.scrollPosition = null;
  }
};
pa.CSS = {
  scrollLocked: "ce-scroll-locked",
  scrollLockedHard: "ce-scroll-locked--hard"
};
let sf = pa;
const Vo = Ue("ce-popover-header"), Yo = {
  root: Vo(),
  text: Vo("text"),
  backButton: Vo("back-button")
};
class af {
  /**
   * Constructs the instance
   *
   * @param params - popover header params
   */
  constructor({ text: e, onBackButtonClick: t }) {
    this.listeners = new Ht(), this.text = e, this.onBackButtonClick = t, this.nodes = {
      root: p.make("div", [Yo.root]),
      backButton: p.make("button", [Yo.backButton]),
      text: p.make("div", [Yo.text])
    }, this.nodes.backButton.innerHTML = Hp, this.nodes.root.appendChild(this.nodes.backButton), this.listeners.on(this.nodes.backButton, "click", this.onBackButtonClick), this.nodes.text.innerText = this.text, this.nodes.root.appendChild(this.nodes.text);
  }
  /**
   * Returns popover header root html element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Destroys the instance
   */
  destroy() {
    this.nodes.root.remove(), this.listeners.destroy();
  }
}
class lf {
  constructor() {
    this.history = [];
  }
  /**
   * Push new popover state
   *
   * @param state - new state
   */
  push(e) {
    this.history.push(e);
  }
  /**
   * Pop last popover state
   */
  pop() {
    return this.history.pop();
  }
  /**
   * Title retrieved from the current state
   */
  get currentTitle() {
    return this.history.length === 0 ? "" : this.history[this.history.length - 1].title;
  }
  /**
   * Items list retrieved from the current state
   */
  get currentItems() {
    return this.history.length === 0 ? [] : this.history[this.history.length - 1].items;
  }
  /**
   * Returns history to initial popover state
   */
  reset() {
    for (; this.history.length > 1; )
      this.pop();
  }
}
class fa extends da {
  /**
   * Construct the instance
   *
   * @param params - popover params
   */
  constructor(e) {
    super(e, {
      [z.Default]: {
        hint: {
          enabled: !1
        }
      },
      [z.Html]: {
        hint: {
          enabled: !1
        }
      }
    }), this.scrollLocker = new sf(), this.history = new lf(), this.isHidden = !0, this.nodes.overlay = p.make("div", [Y.overlay, Y.overlayHidden]), this.nodes.popover.insertBefore(this.nodes.overlay, this.nodes.popover.firstChild), this.listeners.on(this.nodes.overlay, "click", () => {
      this.hide();
    }), this.history.push({ items: e.items });
  }
  /**
   * Open popover
   */
  show() {
    this.nodes.overlay.classList.remove(Y.overlayHidden), super.show(), this.scrollLocker.lock(), this.isHidden = !1;
  }
  /**
   * Closes popover
   */
  hide() {
    this.isHidden || (super.hide(), this.nodes.overlay.classList.add(Y.overlayHidden), this.scrollLocker.unlock(), this.history.reset(), this.isHidden = !0);
  }
  /**
   * Clears memory
   */
  destroy() {
    super.destroy(), this.scrollLocker.unlock();
  }
  /**
   * Handles displaying nested items for the item
   *
   * @param item – item to show nested popover for
   */
  showNestedItems(e) {
    this.updateItemsAndHeader(e.children, e.title), this.history.push({
      title: e.title,
      items: e.children
    });
  }
  /**
   * Removes rendered popover items and header and displays new ones
   *
   * @param items - new popover items
   * @param title - new popover header text
   */
  updateItemsAndHeader(e, t) {
    if (this.header !== null && this.header !== void 0 && (this.header.destroy(), this.header = null), t !== void 0) {
      this.header = new af({
        text: t,
        onBackButtonClick: () => {
          this.history.pop(), this.updateItemsAndHeader(this.history.currentItems, this.history.currentTitle);
        }
      });
      const n = this.header.getElement();
      n !== null && this.nodes.popoverContainer.insertBefore(n, this.nodes.popoverContainer.firstChild);
    }
    this.items.forEach((n) => {
      var r;
      return (r = n.getElement()) == null ? void 0 : r.remove();
    }), this.items = this.buildItems(e), this.items.forEach((n) => {
      var r;
      const i = n.getElement();
      i !== null && ((r = this.nodes.items) == null || r.appendChild(i));
    });
  }
}
class cf extends P {
  constructor() {
    super(...arguments), this.opened = !1, this.selection = new x(), this.popover = null, this.close = () => {
      this.opened && (this.opened = !1, x.isAtEditor || this.selection.restore(), this.selection.clearSaved(), !this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted && this.Editor.BlockManager.currentBlock && this.Editor.BlockSelection.unselectBlock(this.Editor.BlockManager.currentBlock), this.eventsDispatcher.emit(this.events.closed), this.popover && (this.popover.off(Ee.Closed, this.onPopoverClose), this.popover.destroy(), this.popover.getElement().remove(), this.popover = null));
    }, this.onPopoverClose = () => {
      this.close();
    };
  }
  /**
   * Module Events
   */
  get events() {
    return {
      opened: "block-settings-opened",
      closed: "block-settings-closed"
    };
  }
  /**
   * Block Settings CSS
   */
  get CSS() {
    return {
      settings: "ce-settings"
    };
  }
  /**
   * Getter for inner popover's flipper instance
   *
   * @todo remove once BlockSettings becomes standalone non-module class
   */
  get flipper() {
    var e;
    if (this.popover !== null)
      return "flipper" in this.popover ? (e = this.popover) == null ? void 0 : e.flipper : void 0;
  }
  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   */
  make() {
    this.nodes.wrapper = p.make("div", [this.CSS.settings]), this.nodes.wrapper.setAttribute("data-cy", "block-tunes"), this.eventsDispatcher.on(Pt, this.close);
  }
  /**
   * Destroys module
   */
  destroy() {
    this.removeAllNodes(), this.listeners.destroy(), this.eventsDispatcher.off(Pt, this.close);
  }
  /**
   * Open Block Settings pane
   *
   * @param targetBlock - near which Block we should open BlockSettings
   */
  async open(e = this.Editor.BlockManager.currentBlock) {
    var t;
    this.opened = !0, this.selection.save(), this.Editor.BlockSelection.selectBlock(e), this.Editor.BlockSelection.clearCache();
    const { toolTunes: n, commonTunes: r } = e.getTunes();
    this.eventsDispatcher.emit(this.events.opened);
    const i = mt() ? fa : dr;
    this.popover = new i({
      searchable: !0,
      items: await this.getTunesItems(e, r, n),
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: ce.ui(me.ui.popover, "Nothing found"),
        search: ce.ui(me.ui.popover, "Filter")
      }
    }), this.popover.on(Ee.Closed, this.onPopoverClose), (t = this.nodes.wrapper) == null || t.append(this.popover.getElement()), this.popover.show();
  }
  /**
   * Returns root block settings element
   */
  getElement() {
    return this.nodes.wrapper;
  }
  /**
   * Returns list of items to be displayed in block tunes menu.
   * Merges tool specific tunes, conversion menu and common tunes in one list in predefined order
   *
   * @param currentBlock –  block we are about to open block tunes for
   * @param commonTunes – common tunes
   * @param toolTunes - tool specific tunes
   */
  async getTunesItems(e, t, n) {
    const r = [];
    n !== void 0 && n.length > 0 && (r.push(...n), r.push({
      type: z.Separator
    }));
    const i = Array.from(this.Editor.Tools.blockTools.values()), s = (await oa(e, i)).reduce((a, l) => (l.toolbox.forEach((c) => {
      a.push({
        icon: c.icon,
        title: ce.t(me.toolNames, c.title),
        name: l.name,
        closeOnActivate: !0,
        onActivate: async () => {
          const { BlockManager: d, Caret: u, Toolbar: h } = this.Editor, g = await d.convert(e, l.name, c.data);
          h.close(), u.setToBlock(g, u.positions.END);
        }
      });
    }), a), []);
    return s.length > 0 && (r.push({
      icon: la,
      name: "convert-to",
      title: ce.ui(me.ui.popover, "Convert to"),
      children: {
        searchable: !0,
        items: s
      }
    }), r.push({
      type: z.Separator
    })), r.push(...t), r.map((a) => this.resolveTuneAliases(a));
  }
  /**
   * Resolves aliases in tunes menu items
   *
   * @param item - item with resolved aliases
   */
  resolveTuneAliases(e) {
    if (e.type === z.Separator || e.type === z.Html)
      return e;
    const t = jp(e, { label: "title" });
    return e.confirmation && (t.confirmation = this.resolveTuneAliases(e.confirmation)), t;
  }
}
var ga = { exports: {} };
/*!
 * Library for handling keyboard shortcuts
 * @copyright CodeX (https://codex.so)
 * @license MIT
 * @author CodeX (https://codex.so)
 * @version 1.2.0
 */
(function(o, e) {
  (function(t, n) {
    o.exports = n();
  })(window, function() {
    return function(t) {
      var n = {};
      function r(i) {
        if (n[i])
          return n[i].exports;
        var s = n[i] = { i, l: !1, exports: {} };
        return t[i].call(s.exports, s, s.exports, r), s.l = !0, s.exports;
      }
      return r.m = t, r.c = n, r.d = function(i, s, a) {
        r.o(i, s) || Object.defineProperty(i, s, { enumerable: !0, get: a });
      }, r.r = function(i) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(i, "__esModule", { value: !0 });
      }, r.t = function(i, s) {
        if (1 & s && (i = r(i)), 8 & s || 4 & s && typeof i == "object" && i && i.__esModule)
          return i;
        var a = /* @__PURE__ */ Object.create(null);
        if (r.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: i }), 2 & s && typeof i != "string")
          for (var l in i)
            r.d(a, l, (function(c) {
              return i[c];
            }).bind(null, l));
        return a;
      }, r.n = function(i) {
        var s = i && i.__esModule ? function() {
          return i.default;
        } : function() {
          return i;
        };
        return r.d(s, "a", s), s;
      }, r.o = function(i, s) {
        return Object.prototype.hasOwnProperty.call(i, s);
      }, r.p = "", r(r.s = 0);
    }([function(t, n, r) {
      function i(l, c) {
        for (var d = 0; d < c.length; d++) {
          var u = c[d];
          u.enumerable = u.enumerable || !1, u.configurable = !0, "value" in u && (u.writable = !0), Object.defineProperty(l, u.key, u);
        }
      }
      function s(l, c, d) {
        return c && i(l.prototype, c), d && i(l, d), l;
      }
      r.r(n);
      var a = function() {
        function l(c) {
          var d = this;
          (function(u, h) {
            if (!(u instanceof h))
              throw new TypeError("Cannot call a class as a function");
          })(this, l), this.commands = {}, this.keys = {}, this.name = c.name, this.parseShortcutName(c.name), this.element = c.on, this.callback = c.callback, this.executeShortcut = function(u) {
            d.execute(u);
          }, this.element.addEventListener("keydown", this.executeShortcut, !1);
        }
        return s(l, null, [{ key: "supportedCommands", get: function() {
          return { SHIFT: ["SHIFT"], CMD: ["CMD", "CONTROL", "COMMAND", "WINDOWS", "CTRL"], ALT: ["ALT", "OPTION"] };
        } }, { key: "keyCodes", get: function() {
          return { 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, BACKSPACE: 8, ENTER: 13, ESCAPE: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, INSERT: 45, DELETE: 46, ".": 190 };
        } }]), s(l, [{ key: "parseShortcutName", value: function(c) {
          c = c.split("+");
          for (var d = 0; d < c.length; d++) {
            c[d] = c[d].toUpperCase();
            var u = !1;
            for (var h in l.supportedCommands)
              if (l.supportedCommands[h].includes(c[d])) {
                u = this.commands[h] = !0;
                break;
              }
            u || (this.keys[c[d]] = !0);
          }
          for (var g in l.supportedCommands)
            this.commands[g] || (this.commands[g] = !1);
        } }, { key: "execute", value: function(c) {
          var d, u = { CMD: c.ctrlKey || c.metaKey, SHIFT: c.shiftKey, ALT: c.altKey }, h = !0;
          for (d in this.commands)
            this.commands[d] !== u[d] && (h = !1);
          var g, f = !0;
          for (g in this.keys)
            f = f && c.keyCode === l.keyCodes[g];
          h && f && this.callback(c);
        } }, { key: "remove", value: function() {
          this.element.removeEventListener("keydown", this.executeShortcut);
        } }]), l;
      }();
      n.default = a;
    }]).default;
  });
})(ga);
var df = ga.exports;
const uf = /* @__PURE__ */ To(df);
class hf {
  constructor() {
    this.registeredShortcuts = /* @__PURE__ */ new Map();
  }
  /**
   * Register shortcut
   *
   * @param shortcut - shortcut options
   */
  add(e) {
    if (this.findShortcut(e.on, e.name))
      throw Error(
        `Shortcut ${e.name} is already registered for ${e.on}. Please remove it before add a new handler.`
      );
    const t = new uf({
      name: e.name,
      on: e.on,
      callback: e.handler
    }), n = this.registeredShortcuts.get(e.on) || [];
    this.registeredShortcuts.set(e.on, [...n, t]);
  }
  /**
   * Remove shortcut
   *
   * @param element - Element shortcut is set for
   * @param name - shortcut name
   */
  remove(e, t) {
    const n = this.findShortcut(e, t);
    if (!n)
      return;
    n.remove();
    const r = this.registeredShortcuts.get(e);
    this.registeredShortcuts.set(e, r.filter((i) => i !== n));
  }
  /**
   * Get Shortcut instance if exist
   *
   * @param element - Element shorcut is set for
   * @param shortcut - shortcut name
   * @returns {number} index - shortcut index if exist
   */
  findShortcut(e, t) {
    return (this.registeredShortcuts.get(e) || []).find(({ name: n }) => n === t);
  }
}
const ht = new hf();
var pf = Object.defineProperty, ff = Object.getOwnPropertyDescriptor, ma = (o, e, t, n) => {
  for (var r = ff(e, t), i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (r = s(e, t, r) || r);
  return r && pf(e, t, r), r;
}, Xt = /* @__PURE__ */ ((o) => (o.Opened = "toolbox-opened", o.Closed = "toolbox-closed", o.BlockAdded = "toolbox-block-added", o))(Xt || {});
const ur = class ba extends Dt {
  /**
   * Toolbox constructor
   *
   * @param options - available parameters
   * @param options.api - Editor API methods
   * @param options.tools - Tools available to check whether some of them should be displayed at the Toolbox or not
   */
  constructor({ api: e, tools: t, i18nLabels: n }) {
    super(), this.opened = !1, this.listeners = new Ht(), this.popover = null, this.handleMobileLayoutToggle = () => {
      this.destroyPopover(), this.initPopover();
    }, this.onPopoverClose = () => {
      this.opened = !1, this.emit(
        "toolbox-closed"
        /* Closed */
      );
    }, this.api = e, this.tools = t, this.i18nLabels = n, this.enableShortcuts(), this.nodes = {
      toolbox: p.make("div", ba.CSS.toolbox)
    }, this.initPopover(), this.nodes.toolbox.setAttribute("data-cy", "toolbox"), this.api.events.on(Pt, this.handleMobileLayoutToggle);
  }
  /**
   * Returns True if Toolbox is Empty and nothing to show
   *
   * @returns {boolean}
   */
  get isEmpty() {
    return this.toolsToBeDisplayed.length === 0;
  }
  /**
   * CSS styles
   */
  static get CSS() {
    return {
      toolbox: "ce-toolbox"
    };
  }
  /**
   * Returns root block settings element
   */
  getElement() {
    return this.nodes.toolbox;
  }
  /**
   * Returns true if the Toolbox has the Flipper activated and the Flipper has selected button
   */
  hasFocus() {
    if (this.popover !== null)
      return "hasFocus" in this.popover ? this.popover.hasFocus() : void 0;
  }
  /**
   * Destroy Module
   */
  destroy() {
    var e;
    super.destroy(), this.nodes && this.nodes.toolbox && this.nodes.toolbox.remove(), this.removeAllShortcuts(), (e = this.popover) == null || e.off(Ee.Closed, this.onPopoverClose), this.listeners.destroy(), this.api.events.off(Pt, this.handleMobileLayoutToggle);
  }
  /**
   * Toolbox Tool's button click handler
   *
   * @param toolName - tool type to be activated
   * @param blockDataOverrides - Block data predefined by the activated Toolbox item
   */
  toolButtonActivated(e, t) {
    this.insertNewBlock(e, t);
  }
  /**
   * Open Toolbox with Tools
   */
  open() {
    var e;
    this.isEmpty || ((e = this.popover) == null || e.show(), this.opened = !0, this.emit(
      "toolbox-opened"
      /* Opened */
    ));
  }
  /**
   * Close Toolbox
   */
  close() {
    var e;
    (e = this.popover) == null || e.hide(), this.opened = !1, this.emit(
      "toolbox-closed"
      /* Closed */
    );
  }
  /**
   * Close Toolbox
   */
  toggle() {
    this.opened ? this.close() : this.open();
  }
  /**
   * Creates toolbox popover and appends it inside wrapper element
   */
  initPopover() {
    var e;
    const t = mt() ? fa : dr;
    this.popover = new t({
      scopeElement: this.api.ui.nodes.redactor,
      searchable: !0,
      messages: {
        nothingFound: this.i18nLabels.nothingFound,
        search: this.i18nLabels.filter
      },
      items: this.toolboxItemsToBeDisplayed
    }), this.popover.on(Ee.Closed, this.onPopoverClose), (e = this.nodes.toolbox) == null || e.append(this.popover.getElement());
  }
  /**
   * Destroys popover instance and removes it from DOM
   */
  destroyPopover() {
    this.popover !== null && (this.popover.hide(), this.popover.off(Ee.Closed, this.onPopoverClose), this.popover.destroy(), this.popover = null), this.nodes.toolbox !== null && (this.nodes.toolbox.innerHTML = "");
  }
  get toolsToBeDisplayed() {
    const e = [];
    return this.tools.forEach((t) => {
      t.toolbox && e.push(t);
    }), e;
  }
  get toolboxItemsToBeDisplayed() {
    const e = (t, n, r = !0) => ({
      icon: t.icon,
      title: ce.t(me.toolNames, t.title || co(n.name)),
      name: n.name,
      onActivate: () => {
        this.toolButtonActivated(n.name, t.data);
      },
      secondaryLabel: n.shortcut && r ? rr(n.shortcut) : ""
    });
    return this.toolsToBeDisplayed.reduce((t, n) => (Array.isArray(n.toolbox) ? n.toolbox.forEach((r, i) => {
      t.push(e(r, n, i === 0));
    }) : n.toolbox !== void 0 && t.push(e(n.toolbox, n)), t), []);
  }
  /**
   * Iterate all tools and enable theirs shortcuts if specified
   */
  enableShortcuts() {
    this.toolsToBeDisplayed.forEach((e) => {
      const t = e.shortcut;
      t && this.enableShortcutForTool(e.name, t);
    });
  }
  /**
   * Enable shortcut Block Tool implemented shortcut
   *
   * @param {string} toolName - Tool name
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  enableShortcutForTool(e, t) {
    ht.add({
      name: t,
      on: this.api.ui.nodes.redactor,
      handler: async (n) => {
        n.preventDefault();
        const r = this.api.blocks.getCurrentBlockIndex(), i = this.api.blocks.getBlockByIndex(r);
        if (i)
          try {
            const s = await this.api.blocks.convert(i.id, e);
            this.api.caret.setToBlock(s, "end");
            return;
          } catch {
          }
        this.insertNewBlock(e);
      }
    });
  }
  /**
   * Removes all added shortcuts
   * Fired when the Read-Only mode is activated
   */
  removeAllShortcuts() {
    this.toolsToBeDisplayed.forEach((e) => {
      const t = e.shortcut;
      t && ht.remove(this.api.ui.nodes.redactor, t);
    });
  }
  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {string} toolName - Tool name
   * @param blockDataOverrides - predefined Block data
   */
  async insertNewBlock(e, t) {
    const n = this.api.blocks.getCurrentBlockIndex(), r = this.api.blocks.getBlockByIndex(n);
    if (!r)
      return;
    const i = r.isEmpty ? n : n + 1;
    let s;
    if (t) {
      const l = await this.api.blocks.composeBlockData(e);
      s = Object.assign(l, t);
    }
    const a = this.api.blocks.insert(
      e,
      s,
      void 0,
      i,
      void 0,
      r.isEmpty
    );
    a.call(_e.APPEND_CALLBACK), this.api.caret.setToBlock(i), this.emit("toolbox-block-added", {
      block: a
    }), this.api.toolbar.close();
  }
};
ma([
  gt
], ur.prototype, "toolsToBeDisplayed");
ma([
  gt
], ur.prototype, "toolboxItemsToBeDisplayed");
let gf = ur;
const va = "block hovered";
async function mf(o, e) {
  const t = navigator.keyboard;
  if (!t)
    return e;
  try {
    return (await t.getLayoutMap()).get(o) || e;
  } catch (n) {
    return console.error(n), e;
  }
}
class bf extends P {
  /**
   * @class
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.toolboxInstance = null;
  }
  /**
   * CSS styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      toolbar: "ce-toolbar",
      content: "ce-toolbar__content",
      actions: "ce-toolbar__actions",
      actionsOpened: "ce-toolbar__actions--opened",
      toolbarOpened: "ce-toolbar--opened",
      openedToolboxHolderModifier: "codex-editor--toolbox-opened",
      plusButton: "ce-toolbar__plus",
      plusButtonShortcut: "ce-toolbar__plus-shortcut",
      settingsToggler: "ce-toolbar__settings-btn",
      settingsTogglerHidden: "ce-toolbar__settings-btn--hidden"
    };
  }
  /**
   * Returns the Toolbar opening state
   *
   * @returns {boolean}
   */
  get opened() {
    return this.nodes.wrapper.classList.contains(this.CSS.toolbarOpened);
  }
  /**
   * Public interface for accessing the Toolbox
   */
  get toolbox() {
    var e;
    return {
      opened: (e = this.toolboxInstance) == null ? void 0 : e.opened,
      close: () => {
        var t;
        (t = this.toolboxInstance) == null || t.close();
      },
      open: () => {
        if (this.toolboxInstance === null) {
          D("toolbox.open() called before initialization is finished", "warn");
          return;
        }
        this.Editor.BlockManager.currentBlock = this.hoveredBlock, this.toolboxInstance.open();
      },
      toggle: () => {
        if (this.toolboxInstance === null) {
          D("toolbox.toggle() called before initialization is finished", "warn");
          return;
        }
        this.toolboxInstance.toggle();
      },
      hasFocus: () => {
        var t;
        return (t = this.toolboxInstance) == null ? void 0 : t.hasFocus();
      }
    };
  }
  /**
   * Block actions appearance manipulations
   */
  get blockActions() {
    return {
      hide: () => {
        this.nodes.actions.classList.remove(this.CSS.actionsOpened);
      },
      show: () => {
        this.nodes.actions.classList.add(this.CSS.actionsOpened);
      }
    };
  }
  /**
   * Methods for working with Block Tunes toggler
   */
  get blockTunesToggler() {
    return {
      hide: () => this.nodes.settingsToggler.classList.add(this.CSS.settingsTogglerHidden),
      show: () => this.nodes.settingsToggler.classList.remove(this.CSS.settingsTogglerHidden)
    };
  }
  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  toggleReadOnly(e) {
    e ? (this.destroy(), this.Editor.BlockSettings.destroy(), this.disableModuleBindings()) : window.requestIdleCallback(() => {
      this.drawUI(), this.enableModuleBindings();
    }, { timeout: 2e3 });
  }
  /**
   * Move Toolbar to the passed (or current) Block
   *
   * @param block - block to move Toolbar near it
   */
  moveAndOpen(e = this.Editor.BlockManager.currentBlock) {
    if (this.toolboxInstance === null) {
      D("Can't open Toolbar since Editor initialization is not finished yet", "warn");
      return;
    }
    if (this.toolboxInstance.opened && this.toolboxInstance.close(), this.Editor.BlockSettings.opened && this.Editor.BlockSettings.close(), !e)
      return;
    this.hoveredBlock = e;
    const t = e.holder, { isMobile: n } = this.Editor.UI;
    let r;
    const i = 20, s = e.firstInput, a = t.getBoundingClientRect(), l = s !== void 0 ? s.getBoundingClientRect() : null, c = l !== null ? l.top - a.top : null, d = c !== null ? c > i : void 0;
    if (n)
      r = t.offsetTop + t.offsetHeight;
    else if (s === void 0 || d) {
      const u = parseInt(window.getComputedStyle(e.pluginsContent).paddingTop);
      r = t.offsetTop + u;
    } else {
      const u = ep(s), h = parseInt(window.getComputedStyle(this.nodes.plusButton).height, 10);
      r = t.offsetTop + u - h + 8 + c;
    }
    this.nodes.wrapper.style.top = `${Math.floor(r)}px`, this.Editor.BlockManager.blocks.length === 1 && e.isEmpty ? this.blockTunesToggler.hide() : this.blockTunesToggler.show(), this.open();
  }
  /**
   * Close the Toolbar
   */
  close() {
    var e, t;
    this.Editor.ReadOnly.isEnabled || ((e = this.nodes.wrapper) == null || e.classList.remove(this.CSS.toolbarOpened), this.blockActions.hide(), (t = this.toolboxInstance) == null || t.close(), this.Editor.BlockSettings.close(), this.reset());
  }
  /**
   * Reset the Toolbar position to prevent DOM height growth, for example after blocks deletion
   */
  reset() {
    this.nodes.wrapper.style.top = "unset";
  }
  /**
   * Open Toolbar with Plus Button and Actions
   *
   * @param {boolean} withBlockActions - by default, Toolbar opens with Block Actions.
   *                                     This flag allows to open Toolbar without Actions.
   */
  open(e = !0) {
    this.nodes.wrapper.classList.add(this.CSS.toolbarOpened), e ? this.blockActions.show() : this.blockActions.hide();
  }
  /**
   * Draws Toolbar elements
   */
  async make() {
    this.nodes.wrapper = p.make("div", this.CSS.toolbar), ["content", "actions"].forEach((i) => {
      this.nodes[i] = p.make("div", this.CSS[i]);
    }), p.append(this.nodes.wrapper, this.nodes.content), p.append(this.nodes.content, this.nodes.actions), this.nodes.plusButton = p.make("div", this.CSS.plusButton, {
      innerHTML: Vp
    }), p.append(this.nodes.actions, this.nodes.plusButton), this.readOnlyMutableListeners.on(this.nodes.plusButton, "click", () => {
      ho(!0), this.plusButtonClicked();
    }, !1);
    const e = p.make("div");
    e.appendChild(document.createTextNode(ce.ui(me.ui.toolbar.toolbox, "Add"))), e.appendChild(p.make("div", this.CSS.plusButtonShortcut, {
      textContent: "/"
    })), po(this.nodes.plusButton, e, {
      hidingDelay: 400
    }), this.nodes.settingsToggler = p.make("span", this.CSS.settingsToggler, {
      innerHTML: Kp
    }), p.append(this.nodes.actions, this.nodes.settingsToggler);
    const t = p.make("div"), n = p.text(ce.ui(me.ui.blockTunes.toggler, "Click to tune")), r = await mf("Slash", "/");
    t.appendChild(n), t.appendChild(p.make("div", this.CSS.plusButtonShortcut, {
      textContent: rr(`CMD + ${r}`)
    })), po(this.nodes.settingsToggler, t, {
      hidingDelay: 400
    }), p.append(this.nodes.actions, this.makeToolbox()), p.append(this.nodes.actions, this.Editor.BlockSettings.getElement()), p.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }
  /**
   * Creates the Toolbox instance and return it's rendered element
   */
  makeToolbox() {
    return this.toolboxInstance = new gf({
      api: this.Editor.API.methods,
      tools: this.Editor.Tools.blockTools,
      i18nLabels: {
        filter: ce.ui(me.ui.popover, "Filter"),
        nothingFound: ce.ui(me.ui.popover, "Nothing found")
      }
    }), this.toolboxInstance.on(Xt.Opened, () => {
      this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolboxHolderModifier);
    }), this.toolboxInstance.on(Xt.Closed, () => {
      this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolboxHolderModifier);
    }), this.toolboxInstance.on(Xt.BlockAdded, ({ block: e }) => {
      const { BlockManager: t, Caret: n } = this.Editor, r = t.getBlockById(e.id);
      r.inputs.length === 0 && (r === t.lastBlock ? (t.insertAtEnd(), n.setToBlock(t.lastBlock)) : n.setToBlock(t.nextBlock));
    }), this.toolboxInstance.getElement();
  }
  /**
   * Handler for Plus Button
   */
  plusButtonClicked() {
    var e;
    this.Editor.BlockManager.currentBlock = this.hoveredBlock, (e = this.toolboxInstance) == null || e.toggle();
  }
  /**
   * Enable bindings
   */
  enableModuleBindings() {
    this.readOnlyMutableListeners.on(this.nodes.settingsToggler, "mousedown", (e) => {
      var t;
      e.stopPropagation(), this.settingsTogglerClicked(), (t = this.toolboxInstance) != null && t.opened && this.toolboxInstance.close(), ho(!0);
    }, !0), mt() || this.eventsDispatcher.on(va, (e) => {
      var t;
      this.Editor.BlockSettings.opened || (t = this.toolboxInstance) != null && t.opened || this.moveAndOpen(e.block);
    });
  }
  /**
   * Disable bindings
   */
  disableModuleBindings() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Clicks on the Block Settings toggler
   */
  settingsTogglerClicked() {
    this.Editor.BlockManager.currentBlock = this.hoveredBlock, this.Editor.BlockSettings.opened ? this.Editor.BlockSettings.close() : this.Editor.BlockSettings.open(this.hoveredBlock);
  }
  /**
   * Draws Toolbar UI
   *
   * Toolbar contains BlockSettings and Toolbox.
   * That's why at first we draw its components and then Toolbar itself
   *
   * Steps:
   *  - Make Toolbar dependent components like BlockSettings, Toolbox and so on
   *  - Make itself and append dependent nodes to itself
   *
   */
  drawUI() {
    this.Editor.BlockSettings.make(), this.make();
  }
  /**
   * Removes all created and saved HTMLElements
   * It is used in Read-Only mode
   */
  destroy() {
    this.removeAllNodes(), this.toolboxInstance && this.toolboxInstance.destroy();
  }
}
var Ye = /* @__PURE__ */ ((o) => (o[o.Block = 0] = "Block", o[o.Inline = 1] = "Inline", o[o.Tune = 2] = "Tune", o))(Ye || {}), Gt = /* @__PURE__ */ ((o) => (o.Shortcut = "shortcut", o.Toolbox = "toolbox", o.EnabledInlineTools = "inlineToolbar", o.EnabledBlockTunes = "tunes", o.Config = "config", o))(Gt || {}), ya = /* @__PURE__ */ ((o) => (o.Shortcut = "shortcut", o.SanitizeConfig = "sanitize", o))(ya || {}), ct = /* @__PURE__ */ ((o) => (o.IsEnabledLineBreaks = "enableLineBreaks", o.Toolbox = "toolbox", o.ConversionConfig = "conversionConfig", o.IsReadOnlySupported = "isReadOnlySupported", o.PasteConfig = "pasteConfig", o))(ct || {}), go = /* @__PURE__ */ ((o) => (o.IsInline = "isInline", o.Title = "title", o.IsReadOnlySupported = "isReadOnlySupported", o))(go || {}), hn = /* @__PURE__ */ ((o) => (o.IsTune = "isTune", o))(hn || {});
class hr {
  /**
   * @class
   * @param {ConstructorOptions} options - Constructor options
   */
  constructor({
    name: e,
    constructable: t,
    config: n,
    api: r,
    isDefault: i,
    isInternal: s = !1,
    defaultPlaceholder: a
  }) {
    this.api = r, this.name = e, this.constructable = t, this.config = n, this.isDefault = i, this.isInternal = s, this.defaultPlaceholder = a;
  }
  /**
   * Returns Tool user configuration
   */
  get settings() {
    const e = this.config.config || {};
    return this.isDefault && !("placeholder" in e) && this.defaultPlaceholder && (e.placeholder = this.defaultPlaceholder), e;
  }
  /**
   * Calls Tool's reset method
   */
  reset() {
    if (W(this.constructable.reset))
      return this.constructable.reset();
  }
  /**
   * Calls Tool's prepare method
   */
  prepare() {
    if (W(this.constructable.prepare))
      return this.constructable.prepare({
        toolName: this.name,
        config: this.settings
      });
  }
  /**
   * Returns shortcut for Tool (internal or specified by user)
   */
  get shortcut() {
    const e = this.constructable.shortcut;
    return this.config.shortcut || e;
  }
  /**
   * Returns Tool's sanitizer configuration
   */
  get sanitizeConfig() {
    return this.constructable.sanitize || {};
  }
  /**
   * Returns true if Tools is inline
   */
  isInline() {
    return this.type === Ye.Inline;
  }
  /**
   * Returns true if Tools is block
   */
  isBlock() {
    return this.type === Ye.Block;
  }
  /**
   * Returns true if Tools is tune
   */
  isTune() {
    return this.type === Ye.Tune;
  }
}
class vf extends P {
  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.CSS = {
      inlineToolbar: "ce-inline-toolbar"
    }, this.opened = !1, this.popover = null, this.toolbarVerticalMargin = mt() ? 20 : 6, this.tools = /* @__PURE__ */ new Map(), window.requestIdleCallback(() => {
      this.make();
    }, { timeout: 2e3 });
  }
  /**
   *  Moving / appearance
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  /**
   * Shows Inline Toolbar if something is selected
   *
   * @param [needToClose] - pass true to close toolbar if it is not allowed.
   *                                  Avoid to use it just for closing IT, better call .close() clearly.
   */
  async tryToShow(e = !1) {
    e && this.close(), this.allowedToShow() && (await this.open(), this.Editor.Toolbar.close());
  }
  /**
   * Hides Inline Toolbar
   */
  close() {
    var e, t;
    if (this.opened) {
      for (const [n, r] of this.tools) {
        const i = this.getToolShortcut(n.name);
        i !== void 0 && ht.remove(this.Editor.UI.nodes.redactor, i), W(r.clear) && r.clear();
      }
      this.tools = /* @__PURE__ */ new Map(), this.reset(), this.opened = !1, (e = this.popover) == null || e.hide(), (t = this.popover) == null || t.destroy(), this.popover = null;
    }
  }
  /**
   * Check if node is contained by Inline Toolbar
   *
   * @param {Node} node — node to check
   */
  containsNode(e) {
    return this.nodes.wrapper === void 0 ? !1 : this.nodes.wrapper.contains(e);
  }
  /**
   * Removes UI and its components
   */
  destroy() {
    var e;
    this.removeAllNodes(), (e = this.popover) == null || e.destroy(), this.popover = null;
  }
  /**
   * Making DOM
   */
  make() {
    this.nodes.wrapper = p.make("div", [
      this.CSS.inlineToolbar,
      ...this.isRtl ? [this.Editor.UI.CSS.editorRtlFix] : []
    ]), this.nodes.wrapper.setAttribute("data-cy", "inline-toolbar"), p.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }
  /**
   * Shows Inline Toolbar
   */
  async open() {
    var e;
    if (this.opened)
      return;
    this.opened = !0, this.popover !== null && this.popover.destroy(), this.createToolsInstances();
    const t = await this.getPopoverItems();
    this.popover = new rf({
      items: t,
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: ce.ui(me.ui.popover, "Nothing found"),
        search: ce.ui(me.ui.popover, "Filter")
      }
    }), this.move(this.popover.size.width), (e = this.nodes.wrapper) == null || e.append(this.popover.getElement()), this.popover.show();
  }
  /**
   * Move Toolbar to the selected text
   *
   * @param popoverWidth - width of the toolbar popover
   */
  move(e) {
    const t = x.rect, n = this.Editor.UI.nodes.wrapper.getBoundingClientRect(), r = {
      x: t.x - n.x,
      y: t.y + t.height - // + window.scrollY
      n.top + this.toolbarVerticalMargin
    };
    r.x + e + n.x > this.Editor.UI.contentRect.right && (r.x = this.Editor.UI.contentRect.right - e - n.x), this.nodes.wrapper.style.left = Math.floor(r.x) + "px", this.nodes.wrapper.style.top = Math.floor(r.y) + "px";
  }
  /**
   * Clear orientation classes and reset position
   */
  reset() {
    this.nodes.wrapper.style.left = "0", this.nodes.wrapper.style.top = "0";
  }
  /**
   * Need to show Inline Toolbar or not
   */
  allowedToShow() {
    const e = ["IMG", "INPUT"], t = x.get(), n = x.text;
    if (!t || !t.anchorNode || t.isCollapsed || n.length < 1)
      return !1;
    const r = p.isElement(t.anchorNode) ? t.anchorNode : t.anchorNode.parentElement;
    if (r === null || t !== null && e.includes(r.tagName))
      return !1;
    const i = this.Editor.BlockManager.getBlock(t.anchorNode);
    return !i || this.getTools().some((s) => i.tool.inlineTools.has(s.name)) === !1 ? !1 : r.closest("[contenteditable]") !== null;
  }
  /**
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  /**
   * Returns tools that are available for current block
   *
   * Used to check if Inline Toolbar could be shown
   * and to render tools in the Inline Toolbar
   */
  getTools() {
    const e = this.Editor.BlockManager.currentBlock;
    return e ? Array.from(e.tool.inlineTools.values()).filter((t) => !(this.Editor.ReadOnly.isEnabled && t.isReadOnlySupported !== !0)) : [];
  }
  /**
   * Constructs tools instances and saves them to this.tools
   */
  createToolsInstances() {
    this.tools = /* @__PURE__ */ new Map(), this.getTools().forEach((e) => {
      const t = e.create();
      this.tools.set(e, t);
    });
  }
  /**
   * Returns Popover Items for tools segregated by their appearance type: regular items and custom html elements.
   */
  async getPopoverItems() {
    const e = [];
    let t = 0;
    for (const [n, r] of this.tools) {
      const i = await r.render(), s = this.getToolShortcut(n.name);
      if (s !== void 0)
        try {
          this.enableShortcuts(n.name, s);
        } catch {
        }
      const a = s !== void 0 ? rr(s) : void 0, l = ce.t(
        me.toolNames,
        n.title || co(n.name)
      );
      [i].flat().forEach((c) => {
        var d, u;
        const h = {
          name: n.name,
          onActivate: () => {
            this.toolClicked(r);
          },
          hint: {
            title: l,
            description: a
          }
        };
        if (p.isElement(c)) {
          const g = {
            ...h,
            element: c,
            type: z.Html
          };
          if (W(r.renderActions)) {
            const f = r.renderActions();
            g.children = {
              isOpen: (d = r.checkState) == null ? void 0 : d.call(r, x.get()),
              /** Disable keyboard navigation in actions, as it might conflict with enter press handling */
              isFlippable: !1,
              items: [
                {
                  type: z.Html,
                  element: f
                }
              ]
            };
          } else
            (u = r.checkState) == null || u.call(r, x.get());
          e.push(g);
        } else if (c.type === z.Html)
          e.push({
            ...h,
            ...c,
            type: z.Html
          });
        else if (c.type === z.Separator)
          e.push({
            type: z.Separator
          });
        else {
          const g = {
            ...h,
            ...c,
            type: z.Default
          };
          "children" in g && t !== 0 && e.push({
            type: z.Separator
          }), e.push(g), "children" in g && t < this.tools.size - 1 && e.push({
            type: z.Separator
          });
        }
      }), t++;
    }
    return e;
  }
  /**
   * Get shortcut name for tool
   *
   * @param toolName — Tool name
   */
  getToolShortcut(e) {
    const { Tools: t } = this.Editor, n = t.inlineTools.get(e), r = t.internal.inlineTools;
    return Array.from(r.keys()).includes(e) ? this.inlineTools[e][ya.Shortcut] : n == null ? void 0 : n.shortcut;
  }
  /**
   * Enable Tool shortcut with Editor Shortcuts Module
   *
   * @param toolName - tool name
   * @param shortcut - shortcut according to the ShortcutData Module format
   */
  enableShortcuts(e, t) {
    ht.add({
      name: t,
      handler: (n) => {
        var r;
        const { currentBlock: i } = this.Editor.BlockManager;
        i && i.tool.enabledInlineTools && (n.preventDefault(), (r = this.popover) == null || r.activateItemByName(e));
      },
      /**
       * We need to bind shortcut to the document to make it work in read-only mode
       */
      on: document
    });
  }
  /**
   * Inline Tool button clicks
   *
   * @param tool - Tool's instance
   */
  toolClicked(e) {
    var t;
    const n = x.range;
    (t = e.surround) == null || t.call(e, n), this.checkToolsState();
  }
  /**
   * Check Tools` state by selection
   */
  checkToolsState() {
    var e;
    (e = this.tools) == null || e.forEach((t) => {
      var n;
      (n = t.checkState) == null || n.call(t, x.get());
    });
  }
  /**
   * Get inline tools tools
   * Tools that has isInline is true
   */
  get inlineTools() {
    const e = {};
    return Array.from(this.Editor.Tools.inlineTools.entries()).forEach(([t, n]) => {
      e[t] = n.create();
    }), e;
  }
}
function ka() {
  const o = window.getSelection();
  if (o === null)
    return [null, 0];
  let e = o.focusNode, t = o.focusOffset;
  return e === null ? [null, 0] : (e.nodeType !== Node.TEXT_NODE && e.childNodes.length > 0 && (e.childNodes[t] ? (e = e.childNodes[t], t = 0) : (e = e.childNodes[t - 1], t = e.textContent.length)), [e, t]);
}
function wa(o, e, t, n) {
  const r = document.createRange();
  n === "left" ? (r.setStart(o, 0), r.setEnd(e, t)) : (r.setStart(e, t), r.setEnd(o, o.childNodes.length));
  const i = r.cloneContents(), s = document.createElement("div");
  s.appendChild(i);
  const a = s.textContent || "";
  return Qh(a);
}
function Zt(o) {
  const e = p.getDeepestNode(o);
  if (e === null || p.isEmpty(o))
    return !0;
  if (p.isNativeInput(e))
    return e.selectionEnd === 0;
  if (p.isEmpty(o))
    return !0;
  const [t, n] = ka();
  return t === null ? !1 : wa(o, t, n, "left");
}
function Jt(o) {
  const e = p.getDeepestNode(o, !0);
  if (e === null)
    return !0;
  if (p.isNativeInput(e))
    return e.selectionEnd === e.value.length;
  const [t, n] = ka();
  return t === null ? !1 : wa(o, t, n, "right");
}
var xa = {}, pr = {}, Bo = {}, tt = {}, fr = {}, gr = {};
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.allInputsSelector = yf;
function yf() {
  var o = ["text", "password", "email", "number", "search", "tel", "url"];
  return "[contenteditable=true], textarea, input:not([type]), " + o.map(function(e) {
    return 'input[type="'.concat(e, '"]');
  }).join(", ");
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.allInputsSelector = void 0;
  var e = gr;
  Object.defineProperty(o, "allInputsSelector", { enumerable: !0, get: function() {
    return e.allInputsSelector;
  } });
})(fr);
var ot = {}, mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.isNativeInput = kf;
function kf(o) {
  var e = [
    "INPUT",
    "TEXTAREA"
  ];
  return o && o.tagName ? e.includes(o.tagName) : !1;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isNativeInput = void 0;
  var e = mr;
  Object.defineProperty(o, "isNativeInput", { enumerable: !0, get: function() {
    return e.isNativeInput;
  } });
})(ot);
var Ca = {}, br = {};
Object.defineProperty(br, "__esModule", { value: !0 });
br.append = wf;
function wf(o, e) {
  Array.isArray(e) ? e.forEach(function(t) {
    o.appendChild(t);
  }) : o.appendChild(e);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.append = void 0;
  var e = br;
  Object.defineProperty(o, "append", { enumerable: !0, get: function() {
    return e.append;
  } });
})(Ca);
var vr = {}, yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.blockElements = xf;
function xf() {
  return [
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "output",
    "p",
    "pre",
    "ruby",
    "section",
    "table",
    "tbody",
    "thead",
    "tr",
    "tfoot",
    "ul",
    "video"
  ];
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.blockElements = void 0;
  var e = yr;
  Object.defineProperty(o, "blockElements", { enumerable: !0, get: function() {
    return e.blockElements;
  } });
})(vr);
var Ea = {}, kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.calculateBaseline = Cf;
function Cf(o) {
  var e = window.getComputedStyle(o), t = parseFloat(e.fontSize), n = parseFloat(e.lineHeight) || t * 1.2, r = parseFloat(e.paddingTop), i = parseFloat(e.borderTopWidth), s = parseFloat(e.marginTop), a = t * 0.8, l = (n - t) / 2, c = s + i + r + l + a;
  return c;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.calculateBaseline = void 0;
  var e = kr;
  Object.defineProperty(o, "calculateBaseline", { enumerable: !0, get: function() {
    return e.calculateBaseline;
  } });
})(Ea);
var Sa = {}, wr = {}, xr = {}, Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.isContentEditable = Ef;
function Ef(o) {
  return o.contentEditable === "true";
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isContentEditable = void 0;
  var e = Cr;
  Object.defineProperty(o, "isContentEditable", { enumerable: !0, get: function() {
    return e.isContentEditable;
  } });
})(xr);
Object.defineProperty(wr, "__esModule", { value: !0 });
wr.canSetCaret = Bf;
var Sf = ot, Tf = xr;
function Bf(o) {
  var e = !0;
  if ((0, Sf.isNativeInput)(o))
    switch (o.type) {
      case "file":
      case "checkbox":
      case "radio":
      case "hidden":
      case "submit":
      case "button":
      case "image":
      case "reset":
        e = !1;
        break;
    }
  else
    e = (0, Tf.isContentEditable)(o);
  return e;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.canSetCaret = void 0;
  var e = wr;
  Object.defineProperty(o, "canSetCaret", { enumerable: !0, get: function() {
    return e.canSetCaret;
  } });
})(Sa);
var _o = {}, Er = {};
function _f(o, e, t) {
  const n = t.value !== void 0 ? "value" : "get", r = t[n], i = `#${e}Cache`;
  if (t[n] = function(...s) {
    return this[i] === void 0 && (this[i] = r.apply(this, s)), this[i];
  }, n === "get" && t.set) {
    const s = t.set;
    t.set = function(a) {
      delete o[i], s.apply(this, a);
    };
  }
  return t;
}
function Ta() {
  const o = {
    win: !1,
    mac: !1,
    x11: !1,
    linux: !1
  }, e = Object.keys(o).find((t) => window.navigator.appVersion.toLowerCase().indexOf(t) !== -1);
  return e !== void 0 && (o[e] = !0), o;
}
function Sr(o) {
  return o != null && o !== "" && (typeof o != "object" || Object.keys(o).length > 0);
}
function Of(o) {
  return !Sr(o);
}
const Mf = () => typeof window < "u" && window.navigator !== null && Sr(window.navigator.platform) && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
function If(o) {
  const e = Ta();
  return o = o.replace(/shift/gi, "⇧").replace(/backspace/gi, "⌫").replace(/enter/gi, "⏎").replace(/up/gi, "↑").replace(/left/gi, "→").replace(/down/gi, "↓").replace(/right/gi, "←").replace(/escape/gi, "⎋").replace(/insert/gi, "Ins").replace(/delete/gi, "␡").replace(/\+/gi, "+"), e.mac ? o = o.replace(/ctrl|cmd/gi, "⌘").replace(/alt/gi, "⌥") : o = o.replace(/cmd/gi, "Ctrl").replace(/windows/gi, "WIN"), o;
}
function Lf(o) {
  return o[0].toUpperCase() + o.slice(1);
}
function Af(o) {
  const e = document.createElement("div");
  e.style.position = "absolute", e.style.left = "-999px", e.style.bottom = "-999px", e.innerHTML = o, document.body.appendChild(e);
  const t = window.getSelection(), n = document.createRange();
  if (n.selectNode(e), t === null)
    throw new Error("Cannot copy text to clipboard");
  t.removeAllRanges(), t.addRange(n), document.execCommand("copy"), document.body.removeChild(e);
}
function Pf(o, e, t) {
  let n;
  return (...r) => {
    const i = this, s = () => {
      n = void 0, t !== !0 && o.apply(i, r);
    }, a = t === !0 && n !== void 0;
    window.clearTimeout(n), n = window.setTimeout(s, e), a && o.apply(i, r);
  };
}
function Re(o) {
  return Object.prototype.toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
function Nf(o) {
  return Re(o) === "boolean";
}
function Ba(o) {
  return Re(o) === "function" || Re(o) === "asyncfunction";
}
function $f(o) {
  return Ba(o) && /^\s*class\s+/.test(o.toString());
}
function jf(o) {
  return Re(o) === "number";
}
function Qt(o) {
  return Re(o) === "object";
}
function Rf(o) {
  return Promise.resolve(o) === o;
}
function Df(o) {
  return Re(o) === "string";
}
function Hf(o) {
  return Re(o) === "undefined";
}
function pn(o, ...e) {
  if (!e.length)
    return o;
  const t = e.shift();
  if (Qt(o) && Qt(t))
    for (const n in t)
      Qt(t[n]) ? (o[n] === void 0 && Object.assign(o, { [n]: {} }), pn(o[n], t[n])) : Object.assign(o, { [n]: t[n] });
  return pn(o, ...e);
}
function Ff(o, e, t) {
  const n = `«${e}» is deprecated and will be removed in the next major release. Please use the «${t}» instead.`;
  o && console.warn(n);
}
function zf(o) {
  try {
    return new URL(o).href;
  } catch {
  }
  return o.substring(0, 2) === "//" ? window.location.protocol + o : window.location.origin + o;
}
function Uf(o) {
  return o > 47 && o < 58 || o === 32 || o === 13 || o === 229 || o > 64 && o < 91 || o > 95 && o < 112 || o > 185 && o < 193 || o > 218 && o < 223;
}
const Wf = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
  SLASH: 191
}, qf = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4
};
let Kf = class {
  constructor() {
    this.completed = Promise.resolve();
  }
  /**
   * Add new promise to queue
   * @param operation - promise should be added to queue
   */
  add(o) {
    return new Promise((e, t) => {
      this.completed = this.completed.then(o).then(e).catch(t);
    });
  }
};
function Vf(o, e, t = void 0) {
  let n, r, i, s = null, a = 0;
  t || (t = {});
  const l = function() {
    a = t.leading === !1 ? 0 : Date.now(), s = null, i = o.apply(n, r), s === null && (n = r = null);
  };
  return function() {
    const c = Date.now();
    !a && t.leading === !1 && (a = c);
    const d = e - (c - a);
    return n = this, r = arguments, d <= 0 || d > e ? (s && (clearTimeout(s), s = null), a = c, i = o.apply(n, r), s === null && (n = r = null)) : !s && t.trailing !== !1 && (s = setTimeout(l, d)), i;
  };
}
const Yf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PromiseQueue: Kf,
  beautifyShortcut: If,
  cacheable: _f,
  capitalize: Lf,
  copyTextToClipboard: Af,
  debounce: Pf,
  deepMerge: pn,
  deprecationAssert: Ff,
  getUserOS: Ta,
  getValidUrl: zf,
  isBoolean: Nf,
  isClass: $f,
  isEmpty: Of,
  isFunction: Ba,
  isIosDevice: Mf,
  isNumber: jf,
  isObject: Qt,
  isPrintableKey: Uf,
  isPromise: Rf,
  isString: Df,
  isUndefined: Hf,
  keyCodes: Wf,
  mouseButtons: qf,
  notEmpty: Sr,
  throttle: Vf,
  typeOf: Re
}, Symbol.toStringTag, { value: "Module" })), Tr = /* @__PURE__ */ Dh(Yf);
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.containsOnlyInlineElements = Zf;
var Xf = Tr, Gf = vr;
function Zf(o) {
  var e;
  (0, Xf.isString)(o) ? (e = document.createElement("div"), e.innerHTML = o) : e = o;
  var t = function(n) {
    return !(0, Gf.blockElements)().includes(n.tagName.toLowerCase()) && Array.from(n.children).every(t);
  };
  return Array.from(e.children).every(t);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.containsOnlyInlineElements = void 0;
  var e = Er;
  Object.defineProperty(o, "containsOnlyInlineElements", { enumerable: !0, get: function() {
    return e.containsOnlyInlineElements;
  } });
})(_o);
var _a = {}, Br = {}, Oo = {}, _r = {};
Object.defineProperty(_r, "__esModule", { value: !0 });
_r.make = Jf;
function Jf(o, e, t) {
  var n;
  e === void 0 && (e = null), t === void 0 && (t = {});
  var r = document.createElement(o);
  if (Array.isArray(e)) {
    var i = e.filter(function(a) {
      return a !== void 0;
    });
    (n = r.classList).add.apply(n, i);
  } else
    e !== null && r.classList.add(e);
  for (var s in t)
    Object.prototype.hasOwnProperty.call(t, s) && (r[s] = t[s]);
  return r;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.make = void 0;
  var e = _r;
  Object.defineProperty(o, "make", { enumerable: !0, get: function() {
    return e.make;
  } });
})(Oo);
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.fragmentToString = eg;
var Qf = Oo;
function eg(o) {
  var e = (0, Qf.make)("div");
  return e.appendChild(o), e.innerHTML;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.fragmentToString = void 0;
  var e = Br;
  Object.defineProperty(o, "fragmentToString", { enumerable: !0, get: function() {
    return e.fragmentToString;
  } });
})(_a);
var Oa = {}, Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.getContentLength = og;
var tg = ot;
function og(o) {
  var e, t;
  return (0, tg.isNativeInput)(o) ? o.value.length : o.nodeType === Node.TEXT_NODE ? o.length : (t = (e = o.textContent) === null || e === void 0 ? void 0 : e.length) !== null && t !== void 0 ? t : 0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getContentLength = void 0;
  var e = Or;
  Object.defineProperty(o, "getContentLength", { enumerable: !0, get: function() {
    return e.getContentLength;
  } });
})(Oa);
var Mr = {}, Ir = {}, Wi = At && At.__spreadArray || function(o, e, t) {
  if (t || arguments.length === 2)
    for (var n = 0, r = e.length, i; n < r; n++)
      (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return o.concat(i || Array.prototype.slice.call(e));
};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.getDeepestBlockElements = Ma;
var ng = _o;
function Ma(o) {
  return (0, ng.containsOnlyInlineElements)(o) ? [o] : Array.from(o.children).reduce(function(e, t) {
    return Wi(Wi([], e, !0), Ma(t), !0);
  }, []);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getDeepestBlockElements = void 0;
  var e = Ir;
  Object.defineProperty(o, "getDeepestBlockElements", { enumerable: !0, get: function() {
    return e.getDeepestBlockElements;
  } });
})(Mr);
var Ia = {}, Lr = {}, Mo = {}, Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.isLineBreakTag = rg;
function rg(o) {
  return [
    "BR",
    "WBR"
  ].includes(o.tagName);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isLineBreakTag = void 0;
  var e = Ar;
  Object.defineProperty(o, "isLineBreakTag", { enumerable: !0, get: function() {
    return e.isLineBreakTag;
  } });
})(Mo);
var Io = {}, Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.isSingleTag = ig;
function ig(o) {
  return [
    "AREA",
    "BASE",
    "BR",
    "COL",
    "COMMAND",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "KEYGEN",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ].includes(o.tagName);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isSingleTag = void 0;
  var e = Pr;
  Object.defineProperty(o, "isSingleTag", { enumerable: !0, get: function() {
    return e.isSingleTag;
  } });
})(Io);
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.getDeepestNode = La;
var sg = ot, ag = Mo, lg = Io;
function La(o, e) {
  e === void 0 && (e = !1);
  var t = e ? "lastChild" : "firstChild", n = e ? "previousSibling" : "nextSibling";
  if (o.nodeType === Node.ELEMENT_NODE && o[t]) {
    var r = o[t];
    if ((0, lg.isSingleTag)(r) && !(0, sg.isNativeInput)(r) && !(0, ag.isLineBreakTag)(r))
      if (r[n])
        r = r[n];
      else if (r.parentNode !== null && r.parentNode[n])
        r = r.parentNode[n];
      else
        return r.parentNode;
    return La(r, e);
  }
  return o;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getDeepestNode = void 0;
  var e = Lr;
  Object.defineProperty(o, "getDeepestNode", { enumerable: !0, get: function() {
    return e.getDeepestNode;
  } });
})(Ia);
var Aa = {}, Nr = {}, Wt = At && At.__spreadArray || function(o, e, t) {
  if (t || arguments.length === 2)
    for (var n = 0, r = e.length, i; n < r; n++)
      (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return o.concat(i || Array.prototype.slice.call(e));
};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.findAllInputs = pg;
var cg = _o, dg = Mr, ug = fr, hg = ot;
function pg(o) {
  return Array.from(o.querySelectorAll((0, ug.allInputsSelector)())).reduce(function(e, t) {
    return (0, hg.isNativeInput)(t) || (0, cg.containsOnlyInlineElements)(t) ? Wt(Wt([], e, !0), [t], !1) : Wt(Wt([], e, !0), (0, dg.getDeepestBlockElements)(t), !0);
  }, []);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.findAllInputs = void 0;
  var e = Nr;
  Object.defineProperty(o, "findAllInputs", { enumerable: !0, get: function() {
    return e.findAllInputs;
  } });
})(Aa);
var Pa = {}, $r = {};
Object.defineProperty($r, "__esModule", { value: !0 });
$r.isCollapsedWhitespaces = fg;
function fg(o) {
  return !/[^\t\n\r ]/.test(o);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isCollapsedWhitespaces = void 0;
  var e = $r;
  Object.defineProperty(o, "isCollapsedWhitespaces", { enumerable: !0, get: function() {
    return e.isCollapsedWhitespaces;
  } });
})(Pa);
var jr = {}, Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.isElement = mg;
var gg = Tr;
function mg(o) {
  return (0, gg.isNumber)(o) ? !1 : !!o && !!o.nodeType && o.nodeType === Node.ELEMENT_NODE;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isElement = void 0;
  var e = Rr;
  Object.defineProperty(o, "isElement", { enumerable: !0, get: function() {
    return e.isElement;
  } });
})(jr);
var Na = {}, Dr = {}, Hr = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.isLeaf = bg;
function bg(o) {
  return o === null ? !1 : o.childNodes.length === 0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isLeaf = void 0;
  var e = Fr;
  Object.defineProperty(o, "isLeaf", { enumerable: !0, get: function() {
    return e.isLeaf;
  } });
})(Hr);
var zr = {}, Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.isNodeEmpty = xg;
var vg = Mo, yg = jr, kg = ot, wg = Io;
function xg(o, e) {
  var t = "";
  return (0, wg.isSingleTag)(o) && !(0, vg.isLineBreakTag)(o) ? !1 : ((0, yg.isElement)(o) && (0, kg.isNativeInput)(o) ? t = o.value : o.textContent !== null && (t = o.textContent.replace("​", "")), e !== void 0 && (t = t.replace(new RegExp(e, "g"), "")), t.trim().length === 0);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isNodeEmpty = void 0;
  var e = Ur;
  Object.defineProperty(o, "isNodeEmpty", { enumerable: !0, get: function() {
    return e.isNodeEmpty;
  } });
})(zr);
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.isEmpty = Sg;
var Cg = Hr, Eg = zr;
function Sg(o, e) {
  o.normalize();
  for (var t = [o]; t.length > 0; ) {
    var n = t.shift();
    if (n) {
      if (o = n, (0, Cg.isLeaf)(o) && !(0, Eg.isNodeEmpty)(o, e))
        return !1;
      t.push.apply(t, Array.from(o.childNodes));
    }
  }
  return !0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isEmpty = void 0;
  var e = Dr;
  Object.defineProperty(o, "isEmpty", { enumerable: !0, get: function() {
    return e.isEmpty;
  } });
})(Na);
var $a = {}, Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.isFragment = Bg;
var Tg = Tr;
function Bg(o) {
  return (0, Tg.isNumber)(o) ? !1 : !!o && !!o.nodeType && o.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isFragment = void 0;
  var e = Wr;
  Object.defineProperty(o, "isFragment", { enumerable: !0, get: function() {
    return e.isFragment;
  } });
})($a);
var ja = {}, qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.isHTMLString = Og;
var _g = Oo;
function Og(o) {
  var e = (0, _g.make)("div");
  return e.innerHTML = o, e.childElementCount > 0;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isHTMLString = void 0;
  var e = qr;
  Object.defineProperty(o, "isHTMLString", { enumerable: !0, get: function() {
    return e.isHTMLString;
  } });
})(ja);
var Ra = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.offset = Mg;
function Mg(o) {
  var e = o.getBoundingClientRect(), t = window.pageXOffset || document.documentElement.scrollLeft, n = window.pageYOffset || document.documentElement.scrollTop, r = e.top + n, i = e.left + t;
  return {
    top: r,
    left: i,
    bottom: r + e.height,
    right: i + e.width
  };
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.offset = void 0;
  var e = Kr;
  Object.defineProperty(o, "offset", { enumerable: !0, get: function() {
    return e.offset;
  } });
})(Ra);
var Da = {}, Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.prepend = Ig;
function Ig(o, e) {
  Array.isArray(e) ? (e = e.reverse(), e.forEach(function(t) {
    return o.prepend(t);
  })) : o.prepend(e);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.prepend = void 0;
  var e = Vr;
  Object.defineProperty(o, "prepend", { enumerable: !0, get: function() {
    return e.prepend;
  } });
})(Da);
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.prepend = o.offset = o.make = o.isLineBreakTag = o.isSingleTag = o.isNodeEmpty = o.isLeaf = o.isHTMLString = o.isFragment = o.isEmpty = o.isElement = o.isContentEditable = o.isCollapsedWhitespaces = o.findAllInputs = o.isNativeInput = o.allInputsSelector = o.getDeepestNode = o.getDeepestBlockElements = o.getContentLength = o.fragmentToString = o.containsOnlyInlineElements = o.canSetCaret = o.calculateBaseline = o.blockElements = o.append = void 0;
  var e = fr;
  Object.defineProperty(o, "allInputsSelector", { enumerable: !0, get: function() {
    return e.allInputsSelector;
  } });
  var t = ot;
  Object.defineProperty(o, "isNativeInput", { enumerable: !0, get: function() {
    return t.isNativeInput;
  } });
  var n = Ca;
  Object.defineProperty(o, "append", { enumerable: !0, get: function() {
    return n.append;
  } });
  var r = vr;
  Object.defineProperty(o, "blockElements", { enumerable: !0, get: function() {
    return r.blockElements;
  } });
  var i = Ea;
  Object.defineProperty(o, "calculateBaseline", { enumerable: !0, get: function() {
    return i.calculateBaseline;
  } });
  var s = Sa;
  Object.defineProperty(o, "canSetCaret", { enumerable: !0, get: function() {
    return s.canSetCaret;
  } });
  var a = _o;
  Object.defineProperty(o, "containsOnlyInlineElements", { enumerable: !0, get: function() {
    return a.containsOnlyInlineElements;
  } });
  var l = _a;
  Object.defineProperty(o, "fragmentToString", { enumerable: !0, get: function() {
    return l.fragmentToString;
  } });
  var c = Oa;
  Object.defineProperty(o, "getContentLength", { enumerable: !0, get: function() {
    return c.getContentLength;
  } });
  var d = Mr;
  Object.defineProperty(o, "getDeepestBlockElements", { enumerable: !0, get: function() {
    return d.getDeepestBlockElements;
  } });
  var u = Ia;
  Object.defineProperty(o, "getDeepestNode", { enumerable: !0, get: function() {
    return u.getDeepestNode;
  } });
  var h = Aa;
  Object.defineProperty(o, "findAllInputs", { enumerable: !0, get: function() {
    return h.findAllInputs;
  } });
  var g = Pa;
  Object.defineProperty(o, "isCollapsedWhitespaces", { enumerable: !0, get: function() {
    return g.isCollapsedWhitespaces;
  } });
  var f = xr;
  Object.defineProperty(o, "isContentEditable", { enumerable: !0, get: function() {
    return f.isContentEditable;
  } });
  var b = jr;
  Object.defineProperty(o, "isElement", { enumerable: !0, get: function() {
    return b.isElement;
  } });
  var N = Na;
  Object.defineProperty(o, "isEmpty", { enumerable: !0, get: function() {
    return N.isEmpty;
  } });
  var M = $a;
  Object.defineProperty(o, "isFragment", { enumerable: !0, get: function() {
    return M.isFragment;
  } });
  var _ = ja;
  Object.defineProperty(o, "isHTMLString", { enumerable: !0, get: function() {
    return _.isHTMLString;
  } });
  var H = Hr;
  Object.defineProperty(o, "isLeaf", { enumerable: !0, get: function() {
    return H.isLeaf;
  } });
  var E = zr;
  Object.defineProperty(o, "isNodeEmpty", { enumerable: !0, get: function() {
    return E.isNodeEmpty;
  } });
  var C = Mo;
  Object.defineProperty(o, "isLineBreakTag", { enumerable: !0, get: function() {
    return C.isLineBreakTag;
  } });
  var G = Io;
  Object.defineProperty(o, "isSingleTag", { enumerable: !0, get: function() {
    return G.isSingleTag;
  } });
  var ne = Oo;
  Object.defineProperty(o, "make", { enumerable: !0, get: function() {
    return ne.make;
  } });
  var w = Ra;
  Object.defineProperty(o, "offset", { enumerable: !0, get: function() {
    return w.offset;
  } });
  var v = Da;
  Object.defineProperty(o, "prepend", { enumerable: !0, get: function() {
    return v.prepend;
  } });
})(tt);
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
Lo.getContenteditableSlice = Ag;
var Lg = tt;
function Ag(o, e, t, n, r) {
  var i;
  r === void 0 && (r = !1);
  var s = document.createRange();
  if (n === "left" ? (s.setStart(o, 0), s.setEnd(e, t)) : (s.setStart(e, t), s.setEnd(o, o.childNodes.length)), r === !0) {
    var a = s.extractContents();
    return (0, Lg.fragmentToString)(a);
  }
  var l = s.cloneContents(), c = document.createElement("div");
  c.appendChild(l);
  var d = (i = c.textContent) !== null && i !== void 0 ? i : "";
  return d;
}
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.checkContenteditableSliceForEmptiness = $g;
var Pg = tt, Ng = Lo;
function $g(o, e, t, n) {
  var r = (0, Ng.getContenteditableSlice)(o, e, t, n);
  return (0, Pg.isCollapsedWhitespaces)(r);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.checkContenteditableSliceForEmptiness = void 0;
  var e = Bo;
  Object.defineProperty(o, "checkContenteditableSliceForEmptiness", { enumerable: !0, get: function() {
    return e.checkContenteditableSliceForEmptiness;
  } });
})(pr);
var Ha = {};
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getContenteditableSlice = void 0;
  var e = Lo;
  Object.defineProperty(o, "getContenteditableSlice", { enumerable: !0, get: function() {
    return e.getContenteditableSlice;
  } });
})(Ha);
var Fa = {}, Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.focus = Rg;
var jg = tt;
function Rg(o, e) {
  var t, n;
  if (e === void 0 && (e = !0), (0, jg.isNativeInput)(o)) {
    o.focus();
    var r = e ? 0 : o.value.length;
    o.setSelectionRange(r, r);
  } else {
    var i = document.createRange(), s = window.getSelection();
    if (!s)
      return;
    var a = function(h) {
      var g = document.createTextNode("");
      h.appendChild(g), i.setStart(g, 0), i.setEnd(g, 0);
    }, l = function(h) {
      return h != null;
    }, c = o.childNodes, d = e ? c[0] : c[c.length - 1];
    if (l(d)) {
      for (; l(d) && d.nodeType !== Node.TEXT_NODE; )
        d = e ? d.firstChild : d.lastChild;
      if (l(d) && d.nodeType === Node.TEXT_NODE) {
        var u = (n = (t = d.textContent) === null || t === void 0 ? void 0 : t.length) !== null && n !== void 0 ? n : 0, r = e ? 0 : u;
        i.setStart(d, r), i.setEnd(d, r);
      } else
        a(o);
    } else
      a(o);
    s.removeAllRanges(), s.addRange(i);
  }
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.focus = void 0;
  var e = Yr;
  Object.defineProperty(o, "focus", { enumerable: !0, get: function() {
    return e.focus;
  } });
})(Fa);
var Xr = {}, Ao = {};
Object.defineProperty(Ao, "__esModule", { value: !0 });
Ao.getCaretNodeAndOffset = Dg;
function Dg() {
  var o = window.getSelection();
  if (o === null)
    return [null, 0];
  var e = o.focusNode, t = o.focusOffset;
  return e === null ? [null, 0] : (e.nodeType !== Node.TEXT_NODE && e.childNodes.length > 0 && (e.childNodes[t] !== void 0 ? (e = e.childNodes[t], t = 0) : (e = e.childNodes[t - 1], e.textContent !== null && (t = e.textContent.length))), [e, t]);
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getCaretNodeAndOffset = void 0;
  var e = Ao;
  Object.defineProperty(o, "getCaretNodeAndOffset", { enumerable: !0, get: function() {
    return e.getCaretNodeAndOffset;
  } });
})(Xr);
var za = {}, Po = {};
Object.defineProperty(Po, "__esModule", { value: !0 });
Po.getRange = Hg;
function Hg() {
  var o = window.getSelection();
  return o && o.rangeCount ? o.getRangeAt(0) : null;
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.getRange = void 0;
  var e = Po;
  Object.defineProperty(o, "getRange", { enumerable: !0, get: function() {
    return e.getRange;
  } });
})(za);
var Ua = {}, Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.isCaretAtEndOfInput = Ug;
var qi = tt, Fg = Xr, zg = pr;
function Ug(o) {
  var e = (0, qi.getDeepestNode)(o, !0);
  if (e === null)
    return !0;
  if ((0, qi.isNativeInput)(e))
    return e.selectionEnd === e.value.length;
  var t = (0, Fg.getCaretNodeAndOffset)(), n = t[0], r = t[1];
  return n === null ? !1 : (0, zg.checkContenteditableSliceForEmptiness)(o, n, r, "right");
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isCaretAtEndOfInput = void 0;
  var e = Gr;
  Object.defineProperty(o, "isCaretAtEndOfInput", { enumerable: !0, get: function() {
    return e.isCaretAtEndOfInput;
  } });
})(Ua);
var Wa = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.isCaretAtStartOfInput = Kg;
var qt = tt, Wg = Ao, qg = Bo;
function Kg(o) {
  var e = (0, qt.getDeepestNode)(o);
  if (e === null || (0, qt.isEmpty)(o))
    return !0;
  if ((0, qt.isNativeInput)(e))
    return e.selectionEnd === 0;
  if ((0, qt.isEmpty)(o))
    return !0;
  var t = (0, Wg.getCaretNodeAndOffset)(), n = t[0], r = t[1];
  return n === null ? !1 : (0, qg.checkContenteditableSliceForEmptiness)(o, n, r, "left");
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.isCaretAtStartOfInput = void 0;
  var e = Zr;
  Object.defineProperty(o, "isCaretAtStartOfInput", { enumerable: !0, get: function() {
    return e.isCaretAtStartOfInput;
  } });
})(Wa);
var qa = {}, Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.save = Xg;
var Vg = tt, Yg = Po;
function Xg() {
  var o = (0, Yg.getRange)(), e = (0, Vg.make)("span");
  if (e.id = "cursor", e.hidden = !0, !!o)
    return o.insertNode(e), function() {
      var t = window.getSelection();
      t && (o.setStartAfter(e), o.setEndAfter(e), t.removeAllRanges(), t.addRange(o), setTimeout(function() {
        e.remove();
      }, 150));
    };
}
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.save = void 0;
  var e = Jr;
  Object.defineProperty(o, "save", { enumerable: !0, get: function() {
    return e.save;
  } });
})(qa);
(function(o) {
  Object.defineProperty(o, "__esModule", { value: !0 }), o.save = o.isCaretAtStartOfInput = o.isCaretAtEndOfInput = o.getRange = o.getCaretNodeAndOffset = o.focus = o.getContenteditableSlice = o.checkContenteditableSliceForEmptiness = void 0;
  var e = pr;
  Object.defineProperty(o, "checkContenteditableSliceForEmptiness", { enumerable: !0, get: function() {
    return e.checkContenteditableSliceForEmptiness;
  } });
  var t = Ha;
  Object.defineProperty(o, "getContenteditableSlice", { enumerable: !0, get: function() {
    return t.getContenteditableSlice;
  } });
  var n = Fa;
  Object.defineProperty(o, "focus", { enumerable: !0, get: function() {
    return n.focus;
  } });
  var r = Xr;
  Object.defineProperty(o, "getCaretNodeAndOffset", { enumerable: !0, get: function() {
    return r.getCaretNodeAndOffset;
  } });
  var i = za;
  Object.defineProperty(o, "getRange", { enumerable: !0, get: function() {
    return i.getRange;
  } });
  var s = Ua;
  Object.defineProperty(o, "isCaretAtEndOfInput", { enumerable: !0, get: function() {
    return s.isCaretAtEndOfInput;
  } });
  var a = Wa;
  Object.defineProperty(o, "isCaretAtStartOfInput", { enumerable: !0, get: function() {
    return a.isCaretAtStartOfInput;
  } });
  var l = qa;
  Object.defineProperty(o, "save", { enumerable: !0, get: function() {
    return l.save;
  } });
})(xa);
class Gg extends P {
  /**
   * All keydowns on Block
   *
   * @param {KeyboardEvent} event - keydown
   */
  keydown(e) {
    switch (this.beforeKeydownProcessing(e), e.keyCode) {
      case B.BACKSPACE:
        this.backspace(e);
        break;
      case B.DELETE:
        this.delete(e);
        break;
      case B.ENTER:
        this.enter(e);
        break;
      case B.DOWN:
      case B.RIGHT:
        this.arrowRightAndDown(e);
        break;
      case B.UP:
      case B.LEFT:
        this.arrowLeftAndUp(e);
        break;
      case B.TAB:
        this.tabPressed(e);
        break;
    }
    e.key === "/" && !e.ctrlKey && !e.metaKey && this.slashPressed(e), e.code === "Slash" && (e.ctrlKey || e.metaKey) && (e.preventDefault(), this.commandSlashPressed());
  }
  /**
   * Fires on keydown before event processing
   *
   * @param {KeyboardEvent} event - keydown
   */
  beforeKeydownProcessing(e) {
    this.needToolbarClosing(e) && qs(e.keyCode) && (this.Editor.Toolbar.close(), e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || this.Editor.BlockSelection.clearSelection(e));
  }
  /**
   * Key up on Block:
   * - shows Inline Toolbar if something selected
   * - shows conversion toolbar with 85% of block selection
   *
   * @param {KeyboardEvent} event - keyup event
   */
  keyup(e) {
    e.shiftKey || this.Editor.UI.checkEmptiness();
  }
  /**
   * Add drop target styles
   *
   * @param {DragEvent} event - drag over event
   */
  dragOver(e) {
    const t = this.Editor.BlockManager.getBlockByChildNode(e.target);
    t.dropTarget = !0;
  }
  /**
   * Remove drop target style
   *
   * @param {DragEvent} event - drag leave event
   */
  dragLeave(e) {
    const t = this.Editor.BlockManager.getBlockByChildNode(e.target);
    t.dropTarget = !1;
  }
  /**
   * Copying selected blocks
   * Before putting to the clipboard we sanitize all blocks and then copy to the clipboard
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  handleCommandC(e) {
    const { BlockSelection: t } = this.Editor;
    t.anyBlockSelected && t.copySelectedBlocks(e);
  }
  /**
   * Copy and Delete selected Blocks
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  handleCommandX(e) {
    const { BlockSelection: t, BlockManager: n, Caret: r } = this.Editor;
    t.anyBlockSelected && t.copySelectedBlocks(e).then(() => {
      const i = n.removeSelectedBlocks(), s = n.insertDefaultBlockAtIndex(i, !0);
      r.setToBlock(s, r.positions.START), t.clearSelection(e);
    });
  }
  /**
   * Tab pressed inside a Block.
   *
   * @param {KeyboardEvent} event - keydown
   */
  tabPressed(e) {
    const { InlineToolbar: t, Caret: n } = this.Editor;
    t.opened || (e.shiftKey ? n.navigatePrevious(!0) : n.navigateNext(!0)) && e.preventDefault();
  }
  /**
   * '/' + 'command' keydown inside a Block
   */
  commandSlashPressed() {
    this.Editor.BlockSelection.selectedBlocks.length > 1 || this.activateBlockSettings();
  }
  /**
   * '/' keydown inside a Block
   *
   * @param event - keydown
   */
  slashPressed(e) {
    this.Editor.BlockManager.currentBlock.isEmpty && (e.preventDefault(), this.Editor.Caret.insertContentAtCaretPosition("/"), this.activateToolbox());
  }
  /**
   * ENTER pressed on block
   *
   * @param {KeyboardEvent} event - keydown
   */
  enter(e) {
    const { BlockManager: t, UI: n } = this.Editor, r = t.currentBlock;
    if (r === void 0 || r.tool.isLineBreaksEnabled || n.someToolbarOpened && n.someFlipperButtonFocused || e.shiftKey && !cn)
      return;
    let i = r;
    r.currentInput !== void 0 && Zt(r.currentInput) && !r.hasMedia ? this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex) : r.currentInput && Jt(r.currentInput) ? i = this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex + 1) : i = this.Editor.BlockManager.split(), this.Editor.Caret.setToBlock(i), this.Editor.Toolbar.moveAndOpen(i), e.preventDefault();
  }
  /**
   * Handle backspace keydown on Block
   *
   * @param {KeyboardEvent} event - keydown
   */
  backspace(e) {
    const { BlockManager: t, Caret: n } = this.Editor, { currentBlock: r, previousBlock: i } = t;
    if (!(r === void 0 || !x.isCollapsed || !r.currentInput || !Zt(r.currentInput))) {
      if (e.preventDefault(), this.Editor.Toolbar.close(), r.currentInput !== r.firstInput) {
        n.navigatePrevious();
        return;
      }
      if (i !== null) {
        if (i.isEmpty) {
          t.removeBlock(i);
          return;
        }
        if (r.isEmpty) {
          t.removeBlock(r);
          const s = t.currentBlock;
          n.setToBlock(s, n.positions.END);
          return;
        }
        Di(i, r) ? this.mergeBlocks(i, r) : n.setToBlock(i, n.positions.END);
      }
    }
  }
  /**
   * Handles delete keydown on Block
   * Removes char after the caret.
   * If caret is at the end of the block, merge next block with current
   *
   * @param {KeyboardEvent} event - keydown
   */
  delete(e) {
    const { BlockManager: t, Caret: n } = this.Editor, { currentBlock: r, nextBlock: i } = t;
    if (!(!x.isCollapsed || !Jt(r.currentInput))) {
      if (e.preventDefault(), this.Editor.Toolbar.close(), r.currentInput !== r.lastInput) {
        n.navigateNext();
        return;
      }
      if (i !== null) {
        if (i.isEmpty) {
          t.removeBlock(i);
          return;
        }
        if (r.isEmpty) {
          t.removeBlock(r), n.setToBlock(i, n.positions.START);
          return;
        }
        Di(r, i) ? this.mergeBlocks(r, i) : n.setToBlock(i, n.positions.START);
      }
    }
  }
  /**
   * Merge passed Blocks
   *
   * @param targetBlock - to which Block we want to merge
   * @param blockToMerge - what Block we want to merge
   */
  mergeBlocks(e, t) {
    const { BlockManager: n, Toolbar: r } = this.Editor;
    e.lastInput !== void 0 && (xa.focus(e.lastInput, !1), n.mergeBlocks(e, t).then(() => {
      r.close();
    }));
  }
  /**
   * Handle right and down keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  arrowRightAndDown(e) {
    const t = Ze.usedKeys.includes(e.keyCode) && (!e.shiftKey || e.keyCode === B.TAB);
    if (this.Editor.UI.someToolbarOpened && t)
      return;
    this.Editor.Toolbar.close();
    const { currentBlock: n } = this.Editor.BlockManager, r = ((n == null ? void 0 : n.currentInput) !== void 0 ? Jt(n.currentInput) : void 0) || this.Editor.BlockSelection.anyBlockSelected;
    if (e.shiftKey && e.keyCode === B.DOWN && r) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState();
      return;
    }
    if (e.keyCode === B.DOWN || e.keyCode === B.RIGHT && !this.isRtl ? this.Editor.Caret.navigateNext() : this.Editor.Caret.navigatePrevious()) {
      e.preventDefault();
      return;
    }
    lo(() => {
      this.Editor.BlockManager.currentBlock && this.Editor.BlockManager.currentBlock.updateCurrentInput();
    }, 20)(), this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * Handle left and up keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  arrowLeftAndUp(e) {
    if (this.Editor.UI.someToolbarOpened) {
      if (Ze.usedKeys.includes(e.keyCode) && (!e.shiftKey || e.keyCode === B.TAB))
        return;
      this.Editor.UI.closeAllToolbars();
    }
    this.Editor.Toolbar.close();
    const { currentBlock: t } = this.Editor.BlockManager, n = ((t == null ? void 0 : t.currentInput) !== void 0 ? Zt(t.currentInput) : void 0) || this.Editor.BlockSelection.anyBlockSelected;
    if (e.shiftKey && e.keyCode === B.UP && n) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState(!1);
      return;
    }
    if (e.keyCode === B.UP || e.keyCode === B.LEFT && !this.isRtl ? this.Editor.Caret.navigatePrevious() : this.Editor.Caret.navigateNext()) {
      e.preventDefault();
      return;
    }
    lo(() => {
      this.Editor.BlockManager.currentBlock && this.Editor.BlockManager.currentBlock.updateCurrentInput();
    }, 20)(), this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * Cases when we need to close Toolbar
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  needToolbarClosing(e) {
    const t = e.keyCode === B.ENTER && this.Editor.Toolbar.toolbox.opened, n = e.keyCode === B.ENTER && this.Editor.BlockSettings.opened, r = e.keyCode === B.ENTER && this.Editor.InlineToolbar.opened, i = e.keyCode === B.TAB;
    return !(e.shiftKey || i || t || n || r);
  }
  /**
   * If Toolbox is not open, then just open it and show plus button
   */
  activateToolbox() {
    this.Editor.Toolbar.opened || this.Editor.Toolbar.moveAndOpen(), this.Editor.Toolbar.toolbox.open();
  }
  /**
   * Open Toolbar and show BlockSettings before flipping Tools
   */
  activateBlockSettings() {
    this.Editor.Toolbar.opened || this.Editor.Toolbar.moveAndOpen(), this.Editor.BlockSettings.opened || this.Editor.BlockSettings.open();
  }
}
class Xo {
  /**
   * @class
   * @param {HTMLElement} workingArea — editor`s working node
   */
  constructor(e) {
    this.blocks = [], this.workingArea = e;
  }
  /**
   * Get length of Block instances array
   *
   * @returns {number}
   */
  get length() {
    return this.blocks.length;
  }
  /**
   * Get Block instances array
   *
   * @returns {Block[]}
   */
  get array() {
    return this.blocks;
  }
  /**
   * Get blocks html elements array
   *
   * @returns {HTMLElement[]}
   */
  get nodes() {
    return Ks(this.workingArea.children);
  }
  /**
   * Proxy trap to implement array-like setter
   *
   * @example
   * blocks[0] = new Block(...)
   * @param {Blocks} instance — Blocks instance
   * @param {PropertyKey} property — block index or any Blocks class property key to set
   * @param {Block} value — value to set
   * @returns {boolean}
   */
  static set(e, t, n) {
    return isNaN(Number(t)) ? (Reflect.set(e, t, n), !0) : (e.insert(+t, n), !0);
  }
  /**
   * Proxy trap to implement array-like getter
   *
   * @param {Blocks} instance — Blocks instance
   * @param {PropertyKey} property — Blocks class property key
   * @returns {Block|*}
   */
  static get(e, t) {
    return isNaN(Number(t)) ? Reflect.get(e, t) : e.get(+t);
  }
  /**
   * Push new Block to the blocks array and append it to working area
   *
   * @param {Block} block - Block to add
   */
  push(e) {
    this.blocks.push(e), this.insertToDOM(e);
  }
  /**
   * Swaps blocks with indexes first and second
   *
   * @param {number} first - first block index
   * @param {number} second - second block index
   * @deprecated — use 'move' instead
   */
  swap(e, t) {
    const n = this.blocks[t];
    p.swap(this.blocks[e].holder, n.holder), this.blocks[t] = this.blocks[e], this.blocks[e] = n;
  }
  /**
   * Move a block from one to another index
   *
   * @param {number} toIndex - new index of the block
   * @param {number} fromIndex - block to move
   */
  move(e, t) {
    const n = this.blocks.splice(t, 1)[0], r = e - 1, i = Math.max(0, r), s = this.blocks[i];
    e > 0 ? this.insertToDOM(n, "afterend", s) : this.insertToDOM(n, "beforebegin", s), this.blocks.splice(e, 0, n);
    const a = this.composeBlockEvent("move", {
      fromIndex: t,
      toIndex: e
    });
    n.call(_e.MOVED, a);
  }
  /**
   * Insert new Block at passed index
   *
   * @param {number} index — index to insert Block
   * @param {Block} block — Block to insert
   * @param {boolean} replace — it true, replace block on given index
   */
  insert(e, t, n = !1) {
    if (!this.length) {
      this.push(t);
      return;
    }
    e > this.length && (e = this.length), n && (this.blocks[e].holder.remove(), this.blocks[e].call(_e.REMOVED));
    const r = n ? 1 : 0;
    if (this.blocks.splice(e, r, t), e > 0) {
      const i = this.blocks[e - 1];
      this.insertToDOM(t, "afterend", i);
    } else {
      const i = this.blocks[e + 1];
      i ? this.insertToDOM(t, "beforebegin", i) : this.insertToDOM(t);
    }
  }
  /**
   * Replaces block under passed index with passed block
   *
   * @param index - index of existed block
   * @param block - new block
   */
  replace(e, t) {
    if (this.blocks[e] === void 0)
      throw Error("Incorrect index");
    this.blocks[e].holder.replaceWith(t.holder), this.blocks[e] = t;
  }
  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index to insert blocks at
   */
  insertMany(e, t) {
    const n = new DocumentFragment();
    for (const r of e)
      n.appendChild(r.holder);
    if (this.length > 0) {
      if (t > 0) {
        const r = Math.min(t - 1, this.length - 1);
        this.blocks[r].holder.after(n);
      } else
        t === 0 && this.workingArea.prepend(n);
      this.blocks.splice(t, 0, ...e);
    } else
      this.blocks.push(...e), this.workingArea.appendChild(n);
    e.forEach((r) => r.call(_e.RENDERED));
  }
  /**
   * Remove block
   *
   * @param {number} index - index of Block to remove
   */
  remove(e) {
    isNaN(e) && (e = this.length - 1), this.blocks[e].holder.remove(), this.blocks[e].call(_e.REMOVED), this.blocks.splice(e, 1);
  }
  /**
   * Remove all blocks
   */
  removeAll() {
    this.workingArea.innerHTML = "", this.blocks.forEach((e) => e.call(_e.REMOVED)), this.blocks.length = 0;
  }
  /**
   * Insert Block after passed target
   *
   * @todo decide if this method is necessary
   * @param {Block} targetBlock — target after which Block should be inserted
   * @param {Block} newBlock — Block to insert
   */
  insertAfter(e, t) {
    const n = this.blocks.indexOf(e);
    this.insert(n + 1, t);
  }
  /**
   * Get Block by index
   *
   * @param {number} index — Block index
   * @returns {Block}
   */
  get(e) {
    return this.blocks[e];
  }
  /**
   * Return index of passed Block
   *
   * @param {Block} block - Block to find
   * @returns {number}
   */
  indexOf(e) {
    return this.blocks.indexOf(e);
  }
  /**
   * Insert new Block into DOM
   *
   * @param {Block} block - Block to insert
   * @param {InsertPosition} position — insert position (if set, will use insertAdjacentElement)
   * @param {Block} target — Block related to position
   */
  insertToDOM(e, t, n) {
    t ? n.holder.insertAdjacentElement(t, e.holder) : this.workingArea.appendChild(e.holder), e.call(_e.RENDERED);
  }
  /**
   * Composes Block event with passed type and details
   *
   * @param {string} type - event type
   * @param {object} detail - event detail
   */
  composeBlockEvent(e, t) {
    return new CustomEvent(e, {
      detail: t
    });
  }
}
const Ki = "block-removed", Vi = "block-added", Zg = "block-moved", Yi = "block-changed";
class Jg {
  constructor() {
    this.completed = Promise.resolve();
  }
  /**
   * Add new promise to queue
   *
   * @param operation - promise should be added to queue
   */
  add(e) {
    return new Promise((t, n) => {
      this.completed = this.completed.then(e).then(t).catch(n);
    });
  }
}
class Qg extends P {
  constructor() {
    super(...arguments), this._currentBlockIndex = -1, this._blocks = null;
  }
  /**
   * Returns current Block index
   *
   * @returns {number}
   */
  get currentBlockIndex() {
    return this._currentBlockIndex;
  }
  /**
   * Set current Block index and fire Block lifecycle callbacks
   *
   * @param {number} newIndex - index of Block to set as current
   */
  set currentBlockIndex(e) {
    this._currentBlockIndex = e;
  }
  /**
   * returns first Block
   *
   * @returns {Block}
   */
  get firstBlock() {
    return this._blocks[0];
  }
  /**
   * returns last Block
   *
   * @returns {Block}
   */
  get lastBlock() {
    return this._blocks[this._blocks.length - 1];
  }
  /**
   * Get current Block instance
   *
   * @returns {Block}
   */
  get currentBlock() {
    return this._blocks[this.currentBlockIndex];
  }
  /**
   * Set passed Block as a current
   *
   * @param block - block to set as a current
   */
  set currentBlock(e) {
    this.currentBlockIndex = this.getBlockIndex(e);
  }
  /**
   * Returns next Block instance
   *
   * @returns {Block|null}
   */
  get nextBlock() {
    return this.currentBlockIndex === this._blocks.length - 1 ? null : this._blocks[this.currentBlockIndex + 1];
  }
  /**
   * Return first Block with inputs after current Block
   *
   * @returns {Block | undefined}
   */
  get nextContentfulBlock() {
    return this.blocks.slice(this.currentBlockIndex + 1).find((e) => !!e.inputs.length);
  }
  /**
   * Return first Block with inputs before current Block
   *
   * @returns {Block | undefined}
   */
  get previousContentfulBlock() {
    return this.blocks.slice(0, this.currentBlockIndex).reverse().find((e) => !!e.inputs.length);
  }
  /**
   * Returns previous Block instance
   *
   * @returns {Block|null}
   */
  get previousBlock() {
    return this.currentBlockIndex === 0 ? null : this._blocks[this.currentBlockIndex - 1];
  }
  /**
   * Get array of Block instances
   *
   * @returns {Block[]} {@link Blocks#array}
   */
  get blocks() {
    return this._blocks.array;
  }
  /**
   * Check if each Block is empty
   *
   * @returns {boolean}
   */
  get isEditorEmpty() {
    return this.blocks.every((e) => e.isEmpty);
  }
  /**
   * Should be called after Editor.UI preparation
   * Define this._blocks property
   */
  prepare() {
    const e = new Xo(this.Editor.UI.nodes.redactor);
    this._blocks = new Proxy(e, {
      set: Xo.set,
      get: Xo.get
    }), this.listeners.on(
      document,
      "copy",
      (t) => this.Editor.BlockEvents.handleCommandC(t)
    );
  }
  /**
   * Toggle read-only state
   *
   * If readOnly is true:
   *  - Unbind event handlers from created Blocks
   *
   * if readOnly is false:
   *  - Bind event handlers to all existing Blocks
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  toggleReadOnly(e) {
    e ? this.disableModuleBindings() : this.enableModuleBindings();
  }
  /**
   * Creates Block instance by tool name
   *
   * @param {object} options - block creation options
   * @param {string} options.tool - tools passed in editor config {@link EditorConfig#tools}
   * @param {string} [options.id] - unique id for this block
   * @param {BlockToolData} [options.data] - constructor params
   * @returns {Block}
   */
  composeBlock({
    tool: e,
    data: t = {},
    id: n = void 0,
    tunes: r = {}
  }) {
    const i = this.Editor.ReadOnly.isEnabled, s = this.Editor.Tools.blockTools.get(e), a = new ee({
      id: n,
      data: t,
      tool: s,
      api: this.Editor.API,
      readOnly: i,
      tunesData: r
    }, this.eventsDispatcher);
    return i || window.requestIdleCallback(() => {
      this.bindBlockEvents(a);
    }, { timeout: 2e3 }), a;
  }
  /**
   * Insert new block into _blocks
   *
   * @param {object} options - insert options
   * @param {string} [options.id] - block's unique id
   * @param {string} [options.tool] - plugin name, by default method inserts the default block type
   * @param {object} [options.data] - plugin data
   * @param {number} [options.index] - index where to insert new Block
   * @param {boolean} [options.needToFocus] - flag shows if needed to update current Block index
   * @param {boolean} [options.replace] - flag shows if block by passed index should be replaced with inserted one
   * @returns {Block}
   */
  insert({
    id: e = void 0,
    tool: t = this.config.defaultBlock,
    data: n = {},
    index: r,
    needToFocus: i = !0,
    replace: s = !1,
    tunes: a = {}
  } = {}) {
    let l = r;
    l === void 0 && (l = this.currentBlockIndex + (s ? 0 : 1));
    const c = this.composeBlock({
      id: e,
      tool: t,
      data: n,
      tunes: a
    });
    return s && this.blockDidMutated(Ki, this.getBlockByIndex(l), {
      index: l
    }), this._blocks.insert(l, c, s), this.blockDidMutated(Vi, c, {
      index: l
    }), i ? this.currentBlockIndex = l : l <= this.currentBlockIndex && this.currentBlockIndex++, c;
  }
  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index where to insert
   */
  insertMany(e, t = 0) {
    this._blocks.insertMany(e, t);
  }
  /**
   * Update Block data.
   *
   * Currently we don't have an 'update' method in the Tools API, so we just create a new block with the same id and type
   * Should not trigger 'block-removed' or 'block-added' events.
   *
   * If neither data nor tunes is provided, return the provided block instead.
   *
   * @param block - block to update
   * @param data - (optional) new data
   * @param tunes - (optional) tune data
   */
  async update(e, t, n) {
    if (!t && !n)
      return e;
    const r = await e.data, i = this.composeBlock({
      id: e.id,
      tool: e.name,
      data: Object.assign({}, r, t ?? {}),
      tunes: n ?? e.tunes
    }), s = this.getBlockIndex(e);
    return this._blocks.replace(s, i), this.blockDidMutated(Yi, i, {
      index: s
    }), i;
  }
  /**
   * Replace passed Block with the new one with specified Tool and data
   *
   * @param block - block to replace
   * @param newTool - new Tool name
   * @param data - new Tool data
   */
  replace(e, t, n) {
    const r = this.getBlockIndex(e);
    return this.insert({
      tool: t,
      data: n,
      index: r,
      replace: !0
    });
  }
  /**
   * Insert pasted content. Call onPaste callback after insert.
   *
   * @param {string} toolName - name of Tool to insert
   * @param {PasteEvent} pasteEvent - pasted data
   * @param {boolean} replace - should replace current block
   */
  paste(e, t, n = !1) {
    const r = this.insert({
      tool: e,
      replace: n
    });
    try {
      window.requestIdleCallback(() => {
        r.call(_e.ON_PASTE, t);
      });
    } catch (i) {
      D(`${e}: onPaste callback call is failed`, "error", i);
    }
    return r;
  }
  /**
   * Insert new default block at passed index
   *
   * @param {number} index - index where Block should be inserted
   * @param {boolean} needToFocus - if true, updates current Block index
   *
   * TODO: Remove method and use insert() with index instead (?)
   * @returns {Block} inserted Block
   */
  insertDefaultBlockAtIndex(e, t = !1) {
    const n = this.composeBlock({ tool: this.config.defaultBlock });
    return this._blocks[e] = n, this.blockDidMutated(Vi, n, {
      index: e
    }), t ? this.currentBlockIndex = e : e <= this.currentBlockIndex && this.currentBlockIndex++, n;
  }
  /**
   * Always inserts at the end
   *
   * @returns {Block}
   */
  insertAtEnd() {
    return this.currentBlockIndex = this.blocks.length - 1, this.insert();
  }
  /**
   * Merge two blocks
   *
   * @param {Block} targetBlock - previous block will be append to this block
   * @param {Block} blockToMerge - block that will be merged with target block
   * @returns {Promise} - the sequence that can be continued
   */
  async mergeBlocks(e, t) {
    let n;
    if (e.name === t.name && e.mergeable) {
      const r = await t.data;
      if (ye(r)) {
        console.error("Could not merge Block. Failed to extract original Block data.");
        return;
      }
      const [i] = sr([r], e.tool.sanitizeConfig);
      n = i;
    } else if (e.mergeable && uo(t, "export") && uo(e, "import")) {
      const r = await t.exportDataAsString(), i = xe(r, e.tool.sanitizeConfig);
      n = Hi(i, e.tool.conversionConfig);
    }
    n !== void 0 && (await e.mergeWith(n), this.removeBlock(t), this.currentBlockIndex = this._blocks.indexOf(e));
  }
  /**
   * Remove passed Block
   *
   * @param block - Block to remove
   * @param addLastBlock - if true, adds new default block at the end. @todo remove this logic and use event-bus instead
   */
  removeBlock(e, t = !0) {
    return new Promise((n) => {
      const r = this._blocks.indexOf(e);
      if (!this.validateIndex(r))
        throw new Error("Can't find a Block to remove");
      e.destroy(), this._blocks.remove(r), this.blockDidMutated(Ki, e, {
        index: r
      }), this.currentBlockIndex >= r && this.currentBlockIndex--, this.blocks.length ? r === 0 && (this.currentBlockIndex = 0) : (this.unsetCurrentBlock(), t && this.insert()), n();
    });
  }
  /**
   * Remove only selected Blocks
   * and returns first Block index where started removing...
   *
   * @returns {number|undefined}
   */
  removeSelectedBlocks() {
    let e;
    for (let t = this.blocks.length - 1; t >= 0; t--)
      this.blocks[t].selected && (this.removeBlock(this.blocks[t]), e = t);
    return e;
  }
  /**
   * Attention!
   * After removing insert the new default typed Block and focus on it
   * Removes all blocks
   */
  removeAllBlocks() {
    for (let e = this.blocks.length - 1; e >= 0; e--)
      this._blocks.remove(e);
    this.unsetCurrentBlock(), this.insert(), this.currentBlock.firstInput.focus();
  }
  /**
   * Split current Block
   * 1. Extract content from Caret position to the Block`s end
   * 2. Insert a new Block below current one with extracted content
   *
   * @returns {Block}
   */
  split() {
    const e = this.Editor.Caret.extractFragmentFromCaretPosition(), t = p.make("div");
    t.appendChild(e);
    const n = {
      text: p.isEmpty(t) ? "" : t.innerHTML
    };
    return this.insert({ data: n });
  }
  /**
   * Returns Block by passed index
   *
   * @param {number} index - index to get. -1 to get last
   * @returns {Block}
   */
  getBlockByIndex(e) {
    return e === -1 && (e = this._blocks.length - 1), this._blocks[e];
  }
  /**
   * Returns an index for passed Block
   *
   * @param block - block to find index
   */
  getBlockIndex(e) {
    return this._blocks.indexOf(e);
  }
  /**
   * Returns the Block by passed id
   *
   * @param id - id of block to get
   * @returns {Block}
   */
  getBlockById(e) {
    return this._blocks.array.find((t) => t.id === e);
  }
  /**
   * Get Block instance by html element
   *
   * @param {Node} element - html element to get Block by
   */
  getBlock(e) {
    p.isElement(e) || (e = e.parentNode);
    const t = this._blocks.nodes, n = e.closest(`.${ee.CSS.wrapper}`), r = t.indexOf(n);
    if (r >= 0)
      return this._blocks[r];
  }
  /**
   * 1) Find first-level Block from passed child Node
   * 2) Mark it as current
   *
   * @param {Node} childNode - look ahead from this node.
   * @returns {Block | undefined} can return undefined in case when the passed child note is not a part of the current editor instance
   */
  setCurrentBlockByChildNode(e) {
    p.isElement(e) || (e = e.parentNode);
    const t = e.closest(`.${ee.CSS.wrapper}`);
    if (!t)
      return;
    const n = t.closest(`.${this.Editor.UI.CSS.editorWrapper}`);
    if (n != null && n.isEqualNode(this.Editor.UI.nodes.wrapper))
      return this.currentBlockIndex = this._blocks.nodes.indexOf(t), this.currentBlock.updateCurrentInput(), this.currentBlock;
  }
  /**
   * Return block which contents passed node
   *
   * @param {Node} childNode - node to get Block by
   * @returns {Block}
   */
  getBlockByChildNode(e) {
    if (!e || !(e instanceof Node))
      return;
    p.isElement(e) || (e = e.parentNode);
    const t = e.closest(`.${ee.CSS.wrapper}`);
    return this.blocks.find((n) => n.holder === t);
  }
  /**
   * Swap Blocks Position
   *
   * @param {number} fromIndex - index of first block
   * @param {number} toIndex - index of second block
   * @deprecated — use 'move' instead
   */
  swap(e, t) {
    this._blocks.swap(e, t), this.currentBlockIndex = t;
  }
  /**
   * Move a block to a new index
   *
   * @param {number} toIndex - index where to move Block
   * @param {number} fromIndex - index of Block to move
   */
  move(e, t = this.currentBlockIndex) {
    if (isNaN(e) || isNaN(t)) {
      D("Warning during 'move' call: incorrect indices provided.", "warn");
      return;
    }
    if (!this.validateIndex(e) || !this.validateIndex(t)) {
      D("Warning during 'move' call: indices cannot be lower than 0 or greater than the amount of blocks.", "warn");
      return;
    }
    this._blocks.move(e, t), this.currentBlockIndex = e, this.blockDidMutated(Zg, this.currentBlock, {
      fromIndex: t,
      toIndex: e
    });
  }
  /**
   * Converts passed Block to the new Tool
   * Uses Conversion Config
   *
   * @param blockToConvert - Block that should be converted
   * @param targetToolName - name of the Tool to convert to
   * @param blockDataOverrides - optional new Block data overrides
   */
  async convert(e, t, n) {
    if (!await e.save())
      throw new Error("Could not convert Block. Failed to extract original Block data.");
    const r = this.Editor.Tools.blockTools.get(t);
    if (!r)
      throw new Error(`Could not convert Block. Tool «${t}» not found.`);
    const i = await e.exportDataAsString(), s = xe(
      i,
      r.sanitizeConfig
    );
    let a = Hi(s, r.conversionConfig, r.settings);
    return n && (a = Object.assign(a, n)), this.replace(e, r.name, a);
  }
  /**
   * Sets current Block Index -1 which means unknown
   * and clear highlights
   */
  unsetCurrentBlock() {
    this.currentBlockIndex = -1;
  }
  /**
   * Clears Editor
   *
   * @param {boolean} needToAddDefaultBlock - 1) in internal calls (for example, in api.blocks.render)
   *                                             we don't need to add an empty default block
   *                                        2) in api.blocks.clear we should add empty block
   */
  async clear(e = !1) {
    const t = new Jg();
    this.blocks.forEach((n) => {
      t.add(async () => {
        await this.removeBlock(n, !1);
      });
    }), await t.completed, this.unsetCurrentBlock(), e && this.insert(), this.Editor.UI.checkEmptiness();
  }
  /**
   * Cleans up all the block tools' resources
   * This is called when editor is destroyed
   */
  async destroy() {
    await Promise.all(this.blocks.map((e) => e.destroy()));
  }
  /**
   * Bind Block events
   *
   * @param {Block} block - Block to which event should be bound
   */
  bindBlockEvents(e) {
    const { BlockEvents: t } = this.Editor;
    this.readOnlyMutableListeners.on(e.holder, "keydown", (n) => {
      t.keydown(n);
    }), this.readOnlyMutableListeners.on(e.holder, "keyup", (n) => {
      t.keyup(n);
    }), this.readOnlyMutableListeners.on(e.holder, "dragover", (n) => {
      t.dragOver(n);
    }), this.readOnlyMutableListeners.on(e.holder, "dragleave", (n) => {
      t.dragLeave(n);
    }), e.on("didMutated", (n) => this.blockDidMutated(Yi, n, {
      index: this.getBlockIndex(n)
    }));
  }
  /**
   * Disable mutable handlers and bindings
   */
  disableModuleBindings() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Enables all module handlers and bindings for all Blocks
   */
  enableModuleBindings() {
    this.readOnlyMutableListeners.on(
      document,
      "cut",
      (e) => this.Editor.BlockEvents.handleCommandX(e)
    ), this.blocks.forEach((e) => {
      this.bindBlockEvents(e);
    });
  }
  /**
   * Validates that the given index is not lower than 0 or higher than the amount of blocks
   *
   * @param {number} index - index of blocks array to validate
   * @returns {boolean}
   */
  validateIndex(e) {
    return !(e < 0 || e >= this._blocks.length);
  }
  /**
   * Block mutation callback
   *
   * @param mutationType - what happened with block
   * @param block - mutated block
   * @param detailData - additional data to pass with change event
   */
  blockDidMutated(e, t, n) {
    const r = new CustomEvent(e, {
      detail: {
        target: new Te(t),
        ...n
      }
    });
    return this.eventsDispatcher.emit(Js, {
      event: r
    }), t;
  }
}
class em extends P {
  constructor() {
    super(...arguments), this.anyBlockSelectedCache = null, this.needToSelectAll = !1, this.nativeInputSelected = !1, this.readyToBlockSelection = !1;
  }
  /**
   * Sanitizer Config
   *
   * @returns {SanitizerConfig}
   */
  get sanitizerConfig() {
    return {
      p: {},
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {},
      ol: {},
      ul: {},
      li: {},
      br: !0,
      img: {
        src: !0,
        width: !0,
        height: !0
      },
      a: {
        href: !0
      },
      b: {},
      i: {},
      u: {}
    };
  }
  /**
   * Flag that identifies all Blocks selection
   *
   * @returns {boolean}
   */
  get allBlocksSelected() {
    const { BlockManager: e } = this.Editor;
    return e.blocks.every((t) => t.selected === !0);
  }
  /**
   * Set selected all blocks
   *
   * @param {boolean} state - state to set
   */
  set allBlocksSelected(e) {
    const { BlockManager: t } = this.Editor;
    t.blocks.forEach((n) => {
      n.selected = e;
    }), this.clearCache();
  }
  /**
   * Flag that identifies any Block selection
   *
   * @returns {boolean}
   */
  get anyBlockSelected() {
    const { BlockManager: e } = this.Editor;
    return this.anyBlockSelectedCache === null && (this.anyBlockSelectedCache = e.blocks.some((t) => t.selected === !0)), this.anyBlockSelectedCache;
  }
  /**
   * Return selected Blocks array
   *
   * @returns {Block[]}
   */
  get selectedBlocks() {
    return this.Editor.BlockManager.blocks.filter((e) => e.selected);
  }
  /**
   * Module Preparation
   * Registers Shortcuts CMD+A and CMD+C
   * to select all and copy them
   */
  prepare() {
    this.selection = new x(), ht.add({
      name: "CMD+A",
      handler: (e) => {
        const { BlockManager: t, ReadOnly: n } = this.Editor;
        if (n.isEnabled) {
          e.preventDefault(), this.selectAllBlocks();
          return;
        }
        t.currentBlock && this.handleCommandA(e);
      },
      on: this.Editor.UI.nodes.redactor
    });
  }
  /**
   * Toggle read-only state
   *
   *  - Remove all ranges
   *  - Unselect all Blocks
   */
  toggleReadOnly() {
    x.get().removeAllRanges(), this.allBlocksSelected = !1;
  }
  /**
   * Remove selection of Block
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  unSelectBlockByIndex(e) {
    const { BlockManager: t } = this.Editor;
    let n;
    isNaN(e) ? n = t.currentBlock : n = t.getBlockByIndex(e), n.selected = !1, this.clearCache();
  }
  /**
   * Clear selection from Blocks
   *
   * @param {Event} reason - event caused clear of selection
   * @param {boolean} restoreSelection - if true, restore saved selection
   */
  clearSelection(e, t = !1) {
    const { BlockManager: n, Caret: r, RectangleSelection: i } = this.Editor;
    this.needToSelectAll = !1, this.nativeInputSelected = !1, this.readyToBlockSelection = !1;
    const s = e && e instanceof KeyboardEvent, a = s && qs(e.keyCode);
    if (this.anyBlockSelected && s && a && !x.isSelectionExists) {
      const l = n.removeSelectedBlocks();
      n.insertDefaultBlockAtIndex(l, !0), r.setToBlock(n.currentBlock), lo(() => {
        const c = e.key;
        r.insertContentAtCaretPosition(c.length > 1 ? "" : c);
      }, 20)();
    }
    if (this.Editor.CrossBlockSelection.clear(e), !this.anyBlockSelected || i.isRectActivated()) {
      this.Editor.RectangleSelection.clearSelection();
      return;
    }
    t && this.selection.restore(), this.allBlocksSelected = !1;
  }
  /**
   * Reduce each Block and copy its content
   *
   * @param {ClipboardEvent} e - copy/cut event
   * @returns {Promise<void>}
   */
  copySelectedBlocks(e) {
    e.preventDefault();
    const t = p.make("div");
    this.selectedBlocks.forEach((i) => {
      const s = xe(i.holder.innerHTML, this.sanitizerConfig), a = p.make("p");
      a.innerHTML = s, t.appendChild(a);
    });
    const n = Array.from(t.childNodes).map((i) => i.textContent).join(`

`), r = t.innerHTML;
    return e.clipboardData.setData("text/plain", n), e.clipboardData.setData("text/html", r), Promise.all(this.selectedBlocks.map((i) => i.save())).then((i) => {
      try {
        e.clipboardData.setData(this.Editor.Paste.MIME_TYPE, JSON.stringify(i));
      } catch {
      }
    });
  }
  /**
   * Select Block by its index
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  selectBlockByIndex(e) {
    const { BlockManager: t } = this.Editor, n = t.getBlockByIndex(e);
    n !== void 0 && this.selectBlock(n);
  }
  /**
   * Select passed Block
   *
   * @param {Block} block - Block to select
   */
  selectBlock(e) {
    this.selection.save(), x.get().removeAllRanges(), e.selected = !0, this.clearCache(), this.Editor.InlineToolbar.close();
  }
  /**
   * Remove selection from passed Block
   *
   * @param {Block} block - Block to unselect
   */
  unselectBlock(e) {
    e.selected = !1, this.clearCache();
  }
  /**
   * Clear anyBlockSelected cache
   */
  clearCache() {
    this.anyBlockSelectedCache = null;
  }
  /**
   * Module destruction
   * De-registers Shortcut CMD+A
   */
  destroy() {
    ht.remove(this.Editor.UI.nodes.redactor, "CMD+A");
  }
  /**
   * First CMD+A selects all input content by native behaviour,
   * next CMD+A keypress selects all blocks
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  handleCommandA(e) {
    if (this.Editor.RectangleSelection.clearSelection(), p.isNativeInput(e.target) && !this.readyToBlockSelection) {
      this.readyToBlockSelection = !0;
      return;
    }
    const t = this.Editor.BlockManager.getBlock(e.target), n = t.inputs;
    if (n.length > 1 && !this.readyToBlockSelection) {
      this.readyToBlockSelection = !0;
      return;
    }
    if (n.length === 1 && !this.needToSelectAll) {
      this.needToSelectAll = !0;
      return;
    }
    this.needToSelectAll ? (e.preventDefault(), this.selectAllBlocks(), this.needToSelectAll = !1, this.readyToBlockSelection = !1) : this.readyToBlockSelection && (e.preventDefault(), this.selectBlock(t), this.needToSelectAll = !0);
  }
  /**
   * Select All Blocks
   * Each Block has selected setter that makes Block copyable
   */
  selectAllBlocks() {
    this.selection.save(), x.get().removeAllRanges(), this.allBlocksSelected = !0, this.Editor.InlineToolbar.close();
  }
}
class mo extends P {
  /**
   * Allowed caret positions in input
   *
   * @static
   * @returns {{START: string, END: string, DEFAULT: string}}
   */
  get positions() {
    return {
      START: "start",
      END: "end",
      DEFAULT: "default"
    };
  }
  /**
   * Elements styles that can be useful for Caret Module
   */
  static get CSS() {
    return {
      shadowCaret: "cdx-shadow-caret"
    };
  }
  /**
   * Method gets Block instance and puts caret to the text node with offset
   * There two ways that method applies caret position:
   *   - first found text node: sets at the beginning, but you can pass an offset
   *   - last found text node: sets at the end of the node. Also, you can customize the behaviour
   *
   * @param {Block} block - Block class
   * @param {string} position - position where to set caret.
   *                            If default - leave default behaviour and apply offset if it's passed
   * @param {number} offset - caret offset regarding to the text node
   */
  setToBlock(e, t = this.positions.DEFAULT, n = 0) {
    var r;
    const { BlockManager: i, BlockSelection: s } = this.Editor;
    if (s.clearSelection(), !e.focusable) {
      (r = window.getSelection()) == null || r.removeAllRanges(), s.selectBlock(e), i.currentBlock = e;
      return;
    }
    let a;
    switch (t) {
      case this.positions.START:
        a = e.firstInput;
        break;
      case this.positions.END:
        a = e.lastInput;
        break;
      default:
        a = e.currentInput;
    }
    if (!a)
      return;
    const l = p.getDeepestNode(a, t === this.positions.END), c = p.getContentLength(l);
    switch (!0) {
      case t === this.positions.START:
        n = 0;
        break;
      case t === this.positions.END:
      case n > c:
        n = c;
        break;
    }
    this.set(l, n), i.setCurrentBlockByChildNode(e.holder), i.currentBlock.currentInput = a;
  }
  /**
   * Set caret to the current input of current Block.
   *
   * @param {HTMLElement} input - input where caret should be set
   * @param {string} position - position of the caret.
   *                            If default - leave default behaviour and apply offset if it's passed
   * @param {number} offset - caret offset regarding to the text node
   */
  setToInput(e, t = this.positions.DEFAULT, n = 0) {
    const { currentBlock: r } = this.Editor.BlockManager, i = p.getDeepestNode(e);
    switch (t) {
      case this.positions.START:
        this.set(i, 0);
        break;
      case this.positions.END:
        this.set(i, p.getContentLength(i));
        break;
      default:
        n && this.set(i, n);
    }
    r.currentInput = e;
  }
  /**
   * Creates Document Range and sets caret to the element with offset
   *
   * @param {HTMLElement} element - target node.
   * @param {number} offset - offset
   */
  set(e, t = 0) {
    const { top: n, bottom: r } = x.setCursor(e, t), { innerHeight: i } = window;
    n < 0 ? window.scrollBy(0, n - 30) : r > i && window.scrollBy(0, r - i + 30);
  }
  /**
   * Set Caret to the last Block
   * If last block is not empty, append another empty block
   */
  setToTheLastBlock() {
    const e = this.Editor.BlockManager.lastBlock;
    if (e)
      if (e.tool.isDefault && e.isEmpty)
        this.setToBlock(e);
      else {
        const t = this.Editor.BlockManager.insertAtEnd();
        this.setToBlock(t);
      }
  }
  /**
   * Extract content fragment of current Block from Caret position to the end of the Block
   */
  extractFragmentFromCaretPosition() {
    const e = x.get();
    if (e.rangeCount) {
      const t = e.getRangeAt(0), n = this.Editor.BlockManager.currentBlock.currentInput;
      if (t.deleteContents(), n)
        if (p.isNativeInput(n)) {
          const r = n, i = document.createDocumentFragment(), s = r.value.substring(0, r.selectionStart), a = r.value.substring(r.selectionStart);
          return i.textContent = a, r.value = s, i;
        } else {
          const r = t.cloneRange();
          return r.selectNodeContents(n), r.setStart(t.endContainer, t.endOffset), r.extractContents();
        }
    }
  }
  /**
   * Set's caret to the next Block or Tool`s input
   * Before moving caret, we should check if caret position is at the end of Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {boolean} force - pass true to skip check for caret position
   */
  navigateNext(e = !1) {
    const { BlockManager: t } = this.Editor, { currentBlock: n, nextBlock: r } = t;
    if (n === void 0)
      return !1;
    const { nextInput: i, currentInput: s } = n, a = s !== void 0 ? Jt(s) : void 0;
    let l = r;
    const c = e || a || !n.focusable;
    if (i && c)
      return this.setToInput(i, this.positions.START), !0;
    if (l === null) {
      if (n.tool.isDefault || !c)
        return !1;
      l = t.insertAtEnd();
    }
    return c ? (this.setToBlock(l, this.positions.START), !0) : !1;
  }
  /**
   * Set's caret to the previous Tool`s input or Block
   * Before moving caret, we should check if caret position is start of the Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {boolean} force - pass true to skip check for caret position
   */
  navigatePrevious(e = !1) {
    const { currentBlock: t, previousBlock: n } = this.Editor.BlockManager;
    if (!t)
      return !1;
    const { previousInput: r, currentInput: i } = t, s = i !== void 0 ? Zt(i) : void 0, a = e || s || !t.focusable;
    return r && a ? (this.setToInput(r, this.positions.END), !0) : n !== null && a ? (this.setToBlock(n, this.positions.END), !0) : !1;
  }
  /**
   * Inserts shadow element after passed element where caret can be placed
   *
   * @param {Element} element - element after which shadow caret should be inserted
   */
  createShadow(e) {
    const t = document.createElement("span");
    t.classList.add(mo.CSS.shadowCaret), e.insertAdjacentElement("beforeend", t);
  }
  /**
   * Restores caret position
   *
   * @param {HTMLElement} element - element where caret should be restored
   */
  restoreCaret(e) {
    const t = e.querySelector(`.${mo.CSS.shadowCaret}`);
    if (!t)
      return;
    new x().expandToTag(t);
    const n = document.createRange();
    n.selectNode(t), n.extractContents();
  }
  /**
   * Inserts passed content at caret position
   *
   * @param {string} content - content to insert
   */
  insertContentAtCaretPosition(e) {
    const t = document.createDocumentFragment(), n = document.createElement("div"), r = x.get(), i = x.range;
    n.innerHTML = e, Array.from(n.childNodes).forEach((c) => t.appendChild(c)), t.childNodes.length === 0 && t.appendChild(new Text());
    const s = t.lastChild;
    i.deleteContents(), i.insertNode(t);
    const a = document.createRange(), l = s.nodeType === Node.TEXT_NODE ? s : s.firstChild;
    l !== null && l.textContent !== null && a.setStart(l, l.textContent.length), r.removeAllRanges(), r.addRange(a);
  }
}
class tm extends P {
  constructor() {
    super(...arguments), this.onMouseUp = () => {
      this.listeners.off(document, "mouseover", this.onMouseOver), this.listeners.off(document, "mouseup", this.onMouseUp);
    }, this.onMouseOver = (e) => {
      const { BlockManager: t, BlockSelection: n } = this.Editor;
      if (e.relatedTarget === null && e.target === null)
        return;
      const r = t.getBlockByChildNode(e.relatedTarget) || this.lastSelectedBlock, i = t.getBlockByChildNode(e.target);
      if (!(!r || !i) && i !== r) {
        if (r === this.firstSelectedBlock) {
          x.get().removeAllRanges(), r.selected = !0, i.selected = !0, n.clearCache();
          return;
        }
        if (i === this.firstSelectedBlock) {
          r.selected = !1, i.selected = !1, n.clearCache();
          return;
        }
        this.Editor.InlineToolbar.close(), this.toggleBlocksSelectedState(r, i), this.lastSelectedBlock = i;
      }
    };
  }
  /**
   * Module preparation
   *
   * @returns {Promise}
   */
  async prepare() {
    this.listeners.on(document, "mousedown", (e) => {
      this.enableCrossBlockSelection(e);
    });
  }
  /**
   * Sets up listeners
   *
   * @param {MouseEvent} event - mouse down event
   */
  watchSelection(e) {
    if (e.button !== Fh.LEFT)
      return;
    const { BlockManager: t } = this.Editor;
    this.firstSelectedBlock = t.getBlock(e.target), this.lastSelectedBlock = this.firstSelectedBlock, this.listeners.on(document, "mouseover", this.onMouseOver), this.listeners.on(document, "mouseup", this.onMouseUp);
  }
  /**
   * Return boolean is cross block selection started:
   * there should be at least 2 selected blocks
   */
  get isCrossBlockSelectionStarted() {
    return !!this.firstSelectedBlock && !!this.lastSelectedBlock && this.firstSelectedBlock !== this.lastSelectedBlock;
  }
  /**
   * Change selection state of the next Block
   * Used for CBS via Shift + arrow keys
   *
   * @param {boolean} next - if true, toggle next block. Previous otherwise
   */
  toggleBlockSelectedState(e = !0) {
    const { BlockManager: t, BlockSelection: n } = this.Editor;
    this.lastSelectedBlock || (this.lastSelectedBlock = this.firstSelectedBlock = t.currentBlock), this.firstSelectedBlock === this.lastSelectedBlock && (this.firstSelectedBlock.selected = !0, n.clearCache(), x.get().removeAllRanges());
    const r = t.blocks.indexOf(this.lastSelectedBlock) + (e ? 1 : -1), i = t.blocks[r];
    i && (this.lastSelectedBlock.selected !== i.selected ? (i.selected = !0, n.clearCache()) : (this.lastSelectedBlock.selected = !1, n.clearCache()), this.lastSelectedBlock = i, this.Editor.InlineToolbar.close(), i.holder.scrollIntoView({
      block: "nearest"
    }));
  }
  /**
   * Clear saved state
   *
   * @param {Event} reason - event caused clear of selection
   */
  clear(e) {
    const { BlockManager: t, BlockSelection: n, Caret: r } = this.Editor, i = t.blocks.indexOf(this.firstSelectedBlock), s = t.blocks.indexOf(this.lastSelectedBlock);
    if (n.anyBlockSelected && i > -1 && s > -1 && e && e instanceof KeyboardEvent)
      switch (e.keyCode) {
        case B.DOWN:
        case B.RIGHT:
          r.setToBlock(t.blocks[Math.max(i, s)], r.positions.END);
          break;
        case B.UP:
        case B.LEFT:
          r.setToBlock(t.blocks[Math.min(i, s)], r.positions.START);
          break;
        default:
          r.setToBlock(t.blocks[Math.max(i, s)], r.positions.END);
      }
    this.firstSelectedBlock = this.lastSelectedBlock = null;
  }
  /**
   * Enables Cross Block Selection
   *
   * @param {MouseEvent} event - mouse down event
   */
  enableCrossBlockSelection(e) {
    const { UI: t } = this.Editor;
    x.isCollapsed || this.Editor.BlockSelection.clearSelection(e), t.nodes.redactor.contains(e.target) ? this.watchSelection(e) : this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * Change blocks selection state between passed two blocks.
   *
   * @param {Block} firstBlock - first block in range
   * @param {Block} lastBlock - last block in range
   */
  toggleBlocksSelectedState(e, t) {
    const { BlockManager: n, BlockSelection: r } = this.Editor, i = n.blocks.indexOf(e), s = n.blocks.indexOf(t), a = e.selected !== t.selected;
    for (let l = Math.min(i, s); l <= Math.max(i, s); l++) {
      const c = n.blocks[l];
      c !== this.firstSelectedBlock && c !== (a ? e : t) && (n.blocks[l].selected = !n.blocks[l].selected, r.clearCache());
    }
  }
}
class om extends P {
  constructor() {
    super(...arguments), this.isStartedAtEditor = !1;
  }
  /**
   * Toggle read-only state
   *
   * if state is true:
   *  - disable all drag-n-drop event handlers
   *
   * if state is false:
   *  - restore drag-n-drop event handlers
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  toggleReadOnly(e) {
    e ? this.disableModuleBindings() : this.enableModuleBindings();
  }
  /**
   * Add drag events listeners to editor zone
   */
  enableModuleBindings() {
    const { UI: e } = this.Editor;
    this.readOnlyMutableListeners.on(e.nodes.holder, "drop", async (t) => {
      await this.processDrop(t);
    }, !0), this.readOnlyMutableListeners.on(e.nodes.holder, "dragstart", () => {
      this.processDragStart();
    }), this.readOnlyMutableListeners.on(e.nodes.holder, "dragover", (t) => {
      this.processDragOver(t);
    }, !0);
  }
  /**
   * Unbind drag-n-drop event handlers
   */
  disableModuleBindings() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Handle drop event
   *
   * @param {DragEvent} dropEvent - drop event
   */
  async processDrop(e) {
    const {
      BlockManager: t,
      Paste: n,
      Caret: r
    } = this.Editor;
    e.preventDefault(), t.blocks.forEach((s) => {
      s.dropTarget = !1;
    }), x.isAtEditor && !x.isCollapsed && this.isStartedAtEditor && document.execCommand("delete"), this.isStartedAtEditor = !1;
    const i = t.setCurrentBlockByChildNode(e.target);
    if (i)
      this.Editor.Caret.setToBlock(i, r.positions.END);
    else {
      const s = t.setCurrentBlockByChildNode(t.lastBlock.holder);
      this.Editor.Caret.setToBlock(s, r.positions.END);
    }
    await n.processDataTransfer(e.dataTransfer, !0);
  }
  /**
   * Handle drag start event
   */
  processDragStart() {
    x.isAtEditor && !x.isCollapsed && (this.isStartedAtEditor = !0), this.Editor.InlineToolbar.close();
  }
  /**
   * @param {DragEvent} dragEvent - drag event
   */
  processDragOver(e) {
    e.preventDefault();
  }
}
const nm = 180, rm = 400;
class im extends P {
  /**
   * Prepare the module
   *
   * @param options - options used by the modification observer module
   * @param options.config - Editor configuration object
   * @param options.eventsDispatcher - common Editor event bus
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.disabled = !1, this.batchingTimeout = null, this.batchingOnChangeQueue = /* @__PURE__ */ new Map(), this.batchTime = rm, this.mutationObserver = new MutationObserver((n) => {
      this.redactorChanged(n);
    }), this.eventsDispatcher.on(Js, (n) => {
      this.particularBlockChanged(n.event);
    }), this.eventsDispatcher.on(Qs, () => {
      this.disable();
    }), this.eventsDispatcher.on(ea, () => {
      this.enable();
    });
  }
  /**
   * Enables onChange event
   */
  enable() {
    this.mutationObserver.observe(
      this.Editor.UI.nodes.redactor,
      {
        childList: !0,
        subtree: !0,
        characterData: !0,
        attributes: !0
      }
    ), this.disabled = !1;
  }
  /**
   * Disables onChange event
   */
  disable() {
    this.mutationObserver.disconnect(), this.disabled = !0;
  }
  /**
   * Call onChange event passed to Editor.js configuration
   *
   * @param event - some of our custom change events
   */
  particularBlockChanged(e) {
    this.disabled || !W(this.config.onChange) || (this.batchingOnChangeQueue.set(`block:${e.detail.target.id}:event:${e.type}`, e), this.batchingTimeout && clearTimeout(this.batchingTimeout), this.batchingTimeout = setTimeout(() => {
      let t;
      this.batchingOnChangeQueue.size === 1 ? t = this.batchingOnChangeQueue.values().next().value : t = Array.from(this.batchingOnChangeQueue.values()), this.config.onChange && this.config.onChange(this.Editor.API.methods, t), this.batchingOnChangeQueue.clear();
    }, this.batchTime));
  }
  /**
   * Fired on every blocks wrapper dom change
   *
   * @param mutations - mutations happened
   */
  redactorChanged(e) {
    this.eventsDispatcher.emit(dn, {
      mutations: e
    });
  }
}
const Ka = class Va extends P {
  constructor() {
    super(...arguments), this.MIME_TYPE = "application/x-editor-js", this.toolsTags = {}, this.tagsByTool = {}, this.toolsPatterns = [], this.toolsFiles = {}, this.exceptionList = [], this.processTool = (e) => {
      try {
        const t = e.create({}, {}, !1);
        if (e.pasteConfig === !1) {
          this.exceptionList.push(e.name);
          return;
        }
        if (!W(t.onPaste))
          return;
        this.getTagsConfig(e), this.getFilesConfig(e), this.getPatternsConfig(e);
      } catch (t) {
        D(
          `Paste handling for «${e.name}» Tool hasn't been set up because of the error`,
          "warn",
          t
        );
      }
    }, this.handlePasteEvent = async (e) => {
      const { BlockManager: t, Toolbar: n } = this.Editor, r = t.setCurrentBlockByChildNode(e.target);
      !r || this.isNativeBehaviour(e.target) && !e.clipboardData.types.includes("Files") || r && this.exceptionList.includes(r.name) || (e.preventDefault(), this.processDataTransfer(e.clipboardData), n.close());
    };
  }
  /**
   * Set onPaste callback and collect tools` paste configurations
   */
  async prepare() {
    this.processTools();
  }
  /**
   * Set read-only state
   *
   * @param {boolean} readOnlyEnabled - read only flag value
   */
  toggleReadOnly(e) {
    e ? this.unsetCallback() : this.setCallback();
  }
  /**
   * Handle pasted or dropped data transfer object
   *
   * @param {DataTransfer} dataTransfer - pasted or dropped data transfer object
   * @param {boolean} isDragNDrop - true if data transfer comes from drag'n'drop events
   */
  async processDataTransfer(e, t = !1) {
    const { Tools: n } = this.Editor, r = e.types;
    if ((r.includes ? r.includes("Files") : r.contains("Files")) && !ye(this.toolsFiles)) {
      await this.processFiles(e.files);
      return;
    }
    const i = e.getData(this.MIME_TYPE), s = e.getData("text/plain");
    let a = e.getData("text/html");
    if (i)
      try {
        this.insertEditorJSData(JSON.parse(i));
        return;
      } catch {
      }
    t && s.trim() && a.trim() && (a = "<p>" + (a.trim() ? a : s) + "</p>");
    const l = Object.keys(this.toolsTags).reduce((u, h) => (u[h.toLowerCase()] = this.toolsTags[h].sanitizationConfig ?? {}, u), {}), c = Object.assign({}, l, n.getAllInlineToolsSanitizeConfig(), { br: {} }), d = xe(a, c);
    !d.trim() || d.trim() === s || !p.isHTMLString(d) ? await this.processText(s) : await this.processText(d, !0);
  }
  /**
   * Process pasted text and divide them into Blocks
   *
   * @param {string} data - text to process. Can be HTML or plain.
   * @param {boolean} isHTML - if passed string is HTML, this parameter should be true
   */
  async processText(e, t = !1) {
    const { Caret: n, BlockManager: r } = this.Editor, i = t ? this.processHTML(e) : this.processPlain(e);
    if (!i.length)
      return;
    if (i.length === 1) {
      i[0].isBlock ? this.processSingleBlock(i.pop()) : this.processInlinePaste(i.pop());
      return;
    }
    const s = r.currentBlock && r.currentBlock.tool.isDefault && r.currentBlock.isEmpty;
    i.map(
      async (a, l) => this.insertBlock(a, l === 0 && s)
    ), r.currentBlock && n.setToBlock(r.currentBlock, n.positions.END);
  }
  /**
   * Set onPaste callback handler
   */
  setCallback() {
    this.listeners.on(this.Editor.UI.nodes.holder, "paste", this.handlePasteEvent);
  }
  /**
   * Unset onPaste callback handler
   */
  unsetCallback() {
    this.listeners.off(this.Editor.UI.nodes.holder, "paste", this.handlePasteEvent);
  }
  /**
   * Get and process tool`s paste configs
   */
  processTools() {
    const e = this.Editor.Tools.blockTools;
    Array.from(e.values()).forEach(this.processTool);
  }
  /**
   * Get tags name list from either tag name or sanitization config.
   *
   * @param {string | object} tagOrSanitizeConfig - tag name or sanitize config object.
   * @returns {string[]} array of tags.
   */
  collectTagNames(e) {
    return Le(e) ? [e] : oe(e) ? Object.keys(e) : [];
  }
  /**
   * Get tags to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getTagsConfig(e) {
    if (e.pasteConfig === !1)
      return;
    const t = e.pasteConfig.tags || [], n = [];
    t.forEach((r) => {
      const i = this.collectTagNames(r);
      n.push(...i), i.forEach((s) => {
        if (Object.prototype.hasOwnProperty.call(this.toolsTags, s)) {
          D(
            `Paste handler for «${e.name}» Tool on «${s}» tag is skipped because it is already used by «${this.toolsTags[s].tool.name}» Tool.`,
            "warn"
          );
          return;
        }
        const a = oe(r) ? r[s] : null;
        this.toolsTags[s.toUpperCase()] = {
          tool: e,
          sanitizationConfig: a
        };
      });
    }), this.tagsByTool[e.name] = n.map((r) => r.toUpperCase());
  }
  /**
   * Get files` types and extensions to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getFilesConfig(e) {
    if (e.pasteConfig === !1)
      return;
    const { files: t = {} } = e.pasteConfig;
    let { extensions: n, mimeTypes: r } = t;
    !n && !r || (n && !Array.isArray(n) && (D(`«extensions» property of the onDrop config for «${e.name}» Tool should be an array`), n = []), r && !Array.isArray(r) && (D(`«mimeTypes» property of the onDrop config for «${e.name}» Tool should be an array`), r = []), r && (r = r.filter((i) => Kh(i) ? !0 : (D(`MIME type value «${i}» for the «${e.name}» Tool is not a valid MIME type`, "warn"), !1))), this.toolsFiles[e.name] = {
      extensions: n || [],
      mimeTypes: r || []
    });
  }
  /**
   * Get RegExp patterns to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getPatternsConfig(e) {
    e.pasteConfig === !1 || !e.pasteConfig.patterns || ye(e.pasteConfig.patterns) || Object.entries(e.pasteConfig.patterns).forEach(([t, n]) => {
      n instanceof RegExp || D(
        `Pattern ${n} for «${e.name}» Tool is skipped because it should be a Regexp instance.`,
        "warn"
      ), this.toolsPatterns.push({
        key: t,
        pattern: n,
        tool: e
      });
    });
  }
  /**
   * Check if browser behavior suits better
   *
   * @param {EventTarget} element - element where content has been pasted
   * @returns {boolean}
   */
  isNativeBehaviour(e) {
    return p.isNativeInput(e);
  }
  /**
   * Get files from data transfer object and insert related Tools
   *
   * @param {FileList} items - pasted or dropped items
   */
  async processFiles(e) {
    const { BlockManager: t } = this.Editor;
    let n;
    n = await Promise.all(
      Array.from(e).map((i) => this.processFile(i))
    ), n = n.filter((i) => !!i);
    const r = t.currentBlock.tool.isDefault && t.currentBlock.isEmpty;
    n.forEach(
      (i, s) => {
        t.paste(i.type, i.event, s === 0 && r);
      }
    );
  }
  /**
   * Get information about file and find Tool to handle it
   *
   * @param {File} file - file to process
   */
  async processFile(e) {
    const t = qh(e), n = Object.entries(this.toolsFiles).find(([i, { mimeTypes: s, extensions: a }]) => {
      const [l, c] = e.type.split("/"), d = a.find((h) => h.toLowerCase() === t.toLowerCase()), u = s.find((h) => {
        const [g, f] = h.split("/");
        return g === l && (f === c || f === "*");
      });
      return !!d || !!u;
    });
    if (!n)
      return;
    const [r] = n;
    return {
      event: this.composePasteEvent("file", {
        file: e
      }),
      type: r
    };
  }
  /**
   * Split HTML string to blocks and return it as array of Block data
   *
   * @param {string} innerHTML - html string to process
   * @returns {PasteData[]}
   */
  processHTML(e) {
    const { Tools: t } = this.Editor, n = p.make("DIV");
    return n.innerHTML = e, this.getNodes(n).map((r) => {
      let i, s = t.defaultTool, a = !1;
      switch (r.nodeType) {
        case Node.DOCUMENT_FRAGMENT_NODE:
          i = p.make("div"), i.appendChild(r);
          break;
        case Node.ELEMENT_NODE:
          i = r, a = !0, this.toolsTags[i.tagName] && (s = this.toolsTags[i.tagName].tool);
          break;
      }
      const { tags: l } = s.pasteConfig || { tags: [] }, c = l.reduce((h, g) => (this.collectTagNames(g).forEach((f) => {
        const b = oe(g) ? g[f] : null;
        h[f.toLowerCase()] = b || {};
      }), h), {}), d = Object.assign({}, c, s.baseSanitizeConfig);
      if (i.tagName.toLowerCase() === "table") {
        const h = xe(i.outerHTML, d);
        i = p.make("div", void 0, {
          innerHTML: h
        }).firstChild;
      } else
        i.innerHTML = xe(i.innerHTML, d);
      const u = this.composePasteEvent("tag", {
        data: i
      });
      return {
        content: i,
        isBlock: a,
        tool: s.name,
        event: u
      };
    }).filter((r) => {
      const i = p.isEmpty(r.content), s = p.isSingleTag(r.content);
      return !i || s;
    });
  }
  /**
   * Split plain text by new line symbols and return it as array of Block data
   *
   * @param {string} plain - string to process
   * @returns {PasteData[]}
   */
  processPlain(e) {
    const { defaultBlock: t } = this.config;
    if (!e)
      return [];
    const n = t;
    return e.split(/\r?\n/).filter((r) => r.trim()).map((r) => {
      const i = p.make("div");
      i.textContent = r;
      const s = this.composePasteEvent("tag", {
        data: i
      });
      return {
        content: i,
        tool: n,
        isBlock: !1,
        event: s
      };
    });
  }
  /**
   * Process paste of single Block tool content
   *
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  async processSingleBlock(e) {
    const { Caret: t, BlockManager: n } = this.Editor, { currentBlock: r } = n;
    if (!r || e.tool !== r.name || !p.containsOnlyInlineElements(e.content.innerHTML)) {
      this.insertBlock(e, (r == null ? void 0 : r.tool.isDefault) && r.isEmpty);
      return;
    }
    t.insertContentAtCaretPosition(e.content.innerHTML);
  }
  /**
   * Process paste to single Block:
   * 1. Find patterns` matches
   * 2. Insert new block if it is not the same type as current one
   * 3. Just insert text if there is no substitutions
   *
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  async processInlinePaste(e) {
    const { BlockManager: t, Caret: n } = this.Editor, { content: r } = e;
    if (t.currentBlock && t.currentBlock.tool.isDefault && r.textContent.length < Va.PATTERN_PROCESSING_MAX_LENGTH) {
      const i = await this.processPattern(r.textContent);
      if (i) {
        const s = t.currentBlock && t.currentBlock.tool.isDefault && t.currentBlock.isEmpty, a = t.paste(i.tool, i.event, s);
        n.setToBlock(a, n.positions.END);
        return;
      }
    }
    if (t.currentBlock && t.currentBlock.currentInput) {
      const i = t.currentBlock.tool.baseSanitizeConfig;
      document.execCommand(
        "insertHTML",
        !1,
        xe(r.innerHTML, i)
      );
    } else
      this.insertBlock(e);
  }
  /**
   * Get patterns` matches
   *
   * @param {string} text - text to process
   * @returns {Promise<{event: PasteEvent, tool: string}>}
   */
  async processPattern(e) {
    const t = this.toolsPatterns.find((n) => {
      const r = n.pattern.exec(e);
      return r ? e === r.shift() : !1;
    });
    return t ? {
      event: this.composePasteEvent("pattern", {
        key: t.key,
        data: e
      }),
      tool: t.tool.name
    } : void 0;
  }
  /**
   * Insert pasted Block content to Editor
   *
   * @param {PasteData} data - data to insert
   * @param {boolean} canReplaceCurrentBlock - if true and is current Block is empty, will replace current Block
   * @returns {void}
   */
  insertBlock(e, t = !1) {
    const { BlockManager: n, Caret: r } = this.Editor, { currentBlock: i } = n;
    let s;
    if (t && i && i.isEmpty) {
      s = n.paste(e.tool, e.event, !0), r.setToBlock(s, r.positions.END);
      return;
    }
    s = n.paste(e.tool, e.event), r.setToBlock(s, r.positions.END);
  }
  /**
   * Insert data passed as application/x-editor-js JSON
   *
   * @param {Array} blocks — Blocks' data to insert
   * @returns {void}
   */
  insertEditorJSData(e) {
    const { BlockManager: t, Caret: n, Tools: r } = this.Editor;
    sr(
      e,
      (i) => r.blockTools.get(i).sanitizeConfig
    ).forEach(({ tool: i, data: s }, a) => {
      let l = !1;
      a === 0 && (l = t.currentBlock && t.currentBlock.tool.isDefault && t.currentBlock.isEmpty);
      const c = t.insert({
        tool: i,
        data: s,
        replace: l
      });
      n.setToBlock(c, n.positions.END);
    });
  }
  /**
   * Fetch nodes from Element node
   *
   * @param {Node} node - current node
   * @param {Node[]} nodes - processed nodes
   * @param {Node} destNode - destination node
   */
  processElementNode(e, t, n) {
    const r = Object.keys(this.toolsTags), i = e, { tool: s } = this.toolsTags[i.tagName] || {}, a = this.tagsByTool[s == null ? void 0 : s.name] || [], l = r.includes(i.tagName), c = p.blockElements.includes(i.tagName.toLowerCase()), d = Array.from(i.children).some(
      ({ tagName: h }) => r.includes(h) && !a.includes(h)
    ), u = Array.from(i.children).some(
      ({ tagName: h }) => p.blockElements.includes(h.toLowerCase())
    );
    if (!c && !l && !d)
      return n.appendChild(i), [...t, n];
    if (l && !d || c && !u && !d)
      return [...t, n, i];
  }
  /**
   * Recursively divide HTML string to two types of nodes:
   * 1. Block element
   * 2. Document Fragments contained text and markup tags like a, b, i etc.
   *
   * @param {Node} wrapper - wrapper of paster HTML content
   * @returns {Node[]}
   */
  getNodes(e) {
    const t = Array.from(e.childNodes);
    let n;
    const r = (i, s) => {
      if (p.isEmpty(s) && !p.isSingleTag(s))
        return i;
      const a = i[i.length - 1];
      let l = new DocumentFragment();
      switch (a && p.isFragment(a) && (l = i.pop()), s.nodeType) {
        case Node.ELEMENT_NODE:
          if (n = this.processElementNode(s, i, l), n)
            return n;
          break;
        case Node.TEXT_NODE:
          return l.appendChild(s), [...i, l];
        default:
          return [...i, l];
      }
      return [...i, ...Array.from(s.childNodes).reduce(r, [])];
    };
    return t.reduce(r, []);
  }
  /**
   * Compose paste event with passed type and detail
   *
   * @param {string} type - event type
   * @param {PasteEventDetail} detail - event detail
   */
  composePasteEvent(e, t) {
    return new CustomEvent(e, {
      detail: t
    });
  }
};
Ka.PATTERN_PROCESSING_MAX_LENGTH = 450;
let sm = Ka;
class am extends P {
  constructor() {
    super(...arguments), this.toolsDontSupportReadOnly = [], this.readOnlyEnabled = !1;
  }
  /**
   * Returns state of read only mode
   */
  get isEnabled() {
    return this.readOnlyEnabled;
  }
  /**
   * Set initial state
   */
  async prepare() {
    const { Tools: e } = this.Editor, { blockTools: t } = e, n = [];
    Array.from(t.entries()).forEach(([r, i]) => {
      i.isReadOnlySupported || n.push(r);
    }), this.toolsDontSupportReadOnly = n, this.config.readOnly && n.length > 0 && this.throwCriticalError(), this.toggle(this.config.readOnly, !0);
  }
  /**
   * Set read-only mode or toggle current state
   * Call all Modules `toggleReadOnly` method and re-render Editor
   *
   * @param state - (optional) read-only state or toggle
   * @param isInitial - (optional) true when editor is initializing
   */
  async toggle(e = !this.readOnlyEnabled, t = !1) {
    e && this.toolsDontSupportReadOnly.length > 0 && this.throwCriticalError();
    const n = this.readOnlyEnabled;
    this.readOnlyEnabled = e;
    for (const i in this.Editor)
      this.Editor[i].toggleReadOnly && this.Editor[i].toggleReadOnly(e);
    if (n === e)
      return this.readOnlyEnabled;
    if (t)
      return this.readOnlyEnabled;
    this.Editor.ModificationsObserver.disable();
    const r = await this.Editor.Saver.save();
    return await this.Editor.BlockManager.clear(), await this.Editor.Renderer.render(r.blocks), this.Editor.ModificationsObserver.enable(), this.readOnlyEnabled;
  }
  /**
   * Throws an error about tools which don't support read-only mode
   */
  throwCriticalError() {
    throw new Zs(
      `To enable read-only mode all connected tools should support it. Tools ${this.toolsDontSupportReadOnly.join(", ")} don't support read-only mode.`
    );
  }
}
class _t extends P {
  constructor() {
    super(...arguments), this.isRectSelectionActivated = !1, this.SCROLL_SPEED = 3, this.HEIGHT_OF_SCROLL_ZONE = 40, this.BOTTOM_SCROLL_ZONE = 1, this.TOP_SCROLL_ZONE = 2, this.MAIN_MOUSE_BUTTON = 0, this.mousedown = !1, this.isScrolling = !1, this.inScrollZone = null, this.startX = 0, this.startY = 0, this.mouseX = 0, this.mouseY = 0, this.stackOfSelected = [], this.listenerIds = [];
  }
  /**
   * CSS classes for the Block
   *
   * @returns {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      overlay: "codex-editor-overlay",
      overlayContainer: "codex-editor-overlay__container",
      rect: "codex-editor-overlay__rectangle",
      topScrollZone: "codex-editor-overlay__scroll-zone--top",
      bottomScrollZone: "codex-editor-overlay__scroll-zone--bottom"
    };
  }
  /**
   * Module Preparation
   * Creating rect and hang handlers
   */
  prepare() {
    this.enableModuleBindings();
  }
  /**
   * Init rect params
   *
   * @param {number} pageX - X coord of mouse
   * @param {number} pageY - Y coord of mouse
   */
  startSelection(e, t) {
    const n = document.elementFromPoint(e - window.pageXOffset, t - window.pageYOffset);
    n.closest(`.${this.Editor.Toolbar.CSS.toolbar}`) || (this.Editor.BlockSelection.allBlocksSelected = !1, this.clearSelection(), this.stackOfSelected = []);
    const r = [
      `.${ee.CSS.content}`,
      `.${this.Editor.Toolbar.CSS.toolbar}`,
      `.${this.Editor.InlineToolbar.CSS.inlineToolbar}`
    ], i = n.closest("." + this.Editor.UI.CSS.editorWrapper), s = r.some((a) => !!n.closest(a));
    !i || s || (this.mousedown = !0, this.startX = e, this.startY = t);
  }
  /**
   * Clear all params to end selection
   */
  endSelection() {
    this.mousedown = !1, this.startX = 0, this.startY = 0, this.overlayRectangle.style.display = "none";
  }
  /**
   * is RectSelection Activated
   */
  isRectActivated() {
    return this.isRectSelectionActivated;
  }
  /**
   * Mark that selection is end
   */
  clearSelection() {
    this.isRectSelectionActivated = !1;
  }
  /**
   * Sets Module necessary event handlers
   */
  enableModuleBindings() {
    const { container: e } = this.genHTML();
    this.listeners.on(e, "mousedown", (t) => {
      this.processMouseDown(t);
    }, !1), this.listeners.on(document.body, "mousemove", sn((t) => {
      this.processMouseMove(t);
    }, 10), {
      passive: !0
    }), this.listeners.on(document.body, "mouseleave", () => {
      this.processMouseLeave();
    }), this.listeners.on(window, "scroll", sn((t) => {
      this.processScroll(t);
    }, 10), {
      passive: !0
    }), this.listeners.on(document.body, "mouseup", () => {
      this.processMouseUp();
    }, !1);
  }
  /**
   * Handle mouse down events
   *
   * @param {MouseEvent} mouseEvent - mouse event payload
   */
  processMouseDown(e) {
    e.button === this.MAIN_MOUSE_BUTTON && (e.target.closest(p.allInputsSelector) !== null || this.startSelection(e.pageX, e.pageY));
  }
  /**
   * Handle mouse move events
   *
   * @param {MouseEvent} mouseEvent - mouse event payload
   */
  processMouseMove(e) {
    this.changingRectangle(e), this.scrollByZones(e.clientY);
  }
  /**
   * Handle mouse leave
   */
  processMouseLeave() {
    this.clearSelection(), this.endSelection();
  }
  /**
   * @param {MouseEvent} mouseEvent - mouse event payload
   */
  processScroll(e) {
    this.changingRectangle(e);
  }
  /**
   * Handle mouse up
   */
  processMouseUp() {
    this.clearSelection(), this.endSelection();
  }
  /**
   * Scroll If mouse in scroll zone
   *
   * @param {number} clientY - Y coord of mouse
   */
  scrollByZones(e) {
    if (this.inScrollZone = null, e <= this.HEIGHT_OF_SCROLL_ZONE && (this.inScrollZone = this.TOP_SCROLL_ZONE), document.documentElement.clientHeight - e <= this.HEIGHT_OF_SCROLL_ZONE && (this.inScrollZone = this.BOTTOM_SCROLL_ZONE), !this.inScrollZone) {
      this.isScrolling = !1;
      return;
    }
    this.isScrolling || (this.scrollVertical(this.inScrollZone === this.TOP_SCROLL_ZONE ? -this.SCROLL_SPEED : this.SCROLL_SPEED), this.isScrolling = !0);
  }
  /**
   * Generates required HTML elements
   *
   * @returns {Object<string, Element>}
   */
  genHTML() {
    const { UI: e } = this.Editor, t = e.nodes.holder.querySelector("." + e.CSS.editorWrapper), n = p.make("div", _t.CSS.overlay, {}), r = p.make("div", _t.CSS.overlayContainer, {}), i = p.make("div", _t.CSS.rect, {});
    return r.appendChild(i), n.appendChild(r), t.appendChild(n), this.overlayRectangle = i, {
      container: t,
      overlay: n
    };
  }
  /**
   * Activates scrolling if blockSelection is active and mouse is in scroll zone
   *
   * @param {number} speed - speed of scrolling
   */
  scrollVertical(e) {
    if (!(this.inScrollZone && this.mousedown))
      return;
    const t = window.pageYOffset;
    window.scrollBy(0, e), this.mouseY += window.pageYOffset - t, setTimeout(() => {
      this.scrollVertical(e);
    }, 0);
  }
  /**
   * Handles the change in the rectangle and its effect
   *
   * @param {MouseEvent} event - mouse event
   */
  changingRectangle(e) {
    if (!this.mousedown)
      return;
    e.pageY !== void 0 && (this.mouseX = e.pageX, this.mouseY = e.pageY);
    const { rightPos: t, leftPos: n, index: r } = this.genInfoForMouseSelection(), i = this.startX > t && this.mouseX > t, s = this.startX < n && this.mouseX < n;
    this.rectCrossesBlocks = !(i || s), this.isRectSelectionActivated || (this.rectCrossesBlocks = !1, this.isRectSelectionActivated = !0, this.shrinkRectangleToPoint(), this.overlayRectangle.style.display = "block"), this.updateRectangleSize(), this.Editor.Toolbar.close(), r !== void 0 && (this.trySelectNextBlock(r), this.inverseSelection(), x.get().removeAllRanges());
  }
  /**
   * Shrink rect to singular point
   */
  shrinkRectangleToPoint() {
    this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`, this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.bottom = `calc(100% - ${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.right = `calc(100% - ${this.startX - window.pageXOffset}px`;
  }
  /**
   * Select or unselect all of blocks in array if rect is out or in selectable area
   */
  inverseSelection() {
    const e = this.Editor.BlockManager.getBlockByIndex(this.stackOfSelected[0]).selected;
    if (this.rectCrossesBlocks && !e)
      for (const t of this.stackOfSelected)
        this.Editor.BlockSelection.selectBlockByIndex(t);
    if (!this.rectCrossesBlocks && e)
      for (const t of this.stackOfSelected)
        this.Editor.BlockSelection.unSelectBlockByIndex(t);
  }
  /**
   * Updates size of rectangle
   */
  updateRectangleSize() {
    this.mouseY >= this.startY ? (this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.bottom = `calc(100% - ${this.mouseY - window.pageYOffset}px`) : (this.overlayRectangle.style.bottom = `calc(100% - ${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.top = `${this.mouseY - window.pageYOffset}px`), this.mouseX >= this.startX ? (this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`, this.overlayRectangle.style.right = `calc(100% - ${this.mouseX - window.pageXOffset}px`) : (this.overlayRectangle.style.right = `calc(100% - ${this.startX - window.pageXOffset}px`, this.overlayRectangle.style.left = `${this.mouseX - window.pageXOffset}px`);
  }
  /**
   * Collects information needed to determine the behavior of the rectangle
   *
   * @returns {object} index - index next Block, leftPos - start of left border of Block, rightPos - right border
   */
  genInfoForMouseSelection() {
    const e = document.body.offsetWidth / 2, t = this.mouseY - window.pageYOffset, n = document.elementFromPoint(e, t), r = this.Editor.BlockManager.getBlockByChildNode(n);
    let i;
    r !== void 0 && (i = this.Editor.BlockManager.blocks.findIndex((d) => d.holder === r.holder));
    const s = this.Editor.BlockManager.lastBlock.holder.querySelector("." + ee.CSS.content), a = Number.parseInt(window.getComputedStyle(s).width, 10) / 2, l = e - a, c = e + a;
    return {
      index: i,
      leftPos: l,
      rightPos: c
    };
  }
  /**
   * Select block with index index
   *
   * @param index - index of block in redactor
   */
  addBlockInSelection(e) {
    this.rectCrossesBlocks && this.Editor.BlockSelection.selectBlockByIndex(e), this.stackOfSelected.push(e);
  }
  /**
   * Adds a block to the selection and determines which blocks should be selected
   *
   * @param {object} index - index of new block in the reactor
   */
  trySelectNextBlock(e) {
    const t = this.stackOfSelected[this.stackOfSelected.length - 1] === e, n = this.stackOfSelected.length, r = 1, i = -1, s = 0;
    if (t)
      return;
    const a = this.stackOfSelected[n - 1] - this.stackOfSelected[n - 2] > 0;
    let l = s;
    n > 1 && (l = a ? r : i);
    const c = e > this.stackOfSelected[n - 1] && l === r, d = e < this.stackOfSelected[n - 1] && l === i, u = !(c || d || l === s);
    if (!u && (e > this.stackOfSelected[n - 1] || this.stackOfSelected[n - 1] === void 0)) {
      let f = this.stackOfSelected[n - 1] + 1 || e;
      for (f; f <= e; f++)
        this.addBlockInSelection(f);
      return;
    }
    if (!u && e < this.stackOfSelected[n - 1]) {
      for (let f = this.stackOfSelected[n - 1] - 1; f >= e; f--)
        this.addBlockInSelection(f);
      return;
    }
    if (!u)
      return;
    let h = n - 1, g;
    for (e > this.stackOfSelected[n - 1] ? g = () => e > this.stackOfSelected[h] : g = () => e < this.stackOfSelected[h]; g(); )
      this.rectCrossesBlocks && this.Editor.BlockSelection.unSelectBlockByIndex(this.stackOfSelected[h]), this.stackOfSelected.pop(), h--;
  }
}
class lm extends P {
  /**
   * Renders passed blocks as one batch
   *
   * @param blocksData - blocks to render
   */
  async render(e) {
    return new Promise((t) => {
      const { Tools: n, BlockManager: r } = this.Editor;
      if (e.length === 0)
        r.insert();
      else {
        const i = e.map(({ type: s, data: a, tunes: l, id: c }) => {
          n.available.has(s) === !1 && (be(`Tool «${s}» is not found. Check 'tools' property at the Editor.js config.`, "warn"), a = this.composeStubDataForTool(s, a, c), s = n.stubTool);
          let d;
          try {
            d = r.composeBlock({
              id: c,
              tool: s,
              data: a,
              tunes: l
            });
          } catch (u) {
            D(`Block «${s}» skipped because of plugins error`, "error", {
              data: a,
              error: u
            }), a = this.composeStubDataForTool(s, a, c), s = n.stubTool, d = r.composeBlock({
              id: c,
              tool: s,
              data: a,
              tunes: l
            });
          }
          return d;
        });
        r.insertMany(i);
      }
      window.requestIdleCallback(() => {
        t();
      }, { timeout: 2e3 });
    });
  }
  /**
   * Create data for the Stub Tool that will be used instead of unavailable tool
   *
   * @param tool - unavailable tool name to stub
   * @param data - data of unavailable block
   * @param [id] - id of unavailable block
   */
  composeStubDataForTool(e, t, n) {
    const { Tools: r } = this.Editor;
    let i = e;
    if (r.unavailable.has(e)) {
      const s = r.unavailable.get(e).toolbox;
      s !== void 0 && s[0].title !== void 0 && (i = s[0].title);
    }
    return {
      savedData: {
        id: n,
        type: e,
        data: t
      },
      title: i
    };
  }
}
class cm extends P {
  /**
   * Composes new chain of Promises to fire them alternatelly
   *
   * @returns {OutputData}
   */
  async save() {
    const { BlockManager: e, Tools: t } = this.Editor, n = e.blocks, r = [];
    try {
      n.forEach((a) => {
        r.push(this.getSavedData(a));
      });
      const i = await Promise.all(r), s = await sr(i, (a) => t.blockTools.get(a).sanitizeConfig);
      return this.makeOutput(s);
    } catch (i) {
      be("Saving failed due to the Error %o", "error", i);
    }
  }
  /**
   * Saves and validates
   *
   * @param {Block} block - Editor's Tool
   * @returns {ValidatedData} - Tool's validated data
   */
  async getSavedData(e) {
    const t = await e.save(), n = t && await e.validate(t.data);
    return {
      ...t,
      isValid: n
    };
  }
  /**
   * Creates output object with saved data, time and version of editor
   *
   * @param {ValidatedData} allExtractedData - data extracted from Blocks
   * @returns {OutputData}
   */
  makeOutput(e) {
    const t = [];
    return e.forEach(({ id: n, tool: r, data: i, tunes: s, isValid: a }) => {
      if (!a) {
        D(`Block «${r}» skipped because saved data is invalid`);
        return;
      }
      if (r === this.Editor.Tools.stubTool) {
        t.push(i);
        return;
      }
      const l = {
        id: n,
        type: r,
        data: i,
        ...!ye(s) && {
          tunes: s
        }
      };
      t.push(l);
    }), {
      time: +/* @__PURE__ */ new Date(),
      blocks: t,
      version: "2.31.0-rc.7"
    };
  }
}
(function() {
  try {
    if (typeof document < "u") {
      var o = document.createElement("style");
      o.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-block:only-of-type .ce-paragraph[data-placeholder-active]:empty:before,.ce-block:only-of-type .ce-paragraph[data-placeholder-active][data-empty=true]:before{content:attr(data-placeholder-active)}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")), document.head.appendChild(o);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
const dm = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
function um(o) {
  const e = document.createElement("div");
  e.innerHTML = o.trim();
  const t = document.createDocumentFragment();
  return t.append(...Array.from(e.childNodes)), t;
}
/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
class Qr {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data: e, config: t, api: n, readOnly: r }) {
    this.api = n, this.readOnly = r, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = t.placeholder ? t.placeholder : Qr.DEFAULT_PLACEHOLDER, this._data = e ?? {}, this._element = null, this._preserveBlank = t.preserveBlank ?? !1;
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete" || !this._element)
      return;
    const { textContent: t } = this._element;
    t === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  drawView() {
    const e = document.createElement("DIV");
    return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = "false", e.dataset.placeholderActive = this.api.i18n.t(this._placeholder), this._data.text && (e.innerHTML = this._data.text), this.readOnly || (e.contentEditable = "true", e.addEventListener("keyup", this.onKeyUp)), e;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element = this.drawView(), this._element;
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {ParagraphData} data
   * @public
   */
  merge(e) {
    if (!this._element)
      return;
    this._data.text += e.text;
    const t = um(e.text);
    this._element.appendChild(t), this._element.normalize();
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return !(e.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(e) {
    return {
      text: e.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {HTMLPasteEvent} event - event with pasted data
   */
  onPaste(e) {
    const t = {
      text: e.detail.data.innerHTML
    };
    this._data = t, window.requestAnimationFrame(() => {
      this._element && (this._element.innerHTML = this._data.text || "");
    });
  }
  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   * @returns {ConversionConfig}
   */
  static get conversionConfig() {
    return {
      export: "text",
      // to convert Paragraph to other block, use 'text' property of saved data
      import: "text"
      // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }
  /**
   * Sanitizer rules
   * @returns {SanitizerConfig} - Edtior.js sanitizer config
   */
  static get sanitize() {
    return {
      text: {
        br: !0
      }
    };
  }
  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {PasteConfig} - Paragraph Paste Setting
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }
  /**
   * Icon and title for displaying at the Toolbox
   *
   * @returns {ToolboxConfig} - Paragraph Toolbox Setting
   */
  static get toolbox() {
    return {
      icon: dm,
      title: "Text"
    };
  }
}
class ei {
  constructor() {
    this.commandName = "bold";
  }
  /**
   * Sanitizer Rule
   * Leave <b> tags
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      b: {}
    };
  }
  /**
   * Create button for Inline Toolbar
   */
  render() {
    return {
      icon: Rp,
      name: "bold",
      onActivate: () => {
        document.execCommand(this.commandName);
      },
      isActive: () => document.queryCommandState(this.commandName)
    };
  }
  /**
   * Set a shortcut
   *
   * @returns {boolean}
   */
  get shortcut() {
    return "CMD+B";
  }
}
ei.isInline = !0;
ei.title = "Bold";
class ti {
  constructor() {
    this.commandName = "italic", this.CSS = {
      button: "ce-inline-tool",
      buttonActive: "ce-inline-tool--active",
      buttonModifier: "ce-inline-tool--italic"
    }, this.nodes = {
      button: null
    };
  }
  /**
   * Sanitizer Rule
   * Leave <i> tags
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      i: {}
    };
  }
  /**
   * Create button for Inline Toolbar
   */
  render() {
    return this.nodes.button = document.createElement("button"), this.nodes.button.type = "button", this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier), this.nodes.button.innerHTML = qp, this.nodes.button;
  }
  /**
   * Wrap range with <i> tag
   */
  surround() {
    document.execCommand(this.commandName);
  }
  /**
   * Check selection and set activated state to button if there are <i> tag
   */
  checkState() {
    const e = document.queryCommandState(this.commandName);
    return this.nodes.button.classList.toggle(this.CSS.buttonActive, e), e;
  }
  /**
   * Set a shortcut
   */
  get shortcut() {
    return "CMD+I";
  }
}
ti.isInline = !0;
ti.title = "Italic";
class oi {
  /**
   * @param api - Editor.js API
   */
  constructor({ api: e }) {
    this.commandLink = "createLink", this.commandUnlink = "unlink", this.ENTER_KEY = 13, this.CSS = {
      button: "ce-inline-tool",
      buttonActive: "ce-inline-tool--active",
      buttonModifier: "ce-inline-tool--link",
      buttonUnlink: "ce-inline-tool--unlink",
      input: "ce-inline-tool-input",
      inputShowed: "ce-inline-tool-input--showed"
    }, this.nodes = {
      button: null,
      input: null
    }, this.inputOpened = !1, this.toolbar = e.toolbar, this.inlineToolbar = e.inlineToolbar, this.notifier = e.notifier, this.i18n = e.i18n, this.selection = new x();
  }
  /**
   * Sanitizer Rule
   * Leave <a> tags
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      a: {
        href: !0,
        target: "_blank",
        rel: "nofollow"
      }
    };
  }
  /**
   * Create button for Inline Toolbar
   */
  render() {
    return this.nodes.button = document.createElement("button"), this.nodes.button.type = "button", this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier), this.nodes.button.innerHTML = Fi, this.nodes.button;
  }
  /**
   * Input for the link
   */
  renderActions() {
    return this.nodes.input = document.createElement("input"), this.nodes.input.placeholder = this.i18n.t("Add a link"), this.nodes.input.enterKeyHint = "done", this.nodes.input.classList.add(this.CSS.input), this.nodes.input.addEventListener("keydown", (e) => {
      e.keyCode === this.ENTER_KEY && this.enterPressed(e);
    }), this.nodes.input;
  }
  /**
   * Handle clicks on the Inline Toolbar icon
   *
   * @param {Range} range - range to wrap with link
   */
  surround(e) {
    if (e) {
      this.inputOpened ? (this.selection.restore(), this.selection.removeFakeBackground()) : (this.selection.setFakeBackground(), this.selection.save());
      const t = this.selection.findParentTag("A");
      if (t) {
        this.selection.expandToTag(t), this.unlink(), this.closeActions(), this.checkState(), this.toolbar.close();
        return;
      }
    }
    this.toggleActions();
  }
  /**
   * Check selection and set activated state to button if there are <a> tag
   */
  checkState() {
    const e = this.selection.findParentTag("A");
    if (e) {
      this.nodes.button.innerHTML = Xp, this.nodes.button.classList.add(this.CSS.buttonUnlink), this.nodes.button.classList.add(this.CSS.buttonActive), this.openActions();
      const t = e.getAttribute("href");
      this.nodes.input.value = t !== "null" ? t : "", this.selection.save();
    } else
      this.nodes.button.innerHTML = Fi, this.nodes.button.classList.remove(this.CSS.buttonUnlink), this.nodes.button.classList.remove(this.CSS.buttonActive);
    return !!e;
  }
  /**
   * Function called with Inline Toolbar closing
   */
  clear() {
    this.closeActions();
  }
  /**
   * Set a shortcut
   */
  get shortcut() {
    return "CMD+K";
  }
  /**
   * Show/close link input
   */
  toggleActions() {
    this.inputOpened ? this.closeActions(!1) : this.openActions(!0);
  }
  /**
   * @param {boolean} needFocus - on link creation we need to focus input. On editing - nope.
   */
  openActions(e = !1) {
    this.nodes.input.classList.add(this.CSS.inputShowed), e && this.nodes.input.focus(), this.inputOpened = !0;
  }
  /**
   * Close input
   *
   * @param {boolean} clearSavedSelection — we don't need to clear saved selection
   *                                        on toggle-clicks on the icon of opened Toolbar
   */
  closeActions(e = !0) {
    if (this.selection.isFakeBackgroundEnabled) {
      const t = new x();
      t.save(), this.selection.restore(), this.selection.removeFakeBackground(), t.restore();
    }
    this.nodes.input.classList.remove(this.CSS.inputShowed), this.nodes.input.value = "", e && this.selection.clearSaved(), this.inputOpened = !1;
  }
  /**
   * Enter pressed on input
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  enterPressed(e) {
    let t = this.nodes.input.value || "";
    if (!t.trim()) {
      this.selection.restore(), this.unlink(), e.preventDefault(), this.closeActions();
      return;
    }
    if (!this.validateURL(t)) {
      this.notifier.show({
        message: "Pasted link is not valid.",
        style: "error"
      }), D("Incorrect Link pasted", "warn", t);
      return;
    }
    t = this.prepareLink(t), this.selection.restore(), this.selection.removeFakeBackground(), this.insertLink(t), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.selection.collapseToEnd(), this.inlineToolbar.close();
  }
  /**
   * Detects if passed string is URL
   *
   * @param {string} str - string to validate
   * @returns {boolean}
   */
  validateURL(e) {
    return !/\s/.test(e);
  }
  /**
   * Process link before injection
   * - sanitize
   * - add protocol for links like 'google.com'
   *
   * @param {string} link - raw user input
   */
  prepareLink(e) {
    return e = e.trim(), e = this.addProtocol(e), e;
  }
  /**
   * Add 'http' protocol to the links like 'vc.ru', 'google.com'
   *
   * @param {string} link - string to process
   */
  addProtocol(e) {
    if (/^(\w+):(\/\/)?/.test(e))
      return e;
    const t = /^\/[^/\s]/.test(e), n = e.substring(0, 1) === "#", r = /^\/\/[^/\s]/.test(e);
    return !t && !n && !r && (e = "http://" + e), e;
  }
  /**
   * Inserts <a> tag with "href"
   *
   * @param {string} link - "href" value
   */
  insertLink(e) {
    const t = this.selection.findParentTag("A");
    t && this.selection.expandToTag(t), document.execCommand(this.commandLink, !1, e);
  }
  /**
   * Removes <a> tag
   */
  unlink() {
    document.execCommand(this.commandUnlink);
  }
}
oi.isInline = !0;
oi.title = "Link";
class Ya {
  /**
   * @param api - Editor.js API
   */
  constructor({ api: e }) {
    this.i18nAPI = e.i18n, this.blocksAPI = e.blocks, this.selectionAPI = e.selection, this.toolsAPI = e.tools, this.caretAPI = e.caret;
  }
  /**
   * Returns tool's UI config
   */
  async render() {
    const e = x.get(), t = this.blocksAPI.getBlockByElement(e.anchorNode);
    if (t === void 0)
      return [];
    const n = this.toolsAPI.getBlockTools(), r = await oa(t, n);
    if (r.length === 0)
      return [];
    const i = r.reduce((c, d) => {
      var u;
      return (u = d.toolbox) == null || u.forEach((h) => {
        c.push({
          icon: h.icon,
          title: ce.t(me.toolNames, h.title),
          name: d.name,
          closeOnActivate: !0,
          onActivate: async () => {
            const g = await this.blocksAPI.convert(t.id, d.name, h.data);
            this.caretAPI.setToBlock(g, "end");
          }
        });
      }), c;
    }, []), s = await t.getActiveToolboxEntry(), a = s !== void 0 ? s.icon : la, l = !mt();
    return {
      icon: a,
      name: "convert-to",
      hint: {
        title: this.i18nAPI.t("Convert to")
      },
      children: {
        searchable: l,
        items: i,
        onOpen: () => {
          l && (this.selectionAPI.setFakeBackground(), this.selectionAPI.save());
        },
        onClose: () => {
          l && (this.selectionAPI.restore(), this.selectionAPI.removeFakeBackground());
        }
      }
    };
  }
}
Ya.isInline = !0;
class Xa {
  /**
   * @param options - constructor options
   * @param options.data - stub tool data
   * @param options.api - Editor.js API
   */
  constructor({ data: e, api: t }) {
    this.CSS = {
      wrapper: "ce-stub",
      info: "ce-stub__info",
      title: "ce-stub__title",
      subtitle: "ce-stub__subtitle"
    }, this.api = t, this.title = e.title || this.api.i18n.t("Error"), this.subtitle = this.api.i18n.t("The block can not be displayed correctly."), this.savedData = e.savedData, this.wrapper = this.make();
  }
  /**
   * Returns stub holder
   *
   * @returns {HTMLElement}
   */
  render() {
    return this.wrapper;
  }
  /**
   * Return original Tool data
   *
   * @returns {BlockToolData}
   */
  save() {
    return this.savedData;
  }
  /**
   * Create Tool html markup
   *
   * @returns {HTMLElement}
   */
  make() {
    const e = p.make("div", this.CSS.wrapper), t = Gp, n = p.make("div", this.CSS.info), r = p.make("div", this.CSS.title, {
      textContent: this.title
    }), i = p.make("div", this.CSS.subtitle, {
      textContent: this.subtitle
    });
    return e.innerHTML = t, n.appendChild(r), n.appendChild(i), e.appendChild(n), e;
  }
}
Xa.isReadOnlySupported = !0;
class hm extends hr {
  constructor() {
    super(...arguments), this.type = Ye.Inline;
  }
  /**
   * Returns title for Inline Tool if specified by user
   */
  get title() {
    return this.constructable[go.Title];
  }
  /**
   * Constructs new InlineTool instance from constructable
   */
  create() {
    return new this.constructable({
      api: this.api,
      config: this.settings
    });
  }
  /**
   * Allows inline tool to be available in read-only mode
   * Can be used, for example, by comments tool
   */
  get isReadOnlySupported() {
    return this.constructable[go.IsReadOnlySupported] ?? !1;
  }
}
class pm extends hr {
  constructor() {
    super(...arguments), this.type = Ye.Tune;
  }
  /**
   * Constructs new BlockTune instance from constructable
   *
   * @param data - Tune data
   * @param block - Block API object
   */
  create(e, t) {
    return new this.constructable({
      api: this.api,
      config: this.settings,
      block: t,
      data: e
    });
  }
}
class ie extends Map {
  /**
   * Returns Block Tools collection
   */
  get blockTools() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isBlock());
    return new ie(e);
  }
  /**
   * Returns Inline Tools collection
   */
  get inlineTools() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isInline());
    return new ie(e);
  }
  /**
   * Returns Block Tunes collection
   */
  get blockTunes() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isTune());
    return new ie(e);
  }
  /**
   * Returns internal Tools collection
   */
  get internalTools() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isInternal);
    return new ie(e);
  }
  /**
   * Returns Tools collection provided by user
   */
  get externalTools() {
    const e = Array.from(this.entries()).filter(([, t]) => !t.isInternal);
    return new ie(e);
  }
}
var fm = Object.defineProperty, gm = Object.getOwnPropertyDescriptor, Ga = (o, e, t, n) => {
  for (var r = gm(e, t), i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (r = s(e, t, r) || r);
  return r && fm(e, t, r), r;
};
class ni extends hr {
  constructor() {
    super(...arguments), this.type = Ye.Block, this.inlineTools = new ie(), this.tunes = new ie();
  }
  /**
   * Creates new Tool instance
   *
   * @param data - Tool data
   * @param block - BlockAPI for current Block
   * @param readOnly - True if Editor is in read-only mode
   */
  create(e, t, n) {
    return new this.constructable({
      data: e,
      block: t,
      readOnly: n,
      api: this.api,
      config: this.settings
    });
  }
  /**
   * Returns true if read-only mode is supported by Tool
   */
  get isReadOnlySupported() {
    return this.constructable[ct.IsReadOnlySupported] === !0;
  }
  /**
   * Returns true if Tool supports linebreaks
   */
  get isLineBreaksEnabled() {
    return this.constructable[ct.IsEnabledLineBreaks];
  }
  /**
   * Returns Tool toolbox configuration (internal or user-specified).
   *
   * Merges internal and user-defined toolbox configs based on the following rules:
   *
   * - If both internal and user-defined toolbox configs are arrays their items are merged.
   * Length of the second one is kept.
   *
   * - If both are objects their properties are merged.
   *
   * - If one is an object and another is an array than internal config is replaced with user-defined
   * config. This is made to allow user to override default tool's toolbox representation (single/multiple entries)
   */
  get toolbox() {
    const e = this.constructable[ct.Toolbox], t = this.config[Gt.Toolbox];
    if (!ye(e) && t !== !1)
      return t ? Array.isArray(e) ? Array.isArray(t) ? t.map((n, r) => {
        const i = e[r];
        return i ? {
          ...i,
          ...n
        } : n;
      }) : [t] : Array.isArray(t) ? t : [
        {
          ...e,
          ...t
        }
      ] : Array.isArray(e) ? e : [e];
  }
  /**
   * Returns Tool conversion configuration
   */
  get conversionConfig() {
    return this.constructable[ct.ConversionConfig];
  }
  /**
   * Returns enabled inline tools for Tool
   */
  get enabledInlineTools() {
    return this.config[Gt.EnabledInlineTools] || !1;
  }
  /**
   * Returns enabled tunes for Tool
   */
  get enabledBlockTunes() {
    return this.config[Gt.EnabledBlockTunes];
  }
  /**
   * Returns Tool paste configuration
   */
  get pasteConfig() {
    return this.constructable[ct.PasteConfig] ?? {};
  }
  get sanitizeConfig() {
    const e = super.sanitizeConfig, t = this.baseSanitizeConfig;
    if (ye(e))
      return t;
    const n = {};
    for (const r in e)
      if (Object.prototype.hasOwnProperty.call(e, r)) {
        const i = e[r];
        oe(i) ? n[r] = Object.assign({}, t, i) : n[r] = i;
      }
    return n;
  }
  get baseSanitizeConfig() {
    const e = {};
    return Array.from(this.inlineTools.values()).forEach((t) => Object.assign(e, t.sanitizeConfig)), Array.from(this.tunes.values()).forEach((t) => Object.assign(e, t.sanitizeConfig)), e;
  }
}
Ga([
  gt
], ni.prototype, "sanitizeConfig");
Ga([
  gt
], ni.prototype, "baseSanitizeConfig");
class mm {
  /**
   * @class
   * @param config - tools config
   * @param editorConfig - EditorJS config
   * @param api - EditorJS API module
   */
  constructor(e, t, n) {
    this.api = n, this.config = e, this.editorConfig = t;
  }
  /**
   * Returns Tool object based on it's type
   *
   * @param name - tool name
   */
  get(e) {
    const { class: t, isInternal: n = !1, ...r } = this.config[e], i = this.getConstructor(t), s = t[hn.IsTune];
    return new i({
      name: e,
      constructable: t,
      config: r,
      api: this.api.getMethodsForTool(e, s),
      isDefault: e === this.editorConfig.defaultBlock,
      defaultPlaceholder: this.editorConfig.placeholder,
      isInternal: n
    });
  }
  /**
   * Find appropriate Tool object constructor for Tool constructable
   *
   * @param constructable - Tools constructable
   */
  getConstructor(e) {
    switch (!0) {
      case e[go.IsInline]:
        return hm;
      case e[hn.IsTune]:
        return pm;
      default:
        return ni;
    }
  }
}
class Za {
  /**
   * MoveDownTune constructor
   *
   * @param {API} api — Editor's API
   */
  constructor({ api: e }) {
    this.CSS = {
      animation: "wobble"
    }, this.api = e;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: Dp,
      title: this.api.i18n.t("Move down"),
      onActivate: () => this.handleClick(),
      name: "move-down"
    };
  }
  /**
   * Handle clicks on 'move down' button
   */
  handleClick() {
    const e = this.api.blocks.getCurrentBlockIndex(), t = this.api.blocks.getBlockByIndex(e + 1);
    if (!t)
      throw new Error("Unable to move Block down since it is already the last");
    const n = t.holder, r = n.getBoundingClientRect();
    let i = Math.abs(window.innerHeight - n.offsetHeight);
    r.top < window.innerHeight && (i = window.scrollY + n.offsetHeight), window.scrollTo(0, i), this.api.blocks.move(e + 1), this.api.toolbar.toggleBlockSettings(!0);
  }
}
Za.isTune = !0;
class Ja {
  /**
   * DeleteTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api: e }) {
    this.api = e;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: Up,
      title: this.api.i18n.t("Delete"),
      name: "delete",
      confirmation: {
        title: this.api.i18n.t("Click to delete"),
        onActivate: () => this.handleClick()
      }
    };
  }
  /**
   * Delete block conditions passed
   */
  handleClick() {
    this.api.blocks.delete();
  }
}
Ja.isTune = !0;
class Qa {
  /**
   * MoveUpTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api: e }) {
    this.CSS = {
      animation: "wobble"
    }, this.api = e;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: zp,
      title: this.api.i18n.t("Move up"),
      onActivate: () => this.handleClick(),
      name: "move-up"
    };
  }
  /**
   * Move current block up
   */
  handleClick() {
    const e = this.api.blocks.getCurrentBlockIndex(), t = this.api.blocks.getBlockByIndex(e), n = this.api.blocks.getBlockByIndex(e - 1);
    if (e === 0 || !t || !n)
      throw new Error("Unable to move Block up since it is already the first");
    const r = t.holder, i = n.holder, s = r.getBoundingClientRect(), a = i.getBoundingClientRect();
    let l;
    a.top > 0 ? l = Math.abs(s.top) - Math.abs(a.top) : l = Math.abs(s.top) + a.height, window.scrollBy(0, -1 * l), this.api.blocks.move(e - 1), this.api.toolbar.toggleBlockSettings(!0);
  }
}
Qa.isTune = !0;
var bm = Object.defineProperty, vm = Object.getOwnPropertyDescriptor, ym = (o, e, t, n) => {
  for (var r = vm(e, t), i = o.length - 1, s; i >= 0; i--)
    (s = o[i]) && (r = s(e, t, r) || r);
  return r && bm(e, t, r), r;
};
class el extends P {
  constructor() {
    super(...arguments), this.stubTool = "stub", this.toolsAvailable = new ie(), this.toolsUnavailable = new ie();
  }
  /**
   * Returns available Tools
   */
  get available() {
    return this.toolsAvailable;
  }
  /**
   * Returns unavailable Tools
   */
  get unavailable() {
    return this.toolsUnavailable;
  }
  /**
   * Return Tools for the Inline Toolbar
   */
  get inlineTools() {
    return this.available.inlineTools;
  }
  /**
   * Return editor block tools
   */
  get blockTools() {
    return this.available.blockTools;
  }
  /**
   * Return available Block Tunes
   *
   * @returns {object} - object of Inline Tool's classes
   */
  get blockTunes() {
    return this.available.blockTunes;
  }
  /**
   * Returns default Tool object
   */
  get defaultTool() {
    return this.blockTools.get(this.config.defaultBlock);
  }
  /**
   * Returns internal tools
   */
  get internal() {
    return this.available.internalTools;
  }
  /**
   * Creates instances via passed or default configuration
   *
   * @returns {Promise<void>}
   */
  async prepare() {
    if (this.validateTools(), this.config.tools = an({}, this.internalTools, this.config.tools), !Object.prototype.hasOwnProperty.call(this.config, "tools") || Object.keys(this.config.tools).length === 0)
      throw Error("Can't start without tools");
    const e = this.prepareConfig();
    this.factory = new mm(e, this.config, this.Editor.API);
    const t = this.getListOfPrepareFunctions(e);
    if (t.length === 0)
      return Promise.resolve();
    await Wh(t, (n) => {
      this.toolPrepareMethodSuccess(n);
    }, (n) => {
      this.toolPrepareMethodFallback(n);
    }), this.prepareBlockTools();
  }
  getAllInlineToolsSanitizeConfig() {
    const e = {};
    return Array.from(this.inlineTools.values()).forEach((t) => {
      Object.assign(e, t.sanitizeConfig);
    }), e;
  }
  /**
   * Calls each Tool reset method to clean up anything set by Tool
   */
  destroy() {
    Object.values(this.available).forEach(async (e) => {
      W(e.reset) && await e.reset();
    });
  }
  /**
   * Returns internal tools
   * Includes Bold, Italic, Link and Paragraph
   */
  get internalTools() {
    return {
      convertTo: {
        class: Ya,
        isInternal: !0
      },
      link: {
        class: oi,
        isInternal: !0
      },
      bold: {
        class: ei,
        isInternal: !0
      },
      italic: {
        class: ti,
        isInternal: !0
      },
      paragraph: {
        class: Qr,
        inlineToolbar: !0,
        isInternal: !0
      },
      stub: {
        class: Xa,
        isInternal: !0
      },
      moveUp: {
        class: Qa,
        isInternal: !0
      },
      delete: {
        class: Ja,
        isInternal: !0
      },
      moveDown: {
        class: Za,
        isInternal: !0
      }
    };
  }
  /**
   * Tool prepare method success callback
   *
   * @param {object} data - append tool to available list
   */
  toolPrepareMethodSuccess(e) {
    const t = this.factory.get(e.toolName);
    if (t.isInline()) {
      const n = ["render"].filter((r) => !t.create()[r]);
      if (n.length) {
        D(
          `Incorrect Inline Tool: ${t.name}. Some of required methods is not implemented %o`,
          "warn",
          n
        ), this.toolsUnavailable.set(t.name, t);
        return;
      }
    }
    this.toolsAvailable.set(t.name, t);
  }
  /**
   * Tool prepare method fail callback
   *
   * @param {object} data - append tool to unavailable list
   */
  toolPrepareMethodFallback(e) {
    this.toolsUnavailable.set(e.toolName, this.factory.get(e.toolName));
  }
  /**
   * Binds prepare function of plugins with user or default config
   *
   * @returns {Array} list of functions that needs to be fired sequentially
   * @param config - tools config
   */
  getListOfPrepareFunctions(e) {
    const t = [];
    return Object.entries(e).forEach(([n, r]) => {
      t.push({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function: W(r.class.prepare) ? r.class.prepare : () => {
        },
        data: {
          toolName: n,
          config: r.config
        }
      });
    }), t;
  }
  /**
   * Assign enabled Inline Tools and Block Tunes for Block Tool
   */
  prepareBlockTools() {
    Array.from(this.blockTools.values()).forEach((e) => {
      this.assignInlineToolsToBlockTool(e), this.assignBlockTunesToBlockTool(e);
    });
  }
  /**
   * Assign enabled Inline Tools for Block Tool
   *
   * @param tool - Block Tool
   */
  assignInlineToolsToBlockTool(e) {
    if (this.config.inlineToolbar !== !1) {
      if (e.enabledInlineTools === !0) {
        e.inlineTools = new ie(
          Array.isArray(this.config.inlineToolbar) ? this.config.inlineToolbar.map((t) => [t, this.inlineTools.get(t)]) : Array.from(this.inlineTools.entries())
        );
        return;
      }
      Array.isArray(e.enabledInlineTools) && (e.inlineTools = new ie(
        /** Prepend ConvertTo Inline Tool */
        ["convertTo", ...e.enabledInlineTools].map((t) => [t, this.inlineTools.get(t)])
      ));
    }
  }
  /**
   * Assign enabled Block Tunes for Block Tool
   *
   * @param tool — Block Tool
   */
  assignBlockTunesToBlockTool(e) {
    if (e.enabledBlockTunes !== !1) {
      if (Array.isArray(e.enabledBlockTunes)) {
        const t = new ie(
          e.enabledBlockTunes.map((n) => [n, this.blockTunes.get(n)])
        );
        e.tunes = new ie([...t, ...this.blockTunes.internalTools]);
        return;
      }
      if (Array.isArray(this.config.tunes)) {
        const t = new ie(
          this.config.tunes.map((n) => [n, this.blockTunes.get(n)])
        );
        e.tunes = new ie([...t, ...this.blockTunes.internalTools]);
        return;
      }
      e.tunes = this.blockTunes.internalTools;
    }
  }
  /**
   * Validate Tools configuration objects and throw Error for user if it is invalid
   */
  validateTools() {
    for (const e in this.config.tools)
      if (Object.prototype.hasOwnProperty.call(this.config.tools, e)) {
        if (e in this.internalTools)
          return;
        const t = this.config.tools[e];
        if (!W(t) && !W(t.class))
          throw Error(
            `Tool «${e}» must be a constructor function or an object with function in the «class» property`
          );
      }
  }
  /**
   * Unify tools config
   */
  prepareConfig() {
    const e = {};
    for (const t in this.config.tools)
      oe(this.config.tools[t]) ? e[t] = this.config.tools[t] : e[t] = { class: this.config.tools[t] };
    return e;
  }
}
ym([
  gt
], el.prototype, "getAllInlineToolsSanitizeConfig");
const km = `:root{--selectionColor: #e1f2ff;--inlineSelectionColor: #d4ecff;--bg-light: #eff2f5;--grayText: #707684;--color-dark: #1D202B;--color-active-icon: #388AE5;--color-gray-border: rgba(201, 201, 204, .48);--content-width: 650px;--narrow-mode-right-padding: 50px;--toolbox-buttons-size: 26px;--toolbox-buttons-size--mobile: 36px;--icon-size: 20px;--icon-size--mobile: 28px;--block-padding-vertical: .4em;--color-line-gray: #EFF0F1 }.codex-editor{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:1}.codex-editor .hide{display:none}.codex-editor__redactor [contenteditable]:empty:after{content:"\\feff"}@media (min-width: 651px){.codex-editor--narrow .codex-editor__redactor{margin-right:50px}}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .codex-editor__redactor{margin-left:50px;margin-right:0}}@media (min-width: 651px){.codex-editor--narrow .ce-toolbar__actions{right:-5px}}.codex-editor-copyable{position:absolute;height:1px;width:1px;top:-400%;opacity:.001}.codex-editor-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;pointer-events:none;overflow:hidden}.codex-editor-overlay__container{position:relative;pointer-events:auto;z-index:0}.codex-editor-overlay__rectangle{position:absolute;pointer-events:none;background-color:#2eaadc33;border:1px solid transparent}.codex-editor svg{max-height:100%}.codex-editor path{stroke:currentColor}.codex-editor ::-moz-selection{background-color:#d4ecff}.codex-editor ::selection{background-color:#d4ecff}.codex-editor--toolbox-opened [contentEditable=true][data-placeholder]:focus:before{opacity:0!important}.ce-scroll-locked{overflow:hidden}.ce-scroll-locked--hard{overflow:hidden;top:calc(-1 * var(--window-scroll-offset));position:fixed;width:100%}.ce-toolbar{position:absolute;left:0;right:0;top:0;-webkit-transition:opacity .1s ease;transition:opacity .1s ease;will-change:opacity,top;display:none}.ce-toolbar--opened{display:block}.ce-toolbar__content{max-width:650px;margin:0 auto;position:relative}.ce-toolbar__plus{color:#1d202b;cursor:pointer;width:26px;height:26px;border-radius:7px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-flex-negative:0;flex-shrink:0}@media (max-width: 650px){.ce-toolbar__plus{width:36px;height:36px}}@media (hover: hover){.ce-toolbar__plus:hover{background-color:#eff2f5}}.ce-toolbar__plus--active{background-color:#eff2f5;-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.ce-toolbar__plus-shortcut{opacity:.6;word-spacing:-2px;margin-top:5px}@media (max-width: 650px){.ce-toolbar__plus{position:absolute;background-color:#fff;border:1px solid #E8E8EB;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;z-index:2;position:static}.ce-toolbar__plus--left-oriented:before{left:15px;margin-left:0}.ce-toolbar__plus--right-oriented:before{left:auto;right:15px;margin-left:0}}.ce-toolbar__actions{position:absolute;right:100%;opacity:0;display:-webkit-box;display:-ms-flexbox;display:flex;padding-right:5px}.ce-toolbar__actions--opened{opacity:1}@media (max-width: 650px){.ce-toolbar__actions{right:auto}}.ce-toolbar__settings-btn{color:#1d202b;width:26px;height:26px;border-radius:7px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;margin-left:3px;cursor:pointer;user-select:none}@media (max-width: 650px){.ce-toolbar__settings-btn{width:36px;height:36px}}@media (hover: hover){.ce-toolbar__settings-btn:hover{background-color:#eff2f5}}.ce-toolbar__settings-btn--active{background-color:#eff2f5;-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@media (min-width: 651px){.ce-toolbar__settings-btn{width:24px}}.ce-toolbar__settings-btn--hidden{display:none}@media (max-width: 650px){.ce-toolbar__settings-btn{position:absolute;background-color:#fff;border:1px solid #E8E8EB;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;z-index:2;position:static}.ce-toolbar__settings-btn--left-oriented:before{left:15px;margin-left:0}.ce-toolbar__settings-btn--right-oriented:before{left:auto;right:15px;margin-left:0}}.ce-toolbar__plus svg,.ce-toolbar__settings-btn svg{width:24px;height:24px}@media (min-width: 651px){.codex-editor--narrow .ce-toolbar__plus{left:5px}}@media (min-width: 651px){.codex-editor--narrow .ce-toolbox .ce-popover{right:0;left:auto;left:initial}}.ce-inline-toolbar{--y-offset: 8px;--color-background-icon-active: rgba(56, 138, 229, .1);--color-text-icon-active: #388AE5;--color-text-primary: black;position:absolute;visibility:hidden;-webkit-transition:opacity .25s ease;transition:opacity .25s ease;will-change:opacity,left,top;top:0;left:0;z-index:3;opacity:1;visibility:visible}.ce-inline-toolbar [hidden]{display:none!important}.ce-inline-toolbar__toggler-and-button-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;padding:0 6px}.ce-inline-toolbar__buttons{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-inline-toolbar__dropdown{display:-webkit-box;display:-ms-flexbox;display:flex;padding:6px;margin:0 6px 0 -6px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;border-right:1px solid rgba(201,201,204,.48);-webkit-box-sizing:border-box;box-sizing:border-box}@media (hover: hover){.ce-inline-toolbar__dropdown:hover{background:#eff2f5}}.ce-inline-toolbar__dropdown--hidden{display:none}.ce-inline-toolbar__dropdown-content,.ce-inline-toolbar__dropdown-arrow{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-inline-toolbar__dropdown-content svg,.ce-inline-toolbar__dropdown-arrow svg{width:20px;height:20px}.ce-inline-toolbar__shortcut{opacity:.6;word-spacing:-3px;margin-top:3px}.ce-inline-tool{color:var(--color-text-primary);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;border:0;border-radius:4px;line-height:normal;height:100%;padding:0;width:28px;background-color:transparent;cursor:pointer}@media (max-width: 650px){.ce-inline-tool{width:36px;height:36px}}@media (hover: hover){.ce-inline-tool:hover{background-color:#f8f8f8}}.ce-inline-tool svg{display:block;width:20px;height:20px}@media (max-width: 650px){.ce-inline-tool svg{width:28px;height:28px}}.ce-inline-tool--link .icon--unlink,.ce-inline-tool--unlink .icon--link{display:none}.ce-inline-tool--unlink .icon--unlink{display:inline-block;margin-bottom:-1px}.ce-inline-tool-input{background:#F8F8F8;border:1px solid rgba(226,226,229,.2);border-radius:6px;padding:4px 8px;font-size:14px;line-height:22px;outline:none;margin:0;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;display:none;font-weight:500;-webkit-appearance:none;font-family:inherit}@media (max-width: 650px){.ce-inline-tool-input{font-size:15px;font-weight:500}}.ce-inline-tool-input::-webkit-input-placeholder{color:#707684}.ce-inline-tool-input::-moz-placeholder{color:#707684}.ce-inline-tool-input:-ms-input-placeholder{color:#707684}.ce-inline-tool-input::-ms-input-placeholder{color:#707684}.ce-inline-tool-input::placeholder{color:#707684}.ce-inline-tool-input--showed{display:block}.ce-inline-tool--active{background:var(--color-background-icon-active);color:var(--color-text-icon-active)}@-webkit-keyframes fade-in{0%{opacity:0}to{opacity:1}}@keyframes fade-in{0%{opacity:0}to{opacity:1}}.ce-block{-webkit-animation:fade-in .3s ease;animation:fade-in .3s ease;-webkit-animation-fill-mode:none;animation-fill-mode:none;-webkit-animation-fill-mode:initial;animation-fill-mode:initial}.ce-block:first-of-type{margin-top:0}.ce-block--selected .ce-block__content{background:#e1f2ff}.ce-block--selected .ce-block__content [contenteditable]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ce-block--selected .ce-block__content img,.ce-block--selected .ce-block__content .ce-stub{opacity:.55}.ce-block--stretched .ce-block__content{max-width:none}.ce-block__content{position:relative;max-width:650px;margin:0 auto;-webkit-transition:background-color .15s ease;transition:background-color .15s ease}.ce-block--drop-target .ce-block__content:before{content:"";position:absolute;top:100%;left:-20px;margin-top:-1px;height:8px;width:8px;border:solid #388AE5;border-width:1px 1px 0 0;-webkit-transform-origin:right;transform-origin:right;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.ce-block--drop-target .ce-block__content:after{content:"";position:absolute;top:100%;height:1px;width:100%;color:#388ae5;background:repeating-linear-gradient(90deg,#388AE5,#388AE5 1px,#fff 1px,#fff 6px)}.ce-block a{cursor:pointer;-webkit-text-decoration:underline;text-decoration:underline}.ce-block b{font-weight:700}.ce-block i{font-style:italic}@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@-webkit-keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@-webkit-keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}.cdx-block{padding:.4em 0}.cdx-block::-webkit-input-placeholder{line-height:normal!important}.cdx-input{border:1px solid rgba(201,201,204,.48);-webkit-box-shadow:inset 0 1px 2px 0 rgba(35,44,72,.06);box-shadow:inset 0 1px 2px #232c480f;border-radius:3px;padding:10px 12px;outline:none;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.cdx-input[data-placeholder]:before{position:static!important}.cdx-input[data-placeholder]:before{display:inline-block;width:0;white-space:nowrap;pointer-events:none}.cdx-settings-button{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;border-radius:3px;cursor:pointer;border:0;outline:none;background-color:transparent;vertical-align:bottom;color:inherit;margin:0;min-width:26px;min-height:26px}.cdx-settings-button--focused{background:rgba(34,186,255,.08)!important}.cdx-settings-button--focused{-webkit-box-shadow:inset 0 0 0px 1px rgba(7,161,227,.08);box-shadow:inset 0 0 0 1px #07a1e314}.cdx-settings-button--focused-animated{-webkit-animation-name:buttonClicked;animation-name:buttonClicked;-webkit-animation-duration:.25s;animation-duration:.25s}.cdx-settings-button--active{color:#388ae5}.cdx-settings-button svg{width:auto;height:auto}@media (max-width: 650px){.cdx-settings-button svg{width:28px;height:28px}}@media (max-width: 650px){.cdx-settings-button{width:36px;height:36px;border-radius:8px}}@media (hover: hover){.cdx-settings-button:hover{background-color:#eff2f5}}.cdx-loader{position:relative;border:1px solid rgba(201,201,204,.48)}.cdx-loader:before{content:"";position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-11px 0 0 -11px;border:2px solid rgba(201,201,204,.48);border-left-color:#388ae5;border-radius:50%;-webkit-animation:cdxRotation 1.2s infinite linear;animation:cdxRotation 1.2s infinite linear}@-webkit-keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.cdx-button{padding:13px;border-radius:3px;border:1px solid rgba(201,201,204,.48);font-size:14.9px;background:#fff;-webkit-box-shadow:0 2px 2px 0 rgba(18,30,57,.04);box-shadow:0 2px 2px #121e390a;color:#707684;text-align:center;cursor:pointer}@media (hover: hover){.cdx-button:hover{background:#FBFCFE;-webkit-box-shadow:0 1px 3px 0 rgba(18,30,57,.08);box-shadow:0 1px 3px #121e3914}}.cdx-button svg{height:20px;margin-right:.2em;margin-top:-2px}.ce-stub{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:12px 18px;margin:10px 0;border-radius:10px;background:#eff2f5;border:1px solid #EFF0F1;color:#707684;font-size:14px}.ce-stub svg{width:20px;height:20px}.ce-stub__info{margin-left:14px}.ce-stub__title{font-weight:500;text-transform:capitalize}.codex-editor.codex-editor--rtl{direction:rtl}.codex-editor.codex-editor--rtl .cdx-list{padding-left:0;padding-right:40px}.codex-editor.codex-editor--rtl .ce-toolbar__plus{right:-26px;left:auto}.codex-editor.codex-editor--rtl .ce-toolbar__actions{right:auto;left:-26px}@media (max-width: 650px){.codex-editor.codex-editor--rtl .ce-toolbar__actions{margin-left:0;margin-right:auto;padding-right:0;padding-left:10px}}.codex-editor.codex-editor--rtl .ce-settings{left:5px;right:auto}.codex-editor.codex-editor--rtl .ce-settings:before{right:auto;left:25px}.codex-editor.codex-editor--rtl .ce-settings__button:not(:nth-child(3n+3)){margin-left:3px;margin-right:0}.codex-editor.codex-editor--rtl .ce-conversion-tool__icon{margin-right:0;margin-left:10px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown{border-right:0px solid transparent;border-left:1px solid rgba(201,201,204,.48);margin:0 -6px 0 6px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown .icon--toggler-down{margin-left:0;margin-right:4px}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__plus{left:0;right:5px}}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__actions{left:-5px}}.cdx-search-field{--icon-margin-right: 10px;background:#F8F8F8;border:1px solid rgba(226,226,229,.2);border-radius:6px;padding:2px;display:grid;grid-template-columns:auto auto 1fr;grid-template-rows:auto}.cdx-search-field__icon{width:26px;height:26px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-right:var(--icon-margin-right)}.cdx-search-field__icon svg{width:20px;height:20px;color:#707684}.cdx-search-field__input{font-size:14px;outline:none;font-weight:500;font-family:inherit;border:0;background:transparent;margin:0;padding:0;line-height:22px;min-width:calc(100% - 26px - var(--icon-margin-right))}.cdx-search-field__input::-webkit-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::-moz-placeholder{color:#707684;font-weight:500}.cdx-search-field__input:-ms-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::-ms-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::placeholder{color:#707684;font-weight:500}.ce-popover{--border-radius: 6px;--width: 200px;--max-height: 270px;--padding: 6px;--offset-from-target: 8px;--color-border: #EFF0F1;--color-shadow: rgba(13, 20, 33, .1);--color-background: white;--color-text-primary: black;--color-text-secondary: #707684;--color-border-icon: rgba(201, 201, 204, .48);--color-border-icon-disabled: #EFF0F1;--color-text-icon-active: #388AE5;--color-background-icon-active: rgba(56, 138, 229, .1);--color-background-item-focus: rgba(34, 186, 255, .08);--color-shadow-item-focus: rgba(7, 161, 227, .08);--color-background-item-hover: #F8F8F8;--color-background-item-confirm: #E24A4A;--color-background-item-confirm-hover: #CE4343;--popover-top: calc(100% + var(--offset-from-target));--popover-left: 0;--nested-popover-overlap: 4px;--icon-size: 20px;--item-padding: 3px;--item-height: calc(var(--icon-size) + 2 * var(--item-padding))}.ce-popover__container{min-width:var(--width);width:var(--width);max-height:var(--max-height);border-radius:var(--border-radius);overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:0px 3px 15px -3px var(--color-shadow);box-shadow:0 3px 15px -3px var(--color-shadow);position:absolute;left:var(--popover-left);top:var(--popover-top);background:var(--color-background);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;z-index:4;opacity:0;max-height:0;pointer-events:none;padding:0;border:none}.ce-popover--opened>.ce-popover__container{opacity:1;padding:var(--padding);max-height:var(--max-height);pointer-events:auto;-webkit-animation:panelShowing .1s ease;animation:panelShowing .1s ease;border:1px solid var(--color-border)}@media (max-width: 650px){.ce-popover--opened>.ce-popover__container{-webkit-animation:panelShowingMobile .25s ease;animation:panelShowingMobile .25s ease}}.ce-popover--open-top .ce-popover__container{--popover-top: calc(-1 * (var(--offset-from-target) + var(--popover-height)))}.ce-popover--open-left .ce-popover__container{--popover-left: calc(-1 * var(--width) + 100%)}.ce-popover__items{overflow-y:auto;-ms-scroll-chaining:none;overscroll-behavior:contain}@media (max-width: 650px){.ce-popover__overlay{position:fixed;top:0;bottom:0;left:0;right:0;background:#1D202B;z-index:3;opacity:.5;-webkit-transition:opacity .12s ease-in;transition:opacity .12s ease-in;will-change:opacity;visibility:visible}}.ce-popover__overlay--hidden{display:none}@media (max-width: 650px){.ce-popover .ce-popover__container{--offset: 5px;position:fixed;max-width:none;min-width:calc(100% - var(--offset) * 2);left:var(--offset);right:var(--offset);bottom:calc(var(--offset) + env(safe-area-inset-bottom));top:auto;border-radius:10px}}.ce-popover__search{margin-bottom:5px}.ce-popover__nothing-found-message{color:#707684;display:none;cursor:default;padding:3px;font-size:14px;line-height:20px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ce-popover__nothing-found-message--displayed{display:block}.ce-popover--nested .ce-popover__container{--popover-left: calc(var(--nesting-level) * (var(--width) - var(--nested-popover-overlap)));top:calc(var(--trigger-item-top) - var(--nested-popover-overlap));position:absolute}.ce-popover--open-top.ce-popover--nested .ce-popover__container{top:calc(var(--trigger-item-top) - var(--popover-height) + var(--item-height) + var(--offset-from-target) + var(--nested-popover-overlap))}.ce-popover--open-left .ce-popover--nested .ce-popover__container{--popover-left: calc(-1 * (var(--nesting-level) + 1) * var(--width) + 100%)}.ce-popover-item-separator{padding:4px 3px}.ce-popover-item-separator--hidden{display:none}.ce-popover-item-separator__line{height:1px;background:var(--color-border);width:100%}.ce-popover-item-html--hidden{display:none}.ce-popover-item{--border-radius: 6px;border-radius:var(--border-radius);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:var(--item-padding);color:var(--color-text-primary);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;background:transparent}@media (max-width: 650px){.ce-popover-item{padding:4px}}.ce-popover-item:not(:last-of-type){margin-bottom:1px}.ce-popover-item__icon{width:26px;height:26px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.ce-popover-item__icon svg{width:20px;height:20px}@media (max-width: 650px){.ce-popover-item__icon{width:36px;height:36px;border-radius:8px}.ce-popover-item__icon svg{width:28px;height:28px}}.ce-popover-item__icon--tool{margin-right:4px}.ce-popover-item__title{font-size:14px;line-height:20px;font-weight:500;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-right:auto}@media (max-width: 650px){.ce-popover-item__title{font-size:16px}}.ce-popover-item__secondary-title{color:var(--color-text-secondary);font-size:12px;white-space:nowrap;letter-spacing:-.1em;padding-right:5px;opacity:.6}@media (max-width: 650px){.ce-popover-item__secondary-title{display:none}}.ce-popover-item--active{background:var(--color-background-icon-active);color:var(--color-text-icon-active)}.ce-popover-item--disabled{color:var(--color-text-secondary);cursor:default;pointer-events:none}.ce-popover-item--focused:not(.ce-popover-item--no-focus){background:var(--color-background-item-focus)!important}.ce-popover-item--hidden{display:none}@media (hover: hover){.ce-popover-item:hover{cursor:pointer}.ce-popover-item:hover:not(.ce-popover-item--no-hover){background-color:var(--color-background-item-hover)}}.ce-popover-item--confirmation{background:var(--color-background-item-confirm)}.ce-popover-item--confirmation .ce-popover-item__title,.ce-popover-item--confirmation .ce-popover-item__icon{color:#fff}@media (hover: hover){.ce-popover-item--confirmation:not(.ce-popover-item--no-hover):hover{background:var(--color-background-item-confirm-hover)}}.ce-popover-item--confirmation:not(.ce-popover-item--no-focus).ce-popover-item--focused{background:var(--color-background-item-confirm-hover)!important}@-webkit-keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes panelShowingMobile{0%{opacity:0;-webkit-transform:translateY(14px) scale(.98);transform:translateY(14px) scale(.98)}70%{opacity:1;-webkit-transform:translateY(-4px);transform:translateY(-4px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes panelShowingMobile{0%{opacity:0;-webkit-transform:translateY(14px) scale(.98);transform:translateY(14px) scale(.98)}70%{opacity:1;-webkit-transform:translateY(-4px);transform:translateY(-4px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}.wobble{-webkit-animation-name:wobble;animation-name:wobble;-webkit-animation-duration:.4s;animation-duration:.4s}@-webkit-keyframes wobble{0%{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-9%,0,0);transform:translate3d(-9%,0,0)}30%{-webkit-transform:translate3d(9%,0,0);transform:translate3d(9%,0,0)}45%{-webkit-transform:translate3d(-4%,0,0);transform:translate3d(-4%,0,0)}60%{-webkit-transform:translate3d(4%,0,0);transform:translate3d(4%,0,0)}75%{-webkit-transform:translate3d(-1%,0,0);transform:translate3d(-1%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}}@keyframes wobble{0%{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-9%,0,0);transform:translate3d(-9%,0,0)}30%{-webkit-transform:translate3d(9%,0,0);transform:translate3d(9%,0,0)}45%{-webkit-transform:translate3d(-4%,0,0);transform:translate3d(-4%,0,0)}60%{-webkit-transform:translate3d(4%,0,0);transform:translate3d(4%,0,0)}75%{-webkit-transform:translate3d(-1%,0,0);transform:translate3d(-1%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}}.ce-popover-header{margin-bottom:8px;margin-top:4px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ce-popover-header__text{font-size:18px;font-weight:600}.ce-popover-header__back-button{border:0;background:transparent;width:36px;height:36px;color:var(--color-text-primary)}.ce-popover-header__back-button svg{display:block;width:28px;height:28px}.ce-popover--inline{--height: 38px;--height-mobile: 46px;--container-padding: 4px;position:relative}.ce-popover--inline .ce-popover__custom-content{margin-bottom:0}.ce-popover--inline .ce-popover__items{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-popover--inline .ce-popover__container{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;padding:var(--container-padding);height:var(--height);top:0;min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;width:-webkit-max-content;width:-moz-max-content;width:max-content;-webkit-animation:none;animation:none}@media (max-width: 650px){.ce-popover--inline .ce-popover__container{height:var(--height-mobile);position:absolute}}.ce-popover--inline .ce-popover-item-separator{padding:0 4px}.ce-popover--inline .ce-popover-item-separator__line{height:100%;width:1px}.ce-popover--inline .ce-popover-item{border-radius:4px;padding:4px}.ce-popover--inline .ce-popover-item__icon--tool{-webkit-box-shadow:none;box-shadow:none;background:transparent;margin-right:0}.ce-popover--inline .ce-popover-item__icon{width:auto;width:initial;height:auto;height:initial}.ce-popover--inline .ce-popover-item__icon svg{width:20px;height:20px}@media (max-width: 650px){.ce-popover--inline .ce-popover-item__icon svg{width:28px;height:28px}}.ce-popover--inline .ce-popover-item:not(:last-of-type){margin-bottom:0;margin-bottom:initial}.ce-popover--inline .ce-popover-item-html{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ce-popover--inline .ce-popover-item__icon--chevron-right{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ce-popover--inline .ce-popover--nested-level-1 .ce-popover__container{--offset: 3px;left:0;top:calc(var(--height) + var(--offset))}@media (max-width: 650px){.ce-popover--inline .ce-popover--nested-level-1 .ce-popover__container{top:calc(var(--height-mobile) + var(--offset))}}.ce-popover--inline .ce-popover--nested .ce-popover__container{min-width:var(--width);width:var(--width);height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;padding:6px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.ce-popover--inline .ce-popover--nested .ce-popover__items{display:block;width:100%}.ce-popover--inline .ce-popover--nested .ce-popover-item{border-radius:6px;padding:3px}@media (max-width: 650px){.ce-popover--inline .ce-popover--nested .ce-popover-item{padding:4px}}.ce-popover--inline .ce-popover--nested .ce-popover-item__icon--tool{margin-right:4px}.ce-popover--inline .ce-popover--nested .ce-popover-item__icon{width:26px;height:26px}.ce-popover--inline .ce-popover--nested .ce-popover-item-separator{padding:4px 3px}.ce-popover--inline .ce-popover--nested .ce-popover-item-separator__line{width:100%;height:1px}.codex-editor [data-placeholder]:empty:before,.codex-editor [data-placeholder][data-empty=true]:before{pointer-events:none;color:#707684;cursor:text;content:attr(data-placeholder)}.codex-editor [data-placeholder-active]:empty:before,.codex-editor [data-placeholder-active][data-empty=true]:before{pointer-events:none;color:#707684;cursor:text}.codex-editor [data-placeholder-active]:empty:focus:before,.codex-editor [data-placeholder-active][data-empty=true]:focus:before{content:attr(data-placeholder-active)}
`;
class wm extends P {
  constructor() {
    super(...arguments), this.isMobile = !1, this.contentRectCache = null, this.resizeDebouncer = Ri(() => {
      this.windowResize();
    }, 200), this.selectionChangeDebounced = Ri(() => {
      this.selectionChanged();
    }, nm), this.documentTouchedListener = (e) => {
      this.documentTouched(e);
    };
  }
  /**
   * Editor.js UI CSS class names
   *
   * @returns {{editorWrapper: string, editorZone: string}}
   */
  get CSS() {
    return {
      editorWrapper: "codex-editor",
      editorWrapperNarrow: "codex-editor--narrow",
      editorZone: "codex-editor__redactor",
      editorZoneHidden: "codex-editor__redactor--hidden",
      editorEmpty: "codex-editor--empty",
      editorRtlFix: "codex-editor--rtl"
    };
  }
  /**
   * Return Width of center column of Editor
   *
   * @returns {DOMRect}
   */
  get contentRect() {
    if (this.contentRectCache !== null)
      return this.contentRectCache;
    const e = this.nodes.wrapper.querySelector(`.${ee.CSS.content}`);
    return e ? (this.contentRectCache = e.getBoundingClientRect(), this.contentRectCache) : {
      width: 650,
      left: 0,
      right: 0
    };
  }
  /**
   * Making main interface
   */
  async prepare() {
    this.setIsMobile(), this.make(), this.loadStyles();
  }
  /**
   * Toggle read-only state
   *
   * If readOnly is true:
   *  - removes all listeners from main UI module elements
   *
   * if readOnly is false:
   *  - enables all listeners to UI module elements
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  toggleReadOnly(e) {
    e ? this.unbindReadOnlySensitiveListeners() : window.requestIdleCallback(() => {
      this.bindReadOnlySensitiveListeners();
    }, {
      timeout: 2e3
    });
  }
  /**
   * Check if Editor is empty and set CSS class to wrapper
   */
  checkEmptiness() {
    const { BlockManager: e } = this.Editor;
    this.nodes.wrapper.classList.toggle(this.CSS.editorEmpty, e.isEditorEmpty);
  }
  /**
   * Check if one of Toolbar is opened
   * Used to prevent global keydowns (for example, Enter) conflicts with Enter-on-toolbar
   *
   * @returns {boolean}
   */
  get someToolbarOpened() {
    const { Toolbar: e, BlockSettings: t, InlineToolbar: n } = this.Editor;
    return !!(t.opened || n.opened || e.toolbox.opened);
  }
  /**
   * Check for some Flipper-buttons is under focus
   */
  get someFlipperButtonFocused() {
    return this.Editor.Toolbar.toolbox.hasFocus() ? !0 : Object.entries(this.Editor).filter(([e, t]) => t.flipper instanceof Ze).some(([e, t]) => t.flipper.hasFocus());
  }
  /**
   * Clean editor`s UI
   */
  destroy() {
    this.nodes.holder.innerHTML = "", this.unbindReadOnlyInsensitiveListeners();
  }
  /**
   * Close all Editor's toolbars
   */
  closeAllToolbars() {
    const { Toolbar: e, BlockSettings: t, InlineToolbar: n } = this.Editor;
    t.close(), n.close(), e.toolbox.close();
  }
  /**
   * Check for mobile mode and save the result
   */
  setIsMobile() {
    const e = window.innerWidth < Vs;
    e !== this.isMobile && this.eventsDispatcher.emit(Pt, {
      isEnabled: this.isMobile
    }), this.isMobile = e;
  }
  /**
   * Makes Editor.js interface
   */
  make() {
    this.nodes.holder = p.getHolder(this.config.holder), this.nodes.wrapper = p.make("div", [
      this.CSS.editorWrapper,
      ...this.isRtl ? [this.CSS.editorRtlFix] : []
    ]), this.nodes.redactor = p.make("div", this.CSS.editorZone), this.nodes.holder.offsetWidth < this.contentRect.width && this.nodes.wrapper.classList.add(this.CSS.editorWrapperNarrow), this.nodes.redactor.style.paddingBottom = this.config.minHeight + "px", this.nodes.wrapper.appendChild(this.nodes.redactor), this.nodes.holder.appendChild(this.nodes.wrapper), this.bindReadOnlyInsensitiveListeners();
  }
  /**
   * Appends CSS
   */
  loadStyles() {
    const e = "editor-js-styles";
    if (p.get(e))
      return;
    const t = p.make("style", null, {
      id: e,
      textContent: km.toString()
    });
    this.config.style && !ye(this.config.style) && this.config.style.nonce && t.setAttribute("nonce", this.config.style.nonce), p.prepend(document.head, t);
  }
  /**
   * Adds listeners that should work both in read-only and read-write modes
   */
  bindReadOnlyInsensitiveListeners() {
    this.listeners.on(document, "selectionchange", this.selectionChangeDebounced), this.listeners.on(window, "resize", this.resizeDebouncer, {
      passive: !0
    }), this.listeners.on(this.nodes.redactor, "mousedown", this.documentTouchedListener, {
      capture: !0,
      passive: !0
    }), this.listeners.on(this.nodes.redactor, "touchstart", this.documentTouchedListener, {
      capture: !0,
      passive: !0
    });
  }
  /**
   * Removes listeners that should work both in read-only and read-write modes
   */
  unbindReadOnlyInsensitiveListeners() {
    this.listeners.off(document, "selectionchange", this.selectionChangeDebounced), this.listeners.off(window, "resize", this.resizeDebouncer), this.listeners.off(this.nodes.redactor, "mousedown", this.documentTouchedListener), this.listeners.off(this.nodes.redactor, "touchstart", this.documentTouchedListener);
  }
  /**
   * Adds listeners that should work only in read-only mode
   */
  bindReadOnlySensitiveListeners() {
    this.readOnlyMutableListeners.on(this.nodes.redactor, "click", (e) => {
      this.redactorClicked(e);
    }, !1), this.readOnlyMutableListeners.on(document, "keydown", (e) => {
      this.documentKeydown(e);
    }, !0), this.readOnlyMutableListeners.on(document, "mousedown", (e) => {
      this.documentClicked(e);
    }, !0), this.watchBlockHoveredEvents(), this.enableInputsEmptyMark();
  }
  /**
   * Listen redactor mousemove to emit 'block-hovered' event
   */
  watchBlockHoveredEvents() {
    let e;
    this.readOnlyMutableListeners.on(this.nodes.redactor, "mousemove", sn((t) => {
      const n = t.target.closest(".ce-block");
      this.Editor.BlockSelection.anyBlockSelected || n && e !== n && (e = n, this.eventsDispatcher.emit(va, {
        block: this.Editor.BlockManager.getBlockByChildNode(n)
      }));
    }, 20), {
      passive: !0
    });
  }
  /**
   * Unbind events that should work only in read-only mode
   */
  unbindReadOnlySensitiveListeners() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Resize window handler
   */
  windowResize() {
    this.contentRectCache = null, this.setIsMobile();
  }
  /**
   * All keydowns on document
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  documentKeydown(e) {
    switch (e.keyCode) {
      case B.ENTER:
        this.enterPressed(e);
        break;
      case B.BACKSPACE:
      case B.DELETE:
        this.backspacePressed(e);
        break;
      case B.ESC:
        this.escapePressed(e);
        break;
      default:
        this.defaultBehaviour(e);
        break;
    }
  }
  /**
   * Ignore all other document's keydown events
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  defaultBehaviour(e) {
    const { currentBlock: t } = this.Editor.BlockManager, n = e.target.closest(`.${this.CSS.editorWrapper}`), r = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    if (t !== void 0 && n === null) {
      this.Editor.BlockEvents.keydown(e);
      return;
    }
    n || t && r || (this.Editor.BlockManager.unsetCurrentBlock(), this.Editor.Toolbar.close());
  }
  /**
   * @param {KeyboardEvent} event - keyboard event
   */
  backspacePressed(e) {
    const { BlockManager: t, BlockSelection: n, Caret: r } = this.Editor;
    if (n.anyBlockSelected && !x.isSelectionExists) {
      const i = t.removeSelectedBlocks(), s = t.insertDefaultBlockAtIndex(i, !0);
      r.setToBlock(s, r.positions.START), n.clearSelection(e), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  /**
   * Escape pressed
   * If some of Toolbar components are opened, then close it otherwise close Toolbar
   *
   * @param {Event} event - escape keydown event
   */
  escapePressed(e) {
    this.Editor.BlockSelection.clearSelection(e), this.Editor.Toolbar.toolbox.opened ? (this.Editor.Toolbar.toolbox.close(), this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END)) : this.Editor.BlockSettings.opened ? this.Editor.BlockSettings.close() : this.Editor.InlineToolbar.opened ? this.Editor.InlineToolbar.close() : this.Editor.Toolbar.close();
  }
  /**
   * Enter pressed on document
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  enterPressed(e) {
    const { BlockManager: t, BlockSelection: n } = this.Editor;
    if (this.someToolbarOpened)
      return;
    const r = t.currentBlockIndex >= 0;
    if (n.anyBlockSelected && !x.isSelectionExists) {
      n.clearSelection(e), e.preventDefault(), e.stopImmediatePropagation(), e.stopPropagation();
      return;
    }
    if (!this.someToolbarOpened && r && e.target.tagName === "BODY") {
      const i = this.Editor.BlockManager.insert();
      e.preventDefault(), this.Editor.Caret.setToBlock(i), this.Editor.Toolbar.moveAndOpen(i);
    }
    this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * All clicks on document
   *
   * @param {MouseEvent} event - Click event
   */
  documentClicked(e) {
    var t, n;
    if (!e.isTrusted)
      return;
    const r = e.target;
    this.nodes.holder.contains(r) || x.isAtEditor || (this.Editor.BlockManager.unsetCurrentBlock(), this.Editor.Toolbar.close());
    const i = (t = this.Editor.BlockSettings.nodes.wrapper) == null ? void 0 : t.contains(r), s = (n = this.Editor.Toolbar.nodes.settingsToggler) == null ? void 0 : n.contains(r), a = i || s;
    if (this.Editor.BlockSettings.opened && !a) {
      this.Editor.BlockSettings.close();
      const l = this.Editor.BlockManager.getBlockByChildNode(r);
      this.Editor.Toolbar.moveAndOpen(l);
    }
    this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * First touch on editor
   * Fired before click
   *
   * Used to change current block — we need to do it before 'selectionChange' event.
   * Also:
   * - Move and show the Toolbar
   * - Set a Caret
   *
   * @param event - touch or mouse event
   */
  documentTouched(e) {
    let t = e.target;
    if (t === this.nodes.redactor) {
      const n = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX, r = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
      t = document.elementFromPoint(n, r);
    }
    try {
      this.Editor.BlockManager.setCurrentBlockByChildNode(t);
    } catch {
      this.Editor.RectangleSelection.isRectActivated() || this.Editor.Caret.setToTheLastBlock();
    }
    this.Editor.ReadOnly.isEnabled || this.Editor.Toolbar.moveAndOpen();
  }
  /**
   * All clicks on the redactor zone
   *
   * @param {MouseEvent} event - click event
   * @description
   * - By clicks on the Editor's bottom zone:
   *      - if last Block is empty, set a Caret to this
   *      - otherwise, add a new empty Block and set a Caret to that
   */
  redactorClicked(e) {
    if (!x.isCollapsed)
      return;
    const t = e.target, n = e.metaKey || e.ctrlKey;
    if (p.isAnchor(t) && n) {
      e.stopImmediatePropagation(), e.stopPropagation();
      const r = t.getAttribute("href"), i = Yh(r);
      Gh(i);
      return;
    }
    this.processBottomZoneClick(e);
  }
  /**
   * Check if user clicks on the Editor's bottom zone:
   *  - set caret to the last block
   *  - or add new empty block
   *
   * @param event - click event
   */
  processBottomZoneClick(e) {
    const t = this.Editor.BlockManager.getBlockByIndex(-1), n = p.offset(t.holder).bottom, r = e.pageY, { BlockSelection: i } = this.Editor;
    if (e.target instanceof Element && e.target.isEqualNode(this.nodes.redactor) && /**
    * If there is cross block selection started, target will be equal to redactor so we need additional check
    */
    !i.anyBlockSelected && /**
    * Prevent caret jumping (to last block) when clicking between blocks
    */
    n < r) {
      e.stopImmediatePropagation(), e.stopPropagation();
      const { BlockManager: s, Caret: a, Toolbar: l } = this.Editor;
      (!s.lastBlock.tool.isDefault || !s.lastBlock.isEmpty) && s.insertAtEnd(), a.setToTheLastBlock(), l.moveAndOpen(s.lastBlock);
    }
  }
  /**
   * Handle selection changes on mobile devices
   * Uses for showing the Inline Toolbar
   */
  selectionChanged() {
    const { CrossBlockSelection: e, BlockSelection: t } = this.Editor, n = x.anchorElement;
    if (e.isCrossBlockSelectionStarted && t.anyBlockSelected && x.get().removeAllRanges(), !n) {
      x.range || this.Editor.InlineToolbar.close();
      return;
    }
    const r = n.closest(`.${ee.CSS.content}`);
    (r === null || r.closest(`.${x.CSS.editorWrapper}`) !== this.nodes.wrapper) && (this.Editor.InlineToolbar.containsNode(n) || this.Editor.InlineToolbar.close(), n.dataset.inlineToolbar !== "true") || (this.Editor.BlockManager.currentBlock || this.Editor.BlockManager.setCurrentBlockByChildNode(n), this.Editor.InlineToolbar.tryToShow(!0));
  }
  /**
   * Editor.js provides and ability to show placeholders for empty contenteditable elements
   *
   * This method watches for input and focus events and toggles 'data-empty' attribute
   * to workaroud the case, when inputs contains only <br>s and has no visible content
   * Then, CSS could rely on this attribute to show placeholders
   */
  enableInputsEmptyMark() {
    function e(t) {
      const n = t.target;
      Ys(n);
    }
    this.readOnlyMutableListeners.on(this.nodes.wrapper, "input", e), this.readOnlyMutableListeners.on(this.nodes.wrapper, "focusin", e), this.readOnlyMutableListeners.on(this.nodes.wrapper, "focusout", e);
  }
}
const xm = {
  // API Modules
  BlocksAPI: ap,
  CaretAPI: cp,
  EventsAPI: dp,
  I18nAPI: ir,
  API: up,
  InlineToolbarAPI: hp,
  ListenersAPI: pp,
  NotifierAPI: bp,
  ReadOnlyAPI: vp,
  SanitizerAPI: Sp,
  SaverAPI: Tp,
  SelectionAPI: Bp,
  ToolsAPI: _p,
  StylesAPI: Op,
  ToolbarAPI: Mp,
  TooltipAPI: Np,
  UiAPI: $p,
  // Toolbar Modules
  BlockSettings: cf,
  Toolbar: bf,
  InlineToolbar: vf,
  // Modules
  BlockEvents: Gg,
  BlockManager: Qg,
  BlockSelection: em,
  Caret: mo,
  CrossBlockSelection: tm,
  DragNDrop: om,
  ModificationsObserver: im,
  Paste: sm,
  ReadOnly: am,
  RectangleSelection: _t,
  Renderer: lm,
  Saver: cm,
  Tools: el,
  UI: wm
};
class Cm {
  /**
   * @param {EditorConfig} config - user configuration
   */
  constructor(e) {
    this.moduleInstances = {}, this.eventsDispatcher = new Dt();
    let t, n;
    this.isReady = new Promise((r, i) => {
      t = r, n = i;
    }), Promise.resolve().then(async () => {
      this.configuration = e, this.validate(), this.init(), await this.start(), await this.render();
      const { BlockManager: r, Caret: i, UI: s, ModificationsObserver: a } = this.moduleInstances;
      s.checkEmptiness(), a.enable(), this.configuration.autofocus === !0 && this.configuration.readOnly !== !0 && i.setToBlock(r.blocks[0], i.positions.START), t();
    }).catch((r) => {
      D(`Editor.js is not ready because of ${r}`, "error"), n(r);
    });
  }
  /**
   * Setting for configuration
   *
   * @param {EditorConfig|string} config - Editor's config to set
   */
  set configuration(e) {
    var t, n;
    oe(e) ? this.config = {
      ...e
    } : this.config = {
      holder: e
    }, ln(!!this.config.holderId, "config.holderId", "config.holder"), this.config.holderId && !this.config.holder && (this.config.holder = this.config.holderId, this.config.holderId = null), this.config.holder == null && (this.config.holder = "editorjs"), this.config.logLevel || (this.config.logLevel = Ws.VERBOSE), zh(this.config.logLevel), ln(!!this.config.initialBlock, "config.initialBlock", "config.defaultBlock"), this.config.defaultBlock = this.config.defaultBlock || this.config.initialBlock || "paragraph", this.config.minHeight = this.config.minHeight !== void 0 ? this.config.minHeight : 300;
    const r = {
      type: this.config.defaultBlock,
      data: {}
    };
    this.config.placeholder = this.config.placeholder || !1, this.config.sanitizer = this.config.sanitizer || {
      p: !0,
      b: !0,
      a: !0
    }, this.config.hideToolbar = this.config.hideToolbar ? this.config.hideToolbar : !1, this.config.tools = this.config.tools || {}, this.config.i18n = this.config.i18n || {}, this.config.data = this.config.data || { blocks: [] }, this.config.onReady = this.config.onReady || (() => {
    }), this.config.onChange = this.config.onChange || (() => {
    }), this.config.inlineToolbar = this.config.inlineToolbar !== void 0 ? this.config.inlineToolbar : !0, (ye(this.config.data) || !this.config.data.blocks || this.config.data.blocks.length === 0) && (this.config.data = { blocks: [r] }), this.config.readOnly = this.config.readOnly || !1, (t = this.config.i18n) != null && t.messages && ce.setDictionary(this.config.i18n.messages), this.config.i18n.direction = ((n = this.config.i18n) == null ? void 0 : n.direction) || "ltr";
  }
  /**
   * Returns private property
   *
   * @returns {EditorConfig}
   */
  get configuration() {
    return this.config;
  }
  /**
   * Checks for required fields in Editor's config
   */
  validate() {
    const { holderId: e, holder: t } = this.config;
    if (e && t)
      throw Error("«holderId» and «holder» param can't assign at the same time.");
    if (Le(t) && !p.get(t))
      throw Error(`element with ID «${t}» is missing. Pass correct holder's ID.`);
    if (t && oe(t) && !p.isElement(t))
      throw Error("«holder» value must be an Element node");
  }
  /**
   * Initializes modules:
   *  - make and save instances
   *  - configure
   */
  init() {
    this.constructModules(), this.configureModules();
  }
  /**
   * Start Editor!
   *
   * Get list of modules that needs to be prepared and return a sequence (Promise)
   *
   * @returns {Promise<void>}
   */
  async start() {
    await [
      "Tools",
      "UI",
      "BlockManager",
      "Paste",
      "BlockSelection",
      "RectangleSelection",
      "CrossBlockSelection",
      "ReadOnly"
    ].reduce(
      (e, t) => e.then(async () => {
        try {
          await this.moduleInstances[t].prepare();
        } catch (n) {
          if (n instanceof Zs)
            throw new Error(n.message);
          D(`Module ${t} was skipped because of %o`, "warn", n);
        }
      }),
      Promise.resolve()
    );
  }
  /**
   * Render initial data
   */
  render() {
    return this.moduleInstances.Renderer.render(this.config.data.blocks);
  }
  /**
   * Make modules instances and save it to the @property this.moduleInstances
   */
  constructModules() {
    Object.entries(xm).forEach(([e, t]) => {
      try {
        this.moduleInstances[e] = new t({
          config: this.configuration,
          eventsDispatcher: this.eventsDispatcher
        });
      } catch (n) {
        D("[constructModules]", `Module ${e} skipped because`, "error", n);
      }
    });
  }
  /**
   * Modules instances configuration:
   *  - pass other modules to the 'state' property
   *  - ...
   */
  configureModules() {
    for (const e in this.moduleInstances)
      Object.prototype.hasOwnProperty.call(this.moduleInstances, e) && (this.moduleInstances[e].state = this.getModulesDiff(e));
  }
  /**
   * Return modules without passed name
   *
   * @param {string} name - module for witch modules difference should be calculated
   */
  getModulesDiff(e) {
    const t = {};
    for (const n in this.moduleInstances)
      n !== e && (t[n] = this.moduleInstances[n]);
    return t;
  }
}
/**
 * Editor.js
 *
 * @license Apache-2.0
 * @see Editor.js <https://editorjs.io>
 * @author CodeX Team <https://codex.so>
 */
class Em {
  /** Editor version */
  static get version() {
    return "2.31.0-rc.7";
  }
  /**
   * @param {EditorConfig|string|undefined} [configuration] - user configuration
   */
  constructor(e) {
    let t = () => {
    };
    oe(e) && W(e.onReady) && (t = e.onReady);
    const n = new Cm(e);
    this.isReady = n.isReady.then(() => {
      this.exportAPI(n), t();
    });
  }
  /**
   * Export external API methods
   *
   * @param {Core} editor — Editor's instance
   */
  exportAPI(e) {
    const t = ["configuration"], n = () => {
      Object.values(e.moduleInstances).forEach((r) => {
        W(r.destroy) && r.destroy(), r.listeners.removeAll();
      }), Pp(), e = null;
      for (const r in this)
        Object.prototype.hasOwnProperty.call(this, r) && delete this[r];
      Object.setPrototypeOf(this, null);
    };
    t.forEach((r) => {
      this[r] = e[r];
    }), this.destroy = n, Object.setPrototypeOf(this, e.moduleInstances.API.methods), delete this.exportAPI, Object.entries({
      blocks: {
        clear: "clear",
        render: "render"
      },
      caret: {
        focus: "focus"
      },
      events: {
        on: "on",
        off: "off",
        emit: "emit"
      },
      saver: {
        save: "save"
      }
    }).forEach(([r, i]) => {
      Object.entries(i).forEach(([s, a]) => {
        this[a] = e.moduleInstances.API.methods[r][s];
      });
    });
  }
}
var Sm = [["path", {
  d: "M21 12a9 9 0 1 1-6.219-8.56",
  key: "13zald"
}]], Tm = (o) => m(X, R(o, {
  iconNode: Sm,
  name: "loader-circle"
})), tl = Tm, Bm = [["circle", {
  cx: "11",
  cy: "11",
  r: "8",
  key: "4ej97u"
}], ["path", {
  d: "m21 21-4.3-4.3",
  key: "1qie3q"
}]], _m = (o) => m(X, R(o, {
  iconNode: Bm,
  name: "search"
})), Om = _m, Mm = [["path", {
  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
  key: "ih7n3h"
}], ["polyline", {
  points: "17 8 12 3 7 8",
  key: "t8dd8p"
}], ["line", {
  x1: "12",
  x2: "12",
  y1: "3",
  y2: "15",
  key: "widbto"
}]], Im = (o) => m(X, R(o, {
  iconNode: Mm,
  name: "upload"
})), Lm = Im, Am = [["path", {
  d: "M18 6 6 18",
  key: "1bl5f8"
}], ["path", {
  d: "m6 6 12 12",
  key: "d8bk6v"
}]], Pm = (o) => m(X, R(o, {
  iconNode: Am,
  name: "x"
})), ol = Pm, Nm = /* @__PURE__ */ y('<div class="size-28 m-auto border border-dashed border-fg/48 flex flex-col justify-center items-center"><span>Upload Image'), $m = /* @__PURE__ */ y('<dialog class="m-auto bg-bg rounded-xl shadow-2xl p-2 border-none"><div class=p-3><div class="grid grid-cols-3"><span class="text-2xl font-bold">Photos</span><div class="flex items-center transition text-fg bg-fg/10 rounded-xl text-lg p-1 has-[input:focus]:bg-fg/18 placeholder:text-fg/50"><input class="outline-0 border-none bg-transparent"type=search placeholder=Search></div><div class="ml-auto self-start"></div></div><div class="grid grid-cols-5 mt-4 gap-2">'), jm = /* @__PURE__ */ y('<span class="mx-2 my-1">Select'), Rm = /* @__PURE__ */ y('<span class="mx-auto text-red-500 dark:text-red-300">'), Dm = /* @__PURE__ */ y("<img>");
const Hm = 19, Fm = 500;
function zm({
  limit: o,
  onSelected: e,
  searchPhoto: t,
  selectFile: n,
  uploadPhoto: r,
  ref: i
}) {
  let s, a, l;
  const [c, d] = bs([]), [u, h] = Me(!1), [g, f] = Me("");
  ns(() => {
    M(""), i(s), t("").then(console.log);
  });
  function b() {
    e(null);
  }
  function N() {
    e(Xe(c).filter((E) => E.selected));
  }
  function M(E) {
    h(!0), clearTimeout(l), l = setTimeout(async () => {
      try {
        const C = await t(E);
        d(C.slice(0, Hm).map((G) => ({
          ...G,
          selected: !1
        })));
      } catch (C) {
        d([]), C instanceof Error && f(C.message);
      }
      h(!1);
    }, Fm);
  }
  async function _() {
    h(!0);
    try {
      const E = await n();
      if (!E) return;
      const C = await r(E);
      if (C.error)
        return f(C.error);
      d(c.length, {
        ...C,
        selected: !0
      });
    } catch (E) {
      E instanceof Error && f(E.message);
    } finally {
      h(!1);
    }
  }
  function H(E) {
    const C = c.findIndex(({
      id: ne
    }) => ne === E.id), G = c.reduce((ne, w) => w.selected ? ne : ne + 1, 0);
    if (o === 1) {
      d([0, c.length - 1], "selected", !1), d(C, "selected", !0);
      return;
    }
    !c[C].selected && G <= o || C >= 0 && d(C, "selected", !c[C].selected);
  }
  return (() => {
    var E = $m(), C = E.firstChild, G = C.firstChild, ne = G.firstChild, w = ne.nextSibling, v = w.firstChild, T = w.nextSibling, I = G.nextSibling;
    return E.$$click = (S) => {
      a.contains(S.target) || e(null);
    }, E.addEventListener("close", b), Mt((S) => s = S, E), Mt((S) => a = S, C), k(w, (() => {
      var S = Q(() => !!u());
      return () => S() ? m(tl, {
        size: 22,
        class: "animate-spin"
      }) : m(Om, {
        size: 22
      });
    })(), v), v.$$input = (S) => M(S.target.value), k(T, (() => {
      var S = Q(() => c.length > 0);
      return () => S() ? m(Ve, {
        class: "flex bg-primary/50 hover:bg-primary/64",
        onClick: N,
        get children() {
          return jm();
        }
      }) : m(Ve, {
        class: "flex justify-center items-center",
        onClick: b,
        get children() {
          return m(ol, {
            size: 18,
            class: "my-1"
          });
        }
      });
    })()), k(C, (() => {
      var S = Q(() => !!g());
      return () => S() && (() => {
        var O = Rm();
        return k(O, g), O;
      })();
    })(), I), k(I, m(Ve, {
      class: "size-32 flex",
      onClick: _,
      get children() {
        var S = Nm(), O = S.firstChild;
        return k(S, m(Lm, {
          size: 58,
          class: "mb-2"
        }), O), S;
      }
    }), null), k(I, m(ds, {
      each: c,
      children: (S) => (() => {
        var O = Dm();
        return O.$$click = () => H(S), q((U) => {
          var $ = S.url, re = "transition size-32 rounded-lg outline-2 " + (S.selected ? "outline-primary" : "outline-transparent");
          return $ !== U.e && A(O, "src", U.e = $), re !== U.t && Qe(O, U.t = re), U;
        }, {
          e: void 0,
          t: void 0
        }), O;
      })()
    }), null), E;
  })();
}
Je(["click", "input"]);
function ri(o) {
  let e = o.getAttribute("photoapi");
  if (!e) throw Error("missing photoapi");
  return e.endsWith("/") || (e += "/"), e.startsWith("/") ? new URL(e, window.location.origin) : new URL(e);
}
function ii(o) {
  return o.startsWith("/") ? window.origin + o : o;
}
function nl() {
  return new Promise((o) => {
    const e = Object.assign(document.createElement("input"), {
      type: "file",
      accept: "image/*",
      onchange: () => {
        var t;
        o(((t = e.files) == null ? void 0 : t[0]) || null), document.body.removeChild(e);
      },
      oncancel: () => {
        o(null), document.body.removeChild(e);
      }
    });
    e.style.display = "none", document.body.appendChild(e), e.click();
  });
}
async function si(o, e) {
  if (!e) return "";
  const t = new URL(o + "get/");
  t.searchParams.set("get", e);
  const r = await (await fetch(t)).json();
  return ii(r.url);
}
function ai(o, e) {
  return new Promise((t) => {
    const n = document.createElement("div");
    document.body.append(n);
    const r = ft(
      () => zm({
        limit: e,
        ref: (i) => i.showModal(),
        selectFile: nl,
        getPhotoUrl: (i) => si(o, i),
        selectPhoto: (i) => ai(o, i),
        uploadPhoto: (i) => rl(o, i),
        searchPhoto: (i) => il(o, i),
        onSelected: (i) => {
          document.body.removeChild(n), r(), t(i);
        }
      }),
      n
    );
  });
}
async function rl(o, e) {
  const t = new URL(o + "upload/"), n = document.querySelector(
    "input[type=hidden][name=csrfmiddlewaretoken]"
  ), r = new FormData();
  r.append("photo", e), n && r.append("csrfmiddlewaretoken", n.value);
  try {
    const s = await (await fetch(t, {
      method: "POST",
      body: r
    })).json();
    return s.error ? { error: s.error } : {
      id: s.id,
      url: ii(s.url)
    };
  } catch (i) {
    return i instanceof Error ? { error: i.message } : { error: i };
  }
}
async function il(o, e) {
  const t = new URL(o + "search/");
  return t.searchParams.set("q", e), (await (await fetch(t)).json()).map(({ id: i, url: s }) => ({ id: i, url: ii(s) }));
}
class Um extends HTMLElement {
  constructor() {
    super();
    j(this, "_content");
    j(this, "editor");
    j(this, "valueInput");
    j(this, "initialContent");
    j(this, "plugins");
    j(this, "renderers");
    j(this, "parsers");
    const t = ri(this);
    this.plugins = window.ArticleEditorPlugins.map(
      (n) => n({
        onChange: this.submit.bind(this),
        selectFile: nl,
        getPhotoUrl: (r) => si(t, r),
        selectPhoto: (r) => ai(t, r),
        uploadPhoto: (r) => rl(t, r),
        searchPhoto: (r) => il(t, r)
      })
    ), this.renderers = Object.fromEntries(
      this.plugins.map((n) => [n.type, n.renderer])
    ), this.parsers = this.plugins.map((n) => n.parser), this.initialContent = this.innerHTML, this.innerHTML = "";
  }
  get content() {
    return this._content;
  }
  async submit() {
    this._content = await this.getContent(), this.valueInput.value = JSON.stringify(this._content), this.dispatchEvent(new Event("input")), console.log(this.content);
  }
  setContent(t) {
    const n = new DOMParser().parseFromString(t, "text/html");
    this.editor.blocks.insertMany(
      vs(n.body).map((r) => {
        try {
          for (const i of this.parsers) {
            const s = i(r);
            if (s) return s;
          }
        } catch (i) {
          console.error("could not parse node", i);
        }
        return {
          type: "raw",
          data: {
            html: te(r)
          }
        };
      })
    ), this.getContent().then((r) => this.valueInput.value = JSON.stringify(r));
  }
  render(t) {
    return t.map(({ type: n, data: r }) => this.renderers[n](r)).join("");
  }
  async getContent() {
    const { blocks: t } = await this.editor.save(), [n, ...r] = Yl(
      t,
      (i) => i.type === "header" && i.data.level === 2
    );
    return {
      excerpt: this.render(n),
      sections: r.map(([i, ...s], a) => ({
        order: a,
        title: i.data.text,
        content: this.render(s)
      }))
    };
  }
  connectedCallback() {
    this.editor = new Em({
      holder: this,
      tools: Object.fromEntries(
        this.plugins.map((t) => [t.type, t.toolSettings])
      ),
      onReady: () => this.setContent(this.initialContent)
    }), this.valueInput = Object.assign(document.createElement("input"), {
      type: "hidden",
      name: this.getAttribute("name")
    }), this.append(this.valueInput);
  }
  disconnectedCallback() {
    this.editor.destroy();
  }
}
window.ArticleEditorPlugins ?? (window.ArticleEditorPlugins = []);
window.addEventListener("load", () => {
  customElements.define("article-editor", Um);
});
var Wm = [["path", {
  d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  key: "1c8476"
}], ["path", {
  d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
  key: "1ydtos"
}], ["path", {
  d: "M7 3v4a1 1 0 0 0 1 1h7",
  key: "t51u73"
}]], qm = (o) => m(X, R(o, {
  iconNode: Wm,
  name: "save"
})), Km = qm, Vm = [["path", {
  d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
  key: "wmoenq"
}], ["path", {
  d: "M12 9v4",
  key: "juzpu7"
}], ["path", {
  d: "M12 17h.01",
  key: "p32p05"
}]], Ym = (o) => m(X, R(o, {
  iconNode: Vm,
  name: "triangle-alert"
})), Xm = Ym, Gm = /* @__PURE__ */ y('<div class="flex items-center"><input type=text name=title><div class="flex text-lg">'), Zm = /* @__PURE__ */ y("<span>Loading"), Jm = /* @__PURE__ */ y("<span>Saved"), Qm = /* @__PURE__ */ y("<span>Server Error: ");
const eb = 1e3, li = class li extends HTMLElement {
  connectedCallback() {
    var i, s;
    const e = document.querySelector("div#content"), t = this.closest("form"), n = document.createElement("input"), r = JSON.parse(this.getAttribute("attributes"));
    if (t.appendChild(n), n.type = "hidden", n.name = "title", n.value = r.article.fields.title, e) {
      const a = document.createElement("div");
      (i = e.querySelector("h1")) == null || i.remove(), (s = e.querySelector("h2")) == null || s.remove(), e.prepend(a), ft(() => this.render(n, r.article), a);
    }
  }
  render(e, t) {
    const [n, r] = Me(!1), i = this.closest("form"), s = this.querySelector("article-editor");
    let a;
    s.addEventListener("submit", l), i.addEventListener("input", l);
    function l() {
      r(!0), clearTimeout(a), a = setTimeout(async () => {
        try {
          const c = await fetch(i.action, {
            method: "POST",
            body: new FormData(i)
          });
          if (c.ok)
            r(!1), i.action.includes("/add") && (window.location.href = i.action.replace("/add/", `/${t.pk}/change/`));
          else {
            const d = new DOMParser().parseFromString(await c.text(), "text/html");
            r(d.querySelector("pre.exception_value").innerHTML);
          }
        } catch (c) {
          console.error(c), r(`Error: ${c instanceof Error ? c.message : c}`);
        }
      }, eb);
    }
    return (() => {
      var c = Gm(), d = c.firstChild, u = d.nextSibling;
      return d.$$input = (h) => {
        e.value = h.target.value, l();
      }, d.style.setProperty("font-size", "large"), k(u, (() => {
        var h = Q(() => n() === !0);
        return () => h() && [m(tl, {
          class: "animate-spin"
        }), Zm()];
      })(), null), k(u, (() => {
        var h = Q(() => n() === !1);
        return () => h() && [m(Km, {}), Jm()];
      })(), null), k(u, (() => {
        var h = Q(() => typeof n() == "string");
        return () => h() && [m(Xm, {}), (() => {
          var g = Qm();
          return g.firstChild, k(g, n, null), g;
        })()];
      })(), null), q(() => d.value = t.fields.title), c;
    })();
  }
};
customElements.define("article-form", li);
let Xi = li;
Je(["input"]);
var tb = [["path", {
  d: "M8 2v4",
  key: "1cmpym"
}], ["path", {
  d: "M16 2v4",
  key: "4m81vk"
}], ["rect", {
  width: "18",
  height: "18",
  x: "3",
  y: "4",
  rx: "2",
  key: "1hopcy"
}], ["path", {
  d: "M3 10h18",
  key: "8toen8"
}]], ob = (o) => m(X, R(o, {
  iconNode: tb,
  name: "calendar"
})), nb = ob, rb = [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["polyline", {
  points: "12 6 12 12 16 14",
  key: "68esgv"
}]], ib = (o) => m(X, R(o, {
  iconNode: rb,
  name: "clock"
})), sb = ib, ab = /* @__PURE__ */ y("<div><input type=hidden>"), lb = /* @__PURE__ */ y("<span>Remove"), cb = /* @__PURE__ */ y('<div class="flex flex-col gap-2"><img class="max-w-32 rounded">');
function sl({
  value: o,
  name: e,
  api: t
}) {
  let n;
  const [r, i] = Me(o), [s, a] = Me("");
  si(t, o).then((d) => {
    d && a(d);
  });
  function l() {
    ai(t, 1).then((d) => {
      if (d && d.length > 0) {
        const {
          id: u,
          url: h
        } = d[0];
        i(u), a(h), n.value = u, n.dispatchEvent(new Event("input", {
          bubbles: !0
        }));
      }
    });
  }
  function c() {
    i(""), a("");
  }
  return (() => {
    var d = ab(), u = d.firstChild;
    return Mt((h) => n = h, u), A(u, "name", e), u.value = o, k(d, (() => {
      var h = Q(() => !!(r() && s()));
      return () => h() ? (() => {
        var g = cb(), f = g.firstChild;
        return f.$$click = l, k(g, m(Ve, {
          class: "flex items-center mr-auto px-2 py-1",
          onClick: c,
          get children() {
            return [lb(), m(ol, {})];
          }
        }), null), q((b) => {
          var N = r(), M = s();
          return N !== b.e && A(f, "id", b.e = N), M !== b.t && A(f, "src", b.t = M), b;
        }, {
          e: void 0,
          t: void 0
        }), g;
      })() : m(Ve, {
        class: "flex mr-auto px-2 py-1",
        onClick: l,
        children: "Select Photo"
      });
    })(), null), d;
  })();
}
const ci = class ci extends HTMLElement {
  connectedCallback() {
    const e = ri(this), t = this.getAttribute("value") || "", n = this.getAttribute("name") || "";
    ft(() => m(sl, {
      value: t,
      name: n,
      api: e
    }), this);
  }
};
customElements.define("photo-button", ci);
let Gi = ci;
Je(["click"]);
var db = /* @__PURE__ */ y('<fieldset class="module aligned collapse"><details>'), ub = /* @__PURE__ */ y("<summary><h2 class=fieldset-heading>"), hb = /* @__PURE__ */ y("<div><div class=flex-container><label><span>:"), pb = /* @__PURE__ */ y("<select>"), fb = /* @__PURE__ */ y("<option>"), gb = /* @__PURE__ */ y("<input type=text class=vTextField maxlength=255>"), mb = /* @__PURE__ */ y("<input type=checkbox class=vBooleanField maxlength=255>"), bb = /* @__PURE__ */ y("<div class=datetime style=display:flex;flex-direction:column;><div style=display:flex;><input type=date></div><div style=display:flex;><input type=time>"), vb = /* @__PURE__ */ y("<textarea cols=20 rows=10 class=vLargeTextField>"), yb = /* @__PURE__ */ y("<input value=[] type=hidden>");
function Go({
  title: o,
  children: e,
  open: t = !1
}) {
  return (() => {
    var n = db(), r = n.firstChild;
    return r.open = t, k(r, o && (() => {
      var i = ub(), s = i.firstChild;
      return k(s, o), i;
    })(), null), k(r, e, null), n;
  })();
}
function nt({
  name: o,
  label: e,
  required: t = !1,
  children: n
}) {
  return e ?? (e = o.split("_").map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(" ")), (() => {
    var r = hb(), i = r.firstChild, s = i.firstChild, a = s.firstChild, l = a.firstChild;
    return Qe(r, `form-row field-${o}`), s.classList.toggle("required", !!t), A(s, "for", `id_${o}`), k(a, e, l), k(i, n, null), r;
  })();
}
function Zi({
  name: o,
  label: e,
  required: t,
  value: n,
  options: r
}) {
  return m(nt, R({
    name: o,
    label: e,
    required: t
  }, {
    get children() {
      var i = pb();
      return A(i, "name", o), A(i, "id", `id_${o}`), k(i, () => r.map(([s, a]) => (() => {
        var l = fb();
        return l.value = s, l.selected = s == n, k(l, a), l;
      })())), i;
    }
  }));
}
function xt({
  name: o,
  label: e,
  required: t,
  value: n = ""
}) {
  return m(nt, R({
    name: o,
    label: e,
    required: t
  }, {
    get children() {
      var r = gb();
      return A(r, "id", `id_${o}`), A(r, "name", o), r.value = n, r.required = t, r;
    }
  }));
}
function kb({
  name: o,
  label: e,
  required: t,
  value: n
}) {
  return m(nt, R({
    name: o,
    label: e,
    required: t
  }, {
    get children() {
      var r = mb();
      return A(r, "id", `id_${o}`), A(r, "name", o), r.checked = n, r.required = t, r;
    }
  }));
}
function wb({
  name: o,
  label: e,
  required: t,
  value: n
}) {
  const r = n ? new Date(n) : /* @__PURE__ */ new Date(), i = r.toISOString().split("T")[0], s = String(r.getHours()).padStart(2, "0"), a = String(r.getMinutes()).padStart(2, "0"), l = `${s}:${a}`;
  return m(nt, R({
    name: o,
    label: e,
    required: t
  }, {
    get children() {
      var c = bb(), d = c.firstChild, u = d.firstChild, h = d.nextSibling, g = h.firstChild;
      return k(d, m(nb, {
        size: 16
      }), u), A(u, "id", `id_${o}_0`), A(u, "name", `${o}_0`), u.value = n ? i : "", u.required = t, k(h, m(sb, {
        size: 16
      }), g), A(g, "id", `id_${o}_1`), A(g, "name", `${o}_1`), g.value = n ? l : "", g.required = t, c;
    }
  }));
}
function Zo({
  name: o,
  label: e,
  required: t,
  value: n = "",
  photoapi: r
}) {
  return m(nt, R({
    name: o,
    label: e,
    required: t
  }, {
    get children() {
      return m(sl, {
        api: r,
        value: n,
        name: o
      });
    }
  }));
}
function Ct({
  name: o,
  label: e,
  required: t,
  value: n = ""
}) {
  return m(nt, R({
    name: o,
    label: e,
    required: t
  }, {
    get children() {
      var r = vb();
      return A(r, "id", `id_${o}`), A(r, "name", o), k(r, n), r;
    }
  }));
}
function xb({
  name: o,
  label: e,
  required: t,
  tags: n,
  value: r = []
}) {
  return m(nt, R({
    name: o,
    label: e,
    required: t
  }, {
    get children() {
      var i = yb();
      return A(i, "name", o), i;
    }
  }));
}
var Cb = /* @__PURE__ */ y("<input type=hidden name=id>");
const di = class di extends HTMLElement {
  connectedCallback() {
    const e = document.querySelector("#toggle-sidebar");
    e && e.addEventListener("click", (n) => {
      n.preventDefault(), this.hidden = !this.hidden;
    });
    const t = document.createElement("div");
    this.prepend(t), ft(this.render.bind(this), t);
  }
  render() {
    const e = JSON.parse(this.getAttribute("attributes")), {
      slug: t,
      subtitle: n,
      locale: r,
      author: i,
      featured: s,
      published_at: a,
      feature_image: l,
      meta_title: c,
      meta_description: d,
      og_title: u,
      og_description: h,
      og_image: g,
      twitter_title: f,
      twitter_description: b,
      twitter_image: N,
      code_injection_foot: M,
      code_injection_head: _
    } = e.article.fields, H = ri(this), E = e.authors.map((C) => [C.pk, C.fields.name]);
    return [(() => {
      var C = Cb();
      return q(() => C.value = e.article.pk), C;
    })(), m(Go, {
      open: !0,
      title: "Attributes",
      get children() {
        return [m(xt, {
          name: "slug",
          required: !0,
          get value() {
            return t || e.article.pk;
          }
        }), m(Zi, {
          name: "locale",
          required: !0,
          value: r,
          get options() {
            return e.locales;
          }
        }), m(Zi, {
          name: "author",
          required: !0,
          value: i,
          options: E
        }), m(xt, {
          name: "subtitle",
          value: n
        }), m(wb, {
          name: "published_at",
          label: "Schedule",
          value: a
        }), m(kb, {
          name: "featured",
          value: s
        }), m(Zo, {
          name: "feature_image",
          value: l,
          photoapi: H
        }), m(xb, {
          name: "tags",
          get tags() {
            return e.tags;
          },
          get value() {
            return e.article.tags;
          }
        })];
      }
    }), m(Go, {
      title: "Meta Information",
      get children() {
        return [m(xt, {
          name: "meta_title",
          value: c
        }), m(Ct, {
          name: "meta_description",
          value: d
        }), m(xt, {
          name: "og_title",
          value: u
        }), m(Zo, {
          name: "og_image",
          value: g,
          photoapi: H
        }), m(Ct, {
          name: "og_description",
          value: h
        }), m(xt, {
          name: "twitter_title",
          value: f
        }), m(Zo, {
          name: "twitter_image",
          value: N,
          photoapi: H
        }), m(Ct, {
          name: "twitter_description",
          value: b
        })];
      }
    }), m(Go, {
      open: !!(_ || M),
      title: "Code Injection",
      get children() {
        return [m(Ct, {
          name: "code_injection_head",
          value: _
        }), m(Ct, {
          name: "code_injection_foot",
          value: M
        })];
      }
    })];
  }
};
customElements.define("article-form-fields", di);
let Ji = di;
