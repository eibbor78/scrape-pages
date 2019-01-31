"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __importDefault(require("ts-runtime/lib"));
lib_1.default.declare("Array.631742855", lib_1.default.type("Array", Array => {
    const T = Array.typeParameter("T");
    return lib_1.default.object(lib_1.default.property("length", lib_1.default.number()), lib_1.default.indexer("n", lib_1.default.number(), T), lib_1.default.property("toString", lib_1.default.function(lib_1.default.return(lib_1.default.string()))), lib_1.default.property("toLocaleString", lib_1.default.function(lib_1.default.return(lib_1.default.string()))), lib_1.default.property("pop", lib_1.default.function(lib_1.default.return(lib_1.default.union(T, lib_1.default.undef())))), lib_1.default.property("push", lib_1.default.function(lib_1.default.param("items", lib_1.default.array(T), true), lib_1.default.return(lib_1.default.number()))), lib_1.default.property("concat", lib_1.default.function(lib_1.default.param("items", lib_1.default.union(lib_1.default.array(lib_1.default.ref(ConcatArray, T)), lib_1.default.array(lib_1.default.union(T, lib_1.default.ref(ConcatArray, T)))), true), lib_1.default.return(lib_1.default.array(T)))), lib_1.default.property("join", lib_1.default.function(lib_1.default.param("separator", lib_1.default.string(), true), lib_1.default.return(lib_1.default.string()))), lib_1.default.property("reverse", lib_1.default.function(lib_1.default.return(lib_1.default.array(T)))), lib_1.default.property("shift", lib_1.default.function(lib_1.default.return(lib_1.default.union(T, lib_1.default.undef())))), lib_1.default.property("slice", lib_1.default.function(lib_1.default.param("start", lib_1.default.number(), true), lib_1.default.param("end", lib_1.default.number(), true), lib_1.default.return(lib_1.default.array(T)))), lib_1.default.property("sort", lib_1.default.function(lib_1.default.param("compareFn", lib_1.default.function(lib_1.default.param("a", T), lib_1.default.param("b", T), lib_1.default.return(lib_1.default.number())), true), lib_1.default.return(lib_1.default.this(this)))), lib_1.default.property("splice", lib_1.default.function(lib_1.default.param("start", lib_1.default.number()), lib_1.default.param("deleteCount", lib_1.default.union(lib_1.default.number(), lib_1.default.number()), true), lib_1.default.param("items", lib_1.default.array(T), true), lib_1.default.return(lib_1.default.array(T)))), lib_1.default.property("unshift", lib_1.default.function(lib_1.default.param("items", lib_1.default.array(T), true), lib_1.default.return(lib_1.default.number()))), lib_1.default.property("indexOf", lib_1.default.function(lib_1.default.param("searchElement", T), lib_1.default.param("fromIndex", lib_1.default.number(), true), lib_1.default.return(lib_1.default.number()))), lib_1.default.property("lastIndexOf", lib_1.default.function(lib_1.default.param("searchElement", T), lib_1.default.param("fromIndex", lib_1.default.number(), true), lib_1.default.return(lib_1.default.number()))), lib_1.default.property("every", lib_1.default.function(lib_1.default.param("callbackfn", lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(lib_1.default.boolean()))), lib_1.default.param("thisArg", lib_1.default.any(), true), lib_1.default.return(lib_1.default.boolean()))), lib_1.default.property("some", lib_1.default.function(lib_1.default.param("callbackfn", lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(lib_1.default.boolean()))), lib_1.default.param("thisArg", lib_1.default.any(), true), lib_1.default.return(lib_1.default.boolean()))), lib_1.default.property("forEach", lib_1.default.function(lib_1.default.param("callbackfn", lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(lib_1.default.void()))), lib_1.default.param("thisArg", lib_1.default.any(), true), lib_1.default.return(lib_1.default.void()))), lib_1.default.property("map", lib_1.default.function(fn => {
        const U = fn.typeParameter("U");
        return [lib_1.default.param("callbackfn", lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(U))), lib_1.default.param("thisArg", lib_1.default.any(), true), lib_1.default.return(lib_1.default.array(U))];
    })), lib_1.default.property("filter", lib_1.default.function(fn => {
        const S = fn.typeParameter("S", T);
        return [lib_1.default.param("callbackfn", lib_1.default.union(lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(lib_1.default.boolean())), lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(lib_1.default.any())))), lib_1.default.param("thisArg", lib_1.default.any(), true), lib_1.default.return(lib_1.default.union(lib_1.default.array(S), lib_1.default.array(T)))];
    })), lib_1.default.property("reduce", lib_1.default.function(fn => {
        const U = fn.typeParameter("U");
        return [lib_1.default.param("callbackfn", lib_1.default.union(lib_1.default.function(lib_1.default.param("previousValue", T), lib_1.default.param("currentValue", T), lib_1.default.param("currentIndex", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(T)), lib_1.default.function(lib_1.default.param("previousValue", U), lib_1.default.param("currentValue", T), lib_1.default.param("currentIndex", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(U)))), lib_1.default.param("initialValue", lib_1.default.union(T, U), true), lib_1.default.return(lib_1.default.union(T, U))];
    })), lib_1.default.property("reduceRight", lib_1.default.function(fn => {
        const U = fn.typeParameter("U");
        return [lib_1.default.param("callbackfn", lib_1.default.union(lib_1.default.function(lib_1.default.param("previousValue", T), lib_1.default.param("currentValue", T), lib_1.default.param("currentIndex", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(T)), lib_1.default.function(lib_1.default.param("previousValue", U), lib_1.default.param("currentValue", T), lib_1.default.param("currentIndex", lib_1.default.number()), lib_1.default.param("array", lib_1.default.array(T)), lib_1.default.return(U)))), lib_1.default.param("initialValue", lib_1.default.union(T, U), true), lib_1.default.return(lib_1.default.union(T, U))];
    })), lib_1.default.property("find", lib_1.default.function(fn => {
        const S = fn.typeParameter("S", T);
        return [lib_1.default.param("predicate", lib_1.default.union(lib_1.default.function(lib_1.default.param("this", lib_1.default.void()), lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("obj", lib_1.default.array(T)), lib_1.default.return(lib_1.default.boolean())), lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("obj", lib_1.default.array(T)), lib_1.default.return(lib_1.default.boolean())))), lib_1.default.param("thisArg", lib_1.default.any(), true), lib_1.default.return(lib_1.default.union(lib_1.default.union(S, lib_1.default.undef()), lib_1.default.union(T, lib_1.default.undef())))];
    })), lib_1.default.property("findIndex", lib_1.default.function(lib_1.default.param("predicate", lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("index", lib_1.default.number()), lib_1.default.param("obj", lib_1.default.array(T)), lib_1.default.return(lib_1.default.boolean()))), lib_1.default.param("thisArg", lib_1.default.any(), true), lib_1.default.return(lib_1.default.number()))), lib_1.default.property("fill", lib_1.default.function(lib_1.default.param("value", T), lib_1.default.param("start", lib_1.default.number(), true), lib_1.default.param("end", lib_1.default.number(), true), lib_1.default.return(lib_1.default.this(this)))), lib_1.default.property("copyWithin", lib_1.default.function(lib_1.default.param("target", lib_1.default.number()), lib_1.default.param("start", lib_1.default.number()), lib_1.default.param("end", lib_1.default.number(), true), lib_1.default.return(lib_1.default.this(this)))), lib_1.default.property(Symbol.iterator, lib_1.default.function(lib_1.default.return(lib_1.default.ref(IterableIterator, T)))), lib_1.default.property("entries", lib_1.default.function(lib_1.default.return(lib_1.default.ref(IterableIterator, lib_1.default.tuple(lib_1.default.number(), T))))), lib_1.default.property("keys", lib_1.default.function(lib_1.default.return(lib_1.default.ref(IterableIterator, lib_1.default.number())))), lib_1.default.property("values", lib_1.default.function(lib_1.default.return(lib_1.default.ref(IterableIterator, T)))), lib_1.default.property(Symbol.unscopables, lib_1.default.function(lib_1.default.return(lib_1.default.object(lib_1.default.property("copyWithin", lib_1.default.boolean()), lib_1.default.property("entries", lib_1.default.boolean()), lib_1.default.property("fill", lib_1.default.boolean()), lib_1.default.property("find", lib_1.default.boolean()), lib_1.default.property("findIndex", lib_1.default.boolean()), lib_1.default.property("keys", lib_1.default.boolean()), lib_1.default.property("values", lib_1.default.boolean()))))), lib_1.default.property("includes", lib_1.default.function(lib_1.default.param("searchElement", T), lib_1.default.param("fromIndex", lib_1.default.number(), true), lib_1.default.return(lib_1.default.boolean()))));
}));
//# sourceMappingURL=module.jsx.map