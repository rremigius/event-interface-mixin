EventInterface mixin
===

EventInterface is a class that implements the basic event subscription and firing. It is made to become part of classes
and objects that need their own event interface, but which should be consistent throughout the code.

EventInterface has Typescript support, making it possible to fire and listen to strongly-typed events.

## Usage

### Basic usage

```javascript
let eventInterface = new EventInterface();
eventInterface.on('myEvent', event => {
    // event will be 123 (see below)
});
eventInterface.fire('myEvent', 123);
```

### Integrate into class

EventInterface can be easily integrated into a class, to provide it with `on`, `off`, and `fire` methods.

```javascript
class Car {
    constructor() {
        this.eventInterface = new EventInterface();
        this.on = this.eventInterface.getOnMethod();
        this.off = this.eventInterface.getOffMethod();
        this.fire = this.eventInterface.getFireMethod();
    }
    move() {
        // (move logic)
        // ...
        this.fire('move', {from: oldCoordinates, to: newCoordinates});
    }
}
let car = new Car();
car.on('move', event => {
    console.log(`Car moved from ${event.from} to ${event.to}.`);
});
```
### Typescript

Event though EventInterface allows events to be fired and subscribed to on the fly without prior definition, 
it does allow type-safe handling of events when using Typescript:

```typescript
class FooEvent extends Event<number> {} // Define an Event class

const eventInterface = new EventInterface();

// Use event class both as dynamic type and its name as the event
eventInterface.on<FooEvent>(FooEvent.name, (value:number) => {
    // Typescript will complain if callback does not accept a number
});
// Typescript will complain if the event is not a number
eventInterface.fire<FooEvent>(FooEvent.name, 123);
```

Class definitions:

```typescript
class MoveEvent extends Event<{from:Coordinates, to:Coordinates}>{}

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
        // (move logic)
        // ...
        this.fire<MoveEvent>(MoveEvent.name, {from: oldCoordinates, to: newCoordinates});
    }
}

let car = new Car();
car.on<MoveEvent>(MoveEvent.name, (event:{from:Coordinates, to:Coordinates}) => {
    console.log(`Car moved from ${event.from} to ${event.to}.`);
});
car.move();
```
