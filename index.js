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
const PORT = process.env.NODE_PORT || 3000;

const token =
  process.env.BOT_TOKEN || "1788105136:AAHIiTSo39OtkSLlVrfyGz-mjmj4NvlWKA0";

let stage, bot;
try {
  if (process.env.NODE_ENV === "production") {
    bot = new Telegraf(token);
    bot.setWebHook(process.env.HEROKU_URL + token);
  } else {
    bot = new Telegraf(token);
  }

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
