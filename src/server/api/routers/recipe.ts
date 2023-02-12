import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const recipeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany({ select: { name: true } });
  }),
  createRecipe: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.recipe.create({
          data: {
            name: input.name,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteRecipe: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.recipe.delete({ where: { name: input.name } });
      } catch (error) {
        console.log(error);
      }
    }),
});
