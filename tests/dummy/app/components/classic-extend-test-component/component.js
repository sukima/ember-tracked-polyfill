import Component from '@ember/component';
import { autotrack, tracked, dependentKeyCompat } from 'ember-tracked-polyfill';
import { action, computed } from '@ember/object';

export default Component.extend({

  testTracked: tracked('HAS_NOT_UPDATED_YET'),

  autotrackedGetter: autotrack(function() {
    return `autotrackedGetter|${this.testTracked}`;
  }),

  computedDependencyGetter: computed('testTracked', function() {
    return `computedDependencyGetter|${this.testTracked}`;
  }),

  dependentKeyCompatGetter: dependentKeyCompat(function() {
    return `dependentKeyCompatGetter|${this.testTracked}`;
  }),

  computedDependentKeyCompatGetter: computed('dependentKeyCompatGetter', function() {
    return `computedDependentKeyCompatGetter|${this.dependentKeyCompatGetter}`;
  }),

  actions: {
    update(value) {
      this.testTracked = value;
    },
  },

});
