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
    choice_id: {type: Number, required: true}
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

app.get("/questions", (req, res) => {
    return ChoiceModel.find({}).then((users) => {
        res.json(users)
    })
})

app.post("/users/opinion", (req, res) => {
    return ChoiceModel.find({}).then((users) => {
        res.json(users)
    })
})

app.listen(3000, () => {
    console.log("The server is running")
})

