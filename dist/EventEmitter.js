"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const validation_kit_1 = require("validation-kit");
const log_control_1 = __importDefault(require("log-control"));
const log = log_control_1.default.instance("event-emitter");
function getTypeName(type) {
    const className = _.get(type, 'constructor.name');
    if (className)
        return className;
    return typeof (type);
}
class EventEmitter {
    constructor(runtimeType) {
        this.listeners = [];
        this.type = runtimeType;
    }
    listenerCount() {
        return this.listeners.length;
    }
    /**
     * Registers the given callback to be executed on the event.
     * @param {Function} listener
     * @return A function to be called to stop listening.
     */
    on(listener) {
        this.listeners.push(listener);
        return () => this.off(listener);
    }
    off(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    fire(event) {
        if (this.type) {
            if (!this.isCorrectType(event)) {
                const message = `Incompatible payload. Expected '${_.get(this.type, 'name')}', received '${getTypeName(event)}'.`;
                log.error(message, event);
                throw new Error(message);
            }
        }
        // Copy in case any of the listeners unsubscribes themselves and modifies the array while we are iterating it
        const listeners = [...this.listeners];
        listeners.forEach(listener => {
            listener(event);
        });
    }
    isCorrectType(value) {
        switch (this.type) {
            case undefined: return true;
            case String: return _.isString(value);
            case Number: return _.isNumber(value);
            case Boolean: return _.isBoolean(value);
            case validation_kit_1.Alphanumeric: return validation_kit_1.isAlphanumeric(value);
            default: {
                if (validation_kit_1.isClass(this.type)) {
                    return value instanceof this.type;
                }
                // Should not happen.
                throw new Error("Cannot handle type.");
            }
        }
    }
}
exports.default = EventEmitter;
