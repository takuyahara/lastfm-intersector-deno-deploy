import { createRef } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { SimilarArtists } from "../components/SimilarArtists.ts";
import { SimilarArtistsWithError as Sim } from "../routes/api/similarartists/[artist].ts";

interface FormProps {
  value?: string;
}

export default function Counter(props: FormProps) {
  const refInput = createRef<HTMLInputElement>();
  const [value, setValue] = useState(props.value || "");
  const { similarArtists, setSimilarArtists } = useContext(SimilarArtists);
  const focusTextbox = function (ev: KeyboardEvent) {
    if (ev.target === null) {
      return;
    }
    if (
      ["INPUT", "TEXTAREA"].includes((ev.target as HTMLElement).nodeName) ||
      (ev.target as HTMLElement).isContentEditable
    ) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        setValue("");
      }
      return;
    }
    if (ev.key === "/") {
      refInput.current!.focus();
      ev.preventDefault();
      return;
    }
    if (ev.metaKey && ev.key === "k") {
      refInput.current!.focus();
      ev.preventDefault();
      return;
    }
  };
  useEffect(() => {
    document.body.addEventListener("keydown", focusTextbox);
    return () => {
      document.body.removeEventListener("keydown", focusTextbox);
    };
  }, []);
  return (
    <form
      class="w-full	bg-gray-700"
      onSubmit={async (e: Event) => {
        e.preventDefault();
        const v = value.trim();
        if (v === "") {
          return;
        }
        const url = new URL(import.meta.url).origin + "/api/similarartists/" +
          v;
        const response = await fetch(url);
        const {
          error,
          similarartists: sim,
        } = await response.json() as Sim;
        if (error !== null) {
          throw error;
        }
        setSimilarArtists([{
          artist: v,
          similarartists: sim,
        }].concat(similarArtists));
        setValue("");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="absolute w-6 h-6 mx-2 my-1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="text"
        value={value}
        placeholder="artist"
        class="w-full text-gray-300 pl-10 pr-14 py-1.5 bg-gray-600 rounded-md"
        onKeyUp={(e: KeyboardEvent) => {
          const newValue = (e.target as HTMLInputElement).value;
          setValue(newValue);
        }}
        ref={refInput}
      />
      <span class="absolute -ml-12 w-12 text-center py-2.5 text-xs text-gray-400">
        ⌘K
      </span>
    </form>
  );
}
