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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
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
