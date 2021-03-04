import * as _ from 'lodash';

export type Callback<E> = (event:E)=>void;

export class Event<E> {
	data:E;
	constructor(data:E) {
		this.data = data;
	}
}

export type OnMethod = <T,E extends Event<T>>(event:EventConstructor<T,E>, callback:Callback<E>)=>void;
export type FireMethod = <T,E extends Event<T>>(event:EventConstructor<T,E>|E, data?:T)=>void;
export type OffMethod = OnMethod;

export type EventConstructor<T, E extends Event<T>> = {
	new(...args: any[]): E;
};

export default class EventInterface {
	private listeners = new Map<EventConstructor<any,any>, Function[]>();

	/**
	 * Subscribes an event listener to the given event.
	 * @param {string} event
	 * @param {Callback} callback
	 */
	public on<T,E extends Event<T>>(event:EventConstructor<T,E>, callback:Callback<E>) {
		if(!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}

		// We just added it. We can assume it exists now.
		this.listeners.get(event)!.push(callback);
	}

	/**
	 * Unsubscribes an event listener from the given event.
	 * @param {string|EventConstructor} event
	 * @param {Callback} callback
	 */
	public off<T,E extends Event<T>>(event:EventConstructor<T,E>, callback:Callback<E>) {
		let listeners = this.listeners.get(event);
		if(!listeners) return;

		for(let i = listeners.length-1; i >= 0; i--) {
			if(listeners[i] === callback) {
				listeners.splice(i, 1);
			}
		}
	}

	/**
	 * Fies an event with the given data.
	 * @param {EventConstructor|Event} event
	 * @param {T} [data]
	 */
	public fire<T,E extends Event<T>>(event:EventConstructor<T,E>|E, data?:T) {
		let finalData:E;

		if(event instanceof Event) {
			// Single-argument call
			finalData = event;
			event = <EventConstructor<T,E>>(event.constructor);
		} else if (_.isFunction(event)) {
			// Using Event class as event identifier

			// TS: if it's a function, it can only mean it's an Event class
			finalData = new (<EventConstructor<T,E>>event)(data);
		} else {
			// In Typescript, it should never come this far
			finalData = <any>data;
		}
		const listeners = this.listeners.get(event);
		if(!listeners) return;

		for (let listener of listeners) {
			listener(finalData);
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
