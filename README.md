# REST-express-mongoDBAtlas

Simple CRUD REST api app which is connected to mongoDB via mongoDB native driver.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- [Node.js](https://nodejs.org/en/download/)
- [Npm](https://www.npmjs.com/get-npm)
- [Nodemon](https://www.npmjs.com/package/nodemon)

### Built with

#### Main

- Backend - [Express.js](https://www.npmjs.com/package/express)
- DB driver - [MongoDB native driver](https://www.npmjs.com/package/mongodb)
- DB - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### Key packages (But not limited to below)

- [dotenv](https://www.npmjs.com/package/dotenv)

### Installing a project

Clone the project to your local (cd /your_directory)

```
git clone https://github.com/Motoki-Higa/REST-express-mongoDBAtlas.git
```

To install the dependencies, run this in the application folder from the command-line:

```
npm install
```

### Connecting with DB

As it's a personal db account, you might have to prepare your own NoSQL database to get the project working.

Once your database is ready, create a `.env` file and save the connection and the database name like below:

```
DB_CONNECTION=your-connection-name
DB_NAME=your-db-name
```

### Start a project

Run below command after cd into the project.

```
nodemon
```