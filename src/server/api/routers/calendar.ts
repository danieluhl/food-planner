import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const calendarRouter = createTRPCRouter({
  getNextWeekDays: publicProcedure.query(({ ctx }) => {
    const today = new Date();
    // get everything after today
    return ctx.prisma.calendar.findMany({
      where: { timestamp: { gte: today } },
    });
  }),
  upsertDay: publicProcedure
    .input(
      z.object({
        day: z.number(),
        month: z.number(),
        year: z.number(),
        timestamp: z.date(),
        breakfastName: z.nullable(z.string()),
        lunchName: z.nullable(z.string()),
        dinnerName: z.nullable(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.timestamp);
      try {
        await ctx.prisma.calendar.upsert({
          where: {
            timestamp: input.timestamp,
          },
          update: {
            breakfastName: input.breakfastName || undefined,
            lunchName: input.lunchName || undefined,
            dinnerName: input.dinnerName || undefined,
          },
          create: {
            day: input.day,
            month: input.month,
            year: input.year,
            timestamp: input.timestamp,
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
