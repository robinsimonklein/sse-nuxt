import EventEmitter from "node:events";

export type Message = { text: string , date: Date }

export const eventEmitter = new EventEmitter()