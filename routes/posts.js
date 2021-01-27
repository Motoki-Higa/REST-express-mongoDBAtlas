var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('posts', { title: 'posts' });
});


// POST (using req.app.locals)
router.post('/', async (req, res, next) => {
  // retrieve database instance stored in app.locals
  const collection = req.app.locals.database.collection("movies");
  const result = await collection.insertOne(req.body);

  console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,);
})

module.exports = router;