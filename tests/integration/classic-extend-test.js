import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { fillIn, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | @tracked with classic extend syntax', function(hooks) {
  setupRenderingTest(hooks);

  test('Mutating @tracked updates the template', async function(assert) {
    await render(hbs`
      <ClassicExtendTestComponent as |t|>
        <input id="updater" value={{t.testTracked}} {{on "change" t.update}}>
        <data id="subject">{{t.testTracked}}</data>
      </ClassicExtendTestComponent>
    `);
    await fillIn('#updater', 'test-content')
    assert.dom('#subject').hasText('test-content');
  });

  test('Mutating @tracked updates the template through a autotracked getter', async function(assert) {
    await render(hbs`
      <ClassicExtendTestComponent as |t|>
        <input id="updater" value={{t.testTracked}} {{on "change" t.update}}>
        <data id="subject">{{t.autotrackedGetter}}</data>
      </ClassicExtendTestComponent>
    `);
    await fillIn('#updater', 'test-content')
    assert.dom('#subject').hasText('autotrackedGetter|test-content');
  });

  test('Mutating @tracked updates the template through a computed property', async function(assert) {
    await render(hbs`
      <ClassicExtendTestComponent as |t|>
        <input id="updater" value={{t.testTracked}} {{on "change" t.update}}>
        <data id="subject">{{t.computedDependencyGetter}}</data>
      </ClassicExtendTestComponent>
    `);
    await fillIn('#updater', 'test-content')
    assert.dom('#subject').hasText('computedDependencyGetter|test-content');
  });

  test('Mutating @tracked updates the template through a dependentKeyCompat getter', async function(assert) {
    await render(hbs`
      <ClassicExtendTestComponent as |t|>
        <input id="updater" value={{t.testTracked}} {{on "change" t.update}}>
        <data id="subject">{{t.computedDependentKeyCompatGetter}}</data>
      </ClassicExtendTestComponent>
    `);
    await fillIn('#updater', 'test-content')
    assert.dom('#subject').hasText('computedDependentKeyCompatGetter|dependentKeyCompatGetter|test-content');
  });

});
