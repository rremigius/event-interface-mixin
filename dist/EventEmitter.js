import * as _ from "lodash";
import { Alphanumeric, isAlphanumeric, isClass } from "validation-kit";
import Log from "log-control";
const log = Log.instance("event-emitter");
function getTypeName(type) {
    const className = _.get(type, 'constructor.name');
    if (className)
        return className;
    return typeof (type);
}
export default class EventEmitter {
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
            case Alphanumeric: return isAlphanumeric(value);
            default: {
                if (isClass(this.type)) {
                    return value instanceof this.type;
                }
                // Should not happen.
                throw new Error("Cannot handle type.");
            }
        }
    }
}
