var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();
const aws = require("aws-sdk");
const upload = require("../services/imageUpload");

// Basic CRUD operations
// NOTE : retrieve database instance stored in req.app.locals.db

// GET ALL POSTS
router.get('/', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection("items");
    const cursor = await collection.find();
  
    // check if database has data
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    // await cursor.forEach( item => console.log(item) );
    
    // If require all documents matched by a query to be held in memory at the same time, use toArray()
    cursor.toArray((queryError, results) => {
      // res.json(results);
      res.render('posts', {
        posts: results
      });
    })
  } catch(err) {
    res.json({ message: err });
  }
});

// GET a SPECIFIC POST (logic is mostly same as DELETE)
router.get('/:postId', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection("items");
    const cursor = await collection.find({_id: ObjectID(req.params.postId)});
  
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    // await cursor.forEach( item => console.log(item) );
    
    cursor.toArray((queryError, results) => {
      // res.json(results);
      res.render('single-post', {
        posts: results
      });
    })
  } catch(err) {
    res.json({ message: err });
  }
});

// POST a post
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const item = req.body.item;
    const price = req.body.price;
    // req.file is part of multer. It returns all the info of the image(a lot of unnecessary info). req.file.location gets only the path.
    const location = req.file ? req.file.location : null; 
    const key = req.file ? req.file.key : null; 
    
    const doc = {
      item, 
      price, 
      file: {
        location,
        key,
      }
    };

    if ( (item === '') || (price === '') ){
      // prevent empty submission in backend in case someone try to hack frontend validation
      console.log('===== item value is empty =====');
    } else {
      // if both fields has value, then store in db
      const collection = req.app.locals.db.collection("items");
      const result = await collection.insertOne(doc);

      console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,);
    }

    // redirect seems to be the best practice, but I don't want users to be sent to  other page, so res.redirect('back') works in the scenario
    res.redirect('back');
  } catch(err) {
    res.json({ message: err });
  }
});

// DELETE a post
router.delete('/:postId', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection("items");
    const item = await collection.findOne({_id: ObjectID(req.params.postId)});
    const fileKey = item.file.key;

    // ===== Take care of deleting an item from database ======
    const itemToDelete = collection.deleteOne({_id: ObjectID(req.params.postId)});
    // ==============================================================

    // ===== Take care of deleting a file(such as image) from aws s3 ======
    const s3 = new aws.S3({
      secretAccessKey: process.env.S3_ACCESS_SECRET,
      accessKeyId: process.env.S3_ACCESS_KEY,
      Bucket: "wishman-item-images",
    });
    const params = { 
      Bucket: "wishman-item-images", 
      Key: fileKey
    };
    s3.deleteObject(params, function(err, data) {
      if (err) console.log(err, err.stack);  // error
      else     console.log();                 // deleted
    });
    // =====================================================================

    console.log(`${itemToDelete.deletedCount} item was deleted`,);

    res.send({ message: 'Success' });
  } catch(err) {
    res.json({ message: err });
  }
})

// EDIT page (This is just a page for a specific post)
router.get('/edit/:postId', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection("items");
    const cursor = await collection.find({_id: ObjectID(req.params.postId)});
  
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    // await cursor.forEach( item => console.log(item) );
    
    cursor.toArray((queryError, results) => {
      // res.json(results);
      res.render('edit', {
        posts: results
      });
    })
  } catch(err) {
    res.json({ message: err });
  }
});

// UPDATE (most common and basic)
router.post('/edit/:postId', upload.single('image'), async (req, res, next) => {
  try {
    const item = req.body.item;
    const price = req.body.price;
    // req.file is part of multer. It returns all the info of the image(a lot of unnecessary info). req.file.location gets only the path.
    const location = req.file ? req.file.location : null; 
    const key = req.file ? req.file.key : null; 
    
    const doc = {
      item, 
      price, 
      file: {
        location,
        key,
      }
    };

    console.log("req.file: " + JSON.stringify(req.file));

    if ( (item === '') || (price === '') ){
      console.log('===== item value is empty =====');
    } else {
      const collection = req.app.locals.db.collection("items");
      const updateDocument = { $set: doc };
      const result = await collection.updateOne({_id: ObjectID(req.params.postId)}, updateDocument);

      console.log(`${result.modifiedCount} documents were updated with the _id: ${req.params.postId}`,);
    }

    res.redirect('/posts');
  } catch (err) {
    res.json({ message: err});
  }
})

// SEARCH
router.post('/search', async (req, res, next) => {
  // res.send('sanity check');

  try {
    const collection = req.app.locals.db.collection("items");
    collection.createIndex({ item: "text" });
    const query = { $text: { $search: req.body.search } };

    // filter what field of each matched document. 0 = not return, 1 = return
    // read mongoDB drivers documentation for more details
    const projection = {
      _id: 1,
      item: 1,
      price: 1
    };

    const cursor = await collection.find(query).project(projection);
  
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    
    cursor.toArray((queryError, results) => {
      // res.json(results);
      res.render('posts', {
        posts: results
      });
    })
  } catch(err) {
    res.json({ message: err });
  }
})

// Re-upload image
router.post("/:postId/upload", upload.single('image'), async (req, res, next) => {
  try {
    console.log("HERE IS THE req", req.file.location);
    const collection = req.app.locals.db.collection("items");
    // req.file is part of multer. It returns all the info of the image(a lot of unnecessary info). 
    // req.file.location gets only the path. But it needs to be key/val pair an object, so put it in {image: xxxx} to make it valid type
    const updateDocument = { 
      $set: {
        image: req.file.location
      } 
    };
    const result = await collection.updateOne({_id: ObjectID(req.params.postId)}, updateDocument);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;