const got = require("got");

const BASE_URL = "https://cdn-api.co-vin.in/api/v2/";

const findSlot = async (DISTRICT_ID, APPOINTMENT_DATE) => {
  const API_URL = `${BASE_URL}appointment/sessions/public/findByDistrict?district_id=${DISTRICT_ID}&date=${APPOINTMENT_DATE}`;

  try {
    const response = await got(API_URL);
    const availableSlots = JSON.parse(response.body);
    //console.log("slotsbystate", availableSlots);
    return availableSlots;
  } catch (error) {
    console.error(error);
  }
};

const findSlotByZip = async (ZIPCODE, APPOINTMENT_DATE) => {
  const API_URL = `${BASE_URL}appointment/sessions/public/findByPin?pincode=${ZIPCODE}&date=${APPOINTMENT_DATE}`;

  try {
    const response = await got(API_URL);
    const availableSlots = JSON.parse(response.body);
    //console.log("slotsbyzip", availableSlots);
    return availableSlots;
  } catch (error) {
    console.error(error);
  }
};

const listStates = async () => {
  const API_URL = `${BASE_URL}admin/location/states`;
  try {
    const response = await got(API_URL);
    return response && response.body;
  } catch (e) {
    console.error(error);
  }
};

const listDistricts = async (districtID) => {
  const API_URL = `${BASE_URL}admin/location/districts/${districtID}`;
  try {
    const response = await got(API_URL);
    return response && response.body;
  } catch (e) {
    console.error(error);
  }
};

module.exports = {
  findSlot,
  listStates,
  listDistricts,
  findSlotByZip,
};
