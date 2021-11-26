const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpyzm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('travel_agency')
        const placeCollection = database.collection('places');
        const resortCollection = database.collection('resorts');
        const myPackagesCollection = database.collection('myPackages');

        //get places api 
        app.get('/places', async (req, res) => {
            const cursor = placeCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        })
        app.get('/resorts', async (req, res) => {
            const cursor = resortCollection.find({});
            const resorts = await cursor.toArray();
            res.send(resorts);

        })
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const place = await placeCollection.findOne(query);
            console.log('load user with id', id);
            res.send(place);
        })

        //post api 
        app.post('/places', async (req, res) => {
            const newPlace = req.body
            const result = await placeCollection.insertOne(newPlace);
            console.log('hitting the post', req.body);
            console.log('added place', result);
            res.json(result);

        });


        //get a api 
        app.get('/myPackages', async (req, res) => {
            const cursor = myPackagesCollection.find({});
            const myPackages = await cursor.toArray();
            res.send(myPackages);
        })

        //post api 
        app.post('/myPackages', async (req, res) => {
            const myPackages = req.body;
            console.log('hit the post api', myPackages);
            const result = await myPackagesCollection.insertOne(myPackages)
            console.log(result);
            res.json(result)
        });

        //Delete api 

        app.delete('/myPackages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleting user with id', id);
            const query = { _id: ObjectId(id) }
            const result = await myPackagesCollection.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result);
        })

    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('running my tour server')
});

app.listen(port, () => {
    console.log('running my travel agency on port', port);
})