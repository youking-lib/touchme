import { NextRequest } from "next/server";
import { array, number, object, string } from "zod";
import { invalidBody } from "@/libs/http";

const PlaylistValidatorSchema = {
  post: object({
    album: string(),
    artist: array(string()),
    duration: number(),
    genre: array(string()),
    title: string(),
  }),
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const validation = PlaylistValidatorSchema.post.safeParse(body);

  if (!validation.success) {
    return invalidBody();
  }
};
