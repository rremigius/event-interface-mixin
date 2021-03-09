export declare type Callback<E> = (event: E) => void;
export declare class Event<E> {
    data: E;
    constructor(data: E);
}
export declare type OnMethod = <T, E extends Event<T>>(event: EventConstructor<T, E>, callback: Callback<E>) => void;
export declare type FireMethod = <T, E extends Event<T>>(event: EventConstructor<T, E> | E, data?: T) => void;
export declare type OffMethod = OnMethod;
export declare type EventConstructor<T, E extends Event<T>> = {
    new (...args: any[]): E;
};
export default class EventInterface {
    private listeners;
    /**
     * Subscribes an event listener to the given event.
     * @param {string} event
     * @param {Callback} callback
     */
    on<T, E extends Event<T>>(event: EventConstructor<T, E>, callback: Callback<E>): void;
    /**
     * Unsubscribes an event listener from the given event.
     * @param {string|EventConstructor} event
     * @param {Callback} callback
     */
    off<T, E extends Event<T>>(event: EventConstructor<T, E>, callback: Callback<E>): void;
    /**
     * Fies an event with the given data.
     * @param {EventConstructor|Event} event
     * @param {T} [data]
     */
    fire<T, E extends Event<T>>(event: EventConstructor<T, E> | E, data?: T): void;
    /**
     * Returns the `on` method of the event interface, e.g. to add to a class instance.
     */
    getOnMethod(): <T, E extends Event<T>>(event: EventConstructor<T, E>, callback: Callback<E>) => void;
    /**
     * Returns the `fire` method of the event interface, e.g. to add to a class instance.
     */
    getFireMethod(): <T, E extends Event<T>>(event: E | EventConstructor<T, E>, data?: T | undefined) => void;
    /**
     * Returns the `off` method of the event interface, e.g. to add to a class instance.
     */
    getOffMethod(): <T, E extends Event<T>>(event: EventConstructor<T, E>, callback: Callback<E>) => void;
}
