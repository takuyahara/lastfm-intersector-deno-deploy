import { Head } from "$fresh/runtime.ts";
import Main from "../islands/Main.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <Main></Main>
    </>
  );
}
