import Handler from '../app/Handler';

export default class Template extends Handler {
  constructor() {
    super();
  }

  onState() {
    return false;
  }

  turnOff() { }

  turnOn() { }

  destroy() {
    super.destroy();
  }
}
