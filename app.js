// jshint esversion:6

// essentials
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _= require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MONGOOSE CONNECT
mongoose.connect("mongodb+srv://<username>:<password>@cluster0.aribk.mongodb.net/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});


// ITEMS SCHEMA - MONGOOSE
const itemSchema = mongoose.Schema({
  name: String,
});

// MONGOOSE MODEL
const Item = mongoose.model("Item", itemSchema);

// MONGO ITEMS
const item1 = new Item({
  name: "Welcome to ToDoList!",
});
// const item2 = new Item({
//   name: "Hit + Button to Add an Item.",
// });
// const item3 = new Item({
//   name: "Click Checkbox to Delete Item.",
// });

// ARRAY (MONGO ITEMS)
const defautItems = [item1];

// LIST SCHEMA
const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

// GET function for home route = mongoDB
app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defautItems, function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Succesfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  });
});


// POST function for home route
app.post("/", function (req, res) {
  const day = date.getDate();
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({ name: itemName });

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
    });
    res.redirect("/" + listName);
  }
});

// POST DELETE
app.post("/delete", function (req, res) {
  const day = date.getDate();
  const checkedItemId = req.body.checkboxId;
  const listName = req.body.listName;

  if (listName === day) {
    Item.deleteOne({ _id: checkedItemId }, function (err) {
      if (!err) {
        console.log("Succesfully deleted.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      // PULL ERROR
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

// EXPRESS ROUTE PARAMETERS = CUSTOM LIST NAME
app.get("/:customListName", function(req, res){

  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: customListName, 
          items: defautItems
        });
        list.save();
        res.redirect("/" + customListName);
      }else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});


// essentials: running server
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
  });
  
  
