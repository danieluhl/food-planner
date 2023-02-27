import { type NextPage } from "next";

import { api } from "../utils/api";

// todo: basically move this to the recipes page, then make this the ingredient list page
const Home: NextPage = () => {
  // list of ingredients with recipies they will be used for

  const calendarDays = api.calendar.getNextWeekDays.useQuery().data || [];

  const recipes = calendarDays.flatMap((cal) => {
    return [cal.breakfastName, cal.lunchName, cal.dinnerName].filter(Boolean);
  });

  const allIngredients =
    api.ingredient.getByRecipes.useQuery({
      recipes,
    }).data || [];
  const ingredientsByRecipe = allIngredients.reduce(
    (acc, { recipeName, name }) => {
      acc[recipeName] ??= [];
      acc[recipeName].push(name);
      return acc;
    },
    {}
  );
  return (
    <div>
      {Object.entries(ingredientsByRecipe).map(([recipe, ingredients]) => {
        return (
          <div
            className="m-3 rounded-md border border-gray-300 bg-gray-200 p-2 "
            key={`${recipe}${ingredients[0]}`}
          >
            <h2 className="py-1 px-2 text-center text-lg text-gray-500">
              {recipe}
            </h2>
            <hr />
            <ul className="list-inside list-disc">
              {ingredients.map((ingredient) => {
                return <li key={ingredient}>{ingredient}</li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
export default Home;
