const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017/';
const dbName = 'practyz';

app.use(cors({ origin: 'http://localhost:5500' }));

app.get('/image/:id', async (req, res) => {
    const imageId = req.params.id;

    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection('doctor');

        if (!ObjectId.isValid(imageId)) {
            return res.status(400).send('Invalid image ID.');
        }

        const imageDoc = await collection.findOne({ _id: new ObjectId(imageId) });
        if (!imageDoc || !imageDoc.image) {
            return res.status(404).send('Image not found.');
        }

        res.set('Content-Type', 'image/jpeg'); // Adjust based on your image type
        res.send(imageDoc.image);
        
        client.close();
    } catch (err) {
        console.error('Error retrieving image from database:', err);
        res.status(500).send('Error retrieving image from database.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
