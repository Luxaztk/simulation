import { SpeciesId } from './species';

export const OXIDATION_STATES: Record<SpeciesId, Record<string, string>> = {
  fe_oh2: {
    Fe: '+2',
    O: '-2',
    H: '+1',
  },
  o2: {
    O: '0 (Đơn chất)',
  },
  h2o: {
    H: '+1',
    O: '-2',
  },
  fe_oh3: {
    Fe: '+3',
    O: '-2',
    H: '+1',
  },
};
