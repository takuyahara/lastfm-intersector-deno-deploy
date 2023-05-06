import { HandlerContext } from "$fresh/server.ts";

const getEpSimilar = function (artist: string) {
  const LIMIT = 250;
  const API_KEY = Deno.env.get("API_KEY");
  return [
    `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar`,
    `&artist=${artist}`,
    `&limit=${LIMIT}`,
    `&api_key=${API_KEY}`,
    `&format=json`,
  ].join(``);
};

interface ResponseFetch {
  similarartists?: {
    artist: ArtistRaw[];
  };
}

export interface ArtistRaw {
  name: string;
  match: string;
  url: string;
}
export interface Artist {
  name: string;
  match: number;
  url: string;
}

export type SimilarArtists = {
  artist: string;
  similarartists: Artist[];
};

export type SimilarArtistsWithError = {
  error: Error | null;
} & SimilarArtists;

export const handler = async (
  _req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const { artist } = ctx.params;
  const epSimilar = getEpSimilar(artist);
  const result = await fetch(epSimilar);
  const resultText = await result.text();
  const resultJson: ResponseFetch = JSON.parse(resultText);
  // console.log(JSON.stringify(resultJson));
  if (resultJson.similarartists === undefined) {
    return Response.json({
      error: new Error(resultText),
      artist,
      similarartists: [],
    });
  }
  const similarartists: Artist[] = resultJson.similarartists.artist.map((
    a: ArtistRaw,
  ) => ({
    name: a.name,
    match: parseFloat(a.match),
    url: a.url,
  }));
  return Response.json({
    error: null,
    artist,
    similarartists,
  });
};
