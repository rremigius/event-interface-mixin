export default class EventInterface {
    private listeners;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    fire(event: string, data: unknown): void;
    getOnMethod(): (event: string, callback: Function) => void;
    getFireMethod(): (event: string, data: unknown) => void;
    getOffMethod(): (event: string, callback: Function) => void;
}
