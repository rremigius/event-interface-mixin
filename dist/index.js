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
    on(event, callback) {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push({ callback });
    }
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
    fire(event, data) {
        if (!(event in this.listeners)) {
            return;
        }
        for (let listener of this.listeners[event]) {
            listener.callback(data);
        }
    }
    getOnMethod() {
        return this.on.bind(this);
    }
    getFireMethod() {
        return this.fire.bind(this);
    }
    getOffMethod() {
        return this.off.bind(this);
    }
}
exports.default = EventInterface;
