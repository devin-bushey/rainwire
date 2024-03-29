import axios from "axios";
import { HttpRequestMethod, HttpRequestOptions } from "./HttpRequestOptions";
import { buildHttpResponseFromAxios } from "./HttpResponse";
import { HttpRequestError } from "./HttpRequestError";

export const get = (options: Omit<HttpRequestOptions, "method">) =>
  request({
    method: HttpRequestMethod.GET,
    ...options,
  });

export const post = (options: Omit<HttpRequestOptions, "method">) =>
  request({
    method: HttpRequestMethod.POST,
    ...options,
  });

export const put = (options: Omit<HttpRequestOptions, "method">) =>
  request({
    method: HttpRequestMethod.PUT,
    ...options,
  });

export const delete_ = (options: Omit<HttpRequestOptions, "method">) =>
  request({
    method: HttpRequestMethod.DELETE,
    ...options,
  });

const request = (options: HttpRequestOptions) =>
  axios({
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
    .catch((err) => {
      throw new HttpRequestError(err);
    })
    .then((response) => {
      return buildHttpResponseFromAxios(response);
    });
