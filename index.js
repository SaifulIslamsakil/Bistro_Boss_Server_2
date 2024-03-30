require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.PORT || 5000


app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@bistoboss.7ys6amt.mongodb.net/?retryWrites=true&w=majority&appName=BistoBoss`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// middelWare
const tokenVarifay = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ messses: "forbinen" })
    }
    const token = req.headers.authorization.split(' ')[1]
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ messses: "forbinen" })
            }
            req.user = decoded
            next()
        })
    }
}

async function run() {
    try {
        await client.connect();
        const MenuCollaction = client.db("BistroBoss").collection("Menus")
        const ReviwsCollaction = client.db("BistroBoss").collection("Review")
        const UserCollaction = client.db("BistroBoss").collection("User")
        const CardCollaction = client.db("BistroBoss").collection("Card")
        app.post("/jwt", async (req, res) => {
            const email = req.body;
            const token = jwt.sign(email, process.env.SECRET, {
                expiresIn: "1h"
            })
            res.send({ token })
        })
        app.get("/menus", async (req, res) => {
            const result = await MenuCollaction.find().toArray()
            res.send(result)
        })
        app.delete("/manu_item_delete/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await MenuCollaction.deleteOne(query)
            res.send(result)
        })
        app.get("/menu/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await MenuCollaction.findOne(query)
            res.send(result)
        })
        app.patch("/update_menu/:id", async (req, res) => {
            const id = req.params.id
            const body = req.body
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    name: body.name,
                    price: body.price,
                    category: body.category,
                    recipe: body.recipe
                }
            }
            const result = await MenuCollaction.updateOne(query, update)
            res.send(result)

        })
        app.get("/review", async (req, res) => {
            const result = await ReviwsCollaction.find().toArray()
            res.send(result)
        })
        app.post("/user", async (req, res) => {
            const body = req.body
            const result = await UserCollaction.insertOne(body)
            res.send(result)
        })
        app.get("/user", async (req, res) => {
            const result = await UserCollaction.find().toArray()
            res.send(result)
        })
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await UserCollaction.deleteOne(query)
            res.send(result)
        })
        app.patch("/user/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    Role: "Admin"
                }
            }
            const result = await UserCollaction.updateOne(query, update)
            res.send(result)
        })

        app.post("/card", async (req, res) => {
            const body = req.body
            const result = await CardCollaction.insertOne(body)
            res.send(result)
        })
        app.get("/card", async (req, res) => {
            const email = req.query.email
            const query = { userEmail: email }
            const result = await CardCollaction.find(query).toArray()
            res.send(result)
        })
        app.delete("/card/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await CardCollaction.deleteOne(query)
            res.send(result)
        })
        app.post("/add_item", async (req, res) => {
            const body = req.body
            const result = await MenuCollaction.insertOne(body)
            res.send(result)
        })

        // app.post("/create-payment-intent", async (req, res) => {
        //     const { price } = req.body
        //     const amount = parseFloat(price * 100)
        //     console.log(amount)

        //     const paymentIntent = await stripe.paymentIntents.create({
        //         amount: amount,
        //         currency: "usd",
        //         payment_method_types: [
        //             "card"
        //         ],
        //     })
        //     res.send({
        //         clientSecret: paymentIntent.client_secret
        //     })

        // })
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
