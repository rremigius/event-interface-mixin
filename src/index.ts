'use strict';

export default class EventInterface {
	private listeners:{
		[key: string]: { callback:Function }[]
	} = {};

	public on(event:string, callback:Function) {
		if (!(event in this.listeners)) {
			this.listeners[event] = [];
		}

		this.listeners[event].push({callback});
	}

	public off(event:string, callback:Function) {
		if(!(event in this.listeners)) return;
		let listeners = this.listeners[event];

		for(let i = listeners.length-1; i >= 0; i--) {
			if(listeners[i].callback === callback) {
				listeners.splice(i, 1);
			}
		}
	}

	public fire(event:string, data:unknown) {
		if (!(event in this.listeners)) {
			return;
		}

		for (let listener of this.listeners[event]) {
			listener.callback(data);
		}
	}

	public getOnMethod() {
		return this.on.bind(this);
	}

	public getFireMethod() {
		return this.fire.bind(this);
	}

	public getOffMethod() {
		return this.off.bind(this);
	}
}
