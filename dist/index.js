"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = exports.EventEmitter = void 0;
const EventInterface_1 = __importDefault(require("./EventInterface"));
const EventEmitter_1 = __importDefault(require("./EventEmitter"));
exports.EventEmitter = EventEmitter_1.default;
const EventListener_1 = __importDefault(require("./EventListener"));
exports.EventListener = EventListener_1.default;
exports.default = EventInterface_1.default;
