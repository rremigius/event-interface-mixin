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
    it(".on registers a listener to be called with .fire", () => {
        const eventInterface = new index_1.default();
        let count = 0;
        eventInterface.on('foo', (event) => {
            chai_1.assert.equal(event, 123);
            count++;
        });
        eventInterface.fire('foo', 123);
        chai_1.assert.equal(count, 1, "Correct number of callbacks fired.");
    });
    it(".on an .fire are strongly typed using the Event class (typescript)", () => {
        class FooEvent extends index_1.Event {
        }
        const eventInterface = new index_1.default();
        let count = 0;
        eventInterface.on(FooEvent.name, (value) => {
            chai_1.assert.equal(value, 123);
            count++;
        });
        eventInterface.fire(FooEvent.name, 123);
        chai_1.assert.equal(count, 1, "Correct number of callbacks fired.");
    });
    it("methods can be applied to a class", () => {
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
                this.fire(MoveEvent.name, { from: 123, to: 321 });
            }
        }
        let car = new Car();
        car.on(MoveEvent.name, (event) => {
            chai_1.assert.equal(event.from, 123);
            chai_1.assert.equal(event.to, 321);
        });
        car.move();
    });
});
