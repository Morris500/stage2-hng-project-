require("dotenv").config();
const express = require("express");
const bodyparser = require ('body-parser');
const pg = require("pg");
//const consolidate = require("consolidate");
const { Sequelize } = require('sequelize');
const {ulid} = require("ulid");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRound = 10;

const app = express();
const PORT = 3000;

//middleware
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieparser());




// Option 3: Passing parameters separately (other dialects)
const DB = new Sequelize('hng-stage2', 'morris', '*****', {
  host: 'localhost',
  dialect:  'postgres',
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

DB.authenticate()
.then(()=> {console.log("database connected")})
.catch((err)=> {console.log({err:"error in authenticating"})})


const User = DB.define("User", {
    userId: {
        type: Sequelize.STRING,
        defaultValue: () =>ulid(), 
        primaryKey: true,
        unique: true,
        allowNull: false

    },
    firstname: {
       type: Sequelize.STRING, 
        required: true

    },
    lastname: {
        type: Sequelize.STRING,
         required: true
    },
    email: {
        type: Sequelize.STRING, 
        required: true
     },
    password: {
        type: Sequelize.STRING,
        required: true
    },
   phone:{
    type: Sequelize.STRING 
}

});

const Organization = DB.define("organization", {
orgId:{
    type: Sequelize.STRING, 
    required: true,
     unique: true
},
name: {
    type: Sequelize.STRING, 
    required: true
},
description:{
    type: Sequelize.STRING
},
userId: {
    type: Sequelize.STRING, }

});
app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.get("/login", (req,res) => {
res.sendFile(__dirname + "/login.html")

})
app.get("/api/users/:id", (req, res)=> {
    
});
app.post("/auth/register", (req, res) => {
const firstname = req.body.firstname;
const lastname = req.body.lastname;
const email = req.body.email;
const phone = req.body.phone;
 
// hashing password field
// bcrypt.hash(req.body.password, saltRound).then((hash)=> {
// User.create({
//     firstname,
//     lastname,
//     email,
//     password: hash,
//     phone
// }).then((data)=>{
//     const token = jwt.sign(data.userId , "secret",{
        
//      });
//      res.cookie("jwt", token, {httpOnly: true})
// res.json({
//     status: "success",
//     message:"Registrstion successful",
//     data:{accessToken: token,
//         user:{
//             userid: data.userId,
//             firstName: firstname,
//             lastName: lastname,
//             email: email,
//             phone: phone

//         }
//     }

// })
// .catch((err)=>{ console.log(err)
//     res.json({
//         status: "Bad request",
//         message:"Registration unsuccessful",
//         statusCode: res.statusCode
//     })
// });

// })
// })
});
app.post("/auth/login", async (req, res) => {
try {
    const user = await User.findAll({email: req.body.email})
    user.forEach(async (element) => {
       const password = await bcrypt.compare(req.body.password,element.password)
       if (element.email==req.body.email && password == true ) {
        console.log("good")
        return user;
       }
    })   
    
} catch (error) {
    
}

//User.findAll().then((data)=> console.log(data))
});
app.post("/api/organisations", (req, res)=> {
    
});
app.get("/api/organisation/:orgid", (req, res)=> {
    
});
app.post("/api/organisation/:orgid", (req, res)=> {
    
});
app.post("/api/organisations/:orgid/users", (req, res)=> {
    
});


app.listen(PORT, (req, res)=> { console.log(`server is connect at port ${PORT}`)})