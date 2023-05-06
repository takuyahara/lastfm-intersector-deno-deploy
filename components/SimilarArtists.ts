import { StateUpdater } from "https://esm.sh/v118/preact@10.13.1/hooks/src/index.js";
import { createContext } from "preact";
import { SimilarArtists as Sim } from "../routes/api/similarartists/[artist].ts";

interface Context {
  similarArtists: Sim[];
  setSimilarArtists: StateUpdater<Sim[]>;
}

export const SimilarArtists = createContext({} as Context);
