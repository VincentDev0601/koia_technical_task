import { InputLabel, Select, MenuItem, SelectChangeEvent, FormControl } from '@mui/material';

import { FilterData } from '../../types';
import {
  YEARS_MIN_VALUE,
  YEARS_MAX_VALUE,
  HouseTypes,
} from '../../config/filter';
import './styles.css';

const getYears = () => {
  const result = [];
  for (let i = YEARS_MIN_VALUE; i <= YEARS_MAX_VALUE; i++) {
    result.push(i);
  }

  return result;
};

type FiltersProps = {
  filtersData: FilterData;
  setFilters: (FilterData: FilterData) => void;
};

export function Filter({ filtersData, setFilters }: FiltersProps) {
  const years = getYears();

  return (
    <form className="form-wrapper">
      <div>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={String(filtersData.from.year)}
            label="Year"
            onChange={(event: SelectChangeEvent) =>
              setFilters({
                ...filtersData,
                ...{
                  from: {
                    year: +event.target.value,
                    quartal: filtersData.from.quartal,
                  },
                },
              })
            }
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl fullWidth>
          <InputLabel>Quartal</InputLabel>
          <Select
            value={String(filtersData.from.quartal)}
            label="Quartal"
            onChange={(event: SelectChangeEvent) =>
              setFilters({
                ...filtersData,
                ...{
                  from: {
                    year: filtersData.from.year,
                    quartal: +event.target.value,
                  },
                },
              })
            }
          >
            <MenuItem value={'1'}>Q1</MenuItem>
            <MenuItem value={'2'}>Q2</MenuItem>
            <MenuItem value={'3'}>Q3</MenuItem>
            <MenuItem value={'4'}>Q4</MenuItem>
          </Select>
        </FormControl>
      </div>
      <p>{'---->'}</p>
      <div>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={String(filtersData.to.year)}
            label="Year"
            onChange={(event: SelectChangeEvent) =>
              setFilters({
                ...filtersData,
                ...{
                  to: {
                    year: +event.target.value,
                    quartal: filtersData.to.quartal,
                  },
                },
              })
            }
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl fullWidth>

          <InputLabel>Quartal</InputLabel>
          <Select
            value={String(filtersData.to.quartal)}
            label="Quartal"
            onChange={(event: SelectChangeEvent) =>
              setFilters({
                ...filtersData,
                ...{
                  to: {
                    year: filtersData.to.year,
                    quartal: +event.target.value,
                  },
                },
              })
            }
          >
            <MenuItem value={'1'}>Q1</MenuItem>
            <MenuItem value={'2'}>Q2</MenuItem>
            <MenuItem value={'3'}>Q3</MenuItem>
            <MenuItem value={'4'}>Q4</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <FormControl fullWidth>

          <InputLabel>House type</InputLabel>
          <Select
            value={filtersData.houseType}
            label="House type"
            onChange={(event: SelectChangeEvent) =>
              setFilters({
                ...filtersData,
                ...{
                  houseType: event.target.value,
                },
              })
            }
          >
            {Object.keys(HouseTypes).map((hKey: string) => (
              <MenuItem value={hKey} key={hKey}>
                {HouseTypes[hKey]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </form>
  );
}
