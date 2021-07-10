import { Alphanumeric, Constructor } from "validation-kit";
export declare type TypeClass<T> = Constructor<T> | String | Number | Boolean | Alphanumeric;
export declare type callback<T> = (payload: T) => void;
export default class EventEmitter<T> {
    private listeners;
    type?: TypeClass<T>;
    constructor(runtimeType?: TypeClass<T>);
    listenerCount(): number;
    on(listener: callback<T>): callback<T>;
    off(listener: callback<T>): void;
    fire(event: T): void;
    private isCorrectType;
}
