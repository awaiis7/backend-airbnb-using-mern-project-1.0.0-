const mongoose=require("mongoose");
const initdata=require("./data");
const listings=require("../models/listing");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("db connected")
}).catch(err => console.log("error while connecting db"));

async function main() {
  await mongoose.connect(MONGO_URL);

  
};
const initdb=async()=>{
    await listings.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owners:"66b0244531fb58f0e6cc04bc"}))
    await listings.insertMany(initdata.data);
    console.log("data was initialized")
};
initdb();