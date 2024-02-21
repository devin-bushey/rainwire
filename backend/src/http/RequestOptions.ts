
export interface RequestOptions {
    method: RequestMethod,
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
    data?: RequestData
}

export enum RequestMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
}

type RequestParams = Record<string, string | number | boolean>;
type RequestHeaders = Record<string, string>;
type RequestData = Record<string, string | number | boolean>;


