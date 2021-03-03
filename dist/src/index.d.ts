export declare type Callback<T> = (payload: T) => void;
export declare type EventDescription = {
    name?: string;
    payload?: any;
};
export declare type Payload<T extends Event<any>> = T['payload'];
export declare class Event<T> {
    payload: T;
    constructor(payload: T);
}
export declare type OnMethod = <T extends EventDescription>(event: string, callback: Callback<T['payload']>) => void;
export declare type FireMethod = <T extends EventDescription>(event: string, data?: T['payload']) => void;
export declare type OffMethod = OnMethod;
export default class EventInterface {
    private listeners;
    /**
     * Subscribes an event listener to the given event.
     * @param {string} event
     * @param {Callback} callback
     */
    on<T extends EventDescription>(event: string, callback: Callback<T['payload']>): void;
    /**
     * Unsubscribes an event listener from the given event.
     * @param {string} event
     * @param {Callback} callback
     */
    off<T extends EventDescription>(event: string, callback: Callback<T['payload']>): void;
    /**
     * Fies an event with the given data.
     * @param {string} event
     * @param {T['payload']>}data
     */
    fire<T extends EventDescription>(event: string, data?: T['payload']): void;
    /**
     * Returns the `on` method of the event interface, e.g. to add to a class instance.
     */
    getOnMethod(): <T extends EventDescription>(event: string, callback: Callback<T["payload"]>) => void;
    /**
     * Returns the `fire` method of the event interface, e.g. to add to a class instance.
     */
    getFireMethod(): <T extends EventDescription>(event: string, data?: T["payload"] | undefined) => void;
    /**
     * Returns the `off` method of the event interface, e.g. to add to a class instance.
     */
    getOffMethod(): <T extends EventDescription>(event: string, callback: Callback<T["payload"]>) => void;
}
