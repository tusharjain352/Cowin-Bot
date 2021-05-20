const apiController = require("./services/http");
const helper = require("./helper");
const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");
const slotByState = require("./findSlotsByState");
const slotByZipcode = require("./findSlotsByZipcode");
const userService = require("./services/userService");

const welcomeScene = new Scenes.WizardScene(
  "welcome",
  async (ctx) => {
    try {
      const userData = {
        first_name: ctx.message.from.first_name,
        last_name: ctx.message.from.last_name,
        user_id: ctx.message.from.id,
      };

      const checkUserExist = await userService.checkUser(userData);
      if (!checkUserExist) {
        const saveUser = await userService.createUser(userData);
      }

      ctx.reply(
        `Hey there!👋 \nWelcome to CoWin Assist bot. \n${ctx.from.first_name}, would you like to know the Covid-19 vaccine Availability? \nTo start choose 🔍 the best option .`,
        Markup.inlineKeyboard(
          [
            Markup.button.callback("Search By State", "CHECK_SLOTS_STATE"),
            Markup.button.callback("Search By Zipcode", "CHECK_SLOTS_ZIPCODE"),
            Markup.button.callback("No, Thanks", "CANCELLED"),
          ],
          { columns: 2 }
        )
      );

      return ctx.wizard.next();
    } catch (e) {
      ctx.deleteMessage();
      ctx.reply("Sorry, I did not understand. Please try again");
      return ctx.scene.leave();
    }
  },
  (ctx) => {
    try {
      ctx.deleteMessage();
      if (ctx.update.callback_query.data === "CHECK_SLOTS_ZIPCODE") {
        ctx.scene.enter("check_slots_by_pincode");
      } else if (ctx.update.callback_query.data === "CHECK_SLOTS_STATE") {
        ctx.scene.enter("check_slots_by_state");
      } else {
        ctx.reply("Thank you for your Time :)");
        return ctx.scene.leave();
      }
    } catch (e) {
      console.log("Invalid User Input");
      // ctx.wizard.back();
      // ctx.wizard.state.invalidUserInput = true;
      // return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
  }
);

module.exports = {
  welcomeScene,
};
