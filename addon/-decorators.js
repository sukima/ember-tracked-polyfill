import {
  autotrack as autotrackDescriptor,
  dependentKeyCompat as dependentKeyCompatDescriptor,
  tracked as trackedDescriptor,
} from './-descriptor-factories';

function autotrack() {
  return autotrackDescriptor(...arguments);
}

function dependentKeyCompat() {
  return dependentKeyCompatDescriptor(...arguments);
}

function tracked() {
  return trackedDescriptor(...arguments);
}

export {
  autotrack,
  dependentKeyCompat,
  tracked,
};
