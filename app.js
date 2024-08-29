if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
    }
    
    const express=require("express");
    const app=express();
    const mongoose=require("mongoose");
    const listingroutes=require("./routers/listing.js");
    const reviewroutes=require("./routers/reviews.js");
    const signupuser=require("./routers/signupuser.js")
    const path=require("path");
    const methodoverride=require("method-override");
    const ejsmate=require("ejs-mate");
    const Expresserror=require("./utils/expresserror.js");
    const session=require("express-session");
    const MongoStore=require("connect-mongo")
    const flash=require("connect-flash");
    const passport=require("passport");
    const localStrategy=require("passport-local");
    const User=require("./models/users.js");
    const MONGO_URL=process.env.Atlasdb_url;
    
    main().then(()=>{
        console.log("db connected")
    }).catch(err => console.log("error while connecting db"));
    
    async function main() {
      await mongoose.connect(MONGO_URL);
    
      
    };
    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.json())
    app.use(express.urlencoded({extended:true}));
    app.use(methodoverride("_method"));
    app.use(express.static(path.join(__dirname,"/public")));
    app.engine('ejs',ejsmate);
    
    const store=MongoStore.create({
        mongoUrl:MONGO_URL,
        crypto:{
            secret:process.env.Secret,
        },
        touchAfter:24 *3600,
    });
store.on("error",() =>{
console.log("error in mongo session store",err);
});

// in store variable,now my information of session storage is present in mongo atlas in the giving mongourl provided by atlas
    const sessionOptions={
        store,
        secret:process.env.Secret,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now() +7 *24 *60 *60 *1000,
            maxAge:7 *24 *60 *60 *1000,
            httpOnly:true,
        },
    };


    app.use(session(sessionOptions));
    app.use(flash());
    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    
    app.use((req,res,next)=>{
        res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
        res.locals.currUser=req.user;
        console.log(res.locals.curruser);
        next();
        //res.locals.success returns an array[]
    });
    
    
    
    // demouseraccount
    // app.get("/demouser",async(req,res)=>{
    //     let fakeuser=new User({
    //         email:"awais@gmail",
    //         username:"awais",
    //     })
    //     let registerduser=await User.register(fakeuser,"helloworld");
    //     console.log(registerduser);
    //     res.send(registerduser)
    // })
    // app.use("/listings", (req, res, next) => {
    //     console.log("Listings route hit");
    //     next();
    //   });
    app.use("/",listingroutes);
    app.use("/listings",listingroutes);
    app.use("/listings/:id/reviews",reviewroutes)
    app.use("/",signupuser);

    
      
    
    // error handling through  epress error
    app.all("*",(req,res,next)=>{
        next(new Expresserror(404,"page not found"))
    });
    app.use((err,req,res,next)=>{
        let {statuscode=500,message="something went wrong"}=err;
        res.status(statuscode).send(message)
    })
    
    // midlleware for server side handling through custom errors//
    // app.use((err,req,res,next)=>{
    //     res.send("something went wrong")
    // })
    
       
    
    
    app.listen(8080,()=>{
        console.log("server is connected on port 8080")
    });