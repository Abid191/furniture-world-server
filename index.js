const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000 


// middleWare

app.use(express.json())
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvgdhvd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const furnitureCollection = client.db("furnitureWorldDB").collection("furniture")
    const cartCollection = client.db("furnitureWorldDB").collection("cart")

    app.get('/furniture',async (req,res)=>{
        const result = await furnitureCollection.find().toArray()
        res.send(result)
    })
    app.get('/furniture/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const options = {
        projection: { name:1, price: 1, img: 1 },
      };
      const result = await furnitureCollection.findOne(query,options)
      res.send(result)
    })

    app.get('/cart',async(req,res)=>{
      const email = req.query.email 
      if(!email){
        res.send([])
      }
      const query = {email: email}
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/cart',async(req,res)=>{
      const item = req.body 
      console.log(item)
      const result = await cartCollection.insertOne(item)
      res.send(result)
    })

    app.delete('/cart/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get( '/', (req,res)=>{
    res.send('furniture World is sitting')
})

app.listen(port, ()=>{
    console.log(`furniture world sitting on port ${port}`)
})