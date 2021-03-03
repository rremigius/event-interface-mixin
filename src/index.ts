export type Callback<T> = (payload:T)=>void;
export type EventDescription = {
	name?:string,
	payload?: any
}

export type Payload<T extends Event<any>> = T['payload'];

export class Event<T> {
	payload:T;
	constructor(payload:T) {
		this.payload = payload;
	}
}

export type OnMethod = <T extends EventDescription>(event:string, callback:Callback<T['payload']>)=>void;
export type FireMethod = <T extends EventDescription>(event:string, data?:T['payload'])=>void;
export type OffMethod = OnMethod;

export default class EventInterface {
	private listeners:{
		[key: string]: { callback:Function }[]
	} = {};

	/**
	 * Subscribes an event listener to the given event.
	 * @param {string} event
	 * @param {Callback} callback
	 */
	public on<T extends EventDescription>(event:string, callback:Callback<T['payload']>) {
		if (!(event in this.listeners)) {
			this.listeners[event] = [];
		}

		this.listeners[event].push({callback});
	}

	/**
	 * Unsubscribes an event listener from the given event.
	 * @param {string} event
	 * @param {Callback} callback
	 */
	public off<T extends EventDescription>(event:string, callback:Callback<T['payload']>) {
		if(!(event in this.listeners)) return;
		let listeners = this.listeners[event];

		for(let i = listeners.length-1; i >= 0; i--) {
			if(listeners[i].callback === callback) {
				listeners.splice(i, 1);
			}
		}
	}

	/**
	 * Fies an event with the given data.
	 * @param {string} event
	 * @param {T['payload']>}data
	 */
	public fire<T extends EventDescription>(event:string, data?:T['payload']) {
		if (!(event in this.listeners)) {
			return;
		}

		for (let listener of this.listeners[event]) {
			listener.callback(data);
		}
	}

	/**
	 * Returns the `on` method of the event interface, e.g. to add to a class instance.
	 */
	public getOnMethod() {
		return this.on.bind(this);
	}

	/**
	 * Returns the `fire` method of the event interface, e.g. to add to a class instance.
	 */
	public getFireMethod() {
		return this.fire.bind(this);
	}

	/**
	 * Returns the `off` method of the event interface, e.g. to add to a class instance.
	 */
	public getOffMethod() {
		return this.off.bind(this);
	}
}
