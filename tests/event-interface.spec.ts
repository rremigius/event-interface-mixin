import EventInterface, {Event, FireMethod, OffMethod, OnMethod} from "../src/index";
import {assert} from 'chai';

describe("EventInterface", () => {
	it(".on registers a listener to be called with .fire", () => {
		const eventInterface = new EventInterface();
		let count = 0;
		eventInterface.on('foo', (event)=>{
			assert.equal(event, 123);
			count++;
		});
		eventInterface.fire('foo', 123);
		assert.equal(count, 1, "Correct number of callbacks fired.");
	});
	it(".on an .fire are strongly typed using the Event class (typescript)", () => {
		class FooEvent extends Event<number> {}
		const eventInterface = new EventInterface();
		let count = 0;
		eventInterface.on<FooEvent>(FooEvent.name, (value:number) => {
			assert.equal(value, 123);
			count++;
		});
		eventInterface.fire<FooEvent>(FooEvent.name, 123);
		assert.equal(count, 1, "Correct number of callbacks fired.");
	});
	it("methods can be applied to a class", () => {
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
				this.fire<MoveEvent>(MoveEvent.name, {from: 123, to: 321});
			}
		}

		let car = new Car();
		car.on<MoveEvent>(MoveEvent.name, (event:{from:number, to:number}) => {
			assert.equal(event.from, 123);
			assert.equal(event.to, 321);
		});
		car.move();
	});
});
