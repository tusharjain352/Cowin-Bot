const apiController = require("./services/http");
const helper = require("./helper");
const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");
const slotByState = require("./findSlotsByState");
const slotByZipcode = require("./findSlotsByZipcode");
const userService = require("./services/userService");

const defaultErrorScene = new Scenes.WizardScene(
  "Default_Error",
  async (ctx) => {
    try {
      ctx.reply(
        `Alright, please choose what we will do 👇`,
        Markup.inlineKeyboard(
          [
            Markup.button.callback("MAIN MENU ", "MENU"),
            Markup.button.callback("EXIT 🚪", "CANCELLED"),
          ],
          { columns: 1 }
        )
      );

      return ctx.wizard.next();
    } catch (e) {
      ctx.reply(`Sorry, I did not understand 🙃. Please start again "/start"`);
      return ctx.scene.leave();
    }
  },
  (ctx) => {
    try {
      if (ctx.update.callback_query.data === "MENU") {
        return ctx.scene.enter("Covid_19_Tracker");
      } else {
        ctx.reply(
          `Thank you for your time ${ctx.from.first_name}. Have a good day`
        );
        return ctx.scene.leave();
      }
    } catch (e) {
      ctx.reply(`Sorry, I did not understand 🙃. Please start again "/start"`);
      return ctx.scene.leave();
    }
  }
);

module.exports = {
  defaultErrorScene,
};
