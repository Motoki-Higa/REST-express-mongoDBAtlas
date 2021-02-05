# REST-express-mongoDBAtlas

Simple CRUD REST api app.

__WISHMAN__<br>
It's a wish list app with minimul input fields (ITEM / PRICE / IMAGE).<br>
You can post / edit / update / delete your wish items.

*CSS preprocessor is not used as main purpose of this app to focus on REST api and CRUD operation.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- [Node.js](https://nodejs.org/en/download/)
- [Npm](https://www.npmjs.com/get-npm)
- [Nodemon](https://www.npmjs.com/package/nodemon)

### Built with

#### Main

- [EJS](https://ejs.co/) - Frontend
- [Express.js](https://www.npmjs.com/package/express) - Backend
- [MongoDB native driver](https://www.npmjs.com/package/mongodb) - DB driver
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - DB
- [AWS S3](https://aws.amazon.com/s3/) - FS

#### Key packages (But not limited to below)

- [dotenv](https://www.npmjs.com/package/dotenv)
- [multer](https://www.npmjs.com/package/multer) - used for file upload function
- [multer s3](https://www.npmjs.com/package/multer-s3) - used for file upload function
- [aws-sdk](https://www.npmjs.com/package/aws-sdk) - used for file upload function


### Installing a project

Clone a project to your local (cd /your_directory)

```
git clone https://github.com/Motoki-Higa/REST-express-mongoDBAtlas.git
```

To install dependencies, run this in the application folder from the command-line:

```
npm install
```

### Connecting to DB

Personal mongoDB Atlas is used for the project.
If you like to get the project working, please use your NoSQL database account.

Once your database is set, create a `.env` file and save the connection and the database name like below:

```
DB_CONNECTION=your-connection-name
DB_NAME=your-db-name
```

### Connecting to FS

Personal AWS S3 is used for the project.
If you like to get the project working, please use your own account.

Once your FS is set, get a 'S3_ACCESS_KEY' and 'S3_ACCESS_SECRET' of your bucket, and add it to the `.env` file you created above.

```
S3_ACCESS_KEY=your-key
S3_ACCESS_SECRET=your-secret
```

### Start a project

Run below command after cd into the project.

```
nodemon
```