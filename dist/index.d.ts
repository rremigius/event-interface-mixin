export declare type Callback<E> = (event: E) => void;
export declare class Event<E> {
    data: E;
    constructor(data: E);
}
export declare type OnMethod = <E extends Event<T>, T>(event: EventClass<E, T>, callback: Callback<E>) => void;
export declare type FireMethod = <E extends Event<T>, T>(event: EventClass<E, T> | E, data?: T) => void;
export declare type OffMethod = OnMethod;
export interface EventInterfacer {
    on: OnMethod;
    off: OffMethod;
    fire: FireMethod;
}
export declare type EventClass<E extends Event<T>, T> = {
    new (...args: any[]): E;
};
export default class EventInterface {
    private listeners;
    /**
     * Subscribes an event listener to the given event.
     * @param {string} event
     * @param {Callback} callback
     */
    on<E extends Event<T>, T>(event: EventClass<E, T>, callback: Callback<E>): void;
    /**
     * Unsubscribes an event listener from the given event.
     * @param {string|EventClass} event
     * @param {Callback} callback
     */
    off<E extends Event<T>, T>(event: EventClass<E, T>, callback: Callback<E>): void;
    /**
     * Fies an event with the given data.
     * @param {EventClass|Event} event
     * @param {T} [data]
     */
    fire<E extends Event<T>, T>(event: EventClass<E, T> | E, data?: T): void;
    /**
     * Returns the `on` method of the event interface, e.g. to add to a class instance.
     */
    getOnMethod(): <E extends Event<T>, T>(event: EventClass<E, T>, callback: Callback<E>) => void;
    /**
     * Returns the `fire` method of the event interface, e.g. to add to a class instance.
     */
    getFireMethod(): <E extends Event<T>, T>(event: E | EventClass<E, T>, data?: T | undefined) => void;
    /**
     * Returns the `off` method of the event interface, e.g. to add to a class instance.
     */
    getOffMethod(): <E extends Event<T>, T>(event: EventClass<E, T>, callback: Callback<E>) => void;
}
