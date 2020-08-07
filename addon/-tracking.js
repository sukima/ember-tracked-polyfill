import { notifyPropertyChange } from '@ember/object';

const currentAutoTrackings = [];

function trackedData(key, initializer) {
  let values = new WeakMap();
  let autoTrackingData = new WeakMap();
  let hasInitializer = typeof initializer === 'function';

  function notify(self, property) {
    notifyPropertyChange(self, property);
  }

  function consumeTracking(self) {
    for (let [currentTarget, currentProperty] of currentAutoTrackings) {
      let data = autoTrackingData.get(self) ?? new Map();
      let trackedProperties = data.get(currentTarget) ?? new Set();
      trackedProperties.add(currentProperty);
      data.set(currentTarget, trackedProperties);
      autoTrackingData.set(self, data);
    }
  }

  function notifyAutoTracked(self) {
    if (!autoTrackingData.has(self)) { return; }
    for (let [target, properties] of autoTrackingData.get(self)) {
      for (let property of properties) {
        notify(target, property);
      }
    }
  }

  function cleanupAutoTracked(self) {
    autoTrackingData.get(self)?.clear();
  }

  function getter(self) {
    let value;
    consumeTracking(self);
    if (hasInitializer && !values.has(self)) {
      value = initializer.call(self);
      values.set(self, value);
    } else {
      value = values.get(self);
    }
    return value;
  }

  function compatGetter(self) {
    consumeTracking(self);
    return initializer.call(self);
  }

  function setter(self, value) {
    notify(self, key);
    notifyAutoTracked(self);
    cleanupAutoTracked(self);
    values.set(self, value);
  }

  return { compatGetter, getter, setter };
}

function beginAutoTracking(self, key) {
  currentAutoTrackings.unshift([self, key]);
}

function endAutoTracking() {
  currentAutoTrackings.shift();
}

export {
  beginAutoTracking,
  endAutoTracking,
  trackedData,
};
