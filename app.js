require("dotenv").config();
const express = require("express");
const bodyparser = require ('body-parser');
const pg = require("pg");
//const consolidate = require("consolidate");
const { Sequelize, UnknownConstraintError, where } = require('sequelize');
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
const DB = new Sequelize('hng-stage2', 'morris', process.env.DB_PASSKEY, {
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

const Organization = DB.define("Organization", {
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
app.get("/api/users/:id",async (req, res)=> {
    try {
    const id = req.params.id;
   // const user_id = req.user.userId;
    console.log(id);
    //console.log(user_id);
    const user = await User.findOne({
        where: {userId: id}
    })
    console.log(user);
    const organisation = await Organization.findOne({
        where: {userId: id}
    })
    if (!user) {
     res.status(404).json({
        status: "error",
        message: " no user found",
        statusCode:"404"
    });

    } else {
        res.send({
            status: "success",
            message: "user found",
            data:{
                userId: id,
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email,
                phone: user.phone,
                organisation
            }
        })
    
    }
} catch (error) {
    res.json({
        status: error,
        message:"Server error",
        statusCode: res.statusCode
    })  
}


});

app.post("/auth/register", async (req, res) => {
const firstname = req.body.firstname;
const lastname = req.body.lastname;
const email = req.body.email;
const phone = req.body.phone;
const foundUser = await User.findAll({where: {email: email}})

console.log(req.user);
 if (foundUser.length > 0) {
    res.send("email already exits try again with a different email")
 } else {
   //hashing password field
   
bcrypt.hash(req.body.password, saltRound).then((hash)=> {
User.create({
    firstname,
    lastname,
    email,
    password: hash,
    phone
}).then((data)=>{
    const token = jwt.sign(data.userId , "secret",{
        
     });
     res.cookie("jwt", token, {httpOnly: true})
res.json({
    status: "success",
    message:"Registrstion successful",
    data:{accessToken: token,
        user:{
            userId: data.userId,
            firstName: firstname,
            lastName: lastname,
            email: email,
            phone: phone

        }
    }

})
.catch((err)=>{ console.log(err)
    res.json({
        status: "Bad request",
        message:"Registration unsuccessful",
        statusCode: res.statusCode
    })
});

})
})
 }

});
app.post("/auth/login", async (req, res) => {
try {
    const user = await User.findAll({email: req.body.email})
    user.forEach(async (element) => {
       const password = await bcrypt.compare(req.body.password,element.password)
       if (element.email==req.body.email && password == true ) {
        console.log("good")
        //return user;
         token = jwt.sign(element.userId , "secret",{
        
                  });
                 res.cookie("jwt", token, {httpOnly: true})
        res.json({
                status: "success",
                message:"Login successful",
                data:{accessToken: token,
                    user:{
                        userId: element.userId,
                        firstName: element.firstname,
                        lastName: element.lastname,
                        email: element.email,
                        phone: element.phone,
                       statusCode: res.statusCode
            
                    }
                }
            
             })
       }
    })   
    
} catch (error) {
    res.json({
                status: "Bad request",
                message:"Authentication failed",
                statusCode: res.statusCode
            })
}

//User.findAll().then((data)=> console.log(data))
});
app.post("/api/organisations", async (req, res)=> {
    const orgname = req.body.name;
    const orgdescription = req.body.description;
    try {
        if (!orgname || !orgdescription) {
            res.send({
                status: "error",
                message : "please enter organisation name or description",
                statuscode: res.statusCode
            });
        }
        const orgData = await Organization.create({
            orgId :  () =>ulid(), 
             name: orgname,
            description:orgdescription,
            userId: use
        })
    } catch (error) {
        res.json({
            status: "Bad Request",
            message:"Client error",
            statusCode: res.statusCode
        })  
    }
});
app.get("/api/organisation/:orgid",async (req, res)=> {
    const id = req.params.orgid;
    try {
        const organisation = await Organization.findOne({
            where: {orgId: id}
        })
        if (!organisation) {
         res.status(404).json({
            status: "error",
            message: " no organisation found",
            statusCode:"404"
        });
    
        } else {
            res.send({
                status: "success",
                message: "organisation found",
                data:{
                    orgId: id,
                    namme:  ,
                    description: organisation.description
                }
            })
        
        }
    } catch (error) {
        res.json({
            status: error,
            message:"Server error",
            statusCode: res.statusCode
        })  
    }
    
});
app.post("/api/organisation/:orgid", (req, res)=> {
    
});
app.post("/api/organisations/:orgid/users", (req, res)=> {
    
});


app.listen(PORT, (req, res)=> { console.log(`server is connect at port ${PORT}`)})