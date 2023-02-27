import { type Calendar } from "@prisma/client";
import { type NextPage } from "next";

import { api } from "../utils/api";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type MealSelectParams = {
  title: string;
  recipeNames: string[];
  onMealChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedMealName: string | null;
};

const DayMealSelect = ({
  title,
  recipeNames,
  onMealChange,
  selectedMealName,
}: MealSelectParams) => {
  return (
    <p>
      {title}
      <select
        onChange={onMealChange}
        className="ml-2"
        defaultValue={selectedMealName || "-"}
      >
        <option key="none" value="-">
          -
        </option>
        {recipeNames.map((name) => {
          return (
            <option key={name} value={name}>
              {name}
            </option>
          );
        })}
      </select>
    </p>
  );
};

const Day = ({
  calendarDay: {
    day,
    month,
    year,
    breakfastName,
    lunchName,
    dinnerName,
    timestamp,
  },
  recipeNames,
}: {
  calendarDay: Calendar;
  recipeNames: string[];
}) => {
  // on select, update breakfast, lunch, or dinner tie
  const mutateDay = api.calendar.upsertDay.useMutation();

  const onMealChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    meal: string
  ) => {
    if (e.target.value !== "none") {
      console.log("updating: ", timestamp, meal);
      // update meal selection
      mutateDay.mutate({
        day,
        month,
        year,
        breakfastName,
        lunchName,
        dinnerName,
        timestamp: timestamp,
        [meal]: e.target.value,
      });
    }
  };

  return (
    <div className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <h2>
        {timestamp.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </h2>
      <hr />
      <DayMealSelect
        title="Breakfast"
        recipeNames={recipeNames}
        selectedMealName={breakfastName}
        onMealChange={(e) => onMealChange(e, "breakfastName")}
      />
      <DayMealSelect
        title="Lunch"
        recipeNames={recipeNames}
        selectedMealName={lunchName}
        onMealChange={(e) => onMealChange(e, "lunchName")}
      />
      <DayMealSelect
        title="Dinner"
        recipeNames={recipeNames}
        selectedMealName={dinnerName}
        onMealChange={(e) => onMealChange(e, "dinnerName")}
      />
    </div>
  );
};

// this page shows recipes for the next two weeks
const CalendarPage: NextPage = () => {
  // get all calendar entries for today and later
  const getDaysQuery = api.calendar.getNextWeekDays.useQuery();
  let calendarDays = getDaysQuery.data;
  if (calendarDays == null) {
    calendarDays = [];
  }

  const insertDay = api.calendar.upsertDay.useMutation();
  const allRecipies = api.recipe.getAll.useQuery();
  const recipeNames = allRecipies.data
    ? allRecipies.data.map(({ name }) => name)
    : [];

  const utils = api.useContext();

  // todo: rename timestamp because it's a date object
  const handleAddDayClick = () => {
    let nextDay = new Date();

    if (calendarDays.length > 0) {
      const sortedCalendarDays = calendarDays.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      const firstTimestamp = sortedCalendarDays.at(0)?.timestamp;

      if (firstTimestamp != null) {
        nextDay = new Date(firstTimestamp.getTime());
      }
    }
    // set to the next available day or tomorrow
    nextDay.setDate(nextDay.getDate() + 1);

    console.log("inserting");
    console.log({
      day: nextDay.getDate(),
      month: nextDay.getMonth(),
      year: nextDay.getFullYear(),
      breakfastName: null,
      lunchName: null,
      dinnerName: null,
      timestamp: nextDay,
    });
    insertDay.mutate(
      {
        day: nextDay.getDate(),
        month: nextDay.getMonth(),
        year: nextDay.getFullYear(),
        breakfastName: null,
        lunchName: null,
        dinnerName: null,
        timestamp: nextDay,
      },
      {
        onSuccess: async (data) => {
          console.log({ data });
          utils.calendar.getNextWeekDays.invalidate();
        },
      }
    );
  };
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
      <button
        onClick={handleAddDayClick}
        className="m-4 rounded-md border border-gray-300 px-4 py-2"
      >
        +
      </button>
    </div>
  );
};

export default CalendarPage;
