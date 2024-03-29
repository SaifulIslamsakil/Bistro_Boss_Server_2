require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

// VNfd2AKDkj4BqcYK
app.use(express.json())
app.use(cors())



const uri = "mongodb+srv://Bistro_Boss_2:VNfd2AKDkj4BqcYK@bistoboss.7ys6amt.mongodb.net/?retryWrites=true&w=majority&appName=BistoBoss";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const ManuCollaction = client.db("BistroBoss").collection("Menus")
        const ReviwsCollaction = client.db("BistroBoss").collection("Review")
        const UserCollaction = client.db("BistroBoss").collection("User")
        const CardCollaction = client.db("BistroBoss").collection("Card")
        app.get("/menus", async (req, res) => {
            const result = await ManuCollaction.find().toArray()
            res.send(result)
        })
        app.get("/review", async (req, res) => {
            const result = await ReviwsCollaction.find().toArray()
            res.send(result)
        })
        app.post("/user", async (req,res)=>{
            const body = req.body
            const result = await UserCollaction.insertOne(body)
            res.send(result)
        })
        app.post("/card", async (req, res)=>{
            const body = req.body
            const result = await CardCollaction.insertOne(body)
            res.send(result)
        })
        app.get("/card", async (req,res)=>{
            const email = req.query.email
            const query = {userEmail:email}
            const result = await CardCollaction.find(query).toArray()
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
    res.send("Boss is chiting")
})

app.listen(port, () => {
    console.log(`boss is running on post ${port}`)
})
