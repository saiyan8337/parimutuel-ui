import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();

const Emitter = {
  on: (event: string, fn: (data: any) => void) => eventEmitter.on(event, fn), // eslint-disable-line
  once: (event: string, fn: (data: any) => void) => eventEmitter.once(event, fn), // eslint-disable-line
  off: (event: string, fn: (data: any) => void) => eventEmitter.off(event, fn), // eslint-disable-line
  emit: (event: string, payload: any) => eventEmitter.emit(event, payload), // eslint-disable-line
};

Object.freeze(Emitter);

export default Emitter;
