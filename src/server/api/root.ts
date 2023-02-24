import { createTRPCRouter } from "./trpc";
import { recipeRouter } from "./routers/recipe";
import { ingredientRouter } from "./routers/ingredient";
import { calendarRouter } from "./routers/calendar";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  recipe: recipeRouter,
  ingredient: ingredientRouter,
  calendar: calendarRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
