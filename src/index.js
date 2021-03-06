const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const dbName = 'heroku_t9hst58j'
// const dbName = 'todos'
const todoRoutes = express.Router()
let db

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

// app_password123
console.log("*****")
console.log(process.env.MONGODB_URI)
// `${process.env.MONGODB_URI}` ||
// 'mongodb://127.0.0.1:27017/todos'
MongoClient.connect(`${process.env.MONGODB_URI}` || 'mongodb://127.0.0.1:27017/todos', function(err, client) {
    console.log(err)
    assert.equal(null, err);
    console.log('Connected successfully to server')
    db = client.db(dbName)
});

  
app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
   });
app.use('/item', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
   });



app.get('/', (req, res) => {
    console.log("hello from get")
    res.send({express: 'Your BackEnd is connected'});
});

app.post('/item', (req, res) => {
    console.log(req.body)
    const collection = db.collection('todos')
    collection.updateOne({"username": req.body.username}, {$push: {"todos": req.body.todo}})
        .then(res => console.log("added to todolist", res.data))
        .catch(err => console.log(err))
});

app.post('/retrieveItem', (req, res) => {
    console.log("get request from retrieveItem")
    const collection = db.collection('todos')
    var myDoc = collection.find({username:req.body.username,todos:{todo_check: true}}).toArray(function(err, doc) {
         console.log(doc)
         res.send(doc)
     })
})

app.post('/completedList', (req, res) => {
    console.log("post request to completedList")
    const collection = db.collection('todos')
    const myDoc = collection.find({username:req.body.username,todos:{todo_check: true}}).toArray(function(err, doc) {
        console.log(doc);
        res.send(doc)
    })
})

app.post('/complete', (req, res) => {
    const collection = db.collection('todos')
    collection.updateOne({"username": req.body.username,"todos.todo_name": req.body.todo_name}, {$set: {"todos.$.todo_check": true}})
    console.log(req.body.todo_name)
})

app.post('/revert', (req, res) => {
    const collection = db.collection('todos')
    collection.updateOne({"username": req.body.username,"todos.todo_name": req.body.todo_name}, {$set: {"todos.$.todo_check": false}})
    console.log(req.body.todo_name)
})

app.post('/delete', (req, res) => {
    const collection = db.collection('todos')
    collection.updateOne({"username": req.body.username}, {$set: {"todos": req.body.todos}})
        .then(res => console.log("deleted from todolist", res.data))
        .catch(err => console.log(err))
})

app.post('/createUser', (req, res) => {
    const collection = db.collection('todos')
    collection.insertOne(req.body)
        .then(res => console.log(res.ops[0]))
        .catch(err => console.log(err))
})

app.post('/getUser', (req,res) => {
    const collection = db.collection('todos')
    const myDoc = collection.find({"username":req.body.username, "password":req.body.password}).toArray(function(err, doc) {
        console.log(doc);
        res.send((doc));
    })
})

app.post('/checkSignup', (req,res) => {
    const collection = db.collection('todos')
    const myDoc = collection.find({"username":req.body.username}).toArray(function(err, doc) {
        console.log(doc);
        res.send((doc));
    })
})


app.use('/todos', todoRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))