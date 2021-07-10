EventInterface mixin
===

EventInterface is a class that implements the basic event subscription and firing. It is made to become part of classes
and objects that need their own event interface, but which should be consistent throughout the code.

EventInterface has Typescript support, making it possible to fire and listen to strongly-typed events.

## Usage

### Basic usage

First the EventInterface needs some events registered. These can be any class. 
Then those events can be fired and listened to.

```javascript
class MyEvent {}
let events = new EventInterface();
events.$event(MyEvent); // register event class

events.on(MyEvent, event => { // event is a MyEvent
    // event.payload will be 123 (see below)
});
events.fire(MyEvent, 123);
events.fire(new MyEvent(123)); // equivalent
```

In Typescript, you can only use the class-based approach, to ensure the type-safety of events:

```typescript
class MyEvent extends Event<number> {}
let events = new EventInterface();
events.$event(MyEvent); // register event class

events.on(MyEvent, event => { // event is strongly-typed as a MyEvent
    // event.payload will be 123 (see below)
});
events.fire(MyEvent, 123); // will complain if 2nd argument is the wrong type
events.fire(new MyEvent(123)); // equivalent
```

In plain javascript, EventInterface can fire events called by name, with anything as payload.

```javascript
// create EventInterface with `allowDynamicEvents` parameter `true`, so it also accepts unregistered events
let events = new EventInterface(true); 
events.on('myEvent', event => {
    // event will be 123 (see below)
});
events.fire('myEvent', 123);
```

In TypeScript, listening and firing unregistered events is also possible, except the event parameter must be a class:
```typescript
let events = new EventInterface(true); 
events.on(MyEvent, event => {
    // event will be a MyEvent with number 123 (see below)
});
events.fire(new MyEvent(123));
```

### Integrate into classes

EventInterface provides a convenient integration with classes, allowing developers and their IDEs to easily understand
what events can be fired and listened to:

**Javascript**:

```javascript
class MoveEvent {
	constructor(from, to){
		this.from = from;
		this.to = to;
    }
}
class CarEvents extends EventInterface {
	constructor() {
		this.move = this.$event(MoveEvent);
    }
}
class Car {
	constructor() {
		this.events = new CarEvents();
	}

	move() {
		// (move logic)
		// ...
		this.events.move.fire(new MoveEvent(oldCoordinates, newCoordinates));
	}
}

let car = new Car();
car.events.move.on(event => {
	console.log(`Car moved from ${event.from} to ${event.to}.`);
});
```

**Typescript**:

```typescript
class MoveEvent extends Event<{from:Coordinates, to:Coordinates}>{}
class CarEvents extends EventInterface {
	move = this.$event(MoveEvent);
}

class Car {
	events = new CarEvents();
    
    move() {
        // (move logic)
        // ...
        this.events.move.fire(new MoveEvent({from: oldCoordinates, to: newCoordinates}));
    }
}

let car = new Car();
car.events.move.on((event:MoveEvent) => {
    console.log(`Car moved from ${event.payload.from} to ${event.payload.to}.`);
});
car.move();
```
