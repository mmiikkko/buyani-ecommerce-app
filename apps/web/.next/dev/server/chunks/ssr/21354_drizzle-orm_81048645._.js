module.exports = [
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "entityKind",
    ()=>entityKind,
    "hasOwnEntityKind",
    ()=>hasOwnEntityKind,
    "is",
    ()=>is
]);
const entityKind = Symbol.for("drizzle:entityKind");
const hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
    if (!value || typeof value !== "object") {
        return false;
    }
    if (value instanceof type) {
        return true;
    }
    if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
        throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
    }
    let cls = Object.getPrototypeOf(value).constructor;
    if (cls) {
        while(cls){
            if (entityKind in cls && cls[entityKind] === type[entityKind]) {
                return true;
            }
            cls = Object.getPrototypeOf(cls);
        }
    }
    return false;
}
;
 //# sourceMappingURL=entity.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TableName",
    ()=>TableName
]);
const TableName = Symbol.for("drizzle:Name");
;
 //# sourceMappingURL=table.utils.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseName",
    ()=>BaseName,
    "Columns",
    ()=>Columns,
    "ExtraConfigBuilder",
    ()=>ExtraConfigBuilder,
    "ExtraConfigColumns",
    ()=>ExtraConfigColumns,
    "IsAlias",
    ()=>IsAlias,
    "OriginalName",
    ()=>OriginalName,
    "Schema",
    ()=>Schema,
    "Table",
    ()=>Table,
    "getTableName",
    ()=>getTableName,
    "getTableUniqueName",
    ()=>getTableUniqueName,
    "isTable",
    ()=>isTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.utils.js [app-ssr] (ecmascript)");
;
;
const Schema = Symbol.for("drizzle:Schema");
const Columns = Symbol.for("drizzle:Columns");
const ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
const OriginalName = Symbol.for("drizzle:OriginalName");
const BaseName = Symbol.for("drizzle:BaseName");
const IsAlias = Symbol.for("drizzle:IsAlias");
const ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
const IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
class Table {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "Table";
    /** @internal */ static Symbol = {
        Name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"],
        Schema,
        OriginalName,
        Columns,
        ExtraConfigColumns,
        BaseName,
        IsAlias,
        ExtraConfigBuilder
    };
    /**
   * @internal
   * Can be changed if the table is aliased.
   */ [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]];
    /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */ [OriginalName];
    /** @internal */ [Schema];
    /** @internal */ [Columns];
    /** @internal */ [ExtraConfigColumns];
    /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */ [BaseName];
    /** @internal */ [IsAlias] = false;
    /** @internal */ [IsDrizzleTable] = true;
    /** @internal */ [ExtraConfigBuilder] = void 0;
    constructor(name, schema, baseName){
        this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]] = this[OriginalName] = name;
        this[Schema] = schema;
        this[BaseName] = baseName;
    }
}
function isTable(table) {
    return typeof table === "object" && table !== null && IsDrizzleTable in table;
}
function getTableName(table) {
    return table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]];
}
function getTableUniqueName(table) {
    return `${table[Schema] ?? "public"}.${table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]]}`;
}
;
 //# sourceMappingURL=table.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Column",
    ()=>Column
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
;
class Column {
    constructor(table, config){
        this.table = table;
        this.config = config;
        this.name = config.name;
        this.keyAsName = config.keyAsName;
        this.notNull = config.notNull;
        this.default = config.default;
        this.defaultFn = config.defaultFn;
        this.onUpdateFn = config.onUpdateFn;
        this.hasDefault = config.hasDefault;
        this.primary = config.primaryKey;
        this.isUnique = config.isUnique;
        this.uniqueName = config.uniqueName;
        this.uniqueType = config.uniqueType;
        this.dataType = config.dataType;
        this.columnType = config.columnType;
        this.generated = config.generated;
        this.generatedIdentity = config.generatedIdentity;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "Column";
    name;
    keyAsName;
    primary;
    notNull;
    default;
    defaultFn;
    onUpdateFn;
    hasDefault;
    isUnique;
    uniqueName;
    uniqueType;
    dataType;
    columnType;
    enumValues = void 0;
    generated = void 0;
    generatedIdentity = void 0;
    config;
    mapFromDriverValue(value) {
        return value;
    }
    mapToDriverValue(value) {
        return value;
    }
    // ** @internal */
    shouldDisableInsert() {
        return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
    }
}
;
 //# sourceMappingURL=column.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column-builder.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ColumnBuilder",
    ()=>ColumnBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
;
class ColumnBuilder {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "ColumnBuilder";
    config;
    constructor(name, dataType, columnType){
        this.config = {
            name,
            keyAsName: name === "",
            notNull: false,
            default: void 0,
            hasDefault: false,
            primaryKey: false,
            isUnique: false,
            uniqueName: void 0,
            uniqueType: void 0,
            dataType,
            columnType,
            generated: void 0
        };
    }
    /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */ $type() {
        return this;
    }
    /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */ notNull() {
        this.config.notNull = true;
        return this;
    }
    /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */ default(value) {
        this.config.default = value;
        this.config.hasDefault = true;
        return this;
    }
    /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */ $defaultFn(fn) {
        this.config.defaultFn = fn;
        this.config.hasDefault = true;
        return this;
    }
    /**
   * Alias for {@link $defaultFn}.
   */ $default = this.$defaultFn;
    /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */ $onUpdateFn(fn) {
        this.config.onUpdateFn = fn;
        this.config.hasDefault = true;
        return this;
    }
    /**
   * Alias for {@link $onUpdateFn}.
   */ $onUpdate = this.$onUpdateFn;
    /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */ primaryKey() {
        this.config.primaryKey = true;
        this.config.notNull = true;
        return this;
    }
    /** @internal Sets the name of the column to the key within the table definition if a name was not given. */ setName(name) {
        if (this.config.name !== "") return;
        this.config.name = name;
    }
}
;
 //# sourceMappingURL=column-builder.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/foreign-keys.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ForeignKey",
    ()=>ForeignKey,
    "ForeignKeyBuilder",
    ()=>ForeignKeyBuilder,
    "foreignKey",
    ()=>foreignKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.utils.js [app-ssr] (ecmascript)");
;
;
class ForeignKeyBuilder {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgForeignKeyBuilder";
    /** @internal */ reference;
    /** @internal */ _onUpdate = "no action";
    /** @internal */ _onDelete = "no action";
    constructor(config, actions){
        this.reference = ()=>{
            const { name, columns, foreignColumns } = config();
            return {
                name,
                columns,
                foreignTable: foreignColumns[0].table,
                foreignColumns
            };
        };
        if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
        }
    }
    onUpdate(action) {
        this._onUpdate = action === void 0 ? "no action" : action;
        return this;
    }
    onDelete(action) {
        this._onDelete = action === void 0 ? "no action" : action;
        return this;
    }
    /** @internal */ build(table) {
        return new ForeignKey(table, this);
    }
}
class ForeignKey {
    constructor(table, builder){
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgForeignKey";
    reference;
    onUpdate;
    onDelete;
    getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column)=>column.name);
        const foreignColumnNames = foreignColumns.map((column)=>column.name);
        const chunks = [
            this.table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]],
            ...columnNames,
            foreignColumns[0].table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]],
            ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
    }
}
function foreignKey(config) {
    function mappedConfig() {
        const { name, columns, foreignColumns } = config;
        return {
            name,
            columns,
            foreignColumns
        };
    }
    return new ForeignKeyBuilder(mappedConfig);
}
;
 //# sourceMappingURL=foreign-keys.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/tracing-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "iife",
    ()=>iife
]);
function iife(fn, ...args) {
    return fn(...args);
}
;
 //# sourceMappingURL=tracing-utils.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/unique-constraint.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UniqueConstraint",
    ()=>UniqueConstraint,
    "UniqueConstraintBuilder",
    ()=>UniqueConstraintBuilder,
    "UniqueOnConstraintBuilder",
    ()=>UniqueOnConstraintBuilder,
    "unique",
    ()=>unique,
    "uniqueKeyName",
    ()=>uniqueKeyName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.utils.js [app-ssr] (ecmascript)");
