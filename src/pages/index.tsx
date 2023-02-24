import { type NextPage } from "next";

import { api } from "../utils/api";

// todo: basically move this to the recipes page, then make this the ingredient list page
const Home: NextPage = () => {
  // list of ingredients with recipies they will be used for

  const calendarDays = api.calendar.getFuture.useQuery().data || [];

  const recipes = calendarDays.flatMap((cal) => {
    return [cal.breakfastName, cal.lunchName, cal.dinnerName].filter(Boolean);
  });
  // todo: flip this to query recipes instead of ingredients
  const allIngredients =
    api.ingredient.getByRecipes.useQuery({
      recipes,
    }).data || [];
  console.log({ allIngredients });
  return <div>HOME</div>;
};

export default Home;
