import EmberObject, { computed, observer } from '@ember/object'; // eslint-disable-line
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { tracked, autotrack, dependentKeyCompat } from 'ember-tracked-polyfill';
import { settled } from '@ember/test-helpers';

const ObserverSpy = EmberObject.extend({
  observerCallCount: 0,
  // eslint-disable-next-line
  testObserver: observer('testProperty', function() {
    this.set('observerCallCount', this.observerCallCount + 1);
  }),
});

module('Unit | @tracked with observables', function(hooks) {
  setupTest(hooks);

  test('Mutating @tracked triggers an observer', async function(assert) {
    class TestObject extends ObserverSpy {
      @tracked testProperty;
    }
    let subject = TestObject.create();
    subject.testProperty = 'foobar';
    await settled();
    assert.equal(subject.observerCallCount, 1);
  });

  test('Mutating @tracked triggers an observer through a autotracked getter', async function(assert) {
    class TestObject extends ObserverSpy {
      @tracked testTracked;
      @autotrack
      get testProperty() {
        return `${this.testTracked}-through-getter`;
      }
    }
    let subject = TestObject.create();
    subject.testProperty; // register via @autotrack
    subject.testTracked = 'foobar';
    await settled();
    assert.equal(subject.observerCallCount, 1);
  });

  test('Mutating @tracked triggers an observer through a computed property', async function(assert) {
    class TestObject extends ObserverSpy {
      @tracked testTracked;
      @computed('testTracked')
      get testProperty() {
        return `${this.testTracked}-through-computed`;
      }
    }
    let subject = TestObject.create();
    subject.testProperty; // register via @autotrack
    subject.testTracked = 'foobar';
    await settled();
    assert.equal(subject.observerCallCount, 1);
  });

  test('Mutating @tracked triggers an observer through a dependentKeyCompat getter', async function(assert) {
    class TestObject extends ObserverSpy {
      @tracked testTracked;
      @dependentKeyCompat
      get testDependentGetter() {
        return `${this.testTracked}-through-dependentKeyCompat-getter`;
      }
      @computed('testDependentGetter')
      get testProperty() {
        return `${this.testDependentGetter}-through-computed`;
      }
    }
    let subject = TestObject.create();
    subject.testProperty; // register via @autotrack
    subject.testTracked = 'foobar';
    await settled();
    assert.equal(subject.observerCallCount, 1);
  });

});