;
;
function unique(name) {
    return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
    return `${table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]]}_${columns.join("_")}_unique`;
}
class UniqueConstraintBuilder {
    constructor(columns, name){
        this.name = name;
        this.columns = columns;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgUniqueConstraintBuilder";
    /** @internal */ columns;
    /** @internal */ nullsNotDistinctConfig = false;
    nullsNotDistinct() {
        this.nullsNotDistinctConfig = true;
        return this;
    }
    /** @internal */ build(table) {
        return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
    }
}
class UniqueOnConstraintBuilder {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgUniqueOnConstraintBuilder";
    /** @internal */ name;
    constructor(name){
        this.name = name;
    }
    on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
    }
}
class UniqueConstraint {
    constructor(table, columns, nullsNotDistinct, name){
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column)=>column.name));
        this.nullsNotDistinct = nullsNotDistinct;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgUniqueConstraint";
    columns;
    name;
    nullsNotDistinct = false;
    getName() {
        return this.name;
    }
}
;
 //# sourceMappingURL=unique-constraint.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/utils/array.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makePgArray",
    ()=>makePgArray,
    "parsePgArray",
    ()=>parsePgArray,
    "parsePgNestedArray",
    ()=>parsePgNestedArray
]);
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
    for(let i = startFrom; i < arrayString.length; i++){
        const char = arrayString[i];
        if (char === "\\") {
            i++;
            continue;
        }
        if (char === '"') {
            return [
                arrayString.slice(startFrom, i).replace(/\\/g, ""),
                i + 1
            ];
        }
        if (inQuotes) {
            continue;
        }
        if (char === "," || char === "}") {
            return [
                arrayString.slice(startFrom, i).replace(/\\/g, ""),
                i
            ];
        }
    }
    return [
        arrayString.slice(startFrom).replace(/\\/g, ""),
        arrayString.length
    ];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
    const result = [];
    let i = startFrom;
    let lastCharIsComma = false;
    while(i < arrayString.length){
        const char = arrayString[i];
        if (char === ",") {
            if (lastCharIsComma || i === startFrom) {
                result.push("");
            }
            lastCharIsComma = true;
            i++;
            continue;
        }
        lastCharIsComma = false;
        if (char === "\\") {
            i += 2;
            continue;
        }
        if (char === '"') {
            const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
            result.push(value2);
            i = startFrom2;
            continue;
        }
        if (char === "}") {
            return [
                result,
                i + 1
            ];
        }
        if (char === "{") {
            const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
            result.push(value2);
            i = startFrom2;
            continue;
        }
        const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
        result.push(value);
        i = newStartFrom;
    }
    return [
        result,
        i
    ];
}
function parsePgArray(arrayString) {
    const [result] = parsePgNestedArray(arrayString, 1);
    return result;
}
function makePgArray(array) {
    return `{${array.map((item)=>{
        if (Array.isArray(item)) {
            return makePgArray(item);
        }
        if (typeof item === "string") {
            return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
        }
        return `${item}`;
    }).join(",")}}`;
}
;
 //# sourceMappingURL=array.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/columns/common.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtraConfigColumn",
    ()=>ExtraConfigColumn,
    "IndexedColumn",
    ()=>IndexedColumn,
    "PgArray",
    ()=>PgArray,
    "PgArrayBuilder",
    ()=>PgArrayBuilder,
    "PgColumn",
    ()=>PgColumn,
    "PgColumnBuilder",
    ()=>PgColumnBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2d$builder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column-builder.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$foreign$2d$keys$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/foreign-keys.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$tracing$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/tracing-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$unique$2d$constraint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/unique-constraint.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$utils$2f$array$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/utils/array.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
class PgColumnBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2d$builder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ColumnBuilder"] {
    foreignKeyConfigs = [];
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgColumnBuilder";
    array(size) {
        return new PgArrayBuilder(this.config.name, this, size);
    }
    references(ref, actions = {}) {
        this.foreignKeyConfigs.push({
            ref,
            actions
        });
        return this;
    }
    unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
    }
    generatedAlwaysAs(as) {
        this.config.generated = {
            as,
            type: "always",
            mode: "stored"
        };
        return this;
    }
    /** @internal */ buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$tracing$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["iife"])((ref2, actions2)=>{
                const builder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$foreign$2d$keys$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ForeignKeyBuilder"](()=>{
                    const foreignColumn = ref2();
                    return {
                        columns: [
                            column
                        ],
                        foreignColumns: [
                            foreignColumn
                        ]
                    };
                });
                if (actions2.onUpdate) {
                    builder.onUpdate(actions2.onUpdate);
                }
                if (actions2.onDelete) {
                    builder.onDelete(actions2.onDelete);
                }
                return builder.build(table);
            }, ref, actions);
        });
    }
    /** @internal */ buildExtraConfigColumn(table) {
        return new ExtraConfigColumn(table, this.config);
    }
}
class PgColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"] {
    constructor(table, config){
        if (!config.uniqueName) {
            config.uniqueName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$unique$2d$constraint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uniqueKeyName"])(table, [
                config.name
            ]);
        }
        super(table, config);
        this.table = table;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgColumn";
}
class ExtraConfigColumn extends PgColumn {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "ExtraConfigColumn";
    getSQLType() {
        return this.getSQLType();
    }
    indexConfig = {
        order: this.config.order ?? "asc",
        nulls: this.config.nulls ?? "last",
        opClass: this.config.opClass
    };
    defaultConfig = {
        order: "asc",
        nulls: "last",
        opClass: void 0
    };
    asc() {
        this.indexConfig.order = "asc";
        return this;
    }
    desc() {
        this.indexConfig.order = "desc";
        return this;
    }
    nullsFirst() {
        this.indexConfig.nulls = "first";
        return this;
    }
    nullsLast() {
        this.indexConfig.nulls = "last";
        return this;
    }
    /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */ op(opClass) {
        this.indexConfig.opClass = opClass;
        return this;
    }
}
class IndexedColumn {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "IndexedColumn";
    constructor(name, keyAsName, type, indexConfig){
        this.name = name;
        this.keyAsName = keyAsName;
        this.type = type;
        this.indexConfig = indexConfig;
    }
    name;
    keyAsName;
    type;
    indexConfig;
}
class PgArrayBuilder extends PgColumnBuilder {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgArrayBuilder";
    constructor(name, baseBuilder, size){
        super(name, "array", "PgArray");
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
    }
    /** @internal */ build(table) {
        const baseColumn = this.config.baseBuilder.build(table);
        return new PgArray(table, this.config, baseColumn);
    }
}
class PgArray extends PgColumn {
    constructor(table, config, baseColumn, range){
        super(table, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
    }
    size;
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgArray";
    getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$utils$2f$array$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePgArray"])(value);
        }
        return value.map((v)=>this.baseColumn.mapFromDriverValue(v));
    }
    mapToDriverValue(value, isNestedArray = false) {
        const a = value.map((v)=>v === null ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(this.baseColumn, PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v));
        if (isNestedArray) return a;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$utils$2f$array$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makePgArray"])(a);
    }
}
;
 //# sourceMappingURL=common.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/columns/enum.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PgEnumColumn",
    ()=>PgEnumColumn,
    "PgEnumColumnBuilder",
    ()=>PgEnumColumnBuilder,
    "PgEnumObjectColumn",
    ()=>PgEnumObjectColumn,
    "PgEnumObjectColumnBuilder",
    ()=>PgEnumObjectColumnBuilder,
    "isPgEnum",
    ()=>isPgEnum,
    "pgEnum",
    ()=>pgEnum,
    "pgEnumObjectWithSchema",
    ()=>pgEnumObjectWithSchema,
    "pgEnumWithSchema",
    ()=>pgEnumWithSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/columns/common.js [app-ssr] (ecmascript)");
;
;
class PgEnumObjectColumnBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PgColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgEnumObjectColumnBuilder";
    constructor(name, enumInstance){
        super(name, "string", "PgEnumObjectColumn");
        this.config.enum = enumInstance;
    }
    /** @internal */ build(table) {
        return new PgEnumObjectColumn(table, this.config);
    }
}
class PgEnumObjectColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PgColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgEnumObjectColumn";
    enum;
    enumValues = this.config.enum.enumValues;
    constructor(table, config){
        super(table, config);
        this.enum = config.enum;
    }
    getSQLType() {
        return this.enum.enumName;
    }
}
const isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
    return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
class PgEnumColumnBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PgColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgEnumColumnBuilder";
    constructor(name, enumInstance){
        super(name, "string", "PgEnumColumn");
        this.config.enum = enumInstance;
    }
    /** @internal */ build(table) {
        return new PgEnumColumn(table, this.config);
    }
}
class PgEnumColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PgColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "PgEnumColumn";
    enum = this.config.enum;
    enumValues = this.config.enum.enumValues;
    constructor(table, config){
        super(table, config);
        this.enum = config.enum;
    }
    getSQLType() {
        return this.enum.enumName;
    }
}
function pgEnum(enumName, input) {
    return Array.isArray(input) ? pgEnumWithSchema(enumName, [
        ...input
    ], void 0) : pgEnumObjectWithSchema(enumName, input, void 0);
}
function pgEnumWithSchema(enumName, values, schema) {
    const enumInstance = Object.assign((name)=>new PgEnumColumnBuilder(name ?? "", enumInstance), {
        enumName,
        enumValues: values,
        schema,
        [isPgEnumSym]: true
    });
    return enumInstance;
}
function pgEnumObjectWithSchema(enumName, values, schema) {
    const enumInstance = Object.assign((name)=>new PgEnumObjectColumnBuilder(name ?? "", enumInstance), {
        enumName,
        enumValues: Object.values(values),
        schema,
        [isPgEnumSym]: true
    });
    return enumInstance;
}
;
 //# sourceMappingURL=enum.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/subquery.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Subquery",
    ()=>Subquery,
    "WithSubquery",
    ()=>WithSubquery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
