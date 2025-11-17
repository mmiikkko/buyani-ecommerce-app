(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/home/shop-by-category.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShopByCategorySection",
    ()=>ShopByCategorySection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$552$2e$0$2b$2f44e903108183df$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.552.0+2f44e903108183df/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
;
;
;
const FEATURED_CATEGORIES = [
    {
        id: "local-snacks",
        name: "Local Snacks",
        tag: "Food & Snacks",
        itemCount: 0,
        href: "/customer/view-all-categories?category=local-snacks",
        gradient: "from-orange-200/70 via-orange-100 to-orange-50",
        nameClassName: "text-amber-900",
        itemCountClassName: "bg-orange-400",
        image: "/images/categories/dried-pineapple.png"
    },
    {
        id: "handmade",
        name: "Handmade",
        tag: "Arts & Crafts",
        itemCount: 0,
        href: "/customer/view-all-categories?category=handmade",
        gradient: "from-green-200/60 via-green-100 to-emerald-50",
        nameClassName: "text-green-800",
        itemCountClassName: "bg-green-400",
        image: "/images/categories/handmade-basket.png"
    },
    {
        id: "vegetables",
        name: "Vegetables",
        tag: "Fresh & Organic",
        itemCount: 0,
        href: "/customer/view-all-categories?category=vegetables",
        gradient: "from-orange-200/70 via-orange-100 to-orange-50",
        nameClassName: "text-amber-900",
        itemCountClassName: "bg-orange-400",
        image: "/images/categories/vegetables.png"
    },
    {
        id: "essentials",
        name: "Essentials",
        tag: "Accessories",
        itemCount: 0,
        href: "/customer/view-all-categories?category=essentials",
        gradient: "from-green-200/60 via-green-100 to-emerald-50",
        nameClassName: "text-green-800",
        itemCountClassName: "bg-green-400",
        image: "/images/categories/essentials.png"
    },
    {
        id: "novelty-items",
        name: "Novelty Items",
        tag: "Collection",
        itemCount: 0,
        href: "/customer/view-all-categories?category=novelty",
        gradient: "from-orange-200/70 via-orange-100 to-orange-50",
        nameClassName: "text-amber-900",
        itemCountClassName: "bg-orange-400",
        image: "/images/categories/novelty-items.png"
    },
    {
        id: "souvenir",
        name: "Souvenir",
        tag: "Collection",
        itemCount: 0,
        href: "/customer/view-all-categories?category=souvenir",
        gradient: "from-green-200/60 via-green-100 to-emerald-50",
        nameClassName: "text-green-800",
        itemCountClassName: "bg-green-400",
        image: "/images/categories/souvenir.png"
    }
];
function ShopByCategorySection() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "3d8dcab982d6398f626909d6fe9dff9905d36da6549874de4ed3718143f5b701") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3d8dcab982d6398f626909d6fe9dff9905d36da6549874de4ed3718143f5b701";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm font-medium uppercase tracking-wide text-emerald-600",
                    children: "Shop by Category"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                    lineNumber: 87,
                    columnNumber: 37
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-semibold text-slate-800 sm:text-2xl",
                    children: "Discover local products from CNSC vendors"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                    lineNumber: 87,
                    columnNumber: 133
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
            children: [
                t0,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/customer/view-all-categories",
                    className: "inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700",
                    children: [
                        "View All",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$552$2e$0$2b$2f44e903108183df$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                            className: "size-4"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                            lineNumber: 94,
                            columnNumber: 257
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                    lineNumber: 94,
                    columnNumber: 101
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
            lineNumber: 94,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8",
                children: [
                    t1,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6",
                        children: FEATURED_CATEGORIES.map(_ShopByCategorySectionFEATURED_CATEGORIESMap)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                        lineNumber: 101,
                        columnNumber: 106
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                lineNumber: 101,
                columnNumber: 19
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
            lineNumber: 101,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
}
_c = ShopByCategorySection;
function _ShopByCategorySectionFEATURED_CATEGORIESMap(category) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: category.href,
        className: "group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex h-full flex-col justify-between gap-4 rounded-2xl bg-gradient-to-b p-4 shadow-sm transition-shadow duration-200 group-hover:shadow-md ${category.gradient}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-medium uppercase text-slate-600",
                            children: category.tag
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                            lineNumber: 109,
                            columnNumber: 385
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-lg font-semibold ${category.nameClassName}`,
                            children: category.name
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                            lineNumber: 109,
                            columnNumber: 463
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                    lineNumber: 109,
                    columnNumber: 380
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: category.image,
                    alt: category.name,
                    width: 200,
                    height: 200,
                    className: "aspect-square w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                    lineNumber: 109,
                    columnNumber: 553
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `size-2 rounded-full ${category.itemCountClassName}`
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                            lineNumber: 109,
                            columnNumber: 782
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-slate-700",
                            children: [
                                category.itemCount,
                                " items"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                            lineNumber: 109,
                            columnNumber: 855
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
                    lineNumber: 109,
                    columnNumber: 741
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
            lineNumber: 109,
            columnNumber: 201
        }, this)
    }, category.id, false, {
        fileName: "[project]/apps/web/src/components/home/shop-by-category.tsx",
        lineNumber: 109,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "ShopByCategorySection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/assets/backdrop.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/backdrop.8ec95a10.png");}),
"[project]/apps/web/src/assets/backdrop.png.mjs { IMAGE => \"[project]/apps/web/src/assets/backdrop.png (static in ecmascript, tag client)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$assets$2f$backdrop$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/apps/web/src/assets/backdrop.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$assets$2f$backdrop$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1924,
    height: 826,
    blurWidth: 8,
    blurHeight: 3,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAADCAYAAACuyE5IAAAAU0lEQVR42gWAUQ6CMAxAdwJMmJFaihTWpduH93/HIyUOYWQSd8Mv5z876cJeF3SrlGZC9sBUMRH0Uzmksr8XZjRKb05cJz8zVDbmGMj6wr8reZ886boZn2IZFmYAAAAASUVORK5CYII="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/tailwind-merge@3.3.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3$2b$72fc344eff401428$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/@radix-ui+react-slot@1.2.3+72fc344eff401428/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(15);
    if ($[0] !== "1981295a5b14dec6a286624e5c71c884ae28ede63b92f2c1d0dc265cab924e69") {
        for(let $i = 0; $i < 15; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1981295a5b14dec6a286624e5c71c884ae28ede63b92f2c1d0dc265cab924e69";
    }
    let className;
    let props;
    let size;
    let t1;
    let variant;
    if ($[1] !== t0) {
        ({ className, variant, size, asChild: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = size;
        $[5] = t1;
        $[6] = variant;
    } else {
        className = $[2];
        props = $[3];
        size = $[4];
        t1 = $[5];
        variant = $[6];
    }
    const asChild = t1 === undefined ? false : t1;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$3$2b$72fc344eff401428$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    let t2;
    if ($[7] !== className || $[8] !== size || $[9] !== variant) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        }));
        $[7] = className;
        $[8] = size;
        $[9] = variant;
        $[10] = t2;
    } else {
        t2 = $[10];
    }
    let t3;
    if ($[11] !== Comp || $[12] !== props || $[13] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
            "data-slot": "button",
            className: t2,
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/button.tsx",
            lineNumber: 82,
            columnNumber: 10
        }, this);
        $[11] = Comp;
        $[12] = props;
        $[13] = t2;
        $[14] = t3;
    } else {
        t3 = $[14];
    }
    return t3;
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/ui/carousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Carousel",
    ()=>Carousel,
    "CarouselContent",
    ()=>CarouselContent,
    "CarouselItem",
    ()=>CarouselItem,
    "CarouselNext",
    ()=>CarouselNext,
    "CarouselPrevious",
    ()=>CarouselPrevious
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$embla$2d$carousel$2d$react$40$8$2e$6$2e$0$2b$2f44e903108183df$2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/embla-carousel-react@8.6.0+2f44e903108183df/node_modules/embla-carousel-react/esm/embla-carousel-react.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$552$2e$0$2b$2f44e903108183df$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.552.0+2f44e903108183df/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$552$2e$0$2b$2f44e903108183df$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.552.0+2f44e903108183df/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const CarouselContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
function useCarousel() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051";
    }
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}
_s(useCarousel, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function Carousel(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(46);
    if ($[0] !== "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051") {
        for(let $i = 0; $i < 46; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051";
    }
    let children;
    let className;
    let opts;
    let plugins;
    let props;
    let setApi;
    let t1;
    if ($[1] !== t0) {
        ({ orientation: t1, opts, setApi, plugins, className, children, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = opts;
        $[5] = plugins;
        $[6] = props;
        $[7] = setApi;
        $[8] = t1;
    } else {
        children = $[2];
        className = $[3];
        opts = $[4];
        plugins = $[5];
        props = $[6];
        setApi = $[7];
        t1 = $[8];
    }
    const orientation = t1 === undefined ? "horizontal" : t1;
    const t2 = orientation === "horizontal" ? "x" : "y";
    let t3;
    if ($[9] !== opts || $[10] !== t2) {
        t3 = {
            ...opts,
            axis: t2
        };
        $[9] = opts;
        $[10] = t2;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    const [carouselRef, api] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$embla$2d$carousel$2d$react$40$8$2e$6$2e$0$2b$2f44e903108183df$2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(t3, plugins);
    const [canScrollPrev, setCanScrollPrev] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [canScrollNext, setCanScrollNext] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    let t4;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "Carousel[onSelect]": (api_0)=>{
                if (!api_0) {
                    return;
                }
                setCanScrollPrev(api_0.canScrollPrev());
                setCanScrollNext(api_0.canScrollNext());
            }
        })["Carousel[onSelect]"];
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    const onSelect = t4;
    let t5;
    if ($[13] !== api) {
        t5 = ({
            "Carousel[scrollPrev]": ()=>{
                api?.scrollPrev();
            }
        })["Carousel[scrollPrev]"];
        $[13] = api;
        $[14] = t5;
    } else {
        t5 = $[14];
    }
    const scrollPrev = t5;
    let t6;
    if ($[15] !== api) {
        t6 = ({
            "Carousel[scrollNext]": ()=>{
                api?.scrollNext();
            }
        })["Carousel[scrollNext]"];
        $[15] = api;
        $[16] = t6;
    } else {
        t6 = $[16];
    }
    const scrollNext = t6;
    let t7;
    if ($[17] !== scrollNext || $[18] !== scrollPrev) {
        t7 = ({
            "Carousel[handleKeyDown]": (event)=>{
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    scrollPrev();
                } else {
                    if (event.key === "ArrowRight") {
                        event.preventDefault();
                        scrollNext();
                    }
                }
            }
        })["Carousel[handleKeyDown]"];
        $[17] = scrollNext;
        $[18] = scrollPrev;
        $[19] = t7;
    } else {
        t7 = $[19];
    }
    const handleKeyDown = t7;
    let t8;
    let t9;
    if ($[20] !== api || $[21] !== setApi) {
        t8 = ({
            "Carousel[useEffect()]": ()=>{
                if (!api || !setApi) {
                    return;
                }
                setApi(api);
            }
        })["Carousel[useEffect()]"];
        t9 = [
            api,
            setApi
        ];
        $[20] = api;
        $[21] = setApi;
        $[22] = t8;
        $[23] = t9;
    } else {
        t8 = $[22];
        t9 = $[23];
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"](t8, t9);
    let t10;
    let t11;
    if ($[24] !== api) {
        t10 = ({
            "Carousel[useEffect()]": ()=>{
                if (!api) {
                    return;
                }
                onSelect(api);
                api.on("reInit", onSelect);
                api.on("select", onSelect);
                return ()=>{
                    api?.off("select", onSelect);
                };
            }
        })["Carousel[useEffect()]"];
        t11 = [
            api,
            onSelect
        ];
        $[24] = api;
        $[25] = t10;
        $[26] = t11;
    } else {
        t10 = $[25];
        t11 = $[26];
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"](t10, t11);
    const t12 = orientation || (opts?.axis === "y" ? "vertical" : "horizontal");
    let t13;
    if ($[27] !== api || $[28] !== canScrollNext || $[29] !== canScrollPrev || $[30] !== carouselRef || $[31] !== opts || $[32] !== scrollNext || $[33] !== scrollPrev || $[34] !== t12) {
        t13 = {
            carouselRef,
            api,
            opts,
            orientation: t12,
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext
        };
        $[27] = api;
        $[28] = canScrollNext;
        $[29] = canScrollPrev;
        $[30] = carouselRef;
        $[31] = opts;
        $[32] = scrollNext;
        $[33] = scrollPrev;
        $[34] = t12;
        $[35] = t13;
    } else {
        t13 = $[35];
    }
    let t14;
    if ($[36] !== className) {
        t14 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative", className);
        $[36] = className;
        $[37] = t14;
    } else {
        t14 = $[37];
    }
    let t15;
    if ($[38] !== children || $[39] !== handleKeyDown || $[40] !== props || $[41] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onKeyDownCapture: handleKeyDown,
            className: t14,
            role: "region",
            "aria-roledescription": "carousel",
            "data-slot": "carousel",
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 246,
            columnNumber: 11
        }, this);
        $[38] = children;
        $[39] = handleKeyDown;
        $[40] = props;
        $[41] = t14;
        $[42] = t15;
    } else {
        t15 = $[42];
    }
    let t16;
    if ($[43] !== t13 || $[44] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CarouselContext.Provider, {
            value: t13,
            children: t15
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 257,
            columnNumber: 11
        }, this);
        $[43] = t13;
        $[44] = t15;
        $[45] = t16;
    } else {
        t16 = $[45];
    }
    return t16;
}
_s1(Carousel, "nmXEUAU4TrcVcToApkGXsEW1X78=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$embla$2d$carousel$2d$react$40$8$2e$6$2e$0$2b$2f44e903108183df$2f$node_modules$2f$embla$2d$carousel$2d$react$2f$esm$2f$embla$2d$carousel$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = Carousel;
function CarouselContent(t0) {
    _s2();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    const { carouselRef, orientation } = useCarousel();
    const t1 = orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col";
    let t2;
    if ($[4] !== className || $[5] !== t1) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex", t1, className);
        $[4] = className;
        $[5] = t1;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== props || $[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 304,
            columnNumber: 10
        }, this);
        $[7] = props;
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    let t4;
    if ($[10] !== carouselRef || $[11] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: carouselRef,
            className: "overflow-hidden",
            "data-slot": "carousel-content",
            children: t3
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 313,
            columnNumber: 10
        }, this);
        $[10] = carouselRef;
        $[11] = t3;
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    return t4;
}
_s2(CarouselContent, "jQxxZhDwSf0lh4R1fnTcF4q8bX8=", false, function() {
    return [
        useCarousel
    ];
});
_c1 = CarouselContent;
function CarouselItem(t0) {
    _s3();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    const { orientation } = useCarousel();
    const t1 = orientation === "horizontal" ? "pl-4" : "pt-4";
    let t2;
    if ($[4] !== className || $[5] !== t1) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-w-0 shrink-0 grow-0 basis-full", t1, className);
        $[4] = className;
        $[5] = t1;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== props || $[8] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            role: "group",
            "aria-roledescription": "slide",
            "data-slot": "carousel-item",
            className: t2,
            ...props
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 359,
            columnNumber: 10
        }, this);
        $[7] = props;
        $[8] = t2;
        $[9] = t3;
    } else {
        t3 = $[9];
    }
    return t3;
}
_s3(CarouselItem, "A/D6JTqpVAsy3kjHbQMMYEL2tww=", false, function() {
    return [
        useCarousel
    ];
});
_c2 = CarouselItem;
function CarouselPrevious(t0) {
    _s4();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051";
    }
    let className;
    let props;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ className, variant: t1, size: t2, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
        $[5] = t2;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
        t2 = $[5];
    }
    const variant = t1 === undefined ? "outline" : t1;
    const size = t2 === undefined ? "icon" : t2;
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    const t3 = orientation === "horizontal" ? "top-1/2 -left-12 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90";
    let t4;
    if ($[6] !== className || $[7] !== t3) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute size-8 rounded-full", t3, className);
        $[6] = className;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const t5 = !canScrollPrev;
    let t6;
    let t7;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$552$2e$0$2b$2f44e903108183df$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {}, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 419,
            columnNumber: 10
        }, this);
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "sr-only",
            children: "Previous slide"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 420,
            columnNumber: 10
        }, this);
        $[9] = t6;
        $[10] = t7;
    } else {
        t6 = $[9];
        t7 = $[10];
    }
    let t8;
    if ($[11] !== props || $[12] !== scrollPrev || $[13] !== size || $[14] !== t4 || $[15] !== t5 || $[16] !== variant) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            "data-slot": "carousel-previous",
            variant: variant,
            size: size,
            className: t4,
            disabled: t5,
            onClick: scrollPrev,
            ...props,
            children: [
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 429,
            columnNumber: 10
        }, this);
        $[11] = props;
        $[12] = scrollPrev;
        $[13] = size;
        $[14] = t4;
        $[15] = t5;
        $[16] = variant;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    return t8;
}
_s4(CarouselPrevious, "8LUD2tfVphx6WnRQtMD+FytHUvo=", false, function() {
    return [
        useCarousel
    ];
});
_c3 = CarouselPrevious;
function CarouselNext(t0) {
    _s5();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c991c66589c0f627b34a6e76fb8ee47602aef6609cbcd72e155d91dd14f6d051";
    }
    let className;
    let props;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ className, variant: t1, size: t2, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
        $[5] = t2;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
        t2 = $[5];
    }
    const variant = t1 === undefined ? "outline" : t1;
    const size = t2 === undefined ? "icon" : t2;
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    const t3 = orientation === "horizontal" ? "top-1/2 -right-12 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90";
    let t4;
    if ($[6] !== className || $[7] !== t3) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute size-8 rounded-full", t3, className);
        $[6] = className;
        $[7] = t3;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const t5 = !canScrollNext;
    let t6;
    let t7;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$552$2e$0$2b$2f44e903108183df$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {}, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 493,
            columnNumber: 10
        }, this);
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "sr-only",
            children: "Next slide"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 494,
            columnNumber: 10
        }, this);
        $[9] = t6;
        $[10] = t7;
    } else {
        t6 = $[9];
        t7 = $[10];
    }
    let t8;
    if ($[11] !== props || $[12] !== scrollNext || $[13] !== size || $[14] !== t4 || $[15] !== t5 || $[16] !== variant) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            "data-slot": "carousel-next",
            variant: variant,
            size: size,
            className: t4,
            disabled: t5,
            onClick: scrollNext,
            ...props,
            children: [
                t6,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/ui/carousel.tsx",
            lineNumber: 503,
            columnNumber: 10
        }, this);
        $[11] = props;
        $[12] = scrollNext;
        $[13] = size;
        $[14] = t4;
        $[15] = t5;
        $[16] = variant;
        $[17] = t8;
    } else {
        t8 = $[17];
    }
    return t8;
}
_s5(CarouselNext, "i0pmJBg/CJlkCyUiwU+/jSGwijk=", false, function() {
    return [
        useCarousel
    ];
});
_c4 = CarouselNext;
;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Carousel");
__turbopack_context__.k.register(_c1, "CarouselContent");
__turbopack_context__.k.register(_c2, "CarouselItem");
__turbopack_context__.k.register(_c3, "CarouselPrevious");
__turbopack_context__.k.register(_c4, "CarouselNext");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/home/backdrop-carousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BackdropCarousel",
    ()=>BackdropCarousel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$assets$2f$backdrop$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$assets$2f$backdrop$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/apps/web/src/assets/backdrop.png.mjs { IMAGE => "[project]/apps/web/src/assets/backdrop.png (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$embla$2d$carousel$2d$autoplay$40$8$2e$6$2e$0$2b$3dde5556684c958d$2f$node_modules$2f$embla$2d$carousel$2d$autoplay$2f$esm$2f$embla$2d$carousel$2d$autoplay$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/embla-carousel-autoplay@8.6.0+3dde5556684c958d/node_modules/embla-carousel-autoplay/esm/embla-carousel-autoplay.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/ui/carousel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function BackdropCarousel() {
    _s();
    const plugin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$embla$2d$carousel$2d$autoplay$40$8$2e$6$2e$0$2b$3dde5556684c958d$2f$node_modules$2f$embla$2d$carousel$2d$autoplay$2f$esm$2f$embla$2d$carousel$2d$autoplay$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        delay: 3000,
        stopOnInteraction: false
    }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "relative mt-30 h-[80vh] w-full overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$assets$2f$backdrop$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$assets$2f$backdrop$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "Backdrop",
                    fill: true,
                    priority: true,
                    className: "object-cover brightness-75"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                    lineNumber: 15,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Carousel"], {
                        opts: {
                            loop: true
                        },
                        plugins: [
                            plugin.current
                        ],
                        className: "w-[90%] max-w-5xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CarouselContent"], {
                                children: [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CarouselItem"], {
                                        className: "basis-full p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white bg-opacity-90 rounded-2xl h-125 shadow-1xl w-[90%]    mx-auto flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 ",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold",
                                                    children: [
                                                        "Slide ",
                                                        i
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                                                    lineNumber: 26,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-600",
                                                    children: "HARDCODED :p"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                                                    lineNumber: 27,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                                            lineNumber: 24,
                                            columnNumber: 21
                                        }, this)
                                    }, i, false, {
                                        fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                                        lineNumber: 23,
                                        columnNumber: 43
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                                lineNumber: 22,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CarouselPrevious"], {
                                className: "bg-gray-900/70 text-white hover:bg-gray-900 absolute left-2"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                                lineNumber: 32,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$ui$2f$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CarouselNext"], {
                                className: "bg-gray-900/70 text-white hover:bg-gray-900 absolute right-2"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                                lineNumber: 33,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                        lineNumber: 18,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
                    lineNumber: 17,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
            lineNumber: 14,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/home/backdrop-carousel.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_s(BackdropCarousel, "pvojA5MtBNBOzQHl1Wnl2wWYusk=");
_c = BackdropCarousel;
var _c;
__turbopack_context__.k.register(_c, "BackdropCarousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/(customer)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.0.1+2b5434204782a989/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$home$2f$shop$2d$by$2d$category$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/home/shop-by-category.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$home$2f$backdrop$2d$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/home/backdrop-carousel.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
function Home() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "7909d32ff4d89ed256d5e4220335170b2c4d7982058a1bb2d95045890dc46d6e") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "7909d32ff4d89ed256d5e4220335170b2c4d7982058a1bb2d95045890dc46d6e";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "relative min-h-screen space-y-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$home$2f$backdrop$2d$carousel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackdropCarousel"], {}, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(customer)/page.tsx",
                    lineNumber: 16,
                    columnNumber: 61
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$0$2e$1$2b$2b5434204782a989$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$home$2f$shop$2d$by$2d$category$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShopByCategorySection"], {}, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(customer)/page.tsx",
                    lineNumber: 16,
                    columnNumber: 81
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(customer)/page.tsx",
            lineNumber: 16,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    return t0;
}
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_d54b71a0._.js.map