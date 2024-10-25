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


// app.post("/admin/add-gym", async (req, res) => {
//     try {
//         let input = req.body; // Get the gym details from the request body
//         // console.log("input")
//         // Create a new gym instance with the input data
//         let gym = new gymModel({
//             name: input.name,
//             location: input.location,
//             price: input.price,
//             equipments: input.equipments, // Ensure this is an array if you're passing multiple equipments
//             rating: input.rating || null, // Optional field, will be null if not provided
//             images: input.images || [] // Optional field for images, set to an empty array if not provided
//         });

//         // Save the gym details in MongoDB
//         await gym.save();

//         // Send a success response to the admin
//         res.json({ "status": "success", "gym": gym });
//     } catch (error) {
//         // Handle errors and send an error response
//         res.status(500).json({ "status": "error", "message": error.message });
//     }
// });

app.post("/admin/add-gym", async (req, res) => {
    try {
        let input = req.body; // Get the gym details from the request body
        // console.log(input)
        
        // Create a new gym instance with the input data
        let gym = new gymModel({
            name: input.name,
            location: input.location,
            price: input.price,
            equipments: input.equipments, // Ensure this is an array if you're passing multiple equipments
            rating: input.rating || null, // Optional field, will be null if not provided
            images: input.images || [], // Optional field for images, set to an empty array if not provided
            latitude: input.latitude, // Extract latitude from input
            longitude: input.longitude, // Extract longitude from input
            equipments: input.equipments,
            specialFacilities: input.specialFacilities,
            classesOffered: input.classesOffered,
            personalTrainers: input.personalTrainers,
            lockerRoom: input.lockerRoom,
            showers: input.showers
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


// app.get("/gyms", async (req, res) => {
//     try {
//         // Fetch all gyms from the database
//         let gyms = await gymModel.find({}, 'name location price rating images latitude longitude'); // Select only the fields you need
//         res.json({ status: "success", gyms });
//     } catch (error) {
//         res.status(500).json({ status: "error", message: error.message });
//     }
// });

app.get("/gyms", async (req, res) => {
    try {
        const searchQuery = req.query.location || ""; // Get the 'location' query parameter, if provided

        let gyms;
        if (searchQuery) {
            // If a search query is provided, filter gyms by location (case-insensitive)
            gyms = await gymModel.find(
                { location: { $regex: searchQuery, $options: "i" } }, 
                'name location price rating images latitude longitude'
            );
        } else {
            // If no search query is provided, return all gyms
            gyms = await gymModel.find({}, 'name location price rating images latitude longitude equipments specialFacilities classesOffered personalTrainers lockerRoom showers');
        }

        res.json({ status: "success", gyms });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


app.get("/gyms/:id", async (req, res) => {
    try {
      const gymId = req.params.id;
      const gym = await gymModel.findById(gymId);
      if (!gym) {
        return res.status(404).json({ status: "error", message: "Gym not found" });
      }
      res.json({ status: "success", gym });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });


//   app.post("/gyms/:id/rate", async (req, res) => {
//     try {
//         if (isNaN(rating) || rating < 1 || rating > 5) {
//             return res.status(400).json({ status: "error", message: "Invalid rating value. Rating must be a number between 1 and 5." });
//           }
          

//         const gymId = req.params.id;
//         const { userId, rating } = req.body;

//         // Validate rating value
//         if (rating < 1 || rating > 5) {
//             return res.status(400).json({ status: "error", message: "Rating must be between 1 and 5." });
//         }

//         // Find the gym and add or update user's rating
//         const gym = await gymModel.findById(gymId);
//         if (!gym) {
//             return res.status(404).json({ status: "error", message: "Gym not found." });
//         }

//         // Check if the user has already rated this gym
//         const existingRating = gym.ratings.find((r) => r.userId.toString() === userId);
//         if (existingRating) {
//             existingRating.rating = rating;  // Update existing rating
//         } else {
//             gym.ratings.push({ userId, rating });  // Add new rating
//         }

//         // Calculate the new average rating
//         const totalRatings = gym.ratings.length;
//         const avgRating = gym.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
//         gym.rating = avgRating;  // Update average rating

//         await gym.save();  // Save the updated gym

//         res.json({ status: "success", message: "Rating added successfully.", gym });
//     } catch (error) {
//         res.status(500).json({ status: "error", message: error.message });
//     }
// });

  
app.post("/gyms/:id/rate", async (req, res) => {
    try {
        const gymId = req.params.id;
        const { userId, userRating } = req.body; // Rename `rating` to `userRating`

        // Validate the userRating value
        if (userRating < 1 || userRating > 5) {
            return res.status(400).json({ status: "error", message: "Rating must be between 1 and 5." });
        }

        // Find the gym by ID
        const gym = await gymModel.findById(gymId);
        if (!gym) {
            return res.status(404).json({ status: "error", message: "Gym not found." });
        }

        // Check if the user has already rated this gym
        const existingRating = gym.ratings.find((r) => r.userId.toString() === userId);
        if (existingRating) {
            // Update the existing rating
            existingRating.rating = userRating;
        } else {
            // Add a new rating
            gym.ratings.push({ userId, rating: userRating });
        }

        // Recalculate the average rating only if there are ratings
        let avgRating = 0;
        if (gym.ratings.length > 0) {
            const totalRatings = gym.ratings.length;
            avgRating = gym.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
        }
        gym.rating = avgRating; // Update the average rating field

        // Save the updated gym
        await gym.save();

        res.json({
            status: "success",
            message: "Rating added successfully.",
            avgRating: gym.rating,
            totalRatings: gym.ratings.length,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


//after rating

app.get("/users", async (req, res) => {
    try {
        // Fetch only name and email for all users
        const users = await userModel.find({}, 'name email');
        res.json({ status: "success", users });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        // Find the user by ID and project only the name and email fields
        const user = await userModel.findById(userId, 'name email');
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        res.json({ status: "success", user });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});



app.listen(8080,()=>{
    console.log("Server started")
})