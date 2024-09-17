/**
 * A class that can listen to an event, and can remove itself from the event when it stops listening.
 */
export default class EventListener {
    event;
    callback;
    constructor(event, callback) {
        this.event = event;
        this.callback = callback;
    }
    start() {
        this.event.on(this.callback);
    }
    stop() {
        this.event.off(this.callback);
    }
}
