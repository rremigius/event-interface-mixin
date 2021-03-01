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
export default class EventInterface {
    private listeners;
    on<T extends EventDescription>(event: string, callback: Callback<T['payload']>): void;
    off<T extends EventDescription>(event: string, callback: Callback<T['payload']>): void;
    fire<T extends EventDescription>(event: string, data?: T['payload']): void;
    getOnMethod(): <T extends EventDescription>(event: string, callback: Callback<T["payload"]>) => void;
    getFireMethod(): <T extends EventDescription>(event: string, data?: T["payload"] | undefined) => void;
    getOffMethod(): <T extends EventDescription>(event: string, callback: Callback<T["payload"]>) => void;
}
