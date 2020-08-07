import { beginAutoTracking, endAutoTracking, trackedData } from './-tracking';

function tracked(_, key, descriptor) {
  let { getter, setter } = trackedData(key, descriptor?.initializer);
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
    ...descriptor,
    enumerable: true,
    configurable: true,
    get() {
      return compatGetter(this);
    },
  });
}

export {
  autotrack,
  dependentKeyCompat,
  tracked,
};
