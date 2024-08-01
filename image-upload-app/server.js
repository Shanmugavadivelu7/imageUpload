
const express = require('express');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB connection URL and database name
const url = 'mongodb://localhost:27017/';
const dbName = 'practyz';

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5500', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({ storage: storage });

// Serve the static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle image uploads
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        console.log('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    console.log('File received:', req.file);

    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = db.collection('doctor');

        // Insert the image as binary data in MongoDB
        await collection.insertOne({
            image: req.file.buffer,  // Directly using Buffer
            description: req.body.description || 'No description',
            uploadDate: new Date(),
        });

        console.log('Image uploaded successfully!');
        res.status(200).send('Image uploaded successfully!');
        
        client.close();
    } catch (err) {
        console.log('Error storing image in database:', err);
        res.status(500).send('Error storing image in database.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


