import {assert} from 'chai';
import EventInterface from "../src";

describe("EventInterface", () => {
	describe(".on and .fire", () => {
		it("accept Event class as event name", () => {
			class FooEvent { constructor(public number:number) {}}
			const eventInterface = new EventInterface();
			eventInterface.$event(FooEvent);

			let count = 0;
			eventInterface.$on(FooEvent, event => {
				assert.equal(event.number, 123);
				count++;
			});
			eventInterface.$fire(FooEvent, new FooEvent(123));
			assert.equal(count, 1, "Correct number of callbacks fired.");
		});
	});
	describe(".fire", () => {
		it("accepts Event instance as single argument (if .on was called with class)", () => {
			class FooEvent { constructor(public number:number) {}}
			const eventInterface = new EventInterface();
			eventInterface.$event(FooEvent);

			let count = 0;
			eventInterface.$on(FooEvent, (event:FooEvent)=>{
				assert.equal(event.number, 123);
				count++;
			});
			eventInterface.$fire(new FooEvent(123));
			assert.equal(count, 1, "Correct number of callbacks fired.");
		});
	});
	it("on, off and fire methods can be applied to a class", () => {
		class FooEvent { constructor(public from:number, public to:number) {}}

		class CarEvents extends EventInterface {
			foo = this.$event(FooEvent);
		}

		class Car {
			events = new CarEvents();
			on = this.events.$getOnMethod();
			off = this.events.$getOffMethod();
			fire = this.events.$getFireMethod();

			move() {
				this.fire(new FooEvent(123, 321));
			}
		}

		let car = new Car();
		car.on(FooEvent, event => {
			assert.equal(event.from, 123);
			assert.equal(event.to, 321);
		});
		car.move();
	});
	describe("with allowDynamicEvents: true", () => {
		it("accept string as event name (only in plain Javascript)", () => {
			const eventInterface = new EventInterface(true);
			eventInterface.$event('foo' as any);
			let count = 0;
			eventInterface.$on('foo' as any, (event:any)=>{
				assert.equal(event, 123);
				count++;
			});
			eventInterface.$fire('foo' as any, 123);
			assert.equal(count, 1, "Correct number of callbacks fired.");
		});
	})
});
