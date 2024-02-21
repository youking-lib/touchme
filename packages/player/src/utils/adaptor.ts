import axios, { AxiosRequestConfig } from "axios";

type Ok<T> = { success: true; data: T };
type Err = { success: false; error: string };
type Result<T> = Ok<T> | Err;

export function setFetchBaseUrl(url: string) {
  axios.defaults.baseURL = url;
}

export class SystemAdaptor {
  fetch = fetch;
}

export async function fetch<Output, Input = any>(
  config: AxiosRequestConfig<Input>
) {
  const res = await axios<Result<Output>>(config);

  if (!res.data.success) {
    throw new Error(res.data.error);
  }

  return res.data.data;
}
