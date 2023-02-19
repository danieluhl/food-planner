import { type NextPage } from "next";
import { useSession } from "next-auth/react";

// this page shows recipes for the next two weeks
const RecipesPage: NextPage = () => {
  const { status } = useSession();

  // get list of recipes
  // add input for adding recipes
  

  if (status !== "authenticated") {
    // redirect
    // window.location.href = window.location.origin;
  }
  return <div>Recipes Page</div>;
};

export default RecipesPage;