;
class Subquery {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "Subquery";
    constructor(sql, fields, alias, isWith = false, usedTables = []){
        this._ = {
            brand: "Subquery",
            sql,
            selectedFields: fields,
            alias,
            isWith,
            usedTables
        };
    }
}
class WithSubquery extends Subquery {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "WithSubquery";
}
;
 //# sourceMappingURL=subquery.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/version.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// package.json
__turbopack_context__.s([
    "compatibilityVersion",
    ()=>compatibilityVersion,
    "npmVersion",
    ()=>version
]);
var version = "0.44.7";
// src/version.ts
var compatibilityVersion = 10;
;
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/tracing.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tracer",
    ()=>tracer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$tracing$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/tracing-utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/version.js [app-ssr] (ecmascript)");
;
;
let otel;
let rawTracer;
const tracer = {
    startActiveSpan (name, fn) {
        if (!otel) {
            return fn();
        }
        if (!rawTracer) {
            rawTracer = otel.trace.getTracer("drizzle-orm", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["npmVersion"]);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$tracing$2d$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["iife"])((otel2, rawTracer2)=>rawTracer2.startActiveSpan(name, (span)=>{
                try {
                    return fn(span);
                } catch (e) {
                    span.setStatus({
                        code: otel2.SpanStatusCode.ERROR,
                        message: e instanceof Error ? e.message : "Unknown error"
                    });
                    throw e;
                } finally{
                    span.end();
                }
            }), otel, rawTracer);
    }
};
;
 //# sourceMappingURL=tracing.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/view-common.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ViewBaseConfig",
    ()=>ViewBaseConfig
]);
const ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
;
 //# sourceMappingURL=view-common.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/sql/sql.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FakePrimitiveParam",
    ()=>FakePrimitiveParam,
    "Name",
    ()=>Name,
    "Param",
    ()=>Param,
    "Placeholder",
    ()=>Placeholder,
    "SQL",
    ()=>SQL,
    "StringChunk",
    ()=>StringChunk,
    "View",
    ()=>View,
    "fillPlaceholders",
    ()=>fillPlaceholders,
    "getViewName",
    ()=>getViewName,
    "isDriverValueEncoder",
    ()=>isDriverValueEncoder,
    "isSQLWrapper",
    ()=>isSQLWrapper,
    "isView",
    ()=>isView,
    "name",
    ()=>name,
    "noopDecoder",
    ()=>noopDecoder,
    "noopEncoder",
    ()=>noopEncoder,
    "noopMapper",
    ()=>noopMapper,
    "param",
    ()=>param,
    "placeholder",
    ()=>placeholder,
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/pg-core/columns/enum.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$subquery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/subquery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$tracing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/tracing.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/view-common.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
class FakePrimitiveParam {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "FakePrimitiveParam";
}
function isSQLWrapper(value) {
    return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
    const result = {
        sql: "",
        params: []
    };
    for (const query of queries){
        result.sql += query.sql;
        result.params.push(...query.params);
        if (query.typings?.length) {
            if (!result.typings) {
                result.typings = [];
            }
            result.typings.push(...query.typings);
        }
    }
    return result;
}
class StringChunk {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "StringChunk";
    value;
    constructor(value){
        this.value = Array.isArray(value) ? value : [
            value
        ];
    }
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
class SQL {
    constructor(queryChunks){
        this.queryChunks = queryChunks;
        for (const chunk of queryChunks){
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"])) {
                const schemaName = chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Schema];
                this.usedTables.push(schemaName === void 0 ? chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Name] : schemaName + "." + chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Name]);
            }
        }
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "SQL";
    /** @internal */ decoder = noopDecoder;
    shouldInlineParams = false;
    /** @internal */ usedTables = [];
    append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
    }
    toQuery(config) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$tracing$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tracer"].startActiveSpan("drizzle.buildSQL", (span)=>{
            const query = this.buildQueryFromSourceParams(this.queryChunks, config);
            span?.setAttributes({
                "drizzle.query.text": query.sql,
                "drizzle.query.params": JSON.stringify(query.params)
            });
            return query;
        });
    }
    buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
            inlineParams: _config.inlineParams || this.shouldInlineParams,
            paramStartIndex: _config.paramStartIndex || {
                value: 0
            }
        });
        const { casing, escapeName, escapeParam, prepareTyping, inlineParams, paramStartIndex } = config;
        return mergeQueries(chunks.map((chunk)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, StringChunk)) {
                return {
                    sql: chunk.value.join(""),
                    params: []
                };
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, Name)) {
                return {
                    sql: escapeName(chunk.value),
                    params: []
                };
            }
            if (chunk === void 0) {
                return {
                    sql: "",
                    params: []
                };
            }
            if (Array.isArray(chunk)) {
                const result = [
                    new StringChunk("(")
                ];
                for (const [i, p] of chunk.entries()){
                    result.push(p);
                    if (i < chunk.length - 1) {
                        result.push(new StringChunk(", "));
                    }
                }
                result.push(new StringChunk(")"));
                return this.buildQueryFromSourceParams(result, config);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, SQL)) {
                return this.buildQueryFromSourceParams(chunk.queryChunks, {
                    ...config,
                    inlineParams: inlineParams || chunk.shouldInlineParams
                });
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"])) {
                const schemaName = chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Schema];
                const tableName = chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Name];
                return {
                    sql: schemaName === void 0 || chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IsAlias"]] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
                    params: []
                };
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"])) {
                const columnName = casing.getColumnCasing(chunk);
                if (_config.invokeSource === "indexes") {
                    return {
                        sql: escapeName(columnName),
                        params: []
                    };
                }
                const schemaName = chunk.table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Schema];
                return {
                    sql: chunk.table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IsAlias"]] || schemaName === void 0 ? escapeName(chunk.table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Name]) + "." + escapeName(columnName),
                    params: []
                };
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, View)) {
                const schemaName = chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]].schema;
                const viewName = chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]].name;
                return {
                    sql: schemaName === void 0 || chunk[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
                    params: []
                };
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, Param)) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk.value, Placeholder)) {
                    return {
                        sql: escapeParam(paramStartIndex.value++, chunk),
                        params: [
                            chunk
                        ],
                        typings: [
                            "none"
                        ]
                    };
                }
                const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(mappedValue, SQL)) {
                    return this.buildQueryFromSourceParams([
                        mappedValue
                    ], config);
                }
                if (inlineParams) {
                    return {
                        sql: this.mapInlineParam(mappedValue, config),
                        params: []
                    };
                }
                let typings = [
                    "none"
                ];
                if (prepareTyping) {
                    typings = [
                        prepareTyping(chunk.encoder)
                    ];
                }
                return {
                    sql: escapeParam(paramStartIndex.value++, mappedValue),
                    params: [
                        mappedValue
                    ],
                    typings
                };
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, Placeholder)) {
                return {
                    sql: escapeParam(paramStartIndex.value++, chunk),
                    params: [
                        chunk
                    ],
                    typings: [
                        "none"
                    ]
                };
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, SQL.Aliased) && chunk.fieldAlias !== void 0) {
                return {
                    sql: escapeName(chunk.fieldAlias),
                    params: []
                };
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(chunk, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$subquery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subquery"])) {
                if (chunk._.isWith) {
                    return {
                        sql: escapeName(chunk._.alias),
                        params: []
                    };
                }
                return this.buildQueryFromSourceParams([
                    new StringChunk("("),
                    chunk._.sql,
                    new StringChunk(") "),
                    new Name(chunk._.alias)
                ], config);
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPgEnum"])(chunk)) {
                if (chunk.schema) {
                    return {
                        sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName),
                        params: []
                    };
                }
                return {
                    sql: escapeName(chunk.enumName),
                    params: []
                };
            }
            if (isSQLWrapper(chunk)) {
                if (chunk.shouldOmitSQLParens?.()) {
                    return this.buildQueryFromSourceParams([
                        chunk.getSQL()
                    ], config);
                }
                return this.buildQueryFromSourceParams([
                    new StringChunk("("),
                    chunk.getSQL(),
                    new StringChunk(")")
                ], config);
            }
            if (inlineParams) {
                return {
                    sql: this.mapInlineParam(chunk, config),
                    params: []
                };
            }
            return {
                sql: escapeParam(paramStartIndex.value++, chunk),
                params: [
                    chunk
                ],
                typings: [
                    "none"
                ]
            };
        }));
    }
    mapInlineParam(chunk, { escapeString }) {
        if (chunk === null) {
            return "null";
        }
        if (typeof chunk === "number" || typeof chunk === "boolean") {
            return chunk.toString();
        }
        if (typeof chunk === "string") {
            return escapeString(chunk);
        }
        if (typeof chunk === "object") {
            const mappedValueAsString = chunk.toString();
            if (mappedValueAsString === "[object Object]") {
                return escapeString(JSON.stringify(chunk));
            }
            return escapeString(mappedValueAsString);
        }
        throw new Error("Unexpected param value: " + chunk);
    }
    getSQL() {
        return this;
    }
    as(alias) {
        if (alias === void 0) {
            return this;
        }
        return new SQL.Aliased(this, alias);
    }
    mapWith(decoder) {
        this.decoder = typeof decoder === "function" ? {
            mapFromDriverValue: decoder
        } : decoder;
        return this;
    }
    inlineParams() {
        this.shouldInlineParams = true;
        return this;
    }
    /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */ if(condition) {
        return condition ? this : void 0;
    }
}
class Name {
    constructor(value){
        this.value = value;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "Name";
    brand;
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function name(value) {
    return new Name(value);
}
function isDriverValueEncoder(value) {
    return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
const noopDecoder = {
    mapFromDriverValue: (value)=>value
};
const noopEncoder = {
    mapToDriverValue: (value)=>value
};
const noopMapper = {
    ...noopDecoder,
    ...noopEncoder
};
class Param {
    /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */ constructor(value, encoder = noopEncoder){
        this.value = value;
        this.encoder = encoder;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "Param";
    brand;
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function param(value, encoder) {
    return new Param(value, encoder);
}
function sql(strings, ...params) {
    const queryChunks = [];
    if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
        queryChunks.push(new StringChunk(strings[0]));
    }
    for (const [paramIndex, param2] of params.entries()){
        queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
    }
    return new SQL(queryChunks);
}
((sql2)=>{
    function empty() {
        return new SQL([]);
    }
    sql2.empty = empty;
    function fromList(list) {
        return new SQL(list);
    }
    sql2.fromList = fromList;
    function raw(str) {
        return new SQL([
            new StringChunk(str)
        ]);
    }
    sql2.raw = raw;
    function join(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()){
            if (i > 0 && separator !== void 0) {
                result.push(separator);
            }
            result.push(chunk);
        }
        return new SQL(result);
    }
    sql2.join = join;
    function identifier(value) {
        return new Name(value);
    }
    sql2.identifier = identifier;
    function placeholder2(name2) {
        return new Placeholder(name2);
    }
    sql2.placeholder = placeholder2;
    function param2(value, encoder) {
        return new Param(value, encoder);
    }
    sql2.param = param2;
})(sql || (sql = {}));
((SQL2)=>{
    class Aliased {
        constructor(sql2, fieldAlias){
            this.sql = sql2;
            this.fieldAlias = fieldAlias;
        }
        static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "SQL.Aliased";
        /** @internal */ isSelectionField = false;
        getSQL() {
            return this.sql;
        }
        /** @internal */ clone() {
            return new Aliased(this.sql, this.fieldAlias);
        }
    }
    SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
class Placeholder {
    constructor(name2){
        this.name = name2;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "Placeholder";
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function placeholder(name2) {
    return new Placeholder(name2);
}
function fillPlaceholders(params, values) {
    return params.map((p)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(p, Placeholder)) {
            if (!(p.name in values)) {
                throw new Error(`No value for placeholder "${p.name}" was provided`);
            }
            return values[p.name];
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(p, Param) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(p.value, Placeholder)) {
            if (!(p.value.name in values)) {
                throw new Error(`No value for placeholder "${p.value.name}" was provided`);
            }
            return p.encoder.mapToDriverValue(values[p.value.name]);
        }
        return p;
    });
}
const IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
class View {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "View";
    /** @internal */ [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]];
    /** @internal */ [IsDrizzleView] = true;
    constructor({ name: name2, schema, selectedFields, query }){
        this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]] = {
            name: name2,
            originalName: name2,
            schema,
            selectedFields,
            query,
            isExisting: !query,
            isAlias: false
        };
    }
    getSQL() {
        return new SQL([
            this
        ]);
    }
}
function isView(view) {
    return typeof view === "object" && view !== null && IsDrizzleView in view;
}
function getViewName(view) {
    return view[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]].name;
}
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"].prototype.getSQL = function() {
    return new SQL([
        this
    ]);
};
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].prototype.getSQL = function() {
    return new SQL([
        this
    ]);
};
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$subquery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subquery"].prototype.getSQL = function() {
    return new SQL([
        this
    ]);
};
;
 //# sourceMappingURL=sql.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyMixins",
    ()=>applyMixins,
    "getColumnNameAndConfig",
    ()=>getColumnNameAndConfig,
    "getTableColumns",
    ()=>getTableColumns,
    "getTableLikeName",
    ()=>getTableLikeName,
    "getViewSelectedFields",
    ()=>getViewSelectedFields,
    "haveSameKeys",
    ()=>haveSameKeys,
    "isConfig",
    ()=>isConfig,
    "mapResultRow",
    ()=>mapResultRow,
    "mapUpdateSet",
    ()=>mapUpdateSet,
    "orderSelectedFields",
    ()=>orderSelectedFields,
    "textDecoder",
    ()=>textDecoder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/sql/sql.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$subquery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/subquery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/view-common.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
