export interface HttpRequestOptions {
  method: HttpRequestMethod;
  url: string;
  params?: HttpRequestParams;
  headers?: HttpRequestHeaders;
  data?: HttpRequestData;
  maxBodyLength?: number;
}

export enum HttpRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

type HttpRequestParams = Record<string, string | number | boolean>;
type HttpRequestHeaders = Record<string, string>;
type HttpRequestData = string | Record<string, string | number | boolean>;
