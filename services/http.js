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
    console.log(error);
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
    console.log(error);
  }
};

const listStates = async () => {
  const API_URL = `${BASE_URL}admin/location/states`;
  try {
    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
      },
    };
    const response = await got(API_URL, options);
    return response && response.body;
  } catch (error) {
    console.log(error);
  }
};

const listDistricts = async (districtID) => {
  const API_URL = `${BASE_URL}admin/location/districts/${districtID}`;
  try {
    const response = await got(API_URL);
    return response && response.body;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  findSlot,
  listStates,
  listDistricts,
  findSlotByZip,
};
