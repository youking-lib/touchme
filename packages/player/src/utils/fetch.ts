import axios, { AxiosRequestConfig } from "axios";

type Ok<T> = { success: true; data: T };
type Err = { success: false; error: string };
type Result<T> = Ok<T> | Err;

export async function fetch<T, D = any>(config: AxiosRequestConfig<D>) {
  const res = await axios<Result<T>>(config);

  if (!res.data.success) {
    throw new Error(res.data.error);
  }

  return res.data.data;
}
