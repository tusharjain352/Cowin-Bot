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
  process.env.BOT_TOKEN || "1788105136:AAHIiTSo39OtkSLlVrfyGz-mjmj4NvlWKA0";

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://your-heroku-app.herokuapp.com";

const BOT_OPTIONS = {
  telegram: {
    // Telegram options
    agent: null, // https.Agent instance, allows custom proxy, certificate, keep alive, etc.
    webhookReply: true, // Reply via webhook
  },
};

let stage;

try {
  var bot = new Telegraf(BOT_TOKEN, [BOT_OPTIONS]);
  bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
  bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT);

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

bot.launch();

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(PORT, () => {
//   console.log(`Example app listening at http://localhost:${PORT}`);
// });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
