var express = require('express');
const { ObjectID } = require('mongodb');
var router = express.Router();

// Basic CRUD operations
// NOTE : retrieve database instance stored in req.app.locals.db

// GET ALL POSTS
router.get('/', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection("parts");
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
    const collection = req.app.locals.db.collection("parts");
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
router.post('/', async (req, res, next) => {
  try {
    const product = req.body.product;
    const price = req.body.price;

    if ( (product === '') || (price === '') ){
      // prevent empty submission in backend in case someone try to hack frontend validation
      console.log('===== product value is empty =====');
    } else {
      // if both fields has value, then store in db
      const collection = req.app.locals.db.collection("parts");
      const result = await collection.insertOne(req.body);

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
    const collection = req.app.locals.db.collection("parts");
    const item = await collection.deleteOne({_id: ObjectID(req.params.postId)});

    console.log(`${item.deletedCount} item was deleted`,);

    res.send({ message: 'Success' });
  } catch(err) {
    res.json({ message: err });
  }
})

// EDIT page (This is just a page for a specific post)
router.get('/edit/:postId', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection("parts");
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
router.post('/edit/:postId', async (req, res, next) => {
  try {
    const collection = req.app.locals.db.collection("parts");
    const uopdateDocument = {$set: req.body};
    const result = await collection.updateOne({_id: ObjectID(req.params.postId)}, uopdateDocument);

    console.log(`${result.modifiedCount} documents were updated with the _id: ${req.params.postId}`,);

    res.redirect('/posts');
  } catch (err) {
    res.json({ message: err});
  }
})

router.post('/search', async (req, res, next) => {
  // res.send('sanity check');

  try {
    const collection = req.app.locals.db.collection("parts");
    collection.createIndex({ product: "text" });
    const query = { $text: { $search: req.body.search } };

    // filter what field of each matched document. 0 = not return, 1 = return
    // read mongoDB drivers documentation for more details
    const projection = {
      _id: 1,
      product: 1,
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

module.exports = router;