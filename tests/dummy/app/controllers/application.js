import Controller from '@ember/controller';
import { action, computed, observer } from '@ember/object'; // eslint-disable-line
import { autotrack, tracked, dependentKeyCompat } from 'ember-tracked-polyfill';

const ObserverEnabledController = Controller.extend({
  observerCallCount: 0,
  // eslint-disable-next-line
  testObserver: observer('testTracked', function() {
    this.set('observerCallCount', this.observerCallCount + 1);
  }),
});

export default class ApplicationController extends ObserverEnabledController {

  @tracked testTracked = 'FOOBAR';

  @dependentKeyCompat
  get fancy() {
    console.log('compute fancy');
    return `${this.testTracked}-autotrack-getter`;
  }

  @computed('testTracked')
  get computedFancy() {
    console.log('compute computedFancy');
    return `${this.testTracked}-computed-dependency`;
  }

  @autotrack
  get computedFancyCombined() {
    console.log('compute computedFancyCombined');
    return `${this.computedDependTest}-2`;
  }

  @computed('fancy')
  get computedDependTest() {
    console.log('compute computedDependTest');
    return `${this.fancy}-1`;
  }

  @action
  testIt() {
    this.testTracked = this.testTracked.startsWith('F') ? 'BARFOO' : 'FOOBAR';
  }
}
