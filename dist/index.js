"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor(payload) {
        this.payload = payload;
    }
}
exports.Event = Event;
class EventInterface {
    constructor() {
        this.listeners = {};
    }
    /**
     * Subscribes an event listener to the given event.
     * @param {string} event
     * @param {Callback} callback
     */
    on(event, callback) {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push({ callback });
    }
    /**
     * Unsubscribes an event listener from the given event.
     * @param {string} event
     * @param {Callback} callback
     */
    off(event, callback) {
        if (!(event in this.listeners))
            return;
        let listeners = this.listeners[event];
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i].callback === callback) {
                listeners.splice(i, 1);
            }
        }
    }
    /**
     * Fies an event with the given data.
     * @param {string} event
     * @param {T['payload']>}data
     */
    fire(event, data) {
        if (!(event in this.listeners)) {
            return;
        }
        for (let listener of this.listeners[event]) {
            listener.callback(data);
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
