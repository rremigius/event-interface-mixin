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
const EventEmitter_1 = __importDefault(require("./EventEmitter"));
const log_1 = __importDefault(require("./log"));
class EventInterface {
    constructor(allowDynamicEvents = false) {
        this.$byName = {};
        this.$allowDynamicEvents = allowDynamicEvents;
    }
    static getEventName(event) {
        if (_.isFunction(event)) {
            return event.name;
        }
        return event;
    }
    /**
     * Creates an EventEmitter and registers it.
     * @param EventClass
     * @param name
     */
    $event(EventClass, name) {
        if (!name) {
            name = EventClass.name;
        }
        const event = new EventEmitter_1.default(EventClass);
        return this.$register(event, name);
    }
    /**
     * Registers an EventEmitter so it can be called by name.
     * @param event
     * @param name
     */
    $register(event, name) {
        // Register new
        if (!(name in this.$byName)) {
            this.$byName[name] = event;
            return event;
        }
        // Update existing
        const existing = this.$byName[name];
        if (!existing.type && event.type) {
            existing.type = event.type;
        }
        return event;
    }
    /**
     * Listen to event based on a runtime-defined event.
     * If `allowDynamicEvents` is `true`, the event can be listened to even if it does not exist yet.
     * @param {string} EventClass
     * @param {callback} callback
     */
    $on(EventClass, callback) {
        const eventEmitter = this.$get(EventClass);
        eventEmitter.on(event => {
            if (validation_kit_1.isClass(EventClass) && !(event instanceof EventClass)) {
                log_1.default.error(`Expected '${EventClass.name}', but got:`, event);
                throw new Error(`Expected '${EventClass.name}'.`);
            }
            callback(event);
        });
    }
    /**
     * Stop listening to event based on a runtime-defined string.
     * @param EventClass
     * @param callback
     */
    $off(EventClass, callback) {
        const event = this.$get(EventClass);
        event.off(callback);
    }
    /**
     * Fire event based on a runtime-defined string.
     * @param event
     * @param payload
     */
    $fire(event, payload) {
        let eventEmitter;
        // Event name with payload
        if (_.isString(event) || validation_kit_1.isClass(event)) {
            eventEmitter = this.$get(event);
            eventEmitter.fire(payload);
            return;
        }
        // Single-argument event firing
        eventEmitter = this.$get(event.constructor);
        eventEmitter.fire(event);
        return;
    }
    /**
     * Gets an event based on a runtime-defined string.
     * If the event is not predefined, and the Events instance allows dynamic events, it will create the event.
     * @param event
     */
    $get(event) {
        event = EventInterface.getEventName(event);
        if (!(event in this.$byName)) {
            if (!this.$allowDynamicEvents) {
                throw new Error(`Unknown event '${event}'.`);
            }
            // Define event on the fly
            this.$byName[event] = new EventEmitter_1.default();
        }
        return this.$byName[event];
    }
    $getOnMethod() {
        return this.$on.bind(this);
    }
    $getOffMethod() {
        return this.$off.bind(this);
    }
    $getFireMethod() {
        return this.$fire.bind(this);
    }
}
exports.default = EventInterface;
