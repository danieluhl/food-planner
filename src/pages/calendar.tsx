import { type NextPage } from "next";
import { useSession } from "next-auth/react";

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

// this page shows recipes for the next two weeks
const CalendarPage: NextPage = (weekRecipes) => {
  const { status } = useSession();

  if (status !== "authenticated") {
    // redirect
    // window.location.href = window.location.origin;
  }
  return <div>{}</div>;
};

export default CalendarPage;
