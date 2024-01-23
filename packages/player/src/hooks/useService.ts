import { useContext } from "react";
import { ApiContext } from ".";

export function useService() {
  return useContext(ApiContext)!.service;
}
