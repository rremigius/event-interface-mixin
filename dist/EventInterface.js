import * as _ from "lodash";
import { isClass } from "validation-kit";
import EventEmitter from "./EventEmitter";
import log from "./log";
export default class EventInterface {
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
        const event = new EventEmitter(EventClass);
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
            if (isClass(EventClass) && !(event instanceof EventClass)) {
                log.error(`Expected '${EventClass.name}', but got:`, event);
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
     * Remove given callbacks from all events.
     * @param callbacks
     */
    $offAll(callbacks) {
        for (let callback of callbacks) {
            for (let name in this.$byName) {
                const event = this.$byName[name];
                event.off(callback);
            }
        }
    }
    /**
     * Fire event based on a runtime-defined string.
     * @param event
     * @param payload
     */
    $fire(event, payload) {
        let eventEmitter;
        // Event name with payload
        if (_.isString(event) || isClass(event)) {
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
            this.$byName[event] = new EventEmitter();
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
