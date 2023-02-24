import { type NextPage } from "next";
import Recipe from "../components/Recipe";
import { api } from "../utils/api";

// this page shows recipes for the next two weeks

const RecipesPage: NextPage = () => {
  // todo: delete ingredient
  const recipeAll = api.recipe.getAll.useQuery();
  const deleteRecipe = api.recipe.deleteRecipe.useMutation({
    onMutate: async (toDeleteName) => {
      await utils.recipe.getAll.cancel();
      utils.recipe.getAll.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return prevEntries.filter((name) => name !== toDeleteName);
        } else {
          return [];
        }
      });
    },
    onSettled: async () => {
      await utils.recipe.getAll.invalidate();
    },
  });

  const utils = api.useContext();
  const createRecipe = api.recipe.createRecipe.useMutation({
    onMutate: async (newRecipe) => {
      await utils.recipe.getAll.cancel();
      utils.recipe.getAll.setData(undefined, (prevEntries) => {
        if (prevEntries) {
          return [newRecipe, ...prevEntries];
        } else {
          return [newRecipe];
        }
      });
    },
    onSettled: async () => {
      await utils.recipe.getAll.invalidate();
    },
  });

  const recipeNames = recipeAll.data
    ? recipeAll.data.map(({ name }) => name)
    : [];

  const handleSubmitRecipe = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    createRecipe.mutate({
      name: formJson.recipeName as string,
    });

    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteRecipeClick = (name: string) => {
    deleteRecipe.mutate({ name });
  };

  return (
    <>
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
        <form className="w-full max-w-sm " onSubmit={handleSubmitRecipe}>
          <div className="flex items-center border-b border-teal-500 py-2 px-2">
            <input
              className={`mr-3
                w-full
                appearance-none
                border-none
                bg-transparent
                py-1
                px-2
                leading-tight
                text-gray-200
                focus:outline-none
              `}
              type="text"
              name="recipeName"
              placeholder="Enter Recipe"
              aria-label="Recipe"
            />
            <button
              className={`flex-shrink-0
                rounded
                border-4
                border-teal-500
                bg-teal-500
                py-1
                px-2
                text-sm
                text-white
                hover:border-teal-700
                hover:bg-teal-700
                `}
              type="submit"
            >
              +
            </button>
          </div>
        </form>
        <ul className="bordder w-full max-w-sm text-white">
          {recipeNames &&
            recipeNames.map((recipeName) => {
              return (
                <li key={recipeName}>
                  <Recipe
                    recipeName={recipeName}
                    deleteRecipeCallback={handleDeleteRecipeClick}
                  />
                </li>
              );
            })}
        </ul>
        <br />
      </main>
    </>
  );
};

export default RecipesPage;
