export module PlaylistTrackSchema {
  export const Formatter = {
    spliter: "____",
    trackFieldEncode(arr: string[]) {
      return arr.join(Formatter.spliter);
    },
    trackFieldDecode(str: string) {
      return str.split(Formatter.spliter);
    },
  };
}
