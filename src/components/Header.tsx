import Head from "next/head";

export default function Header() {
  return (
    <>
      <Head>
        <title>Food Planner</title>
        <meta name="description" content="Plan your food for the week" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>I AM HEADER</div>
    </>
  );
}
