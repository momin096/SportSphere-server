const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tp3bo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});





async function run() {
    try {
        app.get('/', (req, res) => {
            res.send('coffee server running')
        })

        const productCollection = client.db('sport-sphere').collection('products');

        // create a product
        app.post('/all-products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })

        // get all data
        app.get('/all-products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });

        // get a data for update 
        app.get('/my-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // update my product 
        app.put('/my-products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    item_name: updatedProduct.item_name,
                    photo: updatedProduct.photo,
                    price: updatedProduct.price,
                    category: updatedProduct.category,
                    rating: updatedProduct.rating,
                    customize: updatedProduct.customize,
                    delivery_time: updatedProduct.delivery_time,
                    quantity: updatedProduct.quantity,
                    description: updatedProduct.description,
                }
            }

            const result = await productCollection.updateOne(filter, product);
            res.send(result);
        })

        // get specific data
        app.get('/my-products', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const result = await productCollection.find(query).toArray();
            res.json(result);
        });

        // get a product 
        app.get('/all-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // delete a product 
        app.delete('/my-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        app.listen(port, () => {
            // console.log(`server is running on port ${port}`);

        })


        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();

    }
}
run();