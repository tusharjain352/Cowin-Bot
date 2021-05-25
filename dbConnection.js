const mongoose = require("mongoose");
let url;

if (process.env.NODE_ENV === "production") {
  // url =
  //   "mongodb+srv://tushar:jain123@covidinhelp.0ib1s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  url ="mongodb://tushar:jain123@covidinhelp-shard-00-01.0ib1s.mongodb.net:27017,covidinhelp-shard-00-00.0ib1s.mongodb.net:27017,covidinhelp-shard-00-02.0ib1s.mongodb.net:27017/myFirstDatabase?ssl=true&authSource=admin&replicaSet=CovidInHelp&retryWrites=true&w=majority"
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
