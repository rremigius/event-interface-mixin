import * as _ from "lodash";
import {Class, Constructor, isClass} from "validation-kit";
import EventEmitter from "./EventEmitter";
import {callback} from "./EventEmitter";

import log from "./log";

export type OnMethod = (EventClass: Constructor<unknown>, callback: callback<unknown>) => void
export type OffMethod = (event: string | Class, callback: callback<unknown>) => void;
export type FireMethod = (event: any, payload?: unknown) => void

export default class EventInterface {
	private readonly $allowDynamicEvents:boolean;
	private readonly $byName:Record<string,EventEmitter<unknown>> = {};

	static getEventName(event:string|Function) {
		if(_.isFunction(event)) {
			return event.name;
		}
		return event as string;
	}

	constructor(allowDynamicEvents:boolean = false) {
		this.$allowDynamicEvents = allowDynamicEvents;
	}

	/**
	 * Creates an EventEmitter and registers it.
	 * @param EventClass
	 * @param name
	 */
	$event<T>(EventClass:Constructor<T>, name?:string):EventEmitter<T> {
		if(!name) {
			name = EventClass.name;
		}
		const event = new EventEmitter<T>(EventClass);
		return this.$register(event, name);
	}

	/**
	 * Registers an EventEmitter so it can be called by name.
	 * @param event
	 * @param name
	 */
	$register<T>(event:EventEmitter<T>, name:string):EventEmitter<T> {
		// Register new
		if(!(name in this.$byName)) {
			this.$byName[name] = <EventEmitter<unknown>>event;
			return event;
		}
		// Update existing
		const existing = this.$byName[name];
		if(!existing.type && event.type) {
			existing.type = event.type;
		}
		return event;
	}

	/**
	 * Listen to event based on a runtime-defined event.
	 * If `allowDynamicEvents` is `true`, the event can be listened to even if it does not exist yet.
	 * @param {string} EventClass
	 * @param {callback} callback
	 */
	$on<T>(EventClass:Constructor<T>, callback:callback<T>) {
		const eventEmitter = this.$get(EventClass);
		eventEmitter.on(event => {
			if(isClass(EventClass) && !(event instanceof EventClass)) {
				log.error(`Expected '${EventClass.name}', but got:`, event);
				throw new Error(`Expected '${EventClass.name}'.`);
			}
			callback(event as T);
		});
	}

	/**
	 * Stop listening to event based on a runtime-defined string.
	 * @param EventClass
	 * @param callback
	 */
	$off<T>(EventClass:string|Constructor<T>, callback:callback<any>) {
		const event = this.$get(EventClass);
		event.off(callback);
	}

	/**
	 * Fire event based on a runtime-defined string.
	 * @param event
	 * @param payload
	 */
	$fire<T extends object>(event:string|T|Constructor<T>, payload?:T) {
		let eventEmitter:EventEmitter<any>;

		// Event name with payload
		if(_.isString(event) || isClass(event)) {
			eventEmitter = this.$get(event);
			eventEmitter.fire(payload);
			return;
		}

		// Single-argument event firing
		eventEmitter = this.$get(event.constructor);
		eventEmitter.fire(event);
		return;
	}

	/**
	 * Gets an event based on a runtime-defined string.
	 * If the event is not predefined, and the Events instance allows dynamic events, it will create the event.
	 * @param event
	 */
	$get(event:string|Function):EventEmitter<unknown> {
		event = EventInterface.getEventName(event);
		if(!(event in this.$byName)) {
			if (!this.$allowDynamicEvents) {
				throw new Error(`Unknown event '${event}'.`);
			}
			// Define event on the fly
			this.$byName[event] = new EventEmitter();
		}

		return this.$byName[event];
	}

	$getOnMethod() {
		return this.$on.bind(this);
	}

	$getOffMethod() {
		return this.$off.bind(this);
	}

	$getFireMethod() {
		return this.$fire.bind(this);
	}
}
