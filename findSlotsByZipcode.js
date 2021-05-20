const apiController = require("./services/http");
const helper = require("./helper");

const calendarInst = require("./calendar");

const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");

const zipcodeScene = new Scenes.WizardScene(
  "check_slots_by_pincode",
  (ctx) => {
    ctx.reply("Please, enter your zipcode");
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.wizard.state && ctx.wizard.state.invalidCalendarInput) {
      ctx.reply(`Sorry, I did not understand. \n Please enter zipcode again`);
      ctx.wizard.state.invalidCalendarInput = false;
      return;
    }
    if (ctx.message.text.length != 6 || isNaN(ctx.message.text)) {
      ctx.reply("Please enter valid zipcode");
      return;
    }

    ctx.wizard.state.zipcode = ctx.message.text;
    const calendar = calendarInst.getCalendar();
    const today = new Date();
    const minDate = new Date();
    minDate.setMonth(today.getMonth() - 2);
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 2);
    maxDate.setDate(today.getDate());

    ctx.reply(
      `I have set your zipcode preference to ${ctx.wizard.state.zipcode}.Please select date for slots availability`,
      calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    try {
      if (ctx.message && ctx.message.text) {
        ctx.wizard.back();
        ctx.wizard.state.invalidCalendarInput = true;
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);
      }

      let slotDate = ctx.update.callback_query.data;
      slotDate = helper.filterCalendarDate(slotDate);
      const slotZip = ctx.wizard.state.zipcode;

      let { sessions } = await apiController.findSlotByZip(slotZip, slotDate);
      sessions = helper.filterAvailableSlots(sessions);

      if (sessions && sessions.length > 0) {
        const availableSlots = helper.getSlotList(sessions);

        for (let i = 0; i < availableSlots.length; i++) {
          await ctx.reply(availableSlots[i]);
        }
      } else {
        ctx.reply(
          `No Slots are available for ${slotDate}, Please try later ! Thank you for your time`
        );
      }

      ctx.wizard.state = {};
      return ctx.scene.leave();
    } catch (e) {
      ctx.reply("Sorry, I did not understand. Please try again", e);
      return ctx.scene.leave();
    }
  }
);

module.exports = {
  zipcodeScene,
};
