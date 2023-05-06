import { useState } from "preact/hooks";
import Form from "../islands/Form.tsx";
import Table from "../islands/Table.tsx";
import { SimilarArtists } from "../components/SimilarArtists.ts";
import {
  Artist,
  SimilarArtists as Sim,
} from "../routes/api/similarartists/[artist].ts";

const intersect = function (similarArtists: Sim[]): Record<string, Artist[]> {
  const hash: Record<string, Artist[]> = {};
  for (const sim of [...similarArtists]) {
    for (const s of sim.similarartists) {
      if (hash[s.url] === undefined) {
        hash[s.url] = [];
      }
      hash[s.url].push(s);
    }
  }
  return hash;
};

const calculate = function (
  keys: number,
  record: Record<string, Artist[]>,
): Artist[] {
  const recordsFiltered = Object.values(record).filter((rec) =>
    rec.length === keys
  );
  const calculated = recordsFiltered.reduce((acc, cur) => {
    const a = cur.slice(1).reduce((a, c) => {
      a.match *= c.match;
      return a;
    }, cur[0]);
    acc.push(a);
    return acc;
  }, [] as Artist[]);
  return calculated;
};

export default function Main() {
  const [similarArtists, setSimilarArtists] = useState([] as Sim[]);
  const step1 = intersect(similarArtists);
  const step2 = calculate(similarArtists.length, step1);
  step2.sort((a, b) => b.match - a.match);
  return (
    <SimilarArtists.Provider value={{ similarArtists, setSimilarArtists }}>
      <div class="min-h-screen bg-gray-600">
        <header class="px-10 py-8 w-full bg-gray-700 shadow-lg">
          <Form></Form>
        </header>
        <main class="h-120 flex gap-7 w-full h-full px-10 py-10">
          {similarArtists.length > 0 && (
            <Table artist="Intersected" similarartists={step2} />
          )}
          {similarArtists.map((sims) => (
            <Table
              artist={sims.artist}
              similarartists={sims.similarartists}
            />
          ))}
        </main>
      </div>
    </SimilarArtists.Provider>
  );
}
