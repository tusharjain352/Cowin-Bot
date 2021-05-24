const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");
//const db = require("./dbConnection");
//const calen = require("./calendar");
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

try {
  let stage;
  var bot = new Telegraf(BOT_TOKEN);
  //calen.intiateCalendar(bot);

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

  bot
    .launch({
      webhook: {
        domain: URL,
        port: PORT,
      },
    })
    .catch((e) => console.log("CDM exception", e));

  bot.catch((err, ctx) => {
    console.log("Error in bot:", err);
    return ctx.scene.enter("Default_Error");
  });

  bot
    .command("help", (ctx) => {
      ctx.reply(`💡 Help \n
    This bot will help you to see current available slots by checking CoWin website. To start, click on "Check Open Slots".\n
    `);
    })
    .catch((e) => console.log("CDM exception", e));

  // bot.use(session());
  // bot.use(stage.middleware());
} catch (e) {
  console.log("BOT INTIALIZATION EXCEPTION", e);
}

// Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
