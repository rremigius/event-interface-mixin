EventInterface mixin
===

EventInterface is a class that implements the basic event subscription and firing. It is made to become part of classes
and objects that need their own event interface, but which should be consistent throughout the code.

EventInterface has Typescript support, making it possible to fire and listen to strongly-typed events.

## Usage

### Basic usage

In plain javascript, EventInterface can fire events called by name, with anything as payload.

```javascript
let eventInterface = new EventInterface();
eventInterface.on('myEvent', event => {
    // event will be 123 (see below)
});
eventInterface.fire('myEvent', 123);
```
You can also use Event classes:

```javascript
class MyEvent extends Event {}
let eventInterface = new EventInterface();
eventInterface.on(MyEvent, event => { // event is a MyEvent
    // event.payload will be 123 (see below)
});
eventInterface.fire(MyEvent, 123);
eventInterface.fire(new MyEvent(123)); // equivalent
```

In Typescript, you can only use the class-based approach, to ensure the type-safety of events:

```typescript
class MyEvent extends Event<number> {}
let eventInterface = new EventInterface();
eventInterface.on(MyEvent, event => { // event is strongly-typed as a MyEvent
    // event.payload will be 123 (see below)
});
eventInterface.fire(MyEvent, 123); // will complain if 2nd argument is the wrong type
eventInterface.fire(new MyEvent(123)); // equivalent
```

### Integrate into class

EventInterface can be easily integrated into a class, to provide it with `on`, `off`, and `fire` methods.

**Javascript**:

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

**Typescript**:

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
        this.fire(new MoveEvent({from: oldCoordinates, to: newCoordinates}));
    }
}

let car = new Car();
car.on(MoveEvent, (event:MoveEvent) => {
    console.log(`Car moved from ${event.payload.from} to ${event.payload.to}.`);
});
car.move();
```