function mapResultRow(columns, row, joinsNotNullableMap) {
    const nullifyMap = {};
    const result = columns.reduce((result2, { path, field }, columnIndex)=>{
        let decoder;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(field, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"])) {
            decoder = field;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(field, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SQL"])) {
            decoder = field.decoder;
        } else {
            decoder = field.sql.decoder;
        }
        let node = result2;
        for (const [pathChunkIndex, pathChunk] of path.entries()){
            if (pathChunkIndex < path.length - 1) {
                if (!(pathChunk in node)) {
                    node[pathChunk] = {};
                }
                node = node[pathChunk];
            } else {
                const rawValue = row[columnIndex];
                const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
                if (joinsNotNullableMap && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(field, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"]) && path.length === 2) {
                    const objectName = path[0];
                    if (!(objectName in nullifyMap)) {
                        nullifyMap[objectName] = value === null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTableName"])(field.table) : false;
                    } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTableName"])(field.table)) {
                        nullifyMap[objectName] = false;
                    }
                }
            }
        }
        return result2;
    }, {});
    if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
        for (const [objectName, tableName] of Object.entries(nullifyMap)){
            if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
                result[objectName] = null;
            }
        }
    }
    return result;
}
function orderSelectedFields(fields, pathPrefix) {
    return Object.entries(fields).reduce((result, [name, field])=>{
        if (typeof name !== "string") {
            return result;
        }
        const newPath = pathPrefix ? [
            ...pathPrefix,
            name
        ] : [
            name
        ];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(field, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"]) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(field, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SQL"]) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(field, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SQL"].Aliased)) {
            result.push({
                path: newPath,
                field
            });
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(field, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"])) {
            result.push(...orderSelectedFields(field[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Columns], newPath));
        } else {
            result.push(...orderSelectedFields(field, newPath));
        }
        return result;
    }, []);
}
function haveSameKeys(left, right) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) {
        return false;
    }
    for (const [index, key] of leftKeys.entries()){
        if (key !== rightKeys[index]) {
            return false;
        }
    }
    return true;
}
function mapUpdateSet(table, values) {
    const entries = Object.entries(values).filter(([, value])=>value !== void 0).map(([key, value])=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(value, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SQL"]) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(value, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"])) {
            return [
                key,
                value
            ];
        } else {
            return [
                key,
                new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Param"](value, table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Columns][key])
            ];
        }
    });
    if (entries.length === 0) {
        throw new Error("No values to set");
    }
    return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
    for (const extendedClass of extendedClasses){
        for (const name of Object.getOwnPropertyNames(extendedClass.prototype)){
            if (name === "constructor") continue;
            Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null));
        }
    }
}
function getTableColumns(table) {
    return table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Columns];
}
function getViewSelectedFields(view) {
    return view[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]].selectedFields;
}
function getTableLikeName(table) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(table, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$subquery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Subquery"]) ? table._.alias : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(table, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["View"]) ? table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$view$2d$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ViewBaseConfig"]].name : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["is"])(table, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SQL"]) ? void 0 : table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.IsAlias] ? table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Name] : table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
    return {
        name: typeof a === "string" && a.length > 0 ? a : "",
        config: typeof a === "object" ? a : b
    };
}
const _ = {};
const __ = {};
function isConfig(data) {
    if (typeof data !== "object" || data === null) return false;
    if (data.constructor.name !== "Object") return false;
    if ("logger" in data) {
        const type = typeof data["logger"];
        if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined") return false;
        return true;
    }
    if ("schema" in data) {
        const type = typeof data["schema"];
        if (type !== "object" && type !== "undefined") return false;
        return true;
    }
    if ("casing" in data) {
        const type = typeof data["casing"];
        if (type !== "string" && type !== "undefined") return false;
        return true;
    }
    if ("mode" in data) {
        if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0) return false;
        return true;
    }
    if ("connection" in data) {
        const type = typeof data["connection"];
        if (type !== "string" && type !== "object" && type !== "undefined") return false;
        return true;
    }
    if ("client" in data) {
        const type = typeof data["client"];
        if (type !== "object" && type !== "function" && type !== "undefined") return false;
        return true;
    }
    if (Object.keys(data).length === 0) return true;
    return false;
}
const textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/foreign-keys.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ForeignKey",
    ()=>ForeignKey,
    "ForeignKeyBuilder",
    ()=>ForeignKeyBuilder,
    "foreignKey",
    ()=>foreignKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.utils.js [app-ssr] (ecmascript)");
