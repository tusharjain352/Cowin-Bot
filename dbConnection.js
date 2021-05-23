const mongoose = require("mongoose");
let url;

if (process.env.NODE_ENV === "production") {
  url =
    "mongodb+srv://tushar:jain123@cowincluster.0ib1s.mongodb.net/cowin?retryWrites=true&w=majority";
} else {
  url = "mongodb://127.0.0.1/cowin";
}

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
