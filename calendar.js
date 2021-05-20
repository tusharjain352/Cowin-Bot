const Calendar = require("./node_modules/telegraf-calendar-telegram/index");

let calendar;

const intiateCalendar = (botInstance) => {
  calendar = new Calendar(botInstance);
};

const getCalendar = () => {
  return calendar;
};

module.exports = {
  intiateCalendar,
  getCalendar,
};
