import { Alphanumeric, Constructor } from "validation-kit";
export type TypeClass<T> = Constructor<T> | String | Number | Boolean | Alphanumeric;
export type callback<T> = (payload: T) => void;
export default class EventEmitter<T> {
    private listeners;
    type?: TypeClass<T>;
    constructor(runtimeType?: TypeClass<T>);
    listenerCount(): number;
    /**
     * Registers the given callback to be executed on the event.
     * @param {Function} listener
     * @return A function to be called to stop listening.
     */
    on(listener: callback<T>): () => void;
    off(listener: callback<T>): void;
    fire(event: T): void;
    private isCorrectType;
}
