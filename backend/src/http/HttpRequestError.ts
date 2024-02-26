import { AxiosError } from 'axios';

export class HttpRequestError extends Error {
  statusCode?: number;
  responseBody?: any;

  constructor(err: any) {
    if (err instanceof Error) {
      super(err.message);

      if (err instanceof AxiosError) {
        this.statusCode = err.response?.status;
        this.responseBody = err.response?.data;
      }
    } else {
      super(`Unknown error when making Http request: ${err}`);
    }
  }
}
