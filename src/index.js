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
  //  useUnifiedTopology: true
    assert.equal(null, err);

   // useNewUrlParser: true 
    console.log('Connected successfully to server')
    db = client.db(dbName)
  //  client.close();
});

  
app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });




app.get('/', (req, res) => {
    console.log("hello from get")
    res.send({express: 'Your BackEnd is connected'});
});

app.post('/item', (req, res) => {
    //res.send(req.body)
    console.log(req.body)
    const collection = db.collection('todos')
    // collection.insertOne(req.body)
    //     .then(res => console.log(res.ops[0]))
    //     .catch(err => console.log(err))
    collection.updateOne({username: req.body.username}, {$set: {"todos": req.body.todo}})
        .then(res => console.log("added to todolist"))
        .catch(err => console.log(err))
});

app.get('/item', (req, res) => {
    console.log("get request from item")
    const collection = db.collection('todos')
   // console.log(req.body)
    var myDoc = collection.find({username:req.body.username,'todos.todo_check': false}).toArray(function(err, doc) {
         console.log(doc)
         res.send((doc))
     })
})

app.get('/completedList', (req, res) => {
    console.log("get request from completedList")
    const collection = db.collection('todos')
    const myDoc = collection.find({username:req.body.username,todo_check: true}).toArray(function(err, doc) {
        console.log(doc);
        res.send((doc))
    })
})

app.post('/complete', (req, res) => {
    const collection = db.collection('todos')
    collection.updateOne({username: req.body.username,todo_name: req.body.todo_name}, {$set: {todo_check: true}})
    console.log(req.body.todo_name)
})

app.post('/revert', (req, res) => {
    const collection = db.collection('todos')
    collection.updateOne({username: req.body.username,todo_name: req.body.todo_name}, {$set: {todo_check: false}})
})

app.post('/delete', (req, res) => {
    const collection = db.collection('todos')
    collection.remove({username: req.body.username, todo_name: req.body.todo_name})
    console.log(req.body.todo_name, " is now deleted")
})

app.post('/createUser', (req, res) => {
    const collection = db.collection('todos')
    collection.insertOne(req.body)
        .then(res => console.log(res.ops[0]))
        .catch(err => console.log(err))
})

app.post('/getUser', (req,res) => {
    const collection = db.collection('todos')
    //collection.find({username: req.body.username, password: req.body.password})
    const myDoc = collection.find({username:req.body.username, password: req.body.password, todos:{}}).toArray(function(err, doc) {
        console.log(doc);
        res.send((doc));
    })
    // const completeDoc = collection.find({username:req.body.username,todo_check: true}).toArray((err,doc) => {
    //     console.log(doc)
    //     res.send(doc)
    // })
})


// app.get('/getUser', (req, res) => {
//     const collection = db.collection('todos')
//     collection.find({username: req.body.username})
// })

app.use('/todos', todoRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))