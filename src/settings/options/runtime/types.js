"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("ts-runtime/lib");
var ScraperName = lib_1.default.type("ScraperName", lib_1.default.nullable(lib_1.default.string()));
var LogLevel = lib_1.default.type("LogLevel", lib_1.default.nullable(lib_1.default.union(lib_1.default.nullable(lib_1.default.string("debug")), lib_1.default.nullable(lib_1.default.string("info")), lib_1.default.nullable(lib_1.default.string("warn")), lib_1.default.nullable(lib_1.default.string("error")))));
exports.Input = lib_1.default.type("Input", lib_1.default.object(lib_1.default.indexer("inputName", lib_1.default.nullable(lib_1.default.string()), lib_1.default.nullable(lib_1.default.union(lib_1.default.nullable(lib_1.default.number()), lib_1.default.nullable(lib_1.default.string()), lib_1.default.nullable(lib_1.default.boolean()))))));
var OptionsAny = lib_1.default.type("OptionsAny", lib_1.default.object(lib_1.default.property("cache", lib_1.default.nullable(lib_1.default.boolean()), true)));
var ScraperOptionsInit = lib_1.default.type("ScraperOptionsInit", lib_1.default.intersect(lib_1.default.ref(OptionsAny), lib_1.default.object(lib_1.default.property("downloadPriority", lib_1.default.nullable(lib_1.default.number()), true), lib_1.default.property("logLevel", lib_1.default.nullable(lib_1.default.ref(LogLevel)), true))));
var ScraperOptions = lib_1.default.type("ScraperOptions", lib_1.default.intersect(lib_1.default.ref(OptionsAny), lib_1.default.object(lib_1.default.property("cache", lib_1.default.nullable(lib_1.default.boolean())), lib_1.default.property("downloadPriority", lib_1.default.nullable(lib_1.default.number())), lib_1.default.property("logLevel", lib_1.default.nullable(lib_1.default.ref(LogLevel))))));
exports.Parallelism = lib_1.default.type("Parallelism", lib_1.default.object(lib_1.default.property("maxConcurrent", lib_1.default.nullable(lib_1.default.number()), true), lib_1.default.property("rateLimit", lib_1.default.object(lib_1.default.property("rate", lib_1.default.nullable(lib_1.default.number())), lib_1.default.property("limit", lib_1.default.nullable(lib_1.default.number()))), true)));
exports.OptionsInit = lib_1.default.type("OptionsInit", lib_1.default.intersect(lib_1.default.ref(OptionsAny), lib_1.default.ref(exports.Parallelism), lib_1.default.object(lib_1.default.property("input", lib_1.default.nullable(lib_1.default.ref(exports.Input)), true), lib_1.default.property("folder", lib_1.default.nullable(lib_1.default.string())), lib_1.default.property("cleanFolder", lib_1.default.nullable(lib_1.default.boolean()), true), lib_1.default.property("logLevel", lib_1.default.nullable(lib_1.default.ref(LogLevel)), true), lib_1.default.property("logToFile", lib_1.default.nullable(lib_1.default.string()), true), lib_1.default.property("optionsEach", lib_1.default.object(lib_1.default.indexer("scraperName", lib_1.default.nullable(lib_1.default.string()), lib_1.default.nullable(lib_1.default.ref(ScraperOptionsInit)))), true))));
exports.Options = lib_1.default.type("Options", lib_1.default.intersect(lib_1.default.ref(ScraperOptions), lib_1.default.object(lib_1.default.property("input", lib_1.default.nullable(lib_1.default.ref(exports.Input))), lib_1.default.property("folder", lib_1.default.nullable(lib_1.default.string())))));
exports.FlatOptions = lib_1.default.type("FlatOptions", lib_1.default.nullable(lib_1.default.ref("global.Map.1935072597", lib_1.default.nullable(lib_1.default.ref(ScraperName)), lib_1.default.nullable(lib_1.default.ref(exports.Options)))));
