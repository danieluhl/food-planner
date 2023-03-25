import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <Head>
        <title>Food Planner</title>
        <meta name="description" content="Plan your food for the week" />
      </Head>
      <header className="border-b border-teal-500 bg-gray-800 py-3 text-white">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <ul className="flex flex-row">
          <li>
            <Link
              className="border-r border-purple-500 px-5 py-3 text-2xl"
              href="/recipes"
            >
              Recipes
            </Link>
          </li>
          <li>
            <Link
              className="border-r border-pink-500 px-5 py-3 text-2xl"
              href="/calendar"
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link
              className="border-r border-teal-500 px-5 py-3 text-2xl"
              href="/"
            >
              Ingredients
            </Link>
          </li>
          <li className="pl-5">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </li>
        </ul>
      </header>
    </>
  );
}
