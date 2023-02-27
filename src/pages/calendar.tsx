import { type Calendar } from "@prisma/client";
import { type NextPage } from "next";

import { api } from "../utils/api";

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
    <p className="justify-arround my-1 flex w-2/4 min-w-full max-w-xs flex-row py-1 px-2">
      <p className="w-2/4">{title}</p>
      <select
        onChange={onMealChange}
        className="ml-2 bg-gray-800"
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
    <div className="my-2 mx-2 block max-w-sm rounded-lg border border-teal-500 p-6 text-white shadow">
      <h2 className="border-b border-teal-500 py-2">
        {timestamp.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      </h2>
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

    if (calendarDays && calendarDays.length > 0) {
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
        onSuccess: () => {
          utils.calendar.getNextWeekDays.invalidate().catch((e) => {
            console.log(e);
          });
        },
      }
    );
  };
  return (
    <main
      className={`
            flex 
            flex-row
            flex-wrap
            items-center
            justify-center
            bg-gray-800
          `}
    >
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
        className="m-4 rounded-md border border-teal-500 px-4 py-2 text-white"
      >
        +
      </button>
    </main>
  );
};

export default CalendarPage;
