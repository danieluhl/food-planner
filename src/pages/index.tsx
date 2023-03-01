import { type NextPage } from "next";

import { api } from "../utils/api";

// todo: basically move this to the recipes page, then make this the ingredient list page
const Home: NextPage = () => {
  // list of ingredients with recipies they will be used for

  const calendarDays = api.calendar.getNextWeekDays.useQuery().data || [];

  const recipes = calendarDays.flatMap((cal) => {
    return [cal.breakfastName, cal.lunchName, cal.dinnerName].filter(Boolean);
  });

  type IngredientNames = {
    name: string;
    recipeName: string;
  };

  const allIngredients: IngredientNames[] =
    api.ingredient.getByRecipes.useQuery({
      recipes,
    }).data || [];

  const ingredientsByRecipe: Record<string, string[]> = allIngredients.reduce(
    (acc: { [key: string]: string[] }, { recipeName, name }) => {
      acc[recipeName] = acc[recipeName] || [];
      acc[recipeName]?.push(name);
      return acc;
    },
    {}
  );

  return (
    <main
      className={`
            flex 
            h-screen 
            w-screen
            flex-col
            items-center
            justify-center bg-gray-800
          `}
    >
      {Object.entries(ingredientsByRecipe).map(([recipe, ingredients]) => {
        return (
          <div
            className="m-3 rounded-md border border-teal-500 px-4 py-2"
            key={`${recipe}`}
          >
            <h2 className="border-b border-teal-500 py-1 px-2 text-center text-lg text-white">
              {recipe}
            </h2>
            <ul className="pt-2 text-white">
              {ingredients.map((ingredient) => {
                return (
                  <li key={ingredient}>
                    <input type="checkbox" className="mr-2" />
                    {ingredient}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </main>
  );
};
export default Home;