;
;
class ForeignKeyBuilder {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlForeignKeyBuilder";
    /** @internal */ reference;
    /** @internal */ _onUpdate;
    /** @internal */ _onDelete;
    constructor(config, actions){
        this.reference = ()=>{
            const { name, columns, foreignColumns } = config();
            return {
                name,
                columns,
                foreignTable: foreignColumns[0].table,
                foreignColumns
            };
        };
        if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
        }
    }
    onUpdate(action) {
        this._onUpdate = action;
        return this;
    }
    onDelete(action) {
        this._onDelete = action;
        return this;
    }
    /** @internal */ build(table) {
        return new ForeignKey(table, this);
    }
}
class ForeignKey {
    constructor(table, builder){
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlForeignKey";
    reference;
    onUpdate;
    onDelete;
    getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column)=>column.name);
        const foreignColumnNames = foreignColumns.map((column)=>column.name);
        const chunks = [
            this.table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]],
            ...columnNames,
            foreignColumns[0].table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]],
            ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
    }
}
function foreignKey(config) {
    function mappedConfig() {
        const { name, columns, foreignColumns } = config;
        return {
            name,
            columns,
            foreignColumns
        };
    }
    return new ForeignKeyBuilder(mappedConfig);
}
;
 //# sourceMappingURL=foreign-keys.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/unique-constraint.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UniqueConstraint",
    ()=>UniqueConstraint,
    "UniqueConstraintBuilder",
    ()=>UniqueConstraintBuilder,
    "UniqueOnConstraintBuilder",
    ()=>UniqueOnConstraintBuilder,
    "unique",
    ()=>unique,
    "uniqueKeyName",
    ()=>uniqueKeyName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.utils.js [app-ssr] (ecmascript)");
;
;
function unique(name) {
    return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
    return `${table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableName"]]}_${columns.join("_")}_unique`;
}
class UniqueConstraintBuilder {
    constructor(columns, name){
        this.name = name;
        this.columns = columns;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlUniqueConstraintBuilder";
    /** @internal */ columns;
    /** @internal */ build(table) {
        return new UniqueConstraint(table, this.columns, this.name);
    }
}
class UniqueOnConstraintBuilder {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlUniqueOnConstraintBuilder";
    /** @internal */ name;
    constructor(name){
        this.name = name;
    }
    on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
    }
}
class UniqueConstraint {
    constructor(table, columns, name){
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column)=>column.name));
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlUniqueConstraint";
    columns;
    name;
    nullsNotDistinct = false;
    getName() {
        return this.name;
    }
}
;
 //# sourceMappingURL=unique-constraint.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlColumn",
    ()=>MySqlColumn,
    "MySqlColumnBuilder",
    ()=>MySqlColumnBuilder,
    "MySqlColumnBuilderWithAutoIncrement",
    ()=>MySqlColumnBuilderWithAutoIncrement,
    "MySqlColumnWithAutoIncrement",
    ()=>MySqlColumnWithAutoIncrement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2d$builder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column-builder.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/column.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$foreign$2d$keys$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/foreign-keys.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$unique$2d$constraint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/unique-constraint.js [app-ssr] (ecmascript)");
