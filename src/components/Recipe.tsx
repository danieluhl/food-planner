import { useState } from "react";

import { api } from "../utils/api";

type RecipeProps = {
  recipeName: string;
  deleteRecipeCallback: (name: string) => void;
};
const Recipe: React.FC<RecipeProps> = ({
  recipeName,
  deleteRecipeCallback,
}: RecipeProps) => {
  const [showIngredients, setShowIngredients] = useState(false);
  const allIngredients = api.ingredient.getByRecipe.useQuery({
    name: recipeName,
  });

  const utils = api.useContext();
  const createIngredient = api.ingredient.createIngredient.useMutation({
    onMutate: async (newIngredient) => {
      await utils.ingredient.getByRecipe.cancel();
      utils.ingredient.getByRecipe.setData(
        { name: newIngredient.name },
        (prevEntries) => {
          if (prevEntries) {
            return [newIngredient, ...prevEntries];
          } else {
            return [newIngredient];
          }
        }
      );
    },
    onSettled: async () => {
      await utils.ingredient.getByRecipe.invalidate();
    },
  });

  const ingredients = allIngredients.data
    ? allIngredients.data.map(({ name }) => ({ name }))
    : [];

  const handleRecipeClick = () => {
    setShowIngredients(!showIngredients);
  };

  const handleSubmitIngredient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());

    createIngredient.mutate({
      recipeName,
      name: formJson.ingredientName as string,
    });

    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteRecipeClick = (recipeName: string) => {
    deleteRecipeCallback(recipeName);
  };

  return (
    <>
      <div className="bordder mt-2 flex w-full max-w-sm flex-row justify-between rounded py-2 px-2 text-white hover:bg-teal-900">
        <div
          className="w-full cursor-pointer py-2 pl-2"
          onClick={handleRecipeClick}
        >
          {recipeName}
        </div>
        <button
          className={`h-8
            flex-shrink-0
            rounded
            border-4
            border-teal-500
            bg-teal-500
            px-2
            text-center
            align-middle
            text-sm
            text-white
            hover:border-teal-700
            hover:bg-teal-700`}
          onClick={() => handleDeleteRecipeClick(recipeName)}
        >
          x
        </button>
      </div>
      {showIngredients && (
        <ol
          className={`
            mt-2 
            space-y-1 
            pl-5
          `}
        >
          {ingredients.length > 0 &&
            ingredients.map(({ name }, i) => (
              <li className="text-body-color mb-4 flex text-base" key={name}>
                <span
                  className={`
                  bg-primary 
                  mr-2 
                  flex 
                  h-6 
                  w-full 
                  max-w-[24px] 
                  items-center 
                  justify-center 
                  rounded 
                  text-base 
                  text-white`}
                >
                  {i + 1}
                </span>
                {name}
              </li>
            ))}
          <li key="ingredientInputForm">
            <form
              className="w-full max-w-sm grow-[1]"
              onSubmit={handleSubmitIngredient}
            >
              <div className="flex items-center border-b border-teal-500 py-2">
                <input
                  className="mr-3 w-full appearance-none border-none bg-transparent py-1 px-2 leading-tight text-gray-200 focus:outline-none"
                  type="text"
                  name="ingredientName"
                  placeholder="Enter Ingredient"
                  aria-label="Ingredient"
                />
                <button
                  className="flex-shrink-0 rounded border-4 border-teal-500 bg-teal-500 py-1 px-2 text-sm text-white hover:border-teal-700 hover:bg-teal-700"
                  type="submit"
                >
                  +
                </button>
              </div>
            </form>
          </li>
        </ol>
      )}
    </>
  );
};

export default Recipe;
