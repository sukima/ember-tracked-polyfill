import {
  classicDecoratorFor,
  autotrack,
  dependentKeyCompat,
  tracked,
} from './-descriptor-factories';

function autotrackDecorator(getter) {
  return arguments.length <= 1
    ? classicDecoratorFor(autotrack, { get: getter })
    : autotrack(...arguments);
}

function dependentKeyCompatDecorator(getter) {
  return arguments.length <= 1
    ? classicDecoratorFor(dependentKeyCompat, { get: getter })
    : dependentKeyCompat(...arguments);
}

function trackedDecorator(initialValue) {
  return arguments.length <= 1
    ? classicDecoratorFor(tracked, { initializer: () => initialValue })
    : tracked(...arguments);
}

export {
  autotrackDecorator,
  dependentKeyCompatDecorator,
  trackedDecorator,
};
