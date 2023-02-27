import Head from "next/head";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <Head>
        <title>Food Planner</title>
        <meta name="description" content="Plan your food for the week" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="border-b border-pink-200 bg-indigo-100 py-2 text-pink-600">
        <ul className="flex flex-row">
          <li className="border-r border-pink-300 px-5 py-3 text-2xl">
            <Link href="/recipes">Recipes</Link>
          </li>
          <li className="border-r border-pink-300 px-5 py-3 text-2xl">
            <Link href="/calendar">Calendar</Link>
          </li>
          <li className="border-r border-pink-300 px-5 py-3 text-2xl">
            <Link href="/">Ingredients</Link>
          </li>
        </ul>
      </header>
    </>
  );
}
