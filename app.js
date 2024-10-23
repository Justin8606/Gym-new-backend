const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const user = require("./models/user")
const {userModel} = require("./models/user")

const gym = require("./models/gym")
const {gymModel} = require("./models/gym")



const app = express()

app.use(cors())
app.use(express.json())

const generateHashedPassword = async(password)=>{
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)  
}

mongoose.connect("mongodb+srv://justin:nitsuj21@cluster0.3jf2qw3.mongodb.net/gymappdb?retryWrites=true&w=majority&appName=Cluster0")


app.post("/admin/add-gym", async (req, res) => {
    try {
        let input = req.body; // Get the gym details from the request body
        // console.log("input")
        // Create a new gym instance with the input data
        let gym = new gymModel({
            name: input.name,
            location: input.location,
            price: input.price,
            equipments: input.equipments, // Ensure this is an array if you're passing multiple equipments
            rating: input.rating || null, // Optional field, will be null if not provided
            images: input.images || [] // Optional field for images, set to an empty array if not provided
        });

        // Save the gym details in MongoDB
        await gym.save();

        // Send a success response to the admin
        res.json({ "status": "success", "gym": gym });
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ "status": "error", "message": error.message });
    }
});



app.post("/signup",async(req,res)=>{
    let input = req.body

    let hashedPassword = await generateHashedPassword(input.password)
    input.password = hashedPassword

    let user = new userModel(input)
    user.save()

    res.json({"status":"success"})
})

app.post("/signin",(req,res)=>{
    let input = req.body
    userModel.find({"email":input.email}).then(
      (response)=>{
          if (response.length>0) {
              let dbpassword = response[0].password
              bcryptjs.compare(input.password,dbpassword,(error,isMatch)=>{
                  if (isMatch) {
                      jwt.sign({email:input.email},"gym-app",{expiresIn:"1d"},
                          (error,token)=>{
                          if (error) {
                              res.json({"status":"unable to create token"})
                          } else {
                              res.json({"status":"success","userId":response[0]._id,"token":token})
                          }
                      })
                  } else {
                      res.json({"status":"Invalid credentials"})
                  }
              })
          } else {
              res.json({"status":"user not found"})
          }
      }
    ).catch(
      (error)=>{
          res.json(error)
      }
    )  
})


app.get("/gyms", async (req, res) => {
    try {
        // Fetch all gyms from the database
        let gyms = await gymModel.find({}, 'name location price rating images'); // Select only the fields you need
        res.json({ status: "success", gyms });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});




app.listen(8080,()=>{
    console.log("Server started")
})