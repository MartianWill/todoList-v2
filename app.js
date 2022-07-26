const express = require('express');
const bodyParser = require('body-parser');
const https = require('node:https');
const date = require(__dirname + "/date.js");
const { prototype } = require('node:events');
const { urlencoded } = require('body-parser');

//localhost:3000
const port  = 3000;
const app = express();

let listItems = [];
let workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', (req,res) => {
    let day = date.getDay();
    res.render('todolist',{todoTitle: day , newItems: listItems});
});

app.post('/', (req,res) => {
    let newItem = req.body.todo;

    if(req.body.list === "work") {
        workItems.push(newItem);
        res.redirect('/work');
    }else {
        listItems.push(newItem)
        res.redirect("/");
    }
})

app.get('/work', (req,res) => {
    res.render('todolist', {todoTitle: "work", newItems: workItems});
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});



