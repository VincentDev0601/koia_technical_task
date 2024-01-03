import { FilterData } from '../types';

export const YEARS_MIN_VALUE = 2009;
export const YEARS_MAX_VALUE = 2023;

export const getDefaultFilterData = (): FilterData => {
  return {
    from: {
      year: YEARS_MIN_VALUE,
      quartal: 1,
    },
    to: {
      year: YEARS_MAX_VALUE,
      quartal: 1,
    },
    houseType: '00',
  };
};

export const HouseTypes: Record<string, string> = {
  '00': 'Boliger i alt',
  '02': 'Småhus',
  '03': 'Blokkleiligheter',
};
