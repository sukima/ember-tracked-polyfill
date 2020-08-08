ember-tracked-polyfill
==============================================================================

Do you…

* …feel stuck behind the times?
* …long for fancy new toys like `@tracked`?
* …wish you could switch your mental model long before your app is ready to upgrade?

Then, do I have the best snake-oil that you **must** try!

This is an attempt to bring the `@tracked` semantics we use in Octane to lower version Ember app which for whatever reason have not been able to upgrade to Ember 3.14+ yet.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.1 or above and *less than 3.14*
* Ember CLI v2.13 or above
* Node.js v10 or above

**ℹ︎ NOTE** This addon is pointless with Ember version 3.14+ Remove it when you upgrade.


Installation
------------------------------------------------------------------------------

```
ember install ember-tracked-polyfill
```


Usage
------------------------------------------------------------------------------

This addon _mimics_ Ember's new Octane `@tracked` feature by exposing the new mental model in the same way `@glimmer/tracking` does. It is the hope that it will be a drop in replacement in that —

```js
import { tracked } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';
```

Can be used with this addon like so —

```js
import { tracked, dependentKeyCompat } from 'ember-tracked-polyfill';
```

This works by wrapping properties in a custom tracked decorator which knows how to track mutations. It then can announce to the legacy Ember dirty notifications system so that template code and computed dependency can be recalculated. It also include auto-tracking in that native getters can also tap into the same dirty notification system so that template code that uses a native getter can also know to recalculate when tracked properties mutate.

```js
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { tracked, dependentKeyCompat } from 'ember-tracked-polyfill';

export default MyComponent extends Component {

  @tracked mutableProperty = 1;

  get autotrackingGetter() {
    reurn this.mutableProperty + '-autotrackingGetter';
  }

  @computed('mutableProperty')
  get classicComputed() {
    reurn this.mutableProperty + '-classicComputed';
  }

  @dependentKeyCompat
  get vanillaGetterUsedInComputedDeps() {
    reurn this.mutableProperty + '-vanillaGetterUsedInComputedDeps';
  }

  @computed('vanillaGetterUsedInComputedDeps')
  get classicComputedWithGetterAsDependentKey() {
    reurn this.vanillaGetterUsedInComputedDeps + '-classicComputedWithGetterAsDependentKey';
  }

  @action
  mutateTheProperty() {
    this.mutableProperty = this.mutableProperty + 1;
  }

}
```


### Configuration

Because this polyfill lives at the EmberObject level and _not_ in the Glimmer-VM it requires every getter to be wrapped to take advantage of the autotracking system. By default the `ember-tracked-polyfill.autotracking` is true. Which means it will patch EmberObject for you.

If however, one wishes to avoid this it can be turned off by adding the following to your apps'/addons' `ember-cli-build.js`:

```js
let app = new EmberApp(defaults, {
  'ember-tracked-polyfill': {
    autotracking: false
  }
});
```

This will then require you to *opt-in* to autotracking by means of the `@autotrack` decorator.

```js
import { tracked, autotrack } from 'ember-tracked-polyfill';

export default MyComponent extends Component {
  @tracked foo;

  @autotrack
  get bar() {
    return this.foo;
  }
}
```

### Classic syntax

These decorators can be used in classic syntax if needed.

```js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { tracked } from 'ember-tracked-polyfill';

export default Component.extends({

  mutableProperty: tracked(1),

  get autotrackingGetter() {
    reurn this.mutableProperty + '-autotrackingGetter';
  },

  classicComputed: computed('mutableProperty', function() {
    reurn this.mutableProperty + '-classicComputed';
  }),

  actions: {
    mutateTheProperty() {
      this.mutableProperty = this.mutableProperty + 1;
    }
  }

});
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