;
;
;
;
;
class MySqlColumnBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2d$builder$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlColumnBuilder";
    foreignKeyConfigs = [];
    references(ref, actions = {}) {
        this.foreignKeyConfigs.push({
            ref,
            actions
        });
        return this;
    }
    unique(name) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        return this;
    }
    generatedAlwaysAs(as, config) {
        this.config.generated = {
            as,
            type: "always",
            mode: config?.mode ?? "virtual"
        };
        return this;
    }
    /** @internal */ buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions })=>{
            return ((ref2, actions2)=>{
                const builder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$foreign$2d$keys$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ForeignKeyBuilder"](()=>{
                    const foreignColumn = ref2();
                    return {
                        columns: [
                            column
                        ],
                        foreignColumns: [
                            foreignColumn
                        ]
                    };
                });
                if (actions2.onUpdate) {
                    builder.onUpdate(actions2.onUpdate);
                }
                if (actions2.onDelete) {
                    builder.onDelete(actions2.onDelete);
                }
                return builder.build(table);
            })(ref, actions);
        });
    }
}
class MySqlColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Column"] {
    constructor(table, config){
        if (!config.uniqueName) {
            config.uniqueName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$unique$2d$constraint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uniqueKeyName"])(table, [
                config.name
            ]);
        }
        super(table, config);
        this.table = table;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlColumn";
}
class MySqlColumnBuilderWithAutoIncrement extends MySqlColumnBuilder {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlColumnBuilderWithAutoIncrement";
    constructor(name, dataType, columnType){
        super(name, dataType, columnType);
        this.config.autoIncrement = false;
    }
    autoincrement() {
        this.config.autoIncrement = true;
        this.config.hasDefault = true;
        return this;
    }
}
class MySqlColumnWithAutoIncrement extends MySqlColumn {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlColumnWithAutoIncrement";
    autoIncrement = this.config.autoIncrement;
}
;
 //# sourceMappingURL=common.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/bigint.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlBigInt53",
    ()=>MySqlBigInt53,
    "MySqlBigInt53Builder",
    ()=>MySqlBigInt53Builder,
    "MySqlBigInt64",
    ()=>MySqlBigInt64,
    "MySqlBigInt64Builder",
    ()=>MySqlBigInt64Builder,
    "bigint",
    ()=>bigint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlBigInt53Builder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBigInt53Builder";
    constructor(name, unsigned = false){
        super(name, "number", "MySqlBigInt53");
        this.config.unsigned = unsigned;
    }
    /** @internal */ build(table) {
        return new MySqlBigInt53(table, this.config);
    }
}
class MySqlBigInt53 extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBigInt53";
    getSQLType() {
        return `bigint${this.config.unsigned ? " unsigned" : ""}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "number") {
            return value;
        }
        return Number(value);
    }
}
class MySqlBigInt64Builder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBigInt64Builder";
    constructor(name, unsigned = false){
        super(name, "bigint", "MySqlBigInt64");
        this.config.unsigned = unsigned;
    }
    /** @internal */ build(table) {
        return new MySqlBigInt64(table, this.config);
    }
}
class MySqlBigInt64 extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBigInt64";
    getSQLType() {
        return `bigint${this.config.unsigned ? " unsigned" : ""}`;
    }
    // eslint-disable-next-line unicorn/prefer-native-coercion-functions
    mapFromDriverValue(value) {
        return BigInt(value);
    }
}
function bigint(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    if (config.mode === "number") {
        return new MySqlBigInt53Builder(name, config.unsigned);
    }
    return new MySqlBigInt64Builder(name, config.unsigned);
}
;
 //# sourceMappingURL=bigint.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/binary.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlBinary",
    ()=>MySqlBinary,
    "MySqlBinaryBuilder",
    ()=>MySqlBinaryBuilder,
    "binary",
    ()=>binary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlBinaryBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBinaryBuilder";
    constructor(name, length){
        super(name, "string", "MySqlBinary");
        this.config.length = length;
    }
    /** @internal */ build(table) {
        return new MySqlBinary(table, this.config);
    }
}
class MySqlBinary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBinary";
    length = this.config.length;
    mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        if (Buffer.isBuffer(value)) return value.toString();
        const str = [];
        for (const v of value){
            str.push(v === 49 ? "1" : "0");
        }
        return str.join("");
    }
    getSQLType() {
        return this.length === void 0 ? `binary` : `binary(${this.length})`;
    }
}
function binary(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlBinaryBuilder(name, config.length);
}
;
 //# sourceMappingURL=binary.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/boolean.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlBoolean",
    ()=>MySqlBoolean,
    "MySqlBooleanBuilder",
    ()=>MySqlBooleanBuilder,
    "boolean",
    ()=>boolean
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
class MySqlBooleanBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBooleanBuilder";
    constructor(name){
        super(name, "boolean", "MySqlBoolean");
    }
    /** @internal */ build(table) {
        return new MySqlBoolean(table, this.config);
    }
}
class MySqlBoolean extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlBoolean";
    getSQLType() {
        return "boolean";
    }
    mapFromDriverValue(value) {
        if (typeof value === "boolean") {
            return value;
        }
        return value === 1;
    }
}
function boolean(name) {
    return new MySqlBooleanBuilder(name ?? "");
}
;
 //# sourceMappingURL=boolean.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/char.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlChar",
    ()=>MySqlChar,
    "MySqlCharBuilder",
    ()=>MySqlCharBuilder,
    "char",
    ()=>char
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlCharBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlCharBuilder";
    constructor(name, config){
        super(name, "string", "MySqlChar");
        this.config.length = config.length;
        this.config.enum = config.enum;
    }
    /** @internal */ build(table) {
        return new MySqlChar(table, this.config);
    }
}
class MySqlChar extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlChar";
    length = this.config.length;
    enumValues = this.config.enum;
    getSQLType() {
        return this.length === void 0 ? `char` : `char(${this.length})`;
    }
}
function char(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlCharBuilder(name, config);
}
;
 //# sourceMappingURL=char.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/custom.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlCustomColumn",
    ()=>MySqlCustomColumn,
    "MySqlCustomColumnBuilder",
    ()=>MySqlCustomColumnBuilder,
    "customType",
    ()=>customType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlCustomColumnBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlCustomColumnBuilder";
    constructor(name, fieldConfig, customTypeParams){
        super(name, "custom", "MySqlCustomColumn");
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
    }
    /** @internal */ build(table) {
        return new MySqlCustomColumn(table, this.config);
    }
}
class MySqlCustomColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlCustomColumn";
    sqlName;
    mapTo;
    mapFrom;
    constructor(table, config){
        super(table, config);
        this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
        this.mapTo = config.customTypeParams.toDriver;
        this.mapFrom = config.customTypeParams.fromDriver;
    }
    getSQLType() {
        return this.sqlName;
    }
    mapFromDriverValue(value) {
        return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
    }
    mapToDriverValue(value) {
        return typeof this.mapTo === "function" ? this.mapTo(value) : value;
    }
}
function customType(customTypeParams) {
    return (a, b)=>{
        const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
        return new MySqlCustomColumnBuilder(name, config, customTypeParams);
    };
}
;
 //# sourceMappingURL=custom.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/date.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlDate",
    ()=>MySqlDate,
    "MySqlDateBuilder",
    ()=>MySqlDateBuilder,
    "MySqlDateString",
    ()=>MySqlDateString,
    "MySqlDateStringBuilder",
    ()=>MySqlDateStringBuilder,
    "date",
    ()=>date
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlDateBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateBuilder";
    constructor(name){
        super(name, "date", "MySqlDate");
    }
    /** @internal */ build(table) {
        return new MySqlDate(table, this.config);
    }
}
class MySqlDate extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDate";
    constructor(table, config){
        super(table, config);
    }
    getSQLType() {
        return `date`;
    }
    mapFromDriverValue(value) {
        return new Date(value);
    }
}
class MySqlDateStringBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateStringBuilder";
    constructor(name){
        super(name, "string", "MySqlDateString");
    }
    /** @internal */ build(table) {
        return new MySqlDateString(table, this.config);
    }
}
class MySqlDateString extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateString";
    constructor(table, config){
        super(table, config);
    }
    getSQLType() {
        return `date`;
    }
}
function date(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    if (config?.mode === "string") {
        return new MySqlDateStringBuilder(name);
    }
    return new MySqlDateBuilder(name);
}
;
 //# sourceMappingURL=date.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/datetime.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlDateTime",
    ()=>MySqlDateTime,
    "MySqlDateTimeBuilder",
    ()=>MySqlDateTimeBuilder,
    "MySqlDateTimeString",
    ()=>MySqlDateTimeString,
    "MySqlDateTimeStringBuilder",
    ()=>MySqlDateTimeStringBuilder,
    "datetime",
    ()=>datetime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlDateTimeBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateTimeBuilder";
    constructor(name, config){
        super(name, "date", "MySqlDateTime");
        this.config.fsp = config?.fsp;
    }
    /** @internal */ build(table) {
        return new MySqlDateTime(table, this.config);
    }
}
class MySqlDateTime extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateTime";
    fsp;
    constructor(table, config){
        super(table, config);
        this.fsp = config.fsp;
    }
    getSQLType() {
        const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
        return `datetime${precision}`;
    }
    mapToDriverValue(value) {
        return value.toISOString().replace("T", " ").replace("Z", "");
    }
    mapFromDriverValue(value) {
        return /* @__PURE__ */ new Date(value.replace(" ", "T") + "Z");
    }
}
class MySqlDateTimeStringBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateTimeStringBuilder";
    constructor(name, config){
        super(name, "string", "MySqlDateTimeString");
        this.config.fsp = config?.fsp;
    }
    /** @internal */ build(table) {
        return new MySqlDateTimeString(table, this.config);
    }
}
class MySqlDateTimeString extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateTimeString";
    fsp;
    constructor(table, config){
        super(table, config);
        this.fsp = config.fsp;
    }
    getSQLType() {
        const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
        return `datetime${precision}`;
    }
}
function datetime(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    if (config?.mode === "string") {
        return new MySqlDateTimeStringBuilder(name, config);
    }
    return new MySqlDateTimeBuilder(name, config);
}
;
 //# sourceMappingURL=datetime.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/decimal.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlDecimal",
    ()=>MySqlDecimal,
    "MySqlDecimalBigInt",
    ()=>MySqlDecimalBigInt,
    "MySqlDecimalBigIntBuilder",
    ()=>MySqlDecimalBigIntBuilder,
    "MySqlDecimalBuilder",
    ()=>MySqlDecimalBuilder,
    "MySqlDecimalNumber",
    ()=>MySqlDecimalNumber,
    "MySqlDecimalNumberBuilder",
    ()=>MySqlDecimalNumberBuilder,
    "decimal",
    ()=>decimal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlDecimalBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDecimalBuilder";
    constructor(name, config){
        super(name, "string", "MySqlDecimal");
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */ build(table) {
        return new MySqlDecimal(table, this.config);
    }
}
class MySqlDecimal extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDecimal";
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        return String(value);
    }
    getSQLType() {
        let type = "";
        if (this.precision !== void 0 && this.scale !== void 0) {
            type += `decimal(${this.precision},${this.scale})`;
        } else if (this.precision === void 0) {
            type += "decimal";
        } else {
            type += `decimal(${this.precision})`;
        }
        type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
        return this.unsigned ? `${type} unsigned` : type;
    }
}
class MySqlDecimalNumberBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDecimalNumberBuilder";
    constructor(name, config){
        super(name, "number", "MySqlDecimalNumber");
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */ build(table) {
        return new MySqlDecimalNumber(table, this.config);
    }
}
class MySqlDecimalNumber extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDecimalNumber";
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    mapFromDriverValue(value) {
        if (typeof value === "number") return value;
        return Number(value);
    }
    mapToDriverValue = String;
    getSQLType() {
        let type = "";
        if (this.precision !== void 0 && this.scale !== void 0) {
            type += `decimal(${this.precision},${this.scale})`;
        } else if (this.precision === void 0) {
            type += "decimal";
        } else {
            type += `decimal(${this.precision})`;
        }
        type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
        return this.unsigned ? `${type} unsigned` : type;
    }
}
class MySqlDecimalBigIntBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDecimalBigIntBuilder";
    constructor(name, config){
        super(name, "bigint", "MySqlDecimalBigInt");
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */ build(table) {
        return new MySqlDecimalBigInt(table, this.config);
    }
}
class MySqlDecimalBigInt extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDecimalBigInt";
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    mapFromDriverValue = BigInt;
    mapToDriverValue = String;
    getSQLType() {
        let type = "";
        if (this.precision !== void 0 && this.scale !== void 0) {
            type += `decimal(${this.precision},${this.scale})`;
        } else if (this.precision === void 0) {
            type += "decimal";
        } else {
            type += `decimal(${this.precision})`;
        }
        type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
        return this.unsigned ? `${type} unsigned` : type;
    }
}
function decimal(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    const mode = config?.mode;
    return mode === "number" ? new MySqlDecimalNumberBuilder(name, config) : mode === "bigint" ? new MySqlDecimalBigIntBuilder(name, config) : new MySqlDecimalBuilder(name, config);
}
;
 //# sourceMappingURL=decimal.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/double.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlDouble",
    ()=>MySqlDouble,
    "MySqlDoubleBuilder",
    ()=>MySqlDoubleBuilder,
    "double",
    ()=>double
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlDoubleBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDoubleBuilder";
    constructor(name, config){
        super(name, "number", "MySqlDouble");
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */ build(table) {
        return new MySqlDouble(table, this.config);
    }
}
class MySqlDouble extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDouble";
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    getSQLType() {
        let type = "";
        if (this.precision !== void 0 && this.scale !== void 0) {
            type += `double(${this.precision},${this.scale})`;
        } else if (this.precision === void 0) {
            type += "double";
        } else {
            type += `double(${this.precision})`;
        }
        return this.unsigned ? `${type} unsigned` : type;
    }
}
function double(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlDoubleBuilder(name, config);
}
;
 //# sourceMappingURL=double.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/enum.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlEnumColumn",
    ()=>MySqlEnumColumn,
    "MySqlEnumColumnBuilder",
    ()=>MySqlEnumColumnBuilder,
    "MySqlEnumObjectColumn",
    ()=>MySqlEnumObjectColumn,
    "MySqlEnumObjectColumnBuilder",
    ()=>MySqlEnumObjectColumnBuilder,
    "mysqlEnum",
    ()=>mysqlEnum
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
class MySqlEnumColumnBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlEnumColumnBuilder";
    constructor(name, values){
        super(name, "string", "MySqlEnumColumn");
        this.config.enumValues = values;
    }
    /** @internal */ build(table) {
        return new MySqlEnumColumn(table, this.config);
    }
}
class MySqlEnumColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlEnumColumn";
    enumValues = this.config.enumValues;
    getSQLType() {
        return `enum(${this.enumValues.map((value)=>`'${value}'`).join(",")})`;
    }
}
class MySqlEnumObjectColumnBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlEnumObjectColumnBuilder";
    constructor(name, values){
        super(name, "string", "MySqlEnumObjectColumn");
        this.config.enumValues = values;
    }
    /** @internal */ build(table) {
        return new MySqlEnumObjectColumn(table, this.config);
    }
}
class MySqlEnumObjectColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlEnumObjectColumn";
    enumValues = this.config.enumValues;
    getSQLType() {
        return `enum(${this.enumValues.map((value)=>`'${value}'`).join(",")})`;
    }
}
function mysqlEnum(a, b) {
    if (typeof a === "string" && Array.isArray(b) || Array.isArray(a)) {
        const name = typeof a === "string" && a.length > 0 ? a : "";
        const values = (typeof a === "string" ? b : a) ?? [];
        if (values.length === 0) {
            throw new Error(`You have an empty array for "${name}" enum values`);
        }
        return new MySqlEnumColumnBuilder(name, values);
    }
    if (typeof a === "string" && typeof b === "object" || typeof a === "object") {
        const name = typeof a === "object" ? "" : a;
        const values = typeof a === "object" ? Object.values(a) : typeof b === "object" ? Object.values(b) : [];
        if (values.length === 0) {
            throw new Error(`You have an empty array for "${name}" enum values`);
        }
        return new MySqlEnumObjectColumnBuilder(name, values);
    }
}
;
 //# sourceMappingURL=enum.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/float.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlFloat",
    ()=>MySqlFloat,
    "MySqlFloatBuilder",
    ()=>MySqlFloatBuilder,
    "float",
    ()=>float
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlFloatBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlFloatBuilder";
    constructor(name, config){
        super(name, "number", "MySqlFloat");
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
        this.config.unsigned = config?.unsigned;
    }
    /** @internal */ build(table) {
        return new MySqlFloat(table, this.config);
    }
}
class MySqlFloat extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlFloat";
    precision = this.config.precision;
    scale = this.config.scale;
    unsigned = this.config.unsigned;
    getSQLType() {
        let type = "";
        if (this.precision !== void 0 && this.scale !== void 0) {
            type += `float(${this.precision},${this.scale})`;
        } else if (this.precision === void 0) {
            type += "float";
        } else {
            type += `float(${this.precision})`;
        }
        return this.unsigned ? `${type} unsigned` : type;
    }
}
function float(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlFloatBuilder(name, config);
}
;
 //# sourceMappingURL=float.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/int.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlInt",
    ()=>MySqlInt,
    "MySqlIntBuilder",
    ()=>MySqlIntBuilder,
    "int",
    ()=>int
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlIntBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlIntBuilder";
    constructor(name, config){
        super(name, "number", "MySqlInt");
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */ build(table) {
        return new MySqlInt(table, this.config);
    }
}
class MySqlInt extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlInt";
    getSQLType() {
        return `int${this.config.unsigned ? " unsigned" : ""}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            return Number(value);
        }
        return value;
    }
}
function int(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlIntBuilder(name, config);
}
;
 //# sourceMappingURL=int.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/json.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlJson",
    ()=>MySqlJson,
    "MySqlJsonBuilder",
    ()=>MySqlJsonBuilder,
    "json",
    ()=>json
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
class MySqlJsonBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlJsonBuilder";
    constructor(name){
        super(name, "json", "MySqlJson");
    }
    /** @internal */ build(table) {
        return new MySqlJson(table, this.config);
    }
}
class MySqlJson extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlJson";
    getSQLType() {
        return "json";
    }
    mapToDriverValue(value) {
        return JSON.stringify(value);
    }
}
function json(name) {
    return new MySqlJsonBuilder(name ?? "");
}
;
 //# sourceMappingURL=json.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/mediumint.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlMediumInt",
    ()=>MySqlMediumInt,
    "MySqlMediumIntBuilder",
    ()=>MySqlMediumIntBuilder,
    "mediumint",
    ()=>mediumint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlMediumIntBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlMediumIntBuilder";
    constructor(name, config){
        super(name, "number", "MySqlMediumInt");
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */ build(table) {
        return new MySqlMediumInt(table, this.config);
    }
}
class MySqlMediumInt extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlMediumInt";
    getSQLType() {
        return `mediumint${this.config.unsigned ? " unsigned" : ""}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            return Number(value);
        }
        return value;
    }
}
function mediumint(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlMediumIntBuilder(name, config);
}
;
 //# sourceMappingURL=mediumint.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/real.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlReal",
    ()=>MySqlReal,
    "MySqlRealBuilder",
    ()=>MySqlRealBuilder,
    "real",
    ()=>real
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlRealBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlRealBuilder";
    constructor(name, config){
        super(name, "number", "MySqlReal");
        this.config.precision = config?.precision;
        this.config.scale = config?.scale;
    }
    /** @internal */ build(table) {
        return new MySqlReal(table, this.config);
    }
}
class MySqlReal extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlReal";
    precision = this.config.precision;
    scale = this.config.scale;
    getSQLType() {
        if (this.precision !== void 0 && this.scale !== void 0) {
            return `real(${this.precision}, ${this.scale})`;
        } else if (this.precision === void 0) {
            return "real";
        } else {
            return `real(${this.precision})`;
        }
    }
}
function real(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlRealBuilder(name, config);
}
;
 //# sourceMappingURL=real.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/serial.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlSerial",
    ()=>MySqlSerial,
    "MySqlSerialBuilder",
    ()=>MySqlSerialBuilder,
    "serial",
    ()=>serial
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
class MySqlSerialBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlSerialBuilder";
    constructor(name){
        super(name, "number", "MySqlSerial");
        this.config.hasDefault = true;
        this.config.autoIncrement = true;
    }
    /** @internal */ build(table) {
        return new MySqlSerial(table, this.config);
    }
}
class MySqlSerial extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlSerial";
    getSQLType() {
        return "serial";
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            return Number(value);
        }
        return value;
    }
}
function serial(name) {
    return new MySqlSerialBuilder(name ?? "");
}
;
 //# sourceMappingURL=serial.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/smallint.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlSmallInt",
    ()=>MySqlSmallInt,
    "MySqlSmallIntBuilder",
    ()=>MySqlSmallIntBuilder,
    "smallint",
    ()=>smallint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlSmallIntBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlSmallIntBuilder";
    constructor(name, config){
        super(name, "number", "MySqlSmallInt");
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */ build(table) {
        return new MySqlSmallInt(table, this.config);
    }
}
class MySqlSmallInt extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlSmallInt";
    getSQLType() {
        return `smallint${this.config.unsigned ? " unsigned" : ""}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            return Number(value);
        }
        return value;
    }
}
function smallint(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlSmallIntBuilder(name, config);
}
;
 //# sourceMappingURL=smallint.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/text.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlText",
    ()=>MySqlText,
    "MySqlTextBuilder",
    ()=>MySqlTextBuilder,
    "longtext",
    ()=>longtext,
    "mediumtext",
    ()=>mediumtext,
    "text",
    ()=>text,
    "tinytext",
    ()=>tinytext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlTextBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTextBuilder";
    constructor(name, textType, config){
        super(name, "string", "MySqlText");
        this.config.textType = textType;
        this.config.enumValues = config.enum;
    }
    /** @internal */ build(table) {
        return new MySqlText(table, this.config);
    }
}
class MySqlText extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlText";
    textType = this.config.textType;
    enumValues = this.config.enumValues;
    getSQLType() {
        return this.textType;
    }
}
function text(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlTextBuilder(name, "text", config);
}
function tinytext(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlTextBuilder(name, "tinytext", config);
}
function mediumtext(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlTextBuilder(name, "mediumtext", config);
}
function longtext(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlTextBuilder(name, "longtext", config);
}
;
 //# sourceMappingURL=text.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/time.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlTime",
    ()=>MySqlTime,
    "MySqlTimeBuilder",
    ()=>MySqlTimeBuilder,
    "time",
    ()=>time
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlTimeBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTimeBuilder";
    constructor(name, config){
        super(name, "string", "MySqlTime");
        this.config.fsp = config?.fsp;
    }
    /** @internal */ build(table) {
        return new MySqlTime(table, this.config);
    }
}
class MySqlTime extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTime";
    fsp = this.config.fsp;
    getSQLType() {
        const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
        return `time${precision}`;
    }
}
function time(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlTimeBuilder(name, config);
}
;
 //# sourceMappingURL=time.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/date.common.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlDateBaseColumn",
    ()=>MySqlDateBaseColumn,
    "MySqlDateColumnBaseBuilder",
    ()=>MySqlDateColumnBaseBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/sql/sql.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlDateColumnBaseBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateColumnBuilder";
    defaultNow() {
        return this.default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sql"]`(now())`);
    }
    // "on update now" also adds an implicit default value to the column - https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html
    onUpdateNow() {
        this.config.hasOnUpdateNow = true;
        this.config.hasDefault = true;
        return this;
    }
}
class MySqlDateBaseColumn extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlDateColumn";
    hasOnUpdateNow = this.config.hasOnUpdateNow;
}
;
 //# sourceMappingURL=date.common.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/timestamp.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlTimestamp",
    ()=>MySqlTimestamp,
    "MySqlTimestampBuilder",
    ()=>MySqlTimestampBuilder,
    "MySqlTimestampString",
    ()=>MySqlTimestampString,
    "MySqlTimestampStringBuilder",
    ()=>MySqlTimestampStringBuilder,
    "timestamp",
    ()=>timestamp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$date$2e$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/date.common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlTimestampBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$date$2e$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlDateColumnBaseBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTimestampBuilder";
    constructor(name, config){
        super(name, "date", "MySqlTimestamp");
        this.config.fsp = config?.fsp;
    }
    /** @internal */ build(table) {
        return new MySqlTimestamp(table, this.config);
    }
}
class MySqlTimestamp extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$date$2e$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlDateBaseColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTimestamp";
    fsp = this.config.fsp;
    getSQLType() {
        const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
        return `timestamp${precision}`;
    }
    mapFromDriverValue(value) {
        return /* @__PURE__ */ new Date(value + "+0000");
    }
    mapToDriverValue(value) {
        return value.toISOString().slice(0, -1).replace("T", " ");
    }
}
class MySqlTimestampStringBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$date$2e$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlDateColumnBaseBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTimestampStringBuilder";
    constructor(name, config){
        super(name, "string", "MySqlTimestampString");
        this.config.fsp = config?.fsp;
    }
    /** @internal */ build(table) {
        return new MySqlTimestampString(table, this.config);
    }
}
class MySqlTimestampString extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$date$2e$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlDateBaseColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTimestampString";
    fsp = this.config.fsp;
    getSQLType() {
        const precision = this.fsp === void 0 ? "" : `(${this.fsp})`;
        return `timestamp${precision}`;
    }
}
function timestamp(a, b = {}) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    if (config?.mode === "string") {
        return new MySqlTimestampStringBuilder(name, config);
    }
    return new MySqlTimestampBuilder(name, config);
}
;
 //# sourceMappingURL=timestamp.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/tinyint.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlTinyInt",
    ()=>MySqlTinyInt,
    "MySqlTinyIntBuilder",
    ()=>MySqlTinyIntBuilder,
    "tinyint",
    ()=>tinyint
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlTinyIntBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilderWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTinyIntBuilder";
    constructor(name, config){
        super(name, "number", "MySqlTinyInt");
        this.config.unsigned = config ? config.unsigned : false;
    }
    /** @internal */ build(table) {
        return new MySqlTinyInt(table, this.config);
    }
}
class MySqlTinyInt extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnWithAutoIncrement"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTinyInt";
    getSQLType() {
        return `tinyint${this.config.unsigned ? " unsigned" : ""}`;
    }
    mapFromDriverValue(value) {
        if (typeof value === "string") {
            return Number(value);
        }
        return value;
    }
}
function tinyint(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlTinyIntBuilder(name, config);
}
;
 //# sourceMappingURL=tinyint.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/varbinary.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlVarBinary",
    ()=>MySqlVarBinary,
    "MySqlVarBinaryBuilder",
    ()=>MySqlVarBinaryBuilder,
    "varbinary",
    ()=>varbinary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlVarBinaryBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlVarBinaryBuilder";
    /** @internal */ constructor(name, config){
        super(name, "string", "MySqlVarBinary");
        this.config.length = config?.length;
    }
    /** @internal */ build(table) {
        return new MySqlVarBinary(table, this.config);
    }
}
class MySqlVarBinary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlVarBinary";
    length = this.config.length;
    mapFromDriverValue(value) {
        if (typeof value === "string") return value;
        if (Buffer.isBuffer(value)) return value.toString();
        const str = [];
        for (const v of value){
            str.push(v === 49 ? "1" : "0");
        }
        return str.join("");
    }
    getSQLType() {
        return this.length === void 0 ? `varbinary` : `varbinary(${this.length})`;
    }
}
function varbinary(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlVarBinaryBuilder(name, config);
}
;
 //# sourceMappingURL=varbinary.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/varchar.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlVarChar",
    ()=>MySqlVarChar,
    "MySqlVarCharBuilder",
    ()=>MySqlVarCharBuilder,
    "varchar",
    ()=>varchar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
