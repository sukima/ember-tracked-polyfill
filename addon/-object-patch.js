import EmberObject from '@ember/object';
import { autotrack } from './-descriptor-factories';

export function patchAutotrackObjectGetters() {
  EmberObject.reopen({
    init() {
      this._super(...arguments);
      for (let el of Object.getOwnPropertyNames(this.constructor.prototype)) {
        let desc = Object.getOwnPropertyDescriptor(this.constructor.prototype, el);
        if (desc.get?.name.startsWith('get ')) {
          Object.defineProperty(this, el, autotrack(this, el, desc))
        }
      }
    }
  });
}
