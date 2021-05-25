const apiController = require("./services/http");
const helper = require("./helper");
const calendarInst = require("./calendar");
const { Telegraf, Markup, session, Scenes, WizardScene } = require("telegraf");

const stateScene = new Scenes.WizardScene(
  "check_slots_by_state", // first argument is Scene_ID, same as for BaseScene
  async (ctx) => {
    // const { states } = JSON.parse(await apiController.listStates());
    const {states} = require("./services/states");
    console.log("States data from COWIN", states);
    const buttons = states.map((st) =>
      Markup.button.callback(st.state_name, st.state_name + "-" + st.state_id)
    );

    await ctx.reply(
      "Please select your state",
      Markup.inlineKeyboard(buttons, { columns: 3 })
    );
    ctx.wizard.state = {};
    return ctx.wizard.next();
  },
  async (ctx) => {
    console.log("print selected state", ctx.update.callback_query.data);
    ctx.deleteMessage();
    const [st_name, selected_state] = ctx.update.callback_query.data.split("-");
    const { districts } = JSON.parse(
      await apiController.listDistricts(selected_state)
    );
    console.log("Districts from Cowin", districts);

    const buttons = districts.map((dst) =>
      Markup.button.callback(
        dst.district_name,
        dst.district_name + "-" + dst.district_id
      )
    );

   await ctx.reply(
      `I have set your state preference to ${st_name}✔️.Please select your district`,
      Markup.inlineKeyboard(buttons, { columns: 3 })
    );
    ctx.wizard.state = {};
    return ctx.wizard.next();
  },
  async (ctx) => {
    //ctx.deleteMessage();

    if (ctx.wizard.state && ctx.wizard.state.invalidCalendarInput) {
      await ctx.reply(`Sorry, I did not understand 🙃. ! \n Please try again`);
      ctx.wizard.state.invalidCalendarInput = false;
    } else {
      let [
        district_name,
        selected_district,
      ] = ctx.update.callback_query.data.split("-");
      ctx.wizard.state.selected_district = selected_district;
      ctx.wizard.state.district_name = district_name;
    }

    const calendar = calendarInst.getCalendar();
    const today = new Date();
    const minDate = new Date();
    minDate.setMonth(today.getMonth() - 2);
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 2);
    maxDate.setDate(today.getDate());

    await ctx.reply(
      `I have set your district preference to ${ctx.wizard.state.district_name} ✔️.Please select date for slots availability`,
      calendar.setMinDate(minDate).setMaxDate(maxDate).getCalendar()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    //ctx.deleteMessage();
    if (ctx.message && ctx.message.text) {
      ctx.wizard.back();
      ctx.wizard.state.invalidCalendarInput = true;
      return ctx.wizard.steps[ctx.wizard.cursor](ctx);
    }
    let slotDate = ctx.update.callback_query.data;
    slotDate = helper.filterCalendarDate(slotDate);

    const selected_district = ctx.wizard.state.selected_district;
    let { sessions } = await apiController.findSlot(
      selected_district,
      slotDate
    );
    sessions = helper.filterAvailableSlots(sessions);
    if (sessions && sessions.length > 0) {
      const availableSlots = helper.getSlotList(sessions);

      for (let i = 0; i < availableSlots.length; i++) {
        await ctx.reply(availableSlots[i]);
      }
      //ctx.reply("Anything else ");
    } else {
      ctx.reply(
        `No Slots are available for ${slotDate}, Please try later 😔 ! Thank you for your time`
      );
    }

    ctx.wizard.state.contactData = {};
    return ctx.scene.leave();
  }
);

module.exports = {
  stateScene,
};
