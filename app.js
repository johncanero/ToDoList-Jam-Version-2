// jshint esversion:6

// essentials
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
// DELETE ARRAY ITEMS

// SET - UP view: EJS
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// PUBLIC > CSS AND IMAGES
app.use(express.static("public"));

// MONGOOSE CONNECT
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// ITEMS SCHEMA - MONGOOSE
const itemsSchema = {
  name: String,
};

// MONGOOSE MODEL
const Item = mongoose.model("Item", itemsSchema);


// MONGO ITEMS
const item1 = new Item({
  name: "Welcome to ToDoList!",
});

const item2 = new Item({
  name: "Tap + Button to Add an Item.",
});

const item3 = new Item({
  name: "Click Checkbox to Delete Item.",
});


// ARRAY (MONGO ITEMS)
const defaultItems = [item1, item2, item3]



// INSERT MANY = MONGOOSE
Item.insertMany(defaultItems, function(err) {
    if(err){
        console.log(err);
      }else{
        console.log("Successfully saved default items to DB.");
      }
});


// GET function for home route = mongoDB
app.get("/", function (req, res) {
  res.render("list", { listTitle: "Today", newListItems: items });
});

// POST function for home route
app.post("/", function (req, res) {
  // console.log(req.body);
  const item = req.body.newItem;

  // pushing work items list (work route)
  if (req.body.list === "Work list") {
    workItems.push(item);
    res.redirect("/work");
    // pushing home route
  } else {
    items.push(item);
    res.redirect("/");
  }
});

// GET function for work route
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work list", newListItems: workItems });
});

// POST function for work route
app.post("/work", function (req, res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

// GET function for about route
app.get("/about", function (req, res) {
  res.render("about");
});

// essentials: running server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
