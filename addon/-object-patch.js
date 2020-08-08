import EmberObject from '@ember/object';
import { autotrack, descriptorFactoryFor } from './-descriptor-factories';
import { AUTOTRACKING_FEATURE_ENABLED } from './-feature-flags';

export function patchObjectGetters() {
  EmberObject.reopen({
    init() {
      this._super(...arguments);
      for (let el of Object.getOwnPropertyNames(this.constructor.prototype)) {
        let desc = Object.getOwnPropertyDescriptor(this.constructor.prototype, el);
        if (AUTOTRACKING_FEATURE_ENABLED && desc.get && desc.get.name.startsWith('get ')) {
          Object.defineProperty(this, el, autotrack(this, el, desc))
        } else {
          let descriptorFactory = descriptorFactoryFor(desc.value);
          if (descriptorFactory) {
            Object.defineProperty(this, el, descriptorFactory(this, el, desc))
          }
        }
      }
    }
  });
}