;
class MySqlVarCharBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlVarCharBuilder";
    /** @internal */ constructor(name, config){
        super(name, "string", "MySqlVarChar");
        this.config.length = config.length;
        this.config.enum = config.enum;
    }
    /** @internal */ build(table) {
        return new MySqlVarChar(table, this.config);
    }
}
class MySqlVarChar extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlVarChar";
    length = this.config.length;
    enumValues = this.config.enum;
    getSQLType() {
        return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
    }
}
function varchar(a, b) {
    const { name, config } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumnNameAndConfig"])(a, b);
    return new MySqlVarCharBuilder(name, config);
}
;
 //# sourceMappingURL=varchar.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/year.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MySqlYear",
    ()=>MySqlYear,
    "MySqlYearBuilder",
    ()=>MySqlYearBuilder,
    "year",
    ()=>year
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/common.js [app-ssr] (ecmascript)");
;
;
class MySqlYearBuilder extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumnBuilder"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlYearBuilder";
    constructor(name){
        super(name, "number", "MySqlYear");
    }
    /** @internal */ build(table) {
        return new MySqlYear(table, this.config);
    }
}
class MySqlYear extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$common$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MySqlColumn"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlYear";
    getSQLType() {
        return `year`;
    }
}
function year(name) {
    return new MySqlYearBuilder(name ?? "");
}
;
 //# sourceMappingURL=year.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/all.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMySqlColumnBuilders",
    ()=>getMySqlColumnBuilders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$bigint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/bigint.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$binary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/binary.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/boolean.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$char$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/char.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$custom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/custom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$date$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/date.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$datetime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/datetime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$decimal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/decimal.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$double$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/double.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/enum.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$float$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/float.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/int.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/json.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$mediumint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/mediumint.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/real.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/serial.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$smallint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/smallint.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/text.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/time.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/timestamp.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$tinyint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/tinyint.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varbinary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/varbinary.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/varchar.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$year$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/year.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function getMySqlColumnBuilders() {
    return {
        bigint: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$bigint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bigint"],
        binary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$binary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["binary"],
        boolean: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["boolean"],
        char: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$char$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["char"],
        customType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$custom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customType"],
        date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$date$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["date"],
        datetime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$datetime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["datetime"],
        decimal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$decimal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decimal"],
        double: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$double$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["double"],
        mysqlEnum: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mysqlEnum"],
        float: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$float$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["float"],
        int: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$int$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["int"],
        json: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$json$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["json"],
        mediumint: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$mediumint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mediumint"],
        real: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$real$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["real"],
        serial: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serial"],
        smallint: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$smallint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["smallint"],
        text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["text"],
        time: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$time$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["time"],
        timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["timestamp"],
        tinyint: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$tinyint$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tinyint"],
        varbinary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varbinary$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["varbinary"],
        varchar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["varchar"],
        year: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$year$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["year"],
        longtext: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["longtext"],
        mediumtext: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mediumtext"],
        tinytext: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tinytext"]
    };
}
;
 //# sourceMappingURL=all.js.map
}),
"[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/table.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InlineForeignKeys",
    ()=>InlineForeignKeys,
    "MySqlTable",
    ()=>MySqlTable,
    "mysqlTable",
    ()=>mysqlTable,
    "mysqlTableCreator",
    ()=>mysqlTableCreator,
    "mysqlTableWithSchema",
    ()=>mysqlTableWithSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/entity.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/table.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$all$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.44.7+cc127fb80b35d2e5/node_modules/drizzle-orm/mysql-core/columns/all.js [app-ssr] (ecmascript)");
