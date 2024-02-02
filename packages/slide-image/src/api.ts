import { createApi } from "unsplash-js";
import type { InitParams } from "unsplash-js/dist/helpers/request";

type SlideImageOptions = InitParams;

export class SlideAPI {
  public unsplash: ReturnType<typeof createApi>;

  constructor(options: SlideImageOptions) {
    this.unsplash = createApi(options);
  }

  async getPhotos() {
    const res = await this.unsplash.search.getPhotos({
      query: "cat",
      page: 1,
      perPage: 2,
      color: "green",
      orientation: "portrait",
    });

    return res.response?.results || [];
  }

  static create(options: SlideImageOptions) {
    return new SlideAPI(options);
  }
}
