import {AxiosResponse} from "axios";

export interface HttpResponse {
    status: number;
    data: any;
    error: any; // stephg what should our error type be?
}

export const buildResponseFromAxios = ({status, data}: AxiosResponse): HttpResponse => ({
    status,
    data,
    error: {}
});
