import axios from "axios";
import {RequestMethod, RequestOptions} from "./RequestOptions";
import {buildResponseFromAxios} from "./Response";


export const get = async (options: Omit<RequestOptions, "method">) =>
    await request({
        method: RequestMethod.GET,
        ...options
    });

export const post = async (options: Omit<RequestOptions, "method">) =>
    await request({
        method: RequestMethod.POST,
        ...options
    });

export const put = async (options: Omit<RequestOptions, "method">) =>
    await request({
        method: RequestMethod.PUT,
        ...options
    });

const request = async (options: RequestOptions) => {
    // stephg does this throw an error when it rejects?
    const axiosResponse = await axios({
        ...options, // stephg why does this allow for the spread of non-axios options?
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    return buildResponseFromAxios(axiosResponse);
}
