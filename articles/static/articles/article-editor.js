var $n = Object.defineProperty;
var Io = (s) => {
  throw TypeError(s);
};
var zn = (s, t, e) => t in s ? $n(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var I = (s, t, e) => zn(s, typeof t != "symbol" ? t + "" : t, e), Lo = (s, t, e) => t.has(s) || Io("Cannot " + e);
var st = (s, t, e) => (Lo(s, t, "read from private field"), e ? e.call(s) : t.get(s)), ge = (s, t, e) => t.has(s) ? Io("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e);
var Mo = (s, t, e) => (Lo(s, t, "access private method"), e);
class xt {
  constructor(t) {
    I(this, "emitter");
    I(this, "transformFn", (t) => t);
    this.emitter = t;
  }
  toString() {
    return `Binding<${this.emitter}>`;
  }
  as(t) {
    const e = new xt(this.emitter);
    return e.transformFn = (i) => t(this.transformFn(i)), e;
  }
  get() {
    return this.transformFn(this.emitter.get());
  }
  subscribe(t) {
    return this.emitter.subscribe(() => {
      t(this.get());
    });
  }
}
class tt extends Function {
  constructor(e) {
    super();
    I(this, "value");
    I(this, "listeners");
    I(this, "derived");
    return this.listeners = /* @__PURE__ */ new Set(), this.value = e, new Proxy(this, {
      apply: (i, o, n) => i._call(n[0])
    });
  }
  _call(e) {
    const i = new xt(this);
    return e ? i.as(e) : i;
  }
  toString() {
    return `State<${String(this.get())}>`;
  }
  get() {
    return this.value;
  }
  set(e) {
    e !== this.value && (this.value = e, this.listeners.forEach((i) => i(e)));
  }
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  drop() {
    if (this.derived)
      for (const e of this.derived)
        e();
  }
  static derive(e, i = (...o) => o) {
    const o = () => i(...e.map((r) => r.get())), n = new tt(o());
    return n.derived = e.map((r) => r.subscribe(() => n.set(o()))), n;
  }
  static fake(e) {
    return e instanceof xt ? e : new xt({
      get: () => e,
      subscribe: () => () => {
      }
    });
  }
  static tmplt(e, ...i) {
    const o = i.filter((a) => a instanceof tt || a instanceof xt), n = o.map((a) => i.indexOf(a)), r = (...a) => {
      let l = 0;
      const c = (d) => n.includes(d) ? a[l++] : i[d] ?? "";
      return e.flatMap((d, h) => d + `${String(c(h))}`).join("");
    };
    return tt.derive(o, r);
  }
}
const { derive: hh, fake: jn, tmplt: uh } = tt;
function Un(s) {
  return !Object.hasOwn(s, "prototype");
}
function di(s, t) {
  for (t = t.flat(1 / 0).filter(Boolean); s.firstChild; )
    t.find((e) => e === s.firstChild) || s.firstChild.dispatchEvent(new CustomEvent("disconnect", {
      bubbles: !1
    })), s.removeChild(s.firstChild);
  s.append(...t);
}
function Ui(s, t) {
  Array.isArray(t) || (t = [t]);
  const e = ks(t.flat(1 / 0));
  if (e instanceof xt) {
    di(s, e.get());
    const i = e.subscribe((o) => di(s, o));
    s.addEventListener("disconnect", i);
  } else
    e.length > 0 && di(s, e);
}
function ks(s) {
  function t(...i) {
    let o = 0;
    return s.map(
      (n) => n instanceof xt ? i[o++] : n
    );
  }
  const e = s.filter((i) => i instanceof xt);
  return e.length === 0 ? s : e.length === 1 ? e[0].as(t) : tt.derive(e, t)();
}
function Oe(s, t) {
  for (const [e, i] of Object.entries(t))
    if (s[e] && typeof s[e] == "object" && typeof i == "object")
      Object.assign(s[e], i);
    else
      try {
        s[e] = i;
      } catch (o) {
        console.error(o);
      }
  if (typeof t.attributes == "object")
    for (const [e, i] of Object.entries(t.attributes))
      i != null && i != null && s.setAttribute(e, String(i));
  return s;
}
function Wn(s, { onDisconnect: t, setup: e, children: i, ...o }) {
  const n = Object.entries(o).filter(([, r]) => r instanceof xt).map(([r, a]) => (delete o[r], [r, a]));
  Ui(s, i);
  for (const [r, a] of n) {
    const l = a.subscribe((c) => {
      Oe(s, { [r]: c });
    });
    s.addEventListener("disconnect", l), Oe(s, { [r]: a.get() });
  }
  return Oe(s, o), typeof e == "function" && e(s), typeof t == "function" && s.addEventListener("disconnect", () => t(s)), s;
}
function p(s, t) {
  return t.children ?? (t.children = []), Array.isArray(t.children) || (t.children = [t.children]), typeof s == "string" ? Wn(document.createElement(s), t) : Un(s) ? s(t) : new s(t);
}
const T = p;
function oe({ children: s }) {
  return s && ks(s);
}
function mt({ children: s, flat: t = !1, placeholder: e = "", ...i }) {
  return /* @__PURE__ */ p(
    "div",
    {
      setup: (o) => {
        o.style.setProperty("--input-placeholder", `"${e}"`);
      },
      className: `Input ${t ? "flat" : ""}`,
      contentEditable: "true",
      innerHTML: s,
      ...i
    }
  );
}
const ko = class ko extends HTMLElement {
  constructor({ children: t, className: e = "", ...i }) {
    super(), this.classList.add("Block"), e && this.classList.add(e), Oe(this, i), this.body = /* @__PURE__ */ p("div", { className: "body", children: t }), this.append(this.body);
  }
};
customElements.define("ae-block", ko);
let Lt = ko;
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xs = (s, t, e = []) => {
  const i = document.createElementNS("http://www.w3.org/2000/svg", s);
  return Object.keys(t).forEach((o) => {
    i.setAttribute(o, String(t[o]));
  }), e.length && e.forEach((o) => {
    const n = xs(...o);
    i.appendChild(n);
  }), i;
};
var qn = ([s, t, e]) => xs(s, t, e);
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const U = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Yn = [
  "svg",
  U,
  [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kn = [
  "svg",
  U,
  [
    ["path", { d: "m11 17-5-5 5-5" }],
    ["path", { d: "m18 17-5-5 5-5" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Xn = [
  "svg",
  U,
  [
    ["path", { d: "m6 17 5-5-5-5" }],
    ["path", { d: "m13 17 5-5-5-5" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zn = [
  "svg",
  U,
  [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gn = [
  "svg",
  U,
  [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "M12 8v8" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jn = [
  "svg",
  U,
  [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["polyline", { points: "12 6 12 12 16 14" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qn = [
  "svg",
  U,
  [
    ["path", { d: "m18 16 4-4-4-4" }],
    ["path", { d: "m6 8-4 4 4 4" }],
    ["path", { d: "m14.5 4-5 16" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _i = [
  "svg",
  U,
  [
    ["path", { d: "M15 3h6v6" }],
    ["path", { d: "M10 14 21 3" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tr = [
  "svg",
  U,
  [
    ["line", { x1: "22", x2: "2", y1: "6", y2: "6" }],
    ["line", { x1: "22", x2: "2", y1: "18", y2: "18" }],
    ["line", { x1: "6", x2: "6", y1: "2", y2: "22" }],
    ["line", { x1: "18", x2: "18", y1: "2", y2: "22" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const er = [
  "svg",
  U,
  [
    ["path", { d: "M6 12h12" }],
    ["path", { d: "M6 20V4" }],
    ["path", { d: "M18 20V4" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ir = [
  "svg",
  U,
  [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
    ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const or = [
  "svg",
  U,
  [
    ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6" }],
    ["path", { d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" }],
    ["circle", { cx: "12", cy: "8", r: "2" }],
    ["rect", { width: "16", height: "16", x: "6", y: "2", rx: "2" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const sr = [
  "svg",
  U,
  [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nr = [
  "svg",
  U,
  [
    ["path", { d: "M12 2v4" }],
    ["path", { d: "m16.2 7.8 2.9-2.9" }],
    ["path", { d: "M18 12h4" }],
    ["path", { d: "m16.2 16.2 2.9 2.9" }],
    ["path", { d: "M12 18v4" }],
    ["path", { d: "m4.9 19.1 2.9-2.9" }],
    ["path", { d: "M2 12h4" }],
    ["path", { d: "m4.9 4.9 2.9 2.9" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rr = ["svg", U, [["path", { d: "M5 12h14" }]]];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ar = [
  "svg",
  U,
  [
    ["rect", { width: "16", height: "6", x: "2", y: "2", rx: "2" }],
    ["path", { d: "M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" }],
    ["rect", { width: "4", height: "6", x: "8", y: "16", rx: "1" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ao = [
  "svg",
  U,
  [
    [
      "path",
      {
        d: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      }
    ]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const lr = [
  "svg",
  U,
  [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      }
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const cr = [
  "svg",
  U,
  [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const dr = [
  "svg",
  U,
  [
    [
      "path",
      {
        d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"
      }
    ]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hr = [
  "svg",
  U,
  [
    [
      "path",
      {
        d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
      }
    ],
    ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ur = [
  "svg",
  U,
  [
    ["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pr = [
  "svg",
  U,
  [
    ["polyline", { points: "4 7 4 4 20 4 20 7" }],
    ["line", { x1: "9", x2: "15", y1: "20", y2: "20" }],
    ["line", { x1: "12", x2: "12", y1: "4", y2: "20" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gr = [
  "svg",
  U,
  [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["polyline", { points: "17 8 12 3 7 8" }],
    ["line", { x1: "12", x2: "12", y1: "3", y2: "15" }]
  ]
];
/**
 * @license lucide v0.441.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ti = [
  "svg",
  U,
  [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }]
  ]
];
function Ro(s) {
  return Array.isArray(s);
}
function V(s) {
  const t = qn(Ro(s) ? s : s.icon);
  if (Ro(s))
    return t.outerHTML;
  const { icon: e, className: i = "", stroke: o = 2, color: n, ...r } = s;
  return t.setAttribute("stroke-width", String(o)), n && t.setAttribute("stroke", n), /* @__PURE__ */ p(
    "div",
    {
      className: `Icon ${e} ${i}`,
      innerHTML: t.outerHTML,
      ...r
    }
  );
}
function at({
  children: s,
  className: t = "",
  ...e
}) {
  return /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      className: jn(t).as((i) => `Button ${i}`),
      ...e,
      children: s
    }
  );
}
function _s({
  placeholder: s = "Search",
  onSearch: t,
  setup: e
}) {
  let i;
  return /* @__PURE__ */ T("div", { className: "Search", children: [
    /* @__PURE__ */ p(V, { icon: cr }),
    /* @__PURE__ */ p(
      "input",
      {
        setup: (o) => {
          i = o, e == null || e(o);
        },
        type: "search",
        placeholder: s,
        oninput: () => void t(i.value)
      }
    )
  ] });
}
const Po = 19, fr = 500;
class mr {
  constructor(t, e) {
    I(this, "debounce");
    I(this, "selectResolve");
    I(this, "selected", new tt([]));
    I(this, "loading", new tt(!1));
    I(this, "error", new tt(""));
    I(this, "photos", new tt([]));
    I(this, "dialog", /* @__PURE__ */ T("dialog", { className: "PhotoSelector", onclose: this.close.bind(this), children: [
      /* @__PURE__ */ T("nav", { children: [
        /* @__PURE__ */ p("span", { className: "title", children: "Photos" }),
        /* @__PURE__ */ p(_s, { onSearch: this.onSearch.bind(this) }),
        /* @__PURE__ */ T("div", { style: { display: "flex", flex: "1" }, children: [
          this.loading((t) => t && /* @__PURE__ */ p(V, { icon: nr })),
          this.selected((t) => t.length > 0 ? /* @__PURE__ */ p(at, { className: "primary", onclick: this.onSelect.bind(this), children: "Select" }) : /* @__PURE__ */ p(at, { className: "close", onclick: this.close.bind(this), children: /* @__PURE__ */ p(V, { icon: ti }) }))
        ] })
      ] }),
      this.error((t) => t ? /* @__PURE__ */ p("div", { className: "error", children: t }) : /* @__PURE__ */ T("div", { className: "body", children: [
        /* @__PURE__ */ p(at, { className: "upload", onclick: this.uploadImage.bind(this), children: /* @__PURE__ */ T("div", { children: [
          /* @__PURE__ */ p(V, { icon: gr }),
          /* @__PURE__ */ p("span", { children: "Upload Image" })
        ] }) }),
        this.photos((e) => e.map((i) => /* @__PURE__ */ p(
          "img",
          {
            src: i.url,
            onclick: () => this.toggleSelection(i),
            className: this.selected((o) => o.some(({ id: n }) => i.id === n) ? "selected" : "")
          }
        )))
      ] }))
    ] }));
    this.limit = t, this.source = e;
  }
  async onSearch(t) {
    t != "" && (this.loading.set(!0), clearTimeout(this.debounce), this.debounce = setTimeout(async () => {
      const e = await wr(this.source)(t);
      this.photos.set(e.slice(0, Po)), this.loading.set(!1);
    }, fr));
  }
  onSelect() {
    document.body.removeChild(this.dialog), this.selectResolve(this.selected.get());
  }
  async uploadImage() {
    const t = await vr();
    if (t) {
      this.loading.set(!0);
      try {
        const e = await br(this.source)(t);
        if (e.error)
          return this.error.set(`Server error: ${e.error}`);
        this.photos.set([
          { id: e.id, url: e.url },
          ...this.photos.get().slice(0, Po - 1)
        ]), this.toggleSelection(this.photos.get()[0]);
      } catch (e) {
        console.error(e), this.error.set("Server Error");
      }
      this.loading.set(!1);
    }
  }
  toggleSelection(t) {
    const e = this.selected.get();
    if (e.find((i) => i.id === t.id))
      return this.selected.set(e.filter((i) => i.id !== t.id));
    if (e.length === this.limit)
      return this.selected.set([t, ...e.slice(0, -1)]);
    this.selected.set([t, ...e]);
  }
  close() {
    document.body.removeChild(this.dialog), this.selectResolve(null);
  }
  select() {
    return document.body.append(this.dialog), this.dialog.showModal(), new Promise((t) => {
      this.selectResolve = t;
    });
  }
}
function Wi(s) {
  if (s instanceof URL)
    return s;
  const t = typeof s == "string" ? s : s.getAttribute("photoapi");
  if (!t)
    throw Error("missing photoapi");
  return t.startsWith("/") ? new URL(t, window.location.origin) : new URL(t);
}
function qi(s) {
  const t = typeof s == "string" ? s : s.url, e = t.startsWith("/") ? window.origin + t : t;
  return typeof s == "string" ? e : { ...s, url: t };
}
function Es(s) {
  return async function(t) {
    if (!t) return "";
    const e = Wi(s);
    e.pathname += "/get", e.searchParams.set("get", t);
    const o = await (await fetch(e)).json();
    return qi(o.url);
  };
}
function Cs(s) {
  return function(e) {
    return new mr(e, s).select();
  };
}
function vr() {
  return new Promise((s) => {
    const t = Object.assign(document.createElement("input"), {
      type: "file",
      accept: "image/*",
      onchange: () => {
        var e;
        s(((e = t.files) == null ? void 0 : e[0]) || null), document.body.removeChild(t);
      },
      oncancel: () => {
        s(null), document.body.removeChild(t);
      }
    });
    t.style.display = "none", document.body.appendChild(t), t.click();
  });
}
function br(s) {
  return async function(t) {
    const e = document.querySelector(
      "input[type=hidden][name=csrfmiddlewaretoken]"
    ), i = new FormData();
    i.append("photo", t), e && i.append("csrfmiddlewaretoken", e.value);
    const o = Wi(s);
    o.pathname += "/upload/";
    const n = new Request(o, {
      method: "POST",
      body: i
    });
    try {
      const a = await (await fetch(n)).json();
      return a.error ? { error: a.error } : {
        id: a.id,
        url: qi(a.url)
      };
    } catch (r) {
      return r instanceof Error ? { error: r.message } : { error: r };
    }
  };
}
function wr(s) {
  return async function(t) {
    const e = Wi(s);
    return e.pathname += "/search", e.searchParams.set("q", t), (await (await fetch(e)).json()).map(qi);
  };
}
function yr(s) {
  return function(t) {
    return s.querySelector(t);
  };
}
function kr(s) {
  return function(t) {
    let e = s.querySelector(t).innerHTML;
    for (; e.endsWith("<br>"); )
      e = e.slice(0, -4);
    return e.trim();
  };
}
function xr(s) {
  return function(t) {
    return s.querySelector(t).innerText.trim();
  };
}
function Ts(s) {
  if (s) {
    for (; s.endsWith("<br>") || /\s$/.test(s); )
      s = s.trim(), s = s.replace(/(<br\s*\/?>)+$/i, "");
    return s;
  }
}
function Oo(s) {
  return { block: s, q: yr(s), html: kr(s), text: xr(s) };
}
function _r(s, t) {
  return s.reduce((e, i) => (t(i) ? e.push([i]) : e[e.length - 1].push(i), e), [[]]);
}
function Er(s) {
  if (s.length > 0)
    return Object.values(s).reduce((t, e) => ({
      ...t,
      [e.nodeName]: e.nodeValue
    }), {});
}
function No(s = {}) {
  const t = Object.entries(s).reduce((e, [i, o]) => e.concat([`${i}="${o}"`]), []).join(" ");
  return t ? " " + t : "";
}
function Ss(s) {
  return Array.from(s.childNodes).map((e) => {
    switch (e.nodeType) {
      case e.ELEMENT_NODE:
        return {
          // NOTE: nodeName is in UPPERCASE when DOMParser is text/html
          type: e.nodeName.toLowerCase(),
          attributes: Er(e.attributes),
          content: Ss(e)
        };
      case e.TEXT_NODE:
        return {
          type: "#text",
          content: e.nodeValue ?? ""
        };
      case e.COMMENT_NODE:
        return {
          type: "#comment",
          content: e.nodeValue ?? ""
        };
      default:
        throw Error(`missing case for node type ${e.nodeType}`);
    }
  }).filter((e) => e.type === "#text" || e.type === "#comment" ? !/^\s*$/.test(e.content) : !0);
}
function ct(s) {
  switch (s.type) {
    case "#text":
      return s.content;
    case "#comment":
      return `<!--${s.content}-->`;
    case "img":
      return `<img ${No(s.attributes ?? {})}>`;
    default: {
      const t = s.type, e = s.content.map(ct).join(""), i = No(s.attributes);
      return `<${t}${i}>${e}</${t}>`;
    }
  }
}
(function() {
  try {
    if (typeof document < "u") {
      var s = document.createElement("style");
      s.appendChild(document.createTextNode(".ce-hint--align-start{text-align:left}.ce-hint--align-center{text-align:center}.ce-hint__description{opacity:.6;margin-top:3px}")), document.head.appendChild(s);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
var Cr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ei(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
function hi() {
}
Object.assign(hi, {
  default: hi,
  register: hi,
  revert: function() {
  },
  __esModule: !0
});
Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s) {
  const t = (this.document || this.ownerDocument).querySelectorAll(s);
  let e = t.length;
  for (; --e >= 0 && t.item(e) !== this; )
    ;
  return e > -1;
});
Element.prototype.closest || (Element.prototype.closest = function(s) {
  let t = this;
  if (!document.documentElement.contains(t))
    return null;
  do {
    if (t.matches(s))
      return t;
    t = t.parentElement || t.parentNode;
  } while (t !== null);
  return null;
});
Element.prototype.prepend || (Element.prototype.prepend = function(s) {
  const t = document.createDocumentFragment();
  Array.isArray(s) || (s = [s]), s.forEach((e) => {
    const i = e instanceof Node;
    t.appendChild(i ? e : document.createTextNode(e));
  }), this.insertBefore(t, this.firstChild);
});
Element.prototype.scrollIntoViewIfNeeded || (Element.prototype.scrollIntoViewIfNeeded = function(s) {
  s = arguments.length === 0 ? !0 : !!s;
  const t = this.parentNode, e = window.getComputedStyle(t, null), i = parseInt(e.getPropertyValue("border-top-width")), o = parseInt(e.getPropertyValue("border-left-width")), n = this.offsetTop - t.offsetTop < t.scrollTop, r = this.offsetTop - t.offsetTop + this.clientHeight - i > t.scrollTop + t.clientHeight, a = this.offsetLeft - t.offsetLeft < t.scrollLeft, l = this.offsetLeft - t.offsetLeft + this.clientWidth - o > t.scrollLeft + t.clientWidth, c = n && !r;
  (n || r) && s && (t.scrollTop = this.offsetTop - t.offsetTop - t.clientHeight / 2 - i + this.clientHeight / 2), (a || l) && s && (t.scrollLeft = this.offsetLeft - t.offsetLeft - t.clientWidth / 2 - o + this.clientWidth / 2), (n || r || a || l) && !s && this.scrollIntoView(c);
});
window.requestIdleCallback = window.requestIdleCallback || function(s) {
  const t = Date.now();
  return setTimeout(function() {
    s({
      didTimeout: !1,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - t));
      }
    });
  }, 1);
};
window.cancelIdleCallback = window.cancelIdleCallback || function(s) {
  clearTimeout(s);
};
let Tr = (s = 21) => crypto.getRandomValues(new Uint8Array(s)).reduce((t, e) => (e &= 63, e < 36 ? t += e.toString(36) : e < 62 ? t += (e - 26).toString(36).toUpperCase() : e > 62 ? t += "-" : t += "_", t), "");
var Bs = /* @__PURE__ */ ((s) => (s.VERBOSE = "VERBOSE", s.INFO = "INFO", s.WARN = "WARN", s.ERROR = "ERROR", s))(Bs || {});
const S = {
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
}, Sr = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4
};
function Ie(s, t, e = "log", i, o = "color: inherit") {
  if (!("console" in window) || !window.console[e])
    return;
  const n = ["info", "log", "warn", "error"].includes(e), r = [];
  switch (Ie.logLevel) {
    case "ERROR":
      if (e !== "error")
        return;
      break;
    case "WARN":
      if (!["error", "warn"].includes(e))
        return;
      break;
    case "INFO":
      if (!n || s)
        return;
      break;
  }
  i && r.push(i);
  const a = "Editor.js 2.30.6";
  s && (n ? (r.unshift(`line-height: 1em;
            color: #006FEA;
            display: inline-block;
            font-size: 11px;
            line-height: 1em;
            background-color: #fff;
            padding: 4px 9px;
            border-radius: 30px;
            border: 1px solid rgba(56, 138, 229, 0.16);
            margin: 4px 5px 4px 0;`, o), t = `%c${a}%c ${t}`) : t = `( ${a} )${t}`);
  try {
    n ? i ? console[e](`${t} %o`, ...r) : console[e](t, ...r) : console[e](t);
  } catch {
  }
}
Ie.logLevel = "VERBOSE";
function Br(s) {
  Ie.logLevel = s;
}
const F = Ie.bind(window, !1), yt = Ie.bind(window, !0);
function Kt(s) {
  return Object.prototype.toString.call(s).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
function K(s) {
  return Kt(s) === "function" || Kt(s) === "asyncfunction";
}
function et(s) {
  return Kt(s) === "object";
}
function Ot(s) {
  return Kt(s) === "string";
}
function Ir(s) {
  return Kt(s) === "boolean";
}
function Do(s) {
  return Kt(s) === "number";
}
function Vo(s) {
  return Kt(s) === "undefined";
}
function kt(s) {
  return s ? Object.keys(s).length === 0 && s.constructor === Object : !0;
}
function Is(s) {
  return s > 47 && s < 58 || // number keys
  s === 32 || s === 13 || // Space bar & return key(s)
  s === 229 || // processing key input for certain languages — Chinese, Japanese, etc.
  s > 64 && s < 91 || // letter keys
  s > 95 && s < 112 || // Numpad keys
  s > 185 && s < 193 || // ;=,-./` (in order)
  s > 218 && s < 223;
}
async function Lr(s, t = () => {
}, e = () => {
}) {
  async function i(o, n, r) {
    try {
      await o.function(o.data), await n(Vo(o.data) ? {} : o.data);
    } catch {
      r(Vo(o.data) ? {} : o.data);
    }
  }
  return s.reduce(async (o, n) => (await o, i(n, t, e)), Promise.resolve());
}
function Ls(s) {
  return Array.prototype.slice.call(s);
}
function je(s, t) {
  return function() {
    const e = this, i = arguments;
    window.setTimeout(() => s.apply(e, i), t);
  };
}
function Mr(s) {
  return s.name.split(".").pop();
}
function Ar(s) {
  return /^[-\w]+\/([-+\w]+|\*)$/.test(s);
}
function Ho(s, t, e) {
  let i;
  return (...o) => {
    const n = this, r = () => {
      i = null, s.apply(n, o);
    };
    window.clearTimeout(i), i = window.setTimeout(r, t);
  };
}
function Ei(s, t, e = void 0) {
  let i, o, n, r = null, a = 0;
  e || (e = {});
  const l = function() {
    a = e.leading === !1 ? 0 : Date.now(), r = null, n = s.apply(i, o), r || (i = o = null);
  };
  return function() {
    const c = Date.now();
    !a && e.leading === !1 && (a = c);
    const d = t - (c - a);
    return i = this, o = arguments, d <= 0 || d > t ? (r && (clearTimeout(r), r = null), a = c, n = s.apply(i, o), r || (i = o = null)) : !r && e.trailing !== !1 && (r = setTimeout(l, d)), n;
  };
}
function Rr() {
  const s = {
    win: !1,
    mac: !1,
    x11: !1,
    linux: !1
  }, t = Object.keys(s).find((e) => window.navigator.appVersion.toLowerCase().indexOf(e) !== -1);
  return t && (s[t] = !0), s;
}
function Ue(s) {
  return s[0].toUpperCase() + s.slice(1);
}
function Ci(s, ...t) {
  if (!t.length)
    return s;
  const e = t.shift();
  if (et(s) && et(e))
    for (const i in e)
      et(e[i]) ? (s[i] || Object.assign(s, { [i]: {} }), Ci(s[i], e[i])) : Object.assign(s, { [i]: e[i] });
  return Ci(s, ...t);
}
function Yi(s) {
  const t = Rr();
  return s = s.replace(/shift/gi, "⇧").replace(/backspace/gi, "⌫").replace(/enter/gi, "⏎").replace(/up/gi, "↑").replace(/left/gi, "→").replace(/down/gi, "↓").replace(/right/gi, "←").replace(/escape/gi, "⎋").replace(/insert/gi, "Ins").replace(/delete/gi, "␡").replace(/\+/gi, " + "), t.mac ? s = s.replace(/ctrl|cmd/gi, "⌘").replace(/alt/gi, "⌥") : s = s.replace(/cmd/gi, "Ctrl").replace(/windows/gi, "WIN"), s;
}
function Pr(s) {
  try {
    return new URL(s).href;
  } catch {
  }
  return s.substring(0, 2) === "//" ? window.location.protocol + s : window.location.origin + s;
}
function Or() {
  return Tr(10);
}
function Nr(s) {
  window.open(s, "_blank");
}
function Dr(s = "") {
  return `${s}${Math.floor(Math.random() * 1e8).toString(16)}`;
}
function Ti(s, t, e) {
  const i = `«${t}» is deprecated and will be removed in the next major release. Please use the «${e}» instead.`;
  s && yt(i, "warn");
}
function ce(s, t, e) {
  const i = e.value ? "value" : "get", o = e[i], n = `#${t}Cache`;
  if (e[i] = function(...r) {
    return this[n] === void 0 && (this[n] = o.apply(this, ...r)), this[n];
  }, i === "get" && e.set) {
    const r = e.set;
    e.set = function(a) {
      delete s[n], r.apply(this, a);
    };
  }
  return e;
}
const Ms = 650;
function de() {
  return window.matchMedia(`(max-width: ${Ms}px)`).matches;
}
const Si = typeof window < "u" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
function Vr(s, t) {
  const e = Array.isArray(s) || et(s), i = Array.isArray(t) || et(t);
  return e || i ? JSON.stringify(s) === JSON.stringify(t) : s === t;
}
let m = class rt {
  /**
   * Check if passed tag has no closed tag
   *
   * @param {HTMLElement} tag - element to check
   * @returns {boolean}
   */
  static isSingleTag(t) {
    return t.tagName && [
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
    ].includes(t.tagName);
  }
  /**
   * Check if element is BR or WBR
   *
   * @param {HTMLElement} element - element to check
   * @returns {boolean}
   */
  static isLineBreakTag(t) {
    return t && t.tagName && [
      "BR",
      "WBR"
    ].includes(t.tagName);
  }
  /**
   * Helper for making Elements with class name and attributes
   *
   * @param  {string} tagName - new Element tag name
   * @param  {string[]|string} [classNames] - list or name of CSS class name(s)
   * @param  {object} [attributes] - any attributes
   * @returns {HTMLElement}
   */
  static make(t, e = null, i = {}) {
    const o = document.createElement(t);
    if (Array.isArray(e)) {
      const n = e.filter((r) => r !== void 0);
      o.classList.add(...n);
    } else
      e && o.classList.add(e);
    for (const n in i)
      Object.prototype.hasOwnProperty.call(i, n) && (o[n] = i[n]);
    return o;
  }
  /**
   * Creates Text Node with the passed content
   *
   * @param {string} content - text content
   * @returns {Text}
   */
  static text(t) {
    return document.createTextNode(t);
  }
  /**
   * Append one or several elements to the parent
   *
   * @param  {Element|DocumentFragment} parent - where to append
   * @param  {Element|Element[]|DocumentFragment|Text|Text[]} elements - element or elements list
   */
  static append(t, e) {
    Array.isArray(e) ? e.forEach((i) => t.appendChild(i)) : t.appendChild(e);
  }
  /**
   * Append element or a couple to the beginning of the parent elements
   *
   * @param {Element} parent - where to append
   * @param {Element|Element[]} elements - element or elements list
   */
  static prepend(t, e) {
    Array.isArray(e) ? (e = e.reverse(), e.forEach((i) => t.prepend(i))) : t.prepend(e);
  }
  /**
   * Swap two elements in parent
   *
   * @param {HTMLElement} el1 - from
   * @param {HTMLElement} el2 - to
   * @deprecated
   */
  static swap(t, e) {
    const i = document.createElement("div"), o = t.parentNode;
    o.insertBefore(i, t), o.insertBefore(t, e), o.insertBefore(e, i), o.removeChild(i);
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
  static find(t = document, e) {
    return t.querySelector(e);
  }
  /**
   * Get Element by Id
   *
   * @param {string} id - id to find
   * @returns {HTMLElement | null}
   */
  static get(t) {
    return document.getElementById(t);
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
  static findAll(t = document, e) {
    return t.querySelectorAll(e);
  }
  /**
   * Returns CSS selector for all text inputs
   */
  static get allInputsSelector() {
    return "[contenteditable=true], textarea, input:not([type]), " + ["text", "password", "email", "number", "search", "tel", "url"].map((t) => `input[type="${t}"]`).join(", ");
  }
  /**
   * Find all contenteditable, textarea and editable input elements passed holder contains
   *
   * @param holder - element where to find inputs
   */
  static findAllInputs(t) {
    return Ls(t.querySelectorAll(rt.allInputsSelector)).reduce((e, i) => rt.isNativeInput(i) || rt.containsOnlyInlineElements(i) ? [...e, i] : [...e, ...rt.getDeepestBlockElements(i)], []);
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
  static getDeepestNode(t, e = !1) {
    const i = e ? "lastChild" : "firstChild", o = e ? "previousSibling" : "nextSibling";
    if (t && t.nodeType === Node.ELEMENT_NODE && t[i]) {
      let n = t[i];
      if (rt.isSingleTag(n) && !rt.isNativeInput(n) && !rt.isLineBreakTag(n))
        if (n[o])
          n = n[o];
        else if (n.parentNode[o])
          n = n.parentNode[o];
        else
          return n.parentNode;
      return this.getDeepestNode(n, e);
    }
    return t;
  }
  /**
   * Check if object is DOM node
   *
   * @param {*} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isElement(t) {
    return Do(t) ? !1 : t && t.nodeType && t.nodeType === Node.ELEMENT_NODE;
  }
  /**
   * Check if object is DocumentFragment node
   *
   * @param {object} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isFragment(t) {
    return Do(t) ? !1 : t && t.nodeType && t.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }
  /**
   * Check if passed element is contenteditable
   *
   * @param {HTMLElement} element - html element to check
   * @returns {boolean}
   */
  static isContentEditable(t) {
    return t.contentEditable === "true";
  }
  /**
   * Checks target if it is native input
   *
   * @param {*} target - HTML element or string
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNativeInput(t) {
    const e = [
      "INPUT",
      "TEXTAREA"
    ];
    return t && t.tagName ? e.includes(t.tagName) : !1;
  }
  /**
   * Checks if we can set caret
   *
   * @param {HTMLElement} target - target to check
   * @returns {boolean}
   */
  static canSetCaret(t) {
    let e = !0;
    if (rt.isNativeInput(t))
      switch (t.type) {
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
      e = rt.isContentEditable(t);
    return e;
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
  static isNodeEmpty(t, e) {
    let i;
    return this.isSingleTag(t) && !this.isLineBreakTag(t) ? !1 : (this.isElement(t) && this.isNativeInput(t) ? i = t.value : i = t.textContent.replace("​", ""), e && (i = i.replace(new RegExp(e, "g"), "")), i.trim().length === 0);
  }
  /**
   * checks node if it is doesn't have any child nodes
   *
   * @param {Node} node - node to check
   * @returns {boolean}
   */
  static isLeaf(t) {
    return t ? t.childNodes.length === 0 : !1;
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
  static isEmpty(t, e) {
    t.normalize();
    const i = [t];
    for (; i.length > 0; )
      if (t = i.shift(), !!t) {
        if (this.isLeaf(t) && !this.isNodeEmpty(t, e))
          return !1;
        t.childNodes && i.push(...Array.from(t.childNodes));
      }
    return !0;
  }
  /**
   * Check if string contains html elements
   *
   * @param {string} str - string to check
   * @returns {boolean}
   */
  static isHTMLString(t) {
    const e = rt.make("div");
    return e.innerHTML = t, e.childElementCount > 0;
  }
  /**
   * Return length of node`s text content
   *
   * @param {Node} node - node with content
   * @returns {number}
   */
  static getContentLength(t) {
    return rt.isNativeInput(t) ? t.value.length : t.nodeType === Node.TEXT_NODE ? t.length : t.textContent.length;
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
  static containsOnlyInlineElements(t) {
    let e;
    Ot(t) ? (e = document.createElement("div"), e.innerHTML = t) : e = t;
    const i = (o) => !rt.blockElements.includes(o.tagName.toLowerCase()) && Array.from(o.children).every(i);
    return Array.from(e.children).every(i);
  }
  /**
   * Find and return all block elements in the passed parent (including subtree)
   *
   * @param {HTMLElement} parent - root element
   * @returns {HTMLElement[]}
   */
  static getDeepestBlockElements(t) {
    return rt.containsOnlyInlineElements(t) ? [t] : Array.from(t.children).reduce((e, i) => [...e, ...rt.getDeepestBlockElements(i)], []);
  }
  /**
   * Helper for get holder from {string} or return HTMLElement
   *
   * @param {string | HTMLElement} element - holder's id or holder's HTML Element
   * @returns {HTMLElement}
   */
  static getHolder(t) {
    return Ot(t) ? document.getElementById(t) : t;
  }
  /**
   * Returns true if element is anchor (is A tag)
   *
   * @param {Element} element - element to check
   * @returns {boolean}
   */
  static isAnchor(t) {
    return t.tagName.toLowerCase() === "a";
  }
  /**
   * Return element's offset related to the document
   *
   * @todo handle case when editor initialized in scrollable popup
   * @param el - element to compute offset
   */
  static offset(t) {
    const e = t.getBoundingClientRect(), i = window.pageXOffset || document.documentElement.scrollLeft, o = window.pageYOffset || document.documentElement.scrollTop, n = e.top + o, r = e.left + i;
    return {
      top: n,
      left: r,
      bottom: n + e.height,
      right: r + e.width
    };
  }
};
function Hr(s) {
  return !/[^\t\n\r ]/.test(s);
}
function Fr(s) {
  const t = window.getComputedStyle(s), e = parseFloat(t.fontSize), i = parseFloat(t.lineHeight) || e * 1.2, o = parseFloat(t.paddingTop), n = parseFloat(t.borderTopWidth), r = parseFloat(t.marginTop), a = e * 0.8, l = (i - e) / 2;
  return r + n + o + l + a;
}
function As(s) {
  s.dataset.empty = m.isEmpty(s) ? "true" : "false";
}
const $r = {
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
}, zr = {
  Text: "",
  Link: "",
  Bold: "",
  Italic: ""
}, jr = {
  link: {
    "Add a link": ""
  },
  stub: {
    "The block can not be displayed correctly.": ""
  }
}, Ur = {
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
}, Rs = {
  ui: $r,
  toolNames: zr,
  tools: jr,
  blockTunes: Ur
}, Ps = class Qt {
  /**
   * Type-safe translation for internal UI texts:
   * Perform translation of the string by namespace and a key
   *
   * @example I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune')
   * @param internalNamespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static ui(t, e) {
    return Qt._t(t, e);
  }
  /**
   * Translate for external strings that is not presented in default dictionary.
   * For example, for user-specified tool names
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static t(t, e) {
    return Qt._t(t, e);
  }
  /**
   * Adjust module for using external dictionary
   *
   * @param dictionary - new messages list to override default
   */
  static setDictionary(t) {
    Qt.currentDictionary = t;
  }
  /**
   * Perform translation both for internal and external namespaces
   * If there is no translation found, returns passed key as a translated message
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static _t(t, e) {
    const i = Qt.getNamespace(t);
    return !i || !i[e] ? e : i[e];
  }
  /**
   * Find messages section by namespace path
   *
   * @param namespace - path to section
   */
  static getNamespace(t) {
    return t.split(".").reduce((e, i) => !e || !Object.keys(e).length ? {} : e[i], Qt.currentDictionary);
  }
};
Ps.currentDictionary = Rs;
let lt = Ps, Os = class extends Error {
}, Le = class {
  constructor() {
    this.subscribers = {};
  }
  /**
   * Subscribe any event on callback
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  on(t, e) {
    t in this.subscribers || (this.subscribers[t] = []), this.subscribers[t].push(e);
  }
  /**
   * Subscribe any event on callback. Callback will be called once and be removed from subscribers array after call.
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  once(t, e) {
    t in this.subscribers || (this.subscribers[t] = []);
    const i = (o) => {
      const n = e(o), r = this.subscribers[t].indexOf(i);
      return r !== -1 && this.subscribers[t].splice(r, 1), n;
    };
    this.subscribers[t].push(i);
  }
  /**
   * Emit callbacks with passed data
   *
   * @param eventName - event name
   * @param data - subscribers get this data when they were fired
   */
  emit(t, e) {
    kt(this.subscribers) || !this.subscribers[t] || this.subscribers[t].reduce((i, o) => {
      const n = o(i);
      return n !== void 0 ? n : i;
    }, e);
  }
  /**
   * Unsubscribe callback from event
   *
   * @param eventName - event name
   * @param callback - event handler
   */
  off(t, e) {
    if (this.subscribers[t] === void 0) {
      console.warn(`EventDispatcher .off(): there is no subscribers for event "${t.toString()}". Probably, .off() called before .on()`);
      return;
    }
    for (let i = 0; i < this.subscribers[t].length; i++)
      if (this.subscribers[t][i] === e) {
        delete this.subscribers[t][i];
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
};
function At(s) {
  Object.setPrototypeOf(this, {
    /**
     * Block id
     *
     * @returns {string}
     */
    get id() {
      return s.id;
    },
    /**
     * Tool name
     *
     * @returns {string}
     */
    get name() {
      return s.name;
    },
    /**
     * Tool config passed on Editor's initialization
     *
     * @returns {ToolConfig}
     */
    get config() {
      return s.config;
    },
    /**
     * .ce-block element, that wraps plugin contents
     *
     * @returns {HTMLElement}
     */
    get holder() {
      return s.holder;
    },
    /**
     * True if Block content is empty
     *
     * @returns {boolean}
     */
    get isEmpty() {
      return s.isEmpty;
    },
    /**
     * True if Block is selected with Cross-Block selection
     *
     * @returns {boolean}
     */
    get selected() {
      return s.selected;
    },
    /**
     * Set Block's stretch state
     *
     * @param {boolean} state — state to set
     */
    set stretched(t) {
      s.stretched = t;
    },
    /**
     * True if Block is stretched
     *
     * @returns {boolean}
     */
    get stretched() {
      return s.stretched;
    },
    /**
     * True if Block has inputs to be focused
     */
    get focusable() {
      return s.focusable;
    },
    /**
     * Call Tool method with errors handler under-the-hood
     *
     * @param {string} methodName - method to call
     * @param {object} param - object with parameters
     * @returns {unknown}
     */
    call(t, e) {
      return s.call(t, e);
    },
    /**
     * Save Block content
     *
     * @returns {Promise<void|SavedData>}
     */
    save() {
      return s.save();
    },
    /**
     * Validate Block data
     *
     * @param {BlockToolData} data - data to validate
     * @returns {Promise<boolean>}
     */
    validate(t) {
      return s.validate(t);
    },
    /**
     * Allows to say Editor that Block was changed. Used to manually trigger Editor's 'onChange' callback
     * Can be useful for block changes invisible for editor core.
     */
    dispatchChange() {
      s.dispatchChange();
    },
    /**
     * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
     * This method returns the entry that is related to the Block (depended on the Block data)
     */
    getActiveToolboxEntry() {
      return s.getActiveToolboxEntry();
    }
  });
}
let Me = class {
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
  on(t, e, i, o = !1) {
    const n = Dr("l"), r = {
      id: n,
      element: t,
      eventType: e,
      handler: i,
      options: o
    };
    if (!this.findOne(t, e, i))
      return this.allListeners.push(r), t.addEventListener(e, i, o), n;
  }
  /**
   * Removes event listener from element
   *
   * @param {EventTarget} element - DOM element that we removing listener
   * @param {string} eventType - event type
   * @param {Function} handler - remove handler, if element listens several handlers on the same event type
   * @param {boolean|AddEventListenerOptions} options - useCapture or {capture, passive, once}
   */
  off(t, e, i, o) {
    const n = this.findAll(t, e, i);
    n.forEach((r, a) => {
      const l = this.allListeners.indexOf(n[a]);
      l > -1 && (this.allListeners.splice(l, 1), r.element.removeEventListener(r.eventType, r.handler, r.options));
    });
  }
  /**
   * Removes listener by id
   *
   * @param {string} id - listener identifier
   */
  offById(t) {
    const e = this.findById(t);
    e && e.element.removeEventListener(e.eventType, e.handler, e.options);
  }
  /**
   * Finds and returns first listener by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} [eventType] - event type
   * @param {Function} [handler] - event handler
   * @returns {ListenerData|null}
   */
  findOne(t, e, i) {
    const o = this.findAll(t, e, i);
    return o.length > 0 ? o[0] : null;
  }
  /**
   * Return all stored listeners by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} eventType - event type
   * @param {Function} handler - event handler
   * @returns {ListenerData[]}
   */
  findAll(t, e, i) {
    let o;
    const n = t ? this.findByEventTarget(t) : [];
    return t && e && i ? o = n.filter((r) => r.eventType === e && r.handler === i) : t && e ? o = n.filter((r) => r.eventType === e) : o = n, o;
  }
  /**
   * Removes all listeners
   */
  removeAll() {
    this.allListeners.map((t) => {
      t.element.removeEventListener(t.eventType, t.handler, t.options);
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
  findByEventTarget(t) {
    return this.allListeners.filter((e) => {
      if (e.element === t)
        return e;
    });
  }
  /**
   * Search method: looks for listener by passed event type
   *
   * @param {string} eventType - event type
   * @returns {ListenerData[]} listeners that found on element
   */
  findByType(t) {
    return this.allListeners.filter((e) => {
      if (e.eventType === t)
        return e;
    });
  }
  /**
   * Search method: looks for listener by passed handler
   *
   * @param {Function} handler - event handler
   * @returns {ListenerData[]} listeners that found on element
   */
  findByHandler(t) {
    return this.allListeners.filter((e) => {
      if (e.handler === t)
        return e;
    });
  }
  /**
   * Returns listener data found by id
   *
   * @param {string} id - listener identifier
   * @returns {ListenerData}
   */
  findById(t) {
    return this.allListeners.find((e) => e.id === t);
  }
}, N = class Ns {
  /**
   * @class
   * @param options - Module options
   * @param options.config - Module config
   * @param options.eventsDispatcher - Common event bus
   */
  constructor({ config: t, eventsDispatcher: e }) {
    if (this.nodes = {}, this.listeners = new Me(), this.readOnlyMutableListeners = {
      /**
       * Assigns event listener on DOM element and pushes into special array that might be removed
       *
       * @param {EventTarget} element - DOM Element
       * @param {string} eventType - Event name
       * @param {Function} handler - Event handler
       * @param {boolean|AddEventListenerOptions} options - Listening options
       */
      on: (i, o, n, r = !1) => {
        this.mutableListenerIds.push(
          this.listeners.on(i, o, n, r)
        );
      },
      /**
       * Clears all mutable listeners
       */
      clearAll: () => {
        for (const i of this.mutableListenerIds)
          this.listeners.offById(i);
        this.mutableListenerIds = [];
      }
    }, this.mutableListenerIds = [], new.target === Ns)
      throw new TypeError("Constructors for abstract class Module are not allowed.");
    this.config = t, this.eventsDispatcher = e;
  }
  /**
   * Editor modules setter
   *
   * @param {EditorModules} Editor - Editor's Modules
   */
  set state(t) {
    this.Editor = t;
  }
  /**
   * Remove memorized nodes
   */
  removeAllNodes() {
    for (const t in this.nodes) {
      const e = this.nodes[t];
      e instanceof HTMLElement && e.remove();
    }
  }
  /**
   * Returns true if current direction is RTL (Right-To-Left)
   */
  get isRtl() {
    return this.config.i18n.direction === "rtl";
  }
}, C = class Vt {
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
    const t = window.getSelection();
    return t ? t.anchorNode : null;
  }
  /**
   * Returns selected anchor element
   *
   * @returns {Element|null}
   */
  static get anchorElement() {
    const t = window.getSelection();
    if (!t)
      return null;
    const e = t.anchorNode;
    return e ? m.isElement(e) ? e : e.parentElement : null;
  }
  /**
   * Returns selection offset according to the anchor node
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
   *
   * @returns {number|null}
   */
  static get anchorOffset() {
    const t = window.getSelection();
    return t ? t.anchorOffset : null;
  }
  /**
   * Is current selection range collapsed
   *
   * @returns {boolean|null}
   */
  static get isCollapsed() {
    const t = window.getSelection();
    return t ? t.isCollapsed : null;
  }
  /**
   * Check current selection if it is at Editor's zone
   *
   * @returns {boolean}
   */
  static get isAtEditor() {
    return this.isSelectionAtEditor(Vt.get());
  }
  /**
   * Check if passed selection is at Editor's zone
   *
   * @param selection - Selection object to check
   */
  static isSelectionAtEditor(t) {
    if (!t)
      return !1;
    let e = t.anchorNode || t.focusNode;
    e && e.nodeType === Node.TEXT_NODE && (e = e.parentNode);
    let i = null;
    return e && e instanceof Element && (i = e.closest(`.${Vt.CSS.editorZone}`)), i ? i.nodeType === Node.ELEMENT_NODE : !1;
  }
  /**
   * Check if passed range at Editor zone
   *
   * @param range - range to check
   */
  static isRangeAtEditor(t) {
    if (!t)
      return;
    let e = t.startContainer;
    e && e.nodeType === Node.TEXT_NODE && (e = e.parentNode);
    let i = null;
    return e && e instanceof Element && (i = e.closest(`.${Vt.CSS.editorZone}`)), i ? i.nodeType === Node.ELEMENT_NODE : !1;
  }
  /**
   * Methods return boolean that true if selection exists on the page
   */
  static get isSelectionExists() {
    return !!Vt.get().anchorNode;
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
  static getRangeFromSelection(t) {
    return t && t.rangeCount ? t.getRangeAt(0) : null;
  }
  /**
   * Calculates position and size of selected text
   *
   * @returns {DOMRect | ClientRect}
   */
  static get rect() {
    let t = document.selection, e, i = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    if (t && t.type !== "Control")
      return t = t, e = t.createRange(), i.x = e.boundingLeft, i.y = e.boundingTop, i.width = e.boundingWidth, i.height = e.boundingHeight, i;
    if (!window.getSelection)
      return F("Method window.getSelection is not supported", "warn"), i;
    if (t = window.getSelection(), t.rangeCount === null || isNaN(t.rangeCount))
      return F("Method SelectionUtils.rangeCount is not supported", "warn"), i;
    if (t.rangeCount === 0)
      return i;
    if (e = t.getRangeAt(0).cloneRange(), e.getBoundingClientRect && (i = e.getBoundingClientRect()), i.x === 0 && i.y === 0) {
      const o = document.createElement("span");
      if (o.getBoundingClientRect) {
        o.appendChild(document.createTextNode("​")), e.insertNode(o), i = o.getBoundingClientRect();
        const n = o.parentNode;
        n.removeChild(o), n.normalize();
      }
    }
    return i;
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
  static setCursor(t, e = 0) {
    const i = document.createRange(), o = window.getSelection();
    return m.isNativeInput(t) ? m.canSetCaret(t) ? (t.focus(), t.selectionStart = t.selectionEnd = e, t.getBoundingClientRect()) : void 0 : (i.setStart(t, e), i.setEnd(t, e), o.removeAllRanges(), o.addRange(i), i.getBoundingClientRect());
  }
  /**
   * Check if current range exists and belongs to container
   *
   * @param container - where range should be
   */
  static isRangeInsideContainer(t) {
    const e = Vt.range;
    return e === null ? !1 : t.contains(e.startContainer);
  }
  /**
   * Adds fake cursor to the current range
   */
  static addFakeCursor() {
    const t = Vt.range;
    if (t === null)
      return;
    const e = m.make("span", "codex-editor__fake-cursor");
    e.dataset.mutationFree = "true", t.collapse(), t.insertNode(e);
  }
  /**
   * Check if passed element contains a fake cursor
   *
   * @param el - where to check
   */
  static isFakeCursorInsideContainer(t) {
    return m.find(t, ".codex-editor__fake-cursor") !== null;
  }
  /**
   * Removes fake cursor from a container
   *
   * @param container - container to look for
   */
  static removeFakeCursor(t = document.body) {
    const e = m.find(t, ".codex-editor__fake-cursor");
    e && e.remove();
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
    this.savedSelectionRange = Vt.range;
  }
  /**
   * Restore saved SelectionUtils's range
   */
  restore() {
    if (!this.savedSelectionRange)
      return;
    const t = window.getSelection();
    t.removeAllRanges(), t.addRange(this.savedSelectionRange);
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
    const t = window.getSelection(), e = document.createRange();
    e.selectNodeContents(t.focusNode), e.collapse(!1), t.removeAllRanges(), t.addRange(e);
  }
  /**
   * Looks ahead to find passed tag from current selection
   *
   * @param  {string} tagName       - tag to found
   * @param  {string} [className]   - tag's class name
   * @param  {number} [searchDepth] - count of tags that can be included. For better performance.
   * @returns {HTMLElement|null}
   */
  findParentTag(t, e, i = 10) {
    const o = window.getSelection();
    let n = null;
    return !o || !o.anchorNode || !o.focusNode ? null : ([
      /** the Node in which the selection begins */
      o.anchorNode,
      /** the Node in which the selection ends */
      o.focusNode
    ].forEach((r) => {
      let a = i;
      for (; a > 0 && r.parentNode && !(r.tagName === t && (n = r, e && r.classList && !r.classList.contains(e) && (n = null), n)); )
        r = r.parentNode, a--;
    }), n);
  }
  /**
   * Expands selection range to the passed parent node
   *
   * @param {HTMLElement} element - element which contents should be selected
   */
  expandToTag(t) {
    const e = window.getSelection();
    e.removeAllRanges();
    const i = document.createRange();
    i.selectNodeContents(t), e.addRange(i);
  }
};
function Wr(s, t) {
  const { type: e, target: i, addedNodes: o, removedNodes: n } = s;
  return s.type === "attributes" && s.attributeName === "data-empty" ? !1 : !!(t.contains(i) || e === "childList" && (Array.from(o).some((r) => r === t) || Array.from(n).some((r) => r === t)));
}
const Bi = "redactor dom changed", Ds = "block changed", Vs = "fake cursor is about to be toggled", Hs = "fake cursor have been set", Te = "editor mobile layout toggled";
function Ii(s, t) {
  if (!s.conversionConfig)
    return !1;
  const e = s.conversionConfig[t];
  return K(e) || Ot(e);
}
function We(s, t) {
  return Ii(s.tool, t);
}
function Fs(s, t) {
  return Object.entries(s).some(([e, i]) => t[e] && Vr(t[e], i));
}
async function $s(s, t) {
  const e = (await s.save()).data, i = t.find((o) => o.name === s.name);
  return i !== void 0 && !Ii(i, "export") ? [] : t.reduce((o, n) => {
    if (!Ii(n, "import") || n.toolbox === void 0)
      return o;
    const r = n.toolbox.filter((a) => {
      if (kt(a) || a.icon === void 0)
        return !1;
      if (a.data !== void 0) {
        if (Fs(a.data, e))
          return !1;
      } else if (n.name === s.name)
        return !1;
      return !0;
    });
    return o.push({
      ...n,
      toolbox: r
    }), o;
  }, []);
}
function Fo(s, t) {
  return s.mergeable ? s.name === t.name ? !0 : We(t, "export") && We(s, "import") : !1;
}
function qr(s, t) {
  const e = t == null ? void 0 : t.export;
  return K(e) ? e(s) : Ot(e) ? s[e] : (e !== void 0 && F("Conversion «export» property must be a string or function. String means key of saved data object to export. Function should export processed string to export."), "");
}
function $o(s, t) {
  const e = t == null ? void 0 : t.import;
  return K(e) ? e(s) : Ot(e) ? {
    [e]: s
  } : (e !== void 0 && F("Conversion «import» property must be a string or function. String means key of tool data to import. Function accepts a imported string and return composed tool data."), {});
}
var W = /* @__PURE__ */ ((s) => (s.Default = "default", s.Separator = "separator", s.Html = "html", s))(W || {}), Rt = /* @__PURE__ */ ((s) => (s.APPEND_CALLBACK = "appendCallback", s.RENDERED = "rendered", s.MOVED = "moved", s.UPDATED = "updated", s.REMOVED = "removed", s.ON_PASTE = "onPaste", s))(Rt || {});
class Q extends Le {
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
    id: t = Or(),
    data: e,
    tool: i,
    readOnly: o,
    tunesData: n
  }, r) {
    super(), this.cachedInputs = [], this.toolRenderedElement = null, this.tunesInstances = /* @__PURE__ */ new Map(), this.defaultTunesInstances = /* @__PURE__ */ new Map(), this.unavailableTunesData = {}, this.inputIndex = 0, this.editorEventBus = null, this.handleFocus = () => {
      this.dropInputsCache(), this.updateCurrentInput();
    }, this.didMutated = (a = void 0) => {
      const l = a === void 0, c = a instanceof InputEvent;
      !l && !c && this.detectToolRootChange(a);
      let d;
      l || c ? d = !0 : d = !(a.length > 0 && a.every((h) => {
        const { addedNodes: g, removedNodes: v, target: f } = h;
        return [
          ...Array.from(g),
          ...Array.from(v),
          f
        ].some((w) => (m.isElement(w) || (w = w.parentElement), w && w.closest('[data-mutation-free="true"]') !== null));
      })), d && (this.dropInputsCache(), this.updateCurrentInput(), this.toggleInputsEmptyMark(), this.call(
        "updated"
        /* UPDATED */
      ), this.emit("didMutated", this));
    }, this.name = i.name, this.id = t, this.settings = i.settings, this.config = i.settings.config || {}, this.editorEventBus = r || null, this.blockAPI = new At(this), this.tool = i, this.toolInstance = i.create(e, this.blockAPI, o), this.tunes = i.tunes, this.composeTunes(n), this.holder = this.compose(), window.requestIdleCallback(() => {
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
    const t = m.findAllInputs(this.holder);
    return this.inputIndex > t.length - 1 && (this.inputIndex = t.length - 1), this.cachedInputs = t, t;
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
  set currentInput(t) {
    const e = this.inputs.findIndex((i) => i === t || i.contains(t));
    e !== -1 && (this.inputIndex = e);
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
    const t = this.inputs;
    return t[t.length - 1];
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
    return this.save().then((t) => t && !kt(t.data) ? t.data : {});
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
    return K(this.toolInstance.merge);
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
    const t = m.isEmpty(this.pluginsContent, "/"), e = !this.hasMedia;
    return t && e;
  }
  /**
   * Check if block has a media content such as images, iframe and other
   *
   * @returns {boolean}
   */
  get hasMedia() {
    const t = [
      "img",
      "iframe",
      "video",
      "audio",
      "source",
      "input",
      "textarea",
      "twitterwidget"
    ];
    return !!this.holder.querySelector(t.join(","));
  }
  /**
   * Set selected state
   * We don't need to mark Block as Selected when it is empty
   *
   * @param {boolean} state - 'true' to select, 'false' to remove selection
   */
  set selected(t) {
    var e, i;
    this.holder.classList.toggle(Q.CSS.selected, t);
    const o = t === !0 && C.isRangeInsideContainer(this.holder), n = t === !1 && C.isFakeCursorInsideContainer(this.holder);
    (o || n) && ((e = this.editorEventBus) == null || e.emit(Vs, { state: t }), o ? C.addFakeCursor() : C.removeFakeCursor(this.holder), (i = this.editorEventBus) == null || i.emit(Hs, { state: t }));
  }
  /**
   * Returns True if it is Selected
   *
   * @returns {boolean}
   */
  get selected() {
    return this.holder.classList.contains(Q.CSS.selected);
  }
  /**
   * Set stretched state
   *
   * @param {boolean} state - 'true' to enable, 'false' to disable stretched state
   */
  set stretched(t) {
    this.holder.classList.toggle(Q.CSS.wrapperStretched, t);
  }
  /**
   * Return Block's stretched state
   *
   * @returns {boolean}
   */
  get stretched() {
    return this.holder.classList.contains(Q.CSS.wrapperStretched);
  }
  /**
   * Toggle drop target state
   *
   * @param {boolean} state - 'true' if block is drop target, false otherwise
   */
  set dropTarget(t) {
    this.holder.classList.toggle(Q.CSS.dropTarget, t);
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
  call(t, e) {
    if (K(this.toolInstance[t])) {
      t === "appendCallback" && F(
        "`appendCallback` hook is deprecated and will be removed in the next major release. Use `rendered` hook instead",
        "warn"
      );
      try {
        this.toolInstance[t].call(this.toolInstance, e);
      } catch (i) {
        F(`Error during '${t}' call: ${i.message}`, "error");
      }
    }
  }
  /**
   * Call plugins merge method
   *
   * @param {BlockToolData} data - data to merge
   */
  async mergeWith(t) {
    await this.toolInstance.merge(t);
  }
  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   *
   * @returns {object}
   */
  async save() {
    const t = await this.toolInstance.save(this.pluginsContent), e = this.unavailableTunesData;
    [
      ...this.tunesInstances.entries(),
      ...this.defaultTunesInstances.entries()
    ].forEach(([n, r]) => {
      if (K(r.save))
        try {
          e[n] = r.save();
        } catch (a) {
          F(`Tune ${r.constructor.name} save method throws an Error %o`, "warn", a);
        }
    });
    const i = window.performance.now();
    let o;
    return Promise.resolve(t).then((n) => (o = window.performance.now(), {
      id: this.id,
      tool: this.name,
      data: n,
      tunes: e,
      time: o - i
    })).catch((n) => {
      F(`Saving process for ${this.name} tool failed due to the ${n}`, "log", "red");
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
  async validate(t) {
    let e = !0;
    return this.toolInstance.validate instanceof Function && (e = await this.toolInstance.validate(t)), e;
  }
  /**
   * Returns data to render in Block Tunes menu.
   * Splits block tunes into 2 groups: block specific tunes and common tunes
   */
  getTunes() {
    const t = [], e = [], i = typeof this.toolInstance.renderSettings == "function" ? this.toolInstance.renderSettings() : [];
    return m.isElement(i) ? t.push({
      type: W.Html,
      element: i
    }) : Array.isArray(i) ? t.push(...i) : t.push(i), [
      ...this.tunesInstances.values(),
      ...this.defaultTunesInstances.values()
    ].map((o) => o.render()).forEach((o) => {
      m.isElement(o) ? e.push({
        type: W.Html,
        element: o
      }) : Array.isArray(o) ? e.push(...o) : e.push(o);
    }), {
      toolTunes: t,
      commonTunes: e
    };
  }
  /**
   * Update current input index with selection anchor node
   */
  updateCurrentInput() {
    this.currentInput = m.isNativeInput(document.activeElement) || !C.anchorNode ? document.activeElement : C.anchorNode;
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
    this.unwatchBlockMutations(), this.removeInputEvents(), super.destroy(), K(this.toolInstance.destroy) && this.toolInstance.destroy();
  }
  /**
   * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
   * This method returns the entry that is related to the Block (depended on the Block data)
   */
  async getActiveToolboxEntry() {
    const t = this.tool.toolbox;
    if (t.length === 1)
      return Promise.resolve(this.tool.toolbox[0]);
    const e = await this.data, i = t;
    return i == null ? void 0 : i.find((o) => Fs(o.data, e));
  }
  /**
   * Exports Block data as string using conversion config
   */
  async exportDataAsString() {
    const t = await this.data;
    return qr(t, this.tool.conversionConfig);
  }
  /**
   * Make default Block wrappers and put Tool`s content there
   *
   * @returns {HTMLDivElement}
   */
  compose() {
    const t = m.make("div", Q.CSS.wrapper), e = m.make("div", Q.CSS.content), i = this.toolInstance.render();
    t.dataset.id = this.id, this.toolRenderedElement = i, e.appendChild(this.toolRenderedElement);
    let o = e;
    return [...this.tunesInstances.values(), ...this.defaultTunesInstances.values()].forEach((n) => {
      if (K(n.wrap))
        try {
          o = n.wrap(o);
        } catch (r) {
          F(`Tune ${n.constructor.name} wrap method throws an Error %o`, "warn", r);
        }
    }), t.appendChild(o), t;
  }
  /**
   * Instantiate Block Tunes
   *
   * @param tunesData - current Block tunes data
   * @private
   */
  composeTunes(t) {
    Array.from(this.tunes.values()).forEach((e) => {
      (e.isInternal ? this.defaultTunesInstances : this.tunesInstances).set(e.name, e.create(t[e.name], this.blockAPI));
    }), Object.entries(t).forEach(([e, i]) => {
      this.tunesInstances.has(e) || (this.unavailableTunesData[e] = i);
    });
  }
  /**
   * Adds focus event listeners to all inputs and contenteditable
   */
  addInputEvents() {
    this.inputs.forEach((t) => {
      t.addEventListener("focus", this.handleFocus), m.isNativeInput(t) && t.addEventListener("input", this.didMutated);
    });
  }
  /**
   * removes focus event listeners from all inputs and contenteditable
   */
  removeInputEvents() {
    this.inputs.forEach((t) => {
      t.removeEventListener("focus", this.handleFocus), m.isNativeInput(t) && t.removeEventListener("input", this.didMutated);
    });
  }
  /**
   * Listen common editor Dom Changed event and detect mutations related to the  Block
   */
  watchBlockMutations() {
    var t;
    this.redactorDomChangedCallback = (e) => {
      const { mutations: i } = e;
      i.some((o) => Wr(o, this.toolRenderedElement)) && this.didMutated(i);
    }, (t = this.editorEventBus) == null || t.on(Bi, this.redactorDomChangedCallback);
  }
  /**
   * Remove redactor dom change event listener
   */
  unwatchBlockMutations() {
    var t;
    (t = this.editorEventBus) == null || t.off(Bi, this.redactorDomChangedCallback);
  }
  /**
   * Sometimes Tool can replace own main element, for example H2 -> H4 or UL -> OL
   * We need to detect such changes and update a link to tools main element with the new one
   *
   * @param mutations - records of block content mutations
   */
  detectToolRootChange(t) {
    t.forEach((e) => {
      if (Array.from(e.removedNodes).includes(this.toolRenderedElement)) {
        const i = e.addedNodes[e.addedNodes.length - 1];
        this.toolRenderedElement = i;
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
    this.inputs.forEach(As);
  }
}
class Yr extends N {
  constructor() {
    super(...arguments), this.insert = (t = this.config.defaultBlock, e = {}, i = {}, o, n, r, a) => {
      const l = this.Editor.BlockManager.insert({
        id: a,
        tool: t,
        data: e,
        index: o,
        needToFocus: n,
        replace: r
      });
      return new At(l);
    }, this.composeBlockData = async (t) => {
      const e = this.Editor.Tools.blockTools.get(t);
      return new Q({
        tool: e,
        api: this.Editor.API,
        readOnly: !0,
        data: {},
        tunesData: {}
      }).data;
    }, this.update = async (t, e, i) => {
      const { BlockManager: o } = this.Editor, n = o.getBlockById(t);
      if (n === void 0)
        throw new Error(`Block with id "${t}" not found`);
      const r = await o.update(n, e, i);
      return new At(r);
    }, this.convert = async (t, e, i) => {
      var o, n;
      const { BlockManager: r, Tools: a } = this.Editor, l = r.getBlockById(t);
      if (!l)
        throw new Error(`Block with id "${t}" not found`);
      const c = a.blockTools.get(l.name), d = a.blockTools.get(e);
      if (!d)
        throw new Error(`Block Tool with type "${e}" not found`);
      const h = ((o = c == null ? void 0 : c.conversionConfig) == null ? void 0 : o.export) !== void 0, g = ((n = d.conversionConfig) == null ? void 0 : n.import) !== void 0;
      if (h && g) {
        const v = await r.convert(l, e, i);
        return new At(v);
      } else {
        const v = [
          h ? !1 : Ue(l.name),
          g ? !1 : Ue(e)
        ].filter(Boolean).join(" and ");
        throw new Error(`Conversion from "${l.name}" to "${e}" is not possible. ${v} tool(s) should provide a "conversionConfig"`);
      }
    }, this.insertMany = (t, e = this.Editor.BlockManager.blocks.length - 1) => {
      this.validateIndex(e);
      const i = t.map(({ id: o, type: n, data: r }) => this.Editor.BlockManager.composeBlock({
        id: o,
        tool: n || this.config.defaultBlock,
        data: r
      }));
      return this.Editor.BlockManager.insertMany(i, e), i.map((o) => new At(o));
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
      render: (t) => this.render(t),
      renderFromHTML: (t) => this.renderFromHTML(t),
      delete: (t) => this.delete(t),
      swap: (t, e) => this.swap(t, e),
      move: (t, e) => this.move(t, e),
      getBlockByIndex: (t) => this.getBlockByIndex(t),
      getById: (t) => this.getById(t),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
      getBlockIndex: (t) => this.getBlockIndex(t),
      getBlocksCount: () => this.getBlocksCount(),
      getBlockByElement: (t) => this.getBlockByElement(t),
      stretchBlock: (t, e = !0) => this.stretchBlock(t, e),
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
  getBlockIndex(t) {
    const e = this.Editor.BlockManager.getBlockById(t);
    if (!e) {
      yt("There is no block with id `" + t + "`", "warn");
      return;
    }
    return this.Editor.BlockManager.getBlockIndex(e);
  }
  /**
   * Returns BlockAPI object by Block index
   *
   * @param {number} index - index to get
   */
  getBlockByIndex(t) {
    const e = this.Editor.BlockManager.getBlockByIndex(t);
    if (e === void 0) {
      yt("There is no block at index `" + t + "`", "warn");
      return;
    }
    return new At(e);
  }
  /**
   * Returns BlockAPI object by Block id
   *
   * @param id - id of block to get
   */
  getById(t) {
    const e = this.Editor.BlockManager.getBlockById(t);
    return e === void 0 ? (yt("There is no block with id `" + t + "`", "warn"), null) : new At(e);
  }
  /**
   * Get Block API object by any child html element
   *
   * @param element - html element to get Block by
   */
  getBlockByElement(t) {
    const e = this.Editor.BlockManager.getBlock(t);
    if (e === void 0) {
      yt("There is no block corresponding to element `" + t + "`", "warn");
      return;
    }
    return new At(e);
  }
  /**
   * Call Block Manager method that swap Blocks
   *
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   * @deprecated — use 'move' instead
   */
  swap(t, e) {
    F(
      "`blocks.swap()` method is deprecated and will be removed in the next major release. Use `block.move()` method instead",
      "info"
    ), this.Editor.BlockManager.swap(t, e);
  }
  /**
   * Move block from one index to another
   *
   * @param {number} toIndex - index to move to
   * @param {number} fromIndex - index to move from
   */
  move(t, e) {
    this.Editor.BlockManager.move(t, e);
  }
  /**
   * Deletes Block
   *
   * @param {number} blockIndex - index of Block to delete
   */
  delete(t = this.Editor.BlockManager.currentBlockIndex) {
    try {
      const e = this.Editor.BlockManager.getBlockByIndex(t);
      this.Editor.BlockManager.removeBlock(e);
    } catch (e) {
      yt(e, "warn");
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
  async render(t) {
    if (t === void 0 || t.blocks === void 0)
      throw new Error("Incorrect data passed to the render() method");
    this.Editor.ModificationsObserver.disable(), await this.Editor.BlockManager.clear(), await this.Editor.Renderer.render(t.blocks), this.Editor.ModificationsObserver.enable();
  }
  /**
   * Render passed HTML string
   *
   * @param {string} data - HTML string to render
   * @returns {Promise<void>}
   */
  renderFromHTML(t) {
    return this.Editor.BlockManager.clear(), this.Editor.Paste.processText(t, !0);
  }
  /**
   * Stretch Block's content
   *
   * @param {number} index - index of Block to stretch
   * @param {boolean} status - true to enable, false to disable
   * @deprecated Use BlockAPI interface to stretch Blocks
   */
  stretchBlock(t, e = !0) {
    Ti(
      !0,
      "blocks.stretchBlock()",
      "BlockAPI"
    );
    const i = this.Editor.BlockManager.getBlockByIndex(t);
    i && (i.stretched = e);
  }
  /**
   * Insert new Block
   * After set caret to this Block
   *
   * @todo remove in 3.0.0
   * @deprecated with insert() method
   */
  insertNewBlock() {
    F("Method blocks.insertNewBlock() is deprecated and it will be removed in the next major release. Use blocks.insert() instead.", "warn"), this.insert();
  }
  /**
   * Validated block index and throws an error if it's invalid
   *
   * @param index - index to validate
   */
  validateIndex(t) {
    if (typeof t != "number")
      throw new Error("Index should be a number");
    if (t < 0)
      throw new Error("Index should be greater than or equal to 0");
    if (t === null)
      throw new Error("Index should be greater than or equal to 0");
  }
}
function Kr(s, t) {
  return typeof s == "number" ? t.BlockManager.getBlockByIndex(s) : typeof s == "string" ? t.BlockManager.getBlockById(s) : t.BlockManager.getBlockById(s.id);
}
class Xr extends N {
  constructor() {
    super(...arguments), this.setToFirstBlock = (t = this.Editor.Caret.positions.DEFAULT, e = 0) => this.Editor.BlockManager.firstBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.firstBlock, t, e), !0) : !1, this.setToLastBlock = (t = this.Editor.Caret.positions.DEFAULT, e = 0) => this.Editor.BlockManager.lastBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.lastBlock, t, e), !0) : !1, this.setToPreviousBlock = (t = this.Editor.Caret.positions.DEFAULT, e = 0) => this.Editor.BlockManager.previousBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.previousBlock, t, e), !0) : !1, this.setToNextBlock = (t = this.Editor.Caret.positions.DEFAULT, e = 0) => this.Editor.BlockManager.nextBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.nextBlock, t, e), !0) : !1, this.setToBlock = (t, e = this.Editor.Caret.positions.DEFAULT, i = 0) => {
      const o = Kr(t, this.Editor);
      return o === void 0 ? !1 : (this.Editor.Caret.setToBlock(o, e, i), !0);
    }, this.focus = (t = !1) => t ? this.setToLastBlock(this.Editor.Caret.positions.END) : this.setToFirstBlock(this.Editor.Caret.positions.START);
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
class Zr extends N {
  /**
   * Available methods
   *
   * @returns {Events}
   */
  get methods() {
    return {
      emit: (t, e) => this.emit(t, e),
      off: (t, e) => this.off(t, e),
      on: (t, e) => this.on(t, e)
    };
  }
  /**
   * Subscribe on Events
   *
   * @param {string} eventName - event name to subscribe
   * @param {Function} callback - event handler
   */
  on(t, e) {
    this.eventsDispatcher.on(t, e);
  }
  /**
   * Emit event with data
   *
   * @param {string} eventName - event to emit
   * @param {object} data - event's data
   */
  emit(t, e) {
    this.eventsDispatcher.emit(t, e);
  }
  /**
   * Unsubscribe from Event
   *
   * @param {string} eventName - event to unsubscribe
   * @param {Function} callback - event handler
   */
  off(t, e) {
    this.eventsDispatcher.off(t, e);
  }
}
let Gr = class zs extends N {
  /**
   * Return namespace section for tool or block tune
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  static getNamespace(t, e) {
    return e ? `blockTunes.${t}` : `tools.${t}`;
  }
  /**
   * Return I18n API methods with global dictionary access
   */
  get methods() {
    return {
      t: () => {
        yt("I18n.t() method can be accessed only from Tools", "warn");
      }
    };
  }
  /**
   * Return I18n API methods with tool namespaced dictionary
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  getMethodsForTool(t, e) {
    return Object.assign(
      this.methods,
      {
        t: (i) => lt.t(zs.getNamespace(t, e), i)
      }
    );
  }
};
class Jr extends N {
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
  getMethodsForTool(t, e) {
    return Object.assign(
      this.methods,
      {
        i18n: this.Editor.I18nAPI.getMethodsForTool(t, e)
      }
    );
  }
}
class Qr extends N {
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
class ta extends N {
  /**
   * Available methods
   *
   * @returns {Listeners}
   */
  get methods() {
    return {
      on: (t, e, i, o) => this.on(t, e, i, o),
      off: (t, e, i, o) => this.off(t, e, i, o),
      offById: (t) => this.offById(t)
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
  on(t, e, i, o) {
    return this.listeners.on(t, e, i, o);
  }
  /**
   * Removes DOM listener from element
   *
   * @param {Element} element - Element to remove handler from
   * @param eventType - event type
   * @param handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  off(t, e, i, o) {
    this.listeners.off(t, e, i, o);
  }
  /**
   * Removes DOM listener by the listener id
   *
   * @param id - id of the listener to remove
   */
  offById(t) {
    this.listeners.offById(t);
  }
}
var js = { exports: {} };
(function(s, t) {
  (function(e, i) {
    s.exports = i();
  })(window, function() {
    return function(e) {
      var i = {};
      function o(n) {
        if (i[n])
          return i[n].exports;
        var r = i[n] = { i: n, l: !1, exports: {} };
        return e[n].call(r.exports, r, r.exports, o), r.l = !0, r.exports;
      }
      return o.m = e, o.c = i, o.d = function(n, r, a) {
        o.o(n, r) || Object.defineProperty(n, r, { enumerable: !0, get: a });
      }, o.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, o.t = function(n, r) {
        if (1 & r && (n = o(n)), 8 & r || 4 & r && typeof n == "object" && n && n.__esModule)
          return n;
        var a = /* @__PURE__ */ Object.create(null);
        if (o.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: n }), 2 & r && typeof n != "string")
          for (var l in n)
            o.d(a, l, (function(c) {
              return n[c];
            }).bind(null, l));
        return a;
      }, o.n = function(n) {
        var r = n && n.__esModule ? function() {
          return n.default;
        } : function() {
          return n;
        };
        return o.d(r, "a", r), r;
      }, o.o = function(n, r) {
        return Object.prototype.hasOwnProperty.call(n, r);
      }, o.p = "/", o(o.s = 0);
    }([function(e, i, o) {
      o(1), /*!
      * Codex JavaScript Notification module
      * https://github.com/codex-team/js-notifier
      */
      e.exports = function() {
        var n = o(6), r = "cdx-notify--bounce-in", a = null;
        return { show: function(l) {
          if (l.message) {
            (function() {
              if (a)
                return !0;
              a = n.getWrapper(), document.body.appendChild(a);
            })();
            var c = null, d = l.time || 8e3;
            switch (l.type) {
              case "confirm":
                c = n.confirm(l);
                break;
              case "prompt":
                c = n.prompt(l);
                break;
              default:
                c = n.alert(l), window.setTimeout(function() {
                  c.remove();
                }, d);
            }
            a.appendChild(c), c.classList.add(r);
          }
        } };
      }();
    }, function(e, i, o) {
      var n = o(2);
      typeof n == "string" && (n = [[e.i, n, ""]]);
      var r = { hmr: !0, transform: void 0, insertInto: void 0 };
      o(4)(n, r), n.locals && (e.exports = n.locals);
    }, function(e, i, o) {
      (e.exports = o(3)(!1)).push([e.i, `.cdx-notify--error{background:#fffbfb!important}.cdx-notify--error::before{background:#fb5d5d!important}.cdx-notify__input{max-width:130px;padding:5px 10px;background:#f7f7f7;border:0;border-radius:3px;font-size:13px;color:#656b7c;outline:0}.cdx-notify__input:-ms-input-placeholder{color:#656b7c}.cdx-notify__input::placeholder{color:#656b7c}.cdx-notify__input:focus:-ms-input-placeholder{color:rgba(101,107,124,.3)}.cdx-notify__input:focus::placeholder{color:rgba(101,107,124,.3)}.cdx-notify__button{border:none;border-radius:3px;font-size:13px;padding:5px 10px;cursor:pointer}.cdx-notify__button:last-child{margin-left:10px}.cdx-notify__button--cancel{background:#f2f5f7;box-shadow:0 2px 1px 0 rgba(16,19,29,0);color:#656b7c}.cdx-notify__button--cancel:hover{background:#eee}.cdx-notify__button--confirm{background:#34c992;box-shadow:0 1px 1px 0 rgba(18,49,35,.05);color:#fff}.cdx-notify__button--confirm:hover{background:#33b082}.cdx-notify__btns-wrapper{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;margin-top:5px}.cdx-notify__cross{position:absolute;top:5px;right:5px;width:10px;height:10px;padding:5px;opacity:.54;cursor:pointer}.cdx-notify__cross::after,.cdx-notify__cross::before{content:'';position:absolute;left:9px;top:5px;height:12px;width:2px;background:#575d67}.cdx-notify__cross::before{transform:rotate(-45deg)}.cdx-notify__cross::after{transform:rotate(45deg)}.cdx-notify__cross:hover{opacity:1}.cdx-notifies{position:fixed;z-index:2;bottom:20px;left:20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif}.cdx-notify{position:relative;width:220px;margin-top:15px;padding:13px 16px;background:#fff;box-shadow:0 11px 17px 0 rgba(23,32,61,.13);border-radius:5px;font-size:14px;line-height:1.4em;word-wrap:break-word}.cdx-notify::before{content:'';position:absolute;display:block;top:0;left:0;width:3px;height:calc(100% - 6px);margin:3px;border-radius:5px;background:0 0}@keyframes bounceIn{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1)}}.cdx-notify--bounce-in{animation-name:bounceIn;animation-duration:.6s;animation-iteration-count:1}.cdx-notify--success{background:#fafffe!important}.cdx-notify--success::before{background:#41ffb1!important}`, ""]);
    }, function(e, i) {
      e.exports = function(o) {
        var n = [];
        return n.toString = function() {
          return this.map(function(r) {
            var a = function(l, c) {
              var d = l[1] || "", h = l[3];
              if (!h)
                return d;
              if (c && typeof btoa == "function") {
                var g = (f = h, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(f)))) + " */"), v = h.sources.map(function(w) {
                  return "/*# sourceURL=" + h.sourceRoot + w + " */";
                });
                return [d].concat(v).concat([g]).join(`
`);
              }
              var f;
              return [d].join(`
`);
            }(r, o);
            return r[2] ? "@media " + r[2] + "{" + a + "}" : a;
          }).join("");
        }, n.i = function(r, a) {
          typeof r == "string" && (r = [[null, r, ""]]);
          for (var l = {}, c = 0; c < this.length; c++) {
            var d = this[c][0];
            typeof d == "number" && (l[d] = !0);
          }
          for (c = 0; c < r.length; c++) {
            var h = r[c];
            typeof h[0] == "number" && l[h[0]] || (a && !h[2] ? h[2] = a : a && (h[2] = "(" + h[2] + ") and (" + a + ")"), n.push(h));
          }
        }, n;
      };
    }, function(e, i, o) {
      var n, r, a = {}, l = (n = function() {
        return window && document && document.all && !window.atob;
      }, function() {
        return r === void 0 && (r = n.apply(this, arguments)), r;
      }), c = /* @__PURE__ */ function(x) {
        var y = {};
        return function(E) {
          if (typeof E == "function")
            return E();
          if (y[E] === void 0) {
            var B = (function(D) {
              return document.querySelector(D);
            }).call(this, E);
            if (window.HTMLIFrameElement && B instanceof window.HTMLIFrameElement)
              try {
                B = B.contentDocument.head;
              } catch {
                B = null;
              }
            y[E] = B;
          }
          return y[E];
        };
      }(), d = null, h = 0, g = [], v = o(5);
      function f(x, y) {
        for (var E = 0; E < x.length; E++) {
          var B = x[E], D = a[B.id];
          if (D) {
            D.refs++;
            for (var M = 0; M < D.parts.length; M++)
              D.parts[M](B.parts[M]);
            for (; M < B.parts.length; M++)
              D.parts.push(j(B.parts[M], y));
          } else {
            var Y = [];
            for (M = 0; M < B.parts.length; M++)
              Y.push(j(B.parts[M], y));
            a[B.id] = { id: B.id, refs: 1, parts: Y };
          }
        }
      }
      function w(x, y) {
        for (var E = [], B = {}, D = 0; D < x.length; D++) {
          var M = x[D], Y = y.base ? M[0] + y.base : M[0], A = { css: M[1], media: M[2], sourceMap: M[3] };
          B[Y] ? B[Y].parts.push(A) : E.push(B[Y] = { id: Y, parts: [A] });
        }
        return E;
      }
      function _(x, y) {
        var E = c(x.insertInto);
        if (!E)
          throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var B = g[g.length - 1];
        if (x.insertAt === "top")
          B ? B.nextSibling ? E.insertBefore(y, B.nextSibling) : E.appendChild(y) : E.insertBefore(y, E.firstChild), g.push(y);
        else if (x.insertAt === "bottom")
          E.appendChild(y);
        else {
          if (typeof x.insertAt != "object" || !x.insertAt.before)
            throw new Error(`[Style Loader]

 Invalid value for parameter 'insertAt' ('options.insertAt') found.
 Must be 'top', 'bottom', or Object.
 (https://github.com/webpack-contrib/style-loader#insertat)
`);
          var D = c(x.insertInto + " " + x.insertAt.before);
          E.insertBefore(y, D);
        }
      }
      function L(x) {
        if (x.parentNode === null)
          return !1;
        x.parentNode.removeChild(x);
        var y = g.indexOf(x);
        y >= 0 && g.splice(y, 1);
      }
      function R(x) {
        var y = document.createElement("style");
        return x.attrs.type === void 0 && (x.attrs.type = "text/css"), $(y, x.attrs), _(x, y), y;
      }
      function $(x, y) {
        Object.keys(y).forEach(function(E) {
          x.setAttribute(E, y[E]);
        });
      }
      function j(x, y) {
        var E, B, D, M;
        if (y.transform && x.css) {
          if (!(M = y.transform(x.css)))
            return function() {
            };
          x.css = M;
        }
        if (y.singleton) {
          var Y = h++;
          E = d || (d = R(y)), B = dt.bind(null, E, Y, !1), D = dt.bind(null, E, Y, !0);
        } else
          x.sourceMap && typeof URL == "function" && typeof URL.createObjectURL == "function" && typeof URL.revokeObjectURL == "function" && typeof Blob == "function" && typeof btoa == "function" ? (E = function(A) {
            var G = document.createElement("link");
            return A.attrs.type === void 0 && (A.attrs.type = "text/css"), A.attrs.rel = "stylesheet", $(G, A.attrs), _(A, G), G;
          }(y), B = (function(A, G, Tt) {
            var ot = Tt.css, wt = Tt.sourceMap, Dt = G.convertToAbsoluteUrls === void 0 && wt;
            (G.convertToAbsoluteUrls || Dt) && (ot = v(ot)), wt && (ot += `
/*# sourceMappingURL=data:application/json;base64,` + btoa(unescape(encodeURIComponent(JSON.stringify(wt)))) + " */");
            var k = new Blob([ot], { type: "text/css" }), P = A.href;
            A.href = URL.createObjectURL(k), P && URL.revokeObjectURL(P);
          }).bind(null, E, y), D = function() {
            L(E), E.href && URL.revokeObjectURL(E.href);
          }) : (E = R(y), B = (function(A, G) {
            var Tt = G.css, ot = G.media;
            if (ot && A.setAttribute("media", ot), A.styleSheet)
              A.styleSheet.cssText = Tt;
            else {
              for (; A.firstChild; )
                A.removeChild(A.firstChild);
              A.appendChild(document.createTextNode(Tt));
            }
          }).bind(null, E), D = function() {
            L(E);
          });
        return B(x), function(A) {
          if (A) {
            if (A.css === x.css && A.media === x.media && A.sourceMap === x.sourceMap)
              return;
            B(x = A);
          } else
            D();
        };
      }
      e.exports = function(x, y) {
        if (typeof DEBUG < "u" && DEBUG && typeof document != "object")
          throw new Error("The style-loader cannot be used in a non-browser environment");
        (y = y || {}).attrs = typeof y.attrs == "object" ? y.attrs : {}, y.singleton || typeof y.singleton == "boolean" || (y.singleton = l()), y.insertInto || (y.insertInto = "head"), y.insertAt || (y.insertAt = "bottom");
        var E = w(x, y);
        return f(E, y), function(B) {
          for (var D = [], M = 0; M < E.length; M++) {
            var Y = E[M];
            (A = a[Y.id]).refs--, D.push(A);
          }
          for (B && f(w(B, y), y), M = 0; M < D.length; M++) {
            var A;
            if ((A = D[M]).refs === 0) {
              for (var G = 0; G < A.parts.length; G++)
                A.parts[G]();
              delete a[A.id];
            }
          }
        };
      };
      var H, q = (H = [], function(x, y) {
        return H[x] = y, H.filter(Boolean).join(`
`);
      });
      function dt(x, y, E, B) {
        var D = E ? "" : B.css;
        if (x.styleSheet)
          x.styleSheet.cssText = q(y, D);
        else {
          var M = document.createTextNode(D), Y = x.childNodes;
          Y[y] && x.removeChild(Y[y]), Y.length ? x.insertBefore(M, Y[y]) : x.appendChild(M);
        }
      }
    }, function(e, i) {
      e.exports = function(o) {
        var n = typeof window < "u" && window.location;
        if (!n)
          throw new Error("fixUrls requires window.location");
        if (!o || typeof o != "string")
          return o;
        var r = n.protocol + "//" + n.host, a = r + n.pathname.replace(/\/[^\/]*$/, "/");
        return o.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(l, c) {
          var d, h = c.trim().replace(/^"(.*)"$/, function(g, v) {
            return v;
          }).replace(/^'(.*)'$/, function(g, v) {
            return v;
          });
          return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(h) ? l : (d = h.indexOf("//") === 0 ? h : h.indexOf("/") === 0 ? r + h : a + h.replace(/^\.\//, ""), "url(" + JSON.stringify(d) + ")");
        });
      };
    }, function(e, i, o) {
      var n, r, a, l, c, d, h, g, v;
      e.exports = (n = "cdx-notifies", r = "cdx-notify", a = "cdx-notify__cross", l = "cdx-notify__button--confirm", c = "cdx-notify__button--cancel", d = "cdx-notify__input", h = "cdx-notify__button", g = "cdx-notify__btns-wrapper", { alert: v = function(f) {
        var w = document.createElement("DIV"), _ = document.createElement("DIV"), L = f.message, R = f.style;
        return w.classList.add(r), R && w.classList.add(r + "--" + R), w.innerHTML = L, _.classList.add(a), _.addEventListener("click", w.remove.bind(w)), w.appendChild(_), w;
      }, confirm: function(f) {
        var w = v(f), _ = document.createElement("div"), L = document.createElement("button"), R = document.createElement("button"), $ = w.querySelector("." + a), j = f.cancelHandler, H = f.okHandler;
        return _.classList.add(g), L.innerHTML = f.okText || "Confirm", R.innerHTML = f.cancelText || "Cancel", L.classList.add(h), R.classList.add(h), L.classList.add(l), R.classList.add(c), j && typeof j == "function" && (R.addEventListener("click", j), $.addEventListener("click", j)), H && typeof H == "function" && L.addEventListener("click", H), L.addEventListener("click", w.remove.bind(w)), R.addEventListener("click", w.remove.bind(w)), _.appendChild(L), _.appendChild(R), w.appendChild(_), w;
      }, prompt: function(f) {
        var w = v(f), _ = document.createElement("div"), L = document.createElement("button"), R = document.createElement("input"), $ = w.querySelector("." + a), j = f.cancelHandler, H = f.okHandler;
        return _.classList.add(g), L.innerHTML = f.okText || "Ok", L.classList.add(h), L.classList.add(l), R.classList.add(d), f.placeholder && R.setAttribute("placeholder", f.placeholder), f.default && (R.value = f.default), f.inputType && (R.type = f.inputType), j && typeof j == "function" && $.addEventListener("click", j), H && typeof H == "function" && L.addEventListener("click", function() {
          H(R.value);
        }), L.addEventListener("click", w.remove.bind(w)), _.appendChild(R), _.appendChild(L), w.appendChild(_), w;
      }, getWrapper: function() {
        var f = document.createElement("DIV");
        return f.classList.add(n), f;
      } });
    }]);
  });
})(js);
var ea = js.exports;
const ia = /* @__PURE__ */ ei(ea);
class oa {
  /**
   * Show web notification
   *
   * @param {NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions} options - notification options
   */
  show(t) {
    ia.show(t);
  }
}
class sa extends N {
  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: t, eventsDispatcher: e }) {
    super({
      config: t,
      eventsDispatcher: e
    }), this.notifier = new oa();
  }
  /**
   * Available methods
   */
  get methods() {
    return {
      show: (t) => this.show(t)
    };
  }
  /**
   * Show notification
   *
   * @param {NotifierOptions} options - message option
   */
  show(t) {
    return this.notifier.show(t);
  }
}
class na extends N {
  /**
   * Available methods
   */
  get methods() {
    const t = () => this.isEnabled;
    return {
      toggle: (e) => this.toggle(e),
      get isEnabled() {
        return t();
      }
    };
  }
  /**
   * Set or toggle read-only state
   *
   * @param {boolean|undefined} state - set or toggle state
   * @returns {boolean} current value
   */
  toggle(t) {
    return this.Editor.ReadOnly.toggle(t);
  }
  /**
   * Returns current read-only state
   */
  get isEnabled() {
    return this.Editor.ReadOnly.isEnabled;
  }
}
var Us = { exports: {} };
(function(s, t) {
  (function(e, i) {
    s.exports = i();
  })(Cr, function() {
    function e(h) {
      var g = h.tags, v = Object.keys(g), f = v.map(function(w) {
        return typeof g[w];
      }).every(function(w) {
        return w === "object" || w === "boolean" || w === "function";
      });
      if (!f)
        throw new Error("The configuration was invalid");
      this.config = h;
    }
    var i = ["P", "LI", "TD", "TH", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "PRE"];
    function o(h) {
      return i.indexOf(h.nodeName) !== -1;
    }
    var n = ["A", "B", "STRONG", "I", "EM", "SUB", "SUP", "U", "STRIKE"];
    function r(h) {
      return n.indexOf(h.nodeName) !== -1;
    }
    e.prototype.clean = function(h) {
      const g = document.implementation.createHTMLDocument(), v = g.createElement("div");
      return v.innerHTML = h, this._sanitize(g, v), v.innerHTML;
    }, e.prototype._sanitize = function(h, g) {
      var v = a(h, g), f = v.firstChild();
      if (f)
        do {
          if (f.nodeType === Node.TEXT_NODE)
            if (f.data.trim() === "" && (f.previousElementSibling && o(f.previousElementSibling) || f.nextElementSibling && o(f.nextElementSibling))) {
              g.removeChild(f), this._sanitize(h, g);
              break;
            } else
              continue;
          if (f.nodeType === Node.COMMENT_NODE) {
            g.removeChild(f), this._sanitize(h, g);
            break;
          }
          var w = r(f), _;
          w && (_ = Array.prototype.some.call(f.childNodes, o));
          var L = !!g.parentNode, R = o(g) && o(f) && L, $ = f.nodeName.toLowerCase(), j = l(this.config, $, f), H = w && _;
          if (H || c(f, j) || !this.config.keepNestedBlockElements && R) {
            if (!(f.nodeName === "SCRIPT" || f.nodeName === "STYLE"))
              for (; f.childNodes.length > 0; )
                g.insertBefore(f.childNodes[0], f);
            g.removeChild(f), this._sanitize(h, g);
            break;
          }
          for (var q = 0; q < f.attributes.length; q += 1) {
            var dt = f.attributes[q];
            d(dt, j, f) && (f.removeAttribute(dt.name), q = q - 1);
          }
          this._sanitize(h, f);
        } while (f = v.nextSibling());
    };
    function a(h, g) {
      return h.createTreeWalker(
        g,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
        null,
        !1
      );
    }
    function l(h, g, v) {
      return typeof h.tags[g] == "function" ? h.tags[g](v) : h.tags[g];
    }
    function c(h, g) {
      return typeof g > "u" ? !0 : typeof g == "boolean" ? !g : !1;
    }
    function d(h, g, v) {
      var f = h.name.toLowerCase();
      return g === !0 ? !1 : typeof g[f] == "function" ? !g[f](h.value, v) : typeof g[f] > "u" || g[f] === !1 ? !0 : typeof g[f] == "string" ? g[f] !== h.value : !1;
    }
    return e;
  });
})(Us);
var ra = Us.exports;
const aa = /* @__PURE__ */ ei(ra);
function Ki(s, t) {
  return s.map((e) => {
    const i = K(t) ? t(e.tool) : t;
    return kt(i) || (e.data = Xi(e.data, i)), e;
  });
}
function Bt(s, t = {}) {
  const e = {
    tags: t
  };
  return new aa(e).clean(s);
}
function Xi(s, t) {
  return Array.isArray(s) ? la(s, t) : et(s) ? ca(s, t) : Ot(s) ? da(s, t) : s;
}
function la(s, t) {
  return s.map((e) => Xi(e, t));
}
function ca(s, t) {
  const e = {};
  for (const i in s) {
    if (!Object.prototype.hasOwnProperty.call(s, i))
      continue;
    const o = s[i], n = ha(t[i]) ? t[i] : t;
    e[i] = Xi(o, n);
  }
  return e;
}
function da(s, t) {
  return et(t) ? Bt(s, t) : t === !1 ? Bt(s, {}) : s;
}
function ha(s) {
  return et(s) || Ir(s) || K(s);
}
let ua = class extends N {
  /**
   * Available methods
   *
   * @returns {SanitizerConfig}
   */
  get methods() {
    return {
      clean: (t, e) => this.clean(t, e)
    };
  }
  /**
   * Perform sanitizing of a string
   *
   * @param {string} taintString - what to sanitize
   * @param {SanitizerConfig} config - sanitizer config
   * @returns {string}
   */
  clean(t, e) {
    return Bt(t, e);
  }
};
class pa extends N {
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
    const t = "Editor's content can not be saved in read-only mode";
    return this.Editor.ReadOnly.isEnabled ? (yt(t, "warn"), Promise.reject(new Error(t))) : this.Editor.Saver.save();
  }
}
let ga = class extends N {
  constructor() {
    super(...arguments), this.selectionUtils = new C();
  }
  /**
   * Available methods
   *
   * @returns {SelectionAPIInterface}
   */
  get methods() {
    return {
      findParentTag: (t, e) => this.findParentTag(t, e),
      expandToTag: (t) => this.expandToTag(t),
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
  findParentTag(t, e) {
    return this.selectionUtils.findParentTag(t, e);
  }
  /**
   * Expand selection to passed tag
   *
   * @param {HTMLElement} node - tag that should contain selection
   */
  expandToTag(t) {
    this.selectionUtils.expandToTag(t);
  }
};
class fa extends N {
  /**
   * Available methods
   */
  get methods() {
    return {
      getBlockTools: () => Array.from(this.Editor.Tools.blockTools.values())
    };
  }
}
class ma extends N {
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
class va extends N {
  /**
   * Available methods
   *
   * @returns {Toolbar}
   */
  get methods() {
    return {
      close: () => this.close(),
      open: () => this.open(),
      toggleBlockSettings: (t) => this.toggleBlockSettings(t),
      toggleToolbox: (t) => this.toggleToolbox(t)
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
  toggleBlockSettings(t) {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      yt("Could't toggle the Toolbar because there is no block selected ", "warn");
      return;
    }
    t ?? !this.Editor.BlockSettings.opened ? (this.Editor.Toolbar.moveAndOpen(), this.Editor.BlockSettings.open()) : this.Editor.BlockSettings.close();
  }
  /**
   * Open toolbox
   *
   * @param {boolean} openingState - Opening state of toolbox
   */
  toggleToolbox(t) {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      yt("Could't toggle the Toolbox because there is no block selected ", "warn");
      return;
    }
    t ?? !this.Editor.Toolbar.toolbox.opened ? (this.Editor.Toolbar.moveAndOpen(), this.Editor.Toolbar.toolbox.open()) : this.Editor.Toolbar.toolbox.close();
  }
}
var Ws = { exports: {} };
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
(function(s, t) {
  (function(e, i) {
    s.exports = i();
  })(window, function() {
    return function(e) {
      var i = {};
      function o(n) {
        if (i[n])
          return i[n].exports;
        var r = i[n] = { i: n, l: !1, exports: {} };
        return e[n].call(r.exports, r, r.exports, o), r.l = !0, r.exports;
      }
      return o.m = e, o.c = i, o.d = function(n, r, a) {
        o.o(n, r) || Object.defineProperty(n, r, { enumerable: !0, get: a });
      }, o.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, o.t = function(n, r) {
        if (1 & r && (n = o(n)), 8 & r || 4 & r && typeof n == "object" && n && n.__esModule)
          return n;
        var a = /* @__PURE__ */ Object.create(null);
        if (o.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: n }), 2 & r && typeof n != "string")
          for (var l in n)
            o.d(a, l, (function(c) {
              return n[c];
            }).bind(null, l));
        return a;
      }, o.n = function(n) {
        var r = n && n.__esModule ? function() {
          return n.default;
        } : function() {
          return n;
        };
        return o.d(r, "a", r), r;
      }, o.o = function(n, r) {
        return Object.prototype.hasOwnProperty.call(n, r);
      }, o.p = "", o(o.s = 0);
    }([function(e, i, o) {
      e.exports = o(1);
    }, function(e, i, o) {
      o.r(i), o.d(i, "default", function() {
        return n;
      });
      class n {
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
          const l = o(2), c = this.make("style", null, { textContent: l.toString(), id: a });
          this.prepend(document.head, c);
        }
        placeBottom(a, l) {
          const c = a.getBoundingClientRect(), d = c.left + a.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2, h = c.bottom + window.pageYOffset + this.offsetTop + l.marginTop;
          this.applyPlacement("bottom", d, h);
        }
        placeTop(a, l) {
          const c = a.getBoundingClientRect(), d = c.left + a.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2, h = c.top + window.pageYOffset - this.nodes.wrapper.clientHeight - this.offsetTop;
          this.applyPlacement("top", d, h);
        }
        placeLeft(a, l) {
          const c = a.getBoundingClientRect(), d = c.left - this.nodes.wrapper.offsetWidth - this.offsetLeft - l.marginLeft, h = c.top + window.pageYOffset + a.clientHeight / 2 - this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("left", d, h);
        }
        placeRight(a, l) {
          const c = a.getBoundingClientRect(), d = c.right + this.offsetRight + l.marginRight, h = c.top + window.pageYOffset + a.clientHeight / 2 - this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("right", d, h);
        }
        applyPlacement(a, l, c) {
          this.nodes.wrapper.classList.add(this.CSS.placement[a]), this.nodes.wrapper.style.left = l + "px", this.nodes.wrapper.style.top = c + "px";
        }
        make(a, l = null, c = {}) {
          const d = document.createElement(a);
          Array.isArray(l) ? d.classList.add(...l) : l && d.classList.add(l);
          for (const h in c)
            c.hasOwnProperty(h) && (d[h] = c[h]);
          return d;
        }
        append(a, l) {
          Array.isArray(l) ? l.forEach((c) => a.appendChild(c)) : a.appendChild(l);
        }
        prepend(a, l) {
          Array.isArray(l) ? (l = l.reverse()).forEach((c) => a.prepend(c)) : a.prepend(l);
        }
      }
    }, function(e, i) {
      e.exports = `.ct{z-index:999;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1),-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);will-change:opacity,top,left;-webkit-box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);border-radius:9px}.ct,.ct:before{position:absolute;top:0;left:0}.ct:before{content:"";bottom:0;right:0;background-color:#1d202b;z-index:-1;border-radius:4px}@supports(-webkit-mask-box-image:url("")){.ct:before{border-radius:0;-webkit-mask-box-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10.71 0h2.58c3.02 0 4.64.42 6.1 1.2a8.18 8.18 0 013.4 3.4C23.6 6.07 24 7.7 24 10.71v2.58c0 3.02-.42 4.64-1.2 6.1a8.18 8.18 0 01-3.4 3.4c-1.47.8-3.1 1.21-6.11 1.21H10.7c-3.02 0-4.64-.42-6.1-1.2a8.18 8.18 0 01-3.4-3.4C.4 17.93 0 16.3 0 13.29V10.7c0-3.02.42-4.64 1.2-6.1a8.18 8.18 0 013.4-3.4C6.07.4 7.7 0 10.71 0z"/></svg>') 48% 41% 37.9% 53.3%}}@media (--mobile){.ct{display:none}}.ct__content{padding:6px 10px;color:#cdd1e0;font-size:12px;text-align:center;letter-spacing:.02em;line-height:1em}.ct:after{content:"";width:8px;height:8px;position:absolute;background-color:#1d202b;z-index:-1}.ct--bottom{-webkit-transform:translateY(5px);transform:translateY(5px)}.ct--bottom:after{top:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--top{-webkit-transform:translateY(-5px);transform:translateY(-5px)}.ct--top:after{top:auto;bottom:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--left{-webkit-transform:translateX(-5px);transform:translateX(-5px)}.ct--left:after{top:50%;left:auto;right:0;-webkit-transform:translate(41.6%,-50%) rotate(-45deg);transform:translate(41.6%,-50%) rotate(-45deg)}.ct--right{-webkit-transform:translateX(5px);transform:translateX(5px)}.ct--right:after{top:50%;left:0;-webkit-transform:translate(-41.6%,-50%) rotate(-45deg);transform:translate(-41.6%,-50%) rotate(-45deg)}.ct--shown{opacity:1;-webkit-transform:none;transform:none}`;
    }]).default;
  });
})(Ws);
var ba = Ws.exports;
const wa = /* @__PURE__ */ ei(ba);
let _t = null;
function Zi() {
  _t || (_t = new wa());
}
function ya(s, t, e) {
  Zi(), _t == null || _t.show(s, t, e);
}
function qe(s = !1) {
  Zi(), _t == null || _t.hide(s);
}
function Ye(s, t, e) {
  Zi(), _t == null || _t.onHover(s, t, e);
}
function ka() {
  _t == null || _t.destroy(), _t = null;
}
class xa extends N {
  /**
   * @class
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: t, eventsDispatcher: e }) {
    super({
      config: t,
      eventsDispatcher: e
    });
  }
  /**
   * Available methods
   */
  get methods() {
    return {
      show: (t, e, i) => this.show(t, e, i),
      hide: () => this.hide(),
      onHover: (t, e, i) => this.onHover(t, e, i)
    };
  }
  /**
   * Method show tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  show(t, e, i) {
    ya(t, e, i);
  }
  /**
   * Method hides tooltip on HTML page
   */
  hide() {
    qe();
  }
  /**
   * Decorator for showing Tooltip by mouseenter/mouseleave
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  onHover(t, e, i) {
    Ye(t, e, i);
  }
}
class _a extends N {
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
function qs(s, t) {
  const e = {};
  return Object.entries(s).forEach(([i, o]) => {
    if (et(o)) {
      const n = t ? `${t}.${i}` : i;
      Object.values(o).every((r) => Ot(r)) ? e[i] = n : e[i] = qs(o, n);
      return;
    }
    e[i] = o;
  }), e;
}
const vt = qs(Rs);
function Ea(s, t) {
  const e = {};
  return Object.keys(s).forEach((i) => {
    const o = t[i];
    o !== void 0 ? e[o] = s[i] : e[i] = s[i];
  }), e;
}
const Ys = class _e {
  /**
   * @param {HTMLElement[]} nodeList — the list of iterable HTML-items
   * @param {string} focusedCssClass - user-provided CSS-class that will be set in flipping process
   */
  constructor(t, e) {
    this.cursor = -1, this.items = [], this.items = t || [], this.focusedCssClass = e;
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
  setCursor(t) {
    t < this.items.length && t >= -1 && (this.dropCursor(), this.cursor = t, this.items[this.cursor].classList.add(this.focusedCssClass));
  }
  /**
   * Sets items. Can be used when iterable items changed dynamically
   *
   * @param {HTMLElement[]} nodeList - nodes to iterate
   */
  setItems(t) {
    this.items = t;
  }
  /**
   * Sets cursor next to the current
   */
  next() {
    this.cursor = this.leafNodesAndReturnIndex(_e.directions.RIGHT);
  }
  /**
   * Sets cursor before current
   */
  previous() {
    this.cursor = this.leafNodesAndReturnIndex(_e.directions.LEFT);
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
  leafNodesAndReturnIndex(t) {
    if (this.items.length === 0)
      return this.cursor;
    let e = this.cursor;
    return e === -1 ? e = t === _e.directions.RIGHT ? -1 : 0 : this.items[e].classList.remove(this.focusedCssClass), t === _e.directions.RIGHT ? e = (e + 1) % this.items.length : e = (this.items.length + e - 1) % this.items.length, m.canSetCaret(this.items[e]) && je(() => C.setCursor(this.items[e]), 50)(), this.items[e].classList.add(this.focusedCssClass), e;
  }
};
Ys.directions = {
  RIGHT: "right",
  LEFT: "left"
};
let fe = Ys, Ke = class Li {
  /**
   * @param options - different constructing settings
   */
  constructor(t) {
    this.iterator = null, this.activated = !1, this.flipCallbacks = [], this.onKeyDown = (e) => {
      if (this.isEventReadyForHandling(e))
        switch (Li.usedKeys.includes(e.keyCode) && e.preventDefault(), e.keyCode) {
          case S.TAB:
            this.handleTabPress(e);
            break;
          case S.LEFT:
          case S.UP:
            this.flipLeft();
            break;
          case S.RIGHT:
          case S.DOWN:
            this.flipRight();
            break;
          case S.ENTER:
            this.handleEnterPress(e);
            break;
        }
    }, this.iterator = new fe(t.items, t.focusedItemClass), this.activateCallback = t.activateCallback, this.allowedKeys = t.allowedKeys || Li.usedKeys;
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
      S.TAB,
      S.LEFT,
      S.RIGHT,
      S.ENTER,
      S.UP,
      S.DOWN
    ];
  }
  /**
   * Active tab/arrows handling by flipper
   *
   * @param items - Some modules (like, InlineToolbar, BlockSettings) might refresh buttons dynamically
   * @param cursorPosition - index of the item that should be focused once flipper is activated
   */
  activate(t, e) {
    this.activated = !0, t && this.iterator.setItems(t), e !== void 0 && this.iterator.setCursor(e), document.addEventListener("keydown", this.onKeyDown, !0);
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
  onFlip(t) {
    this.flipCallbacks.push(t);
  }
  /**
   * Unregisteres function that is executed on each navigation action
   *
   * @param cb - function to stop executing
   */
  removeOnFlip(t) {
    this.flipCallbacks = this.flipCallbacks.filter((e) => e !== t);
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
  isEventReadyForHandling(t) {
    return this.activated && this.allowedKeys.includes(t.keyCode);
  }
  /**
   * When flipper is activated tab press will leaf the items
   *
   * @param {KeyboardEvent} event - tab keydown event
   */
  handleTabPress(t) {
    switch (t.shiftKey ? fe.directions.LEFT : fe.directions.RIGHT) {
      case fe.directions.RIGHT:
        this.flipRight();
        break;
      case fe.directions.LEFT:
        this.flipLeft();
        break;
    }
  }
  /**
   * Enter press will click current item if flipper is activated
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  handleEnterPress(t) {
    this.activated && (this.iterator.currentItem && (t.stopPropagation(), t.preventDefault(), this.iterator.currentItem.click()), K(this.activateCallback) && this.activateCallback(this.iterator.currentItem));
  }
  /**
   * Fired after flipping in any direction
   */
  flipCallback() {
    this.iterator.currentItem && this.iterator.currentItem.scrollIntoViewIfNeeded(), this.flipCallbacks.forEach((t) => t());
  }
};
const Ca = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 12L9 7.1C9 7.04477 9.04477 7 9.1 7H10.4C11.5 7 14 7.1 14 9.5C14 9.5 14 12 11 12M9 12V16.8C9 16.9105 9.08954 17 9.2 17H12.5C14 17 15 16 15 14.5C15 11.7046 11 12 11 12M9 12H11"/></svg>', Ta = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 10L11.8586 14.8586C11.9367 14.9367 12.0633 14.9367 12.1414 14.8586L17 10"/></svg>', Sa = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.5 17.5L9.64142 12.6414C9.56331 12.5633 9.56331 12.4367 9.64142 12.3586L14.5 7.5"/></svg>', Ba = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9.58284 17.5L14.4414 12.6414C14.5195 12.5633 14.5195 12.4367 14.4414 12.3586L9.58284 7.5"/></svg>', Ia = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 15L11.8586 10.1414C11.9367 10.0633 12.0633 10.0633 12.1414 10.1414L17 15"/></svg>', La = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>', Ma = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/></svg>', Aa = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13.34 10C12.4223 12.7337 11 17 11 17"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.21 7H14.2"/></svg>', zo = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72"/></svg>', Ra = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.40999 7.29999H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 7.29999H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.30999 12H9.3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 12H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.40999 16.7H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 16.7H14.59"/></svg>', Pa = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>', Ks = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M11.5 17.5L5 11M5 11V15.5M5 11H9.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12.5 6.5L19 13M19 13V8.5M19 13H14.5"/></svg>', Oa = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" stroke-width="2"/><line x1="15.4142" x2="19" y1="15" y2="18.5858" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>', Na = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M15.7795 11.5C15.7795 11.5 16.053 11.1962 16.5497 10.6722C17.4442 9.72856 17.4701 8.2475 16.5781 7.30145V7.30145C15.6482 6.31522 14.0873 6.29227 13.1288 7.25073L11.8796 8.49999"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8.24517 12.3883C8.24517 12.3883 7.97171 12.6922 7.47504 13.2161C6.58051 14.1598 6.55467 15.6408 7.44666 16.5869V16.5869C8.37653 17.5731 9.93744 17.5961 10.8959 16.6376L12.1452 15.3883"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M17.7802 15.1032L16.597 14.9422C16.0109 14.8624 15.4841 15.3059 15.4627 15.8969L15.4199 17.0818"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6.39064 9.03238L7.58432 9.06668C8.17551 9.08366 8.6522 8.58665 8.61056 7.99669L8.5271 6.81397"/><line x1="12.1142" x2="11.7" y1="12.2" y2="11.7858" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>', Da = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/><line x1="12" x2="12" y1="9" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 15.02V15.01"/></svg>', Va = "__", Ha = "--";
function jt(s) {
  return (t, e) => [[s, t].filter((i) => !!i).join(Va), e].filter((i) => !!i).join(Ha);
}
const me = jt("ce-hint"), ve = {
  root: me(),
  alignedStart: me(null, "align-left"),
  alignedCenter: me(null, "align-center"),
  title: me("title"),
  description: me("description")
};
class Fa {
  /**
   * Constructs the hint content instance
   *
   * @param params - hint content parameters
   */
  constructor(t) {
    this.nodes = {
      root: m.make("div", [ve.root, t.alignment === "center" ? ve.alignedCenter : ve.alignedStart]),
      title: m.make("div", ve.title, { textContent: t.title })
    }, this.nodes.root.appendChild(this.nodes.title), t.description !== void 0 && (this.nodes.description = m.make("div", ve.description, { textContent: t.description }), this.nodes.root.appendChild(this.nodes.description));
  }
  /**
   * Returns the root element of the hint content
   */
  getElement() {
    return this.nodes.root;
  }
}
let Gi = class {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(t) {
    this.params = t;
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
    qe();
  }
  /**
   * Called when children popover is opened (if exists)
   */
  onChildrenOpen() {
    var t;
    this.params !== void 0 && "children" in this.params && typeof ((t = this.params.children) == null ? void 0 : t.onOpen) == "function" && this.params.children.onOpen();
  }
  /**
   * Called when children popover is closed (if exists)
   */
  onChildrenClose() {
    var t;
    this.params !== void 0 && "children" in this.params && typeof ((t = this.params.children) == null ? void 0 : t.onClose) == "function" && this.params.children.onClose();
  }
  /**
   * Called on popover item click
   */
  handleClick() {
    var t, e;
    this.params !== void 0 && "onActivate" in this.params && ((e = (t = this.params).onActivate) == null || e.call(t, this.params));
  }
  /**
   * Adds hint to the item element if hint data is provided
   *
   * @param itemElement - popover item root element to add hint to
   * @param hintData - hint data
   */
  addHint(t, e) {
    const i = new Fa(e);
    Ye(t, i.getElement(), {
      placement: e.position,
      hidingDelay: 100
    });
  }
  /**
   * Returns item children that are represented as popover items
   */
  get children() {
    var t;
    return this.params !== void 0 && "children" in this.params && ((t = this.params.children) == null ? void 0 : t.items) !== void 0 ? this.params.children.items : [];
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
    var t;
    return this.params !== void 0 && "children" in this.params && ((t = this.params.children) == null ? void 0 : t.isOpen) === !0;
  }
  /**
   * True if item children items should be navigatable via keyboard
   */
  get isChildrenFlippable() {
    var t;
    return !(this.params === void 0 || !("children" in this.params) || ((t = this.params.children) == null ? void 0 : t.isFlippable) === !1);
  }
  /**
   * Returns true if item has children that should be searchable
   */
  get isChildrenSearchable() {
    var t;
    return this.params !== void 0 && "children" in this.params && ((t = this.params.children) == null ? void 0 : t.searchable) === !0;
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
};
const pt = jt("ce-popover-item"), X = {
  container: pt(),
  active: pt(null, "active"),
  disabled: pt(null, "disabled"),
  focused: pt(null, "focused"),
  hidden: pt(null, "hidden"),
  confirmationState: pt(null, "confirmation"),
  noHover: pt(null, "no-hover"),
  noFocus: pt(null, "no-focus"),
  title: pt("title"),
  secondaryTitle: pt("secondary-title"),
  icon: pt("icon"),
  iconTool: pt("icon", "tool"),
  iconChevronRight: pt("icon", "chevron-right"),
  wobbleAnimation: jt("wobble")()
};
let qt = class extends Gi {
  /**
   * Constructs popover item instance
   *
   * @param params - popover item construction params
   * @param renderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(t, e) {
    super(t), this.params = t, this.nodes = {
      root: null,
      icon: null
    }, this.confirmationState = null, this.removeSpecialFocusBehavior = () => {
      var i;
      (i = this.nodes.root) == null || i.classList.remove(X.noFocus);
    }, this.removeSpecialHoverBehavior = () => {
      var i;
      (i = this.nodes.root) == null || i.classList.remove(X.noHover);
    }, this.onErrorAnimationEnd = () => {
      var i, o;
      (i = this.nodes.icon) == null || i.classList.remove(X.wobbleAnimation), (o = this.nodes.icon) == null || o.removeEventListener("animationend", this.onErrorAnimationEnd);
    }, this.nodes.root = this.make(t, e);
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
    return this.nodes.root === null ? !1 : this.nodes.root.classList.contains(X.focused);
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
  toggleActive(t) {
    var e;
    (e = this.nodes.root) == null || e.classList.toggle(X.active, t);
  }
  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  toggleHidden(t) {
    var e;
    (e = this.nodes.root) == null || e.classList.toggle(X.hidden, t);
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
  make(t, e) {
    var i, o;
    const n = (e == null ? void 0 : e.wrapperTag) || "div", r = m.make(n, X.container, {
      type: n === "button" ? "button" : void 0
    });
    return t.name && (r.dataset.itemName = t.name), this.nodes.icon = m.make("div", [X.icon, X.iconTool], {
      innerHTML: t.icon || Ma
    }), r.appendChild(this.nodes.icon), t.title !== void 0 && r.appendChild(m.make("div", X.title, {
      innerHTML: t.title || ""
    })), t.secondaryLabel && r.appendChild(m.make("div", X.secondaryTitle, {
      textContent: t.secondaryLabel
    })), this.hasChildren && r.appendChild(m.make("div", [X.icon, X.iconChevronRight], {
      innerHTML: Ba
    })), this.isActive && r.classList.add(X.active), t.isDisabled && r.classList.add(X.disabled), t.hint !== void 0 && ((i = e == null ? void 0 : e.hint) == null ? void 0 : i.enabled) !== !1 && this.addHint(r, {
      ...t.hint,
      position: ((o = e == null ? void 0 : e.hint) == null ? void 0 : o.position) || "right"
    }), r;
  }
  /**
   * Activates confirmation mode for the item.
   *
   * @param newState - new popover item params that should be applied
   */
  enableConfirmationMode(t) {
    if (this.nodes.root === null)
      return;
    const e = {
      ...this.params,
      ...t,
      confirmation: "confirmation" in t ? t.confirmation : void 0
    }, i = this.make(e);
    this.nodes.root.innerHTML = i.innerHTML, this.nodes.root.classList.add(X.confirmationState), this.confirmationState = t, this.enableSpecialHoverAndFocusBehavior();
  }
  /**
   * Returns item to its original state
   */
  disableConfirmationMode() {
    if (this.nodes.root === null)
      return;
    const t = this.make(this.params);
    this.nodes.root.innerHTML = t.innerHTML, this.nodes.root.classList.remove(X.confirmationState), this.confirmationState = null, this.disableSpecialHoverAndFocusBehavior();
  }
  /**
   * Enables special focus and hover behavior for item in confirmation state.
   * This is needed to prevent item from being highlighted as hovered/focused just after click.
   */
  enableSpecialHoverAndFocusBehavior() {
    var t, e, i;
    (t = this.nodes.root) == null || t.classList.add(X.noHover), (e = this.nodes.root) == null || e.classList.add(X.noFocus), (i = this.nodes.root) == null || i.addEventListener("mouseleave", this.removeSpecialHoverBehavior, { once: !0 });
  }
  /**
   * Disables special focus and hover behavior
   */
  disableSpecialHoverAndFocusBehavior() {
    var t;
    this.removeSpecialFocusBehavior(), this.removeSpecialHoverBehavior(), (t = this.nodes.root) == null || t.removeEventListener("mouseleave", this.removeSpecialHoverBehavior);
  }
  /**
   * Executes item's onActivate callback if the item has no confirmation configured
   *
   * @param item - item to activate or bring to confirmation mode
   */
  activateOrEnableConfirmationMode(t) {
    var e;
    if (!("confirmation" in t) || t.confirmation === void 0)
      try {
        (e = t.onActivate) == null || e.call(t, t), this.disableConfirmationMode();
      } catch {
        this.animateError();
      }
    else
      this.enableConfirmationMode(t.confirmation);
  }
  /**
   * Animates item which symbolizes that error occured while executing 'onActivate()' callback
   */
  animateError() {
    var t, e, i;
    (t = this.nodes.icon) != null && t.classList.contains(X.wobbleAnimation) || ((e = this.nodes.icon) == null || e.classList.add(X.wobbleAnimation), (i = this.nodes.icon) == null || i.addEventListener("animationend", this.onErrorAnimationEnd));
  }
};
const ui = jt("ce-popover-item-separator"), pi = {
  container: ui(),
  line: ui("line"),
  hidden: ui(null, "hidden")
};
let Xs = class extends Gi {
  /**
   * Constructs the instance
   */
  constructor() {
    super(), this.nodes = {
      root: m.make("div", pi.container),
      line: m.make("div", pi.line)
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
  toggleHidden(t) {
    var e;
    (e = this.nodes.root) == null || e.classList.toggle(pi.hidden, t);
  }
};
var It = /* @__PURE__ */ ((s) => (s.Closed = "closed", s.ClosedOnActivate = "closed-on-activate", s))(It || {});
const nt = jt("ce-popover"), Z = {
  popover: nt(),
  popoverContainer: nt("container"),
  popoverOpenTop: nt(null, "open-top"),
  popoverOpenLeft: nt(null, "open-left"),
  popoverOpened: nt(null, "opened"),
  search: nt("search"),
  nothingFoundMessage: nt("nothing-found-message"),
  nothingFoundMessageDisplayed: nt("nothing-found-message", "displayed"),
  items: nt("items"),
  overlay: nt("overlay"),
  overlayHidden: nt("overlay", "hidden"),
  popoverNested: nt(null, "nested"),
  getPopoverNestedClass: (s) => nt(null, `nested-level-${s.toString()}`),
  popoverInline: nt(null, "inline"),
  popoverHeader: nt("header")
};
var se = /* @__PURE__ */ ((s) => (s.NestingLevel = "--nesting-level", s.PopoverHeight = "--popover-height", s.InlinePopoverWidth = "--inline-popover-width", s.TriggerItemLeft = "--trigger-item-left", s.TriggerItemTop = "--trigger-item-top", s))(se || {});
const jo = jt("ce-popover-item-html"), Uo = {
  root: jo(),
  hidden: jo(null, "hidden")
};
let Se = class extends Gi {
  /**
   * Constructs the instance
   *
   * @param params – instance parameters
   * @param renderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(t, e) {
    var i, o;
    super(t), this.nodes = {
      root: m.make("div", Uo.root)
    }, this.nodes.root.appendChild(t.element), t.name && (this.nodes.root.dataset.itemName = t.name), t.hint !== void 0 && ((i = e == null ? void 0 : e.hint) == null ? void 0 : i.enabled) !== !1 && this.addHint(this.nodes.root, {
      ...t.hint,
      position: ((o = e == null ? void 0 : e.hint) == null ? void 0 : o.position) || "right"
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
  toggleHidden(t) {
    var e;
    (e = this.nodes.root) == null || e.classList.toggle(Uo.hidden, t);
  }
  /**
   * Returns list of buttons and inputs inside custom content
   */
  getControls() {
    const t = this.nodes.root.querySelectorAll(
      `button, ${m.allInputsSelector}`
    );
    return Array.from(t);
  }
}, Zs = class extends Le {
  /**
   * Constructs the instance
   *
   * @param params - popover construction params
   * @param itemsRenderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(t, e = {}) {
    super(), this.params = t, this.itemsRenderParams = e, this.listeners = new Me(), this.messages = {
      nothingFound: "Nothing found",
      search: "Search"
    }, this.items = this.buildItems(t.items), t.messages && (this.messages = {
      ...this.messages,
      ...t.messages
    }), this.nodes = {}, this.nodes.popoverContainer = m.make("div", [Z.popoverContainer]), this.nodes.nothingFoundMessage = m.make("div", [Z.nothingFoundMessage], {
      textContent: this.messages.nothingFound
    }), this.nodes.popoverContainer.appendChild(this.nodes.nothingFoundMessage), this.nodes.items = m.make("div", [Z.items]), this.items.forEach((i) => {
      const o = i.getElement();
      o !== null && this.nodes.items.appendChild(o);
    }), this.nodes.popoverContainer.appendChild(this.nodes.items), this.listeners.on(this.nodes.popoverContainer, "click", (i) => this.handleClick(i)), this.nodes.popover = m.make("div", [
      Z.popover,
      this.params.class
    ]), this.nodes.popover.appendChild(this.nodes.popoverContainer);
  }
  /**
   * List of default popover items that are searchable and may have confirmation state
   */
  get itemsDefault() {
    return this.items.filter((t) => t instanceof qt);
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
    this.nodes.popover.classList.add(Z.popoverOpened), this.search !== void 0 && this.search.focus();
  }
  /**
   * Closes popover
   */
  hide() {
    this.nodes.popover.classList.remove(Z.popoverOpened), this.nodes.popover.classList.remove(Z.popoverOpenTop), this.itemsDefault.forEach((t) => t.reset()), this.search !== void 0 && this.search.clear(), this.emit(It.Closed);
  }
  /**
   * Clears memory
   */
  destroy() {
    var t;
    this.items.forEach((e) => e.destroy()), this.nodes.popover.remove(), this.listeners.removeAll(), (t = this.search) == null || t.destroy();
  }
  /**
   * Looks for the item by name and imitates click on it
   *
   * @param name - name of the item to activate
   */
  activateItemByName(t) {
    const e = this.items.find((i) => i.name === t);
    this.handleItemClick(e);
  }
  /**
   * Factory method for creating popover items
   *
   * @param items - list of items params
   */
  buildItems(t) {
    return t.map((e) => {
      switch (e.type) {
        case W.Separator:
          return new Xs();
        case W.Html:
          return new Se(e, this.itemsRenderParams[W.Html]);
        default:
          return new qt(e, this.itemsRenderParams[W.Default]);
      }
    });
  }
  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  getTargetItem(t) {
    return this.items.filter((e) => e instanceof qt || e instanceof Se).find((e) => {
      const i = e.getElement();
      return i === null ? !1 : t.composedPath().includes(i);
    });
  }
  /**
   * Handles popover item click
   *
   * @param item - item to handle click of
   */
  handleItemClick(t) {
    if (!("isDisabled" in t && t.isDisabled)) {
      if (t.hasChildren) {
        this.showNestedItems(t), "handleClick" in t && typeof t.handleClick == "function" && t.handleClick();
        return;
      }
      this.itemsDefault.filter((e) => e !== t).forEach((e) => e.reset()), "handleClick" in t && typeof t.handleClick == "function" && t.handleClick(), this.toggleItemActivenessIfNeeded(t), t.closeOnActivate && (this.hide(), this.emit(It.ClosedOnActivate));
    }
  }
  /**
   * Handles clicks inside popover
   *
   * @param event - item to handle click of
   */
  handleClick(t) {
    const e = this.getTargetItem(t);
    e !== void 0 && this.handleItemClick(e);
  }
  /**
   * - Toggles item active state, if clicked popover item has property 'toggle' set to true.
   *
   * - Performs radiobutton-like behavior if the item has property 'toggle' set to string key.
   * (All the other items with the same key get inactive, and the item gets active)
   *
   * @param clickedItem - popover item that was clicked
   */
  toggleItemActivenessIfNeeded(t) {
    if (t instanceof qt && (t.toggle === !0 && t.toggleActive(), typeof t.toggle == "string")) {
      const e = this.itemsDefault.filter((i) => i.toggle === t.toggle);
      if (e.length === 1) {
        t.toggleActive();
        return;
      }
      e.forEach((i) => {
        i.toggleActive(i === t);
      });
    }
  }
};
var Xe = /* @__PURE__ */ ((s) => (s.Search = "search", s))(Xe || {});
const gi = jt("cdx-search-field"), fi = {
  wrapper: gi(),
  icon: gi("icon"),
  input: gi("input")
};
class $a extends Le {
  /**
   * @param options - available config
   * @param options.items - searchable items list
   * @param options.placeholder - input placeholder
   */
  constructor({ items: t, placeholder: e }) {
    super(), this.listeners = new Me(), this.items = t, this.wrapper = m.make("div", fi.wrapper);
    const i = m.make("div", fi.icon, {
      innerHTML: Oa
    });
    this.input = m.make("input", fi.input, {
      placeholder: e,
      /**
       * Used to prevent focusing on the input by Tab key
       * (Popover in the Toolbar lays below the blocks,
       * so Tab in the last block will focus this hidden input if this property is not set)
       */
      tabIndex: -1
    }), this.wrapper.appendChild(i), this.wrapper.appendChild(this.input), this.listeners.on(this.input, "input", () => {
      this.searchQuery = this.input.value, this.emit(Xe.Search, {
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
    this.input.value = "", this.searchQuery = "", this.emit(Xe.Search, {
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
    return this.items.filter((t) => this.checkItem(t));
  }
  /**
   * Contains logic for checking whether passed item conforms the search query
   *
   * @param item - item to be checked
   */
  checkItem(t) {
    var e, i;
    const o = ((e = t.title) == null ? void 0 : e.toLowerCase()) || "", n = (i = this.searchQuery) == null ? void 0 : i.toLowerCase();
    return n !== void 0 ? o.includes(n) : !1;
  }
}
var za = Object.defineProperty, ja = Object.getOwnPropertyDescriptor, Ua = (s, t, e, i) => {
  for (var o = ja(t, e), n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = r(t, e, o) || o);
  return o && za(t, e, o), o;
};
const Gs = class Js extends Zs {
  /**
   * Construct the instance
   *
   * @param params - popover params
   * @param itemsRenderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(t, e) {
    super(t, e), this.nestingLevel = 0, this.nestedPopoverTriggerItem = null, this.previouslyHoveredItem = null, this.scopeElement = document.body, this.hide = () => {
      var i;
      super.hide(), this.destroyNestedPopoverIfExists(), (i = this.flipper) == null || i.deactivate(), this.previouslyHoveredItem = null;
    }, this.onFlip = () => {
      const i = this.itemsDefault.find((o) => o.isFocused);
      i == null || i.onFocus();
    }, this.onSearch = (i) => {
      var o;
      const n = i.query === "", r = i.items.length === 0;
      this.items.forEach((l) => {
        let c = !1;
        l instanceof qt ? c = !i.items.includes(l) : (l instanceof Xs || l instanceof Se) && (c = r || !n), l.toggleHidden(c);
      }), this.toggleNothingFoundMessage(r);
      const a = i.query === "" ? this.flippableElements : i.items.map((l) => l.getElement());
      (o = this.flipper) != null && o.isActivated && (this.flipper.deactivate(), this.flipper.activate(a));
    }, t.nestingLevel !== void 0 && (this.nestingLevel = t.nestingLevel), this.nestingLevel > 0 && this.nodes.popover.classList.add(Z.popoverNested), t.scopeElement !== void 0 && (this.scopeElement = t.scopeElement), this.nodes.popoverContainer !== null && this.listeners.on(this.nodes.popoverContainer, "mouseover", (i) => this.handleHover(i)), t.searchable && this.addSearch(), t.flippable !== !1 && (this.flipper = new Ke({
      items: this.flippableElements,
      focusedItemClass: X.focused,
      allowedKeys: [
        S.TAB,
        S.UP,
        S.DOWN,
        S.ENTER
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
    var t;
    this.nodes.popover.style.setProperty(se.PopoverHeight, this.size.height + "px"), this.shouldOpenBottom || this.nodes.popover.classList.add(Z.popoverOpenTop), this.shouldOpenRight || this.nodes.popover.classList.add(Z.popoverOpenLeft), super.show(), (t = this.flipper) == null || t.activate(this.flippableElements);
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
  showNestedItems(t) {
    this.nestedPopover !== null && this.nestedPopover !== void 0 || (this.nestedPopoverTriggerItem = t, this.showNestedPopoverForItem(t));
  }
  /**
   * Handles hover events inside popover items container
   *
   * @param event - hover event data
   */
  handleHover(t) {
    const e = this.getTargetItem(t);
    e !== void 0 && this.previouslyHoveredItem !== e && (this.destroyNestedPopoverIfExists(), this.previouslyHoveredItem = e, e.hasChildren && this.showNestedPopoverForItem(e));
  }
  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used for correct positioning of the nested popover
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  setTriggerItemPosition(t, e) {
    const i = e.getElement(), o = (i ? i.offsetTop : 0) - this.scrollTop, n = this.offsetTop + o;
    t.style.setProperty(se.TriggerItemTop, n + "px");
  }
  /**
   * Destroys existing nested popover
   */
  destroyNestedPopoverIfExists() {
    var t, e;
    this.nestedPopover === void 0 || this.nestedPopover === null || (this.nestedPopover.off(It.ClosedOnActivate, this.hide), this.nestedPopover.hide(), this.nestedPopover.destroy(), this.nestedPopover.getElement().remove(), this.nestedPopover = null, (t = this.flipper) == null || t.activate(this.flippableElements), (e = this.nestedPopoverTriggerItem) == null || e.onChildrenClose());
  }
  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  showNestedPopoverForItem(t) {
    var e;
    this.nestedPopover = new Js({
      searchable: t.isChildrenSearchable,
      items: t.children,
      nestingLevel: this.nestingLevel + 1,
      flippable: t.isChildrenFlippable,
      messages: this.messages
    }), t.onChildrenOpen(), this.nestedPopover.on(It.ClosedOnActivate, this.hide);
    const i = this.nestedPopover.getElement();
    return this.nodes.popover.appendChild(i), this.setTriggerItemPosition(i, t), i.style.setProperty(se.NestingLevel, this.nestedPopover.nestingLevel.toString()), this.nestedPopover.show(), (e = this.flipper) == null || e.deactivate(), this.nestedPopover;
  }
  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  get shouldOpenBottom() {
    if (this.nodes.popover === void 0 || this.nodes.popover === null)
      return !1;
    const t = this.nodes.popoverContainer.getBoundingClientRect(), e = this.scopeElement.getBoundingClientRect(), i = this.size.height, o = t.top + i, n = t.top - i, r = Math.min(window.innerHeight, e.bottom);
    return n < e.top || o <= r;
  }
  /**
   * Checks if popover should be opened left.
   * It should happen when there is enough space in the right or not enough space in the left
   */
  get shouldOpenRight() {
    if (this.nodes.popover === void 0 || this.nodes.popover === null)
      return !1;
    const t = this.nodes.popover.getBoundingClientRect(), e = this.scopeElement.getBoundingClientRect(), i = this.size.width, o = t.right + i, n = t.left - i, r = Math.min(window.innerWidth, e.right);
    return n < e.left || o <= r;
  }
  get size() {
    var t;
    const e = {
      height: 0,
      width: 0
    };
    if (this.nodes.popover === null)
      return e;
    const i = this.nodes.popover.cloneNode(!0);
    i.style.visibility = "hidden", i.style.position = "absolute", i.style.top = "-1000px", i.classList.add(Z.popoverOpened), (t = i.querySelector("." + Z.popoverNested)) == null || t.remove(), document.body.appendChild(i);
    const o = i.querySelector("." + Z.popoverContainer);
    return e.height = o.offsetHeight, e.width = o.offsetWidth, i.remove(), e;
  }
  /**
   * Returns list of elements available for keyboard navigation.
   */
  get flippableElements() {
    return this.items.map((t) => {
      if (t instanceof qt)
        return t.getElement();
      if (t instanceof Se)
        return t.getControls();
    }).flat().filter((t) => t != null);
  }
  /**
   * Adds search to the popover
   */
  addSearch() {
    this.search = new $a({
      items: this.itemsDefault,
      placeholder: this.messages.search
    }), this.search.on(Xe.Search, this.onSearch);
    const t = this.search.getElement();
    t.classList.add(Z.search), this.nodes.popoverContainer.insertBefore(t, this.nodes.popoverContainer.firstChild);
  }
  /**
   * Toggles nothing found message visibility
   *
   * @param isDisplayed - true if the message should be displayed
   */
  toggleNothingFoundMessage(t) {
    this.nodes.nothingFoundMessage.classList.toggle(Z.nothingFoundMessageDisplayed, t);
  }
};
Ua([
  ce
], Gs.prototype, "size");
let Ji = Gs;
class Wa extends Ji {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(t) {
    const e = !de();
    super(
      {
        ...t,
        class: Z.popoverInline
      },
      {
        [W.Default]: {
          /**
           * We use button instead of div here to fix bug associated with focus loss (which leads to selection change) on click in safari
           *
           * @todo figure out better way to solve the issue
           */
          wrapperTag: "button",
          hint: {
            position: "top",
            alignment: "center",
            enabled: e
          }
        },
        [W.Html]: {
          hint: {
            position: "top",
            alignment: "center",
            enabled: e
          }
        }
      }
    ), this.items.forEach((i) => {
      !(i instanceof qt) && !(i instanceof Se) || i.hasChildren && i.isChildrenOpen && this.showNestedItems(i);
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
      se.InlinePopoverWidth,
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
  setTriggerItemPosition(t, e) {
    const i = e.getElement(), o = i ? i.offsetLeft : 0, n = this.offsetLeft + o;
    t.style.setProperty(
      se.TriggerItemLeft,
      n + "px"
    );
  }
  /**
   * Handles displaying nested items for the item.
   * Overriding in order to add toggling behaviour
   *
   * @param item – item to toggle nested popover for
   */
  showNestedItems(t) {
    if (this.nestedPopoverTriggerItem === t) {
      this.destroyNestedPopoverIfExists(), this.nestedPopoverTriggerItem = null;
      return;
    }
    super.showNestedItems(t);
  }
  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  showNestedPopoverForItem(t) {
    const e = super.showNestedPopoverForItem(t);
    return e.getElement().classList.add(Z.getPopoverNestedClass(e.nestingLevel)), e;
  }
  /**
   * Overrides default item click handling.
   * Helps to close nested popover once other item is clicked.
   *
   * @param item - clicked item
   */
  handleItemClick(t) {
    var e;
    t !== this.nestedPopoverTriggerItem && ((e = this.nestedPopoverTriggerItem) == null || e.handleClick(), super.destroyNestedPopoverIfExists()), super.handleItemClick(t);
  }
}
const Qs = class Ee {
  constructor() {
    this.scrollPosition = null;
  }
  /**
   * Locks body element scroll
   */
  lock() {
    Si ? this.lockHard() : document.body.classList.add(Ee.CSS.scrollLocked);
  }
  /**
   * Unlocks body element scroll
   */
  unlock() {
    Si ? this.unlockHard() : document.body.classList.remove(Ee.CSS.scrollLocked);
  }
  /**
   * Locks scroll in a hard way (via setting fixed position to body element)
   */
  lockHard() {
    this.scrollPosition = window.pageYOffset, document.documentElement.style.setProperty(
      "--window-scroll-offset",
      `${this.scrollPosition}px`
    ), document.body.classList.add(Ee.CSS.scrollLockedHard);
  }
  /**
   * Unlocks hard scroll lock
   */
  unlockHard() {
    document.body.classList.remove(Ee.CSS.scrollLockedHard), this.scrollPosition !== null && window.scrollTo(0, this.scrollPosition), this.scrollPosition = null;
  }
};
Qs.CSS = {
  scrollLocked: "ce-scroll-locked",
  scrollLockedHard: "ce-scroll-locked--hard"
};
let qa = Qs;
const mi = jt("ce-popover-header"), vi = {
  root: mi(),
  text: mi("text"),
  backButton: mi("back-button")
};
class Ya {
  /**
   * Constructs the instance
   *
   * @param params - popover header params
   */
  constructor({ text: t, onBackButtonClick: e }) {
    this.listeners = new Me(), this.text = t, this.onBackButtonClick = e, this.nodes = {
      root: m.make("div", [vi.root]),
      backButton: m.make("button", [vi.backButton]),
      text: m.make("div", [vi.text])
    }, this.nodes.backButton.innerHTML = Sa, this.nodes.root.appendChild(this.nodes.backButton), this.listeners.on(this.nodes.backButton, "click", this.onBackButtonClick), this.nodes.text.innerText = this.text, this.nodes.root.appendChild(this.nodes.text);
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
class Ka {
  constructor() {
    this.history = [];
  }
  /**
   * Push new popover state
   *
   * @param state - new state
   */
  push(t) {
    this.history.push(t);
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
let tn = class extends Zs {
  /**
   * Construct the instance
   *
   * @param params - popover params
   */
  constructor(t) {
    super(t, {
      [W.Default]: {
        hint: {
          enabled: !1
        }
      },
      [W.Html]: {
        hint: {
          enabled: !1
        }
      }
    }), this.scrollLocker = new qa(), this.history = new Ka(), this.isHidden = !0, this.nodes.overlay = m.make("div", [Z.overlay, Z.overlayHidden]), this.nodes.popover.insertBefore(this.nodes.overlay, this.nodes.popover.firstChild), this.listeners.on(this.nodes.overlay, "click", () => {
      this.hide();
    }), this.history.push({ items: t.items });
  }
  /**
   * Open popover
   */
  show() {
    this.nodes.overlay.classList.remove(Z.overlayHidden), super.show(), this.scrollLocker.lock(), this.isHidden = !1;
  }
  /**
   * Closes popover
   */
  hide() {
    this.isHidden || (super.hide(), this.nodes.overlay.classList.add(Z.overlayHidden), this.scrollLocker.unlock(), this.history.reset(), this.isHidden = !0);
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
  showNestedItems(t) {
    this.updateItemsAndHeader(t.children, t.title), this.history.push({
      title: t.title,
      items: t.children
    });
  }
  /**
   * Removes rendered popover items and header and displays new ones
   *
   * @param items - new popover items
   * @param title - new popover header text
   */
  updateItemsAndHeader(t, e) {
    if (this.header !== null && this.header !== void 0 && (this.header.destroy(), this.header = null), e !== void 0) {
      this.header = new Ya({
        text: e,
        onBackButtonClick: () => {
          this.history.pop(), this.updateItemsAndHeader(this.history.currentItems, this.history.currentTitle);
        }
      });
      const i = this.header.getElement();
      i !== null && this.nodes.popoverContainer.insertBefore(i, this.nodes.popoverContainer.firstChild);
    }
    this.items.forEach((i) => {
      var o;
      return (o = i.getElement()) == null ? void 0 : o.remove();
    }), this.items = this.buildItems(t), this.items.forEach((i) => {
      var o;
      const n = i.getElement();
      n !== null && ((o = this.nodes.items) == null || o.appendChild(n));
    });
  }
};
class Xa extends N {
  constructor() {
    super(...arguments), this.opened = !1, this.selection = new C(), this.popover = null, this.close = () => {
      this.opened && (this.opened = !1, C.isAtEditor || this.selection.restore(), this.selection.clearSaved(), !this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted && this.Editor.BlockManager.currentBlock && this.Editor.BlockSelection.unselectBlock(this.Editor.BlockManager.currentBlock), this.eventsDispatcher.emit(this.events.closed), this.popover && (this.popover.off(It.Closed, this.onPopoverClose), this.popover.destroy(), this.popover.getElement().remove(), this.popover = null));
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
    var t;
    if (this.popover !== null)
      return "flipper" in this.popover ? (t = this.popover) == null ? void 0 : t.flipper : void 0;
  }
  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   */
  make() {
    this.nodes.wrapper = m.make("div", [this.CSS.settings]), this.eventsDispatcher.on(Te, this.close);
  }
  /**
   * Destroys module
   */
  destroy() {
    this.removeAllNodes(), this.listeners.destroy(), this.eventsDispatcher.off(Te, this.close);
  }
  /**
   * Open Block Settings pane
   *
   * @param targetBlock - near which Block we should open BlockSettings
   */
  async open(t = this.Editor.BlockManager.currentBlock) {
    var e;
    this.opened = !0, this.selection.save(), this.Editor.BlockSelection.selectBlock(t), this.Editor.BlockSelection.clearCache();
    const { toolTunes: i, commonTunes: o } = t.getTunes();
    this.eventsDispatcher.emit(this.events.opened);
    const n = de() ? tn : Ji;
    this.popover = new n({
      searchable: !0,
      items: await this.getTunesItems(t, o, i),
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: lt.ui(vt.ui.popover, "Nothing found"),
        search: lt.ui(vt.ui.popover, "Filter")
      }
    }), this.popover.on(It.Closed, this.onPopoverClose), (e = this.nodes.wrapper) == null || e.append(this.popover.getElement()), this.popover.show();
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
  async getTunesItems(t, e, i) {
    const o = [];
    i !== void 0 && i.length > 0 && (o.push(...i), o.push({
      type: W.Separator
    }));
    const n = Array.from(this.Editor.Tools.blockTools.values()), r = (await $s(t, n)).reduce((a, l) => (l.toolbox.forEach((c) => {
      a.push({
        icon: c.icon,
        title: lt.t(vt.toolNames, c.title),
        name: l.name,
        closeOnActivate: !0,
        onActivate: async () => {
          const { BlockManager: d, Caret: h, Toolbar: g } = this.Editor, v = await d.convert(t, l.name, c.data);
          g.close(), h.setToBlock(v, h.positions.END);
        }
      });
    }), a), []);
    return r.length > 0 && (o.push({
      icon: Ks,
      name: "convert-to",
      title: lt.ui(vt.ui.popover, "Convert to"),
      children: {
        searchable: !0,
        items: r
      }
    }), o.push({
      type: W.Separator
    })), o.push(...e), o.map((a) => this.resolveTuneAliases(a));
  }
  /**
   * Resolves aliases in tunes menu items
   *
   * @param item - item with resolved aliases
   */
  resolveTuneAliases(t) {
    if (t.type === W.Separator || t.type === W.Html)
      return t;
    const e = Ea(t, { label: "title" });
    return t.confirmation && (e.confirmation = this.resolveTuneAliases(t.confirmation)), e;
  }
}
var en = { exports: {} };
/*!
 * Library for handling keyboard shortcuts
 * @copyright CodeX (https://codex.so)
 * @license MIT
 * @author CodeX (https://codex.so)
 * @version 1.2.0
 */
(function(s, t) {
  (function(e, i) {
    s.exports = i();
  })(window, function() {
    return function(e) {
      var i = {};
      function o(n) {
        if (i[n])
          return i[n].exports;
        var r = i[n] = { i: n, l: !1, exports: {} };
        return e[n].call(r.exports, r, r.exports, o), r.l = !0, r.exports;
      }
      return o.m = e, o.c = i, o.d = function(n, r, a) {
        o.o(n, r) || Object.defineProperty(n, r, { enumerable: !0, get: a });
      }, o.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, o.t = function(n, r) {
        if (1 & r && (n = o(n)), 8 & r || 4 & r && typeof n == "object" && n && n.__esModule)
          return n;
        var a = /* @__PURE__ */ Object.create(null);
        if (o.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: n }), 2 & r && typeof n != "string")
          for (var l in n)
            o.d(a, l, (function(c) {
              return n[c];
            }).bind(null, l));
        return a;
      }, o.n = function(n) {
        var r = n && n.__esModule ? function() {
          return n.default;
        } : function() {
          return n;
        };
        return o.d(r, "a", r), r;
      }, o.o = function(n, r) {
        return Object.prototype.hasOwnProperty.call(n, r);
      }, o.p = "", o(o.s = 0);
    }([function(e, i, o) {
      function n(l, c) {
        for (var d = 0; d < c.length; d++) {
          var h = c[d];
          h.enumerable = h.enumerable || !1, h.configurable = !0, "value" in h && (h.writable = !0), Object.defineProperty(l, h.key, h);
        }
      }
      function r(l, c, d) {
        return c && n(l.prototype, c), d && n(l, d), l;
      }
      o.r(i);
      var a = function() {
        function l(c) {
          var d = this;
          (function(h, g) {
            if (!(h instanceof g))
              throw new TypeError("Cannot call a class as a function");
          })(this, l), this.commands = {}, this.keys = {}, this.name = c.name, this.parseShortcutName(c.name), this.element = c.on, this.callback = c.callback, this.executeShortcut = function(h) {
            d.execute(h);
          }, this.element.addEventListener("keydown", this.executeShortcut, !1);
        }
        return r(l, null, [{ key: "supportedCommands", get: function() {
          return { SHIFT: ["SHIFT"], CMD: ["CMD", "CONTROL", "COMMAND", "WINDOWS", "CTRL"], ALT: ["ALT", "OPTION"] };
        } }, { key: "keyCodes", get: function() {
          return { 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, BACKSPACE: 8, ENTER: 13, ESCAPE: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, INSERT: 45, DELETE: 46, ".": 190 };
        } }]), r(l, [{ key: "parseShortcutName", value: function(c) {
          c = c.split("+");
          for (var d = 0; d < c.length; d++) {
            c[d] = c[d].toUpperCase();
            var h = !1;
            for (var g in l.supportedCommands)
              if (l.supportedCommands[g].includes(c[d])) {
                h = this.commands[g] = !0;
                break;
              }
            h || (this.keys[c[d]] = !0);
          }
          for (var v in l.supportedCommands)
            this.commands[v] || (this.commands[v] = !1);
        } }, { key: "execute", value: function(c) {
          var d, h = { CMD: c.ctrlKey || c.metaKey, SHIFT: c.shiftKey, ALT: c.altKey }, g = !0;
          for (d in this.commands)
            this.commands[d] !== h[d] && (g = !1);
          var v, f = !0;
          for (v in this.keys)
            f = f && c.keyCode === l.keyCodes[v];
          g && f && this.callback(c);
        } }, { key: "remove", value: function() {
          this.element.removeEventListener("keydown", this.executeShortcut);
        } }]), l;
      }();
      i.default = a;
    }]).default;
  });
})(en);
var Za = en.exports;
const Ga = /* @__PURE__ */ ei(Za);
class Ja {
  constructor() {
    this.registeredShortcuts = /* @__PURE__ */ new Map();
  }
  /**
   * Register shortcut
   *
   * @param shortcut - shortcut options
   */
  add(t) {
    if (this.findShortcut(t.on, t.name))
      throw Error(
        `Shortcut ${t.name} is already registered for ${t.on}. Please remove it before add a new handler.`
      );
    const e = new Ga({
      name: t.name,
      on: t.on,
      callback: t.handler
    }), i = this.registeredShortcuts.get(t.on) || [];
    this.registeredShortcuts.set(t.on, [...i, e]);
  }
  /**
   * Remove shortcut
   *
   * @param element - Element shortcut is set for
   * @param name - shortcut name
   */
  remove(t, e) {
    const i = this.findShortcut(t, e);
    if (!i)
      return;
    i.remove();
    const o = this.registeredShortcuts.get(t);
    this.registeredShortcuts.set(t, o.filter((n) => n !== i));
  }
  /**
   * Get Shortcut instance if exist
   *
   * @param element - Element shorcut is set for
   * @param shortcut - shortcut name
   * @returns {number} index - shortcut index if exist
   */
  findShortcut(t, e) {
    return (this.registeredShortcuts.get(t) || []).find(({ name: i }) => i === e);
  }
}
const ae = new Ja();
var Qa = Object.defineProperty, tl = Object.getOwnPropertyDescriptor, on = (s, t, e, i) => {
  for (var o = tl(t, e), n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = r(t, e, o) || o);
  return o && Qa(t, e, o), o;
}, Ne = /* @__PURE__ */ ((s) => (s.Opened = "toolbox-opened", s.Closed = "toolbox-closed", s.BlockAdded = "toolbox-block-added", s))(Ne || {});
const Qi = class sn extends Le {
  /**
   * Toolbox constructor
   *
   * @param options - available parameters
   * @param options.api - Editor API methods
   * @param options.tools - Tools available to check whether some of them should be displayed at the Toolbox or not
   */
  constructor({ api: t, tools: e, i18nLabels: i }) {
    super(), this.opened = !1, this.listeners = new Me(), this.popover = null, this.handleMobileLayoutToggle = () => {
      this.destroyPopover(), this.initPopover();
    }, this.onPopoverClose = () => {
      this.opened = !1, this.emit(
        "toolbox-closed"
        /* Closed */
      );
    }, this.api = t, this.tools = e, this.i18nLabels = i, this.enableShortcuts(), this.nodes = {
      toolbox: m.make("div", sn.CSS.toolbox)
    }, this.initPopover(), this.api.events.on(Te, this.handleMobileLayoutToggle);
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
    var t;
    super.destroy(), this.nodes && this.nodes.toolbox && this.nodes.toolbox.remove(), this.removeAllShortcuts(), (t = this.popover) == null || t.off(It.Closed, this.onPopoverClose), this.listeners.destroy(), this.api.events.off(Te, this.handleMobileLayoutToggle);
  }
  /**
   * Toolbox Tool's button click handler
   *
   * @param toolName - tool type to be activated
   * @param blockDataOverrides - Block data predefined by the activated Toolbox item
   */
  toolButtonActivated(t, e) {
    this.insertNewBlock(t, e);
  }
  /**
   * Open Toolbox with Tools
   */
  open() {
    var t;
    this.isEmpty || ((t = this.popover) == null || t.show(), this.opened = !0, this.emit(
      "toolbox-opened"
      /* Opened */
    ));
  }
  /**
   * Close Toolbox
   */
  close() {
    var t;
    (t = this.popover) == null || t.hide(), this.opened = !1, this.emit(
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
    var t;
    const e = de() ? tn : Ji;
    this.popover = new e({
      scopeElement: this.api.ui.nodes.redactor,
      searchable: !0,
      messages: {
        nothingFound: this.i18nLabels.nothingFound,
        search: this.i18nLabels.filter
      },
      items: this.toolboxItemsToBeDisplayed
    }), this.popover.on(It.Closed, this.onPopoverClose), (t = this.nodes.toolbox) == null || t.append(this.popover.getElement());
  }
  /**
   * Destroys popover instance and removes it from DOM
   */
  destroyPopover() {
    this.popover !== null && (this.popover.hide(), this.popover.off(It.Closed, this.onPopoverClose), this.popover.destroy(), this.popover = null), this.nodes.toolbox !== null && (this.nodes.toolbox.innerHTML = "");
  }
  get toolsToBeDisplayed() {
    const t = [];
    return this.tools.forEach((e) => {
      e.toolbox && t.push(e);
    }), t;
  }
  get toolboxItemsToBeDisplayed() {
    const t = (e, i) => ({
      icon: e.icon,
      title: lt.t(vt.toolNames, e.title || Ue(i.name)),
      name: i.name,
      onActivate: () => {
        this.toolButtonActivated(i.name, e.data);
      },
      secondaryLabel: i.shortcut ? Yi(i.shortcut) : ""
    });
    return this.toolsToBeDisplayed.reduce((e, i) => (Array.isArray(i.toolbox) ? i.toolbox.forEach((o) => {
      e.push(t(o, i));
    }) : i.toolbox !== void 0 && e.push(t(i.toolbox, i)), e), []);
  }
  /**
   * Iterate all tools and enable theirs shortcuts if specified
   */
  enableShortcuts() {
    this.toolsToBeDisplayed.forEach((t) => {
      const e = t.shortcut;
      e && this.enableShortcutForTool(t.name, e);
    });
  }
  /**
   * Enable shortcut Block Tool implemented shortcut
   *
   * @param {string} toolName - Tool name
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  enableShortcutForTool(t, e) {
    ae.add({
      name: e,
      on: this.api.ui.nodes.redactor,
      handler: async (i) => {
        i.preventDefault();
        const o = this.api.blocks.getCurrentBlockIndex(), n = this.api.blocks.getBlockByIndex(o);
        if (n)
          try {
            const r = await this.api.blocks.convert(n.id, t);
            this.api.caret.setToBlock(r, "end");
            return;
          } catch {
          }
        this.insertNewBlock(t);
      }
    });
  }
  /**
   * Removes all added shortcuts
   * Fired when the Read-Only mode is activated
   */
  removeAllShortcuts() {
    this.toolsToBeDisplayed.forEach((t) => {
      const e = t.shortcut;
      e && ae.remove(this.api.ui.nodes.redactor, e);
    });
  }
  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {string} toolName - Tool name
   * @param blockDataOverrides - predefined Block data
   */
  async insertNewBlock(t, e) {
    const i = this.api.blocks.getCurrentBlockIndex(), o = this.api.blocks.getBlockByIndex(i);
    if (!o)
      return;
    const n = o.isEmpty ? i : i + 1;
    let r;
    if (e) {
      const l = await this.api.blocks.composeBlockData(t);
      r = Object.assign(l, e);
    }
    const a = this.api.blocks.insert(
      t,
      r,
      void 0,
      n,
      void 0,
      o.isEmpty
    );
    a.call(Rt.APPEND_CALLBACK), this.api.caret.setToBlock(n), this.emit("toolbox-block-added", {
      block: a
    }), this.api.toolbar.close();
  }
};
on([
  ce
], Qi.prototype, "toolsToBeDisplayed");
on([
  ce
], Qi.prototype, "toolboxItemsToBeDisplayed");
let el = Qi;
const nn = "block hovered";
async function il(s, t) {
  const e = navigator.keyboard;
  if (!e)
    return t;
  try {
    return (await e.getLayoutMap()).get(s) || t;
  } catch (i) {
    return console.error(i), t;
  }
}
class ol extends N {
  /**
   * @class
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: t, eventsDispatcher: e }) {
    super({
      config: t,
      eventsDispatcher: e
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
    var t;
    return {
      opened: (t = this.toolboxInstance) == null ? void 0 : t.opened,
      close: () => {
        var e;
        (e = this.toolboxInstance) == null || e.close();
      },
      open: () => {
        if (this.toolboxInstance === null) {
          F("toolbox.open() called before initialization is finished", "warn");
          return;
        }
        this.Editor.BlockManager.currentBlock = this.hoveredBlock, this.toolboxInstance.open();
      },
      toggle: () => {
        if (this.toolboxInstance === null) {
          F("toolbox.toggle() called before initialization is finished", "warn");
          return;
        }
        this.toolboxInstance.toggle();
      },
      hasFocus: () => {
        var e;
        return (e = this.toolboxInstance) == null ? void 0 : e.hasFocus();
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
  toggleReadOnly(t) {
    t ? (this.destroy(), this.Editor.BlockSettings.destroy(), this.disableModuleBindings()) : window.requestIdleCallback(() => {
      this.drawUI(), this.enableModuleBindings();
    }, { timeout: 2e3 });
  }
  /**
   * Move Toolbar to the passed (or current) Block
   *
   * @param block - block to move Toolbar near it
   */
  moveAndOpen(t = this.Editor.BlockManager.currentBlock) {
    if (this.toolboxInstance === null) {
      F("Can't open Toolbar since Editor initialization is not finished yet", "warn");
      return;
    }
    if (this.toolboxInstance.opened && this.toolboxInstance.close(), this.Editor.BlockSettings.opened && this.Editor.BlockSettings.close(), !t)
      return;
    this.hoveredBlock = t;
    const e = t.holder, { isMobile: i } = this.Editor.UI;
    let o;
    const n = 20, r = t.firstInput, a = e.getBoundingClientRect(), l = r !== void 0 ? r.getBoundingClientRect() : null, c = l !== null ? l.top - a.top : null, d = c !== null ? c > n : void 0;
    if (i)
      o = e.offsetTop + e.offsetHeight;
    else if (r === void 0 || d) {
      const h = parseInt(window.getComputedStyle(t.pluginsContent).paddingTop);
      o = e.offsetTop + h;
    } else {
      const h = Fr(r), g = parseInt(window.getComputedStyle(this.nodes.plusButton).height, 10);
      o = e.offsetTop + h - g + 8 + c;
    }
    this.nodes.wrapper.style.top = `${Math.floor(o)}px`, this.Editor.BlockManager.blocks.length === 1 && t.isEmpty ? this.blockTunesToggler.hide() : this.blockTunesToggler.show(), this.open();
  }
  /**
   * Close the Toolbar
   */
  close() {
    var t, e;
    this.Editor.ReadOnly.isEnabled || ((t = this.nodes.wrapper) == null || t.classList.remove(this.CSS.toolbarOpened), this.blockActions.hide(), (e = this.toolboxInstance) == null || e.close(), this.Editor.BlockSettings.close(), this.reset());
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
  open(t = !0) {
    this.nodes.wrapper.classList.add(this.CSS.toolbarOpened), t ? this.blockActions.show() : this.blockActions.hide();
  }
  /**
   * Draws Toolbar elements
   */
  async make() {
    this.nodes.wrapper = m.make("div", this.CSS.toolbar), ["content", "actions"].forEach((n) => {
      this.nodes[n] = m.make("div", this.CSS[n]);
    }), m.append(this.nodes.wrapper, this.nodes.content), m.append(this.nodes.content, this.nodes.actions), this.nodes.plusButton = m.make("div", this.CSS.plusButton, {
      innerHTML: Pa
    }), m.append(this.nodes.actions, this.nodes.plusButton), this.readOnlyMutableListeners.on(this.nodes.plusButton, "click", () => {
      qe(!0), this.plusButtonClicked();
    }, !1);
    const t = m.make("div");
    t.appendChild(document.createTextNode(lt.ui(vt.ui.toolbar.toolbox, "Add"))), t.appendChild(m.make("div", this.CSS.plusButtonShortcut, {
      textContent: "/"
    })), Ye(this.nodes.plusButton, t, {
      hidingDelay: 400
    }), this.nodes.settingsToggler = m.make("span", this.CSS.settingsToggler, {
      innerHTML: Ra
    }), m.append(this.nodes.actions, this.nodes.settingsToggler);
    const e = m.make("div"), i = m.text(lt.ui(vt.ui.blockTunes.toggler, "Click to tune")), o = await il("Slash", "/");
    e.appendChild(i), e.appendChild(m.make("div", this.CSS.plusButtonShortcut, {
      textContent: Yi(`CMD + ${o}`)
    })), Ye(this.nodes.settingsToggler, e, {
      hidingDelay: 400
    }), m.append(this.nodes.actions, this.makeToolbox()), m.append(this.nodes.actions, this.Editor.BlockSettings.getElement()), m.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }
  /**
   * Creates the Toolbox instance and return it's rendered element
   */
  makeToolbox() {
    return this.toolboxInstance = new el({
      api: this.Editor.API.methods,
      tools: this.Editor.Tools.blockTools,
      i18nLabels: {
        filter: lt.ui(vt.ui.popover, "Filter"),
        nothingFound: lt.ui(vt.ui.popover, "Nothing found")
      }
    }), this.toolboxInstance.on(Ne.Opened, () => {
      this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolboxHolderModifier);
    }), this.toolboxInstance.on(Ne.Closed, () => {
      this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolboxHolderModifier);
    }), this.toolboxInstance.on(Ne.BlockAdded, ({ block: t }) => {
      const { BlockManager: e, Caret: i } = this.Editor, o = e.getBlockById(t.id);
      o.inputs.length === 0 && (o === e.lastBlock ? (e.insertAtEnd(), i.setToBlock(e.lastBlock)) : i.setToBlock(e.nextBlock));
    }), this.toolboxInstance.getElement();
  }
  /**
   * Handler for Plus Button
   */
  plusButtonClicked() {
    var t;
    this.Editor.BlockManager.currentBlock = this.hoveredBlock, (t = this.toolboxInstance) == null || t.toggle();
  }
  /**
   * Enable bindings
   */
  enableModuleBindings() {
    this.readOnlyMutableListeners.on(this.nodes.settingsToggler, "mousedown", (t) => {
      var e;
      t.stopPropagation(), this.settingsTogglerClicked(), (e = this.toolboxInstance) != null && e.opened && this.toolboxInstance.close(), qe(!0);
    }, !0), de() || this.eventsDispatcher.on(nn, (t) => {
      var e;
      this.Editor.BlockSettings.opened || (e = this.toolboxInstance) != null && e.opened || this.moveAndOpen(t.block);
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
var Yt = /* @__PURE__ */ ((s) => (s[s.Block = 0] = "Block", s[s.Inline = 1] = "Inline", s[s.Tune = 2] = "Tune", s))(Yt || {}), De = /* @__PURE__ */ ((s) => (s.Shortcut = "shortcut", s.Toolbox = "toolbox", s.EnabledInlineTools = "inlineToolbar", s.EnabledBlockTunes = "tunes", s.Config = "config", s))(De || {}), rn = /* @__PURE__ */ ((s) => (s.Shortcut = "shortcut", s.SanitizeConfig = "sanitize", s))(rn || {}), te = /* @__PURE__ */ ((s) => (s.IsEnabledLineBreaks = "enableLineBreaks", s.Toolbox = "toolbox", s.ConversionConfig = "conversionConfig", s.IsReadOnlySupported = "isReadOnlySupported", s.PasteConfig = "pasteConfig", s))(te || {}), to = /* @__PURE__ */ ((s) => (s.IsInline = "isInline", s.Title = "title", s))(to || {}), Mi = /* @__PURE__ */ ((s) => (s.IsTune = "isTune", s))(Mi || {});
let eo = class {
  /**
   * @class
   * @param {ConstructorOptions} options - Constructor options
   */
  constructor({
    name: t,
    constructable: e,
    config: i,
    api: o,
    isDefault: n,
    isInternal: r = !1,
    defaultPlaceholder: a
  }) {
    this.api = o, this.name = t, this.constructable = e, this.config = i, this.isDefault = n, this.isInternal = r, this.defaultPlaceholder = a;
  }
  /**
   * Returns Tool user configuration
   */
  get settings() {
    const t = this.config.config || {};
    return this.isDefault && !("placeholder" in t) && this.defaultPlaceholder && (t.placeholder = this.defaultPlaceholder), t;
  }
  /**
   * Calls Tool's reset method
   */
  reset() {
    if (K(this.constructable.reset))
      return this.constructable.reset();
  }
  /**
   * Calls Tool's prepare method
   */
  prepare() {
    if (K(this.constructable.prepare))
      return this.constructable.prepare({
        toolName: this.name,
        config: this.settings
      });
  }
  /**
   * Returns shortcut for Tool (internal or specified by user)
   */
  get shortcut() {
    const t = this.constructable.shortcut;
    return this.config.shortcut || t;
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
    return this.type === Yt.Inline;
  }
  /**
   * Returns true if Tools is block
   */
  isBlock() {
    return this.type === Yt.Block;
  }
  /**
   * Returns true if Tools is tune
   */
  isTune() {
    return this.type === Yt.Tune;
  }
};
class sl extends N {
  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: t, eventsDispatcher: e }) {
    super({
      config: t,
      eventsDispatcher: e
    }), this.CSS = {
      inlineToolbar: "ce-inline-toolbar"
    }, this.opened = !1, this.popover = null, this.toolbarVerticalMargin = de() ? 20 : 6, this.toolsInstances = /* @__PURE__ */ new Map();
  }
  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  toggleReadOnly(t) {
    t ? this.destroy() : window.requestIdleCallback(() => {
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
  async tryToShow(t = !1) {
    t && this.close(), this.allowedToShow() && (await this.open(), this.Editor.Toolbar.close());
  }
  /**
   * Hides Inline Toolbar
   */
  close() {
    var t, e;
    this.opened && (this.Editor.ReadOnly.isEnabled || (Array.from(this.toolsInstances.entries()).forEach(([i, o]) => {
      const n = this.getToolShortcut(i);
      n && ae.remove(this.Editor.UI.nodes.redactor, n), K(o.clear) && o.clear();
    }), this.toolsInstances = null, this.reset(), this.opened = !1, (t = this.popover) == null || t.hide(), (e = this.popover) == null || e.destroy(), this.popover = null));
  }
  /**
   * Check if node is contained by Inline Toolbar
   *
   * @param {Node} node — node to check
   */
  containsNode(t) {
    return this.nodes.wrapper === void 0 ? !1 : this.nodes.wrapper.contains(t);
  }
  /**
   * Removes UI and its components
   */
  destroy() {
    var t;
    this.removeAllNodes(), (t = this.popover) == null || t.destroy(), this.popover = null;
  }
  /**
   * Making DOM
   */
  make() {
    this.nodes.wrapper = m.make("div", [
      this.CSS.inlineToolbar,
      ...this.isRtl ? [this.Editor.UI.CSS.editorRtlFix] : []
    ]), m.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }
  /**
   * Shows Inline Toolbar
   */
  async open() {
    var t;
    if (this.opened)
      return;
    this.opened = !0, this.popover !== null && this.popover.destroy();
    const e = await this.getInlineTools();
    this.popover = new Wa({
      items: e,
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: lt.ui(vt.ui.popover, "Nothing found"),
        search: lt.ui(vt.ui.popover, "Filter")
      }
    }), this.move(this.popover.size.width), (t = this.nodes.wrapper) == null || t.append(this.popover.getElement()), this.popover.show();
  }
  /**
   * Move Toolbar to the selected text
   *
   * @param popoverWidth - width of the toolbar popover
   */
  move(t) {
    const e = C.rect, i = this.Editor.UI.nodes.wrapper.getBoundingClientRect(), o = {
      x: e.x - i.x,
      y: e.y + e.height - // + window.scrollY
      i.top + this.toolbarVerticalMargin
    };
    o.x + t + i.x > this.Editor.UI.contentRect.right && (o.x = this.Editor.UI.contentRect.right - t - i.x), this.nodes.wrapper.style.left = Math.floor(o.x) + "px", this.nodes.wrapper.style.top = Math.floor(o.y) + "px";
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
    const t = ["IMG", "INPUT"], e = C.get(), i = C.text;
    if (!e || !e.anchorNode || e.isCollapsed || i.length < 1)
      return !1;
    const o = m.isElement(e.anchorNode) ? e.anchorNode : e.anchorNode.parentElement;
    if (o === null || e && t.includes(o.tagName) || o.closest('[contenteditable="true"]') === null)
      return !1;
    const n = this.Editor.BlockManager.getBlock(e.anchorNode);
    return n ? n.tool.inlineTools.size !== 0 : !1;
  }
  /**
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  /**
   * Returns Inline Tools segregated by their appearance type: popover items and custom html elements.
   * Sets this.toolsInstances map
   */
  async getInlineTools() {
    const t = C.get(), e = this.Editor.BlockManager.getBlock(t.anchorNode), i = Array.from(e.tool.inlineTools.values()), o = [];
    this.toolsInstances === null && (this.toolsInstances = /* @__PURE__ */ new Map());
    for (let n = 0; n < i.length; n++) {
      const r = i[n], a = r.create(), l = await a.render();
      this.toolsInstances.set(r.name, a);
      const c = this.getToolShortcut(r.name);
      if (c)
        try {
          this.enableShortcuts(r.name, c);
        } catch {
        }
      const d = c !== void 0 ? Yi(c) : void 0, h = lt.t(
        vt.toolNames,
        r.title || Ue(r.name)
      );
      [l].flat().forEach((g) => {
        var v, f;
        const w = {
          name: r.name,
          onActivate: () => {
            this.toolClicked(a);
          },
          hint: {
            title: h,
            description: d
          }
        };
        if (m.isElement(g)) {
          const _ = {
            ...w,
            element: g,
            type: W.Html
          };
          if (K(a.renderActions)) {
            const L = a.renderActions();
            _.children = {
              isOpen: (v = a.checkState) == null ? void 0 : v.call(a, C.get()),
              /** Disable keyboard navigation in actions, as it might conflict with enter press handling */
              isFlippable: !1,
              items: [
                {
                  type: W.Html,
                  element: L
                }
              ]
            };
          } else
            (f = a.checkState) == null || f.call(a, C.get());
          o.push(_);
        } else if (g.type === W.Html)
          o.push({
            ...w,
            ...g,
            type: W.Html
          });
        else if (g.type === W.Separator)
          o.push({
            type: W.Separator
          });
        else {
          const _ = {
            ...w,
            ...g,
            type: W.Default
          };
          "children" in _ && n !== 0 && o.push({
            type: W.Separator
          }), o.push(_), "children" in _ && n < i.length - 1 && o.push({
            type: W.Separator
          });
        }
      });
    }
    return o;
  }
  /**
   * Get shortcut name for tool
   *
   * @param toolName — Tool name
   */
  getToolShortcut(t) {
    const { Tools: e } = this.Editor, i = e.inlineTools.get(t), o = e.internal.inlineTools;
    return Array.from(o.keys()).includes(t) ? this.inlineTools[t][rn.Shortcut] : i == null ? void 0 : i.shortcut;
  }
  /**
   * Enable Tool shortcut with Editor Shortcuts Module
   *
   * @param toolName - tool name
   * @param shortcut - shortcut according to the ShortcutData Module format
   */
  enableShortcuts(t, e) {
    ae.add({
      name: e,
      handler: (i) => {
        var o;
        const { currentBlock: n } = this.Editor.BlockManager;
        n && n.tool.enabledInlineTools && (i.preventDefault(), (o = this.popover) == null || o.activateItemByName(t));
      },
      on: this.Editor.UI.nodes.redactor
    });
  }
  /**
   * Inline Tool button clicks
   *
   * @param tool - Tool's instance
   */
  toolClicked(t) {
    var e;
    const i = C.range;
    (e = t.surround) == null || e.call(t, i), this.checkToolsState();
  }
  /**
   * Check Tools` state by selection
   */
  checkToolsState() {
    var t;
    (t = this.toolsInstances) == null || t.forEach((e) => {
      var i;
      (i = e.checkState) == null || i.call(e, C.get());
    });
  }
  /**
   * Get inline tools tools
   * Tools that has isInline is true
   */
  get inlineTools() {
    const t = {};
    return Array.from(this.Editor.Tools.inlineTools.entries()).forEach(([e, i]) => {
      t[e] = i.create();
    }), t;
  }
}
function an() {
  const s = window.getSelection();
  if (s === null)
    return [null, 0];
  let t = s.focusNode, e = s.focusOffset;
  return t === null ? [null, 0] : (t.nodeType !== Node.TEXT_NODE && t.childNodes.length > 0 && (t.childNodes[e] ? (t = t.childNodes[e], e = 0) : (t = t.childNodes[e - 1], e = t.textContent.length)), [t, e]);
}
function ln(s, t, e, i) {
  const o = document.createRange();
  i === "left" ? (o.setStart(s, 0), o.setEnd(t, e)) : (o.setStart(t, e), o.setEnd(s, s.childNodes.length));
  const n = o.cloneContents(), r = document.createElement("div");
  r.appendChild(n);
  const a = r.textContent || "";
  return Hr(a);
}
function Ve(s) {
  const t = m.getDeepestNode(s);
  if (t === null || m.isEmpty(s))
    return !0;
  if (m.isNativeInput(t))
    return t.selectionEnd === 0;
  if (m.isEmpty(s))
    return !0;
  const [e, i] = an();
  return e === null ? !1 : ln(s, e, i, "left");
}
function He(s) {
  const t = m.getDeepestNode(s, !0);
  if (t === null)
    return !0;
  if (m.isNativeInput(t))
    return t.selectionEnd === t.value.length;
  const [e, i] = an();
  return e === null ? !1 : ln(s, e, i, "right");
}
class nl extends N {
  /**
   * All keydowns on Block
   *
   * @param {KeyboardEvent} event - keydown
   */
  keydown(t) {
    switch (this.beforeKeydownProcessing(t), t.keyCode) {
      case S.BACKSPACE:
        this.backspace(t);
        break;
      case S.DELETE:
        this.delete(t);
        break;
      case S.ENTER:
        this.enter(t);
        break;
      case S.DOWN:
      case S.RIGHT:
        this.arrowRightAndDown(t);
        break;
      case S.UP:
      case S.LEFT:
        this.arrowLeftAndUp(t);
        break;
      case S.TAB:
        this.tabPressed(t);
        break;
    }
    t.key === "/" && !t.ctrlKey && !t.metaKey && this.slashPressed(t), t.code === "Slash" && (t.ctrlKey || t.metaKey) && (t.preventDefault(), this.commandSlashPressed());
  }
  /**
   * Fires on keydown before event processing
   *
   * @param {KeyboardEvent} event - keydown
   */
  beforeKeydownProcessing(t) {
    this.needToolbarClosing(t) && Is(t.keyCode) && (this.Editor.Toolbar.close(), t.ctrlKey || t.metaKey || t.altKey || t.shiftKey || this.Editor.BlockSelection.clearSelection(t));
  }
  /**
   * Key up on Block:
   * - shows Inline Toolbar if something selected
   * - shows conversion toolbar with 85% of block selection
   *
   * @param {KeyboardEvent} event - keyup event
   */
  keyup(t) {
    t.shiftKey || this.Editor.UI.checkEmptiness();
  }
  /**
   * Add drop target styles
   *
   * @param {DragEvent} event - drag over event
   */
  dragOver(t) {
    const e = this.Editor.BlockManager.getBlockByChildNode(t.target);
    e.dropTarget = !0;
  }
  /**
   * Remove drop target style
   *
   * @param {DragEvent} event - drag leave event
   */
  dragLeave(t) {
    const e = this.Editor.BlockManager.getBlockByChildNode(t.target);
    e.dropTarget = !1;
  }
  /**
   * Copying selected blocks
   * Before putting to the clipboard we sanitize all blocks and then copy to the clipboard
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  handleCommandC(t) {
    const { BlockSelection: e } = this.Editor;
    e.anyBlockSelected && e.copySelectedBlocks(t);
  }
  /**
   * Copy and Delete selected Blocks
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  handleCommandX(t) {
    const { BlockSelection: e, BlockManager: i, Caret: o } = this.Editor;
    e.anyBlockSelected && e.copySelectedBlocks(t).then(() => {
      const n = i.removeSelectedBlocks(), r = i.insertDefaultBlockAtIndex(n, !0);
      o.setToBlock(r, o.positions.START), e.clearSelection(t);
    });
  }
  /**
   * Tab pressed inside a Block.
   *
   * @param {KeyboardEvent} event - keydown
   */
  tabPressed(t) {
    const { InlineToolbar: e, Caret: i } = this.Editor;
    e.opened || (t.shiftKey ? i.navigatePrevious(!0) : i.navigateNext(!0)) && t.preventDefault();
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
  slashPressed(t) {
    this.Editor.BlockManager.currentBlock.isEmpty && (t.preventDefault(), this.Editor.Caret.insertContentAtCaretPosition("/"), this.activateToolbox());
  }
  /**
   * ENTER pressed on block
   *
   * @param {KeyboardEvent} event - keydown
   */
  enter(t) {
    const { BlockManager: e, UI: i } = this.Editor, o = e.currentBlock;
    if (o === void 0 || o.tool.isLineBreaksEnabled || i.someToolbarOpened && i.someFlipperButtonFocused || t.shiftKey && !Si)
      return;
    let n = o;
    o.currentInput !== void 0 && Ve(o.currentInput) && !o.hasMedia ? this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex) : o.currentInput && He(o.currentInput) ? n = this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex + 1) : n = this.Editor.BlockManager.split(), this.Editor.Caret.setToBlock(n), this.Editor.Toolbar.moveAndOpen(n), t.preventDefault();
  }
  /**
   * Handle backspace keydown on Block
   *
   * @param {KeyboardEvent} event - keydown
   */
  backspace(t) {
    const { BlockManager: e, Caret: i } = this.Editor, { currentBlock: o, previousBlock: n } = e;
    if (!(o === void 0 || !C.isCollapsed || !o.currentInput || !Ve(o.currentInput))) {
      if (t.preventDefault(), this.Editor.Toolbar.close(), o.currentInput !== o.firstInput) {
        i.navigatePrevious();
        return;
      }
      if (n !== null) {
        if (n.isEmpty) {
          e.removeBlock(n);
          return;
        }
        if (o.isEmpty) {
          e.removeBlock(o);
          const r = e.currentBlock;
          i.setToBlock(r, i.positions.END);
          return;
        }
        Fo(n, o) ? this.mergeBlocks(n, o) : i.setToBlock(n, i.positions.END);
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
  delete(t) {
    const { BlockManager: e, Caret: i } = this.Editor, { currentBlock: o, nextBlock: n } = e;
    if (!(!C.isCollapsed || !He(o.currentInput))) {
      if (t.preventDefault(), this.Editor.Toolbar.close(), o.currentInput !== o.lastInput) {
        i.navigateNext();
        return;
      }
      if (n !== null) {
        if (n.isEmpty) {
          e.removeBlock(n);
          return;
        }
        if (o.isEmpty) {
          e.removeBlock(o), i.setToBlock(n, i.positions.START);
          return;
        }
        Fo(o, n) ? this.mergeBlocks(o, n) : i.setToBlock(n, i.positions.START);
      }
    }
  }
  /**
   * Merge passed Blocks
   *
   * @param targetBlock - to which Block we want to merge
   * @param blockToMerge - what Block we want to merge
   */
  mergeBlocks(t, e) {
    const { BlockManager: i, Caret: o, Toolbar: n } = this.Editor;
    o.createShadow(t.lastInput), i.mergeBlocks(t, e).then(() => {
      o.restoreCaret(t.pluginsContent), n.close();
    });
  }
  /**
   * Handle right and down keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  arrowRightAndDown(t) {
    const e = Ke.usedKeys.includes(t.keyCode) && (!t.shiftKey || t.keyCode === S.TAB);
    if (this.Editor.UI.someToolbarOpened && e)
      return;
    this.Editor.Toolbar.close();
    const { currentBlock: i } = this.Editor.BlockManager, o = ((i == null ? void 0 : i.currentInput) !== void 0 ? He(i.currentInput) : void 0) || this.Editor.BlockSelection.anyBlockSelected;
    if (t.shiftKey && t.keyCode === S.DOWN && o) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState();
      return;
    }
    if (t.keyCode === S.DOWN || t.keyCode === S.RIGHT && !this.isRtl ? this.Editor.Caret.navigateNext() : this.Editor.Caret.navigatePrevious()) {
      t.preventDefault();
      return;
    }
    je(() => {
      this.Editor.BlockManager.currentBlock && this.Editor.BlockManager.currentBlock.updateCurrentInput();
    }, 20)(), this.Editor.BlockSelection.clearSelection(t);
  }
  /**
   * Handle left and up keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  arrowLeftAndUp(t) {
    if (this.Editor.UI.someToolbarOpened) {
      if (Ke.usedKeys.includes(t.keyCode) && (!t.shiftKey || t.keyCode === S.TAB))
        return;
      this.Editor.UI.closeAllToolbars();
    }
    this.Editor.Toolbar.close();
    const { currentBlock: e } = this.Editor.BlockManager, i = ((e == null ? void 0 : e.currentInput) !== void 0 ? Ve(e.currentInput) : void 0) || this.Editor.BlockSelection.anyBlockSelected;
    if (t.shiftKey && t.keyCode === S.UP && i) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState(!1);
      return;
    }
    if (t.keyCode === S.UP || t.keyCode === S.LEFT && !this.isRtl ? this.Editor.Caret.navigatePrevious() : this.Editor.Caret.navigateNext()) {
      t.preventDefault();
      return;
    }
    je(() => {
      this.Editor.BlockManager.currentBlock && this.Editor.BlockManager.currentBlock.updateCurrentInput();
    }, 20)(), this.Editor.BlockSelection.clearSelection(t);
  }
  /**
   * Cases when we need to close Toolbar
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  needToolbarClosing(t) {
    const e = t.keyCode === S.ENTER && this.Editor.Toolbar.toolbox.opened, i = t.keyCode === S.ENTER && this.Editor.BlockSettings.opened, o = t.keyCode === S.ENTER && this.Editor.InlineToolbar.opened, n = t.keyCode === S.TAB;
    return !(t.shiftKey || n || e || i || o);
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
let bi = class {
  /**
   * @class
   * @param {HTMLElement} workingArea — editor`s working node
   */
  constructor(t) {
    this.blocks = [], this.workingArea = t;
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
    return Ls(this.workingArea.children);
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
  static set(t, e, i) {
    return isNaN(Number(e)) ? (Reflect.set(t, e, i), !0) : (t.insert(+e, i), !0);
  }
  /**
   * Proxy trap to implement array-like getter
   *
   * @param {Blocks} instance — Blocks instance
   * @param {PropertyKey} property — Blocks class property key
   * @returns {Block|*}
   */
  static get(t, e) {
    return isNaN(Number(e)) ? Reflect.get(t, e) : t.get(+e);
  }
  /**
   * Push new Block to the blocks array and append it to working area
   *
   * @param {Block} block - Block to add
   */
  push(t) {
    this.blocks.push(t), this.insertToDOM(t);
  }
  /**
   * Swaps blocks with indexes first and second
   *
   * @param {number} first - first block index
   * @param {number} second - second block index
   * @deprecated — use 'move' instead
   */
  swap(t, e) {
    const i = this.blocks[e];
    m.swap(this.blocks[t].holder, i.holder), this.blocks[e] = this.blocks[t], this.blocks[t] = i;
  }
  /**
   * Move a block from one to another index
   *
   * @param {number} toIndex - new index of the block
   * @param {number} fromIndex - block to move
   */
  move(t, e) {
    const i = this.blocks.splice(e, 1)[0], o = t - 1, n = Math.max(0, o), r = this.blocks[n];
    t > 0 ? this.insertToDOM(i, "afterend", r) : this.insertToDOM(i, "beforebegin", r), this.blocks.splice(t, 0, i);
    const a = this.composeBlockEvent("move", {
      fromIndex: e,
      toIndex: t
    });
    i.call(Rt.MOVED, a);
  }
  /**
   * Insert new Block at passed index
   *
   * @param {number} index — index to insert Block
   * @param {Block} block — Block to insert
   * @param {boolean} replace — it true, replace block on given index
   */
  insert(t, e, i = !1) {
    if (!this.length) {
      this.push(e);
      return;
    }
    t > this.length && (t = this.length), i && (this.blocks[t].holder.remove(), this.blocks[t].call(Rt.REMOVED));
    const o = i ? 1 : 0;
    if (this.blocks.splice(t, o, e), t > 0) {
      const n = this.blocks[t - 1];
      this.insertToDOM(e, "afterend", n);
    } else {
      const n = this.blocks[t + 1];
      n ? this.insertToDOM(e, "beforebegin", n) : this.insertToDOM(e);
    }
  }
  /**
   * Replaces block under passed index with passed block
   *
   * @param index - index of existed block
   * @param block - new block
   */
  replace(t, e) {
    if (this.blocks[t] === void 0)
      throw Error("Incorrect index");
    this.blocks[t].holder.replaceWith(e.holder), this.blocks[t] = e;
  }
  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index to insert blocks at
   */
  insertMany(t, e) {
    const i = new DocumentFragment();
    for (const o of t)
      i.appendChild(o.holder);
    if (this.length > 0) {
      if (e > 0) {
        const o = Math.min(e - 1, this.length - 1);
        this.blocks[o].holder.after(i);
      } else
        e === 0 && this.workingArea.prepend(i);
      this.blocks.splice(e, 0, ...t);
    } else
      this.blocks.push(...t), this.workingArea.appendChild(i);
    t.forEach((o) => o.call(Rt.RENDERED));
  }
  /**
   * Remove block
   *
   * @param {number} index - index of Block to remove
   */
  remove(t) {
    isNaN(t) && (t = this.length - 1), this.blocks[t].holder.remove(), this.blocks[t].call(Rt.REMOVED), this.blocks.splice(t, 1);
  }
  /**
   * Remove all blocks
   */
  removeAll() {
    this.workingArea.innerHTML = "", this.blocks.forEach((t) => t.call(Rt.REMOVED)), this.blocks.length = 0;
  }
  /**
   * Insert Block after passed target
   *
   * @todo decide if this method is necessary
   * @param {Block} targetBlock — target after which Block should be inserted
   * @param {Block} newBlock — Block to insert
   */
  insertAfter(t, e) {
    const i = this.blocks.indexOf(t);
    this.insert(i + 1, e);
  }
  /**
   * Get Block by index
   *
   * @param {number} index — Block index
   * @returns {Block}
   */
  get(t) {
    return this.blocks[t];
  }
  /**
   * Return index of passed Block
   *
   * @param {Block} block - Block to find
   * @returns {number}
   */
  indexOf(t) {
    return this.blocks.indexOf(t);
  }
  /**
   * Insert new Block into DOM
   *
   * @param {Block} block - Block to insert
   * @param {InsertPosition} position — insert position (if set, will use insertAdjacentElement)
   * @param {Block} target — Block related to position
   */
  insertToDOM(t, e, i) {
    e ? i.holder.insertAdjacentElement(e, t.holder) : this.workingArea.appendChild(t.holder), t.call(Rt.RENDERED);
  }
  /**
   * Composes Block event with passed type and details
   *
   * @param {string} type - event type
   * @param {object} detail - event detail
   */
  composeBlockEvent(t, e) {
    return new CustomEvent(t, {
      detail: e
    });
  }
};
const Wo = "block-removed", qo = "block-added", rl = "block-moved", Yo = "block-changed";
class al {
  constructor() {
    this.completed = Promise.resolve();
  }
  /**
   * Add new promise to queue
   *
   * @param operation - promise should be added to queue
   */
  add(t) {
    return new Promise((e, i) => {
      this.completed = this.completed.then(t).then(e).catch(i);
    });
  }
}
class ll extends N {
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
  set currentBlockIndex(t) {
    this._currentBlockIndex = t;
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
  set currentBlock(t) {
    this.currentBlockIndex = this.getBlockIndex(t);
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
    return this.blocks.slice(this.currentBlockIndex + 1).find((t) => !!t.inputs.length);
  }
  /**
   * Return first Block with inputs before current Block
   *
   * @returns {Block | undefined}
   */
  get previousContentfulBlock() {
    return this.blocks.slice(0, this.currentBlockIndex).reverse().find((t) => !!t.inputs.length);
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
    return this.blocks.every((t) => t.isEmpty);
  }
  /**
   * Should be called after Editor.UI preparation
   * Define this._blocks property
   */
  prepare() {
    const t = new bi(this.Editor.UI.nodes.redactor);
    this._blocks = new Proxy(t, {
      set: bi.set,
      get: bi.get
    }), this.listeners.on(
      document,
      "copy",
      (e) => this.Editor.BlockEvents.handleCommandC(e)
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
  toggleReadOnly(t) {
    t ? this.disableModuleBindings() : this.enableModuleBindings();
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
    tool: t,
    data: e = {},
    id: i = void 0,
    tunes: o = {}
  }) {
    const n = this.Editor.ReadOnly.isEnabled, r = this.Editor.Tools.blockTools.get(t), a = new Q({
      id: i,
      data: e,
      tool: r,
      api: this.Editor.API,
      readOnly: n,
      tunesData: o
    }, this.eventsDispatcher);
    return n || window.requestIdleCallback(() => {
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
    id: t = void 0,
    tool: e = this.config.defaultBlock,
    data: i = {},
    index: o,
    needToFocus: n = !0,
    replace: r = !1,
    tunes: a = {}
  } = {}) {
    let l = o;
    l === void 0 && (l = this.currentBlockIndex + (r ? 0 : 1));
    const c = this.composeBlock({
      id: t,
      tool: e,
      data: i,
      tunes: a
    });
    return r && this.blockDidMutated(Wo, this.getBlockByIndex(l), {
      index: l
    }), this._blocks.insert(l, c, r), this.blockDidMutated(qo, c, {
      index: l
    }), n ? this.currentBlockIndex = l : l <= this.currentBlockIndex && this.currentBlockIndex++, c;
  }
  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index where to insert
   */
  insertMany(t, e = 0) {
    this._blocks.insertMany(t, e);
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
  async update(t, e, i) {
    if (!e && !i)
      return t;
    const o = await t.data, n = this.composeBlock({
      id: t.id,
      tool: t.name,
      data: Object.assign({}, o, e ?? {}),
      tunes: i ?? t.tunes
    }), r = this.getBlockIndex(t);
    return this._blocks.replace(r, n), this.blockDidMutated(Yo, n, {
      index: r
    }), n;
  }
  /**
   * Replace passed Block with the new one with specified Tool and data
   *
   * @param block - block to replace
   * @param newTool - new Tool name
   * @param data - new Tool data
   */
  replace(t, e, i) {
    const o = this.getBlockIndex(t);
    return this.insert({
      tool: e,
      data: i,
      index: o,
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
  paste(t, e, i = !1) {
    const o = this.insert({
      tool: t,
      replace: i
    });
    try {
      window.requestIdleCallback(() => {
        o.call(Rt.ON_PASTE, e);
      });
    } catch (n) {
      F(`${t}: onPaste callback call is failed`, "error", n);
    }
    return o;
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
  insertDefaultBlockAtIndex(t, e = !1) {
    const i = this.composeBlock({ tool: this.config.defaultBlock });
    return this._blocks[t] = i, this.blockDidMutated(qo, i, {
      index: t
    }), e ? this.currentBlockIndex = t : t <= this.currentBlockIndex && this.currentBlockIndex++, i;
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
  async mergeBlocks(t, e) {
    let i;
    if (t.name === e.name && t.mergeable) {
      const o = await e.data;
      if (kt(o)) {
        console.error("Could not merge Block. Failed to extract original Block data.");
        return;
      }
      const [n] = Ki([o], t.tool.sanitizeConfig);
      i = n;
    } else if (t.mergeable && We(e, "export") && We(t, "import")) {
      const o = await e.exportDataAsString(), n = Bt(o, t.tool.sanitizeConfig);
      i = $o(n, t.tool.conversionConfig);
    }
    i !== void 0 && (await t.mergeWith(i), this.removeBlock(e), this.currentBlockIndex = this._blocks.indexOf(t));
  }
  /**
   * Remove passed Block
   *
   * @param block - Block to remove
   * @param addLastBlock - if true, adds new default block at the end. @todo remove this logic and use event-bus instead
   */
  removeBlock(t, e = !0) {
    return new Promise((i) => {
      const o = this._blocks.indexOf(t);
      if (!this.validateIndex(o))
        throw new Error("Can't find a Block to remove");
      t.destroy(), this._blocks.remove(o), this.blockDidMutated(Wo, t, {
        index: o
      }), this.currentBlockIndex >= o && this.currentBlockIndex--, this.blocks.length ? o === 0 && (this.currentBlockIndex = 0) : (this.unsetCurrentBlock(), e && this.insert()), i();
    });
  }
  /**
   * Remove only selected Blocks
   * and returns first Block index where started removing...
   *
   * @returns {number|undefined}
   */
  removeSelectedBlocks() {
    let t;
    for (let e = this.blocks.length - 1; e >= 0; e--)
      this.blocks[e].selected && (this.removeBlock(this.blocks[e]), t = e);
    return t;
  }
  /**
   * Attention!
   * After removing insert the new default typed Block and focus on it
   * Removes all blocks
   */
  removeAllBlocks() {
    for (let t = this.blocks.length - 1; t >= 0; t--)
      this._blocks.remove(t);
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
    const t = this.Editor.Caret.extractFragmentFromCaretPosition(), e = m.make("div");
    e.appendChild(t);
    const i = {
      text: m.isEmpty(e) ? "" : e.innerHTML
    };
    return this.insert({ data: i });
  }
  /**
   * Returns Block by passed index
   *
   * @param {number} index - index to get. -1 to get last
   * @returns {Block}
   */
  getBlockByIndex(t) {
    return t === -1 && (t = this._blocks.length - 1), this._blocks[t];
  }
  /**
   * Returns an index for passed Block
   *
   * @param block - block to find index
   */
  getBlockIndex(t) {
    return this._blocks.indexOf(t);
  }
  /**
   * Returns the Block by passed id
   *
   * @param id - id of block to get
   * @returns {Block}
   */
  getBlockById(t) {
    return this._blocks.array.find((e) => e.id === t);
  }
  /**
   * Get Block instance by html element
   *
   * @param {Node} element - html element to get Block by
   */
  getBlock(t) {
    m.isElement(t) || (t = t.parentNode);
    const e = this._blocks.nodes, i = t.closest(`.${Q.CSS.wrapper}`), o = e.indexOf(i);
    if (o >= 0)
      return this._blocks[o];
  }
  /**
   * 1) Find first-level Block from passed child Node
   * 2) Mark it as current
   *
   * @param {Node} childNode - look ahead from this node.
   * @returns {Block | undefined} can return undefined in case when the passed child note is not a part of the current editor instance
   */
  setCurrentBlockByChildNode(t) {
    m.isElement(t) || (t = t.parentNode);
    const e = t.closest(`.${Q.CSS.wrapper}`);
    if (!e)
      return;
    const i = e.closest(`.${this.Editor.UI.CSS.editorWrapper}`);
    if (i != null && i.isEqualNode(this.Editor.UI.nodes.wrapper))
      return this.currentBlockIndex = this._blocks.nodes.indexOf(e), this.currentBlock.updateCurrentInput(), this.currentBlock;
  }
  /**
   * Return block which contents passed node
   *
   * @param {Node} childNode - node to get Block by
   * @returns {Block}
   */
  getBlockByChildNode(t) {
    if (!t || !(t instanceof Node))
      return;
    m.isElement(t) || (t = t.parentNode);
    const e = t.closest(`.${Q.CSS.wrapper}`);
    return this.blocks.find((i) => i.holder === e);
  }
  /**
   * Swap Blocks Position
   *
   * @param {number} fromIndex - index of first block
   * @param {number} toIndex - index of second block
   * @deprecated — use 'move' instead
   */
  swap(t, e) {
    this._blocks.swap(t, e), this.currentBlockIndex = e;
  }
  /**
   * Move a block to a new index
   *
   * @param {number} toIndex - index where to move Block
   * @param {number} fromIndex - index of Block to move
   */
  move(t, e = this.currentBlockIndex) {
    if (isNaN(t) || isNaN(e)) {
      F("Warning during 'move' call: incorrect indices provided.", "warn");
      return;
    }
    if (!this.validateIndex(t) || !this.validateIndex(e)) {
      F("Warning during 'move' call: indices cannot be lower than 0 or greater than the amount of blocks.", "warn");
      return;
    }
    this._blocks.move(t, e), this.currentBlockIndex = t, this.blockDidMutated(rl, this.currentBlock, {
      fromIndex: e,
      toIndex: t
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
  async convert(t, e, i) {
    if (!await t.save())
      throw new Error("Could not convert Block. Failed to extract original Block data.");
    const o = this.Editor.Tools.blockTools.get(e);
    if (!o)
      throw new Error(`Could not convert Block. Tool «${e}» not found.`);
    const n = await t.exportDataAsString(), r = Bt(
      n,
      o.sanitizeConfig
    );
    let a = $o(r, o.conversionConfig);
    return i && (a = Object.assign(a, i)), this.replace(t, o.name, a);
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
  async clear(t = !1) {
    const e = new al();
    this.blocks.forEach((i) => {
      e.add(async () => {
        await this.removeBlock(i, !1);
      });
    }), await e.completed, this.unsetCurrentBlock(), t && this.insert(), this.Editor.UI.checkEmptiness();
  }
  /**
   * Cleans up all the block tools' resources
   * This is called when editor is destroyed
   */
  async destroy() {
    await Promise.all(this.blocks.map((t) => t.destroy()));
  }
  /**
   * Bind Block events
   *
   * @param {Block} block - Block to which event should be bound
   */
  bindBlockEvents(t) {
    const { BlockEvents: e } = this.Editor;
    this.readOnlyMutableListeners.on(t.holder, "keydown", (i) => {
      e.keydown(i);
    }), this.readOnlyMutableListeners.on(t.holder, "keyup", (i) => {
      e.keyup(i);
    }), this.readOnlyMutableListeners.on(t.holder, "dragover", (i) => {
      e.dragOver(i);
    }), this.readOnlyMutableListeners.on(t.holder, "dragleave", (i) => {
      e.dragLeave(i);
    }), t.on("didMutated", (i) => this.blockDidMutated(Yo, i, {
      index: this.getBlockIndex(i)
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
      (t) => this.Editor.BlockEvents.handleCommandX(t)
    ), this.blocks.forEach((t) => {
      this.bindBlockEvents(t);
    });
  }
  /**
   * Validates that the given index is not lower than 0 or higher than the amount of blocks
   *
   * @param {number} index - index of blocks array to validate
   * @returns {boolean}
   */
  validateIndex(t) {
    return !(t < 0 || t >= this._blocks.length);
  }
  /**
   * Block mutation callback
   *
   * @param mutationType - what happened with block
   * @param block - mutated block
   * @param detailData - additional data to pass with change event
   */
  blockDidMutated(t, e, i) {
    const o = new CustomEvent(t, {
      detail: {
        target: new At(e),
        ...i
      }
    });
    return this.eventsDispatcher.emit(Ds, {
      event: o
    }), e;
  }
}
class cl extends N {
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
    const { BlockManager: t } = this.Editor;
    return t.blocks.every((e) => e.selected === !0);
  }
  /**
   * Set selected all blocks
   *
   * @param {boolean} state - state to set
   */
  set allBlocksSelected(t) {
    const { BlockManager: e } = this.Editor;
    e.blocks.forEach((i) => {
      i.selected = t;
    }), this.clearCache();
  }
  /**
   * Flag that identifies any Block selection
   *
   * @returns {boolean}
   */
  get anyBlockSelected() {
    const { BlockManager: t } = this.Editor;
    return this.anyBlockSelectedCache === null && (this.anyBlockSelectedCache = t.blocks.some((e) => e.selected === !0)), this.anyBlockSelectedCache;
  }
  /**
   * Return selected Blocks array
   *
   * @returns {Block[]}
   */
  get selectedBlocks() {
    return this.Editor.BlockManager.blocks.filter((t) => t.selected);
  }
  /**
   * Module Preparation
   * Registers Shortcuts CMD+A and CMD+C
   * to select all and copy them
   */
  prepare() {
    this.selection = new C(), ae.add({
      name: "CMD+A",
      handler: (t) => {
        const { BlockManager: e, ReadOnly: i } = this.Editor;
        if (i.isEnabled) {
          t.preventDefault(), this.selectAllBlocks();
          return;
        }
        e.currentBlock && this.handleCommandA(t);
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
    C.get().removeAllRanges(), this.allBlocksSelected = !1;
  }
  /**
   * Remove selection of Block
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  unSelectBlockByIndex(t) {
    const { BlockManager: e } = this.Editor;
    let i;
    isNaN(t) ? i = e.currentBlock : i = e.getBlockByIndex(t), i.selected = !1, this.clearCache();
  }
  /**
   * Clear selection from Blocks
   *
   * @param {Event} reason - event caused clear of selection
   * @param {boolean} restoreSelection - if true, restore saved selection
   */
  clearSelection(t, e = !1) {
    const { BlockManager: i, Caret: o, RectangleSelection: n } = this.Editor;
    this.needToSelectAll = !1, this.nativeInputSelected = !1, this.readyToBlockSelection = !1;
    const r = t && t instanceof KeyboardEvent, a = r && Is(t.keyCode);
    if (this.anyBlockSelected && r && a && !C.isSelectionExists) {
      const l = i.removeSelectedBlocks();
      i.insertDefaultBlockAtIndex(l, !0), o.setToBlock(i.currentBlock), je(() => {
        const c = t.key;
        o.insertContentAtCaretPosition(c.length > 1 ? "" : c);
      }, 20)();
    }
    if (this.Editor.CrossBlockSelection.clear(t), !this.anyBlockSelected || n.isRectActivated()) {
      this.Editor.RectangleSelection.clearSelection();
      return;
    }
    e && this.selection.restore(), this.allBlocksSelected = !1;
  }
  /**
   * Reduce each Block and copy its content
   *
   * @param {ClipboardEvent} e - copy/cut event
   * @returns {Promise<void>}
   */
  copySelectedBlocks(t) {
    t.preventDefault();
    const e = m.make("div");
    this.selectedBlocks.forEach((n) => {
      const r = Bt(n.holder.innerHTML, this.sanitizerConfig), a = m.make("p");
      a.innerHTML = r, e.appendChild(a);
    });
    const i = Array.from(e.childNodes).map((n) => n.textContent).join(`

`), o = e.innerHTML;
    return t.clipboardData.setData("text/plain", i), t.clipboardData.setData("text/html", o), Promise.all(this.selectedBlocks.map((n) => n.save())).then((n) => {
      try {
        t.clipboardData.setData(this.Editor.Paste.MIME_TYPE, JSON.stringify(n));
      } catch {
      }
    });
  }
  /**
   * Select Block by its index
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  selectBlockByIndex(t) {
    const { BlockManager: e } = this.Editor, i = e.getBlockByIndex(t);
    i !== void 0 && this.selectBlock(i);
  }
  /**
   * Select passed Block
   *
   * @param {Block} block - Block to select
   */
  selectBlock(t) {
    this.selection.save(), C.get().removeAllRanges(), t.selected = !0, this.clearCache(), this.Editor.InlineToolbar.close();
  }
  /**
   * Remove selection from passed Block
   *
   * @param {Block} block - Block to unselect
   */
  unselectBlock(t) {
    t.selected = !1, this.clearCache();
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
    ae.remove(this.Editor.UI.nodes.redactor, "CMD+A");
  }
  /**
   * First CMD+A selects all input content by native behaviour,
   * next CMD+A keypress selects all blocks
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  handleCommandA(t) {
    if (this.Editor.RectangleSelection.clearSelection(), m.isNativeInput(t.target) && !this.readyToBlockSelection) {
      this.readyToBlockSelection = !0;
      return;
    }
    const e = this.Editor.BlockManager.getBlock(t.target), i = e.inputs;
    if (i.length > 1 && !this.readyToBlockSelection) {
      this.readyToBlockSelection = !0;
      return;
    }
    if (i.length === 1 && !this.needToSelectAll) {
      this.needToSelectAll = !0;
      return;
    }
    this.needToSelectAll ? (t.preventDefault(), this.selectAllBlocks(), this.needToSelectAll = !1, this.readyToBlockSelection = !1) : this.readyToBlockSelection && (t.preventDefault(), this.selectBlock(e), this.needToSelectAll = !0);
  }
  /**
   * Select All Blocks
   * Each Block has selected setter that makes Block copyable
   */
  selectAllBlocks() {
    this.selection.save(), C.get().removeAllRanges(), this.allBlocksSelected = !0, this.Editor.InlineToolbar.close();
  }
}
let dl = class Ai extends N {
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
  setToBlock(t, e = this.positions.DEFAULT, i = 0) {
    var o;
    const { BlockManager: n, BlockSelection: r } = this.Editor;
    if (r.clearSelection(), !t.focusable) {
      (o = window.getSelection()) == null || o.removeAllRanges(), r.selectBlock(t), n.currentBlock = t;
      return;
    }
    let a;
    switch (e) {
      case this.positions.START:
        a = t.firstInput;
        break;
      case this.positions.END:
        a = t.lastInput;
        break;
      default:
        a = t.currentInput;
    }
    if (!a)
      return;
    const l = m.getDeepestNode(a, e === this.positions.END), c = m.getContentLength(l);
    switch (!0) {
      case e === this.positions.START:
        i = 0;
        break;
      case e === this.positions.END:
      case i > c:
        i = c;
        break;
    }
    this.set(l, i), n.setCurrentBlockByChildNode(t.holder), n.currentBlock.currentInput = a;
  }
  /**
   * Set caret to the current input of current Block.
   *
   * @param {HTMLElement} input - input where caret should be set
   * @param {string} position - position of the caret.
   *                            If default - leave default behaviour and apply offset if it's passed
   * @param {number} offset - caret offset regarding to the text node
   */
  setToInput(t, e = this.positions.DEFAULT, i = 0) {
    const { currentBlock: o } = this.Editor.BlockManager, n = m.getDeepestNode(t);
    switch (e) {
      case this.positions.START:
        this.set(n, 0);
        break;
      case this.positions.END:
        this.set(n, m.getContentLength(n));
        break;
      default:
        i && this.set(n, i);
    }
    o.currentInput = t;
  }
  /**
   * Creates Document Range and sets caret to the element with offset
   *
   * @param {HTMLElement} element - target node.
   * @param {number} offset - offset
   */
  set(t, e = 0) {
    const { top: i, bottom: o } = C.setCursor(t, e), { innerHeight: n } = window;
    i < 0 ? window.scrollBy(0, i - 30) : o > n && window.scrollBy(0, o - n + 30);
  }
  /**
   * Set Caret to the last Block
   * If last block is not empty, append another empty block
   */
  setToTheLastBlock() {
    const t = this.Editor.BlockManager.lastBlock;
    if (t)
      if (t.tool.isDefault && t.isEmpty)
        this.setToBlock(t);
      else {
        const e = this.Editor.BlockManager.insertAtEnd();
        this.setToBlock(e);
      }
  }
  /**
   * Extract content fragment of current Block from Caret position to the end of the Block
   */
  extractFragmentFromCaretPosition() {
    const t = C.get();
    if (t.rangeCount) {
      const e = t.getRangeAt(0), i = this.Editor.BlockManager.currentBlock.currentInput;
      if (e.deleteContents(), i)
        if (m.isNativeInput(i)) {
          const o = i, n = document.createDocumentFragment(), r = o.value.substring(0, o.selectionStart), a = o.value.substring(o.selectionStart);
          return n.textContent = a, o.value = r, n;
        } else {
          const o = e.cloneRange();
          return o.selectNodeContents(i), o.setStart(e.endContainer, e.endOffset), o.extractContents();
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
  navigateNext(t = !1) {
    const { BlockManager: e } = this.Editor, { currentBlock: i, nextBlock: o } = e;
    if (i === void 0)
      return !1;
    const { nextInput: n, currentInput: r } = i, a = r !== void 0 ? He(r) : void 0;
    let l = o;
    const c = t || a || !i.focusable;
    if (n && c)
      return this.setToInput(n, this.positions.START), !0;
    if (l === null) {
      if (i.tool.isDefault || !c)
        return !1;
      l = e.insertAtEnd();
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
  navigatePrevious(t = !1) {
    const { currentBlock: e, previousBlock: i } = this.Editor.BlockManager;
    if (!e)
      return !1;
    const { previousInput: o, currentInput: n } = e, r = n !== void 0 ? Ve(n) : void 0, a = t || r || !e.focusable;
    return o && a ? (this.setToInput(o, this.positions.END), !0) : i !== null && a ? (this.setToBlock(i, this.positions.END), !0) : !1;
  }
  /**
   * Inserts shadow element after passed element where caret can be placed
   *
   * @param {Element} element - element after which shadow caret should be inserted
   */
  createShadow(t) {
    const e = document.createElement("span");
    e.classList.add(Ai.CSS.shadowCaret), t.insertAdjacentElement("beforeend", e);
  }
  /**
   * Restores caret position
   *
   * @param {HTMLElement} element - element where caret should be restored
   */
  restoreCaret(t) {
    const e = t.querySelector(`.${Ai.CSS.shadowCaret}`);
    if (!e)
      return;
    new C().expandToTag(e);
    const i = document.createRange();
    i.selectNode(e), i.extractContents();
  }
  /**
   * Inserts passed content at caret position
   *
   * @param {string} content - content to insert
   */
  insertContentAtCaretPosition(t) {
    const e = document.createDocumentFragment(), i = document.createElement("div"), o = C.get(), n = C.range;
    i.innerHTML = t, Array.from(i.childNodes).forEach((c) => e.appendChild(c)), e.childNodes.length === 0 && e.appendChild(new Text());
    const r = e.lastChild;
    n.deleteContents(), n.insertNode(e);
    const a = document.createRange(), l = r.nodeType === Node.TEXT_NODE ? r : r.firstChild;
    l !== null && l.textContent !== null && a.setStart(l, l.textContent.length), o.removeAllRanges(), o.addRange(a);
  }
};
class hl extends N {
  constructor() {
    super(...arguments), this.onMouseUp = () => {
      this.listeners.off(document, "mouseover", this.onMouseOver), this.listeners.off(document, "mouseup", this.onMouseUp);
    }, this.onMouseOver = (t) => {
      const { BlockManager: e, BlockSelection: i } = this.Editor;
      if (t.relatedTarget === null && t.target === null)
        return;
      const o = e.getBlockByChildNode(t.relatedTarget) || this.lastSelectedBlock, n = e.getBlockByChildNode(t.target);
      if (!(!o || !n) && n !== o) {
        if (o === this.firstSelectedBlock) {
          C.get().removeAllRanges(), o.selected = !0, n.selected = !0, i.clearCache();
          return;
        }
        if (n === this.firstSelectedBlock) {
          o.selected = !1, n.selected = !1, i.clearCache();
          return;
        }
        this.Editor.InlineToolbar.close(), this.toggleBlocksSelectedState(o, n), this.lastSelectedBlock = n;
      }
    };
  }
  /**
   * Module preparation
   *
   * @returns {Promise}
   */
  async prepare() {
    this.listeners.on(document, "mousedown", (t) => {
      this.enableCrossBlockSelection(t);
    });
  }
  /**
   * Sets up listeners
   *
   * @param {MouseEvent} event - mouse down event
   */
  watchSelection(t) {
    if (t.button !== Sr.LEFT)
      return;
    const { BlockManager: e } = this.Editor;
    this.firstSelectedBlock = e.getBlock(t.target), this.lastSelectedBlock = this.firstSelectedBlock, this.listeners.on(document, "mouseover", this.onMouseOver), this.listeners.on(document, "mouseup", this.onMouseUp);
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
  toggleBlockSelectedState(t = !0) {
    const { BlockManager: e, BlockSelection: i } = this.Editor;
    this.lastSelectedBlock || (this.lastSelectedBlock = this.firstSelectedBlock = e.currentBlock), this.firstSelectedBlock === this.lastSelectedBlock && (this.firstSelectedBlock.selected = !0, i.clearCache(), C.get().removeAllRanges());
    const o = e.blocks.indexOf(this.lastSelectedBlock) + (t ? 1 : -1), n = e.blocks[o];
    n && (this.lastSelectedBlock.selected !== n.selected ? (n.selected = !0, i.clearCache()) : (this.lastSelectedBlock.selected = !1, i.clearCache()), this.lastSelectedBlock = n, this.Editor.InlineToolbar.close(), n.holder.scrollIntoView({
      block: "nearest"
    }));
  }
  /**
   * Clear saved state
   *
   * @param {Event} reason - event caused clear of selection
   */
  clear(t) {
    const { BlockManager: e, BlockSelection: i, Caret: o } = this.Editor, n = e.blocks.indexOf(this.firstSelectedBlock), r = e.blocks.indexOf(this.lastSelectedBlock);
    if (i.anyBlockSelected && n > -1 && r > -1 && t && t instanceof KeyboardEvent)
      switch (t.keyCode) {
        case S.DOWN:
        case S.RIGHT:
          o.setToBlock(e.blocks[Math.max(n, r)], o.positions.END);
          break;
        case S.UP:
        case S.LEFT:
          o.setToBlock(e.blocks[Math.min(n, r)], o.positions.START);
          break;
        default:
          o.setToBlock(e.blocks[Math.max(n, r)], o.positions.END);
      }
    this.firstSelectedBlock = this.lastSelectedBlock = null;
  }
  /**
   * Enables Cross Block Selection
   *
   * @param {MouseEvent} event - mouse down event
   */
  enableCrossBlockSelection(t) {
    const { UI: e } = this.Editor;
    C.isCollapsed || this.Editor.BlockSelection.clearSelection(t), e.nodes.redactor.contains(t.target) ? this.watchSelection(t) : this.Editor.BlockSelection.clearSelection(t);
  }
  /**
   * Change blocks selection state between passed two blocks.
   *
   * @param {Block} firstBlock - first block in range
   * @param {Block} lastBlock - last block in range
   */
  toggleBlocksSelectedState(t, e) {
    const { BlockManager: i, BlockSelection: o } = this.Editor, n = i.blocks.indexOf(t), r = i.blocks.indexOf(e), a = t.selected !== e.selected;
    for (let l = Math.min(n, r); l <= Math.max(n, r); l++) {
      const c = i.blocks[l];
      c !== this.firstSelectedBlock && c !== (a ? t : e) && (i.blocks[l].selected = !i.blocks[l].selected, o.clearCache());
    }
  }
}
class ul extends N {
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
  toggleReadOnly(t) {
    t ? this.disableModuleBindings() : this.enableModuleBindings();
  }
  /**
   * Add drag events listeners to editor zone
   */
  enableModuleBindings() {
    const { UI: t } = this.Editor;
    this.readOnlyMutableListeners.on(t.nodes.holder, "drop", async (e) => {
      await this.processDrop(e);
    }, !0), this.readOnlyMutableListeners.on(t.nodes.holder, "dragstart", () => {
      this.processDragStart();
    }), this.readOnlyMutableListeners.on(t.nodes.holder, "dragover", (e) => {
      this.processDragOver(e);
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
  async processDrop(t) {
    const {
      BlockManager: e,
      Paste: i,
      Caret: o
    } = this.Editor;
    t.preventDefault(), e.blocks.forEach((r) => {
      r.dropTarget = !1;
    }), C.isAtEditor && !C.isCollapsed && this.isStartedAtEditor && document.execCommand("delete"), this.isStartedAtEditor = !1;
    const n = e.setCurrentBlockByChildNode(t.target);
    if (n)
      this.Editor.Caret.setToBlock(n, o.positions.END);
    else {
      const r = e.setCurrentBlockByChildNode(e.lastBlock.holder);
      this.Editor.Caret.setToBlock(r, o.positions.END);
    }
    await i.processDataTransfer(t.dataTransfer, !0);
  }
  /**
   * Handle drag start event
   */
  processDragStart() {
    C.isAtEditor && !C.isCollapsed && (this.isStartedAtEditor = !0), this.Editor.InlineToolbar.close();
  }
  /**
   * @param {DragEvent} dragEvent - drag event
   */
  processDragOver(t) {
    t.preventDefault();
  }
}
const pl = 180, gl = 400;
class fl extends N {
  /**
   * Prepare the module
   *
   * @param options - options used by the modification observer module
   * @param options.config - Editor configuration object
   * @param options.eventsDispatcher - common Editor event bus
   */
  constructor({ config: t, eventsDispatcher: e }) {
    super({
      config: t,
      eventsDispatcher: e
    }), this.disabled = !1, this.batchingTimeout = null, this.batchingOnChangeQueue = /* @__PURE__ */ new Map(), this.batchTime = gl, this.mutationObserver = new MutationObserver((i) => {
      this.redactorChanged(i);
    }), this.eventsDispatcher.on(Ds, (i) => {
      this.particularBlockChanged(i.event);
    }), this.eventsDispatcher.on(Vs, () => {
      this.disable();
    }), this.eventsDispatcher.on(Hs, () => {
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
  particularBlockChanged(t) {
    this.disabled || !K(this.config.onChange) || (this.batchingOnChangeQueue.set(`block:${t.detail.target.id}:event:${t.type}`, t), this.batchingTimeout && clearTimeout(this.batchingTimeout), this.batchingTimeout = setTimeout(() => {
      let e;
      this.batchingOnChangeQueue.size === 1 ? e = this.batchingOnChangeQueue.values().next().value : e = Array.from(this.batchingOnChangeQueue.values()), this.config.onChange && this.config.onChange(this.Editor.API.methods, e), this.batchingOnChangeQueue.clear();
    }, this.batchTime));
  }
  /**
   * Fired on every blocks wrapper dom change
   *
   * @param mutations - mutations happened
   */
  redactorChanged(t) {
    this.eventsDispatcher.emit(Bi, {
      mutations: t
    });
  }
}
const cn = class dn extends N {
  constructor() {
    super(...arguments), this.MIME_TYPE = "application/x-editor-js", this.toolsTags = {}, this.tagsByTool = {}, this.toolsPatterns = [], this.toolsFiles = {}, this.exceptionList = [], this.processTool = (t) => {
      try {
        const e = t.create({}, {}, !1);
        if (t.pasteConfig === !1) {
          this.exceptionList.push(t.name);
          return;
        }
        if (!K(e.onPaste))
          return;
        this.getTagsConfig(t), this.getFilesConfig(t), this.getPatternsConfig(t);
      } catch (e) {
        F(
          `Paste handling for «${t.name}» Tool hasn't been set up because of the error`,
          "warn",
          e
        );
      }
    }, this.handlePasteEvent = async (t) => {
      const { BlockManager: e, Toolbar: i } = this.Editor, o = e.setCurrentBlockByChildNode(t.target);
      !o || this.isNativeBehaviour(t.target) && !t.clipboardData.types.includes("Files") || o && this.exceptionList.includes(o.name) || (t.preventDefault(), this.processDataTransfer(t.clipboardData), i.close());
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
  toggleReadOnly(t) {
    t ? this.unsetCallback() : this.setCallback();
  }
  /**
   * Handle pasted or dropped data transfer object
   *
   * @param {DataTransfer} dataTransfer - pasted or dropped data transfer object
   * @param {boolean} isDragNDrop - true if data transfer comes from drag'n'drop events
   */
  async processDataTransfer(t, e = !1) {
    const { Tools: i } = this.Editor, o = t.types;
    if ((o.includes ? o.includes("Files") : o.contains("Files")) && !kt(this.toolsFiles)) {
      await this.processFiles(t.files);
      return;
    }
    const n = t.getData(this.MIME_TYPE), r = t.getData("text/plain");
    let a = t.getData("text/html");
    if (n)
      try {
        this.insertEditorJSData(JSON.parse(n));
        return;
      } catch {
      }
    e && r.trim() && a.trim() && (a = "<p>" + (a.trim() ? a : r) + "</p>");
    const l = Object.keys(this.toolsTags).reduce((h, g) => (h[g.toLowerCase()] = this.toolsTags[g].sanitizationConfig ?? {}, h), {}), c = Object.assign({}, l, i.getAllInlineToolsSanitizeConfig(), { br: {} }), d = Bt(a, c);
    !d.trim() || d.trim() === r || !m.isHTMLString(d) ? await this.processText(r) : await this.processText(d, !0);
  }
  /**
   * Process pasted text and divide them into Blocks
   *
   * @param {string} data - text to process. Can be HTML or plain.
   * @param {boolean} isHTML - if passed string is HTML, this parameter should be true
   */
  async processText(t, e = !1) {
    const { Caret: i, BlockManager: o } = this.Editor, n = e ? this.processHTML(t) : this.processPlain(t);
    if (!n.length)
      return;
    if (n.length === 1) {
      n[0].isBlock ? this.processSingleBlock(n.pop()) : this.processInlinePaste(n.pop());
      return;
    }
    const r = o.currentBlock && o.currentBlock.tool.isDefault && o.currentBlock.isEmpty;
    n.map(
      async (a, l) => this.insertBlock(a, l === 0 && r)
    ), o.currentBlock && i.setToBlock(o.currentBlock, i.positions.END);
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
    const t = this.Editor.Tools.blockTools;
    Array.from(t.values()).forEach(this.processTool);
  }
  /**
   * Get tags name list from either tag name or sanitization config.
   *
   * @param {string | object} tagOrSanitizeConfig - tag name or sanitize config object.
   * @returns {string[]} array of tags.
   */
  collectTagNames(t) {
    return Ot(t) ? [t] : et(t) ? Object.keys(t) : [];
  }
  /**
   * Get tags to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getTagsConfig(t) {
    if (t.pasteConfig === !1)
      return;
    const e = t.pasteConfig.tags || [], i = [];
    e.forEach((o) => {
      const n = this.collectTagNames(o);
      i.push(...n), n.forEach((r) => {
        if (Object.prototype.hasOwnProperty.call(this.toolsTags, r)) {
          F(
            `Paste handler for «${t.name}» Tool on «${r}» tag is skipped because it is already used by «${this.toolsTags[r].tool.name}» Tool.`,
            "warn"
          );
          return;
        }
        const a = et(o) ? o[r] : null;
        this.toolsTags[r.toUpperCase()] = {
          tool: t,
          sanitizationConfig: a
        };
      });
    }), this.tagsByTool[t.name] = i.map((o) => o.toUpperCase());
  }
  /**
   * Get files` types and extensions to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getFilesConfig(t) {
    if (t.pasteConfig === !1)
      return;
    const { files: e = {} } = t.pasteConfig;
    let { extensions: i, mimeTypes: o } = e;
    !i && !o || (i && !Array.isArray(i) && (F(`«extensions» property of the onDrop config for «${t.name}» Tool should be an array`), i = []), o && !Array.isArray(o) && (F(`«mimeTypes» property of the onDrop config for «${t.name}» Tool should be an array`), o = []), o && (o = o.filter((n) => Ar(n) ? !0 : (F(`MIME type value «${n}» for the «${t.name}» Tool is not a valid MIME type`, "warn"), !1))), this.toolsFiles[t.name] = {
      extensions: i || [],
      mimeTypes: o || []
    });
  }
  /**
   * Get RegExp patterns to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getPatternsConfig(t) {
    t.pasteConfig === !1 || !t.pasteConfig.patterns || kt(t.pasteConfig.patterns) || Object.entries(t.pasteConfig.patterns).forEach(([e, i]) => {
      i instanceof RegExp || F(
        `Pattern ${i} for «${t.name}» Tool is skipped because it should be a Regexp instance.`,
        "warn"
      ), this.toolsPatterns.push({
        key: e,
        pattern: i,
        tool: t
      });
    });
  }
  /**
   * Check if browser behavior suits better
   *
   * @param {EventTarget} element - element where content has been pasted
   * @returns {boolean}
   */
  isNativeBehaviour(t) {
    return m.isNativeInput(t);
  }
  /**
   * Get files from data transfer object and insert related Tools
   *
   * @param {FileList} items - pasted or dropped items
   */
  async processFiles(t) {
    const { BlockManager: e } = this.Editor;
    let i;
    i = await Promise.all(
      Array.from(t).map((n) => this.processFile(n))
    ), i = i.filter((n) => !!n);
    const o = e.currentBlock.tool.isDefault && e.currentBlock.isEmpty;
    i.forEach(
      (n, r) => {
        e.paste(n.type, n.event, r === 0 && o);
      }
    );
  }
  /**
   * Get information about file and find Tool to handle it
   *
   * @param {File} file - file to process
   */
  async processFile(t) {
    const e = Mr(t), i = Object.entries(this.toolsFiles).find(([n, { mimeTypes: r, extensions: a }]) => {
      const [l, c] = t.type.split("/"), d = a.find((g) => g.toLowerCase() === e.toLowerCase()), h = r.find((g) => {
        const [v, f] = g.split("/");
        return v === l && (f === c || f === "*");
      });
      return !!d || !!h;
    });
    if (!i)
      return;
    const [o] = i;
    return {
      event: this.composePasteEvent("file", {
        file: t
      }),
      type: o
    };
  }
  /**
   * Split HTML string to blocks and return it as array of Block data
   *
   * @param {string} innerHTML - html string to process
   * @returns {PasteData[]}
   */
  processHTML(t) {
    const { Tools: e } = this.Editor, i = m.make("DIV");
    return i.innerHTML = t, this.getNodes(i).map((o) => {
      let n, r = e.defaultTool, a = !1;
      switch (o.nodeType) {
        case Node.DOCUMENT_FRAGMENT_NODE:
          n = m.make("div"), n.appendChild(o);
          break;
        case Node.ELEMENT_NODE:
          n = o, a = !0, this.toolsTags[n.tagName] && (r = this.toolsTags[n.tagName].tool);
          break;
      }
      const { tags: l } = r.pasteConfig || { tags: [] }, c = l.reduce((g, v) => (this.collectTagNames(v).forEach((f) => {
        const w = et(v) ? v[f] : null;
        g[f.toLowerCase()] = w || {};
      }), g), {}), d = Object.assign({}, c, r.baseSanitizeConfig);
      if (n.tagName.toLowerCase() === "table") {
        const g = Bt(n.outerHTML, d);
        n = m.make("div", void 0, {
          innerHTML: g
        }).firstChild;
      } else
        n.innerHTML = Bt(n.innerHTML, d);
      const h = this.composePasteEvent("tag", {
        data: n
      });
      return {
        content: n,
        isBlock: a,
        tool: r.name,
        event: h
      };
    }).filter((o) => {
      const n = m.isEmpty(o.content), r = m.isSingleTag(o.content);
      return !n || r;
    });
  }
  /**
   * Split plain text by new line symbols and return it as array of Block data
   *
   * @param {string} plain - string to process
   * @returns {PasteData[]}
   */
  processPlain(t) {
    const { defaultBlock: e } = this.config;
    if (!t)
      return [];
    const i = e;
    return t.split(/\r?\n/).filter((o) => o.trim()).map((o) => {
      const n = m.make("div");
      n.textContent = o;
      const r = this.composePasteEvent("tag", {
        data: n
      });
      return {
        content: n,
        tool: i,
        isBlock: !1,
        event: r
      };
    });
  }
  /**
   * Process paste of single Block tool content
   *
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  async processSingleBlock(t) {
    const { Caret: e, BlockManager: i } = this.Editor, { currentBlock: o } = i;
    if (!o || t.tool !== o.name || !m.containsOnlyInlineElements(t.content.innerHTML)) {
      this.insertBlock(t, (o == null ? void 0 : o.tool.isDefault) && o.isEmpty);
      return;
    }
    e.insertContentAtCaretPosition(t.content.innerHTML);
  }
  /**
   * Process paste to single Block:
   * 1. Find patterns` matches
   * 2. Insert new block if it is not the same type as current one
   * 3. Just insert text if there is no substitutions
   *
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  async processInlinePaste(t) {
    const { BlockManager: e, Caret: i } = this.Editor, { content: o } = t;
    if (e.currentBlock && e.currentBlock.tool.isDefault && o.textContent.length < dn.PATTERN_PROCESSING_MAX_LENGTH) {
      const n = await this.processPattern(o.textContent);
      if (n) {
        const r = e.currentBlock && e.currentBlock.tool.isDefault && e.currentBlock.isEmpty, a = e.paste(n.tool, n.event, r);
        i.setToBlock(a, i.positions.END);
        return;
      }
    }
    if (e.currentBlock && e.currentBlock.currentInput) {
      const n = e.currentBlock.tool.baseSanitizeConfig;
      document.execCommand(
        "insertHTML",
        !1,
        Bt(o.innerHTML, n)
      );
    } else
      this.insertBlock(t);
  }
  /**
   * Get patterns` matches
   *
   * @param {string} text - text to process
   * @returns {Promise<{event: PasteEvent, tool: string}>}
   */
  async processPattern(t) {
    const e = this.toolsPatterns.find((i) => {
      const o = i.pattern.exec(t);
      return o ? t === o.shift() : !1;
    });
    return e ? {
      event: this.composePasteEvent("pattern", {
        key: e.key,
        data: t
      }),
      tool: e.tool.name
    } : void 0;
  }
  /**
   * Insert pasted Block content to Editor
   *
   * @param {PasteData} data - data to insert
   * @param {boolean} canReplaceCurrentBlock - if true and is current Block is empty, will replace current Block
   * @returns {void}
   */
  insertBlock(t, e = !1) {
    const { BlockManager: i, Caret: o } = this.Editor, { currentBlock: n } = i;
    let r;
    if (e && n && n.isEmpty) {
      r = i.paste(t.tool, t.event, !0), o.setToBlock(r, o.positions.END);
      return;
    }
    r = i.paste(t.tool, t.event), o.setToBlock(r, o.positions.END);
  }
  /**
   * Insert data passed as application/x-editor-js JSON
   *
   * @param {Array} blocks — Blocks' data to insert
   * @returns {void}
   */
  insertEditorJSData(t) {
    const { BlockManager: e, Caret: i, Tools: o } = this.Editor;
    Ki(
      t,
      (n) => o.blockTools.get(n).sanitizeConfig
    ).forEach(({ tool: n, data: r }, a) => {
      let l = !1;
      a === 0 && (l = e.currentBlock && e.currentBlock.tool.isDefault && e.currentBlock.isEmpty);
      const c = e.insert({
        tool: n,
        data: r,
        replace: l
      });
      i.setToBlock(c, i.positions.END);
    });
  }
  /**
   * Fetch nodes from Element node
   *
   * @param {Node} node - current node
   * @param {Node[]} nodes - processed nodes
   * @param {Node} destNode - destination node
   */
  processElementNode(t, e, i) {
    const o = Object.keys(this.toolsTags), n = t, { tool: r } = this.toolsTags[n.tagName] || {}, a = this.tagsByTool[r == null ? void 0 : r.name] || [], l = o.includes(n.tagName), c = m.blockElements.includes(n.tagName.toLowerCase()), d = Array.from(n.children).some(
      ({ tagName: g }) => o.includes(g) && !a.includes(g)
    ), h = Array.from(n.children).some(
      ({ tagName: g }) => m.blockElements.includes(g.toLowerCase())
    );
    if (!c && !l && !d)
      return i.appendChild(n), [...e, i];
    if (l && !d || c && !h && !d)
      return [...e, i, n];
  }
  /**
   * Recursively divide HTML string to two types of nodes:
   * 1. Block element
   * 2. Document Fragments contained text and markup tags like a, b, i etc.
   *
   * @param {Node} wrapper - wrapper of paster HTML content
   * @returns {Node[]}
   */
  getNodes(t) {
    const e = Array.from(t.childNodes);
    let i;
    const o = (n, r) => {
      if (m.isEmpty(r) && !m.isSingleTag(r))
        return n;
      const a = n[n.length - 1];
      let l = new DocumentFragment();
      switch (a && m.isFragment(a) && (l = n.pop()), r.nodeType) {
        case Node.ELEMENT_NODE:
          if (i = this.processElementNode(r, n, l), i)
            return i;
          break;
        case Node.TEXT_NODE:
          return l.appendChild(r), [...n, l];
        default:
          return [...n, l];
      }
      return [...n, ...Array.from(r.childNodes).reduce(o, [])];
    };
    return e.reduce(o, []);
  }
  /**
   * Compose paste event with passed type and detail
   *
   * @param {string} type - event type
   * @param {PasteEventDetail} detail - event detail
   */
  composePasteEvent(t, e) {
    return new CustomEvent(t, {
      detail: e
    });
  }
};
cn.PATTERN_PROCESSING_MAX_LENGTH = 450;
let ml = cn;
class vl extends N {
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
    const { Tools: t } = this.Editor, { blockTools: e } = t, i = [];
    Array.from(e.entries()).forEach(([o, n]) => {
      n.isReadOnlySupported || i.push(o);
    }), this.toolsDontSupportReadOnly = i, this.config.readOnly && i.length > 0 && this.throwCriticalError(), this.toggle(this.config.readOnly, !0);
  }
  /**
   * Set read-only mode or toggle current state
   * Call all Modules `toggleReadOnly` method and re-render Editor
   *
   * @param state - (optional) read-only state or toggle
   * @param isInitial - (optional) true when editor is initializing
   */
  async toggle(t = !this.readOnlyEnabled, e = !1) {
    t && this.toolsDontSupportReadOnly.length > 0 && this.throwCriticalError();
    const i = this.readOnlyEnabled;
    this.readOnlyEnabled = t;
    for (const n in this.Editor)
      this.Editor[n].toggleReadOnly && this.Editor[n].toggleReadOnly(t);
    if (i === t)
      return this.readOnlyEnabled;
    if (e)
      return this.readOnlyEnabled;
    this.Editor.ModificationsObserver.disable();
    const o = await this.Editor.Saver.save();
    return await this.Editor.BlockManager.clear(), await this.Editor.Renderer.render(o.blocks), this.Editor.ModificationsObserver.enable(), this.readOnlyEnabled;
  }
  /**
   * Throws an error about tools which don't support read-only mode
   */
  throwCriticalError() {
    throw new Os(
      `To enable read-only mode all connected tools should support it. Tools ${this.toolsDontSupportReadOnly.join(", ")} don't support read-only mode.`
    );
  }
}
let bl = class Fe extends N {
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
  startSelection(t, e) {
    const i = document.elementFromPoint(t - window.pageXOffset, e - window.pageYOffset);
    i.closest(`.${this.Editor.Toolbar.CSS.toolbar}`) || (this.Editor.BlockSelection.allBlocksSelected = !1, this.clearSelection(), this.stackOfSelected = []);
    const o = [
      `.${Q.CSS.content}`,
      `.${this.Editor.Toolbar.CSS.toolbar}`,
      `.${this.Editor.InlineToolbar.CSS.inlineToolbar}`
    ], n = i.closest("." + this.Editor.UI.CSS.editorWrapper), r = o.some((a) => !!i.closest(a));
    !n || r || (this.mousedown = !0, this.startX = t, this.startY = e);
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
    const { container: t } = this.genHTML();
    this.listeners.on(t, "mousedown", (e) => {
      this.processMouseDown(e);
    }, !1), this.listeners.on(document.body, "mousemove", Ei((e) => {
      this.processMouseMove(e);
    }, 10), {
      passive: !0
    }), this.listeners.on(document.body, "mouseleave", () => {
      this.processMouseLeave();
    }), this.listeners.on(window, "scroll", Ei((e) => {
      this.processScroll(e);
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
  processMouseDown(t) {
    t.button === this.MAIN_MOUSE_BUTTON && (t.target.closest(m.allInputsSelector) !== null || this.startSelection(t.pageX, t.pageY));
  }
  /**
   * Handle mouse move events
   *
   * @param {MouseEvent} mouseEvent - mouse event payload
   */
  processMouseMove(t) {
    this.changingRectangle(t), this.scrollByZones(t.clientY);
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
  processScroll(t) {
    this.changingRectangle(t);
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
  scrollByZones(t) {
    if (this.inScrollZone = null, t <= this.HEIGHT_OF_SCROLL_ZONE && (this.inScrollZone = this.TOP_SCROLL_ZONE), document.documentElement.clientHeight - t <= this.HEIGHT_OF_SCROLL_ZONE && (this.inScrollZone = this.BOTTOM_SCROLL_ZONE), !this.inScrollZone) {
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
    const { UI: t } = this.Editor, e = t.nodes.holder.querySelector("." + t.CSS.editorWrapper), i = m.make("div", Fe.CSS.overlay, {}), o = m.make("div", Fe.CSS.overlayContainer, {}), n = m.make("div", Fe.CSS.rect, {});
    return o.appendChild(n), i.appendChild(o), e.appendChild(i), this.overlayRectangle = n, {
      container: e,
      overlay: i
    };
  }
  /**
   * Activates scrolling if blockSelection is active and mouse is in scroll zone
   *
   * @param {number} speed - speed of scrolling
   */
  scrollVertical(t) {
    if (!(this.inScrollZone && this.mousedown))
      return;
    const e = window.pageYOffset;
    window.scrollBy(0, t), this.mouseY += window.pageYOffset - e, setTimeout(() => {
      this.scrollVertical(t);
    }, 0);
  }
  /**
   * Handles the change in the rectangle and its effect
   *
   * @param {MouseEvent} event - mouse event
   */
  changingRectangle(t) {
    if (!this.mousedown)
      return;
    t.pageY !== void 0 && (this.mouseX = t.pageX, this.mouseY = t.pageY);
    const { rightPos: e, leftPos: i, index: o } = this.genInfoForMouseSelection(), n = this.startX > e && this.mouseX > e, r = this.startX < i && this.mouseX < i;
    this.rectCrossesBlocks = !(n || r), this.isRectSelectionActivated || (this.rectCrossesBlocks = !1, this.isRectSelectionActivated = !0, this.shrinkRectangleToPoint(), this.overlayRectangle.style.display = "block"), this.updateRectangleSize(), this.Editor.Toolbar.close(), o !== void 0 && (this.trySelectNextBlock(o), this.inverseSelection(), C.get().removeAllRanges());
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
    const t = this.Editor.BlockManager.getBlockByIndex(this.stackOfSelected[0]).selected;
    if (this.rectCrossesBlocks && !t)
      for (const e of this.stackOfSelected)
        this.Editor.BlockSelection.selectBlockByIndex(e);
    if (!this.rectCrossesBlocks && t)
      for (const e of this.stackOfSelected)
        this.Editor.BlockSelection.unSelectBlockByIndex(e);
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
    const t = document.body.offsetWidth / 2, e = this.mouseY - window.pageYOffset, i = document.elementFromPoint(t, e), o = this.Editor.BlockManager.getBlockByChildNode(i);
    let n;
    o !== void 0 && (n = this.Editor.BlockManager.blocks.findIndex((d) => d.holder === o.holder));
    const r = this.Editor.BlockManager.lastBlock.holder.querySelector("." + Q.CSS.content), a = Number.parseInt(window.getComputedStyle(r).width, 10) / 2, l = t - a, c = t + a;
    return {
      index: n,
      leftPos: l,
      rightPos: c
    };
  }
  /**
   * Select block with index index
   *
   * @param index - index of block in redactor
   */
  addBlockInSelection(t) {
    this.rectCrossesBlocks && this.Editor.BlockSelection.selectBlockByIndex(t), this.stackOfSelected.push(t);
  }
  /**
   * Adds a block to the selection and determines which blocks should be selected
   *
   * @param {object} index - index of new block in the reactor
   */
  trySelectNextBlock(t) {
    const e = this.stackOfSelected[this.stackOfSelected.length - 1] === t, i = this.stackOfSelected.length, o = 1, n = -1, r = 0;
    if (e)
      return;
    const a = this.stackOfSelected[i - 1] - this.stackOfSelected[i - 2] > 0;
    let l = r;
    i > 1 && (l = a ? o : n);
    const c = t > this.stackOfSelected[i - 1] && l === o, d = t < this.stackOfSelected[i - 1] && l === n, h = !(c || d || l === r);
    if (!h && (t > this.stackOfSelected[i - 1] || this.stackOfSelected[i - 1] === void 0)) {
      let f = this.stackOfSelected[i - 1] + 1 || t;
      for (f; f <= t; f++)
        this.addBlockInSelection(f);
      return;
    }
    if (!h && t < this.stackOfSelected[i - 1]) {
      for (let f = this.stackOfSelected[i - 1] - 1; f >= t; f--)
        this.addBlockInSelection(f);
      return;
    }
    if (!h)
      return;
    let g = i - 1, v;
    for (t > this.stackOfSelected[i - 1] ? v = () => t > this.stackOfSelected[g] : v = () => t < this.stackOfSelected[g]; v(); )
      this.rectCrossesBlocks && this.Editor.BlockSelection.unSelectBlockByIndex(this.stackOfSelected[g]), this.stackOfSelected.pop(), g--;
  }
};
class wl extends N {
  /**
   * Renders passed blocks as one batch
   *
   * @param blocksData - blocks to render
   */
  async render(t) {
    return new Promise((e) => {
      const { Tools: i, BlockManager: o } = this.Editor;
      if (t.length === 0)
        o.insert();
      else {
        const n = t.map(({ type: r, data: a, tunes: l, id: c }) => {
          i.available.has(r) === !1 && (yt(`Tool «${r}» is not found. Check 'tools' property at the Editor.js config.`, "warn"), a = this.composeStubDataForTool(r, a, c), r = i.stubTool);
          let d;
          try {
            d = o.composeBlock({
              id: c,
              tool: r,
              data: a,
              tunes: l
            });
          } catch (h) {
            F(`Block «${r}» skipped because of plugins error`, "error", {
              data: a,
              error: h
            }), a = this.composeStubDataForTool(r, a, c), r = i.stubTool, d = o.composeBlock({
              id: c,
              tool: r,
              data: a,
              tunes: l
            });
          }
          return d;
        });
        o.insertMany(n);
      }
      window.requestIdleCallback(() => {
        e();
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
  composeStubDataForTool(t, e, i) {
    const { Tools: o } = this.Editor;
    let n = t;
    if (o.unavailable.has(t)) {
      const r = o.unavailable.get(t).toolbox;
      r !== void 0 && r[0].title !== void 0 && (n = r[0].title);
    }
    return {
      savedData: {
        id: i,
        type: t,
        data: e
      },
      title: n
    };
  }
}
class yl extends N {
  /**
   * Composes new chain of Promises to fire them alternatelly
   *
   * @returns {OutputData}
   */
  async save() {
    const { BlockManager: t, Tools: e } = this.Editor, i = t.blocks, o = [];
    try {
      i.forEach((a) => {
        o.push(this.getSavedData(a));
      });
      const n = await Promise.all(o), r = await Ki(n, (a) => e.blockTools.get(a).sanitizeConfig);
      return this.makeOutput(r);
    } catch (n) {
      yt("Saving failed due to the Error %o", "error", n);
    }
  }
  /**
   * Saves and validates
   *
   * @param {Block} block - Editor's Tool
   * @returns {ValidatedData} - Tool's validated data
   */
  async getSavedData(t) {
    const e = await t.save(), i = e && await t.validate(e.data);
    return {
      ...e,
      isValid: i
    };
  }
  /**
   * Creates output object with saved data, time and version of editor
   *
   * @param {ValidatedData} allExtractedData - data extracted from Blocks
   * @returns {OutputData}
   */
  makeOutput(t) {
    const e = [];
    return t.forEach(({ id: i, tool: o, data: n, tunes: r, isValid: a }) => {
      if (!a) {
        F(`Block «${o}» skipped because saved data is invalid`);
        return;
      }
      if (o === this.Editor.Tools.stubTool) {
        e.push(n);
        return;
      }
      const l = {
        id: i,
        type: o,
        data: n,
        ...!kt(r) && {
          tunes: r
        }
      };
      e.push(l);
    }), {
      time: +/* @__PURE__ */ new Date(),
      blocks: e,
      version: "2.30.6"
    };
  }
}
(function() {
  try {
    if (typeof document < "u") {
      var s = document.createElement("style");
      s.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-block:only-of-type .ce-paragraph[data-placeholder-active]:empty:before,.ce-block:only-of-type .ce-paragraph[data-placeholder-active][data-empty=true]:before{content:attr(data-placeholder-active)}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")), document.head.appendChild(s);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
const kl = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
function xl(s) {
  const t = document.createElement("div");
  t.innerHTML = s.trim();
  const e = document.createDocumentFragment();
  return e.append(...Array.from(t.childNodes)), e;
}
/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
let _l = class hn {
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
  constructor({ data: t, config: e, api: i, readOnly: o }) {
    this.api = i, this.readOnly = o, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = e.placeholder ? e.placeholder : hn.DEFAULT_PLACEHOLDER, this._data = t ?? {}, this._element = null, this._preserveBlank = e.preserveBlank ?? !1;
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(t) {
    if (t.code !== "Backspace" && t.code !== "Delete" || !this._element)
      return;
    const { textContent: e } = this._element;
    e === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  drawView() {
    const t = document.createElement("DIV");
    return t.classList.add(this._CSS.wrapper, this._CSS.block), t.contentEditable = "false", t.dataset.placeholderActive = this.api.i18n.t(this._placeholder), this._data.text && (t.innerHTML = this._data.text), this.readOnly || (t.contentEditable = "true", t.addEventListener("keyup", this.onKeyUp)), t;
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
  merge(t) {
    if (!this._element)
      return;
    this._data.text += t.text;
    const e = xl(t.text);
    this._element.appendChild(e), this._element.normalize();
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(t) {
    return !(t.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(t) {
    return {
      text: t.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {HTMLPasteEvent} event - event with pasted data
   */
  onPaste(t) {
    const e = {
      text: t.detail.data.innerHTML
    };
    this._data = e, window.requestAnimationFrame(() => {
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
      icon: kl,
      title: "Text"
    };
  }
}, io = class {
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
      icon: Ca,
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
};
io.isInline = !0;
io.title = "Bold";
let oo = class {
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
    return this.nodes.button = document.createElement("button"), this.nodes.button.type = "button", this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier), this.nodes.button.innerHTML = Aa, this.nodes.button;
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
    const t = document.queryCommandState(this.commandName);
    return this.nodes.button.classList.toggle(this.CSS.buttonActive, t), t;
  }
  /**
   * Set a shortcut
   */
  get shortcut() {
    return "CMD+I";
  }
};
oo.isInline = !0;
oo.title = "Italic";
let so = class {
  /**
   * @param api - Editor.js API
   */
  constructor({ api: t }) {
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
    }, this.inputOpened = !1, this.toolbar = t.toolbar, this.inlineToolbar = t.inlineToolbar, this.notifier = t.notifier, this.i18n = t.i18n, this.selection = new C();
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
    return this.nodes.button = document.createElement("button"), this.nodes.button.type = "button", this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier), this.nodes.button.innerHTML = zo, this.nodes.button;
  }
  /**
   * Input for the link
   */
  renderActions() {
    return this.nodes.input = document.createElement("input"), this.nodes.input.placeholder = this.i18n.t("Add a link"), this.nodes.input.enterKeyHint = "done", this.nodes.input.classList.add(this.CSS.input), this.nodes.input.addEventListener("keydown", (t) => {
      t.keyCode === this.ENTER_KEY && this.enterPressed(t);
    }), this.nodes.input;
  }
  /**
   * Handle clicks on the Inline Toolbar icon
   *
   * @param {Range} range - range to wrap with link
   */
  surround(t) {
    if (t) {
      this.inputOpened ? (this.selection.restore(), this.selection.removeFakeBackground()) : (this.selection.setFakeBackground(), this.selection.save());
      const e = this.selection.findParentTag("A");
      if (e) {
        this.selection.expandToTag(e), this.unlink(), this.closeActions(), this.checkState(), this.toolbar.close();
        return;
      }
    }
    this.toggleActions();
  }
  /**
   * Check selection and set activated state to button if there are <a> tag
   */
  checkState() {
    const t = this.selection.findParentTag("A");
    if (t) {
      this.nodes.button.innerHTML = Na, this.nodes.button.classList.add(this.CSS.buttonUnlink), this.nodes.button.classList.add(this.CSS.buttonActive), this.openActions();
      const e = t.getAttribute("href");
      this.nodes.input.value = e !== "null" ? e : "", this.selection.save();
    } else
      this.nodes.button.innerHTML = zo, this.nodes.button.classList.remove(this.CSS.buttonUnlink), this.nodes.button.classList.remove(this.CSS.buttonActive);
    return !!t;
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
  openActions(t = !1) {
    this.nodes.input.classList.add(this.CSS.inputShowed), t && this.nodes.input.focus(), this.inputOpened = !0;
  }
  /**
   * Close input
   *
   * @param {boolean} clearSavedSelection — we don't need to clear saved selection
   *                                        on toggle-clicks on the icon of opened Toolbar
   */
  closeActions(t = !0) {
    if (this.selection.isFakeBackgroundEnabled) {
      const e = new C();
      e.save(), this.selection.restore(), this.selection.removeFakeBackground(), e.restore();
    }
    this.nodes.input.classList.remove(this.CSS.inputShowed), this.nodes.input.value = "", t && this.selection.clearSaved(), this.inputOpened = !1;
  }
  /**
   * Enter pressed on input
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  enterPressed(t) {
    let e = this.nodes.input.value || "";
    if (!e.trim()) {
      this.selection.restore(), this.unlink(), t.preventDefault(), this.closeActions();
      return;
    }
    if (!this.validateURL(e)) {
      this.notifier.show({
        message: "Pasted link is not valid.",
        style: "error"
      }), F("Incorrect Link pasted", "warn", e);
      return;
    }
    e = this.prepareLink(e), this.selection.restore(), this.selection.removeFakeBackground(), this.insertLink(e), t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.selection.collapseToEnd(), this.inlineToolbar.close();
  }
  /**
   * Detects if passed string is URL
   *
   * @param {string} str - string to validate
   * @returns {boolean}
   */
  validateURL(t) {
    return !/\s/.test(t);
  }
  /**
   * Process link before injection
   * - sanitize
   * - add protocol for links like 'google.com'
   *
   * @param {string} link - raw user input
   */
  prepareLink(t) {
    return t = t.trim(), t = this.addProtocol(t), t;
  }
  /**
   * Add 'http' protocol to the links like 'vc.ru', 'google.com'
   *
   * @param {string} link - string to process
   */
  addProtocol(t) {
    if (/^(\w+):(\/\/)?/.test(t))
      return t;
    const e = /^\/[^/\s]/.test(t), i = t.substring(0, 1) === "#", o = /^\/\/[^/\s]/.test(t);
    return !e && !i && !o && (t = "http://" + t), t;
  }
  /**
   * Inserts <a> tag with "href"
   *
   * @param {string} link - "href" value
   */
  insertLink(t) {
    const e = this.selection.findParentTag("A");
    e && this.selection.expandToTag(e), document.execCommand(this.commandLink, !1, t);
  }
  /**
   * Removes <a> tag
   */
  unlink() {
    document.execCommand(this.commandUnlink);
  }
};
so.isInline = !0;
so.title = "Link";
class un {
  /**
   * @param api - Editor.js API
   */
  constructor({ api: t }) {
    this.i18nAPI = t.i18n, this.blocksAPI = t.blocks, this.selectionAPI = t.selection, this.toolsAPI = t.tools, this.caretAPI = t.caret;
  }
  /**
   * Returns tool's UI config
   */
  async render() {
    const t = C.get(), e = this.blocksAPI.getBlockByElement(t.anchorNode);
    if (e === void 0)
      return [];
    const i = this.toolsAPI.getBlockTools(), o = await $s(e, i);
    if (o.length === 0)
      return [];
    const n = o.reduce((c, d) => {
      var h;
      return (h = d.toolbox) == null || h.forEach((g) => {
        c.push({
          icon: g.icon,
          title: lt.t(vt.toolNames, g.title),
          name: d.name,
          closeOnActivate: !0,
          onActivate: async () => {
            const v = await this.blocksAPI.convert(e.id, d.name, g.data);
            this.caretAPI.setToBlock(v, "end");
          }
        });
      }), c;
    }, []), r = await e.getActiveToolboxEntry(), a = r !== void 0 ? r.icon : Ks, l = !de();
    return {
      icon: a,
      name: "convert-to",
      hint: {
        title: this.i18nAPI.t("Convert to")
      },
      children: {
        searchable: l,
        items: n,
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
un.isInline = !0;
class pn {
  /**
   * @param options - constructor options
   * @param options.data - stub tool data
   * @param options.api - Editor.js API
   */
  constructor({ data: t, api: e }) {
    this.CSS = {
      wrapper: "ce-stub",
      info: "ce-stub__info",
      title: "ce-stub__title",
      subtitle: "ce-stub__subtitle"
    }, this.api = e, this.title = t.title || this.api.i18n.t("Error"), this.subtitle = this.api.i18n.t("The block can not be displayed correctly."), this.savedData = t.savedData, this.wrapper = this.make();
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
    const t = m.make("div", this.CSS.wrapper), e = Da, i = m.make("div", this.CSS.info), o = m.make("div", this.CSS.title, {
      textContent: this.title
    }), n = m.make("div", this.CSS.subtitle, {
      textContent: this.subtitle
    });
    return t.innerHTML = e, i.appendChild(o), i.appendChild(n), t.appendChild(i), t;
  }
}
pn.isReadOnlySupported = !0;
class El extends eo {
  constructor() {
    super(...arguments), this.type = Yt.Inline;
  }
  /**
   * Returns title for Inline Tool if specified by user
   */
  get title() {
    return this.constructable[to.Title];
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
}
class Cl extends eo {
  constructor() {
    super(...arguments), this.type = Yt.Tune;
  }
  /**
   * Constructs new BlockTune instance from constructable
   *
   * @param data - Tune data
   * @param block - Block API object
   */
  create(t, e) {
    return new this.constructable({
      api: this.api,
      config: this.settings,
      block: e,
      data: t
    });
  }
}
let St = class ee extends Map {
  /**
   * Returns Block Tools collection
   */
  get blockTools() {
    const t = Array.from(this.entries()).filter(([, e]) => e.isBlock());
    return new ee(t);
  }
  /**
   * Returns Inline Tools collection
   */
  get inlineTools() {
    const t = Array.from(this.entries()).filter(([, e]) => e.isInline());
    return new ee(t);
  }
  /**
   * Returns Block Tunes collection
   */
  get blockTunes() {
    const t = Array.from(this.entries()).filter(([, e]) => e.isTune());
    return new ee(t);
  }
  /**
   * Returns internal Tools collection
   */
  get internalTools() {
    const t = Array.from(this.entries()).filter(([, e]) => e.isInternal);
    return new ee(t);
  }
  /**
   * Returns Tools collection provided by user
   */
  get externalTools() {
    const t = Array.from(this.entries()).filter(([, e]) => !e.isInternal);
    return new ee(t);
  }
};
var Tl = Object.defineProperty, Sl = Object.getOwnPropertyDescriptor, gn = (s, t, e, i) => {
  for (var o = Sl(t, e), n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = r(t, e, o) || o);
  return o && Tl(t, e, o), o;
};
let no = class extends eo {
  constructor() {
    super(...arguments), this.type = Yt.Block, this.inlineTools = new St(), this.tunes = new St();
  }
  /**
   * Creates new Tool instance
   *
   * @param data - Tool data
   * @param block - BlockAPI for current Block
   * @param readOnly - True if Editor is in read-only mode
   */
  create(t, e, i) {
    return new this.constructable({
      data: t,
      block: e,
      readOnly: i,
      api: this.api,
      config: this.settings
    });
  }
  /**
   * Returns true if read-only mode is supported by Tool
   */
  get isReadOnlySupported() {
    return this.constructable[te.IsReadOnlySupported] === !0;
  }
  /**
   * Returns true if Tool supports linebreaks
   */
  get isLineBreaksEnabled() {
    return this.constructable[te.IsEnabledLineBreaks];
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
    const t = this.constructable[te.Toolbox], e = this.config[De.Toolbox];
    if (!kt(t) && e !== !1)
      return e ? Array.isArray(t) ? Array.isArray(e) ? e.map((i, o) => {
        const n = t[o];
        return n ? {
          ...n,
          ...i
        } : i;
      }) : [e] : Array.isArray(e) ? e : [
        {
          ...t,
          ...e
        }
      ] : Array.isArray(t) ? t : [t];
  }
  /**
   * Returns Tool conversion configuration
   */
  get conversionConfig() {
    return this.constructable[te.ConversionConfig];
  }
  /**
   * Returns enabled inline tools for Tool
   */
  get enabledInlineTools() {
    return this.config[De.EnabledInlineTools] || !1;
  }
  /**
   * Returns enabled tunes for Tool
   */
  get enabledBlockTunes() {
    return this.config[De.EnabledBlockTunes];
  }
  /**
   * Returns Tool paste configuration
   */
  get pasteConfig() {
    return this.constructable[te.PasteConfig] ?? {};
  }
  get sanitizeConfig() {
    const t = super.sanitizeConfig, e = this.baseSanitizeConfig;
    if (kt(t))
      return e;
    const i = {};
    for (const o in t)
      if (Object.prototype.hasOwnProperty.call(t, o)) {
        const n = t[o];
        et(n) ? i[o] = Object.assign({}, e, n) : i[o] = n;
      }
    return i;
  }
  get baseSanitizeConfig() {
    const t = {};
    return Array.from(this.inlineTools.values()).forEach((e) => Object.assign(t, e.sanitizeConfig)), Array.from(this.tunes.values()).forEach((e) => Object.assign(t, e.sanitizeConfig)), t;
  }
};
gn([
  ce
], no.prototype, "sanitizeConfig");
gn([
  ce
], no.prototype, "baseSanitizeConfig");
class Bl {
  /**
   * @class
   * @param config - tools config
   * @param editorConfig - EditorJS config
   * @param api - EditorJS API module
   */
  constructor(t, e, i) {
    this.api = i, this.config = t, this.editorConfig = e;
  }
  /**
   * Returns Tool object based on it's type
   *
   * @param name - tool name
   */
  get(t) {
    const { class: e, isInternal: i = !1, ...o } = this.config[t], n = this.getConstructor(e), r = e[Mi.IsTune];
    return new n({
      name: t,
      constructable: e,
      config: o,
      api: this.api.getMethodsForTool(t, r),
      isDefault: t === this.editorConfig.defaultBlock,
      defaultPlaceholder: this.editorConfig.placeholder,
      isInternal: i
    });
  }
  /**
   * Find appropriate Tool object constructor for Tool constructable
   *
   * @param constructable - Tools constructable
   */
  getConstructor(t) {
    switch (!0) {
      case t[to.IsInline]:
        return El;
      case t[Mi.IsTune]:
        return Cl;
      default:
        return no;
    }
  }
}
class fn {
  /**
   * MoveDownTune constructor
   *
   * @param {API} api — Editor's API
   */
  constructor({ api: t }) {
    this.CSS = {
      animation: "wobble"
    }, this.api = t;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: Ta,
      title: this.api.i18n.t("Move down"),
      onActivate: () => this.handleClick(),
      name: "move-down"
    };
  }
  /**
   * Handle clicks on 'move down' button
   */
  handleClick() {
    const t = this.api.blocks.getCurrentBlockIndex(), e = this.api.blocks.getBlockByIndex(t + 1);
    if (!e)
      throw new Error("Unable to move Block down since it is already the last");
    const i = e.holder, o = i.getBoundingClientRect();
    let n = Math.abs(window.innerHeight - i.offsetHeight);
    o.top < window.innerHeight && (n = window.scrollY + i.offsetHeight), window.scrollTo(0, n), this.api.blocks.move(t + 1), this.api.toolbar.toggleBlockSettings(!0);
  }
}
fn.isTune = !0;
class mn {
  /**
   * DeleteTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api: t }) {
    this.api = t;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: La,
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
mn.isTune = !0;
class vn {
  /**
   * MoveUpTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api: t }) {
    this.CSS = {
      animation: "wobble"
    }, this.api = t;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: Ia,
      title: this.api.i18n.t("Move up"),
      onActivate: () => this.handleClick(),
      name: "move-up"
    };
  }
  /**
   * Move current block up
   */
  handleClick() {
    const t = this.api.blocks.getCurrentBlockIndex(), e = this.api.blocks.getBlockByIndex(t), i = this.api.blocks.getBlockByIndex(t - 1);
    if (t === 0 || !e || !i)
      throw new Error("Unable to move Block up since it is already the first");
    const o = e.holder, n = i.holder, r = o.getBoundingClientRect(), a = n.getBoundingClientRect();
    let l;
    a.top > 0 ? l = Math.abs(r.top) - Math.abs(a.top) : l = Math.abs(r.top) + a.height, window.scrollBy(0, -1 * l), this.api.blocks.move(t - 1), this.api.toolbar.toggleBlockSettings(!0);
  }
}
vn.isTune = !0;
var Il = Object.defineProperty, Ll = Object.getOwnPropertyDescriptor, Ml = (s, t, e, i) => {
  for (var o = Ll(t, e), n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = r(t, e, o) || o);
  return o && Il(t, e, o), o;
};
class bn extends N {
  constructor() {
    super(...arguments), this.stubTool = "stub", this.toolsAvailable = new St(), this.toolsUnavailable = new St();
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
    if (this.validateTools(), this.config.tools = Ci({}, this.internalTools, this.config.tools), !Object.prototype.hasOwnProperty.call(this.config, "tools") || Object.keys(this.config.tools).length === 0)
      throw Error("Can't start without tools");
    const t = this.prepareConfig();
    this.factory = new Bl(t, this.config, this.Editor.API);
    const e = this.getListOfPrepareFunctions(t);
    if (e.length === 0)
      return Promise.resolve();
    await Lr(e, (i) => {
      this.toolPrepareMethodSuccess(i);
    }, (i) => {
      this.toolPrepareMethodFallback(i);
    }), this.prepareBlockTools();
  }
  getAllInlineToolsSanitizeConfig() {
    const t = {};
    return Array.from(this.inlineTools.values()).forEach((e) => {
      Object.assign(t, e.sanitizeConfig);
    }), t;
  }
  /**
   * Calls each Tool reset method to clean up anything set by Tool
   */
  destroy() {
    Object.values(this.available).forEach(async (t) => {
      K(t.reset) && await t.reset();
    });
  }
  /**
   * Returns internal tools
   * Includes Bold, Italic, Link and Paragraph
   */
  get internalTools() {
    return {
      convertTo: {
        class: un,
        isInternal: !0
      },
      link: {
        class: so,
        isInternal: !0
      },
      bold: {
        class: io,
        isInternal: !0
      },
      italic: {
        class: oo,
        isInternal: !0
      },
      paragraph: {
        class: _l,
        inlineToolbar: !0,
        isInternal: !0
      },
      stub: {
        class: pn,
        isInternal: !0
      },
      moveUp: {
        class: vn,
        isInternal: !0
      },
      delete: {
        class: mn,
        isInternal: !0
      },
      moveDown: {
        class: fn,
        isInternal: !0
      }
    };
  }
  /**
   * Tool prepare method success callback
   *
   * @param {object} data - append tool to available list
   */
  toolPrepareMethodSuccess(t) {
    const e = this.factory.get(t.toolName);
    if (e.isInline()) {
      const i = ["render"].filter((o) => !e.create()[o]);
      if (i.length) {
        F(
          `Incorrect Inline Tool: ${e.name}. Some of required methods is not implemented %o`,
          "warn",
          i
        ), this.toolsUnavailable.set(e.name, e);
        return;
      }
    }
    this.toolsAvailable.set(e.name, e);
  }
  /**
   * Tool prepare method fail callback
   *
   * @param {object} data - append tool to unavailable list
   */
  toolPrepareMethodFallback(t) {
    this.toolsUnavailable.set(t.toolName, this.factory.get(t.toolName));
  }
  /**
   * Binds prepare function of plugins with user or default config
   *
   * @returns {Array} list of functions that needs to be fired sequentially
   * @param config - tools config
   */
  getListOfPrepareFunctions(t) {
    const e = [];
    return Object.entries(t).forEach(([i, o]) => {
      e.push({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function: K(o.class.prepare) ? o.class.prepare : () => {
        },
        data: {
          toolName: i,
          config: o.config
        }
      });
    }), e;
  }
  /**
   * Assign enabled Inline Tools and Block Tunes for Block Tool
   */
  prepareBlockTools() {
    Array.from(this.blockTools.values()).forEach((t) => {
      this.assignInlineToolsToBlockTool(t), this.assignBlockTunesToBlockTool(t);
    });
  }
  /**
   * Assign enabled Inline Tools for Block Tool
   *
   * @param tool - Block Tool
   */
  assignInlineToolsToBlockTool(t) {
    if (this.config.inlineToolbar !== !1) {
      if (t.enabledInlineTools === !0) {
        t.inlineTools = new St(
          Array.isArray(this.config.inlineToolbar) ? this.config.inlineToolbar.map((e) => [e, this.inlineTools.get(e)]) : Array.from(this.inlineTools.entries())
        );
        return;
      }
      Array.isArray(t.enabledInlineTools) && (t.inlineTools = new St(
        /** Prepend ConvertTo Inline Tool */
        ["convertTo", ...t.enabledInlineTools].map((e) => [e, this.inlineTools.get(e)])
      ));
    }
  }
  /**
   * Assign enabled Block Tunes for Block Tool
   *
   * @param tool — Block Tool
   */
  assignBlockTunesToBlockTool(t) {
    if (t.enabledBlockTunes !== !1) {
      if (Array.isArray(t.enabledBlockTunes)) {
        const e = new St(
          t.enabledBlockTunes.map((i) => [i, this.blockTunes.get(i)])
        );
        t.tunes = new St([...e, ...this.blockTunes.internalTools]);
        return;
      }
      if (Array.isArray(this.config.tunes)) {
        const e = new St(
          this.config.tunes.map((i) => [i, this.blockTunes.get(i)])
        );
        t.tunes = new St([...e, ...this.blockTunes.internalTools]);
        return;
      }
      t.tunes = this.blockTunes.internalTools;
    }
  }
  /**
   * Validate Tools configuration objects and throw Error for user if it is invalid
   */
  validateTools() {
    for (const t in this.config.tools)
      if (Object.prototype.hasOwnProperty.call(this.config.tools, t)) {
        if (t in this.internalTools)
          return;
        const e = this.config.tools[t];
        if (!K(e) && !K(e.class))
          throw Error(
            `Tool «${t}» must be a constructor function or an object with function in the «class» property`
          );
      }
  }
  /**
   * Unify tools config
   */
  prepareConfig() {
    const t = {};
    for (const e in this.config.tools)
      et(this.config.tools[e]) ? t[e] = this.config.tools[e] : t[e] = { class: this.config.tools[e] };
    return t;
  }
}
Ml([
  ce
], bn.prototype, "getAllInlineToolsSanitizeConfig");
const Al = `:root{--selectionColor: #e1f2ff;--inlineSelectionColor: #d4ecff;--bg-light: #eff2f5;--grayText: #707684;--color-dark: #1D202B;--color-active-icon: #388AE5;--color-gray-border: rgba(201, 201, 204, .48);--content-width: 650px;--narrow-mode-right-padding: 50px;--toolbox-buttons-size: 26px;--toolbox-buttons-size--mobile: 36px;--icon-size: 20px;--icon-size--mobile: 28px;--block-padding-vertical: .4em;--color-line-gray: #EFF0F1 }.codex-editor{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:1}.codex-editor .hide{display:none}.codex-editor__redactor [contenteditable]:empty:after{content:"\\feff"}@media (min-width: 651px){.codex-editor--narrow .codex-editor__redactor{margin-right:50px}}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .codex-editor__redactor{margin-left:50px;margin-right:0}}@media (min-width: 651px){.codex-editor--narrow .ce-toolbar__actions{right:-5px}}.codex-editor-copyable{position:absolute;height:1px;width:1px;top:-400%;opacity:.001}.codex-editor-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;pointer-events:none;overflow:hidden}.codex-editor-overlay__container{position:relative;pointer-events:auto;z-index:0}.codex-editor-overlay__rectangle{position:absolute;pointer-events:none;background-color:#2eaadc33;border:1px solid transparent}.codex-editor svg{max-height:100%}.codex-editor path{stroke:currentColor}.codex-editor ::-moz-selection{background-color:#d4ecff}.codex-editor ::selection{background-color:#d4ecff}.codex-editor--toolbox-opened [contentEditable=true][data-placeholder]:focus:before{opacity:0!important}.ce-scroll-locked{overflow:hidden}.ce-scroll-locked--hard{overflow:hidden;top:calc(-1 * var(--window-scroll-offset));position:fixed;width:100%}.ce-toolbar{position:absolute;left:0;right:0;top:0;-webkit-transition:opacity .1s ease;transition:opacity .1s ease;will-change:opacity,top;display:none}.ce-toolbar--opened{display:block}.ce-toolbar__content{max-width:650px;margin:0 auto;position:relative}.ce-toolbar__plus{color:#1d202b;cursor:pointer;width:26px;height:26px;border-radius:7px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-flex-negative:0;flex-shrink:0}@media (max-width: 650px){.ce-toolbar__plus{width:36px;height:36px}}@media (hover: hover){.ce-toolbar__plus:hover{background-color:#eff2f5}}.ce-toolbar__plus--active{background-color:#eff2f5;-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.ce-toolbar__plus-shortcut{opacity:.6;word-spacing:-2px;margin-top:5px}@media (max-width: 650px){.ce-toolbar__plus{position:absolute;background-color:#fff;border:1px solid #E8E8EB;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;z-index:2;position:static}.ce-toolbar__plus--left-oriented:before{left:15px;margin-left:0}.ce-toolbar__plus--right-oriented:before{left:auto;right:15px;margin-left:0}}.ce-toolbar__actions{position:absolute;right:100%;opacity:0;display:-webkit-box;display:-ms-flexbox;display:flex;padding-right:5px}.ce-toolbar__actions--opened{opacity:1}@media (max-width: 650px){.ce-toolbar__actions{right:auto}}.ce-toolbar__settings-btn{color:#1d202b;width:26px;height:26px;border-radius:7px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;margin-left:3px;cursor:pointer;user-select:none}@media (max-width: 650px){.ce-toolbar__settings-btn{width:36px;height:36px}}@media (hover: hover){.ce-toolbar__settings-btn:hover{background-color:#eff2f5}}.ce-toolbar__settings-btn--active{background-color:#eff2f5;-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@media (min-width: 651px){.ce-toolbar__settings-btn{width:24px}}.ce-toolbar__settings-btn--hidden{display:none}@media (max-width: 650px){.ce-toolbar__settings-btn{position:absolute;background-color:#fff;border:1px solid #E8E8EB;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;z-index:2;position:static}.ce-toolbar__settings-btn--left-oriented:before{left:15px;margin-left:0}.ce-toolbar__settings-btn--right-oriented:before{left:auto;right:15px;margin-left:0}}.ce-toolbar__plus svg,.ce-toolbar__settings-btn svg{width:24px;height:24px}@media (min-width: 651px){.codex-editor--narrow .ce-toolbar__plus{left:5px}}@media (min-width: 651px){.codex-editor--narrow .ce-toolbox .ce-popover{right:0;left:auto;left:initial}}.ce-inline-toolbar{--y-offset: 8px;--color-background-icon-active: rgba(56, 138, 229, .1);--color-text-icon-active: #388AE5;--color-text-primary: black;position:absolute;visibility:hidden;-webkit-transition:opacity .25s ease;transition:opacity .25s ease;will-change:opacity,left,top;top:0;left:0;z-index:3;opacity:1;visibility:visible}.ce-inline-toolbar [hidden]{display:none!important}.ce-inline-toolbar__toggler-and-button-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;padding:0 6px}.ce-inline-toolbar__buttons{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-inline-toolbar__dropdown{display:-webkit-box;display:-ms-flexbox;display:flex;padding:6px;margin:0 6px 0 -6px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;border-right:1px solid rgba(201,201,204,.48);-webkit-box-sizing:border-box;box-sizing:border-box}@media (hover: hover){.ce-inline-toolbar__dropdown:hover{background:#eff2f5}}.ce-inline-toolbar__dropdown--hidden{display:none}.ce-inline-toolbar__dropdown-content,.ce-inline-toolbar__dropdown-arrow{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-inline-toolbar__dropdown-content svg,.ce-inline-toolbar__dropdown-arrow svg{width:20px;height:20px}.ce-inline-toolbar__shortcut{opacity:.6;word-spacing:-3px;margin-top:3px}.ce-inline-tool{color:var(--color-text-primary);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;border:0;border-radius:4px;line-height:normal;height:100%;padding:0;width:28px;background-color:transparent;cursor:pointer}@media (max-width: 650px){.ce-inline-tool{width:36px;height:36px}}@media (hover: hover){.ce-inline-tool:hover{background-color:#f8f8f8}}.ce-inline-tool svg{display:block;width:20px;height:20px}@media (max-width: 650px){.ce-inline-tool svg{width:28px;height:28px}}.ce-inline-tool--link .icon--unlink,.ce-inline-tool--unlink .icon--link{display:none}.ce-inline-tool--unlink .icon--unlink{display:inline-block;margin-bottom:-1px}.ce-inline-tool-input{background:#F8F8F8;border:1px solid rgba(226,226,229,.2);border-radius:6px;padding:4px 8px;font-size:14px;line-height:22px;outline:none;margin:0;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;display:none;font-weight:500;-webkit-appearance:none;font-family:inherit}@media (max-width: 650px){.ce-inline-tool-input{font-size:15px;font-weight:500}}.ce-inline-tool-input::-webkit-input-placeholder{color:#707684}.ce-inline-tool-input::-moz-placeholder{color:#707684}.ce-inline-tool-input:-ms-input-placeholder{color:#707684}.ce-inline-tool-input::-ms-input-placeholder{color:#707684}.ce-inline-tool-input::placeholder{color:#707684}.ce-inline-tool-input--showed{display:block}.ce-inline-tool--active{background:var(--color-background-icon-active);color:var(--color-text-icon-active)}@-webkit-keyframes fade-in{0%{opacity:0}to{opacity:1}}@keyframes fade-in{0%{opacity:0}to{opacity:1}}.ce-block{-webkit-animation:fade-in .3s ease;animation:fade-in .3s ease;-webkit-animation-fill-mode:none;animation-fill-mode:none;-webkit-animation-fill-mode:initial;animation-fill-mode:initial}.ce-block:first-of-type{margin-top:0}.ce-block--selected .ce-block__content{background:#e1f2ff}.ce-block--selected .ce-block__content [contenteditable]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ce-block--selected .ce-block__content img,.ce-block--selected .ce-block__content .ce-stub{opacity:.55}.ce-block--stretched .ce-block__content{max-width:none}.ce-block__content{position:relative;max-width:650px;margin:0 auto;-webkit-transition:background-color .15s ease;transition:background-color .15s ease}.ce-block--drop-target .ce-block__content:before{content:"";position:absolute;top:100%;left:-20px;margin-top:-1px;height:8px;width:8px;border:solid #388AE5;border-width:1px 1px 0 0;-webkit-transform-origin:right;transform-origin:right;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.ce-block--drop-target .ce-block__content:after{content:"";position:absolute;top:100%;height:1px;width:100%;color:#388ae5;background:repeating-linear-gradient(90deg,#388AE5,#388AE5 1px,#fff 1px,#fff 6px)}.ce-block a{cursor:pointer;-webkit-text-decoration:underline;text-decoration:underline}.ce-block b{font-weight:700}.ce-block i{font-style:italic}@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@-webkit-keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@-webkit-keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}.cdx-block{padding:.4em 0}.cdx-block::-webkit-input-placeholder{line-height:normal!important}.cdx-input{border:1px solid rgba(201,201,204,.48);-webkit-box-shadow:inset 0 1px 2px 0 rgba(35,44,72,.06);box-shadow:inset 0 1px 2px #232c480f;border-radius:3px;padding:10px 12px;outline:none;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.cdx-input[data-placeholder]:before{position:static!important}.cdx-input[data-placeholder]:before{display:inline-block;width:0;white-space:nowrap;pointer-events:none}.cdx-settings-button{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;border-radius:3px;cursor:pointer;border:0;outline:none;background-color:transparent;vertical-align:bottom;color:inherit;margin:0;min-width:26px;min-height:26px}.cdx-settings-button--focused{background:rgba(34,186,255,.08)!important}.cdx-settings-button--focused{-webkit-box-shadow:inset 0 0 0px 1px rgba(7,161,227,.08);box-shadow:inset 0 0 0 1px #07a1e314}.cdx-settings-button--focused-animated{-webkit-animation-name:buttonClicked;animation-name:buttonClicked;-webkit-animation-duration:.25s;animation-duration:.25s}.cdx-settings-button--active{color:#388ae5}.cdx-settings-button svg{width:auto;height:auto}@media (max-width: 650px){.cdx-settings-button svg{width:28px;height:28px}}@media (max-width: 650px){.cdx-settings-button{width:36px;height:36px;border-radius:8px}}@media (hover: hover){.cdx-settings-button:hover{background-color:#eff2f5}}.cdx-loader{position:relative;border:1px solid rgba(201,201,204,.48)}.cdx-loader:before{content:"";position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-11px 0 0 -11px;border:2px solid rgba(201,201,204,.48);border-left-color:#388ae5;border-radius:50%;-webkit-animation:cdxRotation 1.2s infinite linear;animation:cdxRotation 1.2s infinite linear}@-webkit-keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.cdx-button{padding:13px;border-radius:3px;border:1px solid rgba(201,201,204,.48);font-size:14.9px;background:#fff;-webkit-box-shadow:0 2px 2px 0 rgba(18,30,57,.04);box-shadow:0 2px 2px #121e390a;color:#707684;text-align:center;cursor:pointer}@media (hover: hover){.cdx-button:hover{background:#FBFCFE;-webkit-box-shadow:0 1px 3px 0 rgba(18,30,57,.08);box-shadow:0 1px 3px #121e3914}}.cdx-button svg{height:20px;margin-right:.2em;margin-top:-2px}.ce-stub{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:12px 18px;margin:10px 0;border-radius:10px;background:#eff2f5;border:1px solid #EFF0F1;color:#707684;font-size:14px}.ce-stub svg{width:20px;height:20px}.ce-stub__info{margin-left:14px}.ce-stub__title{font-weight:500;text-transform:capitalize}.codex-editor.codex-editor--rtl{direction:rtl}.codex-editor.codex-editor--rtl .cdx-list{padding-left:0;padding-right:40px}.codex-editor.codex-editor--rtl .ce-toolbar__plus{right:-26px;left:auto}.codex-editor.codex-editor--rtl .ce-toolbar__actions{right:auto;left:-26px}@media (max-width: 650px){.codex-editor.codex-editor--rtl .ce-toolbar__actions{margin-left:0;margin-right:auto;padding-right:0;padding-left:10px}}.codex-editor.codex-editor--rtl .ce-settings{left:5px;right:auto}.codex-editor.codex-editor--rtl .ce-settings:before{right:auto;left:25px}.codex-editor.codex-editor--rtl .ce-settings__button:not(:nth-child(3n+3)){margin-left:3px;margin-right:0}.codex-editor.codex-editor--rtl .ce-conversion-tool__icon{margin-right:0;margin-left:10px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown{border-right:0px solid transparent;border-left:1px solid rgba(201,201,204,.48);margin:0 -6px 0 6px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown .icon--toggler-down{margin-left:0;margin-right:4px}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__plus{left:0;right:5px}}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__actions{left:-5px}}.cdx-search-field{--icon-margin-right: 10px;background:#F8F8F8;border:1px solid rgba(226,226,229,.2);border-radius:6px;padding:2px;display:grid;grid-template-columns:auto auto 1fr;grid-template-rows:auto}.cdx-search-field__icon{width:26px;height:26px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-right:var(--icon-margin-right)}.cdx-search-field__icon svg{width:20px;height:20px;color:#707684}.cdx-search-field__input{font-size:14px;outline:none;font-weight:500;font-family:inherit;border:0;background:transparent;margin:0;padding:0;line-height:22px;min-width:calc(100% - 26px - var(--icon-margin-right))}.cdx-search-field__input::-webkit-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::-moz-placeholder{color:#707684;font-weight:500}.cdx-search-field__input:-ms-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::-ms-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::placeholder{color:#707684;font-weight:500}.ce-popover{--border-radius: 6px;--width: 200px;--max-height: 270px;--padding: 6px;--offset-from-target: 8px;--color-border: #EFF0F1;--color-shadow: rgba(13, 20, 33, .1);--color-background: white;--color-text-primary: black;--color-text-secondary: #707684;--color-border-icon: rgba(201, 201, 204, .48);--color-border-icon-disabled: #EFF0F1;--color-text-icon-active: #388AE5;--color-background-icon-active: rgba(56, 138, 229, .1);--color-background-item-focus: rgba(34, 186, 255, .08);--color-shadow-item-focus: rgba(7, 161, 227, .08);--color-background-item-hover: #F8F8F8;--color-background-item-confirm: #E24A4A;--color-background-item-confirm-hover: #CE4343;--popover-top: calc(100% + var(--offset-from-target));--popover-left: 0;--nested-popover-overlap: 4px;--icon-size: 20px;--item-padding: 3px;--item-height: calc(var(--icon-size) + 2 * var(--item-padding))}.ce-popover__container{min-width:var(--width);width:var(--width);max-height:var(--max-height);border-radius:var(--border-radius);overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:0px 3px 15px -3px var(--color-shadow);box-shadow:0 3px 15px -3px var(--color-shadow);position:absolute;left:var(--popover-left);top:var(--popover-top);background:var(--color-background);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;z-index:4;opacity:0;max-height:0;pointer-events:none;padding:0;border:none}.ce-popover--opened>.ce-popover__container{opacity:1;padding:var(--padding);max-height:var(--max-height);pointer-events:auto;-webkit-animation:panelShowing .1s ease;animation:panelShowing .1s ease;border:1px solid var(--color-border)}@media (max-width: 650px){.ce-popover--opened>.ce-popover__container{-webkit-animation:panelShowingMobile .25s ease;animation:panelShowingMobile .25s ease}}.ce-popover--open-top .ce-popover__container{--popover-top: calc(-1 * (var(--offset-from-target) + var(--popover-height)))}.ce-popover--open-left .ce-popover__container{--popover-left: calc(-1 * var(--width) + 100%)}.ce-popover__items{overflow-y:auto;-ms-scroll-chaining:none;overscroll-behavior:contain}@media (max-width: 650px){.ce-popover__overlay{position:fixed;top:0;bottom:0;left:0;right:0;background:#1D202B;z-index:3;opacity:.5;-webkit-transition:opacity .12s ease-in;transition:opacity .12s ease-in;will-change:opacity;visibility:visible}}.ce-popover__overlay--hidden{display:none}@media (max-width: 650px){.ce-popover .ce-popover__container{--offset: 5px;position:fixed;max-width:none;min-width:calc(100% - var(--offset) * 2);left:var(--offset);right:var(--offset);bottom:calc(var(--offset) + env(safe-area-inset-bottom));top:auto;border-radius:10px}}.ce-popover__search{margin-bottom:5px}.ce-popover__nothing-found-message{color:#707684;display:none;cursor:default;padding:3px;font-size:14px;line-height:20px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ce-popover__nothing-found-message--displayed{display:block}.ce-popover--nested .ce-popover__container{--popover-left: calc(var(--nesting-level) * (var(--width) - var(--nested-popover-overlap)));top:calc(var(--trigger-item-top) - var(--nested-popover-overlap));position:absolute}.ce-popover--open-top.ce-popover--nested .ce-popover__container{top:calc(var(--trigger-item-top) - var(--popover-height) + var(--item-height) + var(--offset-from-target) + var(--nested-popover-overlap))}.ce-popover--open-left .ce-popover--nested .ce-popover__container{--popover-left: calc(-1 * (var(--nesting-level) + 1) * var(--width) + 100%)}.ce-popover-item-separator{padding:4px 3px}.ce-popover-item-separator--hidden{display:none}.ce-popover-item-separator__line{height:1px;background:var(--color-border);width:100%}.ce-popover-item-html--hidden{display:none}.ce-popover-item{--border-radius: 6px;border-radius:var(--border-radius);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:var(--item-padding);color:var(--color-text-primary);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;background:transparent}@media (max-width: 650px){.ce-popover-item{padding:4px}}.ce-popover-item:not(:last-of-type){margin-bottom:1px}.ce-popover-item__icon{width:26px;height:26px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.ce-popover-item__icon svg{width:20px;height:20px}@media (max-width: 650px){.ce-popover-item__icon{width:36px;height:36px;border-radius:8px}.ce-popover-item__icon svg{width:28px;height:28px}}.ce-popover-item__icon--tool{margin-right:4px}.ce-popover-item__title{font-size:14px;line-height:20px;font-weight:500;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-right:auto}@media (max-width: 650px){.ce-popover-item__title{font-size:16px}}.ce-popover-item__secondary-title{color:var(--color-text-secondary);font-size:12px;white-space:nowrap;letter-spacing:-.1em;padding-right:5px;opacity:.6}@media (max-width: 650px){.ce-popover-item__secondary-title{display:none}}.ce-popover-item--active{background:var(--color-background-icon-active);color:var(--color-text-icon-active)}.ce-popover-item--disabled{color:var(--color-text-secondary);cursor:default;pointer-events:none}.ce-popover-item--focused:not(.ce-popover-item--no-focus){background:var(--color-background-item-focus)!important}.ce-popover-item--hidden{display:none}@media (hover: hover){.ce-popover-item:hover{cursor:pointer}.ce-popover-item:hover:not(.ce-popover-item--no-hover){background-color:var(--color-background-item-hover)}}.ce-popover-item--confirmation{background:var(--color-background-item-confirm)}.ce-popover-item--confirmation .ce-popover-item__title,.ce-popover-item--confirmation .ce-popover-item__icon{color:#fff}@media (hover: hover){.ce-popover-item--confirmation:not(.ce-popover-item--no-hover):hover{background:var(--color-background-item-confirm-hover)}}.ce-popover-item--confirmation:not(.ce-popover-item--no-focus).ce-popover-item--focused{background:var(--color-background-item-confirm-hover)!important}@-webkit-keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes panelShowingMobile{0%{opacity:0;-webkit-transform:translateY(14px) scale(.98);transform:translateY(14px) scale(.98)}70%{opacity:1;-webkit-transform:translateY(-4px);transform:translateY(-4px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes panelShowingMobile{0%{opacity:0;-webkit-transform:translateY(14px) scale(.98);transform:translateY(14px) scale(.98)}70%{opacity:1;-webkit-transform:translateY(-4px);transform:translateY(-4px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}.wobble{-webkit-animation-name:wobble;animation-name:wobble;-webkit-animation-duration:.4s;animation-duration:.4s}@-webkit-keyframes wobble{0%{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-9%,0,0);transform:translate3d(-9%,0,0)}30%{-webkit-transform:translate3d(9%,0,0);transform:translate3d(9%,0,0)}45%{-webkit-transform:translate3d(-4%,0,0);transform:translate3d(-4%,0,0)}60%{-webkit-transform:translate3d(4%,0,0);transform:translate3d(4%,0,0)}75%{-webkit-transform:translate3d(-1%,0,0);transform:translate3d(-1%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}}@keyframes wobble{0%{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-9%,0,0);transform:translate3d(-9%,0,0)}30%{-webkit-transform:translate3d(9%,0,0);transform:translate3d(9%,0,0)}45%{-webkit-transform:translate3d(-4%,0,0);transform:translate3d(-4%,0,0)}60%{-webkit-transform:translate3d(4%,0,0);transform:translate3d(4%,0,0)}75%{-webkit-transform:translate3d(-1%,0,0);transform:translate3d(-1%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}}.ce-popover-header{margin-bottom:8px;margin-top:4px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ce-popover-header__text{font-size:18px;font-weight:600}.ce-popover-header__back-button{border:0;background:transparent;width:36px;height:36px;color:var(--color-text-primary)}.ce-popover-header__back-button svg{display:block;width:28px;height:28px}.ce-popover--inline{--height: 38px;--height-mobile: 46px;--container-padding: 4px;position:relative}.ce-popover--inline .ce-popover__custom-content{margin-bottom:0}.ce-popover--inline .ce-popover__items{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-popover--inline .ce-popover__container{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;padding:var(--container-padding);height:var(--height);top:0;min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;width:-webkit-max-content;width:-moz-max-content;width:max-content;-webkit-animation:none;animation:none}@media (max-width: 650px){.ce-popover--inline .ce-popover__container{height:var(--height-mobile);position:absolute}}.ce-popover--inline .ce-popover-item-separator{padding:0 4px}.ce-popover--inline .ce-popover-item-separator__line{height:100%;width:1px}.ce-popover--inline .ce-popover-item{border-radius:4px;padding:4px}.ce-popover--inline .ce-popover-item__icon--tool{-webkit-box-shadow:none;box-shadow:none;background:transparent;margin-right:0}.ce-popover--inline .ce-popover-item__icon{width:auto;width:initial;height:auto;height:initial}.ce-popover--inline .ce-popover-item__icon svg{width:20px;height:20px}@media (max-width: 650px){.ce-popover--inline .ce-popover-item__icon svg{width:28px;height:28px}}.ce-popover--inline .ce-popover-item:not(:last-of-type){margin-bottom:0;margin-bottom:initial}.ce-popover--inline .ce-popover-item-html{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ce-popover--inline .ce-popover-item__icon--chevron-right{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ce-popover--inline .ce-popover--nested-level-1 .ce-popover__container{--offset: 3px;left:0;top:calc(var(--height) + var(--offset))}@media (max-width: 650px){.ce-popover--inline .ce-popover--nested-level-1 .ce-popover__container{top:calc(var(--height-mobile) + var(--offset))}}.ce-popover--inline .ce-popover--nested .ce-popover__container{min-width:var(--width);width:var(--width);height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;padding:6px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.ce-popover--inline .ce-popover--nested .ce-popover__items{display:block;width:100%}.ce-popover--inline .ce-popover--nested .ce-popover-item{border-radius:6px;padding:3px}@media (max-width: 650px){.ce-popover--inline .ce-popover--nested .ce-popover-item{padding:4px}}.ce-popover--inline .ce-popover--nested .ce-popover-item__icon--tool{margin-right:4px}.ce-popover--inline .ce-popover--nested .ce-popover-item__icon{width:26px;height:26px}.ce-popover--inline .ce-popover--nested .ce-popover-item-separator{padding:4px 3px}.ce-popover--inline .ce-popover--nested .ce-popover-item-separator__line{width:100%;height:1px}.codex-editor [data-placeholder]:empty:before,.codex-editor [data-placeholder][data-empty=true]:before{pointer-events:none;color:#707684;cursor:text;content:attr(data-placeholder)}.codex-editor [data-placeholder-active]:empty:before,.codex-editor [data-placeholder-active][data-empty=true]:before{pointer-events:none;color:#707684;cursor:text}.codex-editor [data-placeholder-active]:empty:focus:before,.codex-editor [data-placeholder-active][data-empty=true]:focus:before{content:attr(data-placeholder-active)}
`;
class Rl extends N {
  constructor() {
    super(...arguments), this.isMobile = !1, this.contentRectCache = void 0, this.resizeDebouncer = Ho(() => {
      this.windowResize();
    }, 200);
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
    if (this.contentRectCache)
      return this.contentRectCache;
    const t = this.nodes.wrapper.querySelector(`.${Q.CSS.content}`);
    return t ? (this.contentRectCache = t.getBoundingClientRect(), this.contentRectCache) : {
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
  toggleReadOnly(t) {
    t ? this.disableModuleBindings() : window.requestIdleCallback(() => {
      this.enableModuleBindings();
    }, {
      timeout: 2e3
    });
  }
  /**
   * Check if Editor is empty and set CSS class to wrapper
   */
  checkEmptiness() {
    const { BlockManager: t } = this.Editor;
    this.nodes.wrapper.classList.toggle(this.CSS.editorEmpty, t.isEditorEmpty);
  }
  /**
   * Check if one of Toolbar is opened
   * Used to prevent global keydowns (for example, Enter) conflicts with Enter-on-toolbar
   *
   * @returns {boolean}
   */
  get someToolbarOpened() {
    const { Toolbar: t, BlockSettings: e, InlineToolbar: i } = this.Editor;
    return !!(e.opened || i.opened || t.toolbox.opened);
  }
  /**
   * Check for some Flipper-buttons is under focus
   */
  get someFlipperButtonFocused() {
    return this.Editor.Toolbar.toolbox.hasFocus() ? !0 : Object.entries(this.Editor).filter(([t, e]) => e.flipper instanceof Ke).some(([t, e]) => e.flipper.hasFocus());
  }
  /**
   * Clean editor`s UI
   */
  destroy() {
    this.nodes.holder.innerHTML = "";
  }
  /**
   * Close all Editor's toolbars
   */
  closeAllToolbars() {
    const { Toolbar: t, BlockSettings: e, InlineToolbar: i } = this.Editor;
    e.close(), i.close(), t.toolbox.close();
  }
  /**
   * Check for mobile mode and save the result
   */
  setIsMobile() {
    const t = window.innerWidth < Ms;
    t !== this.isMobile && this.eventsDispatcher.emit(Te, {
      isEnabled: this.isMobile
    }), this.isMobile = t;
  }
  /**
   * Makes Editor.js interface
   */
  make() {
    this.nodes.holder = m.getHolder(this.config.holder), this.nodes.wrapper = m.make("div", [
      this.CSS.editorWrapper,
      ...this.isRtl ? [this.CSS.editorRtlFix] : []
    ]), this.nodes.redactor = m.make("div", this.CSS.editorZone), this.nodes.holder.offsetWidth < this.contentRect.width && this.nodes.wrapper.classList.add(this.CSS.editorWrapperNarrow), this.nodes.redactor.style.paddingBottom = this.config.minHeight + "px", this.nodes.wrapper.appendChild(this.nodes.redactor), this.nodes.holder.appendChild(this.nodes.wrapper);
  }
  /**
   * Appends CSS
   */
  loadStyles() {
    const t = "editor-js-styles";
    if (m.get(t))
      return;
    const e = m.make("style", null, {
      id: t,
      textContent: Al.toString()
    });
    this.config.style && !kt(this.config.style) && this.config.style.nonce && e.setAttribute("nonce", this.config.style.nonce), m.prepend(document.head, e);
  }
  /**
   * Bind events on the Editor.js interface
   */
  enableModuleBindings() {
    this.readOnlyMutableListeners.on(this.nodes.redactor, "click", (e) => {
      this.redactorClicked(e);
    }, !1), this.readOnlyMutableListeners.on(this.nodes.redactor, "mousedown", (e) => {
      this.documentTouched(e);
    }, {
      capture: !0,
      passive: !0
    }), this.readOnlyMutableListeners.on(this.nodes.redactor, "touchstart", (e) => {
      this.documentTouched(e);
    }, {
      capture: !0,
      passive: !0
    }), this.readOnlyMutableListeners.on(document, "keydown", (e) => {
      this.documentKeydown(e);
    }, !0), this.readOnlyMutableListeners.on(document, "mousedown", (e) => {
      this.documentClicked(e);
    }, !0);
    const t = Ho(() => {
      this.selectionChanged();
    }, pl);
    this.readOnlyMutableListeners.on(document, "selectionchange", t, !0), this.readOnlyMutableListeners.on(window, "resize", () => {
      this.resizeDebouncer();
    }, {
      passive: !0
    }), this.watchBlockHoveredEvents(), this.enableInputsEmptyMark();
  }
  /**
   * Listen redactor mousemove to emit 'block-hovered' event
   */
  watchBlockHoveredEvents() {
    let t;
    this.readOnlyMutableListeners.on(this.nodes.redactor, "mousemove", Ei((e) => {
      const i = e.target.closest(".ce-block");
      this.Editor.BlockSelection.anyBlockSelected || i && t !== i && (t = i, this.eventsDispatcher.emit(nn, {
        block: this.Editor.BlockManager.getBlockByChildNode(i)
      }));
    }, 20), {
      passive: !0
    });
  }
  /**
   * Unbind events on the Editor.js interface
   */
  disableModuleBindings() {
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
  documentKeydown(t) {
    switch (t.keyCode) {
      case S.ENTER:
        this.enterPressed(t);
        break;
      case S.BACKSPACE:
      case S.DELETE:
        this.backspacePressed(t);
        break;
      case S.ESC:
        this.escapePressed(t);
        break;
      default:
        this.defaultBehaviour(t);
        break;
    }
  }
  /**
   * Ignore all other document's keydown events
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  defaultBehaviour(t) {
    const { currentBlock: e } = this.Editor.BlockManager, i = t.target.closest(`.${this.CSS.editorWrapper}`), o = t.altKey || t.ctrlKey || t.metaKey || t.shiftKey;
    if (e !== void 0 && i === null) {
      this.Editor.BlockEvents.keydown(t);
      return;
    }
    i || e && o || (this.Editor.BlockManager.unsetCurrentBlock(), this.Editor.Toolbar.close());
  }
  /**
   * @param {KeyboardEvent} event - keyboard event
   */
  backspacePressed(t) {
    const { BlockManager: e, BlockSelection: i, Caret: o } = this.Editor;
    if (i.anyBlockSelected && !C.isSelectionExists) {
      const n = e.removeSelectedBlocks(), r = e.insertDefaultBlockAtIndex(n, !0);
      o.setToBlock(r, o.positions.START), i.clearSelection(t), t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation();
    }
  }
  /**
   * Escape pressed
   * If some of Toolbar components are opened, then close it otherwise close Toolbar
   *
   * @param {Event} event - escape keydown event
   */
  escapePressed(t) {
    this.Editor.BlockSelection.clearSelection(t), this.Editor.Toolbar.toolbox.opened ? (this.Editor.Toolbar.toolbox.close(), this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END)) : this.Editor.BlockSettings.opened ? this.Editor.BlockSettings.close() : this.Editor.InlineToolbar.opened ? this.Editor.InlineToolbar.close() : this.Editor.Toolbar.close();
  }
  /**
   * Enter pressed on document
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  enterPressed(t) {
    const { BlockManager: e, BlockSelection: i } = this.Editor;
    if (this.someToolbarOpened)
      return;
    const o = e.currentBlockIndex >= 0;
    if (i.anyBlockSelected && !C.isSelectionExists) {
      i.clearSelection(t), t.preventDefault(), t.stopImmediatePropagation(), t.stopPropagation();
      return;
    }
    if (!this.someToolbarOpened && o && t.target.tagName === "BODY") {
      const n = this.Editor.BlockManager.insert();
      t.preventDefault(), this.Editor.Caret.setToBlock(n), this.Editor.Toolbar.moveAndOpen(n);
    }
    this.Editor.BlockSelection.clearSelection(t);
  }
  /**
   * All clicks on document
   *
   * @param {MouseEvent} event - Click event
   */
  documentClicked(t) {
    var e, i;
    if (!t.isTrusted)
      return;
    const o = t.target;
    this.nodes.holder.contains(o) || C.isAtEditor || (this.Editor.BlockManager.unsetCurrentBlock(), this.Editor.Toolbar.close());
    const n = (e = this.Editor.BlockSettings.nodes.wrapper) == null ? void 0 : e.contains(o), r = (i = this.Editor.Toolbar.nodes.settingsToggler) == null ? void 0 : i.contains(o), a = n || r;
    if (this.Editor.BlockSettings.opened && !a) {
      this.Editor.BlockSettings.close();
      const l = this.Editor.BlockManager.getBlockByChildNode(o);
      this.Editor.Toolbar.moveAndOpen(l);
    }
    this.Editor.BlockSelection.clearSelection(t);
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
   * @param {MouseEvent | TouchEvent} event - touch or mouse event
   */
  documentTouched(t) {
    let e = t.target;
    if (e === this.nodes.redactor) {
      const i = t instanceof MouseEvent ? t.clientX : t.touches[0].clientX, o = t instanceof MouseEvent ? t.clientY : t.touches[0].clientY;
      e = document.elementFromPoint(i, o);
    }
    try {
      this.Editor.BlockManager.setCurrentBlockByChildNode(e);
    } catch {
      this.Editor.RectangleSelection.isRectActivated() || this.Editor.Caret.setToTheLastBlock();
    }
    this.Editor.Toolbar.moveAndOpen();
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
  redactorClicked(t) {
    if (!C.isCollapsed)
      return;
    const e = t.target, i = t.metaKey || t.ctrlKey;
    if (m.isAnchor(e) && i) {
      t.stopImmediatePropagation(), t.stopPropagation();
      const o = e.getAttribute("href"), n = Pr(o);
      Nr(n);
      return;
    }
    this.processBottomZoneClick(t);
  }
  /**
   * Check if user clicks on the Editor's bottom zone:
   *  - set caret to the last block
   *  - or add new empty block
   *
   * @param event - click event
   */
  processBottomZoneClick(t) {
    const e = this.Editor.BlockManager.getBlockByIndex(-1), i = m.offset(e.holder).bottom, o = t.pageY, { BlockSelection: n } = this.Editor;
    if (t.target instanceof Element && t.target.isEqualNode(this.nodes.redactor) && /**
    * If there is cross block selection started, target will be equal to redactor so we need additional check
    */
    !n.anyBlockSelected && /**
    * Prevent caret jumping (to last block) when clicking between blocks
    */
    i < o) {
      t.stopImmediatePropagation(), t.stopPropagation();
      const { BlockManager: r, Caret: a, Toolbar: l } = this.Editor;
      (!r.lastBlock.tool.isDefault || !r.lastBlock.isEmpty) && r.insertAtEnd(), a.setToTheLastBlock(), l.moveAndOpen(r.lastBlock);
    }
  }
  /**
   * Handle selection changes on mobile devices
   * Uses for showing the Inline Toolbar
   */
  selectionChanged() {
    const { CrossBlockSelection: t, BlockSelection: e } = this.Editor, i = C.anchorElement;
    if (t.isCrossBlockSelectionStarted && e.anyBlockSelected && C.get().removeAllRanges(), !i) {
      C.range || this.Editor.InlineToolbar.close();
      return;
    }
    const o = i.closest(`.${Q.CSS.content}`);
    (o === null || o.closest(`.${C.CSS.editorWrapper}`) !== this.nodes.wrapper) && (this.Editor.InlineToolbar.containsNode(i) || this.Editor.InlineToolbar.close(), i.dataset.inlineToolbar !== "true") || (this.Editor.BlockManager.currentBlock || this.Editor.BlockManager.setCurrentBlockByChildNode(i), this.Editor.InlineToolbar.tryToShow(!0));
  }
  /**
   * Editor.js provides and ability to show placeholders for empty contenteditable elements
   *
   * This method watches for input and focus events and toggles 'data-empty' attribute
   * to workaroud the case, when inputs contains only <br>s and has no visible content
   * Then, CSS could rely on this attribute to show placeholders
   */
  enableInputsEmptyMark() {
    function t(e) {
      const i = e.target;
      As(i);
    }
    this.readOnlyMutableListeners.on(this.nodes.wrapper, "input", t), this.readOnlyMutableListeners.on(this.nodes.wrapper, "focusin", t), this.readOnlyMutableListeners.on(this.nodes.wrapper, "focusout", t);
  }
}
const Pl = {
  // API Modules
  BlocksAPI: Yr,
  CaretAPI: Xr,
  EventsAPI: Zr,
  I18nAPI: Gr,
  API: Jr,
  InlineToolbarAPI: Qr,
  ListenersAPI: ta,
  NotifierAPI: sa,
  ReadOnlyAPI: na,
  SanitizerAPI: ua,
  SaverAPI: pa,
  SelectionAPI: ga,
  ToolsAPI: fa,
  StylesAPI: ma,
  ToolbarAPI: va,
  TooltipAPI: xa,
  UiAPI: _a,
  // Toolbar Modules
  BlockSettings: Xa,
  Toolbar: ol,
  InlineToolbar: sl,
  // Modules
  BlockEvents: nl,
  BlockManager: ll,
  BlockSelection: cl,
  Caret: dl,
  CrossBlockSelection: hl,
  DragNDrop: ul,
  ModificationsObserver: fl,
  Paste: ml,
  ReadOnly: vl,
  RectangleSelection: bl,
  Renderer: wl,
  Saver: yl,
  Tools: bn,
  UI: Rl
};
class Ol {
  /**
   * @param {EditorConfig} config - user configuration
   */
  constructor(t) {
    this.moduleInstances = {}, this.eventsDispatcher = new Le();
    let e, i;
    this.isReady = new Promise((o, n) => {
      e = o, i = n;
    }), Promise.resolve().then(async () => {
      this.configuration = t, this.validate(), this.init(), await this.start(), await this.render();
      const { BlockManager: o, Caret: n, UI: r, ModificationsObserver: a } = this.moduleInstances;
      r.checkEmptiness(), a.enable(), this.configuration.autofocus && n.setToBlock(o.blocks[0], n.positions.START), e();
    }).catch((o) => {
      F(`Editor.js is not ready because of ${o}`, "error"), i(o);
    });
  }
  /**
   * Setting for configuration
   *
   * @param {EditorConfig|string} config - Editor's config to set
   */
  set configuration(t) {
    var e, i;
    et(t) ? this.config = {
      ...t
    } : this.config = {
      holder: t
    }, Ti(!!this.config.holderId, "config.holderId", "config.holder"), this.config.holderId && !this.config.holder && (this.config.holder = this.config.holderId, this.config.holderId = null), this.config.holder == null && (this.config.holder = "editorjs"), this.config.logLevel || (this.config.logLevel = Bs.VERBOSE), Br(this.config.logLevel), Ti(!!this.config.initialBlock, "config.initialBlock", "config.defaultBlock"), this.config.defaultBlock = this.config.defaultBlock || this.config.initialBlock || "paragraph", this.config.minHeight = this.config.minHeight !== void 0 ? this.config.minHeight : 300;
    const o = {
      type: this.config.defaultBlock,
      data: {}
    };
    this.config.placeholder = this.config.placeholder || !1, this.config.sanitizer = this.config.sanitizer || {
      p: !0,
      b: !0,
      a: !0
    }, this.config.hideToolbar = this.config.hideToolbar ? this.config.hideToolbar : !1, this.config.tools = this.config.tools || {}, this.config.i18n = this.config.i18n || {}, this.config.data = this.config.data || { blocks: [] }, this.config.onReady = this.config.onReady || (() => {
    }), this.config.onChange = this.config.onChange || (() => {
    }), this.config.inlineToolbar = this.config.inlineToolbar !== void 0 ? this.config.inlineToolbar : !0, (kt(this.config.data) || !this.config.data.blocks || this.config.data.blocks.length === 0) && (this.config.data = { blocks: [o] }), this.config.readOnly = this.config.readOnly || !1, (e = this.config.i18n) != null && e.messages && lt.setDictionary(this.config.i18n.messages), this.config.i18n.direction = ((i = this.config.i18n) == null ? void 0 : i.direction) || "ltr";
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
    const { holderId: t, holder: e } = this.config;
    if (t && e)
      throw Error("«holderId» and «holder» param can't assign at the same time.");
    if (Ot(e) && !m.get(e))
      throw Error(`element with ID «${e}» is missing. Pass correct holder's ID.`);
    if (e && et(e) && !m.isElement(e))
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
      (t, e) => t.then(async () => {
        try {
          await this.moduleInstances[e].prepare();
        } catch (i) {
          if (i instanceof Os)
            throw new Error(i.message);
          F(`Module ${e} was skipped because of %o`, "warn", i);
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
    Object.entries(Pl).forEach(([t, e]) => {
      try {
        this.moduleInstances[t] = new e({
          config: this.configuration,
          eventsDispatcher: this.eventsDispatcher
        });
      } catch (i) {
        F("[constructModules]", `Module ${t} skipped because`, "error", i);
      }
    });
  }
  /**
   * Modules instances configuration:
   *  - pass other modules to the 'state' property
   *  - ...
   */
  configureModules() {
    for (const t in this.moduleInstances)
      Object.prototype.hasOwnProperty.call(this.moduleInstances, t) && (this.moduleInstances[t].state = this.getModulesDiff(t));
  }
  /**
   * Return modules without passed name
   *
   * @param {string} name - module for witch modules difference should be calculated
   */
  getModulesDiff(t) {
    const e = {};
    for (const i in this.moduleInstances)
      i !== t && (e[i] = this.moduleInstances[i]);
    return e;
  }
}
/**
 * Editor.js
 *
 * @license Apache-2.0
 * @see Editor.js <https://editorjs.io>
 * @author CodeX Team <https://codex.so>
 */
class Nl {
  /** Editor version */
  static get version() {
    return "2.30.6";
  }
  /**
   * @param {EditorConfig|string|undefined} [configuration] - user configuration
   */
  constructor(t) {
    let e = () => {
    };
    et(t) && K(t.onReady) && (e = t.onReady);
    const i = new Ol(t);
    this.isReady = i.isReady.then(() => {
      this.exportAPI(i), e();
    });
  }
  /**
   * Export external API methods
   *
   * @param {Core} editor — Editor's instance
   */
  exportAPI(t) {
    const e = ["configuration"], i = () => {
      Object.values(t.moduleInstances).forEach((o) => {
        K(o.destroy) && o.destroy(), o.listeners.removeAll();
      }), ka(), t = null;
      for (const o in this)
        Object.prototype.hasOwnProperty.call(this, o) && delete this[o];
      Object.setPrototypeOf(this, null);
    };
    e.forEach((o) => {
      this[o] = t[o];
    }), this.destroy = i, Object.setPrototypeOf(this, t.moduleInstances.API.methods), delete this.exportAPI, Object.entries({
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
    }).forEach(([o, n]) => {
      Object.entries(n).forEach(([r, a]) => {
        this[a] = t.moduleInstances.API.methods[o][r];
      });
    });
  }
}
const Ut = (s) => (t) => {
  var e;
  return e = class {
    constructor({ data: o, api: n }) {
      I(this, "destroy", t.onChange);
      I(this, "updated", t.onChange);
      I(this, "moved", t.onChange);
      I(this, "block");
      I(this, "api");
      this.block = s.Block(o, t), this.api = n;
    }
    static render(o) {
      const n = s.render(o, { trim: Ts });
      return typeof n == "string" ? n : n.outerHTML;
    }
    static parse(o) {
      const n = s.parse(o);
      if (n)
        return { type: s.type, data: n };
    }
    render() {
      return this.block;
    }
    save() {
      const o = Oo(this.block);
      return s.save({ api: this.api, ...o });
    }
    renderSettings() {
      var o;
      return ((o = s.settings) == null ? void 0 : o.call(s, Oo(this.block))) || [];
    }
    validate(o) {
      return typeof s.validate == "function" ? s.validate(o) : !0;
    }
  }, I(e, "type", s.type), I(e, "toolbox", {
    title: s.title,
    icon: s.icon
  }), I(e, "tool", {
    [s.type]: {
      class: e,
      ...s.config
    }
  }), e;
}, Ae = (s) => (t) => {
  var e;
  return e = class extends s.Base {
    constructor(n) {
      super(n);
      I(this, "api");
      this.api = n.api;
    }
    static render(n) {
      const r = s.render(n, { trim: Ts });
      return typeof r == "string" ? r : r.outerHTML;
    }
    static parse(n) {
      const r = s.parse(n);
      if (r)
        return { type: s.type, data: r };
    }
    save(n) {
      var r;
      return ((r = s.save) == null ? void 0 : r.call(s, n, this.api)) || super.save(n);
    }
    destroy() {
      var n;
      (n = super.destroy) == null || n.call(this), t.onChange();
    }
    updated() {
      var n;
      (n = super.updated) == null || n.call(this), t.onChange();
    }
    moved(n) {
      var r;
      (r = super.moved) == null || r.call(this, n), t.onChange();
    }
  }, s.toolbox && Object.defineProperty(e, "toolbox", {
    value: s.toolbox
  }), I(e, "tool", {
    [s.type]: {
      class: e,
      ...s.config
    }
  }), I(e, "type", s.type), e;
}, Dl = ["slate", "white", "green", "red"], Ko = [
  { emoji: "💡", label: "Note" },
  { emoji: "❓", label: "Question" },
  { emoji: "❗", label: "Warning" }
], Vl = Ut({
  Block: ({ emoji: s, color: t = "slate", text: e }) => /* @__PURE__ */ p(Lt, { className: "callout-card", children: /* @__PURE__ */ T("div", { id: "body", dataset: { color: t }, children: [
    /* @__PURE__ */ p(mt, { flat: !0, id: "emoji", children: e ? s ?? "" : Ko[0].emoji }),
    /* @__PURE__ */ p(mt, { flat: !0, id: "text", placeholder: "Card content...", children: e })
  ] }) }),
  type: "callout-card",
  title: "Callout",
  icon: V(Zn),
  config: {
    inlineToolbar: !0
  },
  save: ({ q: s, html: t, text: e }) => ({
    text: t("#text"),
    emoji: e("#emoji"),
    color: s("#body").dataset.color
  }),
  validate: (s) => !!s.text,
  render: ({ emoji: s, text: t, color: e = "slate" }, { trim: i }) => /* @__PURE__ */ p("callout-card", { attributes: { emoji: i(s), color: e }, innerHTML: i(t) }),
  parse: (s) => {
    var t, e;
    if (s.type === "callout-card") {
      const i = ((t = s.attributes) == null ? void 0 : t.emoji) ?? "";
      return {
        color: ((e = s.attributes) == null ? void 0 : e.color) ?? "slate",
        emoji: i,
        text: s.content.map(ct).join("")
      };
    }
  },
  // TODO: add color icons, name emojis
  settings: ({ q: s }) => [
    ...Ko.map((t) => ({
      icon: t.emoji,
      label: t.label,
      onActivate: () => s("#emoji").innerText = t.emoji
    })),
    { type: "separator" },
    ...Dl.map((t) => ({
      icon: V(ar),
      label: t.charAt(0).toUpperCase() + t.slice(1),
      onActivate: () => s("#body").dataset.color = t
    }))
  ]
}), Hl = Ut({
  Block: ({ src: s, caption: t }) => /* @__PURE__ */ T(Lt, { className: "embed-card", children: [
    /* @__PURE__ */ p("iframe", { src: s, style: { border: "none" } }),
    /* @__PURE__ */ T("div", { className: "main", children: [
      /* @__PURE__ */ p(mt, { flat: !0, id: "src", placeholder: "Source", children: s }),
      /* @__PURE__ */ p(mt, { flat: !0, id: "caption", placeholder: "Caption", children: t })
    ] })
  ] }),
  type: "embed-card",
  title: "Embed",
  icon: V(tr),
  validate: (s) => !!s.src,
  config: {
    inlineToolbar: !0
  },
  render: ({ src: s, caption: t }, { trim: e }) => /* @__PURE__ */ p("embed-card", { attributes: { src: e(s) }, innerHTML: e(t) || "" }),
  parse(s) {
    var t;
    if (s.type === "embed-card")
      return {
        src: ((t = s.attributes) == null ? void 0 : t.src) ?? "",
        caption: s.content.map(ct).join("")
      };
  },
  save: ({ text: s, html: t }) => ({
    src: s("#src"),
    caption: t("#caption")
  })
}), Fl = Ut({
  Block: ({ file: s }) => /* @__PURE__ */ p(Lt, { className: "file-card", children: /* @__PURE__ */ T("div", { className: "main", children: [
    /* @__PURE__ */ p(V, { icon: Ao }),
    /* @__PURE__ */ p(mt, { flat: !0, id: "file", children: s })
  ] }) }),
  type: "file-card",
  title: "File",
  icon: V(Ao),
  validate: (s) => !!s.file,
  render: ({ file: s }, { trim: t }) => /* @__PURE__ */ p("file-card", { attributes: { file: t(s) } }),
  parse: (s) => {
    if (s.type === "file-card")
      return {
        file: s.attributes.file
      };
  },
  save: ({ text: s }) => ({
    file: s("#file")
  })
});
function wn(s) {
  const [t, e, i, o, n, r, a, l, c] = s;
  switch (s.length) {
    case 0:
      return [];
    case 1:
      return [[t]];
    case 2:
      return [[t, e]];
    case 3:
      return [[t, e], [i]];
    case 4:
      return [[t, e], [i, o]];
    case 5:
      return [[t, e, i], [o, n]];
    case 6:
      return [[t, e, i], [o, n, r]];
    case 7:
      return [[t, e, i], [o, n], [r, a]];
    case 8:
      return [[t, e, i], [o, n, r], [a, l]];
    case 9:
      return [[t, e, i], [o, n, r], [a, l, c]];
    default:
      throw Error("TODO: support beyond 9");
  }
}
function $l(s, t, e) {
  if (t === s.length - 1 && e === 1 || t === 0 && e === -1)
    return s;
  const i = [...s];
  return i[t] = s[t + e], i[t + e] = s[t], i;
}
const xo = class xo extends Lt {
  constructor({ caption: e, photos: i = [] }, { selectPhoto: o, getPhotoUrl: n }) {
    super({ className: "GalleryCard" });
    I(this, "state", new tt([]));
    this.state.set(i.map((r) => ({ id: r, url: "" }))), Promise.all(i.map(async (r) => ({ id: r, url: await n(r) }))).then((r) => this.state.set(r)), Ui(this.body, /* @__PURE__ */ T(oe, { children: [
      this.state((r) => wn(r).map((a) => /* @__PURE__ */ p("div", { className: "row", children: a.map(({ id: l, url: c }) => c && /* @__PURE__ */ T("div", { className: "image", children: [
        /* @__PURE__ */ p("img", { src: c }),
        /* @__PURE__ */ T("div", { className: "buttons", children: [
          /* @__PURE__ */ p(at, { onclick: () => this.moveImg(l, -1), children: /* @__PURE__ */ p(V, { icon: Kn }) }),
          /* @__PURE__ */ p(at, { onclick: () => this.moveImg(l, 1), children: /* @__PURE__ */ p(V, { icon: Xn }) }),
          /* @__PURE__ */ p(at, { onclick: () => this.removeImg(l), children: /* @__PURE__ */ p(V, { icon: ti }) })
        ] })
      ] })) }))),
      this.state((r) => r.length < 9 && /* @__PURE__ */ p(at, { onclick: () => this.addImg(o, 9 - r.length), children: "Add Photo" })),
      /* @__PURE__ */ p(mt, { id: "caption", placeholder: "Caption", children: e })
    ] }));
  }
  moveImg(e, i) {
    const o = this.state.get().findIndex((n) => n.id === e);
    this.state.set([...$l(this.state.get(), o, i)]);
  }
  removeImg(e) {
    this.state.set([...this.state.get().filter((i) => i.id !== e)]);
  }
  addImg(e, i) {
    e(i).then((o) => {
      o && this.state.set([...this.state.get(), ...o]);
    });
  }
};
customElements.define("ae-gallery-card", xo);
let Ri = xo;
const zl = Ut({
  Block: (s, t) => new Ri(s, t),
  type: "gallery-card",
  title: "Gallery",
  icon: V(or),
  validate: (s) => s.photos.length > 0,
  render: ({ caption: s, photos: t }, { trim: e }) => /* @__PURE__ */ T("gallery-card", { children: [
    /* @__PURE__ */ p("gallery-card-container", { children: wn(t).map((i) => /* @__PURE__ */ p("gallery-card-row", { children: i.map((o) => /* @__PURE__ */ p("article-photo", { attributes: { id: o } })) })) }),
    s && /* @__PURE__ */ p("figcaption", { innerHTML: e(s) })
  ] }),
  parse: (s) => {
    var t;
    if (s.type === "gallery-card") {
      const e = s.content[0].content;
      return {
        caption: (((t = s.content[1]) == null ? void 0 : t.content) ?? []).map(ct).join(""),
        // @ts-expect-error type assert later
        photos: e.map((o) => o.content.map((n) => n.attributes.id)).flat()
      };
    }
  },
  save: ({ block: s, html: t }) => ({
    caption: t("#caption"),
    photos: s.state.get().map((e) => e.id)
  })
});
(function() {
  try {
    if (typeof document < "u") {
      var s = document.createElement("style");
      s.appendChild(document.createTextNode(".ce-header{padding:.6em 0 3px;margin:0;line-height:1.25em;outline:none}.ce-header p,.ce-header div{padding:0!important;margin:0!important}")), document.head.appendChild(s);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
const jl = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 17V10.2135C19 10.1287 18.9011 10.0824 18.836 10.1367L16 12.5"/></svg>', Ul = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10 19 9.5 19 12C19 13.9771 16.0684 13.9997 16.0012 16.8981C15.9999 16.9533 16.0448 17 16.1 17L19.3 17"/></svg>', Wl = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10.5 16.8323 10 17.6 10C18.3677 10 19.5 10.311 19.5 11.5C19.5 12.5315 18.7474 12.9022 18.548 12.9823C18.5378 12.9864 18.5395 13.0047 18.5503 13.0063C18.8115 13.0456 20 13.3065 20 14.8C20 16 19.5 17 17.8 17C17.8 17 16 17 16 16.3"/></svg>', ql = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 10L15.2834 14.8511C15.246 14.9178 15.294 15 15.3704 15C16.8489 15 18.7561 15 20.2 15M19 17C19 15.7187 19 14.8813 19 13.6"/></svg>', Yl = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 15.9C16 15.9 16.3768 17 17.8 17C19.5 17 20 15.6199 20 14.7C20 12.7323 17.6745 12.0486 16.1635 12.9894C16.094 13.0327 16 12.9846 16 12.9027V10.1C16 10.0448 16.0448 10 16.1 10H19.8"/></svg>', Kl = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19.5 10C16.5 10.5 16 13.3285 16 15M16 15V15C16 16.1046 16.8954 17 18 17H18.3246C19.3251 17 20.3191 16.3492 20.2522 15.3509C20.0612 12.4958 16 12.6611 16 15Z"/></svg>', Xl = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 7L9 12M9 17V12M9 12L15 12M15 7V12M15 17L15 12"/></svg>';
/**
 * Header block for the Editor.js.
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */
let Zl = class {
  constructor({ data: t, config: e, api: i, readOnly: o }) {
    this.api = i, this.readOnly = o, this._settings = e, this._data = this.normalizeData(t), this._element = this.getTag();
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
  isHeaderData(t) {
    return t.text !== void 0;
  }
  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData(t) {
    const e = { text: "", level: this.defaultLevel.number };
    return this.isHeaderData(t) && (e.text = t.text || "", t.level !== void 0 && !isNaN(parseInt(t.level.toString())) && (e.level = parseInt(t.level.toString()))), e;
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
    return this.levels.map((t) => ({
      icon: t.svg,
      label: this.api.i18n.t(`Heading ${t.number}`),
      onActivate: () => this.setLevel(t.number),
      closeOnActivate: !0,
      isActive: this.currentLevel.number === t.number,
      render: () => document.createElement("div")
    }));
  }
  /**
   * Callback for Block's settings buttons
   *
   * @param {number} level - level to set
   */
  setLevel(t) {
    this.data = {
      level: t,
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
  merge(t) {
    const e = {
      text: this.data.text + t.text,
      level: this.data.level
    };
    this.data = e;
  }
  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(t) {
    return t.text.trim() !== "";
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save(t) {
    return {
      text: t.innerHTML,
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
  set data(t) {
    if (this._data = this.normalizeData(t), t.level !== void 0 && this._element.parentNode) {
      const e = this.getTag();
      e.innerHTML = this._element.innerHTML, this._element.parentNode.replaceChild(e, this._element), this._element = e;
    }
    t.text !== void 0 && (this._element.innerHTML = this._data.text || "");
  }
  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
  getTag() {
    const t = document.createElement(this.currentLevel.tag);
    return t.innerHTML = this._data.text || "", t.classList.add(this._CSS.wrapper), t.contentEditable = this.readOnly ? "false" : "true", t.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || ""), t;
  }
  /**
   * Get current level
   *
   * @returns {level}
   */
  get currentLevel() {
    let t = this.levels.find((e) => e.number === this._data.level);
    return t || (t = this.defaultLevel), t;
  }
  /**
   * Return default level
   *
   * @returns {level}
   */
  get defaultLevel() {
    if (this._settings.defaultLevel) {
      const t = this.levels.find((e) => e.number === this._settings.defaultLevel);
      if (t)
        return t;
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
    const t = [
      {
        number: 1,
        tag: "H1",
        svg: jl
      },
      {
        number: 2,
        tag: "H2",
        svg: Ul
      },
      {
        number: 3,
        tag: "H3",
        svg: Wl
      },
      {
        number: 4,
        tag: "H4",
        svg: ql
      },
      {
        number: 5,
        tag: "H5",
        svg: Yl
      },
      {
        number: 6,
        tag: "H6",
        svg: Kl
      }
    ];
    return this._settings.levels ? t.filter(
      (e) => this._settings.levels.includes(e.number)
    ) : t;
  }
  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(t) {
    const e = t.detail;
    if ("data" in e) {
      const i = e.data;
      let o = this.defaultLevel.number;
      switch (i.tagName) {
        case "H1":
          o = 1;
          break;
        case "H2":
          o = 2;
          break;
        case "H3":
          o = 3;
          break;
        case "H4":
          o = 4;
          break;
        case "H5":
          o = 5;
          break;
        case "H6":
          o = 6;
          break;
      }
      this._settings.levels && (o = this._settings.levels.reduce((n, r) => Math.abs(r - o) < Math.abs(n - o) ? r : n)), this.data = {
        level: o,
        text: i.innerHTML
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
      icon: Xl,
      title: "Heading"
    };
  }
};
const Gl = {
  levels: [2, 3, 4],
  defaultLevel: 2
}, Jl = Ae({
  Base: Zl,
  type: "header",
  toolbox: {
    title: "Heading",
    icon: V(er)
  },
  config: {
    shortcut: "CMD+SHIFT+H",
    inlineToolbar: !0,
    config: Gl
  },
  render: ({ level: s, text: t }, { trim: e }) => {
    switch (s) {
      case 2:
        return /* @__PURE__ */ p("h2", { innerHTML: e(t) });
      case 3:
        return /* @__PURE__ */ p("h3", { innerHTML: e(t) });
      case 4:
        return /* @__PURE__ */ p("h4", { innerHTML: e(t) });
    }
  },
  parse: (s) => {
    if (s.type === "h2" || s.type === "h3" || s.type === "h4")
      return {
        level: Number(s.type[1]),
        text: s.content.map(ct).join("")
      };
  }
}), Ql = Ut({
  Block: ({ id: s, caption: t }, { selectPhoto: e, getPhotoUrl: i }) => {
    const o = new tt({ id: s, url: "" });
    i(s).then((r) => o.set({ id: s, url: r }));
    function n() {
      e(1).then((r) => {
        r && r.length > 0 && o.set(r[0]);
      });
    }
    return /* @__PURE__ */ T(Lt, { className: "ImageCard", children: [
      /* @__PURE__ */ p("div", { id: "body", children: o(({ id: r, url: a }) => r && a ? /* @__PURE__ */ p("img", { id: r, src: a, onclick: n }) : /* @__PURE__ */ p(at, { onclick: n, children: "Select Photo" })) }),
      /* @__PURE__ */ p(mt, { id: "caption", placeholder: "Caption", children: t })
    ] });
  },
  type: "image-card",
  title: "Image",
  icon: V(ir),
  config: { inlineToolbar: !0 },
  validate: (s) => !!s.id,
  render: ({ id: s, caption: t, wide: e }, { trim: i }) => /* @__PURE__ */ T("image-card", { attributes: { wide: e }, children: [
    /* @__PURE__ */ p("article-photo", { attributes: { id: s } }),
    t && /* @__PURE__ */ p("figcaption", { innerHTML: i(t) })
  ] }),
  parse: (s) => {
    var t, e;
    if (s.type === "image-card") {
      const { src: i, id: o } = s.content[0].attributes, n = ((t = s.content[1]) == null ? void 0 : t.content) ?? [];
      return {
        id: o,
        src: i,
        // @ts-expect-error TODO: assert type
        caption: n.map(ct).join(""),
        wide: (e = s.attributes) == null ? void 0 : e.wide
      };
    }
  },
  save: ({ q: s, block: t, html: e }) => {
    var i, o;
    return {
      id: (i = s("img")) == null ? void 0 : i.id,
      src: (o = s("img")) == null ? void 0 : o.src,
      wide: typeof t.dataset.wide == "boolean",
      caption: e("#caption")
    };
  }
}), tc = Ut({
  // eslint-disable-next-line no-empty-pattern
  Block: ({}) => /* @__PURE__ */ p(Lt, { className: "line", children: /* @__PURE__ */ p("hr", {}) }),
  type: "line",
  title: "Line",
  icon: V(rr),
  render: () => /* @__PURE__ */ p("hr", {}),
  parse: (s) => {
    if (s.type == "hr")
      return {};
  },
  save: () => ({})
}), ec = Ut({
  Block: ({ label: s, href: t }) => /* @__PURE__ */ T(Lt, { className: "LinkButton", children: [
    /* @__PURE__ */ p(V, { icon: _i }),
    /* @__PURE__ */ T("div", { className: "main", children: [
      /* @__PURE__ */ T("div", { className: "row", children: [
        /* @__PURE__ */ p("span", { className: "label", children: "href: " }),
        /* @__PURE__ */ p(mt, { flat: !0, id: "href", placeholder: "href", children: t })
      ] }),
      /* @__PURE__ */ T("div", { className: "row", children: [
        /* @__PURE__ */ p("span", { className: "label", children: "label: " }),
        /* @__PURE__ */ p(mt, { flat: !0, id: "label", placeholder: "Label", children: s })
      ] })
    ] })
  ] }),
  type: "link-button",
  title: "Link Button",
  icon: V(_i),
  validate: (s) => !!(s.href && s.label),
  config: {
    inlineToolbar: !0
  },
  render: ({ label: s, href: t }, { trim: e }) => /* @__PURE__ */ p("link-button", { attributes: { href: e(t) }, innerHTML: e(s) }),
  parse: (s) => {
    var t;
    if (s.type == "link-button")
      return {
        href: ((t = s.attributes) == null ? void 0 : t.href) ?? "",
        label: s.content.map(ct).join("")
      };
  },
  save: ({ text: s, html: t }) => ({
    href: s("#href"),
    label: t("#label")
  })
});
(function() {
  try {
    if (typeof document < "u") {
      var s = document.createElement("style");
      s.appendChild(document.createTextNode(".cdx-list{margin:0;padding-left:40px;outline:none}.cdx-list__item{padding:5.5px 0 5.5px 3px;line-height:1.6em}.cdx-list--unordered{list-style:disc}.cdx-list--ordered{list-style:decimal}.cdx-list-settings{display:flex}.cdx-list-settings .cdx-settings-button{width:50%}")), document.head.appendChild(s);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
const Xo = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="9" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 17H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 12H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 7H4.99002"/></svg>', ic = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="12" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="12" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="12" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.79999 14L7.79999 7.2135C7.79999 7.12872 7.7011 7.0824 7.63597 7.13668L4.79999 9.5"/></svg>';
class oc {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Allow to use native Enter behaviour
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
      icon: Xo,
      title: "List"
    };
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - tool constructor options
   * @param {ListData} params.data - previously saved data
   * @param {object} params.config - user config for Tool
   * @param {object} params.api - Editor.js API
   * @param {boolean} params.readOnly - read-only mode flag
   */
  constructor({ data: t, config: e, api: i, readOnly: o }) {
    this._elements = {
      wrapper: null
    }, this.api = i, this.readOnly = o, this.settings = [
      {
        name: "unordered",
        label: this.api.i18n.t("Unordered"),
        icon: Xo,
        default: e.defaultStyle === "unordered" || !1
      },
      {
        name: "ordered",
        label: this.api.i18n.t("Ordered"),
        icon: ic,
        default: e.defaultStyle === "ordered" || !0
      }
    ], this._data = {
      style: this.settings.find((n) => n.default === !0).name,
      items: []
    }, this.data = t;
  }
  /**
   * Returns list tag with items
   *
   * @returns {Element}
   * @public
   */
  render() {
    return this._elements.wrapper = this.makeMainTag(this._data.style), this._data.items.length ? this._data.items.forEach((t) => {
      this._elements.wrapper.appendChild(this._make("li", this.CSS.item, {
        innerHTML: t
      }));
    }) : this._elements.wrapper.appendChild(this._make("li", this.CSS.item)), this.readOnly || this._elements.wrapper.addEventListener("keydown", (t) => {
      const [e, i] = [13, 8];
      switch (t.keyCode) {
        case e:
          this.getOutofList(t);
          break;
        case i:
          this.backspace(t);
          break;
      }
    }, !1), this._elements.wrapper;
  }
  /**
   * @returns {ListData}
   * @public
   */
  save() {
    return this.data;
  }
  /**
   * Allow List Tool to be converted to/from other block
   *
   * @returns {{export: Function, import: Function}}
   */
  static get conversionConfig() {
    return {
      /**
       * To create exported string from list, concatenate items by dot-symbol.
       *
       * @param {ListData} data - list data to create a string from thats
       * @returns {string}
       */
      export: (t) => t.items.join(". "),
      /**
       * To create a list from other block's string, just put it at the first item
       *
       * @param {string} string - string to create list tool data from that
       * @returns {ListData}
       */
      import: (t) => ({
        items: [t],
        style: "unordered"
      })
    };
  }
  /**
   * Sanitizer rules
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      style: {},
      items: {
        br: !0
      }
    };
  }
  /**
   * Settings
   *
   * @public
   * @returns {Array}
   */
  renderSettings() {
    return this.settings.map((t) => ({
      ...t,
      isActive: this._data.style === t.name,
      closeOnActivate: !0,
      onActivate: () => this.toggleTune(t.name)
    }));
  }
  /**
   * On paste callback that is fired from Editor
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(t) {
    const e = t.detail.data;
    this.data = this.pasteHandler(e);
  }
  /**
   * List Tool on paste configuration
   *
   * @public
   */
  static get pasteConfig() {
    return {
      tags: ["OL", "UL", "LI"]
    };
  }
  /**
   * Creates main <ul> or <ol> tag depended on style
   *
   * @param {string} style - 'ordered' or 'unordered'
   * @returns {HTMLOListElement|HTMLUListElement}
   */
  makeMainTag(t) {
    const e = t === "ordered" ? this.CSS.wrapperOrdered : this.CSS.wrapperUnordered, i = t === "ordered" ? "ol" : "ul";
    return this._make(i, [this.CSS.baseBlock, this.CSS.wrapper, e], {
      contentEditable: !this.readOnly
    });
  }
  /**
   * Toggles List style
   *
   * @param {string} style - 'ordered'|'unordered'
   */
  toggleTune(t) {
    const e = this.makeMainTag(t);
    for (; this._elements.wrapper.hasChildNodes(); )
      e.appendChild(this._elements.wrapper.firstChild);
    this._elements.wrapper.replaceWith(e), this._elements.wrapper = e, this._data.style = t;
  }
  /**
   * Styles
   *
   * @private
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      wrapper: "cdx-list",
      wrapperOrdered: "cdx-list--ordered",
      wrapperUnordered: "cdx-list--unordered",
      item: "cdx-list__item"
    };
  }
  /**
   * List data setter
   *
   * @param {ListData} listData
   */
  set data(t) {
    t || (t = {}), this._data.style = t.style || this.settings.find((i) => i.default === !0).name, this._data.items = t.items || [];
    const e = this._elements.wrapper;
    e && e.parentNode.replaceChild(this.render(), e);
  }
  /**
   * Return List data
   *
   * @returns {ListData}
   */
  get data() {
    this._data.items = [];
    const t = this._elements.wrapper.querySelectorAll(`.${this.CSS.item}`);
    for (let e = 0; e < t.length; e++)
      t[e].innerHTML.replace("<br>", " ").trim() && this._data.items.push(t[e].innerHTML);
    return this._data;
  }
  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(t, e = null, i = {}) {
    const o = document.createElement(t);
    Array.isArray(e) ? o.classList.add(...e) : e && o.classList.add(e);
    for (const n in i)
      o[n] = i[n];
    return o;
  }
  /**
   * Returns current List item by the caret position
   *
   * @returns {Element}
   */
  get currentItem() {
    let t = window.getSelection().anchorNode;
    return t.nodeType !== Node.ELEMENT_NODE && (t = t.parentNode), t.closest(`.${this.CSS.item}`);
  }
  /**
   * Get out from List Tool
   * by Enter on the empty last item
   *
   * @param {KeyboardEvent} event
   */
  getOutofList(t) {
    const e = this._elements.wrapper.querySelectorAll("." + this.CSS.item);
    if (e.length < 2)
      return;
    const i = e[e.length - 1], o = this.currentItem;
    o === i && !i.textContent.trim().length && (o.parentElement.removeChild(o), this.api.blocks.insert(), this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex()), t.preventDefault(), t.stopPropagation());
  }
  /**
   * Handle backspace
   *
   * @param {KeyboardEvent} event
   */
  backspace(t) {
    const e = this._elements.wrapper.querySelectorAll("." + this.CSS.item), i = e[0];
    i && e.length < 2 && !i.innerHTML.replace("<br>", " ").trim() && t.preventDefault();
  }
  /**
   * Select LI content by CMD+A
   *
   * @param {KeyboardEvent} event
   */
  selectItem(t) {
    t.preventDefault();
    const e = window.getSelection(), i = e.anchorNode.parentNode, o = i.closest("." + this.CSS.item), n = new Range();
    n.selectNodeContents(o), e.removeAllRanges(), e.addRange(n);
  }
  /**
   * Handle UL, OL and LI tags paste and returns List data
   *
   * @param {HTMLUListElement|HTMLOListElement|HTMLLIElement} element
   * @returns {ListData}
   */
  pasteHandler(t) {
    const { tagName: e } = t;
    let i;
    switch (e) {
      case "OL":
        i = "ordered";
        break;
      case "UL":
      case "LI":
        i = "unordered";
    }
    const o = {
      style: i,
      items: []
    };
    if (e === "LI")
      o.items = [t.innerHTML];
    else {
      const n = Array.from(t.querySelectorAll("LI"));
      o.items = n.map((r) => r.innerHTML).filter((r) => !!r.trim());
    }
    return o;
  }
}
const sc = Ae({
  Base: oc,
  type: "list",
  config: {
    inlineToolbar: !0,
    config: {
      defaultStyle: "unordered"
    }
  },
  render: ({ style: s, items: t }, { trim: e }) => {
    const i = s == "ordered" ? "ol" : "ul";
    return /* @__PURE__ */ p(i, { children: t.map((o) => /* @__PURE__ */ p("li", { innerHTML: e(o) })) });
  },
  parse: (s) => {
    if (s.type === "ol" || s.type === "ul")
      return {
        style: s.type === "ul" ? "unordered" : "ordered",
        items: s.content.map(
          (t) => typeof t.content == "string" ? ct(t) : t.content.map(ct)
        )
      };
  }
});
(function() {
  try {
    if (typeof document < "u") {
      var s = document.createElement("style");
      s.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-block:only-of-type .ce-paragraph[data-placeholder-active]:empty:before,.ce-block:only-of-type .ce-paragraph[data-placeholder-active][data-empty=true]:before{content:attr(data-placeholder-active)}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")), document.head.appendChild(s);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
const nc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
function rc(s) {
  const t = document.createElement("div");
  t.innerHTML = s.trim();
  const e = document.createDocumentFragment();
  return e.append(...Array.from(t.childNodes)), e;
}
/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
class ro {
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
  constructor({ data: t, config: e, api: i, readOnly: o }) {
    this.api = i, this.readOnly = o, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = e.placeholder ? e.placeholder : ro.DEFAULT_PLACEHOLDER, this._data = t ?? {}, this._element = null, this._preserveBlank = e.preserveBlank ?? !1;
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(t) {
    if (t.code !== "Backspace" && t.code !== "Delete" || !this._element)
      return;
    const { textContent: e } = this._element;
    e === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  drawView() {
    const t = document.createElement("DIV");
    return t.classList.add(this._CSS.wrapper, this._CSS.block), t.contentEditable = "false", t.dataset.placeholderActive = this.api.i18n.t(this._placeholder), this._data.text && (t.innerHTML = this._data.text), this.readOnly || (t.contentEditable = "true", t.addEventListener("keyup", this.onKeyUp)), t;
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
  merge(t) {
    if (!this._element)
      return;
    this._data.text += t.text;
    const e = rc(t.text);
    this._element.appendChild(e), this._element.normalize();
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(t) {
    return !(t.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(t) {
    return {
      text: t.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {HTMLPasteEvent} event - event with pasted data
   */
  onPaste(t) {
    const e = {
      text: t.detail.data.innerHTML
    };
    this._data = e, window.requestAnimationFrame(() => {
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
      icon: nc,
      title: "Text"
    };
  }
}
const ac = Ae({
  Base: ro,
  type: "paragraph",
  config: {
    inlineToolbar: !0
  },
  render: ({ text: s }, { trim: t }) => /* @__PURE__ */ p("p", { innerHTML: t(s) }),
  toolbox: {
    title: "Text",
    icon: V(pr)
  },
  parse(s) {
    switch (s.type) {
      case "#text":
        return {
          text: s.content
        };
      case "p":
        return {
          text: s.content.map(ct).join("")
        };
    }
  }
}), _o = class _o extends Lt {
  constructor({ img: e, title: i, description: o, button: n }, { selectPhoto: r, getPhotoUrl: a }) {
    super({ className: "ProductCard" });
    I(this, "photo");
    this.photo = new tt({ id: e, url: "" }), a(e).then((c) => this.photo.set({ id: e, url: c }));
    const l = () => {
      r(1).then((c) => {
        c && c.length > 0 && this.photo.set(c[0]);
      });
    };
    Ui(this.body, /* @__PURE__ */ T(oe, { children: [
      this.photo(({ id: c, url: d }) => c && d ? /* @__PURE__ */ p("img", { id: c, src: d, onclick: l }) : /* @__PURE__ */ p(at, { onclick: l, children: "Select Photo" })),
      /* @__PURE__ */ p(mt, { flat: !0, id: "title", placeholder: "Title", children: i }),
      /* @__PURE__ */ p(mt, { flat: !0, id: "description", placeholder: "Description", children: o })
    ] })), n && this.addButton();
  }
  get hasButton() {
    return !!this.querySelector("div.button");
  }
  addButton({ text: e = "", href: i = "" } = {}) {
    this.body.append(/* @__PURE__ */ T("div", { className: "button", children: [
      /* @__PURE__ */ p(mt, { flat: !0, id: "text", placeholder: "Text", children: e }),
      /* @__PURE__ */ p(mt, { flat: !0, id: "href", placeholder: "Link", children: i })
    ] }));
  }
  toggleButton() {
    var e;
    this.hasButton ? (e = this.querySelector("div.button")) == null || e.remove() : this.addButton();
  }
};
customElements.define("ae-product-card", _o);
let Pi = _o;
const lc = Ut({
  Block: (s, t) => new Pi(s, t),
  type: "product-card",
  title: "Product",
  icon: V(hr),
  config: {
    inlineToolbar: !0
  },
  validate: ({ img: s, title: t, description: e }) => !!(s && t && e),
  render: ({ img: s, title: t, description: e, button: i }, { trim: o }) => /* @__PURE__ */ T("product-card", { children: [
    /* @__PURE__ */ p("article-photo", { attributes: { id: s } }),
    /* @__PURE__ */ p("product-card-title", { children: o(t) }),
    /* @__PURE__ */ p("p", { innerHTML: o(e) }),
    i && /* @__PURE__ */ p("a", { href: o(i.href), children: o(i.text) })
  ] }),
  parse: (s) => {
    if (s.type == "product-card") {
      const [t, e, i, o] = s.content;
      return {
        // @ts-expect-error
        img: t.attributes.id,
        // @ts-expect-error
        title: e.content.map(ct).join(""),
        // @ts-expect-error
        description: i.content.map(ct).join(""),
        ...o && {
          button: {
            // @ts-expect-error
            text: o.content.map(ct).join(""),
            // @ts-expect-error
            href: o.attributes.href
          }
        }
      };
    }
  },
  save: ({ block: s, html: t, text: e }) => ({
    img: s.photo.get().id,
    title: t("#title"),
    description: t("#description"),
    ...s.hasButton && {
      button: {
        text: t("#text"),
        href: e("#href")
      }
    }
  }),
  settings: ({ block: s }) => ({
    label: "Button",
    icon: V(_i),
    toggle: !0,
    isActive: s.hasButton,
    onActivate: () => s.toggleButton()
  })
});
(function() {
  try {
    if (typeof document < "u") {
      var s = document.createElement("style");
      s.appendChild(document.createTextNode(".ce-rawtool__textarea{min-height:200px;resize:vertical;border-radius:8px;border:0;background-color:#1e2128;font-family:Menlo,Monaco,Consolas,Courier New,monospace;font-size:12px;line-height:1.6;letter-spacing:-.2px;color:#a1a7b6;overscroll-behavior:contain}")), document.head.appendChild(s);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
const cc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.6954 5C17.912 5 18.8468 6.07716 18.6755 7.28165L17.426 16.0659C17.3183 16.8229 16.7885 17.4522 16.061 17.6873L12.6151 18.8012C12.2152 18.9304 11.7848 18.9304 11.3849 18.8012L7.93898 17.6873C7.21148 17.4522 6.6817 16.8229 6.57403 16.0659L5.32454 7.28165C5.15322 6.07716 6.088 5 7.30461 5H16.6954Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8.4H9L9.42857 11.7939H14.5714L14.3571 13.2788L14.1429 14.7636L12 15.4L9.85714 14.7636L9.77143 14.3394"/></svg>';
/**
 * Raw HTML Tool for CodeX Editor
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
let dc = class yn {
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
      icon: cc,
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
  constructor({ data: t, config: e, api: i, readOnly: o }) {
    this.api = i, this.readOnly = o, this.placeholder = e.placeholder || yn.DEFAULT_PLACEHOLDER, this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: "ce-rawtool",
      textarea: "ce-rawtool__textarea"
    }, this.data = {
      html: t.html || ""
    }, this.textarea = null, this.resizeDebounce = null;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement} this.element - RawTool's wrapper
   * @public
   */
  render() {
    const t = document.createElement("div"), e = 100;
    return this.textarea = document.createElement("textarea"), t.classList.add(this.CSS.baseClass, this.CSS.wrapper), this.textarea.classList.add(this.CSS.textarea, this.CSS.input), this.textarea.textContent = this.data.html, this.textarea.placeholder = this.placeholder, this.readOnly ? this.textarea.disabled = !0 : this.textarea.addEventListener("input", () => {
      this.onInput();
    }), t.appendChild(this.textarea), setTimeout(() => {
      this.resize();
    }, e), t;
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} rawToolsWrapper - RawTool's wrapper, containing textarea with raw HTML code
   * @returns {RawData} - raw HTML code
   * @public
   */
  save(t) {
    return {
      html: t.querySelector("textarea").value
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
};
const hc = Ae({
  Base: dc,
  type: "raw",
  toolbox: {
    title: "HTML",
    icon: V(Qn)
  },
  render: ({ html: s }) => s,
  // anything is valid, so we need to return void
  // and make non parseable data fallback to a raw type
  parse: () => {
  }
});
(function() {
  var s;
  try {
    if (typeof document < "u") {
      var t = document.createElement("style");
      t.nonce = (s = document.head.querySelector("meta[property=csp-nonce]")) == null ? void 0 : s.content, t.appendChild(document.createTextNode('.tc-wrap{--color-background:#f9f9fb;--color-text-secondary:#7b7e89;--color-border:#e8e8eb;--cell-size:34px;--toolbox-icon-size:18px;--toolbox-padding:6px;--toolbox-aiming-field-size:calc(var(--toolbox-icon-size) + var(--toolbox-padding)*2);border-left:0;position:relative;height:100%;width:100%;margin-top:var(--toolbox-icon-size);box-sizing:border-box;display:grid;grid-template-columns:calc(100% - var(--cell-size)) var(--cell-size)}.tc-wrap--readonly{grid-template-columns:100% var(--cell-size)}.tc-wrap svg{vertical-align:top}@media print{.tc-wrap{border-left-color:var(--color-border);border-left-style:solid;border-left-width:1px;grid-template-columns:100% var(--cell-size)}}@media print{.tc-wrap .tc-row:after{display:none}}.tc-table{position:relative;width:100%;height:100%;display:grid;font-size:14px;border-top:1px solid var(--color-border);line-height:1.4}.tc-table:after{width:calc(var(--cell-size));height:100%;left:calc(var(--cell-size)*-1);top:0}.tc-table:after,.tc-table:before{position:absolute;content:""}.tc-table:before{width:100%;height:var(--toolbox-aiming-field-size);top:calc(var(--toolbox-aiming-field-size)*-1);left:0}.tc-table--heading .tc-row:first-child{font-weight:600;border-bottom:2px solid var(--color-border)}.tc-table--heading .tc-row:first-child [contenteditable]:empty:before{content:attr(heading);color:var(--color-text-secondary)}.tc-table--heading .tc-row:first-child:after{bottom:-2px;border-bottom:2px solid var(--color-border)}.tc-add-column,.tc-add-row{display:flex;color:var(--color-text-secondary)}@media print{.tc-add{display:none}}.tc-add-column{padding:4px 0;justify-content:center;border-top:1px solid var(--color-border)}@media print{.tc-add-column{display:none}}.tc-add-row{height:var(--cell-size);align-items:center;padding-left:4px;position:relative}.tc-add-row:before{content:"";position:absolute;right:calc(var(--cell-size)*-1);width:var(--cell-size);height:100%}@media print{.tc-add-row{display:none}}.tc-add-column,.tc-add-row{transition:0s;cursor:pointer;will-change:background-color}.tc-add-column:hover,.tc-add-row:hover{transition:background-color .1s ease;background-color:var(--color-background)}.tc-add-row{margin-top:1px}.tc-add-row:hover:before{transition:.1s;background-color:var(--color-background)}.tc-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(10px,1fr));position:relative;border-bottom:1px solid var(--color-border)}.tc-row:after{content:"";pointer-events:none;position:absolute;width:var(--cell-size);height:100%;bottom:-1px;right:calc(var(--cell-size)*-1);border-bottom:1px solid var(--color-border)}.tc-row--selected{background:var(--color-background)}.tc-row--selected:after{background:var(--color-background)}.tc-cell{border-right:1px solid var(--color-border);padding:6px 12px;overflow:hidden;outline:none;line-break:normal}.tc-cell--selected{background:var(--color-background)}.tc-wrap--readonly .tc-row:after{display:none}.tc-toolbox{--toolbox-padding:6px;--popover-margin:30px;--toggler-click-zone-size:30px;--toggler-dots-color:#7b7e89;--toggler-dots-color-hovered:#1d202b;position:absolute;cursor:pointer;z-index:1;opacity:0;transition:opacity .1s;will-change:left,opacity}.tc-toolbox--column{top:calc(var(--toggler-click-zone-size)*-1);transform:translate(calc(var(--toggler-click-zone-size)*-1/2));will-change:left,opacity}.tc-toolbox--row{left:calc(var(--popover-margin)*-1);transform:translateY(calc(var(--toggler-click-zone-size)*-1/2));margin-top:-1px;will-change:top,opacity}.tc-toolbox--showed{opacity:1}.tc-toolbox .tc-popover{position:absolute;top:0;left:var(--popover-margin)}.tc-toolbox__toggler{display:flex;align-items:center;justify-content:center;width:var(--toggler-click-zone-size);height:var(--toggler-click-zone-size);color:var(--toggler-dots-color);opacity:0;transition:opacity .15s ease;will-change:opacity}.tc-toolbox__toggler:hover{color:var(--toggler-dots-color-hovered)}.tc-toolbox__toggler svg{fill:currentColor}.tc-wrap:hover .tc-toolbox__toggler{opacity:1}.tc-settings .cdx-settings-button{width:50%;margin:0}.tc-popover{--color-border:#eaeaea;--color-background:#fff;--color-background-hover:rgba(232,232,235,.49);--color-background-confirm:#e24a4a;--color-background-confirm-hover:#d54040;--color-text-confirm:#fff;background:var(--color-background);border:1px solid var(--color-border);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;padding:6px;display:none;will-change:opacity,transform}.tc-popover--opened{display:block;animation:menuShowing .1s cubic-bezier(.215,.61,.355,1) forwards}.tc-popover__item{display:flex;align-items:center;padding:2px 14px 2px 2px;border-radius:5px;cursor:pointer;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;user-select:none}.tc-popover__item:hover{background:var(--color-background-hover)}.tc-popover__item:not(:last-of-type){margin-bottom:2px}.tc-popover__item-icon{display:inline-flex;width:26px;height:26px;align-items:center;justify-content:center;background:var(--color-background);border-radius:5px;border:1px solid var(--color-border);margin-right:8px}.tc-popover__item-label{line-height:22px;font-size:14px;font-weight:500}.tc-popover__item--confirm{background:var(--color-background-confirm);color:var(--color-text-confirm)}.tc-popover__item--confirm:hover{background-color:var(--color-background-confirm-hover)}.tc-popover__item--confirm .tc-popover__item-icon{background:var(--color-background-confirm);border-color:#0000001a}.tc-popover__item--confirm .tc-popover__item-icon svg{transition:transform .2s ease-in;transform:rotate(90deg) scale(1.2)}.tc-popover__item--hidden{display:none}@keyframes menuShowing{0%{opacity:0;transform:translateY(-8px) scale(.9)}70%{opacity:1;transform:translateY(2px)}to{transform:translateY(0)}}')), document.head.appendChild(t);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
function ft(s, t, e = {}) {
  const i = document.createElement(s);
  Array.isArray(t) ? i.classList.add(...t) : t && i.classList.add(t);
  for (const o in e)
    Object.prototype.hasOwnProperty.call(e, o) && (i[o] = e[o]);
  return i;
}
function Zo(s) {
  const t = s.getBoundingClientRect();
  return {
    y1: Math.floor(t.top + window.pageYOffset),
    x1: Math.floor(t.left + window.pageXOffset),
    x2: Math.floor(t.right + window.pageXOffset),
    y2: Math.floor(t.bottom + window.pageYOffset)
  };
}
function Go(s, t) {
  const e = Zo(s), i = Zo(t);
  return {
    fromTopBorder: i.y1 - e.y1,
    fromLeftBorder: i.x1 - e.x1,
    fromRightBorder: e.x2 - i.x2,
    fromBottomBorder: e.y2 - i.y2
  };
}
function uc(s, t) {
  const e = s.getBoundingClientRect(), { width: i, height: o, x: n, y: r } = e, { clientX: a, clientY: l } = t;
  return {
    width: i,
    height: o,
    x: a - n,
    y: l - r
  };
}
function Jo(s, t) {
  return t.parentNode.insertBefore(s, t);
}
function Qo(s, t = !0) {
  const e = document.createRange(), i = window.getSelection();
  e.selectNodeContents(s), e.collapse(t), i.removeAllRanges(), i.addRange(e);
}
class ht {
  /**
   * @param {object} options - constructor options
   * @param {PopoverItem[]} options.items - constructor options
   */
  constructor({ items: t }) {
    this.items = t, this.wrapper = void 0, this.itemEls = [];
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
    return this.wrapper = ft("div", ht.CSS.popover), this.items.forEach((t, e) => {
      const i = ft("div", ht.CSS.item), o = ft("div", ht.CSS.itemIcon, {
        innerHTML: t.icon
      }), n = ft("div", ht.CSS.itemLabel, {
        textContent: t.label
      });
      i.dataset.index = e, i.appendChild(o), i.appendChild(n), this.wrapper.appendChild(i), this.itemEls.push(i);
    }), this.wrapper.addEventListener("click", (t) => {
      this.popoverClicked(t);
    }), this.wrapper;
  }
  /**
   * Popover wrapper click listener
   * Used to delegate clicks in items
   *
   * @returns {void}
   */
  popoverClicked(t) {
    const e = t.target.closest(`.${ht.CSS.item}`);
    if (!e)
      return;
    const i = e.dataset.index, o = this.items[i];
    if (o.confirmationRequired && !this.hasConfirmationState(e)) {
      this.setConfirmationState(e);
      return;
    }
    o.onClick();
  }
  /**
   * Enable the confirmation state on passed item
   *
   * @returns {void}
   */
  setConfirmationState(t) {
    t.classList.add(ht.CSS.itemConfirmState);
  }
  /**
   * Disable the confirmation state on passed item
   *
   * @returns {void}
   */
  clearConfirmationState(t) {
    t.classList.remove(ht.CSS.itemConfirmState);
  }
  /**
   * Check if passed item has the confirmation state
   *
   * @returns {boolean}
   */
  hasConfirmationState(t) {
    return t.classList.contains(ht.CSS.itemConfirmState);
  }
  /**
   * Return an opening state
   *
   * @returns {boolean}
   */
  get opened() {
    return this.wrapper.classList.contains(ht.CSS.popoverOpened);
  }
  /**
   * Opens the popover
   *
   * @returns {void}
   */
  open() {
    this.items.forEach((t, e) => {
      typeof t.hideIf == "function" && this.itemEls[e].classList.toggle(ht.CSS.itemHidden, t.hideIf());
    }), this.wrapper.classList.add(ht.CSS.popoverOpened);
  }
  /**
   * Closes the popover
   *
   * @returns {void}
   */
  close() {
    this.wrapper.classList.remove(ht.CSS.popoverOpened), this.itemEls.forEach((t) => {
      this.clearConfirmationState(t);
    });
  }
}
const ts = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>', pc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 9.16666L18.2167 12.5M18.2167 12.5L14.8833 15.8333M18.2167 12.5H10.05C9.16594 12.5 8.31809 12.1488 7.69297 11.5237C7.06785 10.8986 6.71666 10.0507 6.71666 9.16666"/></svg>', gc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.9167 14.9167L11.5833 18.25M11.5833 18.25L8.25 14.9167M11.5833 18.25L11.5833 10.0833C11.5833 9.19928 11.9345 8.35143 12.5596 7.72631C13.1848 7.10119 14.0326 6.75 14.9167 6.75"/></svg>', fc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.13333 14.9167L12.4667 18.25M12.4667 18.25L15.8 14.9167M12.4667 18.25L12.4667 10.0833C12.4667 9.19928 12.1155 8.35143 11.4904 7.72631C10.8652 7.10119 10.0174 6.75 9.13333 6.75"/></svg>', mc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 15.8333L18.2167 12.5M18.2167 12.5L14.8833 9.16667M18.2167 12.5L10.05 12.5C9.16595 12.5 8.31811 12.8512 7.69299 13.4763C7.06787 14.1014 6.71667 14.9493 6.71667 15.8333"/></svg>', vc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.41 9.66H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 9.66H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.31 14.36H9.3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 14.36H14.59"/></svg>', es = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>', bc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>', wc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M14 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><path stroke="currentColor" stroke-width="2" d="M5 14H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>', yc = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
let is = class ie {
  /**
   * Creates toolbox buttons and toolbox menus
   *
   * @param {object} api - Editor.js api
   * @param {PopoverItem[]} items - Editor.js api
   * @param {function} onOpen - callback fired when the Popover is opening
   * @param {function} onClose - callback fired when the Popover is closing
   * @param {string} [cssModifier] - the modifier for the Toolbox. Allows to add some specific styles.
   */
  constructor({ api: t, items: e, onOpen: i, onClose: o, cssModifier: n = "" }) {
    this.api = t, this.items = e, this.onOpen = i, this.onClose = o, this.cssModifier = n, this.popover = null, this.wrapper = this.createToolbox();
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
    const t = ft("div", [
      ie.CSS.toolbox,
      this.cssModifier ? `${ie.CSS.toolbox}--${this.cssModifier}` : ""
    ]);
    t.dataset.mutationFree = "true";
    const e = this.createPopover(), i = this.createToggler();
    return t.appendChild(i), t.appendChild(e), t;
  }
  /**
   * Creates the Toggler
   *
   * @returns {Element}
   */
  createToggler() {
    const t = ft("div", ie.CSS.toggler, {
      innerHTML: vc
    });
    return t.addEventListener("click", () => {
      this.togglerClicked();
    }), t;
  }
  /**
   * Creates the Popover instance and render it
   *
   * @returns {Element}
   */
  createPopover() {
    return this.popover = new ht({
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
  show(t) {
    const e = t();
    Object.entries(e).forEach(([i, o]) => {
      this.wrapper.style[i] = o;
    }), this.wrapper.classList.add(ie.CSS.toolboxShowed);
  }
  /**
   * Hides the Toolbox
   *
   * @returns {void}
   */
  hide() {
    this.popover.close(), this.wrapper.classList.remove(ie.CSS.toolboxShowed);
  }
};
function kc(s, t) {
  let e = 0;
  return function(...i) {
    const o = (/* @__PURE__ */ new Date()).getTime();
    if (!(o - e < s))
      return e = o, t(...i);
  };
}
const z = {
  wrapper: "tc-wrap",
  wrapperReadOnly: "tc-wrap--readonly",
  table: "tc-table",
  row: "tc-row",
  withHeadings: "tc-table--heading",
  rowSelected: "tc-row--selected",
  cell: "tc-cell",
  cellSelected: "tc-cell--selected",
  addRow: "tc-add-row",
  addColumn: "tc-add-column"
};
class xc {
  /**
   * Creates
   *
   * @constructor
   * @param {boolean} readOnly - read-only mode flag
   * @param {object} api - Editor.js API
   * @param {TableData} data - Editor.js API
   * @param {TableConfig} config - Editor.js API
   */
  constructor(t, e, i, o) {
    this.readOnly = t, this.api = e, this.data = i, this.config = o, this.wrapper = null, this.table = null, this.toolboxColumn = this.createColumnToolbox(), this.toolboxRow = this.createRowToolbox(), this.createTableWrapper(), this.hoveredRow = 0, this.hoveredColumn = 0, this.selectedRow = 0, this.selectedColumn = 0, this.tunes = {
      withHeadings: !1
    }, this.resize(), this.fill(), this.focusedCell = {
      row: 0,
      column: 0
    }, this.documentClicked = (n) => {
      const r = n.target.closest(`.${z.table}`) !== null, a = n.target.closest(`.${z.wrapper}`) === null;
      (r || a) && this.hideToolboxes();
      const l = n.target.closest(`.${z.addRow}`), c = n.target.closest(`.${z.addColumn}`);
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
    document.addEventListener("click", this.documentClicked), this.table.addEventListener("mousemove", kc(150, (t) => this.onMouseMoveInTable(t)), { passive: !0 }), this.table.onkeypress = (t) => this.onKeyPressListener(t), this.table.addEventListener("keydown", (t) => this.onKeyDownListener(t)), this.table.addEventListener("focusin", (t) => this.focusInTableListener(t));
  }
  /**
   * Configures and creates the toolbox for manipulating with columns
   *
   * @returns {Toolbox}
   */
  createColumnToolbox() {
    return new is({
      api: this.api,
      cssModifier: "column",
      items: [
        {
          label: this.api.i18n.t("Add column to left"),
          icon: gc,
          onClick: () => {
            this.addColumn(this.selectedColumn, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Add column to right"),
          icon: fc,
          onClick: () => {
            this.addColumn(this.selectedColumn + 1, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Delete column"),
          icon: ts,
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
    return new is({
      api: this.api,
      cssModifier: "row",
      items: [
        {
          label: this.api.i18n.t("Add row above"),
          icon: mc,
          onClick: () => {
            this.addRow(this.selectedRow, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Add row below"),
          icon: pc,
          onClick: () => {
            this.addRow(this.selectedRow + 1, !0), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Delete row"),
          icon: ts,
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
  getCell(t, e) {
    return this.table.querySelectorAll(`.${z.row}:nth-child(${t}) .${z.cell}`)[e - 1];
  }
  /**
   * Get table row by index
   *
   * @param {number} row - row coordinate
   * @returns {HTMLElement}
   */
  getRow(t) {
    return this.table.querySelector(`.${z.row}:nth-child(${t})`);
  }
  /**
   * The parent of the cell which is the row
   *
   * @param {HTMLElement} cell - cell element
   * @returns {HTMLElement}
   */
  getRowByCell(t) {
    return t.parentElement;
  }
  /**
   * Ger row's first cell
   *
   * @param {Element} row - row to find its first cell
   * @returns {Element}
   */
  getRowFirstCell(t) {
    return t.querySelector(`.${z.cell}:first-child`);
  }
  /**
   * Set the sell's content by row and column numbers
   *
   * @param {number} row - cell row coordinate
   * @param {number} column - cell column coordinate
   * @param {string} content - cell HTML content
   */
  setCellContent(t, e, i) {
    const o = this.getCell(t, e);
    o.innerHTML = i;
  }
  /**
   * Add column in table on index place
   * Add cells in each row
   *
   * @param {number} columnIndex - number in the array of columns, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the first cell
   */
  addColumn(t = -1, e = !1) {
    let i = this.numberOfColumns;
    for (let o = 1; o <= this.numberOfRows; o++) {
      let n;
      const r = this.createCell();
      if (t > 0 && t <= i ? (n = this.getCell(o, t), Jo(r, n)) : n = this.getRow(o).appendChild(r), o === 1) {
        const a = this.getCell(o, t > 0 ? t : i + 1);
        a && e && Qo(a);
      }
    }
    this.addHeadingAttrToFirstRow();
  }
  /**
   * Add row in table on index place
   *
   * @param {number} index - number in the array of rows, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the inserted row
   * @returns {HTMLElement} row
   */
  addRow(t = -1, e = !1) {
    let i, o = ft("div", z.row);
    this.tunes.withHeadings && this.removeHeadingAttrFromFirstRow();
    let n = this.numberOfColumns;
    if (t > 0 && t <= this.numberOfRows) {
      let a = this.getRow(t);
      i = Jo(o, a);
    } else
      i = this.table.appendChild(o);
    this.fillRow(i, n), this.tunes.withHeadings && this.addHeadingAttrToFirstRow();
    const r = this.getRowFirstCell(i);
    return r && e && Qo(r), i;
  }
  /**
   * Delete a column by index
   *
   * @param {number} index
   */
  deleteColumn(t) {
    for (let e = 1; e <= this.numberOfRows; e++) {
      const i = this.getCell(e, t);
      if (!i)
        return;
      i.remove();
    }
  }
  /**
   * Delete a row by index
   *
   * @param {number} index
   */
  deleteRow(t) {
    this.getRow(t).remove(), this.addHeadingAttrToFirstRow();
  }
  /**
   * Create a wrapper containing a table, toolboxes
   * and buttons for adding rows and columns
   *
   * @returns {HTMLElement} wrapper - where all buttons for a table and the table itself will be
   */
  createTableWrapper() {
    if (this.wrapper = ft("div", z.wrapper), this.table = ft("div", z.table), this.readOnly && this.wrapper.classList.add(z.wrapperReadOnly), this.wrapper.appendChild(this.toolboxRow.element), this.wrapper.appendChild(this.toolboxColumn.element), this.wrapper.appendChild(this.table), !this.readOnly) {
      const t = ft("div", z.addColumn, {
        innerHTML: es
      }), e = ft("div", z.addRow, {
        innerHTML: es
      });
      this.wrapper.appendChild(t), this.wrapper.appendChild(e);
    }
  }
  /**
   * Returns the size of the table based on initial data or config "size" property
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  computeInitialSize() {
    const t = this.data && this.data.content, e = Array.isArray(t), i = e ? t.length : !1, o = e ? t.length : void 0, n = i ? t[0].length : void 0, r = Number.parseInt(this.config && this.config.rows), a = Number.parseInt(this.config && this.config.cols), l = !isNaN(r) && r > 0 ? r : void 0, c = !isNaN(a) && a > 0 ? a : void 0;
    return {
      rows: o || l || 2,
      cols: n || c || 2
    };
  }
  /**
   * Resize table to match config size or transmitted data size
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  resize() {
    const { rows: t, cols: e } = this.computeInitialSize();
    for (let i = 0; i < t; i++)
      this.addRow();
    for (let i = 0; i < e; i++)
      this.addColumn();
  }
  /**
   * Fills the table with data passed to the constructor
   *
   * @returns {void}
   */
  fill() {
    const t = this.data;
    if (t && t.content)
      for (let e = 0; e < t.content.length; e++)
        for (let i = 0; i < t.content[e].length; i++)
          this.setCellContent(e + 1, i + 1, t.content[e][i]);
  }
  /**
   * Fills a row with cells
   *
   * @param {HTMLElement} row - row to fill
   * @param {number} numberOfColumns - how many cells should be in a row
   */
  fillRow(t, e) {
    for (let i = 1; i <= e; i++) {
      const o = this.createCell();
      t.appendChild(o);
    }
  }
  /**
   * Creating a cell element
   *
   * @return {Element}
   */
  createCell() {
    return ft("div", z.cell, {
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
    return this.numberOfRows ? this.table.querySelectorAll(`.${z.row}:first-child .${z.cell}`).length : 0;
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
  onMouseMoveInTable(t) {
    const { row: e, column: i } = this.getHoveredCell(t);
    this.hoveredColumn = i, this.hoveredRow = e, this.updateToolboxesPosition();
  }
  /**
   * Prevents default Enter behaviors
   * Adds Shift+Enter processing
   *
   * @param {KeyboardEvent} event - keypress event
   */
  onKeyPressListener(t) {
    if (t.key === "Enter") {
      if (t.shiftKey)
        return !0;
      this.moveCursorToNextRow();
    }
    return t.key !== "Enter";
  }
  /**
   * Prevents tab keydown event from bubbling
   * so that it only works inside the table
   *
   * @param {KeyboardEvent} event - keydown event
   */
  onKeyDownListener(t) {
    t.key === "Tab" && t.stopPropagation();
  }
  /**
   * Set the coordinates of the cell that the focus has moved to
   *
   * @param {FocusEvent} event - focusin event
   */
  focusInTableListener(t) {
    const e = t.target, i = this.getRowByCell(e);
    this.focusedCell = {
      row: Array.from(this.table.querySelectorAll(`.${z.row}`)).indexOf(i) + 1,
      column: Array.from(i.querySelectorAll(`.${z.cell}`)).indexOf(e) + 1
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
    const { row: t, column: e } = this.focusedCell;
    return this.getCell(t, e);
  }
  /**
   * Update toolboxes position
   *
   * @param {number} row - hovered row
   * @param {number} column - hovered column
   */
  updateToolboxesPosition(t = this.hoveredRow, e = this.hoveredColumn) {
    this.isColumnMenuShowing || e > 0 && e <= this.numberOfColumns && this.toolboxColumn.show(() => ({
      left: `calc((100% - var(--cell-size)) / (${this.numberOfColumns} * 2) * (1 + (${e} - 1) * 2))`
    })), this.isRowMenuShowing || t > 0 && t <= this.numberOfRows && this.toolboxRow.show(() => {
      const i = this.getRow(t), { fromTopBorder: o } = Go(this.table, i), { height: n } = i.getBoundingClientRect();
      return {
        top: `${Math.ceil(o + n / 2)}px`
      };
    });
  }
  /**
   * Makes the first row headings
   *
   * @param {boolean} withHeadings - use headings row or not
   */
  setHeadingsSetting(t) {
    this.tunes.withHeadings = t, t ? (this.table.classList.add(z.withHeadings), this.addHeadingAttrToFirstRow()) : (this.table.classList.remove(z.withHeadings), this.removeHeadingAttrFromFirstRow());
  }
  /**
   * Adds an attribute for displaying the placeholder in the cell
   */
  addHeadingAttrToFirstRow() {
    for (let t = 1; t <= this.numberOfColumns; t++) {
      let e = this.getCell(1, t);
      e && e.setAttribute("heading", this.api.i18n.t("Heading"));
    }
  }
  /**
   * Removes an attribute for displaying the placeholder in the cell
   */
  removeHeadingAttrFromFirstRow() {
    for (let t = 1; t <= this.numberOfColumns; t++) {
      let e = this.getCell(1, t);
      e && e.removeAttribute("heading");
    }
  }
  /**
   * Add effect of a selected row
   *
   * @param {number} index
   */
  selectRow(t) {
    const e = this.getRow(t);
    e && (this.selectedRow = t, e.classList.add(z.rowSelected));
  }
  /**
   * Remove effect of a selected row
   */
  unselectRow() {
    if (this.selectedRow <= 0)
      return;
    const t = this.table.querySelector(`.${z.rowSelected}`);
    t && t.classList.remove(z.rowSelected), this.selectedRow = 0;
  }
  /**
   * Add effect of a selected column
   *
   * @param {number} index
   */
  selectColumn(t) {
    for (let e = 1; e <= this.numberOfRows; e++) {
      const i = this.getCell(e, t);
      i && i.classList.add(z.cellSelected);
    }
    this.selectedColumn = t;
  }
  /**
   * Remove effect of a selected column
   */
  unselectColumn() {
    if (this.selectedColumn <= 0)
      return;
    let t = this.table.querySelectorAll(`.${z.cellSelected}`);
    Array.from(t).forEach((e) => {
      e.classList.remove(z.cellSelected);
    }), this.selectedColumn = 0;
  }
  /**
   * Calculates the row and column that the cursor is currently hovering over
   * The search was optimized from O(n) to O (log n) via bin search to reduce the number of calculations
   *
   * @param {Event} event - mousemove event
   * @returns hovered cell coordinates as an integer row and column
   */
  getHoveredCell(t) {
    let e = this.hoveredRow, i = this.hoveredColumn;
    const { width: o, height: n, x: r, y: a } = uc(this.table, t);
    return r >= 0 && (i = this.binSearch(
      this.numberOfColumns,
      (l) => this.getCell(1, l),
      ({ fromLeftBorder: l }) => r < l,
      ({ fromRightBorder: l }) => r > o - l
    )), a >= 0 && (e = this.binSearch(
      this.numberOfRows,
      (l) => this.getCell(l, 1),
      ({ fromTopBorder: l }) => a < l,
      ({ fromBottomBorder: l }) => a > n - l
    )), {
      row: e || this.hoveredRow,
      column: i || this.hoveredColumn
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
  binSearch(t, e, i, o) {
    let n = 0, r = t + 1, a = 0, l;
    for (; n < r - 1 && a < 10; ) {
      l = Math.ceil((n + r) / 2);
      const c = e(l), d = Go(this.table, c);
      if (i(d))
        r = l;
      else if (o(d))
        n = l;
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
    const t = [];
    for (let e = 1; e <= this.numberOfRows; e++) {
      const i = this.table.querySelector(`.${z.row}:nth-child(${e})`), o = Array.from(i.querySelectorAll(`.${z.cell}`));
      o.every((n) => !n.textContent.trim()) || t.push(o.map((n) => n.innerHTML));
    }
    return t;
  }
  /**
   * Remove listeners on the document
   */
  destroy() {
    document.removeEventListener("click", this.documentClicked);
  }
}
class _c {
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
  constructor({ data: t, config: e, api: i, readOnly: o }) {
    this.api = i, this.readOnly = o, this.config = e, this.data = {
      withHeadings: this.getConfig("withHeadings", !1, t),
      content: t && t.content ? t.content : []
    }, this.table = null;
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
      icon: yc,
      title: "Table"
    };
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this.table = new xc(this.readOnly, this.api, this.data, this.config), this.container = ft("div", this.api.styles.block), this.container.appendChild(this.table.getWrapper()), this.table.setHeadingsSetting(this.data.withHeadings), this.container;
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
        icon: bc,
        isActive: this.data.withHeadings,
        closeOnActivate: !0,
        toggle: !0,
        onActivate: () => {
          this.data.withHeadings = !0, this.table.setHeadingsSetting(this.data.withHeadings);
        }
      },
      {
        label: this.api.i18n.t("Without headings"),
        icon: wc,
        isActive: !this.data.withHeadings,
        closeOnActivate: !0,
        toggle: !0,
        onActivate: () => {
          this.data.withHeadings = !1, this.table.setHeadingsSetting(this.data.withHeadings);
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
    const t = this.table.getData();
    return {
      withHeadings: this.data.withHeadings,
      content: t
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
  getConfig(t, e = void 0, i = void 0) {
    const o = this.data || i;
    return o ? o[t] ? o[t] : e : this.config && this.config[t] ? this.config[t] : e;
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
  onPaste(t) {
    const e = t.detail.data, i = e.querySelector(":scope > thead, tr:first-of-type th"), o = Array.from(e.querySelectorAll("tr")).map((n) => Array.from(n.querySelectorAll("th, td")).map((r) => r.innerHTML));
    this.data = {
      withHeadings: i !== null,
      content: o
    }, this.table.wrapper && this.table.wrapper.replaceWith(this.render());
  }
}
const Ec = Ae({
  Base: _c,
  config: {
    inlineToolbar: !0,
    config: {
      rows: 2,
      cols: 3,
      withHeadings: !1
    }
  },
  type: "table",
  toolbox: {
    title: "Table",
    icon: V(dr)
  },
  render: ({ content: s, withHeadings: t }, { trim: e }) => /* @__PURE__ */ T("table", { children: [
    t && /* @__PURE__ */ p("thead", { children: /* @__PURE__ */ p("tr", { children: s[0].map((i) => /* @__PURE__ */ p("td", { innerHTML: e(i) })) }) }),
    /* @__PURE__ */ p("tbody", { children: s.slice(t ? 1 : 0).map((i) => /* @__PURE__ */ p("tr", { children: i.map((o) => /* @__PURE__ */ p("td", { innerHTML: e(o) })) })) })
  ] }),
  parse: (s) => {
    if (s.type == "table") {
      const t = (i) => i, e = t(t(s.content)[0].content);
      return s.content.length > 1 && e.push(...t(t(s.content)[1].content)), {
        withHeadings: s.content.length > 1,
        content: e.map((i) => t(i.content).map(
          (o) => t(o.content).map(ct).join("")
        ))
      };
    }
  }
});
class Cc extends HTMLElement {
  constructor() {
    super();
    I(this, "valueInput");
    I(this, "editor");
    I(this, "initial");
    I(this, "_content");
    I(this, "plugins");
    I(this, "renderers");
    I(this, "parsers");
    const e = [
      Vl,
      Hl,
      Fl,
      zl,
      Jl,
      Ql,
      tc,
      ec,
      sc,
      ac,
      lc,
      hc,
      Ec,
      ...window.ExtraPlugins || []
    ];
    this.plugins = e.map((i) => i({
      onChange: this.submit.bind(this),
      selectPhoto: Cs(this),
      getPhotoUrl: Es(this)
    })), this.renderers = this.plugins.reduce((i, o) => ({
      ...i,
      [o.type]: o.render
    }), {}), this.parsers = this.plugins.map((i) => i.parse), this.initial = this.innerHTML, this.innerHTML = "";
  }
  get content() {
    return this._content;
  }
  async submit() {
    this._content = await this.getContent(), this.valueInput.value = JSON.stringify(this._content), this.dispatchEvent(new Event("input"));
  }
  setContent(e) {
    const i = new DOMParser().parseFromString(e, "text/html");
    this.editor.blocks.insertMany(Ss(i.body).map((o) => {
      try {
        for (const n of this.parsers) {
          const r = n(o);
          if (r)
            return r;
        }
      } catch (n) {
        console.error("could not parse node", n);
      }
      return {
        type: "raw",
        data: {
          html: ct(o)
        }
      };
    })), this.getContent().then((o) => this.valueInput.value = JSON.stringify(o));
  }
  render(e) {
    return e.map(({ type: i, data: o }) => this.renderers[i](o)).join("");
  }
  async getContent() {
    const { blocks: e } = await this.editor.save(), [i, ...o] = _r(
      e,
      (n) => n.type === "header" && n.data.level === 2
    );
    return {
      excerpt: this.render(i),
      sections: o.map(([n, ...r], a) => ({
        order: a,
        title: n.data.text,
        content: this.render(r)
      }))
    };
  }
  connectedCallback() {
    this.editor = new Nl({
      holder: this,
      tools: this.plugins.reduce((e, i) => ({ ...e, ...i.tool }), {}),
      onReady: () => {
        this.classList.add("ready"), this.setContent(this.initial);
      }
    }), this.valueInput = Object.assign(document.createElement("input"), {
      type: "hidden",
      name: this.getAttribute("name")
    }), this.append(this.valueInput);
  }
  disconnectedCallback() {
    this.editor.destroy();
  }
}
window.addEventListener("load", () => {
  customElements.define("article-editor", Cc);
});
const Tc = 1e3;
var Qe, kn;
const Eo = class Eo extends HTMLElement {
  constructor() {
    super(...arguments);
    ge(this, Qe);
    I(this, "state", new tt(!1));
    I(this, "debounce");
    I(this, "form");
    I(this, "articleId");
    I(this, "render", (e) => /* @__PURE__ */ T("div", { id: "content-header", style: "display: flex", children: [
      /* @__PURE__ */ p("input", { setup: this.setup.bind(this), value: e }),
      /* @__PURE__ */ p("div", { style: "display: flex; font-size: large;", children: this.state(Mo(this, Qe, kn).bind(this)) })
    ] }));
  }
  async submit() {
    this.state.set(!0), clearTimeout(this.debounce), this.debounce = setTimeout(async () => {
      var e;
      try {
        const i = await fetch(this.form.action, {
          method: "POST",
          body: new FormData(this.form)
        });
        if (i.ok)
          this.state.set(!1), console.log((e = document.querySelector("article-editor")) == null ? void 0 : e.content), this.form.action.includes("/add") && (window.location.href = this.form.action.replace("/add/", `/${this.articleId}/change/`));
        else {
          const o = new DOMParser().parseFromString(await i.text(), "text/html");
          this.state.set(o.querySelector("pre.exception_value").innerHTML);
        }
      } catch (i) {
        console.error(i), this.state.set(`Error: ${i instanceof Error ? i.message : i}`);
      }
    }, Tc);
  }
  connectedCallback() {
    const e = JSON.parse(this.getAttribute("attributes"));
    this.form = this.closest("form"), this.articleId = e.article.pk;
    const i = this.querySelector("article-editor"), o = this.closest("form");
    i && o && (i.addEventListener("submit", this.submit.bind(this)), this.form.addEventListener("input", this.submit.bind(this)), this.form = o), document.addEventListener("DOMContentLoaded", () => {
      var r, a;
      const n = document.querySelector("div#content");
      n && ((r = n.querySelector("h1")) == null || r.remove(), (a = n.querySelector("h2")) == null || a.remove(), n.prepend(this.render(e.article.fields.title)));
    });
  }
  setup(e) {
    this.append(/* @__PURE__ */ p(
      "input",
      {
        setup: (i) => e.addEventListener("input", () => {
          i.value = e.value, this.submit();
        }),
        type: "hidden",
        name: "title",
        id: "id_title",
        value: e.value
      }
    ));
  }
};
Qe = new WeakSet(), kn = function(e) {
  switch (e) {
    case !0:
      return /* @__PURE__ */ T(oe, { children: [
        /* @__PURE__ */ p(V, { icon: sr, className: "spinner" }),
        /* @__PURE__ */ p("span", { children: "Loading" })
      ] });
    case !1:
      return /* @__PURE__ */ T(oe, { children: [
        /* @__PURE__ */ p(V, { icon: lr }),
        /* @__PURE__ */ p("span", { children: "Saved" })
      ] });
    default:
      return /* @__PURE__ */ T(oe, { children: [
        /* @__PURE__ */ p(V, { icon: ur }),
        /* @__PURE__ */ T("span", { children: [
          "Server Error: ",
          e
        ] })
      ] });
  }
}, customElements.define("article-form", Eo);
let os = Eo;
const ss = Math.min, Ce = Math.max, Ze = Math.round, $t = (s) => ({
  x: s,
  y: s
});
function xn(s) {
  return s.split("-")[0];
}
function Sc(s) {
  return s.split("-")[1];
}
function Bc(s) {
  return s === "x" ? "y" : "x";
}
function Ic(s) {
  return s === "y" ? "height" : "width";
}
function _n(s) {
  return ["top", "bottom"].includes(xn(s)) ? "y" : "x";
}
function Lc(s) {
  return Bc(_n(s));
}
function En(s) {
  const {
    x: t,
    y: e,
    width: i,
    height: o
  } = s;
  return {
    width: i,
    height: o,
    top: e,
    left: t,
    right: t + i,
    bottom: e + o,
    x: t,
    y: e
  };
}
function ns(s, t, e) {
  let {
    reference: i,
    floating: o
  } = s;
  const n = _n(t), r = Lc(t), a = Ic(r), l = xn(t), c = n === "y", d = i.x + i.width / 2 - o.width / 2, h = i.y + i.height / 2 - o.height / 2, g = i[a] / 2 - o[a] / 2;
  let v;
  switch (l) {
    case "top":
      v = {
        x: d,
        y: i.y - o.height
      };
      break;
    case "bottom":
      v = {
        x: d,
        y: i.y + i.height
      };
      break;
    case "right":
      v = {
        x: i.x + i.width,
        y: h
      };
      break;
    case "left":
      v = {
        x: i.x - o.width,
        y: h
      };
      break;
    default:
      v = {
        x: i.x,
        y: i.y
      };
  }
  switch (Sc(t)) {
    case "start":
      v[r] -= g * (e && c ? -1 : 1);
      break;
    case "end":
      v[r] += g * (e && c ? -1 : 1);
      break;
  }
  return v;
}
const Mc = async (s, t, e) => {
  const {
    placement: i = "bottom",
    strategy: o = "absolute",
    middleware: n = [],
    platform: r
  } = e, a = n.filter(Boolean), l = await (r.isRTL == null ? void 0 : r.isRTL(t));
  let c = await r.getElementRects({
    reference: s,
    floating: t,
    strategy: o
  }), {
    x: d,
    y: h
  } = ns(c, i, l), g = i, v = {}, f = 0;
  for (let w = 0; w < a.length; w++) {
    const {
      name: _,
      fn: L
    } = a[w], {
      x: R,
      y: $,
      data: j,
      reset: H
    } = await L({
      x: d,
      y: h,
      initialPlacement: i,
      placement: g,
      strategy: o,
      middlewareData: v,
      rects: c,
      platform: r,
      elements: {
        reference: s,
        floating: t
      }
    });
    d = R ?? d, h = $ ?? h, v = {
      ...v,
      [_]: {
        ...v[_],
        ...j
      }
    }, H && f <= 50 && (f++, typeof H == "object" && (H.placement && (g = H.placement), H.rects && (c = H.rects === !0 ? await r.getElementRects({
      reference: s,
      floating: t,
      strategy: o
    }) : H.rects), {
      x: d,
      y: h
    } = ns(c, g, l)), w = -1);
  }
  return {
    x: d,
    y: h,
    placement: g,
    strategy: o,
    middlewareData: v
  };
};
function ii() {
  return typeof window < "u";
}
function he(s) {
  return Cn(s) ? (s.nodeName || "").toLowerCase() : "#document";
}
function bt(s) {
  var t;
  return (s == null || (t = s.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Nt(s) {
  var t;
  return (t = (Cn(s) ? s.ownerDocument : s.document) || window.document) == null ? void 0 : t.documentElement;
}
function Cn(s) {
  return ii() ? s instanceof Node || s instanceof bt(s).Node : !1;
}
function Et(s) {
  return ii() ? s instanceof Element || s instanceof bt(s).Element : !1;
}
function Mt(s) {
  return ii() ? s instanceof HTMLElement || s instanceof bt(s).HTMLElement : !1;
}
function rs(s) {
  return !ii() || typeof ShadowRoot > "u" ? !1 : s instanceof ShadowRoot || s instanceof bt(s).ShadowRoot;
}
function Re(s) {
  const {
    overflow: t,
    overflowX: e,
    overflowY: i,
    display: o
  } = Ct(s);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + e) && !["inline", "contents"].includes(o);
}
function Ac(s) {
  return ["table", "td", "th"].includes(he(s));
}
function oi(s) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return s.matches(t);
    } catch {
      return !1;
    }
  });
}
function ao(s) {
  const t = lo(), e = Et(s) ? Ct(s) : s;
  return e.transform !== "none" || e.perspective !== "none" || (e.containerType ? e.containerType !== "normal" : !1) || !t && (e.backdropFilter ? e.backdropFilter !== "none" : !1) || !t && (e.filter ? e.filter !== "none" : !1) || ["transform", "perspective", "filter"].some((i) => (e.willChange || "").includes(i)) || ["paint", "layout", "strict", "content"].some((i) => (e.contain || "").includes(i));
}
function Rc(s) {
  let t = zt(s);
  for (; Mt(t) && !le(t); ) {
    if (ao(t))
      return t;
    if (oi(t))
      return null;
    t = zt(t);
  }
  return null;
}
function lo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
function le(s) {
  return ["html", "body", "#document"].includes(he(s));
}
function Ct(s) {
  return bt(s).getComputedStyle(s);
}
function si(s) {
  return Et(s) ? {
    scrollLeft: s.scrollLeft,
    scrollTop: s.scrollTop
  } : {
    scrollLeft: s.scrollX,
    scrollTop: s.scrollY
  };
}
function zt(s) {
  if (he(s) === "html")
    return s;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    s.assignedSlot || // DOM Element detected.
    s.parentNode || // ShadowRoot detected.
    rs(s) && s.host || // Fallback.
    Nt(s)
  );
  return rs(t) ? t.host : t;
}
function Tn(s) {
  const t = zt(s);
  return le(t) ? s.ownerDocument ? s.ownerDocument.body : s.body : Mt(t) && Re(t) ? t : Tn(t);
}
function Oi(s, t, e) {
  var i;
  t === void 0 && (t = []), e === void 0 && (e = !0);
  const o = Tn(s), n = o === ((i = s.ownerDocument) == null ? void 0 : i.body), r = bt(o);
  if (n) {
    const a = Ni(r);
    return t.concat(r, r.visualViewport || [], Re(o) ? o : [], a && e ? Oi(a) : []);
  }
  return t.concat(o, Oi(o, [], e));
}
function Ni(s) {
  return s.parent && Object.getPrototypeOf(s.parent) ? s.frameElement : null;
}
function Sn(s) {
  const t = Ct(s);
  let e = parseFloat(t.width) || 0, i = parseFloat(t.height) || 0;
  const o = Mt(s), n = o ? s.offsetWidth : e, r = o ? s.offsetHeight : i, a = Ze(e) !== n || Ze(i) !== r;
  return a && (e = n, i = r), {
    width: e,
    height: i,
    $: a
  };
}
function Bn(s) {
  return Et(s) ? s : s.contextElement;
}
function ne(s) {
  const t = Bn(s);
  if (!Mt(t))
    return $t(1);
  const e = t.getBoundingClientRect(), {
    width: i,
    height: o,
    $: n
  } = Sn(t);
  let r = (n ? Ze(e.width) : e.width) / i, a = (n ? Ze(e.height) : e.height) / o;
  return (!r || !Number.isFinite(r)) && (r = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: r,
    y: a
  };
}
const Pc = /* @__PURE__ */ $t(0);
function In(s) {
  const t = bt(s);
  return !lo() || !t.visualViewport ? Pc : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Oc(s, t, e) {
  return t === void 0 && (t = !1), !e || t && e !== bt(s) ? !1 : t;
}
function Be(s, t, e, i) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  const o = s.getBoundingClientRect(), n = Bn(s);
  let r = $t(1);
  t && (i ? Et(i) && (r = ne(i)) : r = ne(s));
  const a = Oc(n, e, i) ? In(n) : $t(0);
  let l = (o.left + a.x) / r.x, c = (o.top + a.y) / r.y, d = o.width / r.x, h = o.height / r.y;
  if (n) {
    const g = bt(n), v = i && Et(i) ? bt(i) : i;
    let f = g, w = Ni(f);
    for (; w && i && v !== f; ) {
      const _ = ne(w), L = w.getBoundingClientRect(), R = Ct(w), $ = L.left + (w.clientLeft + parseFloat(R.paddingLeft)) * _.x, j = L.top + (w.clientTop + parseFloat(R.paddingTop)) * _.y;
      l *= _.x, c *= _.y, d *= _.x, h *= _.y, l += $, c += j, f = bt(w), w = Ni(f);
    }
  }
  return En({
    width: d,
    height: h,
    x: l,
    y: c
  });
}
function Nc(s) {
  let {
    elements: t,
    rect: e,
    offsetParent: i,
    strategy: o
  } = s;
  const n = o === "fixed", r = Nt(i), a = t ? oi(t.floating) : !1;
  if (i === r || a && n)
    return e;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = $t(1);
  const d = $t(0), h = Mt(i);
  if ((h || !h && !n) && ((he(i) !== "body" || Re(r)) && (l = si(i)), Mt(i))) {
    const g = Be(i);
    c = ne(i), d.x = g.x + i.clientLeft, d.y = g.y + i.clientTop;
  }
  return {
    width: e.width * c.x,
    height: e.height * c.y,
    x: e.x * c.x - l.scrollLeft * c.x + d.x,
    y: e.y * c.y - l.scrollTop * c.y + d.y
  };
}
function Dc(s) {
  return Array.from(s.getClientRects());
}
function Di(s, t) {
  const e = si(s).scrollLeft;
  return t ? t.left + e : Be(Nt(s)).left + e;
}
function Vc(s) {
  const t = Nt(s), e = si(s), i = s.ownerDocument.body, o = Ce(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth), n = Ce(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight);
  let r = -e.scrollLeft + Di(s);
  const a = -e.scrollTop;
  return Ct(i).direction === "rtl" && (r += Ce(t.clientWidth, i.clientWidth) - o), {
    width: o,
    height: n,
    x: r,
    y: a
  };
}
function Hc(s, t) {
  const e = bt(s), i = Nt(s), o = e.visualViewport;
  let n = i.clientWidth, r = i.clientHeight, a = 0, l = 0;
  if (o) {
    n = o.width, r = o.height;
    const c = lo();
    (!c || c && t === "fixed") && (a = o.offsetLeft, l = o.offsetTop);
  }
  return {
    width: n,
    height: r,
    x: a,
    y: l
  };
}
function Fc(s, t) {
  const e = Be(s, !0, t === "fixed"), i = e.top + s.clientTop, o = e.left + s.clientLeft, n = Mt(s) ? ne(s) : $t(1), r = s.clientWidth * n.x, a = s.clientHeight * n.y, l = o * n.x, c = i * n.y;
  return {
    width: r,
    height: a,
    x: l,
    y: c
  };
}
function as(s, t, e) {
  let i;
  if (t === "viewport")
    i = Hc(s, e);
  else if (t === "document")
    i = Vc(Nt(s));
  else if (Et(t))
    i = Fc(t, e);
  else {
    const o = In(s);
    i = {
      ...t,
      x: t.x - o.x,
      y: t.y - o.y
    };
  }
  return En(i);
}
function Ln(s, t) {
  const e = zt(s);
  return e === t || !Et(e) || le(e) ? !1 : Ct(e).position === "fixed" || Ln(e, t);
}
function $c(s, t) {
  const e = t.get(s);
  if (e)
    return e;
  let i = Oi(s, [], !1).filter((a) => Et(a) && he(a) !== "body"), o = null;
  const n = Ct(s).position === "fixed";
  let r = n ? zt(s) : s;
  for (; Et(r) && !le(r); ) {
    const a = Ct(r), l = ao(r);
    !l && a.position === "fixed" && (o = null), (n ? !l && !o : !l && a.position === "static" && !!o && ["absolute", "fixed"].includes(o.position) || Re(r) && !l && Ln(s, r)) ? i = i.filter((d) => d !== r) : o = a, r = zt(r);
  }
  return t.set(s, i), i;
}
function zc(s) {
  let {
    element: t,
    boundary: e,
    rootBoundary: i,
    strategy: o
  } = s;
  const r = [...e === "clippingAncestors" ? oi(t) ? [] : $c(t, this._c) : [].concat(e), i], a = r[0], l = r.reduce((c, d) => {
    const h = as(t, d, o);
    return c.top = Ce(h.top, c.top), c.right = ss(h.right, c.right), c.bottom = ss(h.bottom, c.bottom), c.left = Ce(h.left, c.left), c;
  }, as(t, a, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function jc(s) {
  const {
    width: t,
    height: e
  } = Sn(s);
  return {
    width: t,
    height: e
  };
}
function Uc(s, t, e) {
  const i = Mt(t), o = Nt(t), n = e === "fixed", r = Be(s, !0, n, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = $t(0);
  if (i || !i && !n)
    if ((he(t) !== "body" || Re(o)) && (a = si(t)), i) {
      const v = Be(t, !0, n, t);
      l.x = v.x + t.clientLeft, l.y = v.y + t.clientTop;
    } else o && (l.x = Di(o));
  let c = 0, d = 0;
  if (o && !i && !n) {
    const v = o.getBoundingClientRect();
    d = v.top + a.scrollTop, c = v.left + a.scrollLeft - // RTL <body> scrollbar.
    Di(o, v);
  }
  const h = r.left + a.scrollLeft - l.x - c, g = r.top + a.scrollTop - l.y - d;
  return {
    x: h,
    y: g,
    width: r.width,
    height: r.height
  };
}
function wi(s) {
  return Ct(s).position === "static";
}
function ls(s, t) {
  if (!Mt(s) || Ct(s).position === "fixed")
    return null;
  if (t)
    return t(s);
  let e = s.offsetParent;
  return Nt(s) === e && (e = e.ownerDocument.body), e;
}
function Mn(s, t) {
  const e = bt(s);
  if (oi(s))
    return e;
  if (!Mt(s)) {
    let o = zt(s);
    for (; o && !le(o); ) {
      if (Et(o) && !wi(o))
        return o;
      o = zt(o);
    }
    return e;
  }
  let i = ls(s, t);
  for (; i && Ac(i) && wi(i); )
    i = ls(i, t);
  return i && le(i) && wi(i) && !ao(i) ? e : i || Rc(s) || e;
}
const Wc = async function(s) {
  const t = this.getOffsetParent || Mn, e = this.getDimensions, i = await e(s.floating);
  return {
    reference: Uc(s.reference, await t(s.floating), s.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function qc(s) {
  return Ct(s).direction === "rtl";
}
const Yc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Nc,
  getDocumentElement: Nt,
  getClippingRect: zc,
  getOffsetParent: Mn,
  getElementRects: Wc,
  getClientRects: Dc,
  getDimensions: jc,
  getScale: ne,
  isElement: Et,
  isRTL: qc
}, Kc = (s, t, e) => {
  const i = /* @__PURE__ */ new Map(), o = {
    platform: Yc,
    ...e
  }, n = {
    ...o.platform,
    _c: i
  };
  return Mc(s, t, {
    ...o,
    platform: n
  });
};
var Xc = Object.defineProperty, Zc = (s, t, e) => t in s ? Xc(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, gt = (s, t, e) => Zc(s, typeof t != "symbol" ? t + "" : t, e);
function Vi(s, t) {
  if (s.size !== t.size)
    return !1;
  for (let [e, i] of s)
    if (!t.has(e) || t.get(e) !== i)
      return !1;
  return !0;
}
let Gc = 0;
function Jc() {
  return Gc++ + "";
}
var Qc = Object.defineProperty, td = (s, t, e) => t in s ? Qc(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e, u = (s, t, e) => td(s, typeof t != "symbol" ? t + "" : t, e);
class ni {
  constructor(t) {
    u(this, "x"), u(this, "y"), u(this, "target"), this.x = t.x, this.y = t.y, this.target = t.target;
  }
}
class co extends ni {
}
class ri extends ni {
}
class ai extends ni {
}
class li extends ni {
}
class An {
  constructor(t) {
    u(this, "pluginId"), u(this, "pluginName"), u(this, "viewName"), u(this, "dataName"), u(this, "dataValue"), this.event = t, this.pluginId = t.pluginId, this.pluginName = t.pluginName, this.viewName = t.viewName, this.dataName = t.dataName, this.dataValue = t.dataValue;
  }
}
function ed(s) {
  return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function(t, e) {
    return e === 0 ? t.toLowerCase() : t.toUpperCase();
  }).replace(/\s+/g, "").replace(/-+/g, "");
}
function cs(s) {
  return s.split("").map((t, e) => t.toUpperCase() === t ? `${e !== 0 ? "-" : ""}${t.toLowerCase()}` : t).join("");
}
class $e {
  constructor(t) {
    u(this, "node"), this.node = t.node;
  }
}
class Hi {
  constructor(t) {
    u(this, "node"), this.node = t.node;
  }
}
class id {
  constructor(t) {
    u(this, "_eventBus"), u(this, "_observer"), this._eventBus = t, this._observer = new MutationObserver(this._handler.bind(this)), this._observer.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeOldValue: !0
    });
  }
  _handler(t) {
    t.forEach((e) => {
      e.addedNodes.forEach((o) => {
        if (!(o instanceof HTMLElement) || o.dataset.velViewId || o.parentElement && typeof o.parentElement.dataset.velAdded < "u")
          return;
        let n = o;
        if (o.dataset.velView || (n = o.querySelector("[data-vel-view][data-vel-plugin]")), !n) return;
        this._eventBus.emitEvent($e, { node: n });
        const r = n.querySelectorAll("[data-vel-plugin]");
        r.length && r.forEach((a) => {
          this._eventBus.emitEvent($e, { node: a });
        });
      }), e.removedNodes.forEach((o) => {
        if (!(o instanceof HTMLElement) || typeof o.dataset.velProcessing < "u") return;
        const n = o.querySelectorAll("[data-vel-plugin]");
        n.length && n.forEach((r) => {
          this._eventBus.emitEvent(Hi, { node: r });
        }), this._eventBus.emitEvent(Hi, { node: o });
      });
      const i = e.attributeName;
      if (i === "data-vel-view" && this._eventBus.emitEvent($e, {
        node: e.target
      }), i && /data-vel-data-.+/gi.test(i)) {
        const o = e.target, n = o.dataset.velPluginId || "", r = o.dataset.velPlugin || "", a = o.dataset.velView || "", l = o.getAttribute(i);
        if (l && l !== e.oldValue) {
          const c = ed(
            i.replace("data-vel-data-", "")
          );
          this._eventBus.emitEvent(An, {
            pluginId: n,
            pluginName: r,
            viewName: a,
            dataName: c,
            dataValue: l
          });
        }
      }
    });
  }
}
class od {
  execute(t) {
    this.call(t);
  }
}
class ds extends od {
  constructor(t) {
    super(), u(this, "_handler"), this._handler = t;
  }
  getHandler() {
    return this._handler;
  }
  call(t) {
    this._handler(t);
  }
}
class Fi {
  constructor() {
    u(this, "_listeners", /* @__PURE__ */ new Map()), u(this, "_keyedListeners", /* @__PURE__ */ new Map());
  }
  subscribeToEvent(t, e, i) {
    if (i) {
      this._subscribeToKeyedEvent(t, e, i);
      return;
    }
    let o = this._listeners.get(t);
    o || (o = [], this._listeners.set(t, o)), o.push(new ds(e));
  }
  removeEventListener(t, e, i) {
    if (i) {
      this._removeKeyedEventListener(t, e, i);
      return;
    }
    let o = this._listeners.get(t);
    o && (o = o.filter(
      (n) => n.getHandler() !== e
    ), this._listeners.set(t, o));
  }
  _subscribeToKeyedEvent(t, e, i) {
    let o = this._keyedListeners.get(t);
    o || (o = /* @__PURE__ */ new Map(), this._keyedListeners.set(t, o));
    let n = o.get(i);
    n || (n = [], o.set(i, n)), n.push(new ds(e));
  }
  _removeKeyedEventListener(t, e, i) {
    let o = this._keyedListeners.get(t);
    if (!o)
      return;
    let n = o.get(i);
    n && (n = n.filter(
      (r) => r.getHandler() !== e
    ), o.set(i, n));
  }
  emitEvent(t, e, i) {
    if (i) {
      this._emitKeyedEvent(t, e, i);
      return;
    }
    const o = this._listeners.get(t);
    o && o.forEach((n) => {
      n.execute(e);
    });
  }
  _emitKeyedEvent(t, e, i) {
    const o = this._keyedListeners.get(t);
    if (!o) return;
    const n = o.get(i);
    n && n.forEach((r) => {
      r.execute(e);
    });
  }
  _convertListener(t) {
    return (e) => t(e);
  }
  subscribeToPluginReadyEvent(t, e, i = !1) {
    if (i) {
      this.subscribeToEvent(
        bs,
        this._convertListener(t),
        e
      );
      return;
    }
    this.subscribeToEvent(
      vs,
      this._convertListener(t),
      e
    );
  }
  emitPluginReadyEvent(t, e, i = !1) {
    if (i) {
      this.emitEvent(
        bs,
        e,
        t
      );
      return;
    }
    this.emitEvent(
      vs,
      e,
      t
    );
  }
  reset() {
    this._listeners.clear();
  }
}
let sd = 0;
function Rn() {
  return sd++ + "";
}
class Pn {
  constructor(t, e, i, o, n, r, a) {
    u(this, "_registry"), u(this, "_eventBus"), u(this, "_appEventBus"), u(this, "_internalEventBus"), u(this, "_initialized", !1), u(this, "_config"), u(this, "_pluginFactory"), u(this, "_pluginName"), u(this, "_id"), u(this, "_pluginKey"), u(this, "_layoutIdViewMapWaitingToEnter"), u(this, "_apiData"), u(this, "_isReady", !1), this._id = Rn(), this._pluginFactory = t, this._pluginName = e, this._registry = i, this._eventBus = o, this._appEventBus = n, this._internalEventBus = new Fi(), this._config = r, this._layoutIdViewMapWaitingToEnter = /* @__PURE__ */ new Map(), this._pluginKey = a, this._apiData = {}, this._appEventBus.subscribeToPluginReadyEvent(
      () => {
        this._isReady = !0;
      },
      this._pluginName,
      !0
    );
  }
  get api() {
    return this._apiData;
  }
  _setApi(t) {
    this._apiData = t;
  }
  get pluginName() {
    return this._pluginName;
  }
  get pluginFactory() {
    return this._pluginFactory;
  }
  get pluginKey() {
    return this._pluginKey;
  }
  get id() {
    return this._id;
  }
  get config() {
    return { ...this._config };
  }
  getViews(t) {
    return t ? this._registry.getViewsByNameForPlugin(this, t) : this._registry.getViewsForPlugin(this);
  }
  getView(t) {
    return t ? this._registry.getViewsByNameForPlugin(this, t)[0] : this._registry.getViewsForPlugin(this)[0];
  }
  getViewById(t) {
    return this._registry.getViewById(t);
  }
  addView(t) {
    this._registry.assignViewToPlugin(t, this);
  }
  setInternalEventBus(t) {
    this._internalEventBus = t;
  }
  get internalBusEvent() {
    return this._internalEventBus;
  }
  emit(t, e) {
    this._internalEventBus.emitEvent(t, e, this.pluginKey);
  }
  on(t, e) {
    this._internalEventBus.subscribeToEvent(t, e, this.pluginKey);
  }
  removeListener(t, e) {
    this._internalEventBus.removeEventListener(t, e);
  }
  useEventPlugin(t, e = {}) {
    const i = this._registry.createPlugin(
      t,
      this._eventBus,
      e
    );
    return this._registry.associateEventPluginWithPlugin(this.id, i.id), i;
  }
  notifyAboutDataChanged(t) {
    this.onDataChanged(t);
  }
  // @ts-ignore
  onDataChanged(t) {
  }
  removeView(t) {
    t.onRemoveCallback ? this._invokeRemoveCallback(t) : this._deleteView(t), this.onViewRemoved(t);
  }
  _invokeRemoveCallback(t) {
    const e = this._createTemporaryView(t);
    requestAnimationFrame(() => {
      var i;
      (i = e.onRemoveCallback) == null || i.call(e, e, () => {
        var o, n;
        if ((o = t.onAddCallbacks) != null && o.afterRemoved && t.layoutId) {
          const r = this._layoutIdViewMapWaitingToEnter.get(
            t.layoutId
          );
          (n = r == null ? void 0 : r.onAddCallbacks) == null || n.afterEnter(r), this._layoutIdViewMapWaitingToEnter.delete(t.layoutId);
        }
        this._deleteView(e, !0);
      }), setTimeout(() => {
        e.element.parentElement && this._deleteView(e, !0);
      }, 1e4);
    });
  }
  _deleteView(t, e = !1) {
    (e || !t.layoutId) && (this._registry.removeViewById(t.id, this.id), t.element.remove());
  }
  // This is a temporary view for deleted view. We need to create it
  // to show it again so the user can animate it before it disappears.
  _createTemporaryView(t) {
    const e = t.previousRect.viewportOffset, i = t.previousRect.size, o = t.rotation.degrees < 0 ? 0 : Math.sin(t.rotation.radians) * i.height * t.scale.y, n = t.rotation.degrees > 0 ? 0 : Math.sin(t.rotation.radians) * i.width * t.scale.y, r = t.element.cloneNode(!0);
    t.element.remove(), r.style.cssText = "", r.style.position = "absolute", r.style.left = `${e.left + o}px`, r.style.top = `${e.top - n}px`, r.style.width = `${i.width}px`, r.style.height = `${i.height}px`, r.style.transform = `
      scale3d(${t.scale.x}, ${t.scale.y}, 1) rotate(${t.rotation.degrees}deg)
    `, r.style.pointerEvents = "none", r.dataset.velRemoved = "", document.body.appendChild(r);
    const a = this._registry.createView(r, t.name);
    return a.setAsTemporaryView(), a.styles.position = "absolute", a.styles.left = `${e.left + o}px`, a.styles.top = `${e.top - n}px`, a.rotation.setDegrees(t.rotation.degrees, !1), a.scale.set({ x: t.scale.x, y: t.scale.y }, !1), a.size.set(
      { width: t._localWidth, height: t._localHeight },
      !1
    ), t._copyAnimatorsToAnotherView(a), t.onRemoveCallback && a.onRemove(t.onRemoveCallback), a;
  }
  // @ts-ignore
  onViewRemoved(t) {
  }
  notifyAboutViewAdded(t) {
    this.onViewAdded(t), this._invokeAddCallbacks(t);
  }
  _invokeAddCallbacks(t) {
    var e, i, o;
    !((e = t.onAddCallbacks) != null && e.onInitialLoad) && !this._initialized || ((i = t.onAddCallbacks) == null || i.beforeEnter(t), !((o = t.onAddCallbacks) != null && o.afterRemoved) || !this._initialized ? requestAnimationFrame(() => {
      var n;
      (n = t.onAddCallbacks) == null || n.afterEnter(t);
    }) : t.layoutId && this._layoutIdViewMapWaitingToEnter.set(t.layoutId, t));
  }
  // @ts-ignore
  onViewAdded(t) {
  }
  init() {
    !this._initialized && this._isReady && (this.setup(), this._initialized = !0);
  }
  setup() {
  }
  // @ts-ignore
  subscribeToEvents(t) {
  }
}
class nd extends Pn {
  isRenderable() {
    return !0;
  }
  isInitialized() {
    return this._initialized;
  }
  get initialized() {
    return this._initialized;
  }
  // @ts-ignore
  update(t, e) {
  }
  render() {
  }
  addView(t) {
    t.setPluginId(this.id), super.addView(t);
  }
}
class ho extends Pn {
  isRenderable() {
    return !1;
  }
}
class rd {
  constructor(t) {
    u(this, "_plugin"), this._plugin = t;
  }
  get initialized() {
    return this._plugin.isInitialized();
  }
  get config() {
    return this._plugin.config;
  }
  setup(t) {
    this._plugin.setup = t;
  }
  api(t) {
    this._plugin._setApi(t);
  }
  update(t) {
    this._plugin.update = t;
  }
  render(t) {
    this._plugin.render = t;
  }
  getViews(t) {
    return this._plugin.getViews(t);
  }
  getView(t) {
    return this._plugin.getView(t);
  }
  getViewById(t) {
    return this._plugin.getViewById(t);
  }
  useEventPlugin(t, e = {}) {
    return this._plugin.useEventPlugin(t, e);
  }
  emit(t, e) {
    this._plugin.emit(t, e);
  }
  on(t, e) {
    this._plugin.on(t, e);
  }
  onDataChanged(t) {
    this._plugin.onDataChanged = t;
  }
  onViewRemoved(t) {
    this._plugin.onViewRemoved = t;
  }
  onViewAdded(t) {
    this._plugin.onViewAdded = t;
  }
  subscribeToEvents(t) {
    this._plugin.subscribeToEvents = t;
  }
}
function yi(s, t, e, i, o, n) {
  if (ad(s))
    return new s(
      s,
      s.pluginName,
      t,
      e,
      i,
      o,
      n
    );
  const r = new nd(
    s,
    s.pluginName,
    t,
    e,
    i,
    o,
    n
  ), a = new rd(r);
  return s(a), r;
}
function ad(s) {
  var t;
  return ((t = s.prototype) == null ? void 0 : t.constructor.toString().indexOf("class ")) === 0;
}
class b {
  constructor(t, e) {
    u(this, "x"), u(this, "y"), this.x = t, this.y = e;
  }
  get magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }
  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  get unitVector() {
    const t = new b(0, 0), e = this.magnitude;
    return e !== 0 && (t.x = this.x / e, t.y = this.y / e), t;
  }
  add(t) {
    this.x += t.x, this.y += t.y;
  }
  sub(t) {
    this.x -= t.x, this.y -= t.y;
  }
  scale(t) {
    this.x *= t, this.y *= t;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  clone() {
    return new b(this.x, this.y);
  }
  static scale(t, e) {
    return new b(t.x * e, t.y * e);
  }
  static sub(t, e) {
    return new b(t.x - e.x, t.y - e.y);
  }
  static add(t, e) {
    return new b(t.x + e.x, t.y + e.y);
  }
}
class ld {
  constructor(t) {
    u(this, "_element"), u(this, "_callback"), this._element = t, this._observe();
  }
  setElement(t) {
    this._element = t, this._observe();
  }
  _observe() {
    var t;
    const e = new MutationObserver(() => {
      var n;
      (n = this._callback) == null || n.call(this, !1);
    }), i = {
      attributes: !0,
      childList: !0,
      attributeOldValue: !0
    };
    e.observe(this._element, i), new ResizeObserver(() => {
      var n;
      (n = this._callback) == null || n.call(this, !0);
    }).observe(this._element);
    function o(n, r) {
      let a, l = !0;
      return function() {
        l && (n(), l = !1), clearTimeout(a), a = setTimeout(() => {
          n(), l = !0;
        }, r);
      };
    }
    (t = this._element.parentElement) == null || t.addEventListener(
      "scroll",
      o(() => {
        var n;
        (n = this._callback) == null || n.call(this, !0);
      }, 30)
    ), window.addEventListener(
      "scroll",
      o(() => {
        var n;
        (n = this._callback) == null || n.call(this, !0);
      }, 30)
    ), window.addEventListener(
      "resize",
      o(() => {
        var n;
        (n = this._callback) == null || n.call(this, !0);
      }, 30)
    );
  }
  onChange(t) {
    this._callback = t;
  }
}
function cd(s) {
  return new ld(s);
}
function dd(s, t) {
  const e = t.x - s.x, i = t.y - s.y;
  return Math.sqrt(e * e + i * i);
}
function O(s, t) {
  const e = s - t;
  return Math.abs(e) <= 0.01;
}
function ut(s) {
  let t = s.match(/^([\d.]+)([a-zA-Z%]*)$/);
  t || (t = "0px".match(/^([\d.]+)([a-zA-Z%]*)$/));
  const e = parseFloat(t[1]), i = t[2];
  return { value: e, unit: i, valueWithUnit: s };
}
function hd(s, t, e = !1) {
  if (s === t) return !0;
  if (s.length !== t.length) return !1;
  for (let i = 0; i < s.length; i++)
    if (e && !O(s[i].value, t[i].value) || s[i].value !== t[i].value)
      return !1;
  return !0;
}
function hs(s, t) {
  return hd(s, t, !0);
}
class be {
  constructor(t, e, i, o) {
    u(this, "_topLeft"), u(this, "_topRight"), u(this, "_bottomLeft"), u(this, "_bottomRight"), this._topLeft = t, this._topRight = e, this._bottomLeft = i, this._bottomRight = o;
  }
  get value() {
    return {
      topLeft: this._topLeft,
      topRight: this._topRight,
      bottomRight: this._bottomRight,
      bottomLeft: this._bottomLeft
    };
  }
  equals(t) {
    return O(this.value.topLeft.value, t.value.topLeft.value) && O(this.value.topRight.value, t.value.topRight.value) && O(this.value.bottomRight.value, t.value.bottomRight.value) && O(this.value.bottomLeft.value, t.value.bottomLeft.value);
  }
  toCssPercentageForNewSize(t) {
    const e = this._convertToPercentage(this._topLeft, t), i = this._convertToPercentage(this._topRight, t), o = this._convertToPercentage(this._bottomLeft, t), n = this._convertToPercentage(this._bottomRight, t);
    return `${e.h} ${i.h} ${n.h} ${o.h} / ${e.v} ${i.v} ${n.v} ${o.v}`;
  }
  _convertToPercentage(t, e) {
    if (t.unit === "%")
      return { h: `${t.value}%`, v: `${t.value}%` };
    const i = t.value / e.width * 100, o = t.value / e.height * 100;
    return { h: `${i}%`, v: `${o}%` };
  }
}
function $i(s) {
  const t = s.split(" ").map((i) => ut(i)), e = {
    value: 0,
    unit: "",
    valueWithUnit: "0"
  };
  switch (t.length) {
    case 1:
      return new be(t[0], t[0], t[0], t[0]);
    case 2:
      return new be(t[0], t[1], t[0], t[1]);
    case 3:
      return new be(t[0], t[1], t[2], t[1]);
    case 4:
      return new be(t[0], t[1], t[3], t[2]);
    default:
      return new be(
        e,
        e,
        e,
        e
      );
  }
}
function ud(s, t) {
  const e = r(s.topLeft, t), i = r(s.topRight, t), o = r(s.bottomLeft, t), n = r(s.bottomRight, t);
  return {
    v: {
      topLeft: e.v,
      topRight: i.v,
      bottomRight: n.v,
      bottomLeft: o.v
    },
    h: {
      topLeft: e.h,
      topRight: i.h,
      bottomRight: n.h,
      bottomLeft: o.h
    }
  };
  function r(a, l) {
    if (a.unit === "%")
      return {
        h: ut(`${a.value}%`),
        v: ut(`${a.value}%`)
      };
    const c = a.value / l.width * 100, d = a.value / l.height * 100;
    return { h: ut(`${c}%`), v: ut(`${d}%`) };
  }
}
function us(s, t) {
  return O(s.topLeft.value, t.topLeft.value) && O(s.topRight.value, t.topRight.value) && O(s.bottomRight.value, t.bottomRight.value) && O(s.bottomLeft.value, t.bottomLeft.value);
}
class pd {
  constructor(t) {
    u(this, "_value"), this._value = t;
  }
  get value() {
    return this._value;
  }
  equals(t) {
    return O(this.value, t.value);
  }
}
function gd(s) {
  return new pd(parseFloat(s));
}
class fd {
  constructor(t, e) {
    u(this, "_x"), u(this, "_y"), this._x = t, this._y = e;
  }
  get value() {
    return new b(this._x, this._y);
  }
}
function md(s, t) {
  const [e, i] = s.split(" "), o = ut(e), n = ut(i);
  return new fd(
    o.value / t.width,
    n.value / t.height
  );
}
function ps(s, t) {
  const e = vd(s), i = s.offsetWidth, o = s.offsetHeight;
  return {
    viewportOffset: {
      left: Math.round(e.left),
      top: Math.round(e.top),
      right: Math.round(e.right),
      bottom: Math.round(e.bottom)
    },
    pageOffset: t.read({
      width: i,
      height: o
    }),
    size: {
      width: i,
      height: o
    }
  };
}
function vd(s) {
  const t = s.getBoundingClientRect();
  return {
    left: t.left,
    top: t.top,
    right: t.right,
    bottom: t.bottom,
    width: t.width,
    height: t.height
  };
}
function gs(s) {
  let t = s, e = 0, i = 0;
  for (; t; )
    e += t.offsetTop, i += t.offsetLeft, t = t.offsetParent;
  return { top: e, left: i };
}
class bd {
  constructor(t) {
    u(this, "_currentPageRect"), u(this, "_view"), u(this, "_element"), u(this, "_offsetLeft"), u(this, "_offsetTop"), u(this, "_width"), u(this, "_height"), u(this, "_parentWidth"), u(this, "_parentHeight"), u(this, "_parentEl"), u(this, "_isSvg"), u(this, "_invalid"), this._invalid = !0, this._view = t, this._element = t.element, this._isSvg = !!this._element.closest("svg"), this._offsetLeft = 0, this._offsetTop = 0, this._width = 0, this._height = 0, this._parentWidth = 0, this._parentHeight = 0, this._offsetLeft = 0, this._parentEl = this._element.parentElement, window.addEventListener("resize", () => {
      this.invalidate();
    });
  }
  invalidate() {
    this._invalid = !0;
  }
  read(t) {
    if (this._isSvg)
      return this._currentPageRect || (this._currentPageRect = gs(this._element)), this._currentPageRect;
    const e = this._element.parentElement, i = this._element.offsetLeft, o = this._element.offsetTop, n = t.width, r = t.height, a = (e == null ? void 0 : e.offsetWidth) || 0, l = (e == null ? void 0 : e.offsetHeight) || 0;
    return (this._offsetLeft !== i || this._offsetTop !== o || !O(this._width, n) || !O(this._height, r)) && this._view._children.forEach(
      (c) => c.elementReader.invalidatePageRect()
    ), !this._invalid && this._currentPageRect && this._offsetLeft === i && this._offsetTop === o && O(this._width, n) && O(this._height, r) && O(this._parentWidth, a) && O(this._parentHeight, l) && this._parentEl === e ? this._currentPageRect : (this._offsetLeft = i, this._offsetTop = o, this._width = n, this._height = r, this._parentWidth = a, this._parentHeight = l, this._parentEl = e, this._currentPageRect = gs(this._element), this._invalid = !1, this._currentPageRect);
  }
}
function wd(s) {
  return new bd(s);
}
class yd {
  constructor(t) {
    u(this, "_element"), u(this, "_rect"), u(this, "_computedStyle"), u(this, "_pageRectReader"), u(this, "_scroll"), this._element = t.element, this._pageRectReader = wd(t), this._rect = ps(this._element, this._pageRectReader), this._computedStyle = getComputedStyle(this._element), this._scroll = this._calculateScroll();
  }
  invalidatePageRect() {
    this._pageRectReader.invalidate();
  }
  update(t = !1) {
    this._rect = ps(this._element, this._pageRectReader), this._computedStyle = getComputedStyle(this._element), t && (this._scroll = this._calculateScroll());
  }
  get rect() {
    return this._rect;
  }
  get opacity() {
    return gd(this._computedStyle.opacity);
  }
  get borderRadius() {
    return $i(this._computedStyle.borderRadius);
  }
  get origin() {
    return md(
      this._computedStyle.transformOrigin,
      this._rect.size
    );
  }
  _calculateScroll() {
    let t = this._element, e = 0, i = 0;
    for (; t; )
      e += t.scrollTop, i += t.scrollLeft, t = t.offsetParent;
    return i += window.scrollX, e += window.scrollY, { y: e, x: i };
  }
  get scroll() {
    return this._scroll;
  }
}
function fs(s) {
  return new yd(s);
}
function zi(s, t) {
  const e = {
    set: (i, o, n) => (typeof i[o] == "object" && i[o] !== null ? i[o] = zi(n, t) : (t(), i[o] = n), !0),
    get: (i, o) => typeof i[o] == "object" && i[o] !== null ? zi(i[o], t) : i[o]
  };
  return new Proxy(s, e);
}
const Ge = 0.01, uo = {
  speed: 15
};
class po {
  constructor(t) {
    u(this, "name", "dynamic"), u(this, "_config"), this._config = t;
  }
  get config() {
    return this._config;
  }
}
class kd extends po {
  update({ animatorProp: t, current: e, target: i, dt: o }) {
    const n = b.sub(i, e), r = b.scale(n, this._config.speed);
    let a = b.add(e, b.scale(r, o));
    return this._shouldFinish(i, e, r) && (a = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), t.callUpdateCallback(), a;
  }
  _shouldFinish(t, e, i) {
    return b.sub(t, e).magnitude < Ge && i.magnitude < Ge;
  }
}
class xd extends po {
  update({ animatorProp: t, current: e, target: i, dt: o }) {
    const n = (i - e) * this._config.speed;
    let r = e + n * o;
    return O(r, i) && (r = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), t.callUpdateCallback(), r;
  }
}
class _d extends po {
  update({ animatorProp: t, current: e, target: i, dt: o }) {
    return i.map((n, r) => {
      const a = e[r], l = n.value === 0 ? a.unit : n.unit, c = (n.value - a.value) * this._config.speed, d = a.value + c * o;
      let h = ut(`${d}${l}`);
      return this._shouldFinish(n.value, a.value, c) && (h = n, requestAnimationFrame(() => {
        t.callCompleteCallback();
      })), t.callUpdateCallback(), h;
    });
  }
  _shouldFinish(t, e, i) {
    return Math.abs(t - e) < Ge && Math.abs(i) < Ge;
  }
}
class go {
  constructor() {
    u(this, "name", "instant"), u(this, "_config", {});
  }
  get config() {
    return this._config;
  }
  update(t) {
    return requestAnimationFrame(() => {
      t.animatorProp.callCompleteCallback();
    }), t.target;
  }
}
const fo = {
  stiffness: 0.5,
  damping: 0.75,
  speed: 10
}, Je = 0.01;
class mo {
  constructor(t) {
    u(this, "name", "spring"), u(this, "_config"), this._config = t;
  }
  get config() {
    return this._config;
  }
}
class Ed extends mo {
  constructor() {
    super(...arguments), u(this, "_velocity", new b(0, 0));
  }
  update({ animatorProp: t, current: e, target: i, dt: o }) {
    const n = b.scale(
      b.scale(b.sub(e, i), -1),
      this._config.stiffness
    );
    this._velocity = b.add(this._velocity, n), this._velocity = b.scale(this._velocity, this._config.damping);
    let r = b.add(
      e,
      b.scale(this._velocity, o * this._config.speed)
    );
    return this._shouldFinish(i, e) && (r = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), r;
  }
  _shouldFinish(t, e) {
    return b.sub(t, e).magnitude < Je && this._velocity.magnitude < Je;
  }
}
class Cd extends mo {
  constructor() {
    super(...arguments), u(this, "_velocity", 0);
  }
  update({ animatorProp: t, current: e, target: i, dt: o }) {
    const n = -(e - i) * this._config.stiffness;
    this._velocity += n, this._velocity *= this._config.damping;
    let r = e + this._velocity * o * this._config.speed;
    return O(r, i) && (r = i, requestAnimationFrame(() => {
      t.callCompleteCallback();
    })), r;
  }
}
class Td extends mo {
  constructor() {
    super(...arguments), u(this, "_velocity", 0);
  }
  update({ animatorProp: t, current: e, target: i, dt: o }) {
    return i.map((n, r) => {
      const a = e[r], l = n.value === 0 ? a.unit : n.unit, c = -(a.value - n.value) * this._config.stiffness;
      this._velocity += c, this._velocity *= this._config.damping;
      const d = a.value + this._velocity * o * this._config.speed;
      let h = ut(`${d}${l}`);
      return this._shouldFinish(n.value, a.value) && (h = n, requestAnimationFrame(() => {
        t.callCompleteCallback();
      })), h;
    });
  }
  _shouldFinish(t, e) {
    return Math.abs(t - e) < Je && Math.abs(this._velocity) < Je;
  }
}
function Sd(s) {
  return s;
}
const vo = {
  duration: 350,
  ease: Sd
};
class bo {
  constructor(t) {
    u(this, "name", "tween"), u(this, "_config"), u(this, "_startTime"), this._config = t;
  }
  get config() {
    return this._config;
  }
  reset() {
    this._startTime = void 0;
  }
}
class Bd extends bo {
  update({ animatorProp: t, initial: e, target: i, ts: o }) {
    this._startTime || (this._startTime = o);
    const n = Math.min(1, (o - this._startTime) / this._config.duration);
    return O(n, 1) ? (requestAnimationFrame(() => {
      t.callCompleteCallback();
    }), i) : b.add(
      e,
      b.scale(b.sub(i, e), this._config.ease(n))
    );
  }
}
class Id extends bo {
  update({ animatorProp: t, initial: e, target: i, ts: o }) {
    this._startTime || (this._startTime = o);
    const n = Math.min(1, (o - this._startTime) / this._config.duration);
    return O(n, 1) ? (requestAnimationFrame(() => {
      t.callCompleteCallback();
    }), i) : e.map((r, a) => {
      const l = i[a], c = l.value === 0 ? r.unit : l.unit, d = r.value + this._config.ease(n) * (i[a].value - r.value);
      return ut(`${d}${c}`);
    });
  }
}
class Ld extends bo {
  update({ animatorProp: t, initial: e, target: i, ts: o }) {
    this._startTime || (this._startTime = o);
    const n = Math.min(1, (o - this._startTime) / this._config.duration);
    return O(n, 1) ? (requestAnimationFrame(() => {
      t.callCompleteCallback();
    }), i) : e + (i - e) * this._config.ease(n);
  }
}
class wo {
  createAnimatorByName(t, e) {
    switch (t) {
      case "instant":
        return this.createInstantAnimator();
      case "dynamic":
        return this.createDynamicAnimator(e);
      case "tween":
        return this.createTweenAnimator(e);
      case "spring":
        return this.createSpringAnimator(e);
    }
    return this.createInstantAnimator();
  }
}
class Pe extends wo {
  createInstantAnimator() {
    return new go();
  }
  createTweenAnimator(t) {
    return new Bd({ ...vo, ...t });
  }
  createDynamicAnimator(t) {
    return new kd({ ...uo, ...t });
  }
  createSpringAnimator(t) {
    return new Ed({ ...fo, ...t });
  }
}
class Md extends wo {
  createInstantAnimator() {
    return new go();
  }
  createTweenAnimator(t) {
    return new Id({ ...vo, ...t });
  }
  createDynamicAnimator(t) {
    return new _d({
      ...uo,
      ...t
    });
  }
  createSpringAnimator(t) {
    return new Td({ ...fo, ...t });
  }
}
class ms extends wo {
  createInstantAnimator() {
    return new go();
  }
  createDynamicAnimator(t) {
    return new xd({ ...uo, ...t });
  }
  createTweenAnimator(t) {
    return new Ld({ ...vo, ...t });
  }
  createSpringAnimator(t) {
    return new Cd({ ...fo, ...t });
  }
}
function we(s) {
  return structuredClone(s);
}
class Ad {
  constructor(t) {
    u(this, "_viewProp"), u(this, "_completeCallback"), u(this, "_updateCallback"), u(this, "_isAnimating"), this._viewProp = t, this._isAnimating = !1;
  }
  set(t, e) {
    this._viewProp.setAnimator(t, e);
  }
  get name() {
    return this._viewProp.getAnimator().name;
  }
  onComplete(t) {
    this._completeCallback = t;
  }
  get isAnimating() {
    return this._isAnimating;
  }
  markAsAnimating() {
    this._isAnimating = !0;
  }
  callCompleteCallback() {
    var t;
    (t = this._completeCallback) == null || t.call(this), this._isAnimating = !1;
  }
  onUpdate(t) {
    this._updateCallback = t;
  }
  callUpdateCallback() {
    var t;
    (t = this._updateCallback) == null || t.call(this);
  }
}
class Xt {
  constructor(t, e, i) {
    u(this, "_animatorProp"), u(this, "_animator"), u(this, "_initialValue"), u(this, "_previousValue"), u(this, "_targetValue"), u(this, "_currentValue"), u(this, "_hasChanged"), u(this, "_view"), u(this, "_animatorFactory"), u(this, "_previousRenderValue"), this._animatorProp = new Ad(this), this._animatorFactory = t, this._initialValue = we(e), this._previousValue = we(e), this._targetValue = we(e), this._currentValue = we(e), this._hasChanged = !1, this._previousRenderValue = void 0, this._view = i, this._animator = this._animatorFactory.createInstantAnimator();
  }
  get shouldRender() {
    return !0;
  }
  get isAnimating() {
    return this.animator.isAnimating;
  }
  getAnimator() {
    return this._animator;
  }
  get animator() {
    return this._animatorProp;
  }
  get _rect() {
    return this._view.rect;
  }
  get _previousRect() {
    return this._view.previousRect;
  }
  setAnimator(t, e) {
    this._animator = this._animatorFactory.createAnimatorByName(
      t,
      e
    );
  }
  _setTarget(t, e = !0) {
    var i, o;
    this._previousValue = we(this._currentValue), this._targetValue = t, e ? ((o = (i = this._animator).reset) == null || o.call(i), this.animator.markAsAnimating()) : this._currentValue = t, this._hasChanged = !0;
  }
  hasChanged() {
    return this._hasChanged;
  }
  destroy() {
    this._hasChanged = !1;
  }
  // @ts-ignore
  update(t, e) {
  }
}
class Rd extends Xt {
  constructor() {
    super(...arguments), u(this, "_invertedBorderRadius"), u(this, "_forceStyleUpdateThisFrame", !1), u(this, "_updateWithScale", !1);
  }
  setFromElementPropValue(t) {
    this._setTarget(
      [
        t.value.topLeft,
        t.value.topRight,
        t.value.bottomRight,
        t.value.bottomLeft
      ],
      !0
    );
  }
  enableUpdateWithScale() {
    this._updateWithScale = !0;
  }
  disableUpdateWithScale() {
    this._updateWithScale = !1;
  }
  get value() {
    return {
      topLeft: this._currentValue[0],
      topRight: this._currentValue[1],
      bottomRight: this._currentValue[2],
      bottomLeft: this._currentValue[3]
    };
  }
  get invertedBorderRadius() {
    return this._invertedBorderRadius;
  }
  set(t, e = !0) {
    let i;
    if (typeof t == "string") {
      const l = $i(t.trim());
      i = {
        topLeft: l.value.topLeft.valueWithUnit,
        topRight: l.value.topRight.valueWithUnit,
        bottomRight: l.value.bottomRight.valueWithUnit,
        bottomLeft: l.value.bottomLeft.valueWithUnit
      };
    } else
      i = t;
    const o = i.topLeft ? ut(i.topLeft) : this._currentValue[0], n = i.topRight ? ut(i.topRight) : this._currentValue[1], r = i.bottomRight ? ut(i.bottomRight) : this._currentValue[2], a = i.bottomLeft ? ut(i.bottomLeft) : this._currentValue[3];
    this._setTarget([o, n, r, a], e);
  }
  reset(t = !0) {
    this._setTarget(this._initialValue, t);
  }
  update(t, e) {
    if (this._forceStyleUpdateThisFrame)
      this._hasChanged = !0, this._forceStyleUpdateThisFrame = !1;
    else if (this._view.scale.isAnimating && this._updateWithScale)
      this._hasChanged = !0;
    else if (hs(this._targetValue, this._currentValue)) {
      this._hasChanged = !hs(
        this._targetValue,
        this._initialValue
      );
      return;
    }
    this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    }), this._updateWithScale && this._applyScaleInverse();
  }
  applyScaleInverse() {
    this._updateWithScale && (this._forceStyleUpdateThisFrame = !0);
  }
  _applyScaleInverse() {
    if (O(this._view.scale.x, 1) && O(this._view.scale.y, 1))
      return;
    const t = this._rect.size.width * this._view.scale.x, e = this._rect.size.height * this._view.scale.y;
    this._invertedBorderRadius = ud(
      $i(
        `${this._currentValue[0].valueWithUnit} ${this._currentValue[1].valueWithUnit} ${this._currentValue[2].valueWithUnit} ${this._currentValue[3].valueWithUnit}`
      ).value,
      {
        width: t,
        height: e
      }
    );
  }
  get shouldRender() {
    return this._hasChanged ? this._previousRenderValue ? !(us(
      this.renderValue.v,
      this._previousRenderValue.v
    ) && us(this.renderValue.h, this._previousRenderValue.h)) : !0 : !1;
  }
  get renderValue() {
    return this.invertedBorderRadius ? {
      v: {
        topLeft: this.invertedBorderRadius.v.topLeft,
        topRight: this.invertedBorderRadius.v.topRight,
        bottomLeft: this.invertedBorderRadius.v.bottomLeft,
        bottomRight: this.invertedBorderRadius.v.bottomRight
      },
      h: {
        topLeft: this.invertedBorderRadius.h.topLeft,
        topRight: this.invertedBorderRadius.h.topRight,
        bottomLeft: this.invertedBorderRadius.h.bottomLeft,
        bottomRight: this.invertedBorderRadius.h.bottomRight
      }
    } : {
      v: {
        topLeft: this.value.topLeft,
        topRight: this.value.topRight,
        bottomLeft: this.value.bottomLeft,
        bottomRight: this.value.bottomRight
      },
      h: {
        topLeft: this.value.topLeft,
        topRight: this.value.topRight,
        bottomLeft: this.value.bottomLeft,
        bottomRight: this.value.bottomRight
      }
    };
  }
  projectStyles() {
    const t = this.renderValue, e = `border-radius: ${t.h.topLeft.valueWithUnit} ${t.h.topRight.valueWithUnit} ${t.h.bottomRight.valueWithUnit} ${t.h.bottomLeft.valueWithUnit} / ${t.v.topLeft.valueWithUnit} ${t.v.topRight.valueWithUnit} ${t.v.bottomRight.valueWithUnit} ${t.v.bottomLeft.valueWithUnit};`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class Pd extends Xt {
  setFromElementPropValue(t) {
    this._setTarget(t.value, !0);
  }
  get value() {
    return this._currentValue;
  }
  set(t, e = !0) {
    this._setTarget(t, e);
  }
  reset(t = !0) {
    this._setTarget(1, t);
  }
  update(t, e) {
    if (O(this._targetValue, this._currentValue)) {
      this._hasChanged = !O(this._targetValue, this._initialValue);
      return;
    }
    this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    });
  }
  get shouldRender() {
    return this._hasChanged ? typeof this._previousRenderValue > "u" ? !0 : this.renderValue !== this._previousRenderValue : !1;
  }
  get renderValue() {
    return this.value;
  }
  projectStyles() {
    const t = this.renderValue, e = `opacity: ${t};`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class Od extends Xt {
  get x() {
    return this._currentValue.x;
  }
  get y() {
    return this._currentValue.y;
  }
  set(t) {
    const e = { x: this.x, y: this.y, ...t };
    if (e.x < 0 || e.x > 1) {
      console.log(
        `%c WARNING: ${this._view.name}.origin.x property can only be a value from 0 to 1`,
        "background: #885500"
      );
      return;
    }
    if (e.y < 0 || e.y > 1) {
      console.log(
        `%c WARNING: ${this._view.name}.origin.y property can only be a value from 0 to 1`,
        "background: #885500"
      );
      return;
    }
    this._setTarget(new b(e.x, e.y), !1);
  }
  reset() {
    this._setTarget(this._initialValue, !1);
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(O(t.x, this._previousRenderValue.x) && O(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    return new b(this.x * 100, this.y * 100);
  }
  projectStyles() {
    const t = this.renderValue, e = `transform-origin: ${t.x}% ${t.y}%;`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class Nd extends Xt {
  constructor() {
    super(...arguments), u(this, "_animateLayoutUpdateNextFrame", !1), u(this, "_parentScaleInverse", new b(1, 1));
  }
  get _parentDiff() {
    let t = this._view._parent, e = 0, i = 0;
    if (t) {
      const o = t.rect.pageOffset, n = t.getScroll(), r = {
        left: t.previousRect.viewportOffset.left + n.x,
        top: t.previousRect.viewportOffset.top + n.y
      };
      e = r.left - o.left, i = r.top - o.top;
    }
    return { parentDx: e, parentDy: i };
  }
  get x() {
    return this._currentValue.x + this._rect.pageOffset.left + this._parentDiff.parentDx;
  }
  get y() {
    return this._currentValue.y + this._rect.pageOffset.top + this._parentDiff.parentDy;
  }
  get initialX() {
    return this._rect.pageOffset.left;
  }
  get initialY() {
    return this._rect.pageOffset.top;
  }
  progressTo(t) {
    const e = typeof t.x > "u" ? this.initialX : t.x, i = typeof t.y > "u" ? this.initialY : t.y, o = new b(e, i), n = new b(this.initialX, this.initialY), r = new b(this.x, this.y), a = b.sub(r, n), l = b.sub(o, n);
    return 1 - b.sub(l, a).magnitude / l.magnitude;
  }
  set(t, e = !0) {
    const i = { x: this.x, y: this.y, ...t };
    this._setTarget(
      new b(
        i.x - this._rect.pageOffset.left,
        i.y - this._rect.pageOffset.top
      ),
      e
    );
  }
  reset(t = !0) {
    this._setTarget(new b(0, 0), t);
  }
  update(t, e) {
    if ((this._view.isInverseEffectEnabled || this._view.isLayoutTransitionEnabled) && !this._view.isTemporaryView && this._runLayoutTransition(), this._view.isInverseEffectEnabled) {
      const l = this._view._parent, c = l ? l.scale.x : 1, d = l ? l.scale.y : 1;
      this._parentScaleInverse = new b(1 / c, 1 / d), this._parentScaleInverse.equals(new b(1, 1)) || (this._hasChanged = !0);
    }
    if (this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y)
      return;
    const i = this._view._parent, o = i ? i.scale.x : 1, n = i ? i.scale.y : 1, r = i ? i.scale._previousValue.x : 1, a = i ? i.scale._previousValue.y : 1;
    this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: new b(
        this._currentValue.x * o,
        this._currentValue.y * n
      ),
      target: this._targetValue,
      initial: new b(
        this._previousValue.x * r,
        this._previousValue.y * a
      ),
      ts: t,
      dt: e
    }), this._currentValue = new b(
      this._currentValue.x / o,
      this._currentValue.y / n
    );
  }
  _runLayoutTransition() {
    const t = !(this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y), e = !(this._view.scale._targetValue.x === this._view.scale._currentValue.x && this._view.scale._targetValue.y === this._view.scale._currentValue.y), i = t || e, o = this._rect.pageOffset.left - this._previousRect.pageOffset.left, n = this._rect.pageOffset.top - this._previousRect.pageOffset.top, r = this._previousRect.size.width / this._rect.size.width, a = this._previousRect.size.height / this._rect.size.height;
    let l = !1;
    if (o !== 0 || n !== 0 || !Number.isNaN(r) && r !== 1 || !Number.isNaN(a) && a !== 1 ? l = !0 : l = (() => {
      const c = this._view._parents;
      for (let d = 0; d < c.length; d++) {
        const h = c[d], g = h.previousRect.size.width / h.rect.size.width, v = h.previousRect.size.height / h.rect.size.height;
        if (g !== 1 || v !== 1)
          return !0;
      }
      return !1;
    })(), l) {
      if (this._currentValue.x !== 0 || this._currentValue.y !== 0 || this._view.scale._currentValue.x !== 1 || this._view.scale._currentValue.y !== 1) {
        if (!i) {
          const ot = this._rect.pageOffset.left - this._previousRect.pageOffset.left, wt = this._rect.pageOffset.top - this._previousRect.pageOffset.top;
          this._setTarget(
            new b(this._currentValue.x - ot, this._currentValue.y - wt),
            !1
          );
          return;
        }
        const x = this._view._parent, y = this._rect.pageOffset, E = this._view.getScroll(), B = {
          left: this._previousRect.viewportOffset.left + E.x,
          top: this._previousRect.viewportOffset.top + E.y
        }, D = B.left - y.left, M = B.top - y.top;
        let Y = 0, A = 0, G = 0, Tt = 0;
        if (x) {
          const ot = x.rect.pageOffset, wt = x.getScroll(), Dt = {
            left: x.previousRect.viewportOffset.left + wt.x,
            top: x.previousRect.viewportOffset.top + wt.y
          };
          Y = Dt.left - ot.left, A = Dt.top - ot.top;
          const k = B.top - Dt.top, P = B.left - Dt.left, it = x.scale.y * k;
          G = (k - it) / x.scale.y;
          const ue = x.scale.x * P;
          Tt = (P - ue) / x.scale.x;
        }
        this._setTarget(
          new b(D - Y + Tt, M - A + G),
          !1
        ), i && (this._animateLayoutUpdateNextFrame = !0);
        return;
      }
      this._animateLayoutUpdateNextFrame = !0;
      const c = this._previousRect, d = this._rect, h = this._view._parent;
      let g = 0, v = 0;
      h && (g = h.previousRect.viewportOffset.left - h.rect.viewportOffset.left), h && (v = h.previousRect.viewportOffset.top - h.rect.viewportOffset.top);
      let f = 1, w = 1;
      h && (f = h.previousRect.size.width / h.rect.size.width, w = h.previousRect.size.height / h.rect.size.height);
      const _ = h ? h.previousRect.viewportOffset.left : 0, L = h ? h.previousRect.viewportOffset.top : 0, R = c.viewportOffset.left - _, $ = c.viewportOffset.top - L, j = R / f - R, H = $ / w - $;
      let q = c.viewportOffset.left - d.viewportOffset.left - g + j, dt = c.viewportOffset.top - d.viewportOffset.top - v + H;
      q = Number.isFinite(q) ? q : 0, dt = Number.isFinite(dt) ? dt : 0, this._setTarget(new b(q, dt), !1);
    } else this._animateLayoutUpdateNextFrame && (this._setTarget(this._initialValue, !0), this._animateLayoutUpdateNextFrame = !1);
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(O(t.x, this._previousRenderValue.x) && O(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    let t = 0, e = 0;
    return (this._view.isInverseEffectEnabled || this._view.isLayoutTransitionEnabled) && (t = (this._rect.size.width * this._parentScaleInverse.x * this._view.scale.x - this._rect.size.width) * this._view.origin.x, e = (this._rect.size.height * this._parentScaleInverse.y * this._view.scale.y - this._rect.size.height) * this._view.origin.y), new b(
      this._currentValue.x + t,
      this._currentValue.y + e
    );
  }
  projectStyles() {
    const t = this.renderValue, e = `translate3d(${t.x}px, ${t.y}px, 0px)`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !0;
  }
}
class Dd extends Xt {
  constructor() {
    super(...arguments), u(this, "_unit", "deg");
  }
  get degrees() {
    let t = this._currentValue;
    return this._unit === "rad" && (t = t * (180 / Math.PI)), t;
  }
  get radians() {
    let t = this._currentValue;
    return this._unit === "deg" && (t = t * (Math.PI / 180)), t;
  }
  setDegrees(t, e = !0) {
    this._unit = "deg", this._setTarget(t, e);
  }
  setRadians(t, e = !0) {
    this._unit = "rad", this._setTarget(t, e);
  }
  reset(t = !0) {
    this._setTarget(0, t);
  }
  update(t, e) {
    this._targetValue !== this._currentValue && (this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    }));
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (typeof this._previousRenderValue > "u")
      return !0;
    const t = this.renderValue;
    return !O(t, this._previousRenderValue);
  }
  get renderValue() {
    return this._currentValue;
  }
  projectStyles() {
    const t = this.renderValue, e = `rotate(${t}${this._unit})`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !0;
  }
}
class Vd extends Xt {
  constructor() {
    super(...arguments), u(this, "_animateLayoutUpdateNextFrame", !1);
  }
  get x() {
    return this._currentValue.x;
  }
  get y() {
    return this._currentValue.y;
  }
  set(t, e = !0) {
    const i = { x: this._currentValue.x, y: this._currentValue.y, ...typeof t == "number" ? { x: t, y: t } : t };
    this._setTarget(new b(i.x, i.y), e);
  }
  setWithSize(t, e = !0) {
    let i = this._currentValue.x, o = this._currentValue.y;
    t.width && (i = t.width / this._rect.size.width), t.height && (o = t.height / this._rect.size.height), !t.width && t.height && (i = o), !t.height && t.width && (o = i);
    const n = { x: i, y: o };
    this._setTarget(new b(n.x, n.y), e);
  }
  reset(t = !0) {
    this._setTarget(new b(1, 1), t);
  }
  update(t, e) {
    if (this._view.layoutOption !== "position") {
      if ((this._view.isInverseEffectEnabled || this._view.isLayoutTransitionEnabled) && !this._view.isTemporaryView && this._runLayoutTransition(), this._view.isInverseEffectEnabled) {
        const i = this._view._parent, o = i ? i.scale.x : 1, n = i ? i.scale.y : 1;
        this._hasChanged = o !== 1 || n !== 1;
      }
      this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y || (this._currentValue = this._animator.update({
        animatorProp: this._animatorProp,
        current: this._currentValue,
        target: this._targetValue,
        initial: new b(this._previousValue.x, this._previousValue.y),
        ts: t,
        dt: e
      }));
    }
  }
  _runLayoutTransition() {
    const t = !(this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y), e = this._previousRect.size.width / this._rect.size.width, i = this._previousRect.size.height / this._rect.size.height;
    let o = !1;
    if ((!Number.isNaN(e) && e !== 1 || !Number.isNaN(i) && i !== 1) && (o = !0), o) {
      if (this._currentValue.x !== 1 || this._currentValue.y !== 1) {
        const c = this._view.previousRect.size.width / this._view.rect.size.width, d = this._view.previousRect.size.height / this._view.rect.size.height;
        this._setTarget(
          new b(this._currentValue.x * c, this._currentValue.y * d),
          !1
        ), t && (this._animateLayoutUpdateNextFrame = !0);
        return;
      }
      const n = this._previousRect.size.width / this._rect.size.width, r = this._previousRect.size.height / this._rect.size.height, a = n, l = r;
      this._view.viewProps.borderRadius.applyScaleInverse(), this._setTarget(new b(a, l), !1), this._animateLayoutUpdateNextFrame = !0;
    } else this._animateLayoutUpdateNextFrame && (this._setTarget(this._initialValue, !0), this._animateLayoutUpdateNextFrame = !1);
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(O(t.x, this._previousRenderValue.x) && O(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    const t = this._view._parent ? this._view._parent.scale.x : 1, e = this._view._parent ? this._view._parent.scale.y : 1, i = this._currentValue.x / t, o = this._currentValue.y / e;
    return new b(i, o);
  }
  projectStyles() {
    const t = this.renderValue, e = `scale3d(${t.x}, ${t.y}, 1)`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !0;
  }
}
class Hd extends Xt {
  get width() {
    return this._view.rect.size.width;
  }
  get height() {
    return this._view.rect.size.height;
  }
  get localWidth() {
    return this._currentValue.x;
  }
  get localHeight() {
    return this._currentValue.y;
  }
  get widthAfterScale() {
    const t = this._view.scale.x;
    return this.localWidth * t;
  }
  get heightAfterScale() {
    const t = this._view.scale.y;
    return this.localHeight * t;
  }
  get initialWidth() {
    return this._initialValue.x;
  }
  get initialHeight() {
    return this._initialValue.y;
  }
  set(t, e = !0) {
    const i = { width: this._currentValue.x, height: this._currentValue.y, ...t };
    this._setTarget(new b(i.width, i.height), e);
  }
  setWidth(t, e = !0) {
    const i = { width: this._currentValue.x, height: this._currentValue.y, width: t };
    this._setTarget(new b(i.width, i.height), e);
  }
  setHeight(t, e = !0) {
    const i = { width: this._currentValue.x, height: this._currentValue.y, height: t };
    this._setTarget(new b(i.width, i.height), e);
  }
  reset(t = !0) {
    this._setTarget(
      new b(this.initialWidth, this.initialHeight),
      t
    );
  }
  update(t, e) {
    this._targetValue.x === this._currentValue.x && this._targetValue.y === this._currentValue.y || (this._currentValue = this._animator.update({
      animatorProp: this._animatorProp,
      current: this._currentValue,
      target: this._targetValue,
      initial: this._previousValue,
      ts: t,
      dt: e
    }));
  }
  get shouldRender() {
    if (!this._hasChanged)
      return !1;
    if (!this._previousRenderValue)
      return !0;
    const t = this.renderValue;
    return !(O(t.x, this._previousRenderValue.x) && O(t.y, this._previousRenderValue.y));
  }
  get renderValue() {
    return new b(this._currentValue.x, this._currentValue.y);
  }
  projectStyles() {
    const t = this.renderValue, e = `width: ${t.x}px; height: ${t.y}px;`;
    return this._previousRenderValue = t, e;
  }
  isTransform() {
    return !1;
  }
}
class Fd {
  constructor(t) {
    u(this, "_props", /* @__PURE__ */ new Map()), this._props.set(
      "position",
      new Nd(new Pe(), new b(0, 0), t)
    ), this._props.set(
      "scale",
      new Vd(new Pe(), new b(1, 1), t)
    ), this._props.set(
      "rotation",
      new Dd(new ms(), 0, t)
    ), this._props.set(
      "size",
      new Hd(
        new Pe(),
        new b(t.rect.size.width, t.rect.size.height),
        t
      )
    ), this._props.set(
      "opacity",
      new Pd(
        new ms(),
        t.elementReader.opacity.value,
        t
      )
    ), this._props.set(
      "borderRadius",
      new Rd(
        new Md(),
        [
          t.elementReader.borderRadius.value.topLeft,
          t.elementReader.borderRadius.value.topRight,
          t.elementReader.borderRadius.value.bottomRight,
          t.elementReader.borderRadius.value.bottomLeft
        ],
        t
      )
    ), this._props.set(
      "origin",
      new Od(
        new Pe(),
        t.elementReader.origin.value,
        t
      )
    );
  }
  allProps() {
    return Array.from(this._props.values());
  }
  allPropNames() {
    return Array.from(this._props.keys());
  }
  getPropByName(t) {
    return this._props.get(t);
  }
  get position() {
    return this._props.get("position");
  }
  get scale() {
    return this._props.get("scale");
  }
  get rotation() {
    return this._props.get("rotation");
  }
  get size() {
    return this._props.get("size");
  }
  get opacity() {
    return this._props.get("opacity");
  }
  get borderRadius() {
    return this._props.get("borderRadius");
  }
  get origin() {
    return this._props.get("origin");
  }
}
class $d {
  constructor(t, e, i, o) {
    u(this, "id"), u(this, "name"), u(this, "element"), u(this, "styles", {}), u(this, "_viewProps"), u(this, "_previousRect"), u(this, "_onAddCallbacks"), u(this, "_onRemoveCallback"), u(this, "_skipFirstRenderFrame"), u(this, "_layoutTransition"), u(this, "_registry"), u(this, "_layoutId"), u(this, "_elementReader"), u(this, "_viewParents"), u(this, "_temporaryView"), u(this, "_inverseEffect"), u(this, "_renderNextTick"), u(this, "_layoutOption"), u(this, "_elementObserver"), u(this, "_hasReadElement"), u(this, "_shouldReadRect"), u(this, "_readWithScroll"), u(this, "_externalUserStyles"), this._registry = i, this.id = Rn(), this.name = e, this.element = t, this.element.dataset.velViewId = this.id, this._elementReader = fs(this), this._viewParents = this._getParents(), this._previousRect = this._elementReader.rect, this._viewProps = new Fd(this), this._skipFirstRenderFrame = !0, this._layoutId = o, this._layoutTransition = !1, this._temporaryView = !1, this.styles = zi(this.styles, () => {
      this._renderNextTick = !0;
    }), this._externalUserStyles = this._getExternalUserStyles(), this._renderNextTick = !1, this._layoutOption = this._getLayoutOption(), this._hasReadElement = !1, this._shouldReadRect = !1, this._readWithScroll = !1, this._elementObserver = cd(t), this._elementObserver.onChange((n) => {
      if (this._hasReadElement) {
        this._shouldReadRect = !1;
        return;
      }
      this._externalUserStyles = this._getExternalUserStyles(), this._shouldReadRect = !0, this._readWithScroll = n;
    });
  }
  destroy() {
    this._viewProps.allProps().forEach((t) => t.destroy()), this.element.removeAttribute("data-vel-view-id"), this.element.removeAttribute("data-vel-plugin-id"), this._renderNextTick = !0;
  }
  get elementReader() {
    return this._elementReader;
  }
  get layoutOption() {
    return this._layoutOption;
  }
  _getLayoutOption() {
    return this.element.closest("[data-vel-layout-position]") ? "position" : this.element.closest("[data-vel-layout-size]") ? "size" : "all";
  }
  setElement(t) {
    this.element = t, this._elementReader = fs(this), this.element.dataset.velViewId = this.id, this._elementObserver.setElement(t), this._viewParents = this._getParents();
  }
  get layoutId() {
    return this._layoutId;
  }
  get position() {
    return this._viewProps.position;
  }
  get scale() {
    return this._viewProps.scale;
  }
  get _children() {
    const t = this.element.querySelectorAll("*");
    return Array.from(t).map((e) => e.dataset.velViewId).filter((e) => e && typeof e == "string").map((e) => this._registry.getViewById(e)).filter((e) => !!e);
  }
  get _parent() {
    return this._parents[0];
  }
  get _parents() {
    return this._viewParents;
  }
  _getParents() {
    var t;
    const e = [];
    let i = this.element.parentElement;
    if (!i) return e;
    for (i = i.closest("[data-vel-view-id]"); i; ) {
      const o = i.dataset.velViewId;
      if (o) {
        const n = this._registry.getViewById(o);
        n && e.push(n);
      }
      i = (t = i.parentElement) == null ? void 0 : t.closest(
        "[data-vel-view-id]"
      );
    }
    return e;
  }
  get rotation() {
    return this._viewProps.rotation;
  }
  get size() {
    return this._viewProps.size;
  }
  get _localWidth() {
    return this._viewProps.size.localWidth;
  }
  get _localHeight() {
    return this._viewProps.size.localHeight;
  }
  get opacity() {
    return this._viewProps.opacity;
  }
  get borderRadius() {
    return this._viewProps.borderRadius;
  }
  get origin() {
    return this._viewProps.origin;
  }
  get data() {
    const t = this.element.dataset;
    return Object.keys(t).filter((e) => e.includes("velData")).map((e) => e.replace("velData", "")).map((e) => `${e[0].toLowerCase()}${e.slice(1)}`).reduce((e, i) => {
      const o = t[`velData${i[0].toUpperCase()}${i.slice(1)}`];
      return !e[i] && o && (e[i] = o), e;
    }, {});
  }
  get onAddCallbacks() {
    return this._onAddCallbacks;
  }
  get onRemoveCallback() {
    return this._onRemoveCallback;
  }
  get isLayoutTransitionEnabled() {
    return this._layoutTransition;
  }
  get hasLayoutTransitionEnabledForParents() {
    return this._parents.some((t) => t.isLayoutTransitionEnabled);
  }
  get isInverseEffectEnabled() {
    let t = !1;
    for (let e = 0; e < this._parents.length; e++) {
      const i = this._parents[e];
      if (typeof i._inverseEffect < "u") {
        t = i._inverseEffect;
        break;
      }
    }
    return t;
  }
  layoutTransition(t) {
    this._layoutTransition = t, this.inverseEffect(t);
  }
  inverseEffect(t) {
    this._inverseEffect = t, t && this._children.forEach((e) => {
      if (e.position.animator.name === "instant") {
        const i = this.viewProps.position.getAnimator();
        e.position.setAnimator(
          i.name,
          i.config
        );
      }
      if (e.scale.animator.name === "instant") {
        const i = this.viewProps.scale.getAnimator();
        e.scale.setAnimator(i.name, i.config);
      }
    });
  }
  setAnimatorsFromParent() {
    let t = this._parent;
    for (; t && !t._inverseEffect; )
      t = t._parent;
    if (t) {
      if (this.position.animator.name === "instant") {
        const e = t.viewProps.position.getAnimator();
        this.position.setAnimator(e.name, e.config);
      }
      if (this.scale.animator.name === "instant") {
        const e = t.viewProps.scale.getAnimator();
        this.scale.setAnimator(e.name, e.config);
      }
    }
  }
  get _isRemoved() {
    return !this._registry.getViewById(this.id);
  }
  setPluginId(t) {
    this.element.dataset.velPluginId = t;
  }
  hasElement(t) {
    return this.element.contains(t);
  }
  getScroll() {
    return this._elementReader.scroll;
  }
  intersects(t, e) {
    const i = this.element.getBoundingClientRect(), o = {
      x: i.left,
      y: i.top
    };
    return t >= o.x && t <= o.x + i.width && e >= o.y && e <= o.y + i.height;
  }
  // Using AABB collision detection
  overlapsWith(t) {
    const e = t._localWidth * t.scale.x, i = t._localHeight * t.scale.y, o = this._localWidth * this.scale.x, n = this._localHeight * this.scale.y;
    return this.position.x < t.position.x + e && this.position.x + o > t.position.x && this.position.y < t.position.y + i && this.position.y + n > t.position.y;
  }
  distanceTo(t) {
    const e = new b(this.position.x, this.position.y), i = new b(t.position.x, t.position.y);
    return b.sub(i, e).magnitude;
  }
  read() {
    this._shouldReadRect && (this._elementReader.update(this._readWithScroll), this._children.forEach((t) => {
      t.setHasReadElement(!0), t.elementReader.update(this._readWithScroll);
    }), this._shouldReadRect = !1, this._readWithScroll = !1), this.setHasReadElement(!1);
  }
  setHasReadElement(t) {
    this._hasReadElement = t;
  }
  get rect() {
    return this._elementReader.rect;
  }
  get previousRect() {
    return this._previousRect;
  }
  update(t, e) {
    this._viewProps.allProps().forEach((i) => i.update(t, e));
  }
  _updatePreviousRect() {
    this._previousRect = this._elementReader.rect;
  }
  setAsTemporaryView() {
    this._temporaryView = !0;
  }
  get isTemporaryView() {
    return this._temporaryView;
  }
  get shouldRender() {
    return this._renderNextTick || this._viewProps.allProps().some((t) => t.shouldRender);
  }
  _cleanCssText(t) {
    const e = /* @__PURE__ */ new Map(), i = /([-\w]+)\s*:\s*([^;]+)\s*;?/g;
    let o;
    for (; (o = i.exec(t)) !== null; ) {
      const [n, r, a] = o;
      if (!a.trim()) continue;
      const l = r.replace(/^-\w+-/, "");
      (!e.has(l) || !r.startsWith("-")) && e.set(
        l,
        `${l}: ${a.trim()}`
      );
    }
    return Array.from(e.values()).join("; ");
  }
  render() {
    if (!this.shouldRender)
      return;
    if (this._isRemoved && this._skipFirstRenderFrame) {
      this._skipFirstRenderFrame = !1;
      return;
    }
    let t = "";
    const e = this._viewProps.allProps(), i = e.filter((n) => n.isTransform()), o = e.filter((n) => !n.isTransform());
    if (i.some((n) => n.hasChanged())) {
      const n = i.reduce((r, a, l) => (r += a.projectStyles(), l < i.length - 1 && (r += " "), l === i.length - 1 && (r += ";"), r), "transform: ");
      t += n;
    }
    o.forEach((n) => {
      n.hasChanged() && (t += n.projectStyles());
    }), t += this._getUserStyles(), this._cleanCssText(this.element.style.cssText) !== this._cleanCssText(t) && (this.element.style.cssText = t), this._renderNextTick = !1;
  }
  _getExternalUserStyles() {
    const t = this.element.style.cssText, e = this.styles;
    if (t.length === 0)
      return "";
    const i = [
      "transform",
      "transform-origin",
      "opacity",
      "width",
      "height",
      "border-radius"
    ], o = {};
    for (const n in e)
      e.hasOwnProperty(n) && (o[cs(n)] = e[n]);
    return t.split(";").map((n) => n.trim()).filter(Boolean).filter((n) => {
      const r = n.indexOf(":");
      if (r === -1) return !1;
      const a = n.slice(0, r).trim();
      return !o.hasOwnProperty(a) && !i.includes(a);
    }).join("; ");
  }
  _getUserStyles() {
    return Object.keys(this.styles).reduce((t, e) => {
      if (!e) return t;
      const i = cs(e).replace("webkit", "-webkit").replace("moz", "-moz");
      return t + `${i}: ${this.styles[e]}; `;
    }, this._externalUserStyles);
  }
  markAsAdded() {
    delete this.element.dataset.velProcessing;
  }
  onAdd(t) {
    this._onAddCallbacks = t;
  }
  onRemove(t) {
    this._onRemoveCallback = t;
  }
  get viewProps() {
    return this._viewProps;
  }
  getPropByName(t) {
    return this._viewProps.getPropByName(t);
  }
  _copyAnimatorsToAnotherView(t) {
    t.viewProps.allPropNames().forEach((e) => {
      var i, o;
      const n = (i = this.viewProps.getPropByName(e)) == null ? void 0 : i.getAnimator();
      n && ((o = t.viewProps.getPropByName(e)) == null || o.setAnimator(n.name, n.config));
    });
  }
  getChildren(t) {
    const e = this.element.querySelectorAll("*"), i = Array.from(e).filter((o) => {
      const n = o;
      return typeof n.dataset.velViewId < "u" && n.dataset.velView === t;
    }).map((o) => o.dataset.velViewId);
    return this._registry.getViewsById(i);
  }
  getChild(t) {
    return this.getChildren(t)[0];
  }
  getParent(t) {
    const e = this.element.closest(
      `[data-vel-view="${t}"]`
    );
    if (!e) return;
    const i = e.dataset.velViewId;
    if (i)
      return this._registry.getViewById(i);
  }
}
class zd {
  constructor(t, e) {
    u(this, "_appEventBus"), u(this, "_eventBus"), u(this, "_plugins", []), u(this, "_views", []), u(this, "_viewsPerPlugin", /* @__PURE__ */ new Map()), u(this, "_viewsToBeCreated", []), u(this, "_viewsToBeRemoved", []), u(this, "_viewsCreatedInPreviousFrame", []), u(this, "_layoutIdToViewMap", /* @__PURE__ */ new Map()), u(this, "_eventPluginsPerPlugin", /* @__PURE__ */ new Map()), u(this, "_pluginNameToPluginFactoryMap", /* @__PURE__ */ new Map()), u(this, "_pluginNameToPluginConfigMap", /* @__PURE__ */ new Map()), this._appEventBus = t, this._eventBus = e;
  }
  update() {
    this._handleRemovedViews(), this._handleAddedViews();
  }
  associateEventPluginWithPlugin(t, e) {
    let i = this._eventPluginsPerPlugin.get(t);
    i || (i = [], this._eventPluginsPerPlugin.set(t, i)), i.push(e);
  }
  _handleRemovedViews() {
    const t = this._viewsToBeRemoved.filter((e) => e.dataset.velViewId);
    t.length && (t.forEach((e) => {
      const i = e.dataset.velViewId;
      i && this._handleRemoveView(i);
    }), this._viewsToBeRemoved = []);
  }
  _getPluginNameForElement(t) {
    const e = t.dataset.velPlugin;
    if (e && e.length > 0) return e;
    const i = t.closest("[data-vel-plugin]");
    if (i)
      return i.dataset.velPlugin;
  }
  _getPluginIdForElement(t) {
    const e = this._getPluginNameForElement(t);
    if (!e)
      return;
    const i = t.closest("[data-vel-plugin-id]");
    if (i)
      return i.dataset.velPluginId;
    const o = this.getPluginByName(e);
    if (o)
      return o.id;
  }
  _isScopedElement(t) {
    const e = this._getPluginNameForElement(t);
    if (!e)
      return !1;
    const i = this._pluginNameToPluginFactoryMap.get(e), o = i == null ? void 0 : i.scope;
    return t.dataset.velView === o;
  }
  _removeElementsWithParent(t) {
    const e = new Set(t);
    return t.filter((i) => {
      let o = i.parentElement;
      for (; o; ) {
        if (e.has(o))
          return !1;
        o = o.parentElement;
      }
      return !0;
    });
  }
  _handleAddedViews() {
    this._viewsCreatedInPreviousFrame.forEach((n) => {
      n.markAsAdded();
    }), this._viewsCreatedInPreviousFrame = [];
    const t = this._removeElementsWithParent(
      this._viewsToBeCreated
    ), e = Array.from(
      new Set(
        t.filter(
          (n) => this._isScopedElement(n) && !this._isElementIgnored(n)
        )
      )
    ), i = t.filter(
      (n) => !this._isScopedElement(n) && !this._isElementIgnored(n)
    );
    this._viewsToBeCreated = [], e.forEach((n) => {
      const r = this._getPluginNameForElement(n), a = this._pluginNameToPluginFactoryMap.get(r), l = this._pluginNameToPluginConfigMap.get(r), c = n.dataset.velPluginKey, d = yi(
        a,
        this,
        this._eventBus,
        this._appEventBus,
        l,
        c
      );
      this._plugins.push(d);
      const h = n.dataset.velView, g = this._createNewView(n, h, d);
      g.isInverseEffectEnabled && g.setAnimatorsFromParent(), d.notifyAboutViewAdded(g);
    });
    const o = i.filter((n) => !!this._getPluginIdForElement(n));
    o.length !== 0 && o.forEach((n) => {
      const r = this._getPluginIdForElement(n), a = n.dataset.velView;
      if (!a || !r) return;
      const l = this._getPluginById(r);
      if (!l)
        return;
      const c = this._getLayoutIdForElement(n, l);
      let d;
      c && this._layoutIdToViewMap.has(c) ? (d = this._layoutIdToViewMap.get(c), d.setElement(n), d.setPluginId(l.id), this._createChildrenForView(d, l)) : d = this._createNewView(n, a, l), d.isInverseEffectEnabled && d.setAnimatorsFromParent(), l.notifyAboutViewAdded(d);
    });
  }
  _getLayoutIdForElement(t, e) {
    const i = t.dataset.velLayoutId;
    if (i)
      return `${i}-${e.id}`;
  }
  _createNewView(t, e, i) {
    const o = this._getLayoutIdForElement(t, i), n = this.createView(t, e, o);
    return i.addView(n), n.layoutId && this._layoutIdToViewMap.set(n.layoutId, n), this._createChildrenForView(n, i), this._appEventBus.emitPluginReadyEvent(i.pluginName, i.api, !0), requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._appEventBus.emitPluginReadyEvent(i.pluginName, i.api);
      });
    }), n;
  }
  _createChildrenForView(t, e) {
    const i = t.element.querySelectorAll("*");
    if (i.length) {
      if (Array.from(i).some(
        (o) => this._getPluginNameForElement(o) !== e.pluginName
      )) {
        console.log(
          `%c WARNING: The plugin "${e.pluginName}" has view(s) created for a different plugin. Make sure all views inside that plugin don't have data-vel-plugin set or the pluginName is set to "${e.pluginName}"`,
          "background: #885500"
        );
        return;
      }
      Array.from(i).filter((o) => !this._isElementIgnored(o)).forEach((o) => {
        const n = o, r = n.dataset.velView ? n.dataset.velView : `${t.name}-child`, a = this._getLayoutIdForElement(n, e), l = this.createView(n, r, a);
        a && !this._layoutIdToViewMap.has(a) && this._layoutIdToViewMap.set(a, l), e.addView(l), e.notifyAboutViewAdded(l);
      });
    }
  }
  _handleRemoveView(t) {
    this._plugins.forEach((e) => {
      if (!this._viewsPerPlugin.get(e.id)) return;
      const i = this._getPluginViewById(e, t);
      i && e.removeView(i);
    });
  }
  removeViewById(t, e) {
    this._unassignViewFromPlugin(t, e), this._views = this._views.filter((i) => i.id !== t);
  }
  _unassignViewFromPlugin(t, e) {
    const i = this._viewsPerPlugin.get(e);
    if (!i) return;
    const o = i.indexOf(t);
    o !== -1 && i.splice(o, 1);
  }
  getViewById(t) {
    return this._views.find((e) => e.id === t);
  }
  getViewsById(t) {
    return this._views.filter((e) => t.includes(e.id));
  }
  _getPluginById(t) {
    return this._plugins.find((e) => e.id === t);
  }
  _getPluginViewById(t, e) {
    return this.getViewsForPlugin(t).find((i) => i.id === e);
  }
  destroy(t, e) {
    if (!t) {
      this._destroyAll(e);
      return;
    }
    let i = [];
    if (t && t.length > 0) {
      const o = this.getPluginByName(t);
      if (o) {
        const n = (this._eventPluginsPerPlugin.get(o.id) || []).map((r) => this._getPluginById(r)).filter((r) => typeof r < "u");
        i.push(o), i.push(...n);
      }
    } else
      i = this._plugins;
    i.forEach((o) => {
      this._destroyPlugin(o);
    }), requestAnimationFrame(() => {
      e == null || e();
    });
  }
  _destroyPlugin(t) {
    const e = this.getViewsForPlugin(t);
    e.forEach((i) => {
      i.layoutId && this._layoutIdToViewMap.delete(i.layoutId), i.destroy();
    }), this._views = this._views.filter(
      (i) => !e.find((o) => o.id === i.id)
    ), this._viewsPerPlugin.delete(t.id), this._plugins = this._plugins.filter((i) => i.id !== t.id);
  }
  _destroyAll(t) {
    this._views.forEach((e) => e.destroy()), requestAnimationFrame(() => {
      this._plugins = [], this._views = [], this._viewsPerPlugin.clear(), this._viewsToBeCreated = [], this._viewsToBeRemoved = [], this._viewsCreatedInPreviousFrame = [], this._layoutIdToViewMap.clear(), this._eventPluginsPerPlugin.clear(), t == null || t();
    });
  }
  reset(t, e) {
    let i = [];
    if (t && t.length > 0) {
      const o = this.getPluginByName(t);
      if (o) {
        const n = (this._eventPluginsPerPlugin.get(o.id) || []).map((r) => this._getPluginById(r)).filter((r) => typeof r < "u");
        i.push(o), i.push(...n);
      }
    } else
      i = this._plugins;
    requestAnimationFrame(() => {
      i.forEach((o) => {
        this._resetPlugin(o);
      }), requestAnimationFrame(() => {
        e == null || e();
      });
    });
  }
  _resetPlugin(t) {
    const e = t.config, i = t.pluginFactory, o = t.internalBusEvent, n = !t.isRenderable(), r = this.getViewsForPlugin(t);
    r.forEach((a) => {
      a.layoutId && this._layoutIdToViewMap.delete(a.layoutId), a.destroy();
    }), this._views = this._views.filter(
      (a) => !r.find((l) => l.id === a.id)
    ), this._viewsPerPlugin.delete(t.id), this._plugins = this._plugins.filter((a) => a.id !== t.id), n || requestAnimationFrame(() => {
      this.createPlugin(
        i,
        this._eventBus,
        e
      ).setInternalEventBus(o);
    });
  }
  queueNodeToBeCreated(t) {
    this._viewsToBeCreated.push(t);
  }
  queueNodeToBeRemoved(t) {
    this._viewsToBeRemoved.push(t);
  }
  notifyPluginAboutDataChange(t) {
    const e = this._plugins.filter(
      (i) => i.id === t.pluginId
    );
    !e || !e.length || e.forEach((i) => {
      i.notifyAboutDataChanged({
        dataName: t.dataName,
        dataValue: t.dataValue,
        viewName: t.viewName
      });
    });
  }
  getPlugins() {
    return this._plugins;
  }
  getRenderablePlugins() {
    function t(e) {
      return e.isRenderable();
    }
    return this._plugins.filter(t);
  }
  getPluginByName(t, e) {
    return this._plugins.find((i) => e ? i.pluginKey === e && i.pluginName === t : i.pluginName === t);
  }
  getPluginsByName(t, e) {
    return this._plugins.filter((i) => e ? i.pluginKey === e && i.pluginName === t : i.pluginName === t);
  }
  hasPlugin(t) {
    return t.pluginName ? !!this.getPluginByName(t.pluginName) : !1;
  }
  createPlugin(t, e, i = {}, o = !1) {
    if (!t.pluginName)
      throw Error(
        `Plugin ${t.name} must contain a pluginName field`
      );
    let n = [];
    if (t.scope) {
      const l = o ? `[data-vel-plugin=${t.pluginName}][data-vel-view=${t.scope}]:not([data-vel-plugin-id])` : `[data-vel-plugin=${t.pluginName}][data-vel-view=${t.scope}]`, c = document.querySelectorAll(l);
      this._pluginNameToPluginFactoryMap.has(t.pluginName) || this._pluginNameToPluginFactoryMap.set(
        t.pluginName,
        t
      ), this._pluginNameToPluginConfigMap.has(t.pluginName) || this._pluginNameToPluginConfigMap.set(t.pluginName, i), c ? n = Array.from(c) : n = [document.documentElement];
    } else
      n = [document.documentElement];
    const r = n.map((l) => {
      const c = l.dataset.velPluginKey, d = yi(
        t,
        this,
        e,
        this._appEventBus,
        i,
        c
      );
      this._plugins.push(d);
      let h = [];
      l !== document.documentElement && h.push(l);
      const g = l.querySelectorAll(
        `[data-vel-plugin=${d.pluginName}]`
      );
      h = [...h, ...g];
      const v = h.filter((f) => {
        if (this._isElementIgnored(f))
          return !1;
        if (!f.parentElement)
          return !0;
        const w = this._getPluginNameForElement(f.parentElement);
        return !(w && w.length > 0);
      });
      return v.length && v.forEach((f) => {
        const w = f.dataset.velView;
        if (!w) return;
        const _ = this._createNewView(f, w, d);
        d.notifyAboutViewAdded(_);
      }), d;
    });
    if (r && r.length > 0)
      return r[0];
    const a = yi(
      t,
      this,
      e,
      this._appEventBus,
      i
    );
    return t.scope || console.log(
      `%c WARNING: The plugin "${a.pluginName}" is created but there are no elements using it on the page`,
      "background: #885500"
    ), a;
  }
  updatePlugin(t, e, i = {}) {
    return this.createPlugin(t, e, i, !0);
  }
  getViews() {
    return this._views;
  }
  createView(t, e, i) {
    const o = new $d(t, e, this, i);
    return this._views.push(o), this._viewsCreatedInPreviousFrame.push(o), o;
  }
  _isElementIgnored(t) {
    return t.closest("[data-vel-ignore]");
  }
  assignViewToPlugin(t, e) {
    this._viewsPerPlugin.has(e.id) || this._viewsPerPlugin.set(e.id, []);
    const i = this._viewsPerPlugin.get(e.id);
    i.includes(t.id) || i.push(t.id);
  }
  getViewsForPlugin(t) {
    const e = this._viewsPerPlugin.get(t.id);
    return e ? e.map((i) => this._views.find((o) => o.id === i)).filter((i) => !!i) : [];
  }
  getViewsByNameForPlugin(t, e) {
    return this.getViewsForPlugin(t).filter(
      (i) => i.name === e
    );
  }
}
class vs {
  constructor(t) {
    u(this, "pluginApi"), this.pluginApi = t.pluginApi;
  }
}
class bs {
  constructor(t) {
    u(this, "pluginApi"), this.pluginApi = t.pluginApi;
  }
}
class yo {
  constructor() {
    u(this, "previousTime", 0), u(this, "registry"), u(this, "eventBus"), u(this, "appEventBus"), this.eventBus = new Fi(), this.appEventBus = new Fi(), this.registry = new zd(this.appEventBus, this.eventBus), new id(this.eventBus);
  }
  static create() {
    return new yo();
  }
  addPlugin(t, e = {}) {
    this.registry.hasPlugin(t) || this.registry.createPlugin(t, this.eventBus, e);
  }
  updatePlugin(t, e = {}) {
    this.registry.hasPlugin(t) && this.registry.updatePlugin(t, this.eventBus, e);
  }
  reset(t, e) {
    this.registry.reset(t, e);
  }
  destroy(t, e) {
    this.registry.destroy(t, e);
  }
  getPlugin(t, e) {
    let i = typeof t == "string" ? t : t.pluginName;
    const o = this.registry.getPluginByName(i, e);
    if (!o)
      throw new Error(
        `You can't call getPlugin for ${i} with key: ${e} because it does not exist in your app`
      );
    return o.api;
  }
  getPlugins(t, e) {
    let i = typeof t == "string" ? t : t.pluginName;
    const o = this.registry.getPluginsByName(i, e);
    if (o.length === 0)
      throw new Error(
        `You can't call getPlugins for ${i} with key: ${e} because they don't exist in your app`
      );
    return o.map((n) => n.api);
  }
  onPluginEvent(t, e, i, o) {
    requestAnimationFrame(() => {
      const n = this.registry.getPluginByName(
        t.pluginName,
        o
      );
      n && n.on(e, i);
    });
  }
  removePluginEventListener(t, e, i) {
    const o = this.registry.getPluginByName(t.pluginName);
    o && o.removeListener(e, i);
  }
  run() {
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", this.start.bind(this)) : this.start();
  }
  start() {
    this.setup(), requestAnimationFrame(this.tick.bind(this));
  }
  setup() {
    this.listenToNativeEvents(), this.subscribeToEvents();
  }
  listenToNativeEvents() {
    document.addEventListener("click", (t) => {
      this.eventBus.emitEvent(co, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    }), document.addEventListener("pointermove", (t) => {
      this.eventBus.emitEvent(ri, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    }), document.addEventListener("pointerdown", (t) => {
      this.eventBus.emitEvent(ai, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    }), document.addEventListener("pointerup", (t) => {
      this.eventBus.emitEvent(li, {
        x: t.clientX,
        y: t.clientY,
        target: t.target
      });
    });
  }
  tick(t) {
    let e = (t - this.previousTime) / 1e3;
    e > 0.016 && (e = 1 / 60), this.previousTime = t, this.eventBus.reset(), this.subscribeToEvents(), this.read(), this.update(t, e), this.render(), requestAnimationFrame(this.tick.bind(this));
  }
  subscribeToEvents() {
    this.eventBus.subscribeToEvent($e, this.onNodeAdded.bind(this)), this.eventBus.subscribeToEvent(
      Hi,
      this.onNodeRemoved.bind(this)
    ), this.eventBus.subscribeToEvent(
      An,
      this.onDataChanged.bind(this)
    ), this.registry.getPlugins().forEach((t) => {
      t.subscribeToEvents(this.eventBus);
    });
  }
  onNodeAdded({ node: t }) {
    this.registry.queueNodeToBeCreated(t);
  }
  onNodeRemoved({ node: t }) {
    this.registry.queueNodeToBeRemoved(t);
  }
  onDataChanged(t) {
    this.registry.notifyPluginAboutDataChange(t);
  }
  read() {
    this.registry.getViews().forEach((t) => {
      t.read();
    });
  }
  update(t, e) {
    this.registry.update(), this.registry.getPlugins().slice().reverse().forEach((i) => {
      i.init();
    }), this.registry.getRenderablePlugins().forEach((i) => {
      i.update(t, e);
    }), this.registry.getViews().forEach((i) => {
      i.update(t, e);
    }), this.registry.getViews().forEach((i) => {
      i._updatePreviousRect();
    });
  }
  render() {
    this.registry.getRenderablePlugins().forEach((t) => {
      t.render();
    }), this.registry.getViews().forEach((t) => {
      t.render();
    });
  }
}
function jd() {
  return yo.create();
}
class On {
  constructor(t) {
    u(this, "view"), u(this, "previousX"), u(this, "previousY"), u(this, "x"), u(this, "y"), u(this, "pointerX"), u(this, "pointerY"), u(this, "isDragging"), u(this, "target"), u(this, "directions", []), u(this, "width"), u(this, "height"), u(this, "distance"), u(this, "stopped"), u(this, "hasMoved"), this.props = t, this.previousX = t.previousX, this.previousY = t.previousY, this.x = t.x, this.y = t.y, this.pointerX = t.pointerX, this.pointerY = t.pointerY, this.width = t.width, this.height = t.height, this.distance = t.distance, this.view = t.view, this.isDragging = t.isDragging, this.stopped = t.stopped, this.target = t.target, this.directions = t.directions, this.hasMoved = t.hasMoved;
  }
}
class Nn extends ho {
  constructor() {
    super(...arguments), u(this, "_pointerX", 0), u(this, "_pointerY", 0), u(this, "_initialPointer", new b(0, 0)), u(this, "_initialPointerPerView", /* @__PURE__ */ new Map()), u(this, "_pointerDownPerView", /* @__PURE__ */ new Map()), u(this, "_viewPointerPositionLog", /* @__PURE__ */ new Map()), u(this, "_stopTimer", 0);
  }
  setup() {
    document.addEventListener("selectstart", this.onSelect.bind(this));
  }
  onSelect(t) {
    this._isDragging && t.preventDefault();
  }
  get _isDragging() {
    return Array.from(this._pointerDownPerView.values()).some(
      (t) => !!t
    );
  }
  subscribeToEvents(t) {
    t.subscribeToEvent(ai, ({ x: e, y: i }) => {
      this._initialPointer = new b(e, i), this.getViews().forEach((o) => {
        this._pointerDownPerView.set(o.id, o.intersects(e, i));
        const n = o.isLayoutTransitionEnabled ? o.position.initialX : o.position.x, r = o.isLayoutTransitionEnabled ? o.position.initialY : o.position.y, a = new b(e - n, i - r);
        this._pointerX = e, this._pointerY = i, this._initialPointerPerView.set(o.id, a);
      });
    }), t.subscribeToEvent(li, () => {
      this.getViews().forEach((e) => {
        this._pointerDownPerView.get(e.id) && this._initialPointerPerView.get(e.id) && (this._pointerDownPerView.set(e.id, !1), this._emitEvent(e, []));
      });
    }), t.subscribeToEvent(ri, ({ x: e, y: i }) => {
      this._pointerX = e, this._pointerY = i, this.getViews().forEach((o) => {
        if (this._pointerDownPerView.get(o.id) && this._initialPointerPerView.get(o.id)) {
          this._viewPointerPositionLog.has(o.id) || this._viewPointerPositionLog.set(o.id, []);
          const n = new b(e, i), r = this._viewPointerPositionLog.get(o.id);
          r && r.push(new b(e, i));
          const a = r && r.length >= 2 ? r[r.length - 2] : n.clone(), l = this._calculateDirections(
            a,
            n
          );
          this._emitEvent(o, l), clearTimeout(this._stopTimer), this._stopTimer = setTimeout(() => {
            this._pointerDownPerView.get(o.id) === !0 && this._emitEvent(o, l, !0);
          }, 120);
        }
      });
    });
  }
  _emitEvent(t, e, i = !1) {
    const o = this._viewPointerPositionLog.get(t.id), n = !(typeof o > "u" || o.length <= 1), r = o && o.length >= 2 ? o[o.length - 2] : null, a = this._pointerX - this._initialPointerPerView.get(t.id).x, l = this._pointerY - this._initialPointerPerView.get(t.id).y, c = this._pointerX, d = this._pointerY, h = r ? r.x - this._initialPointerPerView.get(t.id).x : a, g = r ? r.y - this._initialPointerPerView.get(t.id).y : l, v = this._pointerY - this._initialPointer.y, f = this._pointerX - this._initialPointer.x, w = dd(this._initialPointer, {
      x: this._pointerX,
      y: this._pointerY
    }), _ = this._pointerDownPerView.get(t.id) === !0;
    _ || this._viewPointerPositionLog.clear();
    const L = {
      view: t,
      target: t.element,
      previousX: h,
      previousY: g,
      x: a,
      y: l,
      pointerX: c,
      pointerY: d,
      distance: w,
      width: f,
      height: v,
      isDragging: _,
      directions: e,
      stopped: i,
      hasMoved: n
    };
    this.emit(On, L);
  }
  _calculateDirections(t, e) {
    const i = {
      up: b.sub(new b(t.x, t.y - 1), t),
      down: b.sub(new b(t.x, t.y + 1), t),
      left: b.sub(new b(t.x - 1, t.y), t),
      right: b.sub(new b(t.x + 1, t.y), t)
    }, o = b.sub(e, t).unitVector;
    return [
      { direction: "up", projection: o.dot(i.up) },
      {
        direction: "down",
        projection: o.dot(i.down)
      },
      {
        direction: "left",
        projection: o.dot(i.left)
      },
      {
        direction: "right",
        projection: o.dot(i.right)
      }
    ].filter(
      (n) => n.projection > 0
    ).map(
      (n) => n.direction
    );
  }
}
u(Nn, "pluginName", "DragEventPlugin");
class Ud {
  constructor(t) {
    u(this, "view"), u(this, "direction"), this.props = t, this.view = t.view, this.direction = t.direction;
  }
}
class Wd extends ho {
  constructor() {
    super(...arguments), u(this, "_viewIsPointerDownMap", /* @__PURE__ */ new Map()), u(this, "_viewPointerPositionLog", /* @__PURE__ */ new Map()), u(this, "_targetPerView", /* @__PURE__ */ new Map());
  }
  subscribeToEvents(t) {
    t.subscribeToEvent(ai, ({ x: e, y: i, target: o }) => {
      this.getViews().forEach((n) => {
        this._targetPerView.set(n.id, o), n.intersects(e, i) && this._viewIsPointerDownMap.set(n.id, !0);
      });
    }), t.subscribeToEvent(ri, ({ x: e, y: i }) => {
      this.getViews().forEach((o) => {
        this._viewIsPointerDownMap.get(o.id) && (this._viewPointerPositionLog.has(o.id) || this._viewPointerPositionLog.set(o.id, []), this._viewPointerPositionLog.get(o.id).push(new b(e, i)));
      });
    }), t.subscribeToEvent(li, ({ x: e, y: i }) => {
      this.getViews().forEach((n) => {
        if (!this._viewIsPointerDownMap.get(n.id) || !this._viewPointerPositionLog.has(n.id))
          return;
        const r = new b(e, i), a = this._viewPointerPositionLog.get(n.id), l = a[a.length - 2] || r.clone(), c = this._targetPerView.get(n.id), d = o(l, r);
        c && n.hasElement(c) && d.hasSwiped && this.emit(Ud, {
          view: n,
          direction: d.direction
        }), this._viewPointerPositionLog.set(n.id, []), this._viewIsPointerDownMap.set(n.id, !1);
      });
      function o(n, r) {
        const a = {
          up: b.sub(new b(n.x, n.y - 1), n),
          down: b.sub(new b(n.x, n.y + 1), n),
          left: b.sub(new b(n.x - 1, n.y), n),
          right: b.sub(new b(n.x + 1, n.y), n)
        }, l = b.sub(r, n).unitVector, c = [
          "up",
          "down",
          "left",
          "right"
        ], d = [
          l.dot(a.up),
          l.dot(a.down),
          l.dot(a.left),
          l.dot(a.right)
        ], h = Math.max(...d), g = d.indexOf(h), v = c[g], f = b.sub(r, n).magnitude;
        return {
          hasSwiped: l.dot(a[v]) * f > 30,
          direction: v
        };
      }
    });
  }
}
u(Wd, "pluginName", "SwipeEventPlugin");
class qd {
  constructor(t) {
    u(this, "view"), this.props = t, this.view = t.view;
  }
}
class Yd extends ho {
  subscribeToEvents(t) {
    t.subscribeToEvent(co, ({ x: e, y: i, target: o }) => {
      this.getViews().forEach((n) => {
        const r = o, a = n.element === r || n.element.contains(r);
        n.intersects(e, i) && a && this.emit(qd, {
          view: n
        });
      });
    });
  }
}
u(Yd, "pluginName", "ClickEventPlugin");
const Kd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PointerClickEvent: co,
  PointerDownEvent: ai,
  PointerMoveEvent: ri,
  PointerUpEvent: li
}, Symbol.toStringTag, { value: "Module" }));
function Xd(s) {
  let t = Dn(s) || window;
  t === document.body && (t = window);
  let e = 0, i = 0, o = !1, n = () => {
  };
  return t.addEventListener("scroll", () => {
    o && n();
  }), {
    container: t,
    onScroll(r) {
      n = r;
    },
    startScrollTracking() {
      o || (e = t instanceof Element ? t.scrollTop : t.scrollY, i = t instanceof Element ? t.scrollLeft : t.scrollX, o = !0);
    },
    getScrollOffset() {
      const r = t instanceof Element ? t.scrollTop : t.scrollY;
      return {
        x: (t instanceof Element ? t.scrollLeft : t.scrollX) - i,
        y: r - e
      };
    },
    endScrollTracking() {
      e = 0, i = 0, o = !1;
    },
    width: t instanceof Element ? t.clientWidth : t.innerWidth,
    height: t instanceof Element ? t.clientHeight : t.innerHeight
  };
}
function Dn(s) {
  const t = s instanceof HTMLElement && window.getComputedStyle(s).overflowY, e = t !== "visible" && t !== "hidden";
  if (s) {
    if (e && s.scrollHeight >= s.clientHeight)
      return s;
  } else return null;
  return Dn(s.parentNode) || document.body;
}
class ze {
  constructor(t) {
    gt(this, "data"), this.data = t.data;
  }
}
class Vn {
  constructor(t) {
    gt(this, "data"), gt(this, "hasChanged"), this.data = t.data, this.hasChanged = t.hasChanged;
  }
}
class Hn {
}
class Fn {
  constructor(t) {
    gt(this, "data"), this.data = t.data;
  }
}
function ye(s) {
  return {
    map: new Map(s),
    array: Array.from(s).map(([t, e]) => ({ slotId: t, itemId: e })),
    object: Array.from(s).reduce(
      (t, [e, i]) => (t[e] = i, t),
      {}
    )
  };
}
function Zd(s) {
  if (s.map)
    return {
      map: new Map(s.map),
      array: Array.from(s.map).map(([t, e]) => ({
        slotId: t,
        itemId: e
      })),
      object: Array.from(s.map).reduce(
        (t, [e, i]) => (t[e] = i, t),
        {}
      )
    };
  if (s.object) {
    const t = { ...s.object };
    return {
      map: new Map(Object.entries(t)),
      array: Object.entries(t).map(([e, i]) => ({
        slotId: e,
        itemId: i
      })),
      object: t
    };
  } else {
    const t = [...s.array];
    return {
      map: new Map(t.map(({ slotId: e, itemId: i }) => [e, i])),
      array: t,
      object: t.reduce((e, { slotId: i, itemId: o }) => (e[i] = o, e), {})
    };
  }
}
const Ft = (s) => {
  const t = s.useEventPlugin(Nn);
  t.on(On, Dt);
  const e = 20, i = 100;
  let o, n, r, a, l, c = null, d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), g, v, f = null, w = null, _, L, R = !0, $, j, H, q, dt = !1, x = !1, y = () => {
  }, E = !1, B = 0, D = 0;
  s.api({
    setEnabled(k) {
      R = k;
    },
    setData(k) {
      const P = Zd(k);
      d = new Map(P.map), h = new Map(d);
    },
    setAutoScrollOnDrag(k) {
      E = k;
    }
  });
  function M() {
    return {
      animation: o.data.configAnimation,
      continuousMode: typeof o.data.configContinuousMode < "u",
      manualSwap: typeof o.data.configManualSwap < "u",
      swapMode: o.data.configSwapMode,
      autoScrollOnDrag: E
    };
  }
  function Y() {
    const k = M().animation;
    return k === "dynamic" ? {
      animator: "dynamic",
      config: {}
    } : k === "spring" ? {
      animator: "spring",
      config: {
        damping: 0.7,
        stiffness: 0.62
      }
    } : k === "none" ? {
      animator: "instant",
      config: {}
    } : {
      animator: "instant",
      config: {}
    };
  }
  function A(k) {
    return () => {
      d = k, h = new Map(d);
    };
  }
  s.setup(() => {
    o = s.getView("root"), r = s.getViews("slot"), a = s.getViews("item"), n = Xd(a[0].element), n.onScroll(() => {
      wt();
    }), j = M().continuousMode, H = M().manualSwap, r.forEach((k) => {
      G(k);
    }), ot(), h = new Map(d), requestAnimationFrame(() => {
      s.emit(Fn, { data: ye(d) });
    });
  });
  function G(k) {
    const P = k.getChild("item");
    P && Tt(P), d.set(
      k.element.dataset.swapySlot,
      P ? P.element.dataset.swapyItem : null
    );
  }
  function Tt(k) {
    const P = Y();
    k.styles.position = "relative", k.styles.userSelect = "none", k.styles.webkitUserSelect = "none", k.position.setAnimator(P.animator, P.config), k.scale.setAnimator(P.animator, P.config), k.layoutTransition(!0), requestAnimationFrame(() => {
      const it = k.getChild("handle");
      it ? (t.addView(it), it.styles.touchAction = "none") : (t.addView(k), k.styles.touchAction = "none");
    });
  }
  s.onViewAdded((k) => {
    if (s.initialized)
      if (k.name === "item") {
        a = s.getViews("item");
        const P = k.getParent("slot");
        G(P), ot(), h = new Map(d), s.emit(ze, { data: ye(d) });
      } else k.name === "slot" && (r = s.getViews("slot"));
  });
  function ot() {
    const k = Y();
    s.getViews("root-child").forEach((P) => {
      P.position.setAnimator(k.animator, k.config), P.scale.setAnimator(k.animator, k.config), P.layoutTransition(!0);
    });
  }
  function wt() {
    if (!$) return;
    if (!g || !v) {
      const pe = l.getScroll();
      g = $.pointerX - l.position.x + pe.x, v = $.pointerY - l.position.y + pe.y;
    }
    (!_ || !L) && (_ = l.size.width, L = l.size.height);
    const k = l.size.width / _, P = l.size.height / L, it = g * (k - 1), ue = v * (P - 1), { x: J, y: Gt } = n.getScrollOffset();
    l.position.set(
      {
        x: $.x - it - (f || 0) + J,
        y: $.y - ue - (w || 0) + Gt
      },
      l.scale.x !== 1 || l.scale.y !== 1
    );
  }
  s.subscribeToEvents((k) => {
    k.subscribeToEvent(Kd.PointerMoveEvent, ({ x: P, y: it }) => {
      n && (n.height - it <= i ? B = Math.max(
        0,
        e * (1 - Math.min(n.height - it, i) / i)
      ) : it <= i ? B = -1 * Math.max(
        0,
        e * (1 - Math.min(it, i) / i)
      ) : B = 0, n.width - P <= i ? D = Math.max(
        0,
        e * (1 - Math.min(n.width - P, i) / i)
      ) : P <= i ? D = -1 * Math.max(
        0,
        e * (1 - Math.min(P, i) / i)
      ) : D = 0);
    });
  }), s.update(() => {
    $ != null && $.isDragging && E && n.container.scrollBy({ top: B, left: D });
  });
  function Dt(k) {
    if (!R || !k.hasMoved) return;
    const P = M().swapMode, it = k.view.name === "handle";
    if (l = it ? k.view.getParent("item") : k.view, q || (q = l.getParent("slot")), f === null && w === null) {
      const J = it ? k.view.position.initialX - k.view.position.x : 0, Gt = it ? k.view.position.initialY - k.view.position.y : 0;
      f = k.view.position.x - l.position.x - J, w = k.view.position.y - l.position.y - Gt;
    }
    const ue = r.some(
      (J) => J.intersects(k.pointerX, k.pointerY)
    );
    k.isDragging ? (n.startScrollTracking(), dt || (dt = !0, s.emit(Hn, {})), c === null && (c = new Map(d)), $ = k, wt(), r.forEach((J) => {
      var Gt;
      if (!J.intersects(k.pointerX, k.pointerY)) {
        J !== q && J.element.removeAttribute("data-swapy-highlighted");
        return;
      }
      if (typeof J.element.dataset.swapyHighlighted > "u" && (J.element.dataset.swapyHighlighted = ""), !q || (P === "stop" || P !== "drop" && !j) && !k.stopped)
        return;
      const pe = J.element.dataset.swapySlot, So = (Gt = J.getChild("item")) == null ? void 0 : Gt.element.dataset.swapyItem, ci = q.element.dataset.swapySlot, Bo = l.element.dataset.swapyItem;
      if (!pe || !ci || !Bo)
        return;
      const Jt = new Map(d);
      Jt.set(pe, Bo), So ? Jt.set(ci, So) : Jt.set(ci, null), y = A(new Map(Jt)), Vi(Jt, h) || (!H && P !== "drop" && y(), q = null, P !== "drop" && s.emit(ze, { data: ye(Jt) }));
    }), a.forEach((J) => {
      J.styles.zIndex = J === l ? "2" : "";
    })) : (r.forEach((J) => {
      J.element.removeAttribute("data-swapy-highlighted");
    }), l.position.reset(), q = null, g = null, v = null, _ = null, L = null, $ = null, f = null, w = null, dt = !1, P === "drop" && (ue || (y = A(new Map(d))), y(), s.emit(ze, { data: ye(d) })), y = () => {
    }, x = !Vi(d, c), s.emit(Vn, {
      data: ye(d),
      hasChanged: x
    }), x = !1, c = null, n.endScrollTracking()), requestAnimationFrame(() => {
      wt();
    });
  }
};
Ft.pluginName = "Swapy";
Ft.scope = "root";
let Wt;
function Gd() {
  return Wt ? (Wt.updatePlugin(Ft), Wt) : (Wt = jd(), Wt.addPlugin(Ft), Wt.run(), Wt);
}
const Jd = {
  animation: "dynamic",
  continuousMode: !0,
  manualSwap: !1,
  swapMode: "hover",
  autoScrollOnDrag: !1
};
function Qd(s) {
  let t = !0;
  const e = s.querySelectorAll("[data-swapy-slot]");
  return e.length === 0 && (console.error("There are no slots defined in your root element:", s), t = !1), e.forEach((i) => {
    const o = i, n = o.dataset.swapySlot;
    (!n || n.length === 0) && (console.error(i, "does not contain a slotId using data-swapy-slot"), t = !1);
    const r = o.children;
    r.length > 1 && (console.error(
      "slot:",
      `"${n}"`,
      "cannot contain more than one element"
    ), t = !1);
    const a = r[0];
    a && (!a.dataset.swapyItem || a.dataset.swapyItem.length === 0) && (console.error(
      "slot:",
      `"${n}"`,
      "does not contain an element with item id using data-swapy-item"
    ), t = !1);
  }), t;
}
function th(s, t = {}) {
  const e = Jc();
  return s.dataset.velPluginKey = e, s.dataset.velPlugin = "Swapy", s.dataset.velView = "root", s.dataset.velDataConfigAnimation = t.animation, s.dataset.velDataConfigSwapMode = t.swapMode, t.continuousMode && (s.dataset.velDataConfigContinuousMode = "true"), t.manualSwap && (s.dataset.velDataConfigManualSwap = "true"), Array.from(
    s.querySelectorAll("[data-swapy-slot]")
  ).forEach((i) => {
    i.dataset.velView = "slot";
  }), Array.from(
    s.querySelectorAll("[data-swapy-item]")
  ).forEach((i) => {
    i.dataset.velView = "item", i.dataset.velLayoutId = i.dataset.swapyItem;
    const o = i.querySelector("[data-swapy-handle]");
    o && (o.dataset.velView = "handle");
  }), Array.from(
    s.querySelectorAll("[data-swapy-text]")
  ).forEach((i) => {
    i.dataset.velLayoutPosition = "";
  }), Array.from(
    s.querySelectorAll("[data-swapy-exclude]")
  ).forEach((i) => {
    i.dataset.velIgnore = "";
  }), e;
}
function eh(s) {
  const t = Array.from(
    s.querySelectorAll("[data-swapy-slot]:not([data-vel-view])")
  );
  t.forEach((i) => {
    i.dataset.velView = "slot";
  });
  const e = Array.from(
    s.querySelectorAll("[data-swapy-item]:not([data-vel-view])")
  );
  return e.forEach((i) => {
    i.dataset.velView = "item", i.dataset.velLayoutId = i.dataset.swapyItem;
    const o = i.querySelector("[data-swapy-handle]");
    o && (o.dataset.velView = "handle"), Array.from(
      i.querySelectorAll("[data-swapy-text]")
    ).forEach((n) => {
      n.dataset.velLayoutPosition = "";
    }), Array.from(
      i.querySelectorAll("[data-swapy-exclude]")
    ).forEach((n) => {
      n.dataset.velIgnore = "";
    });
  }), e.length > 0 || t.length > 0;
}
function ih(s, t = {}) {
  if (!s)
    throw new Error(
      "Cannot create a Swapy instance because the element you provided does not exist on the page!"
    );
  const e = { ...Jd, ...t }, i = s;
  if (!Qd(i))
    throw new Error(
      "Cannot create a Swapy instance because your HTML structure is invalid. Fix all above errors and then try!"
    );
  const o = th(i, e), n = new oh(i, o, e);
  return {
    onSwap(r) {
      n.setSwapCallback(r);
    },
    onSwapEnd(r) {
      n.setSwapEndCallback(r);
    },
    onSwapStart(r) {
      n.setSwapStartCallback(r);
    },
    enable(r) {
      n.setEnabled(r);
    },
    destroy() {
      n.destroy();
    },
    setData(r) {
      n.setData(r);
    }
  };
}
class oh {
  constructor(t, e, i) {
    gt(this, "_rootEl"), gt(this, "_veloxiApp"), gt(this, "_slotElMap"), gt(this, "_itemElMap"), gt(this, "_swapCallback"), gt(this, "_swapEndCallback"), gt(this, "_swapStartCallback"), gt(this, "_previousMap"), gt(this, "_pluginKey"), this._rootEl = t, this._veloxiApp = Gd(), this._slotElMap = this._createSlotElMap(), this._itemElMap = this._createItemElMap(), this.setAutoScrollOnDrag(i.autoScrollOnDrag), this._pluginKey = e, this._veloxiApp.onPluginEvent(
      Ft,
      Fn,
      ({ data: o }) => {
        this._previousMap = o.map;
      },
      e
    ), this._veloxiApp.onPluginEvent(
      Ft,
      ze,
      (o) => {
        var n;
        this._previousMap && Vi(this._previousMap, o.data.map) || (i.manualSwap || this._applyOrder(o.data.map), this._previousMap = o.data.map, (n = this._swapCallback) == null || n.call(this, o));
      },
      e
    ), this._veloxiApp.onPluginEvent(
      Ft,
      Vn,
      (o) => {
        var n;
        (n = this._swapEndCallback) == null || n.call(this, o);
      },
      e
    ), this._veloxiApp.onPluginEvent(
      Ft,
      Hn,
      () => {
        var o;
        (o = this._swapStartCallback) == null || o.call(this);
      },
      e
    ), this.setupMutationObserver();
  }
  setupMutationObserver() {
    new MutationObserver((t) => {
      t.some((e) => e.type === "childList") && eh(this._rootEl) && (this._slotElMap = this._createSlotElMap(), this._itemElMap = this._createItemElMap());
    }).observe(this._rootEl, {
      childList: !0,
      subtree: !0
    });
  }
  setData(t) {
    try {
      this._veloxiApp.getPlugin(
        "Swapy",
        this._pluginKey
      ).setData(t);
    } catch {
    }
  }
  destroy() {
    this._veloxiApp.destroy("Swapy");
  }
  setEnabled(t) {
    requestAnimationFrame(() => {
      try {
        this._veloxiApp.getPlugin(
          "Swapy",
          this._pluginKey
        ).setEnabled(t);
      } catch {
      }
    });
  }
  setAutoScrollOnDrag(t) {
    requestAnimationFrame(() => {
      try {
        this._veloxiApp.getPlugin(
          "Swapy",
          this._pluginKey
        ).setAutoScrollOnDrag(t);
      } catch {
      }
    });
  }
  setSwapCallback(t) {
    this._swapCallback = t;
  }
  setSwapEndCallback(t) {
    this._swapEndCallback = t;
  }
  setSwapStartCallback(t) {
    this._swapStartCallback = t;
  }
  _applyOrder(t) {
    Array.from(t.keys()).forEach((e) => {
      var i;
      if (t.get(e) === ((i = this._previousMap) == null ? void 0 : i.get(e)))
        return;
      const o = t.get(e);
      if (!o) return;
      const n = this._slotElMap.get(e), r = this._itemElMap.get(o);
      !n || !r || (n.innerHTML = "", n.appendChild(r));
    });
  }
  _createSlotElMap() {
    return Array.from(
      this._rootEl.querySelectorAll("[data-swapy-slot]")
    ).reduce((t, e) => (t.set(e.dataset.swapySlot, e), t), /* @__PURE__ */ new Map());
  }
  _createItemElMap() {
    return Array.from(
      this._rootEl.querySelectorAll("[data-swapy-item]")
    ).reduce((t, e) => (t.set(e.dataset.swapyItem, e), t), /* @__PURE__ */ new Map());
  }
}
var re;
class sh {
  constructor(t) {
    ge(this, re, /* @__PURE__ */ new Set());
    I(this, "map");
    this.map = new Map(t);
  }
  notifiy() {
    const t = this.get();
    for (const e of st(this, re))
      e(t);
  }
  set(t, e) {
    this.map.has(t) || (this.map.set(t, e), this.notifiy());
  }
  delete(t) {
    this.map.delete(t), this.notifiy();
  }
  get() {
    return [...this.map.entries()];
  }
  subscribe(t) {
    return st(this, re).add(t), () => st(this, re).delete(t);
  }
  bind(t) {
    return new xt(this).as(t);
  }
}
re = new WeakMap();
function nh({ tags: s, onSelect: t }) {
  let e;
  const i = new tt(""), o = new tt(!1), n = (a) => () => {
    o.set(!1), t(a);
  };
  o.subscribe((a) => {
    if (!a) return;
    const l = e.querySelector("button.add"), c = e.querySelector("div.popup"), d = e.querySelector('input[type="search"]');
    Kc(l, c, {
      placement: "bottom"
    }).then(({ x: h, y: g }) => {
      d.focus(), Object.assign(c.style, {
        left: `${h}px`,
        top: `${g}px`
      });
    });
  });
  function r(a) {
    a.target && !e.contains(a.target) && o.set(!1), a instanceof KeyboardEvent && a.key === "Escape" && o.set(!1);
  }
  return document.addEventListener("keydown", r), document.addEventListener("click", r), /* @__PURE__ */ T(
    "div",
    {
      onDisconnect: () => {
        document.removeEventListener("click", r), document.removeEventListener("keydown", r);
      },
      setup: (a) => e = a,
      children: [
        /* @__PURE__ */ T(
          at,
          {
            className: "add",
            onclick: () => o.set(!o.get()),
            children: [
              "Add  ",
              /* @__PURE__ */ p(V, { icon: Gn })
            ]
          }
        ),
        /* @__PURE__ */ T("div", { hidden: o((a) => !a), className: "popup", children: [
          /* @__PURE__ */ p(_s, { placeholder: "Tag", onSearch: (a) => i.set(a.toLowerCase()) }),
          /* @__PURE__ */ p("div", { className: "list", children: i((a) => a ? s.map((l) => l.fields.name.toLowerCase().includes(a) && /* @__PURE__ */ p(at, { onclick: n(l.pk), className: "flat", children: l.fields.name })) : s.slice(0, 8).map((l) => /* @__PURE__ */ p(at, { onclick: n(l.pk), className: "flat", children: l.fields.name }))) })
        ] })
      ]
    }
  );
}
function rh({ choices: s, value: t = [] }) {
  let e;
  const i = new sh(t.map((a, l) => [a.pk, {
    name: a.fields.name,
    order: l
  }]));
  function o() {
    e.value = JSON.stringify(i.get().sort(([, a], [, l]) => a.order - l.order).map(([a]) => a)), e.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  function n(a) {
    const l = s.find((c) => c.pk === a);
    l && (i.set(a, {
      name: l.fields.name,
      order: i.get().length
    }), o());
  }
  function r(a) {
    ih(a).onSwapEnd(({ data: l }) => {
      for (const [c, d] of l.map.entries())
        i.map.get(d).order = Number(c);
      o();
    });
  }
  return /* @__PURE__ */ T("div", { className: "Tags", children: [
    /* @__PURE__ */ p(
      "input",
      {
        setup: (a) => {
          e = a, o();
        },
        type: "hidden",
        name: "tags"
      }
    ),
    i.bind((a) => a.length > 0 && /* @__PURE__ */ T(oe, { children: [
      /* @__PURE__ */ p("div", { setup: r, className: "swapy", children: a.sort(([, l], [, c]) => l.order - c.order).map(([l, { name: c }], d) => /* @__PURE__ */ p("div", { dataset: { swapySlot: `${d}` }, children: /* @__PURE__ */ p("div", { dataset: { swapyItem: l }, children: /* @__PURE__ */ T("div", { className: "elem", children: [
        /* @__PURE__ */ p("span", { children: c }),
        /* @__PURE__ */ p(at, { onclick: () => i.delete(l), children: /* @__PURE__ */ p(V, { icon: ti }) })
      ] }) }) })) }),
      /* @__PURE__ */ p("hr", {})
    ] })),
    /* @__PURE__ */ p("div", { style: "margin-right: auto", children: /* @__PURE__ */ p(
      nh,
      {
        onSelect: n,
        tags: s
      }
    ) })
  ] });
}
var Ht, Pt;
const Co = class Co extends HTMLElement {
  constructor({ attributes: e } = {}) {
    super();
    ge(this, Ht, new tt({ id: "", url: "" }));
    ge(this, Pt, document.createElement("input"));
    I(this, "onClick", () => {
      Cs(this)(1).then((e) => {
        e && e.length > 0 && st(this, Ht).set(e[0]);
      });
    });
    I(this, "remove", () => {
      st(this, Ht).set({ id: "", url: "" });
    });
    I(this, "render", () => /* @__PURE__ */ p("div", { className: "PhotoButton", children: st(this, Ht).call(this, ({ id: e, url: i }) => e && i ? /* @__PURE__ */ T("div", { style: { display: "flex", flexDirection: "column" }, children: [
      /* @__PURE__ */ p("img", { style: { maxWidth: "20em" }, onclick: this.onClick, id: e, src: i }),
      /* @__PURE__ */ T(at, { style: { display: "flex", marginRight: "auto" }, onclick: this.remove, children: [
        /* @__PURE__ */ p("span", { children: "Remove" }),
        /* @__PURE__ */ p(V, { icon: ti })
      ] })
    ] }) : /* @__PURE__ */ p(at, { onclick: this.onClick, children: "Select Photo" })) }));
    if (e)
      for (const [i, o] of Object.entries(e))
        o && this.setAttribute(i, o);
  }
  connectedCallback() {
    Object.assign(st(this, Pt), {
      type: "hidden",
      name: this.getAttribute("name") || "",
      value: this.getAttribute("value") || ""
    }), Es(this)(st(this, Pt).value).then((e) => {
      st(this, Ht).set({
        id: st(this, Pt).value,
        url: e
      }), st(this, Ht).subscribe((i) => {
        st(this, Pt).value = i.id, st(this, Pt).dispatchEvent(new Event("input", { bubbles: !0 }));
      });
    }), this.append(st(this, Pt)), this.append(this.render());
  }
};
Ht = new WeakMap(), Pt = new WeakMap(), customElements.define("photo-button", Co);
let ji = Co;
function ki({ title: s, children: t, open: e = !1 }) {
  return /* @__PURE__ */ p("fieldset", { className: "module aligned collapse", children: /* @__PURE__ */ T("details", { open: e, children: [
    s && /* @__PURE__ */ p("summary", { children: /* @__PURE__ */ p("h2", { className: "fieldset-heading", children: s }) }),
    t
  ] }) });
}
function Zt({ name: s, label: t, required: e = !1, children: i }) {
  return t ?? (t = s.split("_").map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ")), /* @__PURE__ */ p("div", { className: `form-row field-${s}`, children: /* @__PURE__ */ T("div", { className: "flex-container", children: [
    /* @__PURE__ */ p("label", { className: e ? "required" : "", htmlFor: `id_${s}`, children: /* @__PURE__ */ T("span", { children: [
      t,
      ":"
    ] }) }),
    i
  ] }) });
}
function ws({ name: s, label: t, required: e, value: i, options: o }) {
  return /* @__PURE__ */ p(Zt, { name: s, label: t, required: e, children: /* @__PURE__ */ p("select", { name: s, id: `id_${s}`, children: o.map(([n, r]) => /* @__PURE__ */ p("option", { value: n, selected: n == i, children: r })) }) });
}
function ke({ name: s, label: t, required: e, value: i = "" }) {
  return /* @__PURE__ */ p(Zt, { name: s, label: t, required: e, children: /* @__PURE__ */ p(
    "input",
    {
      type: "text",
      id: `id_${s}`,
      name: s,
      value: i,
      className: "vTextField",
      maxLength: 255,
      required: e
    }
  ) });
}
function ah({ name: s, label: t, required: e, value: i }) {
  return /* @__PURE__ */ p(Zt, { name: s, label: t, required: e, children: /* @__PURE__ */ p(
    "input",
    {
      type: "checkbox",
      id: `id_${s}`,
      name: s,
      checked: i,
      className: "vBooleanField",
      maxLength: 255,
      required: e
    }
  ) });
}
function lh({ name: s, label: t, required: e, value: i }) {
  const o = i ? new Date(i) : /* @__PURE__ */ new Date(), n = o.toISOString().split("T")[0], r = String(o.getHours()).padStart(2, "0"), a = String(o.getMinutes()).padStart(2, "0"), l = `${r}:${a}`;
  return /* @__PURE__ */ p(Zt, { name: s, label: t, required: e, children: /* @__PURE__ */ T("div", { className: "datetime", style: "display: flex; flex-direction: column;", children: [
    /* @__PURE__ */ T("div", { style: "display: flex;", children: [
      /* @__PURE__ */ p(V, { icon: Yn }),
      /* @__PURE__ */ p(
        "input",
        {
          type: "date",
          id: `id_${s}_0`,
          name: `${s}_0`,
          value: i ? n : "",
          required: e
        }
      )
    ] }),
    /* @__PURE__ */ T("div", { style: "display: flex;", children: [
      /* @__PURE__ */ p(V, { icon: Jn }),
      /* @__PURE__ */ p(
        "input",
        {
          type: "time",
          id: `id_${s}_1`,
          name: `${s}_1`,
          value: i ? l : "",
          required: e
        }
      )
    ] })
  ] }) });
}
function xi({ name: s, label: t, required: e, value: i = "", photoapi: o }) {
  return /* @__PURE__ */ p(Zt, { name: s, label: t, required: e, children: /* @__PURE__ */ p(ji, { attributes: { name: s, value: i, photoapi: o } }) });
}
function xe({ name: s, label: t, required: e, value: i = "" }) {
  return /* @__PURE__ */ p(Zt, { name: s, label: t, required: e, children: /* @__PURE__ */ p(
    "textarea",
    {
      id: `id_${s}`,
      name: s,
      cols: 20,
      rows: 10,
      className: "vLargeTextField",
      children: i
    }
  ) });
}
function ch({ name: s, label: t, required: e, tags: i, value: o = [] }) {
  return /* @__PURE__ */ p(Zt, { name: s, label: t, required: e, children: /* @__PURE__ */ p(
    rh,
    {
      choices: i,
      value: o
    }
  ) });
}
const To = class To extends HTMLElement {
  constructor() {
    super(...arguments);
    I(this, "render", (e) => {
      const {
        slug: i,
        subtitle: o,
        locale: n,
        author: r,
        featured: a,
        published_at: l,
        feature_image: c,
        meta_title: d,
        meta_description: h,
        og_title: g,
        og_description: v,
        og_image: f,
        twitter_title: w,
        twitter_description: _,
        twitter_image: L,
        code_injection_foot: R,
        code_injection_head: $
      } = e.article.fields, j = e.authors.map((q) => [q.pk, q.fields.name]), H = this.getAttribute("photoapi");
      return /* @__PURE__ */ T("div", { children: [
        /* @__PURE__ */ p("input", { type: "hidden", name: "id", id: "id_id", value: e.article.pk }),
        /* @__PURE__ */ T(ki, { open: !0, title: "Attributes", children: [
          /* @__PURE__ */ p(ke, { name: "slug", required: !0, value: i || e.article.pk }),
          /* @__PURE__ */ p(ws, { name: "locale", required: !0, value: n, options: e.locales }),
          /* @__PURE__ */ p(ws, { name: "author", required: !0, value: r, options: j }),
          /* @__PURE__ */ p(ke, { name: "subtitle", value: o }),
          /* @__PURE__ */ p(lh, { name: "published_at", label: "Schedule", value: l }),
          /* @__PURE__ */ p(ah, { name: "featured", value: a }),
          /* @__PURE__ */ p(xi, { name: "feature_image", value: c, photoapi: H }),
          /* @__PURE__ */ p(ch, { name: "tags", tags: e.tags, value: e.article.tags })
        ] }),
        /* @__PURE__ */ T(ki, { title: "Meta Information", children: [
          /* @__PURE__ */ p(ke, { name: "meta_title", value: d }),
          /* @__PURE__ */ p(xe, { name: "meta_description", value: h }),
          /* @__PURE__ */ p(ke, { name: "og_title", value: g }),
          /* @__PURE__ */ p(xi, { name: "og_image", value: f, photoapi: H }),
          /* @__PURE__ */ p(xe, { name: "og_description", value: v }),
          /* @__PURE__ */ p(ke, { name: "twitter_title", value: w }),
          /* @__PURE__ */ p(xi, { name: "twitter_image", value: L, photoapi: H }),
          /* @__PURE__ */ p(xe, { name: "twitter_description", value: _ })
        ] }),
        /* @__PURE__ */ T(ki, { open: !!($ || R), title: "Code Injection", children: [
          /* @__PURE__ */ p(xe, { name: "code_injection_head", value: $ }),
          /* @__PURE__ */ p(xe, { name: "code_injection_foot", value: R })
        ] })
      ] });
    });
  }
  connectedCallback() {
    this.prepend(this.render(JSON.parse(this.getAttribute("attributes"))));
    const e = document.querySelector("#toggle-sidebar");
    e && e.addEventListener("click", (i) => {
      i.preventDefault(), this.hidden = !this.hidden;
    });
  }
};
customElements.define("article-form-fields", To);
let ys = To;
