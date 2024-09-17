import { Class, Constructor } from "validation-kit";
import EventEmitter from "./EventEmitter";
import { callback } from "./EventEmitter";
export type OnMethod = (EventClass: Constructor<unknown>, callback: callback<unknown>) => void;
export type OffMethod = (event: string | Class, callback: callback<unknown>) => void;
export type FireMethod = (event: any, payload?: unknown) => void;
export default class EventInterface {
    private readonly $allowDynamicEvents;
    private readonly $byName;
    static getEventName(event: string | Function): string;
    constructor(allowDynamicEvents?: boolean);
    /**
     * Creates an EventEmitter and registers it.
     * @param EventClass
     * @param name
     */
    $event<T>(EventClass: Constructor<T>, name?: string): EventEmitter<T>;
    /**
     * Registers an EventEmitter so it can be called by name.
     * @param event
     * @param name
     */
    $register<T>(event: EventEmitter<T>, name: string): EventEmitter<T>;
    /**
     * Listen to event based on a runtime-defined event.
     * If `allowDynamicEvents` is `true`, the event can be listened to even if it does not exist yet.
     * @param {string} EventClass
     * @param {callback} callback
     */
    $on<T>(EventClass: Constructor<T>, callback: callback<T>): void;
    /**
     * Stop listening to event based on a runtime-defined string.
     * @param EventClass
     * @param callback
     */
    $off<T>(EventClass: string | Constructor<T>, callback: callback<any>): void;
    /**
     * Remove given callbacks from all events.
     * @param callbacks
     */
    $offAll(callbacks: callback<any>[]): void;
    /**
     * Fire event based on a runtime-defined string.
     * @param event
     * @param payload
     */
    $fire<T extends object>(event: string | T | Constructor<T>, payload?: T): void;
    /**
     * Gets an event based on a runtime-defined string.
     * If the event is not predefined, and the Events instance allows dynamic events, it will create the event.
     * @param event
     */
    $get(event: string | Function): EventEmitter<unknown>;
    $getOnMethod(): <T>(EventClass: Constructor<T>, callback: callback<T>) => void;
    $getOffMethod(): <T>(EventClass: string | Constructor<T>, callback: callback<any>) => void;
    $getFireMethod(): <T extends object>(event: string | T | Constructor<T>, payload?: T | undefined) => void;
}
