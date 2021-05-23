const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");

const welcomeScene = new Scenes.WizardScene(
  "welcome",
  (ctx) => {
    try {
      ctx.reply(
        `Namaste 🙏. \n${ctx.from.first_name}, would you like to know the Covid-19 vaccine Availability in 🇮🇳 India? \nTo start choose 🔍 the best option .`,
        Markup.inlineKeyboard(
          [
            Markup.button.callback("Search By 🏛️ State", "CHECK_SLOTS_STATE"),
            Markup.button.callback(
              "Search By 🔢 Zipcode",
              "CHECK_SLOTS_ZIPCODE"
            ),
            Markup.button.callback("No, Thanks", "CANCELLED"),
          ],
          { columns: 1 }
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
      //ctx.deleteMessage();
      if (ctx.update.callback_query.data === "CHECK_SLOTS_ZIPCODE") {
        ctx.scene.enter("check_slots_by_pincode");
      } else if (ctx.update.callback_query.data === "CHECK_SLOTS_STATE") {
        ctx.scene.enter("check_slots_by_state");
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
  welcomeScene,
};
