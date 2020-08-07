export {
  autotrack,
  dependentKeyCompat,
  tracked,
} from './-decorators';

import { patchAutotrackObjectGetters } from './-object-patch';

patchAutotrackObjectGetters();
