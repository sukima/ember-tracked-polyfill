export {
  autotrackDecorator as autotrack,
  dependentKeyCompatDecorator as dependentKeyCompat,
  trackedDecorator as tracked,
} from './-decorators';

import { patchObjectGetters } from './-object-patch';

patchObjectGetters();
