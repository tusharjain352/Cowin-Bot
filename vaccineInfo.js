const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");

const vaccineInfoScene = new Scenes.WizardScene(
  "Vaccine_Info_Scene",
  (ctx) => {
    try {
      ctx.reply(
        `Namaste 🙏. \n${ctx.from.first_name}, Below are the avaiable Covid-19 vaccine's in 🇮🇳 India? \nClick 🔍 To know more about vaccine's .`,
        Markup.inlineKeyboard(
          [
            Markup.button.url(
              `Covaxin ,\nEfficacy: 80.60% `,
              "http://www.bharatbiotech.com/covaxin.html"
            ),
            Markup.button.url(
              `CoviShield ,\nEfficacy: 79% `,
              "http://www.who.int/news-room/feature-stories/detail/the-oxford-astrazeneca-covid-19-vaccine-what-you-need-to-know"
            ),
            Markup.button.url(
              `Sputnik V ,\nEfficacy: 91.60% `,
              "http://sputnikvaccine.com/about-vaccine/"
            ),
            Markup.button.callback("Search Vaccine 💉 Slots ", "VACCINE"),
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
      if (ctx.update.callback_query.data === "VACCINE") {
        ctx.scene.enter("welcome");
      } else {
        ctx.reply("Thank you for your Time :)");
        return ctx.scene.leave();
      }
    } catch (e) {
      ctx.reply("Sorry, I did not understand. Please try again");
      return ctx.scene.leave();
    }
  }
);

module.exports = {
  vaccineInfoScene,
};
