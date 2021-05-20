const getDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;
  return today;
};

const filterCalendarDate = (dateString) => {
  let arr = dateString.split("-");
  arr = arr.reverse();
  arr = arr.slice(0, 3);

  return arr.join("-");
};

const filterAvailableSlots = (slots) => {
  const filteredSlots = slots.filter((slot) => slot.available_capacity > 0);
  return filteredSlots;
};

const getSlotList = (sessions) => {
  const slotList = sessions.map((slot) => {
    let slotInfo = `${slot.available_capacity} slots of ${slot.vaccine} @ Rs. ${slot.fee} are available at ${slot.name},${slot.address},${slot.district_name} for age group ${slot.min_age_limit} `;
    return slotInfo;
  });
  return slotList;
};

module.exports = {
  getDate,
  filterCalendarDate,
  filterAvailableSlots,
  getSlotList,
};
