const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");
const db = require("./dbConnection");
const calen = require("./calendar");
const welcomeUser = require("./welcomeUser");
const slotByState = require("./findSlotsByState");
const slotByZipcode = require("./findSlotsByZipcode");
const covidTracker = require("./covidTracker");
const vaccineInfo = require("./vaccineInfo");
const defaultError = require("./defaultErrorScene");

const express = require("express");
const app = express();

const BOT_TOKEN =
  process.env.BOT_TOKEN || "1788105136:AAG32XgffBqWzrc6awhwoOle6flk9q9nJzY";

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://cowin-assist-bot.herokuapp.com/";

let stage;
var bot = new Telegraf(BOT_TOKEN);
// bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
// app.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);

try {
  calen.intiateCalendar(bot);

  stage = new Scenes.Stage(
    [
      covidTracker.covidTrackerScene,
      defaultError.defaultErrorScene,
      welcomeUser.welcomeScene,
      slotByState.stateScene,
      slotByZipcode.zipcodeScene,
      vaccineInfo.vaccineInfoScene,
    ],
    {
      default: "Covid_19_Tracker",
    }
  );
} catch (e) {
  console.log("BOT INTIALIZATION EXCEPTION", e);
}

//bot.launch();

bot.catch((err, ctx) => {
  console.log("Error in bot:", err);
  return ctx.scene.enter("Default_Error");
});

bot.command("help", (ctx) => {
  ctx.reply(`💡 Help \n
  This bot will help you to see current available slots by checking CoWin website. To start, click on "Check Open Slots".\n
  `);
});

bot.use(session());
bot.use(stage.middleware());
bot.use((ctx, next) => {
  console.log(ctx);
  return next();
});

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(PORT, () => {
//   console.log(`Example app listening at http://localhost:${PORT}`);
// });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
