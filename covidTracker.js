const apiController = require("./services/http");
const helper = require("./helper");
const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");
const slotByState = require("./findSlotsByState");
const slotByZipcode = require("./findSlotsByZipcode");
const userService = require("./services/userService");

let shareURL;

if (process.env.NODE_ENV === "production") {
  shareURL =
    "mongodb+srv://tushar:jain123@cowincluster.0ib1s.mongodb.net/cowin?retryWrites=true&w=majority";
} else {
  shareURL =
    "https://t.me/share/url?url=https://t.me/tusharjain352_cowin_slot_bot&text=Covid-19";
}

const covidTrackerScene = new Scenes.WizardScene(
  "Covid_19_Tracker",
  async (ctx) => {
    try {
      if (ctx && ctx.message) {
        const userData = {
          first_name: ctx.message.from.first_name,
          last_name: ctx.message.from.last_name,
          user_id: ctx.message.from.id,
        };

        const checkUserExist = await userService.checkUser(userData);
        if (!checkUserExist) {
          const saveUser = await userService.createUser(userData);
        }
      }

      ctx.reply(
        `Hi! ${ctx.from.first_name} 👋 \nWelcome to Covid Assistance bot. Here is what I can: \n \n -Search for vaccine slots 🇮🇳 \n -Available 🇮🇳 Vaccine's Information \n -Covid-19 🇮🇳 Tracker & WHO links \n \n Shall we start? 👇 `,
        Markup.inlineKeyboard(
          [
            Markup.button.callback("Search 💉 Slots ", "VACCINE"),
            Markup.button.url(
              "Covid-19 🇮🇳 IN",
              "https://www.covid19india.org/"
            ),
            Markup.button.url("WHO 🌎", "https://covid19.who.int/"),
            Markup.button.url(
              "🌎 Vaccine Tracker",
              "https://www.bing.com/covid/local/india?vert=vaccineTracker"
            ),
            Markup.button.callback("Available 💉 Vaccine's 🇮🇳", "VACCINE_INFO"),
            Markup.button.callback("EXIT 🚪", "CANCELLED"),
            Markup.button.url("Share Now 👫", shareURL),
          ],
          { columns: 2 }
        )
      );

      return ctx.wizard.next();
    } catch (e) {
      return ctx.scene.enter("Default_Error");
    }
  },
  (ctx) => {
    try {
      if (ctx.update.callback_query.data === "VACCINE") {
        ctx.scene.enter("welcome");
      } else if (ctx.update.callback_query.data === "VACCINE_INFO") {
        ctx.scene.enter("Vaccine_Info_Scene");
      } else {
        ctx.reply(
          `Thank you for your time ${ctx.from.first_name}. Have a good day`
        );
        return ctx.scene.leave();
      }
    } catch (e) {
      return ctx.scene.enter("Default_Error");
    }
  }
);

module.exports = {
  covidTrackerScene,
};
