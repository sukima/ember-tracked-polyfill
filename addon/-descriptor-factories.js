import { beginAutoTracking, endAutoTracking, trackedData } from './-tracking';

const CLASSIC_DECORATOR = Symbol('CLASSIC_DECORATOR');

function tracked(_, key, descriptor) {
  let { getter, setter } = trackedData(key, descriptor.initializer);
  return {
    enumerable: true,
    configurable: true,
    get() {
      return getter(this);
    },
    set(newValue) {
      setter(this, newValue);
    },
  };
}

function autotrack(_, key, descriptor) {
  let getter = descriptor.get;
  return {
    enumberable: true,
    configurable: true,
    get() {
      beginAutoTracking(this, key);
      try {
        return getter.call(this);
      } finally {
        endAutoTracking(this, key);
      }
    },
  };
}

function dependentKeyCompat(target, key, descriptor) {
  let { compatGetter } = trackedData(key, descriptor.get);
  return autotrack(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return compatGetter(this);
    },
  });
}

function descriptorFactoryFor(classicDecoratorDescriptor) {
  if (!(classicDecoratorDescriptor && classicDecoratorDescriptor[CLASSIC_DECORATOR])) {
    return;
  }
  let { [CLASSIC_DECORATOR]: decorator, ...decoratorDescriptor } = classicDecoratorDescriptor;
  return (target, key, descriptor) => {
    return decorator(target, key, { ...descriptor, ...decoratorDescriptor });
  };
}

function classicDecoratorFor(factoryFnRef, decoratorDescriptor) {
  return { [CLASSIC_DECORATOR]: factoryFnRef, ...decoratorDescriptor };
}

export {
  autotrack,
  classicDecoratorFor,
  descriptorFactoryFor,
  dependentKeyCompat,
  tracked,
};
