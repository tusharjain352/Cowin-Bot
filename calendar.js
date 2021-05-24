const Calendar = require("./node_modules/telegraf-calendar-telegram/index");

let calendar;

const intiateCalendar = (botInstance) => {
  try {
    calendar = new Calendar(botInstance);
  } catch (e) {
    console.log("Calendar Instance Failed");
  }
};

const getCalendar = () => {
  return calendar;
};

module.exports = {
  intiateCalendar,
  getCalendar,
};
