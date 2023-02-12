import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const ingredientRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.ingredient.findMany({
        where: {
          recipeName: input.name,
        },
        select: { name: true },
      });
    }),
  createIngredient: publicProcedure
    .input(
      z.object({
        name: z.string(),
        recipeName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.ingredient.create({
          data: {
            name: input.name,
            recipeName: input.recipeName,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
