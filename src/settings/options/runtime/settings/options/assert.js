"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_is_1 = require("typescript-is");
const error_1 = require("../../util/error");
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
exports.assertOptionsType = (optionsInit) => {
    try {
        (object => { var path = ["$"]; function _number(object) { if (typeof object !== "number")
            return "validation failed at " + path.join(".") + ": expected a number";
        else
            return null; } function _300(object) { if (typeof object !== "object" || object === null || Array.isArray(object))
            return "validation failed at " + path.join(".") + ": expected an object"; {
            if ("rate" in object) {
                path.push("rate");
                var error = _number(object["rate"]);
                path.pop();
                if (error)
                    return error;
            }
            else
                return "validation failed at " + path.join(".") + ": expected 'rate' in object";
        } {
            if ("limit" in object) {
                path.push("limit");
                var error = _number(object["limit"]);
                path.pop();
                if (error)
                    return error;
            }
            else
                return "validation failed at " + path.join(".") + ": expected 'limit' in object";
        } return null; } function _303(object) { if (object !== "debug")
            return "validation failed at " + path.join(".") + ": expected string 'debug'";
        else
            return null; } function _305(object) { if (object !== "info")
            return "validation failed at " + path.join(".") + ": expected string 'info'";
        else
            return null; } function _307(object) { if (object !== "warn")
            return "validation failed at " + path.join(".") + ": expected string 'warn'";
        else
            return null; } function _309(object) { if (object !== "error")
            return "validation failed at " + path.join(".") + ": expected string 'error'";
        else
            return null; } function _311(object) { var conditions = [_303, _305, _307, _309]; for (const condition of conditions) {
            var error = condition(object);
            if (!error)
                return null;
        } return "validation failed at " + path.join(".") + ": there are no valid alternatives"; } function _boolean(object) { if (typeof object !== "boolean")
            return "validation failed at " + path.join(".") + ": expected a boolean";
        else
            return null; } function _302(object) { if (typeof object !== "object" || object === null || Array.isArray(object))
            return "validation failed at " + path.join(".") + ": expected an object"; {
            if ("downloadPriority" in object) {
                path.push("downloadPriority");
                var error = _number(object["downloadPriority"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("logLevel" in object) {
                path.push("logLevel");
                var error = _311(object["logLevel"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("cache" in object) {
                path.push("cache");
                var error = _boolean(object["cache"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("read" in object) {
                path.push("read");
                var error = _boolean(object["read"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("write" in object) {
                path.push("write");
                var error = _boolean(object["write"]);
                path.pop();
                if (error)
                    return error;
            }
        } return null; } function _301(object) { if (typeof object !== "object" || object === null || Array.isArray(object))
            return "validation failed at " + path.join(".") + ": expected an object"; for (const key of Object.keys(object)) {
            path.push(key);
            var error = _302(object[key]);
            path.pop();
            if (error)
                return error;
        } return null; } function _298(object) { if (typeof object !== "object" || object === null || Array.isArray(object))
            return "validation failed at " + path.join(".") + ": expected an object"; {
            if ("maxConcurrent" in object) {
                path.push("maxConcurrent");
                var error = _number(object["maxConcurrent"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("rateLimit" in object) {
                path.push("rateLimit");
                var error = _300(object["rateLimit"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("optionsEach" in object) {
                path.push("optionsEach");
                var error = _301(object["optionsEach"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("logLevel" in object) {
                path.push("logLevel");
                var error = _311(object["logLevel"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("cache" in object) {
                path.push("cache");
                var error = _boolean(object["cache"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("read" in object) {
                path.push("read");
                var error = _boolean(object["read"]);
                path.pop();
                if (error)
                    return error;
            }
        } {
            if ("write" in object) {
                path.push("write");
                var error = _boolean(object["write"]);
                path.pop();
                if (error)
                    return error;
            }
        } return null; } var error = _298(object); if (error)
            throw new Error(error);
        else
            return object; })(optionsInit);
    }
    catch (e) {
        throw new error_1.RuntimeTypeError(e.message);
    }
};
//# sourceMappingURL=assert.js.map