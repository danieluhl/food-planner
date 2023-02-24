import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const calendarRouter = createTRPCRouter({
  getFuture: publicProcedure.query(({ ctx }) => {
    const today = new Date();
    // get everything after today
    return ctx.prisma.calendar.findMany({
      where: { timestamp: { gte: today } },
    });
  }),
  createCalendar: publicProcedure
    .input(
      z.object({
        day: z.number(),
        month: z.number(),
        year: z.number(),
        breakfastName: z.string(),
        lunchName: z.string(),
        dinnerName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.calendar.create({
          data: {
            day: input.day,
            month: input.month,
            year: input.year,
            breakfastName: input.breakfastName,
            lunchName: input.lunchName,
            dinnerName: input.dinnerName,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
