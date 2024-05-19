import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { Chart } from './components/chart';
import { Filter } from './components/filter';
import { Comment } from './components/comment';

import { FilterData } from './types';

import { fetchData, RequestParam } from './api/statistics';
import { getDefaultFilterData, HouseTypes } from './config/filter';

import './App.css';


function generateSearchParams(filters: FilterData): URLSearchParams {
  return new URLSearchParams({
    from: `${filters!.from.year}K${filters!.from.quartal}`,
    to: `${filters!.to.year}K${filters!.to.quartal}`,
    houseType: filters!.houseType,
  });
}

function prepareDataForRequest({
  from,
  to,
  houseType,
}: FilterData): RequestParam[] {
  const timeslots = [];
  for (let i = from.year; i <= to.year; i++) {
    if (i === from.year) {
      for (let i = from.quartal; i <= 4; i++) {
        timeslots.push(`${from.year}K${i}`);
      }
      continue;
    }

    if (i === to.year) {
      for (let i = 1; i <= to.quartal; i++) {
        timeslots.push(`${to.year}K${i}`);
      }
      continue;
    }

    for (let j = 1; j <= 4; j++) {
      timeslots.push(`${i}K${j}`);
    }
  }

  return [
    {
      code: 'Boligtype',
      selection: {
        filter: 'item',
        values: [houseType],
      },
    },
    {
      code: 'ContentsCode',
      selection: {
        filter: 'item',
        values: ['KvPris'],
      },
    },
    {
      code: 'Tid',
      selection: {
        filter: 'item',
        values: timeslots,
      },
    },
  ];
}

const getSerializedComments = () => {
  const comments = localStorage.getItem('comments');
  const commentsParsed = comments ? JSON.parse(comments) : {};
  return commentsParsed;
};

type ChartState = {
  quartals: string[];
  prices: string[];
  houseType: string;
};

function App() {
  const [filters, setFilters] = useState<FilterData>(getDefaultFilterData());
  let [searchParams, setSearchParams] = useSearchParams();

  const commentsSerialized = getSerializedComments();
  const [comment, setComment] = useState(
    commentsSerialized[JSON.stringify(filters)] || ''
  );

  const [chartState, setChartState] = useState<ChartState>({
    quartals: [],
    prices: [],
    houseType: HouseTypes[Object.keys(HouseTypes)[0]],
  });
  const [networkError, setNetworkError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getDataFromApi = async (filterData: FilterData) => {
    try {
      if (!loading) {
        setLoading(true);
      }
      const fetchedData = await fetchData(prepareDataForRequest(filterData));

      const quartalsParsed: string[] = [],
        pricesParsed: string[] = [];

      fetchedData.forEach(({ key, values }) => {
        quartalsParsed.push(key[1]);
        pricesParsed.push(values[0]);
      });

      setChartState({
        quartals: quartalsParsed,
        prices: pricesParsed,
        houseType: filterData.houseType,
      });

      if (networkError) {
        setNetworkError(false);
      }

      localStorage.setItem('lastSearch', JSON.stringify(filterData));
      setLoading(false);
    } catch (err) {
      setNetworkError(true);
    }
  };

  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const houseType = searchParams.get('houseType');
    let initialFiltersData: FilterData | null = null;
    const lastSearch = localStorage.getItem('lastSearch');

    if (from && to && houseType) {
      const [fromYear, fromQuartal] = from.split('K');
      const [toYear, toQuartal] = to.split('K');
      initialFiltersData = {
        from: {
          year: +fromYear,
          quartal: +fromQuartal,
        },
        to: {
          year: +toYear,
          quartal: +toQuartal,
        },
        houseType,
      };
    } else if (lastSearch) {
      const parsed = JSON.parse(lastSearch);
      initialFiltersData = parsed;
      setSearchParams(generateSearchParams(parsed));
    }

    if (initialFiltersData) {
      getDataFromApi(initialFiltersData);
      setFilters(initialFiltersData);
    }
  }, []);

  useEffect(() => {
    const commentsParsed = getSerializedComments();
    commentsParsed[JSON.stringify(filters)] = comment;
    localStorage.setItem('comments', JSON.stringify(commentsParsed));
  }, [comment]);

  useEffect(() => {
    getDataFromApi(filters);
    const commentsParsed = getSerializedComments();
    setComment(commentsParsed[JSON.stringify(filters)]);
    setSearchParams(generateSearchParams(filters));
  }, [filters]);

  return (
    <div className="App">
      {networkError ?? <div>Network error...</div>}
      {loading ? (
        <CircularProgress className="loading" />
      ) : (
        <>
          <Filter filtersData={filters} setFilters={setFilters} />
          <Chart
            houseType={HouseTypes[chartState.houseType]}
            labels={chartState.quartals}
            data={chartState.prices}
          />
          <Comment
            comment={comment || ''}
            saveComment={(c: string) => {
              setComment(c);
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
