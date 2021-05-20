const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");
const db = require("./dbConnection");
const calen = require("./calendar");
const welcomeUser = require("./welcomeUser");
const slotByState = require("./findSlotsByState");
const slotByZipcode = require("./findSlotsByZipcode");

const express = require("express");
const app = express();

const token =
  process.env.BOT_TOKEN || "1788105136:AAGlGEuQI796D1Sk-aeTUmnRW-bIIJ9wRzE";

var bot = new Telegraf(token);

calen.intiateCalendar(bot);

const stage = new Scenes.Stage(
  [
    welcomeUser.welcomeScene,
    slotByState.stateScene,
    slotByZipcode.zipcodeScene,
  ],
  {
    default: "welcome",
  }
);

bot.catch((err, ctx) => {
  console.log("Error in bot:", err);
  ctx.reply("Sorry, I did not understand. Please try again");
  return ctx.scene.leave();
});

bot.command("help", (ctx) => {
  ctx.reply(`💡 Help \n
  This bot will help you to see current available slots by checking CoWin website. To start, click on "Check Open Slots".\n
  `);
});

bot.use(session());
bot.use(stage.middleware());

bot.launch();

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
