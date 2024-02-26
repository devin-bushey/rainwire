import axios from 'axios';
import { HttpRequestMethod, HttpRequestOptions } from './HttpRequestOptions';
import { buildHttpResponseFromAxios } from './HttpResponse';
import { HttpRequestError } from './HttpRequestError';

export const get = async (options: Omit<HttpRequestOptions, 'method'>) =>
  await request({
    method: HttpRequestMethod.GET,
    ...options,
  });

export const post = async (options: Omit<HttpRequestOptions, 'method'>) =>
  await request({
    method: HttpRequestMethod.POST,
    ...options,
  });

export const put = async (options: Omit<HttpRequestOptions, 'method'>) =>
  await request({
    method: HttpRequestMethod.PUT,
    ...options,
  });

const request = async (options: HttpRequestOptions) => {
  const axiosResponse = await axios({
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }).catch((err) => {
    throw new HttpRequestError(err);
  });

  return buildHttpResponseFromAxios(axiosResponse);
};
