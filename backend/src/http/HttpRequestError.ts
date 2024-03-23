import { AxiosError } from "axios";

export class HttpRequestError extends Error {
  statusCode?: number;
  responseBody?: any;

  constructor(err: any) {
    if (err instanceof Error) {
      super("Error occurred when executing HTTP request");
      this.stack = `${this.stack}\n${err.stack}\n`;

      if (err instanceof AxiosError) {
        this.statusCode = err.response?.status;
        this.responseBody = err.response?.data;
      }
    } else {
      super(`Unknown error when executing HTTP request`);
      this.stack = `${this.stack}\n${err}\n`;
    }
  }
}
