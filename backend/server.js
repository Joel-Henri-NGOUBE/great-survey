import express from "express"
import mongoose from "mongoose";

const app = express()

const dbUri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xng7q05.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbUri, {
    dbName: "survey"
})

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    mail: {type: String, required: true},
    age: {type: Number},
    choiceId: {type: mongoose.Schema.Types.ObjectId, required: true}
})

const ChoiceSchema = new mongoose.Schema({
    label: {type: String, required: true},
})

const UserModel = mongoose.model('User', UserSchema)

const ChoiceModel = mongoose.model('Choice', ChoiceSchema)

ChoiceModel.find().then((choices) => {
    if(!choices.length){
            
        ChoiceModel.insertMany([
            {
                label: "Capitalisme"
            },
            {
                label: "Socialisme"
            },
            {
                label: "Communisme"
            },
            {
                label: "Libéralisme"
            }]
        )
    }
})

app.get("/choices", (req, res) => {
    console.log( ChoiceModel.find({}).then((users) => {
        res.json(users)
    }))
})

app.use(express.json())

app.post("/users/opinion", async (req, res) => {
    try {
        const {username, mail, age, choiceId} = req?.body

        if(username && mail && choiceId){

            const user = await UserModel.find({
                username: username
            })

            let storedChoiceId = 0

            try {
                storedChoiceId = await ChoiceModel.findById(choiceId) 
            } catch (error) {
                return res.json({"message": "Some important data has been altered", "error": error})
            }

            if(!user.length){
                UserModel.insertOne(
                    !age 
                    ?
                    {
                        username: username,
                        mail: mail,
                        choiceId: choiceId
                    }
                    :
                    {
                        username: username,
                        mail: mail,
                        age: age,
                        choiceId: choiceId
                    }
                )
            }
            else{
                throw new Error("You've already given your opinion about the question! Chill out!")
            }
            return res.json({
                "message": "You've successfully given your opinion !"
            })
        }
        else{
            throw new Error("Something is wrong with the entered credentials! Please try again")
        }
        
    } catch (error) {
        return res.json({"error": error.message ? error.message : error})
    }
})

app.listen(3000, () => {
    console.log("The server is running")
})

