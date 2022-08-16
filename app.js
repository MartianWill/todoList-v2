
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/*****************************mongoose*****************************/

const password = "";
const userName = "";
const database = "todolistDB";
const options = {useNewUrlParser: true, useUnifiedTopology: true};

const uri = `mongodb+srv://${userName}:${password}@cluster0.nvecimf.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(uri,options);

const itemsSchema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "welcome"
});

const item2 = new Item({
  name:"hit '+' to add more"
});

const item3 = new Item({
  name: "check box to delete"
});

const defaultItems = [item1,item2,item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

// calling out of express will cause delay
// const mongooseFound = [];
// Item.find({}, (err,foundItems) => {
//   if (foundItems.length === 0) {
//     Item.insertMany(defaultItems,err => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("successcully inserteed default items");
//       }
//     });
//     setTimeout(() => {
//       console.log("continue to find");
      
//     }, 3000);
//     Item.find({}, (err,foundItems) => {
//       foundItems.forEach((item,index) => {
//         mongooseFound[index] = item;
//         console.log("found again");
//       });
//     })
//   } else {
//     foundItems.forEach((item,index) => {
//       mongooseFound[index] = item;
//       console.log("found mongoose items");
//     });
//   }
// });


/*****************************main page*****************************/

app.get("/", function(req, res) {

  // const day = date.getDate();
  Item.find({}, (err,foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems,err => {
        if (err) {
          console.log(err);
        } else {
          console.log("successcully inserteed default items");
        }
      });
      res.redirect('/');
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
// day => "Today" to simplify
});

app.get('/:custListName', (req,res) => {
  //params catch from url
  const custListName = _.capitalize(req.params.custListName);
  // find one matched result to prevent adding more existed list
  List.findOne({name: custListName}, (err,foundList) => {
    if(!err) {
      if(!foundList) {
        // console.log("doesn't exist");
        // create a new list
        const list = new List({
          name: custListName,
          items: defaultItems
        });
        list.save();
        res.redirect('/' + custListName);
      } else {
        // console.log("exist");
        // show an existed list
        res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })

});

app.post("/", function(req, res){
  // output { newItem: 'fsd', list: 'Today' }
  console.log("req.body from post method is: " , req.body);
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err,foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);

    })
  }
});

app.post('/delete', (req,res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId,err => {
      if (!err) {
        console.log("checked item removed");
      }
      res.redirect('/')
    })
  } else {
    const query = {name:listName};
    const update = {$pull: {items: {_id: checkedItemId}}}
    List.findOneAndUpdate(query, update,(err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }

})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: "workItems"});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
