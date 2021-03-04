"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importStar(require("../src/index"));
const chai_1 = require("chai");
describe("EventInterface", () => {
    describe(".on and .fire", () => {
        it("accept Event class as event name", () => {
            class FooEvent extends index_1.Event {
            }
            const eventInterface = new index_1.default();
            let count = 0;
            eventInterface.on(FooEvent, event => {
                chai_1.assert.equal(event.data, 123);
                count++;
            });
            eventInterface.fire(FooEvent, 123);
            chai_1.assert.equal(count, 1, "Correct number of callbacks fired.");
        });
        it("accept string as event name (only in plain Javascript)", () => {
            const eventInterface = new index_1.default();
            let count = 0;
            eventInterface.on('foo', (event) => {
                chai_1.assert.equal(event, 123);
                count++;
            });
            eventInterface.fire('foo', 123);
            chai_1.assert.equal(count, 1, "Correct number of callbacks fired.");
        });
    });
    describe(".fire", () => {
        it("accepts Event instance as single argument (if .on was called with class)", () => {
            class FooEvent extends index_1.Event {
            }
            const eventInterface = new index_1.default();
            let count = 0;
            eventInterface.on(FooEvent, (event) => {
                chai_1.assert.equal(event.data, 123);
                count++;
            });
            eventInterface.fire(new FooEvent(123));
            chai_1.assert.equal(count, 1, "Correct number of callbacks fired.");
        });
    });
    it("on, off and fire methods can be applied to a class", () => {
        class MoveEvent extends index_1.Event {
        }
        class Car {
            constructor() {
                this.eventInterface = new index_1.default();
                this.on = this.eventInterface.getOnMethod();
                this.off = this.eventInterface.getOffMethod();
                this.fire = this.eventInterface.getFireMethod();
            }
            move() {
                this.fire(MoveEvent, { from: 123, to: 321 });
            }
        }
        let car = new Car();
        car.on(MoveEvent, (event) => {
            chai_1.assert.equal(event.data.from, 123);
            chai_1.assert.equal(event.data.to, 321);
        });
        car.move();
    });
});
