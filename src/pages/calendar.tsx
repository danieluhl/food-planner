import { Calendar } from "@prisma/client";
import next, { type NextPage } from "next";
import { useSession } from "next-auth/react";

import { api } from "../utils/api";

/*

  Data shape

[{
  day: "Monday",
  breakfast: recipeName,
  lunch: recipeName,
  dinner: recipeName,
}, {
  day: "Tuesday",
  breakfast: recipeName,
  lunch: recipeName,
  dinner: recipeName,
}]
  */

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// const RecipeDropdown = (recipes) => {
//   return <select type="dropdown">{recipes.map(recipe => {
//     return <option value={recipe.name}>{recipe.name}</option>
//   })}</select>
// }

const Day = ({
  calendarDay: { day, month, year, breakfastName, lunchName, dinnerName },
  recipeNames,
}: {
  calendarDay: Calendar;
  recipeNames: string[];
}) => {
  // on select, update breakfast, lunch, or dinner tie
  const d = new Date();
  d.setFullYear(year, month, day);
  const dayName = DAY_NAMES[d.getDay()];
  return (
    <div>
      <h2>{dayName}</h2>
      <hr />
      <p>
        Breakfast:{" "}
        <select>
          {recipeNames.map((name) => {
            return (
              <option key={name} selected={name === breakfastName} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </p>
      <p>
        Lunch:
        <select>
          {recipeNames.map((name) => {
            return (
              <option key={name} selected={name === lunchName} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </p>
      <p>
        Dinner:
        <select>
          {recipeNames.map((name) => {
            return (
              <option key={name} selected={name === dinnerName} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </p>
    </div>
  );
};

// this page shows recipes for the next two weeks
const CalendarPage: NextPage = (weekRecipes) => {
  const { status } = useSession();

  // get all calendar entries for today and later
  const calendarDays = api.calendar.getFuture.useQuery().data || [];

  const allRecipies = api.recipe.getAll.useQuery();
  const recipeNames = allRecipies.data
    ? allRecipies.data.map(({ name }) => name)
    : [];

  // todo: rename timestamp because it's a date object
  console.log({ calendarDays });
  const latestTimestamp = calendarDays
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0]
    .timestamp.getTime();
  const nextDay = new Date(latestTimestamp);
  nextDay.setDate(nextDay.getDate() + 1);

  return (
    <div>
      {calendarDays.map((calendarDay) => {
        const { day, month, year } = calendarDay;
        return (
          <Day
            recipeNames={recipeNames}
            key={`${day}${month}${year}`}
            calendarDay={calendarDay}
          />
        );
      })}
      <Day
        recipeNames={recipeNames}
        calendarDay={{
          day: nextDay.getDay() + 1,
          month: nextDay.getMonth(),
          year: nextDay.getYear(),
          timestamp: nextDay,
          breakfastName: null,
          lunchName: null,
          dinnerName: null,
        }}
      />
    </div>
  );
};

export default CalendarPage;
