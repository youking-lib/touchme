import { describe, expect, test } from "vitest";
import { SlideAPI } from "../src/api";

describe("slide-image", () => {
  const api = SlideAPI.create({
    accessKey: process.env.VITE_UPSPLASH_ACCESS_KEY!,
  });

  test("list images", async () => {
    const res = await api.getPhotos();

    console.log(
      res.map(item => {
        return {
          url: item.urls.full,
          blur_hash: item.blur_hash,
          width: item.width,
          height: item.height,
        };
      })
    );
  });
});
