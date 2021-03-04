import EventInterface, {Event, FireMethod, OffMethod, OnMethod} from "../src/index";
import {assert} from 'chai';

describe("EventInterface", () => {
	describe(".on and .fire", () => {
		it("accept Event class as event name", () => {
			class FooEvent extends Event<number> {}
			const eventInterface = new EventInterface();
			let count = 0;
			eventInterface.on(FooEvent, event => {
				assert.equal(event.data, 123);
				count++;
			});
			eventInterface.fire(FooEvent, 123)
			assert.equal(count, 1, "Correct number of callbacks fired.");
		});
		it("accept string as event name (only in plain Javascript)", () => {
			const eventInterface = new EventInterface();
			let count = 0;
			eventInterface.on('foo' as any, (event:any)=>{
				assert.equal(event, 123);
				count++;
			});
			eventInterface.fire('foo' as any, 123);
			assert.equal(count, 1, "Correct number of callbacks fired.");
		});
	});
	describe(".fire", () => {
		it("accepts Event instance as single argument (if .on was called with class)", () => {
			class FooEvent extends Event<number> {}
			const eventInterface = new EventInterface();
			let count = 0;
			eventInterface.on(FooEvent, (event:FooEvent)=>{
				assert.equal(event.data, 123);
				count++;
			});
			eventInterface.fire(new FooEvent(123));
			assert.equal(count, 1, "Correct number of callbacks fired.");
		});
	});
	it("on, off and fire methods can be applied to a class", () => {
		class MoveEvent extends Event<{from:number, to:number}>{}

		class Car {
			on:OnMethod;
			off:OffMethod;
			fire:FireMethod;
			eventInterface:EventInterface;

			constructor() {
				this.eventInterface = new EventInterface();
				this.on = this.eventInterface.getOnMethod();
				this.off = this.eventInterface.getOffMethod();
				this.fire = this.eventInterface.getFireMethod();
			}

			move() {
				this.fire(MoveEvent, {from: 123, to: 321});
			}
		}

		let car = new Car();
		car.on(MoveEvent, (event:MoveEvent) => {
			assert.equal(event.data.from, 123);
			assert.equal(event.data.to, 321);
		});
		car.move();
	});
});
