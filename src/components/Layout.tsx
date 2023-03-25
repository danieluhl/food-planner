import { signOut, signIn } from "next-auth/react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: JSX.Element;
};
export default function Layout({ children }: LayoutProps) {
  // const { status } = useSession();
  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }
  // const isAuthenticated = status === "authenticated";
  // const isAuthenticated = true;
  return (
    <>
      <Header />
      <main
        className={`     
          flex 
          h-screen
          w-screen
          flex-row
          flex-wrap
          items-center
          justify-center  
          bg-gray-800`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

// const AuthShowcase: React.FC = () => {
// const { data: sessionData } = useSession();

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
