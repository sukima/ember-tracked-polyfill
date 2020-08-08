import Component from '@ember/component';
import { autotrack, tracked, dependentKeyCompat } from 'ember-tracked-polyfill';
import { action, computed } from '@ember/object';

export default class NativeClassTestComponent extends Component {

  @tracked testTracked = 'HAS_NOT_UPDATED_YET';

  @autotrack
  get autotrackedGetter() {
    return `autotrackedGetter|${this.testTracked}`;
  }

  @computed('testTracked')
  get computedDependencyGetter() {
    return `computedDependencyGetter|${this.testTracked}`;
  }

  @dependentKeyCompat
  get dependentKeyCompatGetter() {
    return `dependentKeyCompatGetter|${this.testTracked}`;
  }

  @computed('dependentKeyCompatGetter')
  get computedDependentKeyCompatGetter() {
    return `computedDependentKeyCompatGetter|${this.dependentKeyCompatGetter}`;
  }

  @action
  update({ target: { value } }) {
    this.testTracked = value;
  }

}
