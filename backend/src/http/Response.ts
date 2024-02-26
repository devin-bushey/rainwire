import { AxiosResponse } from 'axios';

export interface HttpResponse {
  status: number;
  data: any;
}

export const buildResponseFromAxios = ({
  status,
  data,
}: AxiosResponse): HttpResponse => ({
  status,
  data,
});
