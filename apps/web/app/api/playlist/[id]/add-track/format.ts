const spliter = "____";

export function trackFieldEncode(arr: string[]) {
  return arr.join(spliter);
}

export function trackFieldDecode(str: string) {
  return str.split(spliter);
}
