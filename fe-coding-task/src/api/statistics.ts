import axios, { AxiosError } from 'axios';

const URL = 'https://data.ssb.no/api/v0/no/table/07241';

type Selection = {
  filter: string;
  values: string[];
};

export type RequestParam = {
  code: string;
  selection: Selection;
};

export type ResponseObject = {
  key: string[];
  values: string[];
};

export async function fetchData(
  reqParams: RequestParam[]
): Promise<ResponseObject[]> {
  try {
    const response = await axios.post(URL, {
      query: reqParams,
      response: { format: 'json' },
    });
    return response.data.data;
  } catch (error) {
    console.log(error)
    const axiosError = error as AxiosError;
    throw new Error(`Failed to fetch data: ${axiosError.message}`, { cause: axiosError });
  }
}
