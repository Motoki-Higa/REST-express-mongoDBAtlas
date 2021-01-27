var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

require('dotenv').config()

// ================ mongoDB atlas ==================
// Connection URL
const uri = process.env.DB_CONNECTION;
// Database Name
const dbName = process.env.DB_NAME;
// Create new instance
const client = new MongoClient(uri, { useUnifiedTopology: true });

// Use connect method to connect to the server
// MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   // const db = client.db(dbName);
//   client.close();
// });


// READ : Find Multiple Documents from database
async function run() {
  try {
    await client.connect();
    const database = client.db("sample_mflix");
    const collection = database.collection("movies");
    const cursor = collection.find();

    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    await cursor.forEach(item => {
      console.log(item);
    });
  } finally {
    await client.close();
  }
}
run().catch(console.dir);


// CREATE : Below code adds { name: "Red", town: "kanto" } to "movies"(collection) in "samle_mflix"(database)
// async function run() {
//   try {
//     await client.connect();
//     const database = client.db("sample_mflix");
//     const collection = database.collection("movies");
//     // create a document to be inserted
//     const doc = { name: "Red", town: "kanto" };
//     const result = await collection.insertOne(doc);
//     console.log(
//       `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
//     );
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

// =================================================

// import routes
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middlewares (set routing)
app.use('/', indexRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
