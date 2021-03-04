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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const _ = __importStar(require("lodash"));
class Event {
    constructor(data) {
        this.data = data;
    }
}
exports.Event = Event;
class EventInterface {
    constructor() {
        this.listeners = new Map();
    }
    /**
     * Subscribes an event listener to the given event.
     * @param {string} event
     * @param {Callback} callback
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        // We just added it. We can assume it exists now.
        this.listeners.get(event).push(callback);
    }
    /**
     * Unsubscribes an event listener from the given event.
     * @param {string|EventConstructor} event
     * @param {Callback} callback
     */
    off(event, callback) {
        let listeners = this.listeners.get(event);
        if (!listeners)
            return;
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i] === callback) {
                listeners.splice(i, 1);
            }
        }
    }
    /**
     * Fies an event with the given data.
     * @param {EventConstructor|Event} event
     * @param {T} [data]
     */
    fire(event, data) {
        let finalData;
        if (event instanceof Event) {
            // Single-argument call
            finalData = event;
            event = (event.constructor);
        }
        else if (_.isFunction(event)) {
            // Using Event class as event identifier
            // TS: if it's a function, it can only mean it's an Event class
            finalData = new event(data);
        }
        else {
            // In Typescript, it should never come this far
            finalData = data;
        }
        const listeners = this.listeners.get(event);
        if (!listeners)
            return;
        for (let listener of listeners) {
            listener(finalData);
        }
    }
    /**
     * Returns the `on` method of the event interface, e.g. to add to a class instance.
     */
    getOnMethod() {
        return this.on.bind(this);
    }
    /**
     * Returns the `fire` method of the event interface, e.g. to add to a class instance.
     */
    getFireMethod() {
        return this.fire.bind(this);
    }
    /**
     * Returns the `off` method of the event interface, e.g. to add to a class instance.
     */
    getOffMethod() {
        return this.off.bind(this);
    }
}
exports.default = EventInterface;