;
;
;
const InlineForeignKeys = Symbol.for("drizzle:MySqlInlineForeignKeys");
class MySqlTable extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["entityKind"]] = "MySqlTable";
    /** @internal */ static Symbol = Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol, {
        InlineForeignKeys
    });
    /** @internal */ [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Columns];
    /** @internal */ [InlineForeignKeys] = [];
    /** @internal */ [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.ExtraConfigBuilder] = void 0;
}
function mysqlTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
    const rawTable = new MySqlTable(name, schema, baseName);
    const parsedColumns = typeof columns === "function" ? columns((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$mysql$2d$core$2f$columns$2f$all$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMySqlColumnBuilders"])()) : columns;
    const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name2, colBuilderBase])=>{
        const colBuilder = colBuilderBase;
        colBuilder.setName(name2);
        const column = colBuilder.build(rawTable);
        rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
        return [
            name2,
            column
        ];
    }));
    const table = Object.assign(rawTable, builtColumns);
    table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.Columns] = builtColumns;
    table[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$44$2e$7$2b$cc127fb80b35d2e5$2f$node_modules$2f$drizzle$2d$orm$2f$table$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"].Symbol.ExtraConfigColumns] = builtColumns;
    if (extraConfig) {
        table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
    }
    return table;
}
const mysqlTable = (name, columns, extraConfig)=>{
    return mysqlTableWithSchema(name, columns, extraConfig, void 0, name);
};
function mysqlTableCreator(customizeTableName) {
    return (name, columns, extraConfig)=>{
        return mysqlTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
    };
}
;
 //# sourceMappingURL=table.js.map
}),
];

//# sourceMappingURL=21354_drizzle-orm_81048645._.js.map